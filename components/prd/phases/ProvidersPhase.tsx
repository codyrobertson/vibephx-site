'use client'

import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { usePRDStore } from '@/lib/stores/usePRDStore'
import { getCachedLogoUrl } from '@/lib/logoCache'

export function ProvidersPhase() {
  const { dbChoice, setDbChoice, setPhase, addMessages, selectedStack, setSelectedStack } = usePRDStore()
  const [uiChoices, setUiChoices] = useState<string[]>(['V0'])
  const [hostingChoice, setHostingChoice] = useState<string>('Vercel')

  useEffect(() => {
    if (selectedStack) {
      const low = selectedStack.toLowerCase()
      if (low.includes('v0') && !uiChoices.includes('V0')) setUiChoices((s) => [...s, 'V0'])
      if (low.includes('vercel')) setHostingChoice('Vercel')
    }
  }, [selectedStack])

  const handleContinue = () => {
    setSelectedStack(`${uiChoices.join(' + ')} • ${hostingChoice}`)
    addMessages([{
      id: crypto.randomUUID(),
      role: 'assistant',
      content: `Locked. Stack: ${uiChoices.join(' + ')} • ${hostingChoice} • ${dbChoice}`
    }])
    setPhase('integrations')
  }

  return (
    <div className="mt-4 p-4 rounded-xl border border-gray-800 bg-gray-900/50 animate-in fade-in slide-in-from-bottom-4 duration-300">
      <div className="mb-4">
        <div className="text-white font-semibold text-lg mb-1">Stack Selection</div>
        <div className="text-gray-400 text-sm">Opinionated choices for speed and simplicity</div>
      </div>
      <div className="space-y-6">
        {/* Tool */}
        <div>
          <div className="text-white font-medium mb-2 text-sm">Tool</div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <button className={`text-left p-4 rounded-xl border transition-colors flex items-center gap-3 border-orange-500 bg-gray-900`} disabled>
              <img src={getCachedLogoUrl('v0.dev','24')} alt="" className="w-6 h-6 rounded-sm" />
              <div className="text-white font-medium text-sm">V0 (selected)</div>
            </button>
          </div>
        </div>

        {/* UI (multi-select) */}
        <div>
          <div className="text-white font-medium mb-2 text-sm">Pick UI (multi-select)</div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {[
              { id: 'v0', label: 'V0', logo: getCachedLogoUrl('v0.dev', '24') },
              { id: 'shadcn', label: 'shadcn/ui', logo: getCachedLogoUrl('ui.shadcn.com', '24') },
              { id: 'radix', label: 'Radix UI', logo: getCachedLogoUrl('www.radix-ui.com', '24') },
              { id: 'custom', label: 'Custom', logo: getCachedLogoUrl('tailwindcss.com', '24') }
            ].map((opt) => (
              <button
                key={opt.id}
                onClick={() => {
                  setUiChoices((prev) => prev.includes(opt.label) ? prev.filter(x => x !== opt.label) : [...prev, opt.label])
                }}
                className={`text-left p-4 rounded-xl border transition-colors flex items-center gap-3 ${
                  uiChoices.includes(opt.label)
                    ? 'border-orange-500 bg-gray-900'
                    : 'border-gray-800 bg-gray-900/60 opacity-60 hover:opacity-100 hover:border-orange-500 hover:bg-gray-900'
                }`}
              >
                <img src={opt.logo} alt="" className="w-6 h-6 rounded-sm" />
                <div className="text-white font-medium text-sm">{opt.label}</div>
              </button>
            ))}
          </div>
        </div>
        {/* Hosting */}
        <div>
          <div className="text-white font-medium mb-2 text-sm">Pick Hosting</div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {[
              { id: 'vercel', label: 'Vercel', logo: getCachedLogoUrl('vercel.com', '24') },
              { id: 'netlify', label: 'Netlify', logo: getCachedLogoUrl('netlify.com', '24') },
              { id: 'render', label: 'Render', logo: getCachedLogoUrl('render.com', '24') }
            ].map((opt) => (
              <button
                key={opt.id}
                onClick={() => setHostingChoice(opt.label)}
                className={`text-left p-4 rounded-xl border transition-colors flex items-center gap-3 ${
                  hostingChoice === opt.label
                    ? 'border-orange-500 bg-gray-900'
                    : 'border-gray-800 bg-gray-900/60 opacity-60 hover:opacity-100 hover:border-orange-500 hover:bg-gray-900'
                }`}
              >
                <img src={opt.logo} alt="" className="w-6 h-6 rounded-sm" />
                <div className="text-white font-medium text-sm">{opt.label}</div>
              </button>
            ))}
          </div>
        </div>
        <div>
          <div className="text-white font-medium mb-2 text-sm">Pick DB Provider</div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {[
              { id: 'neon', label: 'Neon', logo: getCachedLogoUrl('neon.tech', '24') },
              { id: 'supabase', label: 'Supabase Postgres', logo: getCachedLogoUrl('supabase.com', '24') },
              { id: 'turso', label: 'Turso (SQLite edge)', logo: getCachedLogoUrl('turso.tech', '24') }
            ].map((opt) => (
              <button
                key={opt.id}
                onClick={() => setDbChoice(opt.label)}
                className={`text-left p-4 rounded-xl border transition-colors flex items-center gap-3 ${
                  dbChoice === opt.label
                    ? 'border-orange-500 bg-gray-900'
                    : 'border-gray-800 bg-gray-900/60 opacity-60 hover:opacity-100 hover:border-orange-500 hover:bg-gray-900'
                }`}
              >
                <img src={opt.logo} alt="" className="w-6 h-6 rounded-sm" />
                <div className="text-white font-medium text-sm">{opt.label}</div>
              </button>
            ))}
          </div>
        </div>
        <div className="flex justify-end">
          <Button onClick={handleContinue} className="bg-orange-600 hover:bg-orange-500">
            Continue
          </Button>
        </div>
      </div>
    </div>
  )
}

