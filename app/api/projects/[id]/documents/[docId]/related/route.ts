import { NextRequest, NextResponse } from 'next/server'
import { stackServerApp } from '@/stack'
import { prisma } from '@/lib/prisma'

// GET /api/projects/[id]/documents/[docId]/related - Get related documents using vector similarity
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
    const { searchParams } = new URL(req.url)
    const limit = parseInt(searchParams.get('limit') || '5')

    // Get the source document with its embedding
    const sourceDoc = await prisma.projectDocument.findFirst({
      where: {
        id: docId,
        projectId,
        userId: user.id
      }
    })

    if (!sourceDoc) {
      return NextResponse.json({ error: 'Document not found' }, { status: 404 })
    }

    // Check if document has an embedding
    if (!sourceDoc.embedding) {
      return NextResponse.json({
        related: [],
        message: 'Document has no embedding for similarity search'
      })
    }

    // Use pgvector to find similar documents
    // Exclude the source document itself
    const relatedDocs = await prisma.$queryRaw`
      SELECT
        id,
        type,
        title,
        excerpt,
        "isBookmarked",
        "bookmarkedAt",
        "generatedBy",
        tags,
        "createdAt",
        "updatedAt",
        1 - (embedding <=> ${sourceDoc.embedding}::vector) as similarity
      FROM project_documents
      WHERE "projectId" = ${projectId}
        AND id != ${docId}
        AND embedding IS NOT NULL
      ORDER BY embedding <=> ${sourceDoc.embedding}::vector
      LIMIT ${limit}
    `

    return NextResponse.json({ related: relatedDocs })
  } catch (error) {
    console.error('Error finding related documents:', error)
    return NextResponse.json(
      { error: 'Failed to find related documents. Make sure pgvector extension is enabled.' },
      { status: 500 }
    )
  }
}
