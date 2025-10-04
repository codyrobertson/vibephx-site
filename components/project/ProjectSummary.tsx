'use client'

import { useState, useEffect } from 'react'
import { Response } from '@/components/ai-elements/response'
import { TechStackDisplay } from './TechStackDisplay'
import { integrations } from '@/lib/config/integrations'

interface ProjectSummaryProps {
  project: {
    id: string
    title: string
    generated?: any
  }
  session: {
    sda: string | null
    initialIntent: string
    featuresMvp: string[]
    selectedStack: string | null
    dbChoice: string | null
    integrations: string[]
  }
}

export function ProjectSummary({ project, session }: ProjectSummaryProps) {
  const [aiSummary, setAiSummary] = useState<string | null>(null)
  const [generating, setGenerating] = useState(false)

  useEffect(() => {
    // Check if summary already exists in generated field
    if (project.generated && typeof project.generated === 'object' && 'summary' in project.generated) {
      setAiSummary((project.generated as any).summary)
    } else {
      // Auto-generate summary on mount if it doesn't exist
      generateSummary()
    }
  }, [project.id])

  async function generateSummary() {
    setGenerating(true)
    try {
      const res = await fetch(`/api/projects/${project.id}/generate-summary`, {
        method: 'POST'
      })
      if (res.ok) {
        const data = await res.json()
        setAiSummary(data.summary)
      }
    } catch (err) {
      console.error('Failed to generate summary:', err)
    } finally {
      setGenerating(false)
    }
  }

  return (
    <div className="space-y-12">
      {/* AI Summary Section */}
      <div className="rounded-xl border border-gray-800 bg-gray-900/30 p-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-semibold text-white">AI Project Summary</h2>
          {!aiSummary && (
            <button
              onClick={generateSummary}
              disabled={generating}
              className="px-4 py-2 bg-orange-600 hover:bg-orange-500 text-white rounded-lg text-sm transition-colors disabled:opacity-50"
            >
              {generating ? 'Generating...' : 'Generate Summary'}
            </button>
          )}
        </div>
        {aiSummary ? (
          <div className="prose prose-invert max-w-none prose-headings:mb-4 prose-headings:mt-8 prose-p:mb-4 prose-p:leading-relaxed prose-ul:my-4 prose-li:my-2">
            <Response>{aiSummary}</Response>
          </div>
        ) : (
          <p className="text-gray-400 text-sm">
            No AI summary generated yet. Click "Generate Summary" to create one.
          </p>
        )}
      </div>

      {/* Project Overview */}
      <div className="rounded-xl border border-gray-800 bg-gray-900/30 p-8">
        <h2 className="text-2xl font-semibold text-white mb-6">Project Overview</h2>
        <div className="space-y-6">
          <div>
            <div className="text-sm font-medium text-gray-400 mb-3">Description</div>
            <p className="text-white leading-relaxed text-base">
              {session.sda || session.initialIntent}
            </p>
          </div>

          {session.featuresMvp && session.featuresMvp.length > 0 && (
            <div>
              <div className="text-sm font-medium text-gray-400 mb-3">MVP Features</div>
              <ul className="space-y-3">
                {session.featuresMvp.map((feature, i) => (
                  <li key={i} className="text-white text-base flex items-start gap-3">
                    <span className="text-orange-500 mt-0.5">□</span>
                    <span className="flex-1">{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>

      {/* Tech Stack */}
      {session.selectedStack ? (
        <TechStackDisplay
          title="Technology Stack"
          categorized={true}
          chipView={true}
          projectId={project.id}
          items={[
            // Parse selectedStack string (format: "V0 • Shadcn UI • Vercel")
            ...session.selectedStack.split('•').map(tech => tech.trim()).filter(Boolean).map(tech => ({
              name: tech,
              description: '',
              url: getStackUrl(tech)
            })),
            // Add database if not already in stack
            ...(session.dbChoice && !session.selectedStack.toLowerCase().includes(session.dbChoice.toLowerCase()) ? [{
              name: session.dbChoice,
              description: '',
              url: getStackUrl(session.dbChoice)
            }] : [])
          ]}
        />
      ) : (
        <div className="rounded-xl border border-gray-800 bg-gray-900/30 p-8">
          <h2 className="text-2xl font-semibold text-white mb-4">Technology Stack</h2>
          <p className="text-gray-400 text-sm">
            No technology stack specified. Complete the PRD builder to add your stack.
          </p>
        </div>
      )}

      {/* Integrations */}
      {session.integrations && session.integrations.length > 0 && (
        <TechStackDisplay
          title="Integrations"
          categorized={true}
          chipView={true}
          projectId={project.id}
          items={session.integrations.map(integrationId => {
            const integration = integrations.find(i => i.id === integrationId || i.title === integrationId)
            return {
              name: integration?.title || integrationId,
              description: integration?.description || '',
              url: integration?.logo ? `https://${integration.logo}` : undefined,
              logo: integration?.logo
            }
          })}
        />
      )}
    </div>
  )
}

// Helper function to get official URLs for common stacks
function getStackUrl(stackName: string): string | undefined {
  const urlMap: Record<string, string> = {
    'Next.js': 'https://nextjs.org',
    'React': 'https://react.dev',
    'Vue': 'https://vuejs.org',
    'Neon': 'https://neon.tech',
    'Supabase': 'https://supabase.com',
    'PostgreSQL': 'https://postgresql.org',
    'MongoDB': 'https://mongodb.com',
    'Vercel': 'https://vercel.com',
    'V0': 'https://v0.dev'
  }

  // Try exact match
  if (urlMap[stackName]) return urlMap[stackName]

  // Try case-insensitive match
  const lowerName = stackName.toLowerCase()
  for (const [key, value] of Object.entries(urlMap)) {
    if (key.toLowerCase() === lowerName) return value
  }

  return undefined
}
