import { OpenAI } from 'openai'

// Lazy initialization of OpenAI client to avoid build-time errors
let openai: OpenAI | null = null

function getOpenAIClient(): OpenAI {
  if (!openai) {
    openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY
    })
  }
  return openai
}

export interface EmbeddingResult {
  embedding: number[]
  tokens: number
  model: string
}

/**
 * Generate embedding for a document using OpenAI's text-embedding-3-small model
 * @param text - The text content to embed
 * @returns Embedding vector and metadata
 */
export async function generateEmbedding(text: string): Promise<EmbeddingResult> {
  try {
    // Truncate to max token limit (8000 tokens ≈ 32000 characters)
    const truncatedText = text.slice(0, 32000)

    const client = getOpenAIClient()
    const response = await client.embeddings.create({
      model: 'text-embedding-3-small',
      input: truncatedText,
      encoding_format: 'float'
    })

    const embedding = response.data[0].embedding
    const tokens = response.usage.total_tokens

    return {
      embedding,
      tokens,
      model: 'text-embedding-3-small'
    }
  } catch (error) {
    console.error('Error generating embedding:', error)
    throw new Error(`Failed to generate embedding: ${error instanceof Error ? error.message : 'Unknown error'}`)
  }
}

/**
 * Generate embeddings for multiple documents in batch
 * @param texts - Array of text contents to embed
 * @returns Array of embeddings with metadata
 */
export async function generateEmbeddingsBatch(texts: string[]): Promise<EmbeddingResult[]> {
  try {
    // OpenAI allows up to 2048 inputs per request, but we'll be conservative
    const batchSize = 100
    const results: EmbeddingResult[] = []

    for (let i = 0; i < texts.length; i += batchSize) {
      const batch = texts.slice(i, i + batchSize)

      // Truncate each text
      const truncatedBatch = batch.map(text => text.slice(0, 32000))

      const client = getOpenAIClient()
      const response = await client.embeddings.create({
        model: 'text-embedding-3-small',
        input: truncatedBatch,
        encoding_format: 'float'
      })

      const batchResults = response.data.map(item => ({
        embedding: item.embedding,
        tokens: response.usage.total_tokens / response.data.length, // Average tokens per input
        model: 'text-embedding-3-small'
      }))

      results.push(...batchResults)
    }

    return results
  } catch (error) {
    console.error('Error generating batch embeddings:', error)
    throw new Error(`Failed to generate batch embeddings: ${error instanceof Error ? error.message : 'Unknown error'}`)
  }
}

/**
 * Calculate cosine similarity between two embedding vectors
 * @param vecA - First embedding vector
 * @param vecB - Second embedding vector
 * @returns Similarity score between -1 and 1 (higher is more similar)
 */
export function cosineSimilarity(vecA: number[], vecB: number[]): number {
  if (vecA.length !== vecB.length) {
    throw new Error('Vectors must have the same length')
  }

  let dotProduct = 0
  let magnitudeA = 0
  let magnitudeB = 0

  for (let i = 0; i < vecA.length; i++) {
    dotProduct += vecA[i] * vecB[i]
    magnitudeA += vecA[i] * vecA[i]
    magnitudeB += vecB[i] * vecB[i]
  }

  magnitudeA = Math.sqrt(magnitudeA)
  magnitudeB = Math.sqrt(magnitudeB)

  if (magnitudeA === 0 || magnitudeB === 0) {
    return 0
  }

  return dotProduct / (magnitudeA * magnitudeB)
}

/**
 * Create excerpt from document content (first 200-250 characters)
 * @param content - Full document content
 * @param maxLength - Maximum length of excerpt (default 200)
 * @returns Excerpt string with ellipsis if truncated
 */
export function createExcerpt(content: string, maxLength: number = 200): string {
  if (!content) return ''

  // Remove markdown formatting for cleaner excerpt
  const plainText = content
    .replace(/#{1,6}\s/g, '') // Remove markdown headers
    .replace(/\*\*/g, '') // Remove bold
    .replace(/\*/g, '') // Remove italic
    .replace(/\[([^\]]+)\]\([^\)]+\)/g, '$1') // Remove links but keep text
    .replace(/`{1,3}[^`]*`{1,3}/g, '') // Remove code blocks
    .trim()

  if (plainText.length <= maxLength) {
    return plainText
  }

  // Find last complete word within maxLength
  const truncated = plainText.slice(0, maxLength)
  const lastSpace = truncated.lastIndexOf(' ')

  if (lastSpace > 0) {
    return truncated.slice(0, lastSpace) + '...'
  }

  return truncated + '...'
}
