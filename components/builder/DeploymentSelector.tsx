'use client'

import { useState, useEffect } from 'react'
import { CheckIcon, GlobeIcon, RocketIcon, LightningBoltIcon } from '@radix-ui/react-icons'
import BrandLogo from '../ui/BrandLogo'
import type { ProjectData } from './BuilderWizard'

const DEPLOYMENT_PLATFORMS = [
  {
    id: 'vercel',
    name: 'Vercel',
    description: 'Zero-config deployment for Next.js apps',
    icon: RocketIcon,
    logo: 'https://img.logo.dev/vercel.com?size=32&format=png',
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
    logo: 'https://img.logo.dev/netlify.com?size=32&format=png',
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
    logo: 'https://img.logo.dev/cloudflare.com?size=32&format=png',
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
    logo: 'https://img.logo.dev/railway.app?size=32&format=png',
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
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
            <RocketIcon className="w-8 h-8 text-blue-400" />
          </div>
          <div>
            <h3 className="text-lg font-bold mb-2">AI Recommendation</h3>
            <p className="text-gray-300 mb-4">
              Based on your tech stack ({projectData.stack.frontend} + {projectData.stack.backend}), 
              we recommend <span className="text-blue-400 font-semibold">
                {DEPLOYMENT_PLATFORMS.find(p => p.id === recommendedPlatformId)?.name}
              </span> for optimal performance and ease of deployment.
            </p>
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

          return (
            <div
              key={platform.id}
              onClick={() => {
                console.log('Platform clicked:', platform.id)
                selectPlatform(platform.id)
              }}
              className={`
                relative w-full p-4 md:p-6 border rounded-lg cursor-pointer transition-colors select-none z-10
                ${isSelected
                  ? 'border-orange-500 bg-orange-950/20'
                  : 'border-gray-800 hover:border-gray-600 hover:bg-gray-800/30'
                }
                ${isRecommended ? 'ring-2 ring-blue-500/30' : ''}
              `}
              role="button"
              tabIndex={0}
            >
              {isRecommended && (
                <div className="absolute -top-3 left-4 px-3 py-1 bg-blue-500 text-black text-xs font-bold rounded-full">
                  RECOMMENDED
                </div>
              )}

              <div className="flex items-start justify-between mb-4">
                <div className="w-12 h-12 bg-orange-500/20 rounded-lg flex items-center justify-center">
                  <BrandLogo 
                    src={platform.logo}
                    alt={platform.name}
                    fallbackIcon={platform.icon}
                    className="w-8 h-8"
                  />
                </div>
                <div className="flex items-center gap-2">
                  {isSelected && (
                    <div className="w-6 h-6 bg-orange-500 rounded-full flex items-center justify-center">
                      <CheckIcon className="w-4 h-4 text-black" />
                    </div>
                  )}
                  <span className={`px-2 py-1 text-xs rounded ${
                    platform.difficulty === 'Beginner'
                      ? 'bg-green-900/30 text-green-400'
                      : 'bg-yellow-900/30 text-yellow-400'
                  }`}>
                    {platform.difficulty}
                  </span>
                </div>
              </div>

              <h3 className="text-xl font-bold mb-2">{platform.name}</h3>
              <p className="text-gray-400 mb-4">{platform.description}</p>

              <div className="space-y-3 mb-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500">Setup time:</span>
                  <span className="text-orange-400">{platform.setupTime}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500">Pricing:</span>
                  <span className="text-green-400">{platform.pricing}</span>
                </div>
              </div>

              <div className="mb-4">
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