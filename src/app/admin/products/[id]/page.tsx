'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Save, Trash2 } from 'lucide-react'
import dynamic from 'next/dynamic'

// Dynamically import RichTextEditor to avoid SSR issues
const RichTextEditor = dynamic(() => import('@/components/admin/ui/RichTextEditor'), {
  ssr: false,
  loading: () => <div className="h-64 bg-gray-100 rounded-lg animate-pulse" />
})

interface Product {
  id: string
  name: string
  slug: string
  description: string
  price: number
  primaryImage: string
  primaryImageAlt: string
  hoverImage: string
  hoverImageAlt: string
  badge: string
  colors: string[]
  order: number
  featured: boolean
  isActive: boolean
  categoryId: string
  collectionId: string | null
  metaTitle: string | null
  metaDescription: string | null
  category: {
    id: string
    name: string
  }
  collection: {
    id: string
    name: string
  } | null
}

interface Category {
  id: string
  name: string
}

interface Collection {
  id: string
  name: string
}

export default function ProductEditPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter()
  const [product, setProduct] = useState<Product | null>(null)
  const [categories, setCategories] = useState<Category[]>([])
  const [collections, setCollections] = useState<Collection[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [productId, setProductId] = useState<string>('')
  const [isInitialized, setIsInitialized] = useState(false)

  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    description: '',
    price: 0,
    primaryImage: '',
    primaryImageAlt: '',
    hoverImage: '',
    hoverImageAlt: '',
    badge: '',
    colors: [] as string[],
    order: 0,
    featured: false,
    isActive: true,
    categoryId: '',
    collectionId: '',
    metaTitle: '',
    metaDescription: ''
  })

  useEffect(() => {
    const initializeComponent = async () => {
      try {
        const resolvedParams = await params
        const { id } = resolvedParams
        setProductId(id)
        setIsInitialized(true)
        
        // Fetch data
        await Promise.all([
          fetchProduct(id),
          fetchCategories(),
          fetchCollections()
        ])
      } catch (error) {
        console.error('Error initializing component:', error)
        setLoading(false)
      }
    }

    initializeComponent()
  }, [params])

  const fetchProduct = async (id: string) => {
    try {
      const response = await fetch(`/api/admin/products/${id}`)
      if (response.ok) {
        const productData = await response.json()
        setProduct(productData)
        setFormData({
          name: productData.name || '',
          slug: productData.slug || '',
          description: productData.description || '',
          price: productData.price || 0,
          primaryImage: productData.primaryImage || '',
          primaryImageAlt: productData.primaryImageAlt || '',
          hoverImage: productData.hoverImage || '',
          hoverImageAlt: productData.hoverImageAlt || '',
          badge: productData.badge || '',
          colors: productData.colors || [],
          order: productData.order || 0,
          featured: productData.featured || false,
          isActive: productData.isActive !== undefined ? productData.isActive : true,
          categoryId: productData.categoryId || '',
          collectionId: productData.collectionId || '',
          metaTitle: productData.metaTitle || '',
          metaDescription: productData.metaDescription || ''
        })
      } else {
        console.error('Failed to fetch product:', response.status, response.statusText)
      }
    } catch (error) {
      console.error('Failed to fetch product:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchCategories = async () => {
    try {
      const response = await fetch('/api/admin/categories')
      if (response.ok) {
        const data = await response.json()
        setCategories(Array.isArray(data) ? data : data.categories || [])
      } else {
        console.error('Failed to fetch categories:', response.status, response.statusText)
      }
    } catch (error) {
      console.error('Failed to fetch categories:', error)
    }
  }

  const fetchCollections = async () => {
    try {
      const response = await fetch('/api/admin/collections')
      if (response.ok) {
        const data = await response.json()
        setCollections(Array.isArray(data) ? data : data.collections || [])
      } else {
        console.error('Failed to fetch collections:', response.status, response.statusText)
      }
    } catch (error) {
      console.error('Failed to fetch collections:', error)
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
    
    // Validation - koleksiyon seçimi zorunlu
    if (!formData.collectionId) {
      alert('Koleksiyon seçimi zorunludur!')
      return
    }
    
    setSaving(true)

    try {
      const response = await fetch(`/api/admin/products/${productId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          price: parseFloat(formData.price.toString()),
          collectionId: formData.collectionId
        }),
      })

      if (response.ok) {
        alert('Ürün başarıyla güncellendi!')
        router.push('/admin/products')
      } else {
        const error = await response.json()
        alert(`Hata: ${error.error}`)
      }
    } catch (error) {
      console.error('Failed to update product:', error)
      alert('Ürün güncellenirken hata oluştu')
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async () => {
    if (!confirm('Bu ürünü silmek istediğinizden emin misiniz? Bu işlem geri alınamaz.')) {
      return
    }

    setDeleting(true)

    try {
      const response = await fetch(`/api/admin/products/${productId}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        alert('Ürün başarıyla silindi!')
        router.push('/admin/products')
      } else {
        const error = await response.json()
        alert(`Hata: ${error.error}`)
      }
    } catch (error) {
      console.error('Failed to delete product:', error)
      alert('Ürün silinirken hata oluştu')
    } finally {
      setDeleting(false)
    }
  }

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    
    if (field === 'name') {
      setFormData(prev => ({ ...prev, slug: generateSlug(value) }))
    }
  }

  const addColor = () => {
    const colorInput = document.getElementById('newColor') as HTMLInputElement
    const color = colorInput?.value
    if (color && !formData.colors.includes(color)) {
      setFormData(prev => ({ ...prev, colors: [...prev.colors, color] }))
      colorInput.value = ''
    }
  }

  const removeColor = (colorToRemove: string) => {
    setFormData(prev => ({ 
      ...prev, 
      colors: prev.colors.filter(color => color !== colorToRemove) 
    }))
  }

  if (loading || !isInitialized) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '200px',
        color: 'white'
      }}>
        <div>Ürün yükleniyor...</div>
      </div>
    )
  }

  if (!product) {
    return (
      <div style={{ padding: '2rem', color: 'white' }}>
        <h1>Ürün bulunamadı</h1>
        <button
          onClick={() => router.push('/admin/products')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            padding: '0.75rem 1rem',
            backgroundColor: '#6B7280',
            border: 'none',
            borderRadius: '0.5rem',
            color: 'white',
            cursor: 'pointer',
            marginTop: '1rem'
          }}
        >
          <ArrowLeft size={16} />
          Geri Dön
        </button>
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
            onClick={() => router.push('/admin/products')}
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
              Ürün Düzenle
            </h1>
            <p style={{ color: '#9CA3AF', margin: '0.5rem 0 0 0' }}>
              {product.name}
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '1rem' }}>
          <button
            onClick={handleDelete}
            disabled={deleting}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '0.75rem 1rem',
              backgroundColor: deleting ? '#6B7280' : '#EF4444',
              border: 'none',
              borderRadius: '0.5rem',
              color: 'white',
              cursor: deleting ? 'not-allowed' : 'pointer'
            }}
          >
            <Trash2 size={16} />
            {deleting ? 'Siliniyor...' : 'Sil'}
          </button>
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
              Ürün Bilgileri
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
                  Ürün Adı *
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
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
                  Açıklama
                </label>
                <div style={{
                  backgroundColor: 'white',
                  borderRadius: '0.5rem',
                  padding: '1rem',
                  border: '1px solid #4B5563'
                }}>
                  <RichTextEditor
                    value={formData.description}
                    onChange={(content) => handleInputChange('description', content)}
                    placeholder="Ürün hakkında detaylı bilgi verin"
                    height={300}
                  />
                </div>
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
                    Fiyat (₺) *
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.price}
                    onChange={(e) => handleInputChange('price', parseFloat(e.target.value) || 0)}
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

              {/* Renkler */}
              <div>
                <label style={{ 
                  display: 'block', 
                  fontSize: '0.875rem', 
                  fontWeight: '500', 
                  marginBottom: '0.5rem',
                  color: '#D1D5DB'
                }}>
                  Renkler
                </label>
                <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.5rem' }}>
                  <input
                    type="color"
                    id="newColor"
                    style={{
                      width: '50px',
                      height: '40px',
                      backgroundColor: '#374151',
                      border: '1px solid #4B5563',
                      borderRadius: '0.5rem'
                    }}
                  />
                  <button
                    type="button"
                    onClick={addColor}
                    style={{
                      padding: '0.5rem 1rem',
                      backgroundColor: '#3B82F6',
                      border: 'none',
                      borderRadius: '0.5rem',
                      color: 'white',
                      cursor: 'pointer'
                    }}
                  >
                    Ekle
                  </button>
                </div>
                <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                  {formData.colors.map((color, index) => (
                    <div
                      key={index}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        padding: '0.25rem 0.5rem',
                        backgroundColor: '#374151',
                        borderRadius: '0.375rem'
                      }}
                    >
                      <div
                        style={{
                          width: '20px',
                          height: '20px',
                          backgroundColor: color,
                          borderRadius: '50%',
                          border: '1px solid #4B5563'
                        }}
                      />
                      <span style={{ fontSize: '0.875rem' }}>{color}</span>
                      <button
                        type="button"
                        onClick={() => removeColor(color)}
                        style={{
                          background: 'none',
                          border: 'none',
                          color: '#EF4444',
                          cursor: 'pointer',
                          fontSize: '0.875rem'
                        }}
                      >
                        ×
                      </button>
                    </div>
                  ))}
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
                    checked={formData.isActive}
                    onChange={(e) => handleInputChange('isActive', e.target.checked)}
                    style={{ width: '16px', height: '16px' }}
                  />
                  <span style={{ fontSize: '0.875rem', color: '#D1D5DB' }}>Aktif</span>
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
                {saving ? 'Kaydediliyor...' : 'Güncelle'}
              </button>
            </div>

            {/* Kategori & Koleksiyon */}
            <div style={{
              backgroundColor: '#1F2937',
              borderRadius: '0.75rem',
              padding: '1.5rem',
              border: '1px solid #374151'
            }}>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '1rem' }}>
                Kategori & Koleksiyon
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
                    Kategori *
                  </label>
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

                <div>
                  <label style={{ 
                    display: 'block', 
                    fontSize: '0.875rem', 
                    fontWeight: '500', 
                    marginBottom: '0.5rem',
                    color: '#D1D5DB'
                  }}>
                    Koleksiyon *
                  </label>
                  <select
                    value={formData.collectionId}
                    onChange={(e) => handleInputChange('collectionId', e.target.value)}
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
                    <option value="">Koleksiyon Seçin</option>
                    {collections.map((collection) => (
                      <option key={collection.id} value={collection.id}>
                        {collection.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Görsel Bilgileri */}
            <div style={{
              backgroundColor: '#1F2937',
              borderRadius: '0.75rem',
              padding: '1.5rem',
              border: '1px solid #374151'
            }}>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '1rem' }}>
                Görseller
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
                    Ana Görsel URL *
                  </label>
                  <input
                    type="url"
                    value={formData.primaryImage}
                    onChange={(e) => handleInputChange('primaryImage', e.target.value)}
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
                    Hover Görsel URL *
                  </label>
                  <input
                    type="url"
                    value={formData.hoverImage}
                    onChange={(e) => handleInputChange('hoverImage', e.target.value)}
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
                    Rozet
                  </label>
                  <input
                    type="text"
                    value={formData.badge}
                    onChange={(e) => handleInputChange('badge', e.target.value)}
                    style={{
                      width: '100%',
                      padding: '0.75rem',
                      backgroundColor: '#374151',
                      border: '1px solid #4B5563',
                      borderRadius: '0.5rem',
                      color: 'white'
                    }}
                    placeholder="Yeni, Limited Edition, vb."
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