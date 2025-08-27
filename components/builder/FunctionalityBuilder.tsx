'use client'

import React, { useState, useEffect, useCallback } from 'react'
import { CheckIcon, ExclamationTriangleIcon, MagicWandIcon, ReloadIcon, ChevronDownIcon, ChevronUpIcon } from '@radix-ui/react-icons'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { oneDark } from 'react-syntax-highlighter/dist/cjs/styles/prism'
import type { ProjectData } from './BuilderWizard'

type FeatureAnalysis = {
  suggestedFeatures: Array<{
    name: string
    description: string
    priority: 'must-have' | 'should-have' | 'could-have'
    difficulty: 'easy' | 'medium' | 'hard'
    timeEstimate: string
  }>
  scopeWarnings: string[]
  recommendedStack: {
    frontend: string
    backend: string
    database: string
    aiService?: string
  }
  projectComplexity: 'simple' | 'moderate' | 'complex'
  estimatedTime: string
  keyInsights: string[]
}

interface FunctionalityBuilderProps {
  projectData: ProjectData
  updateProjectData: (updates: Partial<ProjectData>) => void
}

export default function FunctionalityBuilder({ projectData, updateProjectData }: FunctionalityBuilderProps) {
  const [analysis, setAnalysis] = useState<FeatureAnalysis | null>(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [selectedFeatures, setSelectedFeatures] = useState<string[]>(projectData.features || [])
  const [error, setError] = useState<string | null>(null)
  const [showWarnings, setShowWarnings] = useState(false)
  const [showInsights, setShowInsights] = useState(false)

  const analyzeProject = useCallback(async () => {
    setIsAnalyzing(true)
    setError(null)

    try {
      const response = await fetch('/api/builder/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          projectIdea: projectData.customIdea,
          template: projectData.template,
          selectedStack: projectData.stack
        })
      })

      if (!response.ok) {
        throw new Error('Analysis failed')
      }

      const result = await response.json()
      setAnalysis(result)
      
      // Auto-select must-have features
      const mustHaveFeatures = result.suggestedFeatures
        .filter((f: any) => f.priority === 'must-have')
        .map((f: any) => f.name)
      setSelectedFeatures(mustHaveFeatures)

    } catch (err) {
      setError('Failed to analyze your project. Please try again.')
      console.error('Analysis error:', err)
    } finally {
      setIsAnalyzing(false)
    }
  }, [projectData.template, projectData.customIdea, projectData.stack])

  useEffect(() => {
    if (projectData.template || projectData.customIdea) {
      analyzeProject()
    }
  }, [projectData.template, projectData.customIdea, projectData.stack, analyzeProject])

  useEffect(() => {
    updateProjectData({ features: selectedFeatures })
  }, [selectedFeatures, updateProjectData])

  const toggleFeature = (featureName: string) => {
    setSelectedFeatures(prev => 
      prev.includes(featureName)
        ? prev.filter(f => f !== featureName)
        : [...prev, featureName]
    )
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'must-have': return 'text-red-400 bg-red-900/30'
      case 'should-have': return 'text-yellow-400 bg-yellow-900/30'
      case 'could-have': return 'text-green-400 bg-green-900/30'
      default: return 'text-gray-400 bg-gray-900/30'
    }
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'text-green-400'
      case 'medium': return 'text-yellow-400'
      case 'hard': return 'text-red-400'
      default: return 'text-gray-400'
    }
  }

  if (isAnalyzing) {
    return <StreamingAnalysisView projectData={projectData} />
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <ExclamationTriangleIcon className="w-12 h-12 text-red-400 mx-auto mb-4" />
        <p className="text-red-400 mb-4">{error}</p>
        <button
          onClick={analyzeProject}
          className="px-6 py-2 bg-orange-500 hover:bg-orange-600 text-black font-semibold rounded-lg transition-colors"
        >
          Try Again
        </button>
      </div>
    )
  }

  if (!analysis) {
    return (
      <div className="text-center py-8">
        <MagicWandIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <p className="text-gray-400">Select a template or enter an idea to get AI suggestions</p>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Project Overview */}
      <div className="grid md:grid-cols-3 gap-6">
        <div className="p-4 bg-gray-950/50 border border-gray-800 rounded-lg text-center">
          <div className="text-2xl font-bold text-orange-400 mb-2">{analysis.estimatedTime}</div>
          <div className="text-sm text-gray-400">Estimated Build Time</div>
        </div>
        <div className="p-4 bg-gray-950/50 border border-gray-800 rounded-lg text-center">
          <div className={`text-2xl font-bold mb-2 ${
            analysis.projectComplexity === 'simple' ? 'text-green-400' :
            analysis.projectComplexity === 'moderate' ? 'text-yellow-400' : 'text-red-400'
          }`}>
            {analysis.projectComplexity.charAt(0).toUpperCase() + analysis.projectComplexity.slice(1)}
          </div>
          <div className="text-sm text-gray-400">Project Complexity</div>
        </div>
        <div className="p-4 bg-gray-950/50 border border-gray-800 rounded-lg text-center">
          <div className="text-2xl font-bold text-orange-400 mb-2">{selectedFeatures.length}</div>
          <div className="text-sm text-gray-400">Selected Features</div>
        </div>
      </div>

      {/* Scope Warnings Accordion */}
      {analysis.scopeWarnings.length > 0 && (
        <div className="border border-yellow-800/30 rounded-lg bg-yellow-950/10">
          <button
            onClick={() => setShowWarnings(!showWarnings)}
            className="w-full p-3 flex items-center justify-between text-left hover:bg-yellow-950/20 transition-colors rounded-lg"
          >
            <div className="flex items-center gap-3">
              <ExclamationTriangleIcon className="w-5 h-5 text-yellow-400 flex-shrink-0" />
              <span className="text-yellow-400 font-semibold">Scope Warnings</span>
              <span className="text-xs text-yellow-400/70 bg-yellow-900/30 px-2 py-1 rounded">
                {analysis.scopeWarnings.length} items
              </span>
            </div>
            {showWarnings ? (
              <ChevronUpIcon className="w-5 h-5 text-yellow-400" />
            ) : (
              <ChevronDownIcon className="w-5 h-5 text-yellow-400" />
            )}
          </button>
          {showWarnings && (
            <div className="px-3 pb-3">
              <div className="space-y-2 text-sm text-gray-300">
                {analysis.scopeWarnings.map((warning, index) => (
                  <div key={index} className="flex items-start gap-2 p-2 bg-yellow-950/10 rounded">
                    <span className="text-yellow-400 mt-0.5">⚠️</span>
                    <span>{warning}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* AI Insights Accordion */}
      <div className="border border-blue-800/30 rounded-lg bg-blue-950/10">
        <button
          onClick={() => setShowInsights(!showInsights)}
          className="w-full p-3 flex items-center justify-between text-left hover:bg-blue-950/20 transition-colors rounded-lg"
        >
          <div className="flex items-center gap-3">
            <MagicWandIcon className="w-5 h-5 text-blue-400 flex-shrink-0" />
            <span className="text-blue-400 font-semibold">AI Insights</span>
            <span className="text-xs text-blue-400/70 bg-blue-900/30 px-2 py-1 rounded">
              {analysis.keyInsights.length} tips
            </span>
          </div>
          {showInsights ? (
            <ChevronUpIcon className="w-5 h-5 text-blue-400" />
          ) : (
            <ChevronDownIcon className="w-5 h-5 text-blue-400" />
          )}
        </button>
        {showInsights && (
          <div className="px-3 pb-3">
            <div className="space-y-2 text-sm text-gray-300">
              {analysis.keyInsights.map((insight, index) => (
                <div key={index} className="flex items-start gap-2 p-2 bg-blue-950/10 rounded">
                  <span className="text-blue-400 mt-0.5">💡</span>
                  <span>{insight}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Feature Selection */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold">Select Features to Build</h3>
          <button
            onClick={analyzeProject}
            className="flex items-center gap-2 px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors text-sm"
          >
            <ReloadIcon className="w-4 h-4" />
            Re-analyze
          </button>
        </div>

        <div className="space-y-4">
          {analysis.suggestedFeatures.map((feature, index) => (
            <div
              key={index}
              onClick={() => toggleFeature(feature.name)}
              className={`
                p-4 border rounded-lg cursor-pointer transition-all
                ${selectedFeatures.includes(feature.name)
                  ? 'border-orange-500 bg-orange-950/20'
                  : 'border-gray-800 hover:border-gray-600'
                }
              `}
            >
              <div className="flex items-start gap-4">
                <div className={`
                  w-6 h-6 rounded border-2 flex items-center justify-center flex-shrink-0 mt-1
                  ${selectedFeatures.includes(feature.name)
                    ? 'border-orange-500 bg-orange-500'
                    : 'border-gray-600'
                  }
                `}>
                  {selectedFeatures.includes(feature.name) && (
                    <CheckIcon className="w-4 h-4 text-black" />
                  )}
                </div>

                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h4 className="font-semibold">{feature.name}</h4>
                    <span className={`px-2 py-1 rounded-full text-xs ${getPriorityColor(feature.priority)}`}>
                      {feature.priority.replace('-', ' ')}
                    </span>
                    <span className="text-xs text-gray-500">
                      {feature.timeEstimate}
                    </span>
                    <span className={`text-xs ${getDifficultyColor(feature.difficulty)}`}>
                      {feature.difficulty}
                    </span>
                  </div>
                  <p className="text-sm text-gray-400">{feature.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {selectedFeatures.length > 0 && (
        <div className="p-4 bg-green-950/20 border border-green-800/30 rounded-lg">
          <h4 className="text-green-400 font-semibold mb-2">Selected Features Summary</h4>
          <div className="flex flex-wrap gap-2">
            {selectedFeatures.map((feature, index) => (
              <span key={index} className="px-3 py-1 bg-green-500/20 text-green-400 rounded-full text-sm">
                {feature}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

// Streaming Analysis View Component
function StreamingAnalysisView({ projectData }: { projectData: ProjectData }) {
  const [streamedContent, setStreamedContent] = useState<string>('')
  const [isComplete, setIsComplete] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const contentRef = React.useRef<HTMLDivElement>(null)

  useEffect(() => {
    const startStreaming = async () => {
      try {
        const response = await fetch('/api/builder/analyze-stream', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            projectIdea: projectData.customIdea,
            template: projectData.template,
            selectedStack: projectData.stack
          })
        })

        if (!response.ok) {
          throw new Error('Streaming failed')
        }

        const reader = response.body?.getReader()
        if (!reader) {
          throw new Error('No reader available')
        }

        const decoder = new TextDecoder()
        let buffer = ''

        while (true) {
          const { done, value } = await reader.read()
          
          if (done) {
            setIsComplete(true)
            break
          }

          const chunk = decoder.decode(value, { stream: true })
          buffer += chunk

          // Process SSE chunks
          const lines = buffer.split('\n')
          buffer = lines.pop() || '' // Keep incomplete line in buffer

          for (const line of lines) {
            if (line.startsWith('data: ')) {
              try {
                const data = JSON.parse(line.slice(6))
                if (data.choices?.[0]?.delta?.content) {
                  setStreamedContent(prev => {
                    const newContent = prev + data.choices[0].delta.content
                    // Auto-scroll to bottom after content updates
                    setTimeout(() => {
                      if (contentRef.current) {
                        contentRef.current.scrollTop = contentRef.current.scrollHeight
                      }
                    }, 10)
                    return newContent
                  })
                }
              } catch (e) {
                // Skip malformed JSON
              }
            }
          }
        }
      } catch (err) {
        setError('Failed to stream analysis')
        console.error('Streaming error:', err)
      }
    }

    startStreaming()
  }, [projectData])

  return (
    <div className="max-w-4xl mx-auto">
      {/* Streaming Container - Fixed Size */}
      <div className="bg-black border border-gray-900 rounded-lg overflow-hidden h-[500px] flex flex-col">
        {/* Terminal Header */}
        <div className="flex items-center gap-2 px-4 py-3 bg-gray-950 border-b border-gray-900 flex-shrink-0">
          <div className="flex gap-2">
            <div className="w-3 h-3 bg-red-500 rounded-full"></div>
            <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
          </div>
          <span className="text-sm text-gray-500 ml-3 font-mono">Generating analysis/thoughts.md</span>
        </div>

        {/* Code Content with Gradient Scrim */}
        <div className="flex-1 relative overflow-hidden">
          <div ref={contentRef} className="absolute inset-0 p-6 font-mono text-sm overflow-y-auto bg-black">
            {error ? (
              <div className="text-red-400">Error: {error}</div>
            ) : (
              <SyntaxHighlighter
                language="markdown"
                style={oneDark}
                customStyle={{
                  backgroundColor: 'transparent',
                  padding: 0,
                  margin: 0,
                  fontSize: '14px',
                  lineHeight: '1.5'
                }}
                codeTagProps={{
                  style: {
                    backgroundColor: 'transparent'
                  }
                }}
              >
                {streamedContent + (!isComplete ? ' |' : '')}
              </SyntaxHighlighter>
            )}
          </div>
          
          {/* Gradient Scrim - fades content at bottom */}
          <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-black via-black/80 to-transparent pointer-events-none"></div>
        </div>

        {/* Status Bar */}
        <div className="px-6 py-3 bg-black border-t border-gray-900 flex-shrink-0">
          <div className="flex justify-between text-xs text-gray-500">
            <span>{isComplete ? 'Analysis Complete' : 'Streaming...'}</span>
            <span>{streamedContent.length} characters</span>
          </div>
        </div>
      </div>
    </div>
  )
}