import OpenAI from 'openai'
import { put } from '@vercel/blob'

const openai = new OpenAI({ apiKey: process.env.OPENROUTER_API_KEY!, baseURL: 'https://openrouter.ai/api/v1' })

export async function generateFeaturedImage(technology: string, title: string): Promise<{
  url: string
  prompt: string
}> {
  const prompt = `A modern, professional featured image for a technical article about ${technology}. Clean design, tech-focused, vibrant colors matching a developer blog aesthetic. Include subtle geometric patterns and the text "${technology}" in a modern sans-serif font. No people, photorealistic quality, 16:9 aspect ratio.`

  try {
    // Generate image with DALL-E via OpenRouter
    const response = await fetch('https://openrouter.ai/api/v1/images/generations', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'openai/dall-e-3',
        prompt,
        n: 1,
        size: '1792x1024',
        quality: 'standard'
      })
    })

    if (!response.ok) {
      throw new Error(`Image generation failed: ${response.statusText}`)
    }

    const data = await response.json()
    const imageUrl = data.data[0].url

    // Download and upload to Vercel Blob
    const imageResponse = await fetch(imageUrl)
    const imageBlob = await imageResponse.blob()

    const blob = await put(
      `resources/${technology.toLowerCase().replace(/[^a-z0-9]+/g, '-')}.png`,
      imageBlob,
      { access: 'public' }
    )

    return {
      url: blob.url,
      prompt
    }
  } catch (error: any) {
    console.error('[Image Generator] Failed:', error)
    // Fallback to placeholder
    return {
      url: `/images/placeholder-tech.png`,
      prompt
    }
  }
}
