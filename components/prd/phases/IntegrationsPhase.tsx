'use client'

import { useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { CheckIcon } from '@radix-ui/react-icons'
import { cn } from '@/lib/utils'
import { usePRDStore } from '@/lib/stores/usePRDStore'
import { getCachedLogoUrl } from '@/lib/logoCache'
import { inferConnectors } from '@/lib/prd-ai-helpers'

export function IntegrationsPhase() {
  const { featuresMvp, selectedIntegrations, toggleIntegration, setPhase, selectedStack, dbChoice, name, saveToDatabase } = usePRDStore()
  const integrationCards = (() => {
    // Helper to add unique suggestions
    const out: Array<{ id: string; title: string; description: string }> = [...inferConnectors(featuresMvp)]
    const add = (id: string, title: string, description: string) => {
      if (!out.find(x => x.id === id)) out.push({ id, title, description })
    }

    const lcStack = (selectedStack || '').toLowerCase()
    const lcDb = (dbChoice || '').toLowerCase()
    const text = featuresMvp.join(' ').toLowerCase()

    // Generic helpful defaults (beginner-friendly only)
    const beginner = (name || '').toLowerCase().includes('beginner')
    if (selectedStack && beginner) add('auth', 'Auth', 'Accounts and secure sessions')
    if (dbChoice && beginner) add('analytics', 'Analytics', 'Track key events to learn fast')

    // Provider-specific mappings
    if (lcDb.includes('neon')) {
      add('drizzle', 'Drizzle ORM (Neon)', 'Type-safe SQL with migrations and schema inference')
    }
    if (lcDb.includes('supabase')) {
      add('supabase_auth', 'Supabase Auth', 'Email magic links and OAuth with RLS')
      add('supabase_storage', 'Supabase Storage', 'Buckets for files and public assets')
    }
    if (lcStack.includes('vercel')) {
      add('vercel_analytics', 'Vercel Analytics', 'Edge analytics for traffic and performance')
      add('vercel_blob', 'Vercel Blob', 'Simple object storage for uploads')
    }

    // Feature-keyword provider picks (from Vercel Marketplace)
    const hasFlagsKeyword = /flag|experiment|a\/?b|ab test|growth|statsig/.test(text)
    if (/video|stream|mux/.test(text)) {
      add('mux', 'Mux Video', 'Fast video ingest, playback and webhooks for apps')
    }
    if (/pay|stripe|checkout|billing|subscription/.test(text)) {
      add('stripe', 'Stripe Payments', 'Checkout, Billing, subscriptions and invoicing')
    }
    if (hasFlagsKeyword && !beginner) {
      add('growthbook', 'GrowthBook', 'Open source feature flags and experimentation')
      add('statsig', 'Statsig', 'Feature flags, experiments and analytics')
    }
    if (/error|trace|perf|monitor|logging|log/.test(text)) {
      add('sentry', 'Sentry', 'Errors, traces and performance monitoring')
      add('dash0', 'Dash0', 'Logs, traces and metrics simplified')
    }
    if (/redis|cache|queue|rate limit|vector/.test(text)) {
      add('upstash_redis', 'Upstash Redis/Vector', 'Serverless Redis, Queue and Vector DB')
    }
    if (/mongo|document|search/.test(text)) {
      add('mongodb', 'MongoDB Atlas', 'Serverless document DB with search and vector')
    }
    if (/email|newsletter|transactional/.test(text)) {
      add('resend', 'Resend Email', 'Transactional email for Next.js and Vercel')
    }

    // Category and prioritization to avoid duplicates (e.g., multiple storage)
    const categoryOf = (id: string): string => {
      if (/supabase_storage|vercel_blob|file_storage/.test(id)) return 'storage'
      if (/supabase_auth|auth/.test(id)) return 'auth'
      if (/vercel_analytics|analytics/.test(id)) return 'analytics'
      if (/growthbook|statsig/.test(id)) return 'flags'
      if (/stripe/.test(id)) return 'payments'
      if (/mux/.test(id)) return 'video'
      if (/sentry|dash0/.test(id)) return 'observability'
      if (/drizzle/.test(id)) return 'orm'
      if (/upstash/.test(id)) return 'cache'
      if (/mongodb/.test(id)) return 'db'
      return 'misc'
    }

    const priority: Record<string, string[]> = {
      storage: ['supabase_storage', 'vercel_blob', 'file_storage'],
      auth: ['supabase_auth', 'auth'],
      analytics: ['vercel_analytics', 'analytics'],
      flags: ['growthbook', 'statsig'],
      payments: ['stripe'],
      video: ['mux'],
      observability: ['sentry', 'dash0'],
      orm: ['drizzle'],
      cache: ['upstash_redis'],
      db: ['mongodb']
    }

    // collapse per-category to highest-priority pick
    const collapsed: Record<string, { id: string; title: string; description: string }> = {}
    for (const item of out) {
      const cat = categoryOf(item.id)
      if (cat === 'flags' && !hasFlagsKeyword) continue // hide flags unless explicitly needed
      const existing = collapsed[cat]
      if (!existing) {
        collapsed[cat] = item
      } else {
        const order = priority[cat] || []
        if (order.indexOf(item.id) < order.indexOf(existing.id)) {
          collapsed[cat] = item
        }
      }
    }

    return Object.values(collapsed)
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
                  src={
                    it.id === 'supabase_auth' || it.id === 'supabase_storage'
                      ? getCachedLogoUrl('supabase.com', '20')
                      : it.id === 'drizzle'
                      ? getCachedLogoUrl('orm.drizzle.team', '20')
                      : it.id === 'stripe'
                      ? getCachedLogoUrl('stripe.com', '20')
                      : it.id === 'mux'
                      ? getCachedLogoUrl('mux.com', '20')
                      : it.id === 'sentry'
                      ? getCachedLogoUrl('sentry.io', '20')
                      : it.id === 'growthbook'
                      ? getCachedLogoUrl('growthbook.io', '20')
                      : it.id === 'statsig'
                      ? getCachedLogoUrl('statsig.com', '20')
                      : it.id === 'vercel_analytics' || it.id === 'vercel_blob'
                      ? getCachedLogoUrl('vercel.com', '20')
                      : it.id === 'mongodb'
                      ? getCachedLogoUrl('mongodb.com', '20')
                      : it.id === 'upstash_redis'
                      ? getCachedLogoUrl('upstash.com', '20')
                      : getCachedLogoUrl('neon.tech', '20')
                  }
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

