import { NextRequest } from 'next/server'
import { warmLogoCache, COMMON_LOGO_DOMAINS } from '@/lib/logoCache'

/**
 * Endpoint to warm the logo cache by pre-downloading commonly used logos
 * This can be called after deployment to ensure fast loading for all users
 */
export async function POST(req: NextRequest) {
  try {
    console.log('🔥 Starting logo cache warming...')
    
    const { domains, sizes } = await req.json().catch(() => ({}))
    
    const domainsToWarm = domains || COMMON_LOGO_DOMAINS
    const sizesToWarm = sizes || ['32', '64']
    
    console.log(`📦 Warming cache for ${domainsToWarm.length} domains, sizes: ${sizesToWarm.join(', ')}`)
    
    const result = await warmLogoCache(domainsToWarm, sizesToWarm)
    
    return Response.json({
      success: true,
      message: 'Logo cache warming completed',
      stats: result,
      warmed: {
        domains: domainsToWarm.length,
        sizes: sizesToWarm.length,
        total: domainsToWarm.length * sizesToWarm.length
      }
    })
    
  } catch (error) {
    console.error('Cache warming error:', error)
    return Response.json(
      { 
        success: false, 
        error: 'Failed to warm logo cache',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}

/**
 * GET endpoint to check cache status and manually trigger warming
 */
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const action = searchParams.get('action')
    
    if (action === 'warm') {
      // Trigger cache warming
      const result = await warmLogoCache(COMMON_LOGO_DOMAINS, ['32'])
      
      return Response.json({
        success: true,
        message: 'Cache warming triggered',
        stats: result
      })
    }
    
    // Default: return cache info
    return Response.json({
      success: true,
      message: 'Logo cache endpoint active',
      endpoints: {
        warm: '/api/logo-cache/warm?action=warm',
        logo: '/api/logo-cache/{domain}/{size}/{format}'
      },
      commonDomains: COMMON_LOGO_DOMAINS.length
    })
    
  } catch (error) {
    return Response.json(
      { success: false, error: 'Cache status check failed' },
      { status: 500 }
    )
  }
}

export const runtime = 'nodejs'