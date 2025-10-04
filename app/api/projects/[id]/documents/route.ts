import { NextRequest, NextResponse } from 'next/server'
import { stackServerApp } from '@/stack'
import { prisma } from '@/lib/prisma'
import { generateEmbedding, createExcerpt } from '@/lib/embeddings/document-embedder'
import type { DocumentType } from '@prisma/client'

// GET /api/projects/[id]/documents - List all documents for a project
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await stackServerApp.getUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id: projectId } = await params
    const { searchParams } = new URL(req.url)
    const bookmarkedOnly = searchParams.get('bookmarked') === 'true'
    const type = searchParams.get('type') as DocumentType | null

    // Verify user owns the project
    const project = await prisma.project.findUnique({
      where: { id: projectId }
    })

    if (!project || project.userId !== user.id) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 })
    }

    // Fetch documents with filters
    const documents = await prisma.projectDocument.findMany({
      where: {
        projectId,
        ...(bookmarkedOnly ? { isBookmarked: true } : {}),
        ...(type ? { type } : {})
      },
      orderBy: [
        { isBookmarked: 'desc' }, // Bookmarked first
        { createdAt: 'desc' }
      ],
      select: {
        id: true,
        type: true,
        title: true,
        excerpt: true,
        isBookmarked: true,
        bookmarkedAt: true,
        generatedBy: true,
        tags: true,
        createdAt: true,
        updatedAt: true
        // Exclude content and embedding from list view for performance
      }
    })

    return NextResponse.json({ documents })
  } catch (error) {
    console.error('Error fetching documents:', error)
    return NextResponse.json(
      { error: 'Failed to fetch documents' },
      { status: 500 }
    )
  }
}

// POST /api/projects/[id]/documents - Create and bookmark a new document
export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await stackServerApp.getUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id: projectId } = await params
    const body = await req.json()
    const { type, title, content, isBookmarked = true, generatedBy, tags = [], metadata } = body

    // Validate required fields
    if (!type || !title || !content) {
      return NextResponse.json(
        { error: 'Missing required fields: type, title, content' },
        { status: 400 }
      )
    }

    // Verify user owns the project
    const project = await prisma.project.findUnique({
      where: { id: projectId }
    })

    if (!project || project.userId !== user.id) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 })
    }

    // Generate excerpt
    const excerpt = createExcerpt(content)

    // Generate embedding in background (non-blocking)
    let embedding: number[] | null = null
    try {
      const embeddingResult = await generateEmbedding(content)
      embedding = embeddingResult.embedding
    } catch (error) {
      console.error('Failed to generate embedding (non-fatal):', error)
      // Continue without embedding - we can generate it later
    }

    // Create document first without embedding
    const document = await prisma.projectDocument.create({
      data: {
        projectId,
        userId: user.id,
        type,
        title,
        content,
        excerpt,
        isBookmarked,
        bookmarkedAt: isBookmarked ? new Date() : null,
        generatedBy,
        tags,
        metadata
      }
    })

    // Update with embedding if we have one (using raw query for pgvector type)
    if (embedding) {
      try {
        await prisma.$executeRaw`
          UPDATE project_documents
          SET embedding = ${`[${embedding.join(',')}]`}::vector
          WHERE id = ${document.id}
        `
      } catch (error) {
        console.error('Failed to set embedding (non-fatal):', error)
      }
    }

    return NextResponse.json({ document })
  } catch (error) {
    console.error('Error creating document:', error)
    return NextResponse.json(
      { error: 'Failed to create document' },
      { status: 500 }
    )
  }
}
