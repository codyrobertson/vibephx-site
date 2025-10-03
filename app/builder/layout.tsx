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

  return <>{children}</>
}