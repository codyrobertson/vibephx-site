/**
 * Detailed information about each technology in the stack
 * Used for the interactive tech stack detail sheets
 */

export interface TechDetail {
  id: string
  name: string
  logo: string
  category: 'editor' | 'ui' | 'hosting' | 'database' | 'integration'
  description: string
  whatItIs: string
  howItsUsed: string[]
  links: {
    label: string
    url: string
  }[]
  tags: string[]
}

export const techStackDetails: Record<string, TechDetail> = {
  // Editors/AI Tools
  'v0': {
    id: 'v0',
    name: 'V0 by Vercel',
    logo: 'https://v0.dev/favicon.ico',
    category: 'editor',
    description: 'AI-powered frontend code generation',
    whatItIs: 'V0 is Vercel\'s AI tool that generates React components and Next.js code from text prompts. It uses Shadcn UI components and Tailwind CSS.',
    howItsUsed: [
      'Generate UI components from descriptions',
      'Create layouts and page structures',
      'Rapid prototyping of interfaces',
      'Export production-ready code'
    ],
    links: [
      { label: 'V0 Documentation', url: 'https://v0.dev/docs' },
      { label: 'Getting Started', url: 'https://v0.dev/docs/getting-started' },
      { label: 'Shadcn UI Components', url: 'https://ui.shadcn.com' }
    ],
    tags: ['AI', 'Code Generation', 'React', 'Next.js']
  },
  'cursor': {
    id: 'cursor',
    name: 'Cursor',
    logo: 'https://cursor.com/favicon.ico',
    category: 'editor',
    description: 'AI-first code editor',
    whatItIs: 'Cursor is an AI-powered code editor built on VS Code that provides intelligent code completion, generation, and editing capabilities.',
    howItsUsed: [
      'Write code with AI assistance',
      'Refactor and improve existing code',
      'Debug issues with AI help',
      'Learn codebase through AI chat'
    ],
    links: [
      { label: 'Cursor Homepage', url: 'https://cursor.com' },
      { label: 'Documentation', url: 'https://cursor.com/docs' },
      { label: 'Keyboard Shortcuts', url: 'https://cursor.com/docs/shortcuts' }
    ],
    tags: ['AI', 'IDE', 'Code Editor', 'VS Code']
  },

  // UI Frameworks
  'shadcn': {
    id: 'shadcn',
    name: 'Shadcn UI',
    logo: 'https://ui.shadcn.com/favicon.ico',
    category: 'ui',
    description: 'Beautifully designed components built with Radix UI and Tailwind CSS',
    whatItIs: 'Shadcn UI is a collection of re-usable components that you can copy and paste into your apps. Built using Radix UI and Tailwind CSS.',
    howItsUsed: [
      'Build accessible UI components',
      'Customize components with Tailwind',
      'Maintain consistent design system',
      'Use pre-built complex components (dialogs, dropdowns, etc.)'
    ],
    links: [
      { label: 'Shadcn UI Docs', url: 'https://ui.shadcn.com' },
      { label: 'Component Library', url: 'https://ui.shadcn.com/docs/components/accordion' },
      { label: 'Installation Guide', url: 'https://ui.shadcn.com/docs/installation' }
    ],
    tags: ['UI', 'Components', 'React', 'Tailwind', 'Accessibility']
  },
  'shadcn/ui': {
    id: 'shadcn/ui',
    name: 'Shadcn UI',
    logo: 'https://ui.shadcn.com/favicon.ico',
    category: 'ui',
    description: 'Beautifully designed components built with Radix UI and Tailwind CSS',
    whatItIs: 'Shadcn UI is a collection of re-usable components that you can copy and paste into your apps. Built using Radix UI and Tailwind CSS.',
    howItsUsed: [
      'Build accessible UI components',
      'Customize components with Tailwind',
      'Maintain consistent design system',
      'Use pre-built complex components (dialogs, dropdowns, etc.)'
    ],
    links: [
      { label: 'Shadcn UI Docs', url: 'https://ui.shadcn.com' },
      { label: 'Component Library', url: 'https://ui.shadcn.com/docs/components/accordion' },
      { label: 'Installation Guide', url: 'https://ui.shadcn.com/docs/installation' }
    ],
    tags: ['UI', 'Components', 'React', 'Tailwind', 'Accessibility']
  },
  'v0 + shadcn/ui': {
    id: 'v0 + shadcn/ui',
    name: 'V0 + Shadcn UI',
    logo: 'https://ui.shadcn.com/favicon.ico',
    category: 'ui',
    description: 'Combined AI code generation with beautiful component library',
    whatItIs: 'A powerful combination of V0\'s AI code generation and Shadcn UI\'s component library, allowing you to generate and customize beautiful, accessible components.',
    howItsUsed: [
      'Generate UI components with V0',
      'Customize generated components with Shadcn UI',
      'Maintain design consistency',
      'Build accessible interfaces rapidly'
    ],
    links: [
      { label: 'V0 Documentation', url: 'https://v0.dev/docs' },
      { label: 'Shadcn UI Docs', url: 'https://ui.shadcn.com' },
      { label: 'Component Library', url: 'https://ui.shadcn.com/docs/components' }
    ],
    tags: ['UI', 'Components', 'React', 'AI', 'Code Generation']
  },
  'magicui': {
    id: 'magicui',
    name: 'Magic UI',
    logo: 'https://magicui.design/favicon.ico',
    category: 'ui',
    description: 'Beautiful animated components',
    whatItIs: 'Magic UI provides animated React components with smooth transitions and interactions, built on top of Framer Motion.',
    howItsUsed: [
      'Add animations to components',
      'Create engaging user interfaces',
      'Build interactive elements',
      'Enhance user experience with motion'
    ],
    links: [
      { label: 'Magic UI Homepage', url: 'https://magicui.design' },
      { label: 'Component Gallery', url: 'https://magicui.design/docs/components' }
    ],
    tags: ['UI', 'Animation', 'React', 'Framer Motion']
  },

  // Hosting Providers
  'vercel': {
    id: 'vercel',
    name: 'Vercel',
    logo: 'https://assets.vercel.com/image/upload/front/favicon/vercel/favicon.ico',
    category: 'hosting',
    description: 'Platform for frontend frameworks and static sites',
    whatItIs: 'Vercel is a cloud platform for deploying and hosting web applications, with built-in CI/CD, edge functions, and serverless API routes.',
    howItsUsed: [
      'Deploy Next.js applications',
      'Host static frontend assets',
      'Run serverless functions',
      'Manage preview deployments',
      'Configure custom domains'
    ],
    links: [
      { label: 'Vercel Docs', url: 'https://vercel.com/docs' },
      { label: 'Next.js on Vercel', url: 'https://vercel.com/docs/frameworks/nextjs' },
      { label: 'CLI Reference', url: 'https://vercel.com/docs/cli' }
    ],
    tags: ['Hosting', 'Deployment', 'Serverless', 'Edge Functions']
  },
  'netlify': {
    id: 'netlify',
    name: 'Netlify',
    logo: 'https://www.netlify.com/favicon.ico',
    category: 'hosting',
    description: 'All-in-one platform for modern web projects',
    whatItIs: 'Netlify is a web development platform that offers hosting, serverless backend services, and automated workflows for modern static sites.',
    howItsUsed: [
      'Deploy static sites and SPAs',
      'Run serverless functions',
      'Handle form submissions',
      'Implement A/B testing',
      'Manage environment variables'
    ],
    links: [
      { label: 'Netlify Docs', url: 'https://docs.netlify.com' },
      { label: 'Functions', url: 'https://docs.netlify.com/functions/overview' },
      { label: 'Deploy Settings', url: 'https://docs.netlify.com/site-deploys/overview' }
    ],
    tags: ['Hosting', 'Serverless', 'Static Sites', 'CI/CD']
  },

  // Databases
  'neon': {
    id: 'neon',
    name: 'Neon',
    logo: 'https://neon.tech/favicon.ico',
    category: 'database',
    description: 'Serverless Postgres database',
    whatItIs: 'Neon is a fully managed serverless Postgres database with autoscaling, branching, and point-in-time recovery features.',
    howItsUsed: [
      'Store application data',
      'Run PostgreSQL queries',
      'Use database branching for testing',
      'Scale automatically with traffic',
      'Integrate with Prisma ORM'
    ],
    links: [
      { label: 'Neon Documentation', url: 'https://neon.tech/docs' },
      { label: 'Prisma + Neon', url: 'https://neon.tech/docs/guides/prisma' },
      { label: 'Connection String', url: 'https://neon.tech/docs/connect/connect-from-any-app' }
    ],
    tags: ['Database', 'PostgreSQL', 'Serverless', 'SQL']
  },
  'supabase': {
    id: 'supabase',
    name: 'Supabase',
    logo: 'https://supabase.com/favicon.ico',
    category: 'database',
    description: 'Open source Firebase alternative',
    whatItIs: 'Supabase is an open-source Backend-as-a-Service providing Postgres database, authentication, storage, and real-time subscriptions.',
    howItsUsed: [
      'Store and query data with Postgres',
      'Implement user authentication',
      'Upload and serve files',
      'Real-time data subscriptions',
      'Database migrations and backups'
    ],
    links: [
      { label: 'Supabase Docs', url: 'https://supabase.com/docs' },
      { label: 'JavaScript Client', url: 'https://supabase.com/docs/reference/javascript/introduction' },
      { label: 'Auth Guide', url: 'https://supabase.com/docs/guides/auth' }
    ],
    tags: ['Database', 'BaaS', 'PostgreSQL', 'Auth', 'Storage']
  },
  'supabase storage': {
    id: 'supabase storage',
    name: 'Supabase Storage',
    logo: 'https://supabase.com/favicon.ico',
    category: 'integration',
    description: 'File storage for Supabase projects',
    whatItIs: 'Supabase Storage is an S3-compatible object storage service that integrates seamlessly with Supabase projects for uploading and serving files.',
    howItsUsed: [
      'Upload user-generated files',
      'Store and serve images',
      'Manage file permissions with RLS',
      'Generate signed URLs for secure access',
      'Implement file versioning'
    ],
    links: [
      { label: 'Storage Docs', url: 'https://supabase.com/docs/guides/storage' },
      { label: 'JavaScript Client', url: 'https://supabase.com/docs/reference/javascript/storage' },
      { label: 'Storage API', url: 'https://supabase.com/docs/guides/storage/api' }
    ],
    tags: ['Storage', 'Files', 'S3', 'Assets', 'Supabase']
  },

  // Integrations
  'stripe': {
    id: 'stripe',
    name: 'Stripe',
    logo: 'https://stripe.com/favicon.ico',
    category: 'integration',
    description: 'Payment processing platform',
    whatItIs: 'Stripe is a complete payment infrastructure for the internet, handling payments, subscriptions, and financial operations.',
    howItsUsed: [
      'Accept credit card payments',
      'Manage subscriptions',
      'Handle webhooks for payment events',
      'Implement checkout flows',
      'Process refunds and disputes'
    ],
    links: [
      { label: 'Stripe API Docs', url: 'https://stripe.com/docs/api' },
      { label: 'Next.js Integration', url: 'https://stripe.com/docs/payments/quickstart' },
      { label: 'Webhooks Guide', url: 'https://stripe.com/docs/webhooks' }
    ],
    tags: ['Payments', 'Subscriptions', 'Finance', 'API']
  },
  'resend': {
    id: 'resend',
    name: 'Resend',
    logo: 'https://resend.com/favicon.ico',
    category: 'integration',
    description: 'Email API for developers',
    whatItIs: 'Resend is a modern email API designed for developers, with great developer experience and React email template support.',
    howItsUsed: [
      'Send transactional emails',
      'Design emails with React components',
      'Track email delivery',
      'Manage email templates',
      'Handle bounce and spam reports'
    ],
    links: [
      { label: 'Resend Docs', url: 'https://resend.com/docs' },
      { label: 'React Email', url: 'https://react.email' },
      { label: 'API Reference', url: 'https://resend.com/docs/api-reference/introduction' }
    ],
    tags: ['Email', 'Transactional', 'React', 'API']
  },
  'openai': {
    id: 'openai',
    name: 'OpenAI',
    logo: 'https://openai.com/favicon.ico',
    category: 'integration',
    description: 'AI and machine learning platform',
    whatItIs: 'OpenAI provides access to advanced AI models including GPT-4, DALL-E, and Whisper through a simple API.',
    howItsUsed: [
      'Generate AI-powered text responses',
      'Create embeddings for semantic search',
      'Generate images from text',
      'Transcribe and translate audio',
      'Build conversational AI experiences'
    ],
    links: [
      { label: 'OpenAI API Docs', url: 'https://platform.openai.com/docs' },
      { label: 'API Reference', url: 'https://platform.openai.com/docs/api-reference' },
      { label: 'Examples', url: 'https://platform.openai.com/examples' }
    ],
    tags: ['AI', 'GPT-4', 'Machine Learning', 'API']
  },
  'contentful': {
    id: 'contentful',
    name: 'Contentful',
    logo: 'https://www.contentful.com/favicon.ico',
    category: 'integration',
    description: 'Headless CMS platform',
    whatItIs: 'Contentful is a headless content management system that allows you to create, manage, and deliver content through APIs.',
    howItsUsed: [
      'Manage website content',
      'Create and edit content models',
      'Deliver content via API',
      'Support multi-language content',
      'Version control for content'
    ],
    links: [
      { label: 'Contentful Docs', url: 'https://www.contentful.com/developers/docs/' },
      { label: 'JavaScript SDK', url: 'https://www.contentful.com/developers/docs/javascript/' },
      { label: 'Content Delivery API', url: 'https://www.contentful.com/developers/docs/references/content-delivery-api/' }
    ],
    tags: ['CMS', 'Headless', 'Content', 'API']
  },
  'vercel analytics': {
    id: 'vercel analytics',
    name: 'Vercel Analytics',
    logo: 'https://assets.vercel.com/image/upload/front/favicon/vercel/favicon.ico',
    category: 'integration',
    description: 'Real-time web analytics',
    whatItIs: 'Vercel Analytics provides privacy-friendly, real-time analytics for your web applications with Core Web Vitals tracking.',
    howItsUsed: [
      'Track page views and visits',
      'Monitor Core Web Vitals',
      'Analyze user behavior',
      'View real-time performance metrics',
      'No cookie consent required'
    ],
    links: [
      { label: 'Vercel Analytics Docs', url: 'https://vercel.com/docs/analytics' },
      { label: 'Web Vitals', url: 'https://vercel.com/docs/analytics/web-vitals' },
      { label: 'Privacy', url: 'https://vercel.com/docs/analytics/privacy-policy' }
    ],
    tags: ['Analytics', 'Web Vitals', 'Performance', 'Privacy']
  },
  'next.js': {
    id: 'next.js',
    name: 'Next.js',
    logo: 'https://nextjs.org/favicon.ico',
    category: 'frontend',
    description: 'React framework for production',
    whatItIs: 'Next.js is a React framework that enables server-side rendering, static site generation, and provides an excellent developer experience with built-in routing and API routes.',
    howItsUsed: [
      'Build full-stack React applications',
      'Server-side rendering for SEO',
      'API routes for backend logic',
      'Static site generation',
      'Image optimization'
    ],
    links: [
      { label: 'Next.js Docs', url: 'https://nextjs.org/docs' },
      { label: 'Learn Next.js', url: 'https://nextjs.org/learn' },
      { label: 'Examples', url: 'https://github.com/vercel/next.js/tree/canary/examples' }
    ],
    tags: ['React', 'Framework', 'SSR', 'SSG', 'Full-stack']
  },
  'react': {
    id: 'react',
    name: 'React',
    logo: 'https://react.dev/favicon.ico',
    category: 'frontend',
    description: 'JavaScript library for building UIs',
    whatItIs: 'React is a declarative, component-based JavaScript library for building user interfaces, maintained by Meta and a community of developers.',
    howItsUsed: [
      'Build interactive user interfaces',
      'Create reusable components',
      'Manage application state',
      'Handle user events',
      'Build single-page applications'
    ],
    links: [
      { label: 'React Docs', url: 'https://react.dev' },
      { label: 'Learn React', url: 'https://react.dev/learn' },
      { label: 'API Reference', url: 'https://react.dev/reference/react' }
    ],
    tags: ['JavaScript', 'UI', 'Library', 'Components']
  },
  'tailwind': {
    id: 'tailwind',
    name: 'Tailwind CSS',
    logo: 'https://tailwindcss.com/favicon.ico',
    category: 'frontend',
    description: 'Utility-first CSS framework',
    whatItIs: 'Tailwind CSS is a utility-first CSS framework that provides low-level utility classes to build custom designs without writing CSS.',
    howItsUsed: [
      'Style components with utility classes',
      'Build responsive layouts',
      'Create custom design systems',
      'Dark mode support',
      'Component variants'
    ],
    links: [
      { label: 'Tailwind Docs', url: 'https://tailwindcss.com/docs' },
      { label: 'UI Components', url: 'https://tailwindui.com' },
      { label: 'Playground', url: 'https://play.tailwindcss.com' }
    ],
    tags: ['CSS', 'Styling', 'Utility', 'Design']
  },
  'shadcn ui': {
    id: 'shadcn ui',
    name: 'Shadcn UI',
    logo: 'https://ui.shadcn.com/favicon.ico',
    category: 'frontend',
    description: 'Beautifully designed components',
    whatItIs: 'Shadcn UI is a collection of re-usable components built with Radix UI and Tailwind CSS that you can copy and paste into your apps.',
    howItsUsed: [
      'Add pre-built UI components',
      'Customize component styles',
      'Build accessible interfaces',
      'Copy-paste components',
      'Theme customization'
    ],
    links: [
      { label: 'Shadcn UI Docs', url: 'https://ui.shadcn.com' },
      { label: 'Components', url: 'https://ui.shadcn.com/docs/components' },
      { label: 'Themes', url: 'https://ui.shadcn.com/themes' }
    ],
    tags: ['UI', 'Components', 'Radix', 'Tailwind', 'Accessible']
  },
  'vercel': {
    id: 'vercel',
    name: 'Vercel',
    logo: 'https://vercel.com/favicon.ico',
    category: 'deployment',
    description: 'Frontend cloud platform',
    whatItIs: 'Vercel is a cloud platform for static sites and serverless functions that integrates seamlessly with Next.js and other frameworks.',
    howItsUsed: [
      'Deploy frontend applications',
      'Host serverless functions',
      'Automatic HTTPS and CDN',
      'Preview deployments for PRs',
      'Edge network distribution'
    ],
    links: [
      { label: 'Vercel Docs', url: 'https://vercel.com/docs' },
      { label: 'Deployment', url: 'https://vercel.com/docs/deployments' },
      { label: 'Edge Functions', url: 'https://vercel.com/docs/functions/edge-functions' }
    ],
    tags: ['Deployment', 'Hosting', 'Serverless', 'CDN']
  },
  'v0': {
    id: 'v0',
    name: 'v0',
    logo: 'https://v0.dev/favicon.ico',
    category: 'editor',
    description: 'AI-powered UI generation',
    whatItIs: 'v0 is an AI-powered tool by Vercel that generates UI components from text descriptions using generative AI.',
    howItsUsed: [
      'Generate UI components from prompts',
      'Create React components',
      'Export Shadcn UI code',
      'Iterate on designs',
      'Rapid prototyping'
    ],
    links: [
      { label: 'v0.dev', url: 'https://v0.dev' },
      { label: 'Documentation', url: 'https://v0.dev/docs' }
    ],
    tags: ['AI', 'UI Generation', 'Components', 'Vercel']
  },
  'typescript': {
    id: 'typescript',
    name: 'TypeScript',
    logo: 'https://www.typescriptlang.org/favicon.ico',
    category: 'language',
    description: 'Typed superset of JavaScript',
    whatItIs: 'TypeScript is a strongly typed programming language that builds on JavaScript, giving you better tooling at any scale.',
    howItsUsed: [
      'Add static typing to JavaScript',
      'Catch errors at compile time',
      'Enhanced IDE support',
      'Better code documentation',
      'Refactoring with confidence'
    ],
    links: [
      { label: 'TypeScript Docs', url: 'https://www.typescriptlang.org/docs/' },
      { label: 'Handbook', url: 'https://www.typescriptlang.org/docs/handbook/intro.html' },
      { label: 'Playground', url: 'https://www.typescriptlang.org/play' }
    ],
    tags: ['Language', 'TypeScript', 'JavaScript', 'Static Typing']
  },
  'prisma': {
    id: 'prisma',
    name: 'Prisma',
    logo: 'https://www.prisma.io/favicon.ico',
    category: 'database',
    description: 'Next-generation ORM',
    whatItIs: 'Prisma is an open-source ORM that helps you query your database in an intuitive way with auto-completion and type safety.',
    howItsUsed: [
      'Define database schema',
      'Generate type-safe queries',
      'Database migrations',
      'Prisma Studio for data management',
      'Works with multiple databases'
    ],
    links: [
      { label: 'Prisma Docs', url: 'https://www.prisma.io/docs' },
      { label: 'Getting Started', url: 'https://www.prisma.io/docs/getting-started' },
      { label: 'Data Model', url: 'https://www.prisma.io/docs/concepts/components/prisma-schema/data-model' }
    ],
    tags: ['ORM', 'Database', 'TypeScript', 'Migrations']
  },
  'postgresql': {
    id: 'postgresql',
    name: 'PostgreSQL',
    logo: 'https://www.postgresql.org/favicon.ico',
    category: 'database',
    description: 'Advanced open-source database',
    whatItIs: 'PostgreSQL is a powerful, open-source object-relational database system with over 35 years of active development.',
    howItsUsed: [
      'Store relational data',
      'Complex queries and joins',
      'ACID compliance',
      'JSON/JSONB support',
      'Full-text search'
    ],
    links: [
      { label: 'PostgreSQL Docs', url: 'https://www.postgresql.org/docs/' },
      { label: 'Tutorial', url: 'https://www.postgresql.org/docs/current/tutorial.html' },
      { label: 'SQL Commands', url: 'https://www.postgresql.org/docs/current/sql-commands.html' }
    ],
    tags: ['Database', 'SQL', 'Relational', 'Open Source']
  },
  'supabase': {
    id: 'supabase',
    name: 'Supabase',
    logo: 'https://supabase.com/favicon.ico',
    category: 'database',
    description: 'Open-source Firebase alternative',
    whatItIs: 'Supabase is an open-source Firebase alternative providing Postgres database, authentication, instant APIs, and real-time subscriptions.',
    howItsUsed: [
      'PostgreSQL database hosting',
      'Auto-generated REST APIs',
      'Real-time subscriptions',
      'Authentication and authorization',
      'Storage for files'
    ],
    links: [
      { label: 'Supabase Docs', url: 'https://supabase.com/docs' },
      { label: 'Database', url: 'https://supabase.com/docs/guides/database' },
      { label: 'Auth', url: 'https://supabase.com/docs/guides/auth' }
    ],
    tags: ['Database', 'Backend', 'BaaS', 'PostgreSQL', 'Real-time']
  },
  'stripe': {
    id: 'stripe',
    name: 'Stripe',
    logo: 'https://stripe.com/favicon.ico',
    category: 'integration',
    description: 'Payment processing platform',
    whatItIs: 'Stripe is a technology company that builds economic infrastructure for the internet, enabling online payment processing.',
    howItsUsed: [
      'Accept credit card payments',
      'Subscription billing',
      'Payment links',
      'Checkout sessions',
      'Webhook event handling'
    ],
    links: [
      { label: 'Stripe Docs', url: 'https://stripe.com/docs' },
      { label: 'API Reference', url: 'https://stripe.com/docs/api' },
      { label: 'Webhooks', url: 'https://stripe.com/docs/webhooks' }
    ],
    tags: ['Payments', 'Billing', 'Subscriptions', 'E-commerce']
  },
  'clerk': {
    id: 'clerk',
    name: 'Clerk',
    logo: 'https://clerk.com/favicon.ico',
    category: 'integration',
    description: 'Authentication and user management',
    whatItIs: 'Clerk is a complete authentication and user management solution with pre-built UI components and powerful APIs.',
    howItsUsed: [
      'User authentication',
      'Social login integration',
      'Multi-factor authentication',
      'User profiles',
      'Session management'
    ],
    links: [
      { label: 'Clerk Docs', url: 'https://clerk.com/docs' },
      { label: 'Next.js Integration', url: 'https://clerk.com/docs/nextjs/overview' },
      { label: 'Components', url: 'https://clerk.com/docs/components/overview' }
    ],
    tags: ['Auth', 'Authentication', 'Users', 'Session']
  },
  'auth0': {
    id: 'auth0',
    name: 'Auth0',
    logo: 'https://auth0.com/favicon.ico',
    category: 'integration',
    description: 'Identity platform',
    whatItIs: 'Auth0 is a flexible, drop-in solution to add authentication and authorization services to your applications.',
    howItsUsed: [
      'Universal login',
      'Social connections',
      'Enterprise federation',
      'Multi-factor authentication',
      'User management'
    ],
    links: [
      { label: 'Auth0 Docs', url: 'https://auth0.com/docs' },
      { label: 'Quickstarts', url: 'https://auth0.com/docs/quickstarts' },
      { label: 'API Reference', url: 'https://auth0.com/docs/api' }
    ],
    tags: ['Auth', 'Identity', 'SSO', 'Security']
  },
  'firebase': {
    id: 'firebase',
    name: 'Firebase',
    logo: 'https://firebase.google.com/favicon.ico',
    category: 'database',
    description: 'Google app development platform',
    whatItIs: 'Firebase is Google\'s mobile and web application development platform with services like authentication, database, storage, and hosting.',
    howItsUsed: [
      'Real-time database',
      'Cloud Firestore',
      'Authentication',
      'Cloud storage',
      'Hosting and functions'
    ],
    links: [
      { label: 'Firebase Docs', url: 'https://firebase.google.com/docs' },
      { label: 'Firestore', url: 'https://firebase.google.com/docs/firestore' },
      { label: 'Auth', url: 'https://firebase.google.com/docs/auth' }
    ],
    tags: ['BaaS', 'Database', 'Real-time', 'Google']
  },
  'mongodb': {
    id: 'mongodb',
    name: 'MongoDB',
    logo: 'https://www.mongodb.com/favicon.ico',
    category: 'database',
    description: 'NoSQL document database',
    whatItIs: 'MongoDB is a source-available cross-platform document-oriented database program, classified as a NoSQL database.',
    howItsUsed: [
      'Store JSON-like documents',
      'Flexible schema design',
      'Horizontal scaling',
      'Aggregation pipelines',
      'Full-text search'
    ],
    links: [
      { label: 'MongoDB Docs', url: 'https://docs.mongodb.com/' },
      { label: 'Node.js Driver', url: 'https://docs.mongodb.com/drivers/node/' },
      { label: 'Query Guide', url: 'https://docs.mongodb.com/manual/tutorial/query-documents/' }
    ],
    tags: ['Database', 'NoSQL', 'Document', 'JSON']
  },
  'planetscale': {
    id: 'planetscale',
    name: 'PlanetScale',
    logo: 'https://planetscale.com/favicon.ico',
    category: 'database',
    description: 'MySQL-compatible serverless database',
    whatItIs: 'PlanetScale is a MySQL-compatible serverless database platform with database branching and non-blocking schema changes.',
    howItsUsed: [
      'Serverless MySQL database',
      'Database branching',
      'Non-blocking schema changes',
      'Automatic backups',
      'Horizontal sharding'
    ],
    links: [
      { label: 'PlanetScale Docs', url: 'https://planetscale.com/docs' },
      { label: 'Prisma Integration', url: 'https://planetscale.com/docs/prisma/prisma-quickstart' },
      { label: 'Branching', url: 'https://planetscale.com/docs/concepts/branching' }
    ],
    tags: ['Database', 'MySQL', 'Serverless', 'Branching']
  },
  'redis': {
    id: 'redis',
    name: 'Redis',
    logo: 'https://redis.io/favicon.ico',
    category: 'database',
    description: 'In-memory data store',
    whatItIs: 'Redis is an open-source, in-memory data structure store used as a database, cache, message broker, and streaming engine.',
    howItsUsed: [
      'Caching layer',
      'Session storage',
      'Real-time analytics',
      'Message queues',
      'Rate limiting'
    ],
    links: [
      { label: 'Redis Docs', url: 'https://redis.io/docs/' },
      { label: 'Commands', url: 'https://redis.io/commands/' },
      { label: 'Data Types', url: 'https://redis.io/docs/data-types/' }
    ],
    tags: ['Cache', 'In-memory', 'Key-value', 'Performance']
  },
  'aws': {
    id: 'aws',
    name: 'AWS',
    logo: 'https://aws.amazon.com/favicon.ico',
    category: 'deployment',
    description: 'Amazon Web Services cloud platform',
    whatItIs: 'AWS is Amazon\'s comprehensive cloud computing platform offering compute, storage, database, and other services.',
    howItsUsed: [
      'Host applications (EC2)',
      'Object storage (S3)',
      'Serverless functions (Lambda)',
      'Content delivery (CloudFront)',
      'Database services (RDS)'
    ],
    links: [
      { label: 'AWS Docs', url: 'https://docs.aws.amazon.com/' },
      { label: 'Getting Started', url: 'https://aws.amazon.com/getting-started/' },
      { label: 'Lambda', url: 'https://docs.aws.amazon.com/lambda/' }
    ],
    tags: ['Cloud', 'Infrastructure', 'Serverless', 'Hosting']
  },
  'cloudflare': {
    id: 'cloudflare',
    name: 'Cloudflare',
    logo: 'https://www.cloudflare.com/favicon.ico',
    category: 'deployment',
    description: 'Web infrastructure and security',
    whatItIs: 'Cloudflare provides CDN, DDoS protection, DNS, and serverless computing at the edge of the network.',
    howItsUsed: [
      'Content delivery network',
      'DDoS protection',
      'DNS management',
      'Workers (edge functions)',
      'Pages (static hosting)'
    ],
    links: [
      { label: 'Cloudflare Docs', url: 'https://developers.cloudflare.com/' },
      { label: 'Workers', url: 'https://developers.cloudflare.com/workers/' },
      { label: 'Pages', url: 'https://developers.cloudflare.com/pages/' }
    ],
    tags: ['CDN', 'Security', 'Edge', 'DNS']
  },
  'github': {
    id: 'github',
    name: 'GitHub',
    logo: 'https://github.com/favicon.ico',
    category: 'editor',
    description: 'Code hosting platform',
    whatItIs: 'GitHub is a code hosting platform for version control and collaboration using Git.',
    howItsUsed: [
      'Version control',
      'Code collaboration',
      'Pull requests',
      'CI/CD with Actions',
      'Project management'
    ],
    links: [
      { label: 'GitHub Docs', url: 'https://docs.github.com/' },
      { label: 'Actions', url: 'https://docs.github.com/en/actions' },
      { label: 'CLI', url: 'https://cli.github.com/' }
    ],
    tags: ['Git', 'Version Control', 'Collaboration', 'CI/CD']
  },
  'docker': {
    id: 'docker',
    name: 'Docker',
    logo: 'https://www.docker.com/favicon.ico',
    category: 'deployment',
    description: 'Container platform',
    whatItIs: 'Docker is a platform for developing, shipping, and running applications in containers.',
    howItsUsed: [
      'Containerize applications',
      'Consistent environments',
      'Docker Compose for multi-container',
      'Image building',
      'Container orchestration'
    ],
    links: [
      { label: 'Docker Docs', url: 'https://docs.docker.com/' },
      { label: 'Getting Started', url: 'https://docs.docker.com/get-started/' },
      { label: 'Dockerfile Reference', url: 'https://docs.docker.com/engine/reference/builder/' }
    ],
    tags: ['Containers', 'DevOps', 'Deployment']
  },
  'twilio': {
    id: 'twilio',
    name: 'Twilio',
    logo: 'https://www.twilio.com/favicon.ico',
    category: 'integration',
    description: 'Communications platform',
    whatItIs: 'Twilio provides APIs for SMS, voice, video, and messaging to build communication features into applications.',
    howItsUsed: [
      'Send SMS messages',
      'Voice calls',
      'Video conferencing',
      'WhatsApp messaging',
      'Two-factor authentication'
    ],
    links: [
      { label: 'Twilio Docs', url: 'https://www.twilio.com/docs' },
      { label: 'SMS Quickstart', url: 'https://www.twilio.com/docs/sms/quickstart' },
      { label: 'API Reference', url: 'https://www.twilio.com/docs/api' }
    ],
    tags: ['SMS', 'Voice', 'Communications', '2FA']
  },
  'sendgrid': {
    id: 'sendgrid',
    name: 'SendGrid',
    logo: 'https://sendgrid.com/favicon.ico',
    category: 'integration',
    description: 'Email delivery platform',
    whatItIs: 'SendGrid is a cloud-based email delivery platform for transactional and marketing emails.',
    howItsUsed: [
      'Send transactional emails',
      'Email templates',
      'Email analytics',
      'Marketing campaigns',
      'Webhook events'
    ],
    links: [
      { label: 'SendGrid Docs', url: 'https://docs.sendgrid.com/' },
      { label: 'API Reference', url: 'https://docs.sendgrid.com/api-reference' },
      { label: 'Templates', url: 'https://docs.sendgrid.com/ui/sending-email/how-to-send-an-email-with-dynamic-templates' }
    ],
    tags: ['Email', 'Transactional', 'Marketing']
  },
  'sentry': {
    id: 'sentry',
    name: 'Sentry',
    logo: 'https://sentry.io/favicon.ico',
    category: 'integration',
    description: 'Error tracking platform',
    whatItIs: 'Sentry is an error tracking and performance monitoring platform that helps developers monitor and fix crashes in real time.',
    howItsUsed: [
      'Track application errors',
      'Performance monitoring',
      'Release tracking',
      'User feedback',
      'Source map support'
    ],
    links: [
      { label: 'Sentry Docs', url: 'https://docs.sentry.io/' },
      { label: 'JavaScript', url: 'https://docs.sentry.io/platforms/javascript/' },
      { label: 'Performance', url: 'https://docs.sentry.io/product/performance/' }
    ],
    tags: ['Monitoring', 'Errors', 'Performance', 'APM']
  },
  'posthog': {
    id: 'posthog',
    name: 'PostHog',
    logo: 'https://posthog.com/favicon.ico',
    category: 'integration',
    description: 'Product analytics platform',
    whatItIs: 'PostHog is an open-source product analytics platform with session recording, feature flags, and A/B testing.',
    howItsUsed: [
      'Product analytics',
      'Session recordings',
      'Feature flags',
      'A/B testing',
      'User funnels'
    ],
    links: [
      { label: 'PostHog Docs', url: 'https://posthog.com/docs' },
      { label: 'JavaScript SDK', url: 'https://posthog.com/docs/integrate/client/js' },
      { label: 'Feature Flags', url: 'https://posthog.com/docs/feature-flags' }
    ],
    tags: ['Analytics', 'Product', 'Feature Flags', 'A/B Testing']
  }
}

/**
 * Get tech details by ID (case-insensitive)
 */
export function getTechDetail(id: string): TechDetail | null {
  const normalizedId = id.toLowerCase().trim()
  return techStackDetails[normalizedId] || null
}

/**
 * Search tech details by name or tags
 */
export function searchTechDetails(query: string): TechDetail[] {
  const lowerQuery = query.toLowerCase()
  return Object.values(techStackDetails).filter(tech =>
    tech.name.toLowerCase().includes(lowerQuery) ||
    tech.description.toLowerCase().includes(lowerQuery) ||
    tech.tags.some(tag => tag.toLowerCase().includes(lowerQuery))
  )
}

/**
 * Get all tech details by category
 */
export function getTechDetailsByCategory(category: TechDetail['category']): TechDetail[] {
  return Object.values(techStackDetails).filter(tech => tech.category === category)
}
