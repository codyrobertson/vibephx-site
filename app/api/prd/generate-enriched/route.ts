import { NextRequest, NextResponse } from 'next/server'
import { streamLLM } from '@/lib/inference-gate'
import { stackServerApp } from '@/stack'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

// GET handler to verify route exists
export async function GET() {
  return NextResponse.json({
    message: 'Generate enriched endpoint is active. Use POST to make requests.',
    methods: ['POST']
  })
}

/**
 * Enriched PRD generation with web search
 * Searches for best practices and examples before generating
 */
export async function POST(req: NextRequest) {
  try {
    const user = await stackServerApp.getUser()
    const userId = user?.id || 'anonymous'

    const body = await req.json()
    const {
      projectName,
      audience,
      motivation,
      features,
      stack,
      database,
      integrations,
      projectId,
      sessionId
    } = body

    // Step 1: Web search for relevant best practices
    let searchContext = ''
    try {
      const searchQuery = `${projectName} MVP best practices product requirements ${features?.slice(0, 3).join(' ')} architecture patterns`

      const exaRes = await fetch('https://api.exa.ai/search', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': process.env.EXA_API_KEY || 'fa45a7ae-6cf1-450e-a7da-9ee28c2bb7fe'
        },
        body: JSON.stringify({
          query: searchQuery,
          numResults: 5,
          useAutoprompt: true,
          contents: {
            text: true
          }
        })
      })

      if (exaRes.ok) {
        const searchData = await exaRes.json()
        const results = searchData.results || []
        searchContext = results
          .map((r: any) => `Source: ${r.title} (${r.url})\n${r.text || ''}`)
          .join('\n\n---\n\n')
          .substring(0, 4000) // Limit context size
      }
    } catch (err) {
      console.error('Web search failed, continuing without enrichment:', err)
    }

    // Step 2: Generate enriched PRD with search context
    const enrichedPrompt = `You are a brutally pragmatic product coach and senior technical architect writing an MVP PRD for a BEGINNER developer to ship in ONE DAY.

${searchContext ? `**🔍 Industry Research & Best Practices:**\n\n${searchContext}\n\n---\n\n` : ''}

**📋 Project Context:**
- **Project**: ${projectName}
- **Target Users**: ${audience}
- **Why Now**: ${motivation}
- **MVP Features**: ${features?.join(', ')}
- **Tech Stack**: ${stack || 'Modern web stack'}
- **Database**: ${database || 'Not specified'}
- **Integrations**: ${integrations?.join(', ') || 'None'}

**🎯 CRITICAL INSTRUCTIONS:**
${searchContext ? '1. **USE THE RESEARCH ABOVE** - Reference specific best practices, patterns, and examples from the industry research\n2. Ground recommendations in real-world examples and proven patterns' : '1. Be practical and actionable'}
3. Be SPECIFIC about data collection, integration strategies, and implementation details
4. Include methodical, step-by-step implementation guidance
5. Keep language concise, actionable, and beginner-friendly
6. Use proper GitHub-flavored Markdown formatting with code blocks

Generate a comprehensive ~1800-word PRD with the following structure:

**Required Structure:**

# ${projectName} - MVP PRD

## 1. Executive Summary
One concise paragraph (3-4 sentences) capturing the core idea, who it's for, and the primary value.

## 2. Goals and Non-Goals

### Goals
- Bullet list of 3-4 SMART goals (specific, measurable, achievable in 1 day)

### Non-Goals
- Bullet list of 3-4 things explicitly OUT of MVP scope

## 3. User Stories
Write 6-8 user stories in format:
- As a [persona], I want to [action] so that [value/outcome]

## 4. MVP Scope
Bullet list of features included in TODAY's build. Keep brutally minimal.

## 5. Out of Scope
Bullet list of features deferred to future iterations.

## 6. Acceptance Criteria
Numbered list (8-12 items) with clear done/not-done criteria:
1. Specific, testable requirement
2. Another specific requirement
...

## 7. Data Model & API Design

### Core Entities
Present key entities in simple code-block format:
\`\`\`
Entity {
  field: type
  field: type
}
\`\`\`

### API Endpoints
List essential API routes:
- \`GET /api/[resource]\` - Fetch data
- \`POST /api/[resource]\` - Create new
- \`PUT /api/[resource]/[id]\` - Update existing
- \`DELETE /api/[resource]/[id]\` - Remove

### Validation Rules
- Required fields for each entity
- Data type constraints
- Business logic validations

## 8. Data & Integration Strategy

### Data Collection Requirements
Be SPECIFIC about what data you need and why:
- **User Input Data**: Forms, interactions, preferences (list specific fields)
- **System-Generated Data**: Timestamps, IDs, session tokens, audit logs
- **External Data**: ${integrations && integrations.length > 0 ? `From ${integrations.join(', ')} - specify what data flows in` : 'None for MVP'}

### Data Flow Architecture
1. **Input Sources** → Where data enters (forms, API calls, webhooks)
2. **Validation Layer** → How data is validated (Zod schemas, type checking)
3. **Processing** → Business logic transformations
4. **Storage** → ${database || 'Database'} persistence with specific table/collection names
5. **Output Layer** → How data is fetched and displayed to users

### Integration Implementation
${integrations && integrations.length > 0
  ? `**Integrations to implement: ${integrations.join(', ')}**

