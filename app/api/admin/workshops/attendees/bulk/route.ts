import { NextRequest, NextResponse } from 'next/server'
import { stackServerApp } from '@/stack'
import { prisma } from '@/lib/prisma'
import { resend } from '@/lib/resend'
import WorkshopWelcomeEmail from '@/emails/WorkshopWelcome'

// POST - Bulk import attendees
export async function POST(req: NextRequest) {
  try {
    const user = await stackServerApp.getUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // TODO: Add admin role check here

    const body = await req.json()
    const { workshopId, emails, creditsAwarded } = body

    if (!Array.isArray(emails) || emails.length === 0) {
      return NextResponse.json(
        { error: 'Emails array is required' },
        { status: 400 }
      )
    }

    // Get workshop details for emails
    const workshop = await prisma.workshop.findUnique({
      where: { id: workshopId }
    })

    if (!workshop) {
      return NextResponse.json(
        { error: 'Workshop not found' },
        { status: 404 }
      )
    }

    const results = {
      total: emails.length,
      succeeded: 0,
      failed: 0,
      errors: [] as Array<{ email: string; reason: string }>
    }

    // Process each email
    for (const email of emails) {
      try {
        // Find user by email
        const attendeeUser = await prisma.user.findUnique({
          where: { email: email.trim() }
        })

        if (!attendeeUser) {
          results.failed++
          results.errors.push({
            email,
            reason: 'User not found'
          })
          continue
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
          results.failed++
          results.errors.push({
            email,
            reason: 'Already attending'
          })
          continue
        }

        // Create attendance record
        const attendance = await prisma.workshopAttendance.create({
          data: {
            userId: attendeeUser.id,
            workshopId,
            creditsAwarded: parseFloat(creditsAwarded)
          }
        })

        // Send welcome email
        try {
          console.log(`[DEV] [BULK] Attempting to send email to: ${email}`)

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

          console.log(`[DEV] [BULK] Email payload:`, {
            from: emailData.from,
            to: emailData.to,
            subject: emailData.subject
          })

          const result = await resend.emails.send(emailData)
          console.log(`[DEV] [BULK] Resend API response for ${email}:`, result)

          // Update attendance record with email sent timestamp
          await prisma.workshopAttendance.update({
            where: { id: attendance.id },
            data: { emailSentAt: new Date() }
          })

          console.log(`[DEV] [BULK] Email sent successfully to ${email}`)
        } catch (emailError) {
          console.error(`[ERROR] [BULK] Failed to send email to ${email}:`, emailError)
          console.error(`[ERROR] [BULK] Error details:`, JSON.stringify(emailError, null, 2))
          // Don't fail the import if email fails
        }

        results.succeeded++
      } catch (error) {
        console.error(`Failed to add attendee ${email}:`, error)
        results.failed++
        results.errors.push({
          email,
          reason: 'Database error'
        })
      }
    }

    return NextResponse.json(results)
  } catch (error) {
    console.error('Failed to bulk import attendees:', error)
    return NextResponse.json(
      { error: 'Failed to bulk import attendees' },
      { status: 500 }
    )
  }
}
