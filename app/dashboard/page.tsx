import { stackServerApp } from '@/stack'
import { prisma } from '@/lib/prisma'
import Link from 'next/link'
import { formatDistanceToNow } from 'date-fns'
import { Button } from '@/components/ui/button'

export const dynamic = 'force-dynamic'

export default async function DashboardPage() {
  const user = await stackServerApp.getUser({ or: 'redirect' })
  
  const projects = await prisma.project.findMany({
    where: { userId: user.id },
    include: {
      prdSessions: {
        orderBy: { updatedAt: 'desc' },
        take: 1
      }
    },
    orderBy: { updatedAt: 'desc' }
  })

  const profile = await prisma.userProfile.findUnique({
    where: { userId: user.id }
  })

  const llmStats = await prisma.lLMLog.aggregate({
    where: { userId: user.id },
    _sum: { totalTokens: true, costUsd: true },
    _count: true
  })

  return (
    <div className="min-h-screen bg-black py-12">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold text-white mb-2">Dashboard</h1>
            <p className="text-gray-400">Your projects and PRD sessions</p>
          </div>
          <div className="flex gap-3">
            {!profile?.onboardingCompleted && (
              <Link href="/onboarding">
                <Button variant="outline" className="border-orange-500 text-orange-500 hover:bg-orange-500/10">
                  Complete Onboarding
                </Button>
              </Link>
            )}
            <Link href="/builder/prd-builder">
              <Button className="bg-orange-500 hover:bg-orange-600">
                New PRD
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
            <div className="text-xs text-gray-400 mb-1">Profile</div>
            <div className="text-sm text-white">{profile?.onboardingCompleted ? '✓ Complete' : 'Incomplete'}</div>
          </div>
        </div>

        {/* Projects Table */}
        <div className="rounded-xl border border-gray-800 bg-gray-900/30 overflow-hidden">
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
                              <Button variant="outline" className="border-gray-700 text-gray-300 hover:border-orange-500">
                                Continue
                              </Button>
                            </Link>
                            {canView && (
                              <Link href={`/projects/${project.id}`}>
                                <Button variant="outline" className="border-gray-700 text-gray-300 hover:border-orange-500">
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
      </div>
    </div>
  )
}
