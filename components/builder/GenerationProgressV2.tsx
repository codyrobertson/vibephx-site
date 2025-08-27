'use client'

import { useState, useEffect, useRef } from 'react'
import { CheckIcon, ReloadIcon, FileTextIcon, CodeIcon, ImageIcon, TableIcon, ListBulletIcon, SpeakerLoudIcon, MagicWandIcon, GearIcon, ChevronDownIcon, ChevronUpIcon, ClockIcon } from '@radix-ui/react-icons'
import { Card } from '@/components/ui/Card'
import { highlightCode } from '@/lib/shiki-highlighter'
import type { ProjectData } from './BuilderWizard'

const GENERATION_STEPS = [
  {
    id: 'prd',
    name: 'Product Requirements Document',
    description: 'Comprehensive project specification',
    icon: FileTextIcon,
    estimatedTime: 15
  },
  {
    id: 'buildDoc',
    name: 'Technical Build Guide', 
    description: 'Step-by-step implementation instructions',
    icon: CodeIcon,
    estimatedTime: 20
  },
  {
    id: 'uiSpecs',
    name: 'UI/UX Specifications',
    description: 'Design guidelines and wireframes',
    icon: ImageIcon,
    estimatedTime: 15
  },
  {
    id: 'dataModels',
    name: 'Data Models & Schema',
    description: 'Database design and relationships',
    icon: TableIcon,
    estimatedTime: 12
  },
  {
    id: 'taskList',
    name: 'Development Task List',
    description: 'Prioritized implementation checklist',
    icon: ListBulletIcon,
    estimatedTime: 10
  },
  {
    id: 'marketingGuide',
    name: 'Marketing & Launch Guide',
    description: 'Go-to-market strategy',
    icon: SpeakerLoudIcon,
    estimatedTime: 15
  },
  {
    id: 'claudeMd',
    name: 'Claude.md Configuration',
    description: 'AI assistant project context',
    icon: MagicWandIcon,
    estimatedTime: 8
  },
  {
    id: 'cursorRules',
    name: 'Cursor Rules Configuration',
    description: 'IDE optimization settings',
    icon: GearIcon,
    estimatedTime: 5
  }
]

interface QueueStatus {
  queueLength: number
  processing: boolean
  cacheSize: number
  nextItems: Array<{ documentType: string; priority: number; retryCount: number }>
}

interface GeneratedContent {
  [key: string]: {
    content: string
    isComplete: boolean
    isFromCache: boolean
    queueId?: string
  }
}

interface GenerationProgressV2Props {
  projectData: ProjectData
  updateProjectData: (updates: Partial<ProjectData>) => void
  onComplete: () => void
}

