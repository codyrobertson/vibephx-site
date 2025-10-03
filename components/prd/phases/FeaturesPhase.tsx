'use client'

import { useEffect, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { usePRDStore } from '@/lib/stores/usePRDStore'
import { generateMVPFeatures, refineOneLiner } from '@/lib/prd-ai-helpers'

export function FeaturesPhase() {
  const {
    initialIntent,
    audience,
    motivation,
    timeframe,
    sda,
    setSda,
    featuresRaw,
    setFeaturesRaw,
    setFeaturesMvp,
    setFeaturesStretch,
    addFeature,
    removeFeature,
    setPhase,
    addMessages,
    isGeneratingSuggestions,
    setIsGeneratingSuggestions,
    sessionId,
    projectId
  } = usePRDStore()

  const sdaRef = useRef<HTMLTextAreaElement>(null)
  const SDA_MAX = 500

  useEffect(() => {
    if (sdaRef.current) {
      sdaRef.current.style.height = 'auto'
      sdaRef.current.style.height = Math.min(sdaRef.current.scrollHeight, 160) + 'px'
    }
  }, [sda])

  const handleAddFeature = () => {
    const el = document.getElementById('featureInput') as HTMLInputElement
    const v = el?.value?.trim()
    if (!v) return
    addFeature(v)
    el.value = ''
  }

  const handleAISuggest = async () => {
    setIsGeneratingSuggestions(true)
    try {
      await generateMVPFeatures(
        initialIntent,
        audience,
        motivation,
        timeframe,
        featuresRaw,
        (feature) => {
          addFeature(feature)
        },
        projectId || undefined,
        sessionId || undefined
      )
    } catch (err) {
      console.error('Feature generation failed:', err)
    } finally {
      setIsGeneratingSuggestions(false)
    }
  }

  const handleContinue = () => {
    const uniq = Array.from(new Set(featuresRaw))
    const mvp = uniq.slice(0, 4)
    const stretch = uniq.slice(4)
    setFeaturesMvp(mvp)
    setFeaturesStretch(stretch)
    addMessages([{
      id: crypto.randomUUID(),
      role: 'assistant',
      content: `For **today** I recommend:\n• MVP: ${mvp.join(', ')}\n• Stretch: ${stretch.length ? stretch.join(', ') : '—'}`
    }])
    setPhase('providers')
  }

  return (
    <div className="mt-4 p-4 rounded-xl border border-gray-800 bg-black">
      <div className="mb-4">
        <div className="text-white font-semibold text-lg mb-1">Short Description (SDA)</div>
        <div className="text-gray-400 text-sm mb-3">One concise line that clearly describes what you will build today.</div>
        <div className="mb-1">
          <textarea
            ref={sdaRef}
            value={sda}
            onChange={(e) => {
              const normalized = e.target.value.replace(/\s+/g, ' ')
              setSda(normalized.slice(0, SDA_MAX))
            }}
            onBlur={() => {
              try {
                const formatted = refineOneLiner((sda || '').trim())
                setSda(formatted.slice(0, SDA_MAX))
              } catch {}
            }}
            placeholder="e.g., Compare top LLMs by cost and limits"
            className="w-full bg-black/40 border border-gray-800 rounded-lg px-3 py-2 placeholder:text-gray-500 text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 mb-1 resize-none"
            rows={1}
            style={{ minHeight: '44px', maxHeight: '200px', overflow: 'auto' }}
          />
          <div className="text-xs text-gray-500 text-right">{(sda || '').length}/{SDA_MAX}</div>
        </div>

        <div className="text-white font-semibold text-lg mb-1">MVP Features (today)</div>
        <div className="text-gray-400 text-sm">Define the essential features for your MVP</div>
      </div>
      <div className="grid gap-2">
        <div className="flex gap-2">
          <input
            id="featureInput"
            className="flex-1 bg-black/40 border border-gray-800 rounded-lg px-3 py-2 placeholder:text-gray-500 text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500"
            placeholder="e.g., Generate PRD from prompt"
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault()
                handleAddFeature()
              }
            }}
          />
          <Button onClick={handleAddFeature} className="text-black">Add</Button>
          <Button
            onClick={handleAISuggest}
            disabled={isGeneratingSuggestions}
            variant="outline"
            className="border-gray-700 text-white hover:border-orange-500 flex items-center gap-2"
          >
            {isGeneratingSuggestions && (
              <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            )}
            {isGeneratingSuggestions ? 'Suggesting…' : 'AI: Suggest'}
          </Button>
        </div>
        {isGeneratingSuggestions && (
          <div className="mt-2 text-xs text-gray-400 flex items-center gap-2">
            <span className="inline-block w-1.5 h-1.5 bg-orange-400 rounded-full animate-bounce [animation-delay:-0.2s]" />
            <span className="inline-block w-1.5 h-1.5 bg-orange-400 rounded-full animate-bounce [animation-delay:-0.1s]" />
            <span className="inline-block w-1.5 h-1.5 bg-orange-400 rounded-full animate-bounce" />
            <span>Streaming feature ideas…</span>
          </div>
        )}
        <div className="space-y-2 mt-2">
          {featuresRaw.map((f, i) => (
            <div
              key={i}
              className="group px-3 py-2 rounded-lg border border-gray-800 bg-black/40 text-gray-300 hover:border-orange-500 transition-colors flex items-center justify-between"
            >
              <span className="pr-2">{f}</span>
              <button
                onClick={() => removeFeature(i)}
                className="ml-2 opacity-0 group-hover:opacity-100 text-red-400 hover:text-red-300 text-xs"
              >
                ×
              </button>
            </div>
          ))}
        </div>
        <div className="mt-3 flex justify-end">
          <Button onClick={handleContinue} disabled={!sda?.trim()}>Continue</Button>
        </div>
      </div>
    </div>
  )
}

