import { NextRequest } from 'next/server'
import { getRelevantStackOptions, getAIRecommendation, TEMPLATE_STACK_MAPPINGS } from '@/lib/stackDatabase'

export async function POST(req: NextRequest) {
  try {
    const requestStart = performance.now()
    const { templateId, customIdea, currentSelections } = await req.json()
    
    console.log('📊 Stack suggestions request:', { 
      templateId, 
      customIdea: customIdea ? `"${customIdea.slice(0, 50)}..."` : undefined,
      hasCurrentSelections: !!currentSelections 
    })

    // Get filtered stack options for each category
    const suggestionsStart = performance.now()
    const suggestions = {
      frontend: getRelevantStackOptions(templateId, customIdea, 'frontend', currentSelections),
      backend: getRelevantStackOptions(templateId, customIdea, 'backend', currentSelections),
      database: getRelevantStackOptions(templateId, customIdea, 'database', currentSelections),
      aiService: getRelevantStackOptions(templateId, customIdea, 'aiService', currentSelections)
    }
    console.log(`📋 Suggestions generated in ${(performance.now() - suggestionsStart).toFixed(1)}ms`)

    // Get AI recommendations
    const aiRecommendations = getAIRecommendation(templateId, customIdea, currentSelections)

    // Get template info if available
    const templateInfo = templateId ? TEMPLATE_STACK_MAPPINGS[templateId] : null

    const response = {
      suggestions,
      aiRecommendations,
      templateInfo: templateInfo ? {
        title: templateInfo.title,
        requiredFeatures: templateInfo.requiredFeatures,
        avoidFeatures: templateInfo.avoidFeatures,
        complexityBudget: templateInfo.complexityBudget
      } : null,
      reasoning: generateReasoningText(templateId, customIdea, aiRecommendations)
    }

    const totalTime = performance.now() - requestStart
    console.log('✅ Stack suggestions complete:', {
      totalOptions: Object.values(suggestions).reduce((sum, arr) => sum + arr.length, 0),
      recommendationsCount: Object.keys(aiRecommendations).length,
      totalTime: `${totalTime.toFixed(1)}ms`,
      recommendations: aiRecommendations
    })

    return Response.json(response)
  } catch (error) {
    console.error('Stack suggestions error:', error)
    return Response.json(
      { error: 'Failed to generate stack suggestions' },
      { status: 500 }
    )
  }
}

function generateReasoningText(
  templateId: string | undefined,
  customIdea: string | undefined,
  recommendations: Record<string, string>
): string {
  if (templateId) {
    const templateInfo = TEMPLATE_STACK_MAPPINGS[templateId]
    if (templateInfo) {
      return `Based on the ${templateInfo.title} template, we recommend a stack optimized for ${templateInfo.requiredFeatures.join(', ')}. This combination provides the best balance of development speed and feature requirements for your project.`
    }
  }

  if (customIdea) {
    return `Based on your custom idea, we've analyzed the requirements and selected a tech stack that balances simplicity with the features you described. These recommendations prioritize beginner-friendliness while meeting your project goals.`
  }

  return `These are our recommended technologies based on popularity and ease of use for beginner developers in hackathon-style projects.`
}

export const runtime = 'edge'