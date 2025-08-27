'use client'

import { useState, useEffect, useRef } from 'react'
import { CheckIcon, ReloadIcon, FileTextIcon, CodeIcon, ImageIcon, TableIcon, ListBulletIcon, SpeakerLoudIcon, MagicWandIcon, GearIcon, ChevronDownIcon, ChevronUpIcon } from '@radix-ui/react-icons'
import { Card } from '@/components/ui/Card'
import { highlightCode } from '@/lib/shiki-highlighter'
import type { ProjectData } from './BuilderWizard'

// Streaming content display with auto-scroll and syntax highlighting
function StreamingContentDisplay({ content, isGenerating, documentType }: {
  content: string
  isGenerating: boolean
  documentType: string
}) {
  const [highlightedHTML, setHighlightedHTML] = useState<string>('')
  const contentRef = useRef<HTMLDivElement>(null)
  const [lastLength, setLastLength] = useState(0)

  // Auto-scroll to bottom when content updates
  useEffect(() => {
    if (contentRef.current && content.length > lastLength) {
      contentRef.current.scrollTop = contentRef.current.scrollHeight
      setLastLength(content.length)
    }
  }, [content, lastLength])

  // Highlight code blocks in markdown content
  useEffect(() => {
    if (!content) return

    const highlightCodeBlocks = async () => {
      let processedContent = content

      // Find code blocks and highlight them
      const codeBlockRegex = /```(\w+)?\n([\s\S]*?)```/g
      const promises: Promise<void>[] = []
      const replacements: { original: string; replacement: string }[] = []

      let match
      while ((match = codeBlockRegex.exec(content)) !== null) {
        const [fullMatch, lang = 'text', code] = match
        
        promises.push(
          highlightCode(code.trim(), lang).then(highlighted => {
            replacements.push({
              original: fullMatch,
              replacement: highlighted
            })
          }).catch(() => {
            // Fallback to plain pre tag
            replacements.push({
              original: fullMatch,
              replacement: `<pre class="bg-gray-800 p-3 rounded text-gray-300 overflow-x-auto"><code>${code.trim()}</code></pre>`
            })
          })
        )
      }

      await Promise.all(promises)

      // Apply all replacements
      for (const { original, replacement } of replacements) {
        processedContent = processedContent.replace(original, replacement)
      }

      // Convert markdown-style formatting
      processedContent = processedContent
        .replace(/^# (.*$)/gim, '<h1 class="text-xl font-bold text-white mb-3">$1</h1>')
        .replace(/^## (.*$)/gim, '<h2 class="text-lg font-semibold text-white mb-2">$1</h2>')
        .replace(/^### (.*$)/gim, '<h3 class="text-base font-medium text-white mb-2">$1</h3>')
        .replace(/^\* (.*$)/gim, '<li class="ml-4 mb-1">• $1</li>')
        .replace(/^\- (.*$)/gim, '<li class="ml-4 mb-1">• $1</li>')
        .replace(/\*\*(.*?)\*\*/g, '<strong class="font-semibold text-white">$1</strong>')
        .replace(/`([^`]+)`/g, '<code class="bg-gray-800 px-1 py-0.5 rounded text-orange-300 font-mono text-xs">$1</code>')
        .replace(/\n\n/g, '</p><p class="mb-3">')
        .replace(/\n/g, '<br/>')

      processedContent = `<p class="mb-3">${processedContent}</p>`

      setHighlightedHTML(processedContent)
    }

    highlightCodeBlocks()
  }, [content])

  return (
    <div 
      ref={contentRef}
      className="whitespace-pre-wrap break-words font-mono text-sm"
      style={{ maxHeight: '384px', overflowY: 'auto' }}
    >
      {highlightedHTML ? (
        <div dangerouslySetInnerHTML={{ __html: highlightedHTML }} />
      ) : (
        <div>{content}</div>
      )}
      {isGenerating && (
        <span className="inline-block w-2 h-4 bg-orange-500 animate-pulse ml-1" />
      )}
    </div>
  )
}

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
    highlightedHTML?: string
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
  const [stuckSteps, setStuckSteps] = useState<Set<string>>(new Set())
  const [canForceComplete, setCanForceComplete] = useState(false)
  const activeConnections = useRef<Map<string, AbortController>>(new Map())
  const stepTimers = useRef<Map<string, NodeJS.Timeout>>(new Map())

  useEffect(() => {
    startGeneration()
    
    // Cleanup function to abort any active connections and clear timers
    return () => {
      activeConnections.current.forEach((controller) => controller.abort())
      activeConnections.current.clear()
      stepTimers.current.forEach((timer) => clearTimeout(timer))
      stepTimers.current.clear()
    }
  }, [])

  const startGeneration = async () => {
    setError(null)
    setCurrentStep(0)
    setStuckSteps(new Set())
    setCanForceComplete(false)

    // Generate documents sequentially for better UX
    for (let i = 0; i < GENERATION_STEPS.length; i++) {
      const step = GENERATION_STEPS[i]
      setCurrentStep(i)
      await generateDocument(step.id, i)
    }
    
    // After all steps attempted, check if user can force complete
    setTimeout(() => {
      setCanForceComplete(true)
    }, 5000)
  }

  const generateDocument = async (documentType: string, stepIndex: number) => {
    // Create abort controller for this request
    const abortController = new AbortController()
    activeConnections.current.set(documentType, abortController)

    // Set up timeout to detect stuck generation (45 seconds)
    const timeoutId = setTimeout(() => {
      console.warn(`Document ${documentType} seems stuck, marking as stuck`)
      setStuckSteps(prev => new Set([...prev, documentType]))
      setStreamingContent(prev => ({
        ...prev,
        [documentType]: {
          ...prev[documentType],
          isGenerating: false,
          isComplete: false
        }
      }))
      abortController.abort()
    }, 45000)
    
    stepTimers.current.set(documentType, timeoutId)

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
        
        if (done) {
          // Process any remaining buffer content
          if (buffer.trim()) {
            processLine(buffer.trim())
          }
          break
        }

        buffer += decoder.decode(value, { stream: true })
        
        // Split on double newlines to handle SSE format better
        const chunks = buffer.split('\n\n')
        
        // Keep the last incomplete chunk in the buffer
        buffer = chunks.pop() || ''

        for (const chunk of chunks) {
          const lines = chunk.split('\n')
          for (const line of lines) {
            processLine(line)
          }
        }
      }
      
      // Process line function to handle JSON parsing safely
      function processLine(line: string) {
        if (line.trim().startsWith('data: ')) {
          const jsonString = line.slice(6).trim()
          if (!jsonString) return
          
          try {
            // Check if JSON string looks complete before parsing
            if (!jsonString.startsWith('{') || !jsonString.endsWith('}')) {
              console.warn('Incomplete JSON detected, skipping:', jsonString.substring(0, 50))
              return
            }
            
            const data = JSON.parse(jsonString)
            
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
                // Only mark as complete if we have actual content
                if (data.content && data.content.trim().length > 0) {
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
                  
                  // Clear timeout since we completed successfully
                  const timer = stepTimers.current.get(documentType)
                  if (timer) {
                    clearTimeout(timer)
                    stepTimers.current.delete(documentType)
                  }
                  
                  // Auto-collapse completed cards
                  setExpandedCards(prev => {
                    const newSet = new Set(prev)
                    newSet.delete(documentType)
                    return newSet
                  })
                } else {
                  console.warn(`Document ${documentType} marked complete but has no content`)
                }
                break

              case 'error':
                throw new Error(data.message)
            }
          } catch (parseError) {
            console.error('Error parsing SSE data:', parseError, 'Raw data:', jsonString)
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
      
      // Clear timeout on completion or error
      const timer = stepTimers.current.get(documentType)
      if (timer) {
        clearTimeout(timer)
        stepTimers.current.delete(documentType)
      }
      
      // Check if this was the last step
      if (stepIndex === GENERATION_STEPS.length - 1) {
        // All steps attempted - collect generated content
        const generated: Record<string, string> = {}
        GENERATION_STEPS.forEach(step => {
          const content = streamingContent[step.id]?.content || ''
          generated[step.id] = content
        })
        
        updateProjectData({ generated })
        
        // If we have at least some completed steps or enough content, allow completion
        const hasMinimumContent = completedSteps.size >= Math.ceil(GENERATION_STEPS.length / 2) || 
                                 Object.values(generated).some(content => content.length > 500)
        
        if (hasMinimumContent) {
          setTimeout(() => onComplete(), 1000)
        }
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
    setStuckSteps(new Set())
    setCanForceComplete(false)
    
    // Abort any existing connections and clear timers
    activeConnections.current.forEach((controller) => controller.abort())
    activeConnections.current.clear()
    stepTimers.current.forEach((timer) => clearTimeout(timer))
    stepTimers.current.clear()
    
    startGeneration()
  }

  const forceComplete = () => {
    // Collect whatever content we have
    const generated: Record<string, string> = {}
    GENERATION_STEPS.forEach(step => {
      const content = streamingContent[step.id]?.content || ''
      generated[step.id] = content
    })
    
    updateProjectData({ generated })
    
    // Abort any remaining connections
    activeConnections.current.forEach((controller) => controller.abort())
    activeConnections.current.clear()
    stepTimers.current.forEach((timer) => clearTimeout(timer))
    stepTimers.current.clear()
    
    onComplete()
  }

  const totalEstimatedTime = GENERATION_STEPS.reduce((sum, step) => sum + step.estimatedTime, 0)
  const progress = completedSteps.size / GENERATION_STEPS.length * 100
  
  // Calculate more granular progress including current step
  const granularProgress = () => {
    const baseProgress = (completedSteps.size / GENERATION_STEPS.length) * 100
    
    // Add partial progress for current generating step
    if (currentStep < GENERATION_STEPS.length) {
      const currentContent = streamingContent[GENERATION_STEPS[currentStep]?.id]
      if (currentContent?.content) {
        // Estimate progress based on content length (assume ~2000 chars per document)
        const estimatedLength = 2000
        const currentProgress = Math.min(currentContent.content.length / estimatedLength, 1) * (100 / GENERATION_STEPS.length)
        return Math.min(baseProgress + currentProgress, 100)
      }
    }
    
    return baseProgress
  }

  return (
    <div className="space-y-12 py-8">
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
            className="bg-gradient-to-r from-orange-500 to-red-500 h-2 rounded-full transition-all duration-300"
            style={{ width: `${granularProgress()}%` }}
          />
        </div>
        <p className="text-sm text-gray-500">
          {completedSteps.size} of {GENERATION_STEPS.length} documents generated ({Math.round(granularProgress())}%)
        </p>
      </div>

      {/* Current Streaming Document */}
      <div className="max-w-4xl mx-auto">
        {GENERATION_STEPS.map((step, index) => {
          const IconComponent = step.icon
          const stepContent = streamingContent[step.id]
          const isCompleted = completedSteps.has(step.id)
          const isCurrent = index === currentStep
          const isStuck = stuckSteps.has(step.id)
          const isGenerating = stepContent?.isGenerating || (isCurrent && !isCompleted && !isStuck)
          const isPending = index > currentStep
          const isExpanded = expandedCards.has(step.id)
          const hasContent = stepContent?.content && stepContent.content.length > 0

          // Show current step, completed steps, stuck steps, and manually expanded steps
          if (!isCurrent && !isCompleted && !isStuck && !isExpanded) return null

          return (
            <Card
              key={step.id}
              className={`
                transition-all duration-300 hover:scale-[1.02] mb-6
                ${isCompleted ? 'border-green-500 bg-green-950/10' :
                  isStuck ? 'border-red-500/70 bg-red-950/10' :
                  isGenerating ? 'border-orange-500 bg-orange-950/10' :
                  isPending ? 'border-gray-800/50 bg-gray-900/30' :
                  'border-gray-800 hover:border-gray-700'
                }
              `}
              size="xl"
            >
              {/* Card Header */}
              <div className="flex items-center gap-4 mb-6">
                <div className={`
                  w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0 transition-colors
                  ${isCompleted ? 'bg-green-500' :
                    isStuck ? 'bg-red-500' :
                    isGenerating ? 'bg-orange-500' :
                    isPending ? 'bg-gray-700' :
                    'bg-gray-800'
                  }
                `}>
                  {isCompleted ? (
                    <CheckIcon className="w-6 h-6 text-black" />
                  ) : isStuck ? (
                    <span className="w-6 h-6 text-black font-bold">⚠</span>
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

                {/* Expand/Collapse Button - only for completed cards with content */}
                {hasContent && isCompleted && (
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
                <div className="mb-6">
                  <div className="flex items-center gap-2 text-xs text-orange-400">
                    <ReloadIcon className="w-3 h-3 animate-spin" />
                    {stepContent?.isFromCache ? 'Loading from cache...' : 'Generating content...'}
                  </div>
                </div>
              )}

              {/* Stuck Status */}
              {isStuck && (
                <div className="mb-6">
                  <div className="flex items-center gap-2 text-xs text-red-400">
                    <span>⚠</span>
                    Generation timed out - this document may be skipped
                  </div>
                </div>
              )}

              {/* Streaming Content Display - only show for current generating step or manually expanded */}
              {hasContent && (isCurrent || isExpanded) && (
                <div className="space-y-4">
                  <div className={`
                    overflow-hidden transition-all duration-300
                    ${isCurrent ? 'max-h-96' : isExpanded ? 'max-h-96' : 'max-h-24'}
                  `}>
                    <div className="text-sm text-gray-300 leading-relaxed p-4 bg-gray-900/50 rounded-lg overflow-y-auto max-h-96">
                      <StreamingContentDisplay 
                        content={stepContent.content}
                        isGenerating={isGenerating}
                        documentType={step.id}
                      />
                    </div>
                  </div>

                  {/* Word Count and Status */}
                  <div className="flex justify-between items-center text-xs text-gray-500">
                    <span>{Math.round(stepContent.content.length / 4)} words</span>
                    <span>
                      {isCompleted ? '✅ Complete' : 
                       isStuck ? '⚠️ Timed out' :
                       isGenerating ? '⏳ Generating...' : 
                       '⏸️ Waiting...'}
                    </span>
                  </div>
                </div>
              )}

              {/* Completed Card Compact View - show completion status for collapsed completed cards */}
              {hasContent && isCompleted && !isExpanded && !isCurrent && (
                <div className="flex justify-between items-center text-xs text-gray-500 pt-2 border-t border-gray-800">
                  <span>{Math.round(stepContent.content.length / 4)} words generated</span>
                  <span className="text-green-400">✅ Complete</span>
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
        
        {/* Completed Documents Summary */}
        {completedSteps.size > 0 && (
          <div className="mt-8 p-6 bg-gray-900/30 rounded-lg border border-gray-800">
            <h3 className="text-lg font-semibold text-white mb-4">✅ Completed Documents ({completedSteps.size})</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {GENERATION_STEPS.filter(step => completedSteps.has(step.id)).map(step => {
                const IconComponent = step.icon
                return (
                  <button
                    key={`completed-${step.id}`}
                    onClick={() => toggleCardExpanded(step.id)}
                    className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-800/50 transition-colors text-left"
                  >
                    <div className="w-6 h-6 rounded flex items-center justify-center bg-green-500">
                      <CheckIcon className="w-3 h-3 text-black" />
                    </div>
                    <span className="text-sm text-gray-300 truncate">{step.name}</span>
                  </button>
                )
              })}
            </div>
          </div>
        )}
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

      {/* Force Complete Option */}
      {canForceComplete && completedSteps.size < GENERATION_STEPS.length && (
        <Card className="border-yellow-800/30 bg-yellow-950/20">
          <div className="text-center p-6">
            <h4 className="text-lg font-semibold text-yellow-400 mb-2">
              Some documents are taking longer than expected
            </h4>
            <p className="text-gray-300 mb-4">
              You can continue with the {completedSteps.size} completed documents, or wait for the remaining ones to finish.
              {stuckSteps.size > 0 && (
                <><br /><span className="text-sm text-red-400">
                  {stuckSteps.size} document{stuckSteps.size > 1 ? 's' : ''} timed out and may be incomplete.
                </span></>
              )}
            </p>
            <div className="flex gap-3 justify-center">
              <button
                onClick={forceComplete}
                className="px-6 py-2 bg-green-500 hover:bg-green-600 text-black font-semibold rounded-lg transition-colors"
              >
                Continue with {completedSteps.size} Documents
              </button>
              <button
                onClick={retryGeneration}
                className="px-6 py-2 bg-orange-500 hover:bg-orange-600 text-black font-semibold rounded-lg transition-colors"
              >
                Retry All
              </button>
            </div>
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