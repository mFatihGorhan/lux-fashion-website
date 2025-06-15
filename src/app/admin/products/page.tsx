'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Plus, Edit, Trash2, Eye } from 'lucide-react'

interface Product {
  id: string
  name: string
  price: string
  primaryImage: string
  hoverImage: string
  badge?: string
  featured: boolean
  category: {
    name: string
  }
  createdAt: string
}

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchProducts()
  }, [])

  const fetchProducts = async () => {
    try {
      const response = await fetch('/api/admin/products')
      if (response.ok) {
        const data = await response.json()
        setProducts(data)
      }
    } catch (error) {
      console.error('Failed to fetch products:', error)
    } finally {
      setLoading(false)
    }
  }

  const deleteProduct = async (id: string) => {
    if (!confirm('Bu urun silinsin mi?')) return

    try {
      const response = await fetch(`/api/admin/products/${id}`, {
        method: 'DELETE'
      })
      
      if (response.ok) {
        setProducts(products.filter(p => p.id !== id))
      }
    } catch (error) {
      console.error('Failed to delete product:', error)
    }
  }

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-48 mb-6"></div>
          <div className="space-y-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-16 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Ürünler</h1>
            <p className="text-gray-600 mt-1">{products.length} ürün listeleniyor</p>
          </div>
          <Link
            href="/admin/products/new"
            className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-lg hover:from-blue-700 hover:to-purple-700 flex items-center gap-2 transition-all shadow-lg hover:shadow-xl"
          >
            <Plus size={20} />
            Yeni Ürün Ekle
          </Link>
        </div>
      </div>

      {/* Products Grid */}
      {products.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
          <div className="max-w-sm mx-auto">
            <Package size={48} className="text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Henüz ürün yok</h3>
            <p className="text-gray-600 mb-6">İlk ürününüzü ekleyerek başlayın</p>
            <Link
              href="/admin/products/new"
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 inline-flex items-center gap-2"
            >
              <Plus size={18} />
              İlk Ürünü Ekle
            </Link>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {products.map((product) => (
            <div key={product.id} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow">
              {/* Product Image */}
              <div className="relative aspect-square bg-gray-100">
                {product.primaryImage ? (
                  <Image
                    src={product.primaryImage}
                    alt={product.name}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <Package size={48} className="text-gray-400" />
                  </div>
                )}
                
                {/* Badges */}
                <div className="absolute top-3 left-3 flex flex-col gap-2">
                  {product.featured && (
                    <span className="bg-yellow-500 text-white px-2 py-1 rounded-full text-xs font-medium">
                      Öne Çıkan
                    </span>
                  )}
                  {product.badge && (
                    <span className="bg-blue-500 text-white px-2 py-1 rounded-full text-xs font-medium">
                      {product.badge}
                    </span>
                  )}
                </div>

                {/* Actions Overlay */}
                <div className="absolute inset-0 bg-black bg-opacity-0 hover:bg-opacity-40 transition-all duration-200 flex items-center justify-center opacity-0 hover:opacity-100">
                  <div className="flex gap-2">
                    <Link
                      href={`/admin/products/${product.id}`}
                      className="bg-white text-gray-700 p-2 rounded-full hover:bg-gray-100 transition-colors"
                      title="Görüntüle"
                    >
                      <Eye size={16} />
                    </Link>
                    <Link
                      href={`/admin/products/${product.id}/edit`}
                      className="bg-white text-gray-700 p-2 rounded-full hover:bg-gray-100 transition-colors"
                      title="Düzenle"
                    >
                      <Edit size={16} />
                    </Link>
                    <button
                      onClick={() => deleteProduct(product.id)}
                      className="bg-white text-red-600 p-2 rounded-full hover:bg-red-50 transition-colors"
                      title="Sil"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              </div>

              {/* Product Info */}
              <div className="p-4">
                <div className="mb-2">
                  <h3 className="font-medium text-gray-900 truncate" title={product.name}>
                    {product.name}
                  </h3>
                  <p className="text-sm text-gray-600">{product.category.name}</p>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-lg font-semibold text-gray-900">
                    {product.price}
                  </span>
                  <div className="flex gap-1">
                    <Link
                      href={`/admin/products/${product.id}/edit`}
                      className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                    >
                      Düzenle
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}