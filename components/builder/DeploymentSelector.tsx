'use client'

import { useState, useEffect } from 'react'
import { CheckIcon, GlobeIcon, RocketIcon, LightningBoltIcon } from '@radix-ui/react-icons'
import { Card, CardIcon, CardBadge, CardHeader, CardTitle, CardDescription, CardMeta } from '@/components/ui/Card'
import BrandLogo from '../ui/BrandLogo'
import type { ProjectData } from './BuilderWizard'

// Helper functions for stack logos and names
function getStackLogo(stackId: string): string {
  const logoMap: Record<string, string> = {
    'nextjs': 'https://img.logo.dev/nextjs.org?token=pk_cJ_vQ1nNRM6nbN75WsWP3Q&size=32&format=png',
    'react': 'https://img.logo.dev/react.dev?token=pk_cJ_vQ1nNRM6nbN75WsWP3Q&size=32&format=png',
    'vue': 'https://img.logo.dev/vuejs.org?token=pk_cJ_vQ1nNRM6nbN75WsWP3Q&size=32&format=png',
    'svelte': 'https://img.logo.dev/svelte.dev?token=pk_cJ_vQ1nNRM6nbN75WsWP3Q&size=32&format=png',
    'nodejs': 'https://img.logo.dev/nodejs.org?token=pk_cJ_vQ1nNRM6nbN75WsWP3Q&size=32&format=png',
    'nextjs-api': 'https://img.logo.dev/nextjs.org?token=pk_cJ_vQ1nNRM6nbN75WsWP3Q&size=32&format=png',
    'serverless': 'https://img.logo.dev/vercel.com?token=pk_cJ_vQ1nNRM6nbN75WsWP3Q&size=32&format=png',
    'python': 'https://img.logo.dev/python.org?token=pk_cJ_vQ1nNRM6nbN75WsWP3Q&size=32&format=png',
    'supabase': 'https://img.logo.dev/supabase.com?token=pk_cJ_vQ1nNRM6nbN75WsWP3Q&size=32&format=png',
    'planetscale': 'https://img.logo.dev/planetscale.com?token=pk_cJ_vQ1nNRM6nbN75WsWP3Q&size=32&format=png',
    'mongodb': 'https://img.logo.dev/mongodb.com?token=pk_cJ_vQ1nNRM6nbN75WsWP3Q&size=32&format=png',
    'postgresql': 'https://img.logo.dev/postgresql.org?token=pk_cJ_vQ1nNRM6nbN75WsWP3Q&size=32&format=png',
    'openai': 'https://img.logo.dev/openai.com?token=pk_cJ_vQ1nNRM6nbN75WsWP3Q&size=32&format=png',
    'anthropic': 'https://img.logo.dev/anthropic.com?token=pk_cJ_vQ1nNRM6nbN75WsWP3Q&size=32&format=png',
    'openrouter': 'https://img.logo.dev/openrouter.ai?token=pk_cJ_vQ1nNRM6nbN75WsWP3Q&size=32&format=png'
  }
  return logoMap[stackId] || ''
}

function getStackName(stackId: string): string {
  const nameMap: Record<string, string> = {
    'nextjs': 'Next.js',
    'react': 'React',
    'vue': 'Vue.js',
    'svelte': 'Svelte',
    'nodejs': 'Node.js',
    'nextjs-api': 'Next.js API',
    'serverless': 'Serverless',
    'python': 'Python',
    'supabase': 'Supabase',
    'planetscale': 'PlanetScale',
    'mongodb': 'MongoDB',
    'postgresql': 'PostgreSQL',
    'openai': 'OpenAI',
    'anthropic': 'Anthropic',
    'openrouter': 'OpenRouter'
  }
  return nameMap[stackId] || stackId
}

const DEPLOYMENT_PLATFORMS = [
  {
    id: 'vercel',
    name: 'Vercel',
    description: 'Zero-config deployment for Next.js apps',
    icon: RocketIcon,
    logo: 'https://img.logo.dev/vercel.com?token=pk_cJ_vQ1nNRM6nbN75WsWP3Q&size=32&format=png',
    features: ['Instant deployments', 'Built-in analytics', 'Edge functions', 'Custom domains'],
    pricing: 'Free tier available',
    bestFor: ['Next.js apps', 'Frontend projects', 'Serverless functions'],
    difficulty: 'Beginner',
    setupTime: '2 minutes'
  },
  {
    id: 'netlify',
    name: 'Netlify',
    description: 'All-in-one platform for modern web projects',
    icon: GlobeIcon,
    logo: 'https://img.logo.dev/netlify.com?token=pk_cJ_vQ1nNRM6nbN75WsWP3Q&size=32&format=png',
    features: ['Form handling', 'Split testing', 'Identity service', 'Edge functions'],
    pricing: 'Free tier available',
    bestFor: ['Static sites', 'JAMstack apps', 'Form-heavy sites'],
    difficulty: 'Beginner',
    setupTime: '3 minutes'
  },
  {
    id: 'cloudflare',
    name: 'Cloudflare Pages',
    description: 'Lightning-fast static site hosting',
    icon: LightningBoltIcon,
    logo: 'https://img.logo.dev/cloudflare.com?token=pk_cJ_vQ1nNRM6nbN75WsWP3Q&size=32&format=png',
    features: ['Global CDN', 'Workers integration', 'Analytics', 'Custom domains'],
    pricing: 'Free tier available',
    bestFor: ['Static sites', 'High-traffic apps', 'Global deployment'],
    difficulty: 'Intermediate',
    setupTime: '5 minutes'
  },
  {
    id: 'railway',
    name: 'Railway',
    description: 'Deploy anything, instantly',
    icon: RocketIcon,
    logo: 'https://img.logo.dev/railway.app?token=pk_cJ_vQ1nNRM6nbN75WsWP3Q&size=32&format=png',
    features: ['Database hosting', 'Auto-scaling', 'Monitoring', 'Custom domains'],
    pricing: 'Usage-based pricing',
    bestFor: ['Full-stack apps', 'Database apps', 'Dockerized apps'],
    difficulty: 'Intermediate',
    setupTime: '5 minutes'
  }
]

