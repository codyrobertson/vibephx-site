'use client'

import React, { useEffect, useState } from 'react'
import { usePRDStore } from '@/lib/stores/usePRDStore'
import { StreamingArtifact } from '@/components/ai-elements/streaming-artifact'
import { OpenInChat } from '@/components/ai-elements/open-in-chat'
import { Actions, Action } from '@/components/ai-elements/actions'
import { Copy, RefreshCw, Bookmark, Download } from 'lucide-react'

function buildEnrichedPrompt(pd: any) {
  const { projectName, audience, motivation, features, stack, database, integrations } = pd
  return `You are a brutally pragmatic product coach + senior architect writing a ONE-DAY MVP PRD.

Project: ${projectName}
Audience: ${audience}
Why now: ${motivation}
MVP: ${(features || []).join(', ') || '—'}
Stack: ${stack || 'Modern web (Next.js + Vercel)'} | DB: ${database || 'Postgres'} | Integrations: ${(integrations || []).join(', ') || 'None'}

# ${projectName} — MVP PRD
## 1. Summary
## 2. Goals / Non-Goals
## 3. User Stories
## 4. MVP Scope
## 5. Out of Scope
## 6. Acceptance Criteria
## 7. Data Model & API Design
## 8. Data & Integration Strategy
## 9. Implementation Guide (time-boxed)
## 10. Risks & Mitigations
## 11. Success Metrics & Post-MVP Roadmap`
}

async function streamEnrichedPRD(
  projectData: {
    projectName: string
    audience: string
    motivation: string
    features: string[]
    stack?: string
    database?: string
    integrations?: string[]
    projectId?: string
    sessionId?: string
  },
  onChunk: (text: string) => void
): Promise<void> {
  const baseReq: RequestInit = {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    cache: 'no-store',
  }

  // 1) Try streaming first
  try {
    const res = await fetch('/api/prd/generate-enriched', {
      ...baseReq,
      body: JSON.stringify(projectData),
    })
    if (!res.ok) throw new Error(`enriched http ${res.status}`)
    if (!res.body) throw new Error('enriched: no body')
    const reader = res.body.getReader()
    const decoder = new TextDecoder()
    let buffer = ''
    while (true) {
      const { done, value } = await reader.read()
      if (done) break
      buffer += decoder.decode(value, { stream: true })
      onChunk(buffer)     // live update
    }
    return
  } catch (err) {
    console.warn('[PRD] enriched stream failed, falling back:', err)
  }

  // 2) Fallback to non-stream via /api/prd/inference
  const prompt = buildEnrichedPrompt(projectData)
  const res2 = await fetch('/api/prd/inference', {
    ...baseReq,
    body: JSON.stringify({
      messages: [{ role: 'user', content: prompt }],
      stream: false,
      purpose: 'generate_enriched_prd',
      projectId: projectData.projectId,
      sessionId: projectData.sessionId,
    }),
  })
  if (!res2.ok) {
    const t = await res2.text().catch(() => '')
    throw new Error(`fallback http ${res2.status} ${t}`)
  }
  const data = await res2.json()
  onChunk(String(data.content ?? ''))
}

