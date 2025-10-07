'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { LucideIcon } from 'lucide-react'

export interface SidebarItem {
  title: string
  href: string
  icon?: LucideIcon
  badge?: string | number
}

interface SidebarProps {
  items: SidebarItem[]
  className?: string
}

export function Sidebar({ items, className }: SidebarProps) {
  const pathname = usePathname()

  return (
    <aside className={cn('w-64 border-r border-gray-800 bg-gray-900/30 p-4 space-y-1', className)}>
      {items.map((item) => {
        const isActive = pathname === item.href || pathname?.startsWith(`${item.href}/`)
        const Icon = item.icon

        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              'flex items-center justify-between px-3 py-2 rounded-lg text-sm font-medium transition-colors',
              isActive
                ? 'bg-orange-500/10 text-orange-400 border border-orange-500/20'
                : 'text-gray-400 hover:text-white hover:bg-gray-800/50'
            )}
          >
            <div className="flex items-center gap-3">
              {Icon && <Icon className="w-4 h-4" />}
              <span>{item.title}</span>
            </div>
            {item.badge !== undefined && (
              <span
                className={cn(
                  'px-2 py-0.5 rounded-full text-xs font-semibold',
                  isActive
                    ? 'bg-orange-500/20 text-orange-300'
                    : 'bg-gray-800 text-gray-400'
                )}
              >
                {item.badge}
              </span>
            )}
          </Link>
        )
      })}
    </aside>
  )
}
