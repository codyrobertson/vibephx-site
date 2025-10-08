import { NextResponse, NextRequest } from 'next/server'

/**
 * Resource generation cron endpoint. Protected via CRON_SECRET.
 * Runs daily at 2:00 PM UTC to generate resources.
 */
export async function GET(req: NextRequest) {
  const auth = req.headers.get('authorization')
  if (auth !== `Bearer ${process.env.CRON_SECRET}`) {
    return new NextResponse('Unauthorized', { status: 401 })
  }

  try {
    // Trigger resource generation
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
    const response = await fetch(`${baseUrl}/api/resources/generate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        technology: 'auto', // Let the system pick a topic
      }),
    })

    const data = await response.json()

    if (!response.ok) {
      console.error('[Cron/Resources] Generation failed:', data)
      return NextResponse.json({ error: data.error || 'Generation failed' }, { status: 500 })
    }

    console.log('[Cron/Resources] Successfully triggered resource generation:', data)
    return NextResponse.json({ ok: true, data })
  } catch (error: any) {
    console.error('[Cron/Resources] Error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
