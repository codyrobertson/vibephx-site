import { NextRequest, NextResponse } from 'next/server'
import { resourceGenerator } from '@/lib/services/resource-generator'
import { generateFeaturedImage } from '@/lib/services/image-generator'
import { sendAdminNotification } from '@/lib/services/email'
import { prisma } from '@/lib/prisma'

export const maxDuration = 300 // 5 minutes for generation

export async function POST(req: NextRequest) {
  try {
    const { technology } = await req.json()

    if (!technology) {
      return NextResponse.json({ error: 'Technology name required' }, { status: 400 })
    }

    console.log(`[API] Starting generation for: ${technology}`)

    // Generate article
    const result = await resourceGenerator.generate(technology)

    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 400 })
    }

    // Generate featured image
    if (result.draftId) {
      try {
        const draft = await prisma.resourceDraft.findUnique({
          where: { id: result.draftId }
        })

        if (draft) {
          const image = await generateFeaturedImage(technology, draft.title)

          await prisma.resourceDraft.update({
            where: { id: result.draftId },
            data: {
              featuredImage: image.url,
              imagePrompt: image.prompt
            }
          })

          console.log(`[API] ✅ Image generated: ${image.url}`)
        }
      } catch (error) {
        console.error('[API] Image generation failed:', error)
        // Continue without image
      }

      // Send email notification to admin
      try {
        await sendAdminNotification(result.draftId)
        await prisma.resourceDraft.update({
          where: { id: result.draftId },
          data: {
            adminNotified: true,
            notifiedAt: new Date()
          }
        })
        console.log('[API] ✅ Admin notified')
      } catch (error) {
        console.error('[API] Email notification failed:', error)
      }
    }

    return NextResponse.json({
      success: true,
      draft_id: result.draftId,
      metadata: result.metadata
    })

  } catch (error: any) {
    console.error('[API] Generation failed:', error)
    return NextResponse.json(
      { error: error.message || 'Generation failed' },
      { status: 500 }
    )
  }
}

// GET: List pending drafts
export async function GET() {
  try {
    const drafts = await prisma.resourceDraft.findMany({
      where: { status: 'PENDING' },
      orderBy: { createdAt: 'desc' },
      take: 20
    })

    return NextResponse.json({ drafts })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
