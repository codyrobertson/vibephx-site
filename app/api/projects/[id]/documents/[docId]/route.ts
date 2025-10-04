import { NextRequest, NextResponse } from 'next/server'
import { stackServerApp } from '@/stack'
import { prisma } from '@/lib/prisma'

// GET /api/projects/[id]/documents/[docId] - Get single document with full content
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

    return NextResponse.json({ document })
  } catch (error) {
    console.error('Error fetching document:', error)
    return NextResponse.json(
      { error: 'Failed to fetch document' },
      { status: 500 }
    )
  }
}

// PATCH /api/projects/[id]/documents/[docId] - Update document
export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string; docId: string }> }
) {
  try {
    const user = await stackServerApp.getUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id: projectId, docId } = await params
    const body = await req.json()
    const { isBookmarked, title, content, tags, changeMessage } = body

    // Verify user owns the document
    const existing = await prisma.projectDocument.findFirst({
      where: {
        id: docId,
        projectId,
        userId: user.id
      }
    })

    if (!existing) {
      return NextResponse.json({ error: 'Document not found' }, { status: 404 })
    }

    // Check if content or title is changing (requires version creation)
    const isContentChange = (title && title !== existing.title) || (content && content !== existing.content)

    if (isContentChange) {
      // Get the latest version number
      const latestVersion = await prisma.documentVersion.findFirst({
        where: { documentId: docId },
        orderBy: { version: 'desc' }
      })

      const newVersionNum = (latestVersion?.version || 0) + 1

      // Create a new version with the current state
      await prisma.documentVersion.create({
        data: {
          documentId: docId,
          userId: user.id,
          version: newVersionNum,
          title: title || existing.title,
          content: content || existing.content,
          changeMessage: changeMessage || 'Document updated',
          createdBy: user.email || user.id
        }
      })
    }

    // Update document
    const document = await prisma.projectDocument.update({
      where: { id: docId },
      data: {
        ...(typeof isBookmarked === 'boolean' ? {
          isBookmarked,
          bookmarkedAt: isBookmarked ? new Date() : null
        } : {}),
        ...(title ? { title } : {}),
        ...(content ? { content } : {}),
        ...(tags ? { tags } : {})
      }
    })

    return NextResponse.json({ document })
  } catch (error) {
    console.error('Error updating document:', error)
    return NextResponse.json(
      { error: 'Failed to update document' },
      { status: 500 }
    )
  }
}

// DELETE /api/projects/[id]/documents/[docId] - Delete document
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string; docId: string }> }
) {
  try {
    const user = await stackServerApp.getUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id: projectId, docId } = await params

    // Verify user owns the document
    const existing = await prisma.projectDocument.findFirst({
      where: {
        id: docId,
        projectId,
        userId: user.id
      }
    })

    if (!existing) {
      return NextResponse.json({ error: 'Document not found' }, { status: 404 })
    }

    // Delete document
    await prisma.projectDocument.delete({
      where: { id: docId }
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting document:', error)
    return NextResponse.json(
      { error: 'Failed to delete document' },
      { status: 500 }
    )
  }
}
