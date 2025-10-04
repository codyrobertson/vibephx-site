'use client'

import { useState } from 'react'
import { ExternalLink, Code, Server, Layout, Database as DatabaseIcon, Link2 } from 'lucide-react'
import { getCachedLogoUrl } from '@/lib/logoCache'
import { getServiceLogoDomain } from '@/lib/content/logo-mapper'
import { getTechDetail, type TechDetail } from '@/lib/config/tech-stack-details'
import { TechStackSheet } from '@/components/prd/TechStackSheet'

interface TechStackItem {
  name: string
  description?: string
  url?: string
  logo?: string
}

interface TechStackDisplayProps {
  title: string
  items: TechStackItem[]
  className?: string
  categorized?: boolean
  chipView?: boolean // New prop for chip-based display
  projectId?: string // Pass to TechStackSheet for fetching cached details
}

interface TechCategory {
  id: string
  name: string
  description: string
  icon: any
  items: TechStackItem[]
}

// Categorize technologies
function categorizeTechStack(items: TechStackItem[]): TechCategory[] {
  const categories: TechCategory[] = [
    {
      id: 'editor',
      name: 'Editor',
      description: 'The development environment where code is written, debugged, and tested. Includes IDEs, text editors, and version control integration.',
      icon: Code,
      items: []
    },
    {
      id: 'frontend',
      name: 'Frontend',
      description: 'User interface layer presenting data and enabling interactions. Handles rendering, state management, and user experience design.',
      icon: Layout,
      items: []
    },
    {
      id: 'backend',
      name: 'Backend',
      description: 'Server-side logic handling business operations, authentication, API endpoints, and data processing. Manages application security and core functionality.',
      icon: Server,
      items: []
    },
    {
      id: 'database',
      name: 'Database',
      description: 'Persistent storage system organizing and managing application data. Ensures data integrity, relationships, and efficient retrieval.',
      icon: DatabaseIcon,
      items: []
    },
    {
      id: 'connection',
      name: 'Connection',
      description: 'Communication protocols and APIs linking components. Manages data flow, request routing, and system integration points.',
      icon: Link2,
      items: []
    }
  ]

  const editorKeywords = ['v0', 'cursor', 'vscode', 'visual studio', 'webstorm', 'intellij', 'github', 'git']
  const frontendKeywords = ['react', 'next.js', 'nextjs', 'vue', 'angular', 'svelte', 'tailwind', 'css', 'html']
  const backendKeywords = ['node', 'express', 'fastapi', 'django', 'flask', 'rails', 'laravel', 'spring']
  const databaseKeywords = ['neon', 'postgres', 'postgresql', 'mysql', 'mongodb', 'redis', 'supabase', 'firebase', 'planetscale']
  const connectionKeywords = ['api', 'graphql', 'rest', 'websocket', 'grpc', 'vercel', 'netlify', 'aws', 'cloudflare']

  items.forEach(item => {
    const nameLower = item.name.toLowerCase()

    if (editorKeywords.some(kw => nameLower.includes(kw))) {
      categories[0].items.push(item)
    } else if (frontendKeywords.some(kw => nameLower.includes(kw))) {
      categories[1].items.push(item)
    } else if (backendKeywords.some(kw => nameLower.includes(kw))) {
      categories[2].items.push(item)
    } else if (databaseKeywords.some(kw => nameLower.includes(kw))) {
      categories[3].items.push(item)
    } else if (connectionKeywords.some(kw => nameLower.includes(kw))) {
      categories[4].items.push(item)
    } else {
      // Default to backend if unclear
      categories[2].items.push(item)
    }
  })

  // Only return categories that have items
  return categories.filter(cat => cat.items.length > 0)
}

