import { NextRequest } from 'next/server'

const DOCUMENT_TEMPLATES = {
  prd: `<thinking>
I need to create a comprehensive Product Requirements Document (PRD) that balances thorough planning with rapid execution. This is for a hackathon/one-day build scenario, so I should focus on clarity, actionability, and realistic scope while maintaining professional quality.

Key considerations:
- The project needs to be buildable in 6-8 hours by novice developers
- Tech stack choices should align with beginner-friendly tools
- Features should be prioritized by impact and feasibility
- Success metrics should be measurable within the launch timeframe
- Timeline should account for learning curves with modern AI tools
</thinking>

You are an expert product manager specializing in rapid prototyping and hackathon-style development. Create a comprehensive Product Requirements Document (PRD) for this VibePHX workshop project:

**PROJECT CONTEXT:**
- Project: {projectName}
- Tech Stack: {techStack}  
- Core Features: {features}
- Deployment Platform: {deployment}
- Build Constraint: 6-8 hours with AI-assisted development tools
- Target Builders: Novice to intermediate developers using v0.dev, Cursor, Claude

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
- Success scenario descriptions

## 3. Feature Requirements (MoSCoW Prioritization)
**Must Have (Launch Day):**
- Core features that define the product
- Specific acceptance criteria for each

**Should Have (If Time Permits):**
- Enhancement features that improve UX
- Nice-to-have functionality

**Won't Have (V1 Scope):**
- Features explicitly excluded from initial build
- Future roadmap considerations

## 4. Technical Constraints & Considerations
- Performance requirements (load time, response time)
- Browser compatibility and device support
- Data privacy and basic security requirements
- Integration limitations and dependencies
- Scalability considerations for initial launch

## 5. Success Metrics & Definition of Done
- Primary KPI for launch day success
- User engagement metrics to track
- Technical performance benchmarks
- Qualitative feedback criteria

## 6. Implementation Timeline (6-8 Hour Sprint)
- Hour-by-hour breakdown with milestones
- Dependency mapping between features
- Risk mitigation for common blockers
- Testing and deployment windows

**QUALITY STANDARDS:**
- Write with clarity for developers who may be new to the tech stack
- Include specific examples and edge cases
- Balance ambition with realistic 1-day scope
- Emphasize user value over technical complexity`,

  buildDoc: `<thinking>
I need to create a comprehensive technical build guide that serves as the single source of truth for implementing this project. This guide will be used by developers who may be new to some of the technologies, so I need to:

1. Break down complex setup into digestible steps
2. Provide specific commands and code snippets
3. Anticipate common gotchas and provide solutions
4. Structure the guide in logical implementation order
5. Include troubleshooting for typical issues
6. Balance thoroughness with the 6-8 hour constraint

The guide should be practical and actionable, not just theoretical.
</thinking>

You are a senior full-stack engineer and technical mentor specializing in rapid prototyping and developer education. Create a comprehensive Technical Build Guide for this VibePHX workshop project:

**PROJECT CONTEXT:**
- Project: {projectName}
- Tech Stack: {techStack}
- Core Features: {features}
- Deployment Platform: {deployment}
- Time Constraint: 6-8 hours with AI assistance
- Target Audience: Developers using Claude, Cursor, v0.dev

**BUILD GUIDE STRUCTURE:**

## 1. Environment Setup & Prerequisites
- System requirements and version checks
- Development tool installation (Node.js, Git, IDE setup)
- Account creation for services (deployment, databases, APIs)
- Environment variable template
- Quick health check commands

## 2. Project Initialization
- Step-by-step project creation commands
- Initial folder structure with explanations
- Core configuration files setup
- Git repository initialization
- First commit milestone

## 3. Dependency Management
- Package.json breakdown with rationale for each dependency
- Installation commands with troubleshooting notes
- Version compatibility considerations
- Optional vs required packages

## 4. Database Setup & Schema
- Database service setup (migrations, seeds)
- Schema implementation with actual code
- Connection configuration
- Test data population
- Database debugging tips

## 5. Backend Implementation Order
- API route structure and organization
- Authentication setup (if required)
- Core business logic implementation
- Error handling patterns
- API testing strategies

## 6. Frontend Development Path
- Component architecture decisions
- State management setup
- UI framework configuration
- Responsive design implementation
- Integration with backend APIs

## 7. Feature Implementation Roadmap
- Feature-by-feature build order with dependencies
- Code snippets for critical functionality
- Integration points and testing
- Performance optimization checkpoints

## 8. Testing & Quality Assurance
- Testing framework setup
- Unit test examples for core functions
- Integration testing approach
- Manual testing checklist
- Performance benchmarking

## 9. Deployment Process
- Build optimization steps
- Environment-specific configurations
- Deployment platform setup
- CI/CD pipeline (if applicable)
- Post-deployment verification

## 10. Troubleshooting Guide
- Common error patterns and solutions
- Debug techniques and tools
- Performance bottleneck identification
- Resource links for deeper issues

**QUALITY STANDARDS:**
- Include actual command-line instructions with expected outputs
- Provide code snippets that can be copied and pasted
- Explain the "why" behind architectural decisions
- Include time estimates for each major section
- Add checkpoints to validate progress
- Focus on patterns that scale beyond this project`,

  uiSpecs: `<thinking>
I need to create UI/UX specifications that balance professional design quality with rapid implementation. The key is to provide enough detail for consistent implementation while keeping the design system simple enough for a one-day build.

Considerations:
- Design should work across devices without complex responsive logic
- Component system should be reusable but not over-engineered
- Visual hierarchy should guide users naturally through the application
- Accessibility should be built-in, not bolted-on
- Modern aesthetic that looks professional but uses standard patterns
- Color and typography choices that are both attractive and functional
</thinking>

You are a senior UX/UI designer specializing in rapid prototyping and modern web applications. Create comprehensive UI/UX specifications for this VibePHX workshop project:

**PROJECT CONTEXT:**
- Project: {projectName}
- Core Features: {features}
- Development Time: 6-8 hours
- Technical Constraints: Built with modern web frameworks, must be responsive
- User Experience Goals: Intuitive, professional, conversion-focused

**UI/UX SPECIFICATION DOCUMENT:**

## 1. Design Philosophy & Principles
- Core design values (simplicity, functionality, accessibility)
- Visual personality and brand direction
- User experience priorities
- Mobile-first vs desktop-first approach
- Performance considerations affecting design

## 2. User Journey & Flow Architecture
- Primary user personas and their goals
- Complete user flow from entry to conversion/completion
- Decision trees for different user paths
- Error states and edge case handling
- Success metrics and conversion funnels

## 3. Information Architecture
- Site map and page hierarchy
- Navigation structure and patterns
- Content organization principles
- Search and discovery patterns (if applicable)
- User mental models and expectations

## 4. Visual Design System
**Color Palette:**
- Primary, secondary, and accent colors with hex codes
- Semantic colors for success, warning, error states
- Neutral grays and background colors
- Color accessibility compliance (WCAG AA)

**Typography Scale:**
- Font family selections with fallbacks
- Heading hierarchy (H1-H6) with sizes and weights
- Body text, captions, and UI text specifications
- Line height, letter spacing, and responsive scaling

**Spacing System:**
- Consistent spacing scale (4px, 8px, 16px, etc.)
- Component padding and margin standards
- Grid system and layout principles
- Responsive breakpoint definitions

## 5. Component Library
**Core UI Components:**
- Buttons (primary, secondary, tertiary states)
- Form inputs, labels, and validation patterns
- Cards, modals, and content containers
- Navigation components and breadcrumbs
- Loading states and progress indicators

**Layout Components:**
- Header/navbar with responsive behavior
- Sidebar patterns and mobile menu
- Footer structure and content
- Page templates and content areas
- Grid systems and responsive layouts

## 6. Interaction Patterns
- Hover, focus, and active states for all interactive elements
- Animation and transition specifications
- Feedback patterns for user actions
- Loading and empty states
- Error handling and recovery flows

## 7. Responsive Design Strategy
- Mobile (320px-768px) design patterns
- Tablet (768px-1024px) adaptations
- Desktop (1024px+) layout optimizations
- Touch target sizes and spacing
- Performance considerations for different devices

## 8. Accessibility & Usability
- WCAG 2.1 AA compliance checklist
- Keyboard navigation patterns
- Screen reader optimization
- Color contrast verification
- Focus management and skip links

## 9. Implementation Guidelines
- CSS framework recommendations and customizations
- Component naming conventions
- File organization for styles and assets
- Performance optimization techniques
- Browser compatibility requirements

**DELIVERY FOCUS:**
- Provide specific, implementable design tokens
- Include visual examples and code snippets where helpful
- Balance aesthetic appeal with development speed
- Ensure designs scale well with content variations
- Create a system that non-designers can extend consistently`,

  dataModels: `<thinking>
I need to design a data architecture that is both robust enough to handle the application's requirements and simple enough to implement quickly. The key considerations are:

1. Data normalization vs. denormalization trade-offs for read/write performance
2. Relationship modeling that prevents data integrity issues
3. Indexing strategy for expected query patterns
4. Schema evolution and migration planning
5. Security considerations for sensitive data
6. Performance implications of the chosen database technology

The design should be production-ready but not over-engineered for a one-day build timeline.
</thinking>

You are a senior database architect and backend engineer specializing in scalable data design for modern applications. Create a comprehensive data architecture specification for this VibePHX workshop project:

**PROJECT CONTEXT:**
- Project: {projectName}
- Database Technology: {database}
- Core Features: {features}
- Scale Expectations: MVP to moderate traffic
- Development Timeline: 6-8 hours
- Future Growth: Designed for extensibility

**DATA ARCHITECTURE SPECIFICATION:**

## 1. Data Analysis & Requirements
- Core business entities and their attributes
- Data relationships and cardinality analysis
- Read vs. write patterns and frequency
- Data consistency vs. performance requirements
- Privacy and security considerations

## 2. Database Technology Justification
- Why the selected database fits this project
- Specific features leveraged (JSON fields, full-text search, etc.)
- Scaling characteristics and limitations
- Development experience and deployment considerations
- Alternative options considered and rejected

## 3. Entity Relationship Design
**Core Entities:**
- Entity definitions with business context
- Attribute specifications (required, optional, computed)
- Primary key strategies (UUIDs vs. auto-increment)
- Foreign key relationships and cascading rules
- Constraint definitions and business rule enforcement

**Relationship Patterns:**
- One-to-many relationships with clear ownership
- Many-to-many relationships with junction tables
- Self-referential relationships (if applicable)
- Hierarchical data modeling approaches
- Temporal data considerations (created_at, updated_at)

## 4. Table Schema Specifications
For each table, provide:
- Complete column definitions with data types
- Null constraints and default values
- Check constraints for data validation
- Unique constraints and composite keys
- JSON/JSONB field structures (if applicable)

## 5. Indexing Strategy
**Performance Indexes:**
- Primary indexes for unique identification
- Foreign key indexes for join performance
- Composite indexes for multi-column queries
- Partial indexes for filtered queries
- Full-text search indexes (if applicable)

**Index Maintenance:**
- Index naming conventions
- Query pattern analysis and optimization
- Index monitoring and performance tracking
- Storage space considerations

## 6. Data Migration & Seeding
**Schema Migration Plan:**
- Initial schema creation scripts
- Migration versioning strategy
- Rollback procedures for schema changes
- Data migration patterns for schema evolution

**Seed Data Strategy:**
- Test data requirements and generation
- Reference data and lookup tables
- Development vs. production data differences
- Data anonymization for development environments

## 7. Query Patterns & Optimization
- Expected query patterns with example SQL
- N+1 query prevention strategies
- Pagination and sorting implementations
- Aggregation and reporting queries
- Performance benchmarking approaches

## 8. Data Security & Privacy
- Sensitive data identification and encryption
- Access control and row-level security
- Audit logging and compliance considerations
- Backup and recovery procedures
- GDPR/privacy regulation compliance

## 9. API Integration Layer
- ORM/query builder integration patterns
- Data validation at the application layer
- Caching strategies for frequently accessed data
- Real-time data synchronization (if needed)
- API response optimization

## 10. Monitoring & Maintenance
- Database performance monitoring setup
- Log analysis and slow query identification
- Automated backup and disaster recovery
- Scaling strategies (vertical vs. horizontal)
- Health checks and alerting

**IMPLEMENTATION DELIVERABLES:**
- Complete SQL DDL scripts ready for execution
- Sample data insertion scripts
- Example queries for common operations
- Performance testing scenarios
- Documentation for future developers

**QUALITY STANDARDS:**
- Production-ready schema with proper constraints
- Scalable design that can grow with the application
- Clear documentation of design decisions
- Testable and maintainable data layer
- Security-first approach to sensitive data`,

  taskList: `<thinking>
I need to create a task breakdown that transforms this project from concept to deployed application within 6-8 hours. This requires:

1. Realistic time estimates based on developer skill level
2. Proper sequencing to avoid blockers
3. Clear acceptance criteria to prevent scope creep
4. Built-in buffer time for debugging and unexpected issues
5. Milestone checkpoints to measure progress
6. Fallback tasks if primary features prove too complex

The task list should be actionable, specific, and account for the iterative nature of development.
</thinking>

You are an experienced project manager and technical lead specializing in rapid development cycles and hackathon-style projects. Create a comprehensive, time-boxed development task list for this VibePHX workshop project:

**PROJECT CONTEXT:**
- Project: {projectName}
- Tech Stack: {techStack}
- Core Features: {features}
- Total Time Budget: 6-8 hours
- Team Composition: 1-2 developers using AI assistance
- Success Definition: Working MVP deployed to production

**DEVELOPMENT TASK BREAKDOWN:**

## Phase 1: Foundation Setup (60-90 minutes)
### Environment & Infrastructure Tasks
**Priority: Critical** | **Time: 15-30 min each**

**Task: Development Environment Setup**
- Description: Install dependencies, configure development tools, set up database  
- Acceptance Criteria: Can run \`npm run dev\` successfully, database connected
- Dependencies: None
- Potential Blockers: Version conflicts, database connection issues
- Success Metric: Local server running without errors

**Task: Project Structure Creation**
- Description: Set up folder structure, routing, and basic configuration
- Acceptance Criteria: All routes defined, folder structure matches architecture
- Dependencies: Environment setup complete
- Time Buffer: +15 min for unexpected configuration issues

## Phase 2: Core Backend (90-120 minutes)
### API & Data Layer Implementation
**Priority: High** | **Time: 20-40 min each**

**Task: Database Schema Implementation**
- Description: Create tables, relationships, and initial migrations
- Acceptance Criteria: All entities created, relationships working, seed data loaded
- Dependencies: Database connection established
- Validation: Can query all tables successfully

**Task: Authentication System (if required)**
- Description: Implement user registration, login, session management
- Acceptance Criteria: Users can register, login, and access protected routes
- Dependencies: Database schema complete
- Fallback: Use simplified auth or skip if time-constrained

**Task: Core API Endpoints**
- Description: Build CRUD operations for primary business entities
- Acceptance Criteria: All endpoints return expected JSON, error handling implemented
- Dependencies: Database and auth (if applicable) complete
- Testing: Each endpoint tested with sample data

## Phase 3: Frontend Foundation (90-120 minutes)
### UI Components & State Management
**Priority: High** | **Time: 20-45 min each**

**Task: Component Library Setup**
- Description: Create reusable UI components (buttons, forms, layouts)
- Acceptance Criteria: Consistent styling, responsive behavior, accessibility basics
- Dependencies: Project structure and design system defined
- Quality Gate: Components work across different screen sizes

**Task: State Management Implementation**
- Description: Set up global state, API integration, data fetching patterns
- Acceptance Criteria: Data flows correctly between components and backend
- Dependencies: API endpoints functional
- Performance Check: No unnecessary re-renders or API calls

**Task: Navigation & Routing**
- Description: Implement page routing, navigation menus, and user flows
- Acceptance Criteria: All pages accessible, navigation intuitive, URLs clean
- Dependencies: Component library and state management ready

## Phase 4: Feature Implementation (120-180 minutes)
### Business Logic & User Features
**Priority: High to Medium** | **Time: 30-60 min each**

**Task: [Primary Feature Implementation]**
- Description: Build the core value proposition of the application
- Acceptance Criteria: Feature works end-to-end, handles edge cases
- Dependencies: Backend and frontend foundation complete
- Success Metric: User can complete primary workflow successfully

**Task: [Secondary Feature Implementation]**
- Description: Implement supporting features that enhance user experience
- Acceptance Criteria: Features integrate smoothly with primary functionality
- Dependencies: Primary feature complete
- Fallback Option: Simplify or defer if time runs short

**Task: Error Handling & Validation**
- Description: Add form validation, error messages, and graceful failure modes
- Acceptance Criteria: Users receive clear feedback, application doesn't crash
- Dependencies: Core features implemented
- Quality Focus: User experience during error conditions

## Phase 5: Polish & Deployment (60-90 minutes)
### Quality Assurance & Production Readiness
**Priority: Medium to High** | **Time: 15-30 min each**

**Task: UI Polish & Responsive Design**
- Description: Refine styling, improve mobile experience, add loading states
- Acceptance Criteria: Professional appearance, works on mobile and desktop
- Dependencies: All features implemented
- Quality Metric: Passes basic usability test

**Task: Performance Optimization**
- Description: Optimize images, bundle size, database queries, loading times
- Acceptance Criteria: Page loads under 3 seconds, smooth interactions
- Dependencies: Application feature-complete
- Tools: Lighthouse audit, performance profiling

**Task: Production Deployment**
- Description: Configure production environment, deploy application, verify functionality
- Acceptance Criteria: Application accessible via public URL, all features working
- Dependencies: Application ready for production
- Success Metric: Zero critical errors in production

**Task: Documentation & Handoff**
- Description: Create basic README, document any special setup requirements
- Acceptance Criteria: Another developer could understand and extend the code
- Dependencies: Deployment successful
- Deliverable: Clear documentation for future development

## Risk Mitigation & Time Management

**Buffer Tasks (if ahead of schedule):**
- Additional UI improvements
- Extra error handling
- Performance optimizations
- Additional features from nice-to-have list

**Contingency Plans (if behind schedule):**
- Simplify authentication system
- Reduce feature scope to core MVP
- Use pre-built components where possible
- Deploy with basic styling, polish post-launch

**Progress Checkpoints:**
- Hour 2: Backend foundation complete
- Hour 4: Frontend displaying data from backend
- Hour 6: Core features functional
- Hour 7: Deployed and accessible
- Hour 8: Polish and documentation complete

**QUALITY STANDARDS:**
- Each task includes specific time estimates and acceptance criteria
- Dependencies clearly mapped to prevent blocking
- Built-in flexibility for scope adjustment
- Focus on working software over perfect code
- Emphasis on user value and core functionality`,

  marketingGuide: `<thinking>
I need to create a marketing strategy that's realistic for an indie maker or small team with limited budget and time. The focus should be on:

1. Clear value proposition that resonates with the target market
2. Low-cost, high-impact marketing channels
3. Content strategies that can be automated or batched
4. Community-driven growth tactics
5. Measurable metrics that matter for early-stage products
6. Strategies that can be executed alongside product development

The guide should be actionable and avoid expensive or time-intensive tactics that aren't suitable for solo developers or small teams.
</thinking>

You are a seasoned growth marketing strategist specializing in bootstrapped startups and indie maker launches. Create a comprehensive, budget-conscious marketing and launch strategy for this VibePHX workshop project:

**PROJECT CONTEXT:**
- Project: {projectName}
- Core Features: {features}
- Development Stage: MVP to launch
- Budget Constraints: Minimal to zero paid marketing budget
- Team Size: Solo developer or small team
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
- Pricing psychology and value perception
- Brand personality and communication tone

## 2. Target Audience Deep Dive

**Primary User Persona:**
- Demographics, psychographics, and behavioral patterns
- Current tools and workflows they use
- Biggest frustrations and unmet needs
- Where they spend time online (platforms, communities)
- Decision-making process and buying triggers

**Secondary Audiences:**
- Adjacent user groups that could benefit
- Influencers and advocates within the target market
- Potential partners or referral sources
- Early adopter characteristics and motivations

## 3. Pre-Launch Foundation Building

**Content Creation Strategy:**
- Build-in-public documentation and progress updates
- Educational content addressing target audience pain points
- Behind-the-scenes content showing development process
- User research and validation case studies
- Technical tutorials and thought leadership pieces

**Audience Building:**
- Social media presence establishment and content calendar
- Email list building with lead magnets and valuable content
- Community participation in relevant forums and groups
- Networking with other makers, potential users, and industry experts
- SEO foundation with keyword research and content optimization

## 4. Launch Strategy & Tactics

**Soft Launch Phase (Week 1):**
- Limited beta release to close network and early supporters
- Gather initial user feedback and testimonials
- Refine onboarding flow and fix critical bugs
- Create case studies and success stories from beta users
- Build momentum and social proof for broader launch

**Public Launch Phase (Week 2-3):**
- Product Hunt launch with strategic timing and community mobilization
- Hacker News submission with compelling story and technical depth
- Social media campaign with consistent messaging across platforms
- Email announcement to built audience with clear call-to-action
- Outreach to relevant bloggers, podcasters, and industry publications

**Post-Launch Amplification (Week 4+):**
- User-generated content campaigns and community challenges
- Strategic partnerships with complementary tools and services
- Guest posting and podcast appearances in target market
- Press outreach to tech and industry-specific publications
- Referral program implementation for organic growth

## 5. Content Marketing & Distribution

**Content Pillars:**
- Educational: How-to guides, tutorials, best practices
- Inspirational: Success stories, case studies, user transformations
- Behind-the-scenes: Development process, lessons learned, transparency
- Industry insights: Trends, predictions, expert analysis
- Community: User spotlights, Q&As, collaborative content

**Distribution Channels:**
- Blog with SEO optimization and social sharing
- YouTube or TikTok for video content and tutorials
- Twitter/X for real-time updates and community engagement
- LinkedIn for professional networking and B2B content
- Reddit for community engagement and authentic discussions
- Newsletter for direct communication with interested users

## 6. Community Building & Engagement

**Community Platform Strategy:**
- Discord/Slack community for power users and feedback
- Social media groups for broader audience engagement
- User forums or discussion boards for product support
- Virtual events, webinars, or AMAs for deeper connection

**Engagement Tactics:**
- Regular community challenges and contests
- User feature spotlights and success story sharing
- Collaborative roadmap planning and feature voting
- Expert Q&As and educational sessions
- Exclusive early access to new features for community members

## 7. Metrics & Analytics Framework

**Acquisition Metrics:**
- Website traffic sources and conversion rates
- Social media reach, engagement, and click-through rates
- Email list growth and open/click rates
- Referral traffic and attribution tracking
- SEO rankings and organic search traffic

**Engagement Metrics:**
- User activation and onboarding completion rates
- Feature adoption and usage patterns
- Community engagement and user-generated content
- Customer support interactions and satisfaction scores
- Time-to-value and user retention curves

**Growth Metrics:**
- Monthly active users and retention cohorts
- Viral coefficient and organic sharing rates
- Customer lifetime value and churn analysis
- Revenue growth and unit economics (if applicable)
- Net Promoter Score and user satisfaction trends

## 8. Budget-Friendly Growth Tactics

**Zero-Budget Strategies:**
- Organic social media with consistent, valuable content
- SEO-optimized blog content targeting long-tail keywords
- Community participation and relationship building
- Email marketing to owned audience
- User referral programs with built-in incentives

**Low-Budget Amplification ($100-500):**
- Targeted social media ads for high-intent audiences
- Google Ads for specific, high-converting keywords
- Sponsored newsletter placements in relevant communities
- Micro-influencer partnerships and affiliate programs
- Premium tools for analytics, automation, and optimization

## 9. Launch Timeline & Execution

**4 Weeks Before Launch:**
- Complete market research and persona validation
- Build landing page and email capture system
- Start content creation and social media presence
- Begin community engagement and relationship building

**2 Weeks Before Launch:**
- Finalize launch strategy and timeline
- Create launch assets (graphics, videos, press kit)
- Schedule social media content and email sequences
- Reach out to potential launch partners and supporters

**Launch Week:**
- Execute launch plan with coordinated messaging
- Monitor analytics and engagement in real-time
- Respond to feedback and engage with users actively
- Adjust tactics based on initial performance data

**Post-Launch (Ongoing):**
- Analyze launch performance and document learnings
- Continue content creation and community building
- Iterate on messaging and tactics based on user feedback
- Plan follow-up campaigns and feature announcements

**SUCCESS FACTORS:**
- Consistency in messaging and brand presentation
- Authentic engagement with target communities
- Focus on providing genuine value before asking for anything
- Data-driven decision making and continuous optimization
- Long-term relationship building over short-term gains`,

  claudeMd: `<thinking>
I need to create a claude.md file that will help Claude understand this specific project's context, patterns, and preferences. This should be comprehensive enough to guide Claude's decisions but specific enough to be actionable.

Key elements:
1. Project overview and business context
2. Technical architecture and patterns used
3. Code style and organizational preferences
4. Common patterns and anti-patterns
5. Testing and deployment approaches
6. Specific to the chosen tech stack

This should read like documentation for a senior developer joining the project.
</thinking>

You are a senior technical lead creating comprehensive project documentation for AI assistants. Create a detailed claude.md configuration file for this VibePHX workshop project:

**PROJECT CONTEXT:**
- Project: {projectName}
- Tech Stack: {techStack}
- Core Features: {features}
- Development Timeline: Rapid prototyping and MVP development
- Team Context: AI-assisted development with focus on speed and quality

**CLAUDE.MD CONFIGURATION:**

# {projectName} - AI Assistant Configuration

## Project Overview

### Business Context
- **Purpose**: {projectName} built during VibePHX workshop
- **Target Users**: [Based on features and project scope]
- **Core Value Proposition**: [Primary benefit delivered to users]
- **Success Metrics**: Working MVP deployed within 6-8 hours
- **Technical Constraints**: Modern web stack, mobile-responsive, production-ready

### Development Philosophy
- **Speed vs. Perfection**: Prioritize working features over perfect code
- **User Experience**: Simple, intuitive interfaces that solve real problems
- **Code Quality**: Clean, readable code that can be maintained and extended
- **Documentation**: Self-documenting code with strategic comments for complex logic

## Technical Architecture

### Tech Stack Details
- **Frontend**: {techStack - frontend portion}
- **Backend**: {techStack - backend portion}
- **Database**: {techStack - database portion}
- **Deployment**: Production deployment on modern hosting platform
- **AI Services**: Integration with AI APIs for enhanced functionality (if applicable)

### Project Structure
\`\`\`
/
|-- app/                 # Next.js App Router (if applicable)
|-- components/          # Reusable UI components  
|-- lib/                # Utility functions and configurations
|-- public/             # Static assets
|-- types/              # TypeScript type definitions
|-- utils/              # Helper functions
\`-- README.md           # Project documentation
\`\`\`

### Architectural Patterns
- **Component Design**: Small, focused components with single responsibilities
- **State Management**: [Context API / Zustand / Redux based on stack]
- **API Design**: RESTful endpoints with consistent response formats
- **Database Access**: [ORM/Query Builder] with typed queries
- **Error Handling**: Graceful degradation with user-friendly error messages

## Coding Standards & Preferences

### TypeScript Guidelines
- **Type Safety**: Prefer explicit types over \`any\`
- **Interface Design**: Use interfaces for object shapes, types for unions/primitives
- **Generic Usage**: Leverage generics for reusable components and functions
- **Null Safety**: Handle null/undefined explicitly with optional chaining

### React/Frontend Patterns
- **Component Organization**: One component per file, co-located with styles
- **Hook Usage**: Custom hooks for reusable stateful logic
- **Event Handling**: Inline handlers for simple logic, separate functions for complex
- **Styling**: [Tailwind/CSS Modules/Styled Components based on stack] with consistent patterns
- **Performance**: useMemo/useCallback for expensive operations, avoid premature optimization

### Backend/API Patterns
- **Route Organization**: Logical grouping by feature/entity
- **Validation**: Input validation at API boundaries with clear error messages
- **Authentication**: Secure by default, explicit permission checks
- **Database Queries**: Optimized queries with proper indexing considerations
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

### Component Structure Template
\`\`\`typescript
'use client' // If client component

import { useState } from 'react'
import type { ComponentProps } from './types'

interface Props {
  // Props interface
}

export default function ComponentName({ prop1, prop2 }: Props) {
  // State and hooks
  const [state, setState] = useState()
  
  // Event handlers
  const handleEvent = () => {
    // Implementation
  }
  
  // Render
  return (
    <div>
      {/* Component JSX */}
    </div>
  )
}
\`\`\`

## Common Patterns to Follow

### Data Fetching
- Use React Server Components for initial data loading when possible
- Client-side fetching with proper loading and error states
- Cache frequently accessed data appropriately
- Handle race conditions and cleanup properly

### Form Handling
- Controlled components with validation feedback
- Debounced validation for better UX
- Clear error messages with actionable guidance
- Proper accessibility attributes

### Error Handling
- Try/catch blocks around async operations
- User-friendly error messages (not technical stack traces)
- Graceful fallbacks when services are unavailable
- Logging for debugging without exposing sensitive data

### Performance Optimization
- Image optimization with proper alt text
- Code splitting at route level
- Database query optimization
- Minimal bundle size with tree shaking

## Do's and Don'ts

### ✅ DO
- Write self-documenting code with clear variable names
- Handle edge cases and error states explicitly
- Use TypeScript strictly without \`any\` types
- Test critical user flows manually before considering complete
- Optimize for mobile experience from the start
- Follow accessibility best practices (semantic HTML, keyboard navigation)
- Keep components small and focused on single responsibility
- Use environment variables for configuration and secrets

### ❌ DON'T
- Expose API keys or sensitive data in client-side code
- Create deeply nested component hierarchies
- Ignore TypeScript errors or use \`@ts-ignore\` without justification
- Implement complex state management for simple applications
- Skip input validation on both client and server sides
- Hardcode URLs, API endpoints, or configuration values
- Use deprecated React patterns (class components, old lifecycle methods)
- Commit console.log statements or debugging code to version control

## Testing Approach

### Testing Strategy
- **Manual Testing**: Primary approach for rapid MVP development
- **Unit Testing**: Focus on utility functions and complex business logic
- **Integration Testing**: Test API endpoints and database interactions
- **E2E Testing**: Critical user flows only, if time permits

### Testing Tools
- Jest for unit testing (if implemented)
- Testing Library for component testing
- Postman/Insomnia for API testing during development
- Browser dev tools for performance and accessibility testing

## Deployment Considerations

### Environment Configuration
- Separate development, staging, and production configurations
- Environment variables for all external service configurations
- Proper secret management (never commit secrets to git)
- Database migrations and seeding strategy

### Performance & Security
- HTTPS enforcement in production
- Proper CORS configuration
- Rate limiting for public APIs
- Database connection pooling and optimization
- Asset optimization and CDN usage

### Monitoring & Maintenance
- Error tracking and logging setup
- Performance monitoring for critical paths
- Health checks for external dependencies
- Backup and disaster recovery planning

## AI Assistant Guidelines

When working on this project, please:

1. **Understand Context**: Always consider the business goals and user needs
2. **Follow Patterns**: Use the established patterns and conventions consistently
3. **Prioritize**: Focus on core functionality over nice-to-have features
4. **Be Explicit**: Ask for clarification when requirements are ambiguous
5. **Think Holistically**: Consider impacts on other parts of the system
6. **Document Decisions**: Explain complex logic and architectural choices
7. **Stay Updated**: Keep dependencies and patterns current with best practices

## Project-Specific Notes

### Feature Implementation Priority
1. [Core feature based on project scope]
2. [Secondary features in order of importance]
3. [Nice-to-have features if time permits]

### Known Limitations & Trade-offs
- [Document any intentional technical debt or simplifications]
- [Areas that might need refactoring as the project scales]
- [Features intentionally left simple for MVP timeline]

### Future Considerations
- [Scalability improvements for growing user base]
- [Additional features on the roadmap]
- [Technical improvements planned for future iterations]

---

**Last Updated**: [Current Date]
**Project Phase**: MVP Development
**Team**: VibePHX Workshop Participant(s)`,

  cursorRules: `<thinking>
I need to create a .cursorrules file that will optimize Cursor's AI assistance for this specific project. This should include:

1. Code style preferences that match the tech stack
2. Framework-specific patterns and conventions
3. File organization standards
4. Import/export patterns
5. Error handling approaches
6. Testing and debugging preferences
7. Git workflow standards

The rules should be specific enough to guide Cursor effectively but flexible enough to allow for good development practices.
</thinking>

You are a senior developer experience engineer specializing in AI-assisted development workflows. Create a comprehensive .cursorrules configuration file for this VibePHX workshop project:

**PROJECT CONTEXT:**
- Project: {projectName}
- Tech Stack: {techStack}
- Development Style: Rapid prototyping with production quality
- AI Tools: Cursor IDE with Claude integration
- Timeline: MVP development in 6-8 hours

**CURSOR RULES CONFIGURATION:**

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
- Use React.memo() only when performance testing shows it's needed

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
- Leverage parallel routes and intercepting routes when beneficial
- Implement proper error boundaries with error.tsx files

### Database & API Patterns
- Use Zod schemas for API validation
- Implement consistent error handling with try/catch blocks
- Return proper HTTP status codes (200, 201, 400, 404, 500)
- Use typed database queries with proper TypeScript integration
- Implement connection pooling for database connections

### State Management
- Use React's built-in state management (useState, useContext) for simple state
- Implement custom hooks for complex state logic
- Use useCallback and useMemo judiciously (only when performance testing shows benefit)
- Prefer prop drilling over complex state management for small applications

## Component Patterns

### Component Structure Template
\`\`\`typescript
'use client' // Only if client-side features needed

import { useState } from 'react'
import type { ComponentProps } from 'react'

interface Props {
  title: string
  onAction?: () => void
  className?: string
}

export function ComponentName({ title, onAction, className }: Props) {
  const [loading, setLoading] = useState(false)
  
  const handleAction = async () => {
    if (!onAction) return
    
    setLoading(true)
    try {
      await onAction()
    } catch (error) {
      console.error('Action failed:', error)
      // Handle error appropriately
    } finally {
      setLoading(false)
    }
  }
  
  return (
    <div className={clsx('base-styles', className)}>
      <h2>{title}</h2>
      <button onClick={handleAction} disabled={loading}>
        {loading ? 'Loading...' : 'Action'}
      </button>
    </div>
  )
}
\`\`\`

### Form Handling Pattern
\`\`\`typescript
const [formData, setFormData] = useState({ name: '', email: '' })
const [errors, setErrors] = useState({})
const [submitting, setSubmitting] = useState(false)

const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault()
  setSubmitting(true)
  setErrors({})
  
  try {
    // Validate and submit
    const result = await submitForm(formData)
    // Handle success
  } catch (error) {
    if (error instanceof ValidationError) {
      setErrors(error.fieldErrors)
    } else {
      // Handle other errors
    }
  } finally {
    setSubmitting(false)
  }
}
\`\`\`

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

### Database Error Handling
\`\`\`typescript
try {
  const user = await db.user.findUnique({ where: { id } })
  if (!user) {
    return { error: 'User not found', status: 404 }
  }
  return { user, status: 200 }
} catch (error) {
  console.error('Database query failed:', error)
  return { error: 'Internal server error', status: 500 }
}
\`\`\`

## Performance Guidelines

### Optimization Priorities
1. Avoid premature optimization - measure first
2. Optimize images with Next.js Image component
3. Use dynamic imports for large components
4. Implement proper caching strategies
5. Minimize bundle size with tree shaking

### Database Performance
- Use database indexes for frequently queried fields
- Implement pagination for large data sets
- Use database connection pooling
- Avoid N+1 query problems with proper includes/joins

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

## Testing Approach

### Manual Testing Priority
- Test all user flows manually before considering complete
- Test on mobile devices and different screen sizes
- Verify accessibility with keyboard navigation
- Test error conditions and edge cases
- Validate form submissions and data persistence

### Automated Testing (if implemented)
- Unit tests for utility functions and complex logic
- Integration tests for API endpoints
- Component tests for critical UI components
- E2E tests for complete user workflows (time permitting)

## Git Workflow

### Commit Message Format
\`\`\`
type(scope): brief description

Longer description if needed

Types: feat, fix, docs, style, refactor, test, chore
Scopes: api, ui, db, auth, deploy

Examples:
feat(api): add user authentication endpoints
fix(ui): resolve mobile navigation menu issue
refactor(db): optimize user query performance
\`\`\`

### Branch Naming
- feature/feature-name
- fix/bug-description
- refactor/component-name
- docs/update-readme

## Development Workflow

### Before Writing Code
1. Understand the business requirement clearly
2. Consider the user experience and edge cases
3. Plan the component/API structure
4. Consider error handling and loading states
5. Think about mobile responsiveness

### Code Review Checklist
- [ ] TypeScript strict mode compliance
- [ ] Proper error handling implemented
- [ ] Mobile responsiveness considered
- [ ] Accessibility attributes added
- [ ] Loading and error states implemented
- [ ] Environment variables used for configuration
- [ ] No hardcoded values or API keys
- [ ] Consistent naming conventions followed

### Debugging Preferences
- Use console.log sparingly and remove before committing
- Prefer TypeScript errors over runtime errors
- Use browser dev tools for performance analysis
- Implement proper error boundaries for React components
- Use database query logging in development

## AI Assistant Guidelines

When using Cursor's AI assistance:

1. **Be Specific**: Provide context about the current feature being built
2. **Ask for Patterns**: Request code that follows the established patterns
3. **Consider Edge Cases**: Ask the AI to consider error handling and edge cases
4. **Request Tests**: Ask for both manual testing steps and automated tests when applicable
5. **Optimize for Readability**: Prioritize code that other developers can understand
6. **Follow Standards**: Ensure all generated code follows the project's established conventions

## Common Patterns to Avoid

- Don't use class components (prefer functional components with hooks)
- Avoid deeply nested ternary operators (use early returns or separate variables)
- Don't ignore TypeScript errors or use @ts-ignore without justification
- Avoid inline styles (use CSS classes or styled-components)
- Don't hardcode API endpoints or configuration values
- Avoid complex state management libraries for simple applications
- Don't skip input validation on both client and server
- Avoid exposing sensitive data in client-side code

## Project-Specific Considerations

### Performance Targets
- Page load time under 3 seconds
- Time to interactive under 5 seconds
- Lighthouse score above 90 for performance
- Mobile-first responsive design

### Browser Support
- Modern evergreen browsers (Chrome, Firefox, Safari, Edge)
- Mobile Safari and Chrome on iOS/Android
- Graceful degradation for older browsers

### Deployment Considerations
- Environment-specific configuration
- Database migration strategy
- Asset optimization and CDN usage
- Error monitoring and logging setup

---

**Last Updated**: [Current Date]
**Project Phase**: MVP Development
**Cursor Version**: Latest stable release`
}