export function OutputsPhase({ animationDelay = 0 }: { animationDelay?: number }) {
  const { setPhase, saveToDatabase, sda, initialIntent, audience, motivation, featuresMvp, featuresStretch, selectedStack, dbChoice, selectedIntegrations, addMessage, addMessages, projectId } = usePRDStore()
  console.log('🎯 OutputsPhase render - projectId:', projectId, 'sda:', sda)
  const [markdown, setMarkdown] = useState<string>('')
  const [isGenerating, setIsGenerating] = useState<boolean>(false)
  const [copied, setCopied] = useState(false)
  const [bookmarked, setBookmarked] = useState(false)
  const [hasAutoFinished, setHasAutoFinished] = useState(false)

  const handleCopy = async () => {
    if (!markdown) return
    await navigator.clipboard.writeText(markdown)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleBookmark = async () => {
    console.log('📌 Bookmark clicked - projectId:', projectId, 'markdown length:', markdown?.length)
    if (!markdown || !projectId) {
      console.error('❌ Cannot bookmark: missing markdown or projectId', { markdown: !!markdown, projectId })
      return
    }
    try {
      const res = await fetch(`/api/projects/${projectId}/documents`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'PRD',
          title: sda || 'Product Requirements Document',
          content: markdown,
          isBookmarked: true,
          generatedBy: 'AI PRD Builder',
          tags: ['prd', 'mvp']
        })
      })
      if (res.ok) {
        setBookmarked(true)
        setTimeout(() => setBookmarked(false), 3000)
      } else {
        const error = await res.json()
        console.error('Failed to bookmark PRD:', error)
      }
    } catch (error) {
      console.error('Failed to bookmark PRD:', error)
    }
  }

  const handleRegenerate = () => {
    setMarkdown('')
    setHasAutoFinished(false)
    startGenerate()
  }

  // Auto-start generation on mount
  useEffect(() => {
    if (!markdown && !isGenerating) {
      startGenerate()
    }
  }, [])

  // Auto-finish when generation completes
  useEffect(() => {
    const autoFinish = async () => {
      if (markdown && !isGenerating && !hasAutoFinished) {
        setHasAutoFinished(true)
        // Save the PRD into chat as an artifact message
        if (markdown.trim()) {
          addMessages([
            { id: crypto.randomUUID(), role: 'assistant', content: `✅ **PRD Generated**\n\n${markdown}` },
            { id: crypto.randomUUID(), role: 'assistant', content: `Your PRD is ready! You can now:\n- Ask me clarifying questions about features or scope\n- Request engineering task breakdown\n- Discuss tech stack choices\n- Plan next steps\n\nWhat would you like to explore?` }
          ])
        }
        try { await saveToDatabase() } catch {}
        // Transition to final phase
        setTimeout(() => setPhase('final'), 500)
      }
    }
    autoFinish()
  }, [markdown, isGenerating, hasAutoFinished])

  const startGenerate = async () => {
    setIsGenerating(true)
    try {
      await streamEnrichedPRD(
        {
          projectName: sda || initialIntent || 'Untitled Project',
          audience: audience || 'General users',
          motivation: motivation || 'Build quickly',
          features: featuresMvp || [],
          stack: selectedStack,
          database: dbChoice,
          integrations: selectedIntegrations,
          projectId,
          sessionId: projectId
        },
        (text) => setMarkdown(text)
      )
    } finally {
      setIsGenerating(false)
    }
  }

  const handleDownload = () => {
    const blob = new Blob([markdown], { type: 'text/markdown;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${sda?.toLowerCase().replace(/\s+/g, '-') || 'prd'}.md`
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div
      className="mt-4 animate-in fade-in slide-in-from-bottom-4"
      style={{ animationDelay: `${animationDelay}ms`, animationDuration: '400ms', animationFillMode: 'both' }}
    >
      <StreamingArtifact
        title={sda || 'Product Requirements Document'}
        content={markdown}
        isStreaming={isGenerating}
        actions={
          !isGenerating && markdown ? (
            <Actions>
              <Action label={copied ? 'Copied!' : 'Copy to clipboard'} onClick={handleCopy}>
                <Copy className="size-4" />
              </Action>
              <Action
                label={bookmarked ? 'Saved!' : projectId ? 'Save to project' : 'No project'}
                onClick={handleBookmark}
                disabled={!projectId || !markdown}
              >
                <Bookmark className={bookmarked ? 'size-4 fill-current' : 'size-4'} />
              </Action>
              <Action label="Download" onClick={handleDownload}>
                <Download className="size-4" />
              </Action>
              <Action label="Regenerate" onClick={handleRegenerate} disabled={isGenerating}>
                <RefreshCw className="size-4" />
              </Action>
            </Actions>
          ) : undefined
        }
      />
    </div>
  )
}


