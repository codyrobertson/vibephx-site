export interface PRDFormData {
  // Step 1: Project Basics
  projectName: string
  projectType: string
  targetUsers: string

  // Step 2: Purpose & Goals
  problemStatement: string
  whyBuild: string
  successMetric: string
  goals: string[]

  // Step 3: Data Architecture
  dataSources: string[]
  dataDetails: Record<string, { description: string; storage: string }>

  // Step 4: Features & Actions
  coreFeatures: Array<{ name: string; action: string; priority: number }>
  niceToHaveFeatures: Array<{ name: string; action: string }>

  // Step 5: Technical Stack
  frontend: string
  backend: string
  database: string
  deployment: string
}

export const PROJECT_TYPES = [
  'Landing Page',
  'Dashboard',
  'Form/Survey',
  'Data Tool',
  'E-commerce',
  'CRM',
  'Booking System',
  'Content Platform',
  'Other'
]

export const DATA_SOURCES = [
  'User input forms',
  'External API',
  'Database',
  'Static content',
  'File uploads',
  'Web scraping',
  'Real-time feeds',
  'Third-party integrations'
]

export const STORAGE_OPTIONS = [
  'Frontend (Local Storage)',
  'Database (PostgreSQL/MySQL)',
  'API (External Service)',
  'File System',
  'Cloud Storage (S3)',
  'In-Memory Cache'
]

export const TECH_STACKS = {
  frontend: [
    'React + Next.js',
    'React + Vite',
    'Vue.js',
    'Svelte',
    'HTML/CSS/JavaScript',
    'React Native (Mobile)'
  ],
  backend: [
    'Next.js API Routes',
    'Node.js + Express',
    'Python + FastAPI',
    'Python + Django',
    'Ruby on Rails',
    'Go',
    'Serverless Functions'
  ],
  database: [
    'PostgreSQL',
    'MySQL',
    'MongoDB',
    'SQLite',
    'Supabase',
    'Firebase',
    'Redis',
    'None (Static)'
  ],
  deployment: [
    'Vercel',
    'Netlify',
    'AWS',
    'Digital Ocean',
    'Heroku',
    'Railway',
    'Fly.io',
    'Docker + VPS'
  ]
}

export function calculateComplexity(formData: Partial<PRDFormData>): {
  score: number
  level: 'Simple' | 'Moderate' | 'Complex' | 'Very Complex'
  warnings: string[]
} {
  let score = 0
  const warnings: string[] = []

  // Data sources complexity
  const dataSourceCount = formData.dataSources?.length || 0
  score += dataSourceCount * 10
  if (dataSourceCount > 3) {
    warnings.push('Multiple data sources increase complexity')
  }

  // Features complexity
  const featureCount = (formData.coreFeatures?.length || 0) + (formData.niceToHaveFeatures?.length || 0)
  score += featureCount * 5
  if (featureCount > 8) {
    warnings.push('Consider reducing features for v1')
  }

  // Tech stack complexity
  if (formData.backend && formData.backend !== 'Next.js API Routes' && formData.backend !== 'Serverless Functions') {
    score += 15
    warnings.push('Separate backend increases development time')
  }

  if (formData.database && formData.database !== 'None (Static)') {
    score += 10
  }

  // Determine level
  let level: 'Simple' | 'Moderate' | 'Complex' | 'Very Complex'
  if (score < 30) level = 'Simple'
  else if (score < 60) level = 'Moderate'
  else if (score < 90) level = 'Complex'
  else level = 'Very Complex'

  if (score > 80) {
    warnings.push('⚠️ This project may be too complex for a 6-8 hour build')
  }

  return { score, level, warnings }
}

export function generateSmartDefaults(projectType: string): Partial<PRDFormData> {
  const defaults: Record<string, Partial<PRDFormData>> = {
    'Landing Page': {
      frontend: 'React + Next.js',
      backend: 'Next.js API Routes',
      database: 'None (Static)',
      deployment: 'Vercel',
      dataSources: ['Static content', 'User input forms']
    },
    'Dashboard': {
      frontend: 'React + Next.js',
      backend: 'Next.js API Routes',
      database: 'PostgreSQL',
      deployment: 'Vercel',
      dataSources: ['Database', 'External API']
    },
    'Form/Survey': {
      frontend: 'React + Next.js',
      backend: 'Next.js API Routes',
      database: 'PostgreSQL',
      deployment: 'Vercel',
      dataSources: ['User input forms', 'Database']
    },
    'Data Tool': {
      frontend: 'React + Next.js',
      backend: 'Next.js API Routes',
      database: 'PostgreSQL',
      deployment: 'Vercel',
      dataSources: ['External API', 'Database', 'File uploads']
    },
    'E-commerce': {
      frontend: 'React + Next.js',
      backend: 'Next.js API Routes',
      database: 'PostgreSQL',
      deployment: 'Vercel',
      dataSources: ['Database', 'External API', 'User input forms']
    },
    'CRM': {
      frontend: 'React + Next.js',
      backend: 'Next.js API Routes',
      database: 'PostgreSQL',
      deployment: 'Vercel',
      dataSources: ['Database', 'User input forms', 'External API']
    },
    'Booking System': {
      frontend: 'React + Next.js',
      backend: 'Next.js API Routes',
      database: 'PostgreSQL',
      deployment: 'Vercel',
      dataSources: ['Database', 'User input forms', 'Third-party integrations']
    },
    'Content Platform': {
      frontend: 'React + Next.js',
      backend: 'Next.js API Routes',
      database: 'PostgreSQL',
      deployment: 'Vercel',
      dataSources: ['Database', 'File uploads', 'User input forms']
    }
  }

  return defaults[projectType] || {
    frontend: 'React + Next.js',
    backend: 'Next.js API Routes',
    database: 'PostgreSQL',
    deployment: 'Vercel'
  }
}

