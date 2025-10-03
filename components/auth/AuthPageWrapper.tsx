'use client'

import { useUser } from '@stackframe/stack'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { Card } from '@/components/ui/Card'

interface AuthPageWrapperProps {
  children: React.ReactNode
}

export default function AuthPageWrapper({ children }: AuthPageWrapperProps) {
  const user = useUser()
  const router = useRouter()

  useEffect(() => {
    if (user) {
      // User is already signed in, redirect to dashboard
      router.push('/dashboard')
    }
  }, [user, router])

  if (user === undefined) {
    // Loading state
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <Card className="border-gray-800 bg-gray-900/50">
          <div className="text-center p-8">
            <div className="w-12 h-12 border-2 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-white mb-2">Loading...</h3>
            <p className="text-gray-400">Checking authentication status</p>
          </div>
        </Card>
      </div>
    )
  }

  if (user) {
    // User is signed in, will redirect via useEffect
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <Card className="border-green-800/30 bg-green-950/20">
          <div className="text-center p-8">
            <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">✓</span>
            </div>
            <h3 className="text-xl font-bold text-green-400 mb-2">Already signed in!</h3>
            <p className="text-gray-300 mb-4">
              Redirecting to your dashboard...
            </p>
            <div className="w-8 h-8 border-2 border-green-500 border-t-transparent rounded-full animate-spin mx-auto" />
          </div>
        </Card>
      </div>
    )
  }

  // User is not signed in, show auth form
  return <>{children}</>
}