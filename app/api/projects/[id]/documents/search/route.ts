import { NextRequest, NextResponse } from 'next/server'
import { stackServerApp } from '@/stack'
import { prisma } from '@/lib/prisma'
import { generateEmbedding } from '@/lib/embeddings/document-embedder'

// POST /api/projects/[id]/documents/search - Vector similarity search
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
    const { query, limit = 10 } = body

    if (!query) {
      return NextResponse.json(
        { error: 'Missing required field: query' },
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

    // Generate embedding for query
    const { embedding: queryEmbedding } = await generateEmbedding(query)

    // Use pgvector cosine distance for similarity search
    // Note: This requires the pgvector extension to be enabled
    const results = await prisma.$queryRaw`
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
        1 - (embedding <=> ${`[${queryEmbedding.join(',')}]`}::vector) as similarity
      FROM project_documents
      WHERE "projectId" = ${projectId}
        AND embedding IS NOT NULL
      ORDER BY embedding <=> ${`[${queryEmbedding.join(',')}]`}::vector
      LIMIT ${limit}
    `

    return NextResponse.json({ results })
  } catch (error) {
    console.error('Error searching documents:', error)
    return NextResponse.json(
      { error: 'Failed to search documents. Make sure pgvector extension is enabled.' },
      { status: 500 }
    )
  }
}
