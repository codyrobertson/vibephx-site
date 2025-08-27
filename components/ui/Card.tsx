'use client'

import React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'
// Ultra-fast pre-styled HTML snippets - no syntax highlighting processing needed
const STATIC_SNIPPETS_HTML = [
  `import React, { useState } from 'react'
import { Button } from './ui/button'

export function UserProfile({ user }) {
  const [editing, setEditing] = useState(false)
  
  return (
    <div className="p-6 max-w-md mx-auto">
      <img 
        className="w-20 h-20 rounded-full mx-auto" 
        src={user.avatar} 
        alt={user.name}
      />
      <div className="text-center mt-4">
        <h2 className="text-xl font-semibold">{user.name}</h2>
        <p className="text-gray-600">{user.email}</p>
        <Button 
          onClick={() => setEditing(!editing)}
          className="mt-4"
        >
          {editing ? 'Save' : 'Edit Profile'}
        </Button>
      </div>
    </div>
  )
}`,

  `import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'

const CreateUserSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  role: z.enum(['admin', 'user'])
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, email, role } = CreateUserSchema.parse(body)
    
    const user = await db.user.create({
      data: { name, email, role }
    })
    
    return NextResponse.json({ user }, { status: 201 })
  } catch (error) {
    return NextResponse.json(
      { error: 'Invalid request' }, 
      { status: 400 }
    )
  }
}`,

  `-- User management and authentication
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  name VARCHAR(100) NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  role user_role DEFAULT 'user',
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  token VARCHAR(500) UNIQUE NOT NULL,
  expires_at TIMESTAMP NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_sessions_token ON sessions(token);
CREATE INDEX idx_sessions_user ON sessions(user_id);`,

  `export function cn(...classes: (string | undefined)[]) {
  return classes.filter(Boolean).join(' ')
}

export function formatDate(date: Date): string {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  }).format(date)
}

export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout
  return (...args: Parameters<T>) => {
    clearTimeout(timeout)
    timeout = setTimeout(() => func(...args), wait)
  }
}

export function generateId(): string {
  return Math.random().toString(36).substring(2, 15)
}`,

  `import { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { ThemeProvider } from '@/components/theme-provider'
import { Toaster } from '@/components/ui/toaster'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Modern App',
  description: 'Built with Next.js, TypeScript, and Tailwind'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
        >
          <main className="min-h-screen bg-background">
            {children}
          </main>
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  )
}`,

  `import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

const prisma = globalForPrisma.prisma ?? new PrismaClient()

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma
}

export async function getUsers() {
  return prisma.user.findMany({
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      createdAt: true
    },
    orderBy: {
      createdAt: 'desc'
    }
  })
}

export async function createUser(data: {
  name: string
  email: string
  role?: string
}) {
  return prisma.user.create({
    data: {
      ...data,
      role: data.role || 'user'
    }
  })
}

export default prisma`,

  `"use client"

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, Filter, Plus } from 'lucide-react'

interface Task {
  id: string
  title: string
  completed: boolean
  priority: 'high' | 'medium' | 'low'
  dueDate?: Date
}

export default function TaskManager() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [filter, setFilter] = useState<'all' | 'active' | 'completed'>('all')
  const [searchTerm, setSearchTerm] = useState('')
  
  const filteredTasks = tasks.filter(task => {
    const matchesFilter = filter === 'all' || 
      (filter === 'active' && !task.completed) ||
      (filter === 'completed' && task.completed)
    
    const matchesSearch = task.title.toLowerCase()
      .includes(searchTerm.toLowerCase())
    
    return matchesFilter && matchesSearch
  })
  
  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">Tasks</h1>
        <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
          <Plus size={20} />
          Add Task
        </button>
      </div>
      
      <div className="grid gap-4">
        <AnimatePresence>
          {filteredTasks.map((task) => (
            <motion.div
              key={task.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="p-4 bg-white rounded-lg shadow-sm border"
            >
              <div className="flex items-center justify-between">
                <h3 className="font-medium">{task.title}</h3>
                <span className={\`px-2 py-1 rounded text-sm \${
                  task.priority === 'high' ? 'bg-red-100 text-red-700' :
                  task.priority === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                  'bg-green-100 text-green-700'
                }\`}>
                  {task.priority}
                </span>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  )
}`,

  `import { cookies } from 'next/headers'
import { NextRequest } from 'next/server'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'
import { z } from 'zod'

const LoginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6)
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, password } = LoginSchema.parse(body)
    
    // Find user by email
    const user = await prisma.user.findUnique({
      where: { email },
      select: {
        id: true,
        email: true,
        name: true,
        passwordHash: true,
        role: true
      }
    })
    
    if (!user || !await bcrypt.compare(password, user.passwordHash)) {
      return Response.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      )
    }
    
    // Generate JWT token
    const token = jwt.sign(
      { 
        userId: user.id, 
        email: user.email, 
        role: user.role 
      },
      process.env.JWT_SECRET!,
      { expiresIn: '7d' }
    )
    
    // Set secure cookie
    cookies().set('auth-token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 60 * 60 * 24 * 7 // 7 days
    })
    
    return Response.json({
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role
      }
    })
    
  } catch (error) {
    console.error('Login error:', error)
    return Response.json(
      { error: 'Authentication failed' },
      { status: 500 }
    )
  }
}`,

  `-- E-commerce database schema with relationships
CREATE TYPE order_status AS ENUM ('pending', 'processing', 'shipped', 'delivered', 'cancelled');
CREATE TYPE payment_status AS ENUM ('pending', 'completed', 'failed', 'refunded');

CREATE TABLE categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(100) NOT NULL UNIQUE,
  slug VARCHAR(100) NOT NULL UNIQUE,
  description TEXT,
  image_url VARCHAR(500),
  parent_id UUID REFERENCES categories(id),
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(200) NOT NULL,
  slug VARCHAR(200) NOT NULL UNIQUE,
  description TEXT,
  price DECIMAL(10,2) NOT NULL CHECK (price >= 0),
  sale_price DECIMAL(10,2) CHECK (sale_price >= 0 AND sale_price < price),
  stock_quantity INTEGER DEFAULT 0 CHECK (stock_quantity >= 0),
  category_id UUID REFERENCES categories(id),
  images JSONB DEFAULT '[]',
  attributes JSONB DEFAULT '{}',
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id),
  status order_status DEFAULT 'pending',
  payment_status payment_status DEFAULT 'pending',
  subtotal DECIMAL(10,2) NOT NULL,
  tax_amount DECIMAL(10,2) DEFAULT 0,
  shipping_amount DECIMAL(10,2) DEFAULT 0,
  total_amount DECIMAL(10,2) NOT NULL,
  shipping_address JSONB NOT NULL,
  billing_address JSONB NOT NULL,
  notes TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE order_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
  product_id UUID REFERENCES products(id),
  quantity INTEGER NOT NULL CHECK (quantity > 0),
  unit_price DECIMAL(10,2) NOT NULL,
  total_price DECIMAL(10,2) NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX idx_products_category ON products(category_id);
CREATE INDEX idx_products_active ON products(is_active);
CREATE INDEX idx_orders_user ON orders(user_id);
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_order_items_order ON order_items(order_id);
CREATE INDEX idx_order_items_product ON order_items(product_id);`
]
import { highlightCode } from '@/lib/shiki-highlighter'

