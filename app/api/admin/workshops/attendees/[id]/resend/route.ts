import { NextRequest, NextResponse } from 'next/server'
import { stackServerApp } from '@/stack'
import { prisma } from '@/lib/prisma'
import { resend } from '@/lib/resend'
import WorkshopWelcomeEmail from '@/emails/WorkshopWelcome'

interface RouteContext {
  params: Promise<{ id: string }>
}

// POST - Resend welcome email to an attendee
export async function POST(req: NextRequest, context: RouteContext) {
  try {
    const user = await stackServerApp.getUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // TODO: Add admin role check here

    const { id } = await context.params

    // Get attendance record with user and workshop details
    const attendance = await prisma.workshopAttendance.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            email: true,
            name: true
          }
        },
        workshop: {
          select: {
            title: true,
            date: true,
            location: true
          }
        }
      }
    })

    if (!attendance) {
      return NextResponse.json(
        { error: 'Attendance record not found' },
        { status: 404 }
      )
    }

    // Send welcome email
    console.log('[DEV] [RESEND] Attempting to resend email to:', attendance.user.email)
    console.log('[DEV] [RESEND] Workshop details:', {
      title: attendance.workshop.title,
      date: attendance.workshop.date,
      credits: attendance.creditsAwarded
    })

    const emailData = {
      from: 'VibeCode PHX <noreply@vibecodephx.com>',
      to: attendance.user.email,
      subject: `Welcome to VibeCode PHX - ${attendance.workshop.title}`,
      react: WorkshopWelcomeEmail({
        attendeeName: attendance.user.name || attendance.user.email.split('@')[0],
        workshopTitle: attendance.workshop.title,
        workshopDate: attendance.workshop.date.toISOString(),
        workshopLocation: attendance.workshop.location,
        creditsAwarded: attendance.creditsAwarded,
        hasAccount: true
      })
    }

    console.log('[DEV] [RESEND] Email payload:', {
      from: emailData.from,
      to: emailData.to,
      subject: emailData.subject
    })

    const result = await resend.emails.send(emailData)
    console.log('[DEV] [RESEND] Resend API response:', result)

    // Update attendance record with new email sent timestamp
    await prisma.workshopAttendance.update({
      where: { id },
      data: {
        emailSentAt: new Date(),
        // Reset opened/clicked since this is a new email send
        emailOpenedAt: null,
        emailClickedAt: null
      }
    })

    console.log('[DEV] [RESEND] Email resent successfully, attendance record updated')

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Failed to resend email:', error)
    return NextResponse.json(
      { error: 'Failed to resend email' },
      { status: 500 }
    )
  }
}
