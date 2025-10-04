/**
 * Service name to logo domain mappings
 * Used for injecting logos into AI responses when services are mentioned
 */

export const SERVICE_LOGO_MAP: Record<string, string> = {
  // AI Tools & Models
  'ChatGPT': 'openai.com',
  'OpenAI': 'openai.com',
  'GPT': 'openai.com',
  'Claude': 'anthropic.com',
  'Anthropic': 'anthropic.com',
  'Gemini': 'google.com',
  'Bard': 'google.com',
  'Llama': 'meta.com',
  'Mistral': 'mistral.ai',
  'Cohere': 'cohere.com',
  'Groq': 'groq.com',
  'Together AI': 'together.ai',
  'Replicate': 'replicate.com',
  'Hugging Face': 'huggingface.co',

  // Coding Tools
  'V0': 'v0.dev',
  'Cursor': 'cursor.sh',
  'Windsurf': 'codeium.com',
  'Replit': 'replit.com',
  'Lovable': 'lovable.dev',
  'Bolt': 'bolt.new',
  'GitHub Copilot': 'github.com',
  'Codeium': 'codeium.com',
  'Tabnine': 'tabnine.com',

  // Frontend Frameworks
  'React': 'react.dev',
  'Next.js': 'nextjs.org',
  'Vue': 'vuejs.org',
  'Svelte': 'svelte.dev',
  'Angular': 'angular.io',
  'Remix': 'remix.run',

  // UI Libraries
  'shadcn/ui': 'ui.shadcn.com',
  'Radix': 'radix-ui.com',
  'Chakra UI': 'chakra-ui.com',
  'Material UI': 'mui.com',
  'Ant Design': 'ant.design',
  'Tailwind': 'tailwindcss.com',
  'daisyUI': 'daisyui.com',
  'Mantine': 'mantine.dev',

  // Databases
  'PostgreSQL': 'postgresql.org',
  'Postgres': 'postgresql.org',
  'MySQL': 'mysql.com',
  'MongoDB': 'mongodb.com',
  'Supabase': 'supabase.com',
  'Firebase': 'firebase.google.com',
  'Neon': 'neon.tech',
  'PlanetScale': 'planetscale.com',
  'Turso': 'turso.tech',
  'Prisma': 'prisma.io',
  'Drizzle': 'orm.drizzle.team',
  'Redis': 'redis.io',
  'Upstash': 'upstash.com',

  // Hosting & Cloud
  'Vercel': 'vercel.com',
  'Vercel Blob': 'vercel.com',
  'Vercel Analytics': 'vercel.com',
  'Netlify': 'netlify.com',
  'Railway': 'railway.app',
  'Fly.io': 'fly.io',
  'Render': 'render.com',
  'Cloudflare': 'cloudflare.com',
  'AWS': 'aws.amazon.com',
  'GCP': 'cloud.google.com',
  'Azure': 'azure.microsoft.com',
  'DigitalOcean': 'digitalocean.com',
  'Heroku': 'heroku.com',

  // Auth
  'Clerk': 'clerk.com',
  'Auth0': 'auth0.com',
  'WorkOS': 'workos.com',
  'Magic': 'magic.link',
  'NextAuth': 'next-auth.js.org',

  // Payments
  'Stripe': 'stripe.com',
  'PayPal': 'paypal.com',
  'Lemon Squeezy': 'lemonsqueezy.com',
  'Paddle': 'paddle.com',

  // Email
  'Resend': 'resend.com',
  'SendGrid': 'sendgrid.com',
  'Postmark': 'postmarkapp.com',
  'Mailgun': 'mailgun.com',

  // Analytics
  'PostHog': 'posthog.com',
  'Mixpanel': 'mixpanel.com',
  'Amplitude': 'amplitude.com',
  'Plausible': 'plausible.io',

  // CMS
  'Contentful': 'contentful.com',
  'Sanity': 'sanity.io',
  'Strapi': 'strapi.io',
  'Payload': 'payloadcms.com',

  // Communication
  'Twilio': 'twilio.com',
  'Pusher': 'pusher.com',
  'Ably': 'ably.com',

  // Monitoring
  'Sentry': 'sentry.io',
  'Datadog': 'datadoghq.com',
  'New Relic': 'newrelic.com',

  // Search
  'Algolia': 'algolia.com',
  'Typesense': 'typesense.org',

  // Testing
  'Playwright': 'playwright.dev',
  'Cypress': 'cypress.io',

  // Video
  'Mux': 'mux.com',

  // Storage
  'Cloudinary': 'cloudinary.com',
  'UploadThing': 'uploadthing.com',

  // Customer Support
  'Intercom': 'intercom.com',
  'Zendesk': 'zendesk.com',
  'Crisp': 'crisp.chat',

  // Misc Tools
  'Calendly': 'calendly.com',
  'Cal.com': 'cal.com',
  'Notion': 'notion.so',
  'Linear': 'linear.app',
  'Figma': 'figma.com',
  'Framer': 'framer.com'
}

/**
 * Get logo domain for a service name
 * Returns the domain or null if not found
 */
export function getServiceLogoDomain(serviceName: string): string | null {
  return SERVICE_LOGO_MAP[serviceName] || null
}

/**
 * Check if a string mentions any known services
 * Returns array of {serviceName, domain} for all matches
 */
export function findServiceMentions(text: string): Array<{ serviceName: string; domain: string }> {
  const mentions: Array<{ serviceName: string; domain: string }> = []
  const serviceNames = Object.keys(SERVICE_LOGO_MAP)

  // Sort by length (descending) to match longer names first
  // This prevents "React" from matching before "React Native"
  const sortedNames = serviceNames.sort((a, b) => b.length - a.length)

  for (const serviceName of sortedNames) {
    // Use word boundary regex to match whole words only
    const regex = new RegExp(`\\b${serviceName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'gi')
    if (regex.test(text)) {
      mentions.push({
        serviceName,
        domain: SERVICE_LOGO_MAP[serviceName]
      })
    }
  }

  return mentions
}

/**
 * Common service names by category for quick reference
 */
export const SERVICE_CATEGORIES = {
  ai: ['ChatGPT', 'Claude', 'Gemini', 'Mistral', 'Llama'],
  coding: ['V0', 'Cursor', 'Replit', 'GitHub Copilot'],
  frontend: ['React', 'Next.js', 'Vue', 'Svelte'],
  database: ['PostgreSQL', 'MongoDB', 'Supabase', 'Firebase'],
  hosting: ['Vercel', 'Netlify', 'Railway', 'Fly.io'],
  auth: ['Clerk', 'Auth0', 'WorkOS'],
  payments: ['Stripe', 'Lemon Squeezy', 'Paddle'],
} as const
