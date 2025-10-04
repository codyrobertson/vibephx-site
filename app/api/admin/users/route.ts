import { NextRequest, NextResponse } from 'next/server'
import { stackServerApp } from '@/stack'
import { prisma } from '@/lib/prisma'

// GET - Fetch all users for admin dropdown
export async function GET(req: NextRequest) {
  try {
    const startTime = Date.now()

    console.log('[PERF] Starting users fetch...')
    const authStart = Date.now()
    const user = await stackServerApp.getUser()
    console.log(`[PERF] Auth check took ${Date.now() - authStart}ms`)

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // TODO: Add admin role check here

    const dbStart = Date.now()
    const users = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        name: true,
        createdAt: true
      },
      orderBy: {
        createdAt: 'desc'
      }
    })
    console.log(`[PERF] Database query took ${Date.now() - dbStart}ms`)
    console.log(`[PERF] Total request took ${Date.now() - startTime}ms`)

    return NextResponse.json({ users })
  } catch (error) {
    console.error('Failed to fetch users:', error)
    return NextResponse.json(
      { error: 'Failed to fetch users' },
      { status: 500 }
    )
  }
}
