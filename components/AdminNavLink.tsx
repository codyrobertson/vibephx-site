'use client'

import { useUser } from '@stackframe/stack'
import Link from 'next/link'
import { Settings } from 'lucide-react'
import { Button } from '@/components/ui/button'

export function AdminNavLink() {
  const user = useUser()

  // Check if user is admin
  const isAdmin = user?.primaryEmail === 'digitalcody@gmail.com'

  if (!isAdmin) return null

  return (
    <Link href="/admin">
      <Button
        variant="ghost"
        size="sm"
        className="flex items-center gap-2 text-orange-400 hover:text-orange-300 hover:bg-orange-500/10"
      >
        <Settings className="w-4 h-4" />
        <span className="font-medium">Admin</span>
      </Button>
    </Link>
  )
}
