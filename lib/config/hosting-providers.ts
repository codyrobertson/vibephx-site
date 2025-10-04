export interface HostingProvider {
  id: string
  label: string
  logo: string
  description: string
}

export const hostingProviders: HostingProvider[] = [
  { id: 'vercel', label: 'Vercel', logo: 'vercel.com', description: 'Best for Next.js' },
  { id: 'netlify', label: 'Netlify', logo: 'netlify.com', description: 'JAMstack platform' },
  { id: 'railway', label: 'Railway', logo: 'railway.app', description: 'Full-stack hosting' },
  { id: 'render', label: 'Render', logo: 'render.com', description: 'Unified cloud' },
  { id: 'fly', label: 'Fly.io', logo: 'fly.io', description: 'Global edge' },
  { id: 'cloudflare', label: 'Cloudflare Pages', logo: 'cloudflare.com', description: 'Edge network' },
  { id: 'replit', label: 'Replit', logo: 'replit.com', description: 'Cloud IDE + host' },
  { id: 'lovable', label: 'Lovable', logo: 'lovable.dev', description: 'AI builder host' },
  { id: 'aws', label: 'AWS Amplify', logo: 'aws.amazon.com', description: 'Amazon cloud' },
  { id: 'azure', label: 'Azure Static', logo: 'azure.microsoft.com', description: 'Microsoft cloud' },
  { id: 'digitalocean', label: 'DigitalOcean', logo: 'digitalocean.com', description: 'App Platform' },
  { id: 'heroku', label: 'Heroku', logo: 'heroku.com', description: 'Easy deployment' },
  { id: 'gcp', label: 'Google Cloud Run', logo: 'cloud.google.com', description: 'Serverless containers' },
  { id: 'supabase_hosting', label: 'Supabase Edge', logo: 'supabase.com', description: 'Edge functions' },
  { id: 'firebase_hosting', label: 'Firebase Hosting', logo: 'firebase.google.com', description: 'Fast CDN hosting' },
  { id: 'github_pages', label: 'GitHub Pages', logo: 'github.com', description: 'Free static hosting' },
  { id: 'gitlab_pages', label: 'GitLab Pages', logo: 'gitlab.com', description: 'CI/CD hosting' },
  { id: 'deno_deploy', label: 'Deno Deploy', logo: 'deno.com', description: 'Edge runtime' },
  { id: 'koyeb', label: 'Koyeb', logo: 'koyeb.com', description: 'Serverless platform' },
  { id: 'cyclic', label: 'Cyclic', logo: 'cyclic.sh', description: 'Full-stack hosting' },
  { id: 'qovery', label: 'Qovery', logo: 'qovery.com', description: 'Dev to prod platform' },
  { id: 'porter', label: 'Porter', logo: 'porter.run', description: 'PaaS on your cloud' },
  { id: 'northflank', label: 'Northflank', logo: 'northflank.com', description: 'Dev platform' }
]
