import { createOpenAI } from '@ai-sdk/openai'
import { streamText, convertToModelMessages } from 'ai'
import { stackServerApp } from '@/stack'

export const runtime = 'nodejs'

const openrouter = createOpenAI({
  apiKey: process.env.OPENROUTER_API_KEY,
  baseURL: 'https://openrouter.ai/api/v1',
})

export async function POST(req: Request) {
  const body = await req.json()
  const messages = body.messages || []

  await stackServerApp.getUser()

  const result = streamText({
    model: openrouter('anthropic/claude-4.5-sonnet'),
    messages: convertToModelMessages(messages),
    system: `You are a helpful AI assistant in a Product Requirements Document (PRD) builder.

When users ask you to generate documents, guides, tutorials, or technical specs:
1. Create comprehensive, well-structured Markdown content
2. Use proper headers (# ## ###), code blocks, and formatting
3. Be thorough and actionable
4. Include code examples where relevant

Be conversational, helpful, and proactive in providing detailed responses.`
  })

  return result.toUIMessageStreamResponse({
    originalMessages: messages
  })
}
