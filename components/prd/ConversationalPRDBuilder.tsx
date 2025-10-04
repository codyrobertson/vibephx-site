'use client'

import { useState, useEffect, useRef } from 'react'
import { useSearchParams } from 'next/navigation'
import { Conversation, ConversationContent, ConversationEmptyState } from '@/components/ai-elements/conversation'
import { Message, MessageContent, MessageAvatar } from '@/components/ai-elements/message'
import { Response } from '@/components/ai-elements/response'
import { Artifact } from '@/components/ai-elements/artifact'
import { OpenInChat } from '@/components/ai-elements/open-in-chat'
import { ContextMeter } from '@/components/ai-elements/context-meter'
import { Actions, Action } from '@/components/ai-elements/actions'
import { Copy, Check } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { PaperPlaneIcon, MagicWandIcon } from '@radix-ui/react-icons'
import { usePRDStore } from '@/lib/stores/usePRDStore'
import { AudiencePhase } from './phases/AudiencePhase'
import { ConfirmIdeaPhase } from './phases/ConfirmIdeaPhase'
import { FeaturesPhase } from './phases/FeaturesPhase'
import { ProvidersPhase } from './phases/ProvidersPhase'
import { IntegrationsPhase } from './phases/IntegrationsPhase'
import { SummaryPhase } from './phases/SummaryPhase'
import { OutputsPhase } from './phases/OutputsPhase'

type Phase = 'intro' | 'audience' | 'confirmIdea' | 'features' | 'providers' | 'stack' | 'integrations' | 'summary' | 'outputs' | 'final'

function PRDMessage({ message, isPRDArtifact, shouldAutoCollapse, index }: {
  message: { id: string; role: 'user' | 'assistant'; content: string; images?: string[] }
  isPRDArtifact: boolean
  shouldAutoCollapse: boolean
  index: number
}) {
  const [isCollapsed, setIsCollapsed] = useState(shouldAutoCollapse)
  const [isHovering, setIsHovering] = useState(false)
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    setIsCollapsed(shouldAutoCollapse)
  }, [shouldAutoCollapse])

  // Extract PRD content from message
  const prdContent = isPRDArtifact ? message.content.replace(/✅ \*\*PRD Generated\*\*\n\n/g, '').replace(/✅ \*\*PRD Generated\*\*\n/g, '').replace('✅ **PRD Generated**\n\n', '').replace('✅ **PRD Generated**\n', '') : ''

  const handleCopy = async () => {
    await navigator.clipboard.writeText(message.content)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div
      className="group relative pb-10 animate-in fade-in slide-in-from-bottom-4"
      style={{ animationDelay: `${index * 100}ms`, animationDuration: '400ms', animationFillMode: 'both' }}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      {isPRDArtifact ? (
        <>
          <Message from={message.role}>
            <MessageAvatar name="AI" className="bg-black border-2 border-gray-700 text-gray-400" />
            <MessageContent>
              <Artifact
                title="Product Requirements Document"
                type="prd"
                content={prdContent}
                actions={
                  <>
                    <OpenInChat content={prdContent} platform="v0" />
                  </>
                }
              />
            </MessageContent>
          </Message>
          {/* Hover actions */}
          <div className={`absolute left-12 bottom-2 transition-opacity ${isHovering ? 'opacity-100' : 'opacity-0'}`}>
            <Actions>
              <Action label={copied ? 'Copied!' : 'Copy message'} onClick={handleCopy}>
                {copied ? <Check className="size-4" /> : <Copy className="size-4" />}
              </Action>
            </Actions>
          </div>
        </>
      ) : (
        <>
          <Message from={message.role}>
            {message.role === 'assistant' && <MessageAvatar name="AI" className="bg-black border-2 border-gray-700 text-gray-400" />}
            <MessageContent
              variant="contained"
              className={message.role === 'user'
                ? 'bg-gradient-to-r from-orange-500 to-orange-600 text-white'
                : 'bg-black text-white border border-gray-700'}
              data-role={message.role}
            >
              {message.images && message.images.length > 0 && (
                <div className="flex gap-2 mb-2 flex-wrap">
                  {message.images.map((img, idx) => (
                    <img key={idx} src={img} alt="" className="max-w-xs h-40 object-cover rounded border border-gray-700" />
                  ))}
                </div>
              )}
              <Response>{message.content}</Response>
            </MessageContent>
          </Message>
          {/* Hover actions */}
          <div className={`absolute ${message.role === 'assistant' ? 'left-12' : 'right-12'} bottom-2 transition-opacity ${isHovering ? 'opacity-100' : 'opacity-0'}`}>
            <Actions>
              <Action label={copied ? 'Copied!' : 'Copy message'} onClick={handleCopy}>
                {copied ? <Check className="size-4" /> : <Copy className="size-4" />}
              </Action>
            </Actions>
          </div>
        </>
      )}
    </div>
  )
}

