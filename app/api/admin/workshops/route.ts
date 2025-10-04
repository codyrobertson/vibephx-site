import { NextRequest, NextResponse } from 'next/server'
import { stackServerApp } from '@/stack'
import { prisma } from '@/lib/prisma'

// GET - Fetch all workshops with attendees
export async function GET(req: NextRequest) {
  try {
    const startTime = Date.now()

    console.log('[PERF] Starting workshops fetch...')
    const authStart = Date.now()
    const user = await stackServerApp.getUser()
    console.log(`[PERF] Auth check took ${Date.now() - authStart}ms`)

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // TODO: Add admin role check here
    // For now, allow any authenticated user to access admin

    const dbStart = Date.now()
    const workshops = await prisma.workshop.findMany({
      select: {
        id: true,
        title: true,
        description: true,
        date: true,
        location: true,
        credits: true,
        attendees: {
          select: {
            id: true,
            userId: true,
            creditsAwarded: true,
            creditsApplied: true,
            emailSentAt: true,
            emailOpenedAt: true,
            emailClickedAt: true,
            createdAt: true,
            user: {
              select: {
                email: true,
                name: true
              }
            }
          },
          orderBy: {
            createdAt: 'desc'
          }
        }
      },
      orderBy: {
        date: 'desc'
      }
    })
    console.log(`[PERF] Database query took ${Date.now() - dbStart}ms`)
    console.log(`[PERF] Total request took ${Date.now() - startTime}ms`)

    return NextResponse.json({ workshops })
  } catch (error) {
    console.error('Failed to fetch workshops:', error)
    return NextResponse.json(
      { error: 'Failed to fetch workshops' },
      { status: 500 }
    )
  }
}

// POST - Create a new workshop
export async function POST(req: NextRequest) {
  try {
    const user = await stackServerApp.getUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // TODO: Add admin role check here

    const body = await req.json()
    const { title, description, date, location, credits } = body

    const workshop = await prisma.workshop.create({
      data: {
        title,
        description,
        date: new Date(date),
        location,
        credits: parseFloat(credits)
      },
      include: {
        attendees: {
          include: {
            user: {
              select: {
                email: true,
                name: true
              }
            }
          }
        }
      }
    })

    return NextResponse.json({ workshop })
  } catch (error) {
    console.error('Failed to create workshop:', error)
    return NextResponse.json(
      { error: 'Failed to create workshop' },
      { status: 500 }
    )
  }
}
