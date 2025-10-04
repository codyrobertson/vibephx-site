'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { DownloadIcon, CopyIcon, CheckIcon } from '@radix-ui/react-icons'
import { Response } from '@/components/ai-elements/response'
import { DocumentCard } from './DocumentCard'
import { DocumentSheet } from './DocumentSheet'
import type { DocumentType } from '@prisma/client'

interface ProjectFilesProps {
  session: {
    prdMarkdown: string | null
    eightLinePrompt: string | null
    acceptanceCriteria: string[]
    messages?: any[] // Add messages to extract PRD from
  }
  projectId: string
}

interface ProjectDocument {
  id: string
  type: DocumentType
  title: string
  content?: string
  excerpt: string | null
  isBookmarked: boolean
  bookmarkedAt: Date | null
  generatedBy: string | null
  tags: string[]
  createdAt: Date
  updatedAt: Date
}

export function ProjectFiles({ session, projectId }: ProjectFilesProps) {
  const [copied, setCopied] = useState<string | null>(null)
  const [documents, setDocuments] = useState<ProjectDocument[]>([])
  const [selectedDocument, setSelectedDocument] = useState<ProjectDocument | null>(null)
  const [sheetOpen, setSheetOpen] = useState(false)
  const [loadingDocuments, setLoadingDocuments] = useState(true)

  // Extract PRD from messages if prdMarkdown is not set
  const getPRDContent = () => {
    // First try prdMarkdown field
    if (session.prdMarkdown) {
      return session.prdMarkdown
    }

    // Fall back to extracting from messages
    if (session.messages && Array.isArray(session.messages)) {
      const prdMessage = session.messages.find((m: any) =>
        m.role === 'assistant' &&
        m.content &&
        m.content.includes('✅ **PRD Generated**')
      )

      if (prdMessage) {
        // Extract the PRD content by removing the marker
        return prdMessage.content
          .replace(/✅ \*\*PRD Generated\*\*\n\n/g, '')
          .replace(/✅ \*\*PRD Generated\*\*\n/g, '')
          .replace('✅ **PRD Generated**\n\n', '')
          .replace('✅ **PRD Generated**\n', '')
          .trim()
      }
    }

    return null
  }

  const prdContent = getPRDContent()

  // Load project documents
  useEffect(() => {
    loadDocuments()
  }, [projectId])

  async function loadDocuments() {
    setLoadingDocuments(true)
    try {
      const res = await fetch(`/api/projects/${projectId}/documents`)
      if (res.ok) {
        const data = await res.json()
        setDocuments(data.documents || [])
      }
    } catch (error) {
      console.error('Failed to load documents:', error)
    } finally {
      setLoadingDocuments(false)
    }
  }

  async function handleDocumentClick(docId: string) {
    try {
      const res = await fetch(`/api/projects/${projectId}/documents/${docId}`)
      if (res.ok) {
        const data = await res.json()
        setSelectedDocument(data.document)
        setSheetOpen(true)
      }
    } catch (error) {
      console.error('Failed to load document:', error)
    }
  }

  async function handleBookmarkToggle(docId: string, isBookmarked: boolean) {
    try {
      const res = await fetch(`/api/projects/${projectId}/documents/${docId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isBookmarked })
      })

      if (res.ok) {
        // Update local state
        setDocuments(prev =>
          prev.map(doc =>
            doc.id === docId ? { ...doc, isBookmarked, bookmarkedAt: isBookmarked ? new Date() : null } : doc
          )
        )

        // Update selected document if it's open
        if (selectedDocument?.id === docId) {
          setSelectedDocument(prev =>
            prev ? { ...prev, isBookmarked, bookmarkedAt: isBookmarked ? new Date() : null } : null
          )
        }
      }
    } catch (error) {
      console.error('Failed to toggle bookmark:', error)
    }
  }

  async function copyToClipboard(text: string, id: string) {
    try {
      await navigator.clipboard.writeText(text)
      setCopied(id)
      setTimeout(() => setCopied(null), 2000)
    } catch (err) {
      console.error('Failed to copy:', err)
    }
  }

  function downloadFile(content: string, filename: string) {
    const blob = new Blob([content], { type: 'text/markdown' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = filename
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  async function handleBulkExport() {
    try {
      const res = await fetch(`/api/projects/${projectId}/documents/export`)
      if (res.ok) {
        const blob = await res.blob()
        const url = URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        const filename = res.headers.get('content-disposition')?.split('filename=')[1]?.replace(/"/g, '') || 'documents.zip'
        a.download = filename
        document.body.appendChild(a)
        a.click()
        document.body.removeChild(a)
        URL.revokeObjectURL(url)
      }
    } catch (error) {
      console.error('Failed to export documents:', error)
    }
  }

  return (
    <div className="space-y-6">
      {/* Bookmarked Documents */}
      {documents.length > 0 && (
        <div className="rounded-xl border border-gray-800 bg-gray-900/30 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-white">Project Documents</h3>
            <Button
              variant="outline"
              size="sm"
              onClick={handleBulkExport}
              className="border-gray-700 text-gray-300 hover:border-orange-500"
            >
              <DownloadIcon className="w-4 h-4 mr-2" />
              Export All as ZIP
            </Button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {documents.map(doc => (
              <DocumentCard
                key={doc.id}
                document={doc}
                onClick={() => handleDocumentClick(doc.id)}
                onBookmarkToggle={handleBookmarkToggle}
              />
            ))}
          </div>
          {loadingDocuments && (
            <div className="text-center text-gray-400 py-8">Loading documents...</div>
          )}
        </div>
      )}

      {/* Document Sheet Modal */}
      {selectedDocument && (
        <DocumentSheet
          open={sheetOpen}
          onOpenChange={setSheetOpen}
          document={selectedDocument as any}
          projectId={projectId}
          onBookmarkToggle={handleBookmarkToggle}
          onDocumentClick={handleDocumentClick}
        />
      )}

      {/* PRD Markdown */}
      {prdContent && (
        <div className="rounded-xl border border-gray-800 bg-gray-900/30 overflow-hidden">
          <div className="flex items-center justify-between p-4 border-b border-gray-800 bg-gray-900">
            <h3 className="text-lg font-semibold text-white">Product Requirements Document</h3>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => copyToClipboard(prdContent, 'prd')}
                className="border-gray-700 text-gray-300 hover:border-orange-500"
              >
                {copied === 'prd' ? (
                  <CheckIcon className="w-4 h-4 mr-1" />
                ) : (
                  <CopyIcon className="w-4 h-4 mr-1" />
                )}
                {copied === 'prd' ? 'Copied!' : 'Copy'}
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => downloadFile(prdContent, `PRD-${projectId}.md`)}
                className="border-gray-700 text-gray-300 hover:border-orange-500"
              >
                <DownloadIcon className="w-4 h-4 mr-1" />
                Download
              </Button>
            </div>
          </div>
          <div className="p-6 prose prose-invert max-w-none">
            <Response>{prdContent}</Response>
          </div>
        </div>
      )}

      {/* 8-Line Prompt */}
      {session.eightLinePrompt && (
        <div className="rounded-xl border border-gray-800 bg-gray-900/30 overflow-hidden">
          <div className="flex items-center justify-between p-4 border-b border-gray-800 bg-gray-900">
            <h3 className="text-lg font-semibold text-white">8-Line AI Prompt</h3>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => copyToClipboard(session.eightLinePrompt!, 'prompt')}
                className="border-gray-700 text-gray-300 hover:border-orange-500"
              >
                {copied === 'prompt' ? (
                  <CheckIcon className="w-4 h-4 mr-1" />
                ) : (
                  <CopyIcon className="w-4 h-4 mr-1" />
                )}
                {copied === 'prompt' ? 'Copied!' : 'Copy'}
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => downloadFile(session.eightLinePrompt!, `prompt-${projectId}.txt`)}
                className="border-gray-700 text-gray-300 hover:border-orange-500"
              >
                <DownloadIcon className="w-4 h-4 mr-1" />
                Download
              </Button>
            </div>
          </div>
          <div className="p-6">
            <pre className="text-sm text-gray-300 whitespace-pre-wrap font-mono bg-black p-4 rounded-lg">
              {session.eightLinePrompt}
            </pre>
          </div>
        </div>
      )}

      {/* Acceptance Criteria */}
      {session.acceptanceCriteria && session.acceptanceCriteria.length > 0 && (
        <div className="rounded-xl border border-gray-800 bg-gray-900/30 p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Acceptance Criteria</h3>
          <ul className="space-y-2">
            {session.acceptanceCriteria.map((criteria, i) => (
              <li key={i} className="text-white text-sm flex items-start gap-3">
                <span className="text-orange-500 mt-0.5">□</span>
                <span>{criteria}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* No files message */}
      {!prdContent && !session.eightLinePrompt && session.acceptanceCriteria.length === 0 && documents.length === 0 && (
        <div className="rounded-xl border border-gray-800 bg-gray-900/30 p-12 text-center">
          <p className="text-gray-400">No files generated yet. Complete the PRD builder to generate outputs.</p>
        </div>
      )}
    </div>
  )
}