export default function ConversationalPRDBuilder() {
  // Zustand store - all state management
  const phase = usePRDStore(state => state.phase)
  const setPhase = usePRDStore(state => state.setPhase)
  const setInitialIntent = usePRDStore(state => state.setInitialIntent)
  const setSda = usePRDStore(state => state.setSda)
  const addMessages = usePRDStore(state => state.addMessages)
  const finalFollowupDone = usePRDStore(state => state.finalFollowupDone)
  const setFinalFollowupDone = usePRDStore(state => state.setFinalFollowupDone)
  const saveToDatabase = usePRDStore(state => state.saveToDatabase)
  const projectId = usePRDStore(state => state.projectId)
  const initialIntent = usePRDStore(state => state.initialIntent)
  const loadFromDatabase = usePRDStore(state => state.loadFromDatabase)
  const loadProjectSuggestions = usePRDStore(state => state.loadProjectSuggestions)
  const storeMessages = usePRDStore(state => state.messages)
  const setStoreMessages = usePRDStore(state => state.setMessages)
  const sessionId = usePRDStore(state => state.sessionId)
  const projectSuggestions = usePRDStore(state => state.projectSuggestions)
  const shouldShowSuggestions = usePRDStore(state => state.shouldShowSuggestions())
  const isFreshProject = usePRDStore(state => state.isFreshProject())
  const setHasLoadedSession = usePRDStore(state => state.setHasLoadedSession)
  const hasLoadedSession = usePRDStore(state => state.hasLoadedSession)
  const reset = usePRDStore(state => state.reset)

  // Local UI state (transient, not persisted)
  const [input, setInput] = useState('')
  const [isChatStreaming, setIsChatStreaming] = useState(false)
  const [uploadedImages, setUploadedImages] = useState<Array<{id: string; url: string}>>([])
  const [currentTask, setCurrentTask] = useState<{type: 'search' | 'vision' | null; label: string} | null>(null)
  const [isLoadingSession, setIsLoadingSession] = useState(false)
  const [loadError, setLoadError] = useState<string | null>(null)

  const endRef = useRef<HTMLDivElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const searchParams = useSearchParams()
  const pendingSaveRef = useRef<number | null>(null)

  // URL is the single source of truth - sync store with URL immediately
  useEffect(() => {
    const urlSessionId = searchParams.get('session')

    // URL has no session but store does - clear store immediately
    if (!urlSessionId && sessionId) {
      reset()
      setHasLoadedSession(false)
      loadProjectSuggestions()
      return
    }

    // URL has session that differs from store - load it
    if (urlSessionId && urlSessionId !== sessionId) {
      setIsLoadingSession(true)
      setLoadError(null)
      loadFromDatabase(urlSessionId)
        .then(() => setIsLoadingSession(false))
        .catch(err => {
          console.error('Failed to load session:', err)
          setLoadError('Failed to load session')
          setIsLoadingSession(false)
          setTimeout(() => {
            window.history.replaceState({}, '', '/builder/prd-builder')
            reset()
            setHasLoadedSession(false)
            loadProjectSuggestions()
          }, 2000)
        })
      return
    }

    // Fresh mount with no session - load suggestions
    if (!urlSessionId && !sessionId) {
      setHasLoadedSession(false)
      loadProjectSuggestions()
    }
  }, [searchParams, sessionId, reset, setHasLoadedSession, loadFromDatabase, loadProjectSuggestions])

  // Only write sessionId to URL when we transition FROM intro (i.e., user starts working)
  useEffect(() => {
    if (!sessionId || phase === 'intro') return

    const url = new URL(window.location.href)
    if (url.searchParams.get('session') !== sessionId) {
      url.searchParams.set('session', sessionId)
      window.history.replaceState({}, '', url.toString())
    }
  }, [sessionId, phase])

  // Progress
  const phaseLabels: Record<Phase, string> = {
    intro: 'Intro',
    audience: 'Who & Why',
    confirmIdea: 'Confirm',
    features: 'Features',
    providers: 'Stack',
    stack: 'Frontend',
    integrations: 'Integrations',
    summary: 'Review',
    outputs: 'Export',
    final: 'Done'
  }
  const phaseOrder: Phase[] = ['intro', 'audience', 'confirmIdea', 'features', 'providers', 'stack', 'integrations', 'summary', 'outputs', 'final']
  const progress = ((phaseOrder.indexOf(phase) + 1) / phaseOrder.length) * 100

  // Auto-scroll
  useEffect(() => {
    setTimeout(() => endRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' }), 100)
  }, [storeMessages.length, phase])

  // Debounced save wrapper
  const requestSave = () => {
    if (pendingSaveRef.current) {
      window.clearTimeout(pendingSaveRef.current)
      pendingSaveRef.current = null
    }
    pendingSaveRef.current = window.setTimeout(() => {
      pendingSaveRef.current = null
      saveToDatabase().catch(() => {})
    }, 500)
  }

  // Auto-save on phase change at key milestones (skip intro to avoid empty sessions)
  useEffect(() => {
    // Only save when transitioning TO these phases (meaningful progress made)
    const shouldSavePhases: Phase[] = ['features', 'stack', 'summary', 'outputs', 'final']
    if (shouldSavePhases.includes(phase)) {
      requestSave()
    }
  }, [phase])

  // Save when the tab is hidden or unloading
  useEffect(() => {
    const handler = () => { requestSave() }
    document.addEventListener('visibilitychange', handler)
    window.addEventListener('beforeunload', handler)
    return () => {
      document.removeEventListener('visibilitychange', handler)
      window.removeEventListener('beforeunload', handler)
    }
  }, [])

  // Realtime autosave every 5s once there is an idea and we're past intro
  useEffect(() => {
    if (!initialIntent || phase === 'intro') return
    const id = setInterval(() => {
      requestSave()
    }, 5000)
    return () => clearInterval(id)
  }, [initialIntent, phase])

  // Save when store messages change (debounced) - watch the actual messages array
  useEffect(() => {
    if (storeMessages.length > 0 && phase !== 'intro') {
      requestSave()
    }
  }, [storeMessages])

  // Final follow-up & mark completion
  useEffect(() => {
    const last = storeMessages[storeMessages.length - 1] as any
    if (phase === 'final' && !isChatStreaming && !finalFollowupDone && last?.role === 'assistant' && last?.content?.length > 50) {
      addMessages([{
        id: crypto.randomUUID(),
        role: 'assistant',
        content: 'Want me to take the next step? I can (1) turn this into an engineering task list, (2) ask 3 clarifying questions and update the spec, or (3) scaffold a starter repo structure.'
      }])
      setFinalFollowupDone(true)
      // best-effort: update project status to COMPLETED
      ;(async () => {
        try {
          const state = usePRDStore.getState()
          const pid = state.projectId
          if (pid) {
            fetch('/api/projects', { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id: pid, status: 'COMPLETED' }) }).catch(() => {})
          }
        } catch {}
      })()
    }
  }, [phase, storeMessages, finalFollowupDone, addMessages, setFinalFollowupDone])

  const refineOneLiner = (idea: string) => {
    const clean = idea
      .replace(/\s+/g, ' ')
      .replace(/^I\s+want\s+to\s+build\s+(a\s+)?/i, '')
      .replace(/^I\s+need\s+to\s+create\s+(a\s+)?/i, '')
      .replace(/^Build\s+(a\s+)?/i, '')
      .replace(/^Create\s+(a\s+)?/i, '')
      .trim()
    const words = clean.split(' ')
    const trimmed = words.length > 14 ? words.slice(0, 14).join(' ') : clean
    return trimmed.charAt(0).toUpperCase() + trimmed.slice(1)
  }

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim()) return
    setHasLoadedSession(true)

    if (phase === 'intro') {
      const idea = input.trim()
      setInitialIntent(idea)
      setSda(refineOneLiner(idea))
      addMessages([
        { id: crypto.randomUUID(), role: 'user', content: idea },
        { id: crypto.randomUUID(), role: 'assistant', content: 'Great idea. Before we start, who is this for and why build it now?' }
      ])
      setPhase('audience')
      // Don't save yet; let the phase change trigger the save
      setInput('')
      return
    }

    // In final phase, chat with AI about the PRD/project
    if (phase === 'final') {
      const userMsg = input.trim()
      const hasImages = uploadedImages.length > 0
      const shouldSearch = /search|look up|find|research|examples?|show me|screenshots?|images?.*of/i.test(userMsg)
      
      const assistantId = crypto.randomUUID()
      addMessages([
        { 
          id: crypto.randomUUID(), 
          role: 'user', 
          content: userMsg,
          images: hasImages ? uploadedImages.map(i => i.url) : undefined
        },
        { id: assistantId, role: 'assistant', content: '' }
      ])
      setInput('')
      setIsChatStreaming(true)
      
      // Handle vision or search
      if (hasImages || shouldSearch) {
        setCurrentTask({ type: hasImages ? 'vision' : 'search', label: hasImages ? 'Analyzing images...' : 'Searching the web...' })
        try {
          const res = await fetch('/api/prd/multimodal', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              message: userMsg,
              images: hasImages ? uploadedImages.map(i => i.url) : undefined,
              shouldSearch,
              sessionId,
              projectId: usePRDStore.getState().projectId
            })
          })
          if (res.ok) {
            const data = await res.json()
            const current = usePRDStore.getState().messages
            setStoreMessages(current.map(m => m.id === assistantId ? { 
              ...m, 
              content: data.response,
              images: data.images || undefined
            } : m))
          }
          setUploadedImages([])
        } catch (err) {
          console.error('Multimodal failed:', err)
        } finally {
          setCurrentTask(null)
          setIsChatStreaming(false)
        }
        return
      }
      
      // Stream AI response with PRD context (last 20 messages + PRD artifact if present)
      try {
        // Get fresh messages from store after adding user message
        await new Promise(resolve => setTimeout(resolve, 100))
        const allMsgs = usePRDStore.getState().messages
        
        // Find the PRD artifact (large assistant message with "PRD Generated")
        const prdArtifact = allMsgs.find(m => m.role === 'assistant' && m.content.includes('PRD Generated'))
        
        // Take last 20 messages for recent context
        const recentMsgs = allMsgs.slice(-20)
        
        // Build context: PRD (if exists and not in recent) + recent messages
        const contextMessages = [
          ...(prdArtifact && !recentMsgs.find(m => m.id === prdArtifact.id) ? [{ role: prdArtifact.role, content: prdArtifact.content }] : []),
          ...recentMsgs.map(m => ({ role: m.role, content: m.content }))
        ]
        console.log('Chat context includes', contextMessages.length, 'messages with', contextMessages.reduce((sum, m) => sum + m.content.length, 0), 'total chars')
        
        const res = await fetch('/api/prd/inference', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            messages: contextMessages,
            purpose: 'post_prd_chat',
            stream: true,
            maxTokens: 2000,
            temperature: 0.7
          })
        })
        if (!res.ok || !res.body) throw new Error('Failed')
        const reader = res.body.getReader()
        const decoder = new TextDecoder()
        let buffer = ''
        let updateCount = 0
        
        while (true) {
          const { done, value } = await reader.read()
          if (done) break
          buffer += decoder.decode(value, { stream: true })
          updateCount++
          // Only update UI every 3 chunks or on done for better performance
          if (updateCount % 3 === 0 || done) {
            const current = usePRDStore.getState().messages
            setStoreMessages(current.map(m => m.id === assistantId ? { ...m, content: buffer } : m))
          }
        }
        // Final update
        const current = usePRDStore.getState().messages
        setStoreMessages(current.map(m => m.id === assistantId ? { ...m, content: buffer } : m))
      } catch (err) {
        console.error('Chat failed:', err)
      } finally {
        setIsChatStreaming(false)
      }
      return
    }

    addMessages([{ id: crypto.randomUUID(), role: 'user', content: input }])
    setInput('')
  }

  const handleSuggestedPrompt = (prompt: string) => {
    // Mark that we're no longer fresh (user has interacted)
    setHasLoadedSession(true)
    if (phase === 'intro') {
      setInitialIntent(prompt)
      setSda(refineOneLiner(prompt))
      addMessages([
        { id: crypto.randomUUID(), role: 'user', content: prompt },
        { id: crypto.randomUUID(), role: 'assistant', content: 'Awesome. Who is this for and why does it matter to them?' }
      ])
      setPhase('audience')
    } else {
      addMessages([{ id: crypto.randomUUID(), role: 'user', content: prompt }])
    }
  }

  const hasAnyMessages = storeMessages.length > 0
  // Deduplicate messages by id to avoid React key warnings and filter out empty streaming placeholders
  const allMessages = storeMessages
  const seen = new Set<string>()
  const displayMessages: Array<{ id: string; role: 'user' | 'assistant'; content: string; images?: string[] }> = (allMessages as any[])
    .filter((m: any) => {
      if (!m?.id || seen.has(m.id)) return false
      // Hide empty assistant messages (streaming placeholders)
      if (m.role === 'assistant' && !m.content?.trim()) return false
      seen.add(m.id)
      return true
    })

  // Show loading state
  if (isLoadingSession) {
    return (
      <div className="max-w-5xl mx-auto h-[calc(100vh-8rem)] flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block w-16 h-16 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mb-4"></div>
          <h2 className="text-2xl font-bold text-white mb-2">Loading your project...</h2>
          <p className="text-gray-400">This should only take a moment</p>
        </div>
      </div>
    )
  }

  // Show error state
  if (loadError) {
    return (
      <div className="max-w-5xl mx-auto h-[calc(100vh-8rem)] flex items-center justify-center">
        <div className="text-center max-w-md">
          <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">Session Not Found</h2>
          <p className="text-gray-400 mb-6">{loadError}</p>
          <p className="text-sm text-gray-500">Redirecting to fresh session...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="h-full flex flex-col w-full">
      {/* Header */}
      <div className={`flex-none bg-black border-b border-gray-800 transition-all duration-300 ${!hasAnyMessages ? 'py-12' : 'py-4'}`}>
        <div className={`${!hasAnyMessages ? 'text-center' : 'flex items-center justify-between'} w-full px-12 transition-all duration-300`}>
          <div className={!hasAnyMessages ? '' : 'flex items-center gap-4'}>
            <h1 className={`font-bold text-white transition-all duration-300 ${!hasAnyMessages ? 'text-4xl mb-2' : 'text-2xl'}`}>
              PRD Builder
            </h1>
            {!hasAnyMessages && <p className="text-gray-400 text-lg">Plan → Loop → Ship. Let's turn your idea into a shippable PRD.</p>}
          </div>
          {phase !== 'intro' && hasAnyMessages && (
            <div className="flex items-center gap-4">
              <ContextMeter
                currentTokens={Math.min(storeMessages.length * 100, 128000)}
                maxTokens={128000}
                className="w-48"
              />
              <div className="text-xs text-gray-400">{phaseLabels[phase]}</div>
              <div className="w-32 h-1 bg-gray-800 rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-orange-500 to-orange-400 transition-all duration-500" style={{ width: `${progress}%` }} />
              </div>
              <div className="text-xs text-gray-400">{Math.round(progress)}%</div>
            </div>
          )}
        </div>
      </div>

      <Conversation className="flex-1 overflow-auto pb-6">
        <ConversationContent className="space-y-8 px-12 py-8">
          {/* Quick-start cards - MOVED HERE from bottom */}
          {shouldShowSuggestions && projectSuggestions.length > 0 && (
            <div className="mb-6">
              <p className="text-sm text-gray-400 mb-4 text-center">Quick start with these examples:</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {projectSuggestions.map((item, idx) => (
                  <button
                    key={idx}
                    className="text-left p-4 bg-gray-800/50 border border-gray-700 rounded-xl hover:border-orange-500 hover:bg-gray-800 transition-all text-sm text-gray-300 group"
                    onClick={() => handleSuggestedPrompt(`I want to build a ${item.text}`)}
                  >
                    <span className="text-lg mb-1 block">{item.emoji}</span>
                    <span className="group-hover:text-white transition-colors">{item.text}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Thinking indicator */}
          {isChatStreaming && (
            <div className="flex items-start gap-3 mb-4">
              <div className="bg-black border-2 border-gray-700 text-gray-400 rounded-full w-8 h-8 flex items-center justify-center text-xs font-medium">AI</div>
              <div className="flex items-center gap-2 text-gray-400 text-sm bg-black border border-gray-700 rounded-lg px-4 py-3">
                <div className="flex gap-1">
                  <span className="inline-block w-2 h-2 bg-orange-400 rounded-full animate-bounce [animation-delay:-0.3s]" />
                  <span className="inline-block w-2 h-2 bg-orange-400 rounded-full animate-bounce [animation-delay:-0.15s]" />
                  <span className="inline-block w-2 h-2 bg-orange-400 rounded-full animate-bounce" />
                </div>
                <span>AI is typing...</span>
              </div>
            </div>
          )}

          {/* Messages */}
          {displayMessages.map((m, idx) => {
            const isPRDArtifact = m.content.includes('✅ **PRD Generated**')
            const hasFollowupAfter = idx < displayMessages.length - 1
            // Auto-collapse PRD if there are messages after it
            const shouldCollapse = isPRDArtifact && hasFollowupAfter

            return (
              <PRDMessage
                key={m.id}
                message={m}
                isPRDArtifact={isPRDArtifact}
                shouldAutoCollapse={shouldCollapse}
                index={idx}
              />
            )
          })}

          {/* Phase components - animate after messages */}
          {(() => {
            const phaseDelay = displayMessages.length * 100
            return (
              <>
                {phase === 'audience' && <AudiencePhase animationDelay={phaseDelay} />}
                {phase === 'confirmIdea' && <ConfirmIdeaPhase animationDelay={phaseDelay} />}
                {phase === 'features' && <FeaturesPhase animationDelay={phaseDelay} />}
                {phase === 'providers' && <ProvidersPhase animationDelay={phaseDelay} />}
                {phase === 'integrations' && <IntegrationsPhase animationDelay={phaseDelay} />}
                {phase === 'summary' && <SummaryPhase animationDelay={phaseDelay} />}
                {phase === 'outputs' && <OutputsPhase animationDelay={phaseDelay} />}
              </>
            )
          })()}

          {/* Task indicator */}
          {currentTask && (
            <div className="mb-4">
              <div className="flex items-center gap-2 bg-gray-900 border border-gray-800 rounded-lg px-3 py-2 text-sm text-gray-300">
                <svg className="w-4 h-4 animate-spin text-orange-400" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span>{currentTask.label}</span>
              </div>
            </div>
          )}

          {/* Scroll anchor */}
          <div ref={endRef} />
        </ConversationContent>
      </Conversation>

      {/* Input form */}
      <div className="flex-none bg-black border-t border-gray-800 pt-4 px-12 pb-4">
        {uploadedImages.length > 0 && (
          <div className="flex gap-2 mb-3 flex-wrap">
            {uploadedImages.map(img => (
              <div key={img.id} className="relative group/img">
                <img src={img.url} alt="" className="h-20 w-20 object-cover rounded border border-gray-700" />
                <button
                  onClick={() => setUploadedImages(uploadedImages.filter(i => i.id !== img.id))}
                  className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full text-white text-xs opacity-0 group-hover/img:opacity-100 transition-opacity"
                >×</button>
              </div>
            ))}
          </div>
        )}
        <form onSubmit={onSubmit} className="relative">
          <div className="relative flex items-end gap-3 bg-gray-800/50 border border-gray-700 rounded-2xl p-4 focus-within:border-orange-500 focus-within:bg-gray-800 transition-all">
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              multiple
              className="hidden"
              onChange={(e) => {
                const files = Array.from(e.target.files || [])
                files.forEach(file => {
                  const reader = new FileReader()
                  reader.onload = () => {
                    setUploadedImages(prev => [...prev, { id: crypto.randomUUID(), url: reader.result as string }])
                  }
                  reader.readAsDataURL(file)
                })
                e.target.value = ''
              }}
            />
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="p-2 hover:bg-gray-700 rounded transition-colors"
              title="Upload image"
            >
              <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </button>
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={phase === 'intro' ? 'Describe your project idea in your own words…' : 'Type a message, paste an image, or ask me to search…'}
              disabled={isChatStreaming}
              className="flex-1 resize-none bg-transparent border-none outline-none text-white placeholder:text-gray-500 min-h-[60px] max-h-[200px] disabled:opacity-50"
              rows={2}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault()
                  if ((input?.trim() || uploadedImages.length > 0) && !isChatStreaming) onSubmit(e as any)
                }
              }}
              onPaste={(e) => {
                const items = e.clipboardData?.items
                if (!items) return
                for (let i = 0; i < items.length; i++) {
                  if (items[i].type.indexOf('image') !== -1) {
                    const blob = items[i].getAsFile()
                    if (blob) {
                      const reader = new FileReader()
                      reader.onload = () => {
                        setUploadedImages(prev => [...prev, { id: crypto.randomUUID(), url: reader.result as string }])
                      }
                      reader.readAsDataURL(blob)
                    }
                  }
                }
              }}
            />
            <Button
              type="submit"
              disabled={(!input?.trim() && uploadedImages.length === 0) || isChatStreaming}
              className="rounded-xl h-11 w-11 p-0 flex items-center justify-center bg-orange-500 hover:bg-orange-600 shrink-0"
            >
              <PaperPlaneIcon className="w-5 h-5" />
            </Button>
          </div>
          <p className="text-xs text-gray-400 mt-3 text-center">
            Press <kbd className="px-1.5 py-0.5 bg-gray-800 rounded text-xs">Enter</kbd> to send,{' '}
            <kbd className="px-1.5 py-0.5 bg-gray-800 rounded text-xs">Shift + Enter</kbd> for new line
          </p>
        </form>
      </div>
    </div>
  )
}

