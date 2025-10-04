import { NextRequest, NextResponse } from 'next/server'
import { stackServerApp } from '@/stack'
import { prisma } from '@/lib/prisma'

// PATCH - Update workshop content and header image
export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ workshopId: string }> }
) {
  try {
    const user = await stackServerApp.getUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // TODO: Add admin role check here

    const { workshopId } = await params
    const body = await req.json()
    const { content, headerImage } = body

    const workshop = await prisma.workshop.update({
      where: { id: workshopId },
      data: {
        content: content !== undefined ? content : undefined,
        headerImage: headerImage !== undefined ? headerImage : undefined
      }
    })

    return NextResponse.json({ success: true, workshop })
  } catch (error) {
    console.error('Failed to update workshop:', error)
    return NextResponse.json(
      { error: 'Failed to update workshop' },
      { status: 500 }
    )
  }
}

// DELETE - Delete a workshop
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ workshopId: string }> }
) {
  try {
    const user = await stackServerApp.getUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // TODO: Add admin role check here

    const { workshopId } = await params

    await prisma.workshop.delete({
      where: { id: workshopId }
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Failed to delete workshop:', error)
    return NextResponse.json(
      { error: 'Failed to delete workshop' },
      { status: 500 }
    )
  }
}
