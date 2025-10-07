import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import {
  groupEventsByUser,
  calculateEngagementScore,
  generateUserActivitySummary,
  calculateActivityTrends,
  getTopUsers,
  calculateFunnelConversion,
  groupEventsByType,
  groupEventsByCategory,
  getTopPaths,
} from '@/lib/analytics/user-analytics'

export async function GET(req: NextRequest) {
  try {
    const searchParams = req.nextUrl.searchParams
    const days = parseInt(searchParams.get('days') || '30')
    const userId = searchParams.get('userId')

    // Fetch activities
    const activities = await prisma.userActivity.findMany({
      where: userId ? { userId } : {
        createdAt: {
          gte: new Date(Date.now() - days * 24 * 60 * 60 * 1000),
        },
      },
      orderBy: { createdAt: 'desc' },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            name: true,
          },
        },
      },
    })

    // If specific user requested
    if (userId) {
      const summary = generateUserActivitySummary(activities)
      const engagement = calculateEngagementScore(activities)

      return NextResponse.json({
        summary,
        engagement,
        recentEvents: activities.slice(0, 20).map(a => ({
          id: a.id,
          eventType: a.eventType,
          eventCategory: a.eventCategory,
          eventName: a.eventName,
          path: a.path,
          createdAt: a.createdAt,
        })),
      })
    }

    // Global analytics
    const groupedByUser = groupEventsByUser(activities)
    const topUsers = getTopUsers(groupedByUser, 10).map(u => {
      const user = activities.find(a => a.userId === u.userId)?.user
      return {
        ...u,
        email: user?.email || 'Unknown',
        name: user?.name || 'Unknown',
      }
    })

    const trends = calculateActivityTrends(activities, days)
    const eventsByType = groupEventsByType(activities)
    const eventsByCategory = groupEventsByCategory(activities)
    const topPaths = getTopPaths(activities, 10)

    // Calculate funnel (example: onboarding -> project -> prd)
    const funnel = calculateFunnelConversion(activities, [
      'ONBOARDING_STARTED',
      'ONBOARDING_COMPLETED',
      'PROJECT_CREATED',
      'PRD_SESSION_STARTED',
      'PRD_GENERATED',
    ])

    // User engagement distribution
    const engagementScores = Array.from(groupedByUser.values())
      .map(events => calculateEngagementScore(events))
      .filter(s => s !== null)

    const engagementDistribution = {
      high: engagementScores.filter(s => s!.rank === 'high').length,
      medium: engagementScores.filter(s => s!.rank === 'medium').length,
      low: engagementScores.filter(s => s!.rank === 'low').length,
    }

    // Total stats
    const totalStats = {
      totalEvents: activities.length,
      uniqueUsers: groupedByUser.size,
      avgEventsPerUser: groupedByUser.size > 0 ? Math.round(activities.length / groupedByUser.size) : 0,
      avgEngagementScore: engagementScores.length > 0
        ? Math.round(engagementScores.reduce((sum, s) => sum + s!.score, 0) / engagementScores.length)
        : 0,
    }

    return NextResponse.json({
      totalStats,
      topUsers,
      trends,
      eventsByType,
      eventsByCategory,
      topPaths,
      funnel,
      engagementDistribution,
      recentActivity: activities.slice(0, 50).map(a => ({
        id: a.id,
        userId: a.userId,
        userEmail: a.user.email,
        userName: a.user.name,
        eventType: a.eventType,
        eventCategory: a.eventCategory,
        eventName: a.eventName,
        path: a.path,
        createdAt: a.createdAt,
      })),
    })
  } catch (error: any) {
    console.error('[User Activity Analytics] Error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
