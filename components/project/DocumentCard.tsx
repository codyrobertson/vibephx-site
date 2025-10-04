'use client'

import { useState } from 'react'
import { FileText, Code, Book, Bookmark, BookmarkCheck, MoreVertical } from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'
import type { DocumentType } from '@prisma/client'

interface DocumentCardProps {
  document: {
    id: string
    type: DocumentType
    title: string
    excerpt: string | null
    isBookmarked: boolean
    bookmarkedAt: Date | null
    generatedBy: string | null
    tags: string[]
    createdAt: Date
    updatedAt: Date
  }
  onClick: () => void
  onBookmarkToggle?: (id: string, isBookmarked: boolean) => void
  className?: string
}

export function DocumentCard({ document, onClick, onBookmarkToggle, className = '' }: DocumentCardProps) {
  const [isTogglingBookmark, setIsTogglingBookmark] = useState(false)

  const handleBookmarkToggle = async (e: React.MouseEvent) => {
    e.stopPropagation() // Prevent card click
    if (!onBookmarkToggle || isTogglingBookmark) return

    setIsTogglingBookmark(true)
    try {
      await onBookmarkToggle(document.id, !document.isBookmarked)
    } finally {
      setIsTogglingBookmark(false)
    }
  }

  return (
    <div
      onClick={onClick}
      className={`group relative rounded-xl border border-gray-800 bg-gray-900/30 p-4 hover:bg-gray-800/40 hover:border-gray-700 transition-all cursor-pointer ${className}`}
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex items-center gap-2 flex-1 min-w-0">
          {/* Icon based on document type */}
          <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-gray-800/50 flex items-center justify-center">
            {getDocumentIcon(document.type)}
          </div>

          {/* Title */}
          <h3 className="text-sm font-semibold text-white truncate flex-1">
            {document.title}
          </h3>
        </div>

        {/* Bookmark button */}
        <button
          onClick={handleBookmarkToggle}
          disabled={isTogglingBookmark}
          className={`flex-shrink-0 p-1.5 rounded-lg transition-colors ${
            document.isBookmarked
              ? 'text-orange-500 hover:text-orange-400'
              : 'text-gray-500 hover:text-gray-300 opacity-0 group-hover:opacity-100'
          }`}
          title={document.isBookmarked ? 'Remove bookmark' : 'Bookmark document'}
        >
          {document.isBookmarked ? (
            <BookmarkCheck className="w-4 h-4" />
          ) : (
            <Bookmark className="w-4 h-4" />
          )}
        </button>
      </div>

      {/* Excerpt */}
      {document.excerpt && (
        <p className="text-sm text-gray-400 leading-relaxed mb-3 line-clamp-3">
          {document.excerpt}
        </p>
      )}

      {/* Footer */}
      <div className="flex items-center justify-between gap-2">
        {/* Tags */}
        {document.tags && document.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 flex-1 min-w-0">
            {document.tags.slice(0, 2).map((tag, i) => (
              <span
                key={i}
                className="px-2 py-0.5 bg-gray-800 text-gray-400 rounded text-xs truncate max-w-[100px]"
              >
                {tag}
              </span>
            ))}
            {document.tags.length > 2 && (
              <span className="px-2 py-0.5 text-gray-500 text-xs">
                +{document.tags.length - 2}
              </span>
            )}
          </div>
        )}

        {/* Metadata */}
        <div className="flex items-center gap-2 text-xs text-gray-500">
          {/* Document type badge */}
          <span className="px-2 py-0.5 bg-gray-800/50 rounded uppercase">
            {document.type.toLowerCase().replace('_', ' ')}
          </span>

          {/* Timestamp */}
          <span className="hidden sm:inline">
            {formatDistanceToNow(new Date(document.createdAt), { addSuffix: true })}
          </span>
        </div>
      </div>

      {/* Hover indicator */}
      <div className="absolute inset-0 border border-orange-500/0 group-hover:border-orange-500/20 rounded-xl transition-colors pointer-events-none" />
    </div>
  )
}

function getDocumentIcon(type: DocumentType) {
  switch (type) {
    case 'CODE':
      return <Code className="w-4 h-4 text-blue-400" />
    case 'PRD':
    case 'SPEC':
    case 'BUILD_DOC':
      return <FileText className="w-4 h-4 text-green-400" />
    case 'GUIDE':
    case 'MARKDOWN':
      return <Book className="w-4 h-4 text-purple-400" />
    default:
      return <FileText className="w-4 h-4 text-gray-400" />
  }
}