function TechStackItem({ item }: { item: TechStackItem }) {
  const logoDomain = getServiceLogoDomain(item.name) || item.logo
  const logoUrl = logoDomain ? getCachedLogoUrl(logoDomain, '32') : null

  return (
    <div className="flex items-start gap-4 p-4 rounded-lg border border-gray-800/50 bg-gray-900/20 hover:bg-gray-800/40 hover:border-gray-700 transition-all group">
      {/* Logo */}
      <div className="flex-shrink-0 w-10 h-10 flex items-center justify-center rounded-lg bg-gray-800/50 overflow-hidden">
        {logoUrl ? (
          <img
            src={logoUrl}
            alt={`${item.name} logo`}
            className="w-8 h-8 object-contain"
            loading="lazy"
            onError={(e) => {
              e.currentTarget.style.display = 'none'
              const parent = e.currentTarget.parentElement
              if (parent) {
                parent.innerHTML = `<span class="text-lg font-bold text-orange-500">${item.name.charAt(0)}</span>`
              }
            }}
          />
        ) : (
          <span className="text-lg font-bold text-orange-500">
            {item.name.charAt(0)}
          </span>
        )}
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-2">
          <h3 className="text-base font-semibold text-white">{item.name}</h3>
          {item.url && (
            <a
              href={item.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-500 hover:text-orange-500 transition-colors opacity-0 group-hover:opacity-100"
              title={`Visit ${item.name} website`}
            >
              <ExternalLink className="w-4 h-4" />
            </a>
          )}
        </div>
        {item.description && (
          <p className="text-sm text-gray-400 leading-relaxed">
            {item.description}
          </p>
        )}
      </div>
    </div>
  )
}

export function TechStackDisplay({ title, items, className = '', categorized = false, chipView = false, projectId }: TechStackDisplayProps) {
  const [selectedTech, setSelectedTech] = useState<TechDetail | null>(null)
  const [sheetOpen, setSheetOpen] = useState(false)

  if (!items || items.length === 0) return null

  const handleTechClick = (techName: string) => {
    const tech = getTechDetail(techName)
    if (tech) {
      setSelectedTech(tech)
      setSheetOpen(true)
    }
  }

  // Chip view - displays as mini cards with logos
  if (chipView) {
    const categories = categorizeTechStack(items)

    return (
      <>
        <div className={`rounded-xl border border-gray-800 bg-gray-900/30 ${className}`}>
          <div className="p-8 border-b border-gray-800">
            <h2 className="text-2xl font-semibold text-white">{title}</h2>
          </div>
          <div className="p-8 space-y-8">
            {categories.map(category => {
              const Icon = category.icon
              return (
                <div key={category.id} className="space-y-4">
                  {/* Category Header */}
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-10 h-10 flex items-center justify-center rounded-lg bg-orange-500/10 border border-orange-500/20">
                      <Icon className="w-5 h-5 text-orange-400" />
                    </div>
                    <div className="flex-1 pt-1">
                      <h3 className="text-base font-semibold text-white mb-1.5">{category.name}</h3>
                      <p className="text-sm text-gray-400 leading-relaxed">{category.description}</p>
                    </div>
                  </div>

                  {/* Category Items as Mini Cards */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pl-14">
                    {category.items.map((item, index) => {
                      const tech = getTechDetail(item.name)
                      const logoDomain = getServiceLogoDomain(item.name) || item.logo
                      const logoUrl = logoDomain ? getCachedLogoUrl(logoDomain, '32') : null

                      return (
                        <button
                          key={`${item.name}-${index}`}
                          onClick={() => tech && handleTechClick(item.name)}
                          className={`group flex items-start gap-3 p-4 rounded-lg border border-gray-800 bg-gray-900/50 hover:bg-gray-800 hover:border-orange-500 transition-all duration-200 text-left ${tech ? 'cursor-pointer' : 'cursor-default'}`}
                          title={tech ? `Click to learn more about ${item.name}` : item.name}
                        >
                          {logoUrl ? (
                            <div className="flex-shrink-0 w-10 h-10 flex items-center justify-center rounded-md bg-gray-800 border border-gray-700 group-hover:border-gray-600 transition-colors">
                              <img
                                src={logoUrl}
                                alt={item.name}
                                className="w-6 h-6 object-contain"
                                loading="lazy"
                                onError={(e) => {
                                  e.currentTarget.style.display = 'none'
                                  const parent = e.currentTarget.parentElement
                                  if (parent) {
                                    parent.innerHTML = `<div class="w-6 h-6 flex items-center justify-center text-orange-400 text-sm font-bold">${item.name.charAt(0)}</div>`
                                  }
                                }}
                              />
                            </div>
                          ) : (
                            <div className="w-10 h-10 rounded-md bg-gray-800 border border-gray-700 group-hover:border-gray-600 flex items-center justify-center flex-shrink-0 transition-colors">
                              <span className="text-orange-400 text-sm font-bold">{item.name.charAt(0)}</span>
                            </div>
                          )}
                          <div className="flex-1 min-w-0">
                            <div className="text-sm font-medium text-gray-200 group-hover:text-white transition-colors mb-1">
                              {item.name}
                            </div>
                            {tech?.description && (
                              <p className="text-xs text-gray-400 leading-relaxed line-clamp-2">
                                {tech.description}
                              </p>
                            )}
                          </div>
                        </button>
                      )
                    })}
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Tech Stack Detail Sheet */}
        <TechStackSheet
          open={sheetOpen}
          onOpenChange={setSheetOpen}
          tech={selectedTech}
          projectId={projectId}
        />
      </>
    )
  }

  if (categorized) {
    const categories = categorizeTechStack(items)

    return (
      <div className={`rounded-xl border border-gray-800 bg-gray-900/30 p-8 ${className}`}>
        <h2 className="text-2xl font-semibold text-white mb-8">{title}</h2>
        <div className="space-y-8">
          {categories.map(category => {
            const Icon = category.icon
            return (
              <div key={category.id} className="space-y-4">
                {/* Category Header */}
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-10 h-10 flex items-center justify-center rounded-lg bg-orange-500/10 border border-orange-500/20">
                    <Icon className="w-5 h-5 text-orange-500" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-white mb-1">{category.name}</h3>
                    <p className="text-sm text-gray-400 leading-relaxed">{category.description}</p>
                  </div>
                </div>

                {/* Category Items */}
                <div className="space-y-3 ml-13">
                  {category.items.map((item, index) => (
                    <TechStackItem key={`${item.name}-${index}`} item={item} />
                  ))}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    )
  }

  // Original flat display
  return (
    <div className={`rounded-xl border border-gray-800 bg-gray-900/30 p-8 ${className}`}>
      <h2 className="text-2xl font-semibold text-white mb-6">{title}</h2>
      <div className="space-y-4">
        {items.map((item, index) => (
          <TechStackItem key={`${item.name}-${index}`} item={item} />
        ))}
      </div>
    </div>
  )
}
