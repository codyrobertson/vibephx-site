export interface Integration {
  id: string
  title: string
  description: string
  logo: string
  category: string
  priority: number
  keywords: string[]
  showForBeginner?: boolean
  hideForBeginner?: boolean
  compatibleDb?: string[]
  compatibleHosting?: string[]
  compatibleWith?: string[]
}

export const integrations: Integration[] = [
  // Authentication
  {
    id: 'auth',
    title: 'Auth',
    description: 'Accounts and secure sessions',
    logo: 'auth0.com',
    category: 'auth',
    priority: 4,
    keywords: ['auth', 'login', 'signup', 'session'],
    showForBeginner: true
  },
  {
    id: 'clerk',
    title: 'Clerk',
    description: 'Drop-in authentication with user management UI',
    logo: 'clerk.com',
    category: 'auth',
    priority: 1,
    keywords: ['auth', 'login', 'signup', 'session'],
    compatibleWith: ['vercel', 'netlify']
  },
  {
    id: 'supabase_auth',
    title: 'Supabase Auth',
    description: 'Email magic links and OAuth with RLS',
    logo: 'supabase.com',
    category: 'auth',
    priority: 2,
    keywords: ['auth', 'login', 'signup'],
    compatibleDb: ['supabase']
  },
  {
    id: 'auth0',
    title: 'Auth0',
    description: 'Enterprise authentication and authorization platform',
    logo: 'auth0.com',
    category: 'auth',
    priority: 3,
    keywords: ['auth', 'login', 'enterprise']
  },

  // Storage
  {
    id: 'supabase_storage',
    title: 'Supabase Storage',
    description: 'Buckets for files and public assets',
    logo: 'supabase.com',
    category: 'storage',
    priority: 1,
    keywords: ['upload', 'file', 'storage', 'bucket'],
    compatibleDb: ['supabase']
  },
  {
    id: 'vercel_blob',
    title: 'Vercel Blob',
    description: 'Simple object storage for uploads',
    logo: 'vercel.com',
    category: 'storage',
    priority: 2,
    keywords: ['upload', 'file', 'storage'],
    compatibleHosting: ['vercel']
  },
  {
    id: 'uploadthing',
    title: 'UploadThing',
    description: 'Type-safe file uploads for Next.js',
    logo: 'uploadthing.com',
    category: 'storage',
    priority: 3,
    keywords: ['upload', 'file', 'image', 'media']
  },
  {
    id: 'cloudinary',
    title: 'Cloudinary',
    description: 'Media management and optimization',
    logo: 'cloudinary.com',
    category: 'storage',
    priority: 4,
    keywords: ['upload', 'image', 'media', 'video']
  },

  // Analytics
  {
    id: 'posthog',
    title: 'PostHog',
    description: 'Product analytics, session replay, and feature flags',
    logo: 'posthog.com',
    category: 'analytics',
    priority: 1,
    keywords: ['analytics', 'track', 'event', 'metrics']
  },
  {
    id: 'vercel_analytics',
    title: 'Vercel Analytics',
    description: 'Edge analytics for traffic and performance',
    logo: 'vercel.com',
    category: 'analytics',
    priority: 2,
    keywords: ['analytics', 'track', 'metrics'],
    compatibleHosting: ['vercel']
  },
  {
    id: 'mixpanel',
    title: 'Mixpanel',
    description: 'Advanced product analytics and user insights',
    logo: 'mixpanel.com',
    category: 'analytics',
    priority: 3,
    keywords: ['analytics', 'track', 'event']
  },
  {
    id: 'analytics',
    title: 'Analytics',
    description: 'Track key events to learn fast',
    logo: 'google.com',
    category: 'analytics',
    priority: 4,
    keywords: ['analytics', 'track'],
    showForBeginner: true
  },

  // Payments
  {
    id: 'stripe',
    title: 'Stripe Payments',
    description: 'Checkout, billing, subscriptions and invoicing',
    logo: 'stripe.com',
    category: 'payments',
    priority: 1,
    keywords: ['pay', 'stripe', 'payment', 'checkout', 'billing', 'subscription']
  },
  {
    id: 'lemon_squeezy',
    title: 'Lemon Squeezy',
    description: 'Merchant of record for digital products',
    logo: 'lemonsqueezy.com',
    category: 'payments',
    priority: 2,
    keywords: ['pay', 'payment', 'subscription', 'digital']
  },
  {
    id: 'paddle',
    title: 'Paddle',
    description: 'Complete payment infrastructure for SaaS',
    logo: 'paddle.com',
    category: 'payments',
    priority: 3,
    keywords: ['pay', 'payment', 'subscription', 'saas']
  },

  // Video
  {
    id: 'mux',
    title: 'Mux Video',
    description: 'Fast video ingest, playback and webhooks for apps',
    logo: 'mux.com',
    category: 'video',
    priority: 1,
    keywords: ['video', 'stream', 'mux', 'playback']
  },
  {
    id: 'stream',
    title: 'Stream',
    description: 'Activity feeds and chat APIs',
    logo: 'getstream.io',
    category: 'video',
    priority: 2,
    keywords: ['video', 'stream', 'chat', 'feed']
  },

  // Observability
  {
    id: 'sentry',
    title: 'Sentry',
    description: 'Errors, traces and performance monitoring',
    logo: 'sentry.io',
    category: 'observability',
    priority: 1,
    keywords: ['error', 'trace', 'perf', 'monitor', 'logging', 'log']
  },
  {
    id: 'datadog',
    title: 'Datadog',
    description: 'Full-stack observability platform',
    logo: 'datadoghq.com',
    category: 'observability',
    priority: 2,
    keywords: ['error', 'trace', 'monitor', 'logging', 'metrics']
  },
  {
    id: 'dash0',
    title: 'Dash0',
    description: 'Logs, traces and metrics simplified',
    logo: 'dash0.com',
    category: 'observability',
    priority: 3,
    keywords: ['error', 'trace', 'log', 'monitor']
  },
  {
    id: 'newrelic',
    title: 'New Relic',
    description: 'Application performance monitoring',
    logo: 'newrelic.com',
    category: 'observability',
    priority: 4,
    keywords: ['error', 'trace', 'perf', 'monitor']
  },

  // ORM
  {
    id: 'prisma',
    title: 'Prisma',
    description: 'Next-generation ORM for Node.js and TypeScript',
    logo: 'prisma.io',
    category: 'orm',
    priority: 1,
    keywords: ['database', 'orm', 'sql', 'postgres', 'mysql']
  },
  {
    id: 'drizzle',
    title: 'Drizzle ORM',
    description: 'Type-safe SQL with migrations and schema inference',
    logo: 'orm.drizzle.team',
    category: 'orm',
    priority: 2,
    keywords: ['database', 'orm', 'sql'],
    compatibleDb: ['neon', 'turso', 'planetscale']
  },

  // Cache
  {
    id: 'upstash_redis',
    title: 'Upstash Redis/Vector',
    description: 'Serverless Redis, Queue and Vector DB',
    logo: 'upstash.com',
    category: 'cache',
    priority: 1,
    keywords: ['redis', 'cache', 'queue', 'rate limit', 'vector']
  },
  {
    id: 'redis',
    title: 'Redis',
    description: 'In-memory data store and cache',
    logo: 'redis.io',
    category: 'cache',
    priority: 2,
    keywords: ['redis', 'cache', 'queue']
  },

  // Database
  {
    id: 'mongodb',
    title: 'MongoDB Atlas',
    description: 'Serverless document DB with search and vector',
    logo: 'mongodb.com',
    category: 'db',
    priority: 1,
    keywords: ['mongo', 'document', 'search', 'nosql']
  },

  // Email
  {
    id: 'resend',
    title: 'Resend Email',
    description: 'Transactional email for Next.js and Vercel',
    logo: 'resend.com',
    category: 'email',
    priority: 1,
    keywords: ['email', 'newsletter', 'transactional', 'verify', 'notification']
  },
  {
    id: 'sendgrid',
    title: 'SendGrid',
    description: 'Email delivery and marketing platform',
    logo: 'sendgrid.com',
    category: 'email',
    priority: 2,
    keywords: ['email', 'newsletter', 'transactional']
  },
  {
    id: 'postmark',
    title: 'Postmark',
    description: 'Fast and reliable transactional email',
    logo: 'postmarkapp.com',
    category: 'email',
    priority: 3,
    keywords: ['email', 'transactional']
  },
  {
    id: 'mailgun',
    title: 'Mailgun',
    description: 'Email API service for developers',
    logo: 'mailgun.com',
    category: 'email',
    priority: 4,
    keywords: ['email', 'transactional']
  },

  // Feature Flags
  {
    id: 'launchdarkly',
    title: 'LaunchDarkly',
    description: 'Enterprise feature management platform',
    logo: 'launchdarkly.com',
    category: 'flags',
    priority: 1,
    keywords: ['flag', 'experiment', 'ab', 'ab test', 'feature flag'],
    hideForBeginner: true
  },
  {
    id: 'growthbook',
    title: 'GrowthBook',
    description: 'Open source feature flags and experimentation',
    logo: 'growthbook.io',
    category: 'flags',
    priority: 2,
    keywords: ['flag', 'experiment', 'ab', 'growth'],
    hideForBeginner: true
  },
  {
    id: 'statsig',
    title: 'Statsig',
    description: 'Feature flags, experiments and analytics',
    logo: 'statsig.com',
    category: 'flags',
    priority: 3,
    keywords: ['flag', 'experiment', 'statsig'],
    hideForBeginner: true
  },

  // Communication
  {
    id: 'twilio',
    title: 'Twilio',
    description: 'SMS, voice, and video communication APIs',
    logo: 'twilio.com',
    category: 'communication',
    priority: 1,
    keywords: ['sms', 'phone', 'call', 'voice', 'twilio']
  },
  {
    id: 'pusher',
    title: 'Pusher',
    description: 'Realtime WebSocket and pub/sub messaging',
    logo: 'pusher.com',
    category: 'communication',
    priority: 2,
    keywords: ['realtime', 'websocket', 'pusher', 'chat']
  },
  {
    id: 'ably',
    title: 'Ably',
    description: 'Realtime messaging at scale',
    logo: 'ably.com',
    category: 'communication',
    priority: 3,
    keywords: ['realtime', 'websocket', 'messaging']
  },

  // Search
  {
    id: 'algolia',
    title: 'Algolia',
    description: 'Fast and relevant search API',
    logo: 'algolia.com',
    category: 'search',
    priority: 1,
    keywords: ['search', 'algolia', 'index']
  },
  {
    id: 'typesense',
    title: 'Typesense',
    description: 'Open source search engine',
    logo: 'typesense.org',
    category: 'search',
    priority: 2,
    keywords: ['search', 'index']
  },

  // AI
  {
    id: 'openai',
    title: 'OpenAI',
    description: 'GPT models and AI capabilities',
    logo: 'openai.com',
    category: 'ai',
    priority: 1,
    keywords: ['ai', 'ml', 'gpt', 'llm', 'openai']
  },
  {
    id: 'anthropic',
    title: 'Anthropic Claude',
    description: 'Advanced AI assistant API',
    logo: 'anthropic.com',
    category: 'ai',
    priority: 2,
    keywords: ['ai', 'ml', 'llm', 'claude', 'anthropic']
  },
  {
    id: 'replicate',
    title: 'Replicate',
    description: 'Run ML models with an API',
    logo: 'replicate.com',
    category: 'ai',
    priority: 3,
    keywords: ['ai', 'ml', 'model', 'replicate']
  },
  {
    id: 'pinecone',
    title: 'Pinecone',
    description: 'Vector database for ML applications',
    logo: 'pinecone.io',
    category: 'ai',
    priority: 4,
    keywords: ['ai', 'vector', 'embedding', 'pinecone']
  },

  // Misc
  {
    id: 'calendar',
    title: 'Calendar',
    description: 'Scheduling and availability',
    logo: 'calendly.com',
    category: 'misc',
    priority: 1,
    keywords: ['calendar', 'booking', 'schedule']
  },

  // CMS
  {
    id: 'contentful',
    title: 'Contentful',
    description: 'Headless CMS for structured content',
    logo: 'contentful.com',
    category: 'cms',
    priority: 1,
    keywords: ['cms', 'content', 'headless', 'contentful']
  },
  {
    id: 'sanity',
    title: 'Sanity',
    description: 'Real-time collaborative content platform',
    logo: 'sanity.io',
    category: 'cms',
    priority: 2,
    keywords: ['cms', 'content', 'headless', 'sanity']
  },
  {
    id: 'strapi',
    title: 'Strapi',
    description: 'Open-source headless CMS',
    logo: 'strapi.io',
    category: 'cms',
    priority: 3,
    keywords: ['cms', 'content', 'headless', 'strapi']
  },
  {
    id: 'hygraph',
    title: 'Hygraph',
    description: 'GraphQL content management',
    logo: 'hygraph.com',
    category: 'cms',
    priority: 4,
    keywords: ['cms', 'content', 'graphql']
  },
  {
    id: 'payload',
    title: 'Payload CMS',
    description: 'TypeScript headless CMS',
    logo: 'payloadcms.com',
    category: 'cms',
    priority: 5,
    keywords: ['cms', 'content', 'typescript']
  },
  {
    id: 'directus',
    title: 'Directus',
    description: 'Open data platform for any SQL database',
    logo: 'directus.io',
    category: 'cms',
    priority: 6,
    keywords: ['cms', 'content', 'sql']
  },

  // More Auth
  {
    id: 'workos',
    title: 'WorkOS',
    description: 'Enterprise-ready authentication',
    logo: 'workos.com',
    category: 'auth',
    priority: 5,
    keywords: ['auth', 'enterprise', 'sso', 'saml']
  },
  {
    id: 'magic',
    title: 'Magic',
    description: 'Passwordless authentication',
    logo: 'magic.link',
    category: 'auth',
    priority: 6,
    keywords: ['auth', 'passwordless', 'magic']
  },
  {
    id: 'nextauth',
    title: 'NextAuth.js',
    description: 'Authentication for Next.js',
    logo: 'next-auth.js.org',
    category: 'auth',
    priority: 7,
    keywords: ['auth', 'nextjs', 'oauth']
  },
  {
    id: 'lucia',
    title: 'Lucia',
    description: 'Simple and flexible auth library',
    logo: 'lucia-auth.com',
    category: 'auth',
    priority: 8,
    keywords: ['auth', 'simple', 'flexible']
  },

  // More Payments
  {
    id: 'paypal',
    title: 'PayPal',
    description: 'Global payment processing',
    logo: 'paypal.com',
    category: 'payments',
    priority: 4,
    keywords: ['pay', 'payment', 'paypal']
  },
  {
    id: 'square',
    title: 'Square',
    description: 'Payment and point of sale',
    logo: 'square.com',
    category: 'payments',
    priority: 5,
    keywords: ['pay', 'payment', 'square', 'pos']
  },
  {
    id: 'adyen',
    title: 'Adyen',
    description: 'Global payment platform',
    logo: 'adyen.com',
    category: 'payments',
    priority: 6,
    keywords: ['pay', 'payment', 'global']
  },

  // Notification Services
  {
    id: 'onesignal',
    title: 'OneSignal',
    description: 'Push notifications and messaging',
    logo: 'onesignal.com',
    category: 'notifications',
    priority: 1,
    keywords: ['notification', 'push', 'messaging']
  },
  {
    id: 'pusher_beams',
    title: 'Pusher Beams',
    description: 'Cross-platform push notifications',
    logo: 'pusher.com',
    category: 'notifications',
    priority: 2,
    keywords: ['notification', 'push', 'pusher']
  },
  {
    id: 'novu',
    title: 'Novu',
    description: 'Open-source notification infrastructure',
    logo: 'novu.co',
    category: 'notifications',
    priority: 3,
    keywords: ['notification', 'push', 'email', 'sms']
  },
  {
    id: 'knock',
    title: 'Knock',
    description: 'Notifications infrastructure',
    logo: 'knock.app',
    category: 'notifications',
    priority: 4,
    keywords: ['notification', 'infrastructure']
  },

  // CRM
  {
    id: 'hubspot',
    title: 'HubSpot',
    description: 'CRM and marketing automation',
    logo: 'hubspot.com',
    category: 'crm',
    priority: 1,
    keywords: ['crm', 'marketing', 'sales', 'hubspot']
  },
  {
    id: 'salesforce',
    title: 'Salesforce',
    description: 'Enterprise CRM platform',
    logo: 'salesforce.com',
    category: 'crm',
    priority: 2,
    keywords: ['crm', 'enterprise', 'sales']
  },
  {
    id: 'pipedrive',
    title: 'Pipedrive',
    description: 'Sales CRM and pipeline management',
    logo: 'pipedrive.com',
    category: 'crm',
    priority: 3,
    keywords: ['crm', 'sales', 'pipeline']
  },

  // Forms
  {
    id: 'tally',
    title: 'Tally',
    description: 'Simple form builder',
    logo: 'tally.so',
    category: 'forms',
    priority: 1,
    keywords: ['form', 'forms', 'survey']
  },
  {
    id: 'typeform',
    title: 'Typeform',
    description: 'Interactive forms and surveys',
    logo: 'typeform.com',
    category: 'forms',
    priority: 2,
    keywords: ['form', 'forms', 'survey', 'typeform']
  },
  {
    id: 'jotform',
    title: 'Jotform',
    description: 'Online form builder',
    logo: 'jotform.com',
    category: 'forms',
    priority: 3,
    keywords: ['form', 'forms', 'builder']
  },
  {
    id: 'formspree',
    title: 'Formspree',
    description: 'Form backend for static sites',
    logo: 'formspree.io',
    category: 'forms',
    priority: 4,
    keywords: ['form', 'forms', 'static']
  },

  // Marketing
  {
    id: 'mailchimp',
    title: 'Mailchimp',
    description: 'Email marketing platform',
    logo: 'mailchimp.com',
    category: 'marketing',
    priority: 1,
    keywords: ['email', 'marketing', 'newsletter', 'mailchimp']
  },
  {
    id: 'convertkit',
    title: 'ConvertKit',
    description: 'Email marketing for creators',
    logo: 'convertkit.com',
    category: 'marketing',
    priority: 2,
    keywords: ['email', 'marketing', 'newsletter', 'creator']
  },
  {
    id: 'klaviyo',
    title: 'Klaviyo',
    description: 'Email and SMS marketing',
    logo: 'klaviyo.com',
    category: 'marketing',
    priority: 3,
    keywords: ['email', 'sms', 'marketing', 'ecommerce']
  },

  // More AI Services
  {
    id: 'cohere',
    title: 'Cohere',
    description: 'Enterprise AI platform',
    logo: 'cohere.com',
    category: 'ai',
    priority: 5,
    keywords: ['ai', 'llm', 'nlp', 'cohere']
  },
  {
    id: 'huggingface',
    title: 'Hugging Face',
    description: 'Open ML models and datasets',
    logo: 'huggingface.co',
    category: 'ai',
    priority: 6,
    keywords: ['ai', 'ml', 'model', 'huggingface']
  },
  {
    id: 'together',
    title: 'Together AI',
    description: 'Fast inference for open models',
    logo: 'together.ai',
    category: 'ai',
    priority: 7,
    keywords: ['ai', 'ml', 'inference']
  },
  {
    id: 'groq',
    title: 'Groq',
    description: 'Ultra-fast LLM inference',
    logo: 'groq.com',
    category: 'ai',
    priority: 8,
    keywords: ['ai', 'llm', 'inference', 'fast']
  },
  {
    id: 'weaviate',
    title: 'Weaviate',
    description: 'Vector database for AI',
    logo: 'weaviate.io',
    category: 'ai',
    priority: 9,
    keywords: ['ai', 'vector', 'database', 'search']
  },
  {
    id: 'qdrant',
    title: 'Qdrant',
    description: 'Vector similarity search',
    logo: 'qdrant.tech',
    category: 'ai',
    priority: 10,
    keywords: ['ai', 'vector', 'search']
  },

  // Scheduling
  {
    id: 'calendly',
    title: 'Calendly',
    description: 'Meeting scheduling automation',
    logo: 'calendly.com',
    category: 'scheduling',
    priority: 1,
    keywords: ['calendar', 'scheduling', 'meeting', 'calendly']
  },
  {
    id: 'cal',
    title: 'Cal.com',
    description: 'Open-source scheduling infrastructure',
    logo: 'cal.com',
    category: 'scheduling',
    priority: 2,
    keywords: ['calendar', 'scheduling', 'meeting', 'open-source']
  },
  {
    id: 'savvycal',
    title: 'SavvyCal',
    description: 'Personalized scheduling links',
    logo: 'savvycal.com',
    category: 'scheduling',
    priority: 3,
    keywords: ['calendar', 'scheduling', 'meeting']
  },

  // PDF & Documents
  {
    id: 'pdfco',
    title: 'PDF.co',
    description: 'PDF generation and manipulation',
    logo: 'pdf.co',
    category: 'documents',
    priority: 1,
    keywords: ['pdf', 'document', 'generate']
  },
  {
    id: 'pandadoc',
    title: 'PandaDoc',
    description: 'Document automation platform',
    logo: 'pandadoc.com',
    category: 'documents',
    priority: 2,
    keywords: ['document', 'pdf', 'signature', 'contract']
  },
  {
    id: 'docusign',
    title: 'DocuSign',
    description: 'E-signature and agreement cloud',
    logo: 'docusign.com',
    category: 'documents',
    priority: 3,
    keywords: ['signature', 'esignature', 'document', 'contract']
  },

  // Shipping & Logistics
  {
    id: 'shippo',
    title: 'Shippo',
    description: 'Multi-carrier shipping API',
    logo: 'shippo.com',
    category: 'logistics',
    priority: 1,
    keywords: ['shipping', 'logistics', 'ecommerce']
  },
  {
    id: 'easypost',
    title: 'EasyPost',
    description: 'Shipping API and tracking',
    logo: 'easypost.com',
    category: 'logistics',
    priority: 2,
    keywords: ['shipping', 'logistics', 'tracking']
  },

  // Social Media
  {
    id: 'buffer',
    title: 'Buffer',
    description: 'Social media management',
    logo: 'buffer.com',
    category: 'social',
    priority: 1,
    keywords: ['social', 'twitter', 'facebook', 'instagram']
  },
  {
    id: 'hootsuite',
    title: 'Hootsuite',
    description: 'Social media scheduling',
    logo: 'hootsuite.com',
    category: 'social',
    priority: 2,
    keywords: ['social', 'scheduling', 'marketing']
  },

  // Testing & QA
  {
    id: 'playwright',
    title: 'Playwright',
    description: 'Browser automation testing',
    logo: 'playwright.dev',
    category: 'testing',
    priority: 1,
    keywords: ['testing', 'e2e', 'automation', 'browser']
  },
  {
    id: 'cypress',
    title: 'Cypress',
    description: 'E2E testing framework',
    logo: 'cypress.io',
    category: 'testing',
    priority: 2,
    keywords: ['testing', 'e2e', 'automation']
  },
  {
    id: 'checkly',
    title: 'Checkly',
    description: 'API and E2E monitoring',
    logo: 'checklyhq.com',
    category: 'testing',
    priority: 3,
    keywords: ['testing', 'monitoring', 'api', 'e2e']
  },

  // Customer Support
  {
    id: 'intercom',
    title: 'Intercom',
    description: 'Customer messaging platform',
    logo: 'intercom.com',
    category: 'support',
    priority: 1,
    keywords: ['support', 'chat', 'customer', 'messaging']
  },
  {
    id: 'zendesk',
    title: 'Zendesk',
    description: 'Customer service software',
    logo: 'zendesk.com',
    category: 'support',
    priority: 2,
    keywords: ['support', 'customer', 'helpdesk', 'ticket']
  },
  {
    id: 'crisp',
    title: 'Crisp',
    description: 'Customer messaging platform',
    logo: 'crisp.chat',
    category: 'support',
    priority: 3,
    keywords: ['support', 'chat', 'customer']
  },
  {
    id: 'plain',
    title: 'Plain',
    description: 'Customer support built for engineering teams',
    logo: 'plain.com',
    category: 'support',
    priority: 4,
    keywords: ['support', 'customer', 'api', 'engineering']
  },

  // Feedback & Reviews
  {
    id: 'canny',
    title: 'Canny',
    description: 'User feedback and feature requests',
    logo: 'canny.io',
    category: 'feedback',
    priority: 1,
    keywords: ['feedback', 'feature request', 'roadmap']
  },
  {
    id: 'fider',
    title: 'Fider',
    description: 'Open-source feedback platform',
    logo: 'fider.io',
    category: 'feedback',
    priority: 2,
    keywords: ['feedback', 'feature request', 'open-source']
  },

  // Billing & Subscriptions
  {
    id: 'chargebee',
    title: 'Chargebee',
    description: 'Subscription billing management',
    logo: 'chargebee.com',
    category: 'billing',
    priority: 1,
    keywords: ['billing', 'subscription', 'recurring', 'invoice']
  },
  {
    id: 'recurly',
    title: 'Recurly',
    description: 'Subscription management platform',
    logo: 'recurly.com',
    category: 'billing',
    priority: 2,
    keywords: ['billing', 'subscription', 'recurring']
  },

  // Internationalization
  {
    id: 'lokalise',
    title: 'Lokalise',
    description: 'Translation and localization platform',
    logo: 'lokalise.com',
    category: 'i18n',
    priority: 1,
    keywords: ['translation', 'i18n', 'localization', 'internationalization']
  },
  {
    id: 'phrase',
    title: 'Phrase',
    description: 'Localization platform',
    logo: 'phrase.com',
    category: 'i18n',
    priority: 2,
    keywords: ['translation', 'i18n', 'localization']
  },

  // Legal & Compliance
  {
    id: 'termly',
    title: 'Termly',
    description: 'Privacy policy and compliance',
    logo: 'termly.io',
    category: 'legal',
    priority: 1,
    keywords: ['legal', 'privacy', 'gdpr', 'compliance']
  },
  {
    id: 'iubenda',
    title: 'Iubenda',
    description: 'Privacy and cookie policy generator',
    logo: 'iubenda.com',
    category: 'legal',
    priority: 2,
    keywords: ['legal', 'privacy', 'cookie', 'gdpr']
  },

  // API Management
  {
    id: 'kong',
    title: 'Kong',
    description: 'API gateway and management',
    logo: 'konghq.com',
    category: 'api',
    priority: 1,
    keywords: ['api', 'gateway', 'management']
  },
  {
    id: 'tyk',
    title: 'Tyk',
    description: 'Open-source API gateway',
    logo: 'tyk.io',
    category: 'api',
    priority: 2,
    keywords: ['api', 'gateway', 'management', 'open-source']
  },

  // Queue & Jobs
  {
    id: 'inngest',
    title: 'Inngest',
    description: 'Durable workflow engine',
    logo: 'inngest.com',
    category: 'jobs',
    priority: 1,
    keywords: ['queue', 'jobs', 'workflow', 'background']
  },
  {
    id: 'trigger',
    title: 'Trigger.dev',
    description: 'Background jobs for developers',
    logo: 'trigger.dev',
    category: 'jobs',
    priority: 2,
    keywords: ['queue', 'jobs', 'background', 'scheduled']
  },
  {
    id: 'quirrel',
    title: 'Quirrel',
    description: 'Job queueing for serverless',
    logo: 'quirrel.dev',
    category: 'jobs',
    priority: 3,
    keywords: ['queue', 'jobs', 'serverless', 'scheduled']
  }
]
