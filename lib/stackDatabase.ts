// Comprehensive tech stack database with intelligent template mappings
export interface StackItem {
  id: string
  name: string
  description: string
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced'
  popular: boolean
  logo: string
  fallbackIcon?: any
  // New fields for intelligent recommendations
  templateRelevance: Record<string, number> // template_id -> relevance score (0-1)
  requires?: string[] // Required dependencies
  conflicts?: string[] // Incompatible with these stacks
  tags: string[] // Feature tags for matching
  timeComplexity: number // Additional time in hours if selected
  learnCurve: number // Learning difficulty multiplier (1-3)
}

export interface TemplateStackMapping {
  id: string
  title: string
  optimalStacks: {
    frontend: string[]
    backend: string[]
    database: string[]
    aiService: string[]
  }
  requiredFeatures: string[]
  avoidFeatures: string[]
  complexityBudget: number // Max total complexity points
}

// Comprehensive stack database
export const STACK_DATABASE: Record<string, StackItem[]> = {
  frontend: [
    {
      id: 'nextjs',
      name: 'Next.js',
      description: 'React framework with SSR',
      difficulty: 'Intermediate',
      popular: true,
      logo: 'https://img.logo.dev/nextjs.org?token=pk_cJ_vQ1nNRM6nbN75WsWP3Q&size=32&format=png',
      templateRelevance: {
        'ai-lead-scorer': 0.9,
        'booking-system': 0.8,
        'viral-waitlist': 0.7,
        'quote-generator': 0.9
      },
      tags: ['fullstack', 'ssr', 'react', 'modern', 'seo'],
      timeComplexity: 0.5,
      learnCurve: 1.5
    },
    {
      id: 'react',
      name: 'React + Vite',
      description: 'Modern React with fast bundling',
      difficulty: 'Beginner',
      popular: true,
      logo: 'https://img.logo.dev/react.dev?token=pk_cJ_vQ1nNRM6nbN75WsWP3Q&size=32&format=png',
      templateRelevance: {
        'ai-lead-scorer': 0.7,
        'booking-system': 0.6,
        'viral-waitlist': 0.9,
        'quote-generator': 0.7
      },
      tags: ['spa', 'react', 'fast', 'simple'],
      timeComplexity: 0,
      learnCurve: 1
    },
    {
      id: 'vue',
      name: 'Vue.js',
      description: 'Progressive JavaScript framework',
      difficulty: 'Beginner',
      popular: false,
      logo: 'https://img.logo.dev/vuejs.org?token=pk_cJ_vQ1nNRM6nbN75WsWP3Q&size=32&format=png',
      templateRelevance: {
        'ai-lead-scorer': 0.5,
        'booking-system': 0.6,
        'viral-waitlist': 0.8,
        'quote-generator': 0.6
      },
      tags: ['spa', 'progressive', 'beginner-friendly'],
      timeComplexity: 0.2,
      learnCurve: 1
    },
    {
      id: 'vanilla',
      name: 'Vanilla JS',
      description: 'Pure JavaScript, no frameworks',
      difficulty: 'Beginner',
      popular: false,
      logo: 'https://img.logo.dev/javascript.com?token=pk_cJ_vQ1nNRM6nbN75WsWP3Q&size=32&format=png',
      templateRelevance: {
        'ai-lead-scorer': 0.2,
        'booking-system': 0.1,
        'viral-waitlist': 0.6,
        'quote-generator': 0.3
      },
      tags: ['minimal', 'no-framework', 'lightweight'],
      timeComplexity: -0.5,
      learnCurve: 0.8,
      conflicts: ['complex-ui', 'state-management']
    }
  ],
  
  backend: [
    {
      id: 'nextjs-api',
      name: 'Next.js API Routes',
      description: 'Built-in API with Next.js',
      difficulty: 'Beginner',
      popular: true,
      logo: 'https://img.logo.dev/nextjs.org?token=pk_cJ_vQ1nNRM6nbN75WsWP3Q&size=32&format=png',
      requires: ['nextjs'],
      templateRelevance: {
        'ai-lead-scorer': 0.9,
        'booking-system': 0.8,
        'viral-waitlist': 0.6,
        'quote-generator': 0.9
      },
      tags: ['fullstack', 'integrated', 'serverless'],
      timeComplexity: 0,
      learnCurve: 1
    },
    {
      id: 'serverless',
      name: 'Serverless Functions',
      description: 'Simple cloud functions (Vercel/Netlify)',
      difficulty: 'Beginner',
      popular: true,
      logo: 'https://img.logo.dev/vercel.com?token=pk_cJ_vQ1nNRM6nbN75WsWP3Q&size=32&format=png',
      templateRelevance: {
        'ai-lead-scorer': 0.8,
        'booking-system': 0.7,
        'viral-waitlist': 0.9,
        'quote-generator': 0.8
      },
      tags: ['serverless', 'scalable', 'simple'],
      timeComplexity: 0.2,
      learnCurve: 1
    },
    {
      id: 'nodejs',
      name: 'Node.js Express',
      description: 'Traditional Node.js server',
      difficulty: 'Intermediate',
      popular: false,
      logo: 'https://img.logo.dev/nodejs.org?token=pk_cJ_vQ1nNRM6nbN75WsWP3Q&size=32&format=png',
      templateRelevance: {
        'ai-lead-scorer': 0.6,
        'booking-system': 0.7,
        'viral-waitlist': 0.4,
        'quote-generator': 0.5
      },
      tags: ['traditional', 'flexible', 'backend'],
      timeComplexity: 0.8,
      learnCurve: 1.8
    },
    {
      id: 'python',
      name: 'Python (FastAPI)',
      description: 'Modern Python web framework',
      difficulty: 'Intermediate',
      popular: false,
      logo: 'https://img.logo.dev/python.org?token=pk_cJ_vQ1nNRM6nbN75WsWP3Q&size=32&format=png',
      templateRelevance: {
        'ai-lead-scorer': 0.8,
        'booking-system': 0.4,
        'viral-waitlist': 0.2,
        'quote-generator': 0.4
      },
      tags: ['ai-friendly', 'data-processing', 'ml'],
      timeComplexity: 1.2,
      learnCurve: 2
    }
  ],

  database: [
    {
      id: 'supabase',
      name: 'Supabase',
      description: 'PostgreSQL with instant APIs',
      difficulty: 'Beginner',
      popular: true,
      logo: 'https://img.logo.dev/supabase.com?token=pk_cJ_vQ1nNRM6nbN75WsWP3Q&size=32&format=png',
      templateRelevance: {
        'ai-lead-scorer': 0.9,
        'booking-system': 0.9,
        'viral-waitlist': 0.8,
        'quote-generator': 0.7
      },
      tags: ['relational', 'auth', 'realtime', 'instant-api'],
      timeComplexity: 0.3,
      learnCurve: 1.2
    },
    {
      id: 'firebase',
      name: 'Firebase',
      description: 'NoSQL with real-time sync',
      difficulty: 'Beginner',
      popular: true,
      logo: 'https://img.logo.dev/firebase.google.com?token=pk_cJ_vQ1nNRM6nbN75WsWP3Q&size=32&format=png',
      templateRelevance: {
        'ai-lead-scorer': 0.6,
        'booking-system': 0.7,
        'viral-waitlist': 0.9,
        'quote-generator': 0.6
      },
      tags: ['nosql', 'realtime', 'google', 'auth'],
      timeComplexity: 0.2,
      learnCurve: 1.1
    },
    {
      id: 'local',
      name: 'LocalStorage',
      description: 'Browser-based storage (no backend needed)',
      difficulty: 'Beginner',
      popular: false,
      logo: 'https://img.logo.dev/javascript.com?token=pk_cJ_vQ1nNRM6nbN75WsWP3Q&size=32&format=png',
      templateRelevance: {
        'ai-lead-scorer': 0.2,
        'booking-system': 0.1,
        'viral-waitlist': 0.4,
        'quote-generator': 0.5
      },
      tags: ['local', 'prototype', 'simple', 'no-backend'],
      timeComplexity: -0.5,
      learnCurve: 0.5,
      conflicts: ['multi-user', 'collaboration']
    },
    {
      id: 'planetscale',
      name: 'PlanetScale',
      description: 'Serverless MySQL platform',
      difficulty: 'Intermediate',
      popular: false,
      logo: 'https://img.logo.dev/planetscale.com?token=pk_cJ_vQ1nNRM6nbN75WsWP3Q&size=32&format=png',
      templateRelevance: {
        'ai-lead-scorer': 0.7,
        'booking-system': 0.8,
        'viral-waitlist': 0.5,
        'quote-generator': 0.6
      },
      tags: ['mysql', 'serverless', 'scalable'],
      timeComplexity: 0.5,
      learnCurve: 1.5
    }
  ],

  aiService: [
    {
      id: 'openai',
      name: 'OpenAI GPT',
      description: 'Most capable AI models',
      difficulty: 'Beginner',
      popular: true,
      logo: 'https://img.logo.dev/openai.com?token=pk_cJ_vQ1nNRM6nbN75WsWP3Q&size=32&format=png',
      templateRelevance: {
        'ai-lead-scorer': 0.9,
        'booking-system': 0.3,
        'viral-waitlist': 0.1,
        'quote-generator': 0.5
      },
      tags: ['text-generation', 'analysis', 'chat'],
      timeComplexity: 0.5,
      learnCurve: 1.2
    },
    {
      id: 'anthropic',
      name: 'Anthropic Claude',
      description: 'Excellent for analysis & reasoning',
      difficulty: 'Beginner',
      popular: true,
      logo: 'https://img.logo.dev/anthropic.com?token=pk_cJ_vQ1nNRM6nbN75WsWP3Q&size=32&format=png',
      templateRelevance: {
        'ai-lead-scorer': 0.9,
        'booking-system': 0.2,
        'viral-waitlist': 0.1,
        'quote-generator': 0.4
      },
      tags: ['analysis', 'reasoning', 'structured-output'],
      timeComplexity: 0.5,
      learnCurve: 1.2
    },
    {
      id: 'openrouter',
      name: 'OpenRouter',
      description: 'Access to multiple AI models',
      difficulty: 'Intermediate',
      popular: false,
      logo: 'https://img.logo.dev/openrouter.ai?token=pk_cJ_vQ1nNRM6nbN75WsWP3Q&size=32&format=png',
      templateRelevance: {
        'ai-lead-scorer': 0.8,
        'booking-system': 0.2,
        'viral-waitlist': 0.1,
        'quote-generator': 0.3
      },
      tags: ['multi-model', 'cost-effective', 'flexible'],
      timeComplexity: 0.7,
      learnCurve: 1.5
    },
    {
      id: 'none',
      name: 'No AI Features',
      description: 'Traditional app without AI',
      difficulty: 'Beginner',
      popular: false,
      logo: '',
      templateRelevance: {
        'ai-lead-scorer': 0.1,
        'booking-system': 0.8,
        'viral-waitlist': 0.9,
        'quote-generator': 0.7
      },
      tags: ['traditional', 'simple', 'no-ai'],
      timeComplexity: -0.3,
      learnCurve: 0.8
    }
  ]
}

