'use client'

import React, { useState } from 'react'
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
import styles from './blog.module.css'

// Örnek blog yazıları
const blogPosts = [
  {
    id: 1,
    title: '2024 Sonbahar/Kış Moda Trendleri: Minimalizm ve Güç',
    excerpt: 'Bu sezon gardırobunuzda olması gereken parçalar ve trend kombinasyon önerileri. Minimalist yaklaşımla maksimum etki yaratmanın sırları.',
    category: 'Moda Trendleri',
    author: 'Ayşe Demir',
    date: '15 Kasım 2024',
    readTime: '5 dk okuma',
    image: '/images/blog-1.jpg',
    featured: true,
    tags: ['Trend', 'Sonbahar/Kış', 'Minimalizm']
  },
  {
    id: 2,
    title: 'Sürdürülebilir Moda: Kaliteli Kumaş Seçiminin Önemi',
    excerpt: 'Çevre dostu kumaşlar ve sürdürülebilir üretim yöntemleri hakkında bilmeniz gerekenler. Bilinçli tüketimin moda dünyasındaki yeri.',
    category: 'Sürdürülebilirlik',
    author: 'Mehmet Kaya',
    date: '10 Kasım 2024',
    readTime: '7 dk okuma',
    image: '/images/blog-2.jpg',
    tags: ['Sürdürülebilirlik', 'Kumaş', 'Çevre']
  },
  {
    id: 3,
    title: 'Ofis Şıklığı: Profesyonel Gardırop Oluşturma Rehberi',
    excerpt: 'İş hayatında şık ve profesyonel görünmenin püf noktaları. 10 parça ile sonsuz kombin yaratma teknikleri.',
    category: 'Styling Önerileri',
    author: 'Zeynep Yılmaz',
    date: '5 Kasım 2024',
    readTime: '6 dk okuma',
    image: '/images/blog-3.jpg',
    tags: ['İş Giyimi', 'Styling', 'Profesyonel']
  },
  {
    id: 4,
    title: 'Kapsül Gardırop Nedir? Nasıl Oluşturulur?',
    excerpt: 'Az parça ile çok kombin yapmanın sırrı: Kapsül gardırop. Temel parçalar ve kombinasyon önerileri.',
    category: 'Styling Önerileri',
    author: 'Elif Özkan',
    date: '1 Kasım 2024',
    readTime: '8 dk okuma',
    image: '/images/blog-4.jpg',
    tags: ['Kapsül Gardırop', 'Minimalizm', 'Styling']
  },
  {
    id: 5,
    title: 'İpek Bakımı: Lüks Kumaşlarınızı Koruma Rehberi',
    excerpt: 'İpek, kaşmir ve yün gibi değerli kumaşların bakımı için profesyonel ipuçları. Giysilerinizin ömrünü uzatın.',
    category: 'Kumaş Bilgisi',
    author: 'Canan Arslan',
    date: '28 Ekim 2024',
    readTime: '4 dk okuma',
    image: '/images/blog-5.jpg',
    tags: ['Kumaş Bakımı', 'İpek', 'Lüks']
  },
  {
    id: 6,
    title: 'Renk Psikolojisi: Giydiğiniz Renkler Ne Anlatıyor?',
    excerpt: 'Renklerin psikolojik etkileri ve doğru renk seçimiyle yaratacağınız etki. Kişisel stilinizi renklerle güçlendirin.',
    category: 'Moda Trendleri',
    author: 'Selin Çelik',
    date: '20 Ekim 2024',
    readTime: '5 dk okuma',
    image: '/images/blog-6.jpg',
    tags: ['Renk', 'Psikoloji', 'Stil']
  }
]

const categories = [
  { name: 'Tümü', count: blogPosts.length },
  { name: 'Moda Trendleri', count: 2 },
  { name: 'Kumaş Bilgisi', count: 1 },
  { name: 'Styling Önerileri', count: 2 },
  { name: 'Sürdürülebilirlik', count: 1 }
]

