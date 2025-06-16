'use client'

import { useState, useEffect } from 'react'
import { Plus, Edit2, Trash2, Search, Eye, EyeOff, Package, Calendar, Hash } from 'lucide-react'

interface Collection {
  id: string
  name: string
  slug: string
  description: string | null
  season: string | null
  order: number
  isActive: boolean
  createdAt: string
  updatedAt: string
  _count: {
    products: number
  }
}

interface CollectionsResponse {
  collections: Collection[]
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}

export default function CollectionsPage() {
  const [data, setData] = useState<CollectionsResponse | null>(null)
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editingCollection, setEditingCollection] = useState<Collection | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive'>('all')
  
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    description: '',
    season: '',
    order: 0,
    isActive: true
  })
  
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    fetchCollections()
  }, [currentPage, searchTerm, statusFilter])

  const fetchCollections = async () => {
    try {
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: '10'
      })
      
      if (searchTerm) {
        params.append('search', searchTerm)
      }
      
      if (statusFilter !== 'all') {
        params.append('isActive', statusFilter === 'active' ? 'true' : 'false')
      }

      const response = await fetch(`/api/admin/collections?${params}`)
      if (response.ok) {
        const collectionsData = await response.json()
        setData(collectionsData)
      }
    } catch (error) {
      console.error('Failed to fetch collections:', error)
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
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim()
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setErrors({})

    try {
      const url = editingCollection 
        ? `/api/admin/collections/${editingCollection.id}`
        : '/api/admin/collections'
      
      const method = editingCollection ? 'PUT' : 'POST'

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        await fetchCollections()
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
    if (!confirm('Bu koleksiyonu silmek istediğinizden emin misiniz?')) return

    try {
      const response = await fetch(`/api/admin/collections/${id}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        await fetchCollections()
      } else {
        const error = await response.json()
        alert(`Hata: ${error.error}`)
      }
    } catch (error) {
      console.error('Delete error:', error)
      alert('Silme sırasında hata oluştu')
    }
  }

  const openModal = (collection?: Collection) => {
    if (collection) {
      setEditingCollection(collection)
      setFormData({
        name: collection.name,
        slug: collection.slug,
        description: collection.description || '',
        season: collection.season || '',
        order: collection.order,
        isActive: collection.isActive
      })
    } else {
      setEditingCollection(null)
      resetForm()
    }
    setShowModal(true)
  }

  const resetForm = () => {
    setFormData({
      name: '',
      slug: '',
      description: '',
      season: '',
      order: 0,
      isActive: true
    })
    setErrors({})
    setEditingCollection(null)
  }

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    
    if (field === 'name' && !editingCollection) {
      setFormData(prev => ({ ...prev, slug: generateSlug(value) }))
    }
    
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }))
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('tr-TR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
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
        <div>Koleksiyonlar yükleniyor...</div>
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
            Koleksiyonlar
          </h1>
          <p style={{ color: '#9CA3AF', margin: '0.5rem 0 0 0' }}>
            Ürün koleksiyonlarınızı yönetin
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
          Yeni Koleksiyon
        </button>
      </div>

      {/* Filters */}
      <div style={{ 
        display: 'flex', 
        gap: '1rem', 
        marginBottom: '2rem',
        flexWrap: 'wrap'
      }}>
        <div style={{ position: 'relative', flex: 1, minWidth: '300px' }}>
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
            placeholder="Koleksiyon ara..."
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

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value as any)}
          style={{
            padding: '0.75rem',
            backgroundColor: '#374151',
            border: '1px solid #4B5563',
            borderRadius: '0.5rem',
            color: 'white',
            minWidth: '120px'
          }}
        >
          <option value="all">Tüm Durumlar</option>
          <option value="active">Aktif</option>
          <option value="inactive">Pasif</option>
        </select>
      </div>

      {/* Collections Table */}
      <div style={{
        backgroundColor: '#1F2937',
        borderRadius: '0.75rem',
        overflow: 'hidden',
        border: '1px solid #374151'
      }}>
        {data?.collections.length === 0 ? (
          <div style={{ 
            padding: '3rem', 
            textAlign: 'center', 
            color: '#9CA3AF' 
          }}>
            {searchTerm || statusFilter !== 'all' 
              ? 'Filtrelere uygun koleksiyon bulunamadı' 
              : 'Henüz koleksiyon eklenmemiş'
            }
          </div>
        ) : (
          <>
            <div style={{
              display: 'grid',
              gridTemplateColumns: '2fr 1fr 1fr 1fr 80px 80px',
              gap: '1rem',
              padding: '1rem',
              backgroundColor: '#374151',
              fontWeight: '600',
              fontSize: '0.875rem'
            }}>
              <div>Koleksiyon</div>
              <div>Sezon</div>
              <div style={{ textAlign: 'center' }}>Ürün Sayısı</div>
              <div style={{ textAlign: 'center' }}>Durum</div>
              <div></div>
              <div></div>
            </div>
            
            {data?.collections.map((collection, index) => (
              <div
                key={collection.id}
                style={{
                  display: 'grid',
                  gridTemplateColumns: '2fr 1fr 1fr 1fr 80px 80px',
                  gap: '1rem',
                  padding: '1rem',
                  borderBottom: index < data.collections.length - 1 ? '1px solid #374151' : 'none',
                  alignItems: 'center'
                }}
              >
                <div>
                  <h3 style={{ margin: '0 0 0.25rem 0', fontWeight: '600' }}>
                    {collection.name}
                  </h3>
                  <p style={{ 
                    margin: 0, 
                    fontSize: '0.875rem', 
                    color: '#9CA3AF',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.25rem'
                  }}>
                    <Hash size={12} />
                    {collection.slug}
                  </p>
                  {collection.description && (
                    <p style={{ 
                      margin: '0.25rem 0 0 0', 
                      fontSize: '0.75rem', 
                      color: '#6B7280'
                    }}>
                      {collection.description.length > 100 
                        ? collection.description.substring(0, 100) + '...' 
                        : collection.description
                      }
                    </p>
                  )}
                </div>

                <div style={{ fontSize: '0.875rem', color: '#D1D5DB' }}>
                  {collection.season ? (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                      <Calendar size={14} />
                      {collection.season}
                    </div>
                  ) : (
                    <span style={{ color: '#6B7280' }}>-</span>
                  )}
                </div>

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
                    <Package size={14} />
                    {collection._count.products}
                  </div>
                </div>

                <div style={{ textAlign: 'center' }}>
                  <span style={{
                    padding: '0.25rem 0.75rem',
                    borderRadius: '9999px',
                    fontSize: '0.75rem',
                    fontWeight: '500',
                    backgroundColor: collection.isActive ? '#10B981' : '#6B7280',
                    color: 'white',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.25rem'
                  }}>
                    {collection.isActive ? <Eye size={12} /> : <EyeOff size={12} />}
                    {collection.isActive ? 'Aktif' : 'Pasif'}
                  </span>
                </div>

                <button
                  onClick={() => openModal(collection)}
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
                  onClick={() => handleDelete(collection.id)}
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
            maxWidth: '600px',
            maxHeight: '90vh',
            overflow: 'auto',
            border: '1px solid #374151'
          }}>
            <h2 style={{ 
              fontSize: '1.5rem', 
              fontWeight: 'bold', 
              marginBottom: '1.5rem',
              color: 'white'
            }}>
              {editingCollection ? 'Koleksiyon Düzenle' : 'Yeni Koleksiyon'}
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
                    Koleksiyon Adı *
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
                    placeholder="Yaz Koleksiyonu 2024"
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
                      border: `1px solid ${errors.slug ? '#EF4444' : '#4B5563'}`,
                      borderRadius: '0.5rem',
                      color: 'white'
                    }}
                    placeholder="yaz-koleksiyonu-2024"
                  />
                  {errors.slug && (
                    <span style={{ color: '#EF4444', fontSize: '0.875rem' }}>
                      {errors.slug}
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
                    Sezon
                  </label>
                  <input
                    type="text"
                    value={formData.season}
                    onChange={(e) => handleInputChange('season', e.target.value)}
                    style={{
                      width: '100%',
                      padding: '0.75rem',
                      backgroundColor: '#374151',
                      border: '1px solid #4B5563',
                      borderRadius: '0.5rem',
                      color: 'white'
                    }}
                    placeholder="Yaz 2024"
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
                    Açıklama
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => handleInputChange('description', e.target.value)}
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
                    placeholder="Koleksiyon açıklaması..."
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
                      Sıralama
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
                      min="0"
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
                      Durum
                    </label>
                    <label style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                      padding: '0.75rem',
                      backgroundColor: '#374151',
                      borderRadius: '0.5rem',
                      cursor: 'pointer'
                    }}>
                      <input
                        type="checkbox"
                        checked={formData.isActive}
                        onChange={(e) => handleInputChange('isActive', e.target.checked)}
                        style={{ marginRight: '0.5rem' }}
                      />
                      Aktif
                    </label>
                  </div>
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