import { Suspense } from 'react'
import AuthGuard from '@/components/auth/AuthGuard'

function DashboardLoading() {
  return (
    <div className="min-h-screen bg-black flex items-center justify-center">
      <div className="w-8 h-8 border-2 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
    </div>
  )
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <Suspense fallback={<DashboardLoading />}>
      <AuthGuard>
        {children}
      </AuthGuard>
    </Suspense>
  )
}