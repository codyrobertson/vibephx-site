import { stackServerApp } from '@/stack'
import { prisma } from '@/lib/prisma'
import Link from 'next/link'
import Image from 'next/image'
import { formatDistanceToNow } from 'date-fns'
import { Button } from '@/components/ui/button'
import { FilePlus } from 'lucide-react'

export const dynamic = 'force-dynamic'
export const revalidate = 60 // Revalidate every 60 seconds

export default async function DashboardPage() {
  const user = await stackServerApp.getUser({ or: 'redirect' })

  // Auto-sync user IDs if mismatch detected (workshop attendance fix)
  const prismaUser = await prisma.user.findUnique({
    where: { email: user.primaryEmail || '' }
  })

  if (prismaUser && prismaUser.id !== user.id) {
    console.log('[AUTO-SYNC] User ID mismatch detected, syncing...')
    console.log('[AUTO-SYNC] Stack Auth ID:', user.id, 'Prisma ID:', prismaUser.id)

    try {
      // Update all workshop attendance records
      await prisma.workshopAttendance.updateMany({
        where: { userId: prismaUser.id },
        data: { userId: user.id }
      })

      // Update all projects
      await prisma.project.updateMany({
        where: { userId: prismaUser.id },
        data: { userId: user.id }
      })

      // Update profile
      await prisma.userProfile.updateMany({
        where: { userId: prismaUser.id },
        data: { userId: user.id }
      })

      // Delete old user record
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

      console.log('[AUTO-SYNC] Successfully synced user IDs')
    } catch (error) {
      console.error('[AUTO-SYNC] Failed to sync:', error)
    }
  }

  // Parallelize all database queries for maximum performance
  const [projects, userWithProfile, llmStats, workshops] = await Promise.all([
    // Query 1: Projects with latest session
    prisma.project.findMany({
      where: { userId: user.id },
      include: {
        prdSessions: {
          orderBy: { updatedAt: 'desc' },
          take: 1,
          select: {
            id: true,
            phase: true,
            sda: true,
            initialIntent: true,
            updatedAt: true
          }
        }
      },
      orderBy: { updatedAt: 'desc' },
      take: 50 // Limit to recent 50 projects
    }),

    // Query 2: User with profile and credits (combined query)
    prisma.user.findUnique({
      where: { id: user.id },
      select: {
        creditsBalance: true,
        profile: {
          select: {
            onboardingCompleted: true
          }
        }
      }
    }),

    // Query 3: LLM statistics
    prisma.lLMLog.aggregate({
      where: { userId: user.id },
      _sum: { totalTokens: true, costUsd: true },
      _count: true
    }),

    // Query 4: Workshops with attendance
    prisma.workshop.findMany({
      where: {
        attendees: {
          some: {
            userId: user.id
          }
        }
      },
      include: {
        attendees: {
          where: {
            userId: user.id
          },
          select: {
            id: true,
            creditsAwarded: true,
            creditsApplied: true
          }
        }
      },
      orderBy: { date: 'desc' },
      take: 20 // Limit to recent 20 workshops
    })
  ])

  // Extract profile from combined query
  const profile = userWithProfile?.profile

  console.log('[DASHBOARD] User ID:', user.id)
  console.log('[DASHBOARD] Workshops found:', workshops.length)

  return (
    <div className="min-h-screen bg-black py-12">
      <div className="container mx-auto px-4">
        {/* Profile Incomplete Banner */}
        {!profile?.onboardingCompleted && (
          <div className="mb-6 p-4 bg-orange-500/10 border border-orange-500/20 rounded-lg flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-orange-500/20 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <p className="text-white font-medium">Complete your profile to unlock all features</p>
                <p className="text-gray-400 text-sm">Set your preferences and get personalized project recommendations</p>
              </div>
            </div>
            <Link href="/onboarding">
              <Button variant="outline" className="border-orange-500 text-orange-500 hover:bg-orange-500/10">
                Complete Profile
              </Button>
            </Link>
          </div>
        )}

        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold text-white mb-2">Dashboard</h1>
            <p className="text-gray-400">Your projects and PRD sessions</p>
          </div>
          <div className="flex gap-3">
            <Link href="/builder/prd-builder">
              <Button className="bg-orange-500 hover:bg-orange-600">
                <FilePlus className="w-4 h-4" />
                Create PRD
              </Button>
            </Link>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="p-4 rounded-xl border border-gray-800 bg-gray-900/50">
            <div className="text-xs text-gray-400 mb-1">Total Projects</div>
            <div className="text-2xl font-bold text-white">{projects.length}</div>
          </div>
          <div className="p-4 rounded-xl border border-gray-800 bg-gray-900/50">
            <div className="text-xs text-gray-400 mb-1">AI Calls</div>
            <div className="text-2xl font-bold text-white">{llmStats._count || 0}</div>
          </div>
          <div className="p-4 rounded-xl border border-gray-800 bg-gray-900/50">
            <div className="text-xs text-gray-400 mb-1">Total Cost</div>
            <div className="text-2xl font-bold text-white">${(llmStats._sum.costUsd || 0).toFixed(4)}</div>
          </div>
          <div className="p-4 rounded-xl border border-gray-800 bg-gray-900/50">
            <div className="text-xs text-gray-400 mb-1">Credits Balance</div>
            <div className="text-2xl font-bold text-white">${(userWithProfile?.creditsBalance || 0).toFixed(2)}</div>
          </div>
        </div>

        {/* Projects Table */}
        <div className="rounded-xl border border-gray-800 bg-gray-900/30 overflow-hidden mb-8">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-800">
                  <th className="text-left px-6 py-4 text-xs font-medium text-gray-400 uppercase tracking-wider">Project</th>
                  <th className="text-left px-6 py-4 text-xs font-medium text-gray-400 uppercase tracking-wider">Status</th>
                  <th className="text-left px-6 py-4 text-xs font-medium text-gray-400 uppercase tracking-wider">Last Updated</th>
                  <th className="text-right px-6 py-4 text-xs font-medium text-gray-400 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody>
                {projects.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="px-6 py-12 text-center">
                      <div className="text-gray-400 mb-4">No projects yet</div>
                      <Link href="/builder/prd-builder">
                        <Button className="bg-orange-500 hover:bg-orange-600">
                          <FilePlus className="w-4 h-4" />
                          Create Your First PRD
                        </Button>
                      </Link>
                    </td>
                  </tr>
                ) : (
                  projects.map((project) => {
                    const latestSession = project.prdSessions[0]
                    const canView = project.status === 'COMPLETED' || (latestSession && (latestSession as any).phase === 'final')
                    return (
                      <tr key={project.id} className="border-b border-gray-800 hover:bg-gray-900/50 transition-colors">
                        <td className="px-6 py-4">
                          <div className="text-white font-medium">{project.title || latestSession?.sda || latestSession?.initialIntent || 'Untitled'}</div>
                          {project.description && (
                            <div className="text-sm text-gray-400 mt-1">{project.description}</div>
                          )}
                        </td>
                        <td className="px-6 py-4">
                          <span className={`px-2 py-1 rounded text-xs ${
                            project.status === 'COMPLETED' ? 'bg-green-900 text-green-300' :
                            project.status === 'GENERATING' ? 'bg-blue-900 text-blue-300' :
                            project.status === 'ERROR' ? 'bg-red-900 text-red-300' :
                            'bg-gray-800 text-gray-300'
                          }`}>
                            {project.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-400">
                          {formatDistanceToNow(new Date(project.updatedAt), { addSuffix: true })}
                        </td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex justify-end gap-2">
                            <Link href={latestSession ? `/builder/prd-builder?session=${latestSession.id}` : `/builder/prd-builder`}>
                              <Button variant="outline" className="border-gray-700 text-gray-300 hover:bg-white/10 hover:border-white">
                                Continue
                              </Button>
                            </Link>
                            {canView && (
                              <Link href={`/projects/${project.id}`}>
                                <Button className="bg-white text-black hover:bg-gray-200">
                                  View
                                </Button>
                              </Link>
                            )}
                          </div>
                        </td>
                      </tr>
                    )
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Workshops Table */}
        <div className="rounded-xl border border-gray-800 bg-gray-900/30 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-800">
            <h2 className="text-xl font-bold text-white">Workshop Attendance</h2>
            <p className="text-sm text-gray-400 mt-1">Your attended workshops and earned credits</p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-800">
                  <th className="text-left px-6 py-4 text-xs font-medium text-gray-400 uppercase tracking-wider">Workshop</th>
                  <th className="text-left px-6 py-4 text-xs font-medium text-gray-400 uppercase tracking-wider">Date</th>
                  <th className="text-left px-6 py-4 text-xs font-medium text-gray-400 uppercase tracking-wider">Location</th>
                  <th className="text-left px-6 py-4 text-xs font-medium text-gray-400 uppercase tracking-wider">Credits Awarded</th>
                  <th className="text-left px-6 py-4 text-xs font-medium text-gray-400 uppercase tracking-wider">Status</th>
                </tr>
              </thead>
              <tbody>
                {workshops.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-12 text-center">
                      <Image
                        src="/workshop-one-medal.png"
                        alt="Workshop Medal"
                        width={80}
                        height={80}
                        className="mx-auto mb-4 opacity-30"
                      />
                      <div className="text-gray-400">No workshops attended yet</div>
                    </td>
                  </tr>
                ) : (
                  workshops.map((workshop) => {
                    const attendance = workshop.attendees[0]
                    return (
                      <tr key={workshop.id} className="border-b border-gray-800 hover:bg-gray-900/50 transition-colors">
                        <td className="px-6 py-4">
                          <Link href={`/workshops/${workshop.id}`} className="block group">
                            <div className="flex items-start gap-3">
                              <Image
                                src="/workshop-one-medal.png"
                                alt="Workshop Medal"
                                width={40}
                                height={40}
                                className="flex-shrink-0 mt-1"
                              />
                              <div className="flex-1">
                                <div className="text-white font-medium group-hover:text-orange-500 transition-colors">{workshop.title}</div>
                                {workshop.description && (
                                  <div className="text-sm text-gray-400 mt-1">{workshop.description}</div>
                                )}
                              </div>
                            </div>
                          </Link>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-300">
                          {new Date(workshop.date).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric'
                          })}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-400">
                          {workshop.location || 'N/A'}
                        </td>
                        <td className="px-6 py-4">
                          <span className="text-green-400 font-semibold">
                            ${attendance.creditsAwarded.toFixed(2)}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`px-2 py-1 rounded text-xs ${
                            attendance.creditsApplied
                              ? 'bg-green-900 text-green-300'
                              : 'bg-yellow-900 text-yellow-300'
                          }`}>
                            {attendance.creditsApplied ? 'Applied' : 'Pending'}
                          </span>
                        </td>
                      </tr>
                    )
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}
