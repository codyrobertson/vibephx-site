import { NextRequest, NextResponse } from 'next/server'
import { callLLM, streamLLM } from '@/lib/inference-gate'
import { stackServerApp } from '@/stack'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

// Test: imports added back
export async function GET() {
  return NextResponse.json({
    status: 'ok',
    message: 'Inference endpoint with imports is responding',
    timestamp: new Date().toISOString()
  })
}

// Test: imports added back
export async function POST(req: NextRequest) {
  return NextResponse.json({
    status: 'ok',
    message: 'POST endpoint with imports is responding',
    timestamp: new Date().toISOString()
  })
}

