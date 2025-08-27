/**
 * Logo caching utilities
 * 
 * This module provides functions to generate cached logo URLs that download
 * logos once and serve them from local cache for all subsequent requests.
 */

/**
 * Generate a cached logo URL that will be downloaded once and served locally
 * 
 * @param domain - The domain to get the logo for (e.g., 'nextjs.org')
 * @param size - Logo size in pixels (default: '32')
 * @param format - Image format (default: 'png')
 * @returns Local API URL that serves cached logo
 */
export function getCachedLogoUrl(
  domain: string,
  size: string = '32',
  format: string = 'png'
): string {
  // Extract domain from URL if full URL is provided
  const cleanDomain = domain.replace(/^https?:\/\//, '').replace(/^www\./, '')
  
  return `/api/logo-cache/${cleanDomain}/${size}/${format}`
}

/**
 * Generate multiple cached logo URLs for different sizes
 * Useful for responsive images or different contexts
 */
export function getCachedLogoUrls(
  domain: string,
  sizes: string[] = ['32', '64', '128'],
  format: string = 'png'
): Record<string, string> {
  const urls: Record<string, string> = {}
  
  sizes.forEach(size => {
    urls[`${size}px`] = getCachedLogoUrl(domain, size, format)
  })
  
  return urls
}

/**
 * Preload/warm cache for commonly used logos
 * Call this to download and cache logos proactively
 */
export async function warmLogoCache(domains: string[], sizes: string[] = ['32']) {
  const promises = domains.flatMap(domain =>
    sizes.map(size => {
      const url = getCachedLogoUrl(domain, size)
      return fetch(url).catch(err => 
        console.warn(`Failed to warm cache for ${domain}:`, err.message)
      )
    })
  )
  
  const results = await Promise.allSettled(promises)
  const successful = results.filter(r => r.status === 'fulfilled').length
  const failed = results.filter(r => r.status === 'rejected').length
  
  console.log(`🔥 Logo cache warmed: ${successful} successful, ${failed} failed`)
  
  return { successful, failed }
}

/**
 * Common domains used in the app - can be used for cache warming
 */
export const COMMON_LOGO_DOMAINS = [
  'nextjs.org',
  'react.dev',
  'vuejs.org',
  'nodejs.org',
  'supabase.com',
  'firebase.google.com',
  'planetscale.com',
  'vercel.com',
  'openai.com',
  'anthropic.com'
]