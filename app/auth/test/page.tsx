'use client'

import { useUser, useStackApp } from '@stackframe/stack'
import { Card } from '@/components/ui/Card'

export default function AuthTestPage() {
  const user = useUser()
  const stackApp = useStackApp()

  const handleTestSignIn = async () => {
    try {
      await stackApp.signInWithOAuth('google')
    } catch (error) {
      console.error('Test sign-in failed:', error)
    }
  }

  const handleTestSignOut = async () => {
    try {
      await stackApp.signOut()
    } catch (error) {
      console.error('Test sign-out failed:', error)
    }
  }

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4">
      <Card className="border-gray-800 bg-gray-900/50 max-w-md w-full">
        <div className="p-6 space-y-6">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-white mb-2">Stack Auth Test</h1>
            <p className="text-gray-400">Test the authentication integration</p>
          </div>

          <div className="space-y-4">
            <div className="p-4 bg-gray-800/50 rounded-lg">
              <h3 className="font-semibold text-white mb-2">Authentication Status</h3>
              {user === undefined ? (
                <p className="text-yellow-400">Loading...</p>
              ) : user === null ? (
                <p className="text-red-400">Not authenticated</p>
              ) : (
                <div className="space-y-2">
                  <p className="text-green-400">Authenticated ✓</p>
                  <div className="text-sm text-gray-300">
                    <p>Name: {user.displayName || 'No name'}</p>
                    <p>Email: {user.primaryEmail || 'No email'}</p>
                    <p>ID: {user.id}</p>
                  </div>
                </div>
              )}
            </div>

            <div className="space-y-2">
              {!user ? (
                <button
                  onClick={handleTestSignIn}
                  className="w-full px-4 py-2 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg transition-colors"
                >
                  Test Google Sign-In
                </button>
              ) : (
                <button
                  onClick={handleTestSignOut}
                  className="w-full px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg transition-colors"
                >
                  Test Sign-Out
                </button>
              )}
            </div>

            <div className="space-y-2 text-sm">
              <a
                href="/auth/signin"
                className="block w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-center font-semibold rounded-lg transition-colors"
              >
                Go to Real Sign-In Page
              </a>
              <a
                href="/builder"
                className="block w-full px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white text-center font-semibold rounded-lg transition-colors"
              >
                Test Protected Route (/builder)
              </a>
            </div>
          </div>

          <div className="text-xs text-gray-500 text-center">
            <p>Environment: {process.env.NODE_ENV}</p>
            <p>Project ID: {process.env.NEXT_PUBLIC_STACK_PROJECT_ID ? '✓' : '✗'}</p>
            <p>Publishable Key: {process.env.NEXT_PUBLIC_STACK_PUBLISHABLE_CLIENT_KEY ? '✓' : '✗'}</p>
          </div>
        </div>
      </Card>
    </div>
  )
}