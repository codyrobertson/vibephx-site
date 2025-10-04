import { prisma } from '@/lib/prisma'
import { generateAllTechDetails } from './tech-details-generator'

/**
 * Type-safe PRD phase definitions
 */
export type PRDPhase =
  | 'intro'
  | 'audience'
  | 'confirmIdea'
  | 'features'
  | 'providers'
  | 'stack'
  | 'integrations'
  | 'summary'
  | 'outputs'
  | 'final'

/**
 * Phase completion percentage mapping
 * Used to track overall progress through the PRD builder
 */
export const PHASE_COMPLETION_MAP: Record<PRDPhase, number> = {
  intro: 0,
  audience: 10,
  confirmIdea: 20,
  features: 40,
  providers: 60,
  stack: 70,
  integrations: 75,
  summary: 85,
  outputs: 95,
  final: 100
}

/**
 * Check if a phase is considered complete
 */
export function isPhaseComplete(phase: PRDPhase): boolean {
  return PHASE_COMPLETION_MAP[phase] >= 100
}

/**
 * Get completion percentage for a phase
 */
export function getPhaseCompletion(phase: PRDPhase): number {
  return PHASE_COMPLETION_MAP[phase]
}

/**
 * Check if PRD session has all required data for completion
 */
export function canCompletePRD(sessionData: {
  initialIntent?: string
  sda?: string
  featuresMvp?: string[]
  selectedStack?: string | null
  prdMarkdown?: string | null
}): boolean {
  return !!(
    sessionData.initialIntent &&
    sessionData.sda &&
    sessionData.featuresMvp &&
    sessionData.featuresMvp.length > 0 &&
    sessionData.selectedStack
    // prdMarkdown is optional - PRD content is in messages
  )
}

/**
 * Mark PRD session as completed
 * Uses minimal batch transaction for serverless reliability
 * Returns the updated session
 */
export async function markPRDCompleted(sessionId: string) {
  // 1) Read session outside transaction (fast, no lock)
  const session = await prisma.pRDSession.findUnique({
    where: { id: sessionId },
    include: { project: true }
  })

  if (!session) {
    throw new Error(`Session ${sessionId} not found`)
  }

  // Validate completion requirements
  if (!canCompletePRD(session)) {
    throw new Error('Session does not meet completion requirements')
  }

  const now = new Date()

  // 2) Minimal atomic batch (no long callback)
  const [updatedSession] = await prisma.$transaction(
    [
      prisma.pRDSession.update({
        where: { id: sessionId },
        data: {
          completed: true,
          completedAt: now,
          phase: 'final'
        }
      }),
      ...(session.projectId ? [
        prisma.project.update({
          where: { id: session.projectId },
          data: {
            status: 'COMPLETED',
            completedAt: now,
            lastPRDAt: now,
            prdCount: { increment: 1 }
          }
        })
      ] : [])
    ],
    {
      isolationLevel: 'ReadCommitted',
      timeout: 10000,
      maxWait: 5000
    }
  )

  // 3) Generate tech details in background (non-blocking)
  if (!session.techStackDetails || Object.keys(session.techStackDetails as any).length === 0) {
    generateAllTechDetails(
      {
        sda: session.sda || undefined,
        initialIntent: session.initialIntent,
        audience: session.audience || undefined,
        motivation: session.motivation || undefined,
        featuresMvp: session.featuresMvp,
        selectedStack: session.selectedStack || undefined,
        dbChoice: session.dbChoice || undefined,
        integrations: session.integrations
      },
      session.userId,
      session.projectId || undefined
    ).then(async (techDetails) => {
      await prisma.pRDSession.update({
        where: { id: sessionId },
        data: {
          techStackDetails: techDetails as any
        }
      })
      console.log(`✅ Tech details generated for session ${sessionId}`)
    }).catch((error) => {
      console.error(`❌ Failed to generate tech details for session ${sessionId}:`, error)
    })
  }

  return updatedSession
}

/**
 * Mark PRD session as in progress (generating)
 * Updates project status to GENERATING
 * Uses minimal batch transaction for serverless reliability
 */
export async function markPRDGenerating(sessionId: string) {
  // 1) Read session outside transaction
  const session = await prisma.pRDSession.findUnique({
    where: { id: sessionId }
  })

  if (!session) {
    throw new Error(`Session ${sessionId} not found`)
  }

  const now = new Date()

  // 2) Minimal atomic batch
  await prisma.$transaction(
    [
      prisma.pRDSession.update({
        where: { id: sessionId },
        data: { phase: 'outputs' }
      }),
      ...(session.projectId ? [
        prisma.project.update({
          where: { id: session.projectId },
          data: {
            status: 'GENERATING',
            prdGeneratedAt: now
          }
        })
      ] : [])
    ],
    {
      isolationLevel: 'ReadCommitted',
      timeout: 10000,
      maxWait: 5000
    }
  )

  return session
}

/**
 * Get completion statistics for a user
 */
export async function getUserCompletionStats(userId: string) {
  const [totalSessions, completedSessions, totalProjects, completedProjects] = await Promise.all([
    prisma.pRDSession.count({
      where: { userId }
    }),
    prisma.pRDSession.count({
      where: { userId, completed: true }
    }),
    prisma.project.count({
      where: { userId }
    }),
    prisma.project.count({
      where: { userId, status: 'COMPLETED' }
    })
  ])

  return {
    totalSessions,
    completedSessions,
    completionRate: totalSessions > 0 ? (completedSessions / totalSessions) * 100 : 0,
    totalProjects,
    completedProjects,
    projectCompletionRate: totalProjects > 0 ? (completedProjects / totalProjects) * 100 : 0
  }
}

/**
 * Get recent PRD sessions for a user
 * Useful for sidebar/dashboard display
 */
export async function getRecentPRDSessions(userId: string, limit: number = 10) {
  return await prisma.pRDSession.findMany({
    where: { userId },
    include: {
      project: {
        select: {
          id: true,
          title: true,
          status: true
        }
      }
    },
    orderBy: { updatedAt: 'desc' },
    take: limit
  })
}
