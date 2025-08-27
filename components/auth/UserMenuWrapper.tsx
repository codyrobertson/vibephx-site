'use client'

import { Suspense } from 'react'
import SimpleUserMenu from './SimpleUserMenu'

function UserMenuFallback() {
  return (
    <div className="flex items-center gap-4">
      <div className="w-8 h-8 bg-gray-800 rounded-full animate-pulse"></div>
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