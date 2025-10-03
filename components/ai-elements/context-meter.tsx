'use client'

import { cn } from '@/lib/utils'

interface ContextMeterProps extends React.HTMLAttributes<HTMLDivElement> {
  currentTokens: number
  maxTokens: number
  showLabel?: boolean
}

export function ContextMeter({
  currentTokens,
  maxTokens,
  showLabel = true,
  className,
  ...props
}: ContextMeterProps) {
  const percentage = Math.min((currentTokens / maxTokens) * 100, 100)
  const isWarning = percentage > 70
  const isCritical = percentage > 90

  return (
    <div className={cn('space-y-1', className)} {...props}>
      {showLabel && (
        <div className="flex items-center justify-between text-xs">
          <span className={cn(
            'font-medium',
            isCritical ? 'text-red-400' : isWarning ? 'text-yellow-400' : 'text-gray-400'
          )}>
            Context
          </span>
          <span className={cn(
            'font-mono',
            isCritical ? 'text-red-400' : isWarning ? 'text-yellow-400' : 'text-gray-400'
          )}>
            {currentTokens.toLocaleString()} / {maxTokens.toLocaleString()}
          </span>
        </div>
      )}
      <div className="w-full bg-gray-800 rounded-full h-1.5 overflow-hidden">
        <div
          className={cn(
            'h-full transition-all duration-300',
            isCritical ? 'bg-red-500' : isWarning ? 'bg-yellow-500' : 'bg-green-500'
          )}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  )
}
