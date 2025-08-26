'use client'

import { useState } from 'react'
import Image from 'next/image'
import type { IconProps } from '@radix-ui/react-icons/dist/types'

interface BrandLogoProps {
  src?: string
  alt: string
  fallbackIcon?: React.ComponentType<IconProps>
  className?: string
  size?: number
}

export default function BrandLogo({ 
  src, 
  alt, 
  fallbackIcon: FallbackIcon, 
  className = "w-8 h-8",
  size = 32
}: BrandLogoProps) {
  const [imageError, setImageError] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  if (!src || imageError) {
    return FallbackIcon ? (
      <FallbackIcon className={`${className} text-orange-400`} />
    ) : (
      <div className={`${className} bg-gray-600 rounded flex items-center justify-center text-xs font-bold text-white`}>
        {alt.substring(0, 2).toUpperCase()}
      </div>
    )
  }

  return (
    <>
      {isLoading && FallbackIcon && (
        <FallbackIcon className={`${className} text-orange-400 opacity-50`} />
      )}
      <Image
        src={src}
        alt={alt}
        width={size}
        height={size}
        className={`${className} ${isLoading ? 'opacity-0 absolute' : 'opacity-100'} transition-opacity duration-200`}
        onLoad={() => setIsLoading(false)}
        onError={() => {
          console.warn(`Failed to load image: ${src}`)
          setImageError(true)
          setIsLoading(false)
        }}
        unoptimized={src.includes('favicon.ico')} // Don't optimize favicons
      />
    </>
  )
}