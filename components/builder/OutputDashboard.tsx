'use client'

import React, { useState } from 'react'
import { DownloadIcon, ExternalLinkIcon, CopyIcon, FileTextIcon, CodeIcon, ImageIcon, TableIcon, ListBulletIcon, SpeakerLoudIcon, MagicWandIcon, GearIcon } from '@radix-ui/react-icons'
import type { ProjectData } from './BuilderWizard'

const DOCUMENT_INFO = {
  prd: { 
    name: 'Product Requirements Document', 
    icon: FileTextIcon, 
    description: 'Complete project specification with user stories and requirements',
    filename: 'PRD.md'
  },
  buildDoc: { 
    name: 'Technical Build Guide', 
    icon: CodeIcon, 
    description: 'Step-by-step implementation instructions and setup guide',
    filename: 'BUILD_GUIDE.md'
  },
  uiSpecs: { 
    name: 'UI/UX Specifications', 
    icon: ImageIcon, 
    description: 'Design system, wireframes, and component specifications',
    filename: 'UI_SPECS.md'
  },
  dataModels: { 
    name: 'Data Models & Schema', 
    icon: TableIcon, 
    description: 'Database design, relationships, and migration scripts',
    filename: 'DATA_MODELS.md'
  },
  taskList: { 
    name: 'Development Task List', 
    icon: ListBulletIcon, 
    description: 'Prioritized development checklist with time estimates',
    filename: 'TASK_LIST.md'
  },
  marketingGuide: { 
    name: 'Marketing & Launch Guide', 
    icon: SpeakerLoudIcon, 
    description: 'Go-to-market strategy and promotion tactics',
    filename: 'MARKETING_GUIDE.md'
  },
  claudeMd: { 
    name: 'Claude.md Configuration', 
    icon: MagicWandIcon, 
    description: 'AI assistant configuration for your project context',
    filename: 'claude.md'
  },
  cursorRules: { 
    name: 'Cursor Rules Configuration', 
    icon: GearIcon, 
    description: 'IDE optimization settings and coding standards',
    filename: '.cursorrules'
  }
}

interface OutputDashboardProps {
  projectData: ProjectData
}

