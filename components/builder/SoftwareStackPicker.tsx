'use client'

import { useState, useEffect } from 'react'
import { CheckIcon, MagicWandIcon, ComponentInstanceIcon, TableIcon, GlobeIcon, LightningBoltIcon, ReloadIcon } from '@radix-ui/react-icons'
import BrandLogo from '../ui/BrandLogo'
import type { ProjectData } from './BuilderWizard'

interface StackItem {
  id: string
  name: string
  description: string
  difficulty: string
  popular: boolean
  logo: string
  fallbackIcon?: any
  relevanceScore?: number
}

interface StackSuggestions {
  suggestions: {
    frontend: StackItem[]
    backend: StackItem[]
    database: StackItem[]
    aiService: StackItem[]
  }
  aiRecommendations: Record<string, string>
  templateInfo: {
    title: string
    requiredFeatures: string[]
    avoidFeatures: string[]
    complexityBudget: number
  } | null
  reasoning: string
}

// Fallback stack options (in case API fails)
const FALLBACK_TECH_STACKS = {
  frontend: [
    { 
      id: 'nextjs', 
      name: 'Next.js', 
      description: 'React framework with SSR', 
      difficulty: 'Intermediate', 
      popular: true,
      logo: 'https://img.logo.dev/nextjs.org?token=pk_cJ_vQ1nNRM6nbN75WsWP3Q&size=32&format=png',
      fallbackIcon: ComponentInstanceIcon
    },
    { 
      id: 'react', 
      name: 'React + Vite', 
      description: 'Modern React with fast bundling', 
      difficulty: 'Beginner', 
      popular: true,
      logo: 'https://img.logo.dev/react.dev?token=pk_cJ_vQ1nNRM6nbN75WsWP3Q&size=32&format=png',
      fallbackIcon: ComponentInstanceIcon
    },
    { 
      id: 'vue', 
      name: 'Vue.js', 
      description: 'Progressive JavaScript framework', 
      difficulty: 'Beginner', 
      popular: false,
      logo: 'https://img.logo.dev/vuejs.org?token=pk_cJ_vQ1nNRM6nbN75WsWP3Q&size=32&format=png',
      fallbackIcon: ComponentInstanceIcon
    },
    { 
      id: 'vanilla', 
      name: 'Vanilla JS', 
      description: 'Pure JavaScript, no frameworks', 
      difficulty: 'Beginner', 
      popular: false,
      logo: 'https://img.logo.dev/javascript.com?token=pk_cJ_vQ1nNRM6nbN75WsWP3Q&size=32&format=png',
      fallbackIcon: ComponentInstanceIcon
    }
  ],
  backend: [
    { 
      id: 'nodejs', 
      name: 'Node.js', 
      description: 'JavaScript runtime for servers', 
      difficulty: 'Beginner', 
      popular: true,
      logo: 'https://img.logo.dev/nodejs.org?token=pk_cJ_vQ1nNRM6nbN75WsWP3Q&size=32&format=png',
      fallbackIcon: LightningBoltIcon
    },
    { 
      id: 'nextjs-api', 
      name: 'Next.js API Routes', 
      description: 'Built-in API with Next.js', 
      difficulty: 'Beginner', 
      popular: true,
      logo: 'https://img.logo.dev/nextjs.org?token=pk_cJ_vQ1nNRM6nbN75WsWP3Q&size=32&format=png',
      fallbackIcon: LightningBoltIcon
    },
    { 
      id: 'python', 
      name: 'Python (FastAPI)', 
      description: 'Modern Python web framework', 
      difficulty: 'Intermediate', 
      popular: false,
      logo: 'https://img.logo.dev/python.org?token=pk_cJ_vQ1nNRM6nbN75WsWP3Q&size=32&format=png',
      fallbackIcon: LightningBoltIcon
    },
    { 
      id: 'serverless', 
      name: 'Serverless Functions', 
      description: 'Simple cloud functions (Vercel/Netlify)', 
      difficulty: 'Beginner', 
      popular: true,
      logo: 'https://img.logo.dev/vercel.com?token=pk_cJ_vQ1nNRM6nbN75WsWP3Q&size=32&format=png',
      fallbackIcon: LightningBoltIcon
    }
  ],
  database: [
    { 
      id: 'supabase', 
      name: 'Supabase', 
      description: 'PostgreSQL with instant APIs', 
      difficulty: 'Beginner', 
      popular: true,
      logo: 'https://img.logo.dev/supabase.com?token=pk_cJ_vQ1nNRM6nbN75WsWP3Q&size=32&format=png',
      fallbackIcon: TableIcon
    },
    { 
      id: 'firebase', 
      name: 'Firebase', 
      description: 'NoSQL with real-time sync', 
      difficulty: 'Beginner', 
      popular: true,
      logo: 'https://img.logo.dev/firebase.google.com?token=pk_cJ_vQ1nNRM6nbN75WsWP3Q&size=32&format=png',
      fallbackIcon: TableIcon
    },
    { 
      id: 'planetscale', 
      name: 'PlanetScale', 
      description: 'Serverless MySQL platform', 
      difficulty: 'Intermediate', 
      popular: false,
      logo: 'https://img.logo.dev/planetscale.com?token=pk_cJ_vQ1nNRM6nbN75WsWP3Q&size=32&format=png',
      fallbackIcon: TableIcon
    },
    { 
      id: 'local', 
      name: 'Local SQLite', 
      description: 'Simple file-based database', 
      difficulty: 'Beginner', 
      popular: false,
      logo: 'https://img.logo.dev/sqlite.org?token=pk_cJ_vQ1nNRM6nbN75WsWP3Q&size=32&format=png',
      fallbackIcon: TableIcon
    }
  ],
  aiService: [
    { 
      id: 'openai', 
      name: 'OpenAI GPT', 
      description: 'Most capable AI models', 
      difficulty: 'Beginner', 
      popular: true,
      logo: 'https://img.logo.dev/openai.com?token=pk_cJ_vQ1nNRM6nbN75WsWP3Q&size=32&format=png',
      fallbackIcon: GlobeIcon
    },
    { 
      id: 'anthropic', 
      name: 'Anthropic Claude', 
      description: 'Excellent for analysis & reasoning', 
      difficulty: 'Beginner', 
      popular: true,
      logo: 'https://img.logo.dev/anthropic.com?token=pk_cJ_vQ1nNRM6nbN75WsWP3Q&size=32&format=png',
      fallbackIcon: GlobeIcon
    },
    { 
      id: 'openrouter', 
      name: 'OpenRouter', 
      description: 'Access to multiple AI models', 
      difficulty: 'Intermediate', 
      popular: false,
      logo: 'https://img.logo.dev/openrouter.ai?token=pk_cJ_vQ1nNRM6nbN75WsWP3Q&size=32&format=png',
      fallbackIcon: GlobeIcon
    },
    { 
      id: 'none', 
      name: 'No AI Features', 
      description: 'Traditional app without AI', 
      difficulty: 'Beginner', 
      popular: false,
      fallbackIcon: GlobeIcon
    }
  ]
}

