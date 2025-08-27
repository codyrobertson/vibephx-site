'use client'

import React from 'react'
import { RocketIcon, TargetIcon, MagicWandIcon } from '@radix-ui/react-icons'
import { 
  Card, 
  CardIcon, 
  CardBadge, 
  CardHeader, 
  CardTitle, 
  CardDescription, 
  CardMeta, 
  CardTags 
} from '@/components/ui/Card'

export interface Template {
  id: string
  title: string
  description: string
  icon: React.ComponentType<any>
  persona: string
  difficulty: 'Beginner-friendly' | 'Intermediate' | 'Advanced'
  estimatedTime: string
  features: string[]
}

interface TemplateCardProps {
  template: Template
  selected: boolean
  onSelect: (templateId: string) => void
}

export function TemplateCard({ template, selected, onSelect }: TemplateCardProps) {
  const IconComponent = template.icon
  
  return (
    <Card
      background="code"
      overlay="code"
      state={selected ? 'selected' : 'default'}
      interactive="clickable"
      size="lg"
      onClick={() => onSelect(template.id)}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault()
          onSelect(template.id)
        }
      }}
      role="button"
      tabIndex={0}
      className="group hover:border-orange-500/50 transition-all duration-200"
      aria-label={`Select ${template.title} template`}
      aria-selected={selected}
    >
      <CardHeader>
        <CardIcon color="orange">
          <IconComponent className="w-full h-full" />
        </CardIcon>
        
        <CardBadge 
          variant={template.difficulty === 'Beginner-friendly' ? 'success' : 'warning'}
        >
          {template.difficulty}
        </CardBadge>
      </CardHeader>
      
      <div className="space-y-3">
        <CardTitle size="lg">
          {template.title}
        </CardTitle>
        
        <CardDescription>
          {template.description}
        </CardDescription>
        
        <CardMeta>
          {template.persona}
        </CardMeta>
        
        <div className="flex items-center gap-2 text-xs text-gray-400">
          <span>⏱️ {template.estimatedTime}</span>
        </div>
        
        <CardTags tags={template.features} maxTags={3} />
      </div>
    </Card>
  )
}

// Example usage component to show multiple template cards
export function TemplateGrid({ 
  templates, 
  selectedTemplate, 
  onSelectTemplate 
}: {
  templates: Template[]
  selectedTemplate: string
  onSelectTemplate: (templateId: string) => void
}) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      {templates.map((template) => (
        <TemplateCard
          key={template.id}
          template={template}
          selected={selectedTemplate === template.id}
          onSelect={onSelectTemplate}
        />
      ))}
    </div>
  )
}

// Example templates data for testing
export const EXAMPLE_TEMPLATES: Template[] = [
  {
    id: 'ai-lead-scorer',
    title: 'AI Lead Scorer & Responder',
    description: 'Upload CSV → LLM tags + scores → "Respond" button drafts reply.',
    icon: TargetIcon,
    persona: 'SMBs, freelancers, agencies',
    difficulty: 'Beginner-friendly',
    estimatedTime: '4-6 hours',
    features: ['CSV upload', 'AI scoring', 'Auto-reply drafts', 'Priority routing']
  },
  {
    id: 'booking-system',
    title: 'CRM-Connected Booking System',
    description: 'Public booking page → confirm email → write contact + meeting to CRM.',
    icon: RocketIcon,
    persona: 'Consultants, local services, solo agencies',
    difficulty: 'Intermediate',
    estimatedTime: '6-8 hours',
    features: ['Booking calendar', 'CRM integration', 'Email confirmations', 'Calendar sync']
  },
  {
    id: 'viral-waitlist',
    title: 'Viral Waitlist Builder',
    description: 'Email capture → unique referral link → counter + leaderboard.',
    icon: MagicWandIcon,
    persona: 'App launches, restaurants, events',
    difficulty: 'Beginner-friendly',
    estimatedTime: '3-4 hours',
    features: ['Referral system', 'Leaderboard', 'Email capture', 'Real-time counters']
  },
  {
    id: 'quote-generator',
    title: 'Smart Quote Generator',
    description: 'Choose services → auto price calc → generate PDF → email/send link.',
    icon: RocketIcon,
    persona: 'Contractors, freelancers, service providers',
    difficulty: 'Beginner-friendly',
    estimatedTime: '4-5 hours',
    features: ['Quote generator', 'PDF generation', 'Email delivery', 'Pricing calculator']
  }
]