import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { stackServerApp } from '@/stack'

export const runtime = 'nodejs'

// Save or update PRD session
export async function POST(req: NextRequest) {
  try {
    const user = await stackServerApp.getUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await req.json()
    const {
      sessionId,
      projectId,
      initialIntent,
      audience,
      motivation,
      sda,
      featuresRaw,
      featuresMvp,
      featuresStretch,
      dbChoice,
      selectedStack,
      integrations,
      prdMarkdown,
      eightLinePrompt,
      acceptanceCriteria,
      phase,
      messages,
      completed
    } = body

    // Use upsert to handle both create and update, avoiding P2025 if session was deleted
    const session = await prisma.pRDSession.upsert({
      where: { id: sessionId || 'new' },
      update: {
        audience,
        motivation,
        sda,
        featuresRaw: featuresRaw || [],
        featuresMvp: featuresMvp || [],
        featuresStretch: featuresStretch || [],
        dbChoice,
        selectedStack,
        integrations: integrations || [],
        prdMarkdown,
        eightLinePrompt,
        acceptanceCriteria: acceptanceCriteria || [],
        phase,
        messages: messages || [],
        completed: completed || false,
        updatedAt: new Date()
      },
      create: {
        userId: user.id,
        projectId,
        initialIntent: initialIntent || '',
        audience,
        motivation,
        sda,
        featuresRaw: featuresRaw || [],
        featuresMvp: featuresMvp || [],
        featuresStretch: featuresStretch || [],
        dbChoice,
        selectedStack,
        integrations: integrations || [],
        prdMarkdown,
        eightLinePrompt,
        acceptanceCriteria: acceptanceCriteria || [],
        phase: phase || 'intro',
        messages: messages || [],
        completed: completed || false
      }
    })
    return NextResponse.json({ session })
  } catch (error: any) {
    console.error('Session save error:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to save session' },
      { status: 500 }
    )
  }
}

// Get user's PRD sessions
export async function GET(req: NextRequest) {
  try {
    const user = await stackServerApp.getUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(req.url)
    const sessionId = searchParams.get('id')
    const projectId = searchParams.get('projectId')

    if (sessionId) {
      // Get specific session
      const session = await prisma.pRDSession.findUnique({
        where: { id: sessionId }
      })
      if (!session || session.userId !== user.id) {
        return NextResponse.json({ error: 'Not found' }, { status: 404 })
      }
      return NextResponse.json({ session })
    }

    if (projectId) {
      // Get sessions for a project
      const sessions = await prisma.pRDSession.findMany({
        where: {
          userId: user.id,
          projectId
        },
        orderBy: { createdAt: 'desc' }
      })
      return NextResponse.json({ sessions })
    }

    // Get all user sessions
    const sessions = await prisma.pRDSession.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: 'desc' },
      take: 50
    })

    return NextResponse.json({ sessions })
  } catch (error: any) {
    console.error('Session fetch error:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to fetch sessions' },
      { status: 500 }
    )
  }
}

