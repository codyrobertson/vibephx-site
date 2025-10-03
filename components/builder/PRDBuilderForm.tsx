'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Select } from '@/components/ui/select'
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card'
import {
  PRDFormData,
  PROJECT_TYPES,
  DATA_SOURCES,
  STORAGE_OPTIONS,
  TECH_STACKS,
  generateSmartDefaults,
  calculateComplexity
} from '@/lib/prd-templates'
import { saveDraft, loadDraft, validateStep, getStepTitle, getStepDescription } from '@/lib/prd-utils'
import { PlusIcon, TrashIcon, LightningBoltIcon } from '@radix-ui/react-icons'

interface PRDBuilderFormProps {
  currentStep: number
  onStepChange: (step: number) => void
  onComplete: (formData: PRDFormData) => void
}

export default function PRDBuilderForm({ currentStep, onStepChange, onComplete }: PRDBuilderFormProps) {
  const [formData, setFormData] = useState<Partial<PRDFormData>>({
    projectName: '',
    projectType: '',
    targetUsers: '',
    problemStatement: '',
    whyBuild: '',
    successMetric: '',
    goals: ['', '', ''],
    dataSources: [],
    dataDetails: {},
    coreFeatures: [{ name: '', action: '', priority: 1 }],
    niceToHaveFeatures: [],
    frontend: '',
    backend: '',
    database: '',
    deployment: ''
  })

  // Load draft on mount
  useEffect(() => {
    const draft = loadDraft()
    if (draft) {
      setFormData(draft)
    }
  }, [])

  const [aiLoading, setAiLoading] = useState(false)
  const [showComplexity, setShowComplexity] = useState(false)

  // Auto-save draft
  useEffect(() => {
    const timer = setTimeout(() => {
      saveDraft(formData)
    }, 1000)
    return () => clearTimeout(timer)
  }, [formData])

  // Apply smart defaults when project type changes
  useEffect(() => {
    if (formData.projectType && currentStep === 1) {
      const defaults = generateSmartDefaults(formData.projectType)
      setFormData(prev => {
        // Only update if we haven't already applied defaults
        const needsUpdate = !prev.frontend || !prev.backend || !prev.database || !prev.deployment
        if (needsUpdate) {
          return {
            ...prev,
            ...defaults,
            // Don't override if user already selected something
            frontend: prev.frontend || defaults.frontend,
            backend: prev.backend || defaults.backend,
            database: prev.database || defaults.database,
            deployment: prev.deployment || defaults.deployment,
            dataSources: prev.dataSources?.length ? prev.dataSources : defaults.dataSources
          }
        }
        return prev
      })
    }
  }, [formData.projectType, currentStep])

  const updateField = (field: keyof PRDFormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const canProceed = validateStep(currentStep, formData)

  // Debug logging
  useEffect(() => {
    console.log('Form validation:', {
      currentStep,
      canProceed,
      formData: {
        projectName: formData.projectName,
        projectType: formData.projectType,
        targetUsers: formData.targetUsers
      }
    })
  }, [currentStep, canProceed, formData])

  const handleNext = () => {
    if (currentStep < 6) {
      onStepChange(currentStep + 1)
    } else {
      onComplete(formData as PRDFormData)
    }
  }

  const handleBack = () => {
    if (currentStep > 1) {
      onStepChange(currentStep - 1)
    }
  }

  const getAISuggestion = async (type: string) => {
    setAiLoading(true)
    try {
      const response = await fetch('/api/prd/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          enhancementType: type,
          context: formData
        })
      })
      const data = await response.json()
      return data.suggestion
    } catch (error) {
      console.error('AI suggestion failed:', error)
      return null
    } finally {
      setAiLoading(false)
    }
  }

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return <Step1Basics formData={formData} updateField={updateField} />
      case 2:
        return <Step2Purpose formData={formData} updateField={updateField} getAISuggestion={getAISuggestion} aiLoading={aiLoading} />
      case 3:
        return <Step3Data formData={formData} updateField={updateField} />
      case 4:
        return <Step4Features formData={formData} updateField={updateField} />
      case 5:
        return <Step5TechStack formData={formData} updateField={updateField} />
      case 6:
        return <Step6Review formData={formData} />
      default:
        return null
    }
  }

  const complexity = calculateComplexity(formData)

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Progress Bar */}
      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold text-white">
              Step {currentStep}: {getStepTitle(currentStep)}
            </h2>
            <p className="text-gray-400 text-sm">{getStepDescription(currentStep)}</p>
          </div>
          {currentStep < 6 && (
            <button
              onClick={() => setShowComplexity(!showComplexity)}
              className="text-sm text-orange-400 hover:text-orange-300"
            >
              Complexity: {complexity.level}
            </button>
          )}
        </div>
        <div className="w-full bg-gray-800 rounded-full h-2">
          <div
            className="bg-orange-500 h-2 rounded-full transition-all duration-300"
            style={{ width: `${(currentStep / 6) * 100}%` }}
          />
        </div>
        {showComplexity && complexity.warnings.length > 0 && (
          <div className="bg-yellow-900/20 border border-yellow-600/30 rounded-lg p-4">
            <p className="text-yellow-400 text-sm font-medium mb-2">⚠️ Complexity Warnings:</p>
            <ul className="text-yellow-300 text-sm space-y-1">
              {complexity.warnings.map((warning, i) => (
                <li key={i}>• {warning}</li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* Step Content */}
      <div className="bg-gray-900 border border-gray-800 rounded-lg p-6">
        {renderStep()}
      </div>

      {/* Navigation */}
      <div className="flex justify-between">
        <Button
          variant="secondary"
          onClick={handleBack}
          disabled={currentStep === 1}
        >
          Back
        </Button>
        <Button
          onClick={handleNext}
          disabled={!canProceed}
        >
          {currentStep === 6 ? 'Generate PRD' : 'Next'}
        </Button>
      </div>
    </div>
  )
}

// Step 1: Project Basics
function Step1Basics({ formData, updateField }: any) {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="projectName">Project Name</Label>
        <Input
          id="projectName"
          value={formData.projectName || ''}
          onChange={e => updateField('projectName', e.target.value)}
          placeholder="e.g., AI Lead Scorer"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="projectType">Project Type</Label>
        <Select
          id="projectType"
          value={formData.projectType || ''}
          onChange={e => updateField('projectType', e.target.value)}
        >
          <option value="">Select a type...</option>
          {PROJECT_TYPES.map(type => (
            <option key={type} value={type}>{type}</option>
          ))}
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="targetUsers">Target Users</Label>
        <Input
          id="targetUsers"
          value={formData.targetUsers || ''}
          onChange={e => updateField('targetUsers', e.target.value)}
          placeholder="e.g., SMBs, freelancers, consultants"
        />
      </div>
    </div>
  )
}

// Step 2: Purpose & Goals
function Step2Purpose({ formData, updateField, getAISuggestion, aiLoading }: any) {
  const [localGoals, setLocalGoals] = useState(formData.goals || ['', '', ''])

  const updateGoal = (index: number, value: string) => {
    const newGoals = [...localGoals]
    newGoals[index] = value
    setLocalGoals(newGoals)
    updateField('goals', newGoals)
  }

  const addGoal = () => {
    const newGoals = [...localGoals, '']
    setLocalGoals(newGoals)
    updateField('goals', newGoals)
  }

  const removeGoal = (index: number) => {
    const newGoals = localGoals.filter((_, i) => i !== index)
    setLocalGoals(newGoals)
    updateField('goals', newGoals)
  }

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="problemStatement">What problem does this solve?</Label>
        <Textarea
          id="problemStatement"
          value={formData.problemStatement || ''}
          onChange={e => updateField('problemStatement', e.target.value)}
          placeholder="Describe the specific problem your users face..."
          rows={4}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="whyBuild">Why build this instead of using existing tools?</Label>
        <Textarea
          id="whyBuild"
          value={formData.whyBuild || ''}
          onChange={e => updateField('whyBuild', e.target.value)}
          placeholder="What makes your solution unique or better..."
          rows={3}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="successMetric">Primary Success Metric</Label>
        <Input
          id="successMetric"
          value={formData.successMetric || ''}
          onChange={e => updateField('successMetric', e.target.value)}
          placeholder="e.g., 100 signups in first week, 80% user satisfaction"
        />
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Label>Project Goals (at least 3)</Label>
          <Button size="sm" variant="outline" onClick={addGoal}>
            <PlusIcon className="w-4 h-4 mr-1" /> Add Goal
          </Button>
        </div>
        {localGoals.map((goal, index) => (
          <div key={index} className="flex gap-2">
            <Input
              value={goal}
              onChange={e => updateGoal(index, e.target.value)}
              placeholder={`Goal ${index + 1}`}
            />
            {localGoals.length > 1 && (
              <Button
                size="sm"
                variant="ghost"
                onClick={() => removeGoal(index)}
              >
                <TrashIcon className="w-4 h-4" />
              </Button>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

// Step 3: Data Architecture
function Step3Data({ formData, updateField }: any) {
  const [mode, setMode] = useState<'ai' | 'diy'>('ai')
  const [selectedSources, setSelectedSources] = useState<string[]>(formData.dataSources || [])
  const [dataDetails, setDataDetails] = useState(formData.dataDetails || {})
  const [showDIY, setShowDIY] = useState(false)

  const toggleDataSource = (source: string) => {
    const newSources = selectedSources.includes(source)
      ? selectedSources.filter(s => s !== source)
      : [...selectedSources, source]

    setSelectedSources(newSources)
    updateField('dataSources', newSources)

    // Initialize details for new source
    if (!selectedSources.includes(source)) {
      const newDetails = { ...dataDetails, [source]: { description: '', storage: '' } }
      setDataDetails(newDetails)
      updateField('dataDetails', newDetails)
    }
  }

  const updateDataDetail = (source: string, field: 'description' | 'storage', value: string) => {
    const newDetails = {
      ...dataDetails,
      [source]: { ...dataDetails[source], [field]: value }
    }
    setDataDetails(newDetails)
    updateField('dataDetails', newDetails)
  }

  const suggestDataSources = () => {
    // Based on project type, suggest common sources
    const projectType = formData.projectType
    const suggestions: Record<string, string[]> = {
      'Landing Page': ['User input forms', 'Static content'],
      'Dashboard': ['Database', 'External API'],
      'Data Tool': ['File uploads', 'External API', 'Database'],
      'E-commerce': ['Database', 'User input forms', 'Third-party integrations'],
      'Form/Survey': ['User input forms', 'Database']
    }

    const suggested = suggestions[projectType] || ['User input forms', 'Database']
    setSelectedSources(suggested)
    updateField('dataSources', suggested)

    // Initialize details with smart defaults
    const autoDetails: any = {}
    suggested.forEach(source => {
      autoDetails[source] = {
        description: `Auto-generated for ${projectType}`,
        storage: source.includes('form') ? 'Database (PostgreSQL/MySQL)' :
                 source.includes('API') ? 'API (External Service)' :
                 source.includes('Database') ? 'Database (PostgreSQL/MySQL)' :
                 'Database (PostgreSQL/MySQL)'
      }
    })
    setDataDetails(autoDetails)
    updateField('dataDetails', autoDetails)
    setShowDIY(true)
  }

  return (
    <div className="space-y-6">
      {/* Mode Toggle */}
      <div className="flex gap-2 p-1 bg-gray-800 rounded-lg w-fit">
        <button
          onClick={() => setMode('ai')}
          className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
            mode === 'ai'
              ? 'bg-orange-500 text-black'
              : 'text-gray-400 hover:text-white'
          }`}
        >
          AI Mode (Recommended)
        </button>
        <button
          onClick={() => { setMode('diy'); setShowDIY(true); }}
          className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
            mode === 'diy'
              ? 'bg-orange-500 text-black'
              : 'text-gray-400 hover:text-white'
          }`}
        >
          DIY Mode
        </button>
      </div>

      {/* AI Mode - Educational Cards */}
      {mode === 'ai' && (
        <div className="space-y-4">
          <div className="bg-blue-900/20 border border-blue-600/30 rounded-lg p-4">
            <h3 className="text-blue-300 font-medium mb-2">💡 How Data Architecture Works</h3>
            <p className="text-blue-200 text-sm">
              Every app needs to know: Where does data come from? Where does it go? How is it stored?
              Let AI suggest the right architecture for your {formData.projectType || 'project'}.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="bg-gray-800 border-gray-700 p-4">
              <div className="text-2xl mb-2">📥</div>
              <h4 className="text-white font-medium mb-2">Data Input</h4>
              <p className="text-gray-400 text-sm">
                Where your data comes from: forms, APIs, file uploads, or third-party services
              </p>
            </Card>

            <Card className="bg-gray-800 border-gray-700 p-4">
              <div className="text-2xl mb-2">💾</div>
              <h4 className="text-white font-medium mb-2">Data Storage</h4>
              <p className="text-gray-400 text-sm">
                How and where data is persisted: databases, cloud storage, or external APIs
              </p>
            </Card>

            <Card className="bg-gray-800 border-gray-700 p-4">
              <div className="text-2xl mb-2">🔄</div>
              <h4 className="text-white font-medium mb-2">Data Flow</h4>
              <p className="text-gray-400 text-sm">
                How data moves through your app: from input → processing → storage → display
              </p>
            </Card>
          </div>

          <div className="bg-green-900/20 border border-green-600/30 rounded-lg p-4">
            <h4 className="text-green-300 font-medium mb-2">✨ AI Recommendation</h4>
            <p className="text-green-200 text-sm mb-3">
              Based on your {formData.projectType || 'project'}, I recommend these data sources:
            </p>
            <div className="flex flex-wrap gap-2 mb-3">
              {(formData.projectType === 'Landing Page'
                ? ['User input forms', 'Static content']
                : formData.projectType === 'Dashboard'
                ? ['Database', 'External API']
                : formData.projectType === 'Data Tool'
                ? ['File uploads', 'External API', 'Database']
                : ['User input forms', 'Database']
              ).map(source => (
                <span key={source} className="px-3 py-1 bg-green-700/30 text-green-200 rounded-md text-sm">
                  {source}
                </span>
              ))}
            </div>
            <Button size="sm" onClick={suggestDataSources}>
              Apply AI Suggestions
            </Button>
          </div>

          {/* Accordion for DIY */}
          {!showDIY ? (
            <button
              onClick={() => setShowDIY(true)}
              className="w-full p-3 bg-gray-800 border border-gray-700 rounded-lg text-left flex items-center justify-between hover:border-gray-600 transition-colors"
            >
              <span className="text-gray-300 text-sm">Want to customize? Expand DIY Mode →</span>
              <span className="text-gray-400">▼</span>
            </button>
          ) : (
            <button
              onClick={() => setShowDIY(false)}
              className="w-full p-3 bg-gray-800 border border-orange-600/30 rounded-lg text-left flex items-center justify-between hover:border-orange-500 transition-colors"
            >
              <span className="text-orange-300 text-sm font-medium">DIY Mode (Expanded)</span>
              <span className="text-orange-400">▲</span>
            </button>
          )}
        </div>
      )}

      {/* DIY Mode or Expanded Section */}
      {(mode === 'diy' || showDIY) && (
        <div className="space-y-4">
          <div className="space-y-3">
            <Label>Data Sources (select all that apply)</Label>
            <div className="grid grid-cols-2 gap-3">
              {DATA_SOURCES.map(source => (
                <button
                  key={source}
                  onClick={() => toggleDataSource(source)}
                  className={`p-3 rounded-lg border text-left transition-colors ${
                    selectedSources.includes(source)
                      ? 'border-orange-500 bg-orange-500/10 text-white'
                      : 'border-gray-700 bg-gray-800 text-gray-300 hover:border-gray-600'
                  }`}
                >
                  <span className="text-sm">{source}</span>
                </button>
              ))}
            </div>
          </div>

          {selectedSources.length > 0 && (
            <div className="space-y-4">
              <Label>Data Source Details</Label>
              {selectedSources.map(source => (
                <Card key={source} className="bg-gray-800 border-gray-700 p-4">
                  <h4 className="text-white font-medium mb-3">{source}</h4>
                  <div className="space-y-3">
                    <div className="space-y-1">
                      <Label className="text-xs">Description</Label>
                      <Textarea
                        value={dataDetails[source]?.description || ''}
                        onChange={e => updateDataDetail(source, 'description', e.target.value)}
                        placeholder="What data will you collect..."
                        rows={2}
                      />
                    </div>
                    <div className="space-y-1">
                      <Label className="text-xs">Storage</Label>
                      <Select
                        value={dataDetails[source]?.storage || ''}
                        onChange={e => updateDataDetail(source, 'storage', e.target.value)}
                      >
                        <option value="">Select storage...</option>
                        {STORAGE_OPTIONS.map(option => (
                          <option key={option} value={option}>{option}</option>
                        ))}
                      </Select>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}

// Step 4: Features & Actions
function Step4Features({ formData, updateField }: any) {
  const [coreFeatures, setCoreFeatures] = useState(formData.coreFeatures || [{ name: '', action: '', priority: 1 }])
  const [niceToHave, setNiceToHave] = useState(formData.niceToHaveFeatures || [])

  const updateCoreFeature = (index: number, field: string, value: any) => {
    const newFeatures = [...coreFeatures]
    newFeatures[index] = { ...newFeatures[index], [field]: value }
    setCoreFeatures(newFeatures)
    updateField('coreFeatures', newFeatures)
  }

  const addCoreFeature = () => {
    const newFeatures = [...coreFeatures, { name: '', action: '', priority: 1 }]
    setCoreFeatures(newFeatures)
    updateField('coreFeatures', newFeatures)
  }

  const removeCoreFeature = (index: number) => {
    const newFeatures = coreFeatures.filter((_, i) => i !== index)
    setCoreFeatures(newFeatures)
    updateField('coreFeatures', newFeatures)
  }

  const updateNiceToHave = (index: number, field: string, value: string) => {
    const newFeatures = [...niceToHave]
    newFeatures[index] = { ...newFeatures[index], [field]: value }
    setNiceToHave(newFeatures)
    updateField('niceToHaveFeatures', newFeatures)
  }

  const addNiceToHave = () => {
    const newFeatures = [...niceToHave, { name: '', action: '' }]
    setNiceToHave(newFeatures)
    updateField('niceToHaveFeatures', newFeatures)
  }

  const removeNiceToHave = (index: number) => {
    const newFeatures = niceToHave.filter((_, i) => i !== index)
    setNiceToHave(newFeatures)
    updateField('niceToHaveFeatures', newFeatures)
  }

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Label>Core Features (Must Have)</Label>
          <Button size="sm" variant="outline" onClick={addCoreFeature}>
            <PlusIcon className="w-4 h-4 mr-1" /> Add Feature
          </Button>
        </div>
        {coreFeatures.map((feature, index) => (
          <Card key={index} className="bg-gray-800 border-gray-700 p-4">
            <div className="space-y-3">
              <div className="flex gap-2">
                <div className="flex-1 space-y-1">
                  <Label className="text-xs">Feature Name</Label>
                  <Input
                    value={feature.name}
                    onChange={e => updateCoreFeature(index, 'name', e.target.value)}
                    placeholder="e.g., CSV Upload"
                  />
                </div>
                <div className="w-32 space-y-1">
                  <Label className="text-xs">Priority</Label>
                  <Select
                    value={feature.priority}
                    onChange={e => updateCoreFeature(index, 'priority', parseInt(e.target.value))}
                  >
                    <option value={1}>1 (High)</option>
                    <option value={2}>2 (Med)</option>
                    <option value={3}>3 (Low)</option>
                  </Select>
                </div>
                {coreFeatures.length > 1 && (
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => removeCoreFeature(index)}
                    className="mt-auto"
                  >
                    <TrashIcon className="w-4 h-4" />
                  </Button>
                )}
              </div>
              <div className="space-y-1">
                <Label className="text-xs">User Action</Label>
                <Input
                  value={feature.action}
                  onChange={e => updateCoreFeature(index, 'action', e.target.value)}
                  placeholder="What does the user do with this feature?"
                />
              </div>
            </div>
          </Card>
        ))}
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Label>Nice-to-Have Features (Optional)</Label>
          <Button size="sm" variant="outline" onClick={addNiceToHave}>
            <PlusIcon className="w-4 h-4 mr-1" /> Add Feature
          </Button>
        </div>
        {niceToHave.length > 0 && niceToHave.map((feature, index) => (
          <div key={index} className="flex gap-2">
            <Input
              value={feature.name}
              onChange={e => updateNiceToHave(index, 'name', e.target.value)}
              placeholder="Feature name"
              className="flex-1"
            />
            <Input
              value={feature.action}
              onChange={e => updateNiceToHave(index, 'action', e.target.value)}
              placeholder="User action"
              className="flex-1"
            />
            <Button
              size="sm"
              variant="ghost"
              onClick={() => removeNiceToHave(index)}
            >
              <TrashIcon className="w-4 h-4" />
            </Button>
          </div>
        ))}
      </div>
    </div>
  )
}

// Step 5: Technical Stack
function Step5TechStack({ formData, updateField }: any) {
  return (
    <div className="space-y-6">
      <div className="bg-blue-900/20 border border-blue-600/30 rounded-lg p-4 mb-4">
        <p className="text-blue-300 text-sm">
          💡 These defaults are pre-selected based on your project type. Feel free to adjust as needed.
        </p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="frontend">Frontend Framework</Label>
        <Select
          id="frontend"
          value={formData.frontend || ''}
          onChange={e => updateField('frontend', e.target.value)}
        >
          <option value="">Select frontend...</option>
          {TECH_STACKS.frontend.map(tech => (
            <option key={tech} value={tech}>{tech}</option>
          ))}
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="backend">Backend / API</Label>
        <Select
          id="backend"
          value={formData.backend || ''}
          onChange={e => updateField('backend', e.target.value)}
        >
          <option value="">Select backend...</option>
          {TECH_STACKS.backend.map(tech => (
            <option key={tech} value={tech}>{tech}</option>
          ))}
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="database">Database</Label>
        <Select
          id="database"
          value={formData.database || ''}
          onChange={e => updateField('database', e.target.value)}
        >
          <option value="">Select database...</option>
          {TECH_STACKS.database.map(tech => (
            <option key={tech} value={tech}>{tech}</option>
          ))}
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="deployment">Deployment Platform</Label>
        <Select
          id="deployment"
          value={formData.deployment || ''}
          onChange={e => updateField('deployment', e.target.value)}
        >
          <option value="">Select deployment...</option>
          {TECH_STACKS.deployment.map(tech => (
            <option key={tech} value={tech}>{tech}</option>
          ))}
        </Select>
      </div>
    </div>
  )
}

// Step 6: Review
function Step6Review({ formData }: any) {
  const complexity = calculateComplexity(formData)

  return (
    <div className="space-y-6">
      <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
        <h3 className="text-xl font-bold text-white mb-4">Review Your PRD</h3>

        <div className="space-y-4 text-sm">
          <div>
            <p className="text-gray-400">Project Name</p>
            <p className="text-white font-medium">{formData.projectName}</p>
          </div>

          <div>
            <p className="text-gray-400">Type & Users</p>
            <p className="text-white">{formData.projectType} for {formData.targetUsers}</p>
          </div>

          <div>
            <p className="text-gray-400">Complexity</p>
            <p className="text-white">
              <span className={`font-bold ${
                complexity.level === 'Simple' ? 'text-green-400' :
                complexity.level === 'Moderate' ? 'text-yellow-400' :
                complexity.level === 'Complex' ? 'text-orange-400' :
                'text-red-400'
              }`}>
                {complexity.level}
              </span>
              {' '}(Score: {complexity.score})
            </p>
          </div>

          <div>
            <p className="text-gray-400">Core Features</p>
            <p className="text-white">{formData.coreFeatures?.length || 0} features</p>
          </div>

          <div>
            <p className="text-gray-400">Tech Stack</p>
            <p className="text-white">{formData.frontend} + {formData.backend} + {formData.database}</p>
          </div>

          <div>
            <p className="text-gray-400">Deployment</p>
            <p className="text-white">{formData.deployment}</p>
          </div>
        </div>
      </div>

      {complexity.warnings.length > 0 && (
        <div className="bg-yellow-900/20 border border-yellow-600/30 rounded-lg p-4">
          <p className="text-yellow-400 font-medium mb-2">⚠️ Warnings:</p>
          <ul className="text-yellow-300 text-sm space-y-1">
            {complexity.warnings.map((warning, i) => (
              <li key={i}>• {warning}</li>
            ))}
          </ul>
        </div>
      )}

      <div className="bg-green-900/20 border border-green-600/30 rounded-lg p-4">
        <p className="text-green-300 text-sm">
          ✅ Ready to generate! Click "Generate PRD" to create your comprehensive product requirements document.
        </p>
      </div>
    </div>
  )
}