For each integration:
- Authentication flow (OAuth, API keys, etc.)
- API endpoint configuration and rate limiting
- Webhook handlers (if applicable)
- Error handling and retry logic
- Fallback strategies when external service is down`
  : 'No external integrations for MVP - defer to post-launch'}

## 9. Implementation Guide

### Tech Stack Rationale
- **Primary Stack**: ${stack || 'Modern web stack'}
- **Database**: ${database || 'TBD'} - why this choice fits the use case
- **Key Technologies**: ${stack?.split('•').map((s: string) => s.trim()).join(', ') || 'TBD'}
- **Deployment Platform**: ${stack?.includes('Vercel') ? 'Vercel (zero-config deployment)' : 'Platform TBD'}

### Recommended File Structure
\`\`\`
/
├── app/
│   ├── api/          # API routes for backend logic
│   ├── (auth)/       # Auth-protected routes
│   └── page.tsx      # Landing page
├── components/
│   ├── ui/           # Reusable UI components
│   └── features/     # Feature-specific components
├── lib/
│   ├── db/           # Database client & queries
│   ├── api/          # API client functions
│   └── utils/        # Helper functions
├── prisma/
│   └── schema.prisma # Database schema
└── public/           # Static assets
\`\`\`

### Environment Configuration
Create \`.env.local\` with:
\`\`\`bash
# Database
DATABASE_URL="postgresql://..."

# Authentication
${integrations?.includes('Clerk') || integrations?.includes('Auth0') ? 'AUTH_SECRET="..."' : '# Add auth secrets here'}

# Integrations
${integrations?.map((i: string) => `${i.toUpperCase()}_API_KEY="..."`).join('\n') || '# Add API keys here'}
\`\`\`

### Step-by-Step Development Workflow
1. **Database Setup** (30 min)
   - Define Prisma schema
   - Run migrations
   - Seed initial data

2. **API Layer** (2 hours)
   - Create CRUD endpoints
   - Add validation with Zod
   - Implement error handling

3. **UI Components** (3 hours)
   - Build form components
   - Create data display views
   - Add loading/error states

4. **Integration & Testing** (2 hours)
   - Connect frontend to backend
   - Test user flows end-to-end
   - Fix bugs and edge cases

5. **Deploy** (30 min)
   - Push to ${stack?.includes('Vercel') ? 'Vercel' : 'production'}
   - Verify environment variables
   - Test production build

## 10. Risks & Mitigation Strategies

### Technical Risks
- **Risk 1**: [Specific technical concern] → **Mitigation**: [Specific solution]
- **Risk 2**: [Another concern] → **Mitigation**: [How to address it]
- **Risk 3**: [Third risk] → **Mitigation**: [Prevention strategy]

### Timeline Risks
- **Scope Creep**: Features expanding beyond MVP → **Mitigation**: Strict adherence to acceptance criteria
- **Technical Blockers**: Getting stuck on implementation → **Mitigation**: Use proven libraries, avoid custom solutions

### User Experience Risks
- **Complexity**: UI too complicated for target users → **Mitigation**: User test with 2-3 people before launch
- **Performance**: Slow load times → **Mitigation**: Use static generation where possible

## 11. Success Metrics & Next Steps

### Day 1 Launch Criteria
✅ All acceptance criteria met
✅ Core user flow works end-to-end
✅ No critical bugs
✅ Deployed to production with monitoring

### Week 1 Metrics to Track
1. **User Adoption**: [Specific metric, e.g., "10 sign-ups"]
2. **Engagement**: [e.g., "5 users complete core action"]
3. **Performance**: [e.g., "Page load under 2s"]
4. **Error Rate**: [e.g., "< 1% error rate"]

### Post-MVP Roadmap
**Immediate Next Steps** (Week 2-4):
1. [Deferred feature 1 from "Out of Scope"]
2. [Deferred feature 2]
3. [User feedback integration]

**Future Enhancements** (Month 2+):
- [Stretch feature 1]
- [Stretch feature 2]
- [Scaling considerations]

---

**🎯 Remember**: This is an MVP designed for a ONE DAY build. Ship fast, learn from users, iterate based on real feedback. Perfect is the enemy of done.`

    // Step 3: Stream the enriched PRD
    const encoder = new TextEncoder()
    const customReadable = new ReadableStream({
      start: async (controller) => {
        try {
          await streamLLM(
            {
              model: 'anthropic/claude-3.5-sonnet',
              provider: 'openrouter',
              messages: [{ role: 'user', content: enrichedPrompt }],
              purpose: 'generate_enriched_prd',
              userId,
              projectId,
              sessionId,
              maxTokens: 4096,
              temperature: 0.7
            },
            (chunk) => {
              controller.enqueue(encoder.encode(chunk))
            }
          )
          controller.close()
        } catch (err: any) {
          controller.error(err)
        }
      }
    })

    return new Response(customReadable, {
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        'Cache-Control': 'no-cache'
      }
    })
  } catch (error: any) {
    console.error('Enriched PRD generation error:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to generate enriched PRD' },
      { status: 500 }
    )
  }
}
