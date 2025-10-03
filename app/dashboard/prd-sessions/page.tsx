import { stackServerApp } from '@/stack'
import { prisma } from '@/lib/prisma'
import Link from 'next/link'
import { formatDistanceToNow } from 'date-fns'

export default async function PRDSessionsPage() {
  const user = await stackServerApp.getUser({ or: 'redirect' })
  
  const sessions = await prisma.pRDSession.findMany({
    where: { userId: user.id },
    orderBy: { updatedAt: 'desc' },
    take: 50
  })

  const llmStats = await prisma.lLMLog.aggregate({
    where: { userId: user.id },
    _sum: { totalTokens: true, costUsd: true },
    _count: true
  })

  return (
    <div className="min-h-screen bg-black py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">Your PRD Sessions</h1>
          <p className="text-gray-400">Resume or review your product planning sessions</p>
        </div>

        {/* Usage Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="p-4 rounded-xl border border-gray-800 bg-gray-900/50">
            <div className="text-xs text-gray-400 mb-1">Total Sessions</div>
            <div className="text-2xl font-bold text-white">{sessions.length}</div>
          </div>
          <div className="p-4 rounded-xl border border-gray-800 bg-gray-900/50">
            <div className="text-xs text-gray-400 mb-1">AI Calls</div>
            <div className="text-2xl font-bold text-white">{llmStats._count || 0}</div>
          </div>
          <div className="p-4 rounded-xl border border-gray-800 bg-gray-900/50">
            <div className="text-xs text-gray-400 mb-1">Total Cost</div>
            <div className="text-2xl font-bold text-white">${(llmStats._sum.costUsd || 0).toFixed(4)}</div>
          </div>
        </div>

        {/* Sessions List */}
        <div className="space-y-4">
          {sessions.length === 0 ? (
            <div className="p-12 text-center border border-gray-800 rounded-xl bg-gray-900/30">
              <p className="text-gray-400 mb-4">No sessions yet</p>
              <Link
                href="/builder/prd-builder"
                className="inline-block px-6 py-3 bg-orange-500 hover:bg-orange-600 text-black font-semibold rounded-lg transition-colors"
              >
                Start New PRD
              </Link>
            </div>
          ) : (
            sessions.map((session) => (
              <Link
                key={session.id}
                href={`/builder/prd-builder?session=${session.id}`}
                className="block p-6 rounded-xl border border-gray-800 bg-gray-900/50 hover:border-orange-500 transition-colors"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-white mb-1">
                      {session.sda || session.initialIntent || 'Untitled PRD'}
                    </h3>
                    {session.audience && (
                      <p className="text-sm text-gray-400 mb-2">
                        For: {session.audience}
                      </p>
                    )}
                    <div className="flex flex-wrap gap-2 text-xs">
                      <span className="px-2 py-1 rounded bg-gray-800 text-gray-300">
                        {session.phase}
                      </span>
                      {session.featuresMvp && session.featuresMvp.length > 0 && (
                        <span className="px-2 py-1 rounded bg-gray-800 text-gray-300">
                          {session.featuresMvp.length} MVP features
                        </span>
                      )}
                      {session.dbChoice && (
                        <span className="px-2 py-1 rounded bg-gray-800 text-gray-300">
                          {session.dbChoice}
                        </span>
                      )}
                      {session.completed && (
                        <span className="px-2 py-1 rounded bg-green-900 text-green-300">
                          ✓ Completed
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="text-right text-xs text-gray-400">
                    {formatDistanceToNow(new Date(session.updatedAt), { addSuffix: true })}
                  </div>
                </div>
              </Link>
            ))
          )}
        </div>
      </div>
    </div>
  )
}

