'use client'

import React from 'react'
import { Card } from '@/components/ui/Card'

interface CodeSnippetCardProps {
  title: string
  fileName: string
  code: string
  icon?: React.ReactNode
}

export function CodeSnippetCard({ title, fileName, code, icon }: CodeSnippetCardProps) {
  // Get first 10 lines of code for display
  const displayCode = code.split('\n').slice(0, 10).join('\n')
  
  return (
    <Card className="w-80 h-64 bg-gray-900/95 border-gray-700 hover:border-orange-500/50 transition-colors duration-300 group overflow-hidden">
      <div className="p-4 h-full flex flex-col">
        {/* Header */}
        <div className="flex items-center gap-2 mb-3 min-h-0">
          {icon && <div className="text-orange-400 flex-shrink-0">{icon}</div>}
          <div className="min-w-0">
            <h3 className="font-semibold text-white text-sm truncate">{title}</h3>
            <p className="text-gray-400 text-xs truncate">{fileName}</p>
          </div>
        </div>
        
        {/* Code Preview */}
        <div className="flex-1 bg-black/50 rounded border border-gray-800 p-3 overflow-hidden">
          <pre className="text-xs text-gray-300 font-mono leading-relaxed overflow-hidden">
            <code>{displayCode}</code>
          </pre>
        </div>
        
        {/* Overlay gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-gray-900/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        
        {/* Live indicator */}
        <div className="absolute top-2 right-2 w-2 h-2 bg-green-400 rounded-full animate-pulse" />
      </div>
    </Card>
  )
}