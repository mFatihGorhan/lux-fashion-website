'use client'

import { useAuth } from '@/lib/auth/hooks'
import { signOut } from 'next-auth/react'
import { LogOut, User, Menu } from 'lucide-react'
import styles from './AdminHeader.module.css'

interface AdminHeaderProps {
  onMenuToggle?: () => void
}

export default function AdminHeader({ onMenuToggle }: AdminHeaderProps) {
  const { user } = useAuth()

  const handleLogout = () => {
    signOut({ callbackUrl: '/' })
  }

  return (
    <header className={styles.header}>
      <div className={styles.container}>
        <div className={styles.left}>
          <button 
            className={styles.mobileMenuButton}
            onClick={onMenuToggle}
            aria-label="Menüyü aç"
          >
            <Menu size={20} />
          </button>
          <h1 className={styles.title}>Lux Fashion Admin</h1>
        </div>
        
        <div className={styles.right}>
          <div className={styles.userInfo}>
            <User size={16} />
            <span className={styles.userName}>{user?.name}</span>
          </div>
          
          <button 
            onClick={handleLogout}
            className={styles.logoutButton}
            title="Cikis Yap"
          >
            <LogOut size={16} />
            <span>Cikis</span>
          </button>
        </div>
      </div>
    </header>
  )
}