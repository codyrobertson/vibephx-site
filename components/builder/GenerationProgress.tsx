'use client'

import { useState, useEffect } from 'react'
import { CheckIcon, ReloadIcon, FileTextIcon, CodeIcon, ImageIcon, TableIcon, ListBulletIcon, SpeakerLoudIcon, MagicWandIcon, GearIcon } from '@radix-ui/react-icons'
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

interface GenerationProgressProps {
  projectData: ProjectData
  updateProjectData: (updates: Partial<ProjectData>) => void
  onComplete: () => void
}

export default function GenerationProgress({ projectData, updateProjectData, onComplete }: GenerationProgressProps) {
  const [currentStep, setCurrentStep] = useState(0)
  const [completedSteps, setCompletedSteps] = useState<Set<string>>(new Set())
  const [generatedContent, setGeneratedContent] = useState<Record<string, string>>({})
  const [isGenerating, setIsGenerating] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    startGeneration()
  }, [])

  const startGeneration = async () => {
    setIsGenerating(true)
    setError(null)

    try {
      const generated: Record<string, string> = {}

      for (let i = 0; i < GENERATION_STEPS.length; i++) {
        const step = GENERATION_STEPS[i]
        setCurrentStep(i)

        // Simulate some processing time for UX
        await new Promise(resolve => setTimeout(resolve, 1000))

        const response = await fetch('/api/builder/generate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            projectData,
            documentType: step.id
          })
        })

        if (!response.ok) {
          throw new Error(`Failed to generate ${step.name}`)
        }

        const result = await response.json()
        generated[step.id] = result.content

        setGeneratedContent(prev => ({ ...prev, [step.id]: result.content }))
        setCompletedSteps(prev => new Set([...prev, step.id]))
      }

      // Update project data with generated content
      updateProjectData({ generated })

      // Mark as complete
      setCurrentStep(GENERATION_STEPS.length)
      setTimeout(() => {
        onComplete()
      }, 1000)

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Generation failed')
      console.error('Generation error:', err)
    } finally {
      setIsGenerating(false)
    }
  }

  const retryGeneration = () => {
    setCompletedSteps(new Set())
    setGeneratedContent({})
    setCurrentStep(0)
    startGeneration()
  }

  const totalEstimatedTime = GENERATION_STEPS.reduce((sum, step) => sum + step.estimatedTime, 0)
  const progress = completedSteps.size / GENERATION_STEPS.length * 100

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <h3 className="text-2xl font-bold mb-4">
          {currentStep >= GENERATION_STEPS.length ? 'Generation Complete!' : 'AI is Creating Your Project Assets'}
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

      {/* Generation Steps */}
      <div className="space-y-4">
        {GENERATION_STEPS.map((step, index) => {
          const IconComponent = step.icon
          const isCompleted = completedSteps.has(step.id)
          const isCurrent = index === currentStep && isGenerating
          const isPending = index > currentStep

          return (
            <div
              key={step.id}
              className={`
                flex items-center gap-4 p-4 border rounded-lg transition-all
                ${isCompleted ? 'border-green-500 bg-green-950/20' :
                  isCurrent ? 'border-orange-500 bg-orange-950/20' :
                  'border-gray-800'
                }
              `}
            >
              {/* Status Icon */}
              <div className={`
                w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0
                ${isCompleted ? 'bg-green-500' :
                  isCurrent ? 'bg-orange-500' :
                  'bg-gray-800'
                }
              `}>
                {isCompleted ? (
                  <CheckIcon className="w-6 h-6 text-black" />
                ) : isCurrent ? (
                  <ReloadIcon className="w-6 h-6 animate-spin text-black" />
                ) : (
                  <IconComponent className="w-6 h-6 text-gray-400" />
                )}
              </div>

              {/* Step Info */}
              <div className="flex-1">
                <div className="flex items-center justify-between mb-1">
                  <h4 className="font-semibold">{step.name}</h4>
                  <span className="text-xs text-gray-500">~{step.estimatedTime}s</span>
                </div>
                <p className="text-sm text-gray-400">{step.description}</p>
                
                {isCurrent && (
                  <div className="mt-2">
                    <div className="flex items-center gap-2 text-xs text-orange-400">
                      <ReloadIcon className="w-3 h-3 animate-spin" />
                      Generating...
                    </div>
                  </div>
                )}
              </div>

              {/* Word Count Preview */}
              {isCompleted && generatedContent[step.id] && (
                <div className="text-right text-xs text-gray-500">
                  <div>{Math.round(generatedContent[step.id].length / 4)} words</div>
                  <div>Generated ✓</div>
                </div>
              )}
            </div>
          )
        })}
      </div>

      {/* Error State */}
      {error && (
        <div className="p-4 bg-red-950/20 border border-red-800/30 rounded-lg text-center">
          <p className="text-red-400 mb-4">{error}</p>
          <button
            onClick={retryGeneration}
            className="px-6 py-2 bg-orange-500 hover:bg-orange-600 text-black font-semibold rounded-lg transition-colors"
          >
            Retry Generation
          </button>
        </div>
      )}

      {/* Completion State */}
      {currentStep >= GENERATION_STEPS.length && !error && (
        <div className="text-center p-8 bg-green-950/20 border border-green-800/30 rounded-lg">
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
            <span>📝 {Object.values(generatedContent).reduce((sum, content) => sum + Math.round(content.length / 4), 0)} words</span>
            <span>•</span>
            <span>⏱️ Generated in ~{totalEstimatedTime}s</span>
          </div>
        </div>
      )}
    </div>
  )
}