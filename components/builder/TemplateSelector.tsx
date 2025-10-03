'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { RocketIcon, TargetIcon, MagicWandIcon, PlusIcon } from '@radix-ui/react-icons'
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card'

const TEMPLATES = [
  {
    id: 'ai-lead-scorer',
    title: 'AI Lead Scorer & Responder',
    description: 'Upload CSV → LLM tags + scores → "Respond" button drafts reply.',
    icon: TargetIcon,
    persona: 'SMBs, freelancers, agencies',
    difficulty: 'Beginner-friendly',
    estimatedTime: '4-6 hours',
    features: ['CSV upload', 'AI scoring', 'Auto-reply drafts', 'Priority routing']
  },
  {
    id: 'booking-system',
    title: 'CRM-Connected Booking System',
    description: 'Public booking page → confirm email → write contact + meeting to CRM.',
    icon: RocketIcon,
    persona: 'Consultants, local services, solo agencies',
    difficulty: 'Intermediate',
    estimatedTime: '6-8 hours',
    features: ['Booking calendar', 'CRM integration', 'Email confirmations', 'Calendar sync']
  },
  {
    id: 'viral-waitlist',
    title: 'Viral Waitlist Builder',
    description: 'Email capture → unique referral link → counter + leaderboard.',
    icon: MagicWandIcon,
    persona: 'App launches, restaurants, events',
    difficulty: 'Beginner-friendly',
    estimatedTime: '3-4 hours',
    features: ['Referral system', 'Leaderboard', 'Email capture', 'Real-time counters']
  },
  {
    id: 'quote-generator',
    title: 'Smart Quote Generator',
    description: 'Choose services → auto price calc → generate PDF → email/send link.',
    icon: RocketIcon,
    persona: 'Contractors, freelancers, service providers',
    difficulty: 'Beginner-friendly',
    estimatedTime: '4-5 hours',
    features: ['Quote generator', 'PDF generation', 'Email delivery', 'Pricing calculator']
  }
]

interface TemplateSelectorProps {
  initialIdea?: string
  onTemplateSelect?: (templateId: string) => void
  onCustomIdeaChange?: (idea: string) => void
  selectedTemplate?: string
  customIdea?: string
}

