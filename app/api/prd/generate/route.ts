import { NextRequest } from 'next/server'
import { PRDFormData, generatePRDMarkdown } from '@/lib/prd-templates'

const AI_ENHANCEMENT_PROMPTS = {
  problemStatement: (projectName: string, projectType: string) => `
You are a product strategist. For a ${projectType} called "${projectName}", suggest 3 specific, measurable problem statements that this type of product typically solves. Each should be 1-2 sentences and focus on user pain points.

Format as a numbered list.
`,

  goals: (problemStatement: string, projectType: string) => `
Based on this problem: "${problemStatement}"

Suggest 3 SMART goals for a ${projectType} that directly address this problem. Each goal should be Specific, Measurable, Achievable, Relevant, and Time-bound.

Format as a numbered list.
`,

  features: (projectType: string, goals: string[]) => `
For a ${projectType} with these goals:
${goals.map((g, i) => `${i + 1}. ${g}`).join('\n')}

Suggest 5 core features (must-have) and 3 nice-to-have features that would help achieve these goals. For each feature, include:
- Feature name
- User action (what the user does)
- Priority (1-3 for core features)

Format as:
## Core Features
1. **Feature Name** (Priority: X)
   - User Action: description

## Nice-to-Have
1. **Feature Name**
   - User Action: description
`,

  dataArchitecture: (features: string, projectType: string) => `
For a ${projectType} with these features:
${features}

Suggest:
1. What data sources are needed?
2. How should each data type be stored?
3. What's the data flow from input to output?

Be specific and practical for a rapid prototype.
`,

  techStack: (projectType: string, features: string, dataNeeds: string) => `
For a ${projectType} with these features: ${features}
Data needs: ${dataNeeds}

Recommend a modern, beginner-friendly tech stack including:
- Frontend framework
- Backend approach
- Database choice
- Deployment platform

Explain why each choice is appropriate for rapid development (6-8 hours).
`
}

export async function POST(req: NextRequest) {
  try {
    const { formData, enhancementType, context } = await req.json()

    // If requesting AI enhancement for a specific field
    if (enhancementType) {
      const prompt = generateEnhancementPrompt(enhancementType, context)
      const suggestion = await getAISuggestion(prompt)
      return Response.json({ suggestion })
    }

    // Otherwise, validate and generate full PRD
    const validatedData = validatePRDFormData(formData)
    if (!validatedData.valid) {
      return Response.json(
        { error: 'Invalid form data', details: validatedData.errors },
        { status: 400 }
      )
    }

    // Generate PRD markdown
    const prdMarkdown = generatePRDMarkdown(formData as PRDFormData)

    return Response.json({
      prd: prdMarkdown,
      formData: formData
    })
  } catch (error) {
    console.error('PRD generation error:', error)
    return Response.json(
      { error: 'Failed to generate PRD' },
      { status: 500 }
    )
  }
}

function generateEnhancementPrompt(type: string, context: any): string {
  switch (type) {
    case 'problemStatement':
      return AI_ENHANCEMENT_PROMPTS.problemStatement(
        context.projectName || 'this product',
        context.projectType || 'application'
      )
    case 'goals':
      return AI_ENHANCEMENT_PROMPTS.goals(
        context.problemStatement || 'unspecified problem',
        context.projectType || 'application'
      )
    case 'features':
      return AI_ENHANCEMENT_PROMPTS.features(
        context.projectType || 'application',
        context.goals || []
      )
    case 'dataArchitecture':
      return AI_ENHANCEMENT_PROMPTS.dataArchitecture(
        context.features || 'unspecified features',
        context.projectType || 'application'
      )
    case 'techStack':
      return AI_ENHANCEMENT_PROMPTS.techStack(
        context.projectType || 'application',
        context.features || 'unspecified features',
        context.dataNeeds || 'unspecified data needs'
      )
    default:
      return 'Provide helpful suggestions for this product.'
  }
}

async function getAISuggestion(prompt: string): Promise<string> {
  try {
    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
        'HTTP-Referer': process.env.OPENROUTER_SITE_URL || 'http://localhost:3006',
        'X-Title': process.env.OPENROUTER_SITE_NAME || 'VibePHX PRD Builder',
      },
      body: JSON.stringify({
        model: 'openai/gpt-4o-mini',
        messages: [
          {
            role: 'user',
            content: prompt
          }
        ],
        max_tokens: 500
      })
    })

    if (!response.ok) {
      throw new Error(`OpenRouter API error: ${response.status}`)
    }

    const data = await response.json()
    return data.choices[0]?.message?.content || 'No suggestion available'
  } catch (error) {
    console.error('AI suggestion error:', error)
    return 'Unable to generate suggestion at this time.'
  }
}

function validatePRDFormData(data: any): { valid: boolean; errors?: string[] } {
  const errors: string[] = []

  if (!data.projectName?.trim()) errors.push('Project name is required')
  if (!data.projectType) errors.push('Project type is required')
  if (!data.targetUsers?.trim()) errors.push('Target users is required')
  if (!data.problemStatement?.trim()) errors.push('Problem statement is required')
  if (!data.whyBuild?.trim()) errors.push('Why build this is required')
  if (!data.successMetric?.trim()) errors.push('Success metric is required')
  if (!data.goals || data.goals.length === 0) errors.push('At least one goal is required')
  if (!data.dataSources || data.dataSources.length === 0) errors.push('At least one data source is required')
  if (!data.coreFeatures || data.coreFeatures.length === 0) errors.push('At least one core feature is required')
  if (!data.frontend) errors.push('Frontend choice is required')
  if (!data.backend) errors.push('Backend choice is required')
  if (!data.database) errors.push('Database choice is required')
  if (!data.deployment) errors.push('Deployment platform is required')

  return { valid: errors.length === 0, errors: errors.length > 0 ? errors : undefined }
}

export const runtime = 'edge'
