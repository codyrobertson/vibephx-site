'use client'

import { cn } from '@/lib/utils'
import { ComponentProps, ReactNode } from 'react'

interface ActionsProps extends ComponentProps<'div'> {
  children: ReactNode
}

export function Actions({ children, className, ...props }: ActionsProps) {
  return (
    <div
      className={cn('flex items-center gap-1', className)}
      {...props}
    >
      {children}
    </div>
  )
}

interface ActionProps extends ComponentProps<'button'> {
  label: string
  children: ReactNode
}

export function Action({ label, children, className, ...props }: ActionProps) {
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      className={cn(
        'inline-flex items-center justify-center',
        'h-8 w-8 rounded-md',
        'text-gray-400 hover:text-white',
        'hover:bg-gray-800',
        'transition-colors duration-200',
        'disabled:opacity-50 disabled:cursor-not-allowed',
        className
      )}
      {...props}
    >
      {children}
    </button>
  )
}
