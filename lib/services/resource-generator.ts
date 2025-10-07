import Exa from 'exa-js'
import { prisma } from '@/lib/prisma'
import fs from 'fs/promises'
import path from 'path'

const exa = new Exa(process.env.EXA_API_KEY!)

interface GenerationResult {
  success: boolean
  draftId?: string
  error?: string
  metadata?: {
    technology: string
    confidenceScore: number
    wordCount: number
    externalLinks: number
  }
}

export class ResourceGenerator {

  /**
   * Phase 1: Topic Discovery & Validation
   */
  async validateTopic(technology: string): Promise<{ valid: boolean; reason?: string }> {
    const slug = this.generateSlug(technology)

    // Check existing content files
    const contentPath = path.join(process.cwd(), 'content/resources')
    try {
      const files = await fs.readdir(contentPath)
      const exists = files.some(f => f.includes(slug))
      if (exists) {
        return { valid: false, reason: 'Topic already covered in content/resources' }
      }
    } catch (error) {
      console.log('Content directory check failed, continuing...')
    }

    // Check database drafts
    const existingDraft = await prisma.resourceDraft.findUnique({
      where: { slug }
    })

    if (existingDraft) {
      return { valid: false, reason: 'Draft already exists for this topic' }
    }

    return { valid: true }
  }

  /**
   * Phase 2: Research & Content Depth Assessment
   */
  async conductResearch(technology: string): Promise<{
    content: string
    confidence: number
    toolsUsed: string[]
    rawData: any
  }> {
    const toolsUsed: string[] = []
    let allContent = ''
    let confidence = 0

    // Step 1: Initial search
    console.log(`[Resource Generator] Searching for: ${technology}`)
    const searchResults = await exa.search(`${technology} for web developers tutorial guide`, {
      num_results: 10,
      use_autoprompt: true,
      type: 'keyword',
      contents: {
        text: true,
      }
    })

    toolsUsed.push('exa.search')
    allContent += JSON.stringify(searchResults.results, null, 2)

    // Calculate initial confidence
    const hasResults = searchResults.results && searchResults.results.length > 0
    const hasContent = searchResults.results.some(r => r.text && r.text.length > 200)
    confidence = (hasResults ? 0.4 : 0) + (hasContent ? 0.4 : 0)

    // Step 2: Find similar high-quality content for links
    if (hasContent && searchResults.results[0]?.text) {
      console.log(`[Resource Generator] Finding similar content...`)
      const similarResults = await exa.findSimilar(searchResults.results[0].url, {
        num_results: 5,
        excludeDomains: ['vibephx.com', 'vibecodephx.com']
      })

      toolsUsed.push('exa.findSimilar')
      allContent += '\n\n--- SIMILAR CONTENT ---\n\n'
      allContent += JSON.stringify(similarResults.results, null, 2)
      confidence += 0.1
    }

    // Step 3: Deep research if confidence is low
    if (confidence < 0.8) {
      console.log(`[Resource Generator] Confidence low (${confidence}), conducting deep research...`)
      try {
        const researchResults = await exa.search(
          `${technology} practical guide for beginners real-world examples`,
          {
            num_results: 10,
            use_autoprompt: true,
            type: 'neural',
            contents: {
              text: true,
            }
          }
        )

        toolsUsed.push('exa.research')
        allContent += '\n\n--- DEEP RESEARCH ---\n\n'
        allContent += JSON.stringify(researchResults.results, null, 2)
        confidence += 0.2
      } catch (error) {
        console.error('[Resource Generator] Deep research failed:', error)
      }
    }

    return {
      content: allContent,
      confidence: Math.min(confidence, 1.0),
      toolsUsed,
      rawData: { searchResults }
    }
  }

