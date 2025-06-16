'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { 
  Calendar, 
  Clock, 
  User, 
  Search,
  TrendingUp,
  Tag,
  ArrowRight,
  BookOpen
} from 'lucide-react'
import ProductCardSkeleton from '@/components/ui/ProductCardSkeleton'
import { SectionLoading } from '@/components/ui/LoadingSpinner'
import { SidebarNewsletter } from '@/components/ui/Newsletter'
import PageErrorBoundary from '@/components/PageErrorBoundary'
import styles from './blog.module.css'

interface BlogAuthor {
  id: string
  name: string
  avatar?: string
  bio?: string
}

interface BlogCategory {
  id: string
  name: string
  slug: string
  description?: string
  count?: number
}

interface BlogPost {
  id: string
  title: string
  slug: string
  excerpt: string
  content?: string
  featuredImage?: string
  category: BlogCategory
  author: BlogAuthor
  publishedAt: string
  updatedAt: string
  readTime: number
  featured: boolean
  tags: string[]
  views: number
}

// Default/fallback blog data
const defaultBlogPosts: BlogPost[] = [
  {
    id: '1',
    title: '2024 Sonbahar/Kış Moda Trendleri: Minimalizm ve Güç',
    slug: '2024-sonbahar-kis-moda-trendleri',
    excerpt: 'Bu sezon gardırobunuzda olması gereken parçalar ve trend kombinasyon önerileri. Minimalist yaklaşımla maksimum etki yaratmanın sırları.',
    category: {
      id: '1',
      name: 'Moda Trendleri',
      slug: 'moda-trendleri'
    },
    author: {
      id: '1',
      name: 'Ayşe Demir'
    },
    publishedAt: '2024-11-15T09:00:00Z',
    updatedAt: '2024-11-15T09:00:00Z',
    readTime: 5,
    featuredImage: '/images/blog-1.jpg',
    featured: true,
    tags: ['Trend', 'Sonbahar/Kış', 'Minimalizm'],
    views: 0
  },
  {
    id: '2',
    title: 'Sürdürülebilir Moda: Kaliteli Kumaş Seçiminin Önemi',
    slug: 'surdurulebilir-moda-kumac-secimi',
    excerpt: 'Çevre dostu kumaşlar ve sürdürülebilir üretim yöntemleri hakkında bilmeniz gerekenler. Bilinçli tüketimin moda dünyasındaki yeri.',
    category: {
      id: '2',
      name: 'Sürdürülebilirlik',
      slug: 'surdurulebilirlik'
    },
    author: {
      id: '2',
      name: 'Mehmet Kaya'
    },
    publishedAt: '2024-11-10T09:00:00Z',
    updatedAt: '2024-11-10T09:00:00Z',
    readTime: 7,
    featuredImage: '/images/blog-2.jpg',
    featured: false,
    tags: ['Sürdürülebilirlik', 'Kumaş', 'Çevre'],
    views: 0
  },
  // Adding more posts for demo
  {
    id: '3',
    title: 'Ofis Şıklığı: Profesyonel Gardırop Oluşturma Rehberi',
    slug: 'ofis-sikligi-profesyonel-gardirop',
    excerpt: 'İş hayatında şık ve profesyonel görünmenin püf noktaları. 10 parça ile sonsuz kombin yaratma teknikleri.',
    category: { id: '3', name: 'Styling Önerileri', slug: 'styling-onerileri' },
    author: { id: '3', name: 'Zeynep Yılmaz' },
    publishedAt: '2024-11-05T09:00:00Z',
    updatedAt: '2024-11-05T09:00:00Z',
    readTime: 6,
    featuredImage: '/images/blog-3.jpg',
    featured: false,
    tags: ['İş Giyimi', 'Styling', 'Profesyonel'],
    views: 0
  }
]

