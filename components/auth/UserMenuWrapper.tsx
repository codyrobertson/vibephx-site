'use client'

import { Suspense } from 'react'
import SimpleUserMenu from './SimpleUserMenu'

function UserMenuFallback() {
  return (
    <div className="flex items-center gap-4">
      <div className="px-3 py-2 bg-gray-900/50 border border-gray-700 rounded-lg w-32 h-12 animate-pulse"></div>
    </div>
  )
}

export default function UserMenuWrapper() {
  return (
    <Suspense fallback={<UserMenuFallback />}>
      <SimpleUserMenu />
    </Suspense>
  )
}