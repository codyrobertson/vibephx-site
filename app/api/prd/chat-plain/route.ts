import { NextRequest } from 'next/server'

export const runtime = 'edge'

type PlainMessage = {
  role: 'user' | 'assistant' | 'system'
  content: string
}

function getOpenRouterHeaders(): HeadersInit {
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY ?? ''}`,
    'X-Title': 'VibePHX PRD Builder',
  }
  const referer = process.env.NEXT_PUBLIC_SITE_URL
  if (referer) headers['HTTP-Referer'] = referer
  return headers
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const messages: PlainMessage[] = Array.isArray(body?.messages) ? body.messages : []

    const upstream = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: getOpenRouterHeaders(),
      body: JSON.stringify({
        // Use a stronger model via OpenRouter
        model: 'anthropic/claude-4.5-sonnet',
        stream: true,
        messages: messages.slice(-20), // Limit context to last 20 messages to prevent timeout
        temperature: 0.7,
        max_tokens: 4096, // Reduced from 10000 to prevent timeout
      }),
    })

    if (!upstream.ok || !upstream.body) {
      const text = await upstream.text().catch(() => '')
      return new Response(text || 'Upstream error', { status: upstream.status })
    }

    const encoder = new TextEncoder()
    const decoder = new TextDecoder()

    const stream = new ReadableStream<Uint8Array>({
      start: async (controller) => {
        const reader = upstream.body!.getReader()
        let buffer = ''
        try {
          while (true) {
            const { value, done } = await reader.read()
            if (done) break
            buffer += decoder.decode(value, { stream: true })

            const lines = buffer.split('\n')
            // keep last partial line in buffer
            buffer = lines.pop() ?? ''

            for (const line of lines) {
              const trimmed = line.trim()
              if (!trimmed.startsWith('data:')) continue
              const payload = trimmed.slice(5).trim()
              if (payload === '[DONE]') {
                controller.close()
                return
              }
              try {
                const json = JSON.parse(payload)
                const content = json?.choices?.[0]?.delta?.content
                if (typeof content === 'string' && content.length > 0) {
                  controller.enqueue(encoder.encode(content))
                }
              } catch {
                // ignore malformed sse lines
              }
            }
          }

          // flush any remaining buffered text if present and parsable
          if (buffer) {
            try {
              const json = JSON.parse(buffer.replace(/^data:\s*/, ''))
              const content = json?.choices?.[0]?.delta?.content
              if (typeof content === 'string' && content.length > 0) {
                controller.enqueue(encoder.encode(content))
              }
            } catch {}
          }

          controller.close()
        } catch (err: any) {
          controller.error(err)
        }
      },
    })

    return new Response(stream, {
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        'Cache-Control': 'no-cache',
      },
    })
  } catch (error: any) {
    return new Response(
      JSON.stringify({ error: { message: error?.message ?? 'Unknown error' } }),
      { status: 500, headers: { 'Content-Type': 'application/json' } },
    )
  }
}


