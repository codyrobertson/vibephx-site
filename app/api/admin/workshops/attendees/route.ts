import { NextRequest, NextResponse } from 'next/server'
import { stackServerApp } from '@/stack'
import { prisma } from '@/lib/prisma'
import { resend } from '@/lib/resend'
import WorkshopWelcomeEmail from '@/emails/WorkshopWelcome'

// POST - Add an attendee to a workshop
export async function POST(req: NextRequest) {
  try {
    const user = await stackServerApp.getUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // TODO: Add admin role check here

    const body = await req.json()
    const { workshopId, attendeeEmail, creditsAwarded } = body

    // Find user by email in Prisma
    const attendeeUser = await prisma.user.findUnique({
      where: { email: attendeeEmail }
    })

    if (!attendeeUser) {
      return NextResponse.json(
        { error: 'User not found. They need to sign up and log in first.' },
        { status: 404 }
      )
    }

    // Check if already attending
    const existing = await prisma.workshopAttendance.findUnique({
      where: {
        userId_workshopId: {
          userId: attendeeUser.id,
          workshopId
        }
      }
    })

    if (existing) {
      return NextResponse.json(
        { error: 'User is already attending this workshop' },
        { status: 400 }
      )
    }

    // Get workshop details for email
    const workshop = await prisma.workshop.findUnique({
      where: { id: workshopId }
    })

    if (!workshop) {
      return NextResponse.json(
        { error: 'Workshop not found' },
        { status: 404 }
      )
    }

    // Create attendance record
    const attendance = await prisma.workshopAttendance.create({
      data: {
        userId: attendeeUser.id,
        workshopId,
        creditsAwarded: parseFloat(creditsAwarded)
      },
      include: {
        user: {
          select: {
            email: true,
            name: true
          }
        }
      }
    })

    // Send welcome email
    try {
      console.log('[DEV] Attempting to send email to:', attendeeUser.email)
      console.log('[DEV] Workshop details:', {
        title: workshop.title,
        date: workshop.date,
        credits: creditsAwarded
      })

      const emailData = {
        from: 'VibeCode PHX <noreply@vibecodephx.com>',
        to: attendeeUser.email,
        subject: `Welcome to VibeCode PHX - ${workshop.title}`,
        react: WorkshopWelcomeEmail({
          attendeeName: attendeeUser.name || attendeeUser.email.split('@')[0],
          workshopTitle: workshop.title,
          workshopDate: workshop.date.toISOString(),
          workshopLocation: workshop.location,
          creditsAwarded: parseFloat(creditsAwarded),
          hasAccount: true // They exist in our database
        })
      }

      console.log('[DEV] Email payload:', {
        from: emailData.from,
        to: emailData.to,
        subject: emailData.subject
      })

      const result = await resend.emails.send(emailData)
      console.log('[DEV] Resend API response:', result)

      // Update attendance record with email sent timestamp
      await prisma.workshopAttendance.update({
        where: { id: attendance.id },
        data: { emailSentAt: new Date() }
      })

      console.log('[DEV] Email sent successfully, attendance record updated')
    } catch (emailError) {
      console.error('[ERROR] Failed to send welcome email:', emailError)
      console.error('[ERROR] Error details:', JSON.stringify(emailError, null, 2))
      // Don't fail the request if email fails
    }

    return NextResponse.json({ attendance })
  } catch (error) {
    console.error('Failed to add attendee:', error)
    return NextResponse.json(
      { error: 'Failed to add attendee' },
      { status: 500 }
    )
  }
}
