import { NextRequest, NextResponse } from 'next/server'
import { stackServerApp } from '@/stack'
import { prisma } from '@/lib/prisma'

export async function POST(request: NextRequest) {
  try {
    const user = await stackServerApp.getUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { title, description, template, customIdea, techStack, status = 'DRAFT' } = await request.json()

    // Create or update user in database
    await prisma.user.upsert({
      where: { email: user.primaryEmail },
      update: {
        name: user.displayName,
        image: user.profileImageUrl,
      },
      create: {
        email: user.primaryEmail,
        name: user.displayName,
        image: user.profileImageUrl,
      },
    })

    // Create project
    const project = await prisma.project.create({
      data: {
        title,
        description,
        template,
        customIdea,
        techStack,
        status,
        user: {
          connect: { email: user.primaryEmail }
        }
      },
    })

    return NextResponse.json(project)
  } catch (error) {
    console.error('Create project error:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const user = await stackServerApp.getUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const projects = await prisma.project.findMany({
      where: {
        user: { email: user.primaryEmail }
      },
      orderBy: { updatedAt: 'desc' },
    })

    return NextResponse.json(projects)
  } catch (error) {
    console.error('Get projects error:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Internal server error' },
      { status: 500 }
    )
  }
}