export async function POST(req: NextRequest) {
  try {
    console.log('OpenRouter API Key exists:', !!process.env.OPENROUTER_API_KEY)
    console.log('API Key length:', process.env.OPENROUTER_API_KEY?.length || 0)
    
    const { projectData, documentType } = await req.json()

    const template = DOCUMENT_TEMPLATES[documentType as keyof typeof DOCUMENT_TEMPLATES]
    if (!template) {
      return Response.json({ error: 'Invalid document type' }, { status: 400 })
    }

    // Prepare context for the template
    const projectName = projectData.template || 'Custom Project'
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

    console.log('Calling OpenRouter API with model: openai/gpt-5')
    console.log('Base URL:', 'https://openrouter.ai/api/v1/chat/completions')
    console.log('API Key prefix:', process.env.OPENROUTER_API_KEY?.substring(0, 10) + '...')
    
    // Make direct API call to OpenRouter with enhanced model
    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
        'HTTP-Referer': process.env.OPENROUTER_SITE_URL || 'http://localhost:3006',
        'X-Title': process.env.OPENROUTER_SITE_NAME || 'VibePHX AI Builder',
      },
      body: JSON.stringify({
        model: 'openai/gpt-5',
        messages: [
          {
            role: 'user',
            content: `${prompt}

Additional Context:
- This is for VibePHX, a one-day AI-assisted app building workshop
- Focus on practical, achievable outcomes
- Include specific examples and code snippets where helpful
- Assume the builder is a beginner-intermediate developer
- Prioritize speed and functionality over perfection

Generate a comprehensive, well-structured document in Markdown format.`
          }
        ]
      })
    })

    if (!response.ok) {
      throw new Error(`OpenRouter API error: ${response.status} ${response.statusText}`)
    }

    const data = await response.json()
    console.log('Raw OpenRouter response:', data)
    
    // Extract the content from the response
    const content = data.choices[0]?.message?.content
    if (!content) {
      throw new Error('No content in OpenRouter response')
    }

    console.log('Successfully generated document from OpenRouter')
    return Response.json({ content })
  } catch (error) {
    console.error('Generation error:', error)
    return Response.json(
      { error: 'Failed to generate document' },
      { status: 500 }
    )
  }
}

export const runtime = 'edge'