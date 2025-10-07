import ProtectedContent from '@/components/auth/ProtectedContent'

export default function ResourcesLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ProtectedContent redirectTo="/auth/signin">
      {children}
    </ProtectedContent>
  )
}
