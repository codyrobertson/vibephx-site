import { NextRequest, NextResponse } from 'next/server'
import { stackServerApp } from '@/stack'
import { prisma } from '@/lib/prisma'

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