export default function TemplateSelector({ 
  initialIdea, 
  onTemplateSelect, 
  onCustomIdeaChange,
  selectedTemplate: externalSelectedTemplate,
  customIdea: externalCustomIdea
}: TemplateSelectorProps) {
  const [internalSelectedTemplate, setInternalSelectedTemplate] = useState<string>('')
  const [internalCustomIdea, setInternalCustomIdea] = useState<string>(initialIdea || '')
  const [mode, setMode] = useState<'template' | 'custom'>(
    initialIdea ? 'custom' : 'template'
  )

  // Use external state if provided, otherwise use internal state
  const selectedTemplate = externalSelectedTemplate !== undefined ? externalSelectedTemplate : internalSelectedTemplate
  const customIdea = externalCustomIdea !== undefined ? externalCustomIdea : internalCustomIdea

  const selectTemplate = (templateId: string) => {
    if (onTemplateSelect) {
      onTemplateSelect(templateId)
      onCustomIdeaChange?.('')
    } else {
      setInternalSelectedTemplate(templateId)
      setInternalCustomIdea('')
    }
  }

  const handleCustomIdea = (idea: string) => {
    if (onCustomIdeaChange) {
      onCustomIdeaChange(idea)
      onTemplateSelect?.('')
    } else {
      setInternalCustomIdea(idea)
      setInternalSelectedTemplate('')
    }
  }

  const switchMode = (newMode: 'template' | 'custom') => {
    setMode(newMode)
    if (newMode === 'template') {
      handleCustomIdea('')
    } else {
      selectTemplate('')
    }
  }

  return (
    <div className="h-full flex flex-col space-y-4 md:space-y-6">
      {/* Mode Toggle */}
      <div className="flex justify-center flex-shrink-0">
        <div className="flex bg-gray-800 rounded-lg p-1">
          <button
            onClick={() => switchMode('template')}
            className={`px-4 py-1.5 md:px-6 md:py-2 text-sm md:text-base rounded-md transition-colors ${
              mode === 'template' 
                ? 'bg-orange-500 text-black font-semibold' 
                : 'text-gray-300 hover:text-white'
            }`}
          >
            Choose Template
          </button>
          <button
            onClick={() => switchMode('custom')}
            className={`px-4 py-1.5 md:px-6 md:py-2 text-sm md:text-base rounded-md transition-colors ${
              mode === 'custom' 
                ? 'bg-orange-500 text-black font-semibold' 
                : 'text-gray-300 hover:text-white'
            }`}
          >
            Custom Idea
          </button>
        </div>
      </div>

      {mode === 'template' ? (
        /* Template Selection */
        <div className="flex-1 overflow-y-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 pb-4">
          {TEMPLATES.map((template) => {
            const IconComponent = template.icon
            return (
              <Card
                key={template.id}
                
                onClick={() => {
                  console.log('Template clicked:', template.id)
                  selectTemplate(template.id)
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault()
                    selectTemplate(template.id)
                  }
                }}
                role="button"
                tabIndex={0}
                className={`group hover:border-orange-500/50 transition-all duration-200 flex flex-col min-h-[220px] relative ${selectedTemplate === template.id ? 'border-orange-500' : ''}`}
                aria-label={`Select ${template.title} template`}
                aria-selected={selectedTemplate === template.id}
              >
                {/* Top Right: Badge (inline replacement) */}
                <div className="absolute top-4 right-4 z-30">
                  <span
                    className={`px-2 py-1 text-xs rounded-md font-medium ${
                      template.difficulty === 'Beginner-friendly'
                        ? 'bg-green-500/15 text-green-400 border border-green-600/40'
                        : 'bg-yellow-500/15 text-yellow-400 border border-yellow-600/40'
                    }`}
                  >
                    {template.difficulty}
                  </span>
                </div>

                {/* Top Left: Icon (inline replacement) */}
                <div className="flex justify-start px-6 pt-6">
                  <div className="w-10 h-10 rounded-lg bg-orange-500/15 border border-orange-600/30 text-orange-400 flex items-center justify-center">
                    <IconComponent className="w-6 h-6" />
                  </div>
                </div>
                
                {/* Middle: Title and Subtitle with more spacing */}
                <div className="text-left space-y-3 px-6 pt-4 pb-6 flex-1">
                  <CardTitle>
                    {template.title}
                  </CardTitle>
                  
                  <CardDescription color="gray">
                    {template.description}
                  </CardDescription>
                </div>
              </Card>
            )
          })}
          </div>
        </div>
      ) : (
        /* Custom Idea Input */
        <div className="flex-1 flex flex-col">
          <div className="max-w-2xl mx-auto flex-1 flex flex-col">
            <div className="p-4 md:p-8 border border-gray-800 rounded-lg flex-1 flex flex-col">
            <div className="text-center mb-4 md:mb-6 flex-shrink-0">
              <div className="w-12 h-12 md:w-16 md:h-16 bg-purple-500/20 rounded-lg flex items-center justify-center mx-auto mb-3 md:mb-4">
                <PlusIcon className="w-8 h-8 md:w-10 md:h-10 text-purple-400" />
              </div>
              <h3 className="text-lg md:text-xl font-bold mb-1 md:mb-2">Describe Your Custom Idea</h3>
              <p className="text-sm md:text-base text-gray-400">
                Tell us about your app idea. Our AI will analyze it and help scope it for a one-day build.
              </p>
            </div>
            
            <textarea
              value={customIdea}
              onChange={(e) => handleCustomIdea(e.target.value)}
              placeholder="Example: I want to build a simple expense tracker where users can add expenses, categorize them, and see monthly reports. It should have a clean interface and maybe some charts to visualize spending patterns..."
              className="w-full flex-1 min-h-[120px] p-3 md:p-4 bg-gray-900 border border-gray-700 rounded-lg resize-none focus:border-orange-500 focus:outline-none text-sm md:text-base"
              maxLength={500}
            />
            
            <div className="flex justify-between items-center mt-4">
              <span className="text-xs text-gray-500">
                {customIdea.length}/500 characters
              </span>
              <div className="text-xs text-gray-400">
                💡 Be specific about core features and target users
              </div>
            </div>
          </div>
          
          {customIdea && (
            <div className="mt-6 p-4 bg-blue-950/20 border border-blue-800/30 rounded-lg">
              <div className="flex items-start gap-3">
                <MagicWandIcon className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-blue-400 font-medium text-sm mb-1">AI Analysis Preview</p>
                  <p className="text-xs text-gray-400">
                    Our AI will analyze your idea in the next step to suggest the optimal tech stack, 
                    scope features for a one-day build, and create a complete development plan.
                  </p>
                </div>
              </div>
            </div>
          )}
          </div>
        </div>
      )}
    </div>
  )
}