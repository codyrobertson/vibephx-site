import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET: List all topics
export async function GET(req: NextRequest) {
  try {
    const searchParams = req.nextUrl.searchParams
    const status = searchParams.get('status')

    const topics = await prisma.resourceTopic.findMany({
      where: status ? { status: status as any } : undefined,
      orderBy: [
        { priority: 'desc' },
        { createdAt: 'asc' }
      ],
      include: {
        _count: true
      }
    })

    const stats = {
      total: topics.length,
      queued: topics.filter(t => t.status === 'QUEUED').length,
      generating: topics.filter(t => t.status === 'GENERATING').length,
      completed: topics.filter(t => t.status === 'COMPLETED').length,
      failed: topics.filter(t => t.status === 'FAILED').length
    }

    return NextResponse.json({ topics, stats })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

// POST: Add new topic to queue
export async function POST(req: NextRequest) {
  try {
    const { technology, priority = 5, scheduledFor, notes } = await req.json()

    if (!technology) {
      return NextResponse.json({ error: 'Technology required' }, { status: 400 })
    }

    // Check if already exists
    const existing = await prisma.resourceTopic.findUnique({
      where: { technology }
    })

    if (existing) {
      return NextResponse.json({
        error: 'Topic already queued',
        topic: existing
      }, { status: 400 })
    }

    const topic = await prisma.resourceTopic.create({
      data: {
        technology,
        priority,
        scheduledFor: scheduledFor ? new Date(scheduledFor) : null,
        notes,
        addedBy: 'manual'
      }
    })

    return NextResponse.json({ topic })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

// DELETE: Remove topic from queue
export async function DELETE(req: NextRequest) {
  try {
    const { id } = await req.json()

    await prisma.resourceTopic.delete({
      where: { id }
    })

    return NextResponse.json({ success: true })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
