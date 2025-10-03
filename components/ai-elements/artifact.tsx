'use client'

import { useState } from 'react'
import { cn } from '@/lib/utils'
import ReactMarkdown from 'react-markdown'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { vscDarkPlus } from 'react-syntax-highlighter/dist/cjs/styles/prism'

interface ArtifactProps extends React.HTMLAttributes<HTMLDivElement> {
  title: string
  type: 'code' | 'markdown' | 'text' | 'prd'
  content: string
  language?: string
  actions?: React.ReactNode
}

export function Artifact({
  title,
  type,
  content,
  language = 'typescript',
  actions,
  className,
  ...props
}: ArtifactProps) {
  const [isExpanded, setIsExpanded] = useState(true)
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    await navigator.clipboard.writeText(content)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div
      className={cn(
        'rounded-lg border border-gray-700 bg-gray-900/50 overflow-hidden',
        className
      )}
      {...props}
    >
      <div className="flex items-center justify-between px-4 py-2 bg-gray-800/50 border-b border-gray-700">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <svg
              className={cn('w-4 h-4 transition-transform', isExpanded && 'rotate-90')}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
          <span className="text-sm font-medium text-white">{title}</span>
          <span className="text-xs text-gray-500 uppercase">{type}</span>
        </div>
        <div className="flex items-center gap-2">
          {actions}
          <button
            onClick={handleCopy}
            className="text-xs text-gray-400 hover:text-white transition-colors px-2 py-1 rounded hover:bg-gray-700/50"
          >
            {copied ? 'Copied!' : 'Copy'}
          </button>
        </div>
      </div>

      {isExpanded && (
        <div className="max-h-[500px] overflow-auto">
          {type === 'code' && (
            <SyntaxHighlighter
              language={language}
              style={vscDarkPlus}
              customStyle={{
                margin: 0,
                padding: '1rem',
                background: 'transparent',
                fontSize: '0.875rem'
              }}
            >
              {content}
            </SyntaxHighlighter>
          )}

          {type === 'markdown' && (
            <div className="prose prose-invert max-w-none p-4">
              <ReactMarkdown>{content}</ReactMarkdown>
            </div>
          )}

          {type === 'prd' && (
            <div className="p-4 prose prose-invert max-w-none">
              <ReactMarkdown
                components={{
                  h1: ({node, ...props}) => <h1 className="text-2xl font-bold text-white mb-4" {...props} />,
                  h2: ({node, ...props}) => <h2 className="text-xl font-semibold text-white mb-3 mt-6" {...props} />,
                  h3: ({node, ...props}) => <h3 className="text-lg font-semibold text-white mb-2 mt-4" {...props} />,
                  p: ({node, ...props}) => <p className="text-gray-300 mb-3 leading-relaxed" {...props} />,
                  ul: ({node, ...props}) => <ul className="list-disc list-inside text-gray-300 mb-3 space-y-1" {...props} />,
                  ol: ({node, ...props}) => <ol className="list-decimal list-inside text-gray-300 mb-3 space-y-1" {...props} />,
                  code: ({node, inline, className, children, ...props}: any) => {
                    const match = /language-(\w+)/.exec(className || '')
                    return !inline && match ? (
                      <SyntaxHighlighter
                        language={match[1]}
                        style={vscDarkPlus}
                        customStyle={{
                          margin: '1rem 0',
                          borderRadius: '0.5rem',
                          fontSize: '0.875rem'
                        }}
                        {...props}
                      >
                        {String(children).replace(/\n$/, '')}
                      </SyntaxHighlighter>
                    ) : (
                      <code className="bg-gray-800 text-orange-400 px-1.5 py-0.5 rounded text-sm" {...props}>
                        {children}
                      </code>
                    )
                  }
                }}
              >
                {content}
              </ReactMarkdown>
            </div>
          )}

          {type === 'text' && (
            <div className="p-4 text-gray-300 whitespace-pre-wrap font-mono text-sm">
              {content}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
