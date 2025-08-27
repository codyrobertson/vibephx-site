'use client'

import { useState, useCallback } from 'react'
import { ArrowLeftIcon, ArrowRightIcon } from '@radix-ui/react-icons'
import TemplateSelector from './TemplateSelector'
import SoftwareStackPicker from './SoftwareStackPicker'
import FunctionalityBuilder from './FunctionalityBuilder'
import DeploymentSelector from './DeploymentSelector'
import GenerationProgress from './GenerationProgress'
import OutputDashboard from './OutputDashboard'

export type ProjectData = {
  template?: string
  customIdea?: string
  stack: {
    frontend?: string
    backend?: string
    database?: string
    aiService?: string
  }
  aiRecommendations?: {
    frontend?: string
    backend?: string
    database?: string
    aiService?: string
  }
  features: string[]
  deployment: {
    platform?: string
    config?: Record<string, any>
  }
  generated?: {
    prd?: string
    buildDoc?: string
    uiSpecs?: string
    dataModels?: string
    taskList?: string
    marketingGuide?: string
    claudeMd?: string
    cursorRules?: string
  }
}

const STEPS = [
  { id: 'template', title: 'Template Selection', description: 'Choose a template or describe your idea' },
  { id: 'stack', title: 'Software Stack', description: 'Select your preferred technologies' },
  { id: 'features', title: 'Core Functionality', description: 'AI-powered feature selection' },
  { id: 'deployment', title: 'Deployment Platform', description: 'Choose where to deploy' },
  { id: 'generation', title: 'AI Generation', description: 'Creating your project docs' },
  { id: 'output', title: 'Your Project', description: 'Download and review generated assets' },
]

export default function BuilderWizard() {
  const [currentStep, setCurrentStep] = useState(0)
  const [projectData, setProjectData] = useState<ProjectData>({
    stack: {},
    features: [],
    deployment: {}
  })
  const [isGenerating, setIsGenerating] = useState(false)

  const updateProjectData = useCallback((updates: Partial<ProjectData>) => {
    setProjectData(prev => ({ ...prev, ...updates }))
  }, [])

  const nextStep = () => {
    if (currentStep < STEPS.length - 1) {
      // If leaving stack step without manual selections, apply AI recommendations
      if (currentStep === 1 && 
          !projectData.stack.frontend && 
          projectData.aiRecommendations && 
          Object.keys(projectData.aiRecommendations).length > 0) {
        console.log('Auto-applying AI recommendations before proceeding:', projectData.aiRecommendations)
        updateProjectData({ stack: projectData.aiRecommendations })
      }
      
      setCurrentStep(currentStep + 1)
    }
  }

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  const canProceed = () => {
    switch (currentStep) {
      case 0: // Template
        return projectData.template || projectData.customIdea
      case 1: // Stack - Allow proceeding if user selected OR if AI recommendations are available
        return projectData.stack.frontend || 
               (projectData.aiRecommendations && Object.keys(projectData.aiRecommendations).length > 0)
      case 2: // Features
        return projectData.features.length > 0
      case 3: // Deployment
        return projectData.deployment.platform
      case 4: // Generation
        return projectData.generated
      default:
        return true
    }
  }

  const renderStep = () => {
    switch (currentStep) {
      case 0:
        return <TemplateSelector projectData={projectData} updateProjectData={updateProjectData} />
      case 1:
        return <SoftwareStackPicker projectData={projectData} updateProjectData={updateProjectData} />
      case 2:
        return <FunctionalityBuilder projectData={projectData} updateProjectData={updateProjectData} />
      case 3:
        return <DeploymentSelector projectData={projectData} updateProjectData={updateProjectData} />
      case 4:
        return <GenerationProgress 
          projectData={projectData} 
          updateProjectData={updateProjectData}
          onComplete={() => setCurrentStep(5)}
        />
      case 5:
        return <OutputDashboard projectData={projectData} />
      default:
        return null
    }
  }

  return (
    <div className="h-full flex flex-col max-w-6xl mx-auto px-4 md:px-6">
      {/* Simple Header */}
      <div className="mb-4 md:mb-6 flex-shrink-0">
        <div className="text-center">
          <h2 className="text-lg md:text-xl lg:text-2xl font-bold mb-1 md:mb-2">{STEPS[currentStep].title}</h2>
          <p className="text-sm md:text-base text-gray-400">{STEPS[currentStep].description}</p>
        </div>
      </div>

      {/* Step Content - Takes remaining space */}
      <div className="flex-1 overflow-y-auto mb-4 md:mb-6">
        <div className="h-full">
          {renderStep()}
        </div>
      </div>

      {/* Navigation - Fixed at bottom */}
      <div className="flex justify-between items-center flex-shrink-0 pb-4 md:pb-6">
        <button
          onClick={() => {
            console.log('Previous clicked, current step:', currentStep)
            prevStep()
          }}
          disabled={currentStep === 0}
          className="flex items-center gap-2 px-4 py-2 md:px-6 md:py-3 bg-gray-800 hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg transition-colors text-sm md:text-base"
        >
          <ArrowLeftIcon className="w-4 h-4" />
          Previous
        </button>

        {currentStep < STEPS.length - 1 && (
          <div className="flex items-center gap-4">
            {/* Show guidance when AI recommendations are available but no manual selections made */}
            {currentStep === 1 && 
             projectData.aiRecommendations && 
             Object.keys(projectData.aiRecommendations).length > 0 && 
             !projectData.stack.frontend && (
              <div className="text-sm text-purple-400 bg-purple-950/20 px-3 py-1 rounded-lg border border-purple-800/30">
                ✨ AI recommendations ready - continue or make your own selections
              </div>
            )}
            
            <button
              onClick={() => {
                console.log('Next clicked, current step:', currentStep, 'can proceed:', canProceed())
                nextStep()
              }}
              disabled={!canProceed() || isGenerating}
              className="flex items-center gap-2 px-4 py-2 md:px-6 md:py-3 bg-orange-500 hover:bg-orange-600 disabled:opacity-50 disabled:cursor-not-allowed text-black font-bold rounded-lg transition-colors text-sm md:text-base"
            >
              Next
              <ArrowRightIcon className="w-4 h-4" />
            </button>
          </div>
        )}

        {currentStep === STEPS.length - 1 && (
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 md:px-6 md:py-3 bg-green-500 hover:bg-green-600 text-black font-bold rounded-lg transition-colors text-sm md:text-base"
          >
            Start New Project
          </button>
        )}
      </div>
    </div>
  )
}