'use client'

import { useUser } from '@stackframe/stack'
import Link from 'next/link'
import { Settings } from 'lucide-react'

export function AdminNavLink() {
  const user = useUser()

  // Check if user is admin
  const isAdmin = user?.primaryEmail === 'digitalcody@gmail.com'

  if (!isAdmin) return null

  return (
    <Link
      href="/admin/workshops"
      className="flex items-center gap-2 text-orange-400 hover:text-orange-300 transition-colors"
    >
      <Settings className="w-5 h-5" />
      <span className="font-medium">Admin</span>
    </Link>
  )
}
