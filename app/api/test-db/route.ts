import { NextRequest } from 'next/server'
import { prisma } from '@/lib/db'

export async function GET() {
  try {
    // Try to connect to database
    const userCount = await prisma.user.count()
    const projectCount = await prisma.project.count()
    
    return Response.json({
      success: true,
      connection: 'Database connected successfully',
      stats: {
        users: userCount,
        projects: projectCount
      }
    })
  } catch (error) {
    console.error('Database test error:', error)
    return Response.json(
      { 
        success: false, 
        error: 'Database connection failed', 
        details: error instanceof Error ? error.message : 'Unknown error' 
      },
      { status: 500 }
    )
  }
}