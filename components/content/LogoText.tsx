'use client'

import { getCachedLogoUrl } from '@/lib/logoCache'
import { getServiceLogoDomain } from '@/lib/content/logo-mapper'
import { useState } from 'react'

interface LogoTextProps {
  service: string
  children?: React.ReactNode
  size?: '12' | '16' | '20' | '24'
  className?: string
}

/**
 * Renders service name with inline logo
 * Example: <LogoText service="ChatGPT" /> → [OpenAI logo] ChatGPT
 */
export function LogoText({ service, children, size = '16', className = '' }: LogoTextProps) {
  const [imageError, setImageError] = useState(false)
  const domain = getServiceLogoDomain(service)

  if (!domain || imageError) {
    // Fallback: just render text if no logo found
    return <span className={className}>{children || service}</span>
  }

  const logoUrl = getCachedLogoUrl(domain, size)

  return (
    <span className={`inline-flex items-center gap-1.5 ${className}`}>
      <img
        src={logoUrl}
        alt={`${service} logo`}
        className="inline-block rounded-sm"
        width={size}
        height={size}
        onError={() => setImageError(true)}
        loading="lazy"
      />
      <span>{children || service}</span>
    </span>
  )
}
