import { createHighlighter } from 'shiki'

// Pre-compiled highlighter for ultra-fast performance
let highlighterPromise: Promise<any> | null = null
let highlighterCache: any = null

// Initialize Shiki with minimal languages and theme for speed
async function getShikiHighlighter() {
  if (highlighterCache) return highlighterCache
  
  if (!highlighterPromise) {
    highlighterPromise = createHighlighter({
      themes: ['vitesse-dark'], // Single theme for speed
      langs: ['typescript', 'sql', 'javascript', 'bash', 'css', 'html', 'json', 'markdown'] // Common languages
    })
  }
  
  highlighterCache = await highlighterPromise
  return highlighterCache
}

// Pre-highlighted code cache for instant access
const HIGHLIGHTED_CACHE = new Map<string, string>()

// Hyper-fast highlighting with caching
export async function highlightCode(code: string, lang: string = 'typescript'): Promise<string> {
  const cacheKey = `${lang}:${code}`
  
  // Return from cache if available
  if (HIGHLIGHTED_CACHE.has(cacheKey)) {
    return HIGHLIGHTED_CACHE.get(cacheKey)!
  }
  
  try {
    const highlighter = await getShikiHighlighter()
    const html = highlighter.codeToHtml(code, {
      lang: lang,
      theme: 'vitesse-dark'
    })
    
    // Cache the result
    HIGHLIGHTED_CACHE.set(cacheKey, html)
    return html
    
  } catch (error) {
    console.warn('Shiki highlighting failed:', error)
    // Fallback to plain pre
    const fallback = `<pre class="shiki vitesse-dark" style="background-color:#121212;color:#dbd7caee"><code>${code}</code></pre>`
    HIGHLIGHTED_CACHE.set(cacheKey, fallback)
    return fallback
  }
}

// Pre-compile all our static snippets for instant access
export async function precompileSnippets() {
  const snippets = [
    { code: `import React, { useState } from 'react'\nexport function UserProfile({ user }) {\n  return <div>{user.name}</div>\n}`, lang: 'typescript' },
    { code: `export async function POST(request: NextRequest) {\n  const body = await request.json()\n  return NextResponse.json({ success: true })\n}`, lang: 'typescript' },
    { code: `CREATE TABLE users (\n  id UUID PRIMARY KEY,\n  email VARCHAR(255) UNIQUE\n);`, lang: 'sql' }
    // Add more snippets as needed
  ]
  
  // Pre-compile all snippets
  const promises = snippets.map(({ code, lang }) => highlightCode(code, lang))
  await Promise.all(promises)
  
  console.log('🚀 Shiki snippets pre-compiled for instant access')
}

// Initialize pre-compilation on client-side only
if (typeof window !== 'undefined') {
  precompileSnippets().catch(console.warn)
}