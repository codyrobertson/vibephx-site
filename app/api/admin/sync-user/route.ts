import { NextRequest, NextResponse } from 'next/server'
import { stackServerApp } from '@/stack'
import { prisma } from '@/lib/prisma'

// POST - Sync workshop attendance to use Stack Auth user ID
export async function POST(req: NextRequest) {
  try {
    const user = await stackServerApp.getUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    console.log('[SYNC] Stack Auth user ID:', user.id)
    console.log('[SYNC] Stack Auth user email:', user.primaryEmail)

    // Find Prisma user by email
    const prismaUser = await prisma.user.findUnique({
      where: { email: user.primaryEmail || '' }
    })

    if (!prismaUser) {
      return NextResponse.json({ error: 'User not found in database' }, { status: 404 })
    }

    console.log('[SYNC] Prisma user ID:', prismaUser.id)

    if (prismaUser.id === user.id) {
      return NextResponse.json({ message: 'IDs already match, no sync needed' })
    }

    // Update all workshop attendance records
    const updated = await prisma.workshopAttendance.updateMany({
      where: { userId: prismaUser.id },
      data: { userId: user.id }
    })

    // Update all projects
    const updatedProjects = await prisma.project.updateMany({
      where: { userId: prismaUser.id },
      data: { userId: user.id }
    })

    // Update profile
    const updatedProfile = await prisma.userProfile.updateMany({
      where: { userId: prismaUser.id },
      data: { userId: user.id }
    })

    // Delete old user record if it exists
    await prisma.user.deleteMany({
      where: { id: prismaUser.id }
    })

    // Create/update user record with Stack Auth ID
    await prisma.user.upsert({
      where: { id: user.id },
      create: {
        id: user.id,
        email: user.primaryEmail || '',
        name: user.displayName,
        creditsBalance: prismaUser.creditsBalance
      },
      update: {
        email: user.primaryEmail || '',
        name: user.displayName
      }
    })

    return NextResponse.json({
      message: 'User synced successfully',
      workshopAttendance: updated.count,
      projects: updatedProjects.count,
      profiles: updatedProfile.count
    })
  } catch (error) {
    console.error('[SYNC] Error:', error)
    return NextResponse.json(
      { error: 'Failed to sync user' },
      { status: 500 }
    )
  }
}
