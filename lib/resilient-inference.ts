/**
 * Bulletproof LLM inference client with streaming fallback
 * Tries streaming first, falls back to non-stream if it fails
 */

export interface InferenceMessage {
  role: 'user' | 'assistant'
  content: string
}

export interface InferenceResult {
  content: string
  streamed: boolean
}

export async function callInference(
  messages: InferenceMessage[],
  options?: {
    purpose?: string
    projectId?: string
    sessionId?: string
    onChunk?: (chunk: string) => void
  }
): Promise<InferenceResult> {
  // Always include content-type; avoid caching
  const baseReq = {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    cache: 'no-store' as RequestCache,
  }

  // 1) Try streaming first
  try {
    const res = await fetch('/api/prd/inference', {
      ...baseReq,
      body: JSON.stringify({
        messages,
        stream: true,
        purpose: options?.purpose,
        projectId: options?.projectId,
        sessionId: options?.sessionId
      }),
    })

    if (!res.ok || !res.body) {
      throw new Error(`stream http ${res.status}`)
    }

    const reader = res.body.getReader()
    const decoder = new TextDecoder()
    let text = ''

    while (true) {
      const { done, value } = await reader.read()
      if (done) break
      const chunk = decoder.decode(value, { stream: true })
      text += chunk
      // optional: update UI incrementally
      if (options?.onChunk) {
        options.onChunk(text)
      }
    }
    return { content: text, streamed: true }
  } catch (err) {
    console.warn('[Inference] stream failed, falling back to non-stream:', err)
  }

  // 2) Fallback to non-stream
  const res2 = await fetch('/api/prd/inference', {
    ...baseReq,
    body: JSON.stringify({
      messages,
      stream: false,
      purpose: options?.purpose,
      projectId: options?.projectId,
      sessionId: options?.sessionId
    }),
  })

  if (!res2.ok) {
    const t = await res2.text().catch(() => '')
    throw new Error(`non-stream http ${res2.status} ${t}`)
  }
  const data = await res2.json()
  return { content: data.content ?? '', streamed: false }
}
