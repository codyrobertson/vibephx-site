'use client'

import { useState, useEffect } from 'react'
import { useStackApp, useUser } from '@stackframe/stack'
import { Card } from '@/components/ui/Card'

export default function SimpleSignInForm() {
  const [loading, setLoading] = useState(false)
  const [mounted, setMounted] = useState(false)
  const stackApp = useStackApp()
  const user = useUser()

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    // If user is already signed in, redirect to builder
    if (user) {
      window.location.href = '/builder'
    }
  }, [user])

  const handleSignIn = async () => {
    setLoading(true)
    try {
      await stackApp.signInWithOAuth('google')
    } catch (error) {
      console.error('Sign in failed:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden px-6 md:px-8 lg:px-12">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-orange-600/20 via-black to-red-900/20" />
      
      {/* Twinkling stars */}
      {mounted && (
        <div className="absolute inset-0">
          {[...Array(50)].map((_, i) => (
            <div
              key={i}
              className="absolute rounded-full animate-twinkle"
              style={{
                left: `${(i * 17) % 100}%`,
                top: `${(i * 23) % 100}%`,
                width: i % 3 === 0 ? '2px' : '1px',
                height: i % 3 === 0 ? '2px' : '1px',
                backgroundColor: i % 5 === 0 ? 'rgb(251 191 36 / 0.6)' : 'rgb(255 255 255 / 0.4)',
                animationDelay: `${(i * 0.3) % 8}s`,
                animationDuration: `${2 + (i * 0.1) % 4}s`
              }}
            />
          ))}
        </div>
      )}

      <div className="relative z-10 max-w-md mx-auto text-center">
        {/* Welcome Text */}
        <div className={`text-center mb-8 ${mounted ? 'animate-fade-in' : 'opacity-0'}`}>
          <h1 className="text-4xl font-bold text-white mb-4">Welcome to VibePHX Builder</h1>
          <p className="text-gray-300 text-lg">
            Sign in to save your AI-generated project ideas and access the full builder experience
          </p>
        </div>

        {/* Sign-in form */}
        <div className={`w-full ${mounted ? 'animate-slide-up' : 'opacity-0'}`} style={{ animationDelay: '0.1s' }}>
          <Card className="border-gray-800 bg-gray-900/95 backdrop-blur-md shadow-2xl" size="lg">
            <div className="p-8 space-y-6">
              <div className="text-center">
                <div className="w-16 h-16 bg-orange-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-black" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                  </svg>
                </div>
                <h2 className="text-xl font-bold text-white mb-2">Sign in with Google</h2>
                <p className="text-gray-400 text-sm mb-6">
                  Quick and secure sign-in to save your projects and access AI-powered features
                </p>
              </div>

              <button
                onClick={handleSignIn}
                disabled={loading}
                className="w-full flex items-center justify-center gap-3 px-6 py-3 bg-white hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed text-black font-semibold rounded-lg transition-colors"
              >
                {loading ? (
                  <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin" />
                ) : (
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                  </svg>
                )}
                {loading ? 'Signing in...' : 'Continue with Google'}
              </button>

              <div className="text-center">
                <p className="text-xs text-gray-500">
                  By signing in, you agree to our terms and privacy policy.
                  We'll only access your basic profile information.
                </p>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </section>
  )
}