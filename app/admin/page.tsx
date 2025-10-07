'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import {
  FileText, Calendar, ExternalLink, TrendingUp,
  DollarSign, CheckCircle, Clock, Zap, Database, Bot, Users,
  FolderKanban, Brain, FileCode, GraduationCap, Activity, Sparkles,
  Target, ArrowUpRight, ArrowDownRight
} from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { PageHeader } from '@/components/ui/page-header'
import { StatCard } from '@/components/ui/stat-card'
import { Button } from '@/components/ui/button'

interface Analytics {
  overview: any
  users: any
  projects: any
  inference: any
  generations: any
  documents: any
  workshops: any
  resources: any
}

export default function AdminDashboard() {
  const [analytics, setAnalytics] = useState<Analytics | null>(null)
  const [resourceStats, setResourceStats] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([
      fetch('/api/admin/analytics').then(res => res.json()),
      fetch('/api/admin/stats').then(res => res.json()),
    ])
      .then(([analyticsData, resourceData]) => {
        setAnalytics(analyticsData)
        setResourceStats(resourceData)
        setLoading(false)
      })
      .catch(err => {
        console.error('Failed to load dashboard data:', err)
        setLoading(false)
      })
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen bg-black py-20 flex items-center justify-center">
        <div className="text-orange-500 flex items-center gap-2">
          <Sparkles className="w-5 h-5 animate-spin" />
          Loading command center...
        </div>
      </div>
    )
  }

  if (!analytics) {
    return (
      <div className="min-h-screen bg-black py-20 flex items-center justify-center">
        <div className="text-red-500">Failed to load dashboard data</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black py-20">
      <div className="container mx-auto px-4 max-w-7xl">
        <PageHeader
          title="Command Center"
          description="Comprehensive analytics for your application, inference usage, and content generation"
          actions={
            <>
              <a href="/admin/cms" target="_blank" rel="noopener noreferrer">
                <Button variant="outline" size="sm">
                  <FileText className="w-4 h-4 mr-2" />
                  CMS
                </Button>
              </a>
              <a href="http://localhost:5556" target="_blank" rel="noopener noreferrer">
                <Button variant="outline" size="sm">
                  <Database className="w-4 h-4 mr-2" />
                  Database
                </Button>
              </a>
            </>
          }
        />

        {/* Overview Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <StatCard
            title="Total Users"
            value={analytics.overview.totalUsers}
            description={`+${analytics.users.new7d} this week`}
            icon={Users}
            gradient="blue"
            trend={{
              value: analytics.users.growthRate,
              isPositive: analytics.users.growthRate > 0
            }}
          />
          <StatCard
            title="Total Projects"
            value={analytics.overview.totalProjects}
            description={`${analytics.projects.completed} completed`}
            icon={FolderKanban}
            gradient="purple"
          />
          <StatCard
            title="Inference Requests"
            value={analytics.overview.totalInferenceRequests}
            description={`${analytics.inference.last24h} in last 24h`}
            icon={Brain}
            gradient="orange"
          />
          <StatCard
            title="Total Cost"
            value={`$${analytics.overview.totalCost}`}
            description={`$${analytics.inference.costs.monthlyProjection}/mo projected`}
            icon={DollarSign}
            gradient="green"
          />
        </div>

        {/* Inference Analytics */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
            <Brain className="w-6 h-6 text-orange-500" />
            AI Inference Analytics
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
            <StatCard
              title="Success Rate"
              value={`${analytics.inference.successRate}%`}
              description={`${analytics.inference.errors} errors`}
              icon={CheckCircle}
              gradient="green"
            />
            <StatCard
              title="Total Tokens"
              value={(analytics.inference.tokens.total / 1000000).toFixed(2) + 'M'}
              description={`${analytics.inference.tokens.avgPerRequest.toLocaleString()} avg/request`}
              icon={Activity}
              gradient="blue"
            />
            <StatCard
              title="Avg Cost/Request"
              value={`$${analytics.inference.costs.avgPerRequest}`}
              description="Per inference call"
              icon={DollarSign}
              gradient="orange"
            />
            <StatCard
              title="Daily Projection"
              value={`$${analytics.inference.costs.dailyProjection}`}
              description="Based on current usage"
              icon={TrendingUp}
              gradient="purple"
            />
          </div>

          {/* Model & Purpose Breakdown */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Card className="border-gray-800 bg-gray-900/30">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-orange-500" />
                  Usage by Model
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {analytics.inference.byModel.slice(0, 5).map((model: any) => (
                    <div key={model.model} className="flex items-center justify-between py-2 border-b border-gray-800 last:border-0">
                      <div>
                        <p className="text-sm font-medium text-white">{model.model}</p>
                        <p className="text-xs text-gray-500">{model.requests.toLocaleString()} requests</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-semibold text-orange-400">${model.cost}</p>
                        <p className="text-xs text-gray-500">{(model.tokens / 1000).toFixed(0)}k tokens</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="border-gray-800 bg-gray-900/30">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Target className="w-5 h-5 text-blue-500" />
                  Usage by Purpose
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {analytics.inference.byPurpose.slice(0, 5).map((purpose: any) => (
                    <div key={purpose.purpose} className="flex items-center justify-between py-2 border-b border-gray-800 last:border-0">
                      <div>
                        <p className="text-sm font-medium text-white capitalize">{purpose.purpose.replace(/_/g, ' ')}</p>
                        <p className="text-xs text-gray-500">{purpose.requests.toLocaleString()} requests</p>
                      </div>
                      <p className="text-sm font-semibold text-blue-400">${purpose.cost}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Projects & PRD Analytics */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
            <FolderKanban className="w-6 h-6 text-purple-500" />
            Projects & PRD Sessions
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            <StatCard
              title="Total Projects"
              value={analytics.projects.total}
              description={`${analytics.projects.new7d} this week`}
              icon={FolderKanban}
              gradient="purple"
            />
            <StatCard
              title="Completed"
              value={analytics.projects.completed}
              description={`${analytics.projects.completionRate}% completion rate`}
              icon={CheckCircle}
              gradient="green"
            />
            <StatCard
              title="PRD Sessions"
              value={analytics.projects.prd.total}
              description={`${analytics.projects.prd.new7d} this week`}
              icon={FileText}
              gradient="orange"
            />
            <StatCard
              title="PRD Completed"
              value={analytics.projects.prd.completed}
              description={`${analytics.projects.prd.completionRate}% completion`}
              icon={CheckCircle}
              gradient="blue"
            />
            <StatCard
              title="Documents"
              value={analytics.documents.total}
              description={`${analytics.documents.bookmarked} bookmarked`}
              icon={FileCode}
              gradient="gray"
            />
          </div>
        </div>

        {/* Resource Generation & Workshops */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Resource Generation */}
          <div>
            <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
              <Bot className="w-5 h-5 text-orange-500" />
              AI Resource Generation
            </h2>
            <div className="grid grid-cols-2 gap-4 mb-4">
              <StatCard
                title="Total Drafts"
                value={analytics.resources.drafts.total}
                description={`${analytics.resources.drafts.pending} pending`}
                icon={FileText}
                gradient="orange"
              />
              <StatCard
                title="Published"
                value={analytics.resources.drafts.published}
                description={`${analytics.resources.topics.queued} queued`}
                icon={CheckCircle}
                gradient="green"
              />
            </div>
            <Card className="border-gray-800 bg-gray-900/30">
              <CardHeader>
                <CardTitle className="text-white text-sm">Recent Generation Jobs</CardTitle>
              </CardHeader>
              <CardContent>
                {analytics.resources.recentJobs && analytics.resources.recentJobs.length > 0 ? (
                  <div className="space-y-2">
                    {analytics.resources.recentJobs.slice(0, 3).map((job: any) => (
                      <div key={job.id} className="flex items-center justify-between py-2 border-b border-gray-800 last:border-0">
                        <div className="flex items-center gap-2">
                          <div className={`w-2 h-2 rounded-full ${
                            job.status === 'COMPLETED' ? 'bg-green-500' :
                            job.status === 'RUNNING' ? 'bg-yellow-500 animate-pulse' :
                            'bg-red-500'
                          }`} />
                          <div>
                            <p className="text-xs font-medium text-white">{job.status}</p>
                            <p className="text-xs text-gray-500">{job.succeeded}/{job.processed} succeeded</p>
                          </div>
                        </div>
                        <p className="text-xs text-gray-500">{new Date(job.startedAt).toLocaleTimeString()}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-gray-500 text-center py-4">No recent jobs</p>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Workshops */}
          <div>
            <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
              <GraduationCap className="w-5 h-5 text-blue-500" />
              Workshops & Credits
            </h2>
            <div className="grid grid-cols-2 gap-4 mb-4">
              <StatCard
                title="Total Workshops"
                value={analytics.workshops.total}
                description="Events created"
                icon={Calendar}
                gradient="blue"
              />
              <StatCard
                title="Total Attendance"
                value={analytics.workshops.totalAttendance}
                description={`${analytics.workshops.avgAttendancePerWorkshop} avg/workshop`}
                icon={Users}
                gradient="purple"
              />
            </div>
            <Card className="border-gray-800 bg-gray-900/30">
              <CardHeader>
                <CardTitle className="text-white text-sm">Credits Distributed</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-green-400">${analytics.workshops.creditsDistributed}</div>
                <p className="text-xs text-gray-500 mt-1">Total workshop credits awarded</p>
              </CardContent>
            </Card>
            <Link href="/admin/workshops" className="mt-4 block">
              <Button variant="outline" size="sm" className="w-full">
                <Calendar className="w-4 h-4 mr-2" />
                Manage Workshops
              </Button>
            </Link>
          </div>
        </div>

        {/* Recent AI Drafts */}
        <div className="mb-8">
          <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
            <Bot className="w-5 h-5 text-orange-500" />
            Recent AI-Generated Drafts
          </h2>
          <Card className="border-gray-800 bg-gray-900/30">
            <CardContent className="p-4">
              {resourceStats?.drafts?.recent && resourceStats.drafts.recent.length > 0 ? (
                <div className="space-y-3">
                  {resourceStats.drafts.recent.slice(0, 5).map((draft: any) => (
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

        {/* Users & Onboarding */}
        <div>
          <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
            <Users className="w-5 h-5 text-blue-500" />
            Users & Onboarding
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <StatCard
              title="New This Week"
              value={analytics.users.new7d}
              description="User signups"
              icon={Users}
              gradient="blue"
            />
            <StatCard
              title="New This Month"
              value={analytics.users.new30d}
              description="Last 30 days"
              icon={TrendingUp}
              gradient="green"
            />
            <StatCard
              title="Onboarding Rate"
              value={`${analytics.users.onboarding.completionRate}%`}
              description={`${analytics.users.onboarding.completed}/${analytics.users.onboarding.total} completed`}
              icon={CheckCircle}
              gradient="purple"
            />
            <StatCard
              title="Growth Rate"
              value={`${analytics.users.growthRate > 0 ? '+' : ''}${analytics.users.growthRate.toFixed(1)}%`}
              description="User growth"
              icon={analytics.users.growthRate > 0 ? ArrowUpRight : ArrowDownRight}
              gradient={analytics.users.growthRate > 0 ? 'green' : 'red'}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
