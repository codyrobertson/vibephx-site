'use client'

import { useUser } from '@stackframe/stack'

interface AdminMenuItemProps {
  onClose: () => void
}

export function AdminMenuItem({ onClose }: AdminMenuItemProps) {
  const user = useUser()

  // Check if user is admin
  const isAdmin = user?.primaryEmail === 'digitalcody@gmail.com'

  if (!isAdmin) return null

  return (
    <a
      href="/admin/workshops"
      className="block px-4 py-2 text-sm text-orange-400 hover:bg-gray-800 transition-colors"
      onClick={onClose}
    >
      Admin
    </a>
  )
}
