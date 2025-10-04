import { NextRequest, NextResponse } from 'next/server'
import { stackServerApp } from '@/stack'
import { prisma } from '@/lib/prisma'
import { getTechDetail } from '@/lib/config/tech-stack-details'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; techId: string }> }
) {
  try {
    const user = await stackServerApp.getUser({ or: 'redirect' })
    const { id: projectId, techId } = await params

    // Get project with latest session
    const project = await prisma.project.findUnique({
      where: { id: projectId },
      include: {
        prdSessions: {
          orderBy: { updatedAt: 'desc' },
          take: 1
        }
      }
    })

    if (!project || project.userId !== user.id) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 })
    }

    const session = project.prdSessions[0]
    if (!session) {
      return NextResponse.json({ error: 'No session found' }, { status: 404 })
    }

    // Get generic tech details as base
    const genericTech = getTechDetail(techId)
    if (!genericTech) {
      return NextResponse.json({ error: 'Tech not found' }, { status: 404 })
    }

    // Check if we have cached tech details
    const techStackDetails = session.techStackDetails as Record<string, any> | null
    const normalizedTechId = techId.toLowerCase().trim()
    const cachedDetails = techStackDetails?.[normalizedTechId]

    if (cachedDetails) {
      // Return cached bespoke details
      const response = {
        ...genericTech,
        bespoke: {
          whyWeChoseIt: cachedDetails.whyWeChoseIt,
          howItsUsed: cachedDetails.howItsUsed,
          keyImplementationAreas: cachedDetails.keyImplementationAreas,
          projectBenefits: cachedDetails.projectBenefits
        },
        projectContext: {
          projectName: session.sda || session.initialIntent,
          audience: session.audience
        }
      }
      return NextResponse.json(response)
    }

    // If no cached details, return just generic details
    // (Details should be generated in background, but might still be processing)
    const response = {
      ...genericTech,
      projectContext: {
        projectName: session.sda || session.initialIntent,
        audience: session.audience
      }
    }

    return NextResponse.json(response)
  } catch (error) {
    console.error('Failed to fetch tech details:', error)
    return NextResponse.json(
      { error: 'Failed to fetch tech details' },
      { status: 500 }
    )
  }
}