const popularTags = [
  'Minimalizm', 'Sürdürülebilirlik', 'İş Giyimi', 'Trend', 
  'Kumaş Bakımı', 'Styling', 'Kapsül Gardırop'
]

export default function BlogPage() {
  const [selectedCategory, setSelectedCategory] = useState('Tümü')
  const [searchQuery, setSearchQuery] = useState('')

  // Filtreleme
  const filteredPosts = blogPosts.filter(post => {
    const categoryMatch = selectedCategory === 'Tümü' || post.category === selectedCategory
    const searchMatch = post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                       post.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
                       post.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
    return categoryMatch && searchMatch
  })

  const featuredPost = blogPosts.find(post => post.featured)

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
                  <span className={styles.category}>{featuredPost.category}</span>
                  <span className={styles.dot}>•</span>
                  <span className={styles.date}>
                    <Calendar size={14} />
                    {featuredPost.date}
                  </span>
                </div>
                
                <h2 className={styles.featuredTitle}>
                  <Link href={`/blog/${featuredPost.id}`}>
                    {featuredPost.title}
                  </Link>
                </h2>
                
                <p className={styles.featuredExcerpt}>{featuredPost.excerpt}</p>
                
                <div className={styles.featuredFooter}>
                  <div className={styles.authorInfo}>
                    <User size={16} />
                    <span>{featuredPost.author}</span>
                    <span className={styles.dot}>•</span>
                    <Clock size={16} />
                    <span>{featuredPost.readTime}</span>
                  </div>
                  
                  <Link href={`/blog/${featuredPost.id}`} className={styles.readMore}>
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
                    <li key={category.name}>
                      <button
                        className={`${styles.categoryButton} ${
                          selectedCategory === category.name ? styles.active : ''
                        }`}
                        onClick={() => setSelectedCategory(category.name)}
                      >
                        <span>{category.name}</span>
                        <span className={styles.count}>{category.count}</span>
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
                <div className={styles.newsletterBox}>
                  <h3 className={styles.newsletterTitle}>
                    Blog Bültenimize Katılın
                  </h3>
                  <p className={styles.newsletterText}>
                    Yeni yazılardan haberdar olun
                  </p>
                  <button className={styles.subscribeButton}>
                    Abone Ol
                  </button>
                </div>
              </div>
            </aside>

            {/* Blog Posts Grid */}
            <div className={styles.postsGrid}>
              {filteredPosts.length === 0 ? (
                <div className={styles.noResults}>
                  <p>Aramanıza uygun yazı bulunamadı.</p>
                  <button
                    className={styles.clearButton}
                    onClick={() => {
                      setSearchQuery('')
                      setSelectedCategory('Tümü')
                    }}
                  >
                    Filtreleri Temizle
                  </button>
                </div>
              ) : (
                filteredPosts.map((post, index) => (
                  <article 
                    key={post.id} 
                    className={styles.postCard}
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <Link href={`/blog/${post.id}`} className={styles.postImage}>
                      <div className={styles.imagePlaceholder}>
                        <BookOpen size={32} />
                      </div>
                      <div className={styles.postCategory}>{post.category}</div>
                    </Link>
                    
                    <div className={styles.postContent}>
                      <div className={styles.postMeta}>
                        <span className={styles.postDate}>
                          <Calendar size={14} />
                          {post.date}
                        </span>
                        <span className={styles.dot}>•</span>
                        <span className={styles.postRead}>
                          <Clock size={14} />
                          {post.readTime}
                        </span>
                      </div>
                      
                      <h3 className={styles.postTitle}>
                        <Link href={`/blog/${post.id}`}>{post.title}</Link>
                      </h3>
                      
                      <p className={styles.postExcerpt}>{post.excerpt}</p>
                      
                      <div className={styles.postFooter}>
                        <div className={styles.postAuthor}>
                          <User size={16} />
                          <span>{post.author}</span>
                        </div>
                        
                        <Link href={`/blog/${post.id}`} className={styles.postLink}>
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