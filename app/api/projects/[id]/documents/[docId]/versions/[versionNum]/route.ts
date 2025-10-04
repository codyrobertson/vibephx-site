import { NextRequest, NextResponse } from 'next/server'
import { stackServerApp } from '@/stack'
import { prisma } from '@/lib/prisma'

// GET /api/projects/[id]/documents/[docId]/versions/[versionNum] - Get specific version
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string; docId: string; versionNum: string }> }
) {
  try {
    const user = await stackServerApp.getUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { docId, versionNum } = await params
    const version = parseInt(versionNum)

    // Fetch specific version
    const versionDoc = await prisma.documentVersion.findFirst({
      where: {
        documentId: docId,
        version,
        document: {
          userId: user.id
        }
      }
    })

    if (!versionDoc) {
      return NextResponse.json({ error: 'Version not found' }, { status: 404 })
    }

    return NextResponse.json({ version: versionDoc })
  } catch (error) {
    console.error('Error fetching version:', error)
    return NextResponse.json(
      { error: 'Failed to fetch version' },
      { status: 500 }
    )
  }
}

// POST /api/projects/[id]/documents/[docId]/versions/[versionNum] - Restore version
export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string; docId: string; versionNum: string }> }
) {
  try {
    const user = await stackServerApp.getUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { docId, versionNum } = await params
    const versionToRestore = parseInt(versionNum)

    // Get the version to restore
    const versionDoc = await prisma.documentVersion.findFirst({
      where: {
        documentId: docId,
        version: versionToRestore,
        document: {
          userId: user.id
        }
      }
    })

    if (!versionDoc) {
      return NextResponse.json({ error: 'Version not found' }, { status: 404 })
    }

    // Get current document
    const currentDoc = await prisma.projectDocument.findFirst({
      where: {
        id: docId,
        userId: user.id
      }
    })

    if (!currentDoc) {
      return NextResponse.json({ error: 'Document not found' }, { status: 404 })
    }

    // Get the latest version number
    const latestVersion = await prisma.documentVersion.findFirst({
      where: { documentId: docId },
      orderBy: { version: 'desc' }
    })

    const newVersionNum = (latestVersion?.version || 0) + 1

    // Save current state as a version before restoring
    await prisma.documentVersion.create({
      data: {
        documentId: docId,
        userId: user.id,
        version: newVersionNum,
        title: currentDoc.title,
        content: currentDoc.content,
        changeMessage: `Auto-save before restoring version ${versionToRestore}`,
        createdBy: user.id
      }
    })

    // Create new version from restored content
    const restoredVersion = await prisma.documentVersion.create({
      data: {
        documentId: docId,
        userId: user.id,
        version: newVersionNum + 1,
        title: versionDoc.title,
        content: versionDoc.content,
        changeMessage: `Restored from version ${versionToRestore}`,
        createdBy: user.id,
        restoredFrom: versionToRestore
      }
    })

    // Update the document with restored content
    const updatedDoc = await prisma.projectDocument.update({
      where: { id: docId },
      data: {
        title: versionDoc.title,
        content: versionDoc.content
      }
    })

    return NextResponse.json({
      document: updatedDoc,
      version: restoredVersion,
      message: `Successfully restored version ${versionToRestore}`
    })
  } catch (error) {
    console.error('Error restoring version:', error)
    return NextResponse.json(
      { error: 'Failed to restore version' },
      { status: 500 }
    )
  }
}
