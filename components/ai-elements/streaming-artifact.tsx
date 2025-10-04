'use client'

import { useState } from 'react'
import { cn } from '@/lib/utils'
import { ChevronDown, ChevronUp, Loader2 } from 'lucide-react'

interface StreamingArtifactProps extends React.HTMLAttributes<HTMLDivElement> {
  title: string
  content: string
  isStreaming: boolean
  actions?: React.ReactNode
}

export function StreamingArtifact({
  title,
  content,
  isStreaming,
  actions,
  className,
  ...props
}: StreamingArtifactProps) {
  const [isExpanded, setIsExpanded] = useState(false)

  // Show first ~300 characters when collapsed
  const collapsedContent = content.slice(0, 300)
  const displayContent = isExpanded ? content : collapsedContent

  return (
    <div
      className={cn(
        'rounded-xl border border-gray-700 bg-gray-900/60 overflow-hidden transition-all',
        className
      )}
      {...props}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 bg-gray-800/50 border-b border-gray-700">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-gray-400 hover:text-white transition-colors"
            disabled={isStreaming && !content}
          >
            {isExpanded ? (
              <ChevronUp className="w-4 h-4" />
            ) : (
              <ChevronDown className="w-4 h-4" />
            )}
          </button>
          <span className="text-sm font-semibold text-white">{title}</span>
          {isStreaming && (
            <div className="flex items-center gap-2 text-orange-400">
              <Loader2 className="w-3 h-3 animate-spin" />
              <span className="text-xs font-medium">Generating...</span>
            </div>
          )}
        </div>
        {/* Always reserve space for actions to prevent layout shift */}
        <div className="flex items-center gap-2 min-h-[32px]">
          {!isStreaming && actions}
        </div>
      </div>

      {/* Collapsed Preview */}
      {!isExpanded && (
        <div className="relative">
          <div className="p-6 text-gray-300 text-sm leading-relaxed whitespace-pre-wrap font-mono h-32 overflow-hidden">
            {displayContent || 'Starting generation...'}
          </div>
          {/* Gradient mask */}
          <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-gray-900/90 via-gray-900/60 to-transparent pointer-events-none" />
          {/* Only show expand button when not streaming and content is long enough */}
          {!isStreaming && content.length > 300 && (
            <div className="absolute bottom-2 left-0 right-0 text-center">
              <button
                onClick={() => setIsExpanded(true)}
                className="text-xs text-orange-400 hover:text-orange-300 font-medium transition-colors"
              >
                Show full document
              </button>
            </div>
          )}
        </div>
      )}

      {/* Expanded Content */}
      {isExpanded && (
        <div className="p-6 max-h-[600px] overflow-auto">
          <div className="text-gray-300 text-sm leading-relaxed whitespace-pre-wrap font-mono">
            {content || 'Starting generation...'}
          </div>
        </div>
      )}
    </div>
  )
}
