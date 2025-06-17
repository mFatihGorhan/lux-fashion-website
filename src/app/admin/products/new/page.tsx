'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Save, Package, TrendingUp, Image } from 'lucide-react'
import dynamic from 'next/dynamic'
import adminStyles from '@/styles/admin/admin.module.css'
import ImageUpload from '@/components/admin/ui/ImageUpload'

// Dynamically import RichTextEditor to avoid SSR issues
const RichTextEditor = dynamic(() => import('@/components/admin/ui/RichTextEditor'), {
  ssr: false,
  loading: () => <div className="h-64 bg-gray-100 rounded-lg animate-pulse" />
})

interface Category {
  id: string
  name: string
}

interface Collection {
  id: string
  name: string
}

export default function NewProductPage() {
  const router = useRouter()
  const [categories, setCategories] = useState<Category[]>([])
  const [collections, setCollections] = useState<Collection[]>([])
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    description: '',
    price: '',
    primaryImage: '',
    hoverImage: '',
    additionalImages: [] as string[],
    badge: '',
    categoryId: '',
    collectionId: '',
    featured: false
  })

  useEffect(() => {
    fetchCategories()
    fetchCollections()
  }, [])

  const fetchCategories = async () => {
    try {
      const response = await fetch('/api/admin/categories')
      if (response.ok) {
        const data = await response.json()
        setCategories(Array.isArray(data) ? data : data.categories || [])
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
      }
    } catch (error) {
      console.error('Failed to fetch collections:', error)
    }
  }

  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .replace(/ğ/g, 'g')
      .replace(/ü/g, 'u')
      .replace(/ş/g, 's')
      .replace(/ı/g, 'i')
      .replace(/ö/g, 'o')
      .replace(/ç/g, 'c')
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim()
  }

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const name = e.target.value
    setFormData(prev => ({
      ...prev,
      name,
      slug: generateSlug(name)
    }))
  }


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.name || !formData.price || !formData.categoryId || !formData.collectionId || !formData.primaryImage) {
      alert('Lütfen gerekli alanları doldurun (Ad, Fiyat, Kategori, Koleksiyon ve Ana Görsel zorunludur)')
      return
    }

    setLoading(true)

    try {
      const response = await fetch('/api/admin/products', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      })

      if (response.ok) {
        router.push('/admin/products')
      } else {
        alert('Ürün eklenirken hata oluştu')
      }
    } catch (error) {
      console.error('Failed to create product:', error)
      alert('Ürün eklenirken hata oluştu')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-4 mb-4">
          <Link
            href="/admin/products"
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeft size={20} className="text-gray-600" />
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Yeni Ürün Ekle</h1>
            <p className="text-gray-600 mt-1">Ürün bilgilerini eksiksiz doldurun</p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Basic Information */}
        <div className={adminStyles.card}>
          <div className={adminStyles.cardHeader}>
            <h2 className={adminStyles.cardTitle}>
              <Package size={20} />
              Temel Bilgiler
            </h2>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="lg:col-span-2">
              <div className={adminStyles.formGroup}>
                <label className={adminStyles.label}>
                  Ürün Adı *
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={handleNameChange}
                  placeholder="Ürün adını girin"
                  className={adminStyles.input}
                  required
                />
              </div>
            </div>

            <div>
              <div className={adminStyles.formGroup}>
                <label className={adminStyles.label}>
                  URL Slug
                </label>
                <input
                  type="text"
                  value={formData.slug}
                  onChange={(e) => setFormData(prev => ({ ...prev, slug: e.target.value }))}
                  placeholder="otomatik-oluşturulur"
                  className={adminStyles.input}
                  readOnly
                  style={{ opacity: 0.7 }}
                />
              </div>
            </div>

            <div>
              <div className={adminStyles.formGroup}>
                <label className={adminStyles.label}>
                  Kategori *
                </label>
                <select
                  value={formData.categoryId}
                  onChange={(e) => setFormData(prev => ({ ...prev, categoryId: e.target.value }))}
                  className={adminStyles.select}
                  required
                >
                  <option value="">Kategori seçin</option>
                  {categories.map(category => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <div className={adminStyles.formGroup}>
                <label className={adminStyles.label}>
                  Koleksiyon *
                </label>
                <select
                  value={formData.collectionId}
                  onChange={(e) => setFormData(prev => ({ ...prev, collectionId: e.target.value }))}
                  className={adminStyles.select}
                  required
                >
                  <option value="">Koleksiyon seçin</option>
                  {collections.map(collection => (
                    <option key={collection.id} value={collection.id}>
                      {collection.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="lg:col-span-2">
              <div className={adminStyles.formGroup}>
                <label className={adminStyles.label}>
                  Ürün Açıklaması
                </label>
                <RichTextEditor
                  value={formData.description}
                  onChange={(content) => setFormData(prev => ({ ...prev, description: content }))}
                  placeholder="Ürün hakkında detaylı bilgi verin"
                  height={300}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Pricing & Settings */}
        <div className={adminStyles.card}>
          <div className={adminStyles.cardHeader}>
            <h2 className={adminStyles.cardTitle}>
              <TrendingUp size={20} />
              Fiyat ve Ayarlar
            </h2>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div>
              <div className={adminStyles.formGroup}>
                <label className={adminStyles.label}>
                  Fiyat *
                </label>
                <input
                  type="text"
                  value={formData.price}
                  onChange={(e) => setFormData(prev => ({ ...prev, price: e.target.value }))}
                  placeholder="2850"
                  className={adminStyles.input}
                  required
                />
              </div>
            </div>

            <div>
              <div className={adminStyles.formGroup}>
                <label className={adminStyles.label}>
                  Badge
                </label>
                <input
                  type="text"
                  value={formData.badge}
                  onChange={(e) => setFormData(prev => ({ ...prev, badge: e.target.value }))}
                  placeholder="Yeni, Limited Edition, Son Parçalar"
                  className={adminStyles.input}
                />
              </div>
            </div>

            <div className="lg:col-span-2">
              <div className="bg-gray-700 rounded-lg p-4">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.featured}
                    onChange={(e) => setFormData(prev => ({ ...prev, featured: e.target.checked }))}
                    className="w-5 h-5 text-blue-600 border-gray-600 rounded focus:ring-blue-500 bg-gray-700"
                  />
                  <div>
                    <span className="text-sm font-medium text-gray-100">Öne Çıkarılsın</span>
                    <p className="text-xs text-gray-300">Bu ürün ana sayfada öne çıkan ürünler bölümünde görünür</p>
                  </div>
                </label>
              </div>
            </div>
          </div>
        </div>

        {/* Images */}
        <div className={adminStyles.card}>
          <div className={adminStyles.cardHeader}>
            <h2 className={adminStyles.cardTitle}>
              <Image size={20} />
              Ürün Görselleri
            </h2>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <ImageUpload
              label="Ana Görsel *"
              value={formData.primaryImage}
              onChange={(url) => setFormData(prev => ({ ...prev, primaryImage: url }))}
            />

            <ImageUpload
              label="Hover Görseli"
              value={formData.hoverImage}
              onChange={(url) => setFormData(prev => ({ ...prev, hoverImage: url }))}
            />
            
            <div className="lg:col-span-2">
              <label className={adminStyles.label}>Ek Görseller</label>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {formData.additionalImages.map((url, index) => (
                  <div key={index} className={adminStyles.imagePreview}>
                    <img src={url} alt={`Ek görsel ${index + 1}`} />
                    <button
                      type="button"
                      onClick={() => {
                        const newImages = formData.additionalImages.filter((_, i) => i !== index)
                        setFormData(prev => ({ ...prev, additionalImages: newImages }))
                      }}
                      className={adminStyles.removeImage}
                      title="Görseli kaldır"
                    >
                      ×
                    </button>
                  </div>
                ))}
                
                {formData.additionalImages.length < 6 && (
                  <ImageUpload
                    label=""
                    value=""
                    onChange={(url) => {
                      if (url) {
                        setFormData(prev => ({
                          ...prev,
                          additionalImages: [...prev.additionalImages, url]
                        }))
                      }
                    }}
                    className="h-full"
                  />
                )}
              </div>
              <p className="text-xs text-gray-400 mt-2">
                Maksimum 6 ek görsel ekleyebilirsiniz
              </p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 sm:justify-end">
          <Link
            href="/admin/products"
            className={adminStyles.btnSecondary}
          >
            İptal
          </Link>
          <button
            type="submit"
            disabled={loading}
            className={`${adminStyles.btnPrimary} ${loading ? adminStyles.loading : ''}`}
          >
            <Save size={18} />
            {loading ? 'Kaydediliyor...' : 'Ürünü Kaydet'}
          </button>
        </div>
      </form>
    </div>
  )
}