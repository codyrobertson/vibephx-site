import { ReactNode } from 'react'
import { cn } from '@/lib/utils'

interface PageFooterProps {
  children?: ReactNode
  className?: string
}

export function PageFooter({ children, className }: PageFooterProps) {
  return (
    <footer className={cn('mt-auto pt-8 pb-6 border-t border-gray-800', className)}>
      <div className="container mx-auto px-4">
        {children || (
          <div className="flex items-center justify-between text-sm text-gray-500">
            <p>&copy; {new Date().getFullYear()} Vibe Code PHX. All rights reserved.</p>
            <p>Built with Next.js & shadcn/ui</p>
          </div>
        )}
      </div>
    </footer>
  )
}