  /**
   * Phase 3-6: Content Generation using AI
   */
  async generateArticle(technology: string, researchData: string): Promise<{
    title: string
    description: string
    content: string
    tags: string[]
    complexity: string
    wordCount: number
    externalLinks: number
    codeExamples: number
  }> {
    // Call OpenRouter with Claude 3.5 Sonnet
    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': 'https://vibecodephx.com',
        'X-Title': 'Vibe Code PHX Resource Generator'
      },
      body: JSON.stringify({
        model: 'anthropic/claude-3.5-sonnet',
        messages: [
          {
            role: 'system',
            content: RESOURCE_ARTICLE_SYSTEM_PROMPT
          },
          {
            role: 'user',
            content: `Technology: ${technology}\n\nResearch Data:\n${researchData.slice(0, 50000)}`
          }
        ],
        temperature: 0.7,
        max_tokens: 8000
      })
    })

    if (!response.ok) {
      throw new Error(`OpenRouter API failed: ${response.statusText}`)
    }

    const data = await response.json()
    const articleContent = data.choices[0].message.content

    // Parse the generated article
    return this.parseGeneratedArticle(articleContent, technology)
  }

  /**
   * Parse AI-generated article into structured format
   */
  private parseGeneratedArticle(content: string, technology: string): {
    title: string
    description: string
    content: string
    tags: string[]
    complexity: string
    wordCount: number
    externalLinks: number
    codeExamples: number
  } {
    // Extract frontmatter if present
    const frontmatterMatch = content.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/)

    let title = `${technology}: Complete Guide for Web Developers`
    let description = `Learn everything you need to know about ${technology} in this comprehensive beginner-friendly guide.`
    let mainContent = content
    let tags: string[] = [technology.toLowerCase(), 'guide', 'tutorial']
    let complexity = 'beginner'

    if (frontmatterMatch) {
      const frontmatter = frontmatterMatch[1]
      mainContent = frontmatterMatch[2]

      // Extract title
      const titleMatch = frontmatter.match(/title:\s*["'](.+?)["']/)
      if (titleMatch) title = titleMatch[1]

      // Extract description
      const descMatch = frontmatter.match(/description:\s*["'](.+?)["']/)
      if (descMatch) description = descMatch[1]

      // Extract tags
      const tagsMatch = frontmatter.match(/tags:\s*\[(.*?)\]/)
      if (tagsMatch) {
        tags = tagsMatch[1].split(',').map(t => t.trim().replace(/["']/g, ''))
      }

      // Extract complexity
      const complexityMatch = frontmatter.match(/complexity:\s*["']?(\w+)["']?/)
      if (complexityMatch) complexity = complexityMatch[1]
    }

    // Count metrics
    const wordCount = mainContent.split(/\s+/).length
    const externalLinks = (mainContent.match(/\[.*?\]\(https?:\/\//g) || []).length
    const codeExamples = (mainContent.match(/```/g) || []).length / 2

    return {
      title,
      description,
      content: mainContent,
      tags,
      complexity,
      wordCount,
      externalLinks,
      codeExamples: Math.floor(codeExamples)
    }
  }

  /**
   * Main generation workflow
   */
  async generate(technology: string): Promise<GenerationResult> {
    try {
      console.log(`[Resource Generator] Starting generation for: ${technology}`)

      // Phase 1: Validate
      const validation = await this.validateTopic(technology)
      if (!validation.valid) {
        return { success: false, error: validation.reason }
      }

      // Phase 2: Research
      const research = await this.conductResearch(technology)

      if (research.confidence < 0.6) {
        return {
          success: false,
          error: `Insufficient research quality (confidence: ${research.confidence})`
        }
      }

      // Phase 3-6: Generate article
      const article = await this.generateArticle(technology, research.content)

      // Validation check
      if (article.wordCount < 800) {
        return { success: false, error: 'Generated article too short' }
      }

      if (article.externalLinks < 3) {
        console.warn(`[Resource Generator] Low external link count: ${article.externalLinks}`)
      }

      // Save draft to database
      const slug = this.generateSlug(technology)
      const draft = await prisma.resourceDraft.create({
        data: {
          technology,
          slug,
          title: article.title,
          description: article.description,
          content: article.content,
          tags: article.tags,
          complexity: article.complexity,
          wordCount: article.wordCount,
          externalLinks: article.externalLinks,
          codeExamples: article.codeExamples,
          confidenceScore: research.confidence,
          researchToolsUsed: research.toolsUsed,
          researchData: research.rawData,
          status: 'PENDING'
        }
      })

      console.log(`[Resource Generator] ✅ Draft created: ${draft.id}`)

      return {
        success: true,
        draftId: draft.id,
        metadata: {
          technology,
          confidenceScore: research.confidence,
          wordCount: article.wordCount,
          externalLinks: article.externalLinks
        }
      }

    } catch (error: any) {
      console.error('[Resource Generator] Generation failed:', error)
      return {
        success: false,
        error: error.message || 'Unknown error occurred'
      }
    }
  }

  /**
   * Helper: Generate URL-friendly slug
   */
  private generateSlug(text: string): string {
    return text
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '')
  }
}

// System prompt for article generation
const RESOURCE_ARTICLE_SYSTEM_PROMPT = `You are an expert technical writer creating beginner-friendly resource articles about web development technologies.

Your task is to create a comprehensive, SEO-optimized MDX article following this exact structure:

---
title: "[Technology]: What It Is & How to Use It"
description: "Brief 150-160 character summary"
tags: ["technology-name", "category", "complexity-level"]
complexity: "beginner|intermediate|advanced"
---

## What is [Technology]?

[First principles explanation with everyday analogy. No jargon. One-sentence summary of why it exists.]

## Why Should You Care?

[3-5 real-world use cases with concrete examples. Who uses this? What business/project impact does it have?]

## How Does It Work?

[Conceptual overview avoiding implementation details. Use analogies. High-level flow.]

## Getting Started

[Step-by-step practical example. Actual working code with comments.]

\`\`\`typescript
// Clear, commented code example
\`\`\`

## Common Use Cases

### Use Case 1: [Specific Scenario]
[Mini example with explanation]

### Use Case 2: [Specific Scenario]
[Mini example with explanation]

## Best Practices

**Do:**
- [Specific actionable tip]
- [Specific actionable tip]

**Avoid:**
- [Common mistake with why]
- [Common mistake with why]

## Next Steps

Ready to dive deeper? Check out these resources:
- [Official Documentation](url) - Complete reference
- [Community Resource](url) - Get help
- [Tutorial](url) - Learn more

---

**CRITICAL REQUIREMENTS:**
1. **No jargon without explanation** - Every technical term must be explained
2. **Use "you" and "your"** - Write in second person
3. **Concrete over abstract** - Real examples, not theory
4. **3-5 external authoritative links minimum**
5. **At least one working code example**
6. **Optimistic, encouraging tone** - "You can do this!"
7. **8th grade reading level**
8. **Active voice throughout**

**Example transformations:**
❌ "This API provides RESTful endpoints"
✅ "This API lets you save and retrieve data from anywhere"

❌ "Utilizes event-driven architecture"
✅ "When something happens (like a click), it triggers an action"

Use the research data provided to ensure technical accuracy, but write for complete beginners.`

export const resourceGenerator = new ResourceGenerator()
