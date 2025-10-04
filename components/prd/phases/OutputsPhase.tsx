'use client'

import React, { useEffect, useState } from 'react'
import { usePRDStore } from '@/lib/stores/usePRDStore'
import { StreamingArtifact } from '@/components/ai-elements/streaming-artifact'
import { OpenInChat } from '@/components/ai-elements/open-in-chat'
import { Actions, Action } from '@/components/ai-elements/actions'
import { Copy, RefreshCw, Bookmark, Download } from 'lucide-react'

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
  const res = await fetch('/api/prd/generate-enriched', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(projectData)
  })
  if (!res.ok || !res.body) throw new Error('Failed to stream enriched PRD')
  const reader = res.body.getReader()
  const decoder = new TextDecoder()
  let buffer = ''
  while (true) {
    const { done, value } = await reader.read()
    if (done) break
    buffer += decoder.decode(value, { stream: true })
    onChunk(buffer)
  }
  onChunk(buffer)
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
              {projectId ? (
                <Action label={bookmarked ? 'Saved!' : 'Save to project'} onClick={handleBookmark}>
                  <Bookmark className={bookmarked ? 'size-4 fill-current' : 'size-4'} />
                </Action>
              ) : (
                <Action label="No project ID" onClick={() => console.log('No projectId available')} disabled>
                  <Bookmark className="size-4 opacity-50" />
                </Action>
              )}
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