// Template to optimal stack mappings
export const TEMPLATE_STACK_MAPPINGS: Record<string, TemplateStackMapping> = {
  'ai-lead-scorer': {
    id: 'ai-lead-scorer',
    title: 'AI Lead Scorer & Responder',
    optimalStacks: {
      frontend: ['nextjs', 'react'],
      backend: ['nextjs-api', 'serverless'],
      database: ['supabase', 'planetscale'],
      aiService: ['openai', 'anthropic', 'openrouter']
    },
    requiredFeatures: ['ai-processing', 'csv-upload', 'data-analysis'],
    avoidFeatures: ['no-ai', 'local-only'],
    complexityBudget: 4
  },
  
  'booking-system': {
    id: 'booking-system',
    title: 'CRM-Connected Booking System',
    optimalStacks: {
      frontend: ['nextjs', 'react'],
      backend: ['nextjs-api', 'serverless'],
      database: ['supabase', 'firebase'],
      aiService: ['none', 'openai']
    },
    requiredFeatures: ['calendar', 'email', 'crm-integration'],
    avoidFeatures: ['local-only', 'no-backend'],
    complexityBudget: 5
  },

  'viral-waitlist': {
    id: 'viral-waitlist',
    title: 'Viral Waitlist Builder',
    optimalStacks: {
      frontend: ['react', 'nextjs', 'vue'],
      backend: ['serverless', 'nextjs-api'],
      database: ['firebase', 'supabase'],
      aiService: ['none']
    },
    requiredFeatures: ['realtime', 'referral-system', 'simple-ui'],
    avoidFeatures: ['complex-ai', 'heavy-backend'],
    complexityBudget: 3
  },

  'quote-generator': {
    id: 'quote-generator',
    title: 'Smart Quote Generator',
    optimalStacks: {
      frontend: ['nextjs', 'react'],
      backend: ['nextjs-api', 'serverless'],
      database: ['supabase', 'local'],
      aiService: ['none', 'openai']
    },
    requiredFeatures: ['pdf-generation', 'email', 'calculations'],
    avoidFeatures: ['realtime', 'complex-auth'],
    complexityBudget: 4
  }
}

