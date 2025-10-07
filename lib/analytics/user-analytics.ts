/**
 * Pure functions for user analytics
 * These functions process user activity data without side effects
 */

export interface UserActivityEvent {
  id: string
  userId: string
  eventType: string
  eventCategory: string
  eventName: string
  path?: string | null
  referrer?: string | null
  userAgent?: string | null
  properties?: any
  metadata?: any
  duration?: number | null
  createdAt: Date
}

export interface UserActivitySummary {
  userId: string
  totalEvents: number
  uniqueDays: number
  firstActivity: Date
  lastActivity: Date
  eventsByType: Record<string, number>
  eventsByCategory: Record<string, number>
  topPaths: Array<{ path: string; count: number }>
  avgSessionDuration: number
  completionRate?: number
}

export interface ActivityTrend {
  date: string
  count: number
  uniqueUsers: number
}

export interface UserEngagementScore {
  userId: string
  score: number
  rank: string // 'high', 'medium', 'low'
  breakdown: {
    frequency: number
    recency: number
    diversity: number
  }
}

/**
 * Calculate total events by type
 */
export function groupEventsByType(events: UserActivityEvent[]): Record<string, number> {
  return events.reduce((acc, event) => {
    acc[event.eventType] = (acc[event.eventType] || 0) + 1
    return acc
  }, {} as Record<string, number>)
}

/**
 * Calculate total events by category
 */
export function groupEventsByCategory(events: UserActivityEvent[]): Record<string, number> {
  return events.reduce((acc, event) => {
    acc[event.eventCategory] = (acc[event.eventCategory] || 0) + 1
    return acc
  }, {} as Record<string, number>)
}

/**
 * Get top paths by visit count
 */
