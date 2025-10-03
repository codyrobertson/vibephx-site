import { create } from 'zustand'
import { devtools } from 'zustand/middleware'

export type Phase =
  | 'intro'
  | 'audience'
  | 'confirmIdea'
  | 'features'
  | 'providers'
  | 'stack'
  | 'integrations'
  | 'summary'
  | 'outputs'
  | 'final'

export type ChatMessage = {
  id: string
  role: 'user' | 'assistant'
  content: string
  images?: string[] // base64 data URLs
}

export type ProjectSuggestion = {
  emoji: string
  text: string
}

interface PRDState {
  // Session meta
  sessionId: string | null
  projectId: string | null

  // UI state
  phase: Phase
  messages: ChatMessage[]
  projectSuggestions: ProjectSuggestion[]
  isGeneratingSuggestions: boolean
  isGeneratingAutofill: boolean
  copied: boolean
  hasLoadedSession: boolean // Track if we've loaded a session to prevent flickering

  // User data
  name: string
  initialIntent: string
  audience: string
  motivation: string
  sda: string // Short Description of App
  timeframe?: string
  
  featuresRaw: string[]
  featuresMvp: string[]
  featuresStretch: string[]
  
  dbChoice: string
  selectedStack: string | null
  selectedIntegrations: string[]
  
  // Meta
  finalFollowupDone: boolean
  
  // Computed state
  isFreshProject: () => boolean
  shouldShowSuggestions: () => boolean

  // Actions
  setSessionId: (id: string) => void
  setProjectId: (id: string) => void
  setPhase: (phase: Phase) => void
  addMessage: (message: ChatMessage) => void
  addMessages: (messages: ChatMessage[]) => void
  setMessages: (messages: ChatMessage[]) => void
  setProjectSuggestions: (suggestions: ProjectSuggestion[]) => void
  setHasLoadedSession: (loaded: boolean) => void

  // Persistence
  saveToDatabase: () => Promise<void>
  loadFromDatabase: (sessionId: string) => Promise<void>
  loadProjectSuggestions: () => Promise<void>
  
  setName: (name: string) => void
  setInitialIntent: (intent: string) => void
  setAudience: (audience: string) => void
  setMotivation: (motivation: string) => void
  setSda: (sda: string) => void
  setTimeframe?: (timeframe: string) => void
  
  setFeaturesRaw: (features: string[]) => void
  addFeature: (feature: string) => void
  removeFeature: (index: number) => void
  setFeaturesMvp: (features: string[]) => void
  setFeaturesStretch: (features: string[]) => void
  
  setDbChoice: (db: string) => void
  setSelectedStack: (stack: string) => void
  toggleIntegration: (id: string) => void
  
  setIsGeneratingSuggestions: (val: boolean) => void
  setIsGeneratingAutofill: (val: boolean) => void
  setCopied: (val: boolean) => void
  setFinalFollowupDone: (val: boolean) => void

  // Reset
  reset: () => void
}

const initialState = {
  sessionId: null,
  projectId: null,
  phase: 'intro' as Phase,
  messages: [],
  projectSuggestions: [],
  isGeneratingSuggestions: false,
  hasLoadedSession: false,
  isGeneratingAutofill: false,
  copied: false,
  
  name: '',
  initialIntent: '',
  audience: '',
  motivation: '',
  sda: '',
  timeframe: '1 day',
  
  featuresRaw: [],
  featuresMvp: [],
  featuresStretch: [],
  
  dbChoice: 'Neon',
  selectedStack: null,
  selectedIntegrations: [],
  
  finalFollowupDone: false
}