// Language detection for static snippets
const SNIPPET_LANGUAGES = [
  'typescript', // React component
  'typescript', // API route
  'sql',        // Database schema
  'typescript', // TypeScript utils  
  'typescript', // Next.js layout
  'typescript', // Prisma models
  'typescript', // Task manager component
  'typescript', // Auth API route
  'sql'         // E-commerce schema
]

// Card variants using class-variance-authority for type-safe styling
const cardVariants = cva(
  // Base styles - common to all cards
  'relative overflow-hidden transition-all duration-200 select-none group',
  {
    variants: {
      // Card size variants
      size: {
        sm: 'p-3 rounded-lg',
        md: 'p-4 rounded-lg', 
        lg: 'p-6 rounded-lg',
        xl: 'p-8 rounded-xl'
      },
      // Background variants  
      background: {
        solid: '',
        gradient: '',
        code: '',
        image: '',
        glass: 'backdrop-blur-sm'
      },
      // Selection states
      state: {
        default: 'border border-gray-800',
        selected: 'border border-orange-500 bg-orange-950/20',
        hover: 'hover:border-gray-600',
        disabled: 'opacity-50 cursor-not-allowed',
        muted: 'opacity-50',
        recommended: 'border border-purple-500 bg-purple-950/20',
        highlighted: 'ring-2 ring-blue-500/30'
      },
      // Interactive behavior
      interactive: {
        none: '',
        clickable: 'cursor-pointer hover:bg-gray-800/30',
        selectable: 'cursor-pointer'
      }
    },
    defaultVariants: {
      size: 'md',
      background: 'solid', 
      state: 'default',
      interactive: 'none'
    }
  }
)

