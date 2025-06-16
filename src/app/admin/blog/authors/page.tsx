'use client'

import { useState, useEffect } from 'react'
import { Plus, Edit2, Trash2, Search, User, FileText, Calendar, Mail } from 'lucide-react'

interface Author {
  id: string
  name: string
  email: string
  role: 'ADMIN' | 'EDITOR' | 'VIEWER'
  image: string | null
  createdAt: string
  updatedAt: string
  _count: {
    posts: number
  }
}

interface AuthorsResponse {
  authors: Author[]
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}

export default function AuthorsPage() {
  const [data, setData] = useState<AuthorsResponse | null>(null)
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editingAuthor, setEditingAuthor] = useState<Author | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [searchTerm, setSearchTerm] = useState('')
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'EDITOR' as 'ADMIN' | 'EDITOR' | 'VIEWER',
    image: ''
  })
  
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    fetchAuthors()
  }, [currentPage, searchTerm])

  const fetchAuthors = async () => {
    try {
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: '10'
      })
      
      if (searchTerm) {
        params.append('search', searchTerm)
      }

      const response = await fetch(`/api/admin/blog/authors?${params}`)
      if (response.ok) {
        const authorsData = await response.json()
        setData(authorsData)
      }
    } catch (error) {
      console.error('Failed to fetch authors:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setErrors({})

    try {
      const url = editingAuthor 
        ? `/api/admin/blog/authors/${editingAuthor.id}`
        : '/api/admin/blog/authors'
      
      const method = editingAuthor ? 'PUT' : 'POST'

      const submitData = editingAuthor 
        ? { name: formData.name, email: formData.email, role: formData.role, image: formData.image }
        : formData

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(submitData),
      })

      if (response.ok) {
        await fetchAuthors()
        setShowModal(false)
        resetForm()
      } else {
        const error = await response.json()
        if (error.details) {
          const newErrors: Record<string, string> = {}
          error.details.forEach((detail: any) => {
            newErrors[detail.path[0]] = detail.message
          })
          setErrors(newErrors)
        } else {
          alert(`Hata: ${error.error}`)
        }
      }
    } catch (error) {
      console.error('Save error:', error)
      alert('Kaydetme sırasında hata oluştu')
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Bu yazarı silmek istediğinizden emin misiniz?')) return

    try {
      const response = await fetch(`/api/admin/blog/authors/${id}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        await fetchAuthors()
      } else {
        const error = await response.json()
        alert(`Hata: ${error.error}`)
      }
    } catch (error) {
      console.error('Delete error:', error)
      alert('Silme sırasında hata oluştu')
    }
  }

  const openModal = (author?: Author) => {
    if (author) {
      setEditingAuthor(author)
      setFormData({
        name: author.name,
        email: author.email,
        password: '',
        role: author.role,
        image: author.image || ''
      })
    } else {
      setEditingAuthor(null)
      resetForm()
    }
    setShowModal(true)
  }

  const resetForm = () => {
    setFormData({
      name: '',
      email: '',
      password: '',
      role: 'EDITOR',
      image: ''
    })
    setErrors({})
    setEditingAuthor(null)
  }

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }))
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('tr-TR', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'ADMIN': return '#EF4444'
      case 'EDITOR': return '#3B82F6'
      case 'VIEWER': return '#6B7280'
      default: return '#6B7280'
    }
  }

  const getRoleText = (role: string) => {
    switch (role) {
      case 'ADMIN': return 'Admin'
      case 'EDITOR': return 'Editör'
      case 'VIEWER': return 'Görüntüleyici'
      default: return role
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
        <div>Yazarlar yükleniyor...</div>
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
            Blog Yazarları
          </h1>
          <p style={{ color: '#9CA3AF', margin: '0.5rem 0 0 0' }}>
            Blog yazarlarını ve kullanıcıları yönetin
          </p>
        </div>
        
        <button
          onClick={() => openModal()}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            padding: '0.75rem 1rem',
            backgroundColor: '#10B981',
            border: 'none',
            borderRadius: '0.5rem',
            color: 'white',
            cursor: 'pointer',
            fontWeight: '500'
          }}
        >
          <Plus size={16} />
          Yeni Yazar
        </button>
      </div>

      {/* Search */}
      <div style={{ marginBottom: '2rem' }}>
        <div style={{ position: 'relative', maxWidth: '400px' }}>
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
            placeholder="Yazar ara..."
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
      </div>

      {/* Authors Table */}
      <div style={{
        backgroundColor: '#1F2937',
        borderRadius: '0.75rem',
        overflow: 'hidden',
        border: '1px solid #374151'
      }}>
        {data?.authors.length === 0 ? (
          <div style={{ 
            padding: '3rem', 
            textAlign: 'center', 
            color: '#9CA3AF' 
          }}>
            {searchTerm 
              ? 'Filtrelere uygun yazar bulunamadı' 
              : 'Henüz yazar eklenmemiş'
            }
          </div>
        ) : (
          <>
            <div style={{
              display: 'grid',
              gridTemplateColumns: '2fr 1fr 1fr 100px 100px 120px',
              gap: '1rem',
              padding: '1rem',
              backgroundColor: '#374151',
              fontWeight: '600',
              fontSize: '0.875rem'
            }}>
              <div>Yazar</div>
              <div>Email</div>
              <div>Rol</div>
              <div style={{ textAlign: 'center' }}>Yazı Sayısı</div>
              <div style={{ textAlign: 'center' }}>Katılma</div>
              <div style={{ textAlign: 'center' }}>İşlemler</div>
            </div>
            
            {data?.authors.map((author, index) => (
              <div
                key={author.id}
                style={{
                  display: 'grid',
                  gridTemplateColumns: '2fr 1fr 1fr 100px 100px 120px',
                  gap: '1rem',
                  padding: '1rem',
                  borderBottom: index < data.authors.length - 1 ? '1px solid #374151' : 'none',
                  alignItems: 'center'
                }}
              >
                {/* Author Info */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <div style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: '50%',
                    backgroundColor: '#374151',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundImage: author.image ? `url(${author.image})` : 'none',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center'
                  }}>
                    {!author.image && <User size={20} color="#9CA3AF" />}
                  </div>
                  <div>
                    <h3 style={{ margin: '0 0 0.25rem 0', fontWeight: '600' }}>
                      {author.name}
                    </h3>
                  </div>
                </div>

                {/* Email */}
                <div style={{ 
                  fontSize: '0.875rem', 
                  color: '#D1D5DB',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.25rem'
                }}>
                  <Mail size={12} />
                  {author.email}
                </div>

                {/* Role */}
                <div>
                  <span style={{
                    padding: '0.25rem 0.75rem',
                    borderRadius: '9999px',
                    fontSize: '0.75rem',
                    fontWeight: '500',
                    backgroundColor: getRoleColor(author.role),
                    color: 'white'
                  }}>
                    {getRoleText(author.role)}
                  </span>
                </div>

                {/* Posts Count */}
                <div style={{ textAlign: 'center' }}>
                  <div style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.25rem',
                    padding: '0.25rem 0.5rem',
                    backgroundColor: '#374151',
                    borderRadius: '0.375rem',
                    fontSize: '0.875rem'
                  }}>
                    <FileText size={14} />
                    {author._count.posts}
                  </div>
                </div>

                {/* Join Date */}
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
                    {formatDate(author.createdAt)}
                  </div>
                </div>

                {/* Actions */}
                <div style={{ 
                  display: 'flex', 
                  gap: '0.5rem',
                  justifyContent: 'center'
                }}>
                  <button
                    onClick={() => openModal(author)}
                    style={{
                      padding: '0.5rem',
                      backgroundColor: '#3B82F6',
                      border: 'none',
                      borderRadius: '0.375rem',
                      color: 'white',
                      cursor: 'pointer'
                    }}
                  >
                    <Edit2 size={16} />
                  </button>

                  <button
                    onClick={() => handleDelete(author.id)}
                    style={{
                      padding: '0.5rem',
                      backgroundColor: '#EF4444',
                      border: 'none',
                      borderRadius: '0.375rem',
                      color: 'white',
                      cursor: 'pointer'
                    }}
                  >
                    <Trash2 size={16} />
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

      {/* Modal */}
      {showModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.75)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 50,
          padding: '1rem'
        }}>
          <div style={{
            backgroundColor: '#1F2937',
            borderRadius: '0.75rem',
            padding: '2rem',
            width: '100%',
            maxWidth: '500px',
            border: '1px solid #374151'
          }}>
            <h2 style={{ 
              fontSize: '1.5rem', 
              fontWeight: 'bold', 
              marginBottom: '1.5rem',
              color: 'white'
            }}>
              {editingAuthor ? 'Yazar Düzenle' : 'Yeni Yazar'}
            </h2>

            <form onSubmit={handleSubmit}>
              <div style={{ display: 'grid', gap: '1rem' }}>
                <div>
                  <label style={{ 
                    display: 'block', 
                    fontSize: '0.875rem', 
                    fontWeight: '500', 
                    marginBottom: '0.5rem',
                    color: '#D1D5DB'
                  }}>
                    Ad Soyad *
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    style={{
                      width: '100%',
                      padding: '0.75rem',
                      backgroundColor: '#374151',
                      border: `1px solid ${errors.name ? '#EF4444' : '#4B5563'}`,
                      borderRadius: '0.5rem',
                      color: 'white'
                    }}
                    placeholder="John Doe"
                  />
                  {errors.name && (
                    <span style={{ color: '#EF4444', fontSize: '0.875rem' }}>
                      {errors.name}
                    </span>
                  )}
                </div>

                <div>
                  <label style={{ 
                    display: 'block', 
                    fontSize: '0.875rem', 
                    fontWeight: '500', 
                    marginBottom: '0.5rem',
                    color: '#D1D5DB'
                  }}>
                    Email *
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    style={{
                      width: '100%',
                      padding: '0.75rem',
                      backgroundColor: '#374151',
                      border: `1px solid ${errors.email ? '#EF4444' : '#4B5563'}`,
                      borderRadius: '0.5rem',
                      color: 'white'
                    }}
                    placeholder="john@example.com"
                  />
                  {errors.email && (
                    <span style={{ color: '#EF4444', fontSize: '0.875rem' }}>
                      {errors.email}
                    </span>
                  )}
                </div>

                {!editingAuthor && (
                  <div>
                    <label style={{ 
                      display: 'block', 
                      fontSize: '0.875rem', 
                      fontWeight: '500', 
                      marginBottom: '0.5rem',
                      color: '#D1D5DB'
                    }}>
                      Şifre *
                    </label>
                    <input
                      type="password"
                      value={formData.password}
                      onChange={(e) => handleInputChange('password', e.target.value)}
                      style={{
                        width: '100%',
                        padding: '0.75rem',
                        backgroundColor: '#374151',
                        border: `1px solid ${errors.password ? '#EF4444' : '#4B5563'}`,
                        borderRadius: '0.5rem',
                        color: 'white'
                      }}
                      placeholder="••••••••"
                    />
                    {errors.password && (
                      <span style={{ color: '#EF4444', fontSize: '0.875rem' }}>
                        {errors.password}
                      </span>
                    )}
                  </div>
                )}

                <div>
                  <label style={{ 
                    display: 'block', 
                    fontSize: '0.875rem', 
                    fontWeight: '500', 
                    marginBottom: '0.5rem',
                    color: '#D1D5DB'
                  }}>
                    Rol *
                  </label>
                  <select
                    value={formData.role}
                    onChange={(e) => handleInputChange('role', e.target.value)}
                    style={{
                      width: '100%',
                      padding: '0.75rem',
                      backgroundColor: '#374151',
                      border: '1px solid #4B5563',
                      borderRadius: '0.5rem',
                      color: 'white'
                    }}
                  >
                    <option value="VIEWER">Görüntüleyici</option>
                    <option value="EDITOR">Editör</option>
                    <option value="ADMIN">Admin</option>
                  </select>
                </div>

                <div>
                  <label style={{ 
                    display: 'block', 
                    fontSize: '0.875rem', 
                    fontWeight: '500', 
                    marginBottom: '0.5rem',
                    color: '#D1D5DB'
                  }}>
                    Profil Fotoğrafı URL
                  </label>
                  <input
                    type="url"
                    value={formData.image}
                    onChange={(e) => handleInputChange('image', e.target.value)}
                    style={{
                      width: '100%',
                      padding: '0.75rem',
                      backgroundColor: '#374151',
                      border: '1px solid #4B5563',
                      borderRadius: '0.5rem',
                      color: 'white'
                    }}
                    placeholder="https://example.com/avatar.jpg"
                  />
                </div>
              </div>

              <div style={{ 
                display: 'flex', 
                gap: '1rem', 
                justifyContent: 'end',
                marginTop: '2rem'
              }}>
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  style={{
                    padding: '0.75rem 1rem',
                    backgroundColor: '#6B7280',
                    border: 'none',
                    borderRadius: '0.5rem',
                    color: 'white',
                    cursor: 'pointer'
                  }}
                >
                  İptal
                </button>
                
                <button
                  type="submit"
                  disabled={saving}
                  style={{
                    padding: '0.75rem 1rem',
                    backgroundColor: saving ? '#6B7280' : '#10B981',
                    border: 'none',
                    borderRadius: '0.5rem',
                    color: 'white',
                    cursor: saving ? 'not-allowed' : 'pointer'
                  }}
                >
                  {saving ? 'Kaydediliyor...' : 'Kaydet'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}