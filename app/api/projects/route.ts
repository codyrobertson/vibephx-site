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

    // Ensure local user exists by id (consistent with other routes)
    await prisma.user.upsert({
      where: { id: user.id },
      update: {
        // do not touch email on update to avoid unique collisions
        name: user.displayName ?? undefined,
        image: user.profileImageUrl ?? undefined,
      },
      create: {
        id: user.id,
        email: user.primaryEmail || `${user.id}@stack.local`,
        name: user.displayName || null,
        image: user.profileImageUrl || null,
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
        user: { connect: { id: user.id } }
      },
    })

    return NextResponse.json({ project })
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

// Update a project (e.g., status/title/description)
export async function PATCH(request: NextRequest) {
  try {
    const user = await stackServerApp.getUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id, status, title, description } = await request.json()
    if (!id) {
      return NextResponse.json({ error: 'Missing project id' }, { status: 400 })
    }

    // Ensure local user exists (by id) for relation checks
    await prisma.user.upsert({
      where: { id: user.id },
      update: {},
      create: {
        id: user.id,
        email: user.primaryEmail || `${user.id}@stack.local`,
        name: user.displayName || null,
        image: user.profileImageUrl || null,
      },
    })

    const project = await prisma.project.update({
      where: { id },
      data: {
        status: status || undefined,
        title: title || undefined,
        description: description || undefined,
      },
    })

    return NextResponse.json({ project })
  } catch (error) {
    console.error('Update project error:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Internal server error' },
      { status: 500 }
    )
  }
}