interface DeploymentSelectorProps {
  projectData: ProjectData
  updateProjectData: (updates: Partial<ProjectData>) => void
}

export default function DeploymentSelector({ projectData, updateProjectData }: DeploymentSelectorProps) {
  const [selectedPlatform, setSelectedPlatform] = useState<string>(projectData.deployment.platform || '')

  useEffect(() => {
    updateProjectData({ 
      deployment: { ...projectData.deployment, platform: selectedPlatform }
    })
  }, [selectedPlatform, updateProjectData])

  const selectPlatform = (platformId: string) => {
    setSelectedPlatform(platformId)
  }

  const getRecommendedPlatform = () => {
    const { frontend, backend } = projectData.stack

    if (frontend === 'nextjs' && (backend === 'nextjs-api' || backend === 'serverless')) {
      return 'vercel'
    }
    if (frontend === 'react' && backend === 'serverless') {
      return 'netlify'
    }
    if (backend === 'nodejs' || backend === 'python') {
      return 'railway'
    }
    return 'vercel' // default
  }

  const recommendedPlatformId = getRecommendedPlatform()

  return (
    <div className="space-y-8">
      {/* AI Recommendation */}
      <div className="p-6 bg-gradient-to-r from-blue-950/20 to-purple-950/20 border border-blue-800/30 rounded-lg">
        <div className="flex items-start gap-6">
          <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
            <RocketIcon className="w-8 h-8 text-blue-400" />
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-bold mb-2">AI Recommendation</h3>
            <p className="text-gray-300 mb-4">
              Based on your tech stack, we recommend <span className="text-blue-400 font-semibold">
                {DEPLOYMENT_PLATFORMS.find(p => p.id === recommendedPlatformId)?.name}
              </span> for optimal performance and ease of deployment.
            </p>

            {/* Tech Stack Visual */}
            <div className="mb-4">
              <h4 className="text-sm font-medium text-gray-400 mb-3">Your Stack + Recommended Deployment:</h4>
              <div className="flex items-center gap-4">
                {/* Frontend Logo */}
                {projectData.stack.frontend && (
                  <div className="flex flex-col items-center gap-1">
                    <BrandLogo 
                      src={getStackLogo(projectData.stack.frontend)}
                      alt={getStackName(projectData.stack.frontend)}
                      fallbackIcon={GlobeIcon}
                      className="w-12 h-12"
                      size={48}
                    />
                    <span className="text-xs text-gray-400 text-center">
                      {getStackName(projectData.stack.frontend)}
                    </span>
                  </div>
                )}

                <div className="text-gray-500 text-xl">+</div>

                {/* Backend Logo */}
                {projectData.stack.backend && (
                  <div className="flex flex-col items-center gap-1">
                    <BrandLogo 
                      src={getStackLogo(projectData.stack.backend)}
                      alt={getStackName(projectData.stack.backend)}
                      fallbackIcon={LightningBoltIcon}
                      className="w-12 h-12"
                      size={48}
                    />
                    <span className="text-xs text-gray-400 text-center">
                      {getStackName(projectData.stack.backend)}
                    </span>
                  </div>
                )}

                <div className="text-blue-400 text-2xl">→</div>

                {/* Recommended Deployment Logo */}
                <div className="flex flex-col items-center gap-1 px-3 py-2 bg-blue-500/10 border border-blue-500/30 rounded-lg">
                  <BrandLogo 
                    src={DEPLOYMENT_PLATFORMS.find(p => p.id === recommendedPlatformId)?.logo || ''}
                    alt={DEPLOYMENT_PLATFORMS.find(p => p.id === recommendedPlatformId)?.name || ''}
                    fallbackIcon={RocketIcon}
                    className="w-12 h-12"
                    size={48}
                  />
                  <span className="text-xs font-medium text-blue-400 text-center">
                    {DEPLOYMENT_PLATFORMS.find(p => p.id === recommendedPlatformId)?.name}
                  </span>
                </div>
              </div>
            </div>

            {!selectedPlatform && (
              <button
                onClick={() => selectPlatform(recommendedPlatformId)}
                className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-black font-semibold rounded-lg transition-colors"
              >
                Use Recommendation
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Platform Selection */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
        {DEPLOYMENT_PLATFORMS.map((platform) => {
          const IconComponent = platform.icon
          const isRecommended = platform.id === recommendedPlatformId
          const isSelected = selectedPlatform === platform.id
          
          let cardState: 'default' | 'selected' | 'recommended' = 'default'
          let cardClassName = ''
          
          if (isSelected) {
            cardState = 'selected'
          } else if (isRecommended) {
            cardState = 'recommended'
            cardClassName = 'ring-2 ring-blue-500/30'
          }

          return (
            <div key={platform.id} className="relative">
              {isRecommended && (
                <div className="absolute -top-3 left-4 px-3 py-1 bg-blue-500 text-black text-xs font-bold rounded-full z-20">
                  RECOMMENDED
                </div>
              )}
              
              <Card
                background="code"
                overlay="code"
                state={cardState}
                interactive="clickable"
                size="lg"
                onClick={() => {
                  console.log('Platform clicked:', platform.id)
                  selectPlatform(platform.id)
                }}
                role="button"
                tabIndex={0}
                className={`transition-all duration-200 ${cardClassName}`}
              >
                <CardHeader>
                  <CardIcon color="orange">
                    <BrandLogo 
                      src={platform.logo}
                      alt={platform.name}
                      fallbackIcon={platform.icon}
                      className="w-full h-full"
                    />
                  </CardIcon>
                  
                  <div className="flex items-center gap-2">
                    {isSelected && (
                      <div className="w-6 h-6 bg-orange-500 rounded-full flex items-center justify-center">
                        <CheckIcon className="w-4 h-4 text-black" />
                      </div>
                    )}
                    <CardBadge
                      variant={platform.difficulty === 'Beginner' ? 'success' : 'warning'}
                    >
                      {platform.difficulty}
                    </CardBadge>
                  </div>
                </CardHeader>

                <div className="space-y-4">
                  <CardTitle size="xl">{platform.name}</CardTitle>
                  <CardDescription>{platform.description}</CardDescription>

                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-500">Setup time:</span>
                      <span className="text-orange-400">{platform.setupTime}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-500">Pricing:</span>
                      <span className="text-green-400">{platform.pricing}</span>
                    </div>
                  </div>

                  <div>
                    <h4 className="text-sm font-semibold mb-2 text-gray-300">Key Features:</h4>
                    <div className="flex flex-wrap gap-1">
                      {platform.features.slice(0, 3).map((feature, i) => (
                        <span key={i} className="px-2 py-1 bg-gray-800 rounded text-xs text-gray-300">
                          {feature}
                        </span>
                      ))}
                      {platform.features.length > 3 && (
                        <span className="text-xs text-gray-500">+{platform.features.length - 3} more</span>
                      )}
                    </div>
                  </div>

                  <div>
                    <h4 className="text-sm font-semibold mb-2 text-gray-300">Best for:</h4>
                    <div className="flex flex-wrap gap-1">
                      {platform.bestFor.map((use, i) => (
                        <span key={i} className="px-2 py-1 bg-orange-500/20 text-orange-400 rounded text-xs">
                          {use}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </Card>
            </div>
          )
        })}
      </div>

      {/* Deployment Summary */}
      {selectedPlatform && (
        <div className="p-6 bg-gray-950/50 border border-gray-800 rounded-lg">
          <div className="flex items-start gap-4">
            <CheckIcon className="w-6 h-6 text-green-400 flex-shrink-0 mt-1" />
            <div>
              <h3 className="text-lg font-semibold mb-2">Deployment Plan</h3>
              <p className="text-gray-300 mb-4">
                Your app will be deployed to <span className="text-orange-400 font-semibold">
                  {DEPLOYMENT_PLATFORMS.find(p => p.id === selectedPlatform)?.name}
                </span>. 
                The generated build guide will include step-by-step deployment instructions.
              </p>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-400 rounded-full" />
                  <span className="text-gray-400">Platform:</span>
                  <span className="font-medium">
                    {DEPLOYMENT_PLATFORMS.find(p => p.id === selectedPlatform)?.name}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-blue-400 rounded-full" />
                  <span className="text-gray-400">Setup:</span>
                  <span className="font-medium">
                    {DEPLOYMENT_PLATFORMS.find(p => p.id === selectedPlatform)?.setupTime}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-purple-400 rounded-full" />
                  <span className="text-gray-400">Cost:</span>
                  <span className="font-medium">
                    {DEPLOYMENT_PLATFORMS.find(p => p.id === selectedPlatform)?.pricing}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}