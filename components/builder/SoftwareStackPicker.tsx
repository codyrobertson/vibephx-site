'use client'

import { useState, useEffect } from 'react'
import { CheckIcon, MagicWandIcon, ComponentInstanceIcon, TableIcon, GlobeIcon, LightningBoltIcon } from '@radix-ui/react-icons'
import BrandLogo from '../ui/BrandLogo'
import type { ProjectData } from './BuilderWizard'

const TECH_STACKS = {
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
      logo: 'https://img.logo.dev/reactjs.org?token=pk_cJ_vQ1nNRM6nbN75WsWP3Q&size=32&format=png',
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
      description: 'Deploy-ready cloud functions', 
      difficulty: 'Beginner', 
      popular: true,
      logo: 'https://img.logo.dev/aws.amazon.com?token=pk_cJ_vQ1nNRM6nbN75WsWP3Q&size=32&format=png',
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
  const [selectedStack, setSelectedStack] = useState(projectData.stack || {})
  const [showRecommendations, setShowRecommendations] = useState(true)

  useEffect(() => {
    updateProjectData({ stack: selectedStack })
  }, [selectedStack, updateProjectData])

  const selectTech = (category: keyof typeof TECH_STACKS, techId: string) => {
    setSelectedStack(prev => ({ ...prev, [category]: techId }))
    setShowRecommendations(false)
  }

  const applyRecommendedCombo = (combo: typeof RECOMMENDED_COMBOS[0]) => {
    setSelectedStack(combo.stack)
    setShowRecommendations(false)
  }

  const getSelectedTechName = (category: keyof typeof TECH_STACKS) => {
    const techId = selectedStack[category]
    if (!techId) return null
    const tech = TECH_STACKS[category].find(t => t.id === techId)
    return tech?.name || null
  }

  return (
    <div className="space-y-8">
      {showRecommendations && (
        <div className="bg-gradient-to-r from-purple-950/20 to-blue-950/20 border border-purple-800/30 rounded-lg p-6">
          <div className="flex items-center gap-3 mb-4">
            <MagicWandIcon className="w-6 h-6 text-purple-400" />
            <h3 className="text-xl font-bold">AI-Recommended Combinations</h3>
          </div>
          <p className="text-gray-400 mb-6">
            These proven combinations work well together and are optimized for one-day builds.
          </p>
          
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
                  <div className="text-blue-400">Frontend: {TECH_STACKS.frontend.find(t => t.id === combo.stack.frontend)?.name}</div>
                  <div className="text-green-400">Backend: {TECH_STACKS.backend.find(t => t.id === combo.stack.backend)?.name}</div>
                  <div className="text-yellow-400">Database: {TECH_STACKS.database.find(t => t.id === combo.stack.database)?.name}</div>
                  <div className="text-purple-400">AI: {TECH_STACKS.aiService.find(t => t.id === combo.stack.aiService)?.name}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Custom Selection */}
      <div className="space-y-8">
        {Object.entries(TECH_STACKS).map(([category, options]) => (
          <div key={category}>
            <div className="flex items-center gap-3 mb-4">
              <h3 className="text-lg font-semibold capitalize">
                {category === 'aiService' ? 'AI Service' : category}
              </h3>
              {getSelectedTechName(category as keyof typeof TECH_STACKS) && (
                <div className="flex items-center gap-2 px-3 py-1 bg-orange-500/20 rounded-full">
                  <CheckIcon className="w-4 h-4 text-orange-400" />
                  <span className="text-sm text-orange-400">
                    {getSelectedTechName(category as keyof typeof TECH_STACKS)}
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
                    selectTech(category as keyof typeof TECH_STACKS, tech.id)
                  }}
                  className={`
                    w-full p-4 border rounded-lg cursor-pointer transition-colors select-none relative z-10
                    ${selectedStack[category as keyof typeof selectedStack] === tech.id
                      ? 'border-orange-500 bg-orange-950/20'
                      : 'border-gray-800 hover:border-gray-600 hover:bg-gray-800/30'
                    }
                  `}
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
                    <div className="flex gap-1">
                      {tech.popular && (
                        <span className="px-2 py-1 bg-green-900/30 text-green-400 text-xs rounded">
                          Popular
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

      {/* Stack Summary */}
      {Object.keys(selectedStack).length > 0 && (
        <div className="p-6 bg-gray-950/50 border border-gray-800 rounded-lg">
          <h3 className="text-lg font-semibold mb-4">Your Selected Stack</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
            {Object.entries(selectedStack).map(([category, techId]) => {
              if (!techId) return null
              const tech = TECH_STACKS[category as keyof typeof TECH_STACKS].find(t => t.id === techId)
              return (
                <div key={category} className="flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full ${
                    category === 'frontend' ? 'bg-blue-400' :
                    category === 'backend' ? 'bg-green-400' :
                    category === 'database' ? 'bg-yellow-400' :
                    'bg-purple-400'
                  }`} />
                  <span className="capitalize text-gray-400">
                    {category === 'aiService' ? 'AI' : category}:
                  </span>
                  <span className="font-medium">{tech?.name}</span>
                </div>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}