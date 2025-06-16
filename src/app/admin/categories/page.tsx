'use client'

import { useState, useEffect } from 'react'
import { Plus, Edit, Trash2, Package, Search, RotateCcw } from 'lucide-react'

interface Category {
  id: string
  name: string
  slug: string
  description?: string
  order: number
  isActive: boolean
  createdAt: string
  updatedAt: string
  _count: {
    products: number
  }
}

interface CategoryFormData {
  name: string
  slug: string
  description: string
  order: number
  isActive: boolean
}

interface CategoryFormErrors {
  name?: string
  slug?: string
  description?: string
  order?: string
  isActive?: string
}

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editingCategory, setEditingCategory] = useState<Category | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [formData, setFormData] = useState<CategoryFormData>({
    name: '',
    slug: '',
    description: '',
    order: 0,
    isActive: true
  })
  const [formErrors, setFormErrors] = useState<CategoryFormErrors>({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    fetchCategories()
  }, [])

  const fetchCategories = async () => {
    try {
      const response = await fetch('/api/admin/categories')
      if (response.ok) {
        const data = await response.json()
        setCategories(data)
      }
    } catch (error) {
      console.error('Failed to fetch categories:', error)
    } finally {
      setLoading(false)
    }
  }

  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .replace(/[ğ]/g, 'g')
      .replace(/[ü]/g, 'u')
      .replace(/[ş]/g, 's')
      .replace(/[ı]/g, 'i')
      .replace(/[ö]/g, 'o')
      .replace(/[ç]/g, 'c')
      .replace(/[^a-z0-9\s]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim()
  }

  const handleNameChange = (name: string) => {
    setFormData({
      ...formData,
      name,
      slug: generateSlug(name)
    })
  }

  const validateForm = (): boolean => {
    const errors: CategoryFormErrors = {}
    
    if (!formData.name.trim()) {
      errors.name = 'Kategori adı gereklidir'
    }
    
    if (!formData.slug.trim()) {
      errors.slug = 'Kategori slug gereklidir'
    }
    
    if (formData.order < 0) {
      errors.order = 'Sıra numarası 0 veya pozitif olmalıdır'
    }

    setFormErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) return
    
    setIsSubmitting(true)
    
    try {
      const url = editingCategory 
        ? `/api/admin/categories/${editingCategory.id}`
        : '/api/admin/categories'
      
      const method = editingCategory ? 'PUT' : 'POST'
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        await fetchCategories()
        resetForm()
        setShowModal(false)
      } else {
        const errorData = await response.json()
        alert(`Hata: ${errorData.error}`)
      }
    } catch (error) {
      console.error('Failed to save category:', error)
      alert('Kategori kaydedilirken hata oluştu')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleEdit = (category: Category) => {
    setEditingCategory(category)
    setFormData({
      name: category.name,
      slug: category.slug,
      description: category.description || '',
      order: category.order,
      isActive: category.isActive
    })
    setShowModal(true)
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Bu kategoriyi silmek istediğinizden emin misiniz?')) return

    try {
      const response = await fetch(`/api/admin/categories/${id}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        await fetchCategories()
      } else {
        const errorData = await response.json()
        alert(`Hata: ${errorData.error}`)
      }
    } catch (error) {
      console.error('Failed to delete category:', error)
      alert('Kategori silinirken hata oluştu')
    }
  }

  const resetForm = () => {
    setFormData({
      name: '',
      slug: '',
      description: '',
      order: 0,
      isActive: true
    })
    setFormErrors({})
    setEditingCategory(null)
  }

  const filteredCategories = categories.filter(category =>
    category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    category.slug.toLowerCase().includes(searchTerm.toLowerCase())
  )

  if (loading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '200px',
        color: 'white'
      }}>
        <div>Kategoriler yükleniyor...</div>
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
            Kategori Yönetimi
          </h1>
          <p style={{ color: '#9CA3AF', margin: '0.5rem 0 0 0' }}>
            Ürün kategorilerini yönetin
          </p>
        </div>
        
        <button
          onClick={() => {
            resetForm()
            setShowModal(true)
          }}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            backgroundColor: '#3B82F6',
            color: 'white',
            padding: '0.75rem 1.5rem',
            borderRadius: '0.5rem',
            border: 'none',
            cursor: 'pointer',
            fontWeight: '500'
          }}
        >
          <Plus size={20} />
          Yeni Kategori
        </button>
      </div>

      {/* Search */}
      <div style={{ marginBottom: '1.5rem' }}>
        <div style={{ position: 'relative', maxWidth: '300px' }}>
          <Search 
            size={20} 
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
            placeholder="Kategori ara..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              width: '100%',
              padding: '0.75rem 0.75rem 0.75rem 2.5rem',
              backgroundColor: '#374151',
              border: '1px solid #4B5563',
              borderRadius: '0.5rem',
              color: 'white',
              outline: 'none'
            }}
          />
        </div>
      </div>

      {/* Categories Table */}
      <div style={{
        backgroundColor: '#1F2937',
        borderRadius: '0.75rem',
        overflow: 'hidden',
        border: '1px solid #374151'
      }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ backgroundColor: '#374151' }}>
              <th style={{ padding: '1rem', textAlign: 'left', fontWeight: '600' }}>
                Kategori
              </th>
              <th style={{ padding: '1rem', textAlign: 'left', fontWeight: '600' }}>
                Slug
              </th>
              <th style={{ padding: '1rem', textAlign: 'center', fontWeight: '600' }}>
                Ürün Sayısı
              </th>
              <th style={{ padding: '1rem', textAlign: 'center', fontWeight: '600' }}>
                Sıra
              </th>
              <th style={{ padding: '1rem', textAlign: 'center', fontWeight: '600' }}>
                Durum
              </th>
              <th style={{ padding: '1rem', textAlign: 'center', fontWeight: '600' }}>
                İşlemler
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredCategories.map((category, index) => (
              <tr 
                key={category.id}
                style={{ 
                  borderTop: index > 0 ? '1px solid #374151' : 'none',
                  backgroundColor: index % 2 === 0 ? '#1F2937' : '#111827'
                }}
              >
                <td style={{ padding: '1rem' }}>
                  <div>
                    <div style={{ fontWeight: '500' }}>{category.name}</div>
                    {category.description && (
                      <div style={{ fontSize: '0.875rem', color: '#9CA3AF', marginTop: '0.25rem' }}>
                        {category.description}
                      </div>
                    )}
                  </div>
                </td>
                <td style={{ padding: '1rem', color: '#9CA3AF', fontFamily: 'monospace' }}>
                  {category.slug}
                </td>
                <td style={{ padding: '1rem', textAlign: 'center' }}>
                  <div style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center', 
                    gap: '0.25rem' 
                  }}>
                    <Package size={16} style={{ color: '#9CA3AF' }} />
                    <span>{category._count.products}</span>
                  </div>
                </td>
                <td style={{ padding: '1rem', textAlign: 'center' }}>
                  {category.order}
                </td>
                <td style={{ padding: '1rem', textAlign: 'center' }}>
                  <span style={{
                    padding: '0.25rem 0.75rem',
                    borderRadius: '9999px',
                    fontSize: '0.75rem',
                    fontWeight: '500',
                    backgroundColor: category.isActive ? '#10B981' : '#EF4444',
                    color: 'white'
                  }}>
                    {category.isActive ? 'Aktif' : 'Pasif'}
                  </span>
                </td>
                <td style={{ padding: '1rem', textAlign: 'center' }}>
                  <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center' }}>
                    <button
                      onClick={() => handleEdit(category)}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: '2rem',
                        height: '2rem',
                        backgroundColor: '#F59E0B',
                        border: 'none',
                        borderRadius: '0.375rem',
                        cursor: 'pointer',
                        color: 'white'
                      }}
                      title="Düzenle"
                    >
                      <Edit size={16} />
                    </button>
                    <button
                      onClick={() => handleDelete(category.id)}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: '2rem',
                        height: '2rem',
                        backgroundColor: '#EF4444',
                        border: 'none',
                        borderRadius: '0.375rem',
                        cursor: 'pointer',
                        color: 'white'
                      }}
                      title="Sil"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {filteredCategories.length === 0 && (
          <div style={{ 
            padding: '3rem', 
            textAlign: 'center', 
            color: '#9CA3AF' 
          }}>
            Kategori bulunamadı
          </div>
        )}
      </div>

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
          zIndex: 50
        }}>
          <div style={{
            backgroundColor: '#1F2937',
            borderRadius: '0.75rem',
            padding: '2rem',
            width: '100%',
            maxWidth: '500px',
            margin: '1rem',
            border: '1px solid #374151'
          }}>
            <h2 style={{ 
              fontSize: '1.5rem', 
              fontWeight: 'bold', 
              marginBottom: '1.5rem',
              color: 'white'
            }}>
              {editingCategory ? 'Kategori Düzenle' : 'Yeni Kategori'}
            </h2>

            <form onSubmit={handleSubmit}>
              <div style={{ marginBottom: '1rem' }}>
                <label style={{ 
                  display: 'block', 
                  marginBottom: '0.5rem', 
                  fontWeight: '500',
                  color: 'white'
                }}>
                  Kategori Adı *
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => handleNameChange(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    backgroundColor: '#374151',
                    border: formErrors.name ? '1px solid #EF4444' : '1px solid #4B5563',
                    borderRadius: '0.5rem',
                    color: 'white',
                    outline: 'none'
                  }}
                  placeholder="Örn: Elbise"
                />
                {formErrors.name && (
                  <p style={{ color: '#EF4444', fontSize: '0.875rem', marginTop: '0.25rem' }}>
                    {formErrors.name}
                  </p>
                )}
              </div>

              <div style={{ marginBottom: '1rem' }}>
                <label style={{ 
                  display: 'block', 
                  marginBottom: '0.5rem', 
                  fontWeight: '500',
                  color: 'white'
                }}>
                  Slug *
                </label>
                <input
                  type="text"
                  value={formData.slug}
                  onChange={(e) => setFormData({...formData, slug: e.target.value})}
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    backgroundColor: '#374151',
                    border: formErrors.slug ? '1px solid #EF4444' : '1px solid #4B5563',
                    borderRadius: '0.5rem',
                    color: 'white',
                    outline: 'none',
                    fontFamily: 'monospace'
                  }}
                  placeholder="elbise"
                />
                {formErrors.slug && (
                  <p style={{ color: '#EF4444', fontSize: '0.875rem', marginTop: '0.25rem' }}>
                    {formErrors.slug}
                  </p>
                )}
              </div>

              <div style={{ marginBottom: '1rem' }}>
                <label style={{ 
                  display: 'block', 
                  marginBottom: '0.5rem', 
                  fontWeight: '500',
                  color: 'white'
                }}>
                  Açıklama
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  rows={3}
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    backgroundColor: '#374151',
                    border: '1px solid #4B5563',
                    borderRadius: '0.5rem',
                    color: 'white',
                    outline: 'none',
                    resize: 'vertical'
                  }}
                  placeholder="Kategori açıklaması..."
                />
              </div>

              <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
                <div style={{ flex: 1 }}>
                  <label style={{ 
                    display: 'block', 
                    marginBottom: '0.5rem', 
                    fontWeight: '500',
                    color: 'white'
                  }}>
                    Sıra
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={formData.order}
                    onChange={(e) => setFormData({...formData, order: parseInt(e.target.value) || 0})}
                    style={{
                      width: '100%',
                      padding: '0.75rem',
                      backgroundColor: '#374151',
                      border: formErrors.order ? '1px solid #EF4444' : '1px solid #4B5563',
                      borderRadius: '0.5rem',
                      color: 'white',
                      outline: 'none'
                    }}
                  />
                  {formErrors.order && (
                    <p style={{ color: '#EF4444', fontSize: '0.875rem', marginTop: '0.25rem' }}>
                      {formErrors.order}
                    </p>
                  )}
                </div>

                <div style={{ display: 'flex', alignItems: 'end' }}>
                  <label style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: '0.5rem',
                    color: 'white',
                    cursor: 'pointer'
                  }}>
                    <input
                      type="checkbox"
                      checked={formData.isActive}
                      onChange={(e) => setFormData({...formData, isActive: e.target.checked})}
                      style={{ width: '1rem', height: '1rem' }}
                    />
                    Aktif
                  </label>
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
                    padding: '0.75rem 1.5rem',
                    backgroundColor: '#6B7280',
                    border: 'none',
                    borderRadius: '0.5rem',
                    color: 'white',
                    cursor: 'pointer',
                    fontWeight: '500'
                  }}
                >
                  İptal
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  style={{
                    padding: '0.75rem 1.5rem',
                    backgroundColor: isSubmitting ? '#6B7280' : '#3B82F6',
                    border: 'none',
                    borderRadius: '0.5rem',
                    color: 'white',
                    cursor: isSubmitting ? 'not-allowed' : 'pointer',
                    fontWeight: '500'
                  }}
                >
                  {isSubmitting ? 'Kaydediliyor...' : (editingCategory ? 'Güncelle' : 'Kaydet')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}