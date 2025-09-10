import { NextResponse } from 'next/server'
import { auth, saveTokens } from '@/lib/codesync-store'

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
  const installationId = req.headers.get('x-installation-id')
  const token = req.headers.get('x-access-token')
  if (!auth(installationId, token)) {
    return cors(NextResponse.json({ error: 'unauthorized' }, { status: 401 }))
  }
  try {
    const body = await req.json()
    if (!body || typeof body !== 'object') throw new Error('invalid_body')
    saveTokens(installationId!, body)
    return cors(NextResponse.json({ ok: true }))
  } catch (e: any) {
    return cors(NextResponse.json({ error: e?.message || 'bad_request' }, { status: 400 }))
  }
}
