'use client'

import { useState, useEffect } from 'react'
import { ExternalLink, BookOpen, Lightbulb, Tag, Sparkles, Code2 } from 'lucide-react'
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from '@/components/ui/sheet'
import { Button } from '@/components/ui/button'
import type { TechDetail } from '@/lib/config/tech-stack-details'

interface BespokeTechDetail {
  whyWeChoseIt: string
  howItsUsed: string[]
  keyImplementationAreas: string[]
  projectBenefits: string[]
}

interface TechStackSheetProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  tech: TechDetail | null
  projectId?: string
}

export function TechStackSheet({ open, onOpenChange, tech, projectId }: TechStackSheetProps) {
  const [bespokeDetails, setBespokeDetails] = useState<BespokeTechDetail | null>(null)
  const [loading, setLoading] = useState(false)
  const [generating, setGenerating] = useState(false)

  // Fetch project-specific details when sheet opens
  useEffect(() => {
    if (!tech || !open || !projectId) {
      setBespokeDetails(null)
      return
    }

    let isMounted = true

    const fetchAndGenerate = async () => {
      setLoading(true)
      try {
        // First, try to fetch cached details
        const res = await fetch(`/api/projects/${projectId}/tech-details/${tech.id}`)
        if (res.ok) {
          const data = await res.json()
          if (data.bespoke && isMounted) {
            setBespokeDetails(data.bespoke)
            setLoading(false)
            return
          }
        }

        // No cached details - generate them
        if (!isMounted) return
        setLoading(false)
        setGenerating(true)

        const genRes = await fetch(`/api/projects/${projectId}/generate-tech-details`, {
          method: 'POST'
        })

        if (genRes.ok && isMounted) {
          // Refetch to get the generated details
          const detailsRes = await fetch(`/api/projects/${projectId}/tech-details/${tech.id}`)
          if (detailsRes.ok) {
            const data = await detailsRes.json()
            if (isMounted && data.bespoke) {
              setBespokeDetails(data.bespoke)
            }
          }
        }
      } catch (error) {
        console.error('Failed to fetch/generate tech details:', error)
      } finally {
        if (isMounted) {
          setLoading(false)
          setGenerating(false)
        }
      }
    }

    fetchAndGenerate()

    return () => {
      isMounted = false
    }
  }, [tech?.id, open, projectId])

  if (!tech) return null

  const categoryLabels: Record<typeof tech.category, string> = {
    editor: 'Development Tool',
    ui: 'UI Framework',
    hosting: 'Hosting Platform',
    database: 'Database',
    integration: 'Integration'
  }

  const categoryColors: Record<typeof tech.category, string> = {
    editor: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
    ui: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
    hosting: 'bg-green-500/10 text-green-400 border-green-500/20',
    database: 'bg-orange-500/10 text-orange-400 border-orange-500/20',
    integration: 'bg-pink-500/10 text-pink-400 border-pink-500/20'
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="border-gray-800 overflow-y-auto w-full sm:max-w-xl" style={{ backgroundColor: '#000000' }}>
        <SheetHeader className="space-y-4">
          {/* Logo and Title */}
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0">
              <img
                src={tech.logo}
                alt={tech.name}
                className="w-16 h-16 rounded-lg border border-gray-800 bg-gray-900 p-2"
              />
            </div>
            <div className="flex-1 min-w-0">
              <SheetTitle className="text-2xl font-bold text-white mb-1">
                {tech.name}
              </SheetTitle>
              <div className={`inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium border ${categoryColors[tech.category]}`}>
                {categoryLabels[tech.category]}
              </div>
            </div>
          </div>

          <SheetDescription className="text-gray-400 text-base leading-relaxed">
            {tech.description}
          </SheetDescription>
        </SheetHeader>

        {/* Content */}
        <div className="mt-6 space-y-6">
          {/* Loading State */}
          {(loading || generating) && projectId && (
            <div className="flex items-center justify-center py-8">
              <div className="flex items-center gap-3 text-gray-400">
                <div className="w-5 h-5 border-2 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
                <span className="text-sm">Generating project-specific details...</span>
              </div>
            </div>
          )}

          {/* Project-Specific Section */}
          {!loading && bespokeDetails && (
            <>
              {/* Why We Chose It */}
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <Sparkles className="w-4 h-4 text-orange-500" />
                  <h3 className="text-sm font-semibold text-white">Why We Chose It for This Project</h3>
                </div>
                <p className="text-sm text-gray-300 leading-relaxed bg-orange-500/5 border border-orange-500/20 rounded-lg p-3">
                  {bespokeDetails.whyWeChoseIt}
                </p>
              </div>

              {/* How It's Used in Your Codebase */}
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <Code2 className="w-4 h-4 text-orange-500" />
                  <h3 className="text-sm font-semibold text-white">How It's Used in Your Codebase</h3>
                </div>
                <ul className="space-y-2">
                  {bespokeDetails.howItsUsed.map((usage, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-sm text-gray-300">
                      <span className="text-orange-500 mt-0.5 flex-shrink-0">•</span>
                      <span className="leading-relaxed">{usage}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Key Implementation Areas */}
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <Lightbulb className="w-4 h-4 text-orange-500" />
                  <h3 className="text-sm font-semibold text-white">Key Implementation Areas</h3>
                </div>
                <ul className="space-y-2">
                  {bespokeDetails.keyImplementationAreas.map((area, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-sm text-gray-300">
                      <span className="text-orange-500 mt-0.5 flex-shrink-0">•</span>
                      <span className="leading-relaxed">{area}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Project Benefits */}
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <Tag className="w-4 h-4 text-orange-500" />
                  <h3 className="text-sm font-semibold text-white">Benefits for Your Project</h3>
                </div>
                <ul className="space-y-2">
                  {bespokeDetails.projectBenefits.map((benefit, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-sm text-gray-300">
                      <span className="text-orange-500 mt-0.5 flex-shrink-0">•</span>
                      <span className="leading-relaxed">{benefit}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </>
          )}

          {/* Fallback to Generic Content */}
          {!loading && !generating && !bespokeDetails && (
            <>
              {/* What It Is */}
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <BookOpen className="w-4 h-4 text-orange-500" />
                  <h3 className="text-sm font-semibold text-white">What It Is</h3>
                </div>
                <p className="text-sm text-gray-300 leading-relaxed">
                  {tech.whatItIs}
                </p>
              </div>

              {/* Generic How It's Used */}
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <Lightbulb className="w-4 h-4 text-orange-500" />
                  <h3 className="text-sm font-semibold text-white">Common Use Cases</h3>
                </div>
                <ul className="space-y-2">
                  {tech.howItsUsed.map((usage, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-sm text-gray-300">
                      <span className="text-orange-500 mt-0.5 flex-shrink-0">•</span>
                      <span className="leading-relaxed">{usage}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </>
          )}

          {/* Divider */}
          {bespokeDetails && (
            <div className="border-t border-gray-800 my-6"></div>
          )}

          {/* Documentation Links */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <ExternalLink className="w-4 h-4 text-orange-500" />
              <h3 className="text-sm font-semibold text-white">Documentation & Resources</h3>
            </div>
            <div className="space-y-2">
              {tech.links.map((link, idx) => (
                <a
                  key={idx}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 p-3 rounded-lg border border-gray-800 bg-gray-900/50 hover:bg-gray-900 hover:border-orange-500 transition-colors group"
                >
                  <ExternalLink className="w-4 h-4 text-gray-400 group-hover:text-orange-500 transition-colors flex-shrink-0" />
                  <span className="text-sm text-gray-300 group-hover:text-white transition-colors">
                    {link.label}
                  </span>
                </a>
              ))}
            </div>
          </div>

          {/* Footer CTA */}
          <div className="pt-4 border-t border-gray-800">
            <a
              href={tech.links[0]?.url}
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button
                className="w-full bg-orange-600 hover:bg-orange-500 text-white"
                size="lg"
              >
                <ExternalLink className="w-4 h-4 mr-2" />
                Open {tech.name} Documentation
              </Button>
            </a>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}
