// app/api/prd/generate-enriched/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { streamLLM } from '@/lib/inference-gate'
import { stackServerApp } from '@/stack'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function GET() {
  return NextResponse.json({ status: 'ok', message: 'enriched live', ts: Date.now() })
}

export async function POST(req: NextRequest) {
  const user = await stackServerApp.getUser().catch(() => null)
  const userId = user?.id ?? 'anonymous'

  let body: any = {}
  try { body = await req.json() } catch {}

  const { projectName = 'Untitled Project', audience = 'General users', motivation = 'Ship quickly', features = [], stack, database, integrations = [], projectId, sessionId } = body

  // Step 1: optional web search
  let searchContext = ''
  try {
    if (process.env.EXA_API_KEY) {
      const q = `${projectName} MVP best practices product requirements ${(features as string[]).slice(0,3).join(' ')} architecture patterns`
      const ex = await fetch('https://api.exa.ai/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-api-key': process.env.EXA_API_KEY },
        body: JSON.stringify({ query: q, numResults: 5, useAutoprompt: true, contents: { text: true } })
      })
      if (ex.ok) {
        const data = await ex.json()
        const results = (data?.results ?? []).slice(0,5)
        searchContext = results.map((r: any) => `**Source:** ${r.title} (${r.url})\n${(r.text||'').slice(0,600)}`).join('\n\n---\n\n').slice(0,4000)
      }
    }
  } catch {}

  // Step 2: prompt
  const prompt = `You are a brutally pragmatic product coach + senior architect writing a ONE-DAY MVP PRD.

${searchContext ? `**🔍 Industry Research & Best Practices**\n${searchContext}\n\n---\n` : ''}

**Project Context**
- Project: ${projectName}
- Target Users: ${audience}
- Why Now: ${motivation}
- MVP Features: ${(features as string[]).join(', ') || '—'}
- Tech Stack: ${stack || 'Modern web (Next.js on Vercel)'}
- Database: ${database || 'Postgres'}
- Integrations: ${(integrations as string[]).join(', ') || 'None'}

**Instructions**
1) Be concrete about data collection, API design, validation, and integration points.
2) Use GitHub-flavored Markdown with headers, code blocks, and checklists.
3) Keep it shippable in one day.

# ${projectName} — MVP PRD
## 1. Summary
## 2. Goals / Non-Goals
## 3. User Stories
## 4. MVP Scope
## 5. Out of Scope
## 6. Acceptance Criteria
## 7. Data Model & API Design
## 8. Data & Integration Strategy
## 9. Implementation Guide (time-boxed steps)
## 10. Risks & Mitigations
## 11. Success Metrics & Post-MVP Roadmap
`

  const encoder = new TextEncoder()
  const readable = new ReadableStream({
    start: async (controller) => {
      try {
        await streamLLM(
          {
            model: 'anthropic/claude-4.5-sonnet',
            provider: 'openrouter',
            messages: [{ role: 'user', content: prompt }],
            purpose: 'generate_enriched_prd',
            userId, projectId, sessionId,
            maxTokens: 4096, temperature: 0.6
          },
          (chunk) => controller.enqueue(encoder.encode(chunk))
        )
        controller.close()
      } catch (err) {
        controller.error(err)
      }
    }
  })

  return new Response(readable, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'no-cache, no-transform'
    }
  })
}
