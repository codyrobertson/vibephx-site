'use client'

import { useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { CheckIcon } from '@radix-ui/react-icons'
import { cn } from '@/lib/utils'
import { usePRDStore } from '@/lib/stores/usePRDStore'
import { getCachedLogoUrl } from '@/lib/logoCache'
import { integrations } from '@/lib/config/integrations'

export function IntegrationsPhase() {
  const { featuresMvp, selectedIntegrations, toggleIntegration, setPhase, selectedStack, dbChoice, name, saveToDatabase, addMessages } = usePRDStore()
  const integrationCards = (() => {
    const text = featuresMvp.join(' ').toLowerCase()
    const lcStack = (selectedStack || '').toLowerCase()
    const lcDb = (dbChoice || '').toLowerCase()
    const beginner = (name || '').toLowerCase().includes('beginner')

    // Filter integrations based on keywords and compatibility
    const matched = integrations.filter(integration => {
      // Hide if marked hideForBeginner and user is beginner
      if (integration.hideForBeginner && beginner) return false

      // Always show if marked showForBeginner and user is beginner
      if (integration.showForBeginner && beginner) return true

      // Check database compatibility
      if (integration.compatibleDb && lcDb) {
        const dbMatch = integration.compatibleDb.some(db => lcDb.includes(db.toLowerCase()))
        if (dbMatch) return true
      }

      // Check hosting compatibility
      if (integration.compatibleHosting && lcStack) {
        const hostMatch = integration.compatibleHosting.some(host => lcStack.includes(host.toLowerCase()))
        if (hostMatch) return true
      }

      // Check keyword matching
      return integration.keywords.some(keyword => text.includes(keyword.toLowerCase()))
    })

    // Deduplicate by category, keeping highest priority
    const byCategory: Record<string, typeof matched[0]> = {}
    for (const item of matched) {
      const existing = byCategory[item.category]
      if (!existing || item.priority < existing.priority) {
        byCategory[item.category] = item
      }
    }

    return Object.values(byCategory)
  })()

  return (
    <div className="mt-4 p-4 rounded-xl border border-gray-800 bg-gray-900/50 animate-in fade-in slide-in-from-bottom-4 duration-300">
      <div className="mb-4">
        <div className="text-white font-semibold text-lg mb-1">Integrations</div>
        <div className="text-gray-400 text-sm">Select the services you want to integrate</div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {integrationCards.map((it) => (
          <button
            key={it.id}
            className={cn(
              "text-left p-4 rounded-xl border transition-colors",
              selectedIntegrations.includes(it.id)
                ? "border-orange-500 bg-gray-900"
                : "border-gray-800 bg-gray-900/60 hover:border-orange-500 hover:bg-gray-900"
            )}
            onClick={() => toggleIntegration(it.id)}
          >
            <div className="flex items-start justify-between mb-2">
              <div className="flex items-center gap-2">
                <img
                  src={getCachedLogoUrl(it.logo, '20')}
                  alt=""
                  className="w-5 h-5 rounded-sm"
                />
                <div className="text-white font-medium text-sm">{it.title}</div>
              </div>
              {selectedIntegrations.includes(it.id) && <CheckIcon className="h-5 w-5 text-orange-500" />}
            </div>
            <div className="text-xs text-gray-400 line-clamp-3">{it.description}</div>
          </button>
        ))}
      </div>
      <div className="flex justify-end mt-3">
        <Button
          onClick={async () => {
            // Add integrations to conversation
            const integrationNames = integrationCards
              .filter(c => selectedIntegrations.includes(c.id))
              .map(c => c.title)

            addMessages([
              {
                id: crypto.randomUUID(),
                role: 'user',
                content: integrationNames.length > 0
                  ? `**Integrations:** ${integrationNames.join(', ')}`
                  : `No integrations needed for MVP`
              },
              {
                id: crypto.randomUUID(),
                role: 'assistant',
                content: integrationNames.length > 0
                  ? `Nice. We'll wire up **${integrationNames.join(', ')}** after the core MVP is working.`
                  : `Smart. Let's ship the core first, add integrations later if needed.`
              }
            ])

            try { await saveToDatabase() } catch {}
            setPhase('summary')
          }}
          disabled={integrationCards.length > 0 && selectedIntegrations.length === 0}
          className="bg-orange-500 hover:bg-orange-600"
        >
          Continue
        </Button>
      </div>
    </div>
  )
}

