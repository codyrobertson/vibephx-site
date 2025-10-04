'use client'

import { useState, useEffect } from 'react'
import { Download, Copy, BookmarkCheck, Bookmark, Check, FileText, History, RotateCcw, ChevronDown, ChevronRight } from 'lucide-react'
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from '@/components/ui/sheet'
import { Button } from '@/components/ui/button'
import { Response } from '@/components/ai-elements/response'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { vscDarkPlus } from 'react-syntax-highlighter/dist/cjs/styles/prism'
import { formatDistanceToNow } from 'date-fns'
import type { DocumentType } from '@prisma/client'

interface RelatedDocument {
  id: string
  type: DocumentType
  title: string
  excerpt: string | null
  isBookmarked: boolean
  tags: string[]
  createdAt: Date
  similarity: number
}

interface DocumentVersion {
  id: string
  version: number
  title: string
  changeMessage: string | null
  createdBy: string | null
  restoredFrom: number | null
  createdAt: Date
}

interface DocumentSheetProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  document: {
    id: string
    type: DocumentType
    title: string
    content: string
    isBookmarked: boolean
    bookmarkedAt: Date | null
    generatedBy: string | null
    tags: string[]
    createdAt: Date
    updatedAt: Date
  } | null
  projectId: string
  onBookmarkToggle?: (id: string, isBookmarked: boolean) => void
  onDocumentClick?: (docId: string) => void
}

