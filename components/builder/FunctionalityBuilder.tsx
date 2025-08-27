'use client'

import { useState, useEffect, useCallback } from 'react'
import { CheckIcon, ExclamationTriangleIcon, MagicWandIcon, ReloadIcon, ChevronDownIcon, ChevronUpIcon } from '@radix-ui/react-icons'
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
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <ReloadIcon className="w-8 h-8 animate-spin mx-auto mb-4 text-orange-400" />
          <p className="text-lg font-semibold mb-2">AI is analyzing your project...</p>
          <p className="text-gray-400">This may take a few seconds</p>
        </div>
      </div>
    )
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