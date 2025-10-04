import { getTechDetail } from '@/lib/config/tech-stack-details'
import { callLLM } from '@/lib/inference-gate'

interface BespokeTechDetail {
  whyWeChoseIt: string
  howItsUsed: string[]
  keyImplementationAreas: string[]
  projectBenefits: string[]
}

interface TechStackDetailsCache {
  [techId: string]: BespokeTechDetail
}

/**
 * Generate bespoke tech details for a single technology
 */
async function generateTechDetail(
  techName: string,
  projectContext: {
    sda?: string
    initialIntent?: string
    audience?: string
    motivation?: string
    featuresMvp?: string[]
    selectedStack?: string
    dbChoice?: string
    integrations?: string[]
  },
  userId?: string,
  projectId?: string
): Promise<BespokeTechDetail | null> {
  const genericTech = getTechDetail(techName)
  if (!genericTech) return null

  try {
    const prompt = `You are a technical documentation expert helping developers understand how technologies fit into THEIR specific project.

**Project Context:**
- **Project**: ${projectContext.sda || projectContext.initialIntent}
- **Target Users**: ${projectContext.audience || 'General users'}
- **Motivation**: ${projectContext.motivation || 'Build quickly'}
- **MVP Features**: ${projectContext.featuresMvp?.join(', ') || 'Core features'}
- **Tech Stack**: ${projectContext.selectedStack || 'Modern web stack'}
- **Database**: ${projectContext.dbChoice || 'Not specified'}
- **Integrations**: ${projectContext.integrations?.join(', ') || 'None yet'}

**Technology to Explain**: ${genericTech.name}
**Generic Description**: ${genericTech.whatItIs}

Generate a **project-specific** explanation with these sections:

1. **Why We Chose It** (1-2 sentences, max 25 words)
   - Direct, specific reason for THIS project only

2. **How It's Used in Your Codebase** (3-4 short bullet points)
   - Keep EACH bullet under 12 words
   - Be SPECIFIC to this project's features
   - Reference actual MVP features

3. **Key Implementation Areas** (2-3 short bullet points)
   - Keep EACH bullet under 10 words
   - Specific areas only, no fluff
   - Example: "PDF upload API routes"

4. **Project-Specific Benefits** (2-3 short bullet points)
   - Keep EACH bullet under 12 words
   - Direct benefits only
   - Focus on concrete outcomes

Return ONLY a JSON object with this structure:
{
  "whyWeChoseIt": "string",
  "howItsUsed": ["string", "string", ...],
  "keyImplementationAreas": ["string", "string", ...],
  "projectBenefits": ["string", "string", ...]
}

CRITICAL: Be concise, practical, and ALWAYS reference specific aspects of the project.
- NO fluff or generic statements
- Every word must add value
- Maximum brevity while staying specific`

    const result = await callLLM({
      model: 'gpt-4o-mini',  // More reliable model for consistent JSON
      provider: 'openrouter',
      messages: [
        {
          role: 'user',
          content: prompt
        }
      ],
      purpose: 'tech_stack_details',
      userId: userId || 'system',
      projectId,
      maxTokens: 1200,  // Increased for complete responses
      temperature: 0.5  // Balanced for creativity and consistency
    })

    // Parse the AI response
    // Strip markdown code blocks if present
    let cleanedContent = result.content.trim()
    if (cleanedContent.startsWith('```json')) {
      cleanedContent = cleanedContent.replace(/^```json\s*/, '').replace(/\s*```$/, '')
    } else if (cleanedContent.startsWith('```')) {
      cleanedContent = cleanedContent.replace(/^```\s*/, '').replace(/\s*```$/, '')
    }

    // Validate that we have content before parsing
    if (!cleanedContent || cleanedContent.length < 10) {
      return null
    }

    // Check if response looks like valid JSON before parsing
    if (!cleanedContent.startsWith('{') || !cleanedContent.endsWith('}')) {
      return null
    }

    try {
      const bespokeDetails = JSON.parse(cleanedContent)

      // Validate the structure
      if (!bespokeDetails.whyWeChoseIt || !bespokeDetails.howItsUsed ||
          !bespokeDetails.keyImplementationAreas || !bespokeDetails.projectBenefits) {
        return null
      }

      return bespokeDetails
    } catch (parseError) {
      return null
    }
  } catch (error) {
    console.error(`Failed to generate tech details for ${techName}:`, error)
    return null
  }
}

/**
 * Generate tech details for all technologies in the stack
 * This runs in the background when PRD is completed
 */
export async function generateAllTechDetails(
  sessionData: {
    sda?: string
    initialIntent?: string
    audience?: string
    motivation?: string
    featuresMvp?: string[]
    selectedStack?: string
    dbChoice?: string
    integrations?: string[]
  },
  userId?: string,
  projectId?: string
): Promise<TechStackDetailsCache> {
  const cache: TechStackDetailsCache = {}

  // Parse all technologies from the session
  const allTechs = new Set<string>()

  // Parse selected stack (format: "V0 • Shadcn UI • Vercel")
  if (sessionData.selectedStack) {
    sessionData.selectedStack.split('•').forEach(tech => {
      const trimmed = tech.trim()
      if (trimmed) allTechs.add(trimmed)
    })
  }

  // Add database if not already in stack
  if (sessionData.dbChoice && !Array.from(allTechs).some(t =>
    t.toLowerCase().includes(sessionData.dbChoice!.toLowerCase())
  )) {
    allTechs.add(sessionData.dbChoice)
  }

  // Add integrations
  if (sessionData.integrations) {
    sessionData.integrations.forEach(integration => {
      allTechs.add(integration)
    })
  }

  // Generate details for each tech in parallel
  const promises = Array.from(allTechs).map(async techName => {
    const details = await generateTechDetail(techName, sessionData, userId, projectId)
    if (details) {
      // Use lowercase tech ID for consistency
      cache[techName.toLowerCase()] = details
    }
  })

  await Promise.all(promises)

  return cache
}
