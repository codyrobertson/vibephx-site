// app/api/prd/inference/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { callLLM, streamLLM } from '@/lib/inference-gate'
import { stackServerApp } from '@/stack'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

// Health
export async function GET() {
  return NextResponse.json({ status: 'ok', message: 'inference live', ts: Date.now() })
}

export async function POST(req: NextRequest) {
  try {
    const user = await stackServerApp.getUser().catch(() => null)
    const userId = user?.id ?? 'anonymous'

    // tolerate empty body
    let body: any = {}
    try { body = await req.json() } catch {}

    const {
      model = 'anthropic/claude-4.5-sonnet',
      provider = 'openrouter',
      messages = [],
      purpose = 'general',
      projectId,
      sessionId,
      stream = true,
      maxTokens,
      temperature
    } = body

    if (!Array.isArray(messages) || messages.length === 0) {
      return NextResponse.json({ error: 'messages required (array)' }, { status: 400 })
    }

    if (!stream) {
      const r = await callLLM({ model, provider, messages, purpose, userId, projectId, sessionId, maxTokens, temperature })
      return NextResponse.json({ content: r.content, usage: { promptTokens: r.promptTokens, completionTokens: r.completionTokens, totalTokens: r.totalTokens }, cost: r.costUsd, durationMs: r.durationMs })
    }

    const encoder = new TextEncoder()
    const readable = new ReadableStream({
      start: async (controller) => {
        try {
          await streamLLM(
            { model, provider, messages, purpose, userId, projectId, sessionId, maxTokens, temperature },
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
  } catch (err: any) {
    return NextResponse.json({ error: err?.message ?? 'inference failed' }, { status: 500 })
  }
}
