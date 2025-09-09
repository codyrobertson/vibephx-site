'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import type { ProjectData } from './BuilderWizard'

interface GeneratePageClientProps {
  initialProjectData: ProjectData
}

interface DocumentationSection {
  section: string
  content: string
}

interface StreamChunk {
  type: 'documentation' | 'progress' | 'complete' | 'error'
  section?: DocumentationSection
  progress?: number
  message?: string
  error?: string
  projectId?: string
}

export default function GeneratePageClient({ initialProjectData }: GeneratePageClientProps) {
  const router = useRouter()
  const [isGenerating, setIsGenerating] = useState(false)
  const [progress, setProgress] = useState(0)
  const [currentSection, setCurrentSection] = useState<string>('')
  const [generatedSections, setGeneratedSections] = useState<DocumentationSection[]>([])
  const [isComplete, setIsComplete] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    startGeneration()
  }, [])

  const startGeneration = async () => {
    setIsGenerating(true)
    setError(null)

    try {
      const params = new URLSearchParams(window.location.search)
      const response = await fetch('/api/generate-project', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(initialProjectData),
      })

      if (!response.ok) {
        throw new Error('Failed to start generation')
      }

      const reader = response.body?.getReader()
      if (!reader) {
        throw new Error('No response stream')
      }

      const decoder = new TextDecoder()
      let buffer = ''

      while (true) {
        const { done, value } = await reader.read()
        
        if (done) break

        buffer += decoder.decode(value, { stream: true })
        const lines = buffer.split('\n')
        buffer = lines.pop() || ''

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            try {
              const chunk: StreamChunk = JSON.parse(line.slice(6))
              
              switch (chunk.type) {
                case 'progress':
                  setProgress(chunk.progress || 0)
                  setCurrentSection(chunk.message || '')
                  break
                case 'documentation':
                  if (chunk.section) {
                    setGeneratedSections(prev => [...prev, chunk.section!])
                  }
                  break
                case 'complete':
                  setIsComplete(true)
                  setIsGenerating(false)
                  setTimeout(() => {
                    // Navigate to final results page with project data
                    const params = new URLSearchParams(window.location.search)
                    params.set('generated', 'true')
                    // Add project ID to URL - prefer the one from the response
                    const projectId = chunk.projectId || initialProjectData.projectId
                    if (projectId) {
                      params.set('projectId', projectId)
                    }
                    router.push(`/builder/results?${params.toString()}`)
                  }, 2000)
                  break
                case 'error':
                  setError(chunk.error || 'Unknown error occurred')
                  setIsGenerating(false)
                  break
              }
            } catch (e) {
              console.error('Failed to parse chunk:', e)
            }
          }
        }
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to generate project')
      setIsGenerating(false)
    }
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 text-xl mb-4">Generation Failed</div>
          <div className="text-gray-400 mb-6">{error}</div>
          <button
            onClick={() => router.back()}
            className="px-6 py-2 bg-orange-500 hover:bg-orange-600 text-black font-medium rounded-lg"
          >
            Go Back
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-white mb-4">
            Generating Your Project
          </h1>
          <p className="text-xl text-gray-300">
            AI is creating documentation for your {initialProjectData.template || 'custom'} project...
          </p>
        </div>

        {/* Progress Section */}
        <div className="bg-gray-900 border border-gray-800 rounded-lg p-8 mb-8">
          <div className="mb-6">
            <div className="flex justify-between text-sm text-gray-400 mb-2">
              <span>Progress</span>
              <span>{Math.round(progress)}%</span>
            </div>
            <div className="w-full bg-gray-700 rounded-full h-2">
              <div 
                className="bg-orange-500 h-2 rounded-full transition-all duration-500"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          {currentSection && (
            <div className="text-gray-300 text-sm">
              <span className="text-orange-400">Status:</span> {currentSection}
            </div>
          )}

          {isComplete && (
            <div className="text-center text-green-400 font-medium mt-4">
              ✅ Generation Complete! Redirecting to results...
            </div>
          )}
        </div>

        {/* Live Documentation Generation Display */}
        {generatedSections.length > 0 && (
          <div className="bg-gray-900 border border-gray-800 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-white mb-4">
              Generated Documentation ({generatedSections.length}/8)
            </h3>
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {generatedSections.map((section, index) => (
                <div key={index} className="flex items-center gap-3 text-sm">
                  <div className="text-green-400">✓</div>
                  <div className="text-gray-300 font-medium">{section.section}</div>
                  <div className="text-gray-500 text-xs">
                    {section.content.length} characters
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tech Stack Summary */}
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <div className="px-3 py-1 bg-gray-800 border border-gray-700 rounded text-gray-300 text-sm">
            {initialProjectData.template || 'Custom Project'}
          </div>
          <div className="px-3 py-1 bg-gray-800 border border-gray-700 rounded text-gray-300 text-sm">
            {initialProjectData.stack.frontend}
          </div>
          {initialProjectData.stack.backend && (
            <div className="px-3 py-1 bg-gray-800 border border-gray-700 rounded text-gray-300 text-sm">
              {initialProjectData.stack.backend}
            </div>
          )}
          {initialProjectData.stack.database && (
            <div className="px-3 py-1 bg-gray-800 border border-gray-700 rounded text-gray-300 text-sm">
              {initialProjectData.stack.database}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}