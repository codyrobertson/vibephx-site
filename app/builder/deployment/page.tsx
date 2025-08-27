import { Suspense } from 'react'
import { redirect } from 'next/navigation'
import DeploymentPicker from '@/components/builder/DeploymentPicker'

export const metadata = {
  title: 'Choose Deployment - VibePHX Builder',
  description: 'Select your deployment platform'
}

interface SearchParams {
  template?: string
  idea?: string
  frontend?: string
  backend?: string
  database?: string
  aiService?: string
}

interface PageProps {
  searchParams: Promise<SearchParams>
}

export default async function DeploymentPage({ searchParams }: PageProps) {
  const params = await searchParams
  
  // Redirect if no stack selected
  if (!params.frontend) {
    redirect('/builder/stack' + (params.template ? `?template=${params.template}` : ''))
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
    deployment: ''
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-white mb-4">
              Choose Deployment Platform
            </h1>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Select where you want to deploy and host your application
            </p>
            
            <div className="mt-6 flex flex-wrap justify-center gap-3">
              <div className="px-3 py-1 bg-purple-950/30 border border-purple-800/30 rounded text-purple-400 text-sm">
                {params.template || 'Custom Project'}
              </div>
              <div className="px-3 py-1 bg-blue-950/30 border border-blue-800/30 rounded text-blue-400 text-sm">
                {params.frontend}
              </div>
              {params.backend && (
                <div className="px-3 py-1 bg-green-950/30 border border-green-800/30 rounded text-green-400 text-sm">
                  {params.backend}
                </div>
              )}
              {params.database && (
                <div className="px-3 py-1 bg-orange-950/30 border border-orange-800/30 rounded text-orange-400 text-sm">
                  {params.database}
                </div>
              )}
            </div>
          </div>
          
          <Suspense fallback={
            <div className="flex items-center justify-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
            </div>
          }>
            <DeploymentPicker 
              projectData={projectData}
              updateProjectData={() => {}} // Will handle with form submission
            />
          </Suspense>
        </div>
      </div>
    </div>
  )
}