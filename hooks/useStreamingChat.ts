"use client"

import { useCallback, useMemo, useRef, useState } from 'react'

export type ChatMessage = { id: string; role: 'user' | 'assistant'; content: string }

export function useStreamingChat(api: string = '/api/chat-plain', additionalBody?: Record<string, any>) {
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [status, setStatus] = useState<'ready' | 'streaming'>('ready')
  const [error, setError] = useState<Error | null>(null)
  const controllerRef = useRef<AbortController | null>(null)

  const send = useCallback(async (text: string) => {
    if (!text.trim() || status !== 'ready') return
    setError(null)
    const userMsg: ChatMessage = { id: crypto.randomUUID(), role: 'user', content: text }
    const aiMsg: ChatMessage = { id: crypto.randomUUID(), role: 'assistant', content: '' }

    let messagesToSend: ChatMessage[] = []
    setMessages((prev) => {
      messagesToSend = [...prev, userMsg]
      return [...prev, userMsg, aiMsg]
    })

    const controller = new AbortController()
    controllerRef.current = controller
    setStatus('streaming')

    try {
      const res = await fetch(api, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: messagesToSend, ...additionalBody }),
        signal: controller.signal,
      })

      if (!res.ok || !res.body) {
        const textBody = await res.text().catch(() => '')
        throw new Error(textBody || `HTTP ${res.status}`)
      }

      const reader = res.body.getReader()
      const decoder = new TextDecoder()
      while (true) {
        const { value, done } = await reader.read()
        if (done) break
        const chunk = decoder.decode(value, { stream: true })
        setMessages((prev) => prev.map((m) => (m.id === aiMsg.id ? { ...m, content: m.content + chunk } : m)))
      }
    } catch (err: any) {
      if (err.name !== 'AbortError') {
        setError(err instanceof Error ? err : new Error(String(err)))
      }
    } finally {
      setStatus('ready')
      controllerRef.current = null
    }
  }, [api, status, additionalBody])

  const stop = useCallback(() => {
    controllerRef.current?.abort()
    setStatus('ready')
  }, [])

  return useMemo(() => ({ messages, send, stop, status, error, setMessages }), [messages, send, stop, status, error])
}


