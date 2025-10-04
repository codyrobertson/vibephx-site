import { NextRequest, NextResponse } from 'next/server'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

// Minimal GET handler for debugging
export async function GET() {
  return NextResponse.json({
    status: 'ok',
    message: 'Inference endpoint is responding',
    timestamp: new Date().toISOString()
  })
}

// Minimal POST handler for debugging
export async function POST(req: NextRequest) {
  return NextResponse.json({
    status: 'ok',
    message: 'POST endpoint is responding',
    timestamp: new Date().toISOString()
  })
}

