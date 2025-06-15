'use client'

import { useAuth } from '@/lib/auth/hooks'
import { signOut } from 'next-auth/react'
import { LogOut, User } from 'lucide-react'
import styles from './AdminHeader.module.css'

export default function AdminHeader() {
  const { user } = useAuth()

  const handleLogout = () => {
    signOut({ callbackUrl: '/' })
  }

  return (
    <header className={styles.header}>
      <div className={styles.container}>
        <div className={styles.left}>
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