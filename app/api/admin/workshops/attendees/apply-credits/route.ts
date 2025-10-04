import { NextRequest, NextResponse } from 'next/server'
import { stackServerApp } from '@/stack'
import { prisma } from '@/lib/prisma'

// POST - Apply credits to user balance
export async function POST(req: NextRequest) {
  try {
    const user = await stackServerApp.getUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // TODO: Add admin role check here

    const body = await req.json()
    const { attendanceId } = body

    // Get attendance record
    const attendance = await prisma.workshopAttendance.findUnique({
      where: { id: attendanceId },
      include: {
        user: true
      }
    })

    if (!attendance) {
      return NextResponse.json(
        { error: 'Attendance record not found' },
        { status: 404 }
      )
    }

    if (attendance.creditsApplied) {
      return NextResponse.json(
        { error: 'Credits already applied' },
        { status: 400 }
      )
    }

    // Apply credits in a transaction
    const result = await prisma.$transaction([
      // Update user's credit balance
      prisma.user.update({
        where: { id: attendance.userId },
        data: {
          creditsBalance: {
            increment: attendance.creditsAwarded
          }
        }
      }),
      // Mark credits as applied
      prisma.workshopAttendance.update({
        where: { id: attendanceId },
        data: {
          creditsApplied: true
        }
      })
    ])

    return NextResponse.json({
      success: true,
      newBalance: result[0].creditsBalance
    })
  } catch (error) {
    console.error('Failed to apply credits:', error)
    return NextResponse.json(
      { error: 'Failed to apply credits' },
      { status: 500 }
    )
  }
}