export const usePRDStore = create<PRDState>()(
  devtools(
    (set, get) => ({
      ...initialState,
      
      // Session
      setSessionId: (sessionId) => set({ sessionId }),
      setProjectId: (projectId) => set({ projectId }),
      
      // Phase
      setPhase: (phase) => set({ phase }),
      
      // Messages
      addMessage: (message) => set((state) => ({ messages: [...state.messages, message] })),
      addMessages: (messages) => set((state) => ({ messages: [...state.messages, ...messages] })),
      setMessages: (messages) => set({ messages }),
      setProjectSuggestions: (projectSuggestions) => set({ projectSuggestions }),
      setHasLoadedSession: (hasLoadedSession) => set({ hasLoadedSession }),

      // Computed state
      isFreshProject: () => {
        const state = get()
        return !state.sessionId && !state.initialIntent && state.messages.length === 0 && state.phase === 'intro'
      },
      shouldShowSuggestions: () => {
        const state = get()
        // Only show suggestions if:
        // 1. We're in intro phase
        // 2. No messages exist
        // 3. We haven't loaded a session (prevents flickering during load)
        return state.phase === 'intro' && state.messages.length === 0 && !state.hasLoadedSession
      },
      
      // User data
      setName: (name) => set({ name }),
      setInitialIntent: (initialIntent) => set({ initialIntent }),
      setAudience: (audience) => set({ audience }),
      setMotivation: (motivation) => set({ motivation }),
      setSda: (sda) => set({ sda }),
      setTimeframe: (timeframe) => set({ timeframe }),
      
      // Features
      setFeaturesRaw: (featuresRaw) => set({ featuresRaw }),
      addFeature: (feature) => set((state) => ({ 
        featuresRaw: state.featuresRaw.includes(feature) 
          ? state.featuresRaw 
          : [...state.featuresRaw, feature] 
      })),
      removeFeature: (index) => set((state) => ({ 
        featuresRaw: state.featuresRaw.filter((_, i) => i !== index) 
      })),
      setFeaturesMvp: (featuresMvp) => set({ featuresMvp }),
      setFeaturesStretch: (featuresStretch) => set({ featuresStretch }),
      
      // Stack & Integrations
      setDbChoice: (dbChoice) => set({ dbChoice }),
      setSelectedStack: (selectedStack) => set({ selectedStack }),
      toggleIntegration: (id) => set((state) => ({
        selectedIntegrations: state.selectedIntegrations.includes(id)
          ? state.selectedIntegrations.filter(x => x !== id)
          : [...state.selectedIntegrations, id]
      })),
      
      // Flags
      setIsGeneratingSuggestions: (isGeneratingSuggestions) => set({ isGeneratingSuggestions }),
      setIsGeneratingAutofill: (isGeneratingAutofill) => set({ isGeneratingAutofill }),
      setCopied: (copied) => set({ copied }),
      setFinalFollowupDone: (finalFollowupDone) => set({ finalFollowupDone }),
      
      // Persistence
      saveToDatabase: async () => {
        const state = get()
        
        // Cache session to localStorage for instant resume
        if (state.sessionId && typeof window !== 'undefined') {
          try {
            const CACHE_KEY = `prd_session_${state.sessionId}`
            const cacheData = {
              id: state.sessionId,
              projectId: state.projectId,
              initialIntent: state.initialIntent,
              audience: state.audience,
              motivation: state.motivation,
              sda: state.sda,
              featuresRaw: state.featuresRaw,
              featuresMvp: state.featuresMvp,
              featuresStretch: state.featuresStretch,
              dbChoice: state.dbChoice,
              selectedStack: state.selectedStack,
              integrations: state.selectedIntegrations,
              phase: state.phase,
              messages: state.messages.slice(-50) // Limit to last 50 messages to prevent quota exceeded
            }

            // Clean up old sessions (keep only last 5)
            const allKeys = Object.keys(localStorage).filter(k => k.startsWith('prd_session_'))
            if (allKeys.length > 5) {
              allKeys.slice(0, allKeys.length - 5).forEach(k => {
                try { localStorage.removeItem(k) } catch {}
              })
            }

            localStorage.setItem(CACHE_KEY, JSON.stringify(cacheData))
          } catch (err) {
            // Handle quota exceeded error
            console.warn('localStorage quota exceeded, clearing old sessions')
            try {
              const allKeys = Object.keys(localStorage).filter(k => k.startsWith('prd_session_'))
              allKeys.slice(0, Math.max(1, allKeys.length - 2)).forEach(k => {
                try { localStorage.removeItem(k) } catch {}
              })
              // Retry with limited data
              const CACHE_KEY = `prd_session_${state.sessionId}`
              localStorage.setItem(CACHE_KEY, JSON.stringify({
                id: state.sessionId,
                projectId: state.projectId,
                phase: state.phase,
                messages: state.messages.slice(-20) // Even more limited
              }))
            } catch {}
          }
        }
        
        // Auto-create project if doesn't exist
        if (!state.projectId && state.initialIntent) {
          try {
            // Generate a concise AI title
            let aiTitle = state.sda || state.initialIntent
            if (!state.sda && state.initialIntent) {
              try {
                const titleRes = await fetch('/api/prd/inference', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({
                    messages: [{ role: 'user', content: `Shorten this to a 3-5 word project title:\n"${state.initialIntent}"` }],
                    purpose: 'generate_project_title',
                    stream: false
                  })
                })
                if (titleRes.ok) {
                  const data = await titleRes.json()
                  aiTitle = data.content?.trim() || aiTitle
                }
              } catch {}
            }
            const projectRes = await fetch('/api/projects', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                title: aiTitle,
                description: state.motivation || state.initialIntent,
                customIdea: state.initialIntent,
                status: 'DRAFT'
              })
            })
            if (projectRes.ok) {
              const projectData = await projectRes.json()
              set({ projectId: projectData.project.id })
            }
          } catch (err) {
            console.error('Failed to create project:', err)
          }
        }
        
        try {
          const payload = {
            sessionId: state.sessionId,
            projectId: state.projectId || get().projectId,
            initialIntent: state.initialIntent,
            audience: state.audience,
            motivation: state.motivation,
            sda: state.sda,
            featuresRaw: state.featuresRaw,
            featuresMvp: state.featuresMvp,
            featuresStretch: state.featuresStretch,
            dbChoice: state.dbChoice,
            selectedStack: state.selectedStack,
            integrations: state.selectedIntegrations,
            phase: state.phase,
            messages: state.messages,
            completed: state.phase === 'final'
          }

          // Log save attempt for debugging
          console.log('[PRD Save] Saving session:', {
            sessionId: payload.sessionId,
            phase: payload.phase,
            messageCount: payload.messages.length,
            hasProjectId: !!payload.projectId
          })

          const res = await fetch('/api/prd/session', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
          })

          if (!res.ok) {
            const errorData = await res.json().catch(() => ({}))
            console.error('[PRD Save] Failed:', res.status, errorData)
            throw new Error(`Save failed: ${res.status} ${errorData.error || ''}`)
          }

          const data = await res.json()
          console.log('[PRD Save] Success:', {
            sessionId: data.session?.id,
            wasNewSession: !state.sessionId && !!data.session?.id
          })

          if (data.session?.id && !state.sessionId) {
            set({ sessionId: data.session.id })
          }
        } catch (err) {
          console.error('[PRD Save] Error:', err)
        }
      },
      
      loadFromDatabase: async (sessionId: string) => {
        // Immediately mark that we're loading a session to prevent flickering
        set({ hasLoadedSession: true })

        try {
          // Try cache first for instant load
          const CACHE_KEY = `prd_session_${sessionId}`
          const cached = typeof window !== 'undefined' ? localStorage.getItem(CACHE_KEY) : null
          if (cached) {
            try {
              const session = JSON.parse(cached)
              set({
                sessionId: session.id,
                projectId: session.projectId,
                initialIntent: session.initialIntent,
                audience: session.audience || '',
                motivation: session.motivation || '',
                sda: session.sda || '',
                featuresRaw: session.featuresRaw || [],
                featuresMvp: session.featuresMvp || [],
                featuresStretch: session.featuresStretch || [],
                dbChoice: session.dbChoice || 'Neon',
                selectedStack: session.selectedStack,
                selectedIntegrations: session.integrations || [],
                phase: (session.phase as Phase) || 'intro',
                messages: (session.messages as ChatMessage[]) || [],
                hasLoadedSession: true
              })
            } catch {}
          }
          
          // Fetch fresh data in background
          const res = await fetch(`/api/prd/session?id=${sessionId}`, { cache: 'no-store' })
          if (!res.ok) throw new Error('Load failed')
          
          const data = await res.json()
          const session = data.session
          
          if (session) {
            // Update cache
            if (typeof window !== 'undefined') {
              try {
                localStorage.setItem(CACHE_KEY, JSON.stringify(session))
              } catch {}
            }
            set({
              sessionId: session.id,
              projectId: session.projectId,
              initialIntent: session.initialIntent,
              audience: session.audience || '',
              motivation: session.motivation || '',
              sda: session.sda || '',
              featuresRaw: session.featuresRaw || [],
              featuresMvp: session.featuresMvp || [],
              featuresStretch: session.featuresStretch || [],
              dbChoice: session.dbChoice || 'Neon',
              selectedStack: session.selectedStack,
              selectedIntegrations: session.integrations || [],
              phase: (session.phase as Phase) || 'intro',
              messages: (session.messages as ChatMessage[]) || [],
              hasLoadedSession: true
            })
          }
        } catch (err) {
          console.error('Failed to load session:', err)
          throw err
        }
      },

      loadProjectSuggestions: async () => {
        const CACHE_KEY = 'prd_project_suggestions_v1'
        const SUGGESTIONS_TTL_MS = 12 * 60 * 60 * 1000 // 12 hours

        // Try cache first
        if (typeof window !== 'undefined') {
          try {
            const raw = localStorage.getItem(CACHE_KEY)
            if (raw) {
              const { ts, data } = JSON.parse(raw)
              if (Date.now() - ts < SUGGESTIONS_TTL_MS) {
                set({ projectSuggestions: data })
                return
              }
            }
          } catch {}
        }

        // Load from API
        try {
          const res = await fetch('/api/user/project-suggestions', {
            method: 'POST',
            cache: 'no-store'
          })
          if (res.ok) {
            const data = await res.json()
            const suggestions = (data.suggestions || []).slice(0, 4)
            set({ projectSuggestions: suggestions })

            // Cache for next time
            if (typeof window !== 'undefined') {
              try {
                localStorage.setItem(CACHE_KEY, JSON.stringify({
                  ts: Date.now(),
                  data: suggestions
                }))
              } catch {}
            }
          } else {
            // Use defaults on error
            throw new Error('API failed')
          }
        } catch (err) {
          const defaults = [
            { emoji: '🧱', text: 'PRD generator for workshops' },
            { emoji: '📋', text: 'Viral waitlist landing page' },
            { emoji: '📊', text: 'CRM dashboard with sales tracking' },
            { emoji: '📅', text: 'Booking system with calendar sync' }
          ]
          set({ projectSuggestions: defaults })

          if (typeof window !== 'undefined') {
            try {
              localStorage.setItem(CACHE_KEY, JSON.stringify({
                ts: Date.now(),
                data: defaults
              }))
            } catch {}
          }
        }
      },
      
      // Reset
      reset: () => set(initialState)
    }),
    { name: 'PRDStore' }
  )
)

