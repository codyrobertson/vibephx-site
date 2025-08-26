import { ImageResponse } from 'next/og'
import { NextRequest } from 'next/server'

export const runtime = 'edge'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    
    // Extract parameters with defaults
    const title = searchParams.get('title') || 'Ship a live AI-built app in one day'
    const subtitle = searchParams.get('subtitle') || 'Sept 13, 2025 • Phoenix, AZ • $99'
    const type = searchParams.get('type') || 'workshop'

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
            position: 'relative',
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
              fontSize: '72px',
              fontWeight: 'bold',
              color: 'white',
              textAlign: 'center',
              lineHeight: 1.1,
              maxWidth: '1000px',
              marginBottom: '30px',
            }}
          >
            {title}
          </div>

          {/* Subtitle */}
          <div
            style={{
              fontSize: '32px',
              color: '#d1d5db',
              textAlign: 'center',
              marginBottom: '40px',
            }}
          >
            {subtitle}
          </div>

          {/* Feature Pills */}
          <div
            style={{
              display: 'flex',
              gap: '20px',
              marginBottom: '60px',
            }}
          >
            <div
              style={{
                padding: '12px 24px',
                background: 'rgba(249, 115, 22, 0.2)',
                border: '2px solid #f97316',
                borderRadius: '50px',
                color: '#f97316',
                fontSize: '20px',
                fontWeight: '600',
              }}
            >
              Working URL by 5pm
            </div>
            <div
              style={{
                padding: '12px 24px',
                background: 'rgba(220, 38, 38, 0.2)',
                border: '2px solid #dc2626',
                borderRadius: '50px',
                color: '#dc2626',
                fontSize: '20px',
                fontWeight: '600',
              }}
            >
              AI Workflow + Cost Controls
            </div>
          </div>

          {/* Mentor Badge */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '15px',
              padding: '20px 30px',
              background: 'rgba(31, 41, 55, 0.8)',
              borderRadius: '15px',
              border: '1px solid #374151',
            }}
          >
            <div
              style={{
                width: '60px',
                height: '60px',
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #f97316 0%, #dc2626 100%)',
              }}
            />
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <div
                style={{
                  fontSize: '24px',
                  fontWeight: 'bold',
                  color: 'white',
                  marginBottom: '5px',
                }}
              >
                Cody Robertson
              </div>
              <div
                style={{
                  fontSize: '16px',
                  color: '#9ca3af',
                }}
              >
                10+ yrs shipping products to 100K+ users
              </div>
            </div>
            <div
              style={{
                padding: '6px 12px',
                background: '#f97316',
                color: 'black',
                fontSize: '14px',
                fontWeight: 'bold',
                borderRadius: '20px',
                marginLeft: '15px',
              }}
            >
              YOUR MENTOR
            </div>
          </div>

          {/* Bottom decoration */}
          <div
            style={{
              position: 'absolute',
              bottom: 0,
              left: 0,
              right: 0,
              height: '6px',
              background: 'linear-gradient(90deg, #f97316 0%, #dc2626 100%)',
            }}
          />
        </div>
      ),
      {
        width: 1200,
        height: 630,
      }
    )
  } catch (e: any) {
    console.log(`${e.message}`)
    return new Response(`Failed to generate the image`, {
      status: 500,
    })
  }
}