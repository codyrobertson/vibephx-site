import { NextRequest } from 'next/server'

export async function POST(req: NextRequest) {
  try {
    const { projectIdea, template, selectedStack } = await req.json()

    const analysisPrompt = template 
      ? `Analyze this template project for a one-day build: "${template}".
         Consider the selected stack: ${JSON.stringify(selectedStack)}.
         Focus on what features are essential vs. nice-to-have for a working MVP.
         
         TARGET USER: Novice developer using tools like v0.dev, Loveable, or Replit
         TIME LIMIT: Maximum 6 hours of actual development time
         SKILL LEVEL: Beginner with basic React/Next.js knowledge`
      : `Analyze this custom app idea for a one-day build: "${projectIdea}".
         The user has selected this tech stack: ${JSON.stringify(selectedStack)}.
         
         CRITICAL CONSTRAINTS FOR NOVICE BUILDERS:
         - Must be buildable in 4-6 hours by a novice developer using AI tools
         - Target users: Complete beginners using v0.dev, Loveable, Replit, or similar
         - Should result in a working, deployable app with minimal setup
         - Focus on core functionality only - no complex integrations
         - Prefer client-side solutions over complex backend logic
         - Use built-in browser APIs and simple libraries only`

    // Create readable stream
    const encoder = new TextEncoder()
    const stream = new ReadableStream({
      async start(controller) {
        try {
          // Make streaming API call to OpenRouter
          const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
              'HTTP-Referer': process.env.OPENROUTER_SITE_URL || 'http://localhost:3006',
              'X-Title': process.env.OPENROUTER_SITE_NAME || 'VibePHX AI Builder',
            },
            body: JSON.stringify({
              model: 'anthropic/claude-sonnet-4',
              messages: [
                {
                  role: 'user',
                  content: `${analysisPrompt}

                  ANALYSIS REQUIREMENTS:
                  
                  ⚠️  CRITICAL TIME CONSTRAINT - ABSOLUTE MAXIMUM 6 HOURS ⚠️
                  
                  Start your response with <thinking> tags to show your reasoning process, then provide the final analysis.
                  
                  In your <thinking> section, work through:
                  1. Understanding the project scope and constraints
                  2. Evaluating the selected tech stack for novice builders
                  3. Breaking down features by complexity and time requirements
                  4. Identifying potential scope creep risks
                  5. Prioritizing features for maximum user value
                  
                  Then provide the analysis in this JSON format:
                  {
                    "suggestedFeatures": [...],
                    "scopeWarnings": [...],
                    "recommendedStack": {...},
                    "projectComplexity": "simple" | "moderate",
                    "estimatedTime": "4-6 hours",
                    "keyInsights": [...]
                  }`
                }
              ],
              stream: true
            })
          })

          if (!response.ok) {
            throw new Error(`OpenRouter API error: ${response.status}`)
          }

          const reader = response.body?.getReader()
          if (!reader) {
            throw new Error('No response body')
          }

          while (true) {
            const { done, value } = await reader.read()
            
            if (done) {
              controller.close()
              break
            }

            // Forward the chunk to the client
            controller.enqueue(value)
          }
        } catch (error) {
          console.error('Streaming error:', error)
          const errorMessage = encoder.encode(`data: {"error": "Streaming failed"}\n\n`)
          controller.enqueue(errorMessage)
          controller.close()
        }
      }
    })

    return new Response(stream, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
      }
    })
  } catch (error) {
    console.error('Stream setup error:', error)
    return Response.json({ error: 'Failed to setup stream' }, { status: 500 })
  }
}

export const runtime = 'edge'