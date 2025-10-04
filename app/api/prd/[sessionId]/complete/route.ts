import { NextRequest, NextResponse } from 'next/server'
import { stackServerApp } from '@/stack'
import { markPRDCompleted } from '@/lib/prd/completion-tracker'

// POST /api/prd/[sessionId]/complete - Mark PRD session as completed
export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ sessionId: string }> }
) {
  try {
    const user = await stackServerApp.getUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { sessionId } = await params

    // Mark PRD as completed
    const updatedSession = await markPRDCompleted(sessionId)

    return NextResponse.json({ success: true, session: updatedSession })
  } catch (error) {
    console.error('Error completing PRD session:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to complete PRD' },
      { status: 500 }
    )
  }
}