export function generatePRDMarkdown(formData: PRDFormData): string {
  const complexity = calculateComplexity(formData)
  const timestamp = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })

  return `# PRD: ${formData.projectName}

**Generated:** ${timestamp}
**Project Type:** ${formData.projectType}
**Complexity:** ${complexity.level} (Score: ${complexity.score})
**Target Users:** ${formData.targetUsers}

${complexity.warnings.length > 0 ? `\n## ⚠️ Scope Warnings\n${complexity.warnings.map(w => `- ${w}`).join('\n')}\n` : ''}

---

## 1. Purpose & Problem Statement

### What Problem Does This Solve?
${formData.problemStatement}

### Why Build This Instead of Using Existing Tools?
${formData.whyBuild}

### Primary Success Metric
${formData.successMetric}

---

## 2. Goals

${formData.goals.map((goal, i) => `${i + 1}. ${goal}`).join('\n')}

---

## 3. Data Architecture

### Data Sources
${formData.dataSources.map(source => `- ${source}`).join('\n')}

### Data Flow Details
${Object.entries(formData.dataDetails).map(([source, details]) => `
**${source}:**
- Description: ${details.description}
- Storage: ${details.storage}
`).join('\n')}

---

## 4. Features & Functionality

### Core Features (Must Have)
${formData.coreFeatures.map((feature, i) => `
${i + 1}. **${feature.name}** (Priority: ${feature.priority}/3)
   - User Action: ${feature.action}
`).join('\n')}

### Nice-to-Have Features
${formData.niceToHaveFeatures.length > 0
  ? formData.niceToHaveFeatures.map((feature, i) => `${i + 1}. **${feature.name}** - ${feature.action}`).join('\n')
  : 'None specified'}

---

## 5. Technical Architecture

### Technology Stack
- **Frontend:** ${formData.frontend}
- **Backend:** ${formData.backend}
- **Database:** ${formData.database}
- **Deployment:** ${formData.deployment}

### System Architecture
\`\`\`
User Input → ${formData.frontend} → ${formData.backend} → ${formData.database} → Response
\`\`\`

---

## 6. User Stories

${formData.coreFeatures.slice(0, 3).map(feature =>
  `- As a ${formData.targetUsers.toLowerCase()}, I want to ${feature.action.toLowerCase()} so that I can ${feature.name.toLowerCase()}`
).join('\n')}

---

## 7. Success Criteria

- Primary metric: ${formData.successMetric}
- All core features functional and tested
- Deployed to ${formData.deployment}
- Mobile-responsive design
- Basic error handling implemented
- User can complete primary workflow

---

## 8. Out of Scope (V1)

${formData.niceToHaveFeatures.length > 0
  ? formData.niceToHaveFeatures.map(f => `- ${f.name}`).join('\n')
  : '- Advanced analytics\n- Complex user permissions\n- Multi-language support\n- Advanced integrations'}

---

## 9. Implementation Notes

**Estimated Timeline:** ${complexity.level === 'Simple' ? '3-4 hours' : complexity.level === 'Moderate' ? '4-6 hours' : complexity.level === 'Complex' ? '6-8 hours' : '8+ hours'}

**Development Approach:**
1. Set up project with ${formData.frontend}
2. Implement database schema (${formData.database})
3. Build API endpoints (${formData.backend})
4. Create UI components for core features
5. Integrate data sources: ${formData.dataSources.slice(0, 2).join(', ')}
6. Test and deploy to ${formData.deployment}

**Key Risks:**
${complexity.warnings.map(w => `- ${w}`).join('\n') || '- Scope creep\n- External API reliability\n- Time constraints'}

---

*Generated with VibePHX PRD Builder*
`
}
