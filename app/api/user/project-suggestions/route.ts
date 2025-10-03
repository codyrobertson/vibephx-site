import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { stackServerApp } from '@/stack'
import { callLLM } from '@/lib/inference-gate'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

// Server-side cache: userId -> { suggestions, timestamp }
const suggestionsCache = new Map<string, { suggestions: any[], timestamp: number }>()
const CACHE_TTL_MS = 12 * 60 * 60 * 1000 // 12 hours

export async function POST(req: NextRequest) {
  try {
    const user = await stackServerApp.getUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Check server-side cache first
    const cached = suggestionsCache.get(user.id)
    if (cached && Date.now() - cached.timestamp < CACHE_TTL_MS) {
      console.log('[Suggestions] Returning cached suggestions for user:', user.id)
      return NextResponse.json({ suggestions: cached.suggestions })
    }

    const profile = await prisma.userProfile.findUnique({
      where: { userId: user.id }
    })

    if (!profile || !profile.onboardingCompleted) {
      // Return default suggestions
      const defaults = [
        { emoji: '🧱', text: 'PRD generator for workshops' },
        { emoji: '📋', text: 'Viral waitlist landing page' },
        { emoji: '📊', text: 'CRM dashboard with sales tracking' },
        { emoji: '📅', text: 'Booking system with calendar sync' }
      ]
      // Cache defaults too
      suggestionsCache.set(user.id, { suggestions: defaults, timestamp: Date.now() })
      return NextResponse.json({ suggestions: defaults })
    }

    // Generate personalized suggestions using AI (optimized for fast, 1‑day MVPs)
    const prompt = `You are a brutally pragmatic product coach.
Based on the following profile, propose exactly 4 unique MVP ideas a SOLO ${profile.skillLevel || 'beginner'} can ship in ${profile.timeCommitment || '1 day'}.

User Profile
- Skill Level: ${profile.skillLevel}
- Interests: ${profile.interests.join(', ')}
- Primary Goal: ${profile.primaryGoal}
- Time Commitment: ${profile.timeCommitment}
- Tech Preferences: ${profile.techPreferences.join(', ')}
- Team: ${profile.hasTeam ? 'Yes' : 'Solo'}
- Preferred Complexity: ${profile.preferredComplexity}

Hard constraints for EACH idea
1) Must be truly shippable in ${profile.timeCommitment || 'one day'} by one person
2) Avoid complex infra (no auth/payments/realtime) unless absolutely core
3) Prefer simple CRUD/data-file workflows; lean on hosted APIs/SDKs
4) Use tech preferences where possible
5) Ensure VARIETY across ideas (different verbs/domains)
6) Start text with an action verb; keep under 8 words
7) No duplicates, no vague "platform/app" phrasing

Output ONLY JSON array (no prose, no markdown):
[
  {"emoji": "🧰", "text": "Verb phrase idea under 8 words"},
  {"emoji": "📈", "text": "Verb phrase idea under 8 words"},
  {"emoji": "🗂️", "text": "Verb phrase idea under 8 words"},
  {"emoji": "⚡", "text": "Verb phrase idea under 8 words"}
]`

    console.log('[Suggestions] Generating personalized suggestions for user:', user.id)
    const result = await callLLM({
      model: 'anthropic/claude-3.5-sonnet',
      provider: 'openrouter',
      messages: [{ role: 'user', content: prompt }],
      purpose: 'personalized_project_suggestions',
      userId: user.id,
      maxTokens: 500,
      temperature: 0.6
    })

    // Parse JSON from response
    const jsonMatch = result.content.match(/\[[\s\S]*\]/)
    if (jsonMatch) {
      const suggestions = JSON.parse(jsonMatch[0])
      // Cache the generated suggestions
      suggestionsCache.set(user.id, { suggestions, timestamp: Date.now() })
      console.log('[Suggestions] Cached new suggestions for user:', user.id)
      return NextResponse.json({ suggestions })
    }

    // Heuristic fallback based on profile when AI doesn't return JSON
    const interest = (profile.interests?.[0] || 'SaaS').toLowerCase()
    const tech = (profile.techPreferences?.[0] || 'Next.js')
    const fallback: Array<{ emoji: string; text: string }> = [
      { emoji: '🧱', text: `${tech} mini ${interest} tool` },
      { emoji: '📋', text: 'Viral waitlist landing page' },
      { emoji: '📊', text: 'Simple analytics dashboard' },
      { emoji: '📅', text: 'Calendar booking MVP' }
    ]
    // Cache fallback too
    suggestionsCache.set(user.id, { suggestions: fallback, timestamp: Date.now() })
    return NextResponse.json({ suggestions: fallback })

  } catch (error: any) {
    console.error('Suggestions error:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to generate suggestions' },
      { status: 500 }
    )
  }
}

