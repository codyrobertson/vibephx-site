'use client'

import React, { useEffect, useState } from 'react'
import ReactMarkdown from 'react-markdown'
import { Button } from '@/components/ui/button'
import { usePRDStore } from '@/lib/stores/usePRDStore'
import { Artifact } from '@/components/ai-elements/artifact'
import { OpenInChat } from '@/components/ai-elements/open-in-chat'

async function streamPRD(prompt: string, onChunk: (text: string) => void): Promise<void> {
  const res = await fetch('/api/prd/inference', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      messages: [{ role: 'user', content: prompt }],
      purpose: 'generate_prd_markdown',
      stream: true
    })
  })
  if (!res.ok || !res.body) throw new Error('Failed to stream PRD')
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

export function OutputsPhase() {
  const { setPhase, saveToDatabase, sda, initialIntent, audience, motivation, featuresMvp, featuresStretch, selectedStack, dbChoice, selectedIntegrations, addMessage, addMessages } = usePRDStore()
  const [markdown, setMarkdown] = useState<string>('')
  const [isGenerating, setIsGenerating] = useState<boolean>(false)

  const handleFinish = async () => {
    // Save the PRD into chat as an artifact message and persist session
    if (markdown.trim()) {
      addMessages([
        { id: crypto.randomUUID(), role: 'assistant', content: `✅ **PRD Generated**\n\n${markdown}` },
        { id: crypto.randomUUID(), role: 'assistant', content: `Your PRD is ready! You can now:\n- Ask me clarifying questions about features or scope\n- Request engineering task breakdown\n- Discuss tech stack choices\n- Plan next steps\n\nWhat would you like to explore?` }
      ])
    }
    try { await saveToDatabase() } catch {}
    // Stay in the chat flow with PRD context
    setPhase('final')
  }

  const [hasGenerated, setHasGenerated] = useState<boolean>(false)

  const startGenerate = async () => {
    setIsGenerating(true)
    const prompt = `You are a brutally pragmatic product coach writing an MVP PRD for a BEGINNER developer to ship in ONE DAY.

Project: ${sda || initialIntent}
Target Users: ${audience}
Why Now: ${motivation}
MVP Features: ${featuresMvp.join(', ')}

Generate a ~1500-word PRD in GitHub-flavored Markdown with proper headings (# ## ###), spacing, and bullet formatting.

Required Structure:

# [Project Name] - MVP PRD

## 1. Summary
One concise paragraph (3-4 sentences) capturing the core idea, who it's for, and the primary value.

## 2. Goals and Non-Goals

### Goals
- Bullet list of 3-4 SMART goals (specific, measurable, achievable in 1 day)

### Non-Goals
- Bullet list of 3-4 things explicitly OUT of MVP scope

## 3. User Stories
Write 6-8 user stories in format:
- As a [persona], I want to [action] so that [value/outcome]

## 4. MVP Scope
Bullet list of features included in TODAY's build. Keep brutally minimal.

## 5. Out of Scope
Bullet list of features deferred to future iterations.

## 6. Acceptance Criteria
Numbered list (8-12 items) with clear done/not-done criteria:
1. Specific, testable requirement
2. Another specific requirement
...

## 7. Data Model
Present key entities in simple code-block format (use triple backticks):
Entity {
  field: type
  field: type
}

## 8. Implementation Notes
Brief guidance on:
- Suggested stack (beginner-friendly)
- File structure
- Key libraries
- Deployment approach

## 9. Risks & Tradeoffs

### Risks
- 3-4 bullets on what could go wrong

### Tradeoffs
- 3-4 bullets on compromises made for speed

### Mitigation
- 2-3 bullets on how to address risks

---

**Footer**: This MVP PRD is designed for a one-day build. Future iterations can add [list 2-3 deferred features].

Ensure proper spacing between sections, use bullet lists for readability, and keep language concise and actionable.`
    try {
      await streamPRD(prompt, (text) => setMarkdown(text))
      setHasGenerated(true)
    } finally {
      setIsGenerating(false)
    }
  }

  return (
    <div className="mt-4 p-4 rounded-xl border border-gray-800 bg-gray-900/60 animate-in fade-in slide-in-from-bottom-4 duration-300">
      <div className="mb-4">
        <div className="text-white font-semibold text-lg mb-1">Generate & Export</div>
        <div className="text-gray-400 text-sm">Download your PRD and acceptance criteria.</div>
      </div>
      <div className="flex gap-2 mb-4">
        {!hasGenerated && (
          <Button className="bg-orange-600 hover:bg-orange-500" onClick={startGenerate} disabled={isGenerating}>
            {isGenerating ? 'Generating…' : 'Generate PRD'}
          </Button>
        )}
        <Button variant="outline" onClick={handleFinish} disabled={!markdown}>Finish</Button>
      </div>

      {markdown ? (
        <Artifact
          title={sda || 'Product Requirements Document'}
          type="prd"
          content={markdown}
          actions={
            <>
              <OpenInChat content={markdown} platform="v0" />
              <button
                onClick={() => {
                  const blob = new Blob([markdown], { type: 'text/markdown;charset=utf-8' })
                  const url = URL.createObjectURL(blob)
                  const a = document.createElement('a')
                  a.href = url
                  a.download = `${sda?.toLowerCase().replace(/\s+/g, '-') || 'prd'}.md`
                  a.click()
                  URL.revokeObjectURL(url)
                }}
                className="text-xs text-gray-400 hover:text-white transition-colors px-2 py-1 rounded hover:bg-gray-700/50"
              >
                Download
              </button>
            </>
          }
        />
      ) : (
        <div className="rounded-lg border border-gray-700 bg-gray-900/50 p-8 text-center">
          <div className="text-gray-500">Click "Generate PRD" to create your document.</div>
        </div>
      )}
    </div>
  )
}


