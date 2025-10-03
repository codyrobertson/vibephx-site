import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { stackServerApp } from '@/stack'

export const runtime = 'nodejs'

// Save/update user profile
export async function POST(req: NextRequest) {
  try {
    const user = await stackServerApp.getUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Ensure a corresponding local User row exists for FK relations
    // This prevents P2003 foreign key violations when writing UserProfile
    await prisma.user.upsert({
      where: { id: user.id },
      update: {
        name: (user as any).name || undefined,
        image: (user as any).imageUrl || (user as any).image || undefined,
        updatedAt: new Date()
      },
      create: {
        id: user.id,
        // Avoid unique email collisions by using a deterministic synthetic email
        // tied to the external user id when inserting the local user record.
        email: `${user.id}@stack.local`,
        name: (user as any).name || null,
        image: (user as any).imageUrl || (user as any).image || null
      }
    })

    const body = await req.json()
    const {
      skillLevel,
      interests,
      primaryGoal,
      timeCommitment,
      techPreferences,
      hasTeam,
      preferredComplexity,
      onboardingCompleted
    } = body

    const profile = await prisma.userProfile.upsert({
      where: { userId: user.id },
      create: {
        userId: user.id,
        skillLevel,
        interests: interests || [],
        primaryGoal,
        timeCommitment,
        techPreferences: techPreferences || [],
        hasTeam: hasTeam || false,
        preferredComplexity,
        onboardingCompleted: onboardingCompleted || false
      },
      update: {
        skillLevel,
        interests: interests || [],
        primaryGoal,
        timeCommitment,
        techPreferences: techPreferences || [],
        hasTeam: hasTeam || false,
        preferredComplexity,
        onboardingCompleted: onboardingCompleted || false,
        updatedAt: new Date()
      }
    })

    return NextResponse.json({ profile })
  } catch (error: any) {
    console.error('Profile save error:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to save profile' },
      { status: 500 }
    )
  }
}

// Get user profile
export async function GET(req: NextRequest) {
  try {
    const user = await stackServerApp.getUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const profile = await prisma.userProfile.findUnique({
      where: { userId: user.id }
    })

    return NextResponse.json({ profile })
  } catch (error: any) {
    console.error('Profile fetch error:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to fetch profile' },
      { status: 500 }
    )
  }
}

