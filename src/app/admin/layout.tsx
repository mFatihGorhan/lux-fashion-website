'use client'

import { useRequireAdmin } from '@/lib/auth/hooks'
import { usePathname } from 'next/navigation'

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const { isAdmin, isLoading } = useRequireAdmin()

  // Login sayfasi icin auth kontrolu yapma
  if (pathname === '/admin/login') {
    return children
  }

  // Loading state
  if (isLoading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        minHeight: '100vh',
        background: '#1A1A1A',
        color: 'white'
      }}>
        <div>Yukleniyor...</div>
      </div>
    )
  }

  // Auth check passed
  if (isAdmin) {
    return (
      <div style={{ background: '#1A1A1A', minHeight: '100vh' }}>
        {children}
      </div>
    )
  }

  // Auth check failed - hook will redirect
  return null
}