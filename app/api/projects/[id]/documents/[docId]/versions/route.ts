import { NextRequest, NextResponse } from 'next/server'
import { stackServerApp } from '@/stack'
import { prisma } from '@/lib/prisma'

// GET /api/projects/[id]/documents/[docId]/versions - Get version history
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string; docId: string }> }
) {
  try {
    const user = await stackServerApp.getUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id: projectId, docId } = await params

    // Verify document exists and user has access
    const document = await prisma.projectDocument.findFirst({
      where: {
        id: docId,
        projectId,
        userId: user.id
      }
    })

    if (!document) {
      return NextResponse.json({ error: 'Document not found' }, { status: 404 })
    }

    // Fetch version history
    const versions = await prisma.documentVersion.findMany({
      where: {
        documentId: docId
      },
      orderBy: {
        version: 'desc'
      },
      select: {
        id: true,
        version: true,
        title: true,
        changeMessage: true,
        createdBy: true,
        restoredFrom: true,
        createdAt: true
      }
    })

    return NextResponse.json({ versions })
  } catch (error) {
    console.error('Error fetching version history:', error)
    return NextResponse.json(
      { error: 'Failed to fetch version history' },
      { status: 500 }
    )
  }
}
