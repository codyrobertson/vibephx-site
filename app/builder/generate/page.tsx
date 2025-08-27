import { Suspense } from 'react'
import { redirect } from 'next/navigation'
import GenerationProgressV2 from '@/components/builder/GenerationProgressV2'

export const metadata = {
  title: 'Generate Project - VibePHX Builder',
  description: 'AI-powered project generation in progress'
}

interface SearchParams {
  template?: string
  idea?: string
  frontend?: string
  backend?: string
  database?: string
  aiService?: string
  deployment?: string
}

interface PageProps {
  searchParams: Promise<SearchParams>
}

export default async function GeneratePage({ searchParams }: PageProps) {
  const params = await searchParams
  
  // Redirect if required data missing
  if (!params.frontend || !params.deployment) {
    redirect('/builder/template')
  }

  const projectData = {
    template: params.template || '',
    customIdea: params.idea || '',
    stack: {
      frontend: params.frontend || '',
      backend: params.backend || '',
      database: params.database || '',
      aiService: params.aiService || ''
    },
    deployment: params.deployment || ''
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <Suspense fallback={
            <div className="flex items-center justify-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
            </div>
          }>
            <GenerationProgressV2 
              projectData={projectData}
              updateProjectData={() => {}}
              onComplete={() => {
                // Redirect to download page
                const params = new URLSearchParams(window.location.search)
                window.location.href = `/builder/download?${params.toString()}`
              }}
            />
          </Suspense>
        </div>
      </div>
    </div>
  )
}