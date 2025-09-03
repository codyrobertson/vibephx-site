import { Suspense } from 'react'
import TemplatePageClient from '@/components/builder/TemplatePageClient'

export const metadata = {
  title: 'Choose Template - VibePHX Builder',
  description: 'Select a project template to get started'
}

interface SearchParams {
  idea?: string
}

interface PageProps {
  searchParams: Promise<SearchParams>
}

export default async function TemplatePage({ searchParams }: PageProps) {
  const params = await searchParams
  
  return (
    <div className="min-h-screen bg-black">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-white mb-4">
              Choose Your Project Template
            </h1>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Select a template that matches your project idea, or describe a custom concept
            </p>
          </div>
          
          <Suspense fallback={
            <div className="flex items-center justify-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
            </div>
          }>
            <TemplatePageClient initialIdea={params.idea} />
          </Suspense>
        </div>
      </div>
      
      {/* Add padding bottom to account for fixed navigation */}
      <div className="pb-24"></div>
    </div>
  )
}