const RECOMMENDED_COMBOS = [
  {
    name: 'Beginner Friendly',
    description: 'Perfect for first-time builders',
    stack: { frontend: 'react', backend: 'serverless', database: 'supabase', aiService: 'openai' },
    icon: '🚀'
  },
  {
    name: 'Full-Stack Power',
    description: 'Complete control with modern tools',
    stack: { frontend: 'nextjs', backend: 'nextjs-api', database: 'supabase', aiService: 'anthropic' },
    icon: '⚡'
  },
  {
    name: 'Serverless First',
    description: 'Scale automatically, pay per use',
    stack: { frontend: 'nextjs', backend: 'serverless', database: 'firebase', aiService: 'openrouter' },
    icon: '☁️'
  }
]

interface SoftwareStackPickerProps {
  projectData: ProjectData
  updateProjectData: (updates: Partial<ProjectData>) => void
}

export default function SoftwareStackPicker({ projectData, updateProjectData }: SoftwareStackPickerProps) {
  const [selectedStack, setSelectedStack] = useState<Record<string, string>>({})
  const [showRecommendations, setShowRecommendations] = useState(true)
  const [stackSuggestions, setStackSuggestions] = useState<StackSuggestions | null>(null)
  const [isLoadingSuggestions, setIsLoadingSuggestions] = useState(false)
  const [techStacks, setTechStacks] = useState(FALLBACK_TECH_STACKS)
  const [hasUserAppliedAI, setHasUserAppliedAI] = useState(false)

  // Debug: Log component mount and any inherited data
  console.log('SoftwareStackPicker mounted/re-rendered with:', {
    projectDataStack: projectData.stack,
    selectedStack,
    template: projectData.template
  })

  // Force clear on component mount to prevent inheritance of stale data
  useEffect(() => {
    console.log('Component mounted - force clearing any inherited selections')
    console.log('Before clearing - selectedStack keys:', Object.keys(selectedStack))
    const emptyStack = {}
    setSelectedStack(emptyStack)
    setHasUserAppliedAI(false)
    console.log('After clearing - should be empty')
    // Don't call updateProjectData here to avoid infinite loops
  }, []) // Empty dependency array = run once on mount

  // Additional effect to monitor if selectedStack is getting set unexpectedly
  useEffect(() => {
    if (Object.keys(selectedStack).length > 0 && !hasUserAppliedAI) {
      console.warn('⚠️  selectedStack has items but user has not applied AI:', selectedStack)
      console.warn('This indicates auto-selection is happening somewhere!')
    }
  }, [selectedStack, hasUserAppliedAI])

  // Reset selections when template/idea changes
  useEffect(() => {
    // Always clear selections when template changes (fresh start)
    console.log('Template/idea changed:', { 
      template: projectData.template, 
      customIdea: projectData.customIdea,
      currentStack: selectedStack,
      projectDataStack: projectData.stack
    })
    
    // Force clear local state
    const emptyStack = {}
    setSelectedStack(emptyStack)
    setHasUserAppliedAI(false)
    
    console.log('Cleared all selections')
  }, [projectData.template, projectData.customIdea])

  // Define which templates should get AI recommendations
  const isAITemplate = (templateId: string | undefined) => {
    const aiTemplates = ['ai-lead-scorer'] // Only templates that explicitly need AI
    return templateId ? aiTemplates.includes(templateId) : false
  }

  // Load intelligent stack suggestions based on template/custom idea
  useEffect(() => {
    const loadStackSuggestions = async () => {
      if (!projectData.template && !projectData.customIdea) {
        setTechStacks(FALLBACK_TECH_STACKS)
        setStackSuggestions(null)
        return
      }

      // Load AI suggestions for all templates to provide smart filtering and recommendations
      // The difference is that non-AI templates won't auto-apply, but will still show intelligent options

      setIsLoadingSuggestions(true)
      
      try {
        const response = await fetch('/api/builder/stack-suggestions', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            templateId: projectData.template,
            customIdea: projectData.customIdea,
            currentSelections: {} // Don't pass existing selections to avoid auto-application
          })
        })

        if (response.ok) {
          const suggestions: StackSuggestions = await response.json()
          setStackSuggestions(suggestions)
          
          // Replace the tech stacks with filtered suggestions
          setTechStacks({
            frontend: suggestions.suggestions.frontend,
            backend: suggestions.suggestions.backend,
            database: suggestions.suggestions.database,
            aiService: suggestions.suggestions.aiService
          })

          console.log('Loaded intelligent stack suggestions:', suggestions.reasoning)
        } else {
          console.warn('Failed to load stack suggestions, using fallback')
          setTechStacks(FALLBACK_TECH_STACKS)
        }
      } catch (error) {
        console.error('Error loading stack suggestions:', error)
        setTechStacks(FALLBACK_TECH_STACKS)
      } finally {
        setIsLoadingSuggestions(false)
      }
    }

    loadStackSuggestions()
  }, [projectData.template, projectData.customIdea])

  useEffect(() => {
    updateProjectData({ stack: selectedStack })
  }, [selectedStack])

  // Prevent unwanted inheritance of selections from projectData.stack
  useEffect(() => {
    // Only inherit projectData.stack if user has explicitly applied AI or manually selected
    if (!hasUserAppliedAI && projectData.stack && Object.keys(projectData.stack).length > 0) {
      // Don't inherit - projectData might have stale selections
      console.log('Preventing inheritance of projectData.stack:', projectData.stack)
    }
  }, [projectData.stack, hasUserAppliedAI])

  const selectTech = (category: keyof typeof techStacks, techId: string) => {
    console.log('User manually selected:', category, techId)
    setSelectedStack(prev => ({ ...prev, [category]: techId }))
    setHasUserAppliedAI(true) // Mark that user has made intentional selections
    setShowRecommendations(false)
  }

  const applyAIRecommendations = () => {
    if (stackSuggestions?.aiRecommendations) {
      // Replace entire stack with AI recommendations (no previous selections)
      setSelectedStack(stackSuggestions.aiRecommendations)
      setHasUserAppliedAI(true)
      setShowRecommendations(false)
      console.log('User explicitly applied AI recommendations:', stackSuggestions.aiRecommendations)
    }
  }

  const applyRecommendedCombo = (combo: typeof RECOMMENDED_COMBOS[0]) => {
    setSelectedStack(combo.stack)
    setShowRecommendations(false)
  }

  const getSelectedTechName = (category: keyof typeof techStacks) => {
    const techId = selectedStack[category]
    if (!techId) return null
    const tech = techStacks[category].find(t => t.id === techId)
    return tech?.name || null
  }

  return (
    <div className="space-y-8">
      {showRecommendations && stackSuggestions && (
        <div className="bg-gradient-to-r from-purple-950/20 to-blue-950/20 border border-purple-800/30 rounded-lg p-6">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-3">
              {isLoadingSuggestions ? (
                <ReloadIcon className="w-6 h-6 text-purple-400 animate-spin" />
              ) : (
                <MagicWandIcon className="w-6 h-6 text-purple-400" />
              )}
              <h3 className="text-xl font-bold">
                {isAITemplate(projectData.template) 
                  ? 'AI-Optimized for Your Template'
                  : stackSuggestions?.templateInfo 
                    ? 'Smart Recommendations for Your Template'
                    : 'AI-Recommended Combinations'
                }
              </h3>
            </div>
            {stackSuggestions?.aiRecommendations && Object.keys(stackSuggestions.aiRecommendations).length > 0 && (
              <button
                onClick={applyAIRecommendations}
                className="px-4 py-2 bg-purple-500 hover:bg-purple-600 text-black font-semibold rounded-lg transition-colors"
              >
                {isAITemplate(projectData.template) ? 'Apply AI Pick' : 'Use Recommendations'}
              </button>
            )}
          </div>
          
          {stackSuggestions?.reasoning && (
            <p className="text-gray-300 mb-3 text-sm bg-purple-900/20 rounded p-2">
              💡 {stackSuggestions.reasoning}
            </p>
          )}
          
          {!isLoadingSuggestions && stackSuggestions?.templateInfo && (
            <div className="mb-3 text-xs">
              <span className="text-gray-400 mr-2">Optimized for:</span>
              {stackSuggestions.templateInfo.requiredFeatures.map((feature, idx) => (
                <span key={idx} className="inline-block px-2 py-1 bg-green-900/30 text-green-400 rounded mr-1 mb-1">
                  {feature}
                </span>
              ))}
            </div>
          )}
          
          {!stackSuggestions && !isLoadingSuggestions && (
            <p className="text-gray-400 mb-6">
              These proven combinations work well together and are optimized for one-day builds.
            </p>
          )}
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {RECOMMENDED_COMBOS.map((combo, index) => (
              <div
                key={index}
                onClick={() => {
                  console.log('Combo clicked:', combo.name)
                  applyRecommendedCombo(combo)
                }}
                className="w-full p-4 border border-gray-700 rounded-lg cursor-pointer hover:border-purple-500/50 hover:bg-purple-900/10 transition-colors select-none relative z-10"
                role="button"
                tabIndex={0}
              >
                <div className="text-2xl mb-2">{combo.icon}</div>
                <h4 className="font-semibold mb-1">{combo.name}</h4>
                <p className="text-xs text-gray-400 mb-3">{combo.description}</p>
                <div className="space-y-1 text-xs">
                  <div className="text-blue-400">{techStacks.frontend.find(t => t.id === combo.stack.frontend)?.name}</div>
                  <div className="text-green-400">{techStacks.backend.find(t => t.id === combo.stack.backend)?.name}</div>
                  <div className="text-yellow-400">{techStacks.database.find(t => t.id === combo.stack.database)?.name}</div>
                  <div className="text-purple-400">{techStacks.aiService.find(t => t.id === combo.stack.aiService)?.name}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Stack Summary */}
      {Object.keys(selectedStack).length > 0 && (
        <div className="p-6 bg-gray-950/50 border border-gray-800 rounded-lg">
          <h3 className="text-lg font-semibold mb-4">Your Selected Stack</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
            {Object.entries(selectedStack).map(([category, techId]) => {
              if (!techId) return null
              const tech = techStacks[category as keyof typeof techStacks]?.find(t => t.id === techId)
              if (!tech) return null
              
              return (
                <div key={category} className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-orange-400 rounded-full" />
                  <span className="text-gray-400 capitalize">
                    {category === 'aiService' ? 'AI Service' : category}:
                  </span>
                  <span className="font-medium">{tech.name}</span>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* Custom Selection */}
      <div className="space-y-8">
        {Object.entries(techStacks).map(([category, options]) => (
          <div key={category}>
            <div className="flex items-center gap-3 mb-4">
              <h3 className="text-lg font-semibold capitalize">
                {category === 'aiService' ? 'AI Service' : category}
              </h3>
              {getSelectedTechName(category as keyof typeof techStacks) && (
                <div className="flex items-center gap-2 px-3 py-1 bg-orange-500/20 rounded-full">
                  <CheckIcon className="w-4 h-4 text-orange-400" />
                  <span className="text-sm text-orange-400">
                    {getSelectedTechName(category as keyof typeof techStacks)}
                  </span>
                </div>
              )}
              
              {stackSuggestions?.aiRecommendations?.[category] && 
               !selectedStack[category as keyof typeof selectedStack] && (
                <div className="flex items-center gap-2 px-3 py-1 bg-purple-500/20 rounded-full">
                  <MagicWandIcon className="w-4 h-4 text-purple-400" />
                  <span className="text-sm text-purple-400">
                    {isAITemplate(projectData.template) ? 'AI Pick' : 'Recommended'}: {techStacks[category as keyof typeof techStacks]?.find(t => t.id === stackSuggestions.aiRecommendations[category])?.name}
                  </span>
                </div>
              )}
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {options.map((tech) => (
                <div
                  key={tech.id}
                  onClick={() => {
                    console.log('Tech clicked:', tech.id, 'category:', category)
                    selectTech(category as keyof typeof techStacks, tech.id)
                  }}
                  className={(() => {
                    const isSelected = selectedStack[category as keyof typeof selectedStack] === tech.id
                    const isAIRecommended = stackSuggestions?.aiRecommendations?.[category] === tech.id
                    const hasHighRelevance = tech.relevanceScore && tech.relevanceScore > 0.7
                    const categoryHasSelection = !!selectedStack[category as keyof typeof selectedStack]
                    
                    let className = 'w-full p-4 border rounded-lg cursor-pointer transition-colors select-none relative z-10 '
                    
                    if (isSelected) {
                      // Selected item - bright and prominent
                      className += 'border-orange-500 bg-orange-950/20'
                    } else if (categoryHasSelection) {
                      // Category has a selection but this isn't it - muted
                      className += 'border-gray-800/50 bg-gray-900/30 opacity-50 hover:opacity-70 hover:border-gray-700/50'
                    } else if (isAIRecommended) {
                      // No selection yet, show AI recommendation
                      className += 'border-purple-500 bg-purple-950/20 hover:bg-purple-900/30'
                    } else {
                      // Default state - no selection in category
                      className += 'border-gray-800 hover:border-gray-600 hover:bg-gray-800/30'
                    }
                    
                    if (hasHighRelevance && !categoryHasSelection) {
                      className += ' ring-1 ring-blue-500/30'
                    }
                    
                    return className
                  })()}
                  role="button"
                  tabIndex={0}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <BrandLogo 
                        src={tech.logo}
                        alt={tech.name}
                        fallbackIcon={tech.fallbackIcon}
                        className="w-6 h-6"
                      />
                      <h4 className="font-semibold">{tech.name}</h4>
                    </div>
                    <div className="flex flex-col gap-1">
                      {stackSuggestions?.aiRecommendations?.[category] === tech.id && 
                       selectedStack[category as keyof typeof selectedStack] !== tech.id && (
                        <span className="px-2 py-1 text-xs rounded bg-purple-900/30 text-purple-400">
                          {isAITemplate(projectData.template) ? '🎯 AI Pick' : '⭐ Recommended'}
                        </span>
                      )}
                      <span className={`px-2 py-1 text-xs rounded ${
                        tech.difficulty === 'Beginner' 
                          ? 'bg-green-900/30 text-green-400'
                          : 'bg-yellow-900/30 text-yellow-400'
                      }`}>
                        {tech.difficulty}
                      </span>
                    </div>
                  </div>
                  <p className="text-sm text-gray-400">{tech.description}</p>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}