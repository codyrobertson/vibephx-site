import { stackServerApp } from '@/stack'
import { cache } from 'react'

// Cache auth check per request to avoid redundant calls
const getCachedUser = cache(async () => {
  return await stackServerApp.getUser({ or: 'redirect' })
})

export default async function BuilderLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // Server-side protection - redirects to sign-in if not authenticated
  // Cached per request to improve performance
  await getCachedUser()

  // Full-screen layout - start below navbar, fill rest of viewport
  return (
    <div className="fixed top-16 md:top-20 bottom-0 left-0 right-0 overflow-hidden bg-black">
      {children}
    </div>
  )
}