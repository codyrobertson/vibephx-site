'use client'

import { useProjects } from '@/hooks/useProjects'
import { Card } from '@/components/ui/Card'
import { PlusIcon, CalendarIcon, GearIcon, RocketIcon } from '@radix-ui/react-icons'
import Link from 'next/link'

export default function ProjectDashboard() {
  const { projects, loading, error } = useProjects()

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, i) => (
          <Card key={i} className="border-gray-800 bg-gray-900/50">
            <div className="animate-pulse">
              <div className="h-4 bg-gray-700 rounded mb-3"></div>
              <div className="h-3 bg-gray-700 rounded mb-2"></div>
              <div className="h-3 bg-gray-700 rounded w-3/4"></div>
            </div>
          </Card>
        ))}
      </div>
    )
  }

  if (error) {
    return (
      <Card className="border-red-800/30 bg-red-950/20">
        <div className="text-center p-8">
          <div className="w-16 h-16 bg-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-black text-xl">⚠️</span>
          </div>
          <h3 className="text-xl font-bold text-red-400 mb-2">Error Loading Projects</h3>
          <p className="text-gray-300">{error}</p>
        </div>
      </Card>
    )
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'COMPLETED':
        return 'text-green-400 bg-green-950/30'
      case 'GENERATING':
        return 'text-orange-400 bg-orange-950/30'
      case 'ERROR':
        return 'text-red-400 bg-red-950/30'
      default:
        return 'text-gray-400 bg-gray-950/30'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'COMPLETED':
        return <RocketIcon className="w-4 h-4" />
      case 'GENERATING':
        return <GearIcon className="w-4 h-4 animate-spin" />
      default:
        return <CalendarIcon className="w-4 h-4" />
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    })
  }

  return (
    <div className="space-y-8">
      {/* Create New Project Button */}
      <div className="flex justify-center">
        <Link
          href="/builder"
          className="flex items-center gap-2 px-6 py-3 bg-orange-500 hover:bg-orange-600 text-black font-bold rounded-lg transition-colors"
        >
          <PlusIcon className="w-5 h-5" />
          Create New Project
        </Link>
      </div>

      {projects.length === 0 ? (
        <Card className="border-gray-800 bg-gray-900/50">
          <div className="text-center p-12">
            <div className="w-24 h-24 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-6">
              <RocketIcon className="w-12 h-12 text-gray-400" />
            </div>
            <h3 className="text-xl font-bold text-white mb-4">No Projects Yet</h3>
            <p className="text-gray-400 mb-6 max-w-md mx-auto">
              Start your AI-powered development journey by creating your first project idea.
            </p>
            <Link
              href="/builder"
              className="inline-flex items-center gap-2 px-6 py-3 bg-orange-500 hover:bg-orange-600 text-black font-bold rounded-lg transition-colors"
            >
              <PlusIcon className="w-5 h-5" />
              Get Started
            </Link>
          </div>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project) => (
            <Card
              key={project.id}
              className="border-gray-800 bg-gray-900/50 hover:border-orange-500/50 hover:bg-gray-800/50 transition-all duration-200"
             
            >
              <div className="space-y-4">
                <div className="flex items-start justify-between">
                  <h3 className="text-lg font-semibold text-white line-clamp-2">
                    {project.title}
                  </h3>
                  <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs ${getStatusColor(project.status)}`}>
                    {getStatusIcon(project.status)}
                    <span className="capitalize">{project.status.toLowerCase()}</span>
                  </div>
                </div>

                {project.description && (
                  <p className="text-gray-400 text-sm line-clamp-3">
                    {project.description}
                  </p>
                )}

                <div className="space-y-2 text-xs text-gray-500">
                  {project.template && (
                    <div className="flex items-center gap-2">
                      <span className="text-blue-400">Template:</span>
                      <span className="capitalize">{project.template.replace('-', ' ')}</span>
                    </div>
                  )}
                  
                  {project.techStack && Object.keys(project.techStack).length > 0 && (
                    <div className="flex items-center gap-2">
                      <span className="text-purple-400">Stack:</span>
                      <span>{Object.values(project.techStack).filter(Boolean).length} technologies</span>
                    </div>
                  )}

                  <div className="flex items-center gap-2">
                    <CalendarIcon className="w-3 h-3" />
                    <span>Updated {formatDate(project.updatedAt)}</span>
                  </div>
                </div>

                <div className="flex gap-2">
                  {project.status === 'COMPLETED' ? (
                    <button className="flex-1 py-2 px-3 bg-green-600 hover:bg-green-700 text-white text-sm font-medium rounded-lg transition-colors">
                      View Results
                    </button>
                  ) : project.status === 'GENERATING' ? (
                    <button className="flex-1 py-2 px-3 bg-orange-600 hover:bg-orange-700 text-white text-sm font-medium rounded-lg transition-colors">
                      View Progress
                    </button>
                  ) : (
                    <Link
                      href={`/builder/stack?projectId=${project.id}&template=${project.template}&idea=${encodeURIComponent(project.customIdea || '')}`}
                      className="flex-1 py-2 px-3 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors text-center"
                    >
                      Continue Building
                    </Link>
                  )}
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}