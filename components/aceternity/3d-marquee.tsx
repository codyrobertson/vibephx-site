'use client'

import React from 'react'
import { cn } from '@/lib/utils'

interface ThreeDMarqueeProps {
  className?: string
  children: React.ReactNode[]
}

export function ThreeDMarquee({ className, children }: ThreeDMarqueeProps) {
  return (
    <div className={cn("relative h-[400px] w-full overflow-hidden", className)}>
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="relative h-full w-full perspective-1000">
          {/* First row - moving right */}
          <div className="absolute top-0 flex animate-marquee-3d space-x-4">
            {children.slice(0, Math.ceil(children.length / 3)).map((child, index) => (
              <div key={`row1-${index}`} className="flex-shrink-0 transform-gpu rotate-y-12">
                {child}
              </div>
            ))}
            {/* Duplicate for seamless loop */}
            {children.slice(0, Math.ceil(children.length / 3)).map((child, index) => (
              <div key={`row1-dup-${index}`} className="flex-shrink-0 transform-gpu rotate-y-12">
                {child}
              </div>
            ))}
          </div>

          {/* Second row - moving left, slightly offset */}
          <div className="absolute top-32 flex animate-marquee-3d-reverse space-x-4">
            {children.slice(Math.ceil(children.length / 3), Math.ceil((children.length * 2) / 3)).map((child, index) => (
              <div key={`row2-${index}`} className="flex-shrink-0 transform-gpu -rotate-y-6">
                {child}
              </div>
            ))}
            {/* Duplicate for seamless loop */}
            {children.slice(Math.ceil(children.length / 3), Math.ceil((children.length * 2) / 3)).map((child, index) => (
              <div key={`row2-dup-${index}`} className="flex-shrink-0 transform-gpu -rotate-y-6">
                {child}
              </div>
            ))}
          </div>

          {/* Third row - moving right again */}
          <div className="absolute top-64 flex animate-marquee-3d space-x-4">
            {children.slice(Math.ceil((children.length * 2) / 3)).map((child, index) => (
              <div key={`row3-${index}`} className="flex-shrink-0 transform-gpu rotate-y-8">
                {child}
              </div>
            ))}
            {/* Duplicate for seamless loop */}
            {children.slice(Math.ceil((children.length * 2) / 3)).map((child, index) => (
              <div key={`row3-dup-${index}`} className="flex-shrink-0 transform-gpu rotate-y-8">
                {child}
              </div>
            ))}
          </div>
        </div>
      </div>
      
      {/* Gradient overlays for fade effect */}
      <div className="pointer-events-none absolute inset-y-0 left-0 w-20 bg-gradient-to-r from-black to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 right-0 w-20 bg-gradient-to-l from-black to-transparent" />
    </div>
  )
}