import { Suspense } from 'react'
import { redirect } from 'next/navigation'
import ResultsPageClient from '@/components/builder/ResultsPageClient'

export const metadata = {
  title: 'Project Results - VibePHX Builder',
  description: 'Your generated project is ready'
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
  generated?: string
}

interface PageProps {
  searchParams: Promise<SearchParams>
}

export default async function ResultsPage({ searchParams }: PageProps) {
  const params = await searchParams
  
  // Redirect if not generated or missing required data
  if (!params.generated || !params.projectId || (!params.template && !params.idea)) {
    redirect('/builder/template')
  }

  const projectData = {
    projectId: params.projectId || '',
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
      platform: 'vercel',
      config: {}
    }
  }

  return (
    <div className="min-h-screen bg-black">
      <Suspense fallback={
        <div className="flex items-center justify-center py-20 bg-black">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
        </div>
      }>
        <ResultsPageClient projectData={projectData} />
      </Suspense>
    </div>
  )
}