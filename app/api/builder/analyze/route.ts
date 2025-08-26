import { z } from 'zod'
import { NextRequest } from 'next/server'

const FeatureAnalysisSchema = z.object({
  suggestedFeatures: z.array(z.object({
    name: z.string(),
    description: z.string(),
    priority: z.enum(['must-have', 'should-have', 'could-have']),
    difficulty: z.enum(['easy', 'medium', 'hard']),
    timeEstimate: z.string(),
  })),
  scopeWarnings: z.array(z.string()),
  recommendedStack: z.object({
    frontend: z.string(),
    backend: z.string(),
    database: z.string(),
    aiService: z.string().optional(),
  }),
  projectComplexity: z.enum(['simple', 'moderate', 'complex']),
  estimatedTime: z.string(),
  keyInsights: z.array(z.string()),
})

export async function POST(req: NextRequest) {
  try {
    // Debug logging
    console.log('OpenRouter API Key exists:', !!process.env.OPENROUTER_API_KEY)
    console.log('API Key length:', process.env.OPENROUTER_API_KEY?.length || 0)
    
    const { projectIdea, template, selectedStack } = await req.json()

    // Create analysis prompt based on whether it's a template or custom idea
    const analysisPrompt = template 
      ? `Analyze this template project for a one-day build: "${template}".
         Consider the selected stack: ${JSON.stringify(selectedStack)}.
         Focus on what features are essential vs. nice-to-have for a working MVP.`
      : `Analyze this custom app idea for a one-day build: "${projectIdea}".
         The user has selected this tech stack: ${JSON.stringify(selectedStack)}.
         
         CRITICAL CONSTRAINTS:
         - Must be buildable in 6-8 hours by a beginner-intermediate developer
         - Should result in a working, deployable app
         - Focus on core functionality only
         - No complex integrations that require lengthy setup
         
         Suggest features that are:
         1. Actually achievable in the timeframe
         2. Create real user value
         3. Can be built with the selected tech stack
         4. Have clear, simple implementations`

    console.log('Calling OpenRouter API with model: anthropic/claude-3.5-sonnet')
    console.log('Base URL:', 'https://openrouter.ai/api/v1/chat/completions')
    console.log('API Key prefix:', process.env.OPENROUTER_API_KEY?.substring(0, 10) + '...')
    
    // Make direct API call to OpenRouter
    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
        'HTTP-Referer': process.env.OPENROUTER_SITE_URL || 'http://localhost:3006',
        'X-Title': process.env.OPENROUTER_SITE_NAME || 'VibePHX AI Builder',
      },
      body: JSON.stringify({
        model: 'anthropic/claude-3.5-sonnet',
        messages: [
          {
            role: 'user',
            content: `${analysisPrompt}

            Provide a realistic analysis that keeps scope tight and achievable. Be honest about what's possible in one day.
            
            For suggestedFeatures, limit to 3-7 core features max.
            For scopeWarnings, flag anything that seems too ambitious.
            For recommendedStack, suggest the best fit from available options.
            For keyInsights, provide 2-3 strategic tips for success.
            
            Please respond with valid JSON that matches this exact schema:
            ${JSON.stringify(FeatureAnalysisSchema.shape, null, 2)}`
          }
        ]
      })
    })

    if (!response.ok) {
      throw new Error(`OpenRouter API error: ${response.status} ${response.statusText}`)
    }

    const data = await response.json()
    console.log('Raw OpenRouter response:', data)
    
    // Extract the content from the response
    const content = data.choices[0]?.message?.content
    if (!content) {
      throw new Error('No content in OpenRouter response')
    }

    // Parse the JSON content
    let analysisResult
    try {
      analysisResult = JSON.parse(content)
    } catch (parseError) {
      console.error('Failed to parse JSON from OpenRouter response:', content)
      throw new Error('Invalid JSON response from OpenRouter')
    }

    // Validate against schema
    const validatedResult = FeatureAnalysisSchema.parse(analysisResult)
    
    console.log('Successfully generated and validated analysis from OpenRouter')
    return Response.json(validatedResult)
  } catch (error) {
    console.error('Analysis error:', error)
    return Response.json(
      { error: 'Failed to analyze project requirements' },
      { status: 500 }
    )
  }
}

export const runtime = 'edge'