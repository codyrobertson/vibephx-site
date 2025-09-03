'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import TemplateSelector from './TemplateSelector'
import BuilderNavigation from './BuilderNavigation'

interface TemplatePageClientProps {
  initialIdea?: string
}

export default function TemplatePageClient({ initialIdea }: TemplatePageClientProps) {
  const router = useRouter()
  const [selectedTemplate, setSelectedTemplate] = useState<string>('')
  const [customIdea, setCustomIdea] = useState<string>(initialIdea || '')

  const canProceed = Boolean(selectedTemplate) || customIdea.trim().length > 0

  const handleNext = () => {
    const params = new URLSearchParams()
    if (selectedTemplate) {
      params.set('template', selectedTemplate)
    }
    if (customIdea) {
      params.set('idea', customIdea)
    }
    router.push(`/builder/stack?${params.toString()}`)
  }

  return (
    <>
      <TemplateSelector 
        initialIdea={initialIdea}
        onTemplateSelect={setSelectedTemplate}
        onCustomIdeaChange={setCustomIdea}
        selectedTemplate={selectedTemplate}
        customIdea={customIdea}
      />
      
      <BuilderNavigation 
        currentStep="template"
        canProceed={canProceed}
        onNext={handleNext}
      />
    </>
  )
}