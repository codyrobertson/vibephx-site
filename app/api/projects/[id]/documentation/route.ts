import { NextRequest } from 'next/server'
import { prisma } from '@/lib/db'

interface DocumentationSection {
  section: string
  content: string
}

// Function to get documentation for a project from database
async function getProjectDocumentation(projectId: string): Promise<DocumentationSection[]> {
  try {
    const project = await prisma.project.findUnique({
      where: { id: projectId },
      select: { generated: true }
    })

    if (!project?.generated) {
      return []
    }

    // The generated field contains the documentation sections as JSON
    // Safe casting with validation
    const data = project.generated as unknown
    if (Array.isArray(data)) {
      return data as DocumentationSection[]
    }
    return []
  } catch (error) {
    console.error('Failed to fetch project documentation:', error)
    return []
  }
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    
    // Fetch documentation from database
    const documentation = await getProjectDocumentation(id)
    
    return Response.json(documentation)
  } catch (error) {
    return Response.json(
      { error: 'Failed to fetch project documentation' },
      { status: 500 }
    )
  }
}