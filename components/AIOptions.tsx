'use client'

import { useState } from 'react'

interface AIOptionsProps {
  title: string
  content: string
}

export function AIOptions({ title, content }: AIOptionsProps) {
  const [copied, setCopied] = useState(false)

  const handleCopyMarkdown = async () => {
    const markdown = `# ${title}\n\n${content}`
    await navigator.clipboard.writeText(markdown)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="mb-6 overflow-hidden rounded-lg border border-gray-800 bg-gray-900/30 shadow-sm">
      <div className="border-b border-gray-800 bg-gray-800/50 px-5 py-4">
        <h3 className="flex items-center text-sm font-semibold text-white">
          <svg className="mr-2.5 h-3.5 w-3.5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
          </svg>
          AI Assistant Options
        </h3>
      </div>
      <div className="p-5">
        <div className="space-y-3">
          <p className="text-sm text-gray-400">
            Use this content with your favorite AI assistant
          </p>
          <div className="flex flex-col space-y-2">
            <button
              onClick={handleCopyMarkdown}
              className="w-full flex items-center justify-between px-4 py-2 bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 rounded-lg transition-colors text-sm"
            >
              {copied ? 'Copied!' : 'Copy as Markdown'}
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
            </button>
            <a
              href="https://chat.openai.com"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full flex items-center justify-between px-4 py-2 bg-green-500/10 hover:bg-green-500/20 text-green-400 rounded-lg transition-colors text-sm"
            >
              Open ChatGPT
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
            </a>
            <a
              href="https://claude.ai"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full flex items-center justify-between px-4 py-2 bg-purple-500/10 hover:bg-purple-500/20 text-purple-400 rounded-lg transition-colors text-sm"
            >
              Open Claude
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