export function DocumentSheet({ open, onOpenChange, document, projectId, onBookmarkToggle, onDocumentClick }: DocumentSheetProps) {
  const [copied, setCopied] = useState(false)
  const [downloading, setDownloading] = useState(false)
  const [togglingBookmark, setTogglingBookmark] = useState(false)
  const [relatedDocs, setRelatedDocs] = useState<RelatedDocument[]>([])
  const [loadingRelated, setLoadingRelated] = useState(false)
  const [versions, setVersions] = useState<DocumentVersion[]>([])
  const [loadingVersions, setLoadingVersions] = useState(false)
  const [versionsExpanded, setVersionsExpanded] = useState(false)
  const [restoringVersion, setRestoringVersion] = useState<number | null>(null)

  // Fetch related documents when document changes
  useEffect(() => {
    async function fetchRelatedDocs() {
      if (!document || !open) return

      setLoadingRelated(true)
      try {
        const res = await fetch(`/api/projects/${projectId}/documents/${document.id}/related?limit=5`)
        if (res.ok) {
          const data = await res.json()
          setRelatedDocs(data.related || [])
        }
      } catch (error) {
        console.error('Failed to fetch related documents:', error)
      } finally {
        setLoadingRelated(false)
      }
    }

    fetchRelatedDocs()
  }, [document?.id, projectId, open])

  // Fetch version history when expanded
  useEffect(() => {
    async function fetchVersions() {
      if (!document || !open || !versionsExpanded) return

      setLoadingVersions(true)
      try {
        const res = await fetch(`/api/projects/${projectId}/documents/${document.id}/versions`)
        if (res.ok) {
          const data = await res.json()
          setVersions(data.versions || [])
        }
      } catch (error) {
        console.error('Failed to fetch versions:', error)
      } finally {
        setLoadingVersions(false)
      }
    }

    fetchVersions()
  }, [document?.id, projectId, open, versionsExpanded])

  if (!document) return null

  const handleCopy = async () => {
    await navigator.clipboard.writeText(document.content)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleDownload = () => {
    setDownloading(true)
    try {
      const extension = getFileExtension(document.type)
      const mimeType = getMimeType(document.type)
      const blob = new Blob([document.content], { type: mimeType })
      const url = URL.createObjectURL(blob)
      const a = window.document.createElement('a')
      a.href = url
      a.download = `${document.title}${extension}`
      window.document.body.appendChild(a)
      a.click()
      window.document.body.removeChild(a)
      URL.revokeObjectURL(url)
    } finally {
      setDownloading(false)
    }
  }

  const handleBookmarkToggle = async () => {
    if (!onBookmarkToggle || togglingBookmark) return

    setTogglingBookmark(true)
    try {
      await onBookmarkToggle(document.id, !document.isBookmarked)
    } finally {
      setTogglingBookmark(false)
    }
  }

  const handleRestoreVersion = async (versionNum: number) => {
    if (restoringVersion || !document) return

    const confirmed = confirm(`Are you sure you want to restore version ${versionNum}? This will create a new version with the restored content.`)
    if (!confirmed) return

    setRestoringVersion(versionNum)
    try {
      const res = await fetch(`/api/projects/${projectId}/documents/${document.id}/versions/${versionNum}`, {
        method: 'POST'
      })

      if (res.ok) {
        // Reload the document to show restored content
        if (onDocumentClick) {
          onDocumentClick(document.id)
        }
        // Reload version history
        setVersionsExpanded(false)
        setTimeout(() => setVersionsExpanded(true), 100)
      }
    } catch (error) {
      console.error('Failed to restore version:', error)
      alert('Failed to restore version. Please try again.')
    } finally {
      setRestoringVersion(null)
    }
  }

  const isCodeType = document.type === 'CODE'
  const isMarkdownType = ['PRD', 'MARKDOWN', 'SPEC', 'GUIDE', 'BUILD_DOC', 'ARTIFACT'].includes(document.type)

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-full sm:max-w-2xl lg:max-w-4xl bg-gray-950 border-gray-800 overflow-y-auto">
        <SheetHeader className="space-y-3 pb-4 border-b border-gray-800">
          <div className="flex items-start justify-between gap-4">
            <SheetTitle className="text-xl font-semibold text-white flex-1">
              {document.title}
            </SheetTitle>

            {/* Action buttons */}
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleBookmarkToggle}
                disabled={togglingBookmark}
                className={`border-gray-700 ${
                  document.isBookmarked
                    ? 'text-orange-500 hover:text-orange-400 border-orange-500/50'
                    : 'text-gray-300 hover:text-white'
                }`}
              >
                {document.isBookmarked ? (
                  <BookmarkCheck className="w-4 h-4" />
                ) : (
                  <Bookmark className="w-4 h-4" />
                )}
              </Button>

              <Button
                variant="outline"
                size="sm"
                onClick={handleCopy}
                className="border-gray-700 text-gray-300 hover:border-orange-500"
              >
                {copied ? <Check className="w-4 h-4 mr-1" /> : <Copy className="w-4 h-4 mr-1" />}
                {copied ? 'Copied!' : 'Copy'}
              </Button>

              <Button
                variant="outline"
                size="sm"
                onClick={handleDownload}
                disabled={downloading}
                className="border-gray-700 text-gray-300 hover:border-orange-500"
              >
                <Download className="w-4 h-4 mr-1" />
                Download
              </Button>
            </div>
          </div>

          {/* Metadata */}
          <SheetDescription className="flex flex-wrap items-center gap-3 text-sm text-gray-400">
            <span className="px-2 py-0.5 bg-gray-800 rounded uppercase text-xs">
              {document.type.toLowerCase().replace('_', ' ')}
            </span>

            <span>
              Created {formatDistanceToNow(new Date(document.createdAt), { addSuffix: true })}
            </span>

            {document.generatedBy && (
              <span>Generated by {document.generatedBy}</span>
            )}
          </SheetDescription>

          {/* Tags */}
          {document.tags && document.tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {document.tags.map((tag, i) => (
                <span
                  key={i}
                  className="px-2 py-1 bg-gray-800 text-gray-300 rounded text-xs"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
        </SheetHeader>

        {/* Content */}
        <div className="py-6">
          {isCodeType ? (
            <SyntaxHighlighter
              language="typescript"
              style={vscDarkPlus}
              customStyle={{
                margin: 0,
                padding: '1rem',
                background: 'rgb(17 24 39)',
                borderRadius: '0.5rem',
                fontSize: '0.875rem'
              }}
            >
              {document.content}
            </SyntaxHighlighter>
          ) : isMarkdownType ? (
            <div className="prose prose-invert max-w-none">
              <Response>{document.content}</Response>
            </div>
          ) : (
            <div className="whitespace-pre-wrap font-mono text-sm text-gray-300 bg-gray-900 p-4 rounded-lg">
              {document.content}
            </div>
          )}
        </div>

        {/* Version History */}
        <div className="border-t border-gray-800 pt-6 pb-4">
          <button
            onClick={() => setVersionsExpanded(!versionsExpanded)}
            className="w-full flex items-center justify-between text-sm font-semibold text-white hover:text-orange-500 transition-colors"
          >
            <div className="flex items-center gap-2">
              <History className="w-4 h-4 text-orange-500" />
              Version History
              {versions.length > 0 && (
                <span className="px-1.5 py-0.5 bg-gray-800 rounded text-xs text-gray-400">
                  {versions.length}
                </span>
              )}
            </div>
            {versionsExpanded ? (
              <ChevronDown className="w-4 h-4" />
            ) : (
              <ChevronRight className="w-4 h-4" />
            )}
          </button>

          {versionsExpanded && (
            <div className="mt-3 space-y-2">
              {loadingVersions ? (
                <div className="text-sm text-gray-400">Loading versions...</div>
              ) : versions.length > 0 ? (
                versions.map((version) => (
                  <div
                    key={version.id}
                    className="p-3 bg-gray-900/50 border border-gray-800 rounded-lg"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="px-1.5 py-0.5 bg-orange-500/20 text-orange-500 rounded text-xs font-mono">
                            v{version.version}
                          </span>
                          {version.restoredFrom && (
                            <span className="px-1.5 py-0.5 bg-blue-500/20 text-blue-400 rounded text-xs">
                              Restored from v{version.restoredFrom}
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-white mb-1">{version.title}</p>
                        {version.changeMessage && (
                          <p className="text-xs text-gray-400 italic">{version.changeMessage}</p>
                        )}
                        <div className="text-xs text-gray-500 mt-1">
                          {version.createdBy && <span>{version.createdBy} • </span>}
                          {formatDistanceToNow(new Date(version.createdAt), { addSuffix: true })}
                        </div>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleRestoreVersion(version.version)}
                        disabled={restoringVersion === version.version}
                        className="border-gray-700 text-gray-300 hover:border-orange-500 flex-shrink-0"
                      >
                        <RotateCcw className="w-3.5 h-3.5 mr-1" />
                        {restoringVersion === version.version ? 'Restoring...' : 'Restore'}
                      </Button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-sm text-gray-400">No version history available</div>
              )}
            </div>
          )}
        </div>

        {/* Related Documents */}
        {relatedDocs.length > 0 && (
          <div className="border-t border-gray-800 pt-6 pb-4">
            <h3 className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
              <FileText className="w-4 h-4 text-orange-500" />
              Related Documents
            </h3>

            <div className="space-y-2">
              {relatedDocs.map((relatedDoc) => (
                <button
                  key={relatedDoc.id}
                  onClick={() => onDocumentClick?.(relatedDoc.id)}
                  className="w-full text-left p-3 bg-gray-900/50 hover:bg-gray-900 border border-gray-800 hover:border-orange-500/50 rounded-lg transition-all group"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="text-sm font-medium text-white group-hover:text-orange-500 transition-colors truncate">
                          {relatedDoc.title}
                        </h4>
                        <span className="px-1.5 py-0.5 bg-gray-800 rounded text-xs text-gray-400 uppercase flex-shrink-0">
                          {relatedDoc.type.toLowerCase().replace('_', ' ')}
                        </span>
                      </div>
                      {relatedDoc.excerpt && (
                        <p className="text-xs text-gray-400 line-clamp-2">
                          {relatedDoc.excerpt}
                        </p>
                      )}
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      {relatedDoc.isBookmarked && (
                        <BookmarkCheck className="w-3.5 h-3.5 text-orange-500" />
                      )}
                      <span className="text-xs font-mono text-orange-500">
                        {Math.round(relatedDoc.similarity * 100)}%
                      </span>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Loading state for related documents */}
        {loadingRelated && (
          <div className="border-t border-gray-800 pt-6 pb-4">
            <div className="text-sm text-gray-400">Loading related documents...</div>
          </div>
        )}
      </SheetContent>
    </Sheet>
  )
}

function getFileExtension(type: DocumentType): string {
  switch (type) {
    case 'CODE':
      return '.ts'
    case 'PRD':
    case 'SPEC':
    case 'GUIDE':
    case 'BUILD_DOC':
    case 'MARKDOWN':
    case 'ARTIFACT':
      return '.md'
    case 'TEXT':
      return '.txt'
    default:
      return '.txt'
  }
}

function getMimeType(type: DocumentType): string {
  switch (type) {
    case 'CODE':
      return 'text/typescript'
    case 'PRD':
    case 'SPEC':
    case 'GUIDE':
    case 'BUILD_DOC':
    case 'MARKDOWN':
    case 'ARTIFACT':
      return 'text/markdown'
    case 'TEXT':
    default:
      return 'text/plain'
  }
}
