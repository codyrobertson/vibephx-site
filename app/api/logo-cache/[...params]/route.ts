import { NextRequest } from 'next/server'
import { promises as fs } from 'fs'
import { join } from 'path'
import { createHash } from 'crypto'

const CACHE_DIR = join(process.cwd(), '.logo-cache')
const LOGO_DEV_TOKEN = process.env.LOGO_DEV_TOKEN || 'pk_cJ_vQ1nNRM6nbN75WsWP3Q'

// Ensure cache directory exists
async function ensureCacheDir() {
  try {
    await fs.access(CACHE_DIR)
  } catch {
    await fs.mkdir(CACHE_DIR, { recursive: true })
    console.log('📁 Created logo cache directory:', CACHE_DIR)
  }
}

// Generate cache filename from URL parameters
function getCacheFilename(domain: string, size: string, format: string): string {
  const hash = createHash('md5').update(`${domain}-${size}-${format}`).digest('hex')
  return `${hash}.${format}`
}

// Download logo from logo.dev
async function downloadLogo(domain: string, size: string, format: string): Promise<Buffer> {
  const url = `https://img.logo.dev/${domain}?token=${LOGO_DEV_TOKEN}&size=${size}&format=${format}`
  
  console.log(`📥 Downloading logo: ${domain} (${size}px, ${format})`)
  
  const response = await fetch(url)
  if (!response.ok) {
    throw new Error(`Failed to download logo: ${response.status} ${response.statusText}`)
  }
  
  return Buffer.from(await response.arrayBuffer())
}

// Get content type for format
function getContentType(format: string): string {
  switch (format.toLowerCase()) {
    case 'png': return 'image/png'
    case 'jpg':
    case 'jpeg': return 'image/jpeg'
    case 'svg': return 'image/svg+xml'
    case 'webp': return 'image/webp'
    default: return 'image/png'
  }
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ params: string[] }> }
) {
  try {
    const resolvedParams = await params
    const [domain, sizeParam, formatParam] = resolvedParams.params
    
    if (!domain) {
      return new Response('Domain is required', { status: 400 })
    }
    
    // Parse size and format with defaults
    const size = sizeParam || '32'
    const format = formatParam || 'png'
    
    // Validate parameters
    if (!domain.includes('.')) {
      return new Response('Invalid domain format', { status: 400 })
    }
    
    const validFormats = ['png', 'jpg', 'jpeg', 'svg', 'webp']
    if (!validFormats.includes(format.toLowerCase())) {
      return new Response('Invalid format. Use: png, jpg, svg, webp', { status: 400 })
    }
    
    await ensureCacheDir()
    
    const filename = getCacheFilename(domain, size, format)
    const filePath = join(CACHE_DIR, filename)
    
    let imageBuffer: Buffer
    
    try {
      // Try to read from cache first
      imageBuffer = await fs.readFile(filePath)
      console.log(`⚡ Cache hit: ${domain} (${size}px, ${format})`)
    } catch {
      // Cache miss - download and cache the logo
      console.log(`📦 Cache miss: ${domain} - downloading...`)
      imageBuffer = await downloadLogo(domain, size, format)
      
      // Save to cache for next time
      await fs.writeFile(filePath, imageBuffer)
      console.log(`💾 Cached logo: ${filename} (${imageBuffer.length} bytes)`)
    }
    
    // Return the image with appropriate headers
    return new Response(new Uint8Array(imageBuffer), {
      headers: {
        'Content-Type': getContentType(format),
        'Cache-Control': 'public, max-age=31536000', // Cache for 1 year
        'ETag': `"${getCacheFilename(domain, size, format)}"`,
      }
    })
    
  } catch (error) {
    console.error('Logo cache error:', error)
    
    // Fallback to original logo.dev URL on error
    const resolvedParams = await params
    const [domain, sizeParam, formatParam] = resolvedParams.params
    const size = sizeParam || '32'
    const format = formatParam || 'png'
    const fallbackUrl = `https://img.logo.dev/${domain}?token=${LOGO_DEV_TOKEN}&size=${size}&format=${format}`
    
    console.log(`🔄 Fallback to original URL: ${fallbackUrl}`)
    
    try {
      const response = await fetch(fallbackUrl)
      const buffer = Buffer.from(await response.arrayBuffer())
      
      return new Response(new Uint8Array(buffer), {
        headers: {
          'Content-Type': getContentType(format),
          'Cache-Control': 'public, max-age=3600', // Shorter cache for fallback
        }
      })
    } catch (fallbackError) {
      console.error('Fallback failed:', fallbackError)
      return new Response('Logo not available', { status: 404 })
    }
  }
}

export const runtime = 'nodejs'