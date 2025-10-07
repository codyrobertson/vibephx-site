import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    // Get date ranges for time-based analytics
    const now = new Date()
    const last24h = new Date(now.getTime() - 24 * 60 * 60 * 1000)
    const last7d = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
    const last30d = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)

    const [
      // Users
      totalUsers,
      usersLast7d,
      usersLast30d,
      onboardingCompleted,
      totalProfiles,

      // Projects & PRD
      totalProjects,
      projectsLast7d,
      completedProjects,
      totalPRDSessions,
      completedPRDSessions,
      prdSessionsLast7d,

      // LLM Usage (Inference)
      totalLLMLogs,
      llmLogsLast24h,
      llmLogsLast7d,
      llmCostStats,
      llmTokenStats,
      llmByModel,
      llmByPurpose,
      llmErrors,

      // Generations
      totalGenerations,
      generationsLast7d,
      generationsByType,
      failedGenerations,

      // Documents
      totalDocuments,
      bookmarkedDocuments,
      documentsByType,

      // Workshops
      totalWorkshops,
      totalAttendance,
      creditsDistributed,

      // Resource Generation
      totalResourceDrafts,
      pendingDrafts,
      publishedDrafts,
      queuedTopics,
      resourceJobs,
    ] = await Promise.all([
      // Users
      prisma.user.count(),
      prisma.user.count({ where: { createdAt: { gte: last7d } } }),
      prisma.user.count({ where: { createdAt: { gte: last30d } } }),
      prisma.userProfile.count({ where: { onboardingCompleted: true } }),
      prisma.userProfile.count(),

      // Projects & PRD
      prisma.project.count(),
      prisma.project.count({ where: { createdAt: { gte: last7d } } }),
      prisma.project.count({ where: { status: 'COMPLETED' } }),
      prisma.pRDSession.count(),
      prisma.pRDSession.count({ where: { completed: true } }),
      prisma.pRDSession.count({ where: { createdAt: { gte: last7d } } }),

      // LLM Usage
      prisma.lLMLog.count(),
      prisma.lLMLog.count({ where: { createdAt: { gte: last24h } } }),
      prisma.lLMLog.count({ where: { createdAt: { gte: last7d } } }),
      prisma.lLMLog.aggregate({
        _sum: { costUsd: true },
        _avg: { costUsd: true },
      }),
      prisma.lLMLog.aggregate({
        _sum: { totalTokens: true, promptTokens: true, completionTokens: true },
        _avg: { totalTokens: true },
      }),
      prisma.lLMLog.groupBy({
        by: ['model'],
        _count: true,
        _sum: { costUsd: true, totalTokens: true },
      }),
      prisma.lLMLog.groupBy({
        by: ['purpose'],
        _count: true,
        _sum: { costUsd: true },
      }),
      prisma.lLMLog.count({ where: { success: false } }),

      // Generations
      prisma.generation.count(),
      prisma.generation.count({ where: { createdAt: { gte: last7d } } }),
      prisma.generation.groupBy({
        by: ['type'],
        _count: true,
      }),
      prisma.generation.count({ where: { status: 'FAILED' } }),

      // Documents
      prisma.projectDocument.count(),
      prisma.projectDocument.count({ where: { isBookmarked: true } }),
      prisma.projectDocument.groupBy({
        by: ['type'],
        _count: true,
      }),

      // Workshops
      prisma.workshop.count(),
      prisma.workshopAttendance.count(),
      prisma.workshopAttendance.aggregate({
        _sum: { creditsAwarded: true },
      }),

      // Resource Generation
      prisma.resourceDraft.count(),
      prisma.resourceDraft.count({ where: { status: 'PENDING' } }),
      prisma.resourceDraft.count({ where: { status: 'PUBLISHED' } }),
      prisma.resourceTopic.count({ where: { status: 'QUEUED' } }),
      prisma.generationJob.findMany({
        where: { type: 'resource_article' },
        orderBy: { startedAt: 'desc' },
        take: 5,
      }),
    ])

    // Calculate rates and percentages
    const onboardingRate = totalProfiles > 0 ? (onboardingCompleted / totalProfiles) * 100 : 0
    const prdCompletionRate = totalPRDSessions > 0 ? (completedPRDSessions / totalPRDSessions) * 100 : 0
    const llmSuccessRate = totalLLMLogs > 0 ? ((totalLLMLogs - llmErrors) / totalLLMLogs) * 100 : 100
    const generationSuccessRate = totalGenerations > 0 ? ((totalGenerations - failedGenerations) / totalGenerations) * 100 : 100

    // Growth calculations
    const userGrowth24h = usersLast30d > 0 ? ((usersLast7d - usersLast30d) / usersLast30d) * 100 : 0

    // Cost projections
    const totalCost = llmCostStats._sum.costUsd || 0
    const avgCostPerRequest = llmCostStats._avg.costUsd || 0
    const dailyProjection = llmLogsLast24h * avgCostPerRequest
    const monthlyProjection = dailyProjection * 30

    return NextResponse.json({
      overview: {
        totalUsers,
        totalProjects,
        totalInferenceRequests: totalLLMLogs,
        totalCost: totalCost.toFixed(2),
      },
      users: {
        total: totalUsers,
        new7d: usersLast7d,
        new30d: usersLast30d,
        growthRate: Math.round(userGrowth24h * 10) / 10,
        onboarding: {
          total: totalProfiles,
          completed: onboardingCompleted,
          completionRate: Math.round(onboardingRate),
        },
      },
      projects: {
        total: totalProjects,
        new7d: projectsLast7d,
        completed: completedProjects,
        completionRate: totalProjects > 0 ? Math.round((completedProjects / totalProjects) * 100) : 0,
        prd: {
          total: totalPRDSessions,
          completed: completedPRDSessions,
          new7d: prdSessionsLast7d,
          completionRate: Math.round(prdCompletionRate),
        },
      },
      inference: {
        total: totalLLMLogs,
        last24h: llmLogsLast24h,
        last7d: llmLogsLast7d,
        successRate: Math.round(llmSuccessRate * 10) / 10,
        errors: llmErrors,
        tokens: {
          total: llmTokenStats._sum.totalTokens || 0,
          prompt: llmTokenStats._sum.promptTokens || 0,
          completion: llmTokenStats._sum.completionTokens || 0,
          avgPerRequest: Math.round(llmTokenStats._avg.totalTokens || 0),
        },
        costs: {
          total: totalCost.toFixed(4),
          avgPerRequest: avgCostPerRequest.toFixed(4),
          dailyProjection: dailyProjection.toFixed(2),
          monthlyProjection: monthlyProjection.toFixed(2),
        },
        byModel: llmByModel.map(m => ({
          model: m.model,
          requests: m._count,
          cost: (m._sum.costUsd || 0).toFixed(4),
          tokens: m._sum.totalTokens || 0,
        })),
        byPurpose: llmByPurpose.map(p => ({
          purpose: p.purpose,
          requests: p._count,
          cost: (p._sum.costUsd || 0).toFixed(4),
        })),
      },
      generations: {
        total: totalGenerations,
        last7d: generationsLast7d,
        failed: failedGenerations,
        successRate: Math.round(generationSuccessRate),
        byType: generationsByType.map(g => ({
          type: g.type,
          count: g._count,
        })),
      },
      documents: {
        total: totalDocuments,
        bookmarked: bookmarkedDocuments,
        byType: documentsByType.map(d => ({
          type: d.type,
          count: d._count,
        })),
      },
      workshops: {
        total: totalWorkshops,
        totalAttendance,
        avgAttendancePerWorkshop: totalWorkshops > 0 ? Math.round(totalAttendance / totalWorkshops) : 0,
        creditsDistributed: creditsDistributed._sum.creditsAwarded || 0,
      },
      resources: {
        drafts: {
          total: totalResourceDrafts,
          pending: pendingDrafts,
          published: publishedDrafts,
        },
        topics: {
          queued: queuedTopics,
        },
        recentJobs: resourceJobs.map(job => ({
          id: job.id,
          status: job.status,
          processed: job.itemsProcessed,
          succeeded: job.itemsSucceeded,
          failed: job.itemsFailed,
          startedAt: job.startedAt,
          completedAt: job.completedAt,
          durationMs: job.durationMs,
        })),
      },
    })
  } catch (error: any) {
    console.error('[Admin Analytics] Error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
