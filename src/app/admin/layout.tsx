'use client'

import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'

// Disable static generation for admin pages
export const dynamic = 'force-dynamic'

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const [hasMounted, setHasMounted] = useState(false)

  useEffect(() => {
    setHasMounted(true)
  }, [])

  // Login sayfasi icin auth kontrolu yapma
  if (pathname === '/admin/login') {
    return children
  }

  // Hydration guard - show loading until client-side mounted
  if (!hasMounted) {
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

  // Client-side mounted, show admin content
  return (
    <div style={{ background: '#1A1A1A', minHeight: '100vh' }}>
      {children}
    </div>
  )
}