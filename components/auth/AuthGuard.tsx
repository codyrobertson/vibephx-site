'use client'

import { useUser } from '@stackframe/stack'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { Card } from '@/components/ui/Card'

interface AuthGuardProps {
  children: React.ReactNode
  fallbackPath?: string
}

export default function AuthGuard({ children, fallbackPath = '/auth/signin' }: AuthGuardProps) {
  const user = useUser()
  const router = useRouter()

  useEffect(() => {
    if (user === null) {
      // User is not authenticated, redirect to sign-in
      router.push(fallbackPath)
    }
  }, [user, router, fallbackPath])

  if (user === undefined) {
    // Loading state
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <Card className="border-gray-800 bg-gray-900/50">
          <div className="text-center p-8">
            <div className="w-12 h-12 border-2 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-white mb-2">Checking authentication...</h3>
            <p className="text-gray-400">Please wait while we verify your account</p>
          </div>
        </Card>
      </div>
    )
  }

  if (user === null) {
    // Not authenticated - component will redirect via useEffect
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <Card className="border-orange-800/30 bg-orange-950/20">
          <div className="text-center p-8">
            <div className="w-16 h-16 bg-orange-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-black text-xl">⚠️</span>
            </div>
            <h3 className="text-xl font-bold text-orange-400 mb-2">Authentication Required</h3>
            <p className="text-gray-300 mb-6">
              You need to sign in to access the VibePHX Builder.
            </p>
            <div className="w-8 h-8 border-2 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto" />
          </div>
        </Card>
      </div>
    )
  }

  // User is authenticated
  return <>{children}</>
}