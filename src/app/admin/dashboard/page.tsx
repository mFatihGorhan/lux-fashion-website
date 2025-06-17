'use client'

import { useAuth } from '@/lib/auth/hooks'
import Link from 'next/link'
import { Package, FileText, Image, Settings, TrendingUp, Users } from 'lucide-react'
import { useState, useEffect } from 'react'
import styles from './dashboard.module.css'

interface DashboardStats {
  products: number
  blogPosts: number
  categories: number
  collections: number
}

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
  const [stats, setStats] = useState<DashboardStats>({
    products: 0,
    blogPosts: 0,
    categories: 0,
    collections: 0
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchStats()
  }, [])

  const fetchStats = async () => {
    try {
      setLoading(true)
      
      const [productsRes, blogRes, categoriesRes, collectionsRes] = await Promise.all([
        fetch('/api/admin/products'),
        fetch('/api/admin/blog/posts'),
        fetch('/api/admin/categories'),
        fetch('/api/admin/collections')
      ])

      const [products, blogPosts, categories, collections] = await Promise.all([
        productsRes.ok ? productsRes.json() : { products: [] },
        blogRes.ok ? blogRes.json() : { posts: [] },
        categoriesRes.ok ? categoriesRes.json() : { categories: [] },
        collectionsRes.ok ? collectionsRes.json() : { collections: [] }
      ])

      setStats({
        products: Array.isArray(products) ? products.length : (products.products?.length || 0),
        blogPosts: Array.isArray(blogPosts) ? blogPosts.length : (blogPosts.posts?.length || 0),
        categories: Array.isArray(categories) ? categories.length : (categories.categories?.length || 0),
        collections: Array.isArray(collections) ? collections.length : (collections.collections?.length || 0)
      })
    } catch (error) {
      console.error('Failed to fetch stats:', error)
    } finally {
      setLoading(false)
    }
  }

  const statsCards = [
    {
      title: 'Toplam Ürün',
      value: loading ? '...' : stats.products.toString(),
      icon: Package,
      color: '#60A5FA',
      href: '/admin/products'
    },
    {
      title: 'Blog Yazısı',
      value: loading ? '...' : stats.blogPosts.toString(),
      icon: FileText,
      color: '#34D399',
      href: '/admin/blog/posts'
    },
    {
      title: 'Kategori',
      value: loading ? '...' : stats.categories.toString(),
      icon: Image,
      color: '#F59E0B',
      href: '/admin/categories'
    },
    {
      title: 'Koleksiyon',
      value: loading ? '...' : stats.collections.toString(),
      icon: TrendingUp,
      color: '#EF4444',
      href: '/admin/collections'
    }
  ]

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