'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Save } from 'lucide-react'

interface Category {
  id: string
  name: string
}

interface Tag {
  id: string
  name: string
  slug: string
}

export default function NewBlogPostPage() {
  const router = useRouter()
  const [categories, setCategories] = useState<Category[]>([])
  const [tags, setTags] = useState<Tag[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    excerpt: '',
    content: '',
    coverImage: '',
    coverImageAlt: '',
    readTime: 5,
    categoryId: '',
    selectedTags: [] as string[],
    featured: false,
    published: false,
    order: 0,
    metaTitle: '',
    metaDescription: ''
  })

  useEffect(() => {
    fetchCategories()
    // fetchTags() // Tags endpoint'i yok şimdilik
    setLoading(false)
  }, [])

  const fetchCategories = async () => {
    try {
      const response = await fetch('/api/admin/blog/categories')
      if (response.ok) {
        const data = await response.json()
        setCategories(data.categories || data)
      }
    } catch (error) {
      console.error('Failed to fetch categories:', error)
    }
  }

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[ğ]/g, 'g')
      .replace(/[ü]/g, 'u')
      .replace(/[ş]/g, 's')
      .replace(/[ı]/g, 'i')
      .replace(/[ö]/g, 'o')
      .replace(/[ç]/g, 'c')
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim()
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)

    try {
      const response = await fetch('/api/admin/blog/posts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          tags: formData.selectedTags
        }),
      })

      if (response.ok) {
        alert('Blog yazısı başarıyla oluşturuldu!')
        router.push('/admin/blog/posts')
      } else {
        const error = await response.json()
        alert(`Hata: ${error.error}`)
      }
    } catch (error) {
      console.error('Failed to create blog post:', error)
      alert('Blog yazısı oluşturulurken hata oluştu')
    } finally {
      setSaving(false)
    }
  }

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    
    if (field === 'title') {
      setFormData(prev => ({ ...prev, slug: generateSlug(value) }))
    }
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
        <div>Yükleniyor...</div>
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
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <button
            onClick={() => router.push('/admin/blog/posts')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '0.75rem 1rem',
              backgroundColor: '#6B7280',
              border: 'none',
              borderRadius: '0.5rem',
              color: 'white',
              cursor: 'pointer'
            }}
          >
            <ArrowLeft size={16} />
            Geri
          </button>
          
          <div>
            <h1 style={{ fontSize: '2rem', fontWeight: 'bold', margin: 0 }}>
              Yeni Blog Yazısı
            </h1>
            <p style={{ color: '#9CA3AF', margin: '0.5rem 0 0 0' }}>
              Yeni bir blog yazısı oluşturun
            </p>
          </div>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: '2fr 1fr',
          gap: '2rem'
        }}>
          {/* Main Content */}
          <div style={{
            backgroundColor: '#1F2937',
            borderRadius: '0.75rem',
            padding: '2rem',
            border: '1px solid #374151'
          }}>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '1.5rem' }}>
              Yazı Bilgileri
            </h2>

            <div style={{ display: 'grid', gap: '1.5rem' }}>
              <div>
                <label style={{ 
                  display: 'block', 
                  fontSize: '0.875rem', 
                  fontWeight: '500', 
                  marginBottom: '0.5rem',
                  color: '#D1D5DB'
                }}>
                  Başlık *
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => handleInputChange('title', e.target.value)}
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    backgroundColor: '#374151',
                    border: '1px solid #4B5563',
                    borderRadius: '0.5rem',
                    color: 'white'
                  }}
                  required
                />
              </div>

              <div>
                <label style={{ 
                  display: 'block', 
                  fontSize: '0.875rem', 
                  fontWeight: '500', 
                  marginBottom: '0.5rem',
                  color: '#D1D5DB'
                }}>
                  Slug *
                </label>
                <input
                  type="text"
                  value={formData.slug}
                  onChange={(e) => handleInputChange('slug', e.target.value)}
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    backgroundColor: '#374151',
                    border: '1px solid #4B5563',
                    borderRadius: '0.5rem',
                    color: 'white'
                  }}
                  required
                />
              </div>

              <div>
                <label style={{ 
                  display: 'block', 
                  fontSize: '0.875rem', 
                  fontWeight: '500', 
                  marginBottom: '0.5rem',
                  color: '#D1D5DB'
                }}>
                  Özet *
                </label>
                <textarea
                  value={formData.excerpt}
                  onChange={(e) => handleInputChange('excerpt', e.target.value)}
                  rows={3}
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    backgroundColor: '#374151',
                    border: '1px solid #4B5563',
                    borderRadius: '0.5rem',
                    color: 'white',
                    resize: 'vertical'
                  }}
                  required
                />
              </div>

              <div>
                <label style={{ 
                  display: 'block', 
                  fontSize: '0.875rem', 
                  fontWeight: '500', 
                  marginBottom: '0.5rem',
                  color: '#D1D5DB'
                }}>
                  İçerik *
                </label>
                <textarea
                  value={formData.content}
                  onChange={(e) => handleInputChange('content', e.target.value)}
                  rows={10}
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    backgroundColor: '#374151',
                    border: '1px solid #4B5563',
                    borderRadius: '0.5rem',
                    color: 'white',
                    resize: 'vertical'
                  }}
                  required
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label style={{ 
                    display: 'block', 
                    fontSize: '0.875rem', 
                    fontWeight: '500', 
                    marginBottom: '0.5rem',
                    color: '#D1D5DB'
                  }}>
                    Okuma Süresi (dk) *
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={formData.readTime}
                    onChange={(e) => handleInputChange('readTime', parseInt(e.target.value) || 5)}
                    style={{
                      width: '100%',
                      padding: '0.75rem',
                      backgroundColor: '#374151',
                      border: '1px solid #4B5563',
                      borderRadius: '0.5rem',
                      color: 'white'
                    }}
                    required
                  />
                </div>

                <div>
                  <label style={{ 
                    display: 'block', 
                    fontSize: '0.875rem', 
                    fontWeight: '500', 
                    marginBottom: '0.5rem',
                    color: '#D1D5DB'
                  }}>
                    Sıra
                  </label>
                  <input
                    type="number"
                    value={formData.order}
                    onChange={(e) => handleInputChange('order', parseInt(e.target.value) || 0)}
                    style={{
                      width: '100%',
                      padding: '0.75rem',
                      backgroundColor: '#374151',
                      border: '1px solid #4B5563',
                      borderRadius: '0.5rem',
                      color: 'white'
                    }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div style={{ display: 'grid', gap: '1.5rem' }}>
            {/* Yayın Durumu */}
            <div style={{
              backgroundColor: '#1F2937',
              borderRadius: '0.75rem',
              padding: '1.5rem',
              border: '1px solid #374151'
            }}>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '1rem' }}>
                Yayın Durumu
              </h3>
              
              <div style={{ display: 'grid', gap: '1rem' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <input
                    type="checkbox"
                    checked={formData.published}
                    onChange={(e) => handleInputChange('published', e.target.checked)}
                    style={{ width: '16px', height: '16px' }}
                  />
                  <span style={{ fontSize: '0.875rem', color: '#D1D5DB' }}>Yayınla</span>
                </label>

                <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <input
                    type="checkbox"
                    checked={formData.featured}
                    onChange={(e) => handleInputChange('featured', e.target.checked)}
                    style={{ width: '16px', height: '16px' }}
                  />
                  <span style={{ fontSize: '0.875rem', color: '#D1D5DB' }}>Öne Çıkan</span>
                </label>
              </div>

              <button
                type="submit"
                disabled={saving}
                style={{
                  width: '100%',
                  marginTop: '1rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.5rem',
                  padding: '0.75rem',
                  backgroundColor: saving ? '#6B7280' : '#10B981',
                  border: 'none',
                  borderRadius: '0.5rem',
                  color: 'white',
                  cursor: saving ? 'not-allowed' : 'pointer',
                  fontWeight: '500'
                }}
              >
                <Save size={16} />
                {saving ? 'Kaydediliyor...' : 'Kaydet'}
              </button>
            </div>

            {/* Kategori */}
            <div style={{
              backgroundColor: '#1F2937',
              borderRadius: '0.75rem',
              padding: '1.5rem',
              border: '1px solid #374151'
            }}>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '1rem' }}>
                Kategori
              </h3>
              
              <select
                value={formData.categoryId}
                onChange={(e) => handleInputChange('categoryId', e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  backgroundColor: '#374151',
                  border: '1px solid #4B5563',
                  borderRadius: '0.5rem',
                  color: 'white'
                }}
                required
              >
                <option value="">Kategori Seçin</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Görsel */}
            <div style={{
              backgroundColor: '#1F2937',
              borderRadius: '0.75rem',
              padding: '1.5rem',
              border: '1px solid #374151'
            }}>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '1rem' }}>
                Kapak Görseli
              </h3>
              
              <div style={{ display: 'grid', gap: '1rem' }}>
                <div>
                  <label style={{ 
                    display: 'block', 
                    fontSize: '0.875rem', 
                    fontWeight: '500', 
                    marginBottom: '0.5rem',
                    color: '#D1D5DB'
                  }}>
                    Görsel URL *
                  </label>
                  <input
                    type="url"
                    value={formData.coverImage}
                    onChange={(e) => handleInputChange('coverImage', e.target.value)}
                    style={{
                      width: '100%',
                      padding: '0.75rem',
                      backgroundColor: '#374151',
                      border: '1px solid #4B5563',
                      borderRadius: '0.5rem',
                      color: 'white'
                    }}
                    required
                  />
                </div>

                <div>
                  <label style={{ 
                    display: 'block', 
                    fontSize: '0.875rem', 
                    fontWeight: '500', 
                    marginBottom: '0.5rem',
                    color: '#D1D5DB'
                  }}>
                    Alt Text
                  </label>
                  <input
                    type="text"
                    value={formData.coverImageAlt}
                    onChange={(e) => handleInputChange('coverImageAlt', e.target.value)}
                    style={{
                      width: '100%',
                      padding: '0.75rem',
                      backgroundColor: '#374151',
                      border: '1px solid #4B5563',
                      borderRadius: '0.5rem',
                      color: 'white'
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  )
}