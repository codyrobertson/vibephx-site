'use client'

import { useUser } from '@stackframe/stack'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { Card } from '@/components/ui/card'

interface ProtectedContentProps {
  children: React.ReactNode
  redirectTo?: string
}

export default function ProtectedContent({ children, redirectTo = '/auth/signin' }: ProtectedContentProps) {
  const user = useUser()
  const router = useRouter()

  useEffect(() => {
    if (user === null) {
      router.push(redirectTo)
    }
  }, [user, router, redirectTo])

  if (user === undefined) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <Card className="border-gray-800 bg-gray-900/50">
          <div className="text-center p-8">
            <div className="w-12 h-12 border-2 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-white mb-2">Checking authentication...</h3>
            <p className="text-gray-400">Please wait</p>
          </div>
        </Card>
      </div>
    )
  }

  if (user === null) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <Card className="border-orange-800/30 bg-orange-950/20">
          <div className="text-center p-8">
            <div className="w-16 h-16 bg-orange-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-black text-xl">⚠️</span>
            </div>
            <h3 className="text-xl font-bold text-orange-400 mb-2">Authentication Required</h3>
            <p className="text-gray-300 mb-6">
              You need to sign in to access this content.
            </p>
            <div className="w-8 h-8 border-2 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto" />
          </div>
        </Card>
      </div>
    )
  }

  return <>{children}</>
}
