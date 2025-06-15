'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Save } from 'lucide-react'

interface Category {
  id: string
  name: string
}

export default function NewProductPage() {
  const router = useRouter()
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    description: '',
    price: '',
    primaryImage: '',
    hoverImage: '',
    badge: '',
    categoryId: '',
    featured: false
  })

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
    
    if (!formData.name || !formData.price || !formData.categoryId || !formData.primaryImage) {
      alert('Lütfen gerekli alanları doldurun')
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
    <div className="p-6">
      <div className="flex items-center gap-4 mb-6">
        <Link
          href="/admin/products"
          className="p-2 hover:bg-gray-100 rounded"
        >
          <ArrowLeft size={20} />
        </Link>
        <h1 className="text-2xl font-bold">Yeni Ürün Ekle</h1>
      </div>

      <form onSubmit={handleSubmit} className="max-w-2xl">
        <div className="bg-white rounded-lg shadow p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium mb-2">
                Ürün Adı *
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={handleNameChange}
                className="w-full p-3 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                URL Slug
              </label>
              <input
                type="text"
                value={formData.slug}
                onChange={(e) => setFormData(prev => ({ ...prev, slug: e.target.value }))}
                className="w-full p-3 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              Açıklama
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              rows={4}
              className="w-full p-3 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium mb-2">
                Fiyat *
              </label>
              <input
                type="text"
                value={formData.price}
                onChange={(e) => setFormData(prev => ({ ...prev, price: e.target.value }))}
                placeholder="2,850 TL"
                className="w-full p-3 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Kategori *
              </label>
              <select
                value={formData.categoryId}
                onChange={(e) => setFormData(prev => ({ ...prev, categoryId: e.target.value }))}
                className="w-full p-3 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              >
                <option value="">Kategori Seçin</option>
                {categories.map(category => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium mb-2">
                Ana Görsel URL *
              </label>
              <input
                type="url"
                value={formData.primaryImage}
                onChange={(e) => setFormData(prev => ({ ...prev, primaryImage: e.target.value }))}
                placeholder="https://example.com/image.jpg"
                className="w-full p-3 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Hover Görsel URL
              </label>
              <input
                type="url"
                value={formData.hoverImage}
                onChange={(e) => setFormData(prev => ({ ...prev, hoverImage: e.target.value }))}
                placeholder="https://example.com/hover-image.jpg"
                className="w-full p-3 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              Badge
            </label>
            <input
              type="text"
              value={formData.badge}
              onChange={(e) => setFormData(prev => ({ ...prev, badge: e.target.value }))}
              placeholder="Yeni, Limited Edition, Son Parçalar"
              className="w-full p-3 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div className="flex gap-6">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={formData.featured}
                onChange={(e) => setFormData(prev => ({ ...prev, featured: e.target.checked }))}
                className="w-4 h-4 text-blue-600"
              />
              <span className="text-sm font-medium">Öne Çıkarılsın</span>
            </label>
          </div>

          <div className="flex justify-end gap-4 pt-6 border-t">
            <Link
              href="/admin/products"
              className="px-6 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
            >
              İptal
            </Link>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 flex items-center gap-2"
            >
              <Save size={16} />
              {loading ? 'Kaydediliyor...' : 'Kaydet'}
            </button>
          </div>
        </div>
      </form>
    </div>
  )
}