import { stackServerApp } from '@/stack'

export default async function BuilderLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // Server-side protection - redirects to sign-in if not authenticated
  await stackServerApp.getUser({ or: 'redirect' })
  
  return <>{children}</>
}