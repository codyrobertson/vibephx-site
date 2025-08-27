'use client'

import { useState, useEffect } from 'react'
import { CheckIcon, DownloadIcon, FileTextIcon, CodeIcon, ImageIcon, TableIcon, ListBulletIcon, SpeakerLoudIcon, MagicWandIcon, GearIcon } from '@radix-ui/react-icons'
import { Card } from '@/components/ui/Card'

const DOCUMENT_ICONS = {
  prd: FileTextIcon,
  buildDoc: CodeIcon,
  uiSpecs: ImageIcon,
  dataModels: TableIcon,
  taskList: ListBulletIcon,
  marketingGuide: SpeakerLoudIcon,
  claudeMd: MagicWandIcon,
  cursorRules: GearIcon
}

const DOCUMENT_NAMES = {
  prd: 'Product Requirements Document',
  buildDoc: 'Technical Build Guide',
  uiSpecs: 'UI/UX Specifications', 
  dataModels: 'Data Models & Schema',
  taskList: 'Development Task List',
  marketingGuide: 'Marketing & Launch Guide',
  claudeMd: 'Claude.md Configuration',
  cursorRules: 'Cursor Rules Configuration'
}

interface ProjectData {
  template?: string
  customIdea?: string
  stack: {
    frontend?: string
    backend?: string
    database?: string
    aiService?: string
  }
  deployment?: string
  generated?: Record<string, string>
}