// Background pattern variants
const backgroundVariants = cva('absolute inset-0 z-0', {
  variants: {
    type: {
      code: 'font-mono text-xs text-gray-100/80 overflow-hidden',
      gradient: '',
      image: 'bg-cover bg-center',
      solid: ''
    }
  }
})

// Overlay/scrim variants  
const overlayVariants = cva('absolute inset-0 z-10', {
  variants: {
    type: {
      none: 'hidden',
      dark: 'bg-gradient-to-br from-black/60 via-black/40 to-black/60',
      darkToTransparent: 'bg-gradient-to-t from-black/80 via-black/40 to-transparent',
      colorful: 'bg-gradient-to-br from-gray-900/90 via-gray-800/60 to-gray-900/90',
      subtle: 'bg-black/20',
      code: 'bg-gradient-to-br from-black/60 via-black/80 to-black/95'
    }
  },
  defaultVariants: {
    type: 'none'
  }
})

// Using static inline snippets for instant loading

export interface CardProps extends VariantProps<typeof cardVariants> {
  children: React.ReactNode
  className?: string
  
  // Background options
  codeSnippet?: string
  backgroundImage?: string
  gradientFrom?: string
  gradientTo?: string
  
  // Overlay/scrim options  
  overlay?: 'none' | 'dark' | 'darkToTransparent' | 'colorful' | 'subtle' | 'code'
  overlayOpacity?: number
  
  // Interactive behavior
  onClick?: () => void
  onKeyDown?: (e: React.KeyboardEvent) => void
  disabled?: boolean
  
  // Accessibility
  role?: string
  tabIndex?: number
  'aria-label'?: string
  'aria-selected'?: boolean
  'aria-disabled'?: boolean
}

