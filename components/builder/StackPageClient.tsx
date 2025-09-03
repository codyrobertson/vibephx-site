'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useProjects } from '@/hooks/useProjects'
import SoftwareStackPicker from './SoftwareStackPicker'
import BuilderNavigation from './BuilderNavigation'
import type { ProjectData } from './BuilderWizard'

interface StackPageClientProps {
  initialProjectData: ProjectData
}

export default function StackPageClient({ initialProjectData }: StackPageClientProps) {
  const router = useRouter()
  const { createProject, updateProject } = useProjects()
  const [projectData, setProjectData] = useState<ProjectData>(initialProjectData)
  const [currentProjectId, setCurrentProjectId] = useState<string | null>(null)

  const updateProjectData = (updates: Partial<ProjectData>) => {
    setProjectData(prev => ({ ...prev, ...updates }))
  }

  // Create project on mount if we don't have one
  useEffect(() => {
    const createNewProject = async () => {
      if (!currentProjectId && (projectData.template || projectData.customIdea)) {
        const title = projectData.template 
          ? `Project using ${projectData.template} template`
          : `Custom project: ${projectData.customIdea?.substring(0, 50)}...`
        
        const project = await createProject({
          title,
          description: projectData.customIdea || `Project based on ${projectData.template} template`,
          template: projectData.template,
          customIdea: projectData.customIdea,
          techStack: projectData.stack,
          status: 'DRAFT'
        })

        if (project) {
          setCurrentProjectId(project.id)
        }
      }
    }

    createNewProject()
  }, [projectData.template, projectData.customIdea, currentProjectId, createProject])

  // Update project when stack changes
  useEffect(() => {
    const saveProjectData = async () => {
      if (currentProjectId && projectData.stack) {
        await updateProject(currentProjectId, {
          techStack: projectData.stack
        })
      }
    }

    saveProjectData()
  }, [projectData.stack, currentProjectId, updateProject])

  const handleNext = () => {
    // Navigate to generation page with all project data as URL params
    const params = new URLSearchParams()
    
    if (currentProjectId) {
      params.set('projectId', currentProjectId)
    }
    if (projectData.template) {
      params.set('template', projectData.template)
    }
    if (projectData.customIdea) {
      params.set('idea', projectData.customIdea)
    }
    if (projectData.stack) {
      // Serialize stack selection
      Object.entries(projectData.stack).forEach(([key, value]) => {
        if (value) params.set(`stack_${key}`, value)
      })
    }
    
    router.push(`/builder/generate?${params.toString()}`)
  }

  const handlePrevious = () => {
    const params = new URLSearchParams()
    if (projectData.template) {
      params.set('template', projectData.template)
    }
    if (projectData.customIdea) {
      params.set('idea', projectData.customIdea)
    }
    router.push(`/builder/template?${params.toString()}`)
  }

  return (
    <>
      <SoftwareStackPicker 
        projectData={projectData}
        updateProjectData={updateProjectData}
      />
      
      <BuilderNavigation 
        currentStep="stack"
        canProceed={true} // Stack selection is optional
        onNext={handleNext}
        onPrevious={handlePrevious}
      />
    </>
  )
}