import { NextResponse } from 'next/server'
import { startPair } from '@/lib/codesync-store'

function cors(res: NextResponse) {
  res.headers.set('Access-Control-Allow-Origin', '*')
  res.headers.set('Access-Control-Allow-Methods', 'POST, OPTIONS')
  res.headers.set('Access-Control-Allow-Headers', 'Content-Type, X-Installation-Id, X-Access-Token')
  return res
}

export async function OPTIONS() {
  return cors(new NextResponse(null, { status: 204 }))
}

export async function POST() {
  const { code, installationId, expiresAt } = startPair()
  return cors(NextResponse.json({ code, installationId, expiresAt }))
}
