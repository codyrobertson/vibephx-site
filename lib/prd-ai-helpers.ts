/**
 * AI generation helpers for the PRD Builder
 * All calls go through the inference gate for logging
 */

export async function generateAudienceAndMotivation(
  initialIntent: string,
  projectId?: string,
  sessionId?: string
): Promise<{ audience: string; motivation: string }> {
  const prompt = `Based on this idea: "${initialIntent}", suggest:
1. Target audience (one phrase, e.g., "small business owners")
2. Motivation (one sentence explaining why build this now)

Format exactly as:
AUDIENCE: [phrase]
MOTIVATION: [sentence]`

  const res = await fetch('/api/prd/inference', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      messages: [{ role: 'user', content: prompt }],
      purpose: 'autofill_audience',
      projectId,
      sessionId,
      stream: false
    })
  })

  if (!res.ok) throw new Error('Failed to generate')

  const data = await res.json()
  const buffer = data.content || ''

  const audienceMatch = buffer.match(/AUDIENCE:\s*(.+?)(?:\n|$)/i)
  const motivationMatch = buffer.match(/MOTIVATION:\s*(.+?)(?:\n|$)/i)

  return {
    audience: audienceMatch?.[1]?.trim() || 'Workshop attendees',
    motivation: motivationMatch?.[1]?.trim() || 'Guide ideation visually'
  }
}

// Streaming version: emits partial audience/motivation as they are generated
export async function streamAudienceAndMotivation(
  initialIntent: string,
  onUpdate: (partial: { audience?: string; motivation?: string }) => void,
  projectId?: string,
  sessionId?: string
): Promise<{ audience: string; motivation: string }> {
  const prompt = `You are helping capture Who & Why for a product idea. Return two labeled lines:
AUDIENCE: <short phrase identifying the target users>
MOTIVATION: <one concise sentence for why to build now>

Idea: "${initialIntent}"`

  const res = await fetch('/api/prd/inference', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      messages: [{ role: 'user', content: prompt }],
      purpose: 'autofill_audience_stream',
      projectId,
      sessionId,
      stream: true
    })
  })

  if (!res.ok || !res.body) throw new Error('Failed to stream')

  const reader = res.body.getReader()
  const decoder = new TextDecoder()
  let buffer = ''
  let audience = ''
  let motivation = ''

  const emit = () => {
    onUpdate({
      audience: audience || undefined,
      motivation: motivation || undefined
    })
  }

  while (true) {
    const { done, value } = await reader.read()
    if (done) break
    buffer += decoder.decode(value, { stream: true })

    // Try to parse partials line-by-line
    const lines = buffer.split('\n')
    for (let i = 0; i < lines.length - 1; i++) {
      const line = lines[i].trim()
      if (line.toUpperCase().startsWith('AUDIENCE:')) {
        audience = line.replace(/^[Aa][Uu][Dd][Ii][Ee][Nn][Cc][Ee]:\s*/, '').trim()
        emit()
      }
      if (line.toUpperCase().startsWith('MOTIVATION:')) {
        motivation = line.replace(/^[Mm][Oo][Tt][Ii][Vv][Aa][Tt][Ii][Oo][Nn]:\s*/, '').trim()
        emit()
      }
    }
    buffer = lines[lines.length - 1]
  }

  // Final parse for the tail
  const audMatch = buffer.match(/AUDIENCE:\s*(.+?)(?:\n|$)/i)
  const motMatch = buffer.match(/MOTIVATION:\s*(.+?)(?:\n|$)/i)
  if (audMatch) audience = audMatch[1].trim()
  if (motMatch) motivation = motMatch[1].trim()
  emit()
  return { audience: audience || '—', motivation: motivation || '—' }
}

