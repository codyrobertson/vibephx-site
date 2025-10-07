'use client'

import { useState, useEffect, useMemo, Suspense } from 'react'
import { usePathname } from 'next/navigation'
import { useUser, useStackApp } from '@stackframe/stack'
import createIcon from 'blockies-ts'
import { ChevronDown } from 'lucide-react'
import { AdminMenuItem } from './AdminMenuItem'

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
      <div className="px-3 py-2 bg-gray-900/50 border border-gray-700 rounded-lg w-32 h-12 animate-pulse" />
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
          className="flex items-center gap-3 px-3 py-2 bg-gray-900/50 hover:bg-gray-800/80 text-white border border-gray-700 hover:border-gray-600 rounded-lg transition-all"
        >
          {blockieDataUrl ? (
            <img
              src={blockieDataUrl}
              alt="User Avatar"
              className="w-8 h-8 rounded-full ring-2 ring-gray-700"
            />
          ) : (
            <div className="w-8 h-8 bg-gradient-to-br from-orange-500 to-red-500 rounded-full flex items-center justify-center ring-2 ring-gray-700 text-white font-semibold">
              {user.displayName ? user.displayName[0].toUpperCase() : 'U'}
            </div>
          )}
          <span className="hidden sm:inline text-sm font-medium">
            {user.displayName || user.primaryEmail?.split('@')[0] || 'User'}
          </span>
          <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
        </button>
        
        {isOpen && (
          <>
            {/* Backdrop */}
            <div 
              className="fixed inset-0 z-40" 
              onClick={() => setIsOpen(false)}
            />
            
            {/* Dropdown */}
            <div className="absolute right-0 top-full mt-2 w-64 bg-gray-900 border border-gray-700 rounded-lg shadow-2xl z-50 overflow-hidden">
              <div className="p-4 border-b border-gray-800 bg-gray-800/50">
                <div className="flex items-center gap-3">
                  {blockieDataUrl ? (
                    <img
                      src={blockieDataUrl}
                      alt="User Avatar"
                      className="w-10 h-10 rounded-full ring-2 ring-gray-700"
                    />
                  ) : (
                    <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-red-500 rounded-full flex items-center justify-center ring-2 ring-gray-700 text-white font-semibold">
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
              <div className="py-2">
                <a
                  href="/dashboard"
                  className="block px-4 py-2.5 text-sm text-gray-300 hover:text-white hover:bg-gray-800/50 transition-colors"
                  onClick={() => setIsOpen(false)}
                >
                  Dashboard
                </a>
                <a
                  href="/builder/prd-builder"
                  className="block px-4 py-2.5 text-sm text-gray-300 hover:text-white hover:bg-gray-800/50 transition-colors"
                  onClick={() => setIsOpen(false)}
                >
                  PRD Builder
                </a>
                <Suspense fallback={null}>
                  <AdminMenuItem onClose={() => setIsOpen(false)} />
                </Suspense>
              </div>
              <div className="border-t border-gray-800">
                <button
                  onClick={handleSignOut}
                  className="w-full text-left px-4 py-2.5 text-sm text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-colors"
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
      className="px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white font-semibold rounded-lg transition-colors shadow-lg shadow-orange-500/20"
    >
      Sign In
    </a>
  )
}