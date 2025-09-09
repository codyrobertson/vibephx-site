'use client'

import { useUser, useStackApp } from '@stackframe/stack'
import { useState } from 'react'
import { PersonIcon, ExitIcon, DashboardIcon } from '@radix-ui/react-icons'
import Link from 'next/link'

export default function UserMenu() {
  const user = useUser()
  const stackApp = useStackApp()
  const [showDropdown, setShowDropdown] = useState(false)

  if (!user) {
    return (
      <a
        href="/auth/signin"
        className="px-4 py-2 bg-orange-500 hover:bg-orange-600 text-black font-semibold rounded-lg transition-colors"
      >
        Sign In
      </a>
    )
  }

  const handleSignOut = async () => {
    try {
      await user?.signOut()
      setShowDropdown(false)
    } catch (error) {
      console.error('Sign out failed:', error)
    }
  }

  return (
    <div className="relative">
      <button
        onClick={() => setShowDropdown(!showDropdown)}
        className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-800 transition-colors"
      >
        <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center">
          {user.profileImageUrl ? (
            <img
              src={user.profileImageUrl}
              alt={user.displayName || 'User'}
              className="w-8 h-8 rounded-full"
            />
          ) : (
            <PersonIcon className="w-4 h-4 text-black" />
          )}
        </div>
        <span className="text-sm font-medium text-white hidden md:block">
          {user.displayName || user.primaryEmail}
        </span>
      </button>

      {showDropdown && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-10"
            onClick={() => setShowDropdown(false)}
          />
          
          {/* Dropdown */}
          <div className="absolute right-0 mt-2 w-48 bg-gray-900 rounded-lg border border-gray-700 shadow-lg z-20">
            <div className="p-3 border-b border-gray-700">
              <p className="text-sm font-medium text-white">
                {user.displayName}
              </p>
              <p className="text-xs text-gray-400">
                {user.primaryEmail}
              </p>
            </div>
            
            <div className="py-1">
              <Link
                href="/dashboard"
                onClick={() => setShowDropdown(false)}
                className="w-full flex items-center gap-2 px-3 py-2 text-left text-sm text-gray-300 hover:bg-gray-800 hover:text-white transition-colors"
              >
                <DashboardIcon className="w-4 h-4" />
                My Projects
              </Link>
              
              <button
                onClick={handleSignOut}
                className="w-full flex items-center gap-2 px-3 py-2 text-left text-sm text-gray-300 hover:bg-gray-800 hover:text-white transition-colors"
              >
                <ExitIcon className="w-4 h-4" />
                Sign out
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  )
}