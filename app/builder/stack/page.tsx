import { Suspense } from 'react'
import { redirect } from 'next/navigation'
import SoftwareStackPicker from '@/components/builder/SoftwareStackPicker'

export const metadata = {
  title: 'Choose Tech Stack - VibePHX Builder',
  description: 'Select your technology stack'
}

interface SearchParams {
  template?: string
  idea?: string
}

interface PageProps {
  searchParams: Promise<SearchParams>
}

export default async function StackPage({ searchParams }: PageProps) {
  const params = await searchParams
  
  // Redirect if no template selected
  if (!params.template && !params.idea) {
    redirect('/builder/template')
  }

  const projectData = {
    template: params.template || '',
    customIdea: params.idea || '',
    stack: {},
    deployment: ''
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-white mb-4">
              Choose Your Tech Stack
            </h1>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Select the technologies that will power your {params.template || 'custom'} project
            </p>
            
            {params.template && (
              <div className="mt-4 inline-block px-4 py-2 bg-blue-950/30 border border-blue-800/30 rounded-lg">
                <span className="text-blue-400 font-medium">Template: {params.template}</span>
              </div>
            )}
          </div>
          
          <Suspense fallback={
            <div className="flex items-center justify-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
            </div>
          }>
            <SoftwareStackPicker 
              projectData={projectData}
              updateProjectData={() => {}} // Will handle with form submission
            />
          </Suspense>
        </div>
      </div>
    </div>
  )
}