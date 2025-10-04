import { NextRequest, NextResponse } from 'next/server'
import { callLLM, streamLLM } from '@/lib/inference-gate'
import { stackServerApp } from '@/stack'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

/**
 * Gated LLM inference endpoint
 * All AI calls go through this for logging and cost tracking
 */
export async function POST(req: NextRequest) {
  try {
    const user = await stackServerApp.getUser()
    const userId = user?.id || 'anonymous'

    const body = await req.json()
    const {
      model = 'anthropic/claude-3.5-sonnet',
      provider = 'openrouter',
      messages,
      purpose,
      projectId,
      sessionId,
      stream = false,
      maxTokens,
      temperature
    } = body

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json({ error: 'messages required' }, { status: 400 })
    }

    if (stream) {
      // Streaming response
      const encoder = new TextEncoder()
      const customReadable = new ReadableStream({
        start: async (controller) => {
          try {
            await streamLLM(
              {
                model,
                provider,
                messages,
                purpose: purpose || 'general',
                userId,
                projectId,
                sessionId,
                maxTokens,
                temperature
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
    } else {
      // Non-streaming response
      const result = await callLLM({
        model,
        provider,
        messages,
        purpose: purpose || 'general',
        userId,
        projectId,
        sessionId,
        maxTokens,
        temperature
      })

      return NextResponse.json({
        content: result.content,
        usage: {
          promptTokens: result.promptTokens,
          completionTokens: result.completionTokens,
          totalTokens: result.totalTokens
        },
        cost: result.costUsd,
        durationMs: result.durationMs
      })
    }
  } catch (error: any) {
    console.error('Inference error:', error)
    return NextResponse.json(
      { error: error.message || 'Inference failed' },
      { status: 500 }
    )
  }
}
