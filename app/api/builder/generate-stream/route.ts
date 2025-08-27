import { NextRequest } from 'next/server'
import { cookies } from 'next/headers'

const DOCUMENT_TEMPLATES = {
  prd: `You are an expert product manager specializing in rapid prototyping. Create a comprehensive Product Requirements Document (PRD) for this VibePHX workshop project:

**PROJECT CONTEXT:**
- Project: {projectName}
- Tech Stack: {techStack}  
- Core Features: {features}
- Deployment Platform: {deployment}
- Build Constraint: 6-8 hours with AI-assisted development tools

**DOCUMENT STRUCTURE:**

## 1. Executive Summary
- Problem statement and opportunity size
- Solution overview in 2-3 sentences  
- Key success criteria for launch day
- Unique value proposition

## 2. User Stories & Personas
- Primary user persona (demographics, pain points, goals)
- 3-5 core user stories in "As a [user], I want [goal] so that [benefit]" format
- User journey from discovery to core value realization

## 3. Feature Requirements (MoSCoW Prioritization)
**Must Have (Launch Day):**
- Core features that define the product
- Specific acceptance criteria for each

**Should Have (If Time Permits):**
- Enhancement features that improve UX

**Won't Have (V1 Scope):**
- Features explicitly excluded from initial build

## 4. Technical Constraints & Considerations
- Performance requirements (load time, response time)
- Browser compatibility and device support
- Data privacy and basic security requirements

## 5. Success Metrics & Definition of Done
- Primary KPI for launch day success
- User engagement metrics to track
- Technical performance benchmarks

## 6. Implementation Timeline (6-8 Hour Sprint)
- Hour-by-hour breakdown with milestones
- Dependency mapping between features
- Risk mitigation for common blockers

Generate a comprehensive, well-structured document in Markdown format.`,

  buildDoc: `You are a senior full-stack engineer specializing in rapid prototyping. Create a comprehensive Technical Build Guide for this VibePHX workshop project:

**PROJECT CONTEXT:**
- Project: {projectName}
- Tech Stack: {techStack}
- Core Features: {features}
- Deployment Platform: {deployment}
- Time Constraint: 6-8 hours with AI assistance

**BUILD GUIDE STRUCTURE:**

## 1. Environment Setup & Prerequisites
- System requirements and version checks
- Development tool installation (Node.js, Git, IDE setup)
- Account creation for services
- Environment variable template

## 2. Project Initialization
- Step-by-step project creation commands
- Initial folder structure with explanations
- Core configuration files setup
- Git repository initialization

## 3. Database Setup & Schema
- Database service setup (migrations, seeds)
- Schema implementation with actual code
- Connection configuration
- Test data population

## 4. Backend Implementation Order
- API route structure and organization
- Authentication setup (if required)
- Core business logic implementation
- Error handling patterns

## 5. Frontend Development Path
- Component architecture decisions
- State management setup
- UI framework configuration
- Integration with backend APIs

## 6. Feature Implementation Roadmap
- Feature-by-feature build order with dependencies
- Code snippets for critical functionality
- Integration points and testing

## 7. Testing & Quality Assurance
- Testing framework setup
- Unit test examples for core functions
- Manual testing checklist

## 8. Deployment Process
- Build optimization steps
- Environment-specific configurations
- Deployment platform setup
- Post-deployment verification

## 9. Troubleshooting Guide
- Common error patterns and solutions
- Debug techniques and tools
- Resource links for deeper issues

Generate detailed implementation instructions with actual code examples.`,

  uiSpecs: `You are a senior UX/UI designer specializing in rapid prototyping. Create comprehensive UI/UX specifications for this VibePHX workshop project:

**PROJECT CONTEXT:**
- Project: {projectName}
- Core Features: {features}
- Development Time: 6-8 hours
- User Experience Goals: Intuitive, professional, conversion-focused

**UI/UX SPECIFICATION DOCUMENT:**

## 1. Design Philosophy & Principles
- Core design values (simplicity, functionality, accessibility)
- Visual personality and brand direction
- Mobile-first vs desktop-first approach

## 2. User Journey & Flow Architecture
- Primary user personas and their goals
- Complete user flow from entry to conversion/completion
- Decision trees for different user paths

## 3. Visual Design System
**Color Palette:**
- Primary, secondary, and accent colors with hex codes
- Semantic colors for success, warning, error states
- Color accessibility compliance (WCAG AA)

**Typography Scale:**
- Font family selections with fallbacks
- Heading hierarchy (H1-H6) with sizes and weights
- Body text, captions, and UI text specifications

**Spacing System:**
- Consistent spacing scale (4px, 8px, 16px, etc.)
- Component padding and margin standards
- Grid system and layout principles

## 4. Component Library
**Core UI Components:**
- Buttons (primary, secondary, tertiary states)
- Form inputs, labels, and validation patterns
- Cards, modals, and content containers

**Layout Components:**
- Header/navbar with responsive behavior
- Footer structure and content
- Page templates and content areas

## 5. Responsive Design Strategy
- Mobile (320px-768px) design patterns
- Tablet (768px-1024px) adaptations
- Desktop (1024px+) layout optimizations

## 6. Accessibility & Usability
- WCAG 2.1 AA compliance checklist
- Keyboard navigation patterns
- Screen reader optimization

Create a system that balances aesthetic appeal with development speed.`,

  dataModels: `You are a senior database architect specializing in scalable data design. Create a comprehensive data architecture specification for this VibePHX workshop project:

**PROJECT CONTEXT:**
- Project: {projectName}
- Database Technology: {database}
- Core Features: {features}
- Development Timeline: 6-8 hours

**DATA ARCHITECTURE SPECIFICATION:**

## 1. Data Analysis & Requirements
- Core business entities and their attributes
- Data relationships and cardinality analysis
- Read vs. write patterns and frequency

## 2. Database Technology Justification
- Why the selected database fits this project
- Specific features leveraged
- Scaling characteristics and limitations

## 3. Entity Relationship Design
**Core Entities:**
- Entity definitions with business context
- Attribute specifications (required, optional, computed)
- Primary key strategies (UUIDs vs. auto-increment)
- Foreign key relationships and cascading rules

## 4. Table Schema Specifications
For each table, provide:
- Complete column definitions with data types
- Null constraints and default values
- Check constraints for data validation
- Unique constraints and composite keys

## 5. Indexing Strategy
**Performance Indexes:**
- Primary indexes for unique identification
- Foreign key indexes for join performance
- Composite indexes for multi-column queries

## 6. Data Migration & Seeding
**Schema Migration Plan:**
- Initial schema creation scripts
- Migration versioning strategy
- Rollback procedures for schema changes

**Seed Data Strategy:**
- Test data requirements and generation
- Reference data and lookup tables

## 7. Query Patterns & Optimization
- Expected query patterns with example SQL
- N+1 query prevention strategies
- Pagination and sorting implementations

## 8. Data Security & Privacy
- Sensitive data identification and encryption
- Access control and row-level security
- Backup and recovery procedures

Provide complete SQL DDL scripts ready for execution.`,

  taskList: `You are an experienced project manager specializing in rapid development cycles. Create a comprehensive, time-boxed development task list for this VibePHX workshop project:

**PROJECT CONTEXT:**
- Project: {projectName}
- Tech Stack: {techStack}
- Core Features: {features}
- Total Time Budget: 6-8 hours
- Success Definition: Working MVP deployed to production

**DEVELOPMENT TASK BREAKDOWN:**

## Phase 1: Foundation Setup (60-90 minutes)
### Environment & Infrastructure Tasks
**Priority: Critical** | **Time: 15-30 min each**

**Task: Development Environment Setup**
- Description: Install dependencies, configure development tools, set up database  
- Acceptance Criteria: Can run \`npm run dev\` successfully, database connected
- Success Metric: Local server running without errors

**Task: Project Structure Creation**
- Description: Set up folder structure, routing, and basic configuration
- Acceptance Criteria: All routes defined, folder structure matches architecture
- Time Buffer: +15 min for unexpected configuration issues

## Phase 2: Core Backend (90-120 minutes)
### API & Data Layer Implementation

**Task: Database Schema Implementation**
- Description: Create tables, relationships, and initial migrations
- Acceptance Criteria: All entities created, relationships working, seed data loaded
- Validation: Can query all tables successfully

**Task: Core API Endpoints**
- Description: Build CRUD operations for primary business entities
- Acceptance Criteria: All endpoints return expected JSON, error handling implemented
- Testing: Each endpoint tested with sample data

## Phase 3: Frontend Foundation (90-120 minutes)
### UI Components & State Management

**Task: Component Library Setup**
- Description: Create reusable UI components (buttons, forms, layouts)
- Acceptance Criteria: Consistent styling, responsive behavior, accessibility basics
- Quality Gate: Components work across different screen sizes

**Task: State Management Implementation**
- Description: Set up global state, API integration, data fetching patterns
- Acceptance Criteria: Data flows correctly between components and backend
- Performance Check: No unnecessary re-renders or API calls

## Phase 4: Feature Implementation (120-180 minutes)
### Business Logic & User Features

**Task: [Primary Feature Implementation]**
- Description: Build the core value proposition of the application
- Acceptance Criteria: Feature works end-to-end, handles edge cases
- Success Metric: User can complete primary workflow successfully

**Task: Error Handling & Validation**
- Description: Add form validation, error messages, and graceful failure modes
- Acceptance Criteria: Users receive clear feedback, application doesn't crash
- Quality Focus: User experience during error conditions

## Phase 5: Polish & Deployment (60-90 minutes)
### Quality Assurance & Production Readiness

**Task: UI Polish & Responsive Design**
- Description: Refine styling, improve mobile experience, add loading states
- Acceptance Criteria: Professional appearance, works on mobile and desktop
- Quality Metric: Passes basic usability test

**Task: Production Deployment**
- Description: Configure production environment, deploy application, verify functionality
- Acceptance Criteria: Application accessible via public URL, all features working
- Success Metric: Zero critical errors in production

## Risk Mitigation & Time Management

**Progress Checkpoints:**
- Hour 2: Backend foundation complete
- Hour 4: Frontend displaying data from backend
- Hour 6: Core features functional
- Hour 7: Deployed and accessible
- Hour 8: Polish and documentation complete

Create specific, actionable tasks with realistic time estimates.`,

  marketingGuide: `You are a seasoned growth marketing strategist specializing in bootstrapped startups. Create a comprehensive, budget-conscious marketing and launch strategy for this VibePHX workshop project:

**PROJECT CONTEXT:**
- Project: {projectName}
- Core Features: {features}
- Budget Constraints: Minimal to zero paid marketing budget
- Timeline: Launch within days to weeks of completion

**MARKETING & LAUNCH STRATEGY:**

## 1. Value Proposition & Positioning
**Core Value Proposition:**
- Primary benefit and pain point solved
- Unique differentiator from existing solutions
- Target outcome and transformation for users
- Compelling one-liner for social media and pitches

**Positioning Strategy:**
- Market category and competitive landscape
- Target user personas and their specific needs
- Key messaging pillars for different audiences
- Brand personality and communication tone

## 2. Target Audience Deep Dive
**Primary User Persona:**
- Demographics, psychographics, and behavioral patterns
- Current tools and workflows they use
- Biggest frustrations and unmet needs
- Where they spend time online (platforms, communities)
- Decision-making process and buying triggers

## 3. Pre-Launch Foundation Building
**Content Creation Strategy:**
- Build-in-public documentation and progress updates
- Educational content addressing target audience pain points
- Behind-the-scenes content showing development process
- User research and validation case studies

**Audience Building:**
- Social media presence establishment and content calendar
- Email list building with lead magnets and valuable content
- Community participation in relevant forums and groups
- SEO foundation with keyword research and content optimization

## 4. Launch Strategy & Tactics
**Soft Launch Phase (Week 1):**
- Limited beta release to close network and early supporters
- Gather initial user feedback and testimonials
- Refine onboarding flow and fix critical bugs
- Build momentum and social proof for broader launch

**Public Launch Phase (Week 2-3):**
- Product Hunt launch with strategic timing and community mobilization
- Hacker News submission with compelling story and technical depth
- Social media campaign with consistent messaging across platforms
- Email announcement to built audience with clear call-to-action

## 5. Content Marketing & Distribution
**Content Pillars:**
- Educational: How-to guides, tutorials, best practices
- Inspirational: Success stories, case studies, user transformations
- Behind-the-scenes: Development process, lessons learned, transparency
- Industry insights: Trends, predictions, expert analysis

**Distribution Channels:**
- Blog with SEO optimization and social sharing
- Social media for real-time updates and community engagement
- Newsletter for direct communication with interested users
- Community participation for authentic discussions

## 6. Budget-Friendly Growth Tactics
**Zero-Budget Strategies:**
- Organic social media with consistent, valuable content
- SEO-optimized blog content targeting long-tail keywords
- Community participation and relationship building
- Email marketing to owned audience
- User referral programs with built-in incentives

## 7. Metrics & Analytics Framework
**Acquisition Metrics:**
- Website traffic sources and conversion rates
- Social media reach, engagement, and click-through rates
- Email list growth and open/click rates
- SEO rankings and organic search traffic

**Engagement Metrics:**
- User activation and onboarding completion rates
- Feature adoption and usage patterns
- Customer support interactions and satisfaction scores

Focus on authentic engagement and long-term relationship building over short-term gains.`,

  claudeMd: `You are a senior technical lead creating comprehensive project documentation for AI assistants. Create a detailed claude.md configuration file for this VibePHX workshop project:

**PROJECT CONTEXT:**
- Project: {projectName}
- Tech Stack: {techStack}
- Core Features: {features}
- Development Timeline: Rapid prototyping and MVP development

# {projectName} - AI Assistant Configuration

## Project Overview

### Business Context
- **Purpose**: {projectName} built during VibePHX workshop
- **Core Value Proposition**: Primary benefit delivered to users
- **Success Metrics**: Working MVP deployed within 6-8 hours
- **Technical Constraints**: Modern web stack, mobile-responsive, production-ready

### Development Philosophy
- **Speed vs. Perfection**: Prioritize working features over perfect code
- **User Experience**: Simple, intuitive interfaces that solve real problems
- **Code Quality**: Clean, readable code that can be maintained and extended

## Technical Architecture

### Tech Stack Details
- **Frontend**: Modern React with TypeScript
- **Backend**: API routes with proper validation
- **Database**: Relational database with proper schema design
- **Deployment**: Production deployment on modern hosting platform

### Project Structure
\`\`\`
/
|-- app/                 # Next.js App Router
|-- components/          # Reusable UI components  
|-- lib/                # Utility functions and configurations
|-- types/              # TypeScript type definitions
\`-- README.md           # Project documentation
\`\`\`

### Architectural Patterns
- **Component Design**: Small, focused components with single responsibilities
- **State Management**: Context API with custom hooks for complex logic
- **API Design**: RESTful endpoints with consistent response formats
- **Error Handling**: Graceful degradation with user-friendly error messages

## Coding Standards & Preferences

### TypeScript Guidelines
- **Type Safety**: Prefer explicit types over \`any\`
- **Interface Design**: Use interfaces for object shapes, types for unions
- **Null Safety**: Handle null/undefined explicitly with optional chaining

### React/Frontend Patterns
- **Component Organization**: One component per file, co-located with styles
- **Hook Usage**: Custom hooks for reusable stateful logic
- **Styling**: Tailwind CSS with consistent utility patterns
- **Performance**: useMemo/useCallback for expensive operations only

### Backend/API Patterns
- **Route Organization**: Logical grouping by feature/entity
- **Validation**: Input validation at API boundaries with clear error messages
- **Authentication**: Secure by default, explicit permission checks
- **Response Format**: Consistent JSON structure with proper HTTP status codes

## File & Folder Organization

### Naming Conventions
- **Files**: kebab-case for regular files, PascalCase for React components
- **Variables**: camelCase for variables and functions
- **Constants**: SCREAMING_SNAKE_CASE for module-level constants
- **Database**: snake_case for table/column names

### Import Organization
\`\`\`typescript
// 1. External library imports
import React from 'react'
import { NextRequest } from 'next/server'

// 2. Internal imports (absolute paths preferred)
import { Button } from '@/components/ui/Button'
import { validateInput } from '@/lib/validation'

// 3. Relative imports
import './styles.css'
\`\`\`

## Do's and Don'ts

### ✅ DO
- Write self-documenting code with clear variable names
- Handle edge cases and error states explicitly
- Use TypeScript strictly without \`any\` types
- Test critical user flows manually before considering complete
- Optimize for mobile experience from the start
- Follow accessibility best practices
- Keep components small and focused on single responsibility
- Use environment variables for configuration and secrets

### ❌ DON'T
- Expose API keys or sensitive data in client-side code
- Create deeply nested component hierarchies
- Ignore TypeScript errors or use \`@ts-ignore\` without justification
- Implement complex state management for simple applications
- Skip input validation on both client and server sides
- Hardcode URLs, API endpoints, or configuration values
- Use deprecated React patterns
- Commit console.log statements or debugging code

## AI Assistant Guidelines

When working on this project, please:

1. **Understand Context**: Always consider the business goals and user needs
2. **Follow Patterns**: Use the established patterns and conventions consistently
3. **Prioritize**: Focus on core functionality over nice-to-have features
4. **Be Explicit**: Ask for clarification when requirements are ambiguous
5. **Think Holistically**: Consider impacts on other parts of the system
6. **Document Decisions**: Explain complex logic and architectural choices
7. **Stay Updated**: Keep dependencies and patterns current with best practices

---

**Last Updated**: Current Date
**Project Phase**: MVP Development
**Team**: VibePHX Workshop Participant(s)`,

  cursorRules: `You are a senior developer experience engineer specializing in AI-assisted development workflows. Create a comprehensive .cursorrules configuration file for this VibePHX workshop project:

**PROJECT CONTEXT:**
- Project: {projectName}
- Tech Stack: {techStack}
- Development Style: Rapid prototyping with production quality

# .cursorrules for {projectName}

## Project Context
This is a VibePHX workshop project: {projectName}
Tech Stack: {techStack}
Core Features: {features}

We're building an MVP quickly but with production-quality code that can be maintained and extended.

## Code Style & Formatting

### TypeScript Preferences
- Use strict TypeScript with no 'any' types unless absolutely necessary
- Prefer interfaces over types for object shapes
- Use explicit return types for functions
- Enable all strict compiler options
- Use optional chaining (?.) and nullish coalescing (??) for safety

### React/Frontend Standards
- Use functional components with hooks exclusively
- Prefer named exports for components, default exports for pages
- Use 'use client' directive only when necessary for client-side features
- Implement proper loading and error states for all async operations
- Follow the composition pattern over inheritance

### File Naming & Organization
- Components: PascalCase (e.g., UserProfile.tsx)
- Utilities: camelCase (e.g., formatDate.ts)
- Pages/Routes: kebab-case (e.g., user-settings.tsx)
- Constants: SCREAMING_SNAKE_CASE (e.g., API_ENDPOINTS.ts)
- Folders: kebab-case for multi-word directories

### Import Organization
\`\`\`typescript
// 1. React and framework imports
import React from 'react'
import { NextRequest } from 'next/server'

// 2. Third-party library imports
import clsx from 'clsx'
import { z } from 'zod'

// 3. Internal imports (use absolute paths with @/)
import { Button } from '@/components/ui/Button'
import { validateUser } from '@/lib/validation'
import type { User } from '@/types/user'

// 4. Relative imports (only when necessary)
import './component.css'
\`\`\`

## Framework-Specific Patterns

### Next.js App Router
- Use Server Components by default, Client Components only when needed
- Implement proper metadata exports for SEO
- Use route groups for organization: (auth), (dashboard), etc.
- Implement proper error boundaries with error.tsx files

### Database & API Patterns
- Use Zod schemas for API validation
- Implement consistent error handling with try/catch blocks
- Return proper HTTP status codes (200, 201, 400, 404, 500)
- Use typed database queries with proper TypeScript integration

### State Management
- Use React's built-in state management (useState, useContext) for simple state
- Implement custom hooks for complex state logic
- Use useCallback and useMemo judiciously (only when performance testing shows benefit)
- Prefer prop drilling over complex state management for small applications

## Error Handling Standards

### API Error Handling
\`\`\`typescript
try {
  const response = await fetch('/api/endpoint')
  if (!response.ok) {
    throw new Error(\`HTTP error! status: \${response.status}\`)
  }
  const data = await response.json()
  return data
} catch (error) {
  console.error('API call failed:', error)
  throw error // Re-throw to let calling component handle
}
\`\`\`

## Security Best Practices

### Authentication & Authorization
- Never expose API keys in client-side code
- Validate user permissions on every API endpoint
- Use environment variables for all secrets
- Implement proper session management
- Sanitize all user inputs

### Data Protection
- Hash passwords with proper salt
- Use HTTPS in production
- Implement proper CORS configuration
- Validate and sanitize all inputs
- Use parameterized queries to prevent SQL injection

## Performance Guidelines

### Optimization Priorities
1. Avoid premature optimization - measure first
2. Optimize images with Next.js Image component
3. Use dynamic imports for large components
4. Implement proper caching strategies
5. Minimize bundle size with tree shaking

## Common Patterns to Avoid

- Don't use class components (prefer functional components with hooks)
- Avoid deeply nested ternary operators
- Don't ignore TypeScript errors or use @ts-ignore without justification
- Avoid inline styles (use CSS classes)
- Don't hardcode API endpoints or configuration values
- Avoid complex state management libraries for simple applications
- Don't skip input validation on both client and server
- Avoid exposing sensitive data in client-side code

## AI Assistant Guidelines

When using Cursor's AI assistance:

1. **Be Specific**: Provide context about the current feature being built
2. **Ask for Patterns**: Request code that follows the established patterns
3. **Consider Edge Cases**: Ask the AI to consider error handling and edge cases
4. **Request Tests**: Ask for both manual testing steps and automated tests when applicable
5. **Optimize for Readability**: Prioritize code that other developers can understand
6. **Follow Standards**: Ensure all generated code follows the project's established conventions

---

**Last Updated**: Current Date
**Project Phase**: MVP Development
**Cursor Version**: Latest stable release`
}

