import { Suspense } from 'react'
import { redirect } from 'next/navigation'
import GeneratePageClient from '@/components/builder/GeneratePageClient'

export const metadata = {
  title: 'Generate Project - VibePHX Builder',
  description: 'AI-powered project generation in progress'
}

interface SearchParams {
  projectId?: string
  template?: string
  idea?: string
  stack_frontend?: string
  stack_backend?: string
  stack_database?: string
  stack_aiService?: string
  stack_secretSauce?: string
}

interface PageProps {
  searchParams: Promise<SearchParams>
}

export default async function GeneratePage({ searchParams }: PageProps) {
  const params = await searchParams
  
  // Redirect if required data missing
  if (!params.template && !params.idea) {
    redirect('/builder/template')
  }

  const projectData = {
    template: params.template || '',
    customIdea: params.idea || '',
    stack: {
      frontend: params.stack_frontend || '',
      backend: params.stack_backend || '',
      database: params.stack_database || '',
      aiService: params.stack_aiService || '',
      secretSauce: params.stack_secretSauce || ''
    },
    features: [],
    deployment: {
      platform: 'vercel', // Default deployment platform
      config: {}
    }
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
            <GeneratePageClient initialProjectData={projectData} />
          </Suspense>
        </div>
      </div>
    </div>
  )
}