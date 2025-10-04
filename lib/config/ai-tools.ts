export interface AITool {
  name: string
  logo: string
  description: string
  recommendedUI: string[]
  recommendedHosting: string[]
  recommendedDB: string[]
}

export const aiTools: Record<string, AITool> = {
  v0: {
    name: 'V0',
    logo: 'v0.dev',
    description: 'Vercel AI code generator',
    recommendedUI: ['V0', 'shadcn/ui'],
    recommendedHosting: ['Vercel'],
    recommendedDB: ['Neon', 'Supabase']
  },
  cursor: {
    name: 'Cursor',
    logo: 'cursor.sh',
    description: 'AI-powered IDE',
    recommendedUI: ['shadcn/ui', 'Radix UI', 'Tailwind CSS'],
    recommendedHosting: ['Vercel', 'Netlify', 'Railway'],
    recommendedDB: ['Neon', 'Supabase', 'PlanetScale']
  },
  windsurf: {
    name: 'Windsurf',
    logo: 'codeium.com',
    description: 'Codeium AI IDE',
    recommendedUI: ['shadcn/ui', 'Tailwind CSS', 'React'],
    recommendedHosting: ['Vercel', 'Netlify', 'Railway'],
    recommendedDB: ['Neon', 'Supabase', 'PostgreSQL']
  },
  replit: {
    name: 'Replit',
    logo: 'replit.com',
    description: 'Cloud IDE + hosting',
    recommendedUI: ['React', 'Custom'],
    recommendedHosting: ['Replit'],
    recommendedDB: ['Replit DB', 'Supabase']
  },
  lovable: {
    name: 'Lovable',
    logo: 'lovable.dev',
    description: 'Full-stack AI builder',
    recommendedUI: ['Lovable UI'],
    recommendedHosting: ['Lovable'],
    recommendedDB: ['Supabase']
  },
  bolt: {
    name: 'Bolt.new',
    logo: 'bolt.new',
    description: 'StackBlitz AI web builder',
    recommendedUI: ['Tailwind CSS', 'React'],
    recommendedHosting: ['Netlify', 'Vercel'],
    recommendedDB: ['Supabase', 'Firebase']
  },
  claudecode: {
    name: 'Claude Code',
    logo: 'claude.ai',
    description: 'Anthropic AI coding',
    recommendedUI: ['shadcn/ui', 'Radix UI', 'Tailwind CSS'],
    recommendedHosting: ['Vercel', 'Netlify', 'Fly.io'],
    recommendedDB: ['Neon', 'Supabase', 'Turso']
  },
  copilot: {
    name: 'GitHub Copilot',
    logo: 'github.com',
    description: 'AI pair programmer',
    recommendedUI: ['Any'],
    recommendedHosting: ['GitHub Pages', 'Vercel', 'Netlify'],
    recommendedDB: ['Any']
  },
  codeium: {
    name: 'Codeium',
    logo: 'codeium.com',
    description: 'Free AI code completion',
    recommendedUI: ['Any'],
    recommendedHosting: ['Any'],
    recommendedDB: ['Any']
  },
  chatgpt: {
    name: 'ChatGPT',
    logo: 'openai.com',
    description: 'OpenAI assistant',
    recommendedUI: ['Custom', 'Bootstrap'],
    recommendedHosting: ['Any'],
    recommendedDB: ['Any']
  },
  tabnine: {
    name: 'Tabnine',
    logo: 'tabnine.com',
    description: 'AI code assistant',
    recommendedUI: ['Any'],
    recommendedHosting: ['Any'],
    recommendedDB: ['Any']
  },
  codewhisperer: {
    name: 'CodeWhisperer',
    logo: 'aws.amazon.com',
    description: 'Amazon AI coding',
    recommendedUI: ['React', 'Custom'],
    recommendedHosting: ['AWS Amplify', 'Vercel'],
    recommendedDB: ['DynamoDB', 'RDS']
  }
}
