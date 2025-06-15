'use client'

import { useAuth } from '@/lib/auth/hooks'
import Link from 'next/link'
import { Package, FileText, Image, Settings, TrendingUp, Users } from 'lucide-react'
import styles from './dashboard.module.css'

const statsCards = [
  {
    title: 'Toplam Urun',
    value: '24',
    icon: Package,
    color: '#60A5FA',
    href: '/admin/products'
  },
  {
    title: 'Blog Yazisi',
    value: '12',
    icon: FileText,
    color: '#34D399',
    href: '/admin/blog/posts'
  },
  {
    title: 'Medya Dosyasi',
    value: '156',
    icon: Image,
    color: '#F59E0B',
    href: '/admin/media'
  },
  {
    title: 'Ziyaretci',
    value: '1,234',
    icon: TrendingUp,
    color: '#EF4444',
    href: '/admin/settings'
  }
]

const quickActions = [
  {
    title: 'Yeni Urun Ekle',
    description: 'Hizlica yeni urun ekleyin',
    href: '/admin/products/new',
    icon: Package,
    color: '#60A5FA'
  },
  {
    title: 'Blog Yazisi Yaz',
    description: 'Yeni blog yazisi olusturun',
    href: '/admin/blog/posts/new',
    icon: FileText,
    color: '#34D399'
  },
  {
    title: 'Medya Yukle',
    description: 'Yeni gorseller yukleyin',
    href: '/admin/media',
    icon: Image,
    color: '#F59E0B'
  },
  {
    title: 'Site Ayarlari',
    description: 'Genel ayarlari duzenleyin',
    href: '/admin/settings',
    icon: Settings,
    color: '#8B5CF6'
  }
]

export default function AdminDashboard() {
  const { user } = useAuth()

  return (
    <div className={styles.dashboard}>
      <div className={styles.header}>
        <h1 className={styles.title}>Dashboard</h1>
        <p className={styles.welcome}>Hos geldiniz, {user?.name}</p>
      </div>

      <div className={styles.statsGrid}>
        {statsCards.map((card) => (
          <Link key={card.title} href={card.href} className={styles.statCard}>
            <div className={styles.statIcon} style={{ color: card.color }}>
              <card.icon size={24} />
            </div>
            <div className={styles.statContent}>
              <h3 className={styles.statValue}>{card.value}</h3>
              <p className={styles.statTitle}>{card.title}</p>
            </div>
          </Link>
        ))}
      </div>

      <div className={styles.section}>
        <h2 className={styles.sectionTitle}>Hizli Erisim</h2>
        <div className={styles.actionsGrid}>
          {quickActions.map((action) => (
            <Link key={action.title} href={action.href} className={styles.actionCard}>
              <div className={styles.actionIcon} style={{ backgroundColor: action.color }}>
                <action.icon size={20} />
              </div>
              <div className={styles.actionContent}>
                <h3 className={styles.actionTitle}>{action.title}</h3>
                <p className={styles.actionDescription}>{action.description}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>

      <div className={styles.section}>
        <h2 className={styles.sectionTitle}>Hesap Bilgileri</h2>
        <div className={styles.userCard}>
          <div className={styles.userInfo}>
            <div className={styles.userAvatar}>
              <Users size={24} />
            </div>
            <div className={styles.userDetails}>
              <h3 className={styles.userName}>{user?.name}</h3>
              <p className={styles.userEmail}>{user?.email}</p>
              <span className={styles.userRole}>{user?.role}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}