'use client'

import { useRef, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { usePRDStore } from '@/lib/stores/usePRDStore'
import { generateAudienceAndMotivation, streamAudienceAndMotivation } from '@/lib/prd-ai-helpers'

export function AudiencePhase({ animationDelay = 0 }: { animationDelay?: number }) {
  const {
    initialIntent,
    audience,
    motivation,
    setAudience,
    setMotivation,
    setSda,
    setPhase,
    addMessages,
    isGeneratingAutofill,
    setIsGeneratingAutofill,
    sessionId,
    projectId
  } = usePRDStore()

  const audienceRef = useRef<HTMLTextAreaElement>(null)
  const motivationRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    if (audienceRef.current) {
      audienceRef.current.style.height = 'auto'
      audienceRef.current.style.height = audienceRef.current.scrollHeight + 'px'
    }
    if (motivationRef.current) {
      motivationRef.current.style.height = 'auto'
      motivationRef.current.style.height = motivationRef.current.scrollHeight + 'px'
    }
  }, [audience, motivation])

  const handleAutofill = async () => {
    setIsGeneratingAutofill(true)
    try {
      await streamAudienceAndMotivation(
        initialIntent,
        (partial) => {
          if (partial.audience !== undefined) setAudience(partial.audience)
          if (partial.motivation !== undefined) setMotivation(partial.motivation)
        },
        projectId || undefined,
        sessionId || undefined
      )
    } catch (err) {
      console.error('Autofill failed:', err)
    } finally {
      setIsGeneratingAutofill(false)
    }
  }

  const handleContinue = () => {
    // Clean the intent: remove common prefixes like "I want to build", "I need to create", etc.
    const cleaned = initialIntent
      .replace(/\s+/g, ' ')
      .replace(/^I\s+want\s+to\s+build\s+(a\s+)?/i, '')
      .replace(/^I\s+need\s+to\s+create\s+(a\s+)?/i, '')
      .replace(/^Build\s+(a\s+)?/i, '')
      .replace(/^Create\s+(a\s+)?/i, '')
      .trim()
    const words = cleaned.split(' ').slice(0, 14).join(' ')
    const sda = audience ? `${words} for ${audience}` : words
    setSda(sda.charAt(0).toUpperCase() + sda.slice(1))

    // Add user's response to conversation
    addMessages([
      {
        id: crypto.randomUUID(),
        role: 'user',
        content: `**Who it's for:** ${audience}\n\n**Why build it now:** ${motivation}`
      },
      {
        id: crypto.randomUUID(),
        role: 'assistant',
        content: `Got it. So you're building **${sda}** for **${audience}**.\n\nYour timing makes sense—${motivation.charAt(0).toLowerCase() + motivation.slice(1)}\n\nDoes that capture it, or should we refine anything?`
      }
    ])
    setPhase('confirmIdea')
  }

  return (
    <div
      className="mt-4 p-4 rounded-xl border border-gray-800 bg-gray-900 animate-in fade-in slide-in-from-bottom-4"
      style={{ animationDelay: `${animationDelay}ms`, animationDuration: '400ms', animationFillMode: 'both' }}
    >
      <div className="mb-4">
        <div className="text-white font-semibold text-lg mb-1">Who & Why</div>
        <div className="text-gray-400 text-sm">Help me understand your target audience and motivation</div>
      </div>
      <div className="grid gap-3">
        <textarea
          ref={audienceRef}
          value={audience}
          onChange={(e) => setAudience(e.target.value)}
          placeholder="Who is this for? (e.g., founders, realtors, teachers)"
          className="w-full bg-black/40 border border-gray-800 rounded-lg px-3 py-2 text-white placeholder:text-gray-500 resize-none"
          rows={1}
          style={{ minHeight: '44px', maxHeight: '200px', overflow: 'auto' }}
          onInput={(e) => {
            const target = e.target as HTMLTextAreaElement
            target.style.height = '44px'
            target.style.height = Math.min(target.scrollHeight, 200) + 'px'
          }}
        />
        <textarea
          ref={motivationRef}
          value={motivation}
          onChange={(e) => setMotivation(e.target.value)}
          placeholder="Why build this now? (motivation / problem / outcome)"
          className="w-full bg-black/40 border border-gray-800 rounded-lg px-3 py-2 text-white placeholder:text-gray-500 resize-none"
          rows={1}
          style={{ minHeight: '44px', maxHeight: '200px', overflow: 'auto' }}
          onInput={(e) => {
            const target = e.target as HTMLTextAreaElement
            target.style.height = '44px'
            target.style.height = Math.min(target.scrollHeight, 200) + 'px'
          }}
        />
        <div className="flex gap-2">
          <Button onClick={handleContinue} className="bg-orange-600 hover:bg-orange-500">
            Continue
          </Button>
          <Button
            onClick={handleAutofill}
            disabled={isGeneratingAutofill}
            variant="outline"
            className="border-gray-700 text-gray-300 hover:border-orange-500 hover:text-white flex items-center gap-2"
          >
            {isGeneratingAutofill && (
              <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            )}
            AI: Autofill
          </Button>
        </div>
      </div>
    </div>
  )
}

