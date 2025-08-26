import { createOpenAI } from '@ai-sdk/openai'
import { generateText } from 'ai'
import { NextRequest } from 'next/server'

// OpenRouter configuration
const openRouterConfig = createOpenAI({
  apiKey: process.env.OPENROUTER_API_KEY || '',
  baseURL: 'https://openrouter.ai/api/v1',
})

const DOCUMENT_TEMPLATES = {
  prd: `Create a comprehensive Product Requirements Document (PRD) for this project:

Project: {projectName}
Tech Stack: {techStack}
Features: {features}
Deployment: {deployment}

Include:
1. Executive Summary
2. User Stories
3. Feature Requirements
4. Technical Constraints
5. Success Metrics
6. Timeline

Keep it concise but thorough, focused on 1-day execution.`,

  buildDoc: `Create a detailed technical build guide for this project:

Project: {projectName}
Tech Stack: {techStack}
Features: {features}
Deployment Platform: {deployment}

Include:
1. Project Setup Steps
2. Folder Structure
3. Key Dependencies
4. Implementation Order
5. API Endpoints Needed
6. Database Schema
7. Deployment Instructions
8. Testing Strategy

Provide specific, actionable steps that a beginner can follow.`,

  uiSpecs: `Create UI/UX specifications for this project:

Project: {projectName}
Features: {features}
Target Users: Based on the project scope

Include:
1. User Flow Diagrams
2. Wireframes Description
3. Component Breakdown
4. Color Scheme & Typography
5. Responsive Design Notes
6. Accessibility Considerations

Focus on clean, modern design that's achievable in one day.`,

  dataModels: `Design the data models and database schema for this project:

Project: {projectName}
Database: {database}
Features: {features}

Include:
1. Entity Relationship Diagram
2. Table Schemas
3. Data Types and Constraints
4. Relationships
5. Indexes
6. Sample Data
7. Migration Scripts

Keep it simple and scalable.`,

  taskList: `Create a prioritized development task list for this project:

Project: {projectName}
Tech Stack: {techStack}
Features: {features}
Time Constraint: One day (6-8 hours)

Create tasks in order of priority with:
1. Task name
2. Description
3. Estimated time
4. Dependencies
5. Acceptance criteria

Break down into 30-60 minute chunks for effective time management.`,

  marketingGuide: `Create a marketing and launch strategy for this project:

Project: {projectName}
Features: {features}
Target Audience: Based on project scope

Include:
1. Value Proposition
2. Target Audience Analysis
3. Launch Strategy
4. Content Marketing Ideas
5. Social Media Plan
6. Metrics to Track
7. Growth Tactics

Focus on low-cost, high-impact strategies for indie makers.`,

  claudeMd: `Create a claude.md configuration file for this project:

Project: {projectName}
Tech Stack: {techStack}
Features: {features}

Create a comprehensive claude.md that includes:
1. Project context and goals
2. Tech stack details
3. Coding standards and preferences
4. File structure expectations
5. Common patterns to follow
6. Do's and don'ts
7. Testing approach
8. Deployment considerations

Make it specific to this project's needs and tech choices.`,

  cursorRules: `Create a .cursorrules configuration file for this project:

Project: {projectName}
Tech Stack: {techStack}

Create .cursorrules that includes:
1. File naming conventions
2. Code formatting preferences
3. Import organization
4. Comment standards
5. Error handling patterns
6. Testing conventions
7. Git commit message format

Optimize for the specific tech stack and project type.`
}

export async function POST(req: NextRequest) {
  try {
    const { projectData, documentType } = await req.json()

    const template = DOCUMENT_TEMPLATES[documentType as keyof typeof DOCUMENT_TEMPLATES]
    if (!template) {
      return Response.json({ error: 'Invalid document type' }, { status: 400 })
    }

    // Prepare context for the template
    const projectName = projectData.template || 'Custom Project'
    const techStack = `${projectData.stack.frontend || ''} + ${projectData.stack.backend || ''} + ${projectData.stack.database || ''}`
    const features = projectData.features.join(', ')
    const deployment = projectData.deployment.platform || 'TBD'
    const database = projectData.stack.database || 'TBD'

    const prompt = template
      .replace(/{projectName}/g, projectName)
      .replace(/{techStack}/g, techStack)
      .replace(/{features}/g, features)
      .replace(/{deployment}/g, deployment)
      .replace(/{database}/g, database)

    const { text } = await generateText({
      model: openRouterConfig('anthropic/claude-3.5-sonnet'),
      prompt: `${prompt}

Additional Context:
- This is for VibePHX, a one-day AI-assisted app building workshop
- Focus on practical, achievable outcomes
- Include specific examples and code snippets where helpful
- Assume the builder is a beginner-intermediate developer
- Prioritize speed and functionality over perfection

Generate a comprehensive, well-structured document in Markdown format.`,
    })

    return Response.json({ content: text })
  } catch (error) {
    console.error('Generation error:', error)
    return Response.json(
      { error: 'Failed to generate document' },
      { status: 500 }
    )
  }
}

export const runtime = 'edge'