import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    const workshop = await prisma.workshop.findUnique({
      where: { id },
      include: {
        attendees: {
          include: {
            user: {
              select: {
                name: true,
                email: true
              }
            }
          }
        }
      }
    })

    if (!workshop) {
      return NextResponse.json({ error: 'Workshop not found' }, { status: 404 })
    }

    return NextResponse.json(workshop)
  } catch (error) {
    console.error('Failed to fetch workshop:', error)
    return NextResponse.json(
      { error: 'Failed to fetch workshop' },
      { status: 500 }
    )
  }
}
