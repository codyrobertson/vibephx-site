'use client'

import { useState, useEffect } from 'react'
import { useUser } from '@stackframe/stack'

export interface Project {
  id: string
  title: string
  description?: string
  template?: string
  customIdea?: string
  techStack?: Record<string, any>
  status: 'DRAFT' | 'GENERATING' | 'COMPLETED' | 'ERROR'
  generated?: Record<string, any>
  createdAt: string
  updatedAt: string
}

export function useProjects() {
  const user = useUser()
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchProjects = async () => {
    if (!user) {
      setProjects([])
      setLoading(false)
      return
    }

    try {
      setLoading(true)
      const response = await fetch('/api/projects')
      if (!response.ok) {
        throw new Error(`Failed to fetch projects: ${response.statusText}`)
      }
      const data = await response.json()
      setProjects(data)
      setError(null)
    } catch (err) {
      console.error('Error fetching projects:', err)
      setError(err instanceof Error ? err.message : 'Failed to fetch projects')
    } finally {
      setLoading(false)
    }
  }

  const createProject = async (projectData: {
    title: string
    description?: string
    template?: string
    customIdea?: string
    techStack?: Record<string, any>
    status?: 'DRAFT' | 'GENERATING' | 'COMPLETED' | 'ERROR'
  }): Promise<Project | null> => {
    try {
      const response = await fetch('/api/projects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(projectData),
      })

      if (!response.ok) {
        throw new Error(`Failed to create project: ${response.statusText}`)
      }

      const project = await response.json()
      setProjects(prev => [project, ...prev])
      return project
    } catch (err) {
      console.error('Error creating project:', err)
      setError(err instanceof Error ? err.message : 'Failed to create project')
      return null
    }
  }

  const updateProject = async (
    id: string,
    updates: Partial<Project>
  ): Promise<Project | null> => {
    try {
      const response = await fetch(`/api/projects/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      })

      if (!response.ok) {
        throw new Error(`Failed to update project: ${response.statusText}`)
      }

      const updatedProject = await response.json()
      setProjects(prev => 
        prev.map(project => project.id === id ? updatedProject : project)
      )
      return updatedProject
    } catch (err) {
      console.error('Error updating project:', err)
      setError(err instanceof Error ? err.message : 'Failed to update project')
      return null
    }
  }

  const deleteProject = async (id: string): Promise<boolean> => {
    try {
      const response = await fetch(`/api/projects/${id}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        throw new Error(`Failed to delete project: ${response.statusText}`)
      }

      setProjects(prev => prev.filter(project => project.id !== id))
      return true
    } catch (err) {
      console.error('Error deleting project:', err)
      setError(err instanceof Error ? err.message : 'Failed to delete project')
      return false
    }
  }

  useEffect(() => {
    fetchProjects()
  }, [user])

  return {
    projects,
    loading,
    error,
    createProject,
    updateProject,
    deleteProject,
    refetch: fetchProjects,
  }
}