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
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Urunler</h1>
        <Link
          href="/admin/products/new"
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 flex items-center gap-2"
        >
          <Plus size={20} />
          Yeni Urun
        </Link>
      </div>

      <div className="bg-white rounded-lg shadow">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="text-left p-4 font-medium">Urun</th>
                <th className="text-left p-4 font-medium">Kategori</th>
                <th className="text-left p-4 font-medium">Fiyat</th>
                <th className="text-left p-4 font-medium">Badge</th>
                <th className="text-left p-4 font-medium">Ozel</th>
                <th className="text-left p-4 font-medium">Islemler</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr key={product.id} className="border-b hover:bg-gray-50">
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      {product.primaryImage && (
                        <Image
                          src={product.primaryImage}
                          alt={product.name}
                          width={48}
                          height={48}
                          className="w-12 h-12 object-cover rounded"
                        />
                      )}
                      <div>
                        <div className="font-medium">{product.name}</div>
                      </div>
                    </div>
                  </td>
                  <td className="p-4">{product.category.name}</td>
                  <td className="p-4">
                    <span className="font-medium">{product.price}</span>
                  </td>
                  <td className="p-4">
                    {product.badge && (
                      <span className="px-2 py-1 rounded-full text-xs bg-gray-100 text-gray-800">
                        {product.badge}
                      </span>
                    )}
                  </td>
                  <td className="p-4">
                    {product.featured && (
                      <span className="px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-800">
                        Ozel
                      </span>
                    )}
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      <Link
                        href={`/admin/products/${product.id}`}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded"
                      >
                        <Eye size={16} />
                      </Link>
                      <Link
                        href={`/admin/products/${product.id}/edit`}
                        className="p-2 text-gray-600 hover:bg-gray-50 rounded"
                      >
                        <Edit size={16} />
                      </Link>
                      <button
                        onClick={() => deleteProduct(product.id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {products.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">Henuz urun eklenmemis</p>
            <Link
              href="/admin/products/new"
              className="text-blue-600 hover:underline mt-2 inline-block"
            >
              Ilk urunu ekle
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}