export default function OutputDashboard({ projectData }: OutputDashboardProps) {
  const [activeDocument, setActiveDocument] = useState<string>('prd')
  const [copiedDoc, setCopiedDoc] = useState<string | null>(null)

  const generated = projectData.generated || {}
  const totalWords = Object.values(generated).reduce((sum, content) => sum + Math.round(content.length / 4), 0)

  const copyToClipboard = async (content: string, docId: string) => {
    try {
      await navigator.clipboard.writeText(content)
      setCopiedDoc(docId)
      setTimeout(() => setCopiedDoc(null), 2000)
    } catch (err) {
      console.error('Failed to copy to clipboard:', err)
    }
  }

  const downloadDocument = (content: string, filename: string) => {
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

  const downloadAllDocuments = () => {
    Object.entries(generated).forEach(([docId, content]) => {
      const docInfo = DOCUMENT_INFO[docId as keyof typeof DOCUMENT_INFO]
      if (docInfo) {
        setTimeout(() => {
          downloadDocument(content, docInfo.filename)
        }, 100) // Small delay between downloads
      }
    })
  }

  const activeContent = generated[activeDocument] || ''

  return (
    <div className="space-y-8">
      {/* Header & Summary */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
        <div className="p-4 bg-gray-950/50 border border-gray-800 rounded-lg text-center">
          <div className="text-2xl font-bold text-orange-400 mb-2">{Object.keys(generated).length}</div>
          <div className="text-sm text-gray-400">Documents Generated</div>
        </div>
        <div className="p-4 bg-gray-950/50 border border-gray-800 rounded-lg text-center">
          <div className="text-2xl font-bold text-orange-400 mb-2">{totalWords.toLocaleString()}</div>
          <div className="text-sm text-gray-400">Total Words</div>
        </div>
        <div className="p-4 bg-gray-950/50 border border-gray-800 rounded-lg text-center">
          <div className="text-2xl font-bold text-orange-400 mb-2">{projectData.features.length}</div>
          <div className="text-sm text-gray-400">Features Planned</div>
        </div>
        <div className="p-4 bg-gray-950/50 border border-gray-800 rounded-lg text-center">
          <div className="text-2xl font-bold text-orange-400 mb-2">Ready</div>
          <div className="text-sm text-gray-400">Status</div>
        </div>
      </div>

      {/* Download All Button */}
      <div className="text-center">
        <button
          onClick={downloadAllDocuments}
          className="inline-flex items-center gap-2 px-6 md:px-8 py-3 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-black font-bold rounded-lg transition-colors"
        >
          <DownloadIcon className="w-5 h-5" />
          Download Complete Project Package
        </button>
        <p className="text-sm text-gray-400 mt-2">
          All {Object.keys(generated).length} documents will be downloaded as individual Markdown files
        </p>
      </div>

      {/* Document Grid & Viewer */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
        {/* Document List */}
        <div className="space-y-3">
          <h3 className="text-lg font-bold mb-4">Project Documents</h3>
          {Object.entries(DOCUMENT_INFO).map(([docId, info]) => {
            const IconComponent = info.icon
            const isActive = activeDocument === docId
            const content = generated[docId]
            const wordCount = content ? Math.round(content.length / 4) : 0

            return (
              <div
                key={docId}
                onClick={() => setActiveDocument(docId)}
                className={`
                  w-full p-4 border rounded-lg cursor-pointer transition-colors
                  ${isActive
                    ? 'border-orange-500 bg-orange-950/20'
                    : 'border-gray-800 hover:border-gray-600'
                  }
                `}
              >
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-orange-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                    <IconComponent className="w-6 h-6 text-orange-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-semibold text-sm mb-1 truncate">{info.name}</h4>
                    <p className="text-xs text-gray-400 mb-2 line-clamp-2">{info.description}</p>
                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <span>{info.filename}</span>
                      <span>{wordCount} words</span>
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        {/* Document Viewer */}
        <div className="lg:col-span-2">
          <div className="border border-gray-800 rounded-lg overflow-hidden">
            {/* Viewer Header */}
            <div className="flex items-center justify-between p-4 bg-gray-950/50 border-b border-gray-800">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-orange-500/20 rounded flex items-center justify-center">
                  {React.createElement(DOCUMENT_INFO[activeDocument as keyof typeof DOCUMENT_INFO].icon, {
                    className: "w-5 h-5 text-orange-400"
                  })}
                </div>
                <div>
                  <h4 className="font-semibold text-sm">
                    {DOCUMENT_INFO[activeDocument as keyof typeof DOCUMENT_INFO].name}
                  </h4>
                  <p className="text-xs text-gray-400">
                    {Math.round(activeContent.length / 4)} words
                  </p>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <button
                  onClick={() => copyToClipboard(activeContent, activeDocument)}
                  className="p-2 bg-gray-800 hover:bg-gray-700 rounded transition-colors"
                  title="Copy to clipboard"
                >
                  {copiedDoc === activeDocument ? (
                    <span className="text-green-400 text-xs">Copied!</span>
                  ) : (
                    <CopyIcon className="w-4 h-4" />
                  )}
                </button>
                <button
                  onClick={() => downloadDocument(
                    activeContent, 
                    DOCUMENT_INFO[activeDocument as keyof typeof DOCUMENT_INFO].filename
                  )}
                  className="p-2 bg-gray-800 hover:bg-gray-700 rounded transition-colors"
                  title="Download document"
                >
                  <DownloadIcon className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Document Content */}
            <div className="p-6 max-h-96 overflow-y-auto bg-gray-900/50">
              <pre className="whitespace-pre-wrap text-sm text-gray-300 font-mono leading-relaxed">
                {activeContent || 'No content available'}
              </pre>
            </div>
          </div>
        </div>
      </div>

      {/* Project Summary */}
      <div className="p-6 bg-gradient-to-r from-green-950/20 to-blue-950/20 border border-green-800/30 rounded-lg">
        <h3 className="text-xl font-bold mb-4">🎉 Your Project is Ready to Build!</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
          <div>
            <h4 className="font-semibold mb-2 text-green-400">What You Have:</h4>
            <ul className="space-y-1 text-sm text-gray-300">
              <li>✅ Complete technical specifications</li>
              <li>✅ Step-by-step build instructions</li>
              <li>✅ UI/UX design guidelines</li>
              <li>✅ Database schema and models</li>
              <li>✅ Prioritized task breakdown</li>
              <li>✅ Marketing and launch strategy</li>
              <li>✅ AI assistant configuration</li>
              <li>✅ IDE optimization settings</li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-2 text-blue-400">Next Steps:</h4>
            <ol className="space-y-1 text-sm text-gray-300">
              <li>1. Download all project documents</li>
              <li>2. Set up your development environment</li>
              <li>3. Follow the Technical Build Guide</li>
              <li>4. Use the Task List for prioritization</li>
              <li>5. Deploy using the provided instructions</li>
              <li>6. Launch with the Marketing Guide</li>
            </ol>
          </div>
        </div>
        
        <div className="mt-6 p-4 bg-orange-500/10 border border-orange-500/30 rounded-lg">
          <p className="text-sm text-orange-300">
            💡 <strong>Pro Tip:</strong> Place claude.md and .cursorrules in your project root directory 
            to optimize your AI coding experience. These files will help Claude and Cursor understand 
            your project context and follow your preferred coding patterns.
          </p>
        </div>
      </div>
    </div>
  )
}