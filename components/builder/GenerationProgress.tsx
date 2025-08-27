'use client'

import { useState, useEffect, useRef } from 'react'
import { CheckIcon, ReloadIcon, FileTextIcon, CodeIcon, ImageIcon, TableIcon, ListBulletIcon, SpeakerLoudIcon, MagicWandIcon, GearIcon, ChevronDownIcon, ChevronUpIcon } from '@radix-ui/react-icons'
import { Card } from '@/components/ui/Card'
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

interface StreamingContent {
  [key: string]: {
    content: string
    isGenerating: boolean
    isComplete: boolean
    isFromCache: boolean
  }
}

interface GenerationProgressProps {
  projectData: ProjectData
  updateProjectData: (updates: Partial<ProjectData>) => void
  onComplete: () => void
}

export default function GenerationProgress({ projectData, updateProjectData, onComplete }: GenerationProgressProps) {
  const [currentStep, setCurrentStep] = useState(0)
  const [streamingContent, setStreamingContent] = useState<StreamingContent>({})
  const [completedSteps, setCompletedSteps] = useState<Set<string>>(new Set())
  const [error, setError] = useState<string | null>(null)
  const [expandedCards, setExpandedCards] = useState<Set<string>>(new Set())
  const activeConnections = useRef<Map<string, AbortController>>(new Map())

  useEffect(() => {
    startGeneration()
    
    // Cleanup function to abort any active connections
    return () => {
      activeConnections.current.forEach((controller) => controller.abort())
      activeConnections.current.clear()
    }
  }, [])

  const startGeneration = async () => {
    setError(null)
    setCurrentStep(0)

    // Generate documents sequentially for better UX
    for (let i = 0; i < GENERATION_STEPS.length; i++) {
      const step = GENERATION_STEPS[i]
      setCurrentStep(i)
      await generateDocument(step.id, i)
    }
  }

  const generateDocument = async (documentType: string, stepIndex: number) => {
    // Create abort controller for this request
    const abortController = new AbortController()
    activeConnections.current.set(documentType, abortController)

    try {
      setStreamingContent(prev => ({
        ...prev,
        [documentType]: {
          content: '',
          isGenerating: true,
          isComplete: false,
          isFromCache: false
        }
      }))

      const response = await fetch('/api/builder/generate-stream', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          projectData,
          documentType
        }),
        signal: abortController.signal
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const reader = response.body?.getReader()
      if (!reader) {
        throw new Error('No response body')
      }

      const decoder = new TextDecoder()
      let buffer = ''

      while (true) {
        const { done, value } = await reader.read()
        
        if (done) break

        buffer += decoder.decode(value, { stream: true })
        const lines = buffer.split('\n')
        
        // Keep the last incomplete line in the buffer
        buffer = lines.pop() || ''

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            try {
              const data = JSON.parse(line.slice(6))
              
              switch (data.type) {
                case 'cache':
                  setStreamingContent(prev => ({
                    ...prev,
                    [documentType]: {
                      ...prev[documentType],
                      isFromCache: true
                    }
                  }))
                  break

                case 'start':
                  // Already handled in initial state
                  break

                case 'content':
                  setStreamingContent(prev => ({
                    ...prev,
                    [documentType]: {
                      ...prev[documentType],
                      content: prev[documentType]?.content + data.chunk || data.chunk
                    }
                  }))
                  break

                case 'complete':
                  setStreamingContent(prev => ({
                    ...prev,
                    [documentType]: {
                      content: data.content,
                      isGenerating: false,
                      isComplete: true,
                      isFromCache: prev[documentType]?.isFromCache || false
                    }
                  }))
                  
                  setCompletedSteps(prev => new Set([...prev, documentType]))
                  break

                case 'error':
                  throw new Error(data.message)
              }
            } catch (parseError) {
              console.error('Error parsing SSE data:', parseError)
            }
          }
        }
      }

    } catch (err) {
      if (err instanceof Error && err.name === 'AbortError') {
        console.log(`Generation aborted for ${documentType}`)
        return
      }
      
      console.error(`Generation error for ${documentType}:`, err)
      setStreamingContent(prev => ({
        ...prev,
        [documentType]: {
          content: '',
          isGenerating: false,
          isComplete: false,
          isFromCache: false
        }
      }))
      
      if (completedSteps.size === 0) {
        setError(err instanceof Error ? err.message : 'Generation failed')
      }
    } finally {
      activeConnections.current.delete(documentType)
      
      // Check if this was the last step
      if (stepIndex === GENERATION_STEPS.length - 1) {
        // All steps complete - collect generated content
        const generated: Record<string, string> = {}
        GENERATION_STEPS.forEach(step => {
          const content = streamingContent[step.id]?.content || ''
          generated[step.id] = content
        })
        
        updateProjectData({ generated })
        setTimeout(() => onComplete(), 1000)
      }
    }
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

  const retryGeneration = () => {
    setCompletedSteps(new Set())
    setStreamingContent({})
    setError(null)
    setCurrentStep(0)
    
    // Abort any existing connections
    activeConnections.current.forEach((controller) => controller.abort())
    activeConnections.current.clear()
    
    startGeneration()
  }

  const totalEstimatedTime = GENERATION_STEPS.reduce((sum, step) => sum + step.estimatedTime, 0)
  const progress = completedSteps.size / GENERATION_STEPS.length * 100

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <h3 className="text-2xl font-bold mb-4">
          {completedSteps.size >= GENERATION_STEPS.length ? 'Generation Complete!' : 'AI is Creating Your Project Assets'}
        </h3>
        <div className="flex items-center justify-center gap-2 mb-4">
          <MagicWandIcon className="w-5 h-5 text-blue-400" />
          <span className="text-sm font-medium text-blue-400">Claude 3.5 Sonnet</span>
          <span className="text-gray-500">•</span>
          <span className="text-sm text-gray-400">Estimated time: ~{totalEstimatedTime} seconds</span>
        </div>
        
        {/* Progress Bar */}
        <div className="w-full bg-gray-800 rounded-full h-2 mb-4">
          <div 
            className="bg-gradient-to-r from-orange-500 to-red-500 h-2 rounded-full transition-all duration-1000"
            style={{ width: `${progress}%` }}
          />
        </div>
        <p className="text-sm text-gray-500">
          {completedSteps.size} of {GENERATION_STEPS.length} documents generated ({Math.round(progress)}%)
        </p>
      </div>

      {/* Streaming Generation Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {GENERATION_STEPS.map((step, index) => {
          const IconComponent = step.icon
          const stepContent = streamingContent[step.id]
          const isCompleted = completedSteps.has(step.id)
          const isCurrent = index === currentStep
          const isGenerating = stepContent?.isGenerating || (isCurrent && !isCompleted)
          const isPending = index > currentStep
          const isExpanded = expandedCards.has(step.id)
          const hasContent = stepContent?.content && stepContent.content.length > 0

          return (
            <Card
              key={step.id}
              className={`
                transition-all duration-300 hover:scale-[1.02]
                ${isCompleted ? 'border-green-500 bg-green-950/10' :
                  isGenerating ? 'border-orange-500 bg-orange-950/10' :
                  isPending ? 'border-gray-800/50 bg-gray-900/30' :
                  'border-gray-800 hover:border-gray-700'
                }
              `}
              padding="lg"
            >
              {/* Card Header */}
              <div className="flex items-center gap-4 mb-4">
                <div className={`
                  w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0 transition-colors
                  ${isCompleted ? 'bg-green-500' :
                    isGenerating ? 'bg-orange-500' :
                    isPending ? 'bg-gray-700' :
                    'bg-gray-800'
                  }
                `}>
                  {isCompleted ? (
                    <CheckIcon className="w-6 h-6 text-black" />
                  ) : isGenerating ? (
                    <ReloadIcon className="w-6 h-6 animate-spin text-black" />
                  ) : isPending ? (
                    <IconComponent className="w-6 h-6 text-gray-500" />
                  ) : (
                    <IconComponent className="w-6 h-6 text-gray-400" />
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <h4 className="font-semibold text-white truncate">{step.name}</h4>
                    <span className="text-xs text-gray-500 flex-shrink-0">~{step.estimatedTime}s</span>
                  </div>
                  <p className="text-sm text-gray-400 line-clamp-2">{step.description}</p>
                  
                  {stepContent?.isFromCache && (
                    <div className="mt-2">
                      <span className="text-xs text-purple-400 bg-purple-950/20 px-2 py-1 rounded">
                        📱 Loaded from cache
                      </span>
                    </div>
                  )}
                </div>

                {/* Expand/Collapse Button */}
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

              {/* Generation Status */}
              {isGenerating && (
                <div className="mb-4">
                  <div className="flex items-center gap-2 text-xs text-orange-400">
                    <ReloadIcon className="w-3 h-3 animate-spin" />
                    {stepContent?.isFromCache ? 'Loading from cache...' : 'Generating content...'}
                  </div>
                </div>
              )}

              {/* Streaming Content Display */}
              {hasContent && (
                <div className="space-y-3">
                  <div className={`
                    overflow-hidden transition-all duration-300
                    ${isExpanded ? 'max-h-96' : 'max-h-24'}
                  `}>
                    <div className="text-sm text-gray-300 font-mono leading-relaxed p-4 bg-gray-900/50 rounded-lg overflow-y-auto">
                      <div className="whitespace-pre-wrap break-words">
                        {stepContent.content}
                        {isGenerating && (
                          <span className="inline-block w-2 h-4 bg-orange-500 animate-pulse ml-1" />
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Word Count and Status */}
                  <div className="flex justify-between items-center text-xs text-gray-500">
                    <span>{Math.round(stepContent.content.length / 4)} words</span>
                    <span>
                      {isCompleted ? '✅ Complete' : 
                       isGenerating ? '⏳ Generating...' : 
                       '⏸️ Waiting...'}
                    </span>
                  </div>
                </div>
              )}

              {/* Empty State */}
              {!hasContent && !isGenerating && (
                <div className="text-center py-8 text-gray-500">
                  <div className="text-2xl mb-2">{isPending ? '⏸️' : '⏳'}</div>
                  <p className="text-sm">{isPending ? 'Waiting in queue...' : 'Ready to generate...'}</p>
                </div>
              )}
            </Card>
          )
        })}
      </div>

      {/* Error State */}
      {error && (
        <Card className="border-red-800/30 bg-red-950/20">
          <div className="text-center p-6">
            <p className="text-red-400 mb-4">{error}</p>
            <button
              onClick={retryGeneration}
              className="px-6 py-2 bg-orange-500 hover:bg-orange-600 text-black font-semibold rounded-lg transition-colors"
            >
              Retry Generation
            </button>
          </div>
        </Card>
      )}

      {/* Completion State */}
      {completedSteps.size >= GENERATION_STEPS.length && !error && (
        <Card className="border-green-800/30 bg-green-950/20">
          <div className="text-center p-8">
            <CheckIcon className="w-16 h-16 text-green-400 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-green-400 mb-2">All Documents Generated!</h3>
            <p className="text-gray-300 mb-4">
              Your complete project package is ready. You'll be redirected to download and review your assets.
            </p>
            <div className="flex items-center justify-center gap-2 mb-6">
              <span className="text-sm text-gray-400">Powered by</span>
              <MagicWandIcon className="w-4 h-4 text-blue-400" />
              <span className="text-sm font-medium text-blue-400">Claude 3.5 Sonnet</span>
            </div>
            <div className="flex justify-center gap-4 text-sm text-gray-400">
              <span>📄 {GENERATION_STEPS.length} documents</span>
              <span>•</span>
              <span>📝 {Object.values(streamingContent).reduce((sum, content) => sum + Math.round(content.content.length / 4), 0)} words</span>
              <span>•</span>
              <span>⏱️ Generated with streaming</span>
            </div>
          </div>
        </Card>
      )}
    </div>
  )
}