export async function generateMVPFeatures(
  initialIntent: string,
  audience: string,
  motivation: string,
  timeframe: string,
  existingFeatures: string[],
  onFeature: (feature: string) => void,
  projectId?: string,
  sessionId?: string
): Promise<void> {
  const alreadyHave = existingFeatures.length > 0
    ? `\n\nAlready suggested (DO NOT repeat): ${existingFeatures.join(', ')}`
    : ''

  const prompt = `You are a brutally pragmatic product coach. The goal is to ship an MVP in 1 DAY by a BEGINNER developer—not build a unicorn.

Idea: "${initialIntent}" for ${audience}
Motivation: ${motivation}

Suggest exactly 4 NEW features that:
1. Can be built by ONE BEGINNER developer in 1 DAY or less
2. Are CORE to validating the idea (not nice-to-haves)
3. Require NO complex infrastructure (auth/payments/real-time are stretch unless critical)
4. Have clear done/not-done criteria
5. Are DIFFERENT from any features already listed${alreadyHave}

Format: one feature per line starting with "- ". Keep each under 12 words. No fluff.

Example:
- Text input form that saves to local storage
- Export saved entries as markdown file
- Simple list view with delete button
- Basic search filter by keyword

Return ONLY the 4 features, nothing else.`

  const res = await fetch('/api/prd/inference', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      messages: [{ role: 'user', content: prompt }],
      purpose: 'feature_suggestions',
      projectId,
      sessionId,
      stream: true
    })
  })

  if (!res.ok || !res.body) throw new Error('Failed to generate features')

  const reader = res.body.getReader()
  const decoder = new TextDecoder()
  let buffer = ''

  while (true) {
    const { value, done } = await reader.read()
    if (done) break
    buffer += decoder.decode(value, { stream: true })

    // Parse features incrementally as they complete (line by line)
    const lines = buffer.split('\n')
    for (let i = 0; i < lines.length - 1; i++) {
      const line = lines[i].trim()
      if (line.startsWith('- ')) {
        const feature = line.slice(2).trim()
        if (feature && !existingFeatures.includes(feature)) {
          onFeature(feature)
        }
      }
    }
    buffer = lines[lines.length - 1]
  }

  // Process final line
  if (buffer.trim().startsWith('- ')) {
    const feature = buffer.trim().slice(2).trim()
    if (feature && !existingFeatures.includes(feature)) {
      onFeature(feature)
    }
  }
}

export function inferConnectors(features: string[]): Array<{ id: string; title: string; description: string; category: string }> {
  const picks: Array<{ id: string; title: string; description: string; category: string }> = []
  const push = (id: string, title: string, description: string, category: string) => {
    if (!picks.find(p => p.id === id) && picks.length < 3) {
      picks.push({ id, title, description, category })
    }
  }
  const text = features.join(' ').toLowerCase()
  if (/email|verify|notification/.test(text)) push('resend', 'Resend Email', 'Verification + transactional messages', 'email')
  if (/calendar|booking|schedule/.test(text)) push('calendar', 'Calendar', 'Scheduling and availability', 'misc')
  if (/pay|stripe|checkout|bill/.test(text)) push('stripe', 'Stripe Payments', 'Collect payments or deposits', 'payments')
  if (/auth|login|user/.test(text)) push('auth', 'Auth', 'Accounts and secure sessions', 'auth')
  if (/upload|file|image|storage/.test(text)) push('uploadthing', 'UploadThing', 'Upload and retrieve assets', 'storage')
  if (/analytics|track|event/.test(text)) push('analytics', 'Analytics', 'Track events and funnels', 'analytics')
  if (picks.length === 0) push('analytics', 'Analytics', 'Track key events to learn fast', 'analytics')
  return picks
}

export function refineOneLiner(idea: string, audienceHint?: string): string {
  const clean = idea
    .replace(/\s+/g, ' ')
    .replace(/^I\s+want\s+to\s+build\s+/i, '')
    .replace(/^I\s+need\s+to\s+create\s+/i, '')
    .trim()

  let out = clean
  if (audienceHint && !new RegExp(audienceHint, 'i').test(out)) {
    out = `${clean} for ${audienceHint}`.trim()
  }
  const words = out.split(' ')
  if (words.length > 14) out = words.slice(0, 14).join(' ')
  return out.charAt(0).toUpperCase() + out.slice(1)
}

