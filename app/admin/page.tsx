'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import {
  FileText, Calendar, Settings, ExternalLink, TrendingUp,
  DollarSign, CheckCircle, Clock, AlertCircle, Zap, Database, Bot
} from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

export default function AdminDashboard() {
  const [stats, setStats] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/admin/stats')
      .then(res => res.json())
      .then(data => {
        setStats(data)
        setLoading(false)
      })
      .catch(err => {
        console.error('Failed to load stats:', err)
        setLoading(false)
      })
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen bg-black py-20 flex items-center justify-center">
        <div className="text-orange-500">Loading dashboard...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black py-20">
      <div className="container mx-auto px-4 max-w-7xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">Command Center</h1>
          <p className="text-gray-400">Overview of your content generation and site management</p>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Card className="border-gray-800 bg-gradient-to-br from-gray-900/50 to-gray-900/30">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-400 flex items-center gap-2">
                <Bot className="w-4 h-4" />
                AI Articles Generated
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-white">{stats?.topics?.completed || 0}</div>
              <p className="text-xs text-gray-500 mt-1">
                {stats?.topics?.queued || 0} queued • {stats?.topics?.generating || 0} generating
              </p>
            </CardContent>
          </Card>

          <Card className="border-gray-800 bg-gradient-to-br from-green-900/20 to-gray-900/30">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-400 flex items-center gap-2">
                <CheckCircle className="w-4 h-4" />
                Success Rate
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-green-400">{stats?.quality?.successRate || 0}%</div>
              <p className="text-xs text-gray-500 mt-1">
                Avg confidence: {((stats?.quality?.avgConfidence || 0) * 100).toFixed(0)}%
              </p>
            </CardContent>
          </Card>

          <Card className="border-gray-800 bg-gradient-to-br from-orange-900/20 to-gray-900/30">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-400 flex items-center gap-2">
                <Clock className="w-4 h-4" />
                Pending Review
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-orange-400">{stats?.drafts?.pending || 0}</div>
              <p className="text-xs text-gray-500 mt-1">
                {stats?.drafts?.approved || 0} approved • {stats?.drafts?.published || 0} published
              </p>
            </CardContent>
          </Card>

          <Card className="border-gray-800 bg-gradient-to-br from-blue-900/20 to-gray-900/30">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-400 flex items-center gap-2">
                <DollarSign className="w-4 h-4" />
                Est. Total Cost
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-blue-400">${stats?.costs?.estimatedTotal?.toFixed(2) || '0.00'}</div>
              <p className="text-xs text-gray-500 mt-1">
                ${stats?.costs?.perArticle} per article
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions & Recent Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Quick Actions */}
          <div className="lg:col-span-1">
            <h2 className="text-xl font-bold text-white mb-4">Quick Actions</h2>
            <div className="space-y-3">
              <a href="/admin/cms" target="_blank" rel="noopener noreferrer">
                <Card className="border-gray-800 bg-gray-900/30 hover:border-orange-500 transition-colors cursor-pointer">
                  <CardHeader className="p-4">
                    <div className="flex items-center gap-3">
                      <FileText className="w-5 h-5 text-orange-500" />
                      <div className="flex-1">
                        <CardTitle className="text-sm text-white">Content CMS</CardTitle>
                        <CardDescription className="text-xs">Review AI drafts</CardDescription>
                      </div>
                      <ExternalLink className="w-4 h-4 text-gray-400" />
                    </div>
                  </CardHeader>
                </Card>
              </a>

              <Link href="/admin/workshops">
                <Card className="border-gray-800 bg-gray-900/30 hover:border-orange-500 transition-colors cursor-pointer">
                  <CardHeader className="p-4">
                    <div className="flex items-center gap-3">
                      <Calendar className="w-5 h-5 text-orange-500" />
                      <div className="flex-1">
                        <CardTitle className="text-sm text-white">Workshops</CardTitle>
                        <CardDescription className="text-xs">Manage events</CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                </Card>
              </Link>

              <a href="http://localhost:5556" target="_blank" rel="noopener noreferrer">
                <Card className="border-gray-800 bg-gray-900/30 hover:border-purple-500 transition-colors cursor-pointer">
                  <CardHeader className="p-4">
                    <div className="flex items-center gap-3">
                      <Database className="w-5 h-5 text-purple-500" />
                      <div className="flex-1">
                        <CardTitle className="text-sm text-white">Database</CardTitle>
                        <CardDescription className="text-xs">Prisma Studio</CardDescription>
                      </div>
                      <ExternalLink className="w-4 h-4 text-gray-400" />
                    </div>
                  </CardHeader>
                </Card>
              </a>
            </div>
          </div>

          {/* Recent Drafts */}
          <div className="lg:col-span-2">
            <h2 className="text-xl font-bold text-white mb-4">Recent AI-Generated Drafts</h2>
            <Card className="border-gray-800 bg-gray-900/30">
              <CardContent className="p-4">
                {stats?.drafts?.recent && stats.drafts.recent.length > 0 ? (
                  <div className="space-y-3">
                    {stats.drafts.recent.slice(0, 5).map((draft: any) => (
                      <div
                        key={draft.id}
                        className="flex items-center justify-between py-2 border-b border-gray-800 last:border-0"
                      >
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <p className="text-sm font-medium text-white truncate">
                              {draft.technology}
                            </p>
                            <Badge
                              variant="outline"
                              className={
                                draft.status === 'PENDING' ? 'border-orange-500 text-orange-400' :
                                draft.status === 'APPROVED' ? 'border-green-500 text-green-400' :
                                draft.status === 'PUBLISHED' ? 'border-blue-500 text-blue-400' :
                                'border-gray-600 text-gray-400'
                              }
                            >
                              {draft.status}
                            </Badge>
                          </div>
                          <p className="text-xs text-gray-500 truncate mt-1">
                            {draft.wordCount} words • {(draft.confidenceScore * 100).toFixed(0)}% confidence
                          </p>
                        </div>
                        <div className="text-xs text-gray-500 ml-4">
                          {new Date(draft.createdAt).toLocaleDateString()}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <Bot className="w-12 h-12 mx-auto mb-3 opacity-20" />
                    <p>No drafts generated yet</p>
                    <p className="text-xs mt-1">Queue topics to start generating</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Generation Jobs */}
        <div className="mb-8">
          <h2 className="text-xl font-bold text-white mb-4">Recent Generation Jobs</h2>
          <Card className="border-gray-800 bg-gray-900/30">
            <CardContent className="p-4">
              {stats?.jobs?.recent && stats.jobs.recent.length > 0 ? (
                <div className="space-y-3">
                  {stats.jobs.recent.map((job: any) => (
                    <div
                      key={job.id}
                      className="flex items-center justify-between py-2 border-b border-gray-800 last:border-0"
                    >
                      <div className="flex items-center gap-4">
                        <div className={`w-2 h-2 rounded-full ${
                          job.status === 'COMPLETED' ? 'bg-green-500' :
                          job.status === 'RUNNING' ? 'bg-yellow-500 animate-pulse' :
                          'bg-red-500'
                        }`} />
                        <div>
                          <p className="text-sm font-medium text-white">
                            {job.type.replace('_', ' ').toUpperCase()}
                          </p>
                          <p className="text-xs text-gray-500">
                            {job.itemsSucceeded}/{job.itemsProcessed} succeeded • {job.itemsFailed} failed
                            {job.durationMs && ` • ${(job.durationMs / 1000).toFixed(1)}s`}
                          </p>
                        </div>
                      </div>
                      <div className="text-xs text-gray-500">
                        {new Date(job.startedAt).toLocaleString()}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <Zap className="w-12 h-12 mx-auto mb-3 opacity-20" />
                  <p>No generation jobs yet</p>
                  <p className="text-xs mt-1">Jobs will appear here after cron runs</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* System Status */}
        <div>
          <h2 className="text-xl font-bold text-white mb-4">System Status</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="border-gray-800 bg-gray-900/30">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-400">Queue Health</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-2">
                  {stats?.topics?.queued > 0 ? (
                    <>
                      <TrendingUp className="w-5 h-5 text-green-500" />
                      <span className="text-sm text-green-400">Active</span>
                    </>
                  ) : (
                    <>
                      <AlertCircle className="w-5 h-5 text-yellow-500" />
                      <span className="text-sm text-yellow-400">Empty Queue</span>
                    </>
                  )}
                </div>
                <p className="text-xs text-gray-500 mt-2">
                  {stats?.topics?.queued || 0} topics ready to process
                </p>
              </CardContent>
            </Card>

            <Card className="border-gray-800 bg-gray-900/30">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-400">Avg Quality</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-white">
                  {stats?.quality?.avgWordCount || 0}
                </div>
                <p className="text-xs text-gray-500 mt-1">words per article</p>
              </CardContent>
            </Card>

            <Card className="border-gray-800 bg-gray-900/30">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-400">Monthly Projection</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-white">
                  ${stats?.costs?.monthlyEstimate?.toFixed(2) || '0.00'}
                </div>
                <p className="text-xs text-gray-500 mt-1">for queued topics</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
