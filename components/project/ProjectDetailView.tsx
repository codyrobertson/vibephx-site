'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { formatDistanceToNow } from 'date-fns'
import { Button } from '@/components/ui/button'
import { ProjectSummary } from './ProjectSummary'
import { ProjectFiles } from './ProjectFiles'
import { ArrowLeftIcon } from '@radix-ui/react-icons'
import { MessageCircle } from 'lucide-react'

interface ProjectDetailViewProps {
  project: {
    id: string
    title: string
    description: string | null
    status: string
    createdAt: Date
    updatedAt: Date
    completedAt: Date | null
  }
  latestSession: {
    id: string
    sda: string | null
    initialIntent: string
    featuresMvp: string[]
    selectedStack: string | null
    dbChoice: string | null
    integrations: string[]
    prdMarkdown: string | null
    eightLinePrompt: string | null
    acceptanceCriteria: string[]
    completed: boolean
  }
}

export function ProjectDetailView({ project, latestSession }: ProjectDetailViewProps) {
  const [activeTab, setActiveTab] = useState<'summary' | 'files'>('summary')
  const [mounted, setMounted] = useState(false)

  // Prevent hydration mismatch by only showing dates after mount
  useEffect(() => {
    setMounted(true)
  }, [])

  const statusColors = {
    COMPLETED: 'bg-green-900 text-green-300',
    GENERATING: 'bg-blue-900 text-blue-300',
    ERROR: 'bg-red-900 text-red-300',
    DRAFT: 'bg-gray-800 text-gray-300'
  }

  return (
    <div className="min-h-screen bg-black">
      {/* Header */}
      <div className="border-b border-gray-800 bg-gray-900/30">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center gap-4 mb-4">
            <Link href="/dashboard">
              <Button variant="outline" size="sm" className="border-gray-700">
                <ArrowLeftIcon className="w-4 h-4 mr-2" />
                Dashboard
              </Button>
            </Link>
            <div className="flex-1" />
            <Link href={`/builder/prd-builder?session=${latestSession.id}`}>
              <Button variant="outline" className="border-gray-700 text-gray-300 hover:border-orange-500">
                <MessageCircle className="w-4 h-4 mr-2" />
                Go To Chat
              </Button>
            </Link>
          </div>

          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-white mb-2">
                {project.title || latestSession.sda || latestSession.initialIntent}
              </h1>
              {project.description && (
                <p className="text-gray-400 text-sm mb-3">{project.description}</p>
              )}
              <div className="flex items-center gap-4 text-sm text-gray-500">
                {mounted ? (
                  <>
                    <span>
                      Created {formatDistanceToNow(new Date(project.createdAt), { addSuffix: true })}
                    </span>
                    <span>•</span>
                    <span>
                      Updated {formatDistanceToNow(new Date(project.updatedAt), { addSuffix: true })}
                    </span>
                  </>
                ) : (
                  <span>Loading...</span>
                )}
              </div>
            </div>
            <div>
              <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusColors[project.status as keyof typeof statusColors] || statusColors.DRAFT}`}>
                {project.status}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-800">
        <div className="container mx-auto px-4">
          <div className="flex gap-6">
            <button
              onClick={() => setActiveTab('summary')}
              className={`py-3 px-1 border-b-2 transition-colors ${
                activeTab === 'summary'
                  ? 'border-orange-500 text-white font-medium'
                  : 'border-transparent text-gray-400 hover:text-gray-300'
              }`}
            >
              Summary
            </button>
            <button
              onClick={() => setActiveTab('files')}
              className={`py-3 px-1 border-b-2 transition-colors ${
                activeTab === 'files'
                  ? 'border-orange-500 text-white font-medium'
                  : 'border-transparent text-gray-400 hover:text-gray-300'
              }`}
            >
              Files & Outputs
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-8">
        {activeTab === 'summary' && (
          <ProjectSummary project={project} session={latestSession} />
        )}
        {activeTab === 'files' && (
          <ProjectFiles session={latestSession} projectId={project.id} />
        )}
      </div>
    </div>
  )
}