// Card component
export function Card({
  children,
  className,
  size,
  background = 'solid',
  state,
  interactive,
  codeSnippet,
  backgroundImage,
  gradientFrom,
  gradientTo,
  overlay = 'none',
  overlayOpacity,
  onClick,
  onKeyDown,
  disabled,
  role,
  tabIndex,
  ...props
}: CardProps) {
  
  // State for Shiki-highlighted HTML
  const [highlightedHTML, setHighlightedHTML] = React.useState<string>('')
  
  // Get raw code snippet selection (same logic as before)
  const { rawCodeSnippet, snippetLanguage } = React.useMemo(() => {
    if (background !== 'code') {
      return { rawCodeSnippet: '', snippetLanguage: 'typescript' }
    }
    
    if (codeSnippet && !codeSnippet.includes('.')) {
      // Raw code provided
      return { rawCodeSnippet: codeSnippet, snippetLanguage: 'typescript' }
    }
    
    // Extract ALL text content from the card recursively for maximum variation
    function extractAllText(node: React.ReactNode): string {
      if (typeof node === 'string') return node
      if (typeof node === 'number') return node.toString()
      if (React.isValidElement(node)) {
        let text = ''
        const props = node.props as any
        if (props && props.children) {
          React.Children.forEach(props.children, (child) => {
            text += extractAllText(child)
          })
        }
        return text
      }
      if (Array.isArray(node)) {
        return node.map(extractAllText).join('')
      }
      return ''
    }
    
    // Get all text content from the card
    const cardText = extractAllText(children)
    
    // Create hash from the card's actual text content
    let hashSeed = 1
    
    // Primary hash from card text content (this should be unique per card)
    if (cardText) {
      hashSeed = cardText.split('').reduce((acc, char, i) => {
        const charCode = char.charCodeAt(0)
        return acc + charCode * (i + 1) * 37 // Prime number multiplier
      }, hashSeed)
    }
    
    // Add className as secondary variation
    if (className) {
      hashSeed += className.split('').reduce((acc, char, i) => 
        acc + char.charCodeAt(0) * (i + 1) * 41, 0)
    }
    
    // Add other props for additional entropy
    if (size) hashSeed += size.length * 43
    if (state) hashSeed += state.length * 47
    if (interactive) hashSeed += interactive.length * 53
    
    // If we still don't have enough variation, add some based on content length and patterns
    hashSeed += cardText.length * 59
    hashSeed += (cardText.match(/[A-Z]/g) || []).length * 61 // Capital letters
    hashSeed += (cardText.match(/\d/g) || []).length * 67 // Numbers
    
    // Ensure positive and create better distribution
    hashSeed = Math.abs(hashSeed) || 1
    
    // Use golden ratio for better distribution
    const snippetIndex = Math.floor((hashSeed * 0.618033988749) % 1 * STATIC_SNIPPETS_HTML.length)
    
    return { 
      rawCodeSnippet: STATIC_SNIPPETS_HTML[snippetIndex],
      snippetLanguage: SNIPPET_LANGUAGES[snippetIndex]
    }
  }, [background, codeSnippet, className, size, state, interactive, children])

  // Async effect to highlight code with Shiki
  React.useEffect(() => {
    if (background === 'code' && rawCodeSnippet) {
      highlightCode(rawCodeSnippet, snippetLanguage)
        .then(html => setHighlightedHTML(html))
        .catch(() => {
          // Fallback to plain pre if Shiki fails
          setHighlightedHTML(`<pre class="font-mono text-xs text-gray-100/60">${rawCodeSnippet}</pre>`)
        })
    } else {
      setHighlightedHTML('')
    }
  }, [background, rawCodeSnippet, snippetLanguage])
  
  // Handle keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if ((e.key === 'Enter' || e.key === ' ') && onClick && !disabled) {
      e.preventDefault()
      onClick()
    }
    onKeyDown?.(e)
  }
  
  // Generate background styles
  const backgroundStyles = React.useMemo(() => {
    switch (background) {
      case 'gradient':
        return {
          background: `linear-gradient(135deg, ${gradientFrom || '#1f2937'}, ${gradientTo || '#111827'})`
        }
      case 'image':
        return {
          backgroundImage: `url(${backgroundImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }
      default:
        return {}
    }
  }, [background, gradientFrom, gradientTo, backgroundImage])
  
  // Generate overlay styles with custom opacity
  const overlayStyles = React.useMemo(() => {
    if (overlayOpacity !== undefined) {
      return { opacity: overlayOpacity }
    }
    return {}
  }, [overlayOpacity])
  
  return (
    <div
      className={cn(
        cardVariants({ size, background, state: disabled ? 'disabled' : state, interactive }),
        className
      )}
      onClick={disabled ? undefined : onClick}
      onKeyDown={handleKeyDown}
      role={role}
      tabIndex={disabled ? -1 : tabIndex}
      aria-disabled={disabled}
      style={backgroundStyles}
      {...props}
    >
      {/* Code Background - Shiki-powered ultra-fast syntax highlighting */}
      {background === 'code' && highlightedHTML && (
        <div className={cn(backgroundVariants({ type: 'code' }))}>
          <div 
            className="p-6 text-xs leading-relaxed overflow-hidden [&>pre]:bg-transparent [&>pre]:p-0 [&>pre]:m-0 opacity-60"
            dangerouslySetInnerHTML={{ __html: highlightedHTML }}
          />
          {/* Fade to transparent gradient mask */}
          <div className="absolute inset-0 bg-gradient-to-br from-transparent via-black/20 to-black/80 pointer-events-none" />
        </div>
      )}
      
      {/* Overlay/Scrim */}
      <div 
        className={cn(overlayVariants({ type: overlay }))}
        style={overlayStyles}
      />
      
      {/* Content */}
      <div className="relative z-20">
        {children}
      </div>
    </div>
  )
}

// Convenient sub-components for common layouts
export function CardIcon({ 
  children, 
  className,
  background = true,
  color = 'orange'
}: { 
  children: React.ReactNode
  className?: string  
  background?: boolean
  color?: 'orange' | 'purple' | 'blue' | 'green' | 'gray'
}) {
  const backgroundClass = background 
    ? {
        orange: 'bg-orange-500/20',
        purple: 'bg-purple-500/20', 
        blue: 'bg-blue-500/20',
        green: 'bg-green-500/20',
        gray: 'bg-gray-500/20'
      }[color]
    : ''
    
  const iconClass = {
    orange: 'text-orange-400',
    purple: 'text-purple-400',
    blue: 'text-blue-400', 
    green: 'text-green-400',
    gray: 'text-gray-400'
  }[color]
  
  return (
    <div className={cn('w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0', backgroundClass, className)}>
      <div className={cn('w-6 h-6', iconClass)}>
        {children}
      </div>
    </div>
  )
}

export function CardBadge({
  children,
  variant = 'default',
  className
}: {
  children: React.ReactNode
  variant?: 'default' | 'success' | 'warning' | 'info' | 'purple'
  className?: string
}) {
  const variantClasses = {
    default: 'bg-gray-900/30 text-gray-400',
    success: 'bg-green-900/30 text-green-400',
    warning: 'bg-yellow-900/30 text-yellow-400', 
    info: 'bg-blue-900/30 text-blue-400',
    purple: 'bg-purple-900/30 text-purple-400'
  }[variant]
  
  return (
    <span className={cn('px-2 py-1 rounded-full text-xs font-medium', variantClasses, className)}>
      {children}
    </span>
  )
}

export function CardHeader({ 
  children, 
  className 
}: { 
  children: React.ReactNode
  className?: string 
}) {
  return (
    <div className={cn('flex items-start justify-between mb-3', className)}>
      {children}
    </div>
  )
}

export function CardTitle({ 
  children, 
  className,
  size = 'base'
}: { 
  children: React.ReactNode
  className?: string
  size?: 'sm' | 'base' | 'lg' | 'xl'
}) {
  const sizeClasses = {
    sm: 'text-sm',
    base: 'text-base', 
    lg: 'text-lg',
    xl: 'text-xl'
  }[size]
  
  return (
    <h3 className={cn('font-semibold text-white', sizeClasses, className)}>
      {children}
    </h3>
  )
}

export function CardDescription({ 
  children, 
  className,
  color = 'orange'
}: { 
  children: React.ReactNode
  className?: string
  color?: 'orange' | 'gray' | 'blue'
}) {
  const colorClasses = {
    orange: 'text-orange-400',
    gray: 'text-gray-400',
    blue: 'text-blue-400'  
  }[color]
  
  return (
    <p className={cn('text-sm font-medium', colorClasses, className)}>
      {children}
    </p>
  )
}

export function CardMeta({ 
  children, 
  className 
}: { 
  children: React.ReactNode
  className?: string 
}) {
  return (
    <div className={cn('text-xs text-gray-500', className)}>
      {children}
    </div>
  )
}

export function CardTags({ 
  tags, 
  className,
  maxTags = 3 
}: { 
  tags: string[]
  className?: string
  maxTags?: number
}) {
  const displayTags = tags.slice(0, maxTags)
  const remainingCount = tags.length - maxTags
  
  return (
    <div className={cn('flex flex-wrap gap-1', className)}>
      {displayTags.map((tag, index) => (
        <span 
          key={index} 
          className="px-2 py-1 bg-gray-800 text-gray-300 rounded text-xs"
        >
          {tag}
        </span>
      ))}
      {remainingCount > 0 && (
        <span className="text-gray-500 text-xs">
          +{remainingCount}
        </span>
      )}
    </div>
  )
}

export function CardFooter({ 
  children, 
  className 
}: { 
  children: React.ReactNode
  className?: string 
}) {
  return (
    <div className={cn('mt-4 pt-3 border-t border-gray-700/30', className)}>
      {children}
    </div>
  )
}