// Intelligent filtering function
export function getRelevantStackOptions(
  templateId: string | undefined,
  customIdea: string | undefined,
  stackType: keyof typeof STACK_DATABASE,
  currentSelections: Record<string, string> = {}
): StackItem[] {
  const allOptions = STACK_DATABASE[stackType]
  
  if (!templateId && !customIdea) {
    // No context - show popular options first
    return allOptions.sort((a, b) => {
      if (a.popular && !b.popular) return -1
      if (!a.popular && b.popular) return 1
      return 0
    })
  }

  let scoredOptions = allOptions.map(option => {
    let score = 0
    
    // Template relevance scoring
    if (templateId && option.templateRelevance[templateId]) {
      score += option.templateRelevance[templateId] * 0.8
    }
    
    // Custom idea keyword matching (simplified)
    if (customIdea && !templateId) {
      const keywords = customIdea.toLowerCase().split(' ')
      const matchingTags = option.tags.filter(tag => 
        keywords.some(keyword => keyword.includes(tag) || tag.includes(keyword))
      ).length
      score += (matchingTags / option.tags.length) * 0.6
    }
    
    // Dependency compatibility
    if (option.requires) {
      const hasRequiredDeps = option.requires.every(req => 
        Object.values(currentSelections).includes(req)
      )
      if (!hasRequiredDeps) score *= 0.3
    }
    
    // Conflict checking
    if (option.conflicts) {
      const hasConflicts = option.conflicts.some(conflict => 
        Object.values(currentSelections).includes(conflict)
      )
      if (hasConflicts) score *= 0.1
    }
    
    // Popularity bonus for beginners
    if (option.popular) score += 0.2
    
    return { ...option, relevanceScore: score }
  })

  // Filter out very low relevance options (< 0.3) unless it's a popular option
  scoredOptions = scoredOptions.filter(option => 
    option.relevanceScore >= 0.3 || option.popular
  )

  // Sort by relevance score
  return scoredOptions
    .sort((a, b) => b.relevanceScore - a.relevanceScore)
    .slice(0, 6) // Limit to top 6 options
}

// AI recommendation system
export function getAIRecommendation(
  templateId: string | undefined,
  customIdea: string | undefined,
  currentSelections: Record<string, string> = {}
): Record<string, string> {
  if (!templateId && !customIdea) return {}
  
  const recommendations: Record<string, string> = {}
  
  if (templateId && TEMPLATE_STACK_MAPPINGS[templateId]) {
    const mapping = TEMPLATE_STACK_MAPPINGS[templateId]
    
    // Get the highest scoring option for each stack type
    Object.keys(mapping.optimalStacks).forEach(stackType => {
      const relevantOptions = getRelevantStackOptions(
        templateId, 
        customIdea, 
        stackType as keyof typeof STACK_DATABASE,
        currentSelections
      )
      
      if (relevantOptions.length > 0) {
        recommendations[stackType] = relevantOptions[0].id
      }
    })
  }
  
  return recommendations
}