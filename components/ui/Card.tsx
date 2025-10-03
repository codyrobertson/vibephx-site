import * as React from "react"

import { cn } from "@/lib/utils"

const Card = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "rounded-xl border bg-card text-card-foreground shadow",
      className
    )}
    {...props}
  />
))
Card.displayName = "Card"

const CardHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex flex-col space-y-1.5 p-6", className)}
    {...props}
  />
))
CardHeader.displayName = "CardHeader"

const CardTitle = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("font-semibold leading-none tracking-tight", className)}
    {...props}
  />
))
CardTitle.displayName = "CardTitle"

const CardDescription = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("text-sm text-muted-foreground", className)}
    {...props}
  />
))
CardDescription.displayName = "CardDescription"

const CardContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("p-6 pt-0", className)} {...props} />
))
CardContent.displayName = "CardContent"

const CardFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex items-center p-6 pt-0", className)}
    {...props}
  />
))
CardFooter.displayName = "CardFooter"

const CardIcon = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & { color?: string }
>(({ className, color = 'orange', ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "w-10 h-10 rounded-lg flex items-center justify-center",
      color === 'orange' && "bg-orange-500/10 text-orange-500",
      className
    )}
    {...props}
  />
))
CardIcon.displayName = "CardIcon"

const CardBadge = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & { variant?: 'success' | 'warning' | 'default' }
>(({ className, variant = 'default', ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "px-2 py-1 rounded text-xs font-medium",
      variant === 'success' && "bg-green-500/10 text-green-500",
      variant === 'warning' && "bg-yellow-500/10 text-yellow-500",
      variant === 'default' && "bg-gray-500/10 text-gray-500",
      className
    )}
    {...props}
  />
))
CardBadge.displayName = "CardBadge"

const CardMeta = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("text-xs text-gray-400", className)}
    {...props}
  />
))
CardMeta.displayName = "CardMeta"

const CardTags = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & { tags: string[]; maxTags?: number }
>(({ className, tags, maxTags = 3, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex flex-wrap gap-1", className)}
    {...props}
  >
    {tags.slice(0, maxTags).map((tag, i) => (
      <span key={i} className="px-2 py-1 bg-gray-800 text-gray-400 rounded text-xs">
        {tag}
      </span>
    ))}
    {tags.length > maxTags && (
      <span className="px-2 py-1 bg-gray-800 text-gray-400 rounded text-xs">
        +{tags.length - maxTags}
      </span>
    )}
  </div>
))
CardTags.displayName = "CardTags"

export { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent, CardIcon, CardBadge, CardMeta, CardTags }
