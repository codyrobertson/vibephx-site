import { NextRequest, NextResponse } from 'next/server'
import { callLLM } from '@/lib/inference-gate'
import { stackServerApp } from '@/stack'

export const runtime = 'nodejs'

// Handle vision and web search requests
export async function POST(req: NextRequest) {
  try {
    const user = await stackServerApp.getUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { message, images, shouldSearch, sessionId, projectId } = await req.json()

    let response = ''
    
    let foundImages: string[] = []
    
    // Check if this is a logo request (use our logo cache API)
    const logoMatch = message.match(/logo|icon|brand.*image|favicon/i)
    const domainMatch = message.match(/([a-z0-9-]+\.(?:com|org|io|dev|ai|tech|net|co))/i)
    
    if (logoMatch && domainMatch) {
      const domain = domainMatch[1]
      const logoUrl = `/api/logo-cache/${domain}/128/png`
      foundImages.push(logoUrl)
      response = `Here's the logo for ${domain}:`
      return NextResponse.json({ response, images: foundImages })
    }
    
    // Check if we need web search
    if (shouldSearch || /search|look up|find|research|examples?|show me|screenshots?|images?.*of/i.test(message)) {
      // Call Exa search API
      try {
        const exaRes = await fetch('https://api.exa.ai/search', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-api-key': process.env.EXA_API_KEY || 'fa45a7ae-6cf1-450e-a7da-9ee28c2bb7fe'
          },
          body: JSON.stringify({
            query: message,
            numResults: 5,
            useAutoprompt: true,
            contents: {
              text: true
            }
          })
        })
        
        if (exaRes.ok) {
          const searchData = await exaRes.json()
          const results = searchData.results || []
          
          // Extract images from search results
          results.forEach((r: any) => {
            if (r.image) foundImages.push(r.image)
          })
          
          const searchContext = results.map((r: any) => `${r.title}: ${r.url}\n${r.text || ''}`).join('\n\n')
          
          // Pass search results to LLM
          const prompt = `Based on these search results:\n\n${searchContext}\n\nUser question: ${message}\n\nProvide a helpful, concise answer based on the search results. Be specific and cite sources when relevant.`
          
          const result = await callLLM({
            model: 'anthropic/claude-3.5-sonnet',
            provider: 'openrouter',
            messages: [{ role: 'user', content: prompt }],
            purpose: 'web_search_synthesis',
            userId: user.id,
            projectId,
            sessionId,
            maxTokens: 1500
          })
          
          response = result.content
        }
      } catch (err) {
        console.error('Search failed:', err)
        response = 'Search failed. Please try rephrasing your question.'
      }
    } else if (images && images.length > 0) {
      // Vision API call
      const result = await callLLM({
        model: 'anthropic/claude-3.5-sonnet',
        provider: 'openrouter',
        messages: [{
          role: 'user',
          content: [
            ...images.map((img: string) => ({
              type: 'image_url',
              image_url: { url: img }
            })),
            { type: 'text', text: message || 'What do you see in these images?' }
          ]
        }],
        purpose: 'vision_analysis',
        userId: user.id,
        projectId,
        sessionId,
        maxTokens: 1500
      })
      
      response = result.content
    } else {
      return NextResponse.json({ error: 'No images or search query provided' }, { status: 400 })
    }

    return NextResponse.json({ 
      response,
      images: foundImages.length > 0 ? foundImages.slice(0, 3) : undefined // Include up to 3 images from search
    })
  } catch (error: any) {
    console.error('Multimodal error:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to process request' },
      { status: 500 }
    )
  }
}

