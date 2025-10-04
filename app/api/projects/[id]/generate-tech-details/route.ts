import { NextRequest, NextResponse } from 'next/server'
import { stackServerApp } from '@/stack'
import { prisma } from '@/lib/prisma'
import { generateAllTechDetails } from '@/lib/prd/tech-details-generator'

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await stackServerApp.getUser({ or: 'redirect' })
    const { id: projectId } = await params

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

    console.log(`[Tech Details] Generating for project ${projectId}, session ${session.id}`)

    // Generate tech details
    const techDetails = await generateAllTechDetails(
      {
        sda: session.sda || undefined,
        initialIntent: session.initialIntent,
        audience: session.audience || undefined,
        motivation: session.motivation || undefined,
        featuresMvp: session.featuresMvp,
        selectedStack: session.selectedStack || undefined,
        dbChoice: session.dbChoice || undefined,
        integrations: session.integrations
      },
      user.id,
      projectId
    )

    console.log(`[Tech Details] Generated ${Object.keys(techDetails).length} tech details`)

    // Store in session
    const updatedSession = await prisma.pRDSession.update({
      where: { id: session.id },
      data: {
        techStackDetails: techDetails as any
      }
    })

    console.log(`[Tech Details] Saved to database for session ${session.id}`)

    return NextResponse.json({
      success: true,
      techDetails,
      techCount: Object.keys(techDetails).length
    })
  } catch (error) {
    console.error('Failed to generate tech details:', error)
    return NextResponse.json(
      { error: 'Failed to generate tech details' },
      { status: 500 }
    )
  }
}
