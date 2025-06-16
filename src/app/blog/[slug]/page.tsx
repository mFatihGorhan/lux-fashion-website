'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { 
  Calendar, 
  Clock, 
  User, 
  Eye,
  ArrowLeft,
  ArrowRight,
  Share2,
  Tag
} from 'lucide-react'
import { SectionLoading } from '@/components/ui/LoadingSpinner'
import { BlogShare } from '@/components/ui/SocialShare'
import PageErrorBoundary from '@/components/PageErrorBoundary'
import styles from './BlogDetailPage.module.css'

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
}

interface BlogPost {
  id: string
  title: string
  slug: string
  excerpt: string
  content: string
  featuredImage?: string
  category: BlogCategory
  author: BlogAuthor
  publishedAt: string
  updatedAt: string
  readTime: number
  featured: boolean
  tags: string[]
  views: number
  seoTitle?: string
  seoDescription?: string
  relatedPosts: BlogPost[]
}

interface BlogDetailPageProps {
  params: Promise<{ slug: string }>
}

function BlogDetailContent({ params }: BlogDetailPageProps) {
  const [post, setPost] = useState<BlogPost | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [slug, setSlug] = useState<string>('')

  useEffect(() => {
    const initParams = async () => {
      const { slug: paramSlug } = await params
      setSlug(paramSlug)
    }
    initParams()
  }, [params])

  useEffect(() => {
    if (slug) {
      fetchBlogPost()
    }
  }, [slug])

  const fetchBlogPost = async () => {
    try {
      setLoading(true)
      setError(null)

      const response = await fetch(`/api/blog/posts/${slug}`)
      
      if (response.status === 404) {
        notFound()
        return
      }

      if (!response.ok) {
        throw new Error('Blog yazısı yüklenemedi')
      }

      const postData = await response.json()
      setPost(postData)
    } catch (error) {
      console.error('Error fetching blog post:', error)
      setError('Blog yazısı yüklenirken bir hata oluştu')
    } finally {
      setLoading(false)
    }
  }

  const sharePost = () => {
    if (navigator.share && post) {
      navigator.share({
        title: post.title,
        text: post.excerpt,
        url: window.location.href
      })
    } else if (post) {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href)
      // TODO: Show toast notification
      alert('Link kopyalandı!')
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('tr-TR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  if (loading) {
    return <SectionLoading text="Blog yazısı yükleniyor..." minHeight="60vh" />
  }

  if (error) {
    return (
      <div className={styles.error}>
        <h2>Hata</h2>
        <p>{error}</p>
        <Link href="/blog" className={styles.backButton}>
          <ArrowLeft size={20} />
          Blog'a Dön
        </Link>
      </div>
    )
  }

  if (!post) {
    return notFound()
  }

  return (
    <article className={styles.article}>
      {/* Back Navigation */}
      <div className={styles.navigation}>
        <div className={styles.container}>
          <Link href="/blog" className={styles.backLink}>
            <ArrowLeft size={20} />
            <span>Blog'a Dön</span>
          </Link>
        </div>
      </div>

      {/* Hero Section */}
      <header className={styles.hero}>
        <div className={styles.container}>
          <div className={styles.heroContent}>
            <div className={styles.breadcrumb}>
              <Link href="/blog">Blog</Link>
              <span>/</span>
              <Link href={`/blog?category=${post.category.slug}`}>
                {post.category.name}
              </Link>
            </div>

            <h1 className={styles.title}>{post.title}</h1>
            <p className={styles.excerpt}>{post.excerpt}</p>

            <div className={styles.meta}>
              <div className={styles.authorInfo}>
                <div className={styles.avatar}>
                  {post.author.avatar ? (
                    <img src={post.author.avatar} alt={post.author.name} />
                  ) : (
                    <User size={24} />
                  )}
                </div>
                <div className={styles.authorDetails}>
                  <span className={styles.authorName}>{post.author.name}</span>
                  <div className={styles.metaItems}>
                    <span className={styles.date}>
                      <Calendar size={14} />
                      {formatDate(post.publishedAt)}
                    </span>
                    <span className={styles.readTime}>
                      <Clock size={14} />
                      {post.readTime} dk okuma
                    </span>
                    <span className={styles.views}>
                      <Eye size={14} />
                      {post.views} görüntülenme
                    </span>
                  </div>
                </div>
              </div>

              <button onClick={sharePost} className={styles.shareButton}>
                <Share2 size={20} />
                <span>Paylaş</span>
              </button>
            </div>
          </div>

          {post.featuredImage && (
            <div className={styles.heroImage}>
              <img src={post.featuredImage} alt={post.title} />
            </div>
          )}
        </div>
      </header>

      {/* Content */}
      <div className={styles.container}>
        <div className={styles.contentWrapper}>
          <main className={styles.content}>
            <div 
              className={styles.prose}
              dangerouslySetInnerHTML={{ __html: post.content }}
            />

            {/* Tags */}
            {post.tags.length > 0 && (
              <div className={styles.tags}>
                <h3 className={styles.tagsTitle}>
                  <Tag size={20} />
                  Etiketler
                </h3>
                <div className={styles.tagList}>
                  {post.tags.map(tag => (
                    <Link 
                      key={tag} 
                      href={`/blog?search=${encodeURIComponent(tag)}`}
                      className={styles.tag}
                    >
                      {tag}
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* Social Share */}
            <div className={styles.shareSection}>
              <BlogShare 
                blogTitle={post.title}
                blogUrl={typeof window !== 'undefined' ? window.location.href : ''}
                blogExcerpt={post.excerpt}
              />
            </div>

            {/* Author Bio */}
            {post.author.bio && (
              <div className={styles.authorBio}>
                <div className={styles.authorAvatar}>
                  {post.author.avatar ? (
                    <img src={post.author.avatar} alt={post.author.name} />
                  ) : (
                    <User size={48} />
                  )}
                </div>
                <div className={styles.authorContent}>
                  <h3 className={styles.authorTitle}>Yazar Hakkında</h3>
                  <h4 className={styles.authorName}>{post.author.name}</h4>
                  <p className={styles.authorDescription}>{post.author.bio}</p>
                </div>
              </div>
            )}
          </main>

          {/* Related Posts */}
          {post.relatedPosts.length > 0 && (
            <aside className={styles.relatedPosts}>
              <h3 className={styles.relatedTitle}>İlgili Yazılar</h3>
              <div className={styles.relatedGrid}>
                {post.relatedPosts.map(relatedPost => (
                  <article key={relatedPost.id} className={styles.relatedCard}>
                    <Link href={`/blog/${relatedPost.slug}`} className={styles.relatedImage}>
                      {relatedPost.featuredImage ? (
                        <img src={relatedPost.featuredImage} alt={relatedPost.title} />
                      ) : (
                        <div className={styles.imagePlaceholder}>
                          <User size={24} />
                        </div>
                      )}
                      <div className={styles.relatedCategory}>
                        {relatedPost.category.name}
                      </div>
                    </Link>
                    
                    <div className={styles.relatedContent}>
                      <h4 className={styles.relatedPostTitle}>
                        <Link href={`/blog/${relatedPost.slug}`}>
                          {relatedPost.title}
                        </Link>
                      </h4>
                      <p className={styles.relatedExcerpt}>
                        {relatedPost.excerpt}
                      </p>
                      <div className={styles.relatedMeta}>
                        <span>{relatedPost.author.name}</span>
                        <span>•</span>
                        <span>{relatedPost.readTime} dk</span>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            </aside>
          )}
        </div>
      </div>

      {/* Navigation */}
      <div className={styles.postNavigation}>
        <div className={styles.container}>
          <Link href="/blog" className={styles.allPostsButton}>
            <span>Tüm Blog Yazıları</span>
            <ArrowRight size={20} />
          </Link>
        </div>
      </div>
    </article>
  )
}

export default function BlogDetailPage({ params }: BlogDetailPageProps) {
  return (
    <PageErrorBoundary pageName="Blog yazısı">
      <BlogDetailContent params={params} />
    </PageErrorBoundary>
  )
}