'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeftIcon, DownloadIcon, ExternalLinkIcon, CopyIcon, EyeOpenIcon } from '@radix-ui/react-icons'
import type { ProjectData } from './BuilderWizard'

interface ResultsPageClientProps {
  projectData: ProjectData
}

interface DocumentationSection {
  section: string
  content: string
}

export default function ResultsPageClient({ projectData }: ResultsPageClientProps) {
  const router = useRouter()
  const [documentationSections, setDocumentationSections] = useState<DocumentationSection[]>([])
  const [selectedSection, setSelectedSection] = useState<DocumentationSection | null>(null)
  const [loading, setLoading] = useState(true)
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    // Fetch the generated documentation for this project
    fetchGeneratedDocumentation()
  }, [projectData.projectId])

  const fetchGeneratedDocumentation = async () => {
    try {
      const response = await fetch(`/api/projects/${projectData.projectId}/documentation`)
      if (response.ok) {
        const sections = await response.json()
        setDocumentationSections(sections)
        if (sections.length > 0) {
          setSelectedSection(sections[0]) // Select first section by default
        }
      }
    } catch (error) {
      console.error('Failed to fetch documentation:', error)
    } finally {
      setLoading(false)
    }
  }

  const copyToClipboard = async (content: string) => {
    try {
      await navigator.clipboard.writeText(content)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (error) {
      console.error('Failed to copy:', error)
    }
  }

  const downloadDocumentation = () => {
    // Create a markdown file with all documentation sections
    if (documentationSections.length > 0) {
      const allContent = documentationSections
        .map(section => section.content)
        .join('\n\n---\n\n')
      
      const blob = new Blob([allContent], { type: 'text/markdown' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `${projectData.template || 'project'}-documentation.md`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black">
      {/* Header */}
      <div className="border-b border-gray-800 bg-gray-900">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => router.push('/builder/template')}
                className="flex items-center gap-2 px-4 py-2 text-gray-300 hover:text-white border border-gray-700 hover:border-gray-600 rounded-lg transition-colors"
              >
                <ArrowLeftIcon className="w-4 h-4" />
                New Project
              </button>
              <div>
                <h1 className="text-2xl font-bold text-white">
                  {projectData.template ? `${projectData.template} Project` : 'Custom Project'}
                </h1>
                <p className="text-gray-400 text-sm">
                  Generated with {projectData.stack.frontend}, {projectData.stack.backend}, {projectData.stack.database}
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <button
                onClick={downloadDocumentation}
                className="flex items-center gap-2 px-4 py-2 bg-orange-500 hover:bg-orange-600 text-black font-medium rounded-lg transition-colors"
              >
                <DownloadIcon className="w-4 h-4" />
                Download Docs
              </button>
              <button
                className="flex items-center gap-2 px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors"
              >
                <ExternalLinkIcon className="w-4 h-4" />
                Deploy
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="flex h-[calc(100vh-140px)]">
        {/* Documentation Navigator */}
        <div className="w-80 border-r border-gray-800 bg-gray-900 overflow-y-auto">
          <div className="p-4">
            <h3 className="text-lg font-semibold text-white mb-4">
              Documentation ({documentationSections.length})
            </h3>
            <div className="space-y-1">
              {documentationSections.map((section, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedSection(section)}
                  className={`w-full text-left px-3 py-2 rounded-md text-sm transition-colors ${
                    selectedSection?.section === section.section
                      ? 'bg-orange-500 text-black font-medium'
                      : 'text-gray-300 hover:bg-gray-800'
                  }`}
                >
                  <div className="font-medium">
                    {section.section}
                  </div>
                  <div className={`text-xs mt-1 ${
                    selectedSection?.section === section.section 
                      ? 'text-gray-800' 
                      : 'text-gray-500'
                  }`}>
                    {Math.round(section.content.length / 100) / 10}k chars
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Documentation Viewer */}
        <div className="flex-1 flex flex-col bg-black">
          {selectedSection ? (
            <>
              {/* Section Header */}
              <div className="border-b border-gray-800 bg-gray-900 px-6 py-3 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <EyeOpenIcon className="w-4 h-4 text-gray-400" />
                  <span className="text-white font-medium">{selectedSection.section}</span>
                  <span className="text-xs px-2 py-1 bg-gray-800 text-gray-300 rounded">
                    markdown
                  </span>
                </div>
                <button
                  onClick={() => copyToClipboard(selectedSection.content)}
                  className={`flex items-center gap-2 px-3 py-1 rounded-md transition-colors ${
                    copied
                      ? 'bg-green-600 text-white'
                      : 'bg-gray-800 hover:bg-gray-700 text-gray-300'
                  }`}
                >
                  <CopyIcon className="w-4 h-4" />
                  {copied ? 'Copied!' : 'Copy'}
                </button>
              </div>

              {/* Documentation Content */}
              <div className="flex-1 overflow-auto bg-black">
                <div className="p-6 text-sm leading-relaxed text-gray-300 prose prose-invert max-w-none">
                  <pre className="whitespace-pre-wrap font-sans text-gray-300">{selectedSection.content}</pre>
                </div>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center bg-black">
              <div className="text-center text-gray-500">
                <div className="text-xl mb-2">Select a documentation section to view</div>
                <div className="text-sm">Choose from the documentation navigator on the left</div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Tech Stack Footer */}
      <div className="border-t border-gray-800 bg-gray-900 p-4">
        <div className="flex flex-wrap justify-center gap-3">
          <div className="px-3 py-1 bg-gray-800 border border-gray-700 rounded text-gray-300 text-sm">
            {projectData.template || 'Custom Project'}
          </div>
          <div className="px-3 py-1 bg-gray-800 border border-gray-700 rounded text-gray-300 text-sm">
            {projectData.stack.frontend}
          </div>
          {projectData.stack.backend && (
            <div className="px-3 py-1 bg-gray-800 border border-gray-700 rounded text-gray-300 text-sm">
              {projectData.stack.backend}
            </div>
          )}
          {projectData.stack.database && (
            <div className="px-3 py-1 bg-gray-800 border border-gray-700 rounded text-gray-300 text-sm">
              {projectData.stack.database}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}