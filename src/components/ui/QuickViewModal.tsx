'use client'

import { useState, useEffect } from 'react'
import { X, Heart, ShoppingBag, Star, Truck, Shield, RotateCcw } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'

interface Product {
  id: string
  name: string
  slug: string
  description?: string
  price: number | string
  primaryImage: string
  primaryImageAlt?: string
  hoverImage: string
  hoverImageAlt?: string
  category: {
    id: string
    name: string
    slug: string
  }
  colors?: string[]
  badge?: string
  featured?: boolean
}

interface QuickViewModalProps {
  isOpen: boolean
  onClose: () => void
  productId: string
}

export default function QuickViewModal({ isOpen, onClose, productId }: QuickViewModalProps) {
  const [product, setProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState(false)
  const [selectedImage, setSelectedImage] = useState<'primary' | 'hover'>('primary')
  const [selectedColor, setSelectedColor] = useState<string>('')
  const [isWishlisted, setIsWishlisted] = useState(false)

  useEffect(() => {
    if (isOpen && productId) {
      fetchProduct()
    }
  }, [isOpen, productId])

  const fetchProduct = async () => {
    setLoading(true)
    try {
      const response = await fetch(`/api/products/${productId}`)
      if (response.ok) {
        const productData = await response.json()
        setProduct(productData)
        if (productData.colors && productData.colors.length > 0) {
          setSelectedColor(productData.colors[0])
        }
      }
    } catch (error) {
      console.error('Error fetching product:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleGetOffer = () => {
    if (product) {
      const message = encodeURIComponent(
        `Merhaba! ${product.name} ürünü hakkında bilgi almak istiyorum. Ürün: ${window.location.origin}/urun/${product.slug}`
      )
      const whatsappNumber = '905555555555'
      window.open(`https://wa.me/${whatsappNumber}?text=${message}`, '_blank')
    }
  }

  const toggleWishlist = () => {
    setIsWishlisted(!isWishlisted)
    // Here you would typically call your wishlist API
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black bg-opacity-60 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="relative bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden shadow-2xl mx-4">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2 bg-white rounded-full shadow-lg hover:bg-gray-100 transition-colors"
        >
          <X size={20} className="text-gray-600" />
        </button>

        {/* Content */}
        <div className="flex flex-col lg:flex-row h-full max-h-[90vh]">
          {/* Image Section */}
          <div className="lg:w-1/2 bg-gray-50 relative min-h-[400px] lg:min-h-[600px]">
            {loading ? (
              <div className="flex items-center justify-center h-full">
                <div className="animate-spin rounded-full h-12 w-12 border-2 border-gray-300 border-t-blue-600" />
              </div>
            ) : product ? (
              <>
                {/* Badge */}
                {product.badge && (
                  <span className="absolute top-4 left-4 z-10 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                    {product.badge}
                  </span>
                )}

                {/* Main Image */}
                <div className="relative w-full h-full">
                  <Image
                    src={selectedImage === 'primary' ? product.primaryImage : product.hoverImage}
                    alt={product.name}
                    fill
                    className="object-cover"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement
                      target.src = '/images/placeholder-product.svg'
                    }}
                  />
                </div>

                {/* Image Thumbnails */}
                <div className="absolute bottom-4 left-4 flex gap-2">
                  <button
                    onClick={() => setSelectedImage('primary')}
                    className={`w-16 h-16 border-2 rounded-lg overflow-hidden transition-colors ${
                      selectedImage === 'primary' ? 'border-blue-500' : 'border-white'
                    }`}
                  >
                    <Image
                      src={product.primaryImage}
                      alt="Primary"
                      width={64}
                      height={64}
                      className="object-cover w-full h-full"
                    />
                  </button>
                  
                  {product.hoverImage && product.hoverImage !== product.primaryImage && (
                    <button
                      onClick={() => setSelectedImage('hover')}
                      className={`w-16 h-16 border-2 rounded-lg overflow-hidden transition-colors ${
                        selectedImage === 'hover' ? 'border-blue-500' : 'border-white'
                      }`}
                    >
                      <Image
                        src={product.hoverImage}
                        alt="Hover"
                        width={64}
                        height={64}
                        className="object-cover w-full h-full"
                      />
                    </button>
                  )}
                </div>
              </>
            ) : (
              <div className="flex items-center justify-center h-full text-gray-500">
                Ürün yüklenemedi
              </div>
            )}
          </div>

          {/* Product Details */}
          <div className="lg:w-1/2 p-6 lg:p-8 overflow-y-auto">
            {loading ? (
              <div className="space-y-4">
                <div className="h-8 bg-gray-200 rounded animate-pulse" />
                <div className="h-4 bg-gray-200 rounded animate-pulse w-2/3" />
                <div className="h-6 bg-gray-200 rounded animate-pulse w-1/3" />
                <div className="h-16 bg-gray-200 rounded animate-pulse" />
              </div>
            ) : product ? (
              <div className="space-y-6">
                {/* Category */}
                <div className="text-sm text-gray-500 uppercase tracking-wider">
                  {product.category.name}
                </div>

                {/* Product Name */}
                <h2 className="text-2xl lg:text-3xl font-bold text-gray-900 leading-tight">
                  {product.name}
                </h2>

                {/* Price */}
                <div className="text-2xl font-bold text-gray-900">
                  {typeof product.price === 'number' 
                    ? `${product.price.toLocaleString('tr-TR')} TL`
                    : product.price
                  }
                </div>

                {/* Rating (Mock) */}
                <div className="flex items-center gap-2">
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        size={16}
                        className={`${i < 4 ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
                      />
                    ))}
                  </div>
                  <span className="text-sm text-gray-600">(24 değerlendirme)</span>
                </div>

                {/* Description */}
                {product.description && (
                  <div className="text-gray-600 leading-relaxed">
                    <div dangerouslySetInnerHTML={{ __html: product.description.substring(0, 200) + '...' }} />
                  </div>
                )}

                {/* Colors */}
                {product.colors && product.colors.length > 0 && (
                  <div>
                    <h4 className="text-sm font-medium text-gray-900 mb-3">Renk Seçenekleri</h4>
                    <div className="flex gap-2">
                      {product.colors.map((color, index) => (
                        <button
                          key={index}
                          onClick={() => setSelectedColor(color)}
                          className={`w-8 h-8 rounded-full border-2 transition-all ${
                            selectedColor === color 
                              ? 'border-gray-900 scale-110' 
                              : 'border-gray-300 hover:border-gray-400'
                          }`}
                          style={{ backgroundColor: color }}
                          title={`Renk ${index + 1}`}
                        />
                      ))}
                    </div>
                  </div>
                )}

                {/* Features */}
                <div className="space-y-3 text-sm text-gray-600">
                  <div className="flex items-center gap-2">
                    <Truck size={16} />
                    <span>Ücretsiz kargo (1000 TL üzeri)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <RotateCcw size={16} />
                    <span>30 gün kolay iade</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Shield size={16} />
                    <span>2 yıl garanti</span>
                  </div>
                </div>

                {/* Actions */}
                <div className="space-y-4 pt-4 border-t">
                  <div className="flex gap-3">
                    <button
                      onClick={handleGetOffer}
                      className="flex-1 bg-gray-900 text-white py-3 px-6 rounded-lg font-medium hover:bg-gray-800 transition-colors flex items-center justify-center gap-2"
                    >
                      <ShoppingBag size={18} />
                      Teklif Al
                    </button>
                    
                    <button
                      onClick={toggleWishlist}
                      className={`p-3 border rounded-lg transition-colors ${
                        isWishlisted 
                          ? 'bg-red-50 border-red-200 text-red-600' 
                          : 'border-gray-300 text-gray-600 hover:border-gray-400'
                      }`}
                    >
                      <Heart size={18} fill={isWishlisted ? 'currentColor' : 'none'} />
                    </button>
                  </div>

                  <Link
                    href={`/urun/${product.slug}`}
                    onClick={onClose}
                    className="block w-full text-center py-2 text-gray-600 hover:text-gray-900 transition-colors"
                  >
                    Detaylı görünümü aç →
                  </Link>
                </div>
              </div>
            ) : (
              <div className="text-center text-gray-500">
                Ürün bilgileri yüklenemedi
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}