import { ImageResponse } from 'next/og'

export const runtime = 'edge'

export async function GET() {
  try {
    // Try to load fonts, but fall back gracefully if they fail
    let fonts = []
    try {
      const [regularFont, boldFont] = await Promise.all([
        fetch('https://fonts.gstatic.com/s/inter/v12/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuLyeMZhrib2Bg-4.woff2')
          .then((res) => res.arrayBuffer()),
        fetch('https://fonts.gstatic.com/s/inter/v12/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuLyfMZhrib2Bg-4.woff2')
          .then((res) => res.arrayBuffer())
      ])
      
      fonts = [
        {
          name: 'Inter',
          data: regularFont,
          weight: 400,
          style: 'normal',
        },
        {
          name: 'Inter',
          data: boldFont,
          weight: 700,
          style: 'normal',
        },
      ]
    } catch (fontError) {
      console.log('Font loading failed, using system fonts:', fontError)
      // Continue without custom fonts
    }

    return new ImageResponse(
      (
        <div
          style={{
            height: '100%',
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'linear-gradient(135deg, #000000 0%, #1a1a1a 100%)',
            fontFamily: fonts.length > 0 ? 'Inter' : 'system-ui, sans-serif',
          }}
        >
          {/* Background Pattern */}
          <div
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: 'radial-gradient(circle at 25% 25%, #f97316 0%, transparent 50%), radial-gradient(circle at 75% 75%, #dc2626 0%, transparent 50%)',
              opacity: 0.1,
            }}
          />
          
          {/* VibePHX Logo */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              marginBottom: '40px',
            }}
          >
            <div
              style={{
                fontSize: '48px',
                fontWeight: 'bold',
                background: 'linear-gradient(135deg, #f97316 0%, #dc2626 100%)',
                backgroundClip: 'text',
                color: 'transparent',
              }}
            >
              VibePHX
            </div>
          </div>

          {/* Main Title */}
          <div
            style={{
              fontSize: '64px',
              fontWeight: 'bold',
              color: 'white',
              textAlign: 'center',
              lineHeight: 1.1,
              maxWidth: '900px',
              marginBottom: '30px',
            }}
          >
            Ship a live AI-built app in one day
          </div>

          {/* Subtitle */}
          <div
            style={{
              fontSize: '28px',
              color: '#d1d5db',
              textAlign: 'center',
              marginBottom: '40px',
            }}
          >
            Oct 4, 2025 • Phoenix, AZ • $99
          </div>

          {/* Simple badge */}
          <div
            style={{
              padding: '15px 30px',
              background: '#f97316',
              color: 'black',
              fontSize: '20px',
              fontWeight: 'bold',
              borderRadius: '10px',
            }}
          >
            VibePHX Workshop
          </div>
        </div>
      ),
      {
        width: 1200,
        height: 630,
        fonts,
        headers: {
          'Cache-Control': 'public, max-age=86400, stale-while-revalidate=604800',
        },
      }
    )
  } catch (e: any) {
    console.log(`OG generation failed: ${e.message}`)
    
    // Fallback to static image
    try {
      const response = await fetch(new URL('/og-image.png', 'https://www.vibecodephx.com'))
      if (response.ok) {
        return new Response(response.body, {
          headers: {
            'Content-Type': 'image/png',
            'Cache-Control': 'public, max-age=31536000, immutable',
          },
        })
      }
    } catch (fallbackError) {
      console.log(`Static fallback failed: ${fallbackError.message}`)
    }
    
    return new Response(`Failed to generate the image`, {
      status: 500,
    })
  }
}