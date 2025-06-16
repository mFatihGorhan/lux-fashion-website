'use client'

import { useState, useEffect } from 'react'
import { Plus, Edit2, Trash2, Search, Eye, FileText, Calendar, User } from 'lucide-react'
import Link from 'next/link'

interface BlogPost {
  id: string
  title: string
  slug: string
  excerpt: string
  content: string
  coverImage: string
  coverImageAlt: string | null
  readTime: number
  featured: boolean
  published: boolean
  publishedAt: string | null
  views: number
  order: number
  createdAt: string
  updatedAt: string
  category: {
    id: string
    name: string
  }
  author: {
    id: string
    name: string
  }
  tags: Array<{
    id: string
    name: string
    slug: string
  }>
}

interface BlogPostsResponse {
  posts: BlogPost[]
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}

export default function BlogPostsPage() {
  const [data, setData] = useState<BlogPostsResponse | null>(null)
  const [loading, setLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<'all' | 'published' | 'draft'>('all')

  useEffect(() => {
    fetchPosts()
  }, [currentPage, searchTerm, statusFilter])

  const fetchPosts = async () => {
    try {
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: '10'
      })
      
      if (searchTerm) {
        params.append('search', searchTerm)
      }
      
      if (statusFilter !== 'all') {
        params.append('status', statusFilter)
      }

      const response = await fetch(`/api/admin/blog/posts?${params}`)
      if (response.ok) {
        const postsData = await response.json()
        setData(postsData)
      }
    } catch (error) {
      console.error('Failed to fetch blog posts:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Bu blog yazısını silmek istediğinizden emin misiniz?')) return

    try {
      const response = await fetch(`/api/admin/blog/posts/${id}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        await fetchPosts()
      } else {
        const error = await response.json()
        alert(`Hata: ${error.error}`)
      }
    } catch (error) {
      console.error('Delete error:', error)
      alert('Silme sırasında hata oluştu')
    }
  }

  const togglePublished = async (id: string, currentPublished: boolean) => {
    try {
      const response = await fetch(`/api/admin/blog/posts/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          published: !currentPublished,
          publishedAt: !currentPublished ? new Date().toISOString() : null
        }),
      })

      if (response.ok) {
        await fetchPosts()
      } else {
        const error = await response.json()
        alert(`Hata: ${error.error}`)
      }
    } catch (error) {
      console.error('Update error:', error)
      alert('Güncelleme sırasında hata oluştu')
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('tr-TR', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  if (loading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '200px',
        color: 'white'
      }}>
        <div>Blog yazıları yükleniyor...</div>
      </div>
    )
  }

  return (
    <div style={{ padding: '2rem', color: 'white' }}>
      {/* Header */}
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        marginBottom: '2rem' 
      }}>
        <div>
          <h1 style={{ fontSize: '2rem', fontWeight: 'bold', margin: 0 }}>
            Blog Yazıları
          </h1>
          <p style={{ color: '#9CA3AF', margin: '0.5rem 0 0 0' }}>
            Blog yazılarınızı yönetin
          </p>
        </div>
        
        <Link
          href="/admin/blog/posts/new"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            padding: '0.75rem 1rem',
            backgroundColor: '#10B981',
            border: 'none',
            borderRadius: '0.5rem',
            color: 'white',
            textDecoration: 'none',
            fontWeight: '500'
          }}
        >
          <Plus size={16} />
          Yeni Yazı
        </Link>
      </div>

      {/* Filters */}
      <div style={{ 
        display: 'flex', 
        gap: '1rem', 
        marginBottom: '2rem',
        flexWrap: 'wrap'
      }}>
        {/* Search */}
        <div style={{ position: 'relative', flex: '1', minWidth: '300px' }}>
          <Search 
            size={16} 
            style={{ 
              position: 'absolute', 
              left: '0.75rem', 
              top: '50%', 
              transform: 'translateY(-50%)',
              color: '#9CA3AF'
            }} 
          />
          <input
            type="text"
            placeholder="Yazı ara..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              width: '100%',
              padding: '0.75rem 0.75rem 0.75rem 2.5rem',
              backgroundColor: '#374151',
              border: '1px solid #4B5563',
              borderRadius: '0.5rem',
              color: 'white'
            }}
          />
        </div>

        {/* Status Filter */}
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value as any)}
          style={{
            padding: '0.75rem',
            backgroundColor: '#374151',
            border: '1px solid #4B5563',
            borderRadius: '0.5rem',
            color: 'white',
            minWidth: '150px'
          }}
        >
          <option value="all">Tüm Yazılar</option>
          <option value="published">Yayında</option>
          <option value="draft">Taslak</option>
        </select>
      </div>

      {/* Posts Table */}
      <div style={{
        backgroundColor: '#1F2937',
        borderRadius: '0.75rem',
        overflow: 'hidden',
        border: '1px solid #374151'
      }}>
        {data?.posts.length === 0 ? (
          <div style={{ 
            padding: '3rem', 
            textAlign: 'center', 
            color: '#9CA3AF' 
          }}>
            {searchTerm || statusFilter !== 'all'
              ? 'Filtrelere uygun yazı bulunamadı' 
              : 'Henüz blog yazısı eklenmemiş'
            }
          </div>
        ) : (
          <>
            <div style={{
              display: 'grid',
              gridTemplateColumns: '2fr 1fr 100px 100px 80px 120px',
              gap: '1rem',
              padding: '1rem',
              backgroundColor: '#374151',
              fontWeight: '600',
              fontSize: '0.875rem'
            }}>
              <div>Başlık</div>
              <div>Kategori & Yazar</div>
              <div style={{ textAlign: 'center' }}>Görüntülenme</div>
              <div style={{ textAlign: 'center' }}>Durum</div>
              <div style={{ textAlign: 'center' }}>Tarih</div>
              <div style={{ textAlign: 'center' }}>İşlemler</div>
            </div>
            
            {data?.posts.map((post, index) => (
              <div
                key={post.id}
                style={{
                  display: 'grid',
                  gridTemplateColumns: '2fr 1fr 100px 100px 80px 120px',
                  gap: '1rem',
                  padding: '1rem',
                  borderBottom: index < data.posts.length - 1 ? '1px solid #374151' : 'none',
                  alignItems: 'center'
                }}
              >
                {/* Title & Excerpt */}
                <div>
                  <h3 style={{ 
                    margin: '0 0 0.25rem 0', 
                    fontWeight: '600',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem'
                  }}>
                    {post.featured && (
                      <span style={{
                        padding: '0.125rem 0.375rem',
                        backgroundColor: '#F59E0B',
                        color: 'white',
                        fontSize: '0.625rem',
                        borderRadius: '0.25rem',
                        fontWeight: '500'
                      }}>
                        ÖNE ÇIKAN
                      </span>
                    )}
                    {post.title}
                  </h3>
                  <p style={{ 
                    margin: 0, 
                    fontSize: '0.875rem', 
                    color: '#9CA3AF'
                  }}>
                    {post.excerpt.length > 100 
                      ? post.excerpt.substring(0, 100) + '...' 
                      : post.excerpt
                    }
                  </p>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    marginTop: '0.5rem',
                    fontSize: '0.75rem',
                    color: '#6B7280'
                  }}>
                    <span>{post.readTime} dk okuma</span>
                    <span>•</span>
                    <span>/{post.slug}</span>
                  </div>
                </div>

                {/* Category & Author */}
                <div>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.25rem',
                    marginBottom: '0.25rem'
                  }}>
                    <FileText size={12} />
                    <span style={{ fontSize: '0.875rem' }}>{post.category.name}</span>
                  </div>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.25rem',
                    color: '#9CA3AF'
                  }}>
                    <User size={12} />
                    <span style={{ fontSize: '0.875rem' }}>{post.author.name}</span>
                  </div>
                </div>

                {/* Views */}
                <div style={{ textAlign: 'center' }}>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.25rem',
                    fontSize: '0.875rem'
                  }}>
                    <Eye size={14} />
                    {post.views}
                  </div>
                </div>

                {/* Status */}
                <div style={{ textAlign: 'center' }}>
                  <button
                    onClick={() => togglePublished(post.id, post.published)}
                    style={{
                      padding: '0.25rem 0.75rem',
                      borderRadius: '9999px',
                      fontSize: '0.75rem',
                      fontWeight: '500',
                      border: 'none',
                      cursor: 'pointer',
                      backgroundColor: post.published ? '#10B981' : '#6B7280',
                      color: 'white'
                    }}
                  >
                    {post.published ? 'Yayında' : 'Taslak'}
                  </button>
                </div>

                {/* Date */}
                <div style={{ 
                  textAlign: 'center',
                  fontSize: '0.875rem',
                  color: '#9CA3AF'
                }}>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.25rem'
                  }}>
                    <Calendar size={12} />
                    {formatDate(post.publishedAt || post.createdAt)}
                  </div>
                </div>

                {/* Actions */}
                <div style={{ 
                  display: 'flex', 
                  gap: '0.5rem',
                  justifyContent: 'center'
                }}>
                  <Link
                    href={`/admin/blog/posts/${post.id}`}
                    style={{
                      padding: '0.5rem',
                      backgroundColor: '#3B82F6',
                      border: 'none',
                      borderRadius: '0.375rem',
                      color: 'white',
                      textDecoration: 'none',
                      display: 'flex',
                      alignItems: 'center'
                    }}
                  >
                    <Edit2 size={14} />
                  </Link>

                  <button
                    onClick={() => handleDelete(post.id)}
                    style={{
                      padding: '0.5rem',
                      backgroundColor: '#EF4444',
                      border: 'none',
                      borderRadius: '0.375rem',
                      color: 'white',
                      cursor: 'pointer'
                    }}
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            ))}
          </>
        )}
      </div>

      {/* Pagination */}
      {data && data.pagination.totalPages > 1 && (
        <div style={{ 
          display: 'flex', 
          justifyContent: 'center',
          gap: '0.5rem',
          marginTop: '2rem'
        }}>
          {Array.from({ length: data.pagination.totalPages }, (_, i) => i + 1).map((page) => (
            <button
              key={page}
              onClick={() => setCurrentPage(page)}
              style={{
                padding: '0.5rem 1rem',
                borderRadius: '0.375rem',
                border: 'none',
                cursor: 'pointer',
                backgroundColor: currentPage === page ? '#3B82F6' : '#374151',
                color: 'white'
              }}
            >
              {page}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}