// Function to get cached content from cookies
async function getCachedContent(sessionId: string, docType: string): Promise<string | null> {
  const cookieStore = await cookies()
  const cacheKey = `gen_${sessionId}_${docType}`
  return cookieStore.get(cacheKey)?.value || null
}

// Function to cache content in cookies
async function setCachedContent(sessionId: string, docType: string, content: string): Promise<void> {
  const cookieStore = await cookies()
  const cacheKey = `gen_${sessionId}_${docType}`
  // Store with 24 hour expiration
  cookieStore.set(cacheKey, content, { 
    maxAge: 86400, // 24 hours
    httpOnly: false, // Allow client-side access
    sameSite: 'lax'
  })
}

// Generate session ID if not provided
async function getOrCreateSessionId(request: NextRequest): Promise<string> {
  const cookieStore = await cookies()
  const existingSession = cookieStore.get('gen_session_id')?.value
  
  if (existingSession) {
    return existingSession
  }
  
  const newSessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  cookieStore.set('gen_session_id', newSessionId, {
    maxAge: 86400, // 24 hours
    httpOnly: false,
    sameSite: 'lax'
  })
  
  return newSessionId
}

export async function POST(req: NextRequest) {
  const encoder = new TextEncoder()
  
  try {
    const { projectData, documentType } = await req.json()
    
    // Get or create session ID
    const sessionId = await getOrCreateSessionId(req)
    
    // Check cache first
    const cachedContent = await getCachedContent(sessionId, documentType)
    if (cachedContent) {
      // Return cached content immediately as a stream
      const stream = new ReadableStream({
        start(controller) {
          // Send cached indicator
          controller.enqueue(encoder.encode(`data: {"type":"cache","message":"Loading from cache..."}\n\n`))
          
          // Send cached content in chunks to simulate streaming
          const words = cachedContent.split(' ')
          let wordIndex = 0
          
          const sendChunk = () => {
            if (wordIndex < words.length) {
              const chunk = words.slice(wordIndex, Math.min(wordIndex + 5, words.length)).join(' ')
              // Use JSON.stringify to properly escape the chunk
              const chunkData = JSON.stringify({ type: "content", chunk: chunk + " " })
              controller.enqueue(encoder.encode(`data: ${chunkData}\n\n`))
              wordIndex += 5
              setTimeout(sendChunk, 50) // Fast playback for cached content
            } else {
              // Use JSON.stringify for final content
              const completeData = JSON.stringify({ type: "complete", content: cachedContent })
              controller.enqueue(encoder.encode(`data: ${completeData}\n\n`))
              controller.close()
            }
          }
          
          setTimeout(sendChunk, 100)
        }
      })
      
      return new Response(stream, {
        headers: {
          'Content-Type': 'text/plain; charset=utf-8',
          'Transfer-Encoding': 'chunked',
          'Cache-Control': 'no-cache',
          'Connection': 'keep-alive',
        }
      })
    }

    const template = DOCUMENT_TEMPLATES[documentType as keyof typeof DOCUMENT_TEMPLATES]
    if (!template) {
      return Response.json({ error: 'Invalid document type' }, { status: 400 })
    }

    // Prepare context for the template
    const projectName = projectData.template || projectData.customIdea || 'Custom Project'
    const techStack = `${projectData.stack.frontend || ''} + ${projectData.stack.backend || ''} + ${projectData.stack.database || ''}`
    const features = projectData.features?.join(', ') || ''
    const deployment = projectData.deployment?.platform || 'TBD'
    const database = projectData.stack.database || 'TBD'

    const prompt = template
      .replace(/{projectName}/g, projectName)
      .replace(/{techStack}/g, techStack)
      .replace(/{features}/g, features)
      .replace(/{deployment}/g, deployment)
      .replace(/{database}/g, database)

    // Create streaming response
    const stream = new ReadableStream({
      async start(controller) {
        try {
          controller.enqueue(encoder.encode(`data: {"type":"start","message":"Generating ${documentType}..."}\n\n`))

          console.log(`🚀 Starting generation for ${documentType}...`)
          
          // Make API call to OpenRouter with timeout
          const abortController = new AbortController()
          const timeoutId = setTimeout(() => {
            console.log(`⏰ API call timeout for ${documentType}`)
            abortController.abort()
          }, 30000) // 30 second timeout
          
          const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
              'HTTP-Referer': process.env.OPENROUTER_SITE_URL || 'http://localhost:3000',
              'X-Title': process.env.OPENROUTER_SITE_NAME || 'VibePHX AI Builder',
            },
            body: JSON.stringify({
              model: 'anthropic/claude-3.5-sonnet',
              messages: [{
                role: 'user',
                content: `${prompt}

Additional Context:
- This is for VibePHX, a one-day AI-assisted app building workshop
- Focus on practical, achievable outcomes
- Include specific examples and code snippets where helpful
- Assume the builder is a beginner-intermediate developer
- Prioritize speed and functionality over perfection

Generate a comprehensive, well-structured document in Markdown format.`
              }],
              stream: false // We'll handle streaming manually for better control
            }),
            signal: abortController.signal
          })
          
          clearTimeout(timeoutId)

          if (!response.ok) {
            const errorText = await response.text()
            console.error(`❌ OpenRouter API error: ${response.status} ${response.statusText}`, errorText)
            throw new Error(`OpenRouter API error: ${response.status} ${response.statusText}`)
          }

          console.log(`✅ Got response for ${documentType}, parsing...`)
          const data = await response.json()
          const content = data.choices[0]?.message?.content

          if (!content) {
            console.error('❌ No content in OpenRouter response:', data)
            throw new Error('No content in OpenRouter response')
          }
          
          console.log(`📝 Generated ${content.length} characters for ${documentType}`)

          // Cache the generated content
          await setCachedContent(sessionId, documentType, content)

          // Stream the content word by word
          const words = content.split(' ')
          let currentContent = ''
          
          for (let i = 0; i < words.length; i++) {
            const chunk = words[i] + ' '
            currentContent += chunk
            
            // Use JSON.stringify to properly escape the chunk
            const jsonData = JSON.stringify({ type: "content", chunk: chunk })
            controller.enqueue(encoder.encode(`data: ${jsonData}\n\n`))
            
            // Add small delay to simulate real-time generation
            await new Promise(resolve => setTimeout(resolve, 30))
          }

          // Use JSON.stringify for final content
          const completeData = JSON.stringify({ type: "complete", content: content })
          controller.enqueue(encoder.encode(`data: ${completeData}\n\n`))
          controller.close()

        } catch (error) {
          console.error(`❌ Streaming generation error for ${documentType}:`, error)
          
          // Send detailed error message
          const errorMessage = error instanceof Error ? error.message : 'Unknown error'
          const errorData = JSON.stringify({ 
            type: "error", 
            message: `Failed to generate ${documentType}: ${errorMessage}` 
          })
          controller.enqueue(encoder.encode(`data: ${errorData}\n\n`))
          controller.close()
        }
      }
    })

    return new Response(stream, {
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        'Transfer-Encoding': 'chunked',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
        'Set-Cookie': `gen_session_id=${sessionId}; Max-Age=86400; Path=/; SameSite=lax`,
      }
    })

  } catch (error) {
    console.error('Generation error:', error)
    return Response.json(
      { error: 'Failed to generate document' },
      { status: 500 }
    )
  }
}

export const runtime = 'edge'