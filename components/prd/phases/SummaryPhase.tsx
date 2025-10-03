'use client'

import { usePRDStore } from '@/lib/stores/usePRDStore'
import { ConfirmButtons } from '../ConfirmButtons'

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
    setPhase
  } = usePRDStore()

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
        <div className="flex gap-2">
          <span className="text-gray-400 min-w-28">Stack:</span>
          <span className="text-white font-medium">V0 • Vercel • {dbChoice}</span>
        </div>
        <div className="flex gap-2">
          <span className="text-gray-400 min-w-28">Integrations:</span>
          <span className="text-white font-medium">{selectedIntegrations.join(', ') || '—'}</span>
        </div>
      </div>
      <ConfirmButtons
        onContinue={() => setPhase('outputs')}
        onMore={() => setPhase('features')}
        onNotQuite={() => setPhase('audience')}
      />
    </div>
  )
}

