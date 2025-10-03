import { createOpenAI } from '@ai-sdk/openai'
import { streamText, tool, convertToModelMessages } from 'ai'
import { z } from 'zod'

export const runtime = 'edge'

const openrouter = createOpenAI({
  apiKey: process.env.OPENROUTER_API_KEY,
  baseURL: 'https://openrouter.ai/api/v1',
})

const extractProjectDetailsSchema = z.object({
  projectName: z.string().describe('The name of the project'),
  projectGoal: z.string().describe('The main goal or purpose of the project'),
  targetUsers: z.string().describe('Who will use this product'),
  projectType: z.enum(['Landing Page', 'Dashboard', 'Form/Survey', 'Data Tool', 'E-commerce', 'CRM', 'Booking System', 'Content Platform', 'Other']).describe('Type of project')
})

const suggestFeaturesSchema = z.object({
  features: z.array(z.object({
    name: z.string(),
    description: z.string(),
    priority: z.enum(['must-have', 'nice-to-have'])
  })).describe('Suggested features for the project')
})

const suggestStackSchema = z.object({
  frontend: z.string().describe('Recommended frontend framework'),
  backend: z.string().describe('Recommended backend/API approach'),
  database: z.string().describe('Recommended database'),
  integrations: z.array(z.string()).describe('Recommended third-party integrations')
})

export async function POST(req: Request) {
  const body = await req.json()
  const messages = body.messages || []

  console.log('[SERVER] Received messages:', messages.length)
  console.log('[SERVER] Converting to model messages...')

  const result = streamText({
    model: openrouter('openai/gpt-4o-mini'),
    messages: convertToModelMessages(messages),
    system: `You are a Product Requirements Document (PRD) builder assistant. Your role is to help users create comprehensive PRDs through a conversational interview process.

Be conversational, friendly, and guide the user through creating their PRD.`,
    // Temporarily disabled tools to test
    // tools: {
    //   extractProjectDetails: tool({
    //     description: 'Extract structured project details from user description',
    //     parameters: extractProjectDetailsSchema,
    //     execute: async (params) => params
    //   }),
    //   suggestFeatures: tool({
    //     description: 'Suggest features for the project',
    //     parameters: suggestFeaturesSchema,
    //     execute: async (params) => params
    //   }),
    //   suggestStack: tool({
    //     description: 'Suggest technical stack for the project',
    //     parameters: suggestStackSchema,
    //     execute: async (params) => params
    //   })
    // },
    maxTokens: 1000
  })

  console.log('[SERVER] Returning UI message stream response with originalMessages')

  return result.toUIMessageStreamResponse({
    originalMessages: messages
  })
}
