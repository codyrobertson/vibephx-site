/**
 * Inference Gate — All LLM calls go through this to enable logging, cost tracking, and rate limiting
 */

import { prisma } from './prisma'

export type InferenceRequest = {
  model: string
  provider: string
  messages: Array<{ role: string; content: string }>
  purpose: string
  userId?: string
  projectId?: string
  sessionId?: string
  maxTokens?: number
  temperature?: number
}

export type InferenceResponse = {
  content: string
  promptTokens?: number
  completionTokens?: number
  totalTokens?: number
  costUsd?: number
  durationMs: number
}

// Approximate cost per 1M tokens (input/output) for common models
const MODEL_COSTS: Record<string, { input: number; output: number }> = {
  'anthropic/claude-3.5-sonnet': { input: 3.0, output: 15.0 },
  'anthropic/claude-3-haiku': { input: 0.25, output: 1.25 },
  'openai/gpt-4o': { input: 2.5, output: 10.0 },
  'openai/gpt-4o-mini': { input: 0.15, output: 0.6 },
  'openai/gpt-3.5-turbo': { input: 0.5, output: 1.5 }
}

function estimateCost(model: string, promptTokens: number, completionTokens: number): number {
  const costs = MODEL_COSTS[model] || { input: 1.0, output: 3.0 }
  return (promptTokens / 1_000_000) * costs.input + (completionTokens / 1_000_000) * costs.output
}

export async function callLLM(request: InferenceRequest): Promise<InferenceResponse> {
  const startTime = Date.now()
  let success = true
  let errorMessage: string | undefined
  let responseContent = ''
  let promptTokens = 0
  let completionTokens = 0
  let totalTokens = 0

  try {
    const res = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
        'X-Title': 'VibePHX PRD Builder',
        ...(process.env.NEXT_PUBLIC_SITE_URL && { 'HTTP-Referer': process.env.NEXT_PUBLIC_SITE_URL })
      },
      body: JSON.stringify({
        model: request.model,
        messages: request.messages,
        stream: false, // Non-streaming for logging; we'll add streaming variant separately
        max_tokens: request.maxTokens || 4096,
        temperature: request.temperature ?? 0.7
      })
    })

    if (!res.ok) {
      const text = await res.text()
      throw new Error(`OpenRouter error: ${res.status} ${text}`)
    }

    const data = await res.json()
    responseContent = data.choices?.[0]?.message?.content || ''
    
    // Extract token usage from response
    promptTokens = data.usage?.prompt_tokens || 0
    completionTokens = data.usage?.completion_tokens || 0
    totalTokens = data.usage?.total_tokens || 0

  } catch (err: any) {
    success = false
    errorMessage = err.message || String(err)
    throw err
  } finally {
    const durationMs = Date.now() - startTime
    const costUsd = estimateCost(request.model, promptTokens, completionTokens)

    // Log to database asynchronously (don't block on this)
    logLLMCall({
      ...request,
      response: responseContent,
      promptTokens,
      completionTokens,
      totalTokens,
      costUsd,
      durationMs,
      success,
      errorMessage
    }).catch(err => console.error('Failed to log LLM call:', err))
  }

  return {
    content: responseContent,
    promptTokens,
    completionTokens,
    totalTokens,
    costUsd: estimateCost(request.model, promptTokens, completionTokens),
    durationMs: Date.now() - startTime
  }
}

async function logLLMCall(data: {
  model: string
  provider: string
  purpose: string
  userId?: string
  projectId?: string
  sessionId?: string
  messages: Array<{ role: string; content: string }>
  response: string
  promptTokens: number
  completionTokens: number
  totalTokens: number
  costUsd: number
  durationMs: number
  success: boolean
  errorMessage?: string
}) {
  try {
    await prisma.lLMLog.create({
      data: {
        userId: data.userId || 'anonymous',
        projectId: data.projectId,
        sessionId: data.sessionId,
        model: data.model,
        provider: data.provider,
        promptTokens: data.promptTokens,
        completionTokens: data.completionTokens,
        totalTokens: data.totalTokens,
        costUsd: data.costUsd,
        purpose: data.purpose,
        prompt: JSON.stringify(data.messages),
        response: data.response,
        durationMs: data.durationMs,
        success: data.success,
        errorMessage: data.errorMessage
      }
    })
  } catch (err) {
    console.error('LLM log write failed:', err)
  }
}

// Streaming variant with logging
export async function streamLLM(
  request: InferenceRequest,
  onChunk: (chunk: string) => void
): Promise<InferenceResponse> {
  const startTime = Date.now()
  let success = true
  let errorMessage: string | undefined
  let fullResponse = ''

  try {
    const res = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
        'X-Title': 'VibePHX PRD Builder',
        ...(process.env.NEXT_PUBLIC_SITE_URL && { 'HTTP-Referer': process.env.NEXT_PUBLIC_SITE_URL })
      },
      body: JSON.stringify({
        model: request.model,
        messages: request.messages,
        stream: true,
        max_tokens: request.maxTokens || 4096,
        temperature: request.temperature ?? 0.7
      })
    })

    if (!res.ok || !res.body) throw new Error(`OpenRouter error: ${res.status}`)

    const reader = res.body.getReader()
    const decoder = new TextDecoder()
    let buffer = ''

    while (true) {
      const { value, done } = await reader.read()
      if (done) break
      
      buffer += decoder.decode(value, { stream: true })
      const lines = buffer.split('\n')
      buffer = lines.pop() || ''

      for (const line of lines) {
        const trimmed = line.trim()
        if (!trimmed.startsWith('data:')) continue
        const payload = trimmed.slice(5).trim()
        if (payload === '[DONE]') continue

        try {
          const json = JSON.parse(payload)
          const content = json?.choices?.[0]?.delta?.content
          if (typeof content === 'string' && content.length > 0) {
            fullResponse += content
            onChunk(content)
          }
        } catch {
          // Ignore malformed SSE lines
        }
      }
    }

    // Estimate tokens (rough: ~0.75 tokens per word)
    const promptText = request.messages.map(m => m.content).join(' ')
    const estimatedPromptTokens = Math.ceil(promptText.split(/\s+/).length * 0.75)
    const estimatedCompletionTokens = Math.ceil(fullResponse.split(/\s+/).length * 0.75)
    const estimatedTotalTokens = estimatedPromptTokens + estimatedCompletionTokens

    const durationMs = Date.now() - startTime
    const costUsd = estimateCost(request.model, estimatedPromptTokens, estimatedCompletionTokens)

    // Log async
    logLLMCall({
      ...request,
      response: fullResponse,
      promptTokens: estimatedPromptTokens,
      completionTokens: estimatedCompletionTokens,
      totalTokens: estimatedTotalTokens,
      costUsd,
      durationMs,
      success: true,
      errorMessage: undefined
    }).catch(console.error)

    return {
      content: fullResponse,
      promptTokens: estimatedPromptTokens,
      completionTokens: estimatedCompletionTokens,
      totalTokens: estimatedTotalTokens,
      costUsd,
      durationMs
    }

  } catch (err: any) {
    success = false
    errorMessage = err.message || String(err)
    
    const durationMs = Date.now() - startTime
    logLLMCall({
      ...request,
      response: '',
      promptTokens: 0,
      completionTokens: 0,
      totalTokens: 0,
      costUsd: 0,
      durationMs,
      success: false,
      errorMessage
    }).catch(console.error)

    throw err
  }
}

