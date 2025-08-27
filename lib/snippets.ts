// Utility to load code snippets for card backgrounds
export const CODE_SNIPPETS = [
  'react-component.tsx',
  'api-route.ts', 
  'database-schema.sql',
  'typescript-utils.ts',
  'nextjs-layout.tsx',
  'prisma-model.ts'
] as const

export type CodeSnippet = typeof CODE_SNIPPETS[number]

// Pre-loaded snippet cache - populated at module initialization
let snippetCache: Record<string, string> = {}
let isPreloadComplete = false
let preloadPromise: Promise<void> | null = null

// Pre-load all snippets at module initialization
async function preloadAllSnippets(): Promise<void> {
  if (isPreloadComplete) return
  if (preloadPromise) return preloadPromise
  
  preloadPromise = Promise.all(
    CODE_SNIPPETS.map(async (filename) => {
      try {
        const response = await fetch(`/snippets/${filename}`)
        if (response.ok) {
          const content = await response.text()
          snippetCache[filename] = content
        } else {
          // Use fallback if fetch fails
          snippetCache[filename] = getFallbackSnippet(filename)
        }
      } catch (error) {
        console.warn(`Failed to preload ${filename}, using fallback`)
        snippetCache[filename] = getFallbackSnippet(filename)
      }
    })
  ).then(() => {
    isPreloadComplete = true
    console.log('📦 All code snippets preloaded successfully')
  })
  
  return preloadPromise
}

// Synchronous snippet getter - returns immediately from cache or fallback
export function getCodeSnippetSync(filename: CodeSnippet): string {
  // Return from cache if available
  if (snippetCache[filename]) {
    return snippetCache[filename]
  }
  
  // Return fallback if not cached yet
  return getFallbackSnippet(filename)
}

// Async version for backwards compatibility
export async function loadCodeSnippet(filename: CodeSnippet): Promise<string> {
  // Ensure preload is started
  if (!isPreloadComplete && !preloadPromise) {
    await preloadAllSnippets()
  }
  
  return getCodeSnippetSync(filename)
}

// Initialize preloading when module loads (client-side only)
if (typeof window !== 'undefined') {
  preloadAllSnippets().catch(() => {
    console.warn('Failed to preload snippets, fallbacks will be used')
  })
}

export function getRandomSnippet(): CodeSnippet {
  return CODE_SNIPPETS[Math.floor(Math.random() * CODE_SNIPPETS.length)]
}

function getFallbackSnippet(filename: CodeSnippet): string {
  const fallbacks: Record<CodeSnippet, string> = {
    'react-component.tsx': `import React, { useState } from 'react'

export function MyComponent() {
  const [count, setCount] = useState(0)
  
  return (
    <div className="p-4">
      <h1>Count: {count}</h1>
      <button 
        onClick={() => setCount(count + 1)}
        className="bg-blue-500 text-white px-4 py-2 rounded"
      >
        Increment
      </button>
    </div>
  )
}`,

    'api-route.ts': `import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    const data = { message: 'Hello from API!' }
    return NextResponse.json(data)
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    )
  }
}`,

    'database-schema.sql': `CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  name VARCHAR(100) NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_users_email ON users(email);`,

    'typescript-utils.ts': `export function cn(...classes: string[]) {
  return classes.filter(Boolean).join(' ')
}

export function formatDate(date: Date): string {
  return date.toLocaleDateString()
}

export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
) {
  let timeout: NodeJS.Timeout
  return (...args: Parameters<T>) => {
    clearTimeout(timeout)
    timeout = setTimeout(() => func(...args), wait)
  }
}`,

    'nextjs-layout.tsx': `import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <main>{children}</main>
      </body>
    </html>
  )
}`,

    'prisma-model.ts': `import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function getUsers() {
  return prisma.user.findMany({
    select: {
      id: true,
      email: true,
      name: true
    }
  })
}

export async function createUser(data: {
  email: string
  name: string
}) {
  return prisma.user.create({ data })
}`
  }

  return fallbacks[filename] || '// Code snippet not available'
}