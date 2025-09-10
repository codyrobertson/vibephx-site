import { NextResponse } from 'next/server'
import { auth, getTokens } from '@/lib/codesync-store'

function cors(res: NextResponse) {
  res.headers.set('Access-Control-Allow-Origin', '*')
  res.headers.set('Access-Control-Allow-Methods', 'GET, OPTIONS')
  res.headers.set('Access-Control-Allow-Headers', 'Content-Type, X-Installation-Id, X-Access-Token')
  return res
}

export async function OPTIONS() {
  return cors(new NextResponse(null, { status: 204 }))
}

export async function GET(req: Request) {
  const installationId = req.headers.get('x-installation-id')
  const token = req.headers.get('x-access-token')
  if (!auth(installationId, token)) {
    return cors(NextResponse.json({ error: 'unauthorized' }, { status: 401 }))
  }
  const data = getTokens(installationId!)
  return cors(NextResponse.json({ payload: data || null }))
}