const defaultCategories: BlogCategory[] = [
  { id: 'all', name: 'Tümü', slug: 'all', count: 6 },
  { id: '1', name: 'Moda Trendleri', slug: 'moda-trendleri', count: 2 },
  { id: '2', name: 'Kumaş Bilgisi', slug: 'kumac-bilgisi', count: 1 },
  { id: '3', name: 'Styling Önerileri', slug: 'styling-onerileri', count: 2 },
  { id: '4', name: 'Sürdürülebilirlik', slug: 'surdurulebilirlik', count: 1 }
]

const popularTags = [
  'Minimalizm', 'Sürdürülebilirlik', 'İş Giyimi', 'Trend', 
  'Kumaş Bakımı', 'Styling', 'Kapsül Gardırop'
]

function BlogContent() {
  const [posts, setPosts] = useState<BlogPost[]>([])
  const [categories, setCategories] = useState<BlogCategory[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')

  useEffect(() => {
    fetchBlogData()
  }, [selectedCategory, searchQuery])

  const fetchBlogData = async () => {
    try {
      setLoading(true)
      const params = new URLSearchParams()
      
      if (selectedCategory !== 'all') {
        params.append('category', selectedCategory)
      }
      if (searchQuery.trim()) {
        params.append('search', searchQuery.trim())
      }

      const [postsRes, categoriesRes] = await Promise.all([
        fetch(`/api/blog/posts?${params.toString()}`),
        fetch('/api/blog/categories')
      ])

      if (postsRes.ok) {
        const postsData = await postsRes.json()
        setPosts(postsData.posts || [])
      } else {
        // Fallback to default posts if API fails
        setPosts(defaultBlogPosts)
      }

      if (categoriesRes.ok) {
        const categoriesData = await categoriesRes.json()
        const allCategory = { id: 'all', name: 'Tümü', slug: 'all', count: posts.length }
        setCategories([allCategory, ...categoriesData])
      } else {
        // Fallback to default categories
        setCategories(defaultCategories)
      }
    } catch (error) {
      console.error('Error fetching blog data:', error)
      // Fallback to default data
      setPosts(defaultBlogPosts)
      setCategories(defaultCategories)
    } finally {
      setLoading(false)
    }
  }

  const featuredPost = posts.find(post => post.featured)

  return (
    <main className={styles.main}>
      {/* Page Header */}
      <section className={styles.pageHeader}>
        <div className={styles.headerContent}>
          <h1 className={styles.title}>Blog</h1>
          <p className={styles.subtitle}>
            Moda dünyasından haberler, stil önerileri ve ilham veren içerikler
          </p>
        </div>
      </section>

      {/* Featured Post */}
      {featuredPost && (
        <section className={styles.featured}>
          <div className={styles.container}>
            <div className={styles.featuredCard}>
              <div className={styles.featuredImage}>
                <div className={styles.featuredImagePlaceholder}>
                  <TrendingUp size={48} />
                  <span>Öne Çıkan Yazı</span>
                </div>
                <span className={styles.featuredBadge}>Öne Çıkan</span>
              </div>
              
              <div className={styles.featuredContent}>
                <div className={styles.featuredMeta}>
                  <span className={styles.category}>{featuredPost.category.name}</span>
                  <span className={styles.dot}>•</span>
                  <span className={styles.date}>
                    <Calendar size={14} />
                    {new Date(featuredPost.publishedAt).toLocaleDateString('tr-TR')}
                  </span>
                </div>
                
                <h2 className={styles.featuredTitle}>
                  <Link href={`/blog/${featuredPost.slug}`}>
                    {featuredPost.title}
                  </Link>
                </h2>
                
                <p className={styles.featuredExcerpt}>{featuredPost.excerpt}</p>
                
                <div className={styles.featuredFooter}>
                  <div className={styles.authorInfo}>
                    <User size={16} />
                    <span>{featuredPost.author.name}</span>
                    <span className={styles.dot}>•</span>
                    <Clock size={16} />
                    <span>{featuredPost.readTime} dk okuma</span>
                  </div>
                  
                  <Link href={`/blog/${featuredPost.slug}`} className={styles.readMore}>
                    <span>Devamını Oku</span>
                    <ArrowRight size={16} />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Main Content */}
      <section className={styles.content}>
        <div className={styles.container}>
          <div className={styles.contentGrid}>
            {/* Sidebar */}
            <aside className={styles.sidebar}>
              {/* Search */}
              <div className={styles.sidebarWidget}>
                <h3 className={styles.widgetTitle}>
                  <Search size={20} />
                  Ara
                </h3>
                <div className={styles.searchBox}>
                  <input
                    type="text"
                    placeholder="Blog yazılarında ara..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className={styles.searchInput}
                  />
                  <Search size={18} className={styles.searchIcon} />
                </div>
              </div>

              {/* Categories */}
              <div className={styles.sidebarWidget}>
                <h3 className={styles.widgetTitle}>
                  <BookOpen size={20} />
                  Kategoriler
                </h3>
                <ul className={styles.categoryList}>
                  {categories.map(category => (
                    <li key={category.id}>
                      <button
                        className={`${styles.categoryButton} ${
                          selectedCategory === category.slug ? styles.active : ''
                        }`}
                        onClick={() => setSelectedCategory(category.slug)}
                      >
                        <span>{category.name}</span>
                        <span className={styles.count}>{category.count || 0}</span>
                      </button>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Popular Tags */}
              <div className={styles.sidebarWidget}>
                <h3 className={styles.widgetTitle}>
                  <Tag size={20} />
                  Popüler Etiketler
                </h3>
                <div className={styles.tagCloud}>
                  {popularTags.map(tag => (
                    <button
                      key={tag}
                      className={styles.tag}
                      onClick={() => setSearchQuery(tag)}
                    >
                      {tag}
                    </button>
                  ))}
                </div>
              </div>

              {/* Newsletter */}
              <div className={styles.sidebarWidget}>
                <SidebarNewsletter />
              </div>
            </aside>

            {/* Blog Posts Grid */}
            <div className={styles.postsGrid}>
              {loading ? (
                <SectionLoading text="Blog yazıları yükleniyor..." minHeight="400px" />
              ) : posts.length === 0 ? (
                <div className={styles.noResults}>
                  <p>Aramanıza uygun yazı bulunamadı.</p>
                  <button
                    className={styles.clearButton}
                    onClick={() => {
                      setSearchQuery('')
                      setSelectedCategory('all')
                    }}
                  >
                    Filtreleri Temizle
                  </button>
                </div>
              ) : (
                posts.map((post, index) => (
                  <article 
                    key={post.id} 
                    className={styles.postCard}
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <Link href={`/blog/${post.slug}`} className={styles.postImage}>
                      {post.featuredImage ? (
                        <img src={post.featuredImage} alt={post.title} className={styles.postImageTag} />
                      ) : (
                        <div className={styles.imagePlaceholder}>
                          <BookOpen size={32} />
                        </div>
                      )}
                      <div className={styles.postCategory}>{post.category.name}</div>
                    </Link>
                    
                    <div className={styles.postContent}>
                      <div className={styles.postMeta}>
                        <span className={styles.postDate}>
                          <Calendar size={14} />
                          {new Date(post.publishedAt).toLocaleDateString('tr-TR')}
                        </span>
                        <span className={styles.dot}>•</span>
                        <span className={styles.postRead}>
                          <Clock size={14} />
                          {post.readTime} dk okuma
                        </span>
                      </div>
                      
                      <h3 className={styles.postTitle}>
                        <Link href={`/blog/${post.slug}`}>{post.title}</Link>
                      </h3>
                      
                      <p className={styles.postExcerpt}>{post.excerpt}</p>
                      
                      <div className={styles.postFooter}>
                        <div className={styles.postAuthor}>
                          <User size={16} />
                          <span>{post.author.name}</span>
                        </div>
                        
                        <Link href={`/blog/${post.slug}`} className={styles.postLink}>
                          <span>Devamını Oku</span>
                          <ArrowRight size={16} />
                        </Link>
                      </div>
                    </div>
                  </article>
                ))
              )}
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}

export default function BlogPage() {
  return (
    <PageErrorBoundary pageName="Blog sayfası">
      <BlogContent />
    </PageErrorBoundary>
  )
}