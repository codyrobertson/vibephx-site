'use client'

import { useState } from 'react'
import { usePRDStore } from '@/lib/stores/usePRDStore'
import { ConfirmButtons } from '../ConfirmButtons'
import { TechStackSheet } from '../TechStackSheet'
import { getTechDetail, type TechDetail } from '@/lib/config/tech-stack-details'
import { getCachedLogoUrl } from '@/lib/logoCache'

export function SummaryPhase() {
  const {
    sda,
    initialIntent,
    audience,
    motivation,
    featuresMvp,
    featuresStretch,
    dbChoice,
    selectedIntegrations,
    selectedStack,
    setPhase,
    addMessages
  } = usePRDStore()

  const [selectedTech, setSelectedTech] = useState<TechDetail | null>(null)
  const [sheetOpen, setSheetOpen] = useState(false)

  // Parse the selectedStack string to extract technologies
  // Format: "V0 • Shadcn UI • Vercel" or similar
  const stackItems = selectedStack
    ? selectedStack.split('•').map(item => item.trim()).filter(Boolean)
    : []

  const handleTechClick = (techName: string) => {
    const tech = getTechDetail(techName)
    if (tech) {
      setSelectedTech(tech)
      setSheetOpen(true)
    }
  }

  const handleIntegrationClick = (integrationName: string) => {
    const tech = getTechDetail(integrationName)
    if (tech) {
      setSelectedTech(tech)
      setSheetOpen(true)
    }
  }

  return (
    <div className="mt-4 p-4 rounded-xl border border-gray-800 bg-gray-900/60 animate-in fade-in slide-in-from-bottom-4 duration-300">
      <div className="mb-4">
        <div className="text-white font-semibold text-lg mb-1">Review Your PRD</div>
        <div className="text-gray-400 text-sm">Snapshot before we generate your final document</div>
      </div>
      <div className="space-y-2 text-sm">
        <div className="flex gap-2">
          <span className="text-gray-400 min-w-28">App:</span>
          <span className="text-white font-medium">{sda || initialIntent}</span>
        </div>
        <div className="flex gap-2">
          <span className="text-gray-400 min-w-28">Audience:</span>
          <span className="text-white font-medium">{audience}</span>
        </div>
        <div className="flex gap-2">
          <span className="text-gray-400 min-w-28">Why:</span>
          <span className="text-white font-medium">{motivation}</span>
        </div>
        <div className="flex gap-2">
          <span className="text-gray-400 min-w-28">MVP:</span>
          <span className="text-white font-medium">{featuresMvp.join(', ') || '—'}</span>
        </div>
        <div className="flex gap-2">
          <span className="text-gray-400 min-w-28">Stretch:</span>
          <span className="text-white font-medium">{featuresStretch.join(', ') || '—'}</span>
        </div>

        {/* Technology Stack - Interactive */}
        <div className="flex gap-2 items-start">
          <span className="text-gray-400 min-w-28">Stack:</span>
          <div className="flex flex-wrap gap-2">
            {stackItems.map((item, idx) => {
              const tech = getTechDetail(item)
              return (
                <button
                  key={idx}
                  onClick={() => handleTechClick(item)}
                  className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border border-gray-700 bg-gray-800/50 hover:bg-gray-800 hover:border-orange-500 transition-colors group"
                  title={`Click to learn more about ${item}`}
                >
                  {tech && (
                    <img
                      src={getCachedLogoUrl(tech.logo, '20')}
                      alt={item}
                      className="w-4 h-4 rounded-sm"
                    />
                  )}
                  <span className="text-white text-xs font-medium group-hover:text-orange-400 transition-colors">
                    {item}
                  </span>
                </button>
              )
            })}
            {dbChoice && !stackItems.some(item => item.toLowerCase().includes(dbChoice.toLowerCase())) && (
              <button
                onClick={() => handleTechClick(dbChoice)}
                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border border-gray-700 bg-gray-800/50 hover:bg-gray-800 hover:border-orange-500 transition-colors group"
                title={`Click to learn more about ${dbChoice}`}
              >
                {getTechDetail(dbChoice) && (
                  <img
                    src={getCachedLogoUrl(getTechDetail(dbChoice)!.logo, '20')}
                    alt={dbChoice}
                    className="w-4 h-4 rounded-sm"
                  />
                )}
                <span className="text-white text-xs font-medium group-hover:text-orange-400 transition-colors">
                  {dbChoice}
                </span>
              </button>
            )}
          </div>
        </div>

        {/* Integrations - Interactive */}
        <div className="flex gap-2 items-start">
          <span className="text-gray-400 min-w-28">Integrations:</span>
          <div className="flex flex-wrap gap-2">
            {selectedIntegrations.length > 0 ? (
              selectedIntegrations.map((integration, idx) => {
                const tech = getTechDetail(integration)
                return (
                  <button
                    key={idx}
                    onClick={() => handleIntegrationClick(integration)}
                    className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border border-gray-700 bg-gray-800/50 hover:bg-gray-800 hover:border-orange-500 transition-colors group"
                    title={`Click to learn more about ${integration}`}
                  >
                    {tech && (
                      <img
                        src={getCachedLogoUrl(tech.logo, '20')}
                        alt={integration}
                        className="w-4 h-4 rounded-sm"
                      />
                    )}
                    <span className="text-white text-xs font-medium group-hover:text-orange-400 transition-colors">
                      {integration}
                    </span>
                  </button>
                )
              })
            ) : (
              <span className="text-white font-medium text-xs">—</span>
            )}
          </div>
        </div>
      </div>

      <ConfirmButtons
        onContinue={() => {
          // Just transition to outputs phase - it will auto-generate
          setPhase('outputs')
        }}
        onMore={() => setPhase('features')}
        onNotQuite={() => setPhase('audience')}
      />

      {/* Tech Stack Detail Sheet */}
      <TechStackSheet
        open={sheetOpen}
        onOpenChange={setSheetOpen}
        tech={selectedTech}
      />
    </div>
  )
}

