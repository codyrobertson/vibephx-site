import { createOpenAI } from '@ai-sdk/openai'
import { streamText, tool, convertToModelMessages } from 'ai'
import { z } from 'zod'
import { stackServerApp } from '@/stack'
import { prisma } from '@/lib/prisma'

export const runtime = 'nodejs'

const openrouter = createOpenAI({
  apiKey: process.env.OPENROUTER_API_KEY,
  baseURL: 'https://openrouter.ai/api/v1',
})

const generateDocumentSchema = z.object({
  title: z.string().describe('Document title'),
  content: z.string().describe('Full document content in Markdown format'),
  documentType: z.enum(['GUIDE', 'TUTORIAL', 'REFERENCE', 'ANALYSIS', 'SPEC', 'OTHER']).describe('Type of document'),
  tags: z.array(z.string()).optional().describe('Tags for categorization')
})

export async function POST(req: Request) {
  const body = await req.json()
  const messages = body.messages || []
  const projectId = body.projectId

  const user = await stackServerApp.getUser()

  const result = streamText({
    model: openrouter('anthropic/claude-4.5-sonnet'),
    messages: convertToModelMessages(messages),
    system: `You are a helpful AI assistant in a Product Requirements Document (PRD) builder.

**CRITICAL: When a user asks you to generate a document, guide, tutorial, or any substantial written content, you MUST use the generateDocument tool.**

Examples of when to use generateDocument:
- "How can I scrape and beat zillow rate limit generate a document for me?"
- "Write me a guide on implementing OAuth"
- "Create a tutorial for setting up Stripe webhooks"
- "Generate a technical spec for this feature"

When you call generateDocument:
1. Create comprehensive, well-structured Markdown content
2. Use proper headers (# ## ###), code blocks, and formatting
3. Be thorough and actionable
4. Include code examples where relevant

Be conversational, helpful, and proactive about generating documents when asked.`,
    tools: {
      generateDocument: tool({
        description: 'Generate and save a comprehensive document (guide, tutorial, spec, etc.) to the user\'s project. Use this whenever the user asks you to create written content.',
        parameters: generateDocumentSchema,
        execute: async (params) => {
          if (!user || !projectId) {
            throw new Error('User must be logged in and have an active project')
          }

          // Verify user owns the project
          const project = await prisma.project.findUnique({
            where: { id: projectId }
          })

          if (!project || project.userId !== user.id) {
            throw new Error('Project not found or unauthorized')
          }

          // Create excerpt
          const excerpt = params.content.substring(0, 200).replace(/[#*`\n]/g, ' ').trim()

          // Create document
          const document = await prisma.projectDocument.create({
            data: {
              projectId,
              userId: user.id,
              type: params.documentType,
              title: params.title,
              content: params.content,
              excerpt,
              isBookmarked: true,
              bookmarkedAt: new Date(),
              generatedBy: 'AI Chat Assistant',
              tags: params.tags || []
            }
          })

          return {
            success: true,
            documentId: document.id,
            message: `Document "${params.title}" has been saved to your project!`
          }
        }
      })
    }
  })

  return result.toUIMessageStreamResponse({
    originalMessages: messages
  })
}
