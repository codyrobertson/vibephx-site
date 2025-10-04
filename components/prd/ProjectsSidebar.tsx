'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { formatDistanceToNow } from 'date-fns'
import { Button } from '@/components/ui/button'
import { PlusIcon, ChevronLeftIcon, ChevronRightIcon } from '@radix-ui/react-icons'
import { cn } from '@/lib/utils'

interface PRDSession {
  id: string
  sda: string | null
  initialIntent: string
  phase: string
  completed: boolean
  updatedAt: string
  project: {
    id: string
    title: string
    status: string
  } | null
}

interface ProjectsSidebarProps {
  currentSessionId?: string | null
  className?: string
}

export function ProjectsSidebar({ currentSessionId, className }: ProjectsSidebarProps) {
  const [isOpen, setIsOpen] = useState(true)
  const [projects, setProjects] = useState<PRDSession[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadRecentProjects()
  }, [])

  async function loadRecentProjects() {
    try {
      const res = await fetch('/api/prd/session')
      if (res.ok) {
        const data = await res.json()
        // Filter out empty sessions - only show sessions with meaningful data
        const meaningfulSessions = data.sessions.filter((session: PRDSession) => {
          return session.sda ||
                 (session.project?.title && session.project.title !== 'Untitled') ||
                 session.completed ||
                 session.phase !== 'intro'
        })
        setProjects(meaningfulSessions.slice(0, 10))
      }
    } catch (err) {
      console.error('Failed to load recent projects:', err)
    } finally {
      setLoading(false)
    }
  }

  const getProjectTitle = (session: PRDSession) => {
    return session.project?.title || session.sda || session.initialIntent || 'Untitled'
  }

  const getStatusBadge = (session: PRDSession) => {
    if (session.completed) {
      return <span className="text-xs text-green-400">✓ Complete</span>
    }
    if (session.phase === 'outputs' || session.phase === 'final') {
      return <span className="text-xs text-blue-400">Generating</span>
    }
    return <span className="text-xs text-gray-500">Draft</span>
  }

  return (
    <>
      {/* Desktop sidebar */}
      <aside
        className={cn(
          'hidden lg:flex flex-col border-r border-gray-800 bg-black transition-all duration-300',
          isOpen ? 'w-80' : 'w-16',
          className
        )}
      >
        {/* Header */}
        <div className="p-4 border-b border-gray-800 flex items-center justify-between">
          {isOpen && (
            <h2 className="text-sm font-semibold text-white">Recent Projects</h2>
          )}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="p-1.5 hover:bg-gray-800 rounded transition-colors ml-auto"
            title={isOpen ? 'Collapse sidebar' : 'Expand sidebar'}
          >
            {isOpen ? (
              <ChevronLeftIcon className="w-4 h-4 text-gray-400" />
            ) : (
              <ChevronRightIcon className="w-4 h-4 text-gray-400" />
            )}
          </button>
        </div>

        {isOpen && (
          <>
            {/* New PRD button */}
            <div className="p-3 border-b border-gray-800">
              <Link href="/builder/prd-builder">
                <Button className="w-full bg-orange-600 hover:bg-orange-500 text-sm">
                  <PlusIcon className="w-4 h-4 mr-1.5" />
                  New PRD
                </Button>
              </Link>
            </div>

            {/* Projects list */}
            <div className="flex-1 overflow-y-auto">
              {loading ? (
                <div className="p-4 text-center text-gray-500 text-sm">
                  Loading...
                </div>
              ) : projects.length === 0 ? (
                <div className="p-4 text-center text-gray-500 text-sm">
                  No projects yet
                </div>
              ) : (
                <div>
                  {projects.map((session) => (
                    <Link
                      key={session.id}
                      href={`/builder/prd-builder?session=${session.id}`}
                      className={cn(
                        'block p-3 transition-colors hover:bg-gray-900/50 border-b border-gray-800',
                        currentSessionId === session.id
                          ? 'bg-orange-900/20 border-l-2 border-l-orange-500'
                          : ''
                      )}
                    >
                      <div className="flex items-start justify-between gap-2 mb-1">
                        <h3 className="text-sm font-medium text-white line-clamp-2 flex-1">
                          {getProjectTitle(session)}
                        </h3>
                      </div>
                      <div className="flex items-center justify-between text-xs">
                        {getStatusBadge(session)}
                        <span className="text-gray-500">
                          {formatDistanceToNow(new Date(session.updatedAt), {
                            addSuffix: true
                          })}
                        </span>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </>
        )}

        {!isOpen && (
          <div className="flex-1 flex flex-col items-center pt-4 space-y-3">
            <Link href="/builder/prd-builder">
              <button
                className="p-2 hover:bg-gray-800 rounded transition-colors"
                title="New PRD"
              >
                <PlusIcon className="w-5 h-5 text-gray-400" />
              </button>
            </Link>
          </div>
        )}
      </aside>

      {/* Mobile drawer (collapsed by default on mobile) */}
      <div className="lg:hidden">
        {/* Could add a mobile slide-out drawer here if needed */}
      </div>
    </>
  )
}
