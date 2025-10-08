import { NextResponse, NextRequest } from 'next/server'

/**
 * Blog generation cron endpoint. Protected via CRON_SECRET.
 * Runs daily at 10:00 AM UTC to generate blog posts.
 */
export async function GET(req: NextRequest) {
  const auth = req.headers.get('authorization')
  if (auth !== `Bearer ${process.env.CRON_SECRET}`) {
    return new NextResponse('Unauthorized', { status: 401 })
  }

  try {
    // Trigger blog post generation
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
    const response = await fetch(`${baseUrl}/api/blog/generate-agentic`, {
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
      console.error('[Cron/Blog] Generation failed:', data)
      return NextResponse.json({ error: data.error || 'Generation failed' }, { status: 500 })
    }

    console.log('[Cron/Blog] Successfully triggered blog generation:', data)
    return NextResponse.json({ ok: true, data })
  } catch (error: any) {
    console.error('[Cron/Blog] Error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
