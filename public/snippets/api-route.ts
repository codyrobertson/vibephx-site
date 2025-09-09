import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { prisma } from '@/lib/prisma'
import { auth } from '@/lib/auth'

const CreateProjectSchema = z.object({
  name: z.string().min(1).max(100),
  description: z.string().optional(),
  stack: z.object({
    frontend: z.string(),
    backend: z.string(),
    database: z.string()
  }),
  features: z.array(z.string()).max(10)
})

export async function POST(request: NextRequest) {
  try {
    // Authenticate the user
    const user = await auth.getUser(request)
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Validate request body
    const body = await request.json()
    const validatedData = CreateProjectSchema.parse(body)

    // Check if user has reached project limit
    const projectCount = await prisma.project.count({
      where: { userId: user.id }
    })
    
    if (projectCount >= 10) {
      return NextResponse.json(
        { error: 'Project limit reached' }, 
        { status: 400 }
      )
    }

    // Create the project
    const project = await prisma.project.create({
      data: {
        ...validatedData,
        userId: user.id,
        status: 'draft',
        createdAt: new Date()
      },
      include: {
        user: {
          select: { name: true, email: true }
        }
      }
    })

    // Generate initial project structure
    const projectStructure = await generateProjectStructure(
      validatedData.stack,
      validatedData.features
    )

    // Update project with generated structure
    await prisma.project.update({
      where: { id: project.id },
      data: { 
        structure: projectStructure,
        status: 'ready'
      }
    })

    console.log(`✅ Created project: ${project.name} for user ${user.id}`)
    
    return NextResponse.json({
      project: {
        ...project,
        structure: projectStructure
      }
    }, { status: 201 })

  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid request data', details: error.errors },
        { status: 400 }
      )
    }

    console.error('Project creation failed:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

async function generateProjectStructure(stack: any, features: string[]) {
  const structure = {
    directories: ['src', 'components', 'pages', 'lib', 'styles'],
    files: [],
    dependencies: []
  }

  // Add stack-specific configurations
  if (stack.frontend === 'react') {
    structure.dependencies.push('react', 'react-dom', '@types/react')
  }
  
  if (stack.database === 'postgresql') {
    structure.dependencies.push('pg', '@types/pg', 'prisma')
  }

  return structure
}