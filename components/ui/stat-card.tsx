import { ReactNode } from 'react'
import { cn } from '@/lib/utils'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { LucideIcon } from 'lucide-react'

export interface StatCardProps {
  title: string
  value: string | number
  description?: string
  icon?: LucideIcon
  trend?: {
    value: number
    isPositive: boolean
  }
  className?: string
  gradient?: 'gray' | 'green' | 'orange' | 'blue' | 'purple' | 'red'
}

const gradients = {
  gray: 'from-gray-900/50 to-gray-900/30',
  green: 'from-green-900/20 to-gray-900/30',
  orange: 'from-orange-900/20 to-gray-900/30',
  blue: 'from-blue-900/20 to-gray-900/30',
  purple: 'from-purple-900/20 to-gray-900/30',
  red: 'from-red-900/20 to-gray-900/30',
}

const iconColors = {
  gray: 'text-gray-400',
  green: 'text-green-400',
  orange: 'text-orange-400',
  blue: 'text-blue-400',
  purple: 'text-purple-400',
  red: 'text-red-400',
}

export function StatCard({
  title,
  value,
  description,
  icon: Icon,
  trend,
  className,
  gradient = 'gray',
}: StatCardProps) {
  return (
    <Card className={cn('border-gray-800 bg-gradient-to-br', gradients[gradient], className)}>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium text-gray-400 flex items-center gap-2">
          {Icon && <Icon className={cn('w-4 h-4', iconColors[gradient])} />}
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-baseline gap-2">
          <div className={cn('text-3xl font-bold', iconColors[gradient].replace('400', '300'))}>
            {value}
          </div>
          {trend && (
            <span
              className={cn(
                'text-xs font-semibold',
                trend.isPositive ? 'text-green-400' : 'text-red-400'
              )}
            >
              {trend.isPositive ? '+' : ''}{trend.value}%
            </span>
          )}
        </div>
        {description && (
          <p className="text-xs text-gray-500 mt-1">{description}</p>
        )}
      </CardContent>
    </Card>
  )
}
