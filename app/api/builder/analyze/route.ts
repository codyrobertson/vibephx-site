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
  projectComplexity: z.enum(['simple', 'moderate']),
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
         - Use built-in browser APIs and simple libraries only
         
         RECOMMENDED APPROACH:
         - Next.js with App Router (most AI tools support this best)
         - Client-side state management (useState, useEffect)
         - Local storage for data persistence initially
         - Simple UI with Tailwind CSS
         - Avoid complex authentication, APIs, or database setup
         
         Suggest features that are:
         1. Achievable in under 1 hour each for a novice
         2. Create immediate, tangible user value
         3. Can be copy-pasted and modified from AI tools
         4. Work without external dependencies or setup`

    console.log('Calling OpenRouter API with model: anthropic/claude-sonnet-4')
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
        model: 'anthropic/claude-sonnet-4',
        messages: [
          {
            role: 'user',
            content: `${analysisPrompt}

            ANALYSIS REQUIREMENTS:
            
            ⚠️  CRITICAL TIME CONSTRAINT - ABSOLUTE MAXIMUM 6 HOURS ⚠️
            
            MANDATORY TIME LIMITS (NEVER VIOLATE THESE):
            - TOTAL PROJECT TIME: Maximum 6 hours (prefer 4-5 hours)
            - INDIVIDUAL FEATURES: 30-60 minutes each maximum
            - BEGINNER FRIENDLY: Account for learning curve with AI tools
            - RESPONSE VALIDATION: "estimatedTime" must be one of: "3 hours", "4 hours", "4-5 hours", "5 hours", "5-6 hours", "6 hours"
            - IF YOU ESTIMATE MORE THAN 6 HOURS: Remove features immediately until under 6 hours
            
            TECH STACK LIMITATIONS:
            - Frontend: Only suggest Next.js, React, or vanilla JavaScript
            - Backend: Prefer Next.js API routes or serverless functions only
            - Database: Start with localStorage, then suggest simple options like Supabase
            - AI Services: Use "openai", "anthropic", "openrouter", or "none" (if no AI features needed)
            - NO AWS tools, complex cloud services, or enterprise solutions
            
            FEATURE SCOPING:
            - Limit to 3-5 ultra-simple features maximum
            - Each feature must work independently (no complex dependencies)
            - Prioritize features that provide immediate visual feedback
            - Everything should work with copy-paste code from AI tools
            
            SCOPE WARNINGS:
            - Flag anything requiring more than basic React knowledge
            - Warn about features needing external APIs or complex setup
            - Identify anything that might take longer than 1 hour per feature
            
            INSIGHTS FOCUS:
            - How to use v0.dev, Loveable, or similar AI tools effectively
            - Which parts to build first for quick wins
            - How to avoid common beginner pitfalls
            
            Please respond with valid JSON that matches this exact schema:
            ${JSON.stringify(FeatureAnalysisSchema.shape, null, 2)}

            IMPORTANT FIELD REQUIREMENTS:
            - aiService: Must be a string value like "openai", "anthropic", "openrouter", or "none" (never null or undefined)
            - estimatedTime: Must be "4-6 hours" or less (e.g., "3-5 hours", "4 hours")
            - All fields are required unless marked optional`
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
    
    // Post-processing validation: Force time constraints if AI violates them
    const timeRegex = /(\d+)(?:-(\d+))?\s*hours?/i
    const match = validatedResult.estimatedTime.match(timeRegex)
    const maxHours = match ? parseInt(match[2] || match[1]) : 0
    
    if (maxHours > 6) {
      console.warn(`AI returned ${validatedResult.estimatedTime}, forcing to 6 hours max`)
      validatedResult.estimatedTime = '5-6 hours'
      
      // Also truncate features if too many
      if (validatedResult.suggestedFeatures.length > 4) {
        validatedResult.suggestedFeatures = validatedResult.suggestedFeatures.slice(0, 4)
        validatedResult.scopeWarnings.push(
          'Project scope reduced to fit 6-hour time constraint for novice builders'
        )
      }
    }
    
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