export default function DownloadPage() {
  const [projectData, setProjectData] = useState<ProjectData | null>(null)
  const [isDownloading, setIsDownloading] = useState(false)

  useEffect(() => {
    // Extract project data from URL params or localStorage
    const params = new URLSearchParams(window.location.search)
    const data: ProjectData = {
      template: params.get('template') || '',
      customIdea: params.get('idea') || '',
      stack: {
        frontend: params.get('frontend') || '',
        backend: params.get('backend') || '',
        database: params.get('database') || '',
        aiService: params.get('aiService') || ''
      },
      deployment: params.get('deployment') || ''
    }

    // Try to get generated content from localStorage
    const sessionId = localStorage.getItem('currentSessionId')
    if (sessionId) {
      const generated = localStorage.getItem(`generated_${sessionId}`)
      if (generated) {
        data.generated = JSON.parse(generated)
      }
    }

    setProjectData(data)
  }, [])

  const downloadZip = async () => {
    if (!projectData?.generated) return

    setIsDownloading(true)
    
    try {
      // Create ZIP file using JSZip
      const JSZip = (await import('jszip')).default
      const zip = new JSZip()

      // Add project info
      const projectInfo = {
        name: projectData.template || 'Custom Project',
        idea: projectData.customIdea,
        stack: projectData.stack,
        deployment: projectData.deployment,
        generatedAt: new Date().toISOString()
      }

      zip.file('project-info.json', JSON.stringify(projectInfo, null, 2))

      // Add generated documents
      const docsFolder = zip.folder('documents')
      for (const [docType, content] of Object.entries(projectData.generated)) {
        const fileName = `${docType}.md`
        docsFolder?.file(fileName, content)
      }

      // Add README
      const readme = `# ${projectData.template || 'Custom Project'}

This project was generated using VibePHX AI Builder.

## Project Details
- Template: ${projectData.template || 'Custom'}
- Frontend: ${projectData.stack.frontend}
- Backend: ${projectData.stack.backend || 'None'}
- Database: ${projectData.stack.database || 'None'}
- AI Service: ${projectData.stack.aiService || 'None'}
- Deployment: ${projectData.deployment}

## Generated Documents
${Object.keys(projectData.generated).map(doc => `- ${DOCUMENT_NAMES[doc as keyof typeof DOCUMENT_NAMES] || doc}`).join('\n')}

## Next Steps
1. Review all documents in the \`documents/\` folder
2. Follow the Technical Build Guide for implementation
3. Use the Task List for development planning
4. Configure your IDE with the provided Cursor Rules
5. Set up Claude.md for AI assistance

Happy building! 🚀
`

      zip.file('README.md', readme)

      // Generate and download ZIP
      const content = await zip.generateAsync({ type: 'blob' })
      const url = URL.createObjectURL(content)
      
      const a = document.createElement('a')
      a.href = url
      a.download = `${(projectData.template || 'project').toLowerCase().replace(/[^a-z0-9]/g, '-')}-${Date.now()}.zip`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      
      URL.revokeObjectURL(url)

    } catch (error) {
      console.error('Download failed:', error)
      alert('Failed to create download. Please try again.')
    } finally {
      setIsDownloading(false)
    }
  }

  if (!projectData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
      </div>
    )
  }

  const generatedDocs = Object.keys(projectData.generated || {})
  const totalWords = Object.values(projectData.generated || {}).reduce((sum, content) => sum + Math.round(content.length / 4), 0)

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          
          {/* Success Header */}
          <div className="text-center mb-12">
            <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckIcon className="w-10 h-10 text-black" />
            </div>
            
            <h1 className="text-4xl font-bold text-white mb-4">
              Your Project is Ready!
            </h1>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              {generatedDocs.length} documents generated for your {projectData.template || 'custom'} project
            </p>
          </div>

          {/* Project Summary */}
          <Card className="mb-8 border-green-800/30 bg-green-950/10" size="lg">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-semibold text-white mb-4">Project Configuration</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Template:</span>
                    <span className="text-white">{projectData.template || 'Custom'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Frontend:</span>
                    <span className="text-white">{projectData.stack.frontend}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Backend:</span>
                    <span className="text-white">{projectData.stack.backend || 'None'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Database:</span>
                    <span className="text-white">{projectData.stack.database || 'None'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Deployment:</span>
                    <span className="text-white">{projectData.deployment}</span>
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold text-white mb-4">Generated Content</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Documents:</span>
                    <span className="text-white">{generatedDocs.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Total Words:</span>
                    <span className="text-white">{totalWords.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Generated:</span>
                    <span className="text-white">{new Date().toLocaleDateString()}</span>
                  </div>
                </div>
              </div>
            </div>
          </Card>

          {/* Document List */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
            {generatedDocs.map(docType => {
              const IconComponent = DOCUMENT_ICONS[docType as keyof typeof DOCUMENT_ICONS] || FileTextIcon
              const content = projectData.generated?.[docType] || ''
              
              return (
                <Card key={docType} className="border-gray-700" size="sm">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center">
                      <IconComponent className="w-5 h-5 text-black" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium text-white">
                        {DOCUMENT_NAMES[docType as keyof typeof DOCUMENT_NAMES] || docType}
                      </h4>
                      <p className="text-sm text-gray-400">
                        {Math.round(content.length / 4)} words
                      </p>
                    </div>
                    <CheckIcon className="w-5 h-5 text-green-400" />
                  </div>
                </Card>
              )
            })}
          </div>

          {/* Download Section */}
          <Card className="text-center border-blue-800/30 bg-blue-950/10" size="lg">
            <div className="mb-6">
              <DownloadIcon className="w-16 h-16 text-blue-400 mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-white mb-2">Download Your Project</h3>
              <p className="text-gray-300">
                Get all documents, configuration files, and project information in a single ZIP file
              </p>
            </div>
            
            <button
              onClick={downloadZip}
              disabled={isDownloading || !projectData.generated}
              className="px-8 py-4 bg-blue-500 hover:bg-blue-600 disabled:bg-gray-600 text-white font-bold rounded-lg transition-colors flex items-center gap-3 mx-auto"
            >
              {isDownloading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  Creating ZIP...
                </>
              ) : (
                <>
                  <DownloadIcon className="w-5 h-5" />
                  Download Project ZIP
                </>
              )}
            </button>
            
            <p className="text-sm text-gray-400 mt-4">
              Includes all generated documents, README, and project configuration
            </p>
          </Card>

          {/* Next Steps */}
          <div className="mt-12 text-center">
            <h3 className="text-xl font-semibold text-white mb-4">What's Next?</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div className="p-4 bg-gray-800/50 rounded-lg">
                <span className="text-orange-400 font-semibold">1. Review</span>
                <p className="text-gray-300 mt-1">Read through all generated documents</p>
              </div>
              <div className="p-4 bg-gray-800/50 rounded-lg">
                <span className="text-orange-400 font-semibold">2. Build</span>
                <p className="text-gray-300 mt-1">Follow the technical build guide</p>
              </div>
              <div className="p-4 bg-gray-800/50 rounded-lg">
                <span className="text-orange-400 font-semibold">3. Deploy</span>
                <p className="text-gray-300 mt-1">Launch on {projectData.deployment}</p>
              </div>
            </div>
            
            <div className="mt-8">
              <a 
                href="/builder/template" 
                className="inline-block px-6 py-3 bg-orange-500 hover:bg-orange-600 text-black font-semibold rounded-lg transition-colors"
              >
                Build Another Project
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}