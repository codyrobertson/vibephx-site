'use client'

import { cn } from '@/lib/utils'

interface AIAvatarProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: 'sm' | 'md' | 'lg'
}

export function AIAvatar({ size = 'md', className, ...props }: AIAvatarProps) {
  const sizeClasses = {
    sm: 'w-6 h-6',
    md: 'w-8 h-8',
    lg: 'w-12 h-12'
  }

  return (
    <div className={cn('flex items-center justify-center', sizeClasses[size], className)} {...props}>
      <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
        {/* Outer circle */}
        <circle cx="50" cy="50" r="45" stroke="#FF6900" strokeWidth="3" fill="none"/>

        {/* Robot head body */}
        <rect x="30" y="35" width="40" height="30" rx="4" stroke="#FF6900" strokeWidth="2.5" fill="none"/>

        {/* Antenna */}
        <line x1="50" y1="25" x2="50" y2="35" stroke="#FF6900" strokeWidth="2.5" strokeLinecap="round"/>
        <circle cx="50" cy="22" r="3" fill="#FF6900"/>

        {/* Left eye */}
        <circle cx="40" cy="45" r="2.5" fill="#FF6900"/>

        {/* Right eye */}
        <circle cx="60" cy="45" r="2.5" fill="#FF6900"/>

        {/* Smile */}
        <path d="M 38 54 Q 50 58 62 54" stroke="#FF6900" strokeWidth="2.5" strokeLinecap="round" fill="none"/>

        {/* Side panel/buttons */}
        <rect x="66" y="45" width="6" height="12" rx="1" stroke="#FF6900" strokeWidth="2" fill="none"/>
        <line x1="67" y1="49" x2="71" y2="49" stroke="#FF6900" strokeWidth="1.5"/>
        <line x1="67" y1="53" x2="71" y2="53" stroke="#FF6900" strokeWidth="1.5"/>
      </svg>
    </div>
  )
}
