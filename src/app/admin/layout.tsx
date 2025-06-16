'use client'

import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'
import dynamic from 'next/dynamic'
import AdminHeader from '@/components/admin/layout/AdminHeader'
import styles from './admin-layout.module.css'

const AdminSidebar = dynamic(() => import('@/components/admin/layout/AdminSidebar'), {
  loading: () => <div className={styles.sidebarLoading}>Loading...</div>,
  ssr: true
})

// Admin layout is client-side rendered

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const [hasMounted, setHasMounted] = useState(false)
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)

  useEffect(() => {
    setHasMounted(true)
  }, [])

  const handleMenuToggle = () => {
    setIsSidebarOpen(!isSidebarOpen)
  }

  const handleSidebarClose = () => {
    setIsSidebarOpen(false)
  }

  // Login sayfasi icin auth kontrolu yapma
  if (pathname === '/admin/login') {
    return children
  }

  // Hydration guard - show loading until client-side mounted
  if (!hasMounted) {
    return (
      <div className={styles.loading}>
        <div>Yukleniyor...</div>
      </div>
    )
  }

  // Client-side mounted, show admin content with layout
  return (
    <div className={styles.adminLayout}>
      <AdminHeader onMenuToggle={handleMenuToggle} />
      <div className={styles.adminContent}>
        <AdminSidebar 
          isOpen={isSidebarOpen} 
          onClose={handleSidebarClose} 
        />
        <main className={styles.mainContent}>
          {children}
        </main>
      </div>
    </div>
  )
}