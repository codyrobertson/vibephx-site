import { PRDFormData } from './prd-templates'

export function saveDraft(formData: Partial<PRDFormData>): void {
  if (typeof window === 'undefined') return
  try {
    localStorage.setItem('prd-draft', JSON.stringify(formData))
    localStorage.setItem('prd-draft-timestamp', new Date().toISOString())
  } catch (error) {
    console.error('Failed to save draft:', error)
  }
}

export function loadDraft(): Partial<PRDFormData> | null {
  if (typeof window === 'undefined') return null
  try {
    const draft = localStorage.getItem('prd-draft')
    return draft ? JSON.parse(draft) : null
  } catch (error) {
    console.error('Failed to load draft:', error)
    return null
  }
}

export function clearDraft(): void {
  if (typeof window === 'undefined') return
  try {
    localStorage.removeItem('prd-draft')
    localStorage.removeItem('prd-draft-timestamp')
  } catch (error) {
    console.error('Failed to clear draft:', error)
  }
}

export function getDraftTimestamp(): string | null {
  if (typeof window === 'undefined') return null
  try {
    return localStorage.getItem('prd-draft-timestamp')
  } catch (error) {
    console.error('Failed to get draft timestamp:', error)
    return null
  }
}

export function downloadMarkdown(content: string, filename: string = 'prd.md'): void {
  const blob = new Blob([content], { type: 'text/markdown' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}

export function downloadJSON(data: any, filename: string = 'prd.json'): void {
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}

export function copyToClipboard(text: string): Promise<void> {
  if (typeof window === 'undefined') return Promise.reject('Window not available')

  if (navigator.clipboard && navigator.clipboard.writeText) {
    return navigator.clipboard.writeText(text)
  }

  // Fallback for older browsers
  const textArea = document.createElement('textarea')
  textArea.value = text
  textArea.style.position = 'fixed'
  textArea.style.left = '-999999px'
  document.body.appendChild(textArea)
  textArea.select()

  try {
    document.execCommand('copy')
    document.body.removeChild(textArea)
    return Promise.resolve()
  } catch (error) {
    document.body.removeChild(textArea)
    return Promise.reject(error)
  }
}

export function validateStep(step: number, formData: Partial<PRDFormData>): boolean {
  switch (step) {
    case 1:
      return !!(
        formData.projectName?.trim() &&
        formData.projectType &&
        formData.targetUsers?.trim()
      )
    case 2:
      return !!(
        formData.problemStatement?.trim() &&
        formData.whyBuild?.trim() &&
        formData.successMetric?.trim() &&
        formData.goals &&
        formData.goals.length > 0 &&
        formData.goals.every(g => g.trim())
      )
    case 3:
      return !!(
        formData.dataSources &&
        formData.dataSources.length > 0
      )
    case 4:
      return !!(
        formData.coreFeatures &&
        formData.coreFeatures.length > 0 &&
        formData.coreFeatures.every(f => f.name.trim() && f.action.trim())
      )
    case 5:
      return !!(
        formData.frontend &&
        formData.backend &&
        formData.database &&
        formData.deployment
      )
    default:
      return false
  }
}

export function getStepTitle(step: number): string {
  const titles: Record<number, string> = {
    1: 'Project Basics',
    2: 'Purpose & Goals',
    3: 'Data Architecture',
    4: 'Features & Actions',
    5: 'Technical Stack',
    6: 'Review & Generate'
  }
  return titles[step] || 'Unknown Step'
}

export function getStepDescription(step: number): string {
  const descriptions: Record<number, string> = {
    1: 'Tell us about your project',
    2: 'Define the problem and goals',
    3: 'Plan your data flow',
    4: 'List core features',
    5: 'Choose your tech stack',
    6: 'Review and generate your PRD'
  }
  return descriptions[step] || ''
}
