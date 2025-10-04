import { NextRequest, NextResponse } from 'next/server'
import { stackServerApp } from '@/stack'
import { prisma } from '@/lib/prisma'

interface RouteContext {
  params: Promise<{ id: string }>
}

// DELETE - Remove an attendee from a workshop
export async function DELETE(req: NextRequest, context: RouteContext) {
  try {
    const user = await stackServerApp.getUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // TODO: Add admin role check here

    const { id } = await context.params

    // Delete the attendance record
    await prisma.workshopAttendance.delete({
      where: { id }
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Failed to delete attendee:', error)
    return NextResponse.json(
      { error: 'Failed to delete attendee' },
      { status: 500 }
    )
  }
}
