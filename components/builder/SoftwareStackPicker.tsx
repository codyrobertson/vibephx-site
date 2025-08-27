'use client'

import { useState, useEffect } from 'react'
import { CheckIcon, MagicWandIcon, ComponentInstanceIcon, TableIcon, GlobeIcon, LightningBoltIcon, ReloadIcon } from '@radix-ui/react-icons'
import { Card, CardIcon, CardBadge, CardHeader, CardTitle, CardDescription, CardMeta } from '@/components/ui/Card'
import BrandLogo from '../ui/BrandLogo'
import { getRelevantStackOptions, getAIRecommendation, TEMPLATE_STACK_MAPPINGS, type StackItem } from '@/lib/stackDatabase'
import type { ProjectData } from './BuilderWizard'

// Remove duplicate StackItem interface - using the one from stackDatabase

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
      logo: '',
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
  const [techStacks, setTechStacks] = useState<Record<string, StackItem[]>>(FALLBACK_TECH_STACKS)
  const [hasUserAppliedAI, setHasUserAppliedAI] = useState(false)

  // Simplified mounting - reduce console noise and re-renders

  // Reset selections when template/idea changes
  useEffect(() => {
    // Clear selections for fresh start
    setSelectedStack({})
    setHasUserAppliedAI(false)
  }, [projectData.template, projectData.customIdea])

  // Define which templates should get AI recommendations
  const isAITemplate = (templateId: string | undefined) => {
    const aiTemplates = ['ai-lead-scorer'] // Only templates that explicitly need AI
    return templateId ? aiTemplates.includes(templateId) : false
  }

  // Load intelligent stack suggestions instantly using local cache
  useEffect(() => {
    const loadStackSuggestions = () => {
      if (!projectData.template && !projectData.customIdea) {
        setTechStacks(FALLBACK_TECH_STACKS)
        setStackSuggestions(null)
        return
      }

      // Get relevant options for each stack type using cached data
      const suggestions = {
        frontend: getRelevantStackOptions(projectData.template, projectData.customIdea, 'frontend'),
        backend: getRelevantStackOptions(projectData.template, projectData.customIdea, 'backend'),
        database: getRelevantStackOptions(projectData.template, projectData.customIdea, 'database'),
        aiService: getRelevantStackOptions(projectData.template, projectData.customIdea, 'aiService')
      }
      
      // Get AI recommendations
      const aiRecommendations = getAIRecommendation(projectData.template, projectData.customIdea)
      
      // Get template info
      const templateInfo = projectData.template && TEMPLATE_STACK_MAPPINGS[projectData.template] 
        ? TEMPLATE_STACK_MAPPINGS[projectData.template]
        : null
      
      const stackSuggestions: StackSuggestions = {
        suggestions,
        aiRecommendations,
        templateInfo,
        reasoning: projectData.template 
          ? `Optimized for ${templateInfo?.title || projectData.template} with emphasis on ${templateInfo?.requiredFeatures.join(', ') || 'core features'}.`
          : 'Custom recommendations based on your idea'
      }
      
      setStackSuggestions(stackSuggestions)
      setTechStacks(suggestions)
      
      // Store AI recommendations in project data so wizard can allow auto-continue
      updateProjectData({ aiRecommendations: aiRecommendations })
    }

    loadStackSuggestions()
  }, [projectData.template, projectData.customIdea])

  useEffect(() => {
    updateProjectData({ stack: selectedStack })
  }, [selectedStack])

  // Sync with project data changes
  useEffect(() => {
    // Sync local selection state with project data
    if (hasUserAppliedAI && projectData.stack && Object.keys(projectData.stack).length > 0) {
      setSelectedStack(projectData.stack)
    }
  }, [projectData.stack, hasUserAppliedAI])

  const selectTech = (category: keyof typeof techStacks, techId: string) => {
    setSelectedStack(prev => ({ ...prev, [category]: techId }))
    setHasUserAppliedAI(true)
    setShowRecommendations(false)
  }

  const applyAIRecommendations = () => {
    if (stackSuggestions?.aiRecommendations) {
      setSelectedStack(stackSuggestions.aiRecommendations)
      setHasUserAppliedAI(true)
      setShowRecommendations(false)
    }
  }

  const applyRecommendedCombo = (combo: typeof RECOMMENDED_COMBOS[0]) => {
    setSelectedStack(combo.stack)
    setHasUserAppliedAI(true)
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
              <MagicWandIcon className="w-6 h-6 text-purple-400" />
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
          
          {stackSuggestions?.templateInfo && (
            <div className="mb-3 text-xs">
              <span className="text-gray-400 mr-2">Optimized for:</span>
              {stackSuggestions.templateInfo.requiredFeatures.map((feature, idx) => (
                <span key={idx} className="inline-block px-2 py-1 bg-green-900/30 text-green-400 rounded mr-1 mb-1">
                  {feature}
                </span>
              ))}
            </div>
          )}
          
          {!stackSuggestions && (
            <p className="text-gray-400 mb-6">
              These proven combinations work well together and are optimized for one-day builds.
            </p>
          )}
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {RECOMMENDED_COMBOS.map((combo, index) => (
              <div
                key={index}
                onClick={() => applyRecommendedCombo(combo)}
                className="w-full p-4 border border-gray-700 rounded-lg cursor-pointer hover:border-purple-500/50 hover:bg-purple-900/10 transition-colors select-none relative z-10"
                role="button"
                tabIndex={0}
              >
                <div className="text-2xl mb-2">{combo.icon}</div>
                <h4 className="font-semibold mb-1">{combo.name}</h4>
                <p className="text-xs text-gray-400">{combo.description}</p>
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
              {options.map((tech) => {
                const isSelected = selectedStack[category as keyof typeof selectedStack] === tech.id
                const isAIRecommended = stackSuggestions?.aiRecommendations?.[category] === tech.id
                const hasHighRelevance = tech.relevanceScore && tech.relevanceScore > 0.7
                const categoryHasSelection = !!selectedStack[category as keyof typeof selectedStack]
                
                // Determine card state based on selection and recommendation status
                let cardState: 'default' | 'selected' | 'recommended' | 'muted' = 'default'
                let cardClassName = ''
                
                if (isSelected) {
                  cardState = 'selected'
                } else if (categoryHasSelection) {
                  cardState = 'muted'
                  cardClassName = 'opacity-50 hover:opacity-70'
                } else if (isAIRecommended) {
                  cardState = 'recommended'
                }
                
                if (hasHighRelevance && !categoryHasSelection) {
                  cardClassName += ' ring-1 ring-blue-500/30'
                }
                
                return (
                  <Card
                    key={tech.id}
                    background="code"
                    overlay="code"
                    state={cardState}
                    interactive="clickable"
                    size="md"
                    onClick={() => selectTech(category as keyof typeof techStacks, tech.id)}
                    role="button"
                    tabIndex={0}
                    className={`transition-all duration-200 ${cardClassName}`}
                  >
                    <CardHeader>
                      <div className="flex items-center gap-3">
                        <BrandLogo 
                          src={tech.logo}
                          alt={tech.name}
                          fallbackIcon={tech.fallbackIcon}
                          className="w-6 h-6"
                        />
                        <CardTitle size="base">{tech.name}</CardTitle>
                      </div>
                      
                      <div className="flex flex-col gap-1">
                        {stackSuggestions?.aiRecommendations?.[category] === tech.id && 
                         selectedStack[category as keyof typeof selectedStack] !== tech.id && (
                          <span className="px-2 py-1 text-xs rounded bg-purple-900/30 text-purple-400">
                            {isAITemplate(projectData.template) ? '🎯 AI Pick' : '⭐ Recommended'}
                          </span>
                        )}
                        <CardBadge
                          variant={tech.difficulty === 'Beginner' ? 'success' : 'warning'}
                        >
                          {tech.difficulty}
                        </CardBadge>
                      </div>
                    </CardHeader>
                    
                    <CardDescription color="gray">{tech.description}</CardDescription>
                  </Card>
                )
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}