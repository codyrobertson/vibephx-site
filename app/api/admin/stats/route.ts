import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    // Resource Generation Stats
    const [
      totalDrafts,
      pendingDrafts,
      approvedDrafts,
      publishedDrafts,
      queuedTopics,
      generatingTopics,
      completedTopics,
      failedTopics,
      recentJobs,
      recentDrafts,
      avgConfidence,
      avgWordCount,
    ] = await Promise.all([
      // Draft stats
      prisma.resourceDraft.count(),
      prisma.resourceDraft.count({ where: { status: 'PENDING' } }),
      prisma.resourceDraft.count({ where: { status: 'APPROVED' } }),
      prisma.resourceDraft.count({ where: { status: 'PUBLISHED' } }),

      // Topic stats
      prisma.resourceTopic.count({ where: { status: 'QUEUED' } }),
      prisma.resourceTopic.count({ where: { status: 'GENERATING' } }),
      prisma.resourceTopic.count({ where: { status: 'COMPLETED' } }),
      prisma.resourceTopic.count({ where: { status: 'FAILED' } }),

      // Recent jobs
      prisma.generationJob.findMany({
        where: { type: 'resource_article' },
        orderBy: { startedAt: 'desc' },
        take: 5,
      }),

      // Recent drafts
      prisma.resourceDraft.findMany({
        orderBy: { createdAt: 'desc' },
        take: 10,
        select: {
          id: true,
          technology: true,
          title: true,
          status: true,
          confidenceScore: true,
          wordCount: true,
          createdAt: true,
        },
      }),

      // Quality metrics
      prisma.resourceDraft.aggregate({
        _avg: { confidenceScore: true },
      }),
      prisma.resourceDraft.aggregate({
        _avg: { wordCount: true },
      }),
    ])

    // Calculate costs (estimates)
    const totalGenerated = completedTopics
    const estimatedCostPerArticle = 0.20
    const totalCost = totalGenerated * estimatedCostPerArticle

    // Calculate success rate
    const totalAttempts = completedTopics + failedTopics
    const successRate = totalAttempts > 0 ? (completedTopics / totalAttempts) * 100 : 0

    // Aggregate job stats
    const jobStats = recentJobs.reduce((acc, job) => {
      acc.totalProcessed += job.itemsProcessed
      acc.totalSucceeded += job.itemsSucceeded
      acc.totalFailed += job.itemsFailed
      return acc
    }, { totalProcessed: 0, totalSucceeded: 0, totalFailed: 0 })

    return NextResponse.json({
      drafts: {
        total: totalDrafts,
        pending: pendingDrafts,
        approved: approvedDrafts,
        published: publishedDrafts,
        recent: recentDrafts,
      },
      topics: {
        queued: queuedTopics,
        generating: generatingTopics,
        completed: completedTopics,
        failed: failedTopics,
      },
      jobs: {
        recent: recentJobs,
        stats: jobStats,
      },
      quality: {
        avgConfidence: avgConfidence._avg.confidenceScore || 0,
        avgWordCount: Math.round(avgWordCount._avg.wordCount || 0),
        successRate: Math.round(successRate),
      },
      costs: {
        totalGenerated,
        estimatedTotal: totalCost,
        perArticle: estimatedCostPerArticle,
        monthlyEstimate: queuedTopics > 0 ? (queuedTopics * estimatedCostPerArticle) : 0,
      },
    })
  } catch (error: any) {
    console.error('[Admin Stats] Error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
