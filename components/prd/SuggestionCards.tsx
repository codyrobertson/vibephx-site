'use client'

import Image from 'next/image'
import { cn } from '@/lib/utils'

export type SuggestionItem = {
  id: string
  title: string
  description?: string
  logo?: string
}

export function SuggestionCards({
  items,
  onSelect,
  className,
}: {
  items: SuggestionItem[]
  onSelect: (id: string) => void
  className?: string
}) {
  return (
    <div className={cn('grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3', className)}>
      {items.map((it) => (
        <button
          key={it.id}
          onClick={() => onSelect(it.id)}
          className="group text-left p-4 rounded-xl border border-gray-800 bg-gray-900/60 hover:border-orange-500 hover:bg-gray-900 transition-colors"
        >
          <div className="flex items-center gap-3">
            {it.logo && (
              <Image src={it.logo} alt="" width={24} height={24} className="rounded" />
            )}
            <div>
              <div className="text-white font-medium group-hover:text-orange-400">
                {it.title}
              </div>
              {it.description && (
                <div className="text-xs text-gray-400 mt-1 line-clamp-3">
                  {it.description}
                </div>
              )}
            </div>
          </div>
        </button>
      ))}
    </div>
  )
}


