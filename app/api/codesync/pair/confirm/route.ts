import { NextResponse } from 'next/server'
import { confirmPair } from '@/lib/codesync-store'

function cors(res: NextResponse) {
  res.headers.set('Access-Control-Allow-Origin', '*')
  res.headers.set('Access-Control-Allow-Methods', 'POST, OPTIONS')
  res.headers.set('Access-Control-Allow-Headers', 'Content-Type, X-Installation-Id, X-Access-Token')
  return res
}

export async function OPTIONS() {
  return cors(new NextResponse(null, { status: 204 }))
}

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const code = String(body?.code || '')
    if (!code) return cors(NextResponse.json({ error: 'code required' }, { status: 400 }))
    const ok = confirmPair(code)
    if (!ok) return cors(NextResponse.json({ error: 'invalid_or_expired' }, { status: 400 }))
    return cors(NextResponse.json(ok))
  } catch (e: any) {
    return cors(NextResponse.json({ error: e?.message || 'bad_request' }, { status: 400 }))
  }
}
