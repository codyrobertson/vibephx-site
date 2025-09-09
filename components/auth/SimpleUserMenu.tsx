'use client'

import { useState, useEffect, useMemo } from 'react'
import { usePathname } from 'next/navigation'
import { useUser, useStackApp } from '@stackframe/stack'
import createIcon from 'blockies-ts'

export default function SimpleUserMenu() {
  const pathname = usePathname()
  const [isOpen, setIsOpen] = useState(false)
  const [mounted, setMounted] = useState(false)
  
  useEffect(() => {
    setMounted(true)
  }, [])

  const user = useUser()
  const stackApp = useStackApp()

  // Generate Blockie avatar
  const blockieDataUrl = useMemo(() => {
    if (!user?.primaryEmail) return null
    const canvas = createIcon.create({
      seed: user.primaryEmail,
      size: 8,
      scale: 4,
    })
    return canvas.toDataURL()
  }, [user?.primaryEmail])

  // Don't render on server or while loading
  if (!mounted) {
    return (
      <div className="px-4 py-2 bg-gray-800 rounded-lg w-20 h-10 animate-pulse" />
    )
  }

  const handleSignOut = async () => {
    try {
      await user?.signOut()
      setIsOpen(false)
    } catch (error) {
      console.error('Sign out failed:', error)
    }
  }
  
  // User is signed in
  if (user) {
    return (
      <div className="relative">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center gap-2 px-3 py-2 bg-gray-800 hover:bg-gray-700 text-white border border-gray-600 hover:border-gray-500 rounded-lg transition-colors"
        >
          {blockieDataUrl ? (
            <img 
              src={blockieDataUrl} 
              alt="User Avatar" 
              className="w-6 h-6 rounded-full"
            />
          ) : (
            <div className="w-6 h-6 bg-gray-600 rounded-full flex items-center justify-center">
              {user.displayName ? user.displayName[0].toUpperCase() : 'U'}
            </div>
          )}
          <span className="hidden sm:inline text-sm font-medium">
            {user.displayName || user.primaryEmail?.split('@')[0] || 'User'}
          </span>
        </button>
        
        {isOpen && (
          <>
            {/* Backdrop */}
            <div 
              className="fixed inset-0 z-40" 
              onClick={() => setIsOpen(false)}
            />
            
            {/* Dropdown */}
            <div className="absolute right-0 top-full mt-2 w-56 bg-gray-900 border border-gray-700 rounded-lg shadow-xl z-50">
              <div className="p-3 border-b border-gray-700">
                <div className="flex items-center gap-3">
                  {blockieDataUrl ? (
                    <img 
                      src={blockieDataUrl} 
                      alt="User Avatar" 
                      className="w-8 h-8 rounded-full"
                    />
                  ) : (
                    <div className="w-8 h-8 bg-gray-600 rounded-full flex items-center justify-center">
                      {user.displayName ? user.displayName[0].toUpperCase() : 'U'}
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-white text-sm truncate">
                      {user.displayName || 'User'}
                    </p>
                    <p className="text-gray-400 text-xs truncate">
                      {user.primaryEmail}
                    </p>
                  </div>
                </div>
              </div>
              <div className="py-1">
                <a
                  href="/dashboard"
                  className="block px-4 py-2 text-sm text-white hover:bg-gray-800 transition-colors"
                  onClick={() => setIsOpen(false)}
                >
                  Dashboard
                </a>
                <a
                  href="/builder"
                  className="block px-4 py-2 text-sm text-white hover:bg-gray-800 transition-colors"
                  onClick={() => setIsOpen(false)}
                >
                  Builder
                </a>
                <button
                  onClick={handleSignOut}
                  className="w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-gray-800 transition-colors"
                >
                  Sign Out
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    )
  }
  
  // Special case for auth pages
  if (pathname.startsWith('/auth')) {
    return (
      <a
        href="/"
        className="px-4 py-2 border border-gray-600 hover:border-gray-400 text-white rounded-lg transition-colors"
      >
        Back to Home
      </a>
    )
  }
  
  // Default: show sign in button
  return (
    <a
      href="/auth/signin"
      className="px-4 py-2 bg-orange-500 hover:bg-orange-600 text-black font-semibold rounded-lg transition-colors"
    >
      Sign In
    </a>
  )
}