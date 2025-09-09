'use client'

import { createContext, useContext, useState, ReactNode } from 'react'

interface BuilderProgress {
  currentStep: number
  totalSteps: number
  stepTitle?: string
}

interface BuilderContextType {
  progress: BuilderProgress | null
  setProgress: (progress: BuilderProgress | null) => void
}

const BuilderContext = createContext<BuilderContextType | undefined>(undefined)

export function BuilderProvider({ children }: { children: ReactNode }) {
  const [progress, setProgress] = useState<BuilderProgress | null>(null)

  return (
    <BuilderContext.Provider value={{ progress, setProgress }}>
      {children}
    </BuilderContext.Provider>
  )
}

export function useBuilder() {
  const context = useContext(BuilderContext)
  if (context === undefined) {
    throw new Error('useBuilder must be used within a BuilderProvider')
  }
  return context
}