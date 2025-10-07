'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import {
  FileText, Calendar, ExternalLink, TrendingUp, DollarSign, CheckCircle,
  Clock, Zap, Database, Bot, Users, FolderKanban, Brain, FileCode,
  GraduationCap, Activity, Sparkles, Target, ArrowUpRight, ArrowDownRight,
  LayoutDashboard, BarChart3, Package, Layers
} from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { PageHeader } from '@/components/ui/page-header'
import { StatCard } from '@/components/ui/stat-card'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ModelDistributionChart } from '@/components/charts/ModelDistributionChart'
import { CostBreakdownChart } from '@/components/charts/CostBreakdownChart'
import { TokenUsageChart } from '@/components/charts/TokenUsageChart'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'

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
              <Link href="/admin/workshops">
                <Button variant="outline" size="sm">
                  <Calendar className="w-4 h-4 mr-2" />
                  Workshops
                </Button>
              </Link>
            </>
          }
        />

        <Tabs defaultValue="overview" className="mt-6">
          <TabsList className="bg-gray-900/50 border border-gray-800">
            <TabsTrigger value="overview" className="data-[state=active]:bg-orange-500/10 data-[state=active]:text-orange-400">
              <LayoutDashboard className="w-4 h-4 mr-2" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="inference" className="data-[state=active]:bg-orange-500/10 data-[state=active]:text-orange-400">
              <Brain className="w-4 h-4 mr-2" />
              Inference
            </TabsTrigger>
            <TabsTrigger value="projects" className="data-[state=active]:bg-orange-500/10 data-[state=active]:text-orange-400">
              <FolderKanban className="w-4 h-4 mr-2" />
              Projects
            </TabsTrigger>
            <TabsTrigger value="resources" className="data-[state=active]:bg-orange-500/10 data-[state=active]:text-orange-400">
              <Bot className="w-4 h-4 mr-2" />
              Resources
            </TabsTrigger>
            <TabsTrigger value="users" className="data-[state=active]:bg-orange-500/10 data-[state=active]:text-orange-400">
              <Users className="w-4 h-4 mr-2" />
              Users
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="mt-6 space-y-6">
            {/* Overview Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
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

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card className="border-gray-800 bg-gray-900/30">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-gray-400 flex items-center gap-2">
                    <Activity className="w-4 h-4" />
                    System Health
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-400">Inference Success Rate</span>
                    <span className="font-semibold text-green-400">{analytics.inference.successRate}%</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-400">Project Completion</span>
                    <span className="font-semibold text-blue-400">{analytics.projects.completionRate}%</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-400">PRD Completion</span>
                    <span className="font-semibold text-purple-400">{analytics.projects.prd.completionRate}%</span>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-gray-800 bg-gray-900/30">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-gray-400 flex items-center gap-2">
                    <Bot className="w-4 h-4" />
                    AI Resources
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-400">Drafts</span>
                    <span className="font-semibold text-white">{analytics.resources.drafts.total}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-400">Published</span>
                    <span className="font-semibold text-green-400">{analytics.resources.drafts.published}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-400">Queued</span>
                    <span className="font-semibold text-orange-400">{analytics.resources.topics.queued}</span>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-gray-800 bg-gray-900/30">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-gray-400 flex items-center gap-2">
                    <GraduationCap className="w-4 h-4" />
                    Workshops
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-400">Total Events</span>
                    <span className="font-semibold text-white">{analytics.workshops.total}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-400">Attendance</span>
                    <span className="font-semibold text-blue-400">{analytics.workshops.totalAttendance}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-400">Credits Awarded</span>
                    <span className="font-semibold text-green-400">${analytics.workshops.creditsDistributed}</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Inference Tab */}
          <TabsContent value="inference" className="mt-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
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

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <ModelDistributionChart data={analytics.inference.byModel} />
              <CostBreakdownChart data={analytics.inference.byPurpose} />
            </div>

            <TokenUsageChart data={analytics.inference.byModel} />

            {/* Inference Details Table */}
            <Card className="border-gray-800 bg-gray-900/30">
              <CardHeader>
                <CardTitle className="text-white">Inference Details</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow className="border-gray-800">
                      <TableHead className="text-gray-400">Model</TableHead>
                      <TableHead className="text-gray-400">Requests</TableHead>
                      <TableHead className="text-gray-400">Tokens</TableHead>
                      <TableHead className="text-gray-400 text-right">Cost</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {analytics.inference.byModel.map((model: any, index: number) => (
                      <TableRow key={index} className="border-gray-800">
                        <TableCell className="font-medium text-white">{model.model}</TableCell>
                        <TableCell className="text-gray-300">{model.requests.toLocaleString()}</TableCell>
                        <TableCell className="text-gray-300">{(model.tokens / 1000).toFixed(0)}k</TableCell>
                        <TableCell className="text-right text-green-400">${model.cost}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Projects Tab */}
          <TabsContent value="projects" className="mt-6 space-y-6">
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

            {/* Document Types */}
            <Card className="border-gray-800 bg-gray-900/30">
              <CardHeader>
                <CardTitle className="text-white">Documents by Type</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {analytics.documents.byType.map((doc: any, index: number) => (
                    <div key={index} className="flex items-center justify-between py-2 border-b border-gray-800 last:border-0">
                      <span className="text-sm font-medium text-white capitalize">{doc.type}</span>
                      <Badge variant="outline" className="border-gray-700 text-gray-300">
                        {doc.count}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Resources Tab */}
          <TabsContent value="resources" className="mt-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <StatCard
                title="Total Drafts"
                value={analytics.resources.drafts.total}
                description={`${analytics.resources.drafts.pending} pending review`}
                icon={FileText}
                gradient="orange"
              />
              <StatCard
                title="Published"
                value={analytics.resources.drafts.published}
                description="Live on site"
                icon={CheckCircle}
                gradient="green"
              />
              <StatCard
                title="Topics Queued"
                value={analytics.resources.topics.queued}
                description="Ready to generate"
                icon={Clock}
                gradient="blue"
              />
            </div>

            {/* Recent Drafts */}
            <Card className="border-gray-800 bg-gray-900/30">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Bot className="w-5 h-5 text-orange-500" />
                  Recent AI-Generated Drafts
                </CardTitle>
              </CardHeader>
              <CardContent>
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

            {/* Generation Jobs */}
            <Card className="border-gray-800 bg-gray-900/30">
              <CardHeader>
                <CardTitle className="text-white text-sm">Recent Generation Jobs</CardTitle>
              </CardHeader>
              <CardContent>
                {analytics.resources.recentJobs && analytics.resources.recentJobs.length > 0 ? (
                  <div className="space-y-2">
                    {analytics.resources.recentJobs.map((job: any) => (
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
          </TabsContent>

          {/* Users Tab */}
          <TabsContent value="users" className="mt-6 space-y-6">
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

            <Card className="border-gray-800 bg-gray-900/30">
              <CardHeader>
                <CardTitle className="text-white">User Onboarding Funnel</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-400">Total Profiles Created</span>
                    <span className="font-semibold text-white">{analytics.users.onboarding.total}</span>
                  </div>
                  <div className="w-full bg-gray-800 rounded-full h-2">
                    <div className="bg-blue-500 h-2 rounded-full" style={{ width: '100%' }} />
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-400">Onboarding Completed</span>
                    <span className="font-semibold text-green-400">{analytics.users.onboarding.completed}</span>
                  </div>
                  <div className="w-full bg-gray-800 rounded-full h-2">
                    <div className="bg-green-500 h-2 rounded-full" style={{ width: `${analytics.users.onboarding.completionRate}%` }} />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
