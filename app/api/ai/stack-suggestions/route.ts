import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const { customIdea, availableStacks, requestedCategory } = await request.json()
    
    if (!customIdea) {
      return NextResponse.json({ error: 'Custom idea is required' }, { status: 400 })
    }

    // Create AI prompt for stack suggestions
    const prompt = createStackSuggestionPrompt(customIdea, availableStacks, requestedCategory)
    
    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
        'HTTP-Referer': process.env.OPENROUTER_SITE_URL || 'http://localhost:3000',
        'X-Title': process.env.OPENROUTER_SITE_NAME || 'VibePHX AI Builder',
      },
      body: JSON.stringify({
        model: 'anthropic/claude-3.5-sonnet',
        messages: [
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.3,
        max_tokens: 1000
      }),
    })

    if (!response.ok) {
      throw new Error(`OpenRouter API failed: ${response.status} ${response.statusText}`)
    }

    const data = await response.json()
    const aiResponse = data.choices[0]?.message?.content

    if (!aiResponse) {
      throw new Error('No response from AI')
    }

    // Parse the AI response
    let suggestions
    try {
      // Extract JSON from the response (AI might include explanations)
      const jsonMatch = aiResponse.match(/\{[\s\S]*\}/)
      if (jsonMatch) {
        suggestions = JSON.parse(jsonMatch[0])
      } else {
        throw new Error('No valid JSON found in AI response')
      }
    } catch (parseError) {
      console.error('Failed to parse AI response:', aiResponse)
      throw new Error('Invalid AI response format')
    }

    return NextResponse.json(suggestions)
    
  } catch (error) {
    console.error('AI stack suggestions error:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Internal server error' }, 
      { status: 500 }
    )
  }
}

function createStackSuggestionPrompt(customIdea: string, availableStacks: any, requestedCategory?: string): string {
  const stacksContext = JSON.stringify(availableStacks, null, 2)
  
  if (requestedCategory) {
    // Single category request
    return `
You are a technical architect helping choose the best technology stack for a project.

Project Idea: "${customIdea}"

Available ${requestedCategory} options:
${JSON.stringify(availableStacks[requestedCategory], null, 2)}

Please analyze the project idea and recommend the top 3-4 most suitable ${requestedCategory} technologies from the available options. Consider:
- Project requirements and complexity
- Ease of use and learning curve
- Performance and scalability needs
- Development speed
- Community support and documentation

Respond with ONLY a JSON object in this format:
{
  "suggestions": [
    {"id": "option-id", "reasoning": "why this is good for the project"},
    {"id": "option-id", "reasoning": "why this is good for the project"}
  ]
}
`
  } else {
    // All categories request
    return `
You are a technical architect helping choose the best technology stack for a project.

Project Idea: "${customIdea}"

Available technology options:
${stacksContext}

Please analyze the project idea and recommend the most suitable technologies from each category. Consider:
- Project requirements and complexity
- Technology compatibility and synergy
- Ease of use and learning curve
- Performance and scalability needs
- Development speed

Respond with ONLY a JSON object in this format:
{
  "categories": {
    "frontend": [
      {"id": "option-id", "reasoning": "why this fits the project"}
    ],
    "backend": [
      {"id": "option-id", "reasoning": "why this fits the project"}
    ],
    "database": [
      {"id": "option-id", "reasoning": "why this fits the project"}
    ],
    "aiService": [
      {"id": "option-id", "reasoning": "why this fits the project"}
    ],
    "secretSauce": [
      {"id": "option-id", "reasoning": "why this fits the project"}
    ]
  }
}
`
  }
}