'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { CheckIcon } from '@radix-ui/react-icons'

export default function OnboardingPage() {
  const router = useRouter()
  const [step, setStep] = useState(0)
  
  const [skillLevel, setSkillLevel] = useState<string>('')
  const [interests, setInterests] = useState<string[]>([])
  const [primaryGoal, setPrimaryGoal] = useState<string>('')
  const [timeCommitment, setTimeCommitment] = useState<string>('')
  const [techPreferences, setTechPreferences] = useState<string[]>([])
  const [hasTeam, setHasTeam] = useState<boolean>(false)
  const [preferredComplexity, setPreferredComplexity] = useState<string>('')

  const steps = [
    {
      title: "What is your coding experience?",
      subtitle: "This helps us suggest projects that match your skill level",
      field: 'skillLevel',
      options: [
        { id: 'beginner', label: 'Beginner', desc: 'Learning the basics, comfortable with tutorials' },
        { id: 'intermediate', label: 'Intermediate', desc: 'Can build apps, want to level up' },
        { id: 'advanced', label: 'Advanced', desc: 'Experienced, looking for complex challenges' }
      ]
    },
    {
      title: "What interests you?",
      subtitle: 'Pick all that apply',
      field: 'interests',
      multiSelect: true,
      options: [
        { id: 'saas', label: 'SaaS Tools' },
        { id: 'ecommerce', label: 'E-commerce' },
        { id: 'ai-tools', label: 'AI Tools' },
        { id: 'dashboards', label: 'Dashboards & Analytics' },
        { id: 'landing-pages', label: 'Landing Pages' },
        { id: 'mobile', label: 'Mobile Apps' }
      ]
    },
    {
      title: 'Primary goal?',
      subtitle: "What's driving you to build?",
      field: 'primaryGoal',
      options: [
        { id: 'learn', label: 'Learn & Practice' },
        { id: 'side-project', label: 'Side Project / Portfolio' },
        { id: 'startup', label: 'Startup / Business' },
        { id: 'client-work', label: 'Client Work' }
      ]
    },
    {
      title: 'Time commitment?',
      subtitle: 'How much time can you dedicate?',
      field: 'timeCommitment',
      options: [
        { id: '1-day', label: '1 Day', desc: 'Quick MVP I can ship today' },
        { id: '1-week', label: '1 Week', desc: 'Short focused sprint' },
        { id: '1-month', label: '1 Month', desc: 'More complex project' }
      ]
    },
    {
      title: 'Tech preferences?',
      subtitle: 'What do you want to use? (pick all that apply)',
      field: 'techPreferences',
      multiSelect: true,
      options: [
        { id: 'nextjs', label: 'Next.js' },
        { id: 'react', label: 'React' },
        { id: 'typescript', label: 'TypeScript' },
        { id: 'python', label: 'Python' },
        { id: 'tailwind', label: 'Tailwind CSS' },
        { id: 'supabase', label: 'Supabase' }
      ]
    },
    {
      title: 'Building solo or with a team?',
      subtitle: 'This affects our project scope recommendations',
      field: 'hasTeam',
      options: [
        { id: 'solo', label: 'Solo', desc: 'Just me' },
        { id: 'team', label: 'Team', desc: 'Collaborating with others' }
      ]
    },
    {
      title: 'Preferred complexity?',
      subtitle: 'What level of challenge do you want?',
      field: 'preferredComplexity',
      options: [
        { id: 'simple', label: 'Simple', desc: 'Ship fast, minimal features' },
        { id: 'moderate', label: 'Moderate', desc: 'Balanced features and quality' },
        { id: 'complex', label: 'Complex', desc: 'Feature-rich, production-grade' }
      ]
    }
  ]

  const currentStep = steps[step]
  const progress = ((step + 1) / steps.length) * 100

  const getValue = (field: string) => {
    switch (field) {
      case 'skillLevel': return skillLevel
      case 'interests': return interests
      case 'primaryGoal': return primaryGoal
      case 'timeCommitment': return timeCommitment
      case 'techPreferences': return techPreferences
      case 'hasTeam': return hasTeam ? 'team' : 'solo'
      case 'preferredComplexity': return preferredComplexity
      default: return null
    }
  }

  const handleSelect = (optionId: string) => {
    const field = currentStep.field
    if (currentStep.multiSelect) {
      const current = getValue(field) as string[]
      const updated = current.includes(optionId) ? current.filter(x => x !== optionId) : [...current, optionId]
      if (field === 'interests') setInterests(updated)
      if (field === 'techPreferences') setTechPreferences(updated)
    } else {
      if (field === 'skillLevel') setSkillLevel(optionId)
      if (field === 'primaryGoal') setPrimaryGoal(optionId)
      if (field === 'timeCommitment') setTimeCommitment(optionId)
      if (field === 'hasTeam') setHasTeam(optionId === 'team')
      if (field === 'preferredComplexity') setPreferredComplexity(optionId)
    }
  }

  const canContinue = () => {
    const val = getValue(currentStep.field) as unknown
    if (Array.isArray(val)) return val.length > 0
    return Boolean(val)
  }

  const handleNext = () => {
    if (step < steps.length - 1) {
      setStep(step + 1)
    } else {
      handleFinish()
    }
  }

  const handleFinish = async () => {
    try {
      const res = await fetch('/api/user/profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          skillLevel,
          interests,
          primaryGoal,
          timeCommitment,
          techPreferences,
          hasTeam,
          preferredComplexity,
          onboardingCompleted: true
        })
      })
      if (!res.ok) {
        console.error('Profile save returned non-OK:', res.status)
        alert('Could not save your onboarding. Please try again while logged in.')
        return
      }
      // Verify write before redirect
      try {
        await fetch('/api/user/profile', { method: 'GET', cache: 'no-store' })
      } catch {}
      router.push('/dashboard')
    } catch (err) {
      console.error('Failed to save profile:', err)
    }
  }

  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-4 py-12">
      <div className="max-w-2xl w-full">
        {/* Progress */}
        <div className="mb-8">
          <div className="flex items-center justify-between text-xs text-gray-400 mb-2">
            <span>Step {step + 1} of {steps.length}</span>
            <span>{Math.round(progress)}%</span>
          </div>
          <Progress value={progress} className="h-1" />
        </div>

        {/* Question */}
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-white mb-2">{currentStep.title}</h1>
          <p className="text-gray-400">{currentStep.subtitle}</p>
        </div>

        {/* Options */}
        <div className="grid gap-3 mb-8">
          {currentStep.options.map(opt => {
            const isSelected = currentStep.multiSelect 
              ? (getValue(currentStep.field) as string[]).includes(opt.id)
              : getValue(currentStep.field) === opt.id
            
            return (
              <button
                key={opt.id}
                onClick={() => handleSelect(opt.id)}
                className={`text-left p-4 rounded-xl border transition-all ${
                  isSelected
                    ? 'border-orange-500 bg-orange-500/10'
                    : 'border-gray-800 bg-gray-900/50 hover:border-gray-700 hover:bg-gray-900'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div>
                    <div className="text-white font-medium mb-1">{opt.label}</div>
                    {opt.desc && <div className="text-sm text-gray-400">{opt.desc}</div>}
                  </div>
                  {isSelected && <CheckIcon className="w-5 h-5 text-orange-500" />}
                </div>
              </button>
            )
          })}
        </div>

        {/* Navigation */}
        <div className="flex gap-3">
          {step > 0 && (
            <Button onClick={() => setStep(step - 1)} variant="outline">
              Back
            </Button>
          )}
          <Button
            onClick={handleNext}
            disabled={!canContinue()}
            className="flex-1 disabled:opacity-50"
          >
            {step === steps.length - 1 ? 'Finish' : 'Continue'}
          </Button>
        </div>
      </div>
    </div>
  )
}