export default function GenerationProgressV2({ projectData, updateProjectData, onComplete }: GenerationProgressV2Props) {
  const [generatedContent, setGeneratedContent] = useState<GeneratedContent>({})
  const [queueStatus, setQueueStatus] = useState<QueueStatus | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [expandedCards, setExpandedCards] = useState<Set<string>>(new Set())
  const [sessionId] = useState(() => `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`)
  const eventSourceRef = useRef<EventSource | null>(null)

  useEffect(() => {
    startGeneration()
    
    return () => {
      if (eventSourceRef.current) {
        eventSourceRef.current.close()
      }
    }
  }, [])

  const startGeneration = async () => {
    setError(null)
    console.log('🚀 Starting enhanced generation with queue system...')

    try {
      // First, check queue status
      const statusResponse = await fetch('/api/builder/generate-queue')
      const statusData = await statusResponse.json()
      setQueueStatus(statusData)

      // Start streaming generation
      eventSourceRef.current = new EventSource('/api/builder/generate-stream-v2')
      
      // Send generation request
      await fetch('/api/builder/generate-stream-v2', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ projectData, sessionId })
      })

      eventSourceRef.current.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data)
          
          switch (data.type) {
            case 'start':
              console.log('🎬 Generation started')
              break
              
            case 'queued':
              console.log(`📋 Queued ${data.documentType}`)
              setGeneratedContent(prev => ({
                ...prev,
                [data.documentType]: {
                  content: '',
                  isComplete: false,
                  isFromCache: false,
                  queueId: data.queueId
                }
              }))
              break
              
            case 'status':
              console.log(`📊 Queue status: ${data.message}`)
              setQueueStatus(prev => prev ? { ...prev, ...data } : null)
              break
              
            case 'complete':
              console.log(`✅ ${data.documentType} complete (cache: ${data.fromCache})`)
              setGeneratedContent(prev => ({
                ...prev,
                [data.documentType]: {
                  content: data.content,
                  isComplete: true,
                  isFromCache: data.fromCache
                }
              }))
              break
              
            case 'all_complete':
              console.log('🎉 All documents completed!')
              updateProjectData({ generated: data.results })
              setTimeout(() => onComplete(), 1000)
              break
              
            case 'error':
              throw new Error(data.message)
          }
          
        } catch (parseError) {
          console.error('Error parsing SSE data:', parseError)
        }
      }

      eventSourceRef.current.onerror = (error) => {
        console.error('SSE connection error:', error)
        setError('Connection lost. Please retry.')
      }

    } catch (err) {
      console.error('Generation setup error:', err)
      setError(err instanceof Error ? err.message : 'Failed to start generation')
    }
  }

  const retryGeneration = () => {
    setGeneratedContent({})
    setQueueStatus(null)
    setError(null)
    
    if (eventSourceRef.current) {
      eventSourceRef.current.close()
    }
    
    startGeneration()
  }

  const toggleCardExpanded = (stepId: string) => {
    setExpandedCards(prev => {
      const newSet = new Set(prev)
      if (newSet.has(stepId)) {
        newSet.delete(stepId)
      } else {
        newSet.add(stepId)
      }
      return newSet
    })
  }

  const completedCount = Object.values(generatedContent).filter(doc => doc.isComplete).length
  const totalCount = GENERATION_STEPS.length
  const progress = (completedCount / totalCount) * 100

  return (
    <div className="space-y-12 py-8">
      {/* Header */}
      <div className="text-center">
        <h3 className="text-2xl font-bold mb-4">
          {completedCount >= totalCount ? 'Generation Complete!' : 'AI Document Queue Processing'}
        </h3>
        <div className="flex items-center justify-center gap-2 mb-4">
          <MagicWandIcon className="w-5 h-5 text-blue-400" />
          <span className="text-sm font-medium text-blue-400">Enhanced Queue System</span>
          <span className="text-gray-500">•</span>
          <span className="text-sm text-gray-400">Smart caching & retry logic</span>
        </div>
        
        {/* Progress Bar */}
        <div className="w-full bg-gray-800 rounded-full h-2 mb-4">
          <div 
            className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>
        
        <div className="flex items-center justify-center gap-4 text-sm">
          <span className="text-gray-500">
            {completedCount} of {totalCount} documents ({Math.round(progress)}%)
          </span>
          
          {queueStatus && (
            <>
              <span className="text-gray-500">•</span>
              <div className="flex items-center gap-1">
                {queueStatus.processing ? (
                  <ReloadIcon className="w-3 h-3 animate-spin text-orange-400" />
                ) : (
                  <ClockIcon className="w-3 h-3 text-gray-400" />
                )}
                <span className="text-gray-400">
                  Queue: {queueStatus.queueLength} items • Cache: {queueStatus.cacheSize}
                </span>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Document Cards */}
      <div className="max-w-4xl mx-auto space-y-4">
        {GENERATION_STEPS.map((step) => {
          const IconComponent = step.icon
          const docContent = generatedContent[step.id]
          const isCompleted = docContent?.isComplete || false
          const isFromCache = docContent?.isFromCache || false
          const hasContent = docContent?.content && docContent.content.length > 0
          const isExpanded = expandedCards.has(step.id)

          return (
            <Card
              key={step.id}
              className={`
                transition-all duration-300 hover:scale-[1.01]
                ${isCompleted ? 'border-green-500 bg-green-950/10' :
                  docContent ? 'border-blue-500 bg-blue-950/10' :
                  'border-gray-800 bg-gray-900/50'
                }
              `}
              size="lg"
            >
              {/* Card Header */}
              <div className="flex items-center gap-4 mb-4">
                <div className={`
                  w-12 h-12 rounded-lg flex items-center justify-center transition-colors
                  ${isCompleted ? 'bg-green-500' :
                    docContent ? 'bg-blue-500' :
                    'bg-gray-700'
                  }
                `}>
                  {isCompleted ? (
                    <CheckIcon className="w-6 h-6 text-black" />
                  ) : docContent ? (
                    <ReloadIcon className="w-6 h-6 animate-spin text-black" />
                  ) : (
                    <IconComponent className="w-6 h-6 text-gray-400" />
                  )}
                </div>

                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="font-semibold text-white">{step.name}</h4>
                    {isFromCache && (
                      <span className="text-xs text-purple-400 bg-purple-950/20 px-2 py-1 rounded">
                        📋 Cached
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-gray-400">{step.description}</p>
                </div>

                {/* Expand Button */}
                {hasContent && (
                  <button
                    onClick={() => toggleCardExpanded(step.id)}
                    className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
                  >
                    {isExpanded ? (
                      <ChevronUpIcon className="w-5 h-5 text-gray-400" />
                    ) : (
                      <ChevronDownIcon className="w-5 h-5 text-gray-400" />
                    )}
                  </button>
                )}
              </div>

              {/* Content Preview */}
              {hasContent && isExpanded && (
                <div className="mt-4 p-4 bg-gray-900/50 rounded-lg max-h-96 overflow-y-auto">
                  <div className="text-sm text-gray-300 leading-relaxed">
                    {docContent.content.substring(0, 1000)}
                    {docContent.content.length > 1000 && '...'}
                  </div>
                </div>
              )}

              {/* Status Footer */}
              <div className="flex justify-between items-center text-xs text-gray-500 mt-4 pt-3 border-t border-gray-800">
                <span>
                  {hasContent ? `${Math.round(docContent.content.length / 4)} words` : 'Pending'}
                </span>
                <span>
                  {isCompleted ? '✅ Complete' : 
                   docContent ? '⏳ Processing...' : 
                   '⏸️ Queued'}
                </span>
              </div>
            </Card>
          )
        })}
      </div>

      {/* Error State */}
      {error && (
        <Card className="border-red-800/30 bg-red-950/20" size="lg">
          <div className="text-center p-6">
            <p className="text-red-400 mb-4">{error}</p>
            <button
              onClick={retryGeneration}
              className="px-6 py-2 bg-red-500 hover:bg-red-600 text-white font-semibold rounded-lg transition-colors"
            >
              Retry Generation
            </button>
          </div>
        </Card>
      )}

      {/* Completion State */}
      {completedCount >= totalCount && !error && (
        <Card className="border-green-800/30 bg-green-950/20" size="lg">
          <div className="text-center p-8">
            <CheckIcon className="w-16 h-16 text-green-400 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-green-400 mb-2">Queue Processing Complete!</h3>
            <p className="text-gray-300 mb-6">
              All documents have been generated using the enhanced queue system with intelligent caching.
            </p>
            <div className="flex items-center justify-center gap-4 text-sm text-gray-400">
              <span>📄 {totalCount} documents</span>
              <span>•</span>
              <span>📝 {Object.values(generatedContent).reduce((sum, doc) => sum + Math.round(doc.content.length / 4), 0)} words</span>
              <span>•</span>
              <span>⚡ Queue optimized</span>
            </div>
          </div>
        </Card>
      )}
    </div>
  )
}