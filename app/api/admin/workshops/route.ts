import { NextRequest, NextResponse } from 'next/server'
import { stackServerApp } from '@/stack'
import { prisma } from '@/lib/prisma'

// Sanitize workshop files to remove base64 data
function sanitizeWorkshopFiles(workshop: any) {
  if (workshop.files && Array.isArray(workshop.files)) {
    workshop.files = workshop.files.map((file: any) => ({
      name: file.name,
      size: file.size,
      type: file.type,
      uploadedAt: file.uploadedAt,
      // Only include URL if it's not base64
      url: file.url && !file.url.includes('base64') ? file.url : undefined
    })).filter((file: any) => file.url) // Remove files without valid URLs
  }
  return workshop
}

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
        content: true,
        headerImage: true,
        files: true,
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

    // Sanitize workshops to remove base64 data
    const sanitizedWorkshops = workshops.map(sanitizeWorkshopFiles)

    return NextResponse.json({ workshops: sanitizedWorkshops })
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

    return NextResponse.json({ workshop: sanitizeWorkshopFiles(workshop) })
  } catch (error) {
    console.error('Failed to create workshop:', error)
    return NextResponse.json(
      { error: 'Failed to create workshop' },
      { status: 500 }
    )
  }
}
