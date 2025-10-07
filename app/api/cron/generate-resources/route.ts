import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { resourceGenerator } from '@/lib/services/resource-generator'
import { generateFeaturedImage } from '@/lib/services/image-generator'
import { sendAdminNotification } from '@/lib/services/email'

export const maxDuration = 300

export async function GET(req: NextRequest) {
  // Verify cron secret
  const authHeader = req.headers.get('authorization')
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const startTime = Date.now()

  // Create job record
  const job = await prisma.generationJob.create({
    data: {
      type: 'resource_article',
      triggeredBy: 'cron'
    }
  })

  let itemsProcessed = 0
  let itemsSucceeded = 0
  let itemsFailed = 0
  const errors: any[] = []

  try {
    // Find queued topics
    const topics = await prisma.resourceTopic.findMany({
      where: {
        status: 'QUEUED',
        OR: [
          { scheduledFor: null },
          { scheduledFor: { lte: new Date() } }
        ]
      },
      orderBy: [
        { priority: 'desc' },
        { createdAt: 'asc' }
      ],
      take: 3 // Process max 3 per run to stay within time limits
    })

    for (const topic of topics) {
      itemsProcessed++

      try {
        // Update status
        await prisma.resourceTopic.update({
          where: { id: topic.id },
          data: {
            status: 'GENERATING',
            generationStartedAt: new Date(),
            attemptCount: { increment: 1 },
            lastAttemptAt: new Date()
          }
        })

        // Generate article
        const result = await resourceGenerator.generate(topic.technology)

        if (result.success && result.draftId) {
          // Generate image
          try {
            const draft = await prisma.resourceDraft.findUnique({
              where: { id: result.draftId }
            })

            if (draft) {
              const image = await generateFeaturedImage(topic.technology, draft.title)
              await prisma.resourceDraft.update({
                where: { id: result.draftId },
                data: { featuredImage: image.url, imagePrompt: image.prompt }
              })
            }
          } catch (imgError) {
            console.error('Image generation failed:', imgError)
          }

          // Send notification
          try {
            await sendAdminNotification(result.draftId)
            await prisma.resourceDraft.update({
              where: { id: result.draftId },
              data: { adminNotified: true, notifiedAt: new Date() }
            })
          } catch (emailError) {
            console.error('Email notification failed:', emailError)
          }

          // Update topic
          await prisma.resourceTopic.update({
            where: { id: topic.id },
            data: {
              status: 'COMPLETED',
              generationCompletedAt: new Date(),
              draftId: result.draftId
            }
          })

          itemsSucceeded++
        } else {
          throw new Error(result.error || 'Generation failed')
        }

      } catch (error: any) {
        itemsFailed++
        errors.push({
          topic: topic.technology,
          error: error.message
        })

        await prisma.resourceTopic.update({
          where: { id: topic.id },
          data: {
            status: 'FAILED',
            errorMessage: error.message
          }
        })
      }
    }

    // Update job
    await prisma.generationJob.update({
      where: { id: job.id },
      data: {
        status: 'COMPLETED',
        itemsProcessed,
        itemsSucceeded,
        itemsFailed,
        errors: errors.length > 0 ? errors : null,
        completedAt: new Date(),
        durationMs: Date.now() - startTime
      }
    })

    return NextResponse.json({
      success: true,
      job_id: job.id,
      processed: itemsProcessed,
      succeeded: itemsSucceeded,
      failed: itemsFailed,
      duration_ms: Date.now() - startTime
    })

  } catch (error: any) {
    await prisma.generationJob.update({
      where: { id: job.id },
      data: {
        status: 'FAILED',
        itemsProcessed,
        itemsSucceeded,
        itemsFailed,
        errors: [{ error: error.message }],
        completedAt: new Date(),
        durationMs: Date.now() - startTime
      }
    })

    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    )
  }
}
