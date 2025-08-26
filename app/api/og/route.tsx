import { ImageResponse } from 'next/og'

export const runtime = 'edge'

export async function GET() {
  try {
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
            fontFamily: 'Geist',
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
            Sept 13, 2025 • Phoenix, AZ • $99
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
        fonts: [
          {
            name: 'Geist',
            data: await fetch('https://fonts.gstatic.com/s/inter/v12/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuLyeMZhrib2Bg-4.woff2')
              .then((res) => res.arrayBuffer()),
            weight: 400,
            style: 'normal',
          },
          {
            name: 'Geist',
            data: await fetch('https://fonts.gstatic.com/s/inter/v12/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuLyfMZhrib2Bg-4.woff2')
              .then((res) => res.arrayBuffer()),
            weight: 700,
            style: 'normal',
          },
        ],
      }
    )
  } catch (e: any) {
    console.log(`${e.message}`)
    return new Response(`Failed to generate the image`, {
      status: 500,
    })
  }
}