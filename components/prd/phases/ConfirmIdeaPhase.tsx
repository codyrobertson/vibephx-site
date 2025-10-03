'use client'

import { usePRDStore } from '@/lib/stores/usePRDStore'
import { ConfirmButtons } from '../ConfirmButtons'

export function ConfirmIdeaPhase() {
  const { sda, initialIntent, audience, motivation, setPhase, addMessages } = usePRDStore()

  return (
    <div className="mt-4 p-4 rounded-xl border border-gray-800 bg-gray-900">
      <div className="text-white font-medium mb-2">Check we're aligned</div>
      <div className="text-gray-300 text-sm">
        App: <span className="font-medium text-white">{sda || initialIntent}</span><br />
        Audience: <span className="font-medium text-white">{audience || '—'}</span><br />
        Why now: <span className="font-medium text-white">{motivation || '—'}</span>
      </div>
      <ConfirmButtons
        onContinue={() => {
          addMessages([
            {
              id: crypto.randomUUID(),
              role: 'user',
              content: "Yes, that's exactly right. Let's continue."
            },
            {
              id: crypto.randomUUID(),
              role: 'assistant',
              content: "Great. Let's lock the MVP features (just the essentials for today)."
            }
          ])
          setPhase('features')
        }}
        onMore={() => setPhase('audience')}
        onNotQuite={() => setPhase('audience')}
      />
    </div>
  )
}