export function getTopPaths(events: UserActivityEvent[], limit: number = 10): Array<{ path: string; count: number }> {
  const pathCounts = events
    .filter(e => e.path)
    .reduce((acc, event) => {
      const path = event.path!
      acc[path] = (acc[path] || 0) + 1
      return acc
    }, {} as Record<string, number>)

  return Object.entries(pathCounts)
    .map(([path, count]) => ({ path, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, limit)
}

/**
 * Calculate average session duration
 */
export function calculateAvgDuration(events: UserActivityEvent[]): number {
  const durations = events.filter(e => e.duration !== null && e.duration > 0).map(e => e.duration!)
  if (durations.length === 0) return 0
  return Math.round(durations.reduce((sum, d) => sum + d, 0) / durations.length)
}

/**
 * Count unique days of activity
 */
export function countUniqueDays(events: UserActivityEvent[]): number {
  const uniqueDays = new Set(
    events.map(e => new Date(e.createdAt).toISOString().split('T')[0])
  )
  return uniqueDays.size
}

/**
 * Generate activity summary for a user
 */
export function generateUserActivitySummary(events: UserActivityEvent[]): UserActivitySummary | null {
  if (events.length === 0) return null

  const sortedEvents = [...events].sort((a, b) =>
    new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
  )

  return {
    userId: events[0].userId,
    totalEvents: events.length,
    uniqueDays: countUniqueDays(events),
    firstActivity: sortedEvents[0].createdAt,
    lastActivity: sortedEvents[sortedEvents.length - 1].createdAt,
    eventsByType: groupEventsByType(events),
    eventsByCategory: groupEventsByCategory(events),
    topPaths: getTopPaths(events),
    avgSessionDuration: calculateAvgDuration(events),
  }
}

/**
 * Calculate activity trends over time
 */
export function calculateActivityTrends(events: UserActivityEvent[], days: number = 30): ActivityTrend[] {
  const now = new Date()
  const startDate = new Date(now.getTime() - days * 24 * 60 * 60 * 1000)

  // Group by date
  const eventsByDate = events
    .filter(e => new Date(e.createdAt) >= startDate)
    .reduce((acc, event) => {
      const date = new Date(event.createdAt).toISOString().split('T')[0]
      if (!acc[date]) {
        acc[date] = { events: [], users: new Set() }
      }
      acc[date].events.push(event)
      acc[date].users.add(event.userId)
      return acc
    }, {} as Record<string, { events: UserActivityEvent[], users: Set<string> }>)

  // Fill in missing dates
  const trends: ActivityTrend[] = []
  for (let i = 0; i < days; i++) {
    const date = new Date(startDate.getTime() + i * 24 * 60 * 60 * 1000)
    const dateStr = date.toISOString().split('T')[0]
    const data = eventsByDate[dateStr]

    trends.push({
      date: dateStr,
      count: data ? data.events.length : 0,
      uniqueUsers: data ? data.users.size : 0,
    })
  }

  return trends
}

/**
 * Calculate user engagement score
 * Based on Frequency, Recency, and Diversity (FRD model)
 */
export function calculateEngagementScore(events: UserActivityEvent[]): UserEngagementScore | null {
  if (events.length === 0) return null

  const userId = events[0].userId
  const now = Date.now()
  const sortedEvents = [...events].sort((a, b) =>
    new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  )

  // Frequency: Events per day
  const uniqueDays = countUniqueDays(events)
  const daysSinceFirst = (now - new Date(sortedEvents[sortedEvents.length - 1].createdAt).getTime()) / (1000 * 60 * 60 * 24)
  const frequency = uniqueDays > 0 ? events.length / uniqueDays : 0
  const frequencyScore = Math.min(frequency * 10, 100) // Cap at 100

  // Recency: Days since last activity
  const daysSinceLast = (now - new Date(sortedEvents[0].createdAt).getTime()) / (1000 * 60 * 60 * 24)
  const recencyScore = Math.max(100 - daysSinceLast * 5, 0) // Decreases over time

  // Diversity: Unique event types
  const uniqueTypes = new Set(events.map(e => e.eventType)).size
  const diversityScore = Math.min(uniqueTypes * 10, 100) // Cap at 100

  // Overall score (weighted average)
  const overallScore = (frequencyScore * 0.4 + recencyScore * 0.4 + diversityScore * 0.2)

  let rank: 'high' | 'medium' | 'low'
  if (overallScore >= 70) rank = 'high'
  else if (overallScore >= 40) rank = 'medium'
  else rank = 'low'

  return {
    userId,
    score: Math.round(overallScore),
    rank,
    breakdown: {
      frequency: Math.round(frequencyScore),
      recency: Math.round(recencyScore),
      diversity: Math.round(diversityScore),
    }
  }
}

/**
 * Identify top users by activity
 */
export function getTopUsers(
  userEvents: Map<string, UserActivityEvent[]>,
  limit: number = 10
): Array<{ userId: string; events: number; score: number }> {
  return Array.from(userEvents.entries())
    .map(([userId, events]) => {
      const score = calculateEngagementScore(events)?.score || 0
      return { userId, events: events.length, score }
    })
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
}

/**
 * Calculate funnel conversion rates
 */
export function calculateFunnelConversion(
  events: UserActivityEvent[],
  funnelSteps: string[]
): Array<{ step: string; users: number; conversionRate: number }> {
  const usersByStep = new Map<string, Set<string>>()

  // Group users by step
  funnelSteps.forEach(step => {
    usersByStep.set(step, new Set())
  })

  events.forEach(event => {
    if (funnelSteps.includes(event.eventType)) {
      usersByStep.get(event.eventType)!.add(event.userId)
    }
  })

  // Calculate conversion rates
  const totalUsers = usersByStep.get(funnelSteps[0])?.size || 0

  return funnelSteps.map((step, index) => {
    const users = usersByStep.get(step)?.size || 0
    const conversionRate = totalUsers > 0 ? (users / totalUsers) * 100 : 0

    return {
      step,
      users,
      conversionRate: Math.round(conversionRate * 10) / 10,
    }
  })
}

/**
 * Group events by user for batch processing
 */
export function groupEventsByUser(events: UserActivityEvent[]): Map<string, UserActivityEvent[]> {
  return events.reduce((acc, event) => {
    if (!acc.has(event.userId)) {
      acc.set(event.userId, [])
    }
    acc.get(event.userId)!.push(event)
    return acc
  }, new Map<string, UserActivityEvent[]>())
}

/**
 * Calculate retention rate
 */
export function calculateRetentionRate(
  events: UserActivityEvent[],
  cohortDate: Date,
  daysAfter: number
): number {
  const cohortEndDate = new Date(cohortDate.getTime() + 24 * 60 * 60 * 1000)
  const retentionDate = new Date(cohortDate.getTime() + daysAfter * 24 * 60 * 60 * 1000)
  const retentionEndDate = new Date(retentionDate.getTime() + 24 * 60 * 60 * 1000)

  // Users who joined in the cohort
  const cohortUsers = new Set(
    events
      .filter(e => {
        const date = new Date(e.createdAt)
        return date >= cohortDate && date < cohortEndDate &&
               (e.eventType === 'SIGN_UP' || e.eventType === 'SIGN_IN')
      })
      .map(e => e.userId)
  )

  if (cohortUsers.size === 0) return 0

  // Users who returned on the retention date
  const returnedUsers = new Set(
    events
      .filter(e => {
        const date = new Date(e.createdAt)
        return date >= retentionDate && date < retentionEndDate && cohortUsers.has(e.userId)
      })
      .map(e => e.userId)
  )

  return Math.round((returnedUsers.size / cohortUsers.size) * 100 * 10) / 10
}
