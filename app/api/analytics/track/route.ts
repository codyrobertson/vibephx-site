import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(req: NextRequest) {
  try {
    const {
      userId,
      eventType,
      eventCategory,
      eventName,
      path,
      referrer,
      properties,
      metadata,
      duration,
    } = await req.json()

    // Validate required fields
    if (!userId || !eventType || !eventCategory || !eventName) {
      return NextResponse.json(
        { error: 'Missing required fields: userId, eventType, eventCategory, eventName' },
        { status: 400 }
      )
    }

    // Extract user agent from headers
    const userAgent = req.headers.get('user-agent')

    // Create activity record
    const activity = await prisma.userActivity.create({
      data: {
        userId,
        eventType,
        eventCategory,
        eventName,
        path: path || null,
        referrer: referrer || null,
        userAgent,
        properties: properties || null,
        metadata: metadata || null,
        duration: duration || null,
      },
    })

    return NextResponse.json({ success: true, activityId: activity.id })
  } catch (error: any) {
    console.error('[Analytics Track] Error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

// Batch track multiple events at once
export async function PUT(req: NextRequest) {
  try {
    const { events } = await req.json()

    if (!Array.isArray(events) || events.length === 0) {
      return NextResponse.json(
        { error: 'events must be a non-empty array' },
        { status: 400 }
      )
    }

    const userAgent = req.headers.get('user-agent')

    // Batch create activities
    const activities = await prisma.userActivity.createMany({
      data: events.map(event => ({
        userId: event.userId,
        eventType: event.eventType,
        eventCategory: event.eventCategory,
        eventName: event.eventName,
        path: event.path || null,
        referrer: event.referrer || null,
        userAgent,
        properties: event.properties || null,
        metadata: event.metadata || null,
        duration: event.duration || null,
      })),
    })

    return NextResponse.json({ success: true, count: activities.count })
  } catch (error: any) {
    console.error('[Analytics Batch Track] Error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
