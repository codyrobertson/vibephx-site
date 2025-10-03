'use client'

import React, { useEffect, useState } from 'react'
import ReactMarkdown from 'react-markdown'
import { Button } from '@/components/ui/button'
import { usePRDStore } from '@/lib/stores/usePRDStore'

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
      // Auto-finish after generation completes
      setTimeout(() => handleFinish(), 500)
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
        <Button variant="outline" onClick={() => navigator.clipboard.writeText(markdown)} disabled={!markdown}>Copy</Button>
        <Button
          variant="outline"
          onClick={() => {
            const blob = new Blob([markdown], { type: 'text/markdown;charset=utf-8' })
            const url = URL.createObjectURL(blob)
            const a = document.createElement('a')
            a.href = url
            a.download = 'mvp-prd.md'
            a.click()
            URL.revokeObjectURL(url)
          }}
          disabled={!markdown}
        >
          Download
        </Button>
        <Button variant="outline" onClick={handleFinish} disabled={!markdown}>Finish</Button>
      </div>
      <div className="rounded-lg border border-gray-800 bg-black p-6 text-sm overflow-y-auto max-h-[60vh] prose prose-invert max-w-none">
        {markdown ? (
          <ReactMarkdown
            components={{
              h1: ({node, ...props}) => <h1 className="text-2xl font-bold text-white mb-4 mt-6 border-b border-gray-800 pb-2" {...props} />,
              h2: ({node, ...props}) => <h2 className="text-xl font-semibold text-white mb-3 mt-6" {...props} />,
              h3: ({node, ...props}) => <h3 className="text-lg font-medium text-white mb-2 mt-4" {...props} />,
              p: ({node, ...props}) => <p className="text-gray-300 mb-4 leading-relaxed" {...props} />,
              ul: ({node, ...props}) => <ul className="list-disc list-inside text-gray-300 mb-4 space-y-1.5" {...props} />,
              ol: ({node, ...props}) => <ol className="list-decimal list-inside text-gray-300 mb-4 space-y-1.5" {...props} />,
              li: ({node, ...props}) => <li className="text-gray-300 ml-2" {...props} />,
              code: ({node, inline, className, children, ...props}: any) => {
                if (inline) {
                  return <code className="bg-gray-800 text-orange-400 px-1.5 py-0.5 rounded text-xs font-mono" {...props}>{children}</code>
                }
                return (
                  <div className="my-4 rounded-lg overflow-hidden border border-gray-800">
                    <div className="bg-gray-800 px-3 py-1 text-xs text-gray-400 font-mono">
                      {className?.replace('language-', '') || 'code'}
                    </div>
                    <pre className="bg-gray-950 p-4 overflow-x-auto m-0">
                      <code className="text-white font-mono text-xs leading-relaxed" {...props}>{children}</code>
                    </pre>
                  </div>
                )
              },
              pre: ({node, ...props}) => <div {...props} />,
              hr: ({node, ...props}) => <hr className="border-gray-800 my-6" {...props} />,
              strong: ({node, ...props}) => <strong className="text-white font-semibold" {...props} />
            }}
          >
            {markdown}
          </ReactMarkdown>
        ) : (
          <div className="text-gray-500">Click "Generate PRD" to stream the document here.</div>
        )}
      </div>
    </div>
  )
}


