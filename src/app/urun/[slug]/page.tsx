'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import { ArrowLeft, Heart, Share2, Truck, Shield, RefreshCw, MessageCircle } from 'lucide-react'
import styles from './ProductDetail.module.css'

// No separate images table - using primaryImage and hoverImage fields

interface Category {
  id: number
  name: string
  slug: string
}

interface Product {
  id: string
  name: string
  slug: string
  description?: string
  price: string | number
  primaryImage: string
  primaryImageAlt?: string
  hoverImage: string
  hoverImageAlt?: string
  additionalImages?: string[]
  category: Category
  featured: boolean
  isActive: boolean
  colors: string[] | any
  badge?: string
  createdAt: string
}

const ProductDetailPage = () => {
  const params = useParams()
  const [product, setProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState(true)
  const [selectedImageIndex, setSelectedImageIndex] = useState(0)
  const [selectedColor, setSelectedColor] = useState<string | null>(null)
  const [isWishlistAdded, setIsWishlistAdded] = useState(false)
  const [showContactModal, setShowContactModal] = useState(false)
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([])

  const phoneNumber = '+90 555 555 55 55'
  const whatsappNumber = '905555555555'

  useEffect(() => {
    const fetchProduct = async () => {
      if (!params.slug) return
      
      try {
        const response = await fetch(`/api/products/${params.slug}`)
        if (response.ok) {
          const productData = await response.json()
          setProduct(productData)
          if (productData.colors && productData.colors.length > 0) {
            setSelectedColor(productData.colors[0])
          }
          
          // Fetch related products
          const relatedRes = await fetch(`/api/products/related/${productData.category.id}`)
          if (relatedRes.ok) {
            const relatedData = await relatedRes.json()
            setRelatedProducts(relatedData.filter((p: Product) => p.id !== productData.id))
          }
        } else {
          console.error('Product not found')
        }
      } catch (error) {
        console.error('Error fetching product:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchProduct()
  }, [params.slug])

  const handleImageSelect = (index: number) => {
    setSelectedImageIndex(index)
  }

  const handleColorSelect = (color: string) => {
    setSelectedColor(color)
  }

  const handleWishlistToggle = () => {
    setIsWishlistAdded(!isWishlistAdded)
  }

  const handleWhatsAppContact = () => {
    if (!product) return
    
    const message = encodeURIComponent(
      `Merhaba! ${product.name} ürünü hakkında bilgi almak istiyorum. Ürün linki: ${window.location.href}`
    )
    window.open(`https://wa.me/${whatsappNumber}?text=${message}`, '_blank')
  }

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: product?.name,
          text: product?.description,
          url: window.location.href
        })
      } catch (error) {
        // Sharing failed, fall back to copy link
        navigator.clipboard.writeText(window.location.href)
        alert('Link kopyalandı!')
      }
    } else {
      navigator.clipboard.writeText(window.location.href)
      alert('Link kopyalandı!')
    }
  }

  const formatPrice = (price: number | string) => {
    const numPrice = typeof price === 'string' ? parseFloat(price) : price
    return `${numPrice.toLocaleString('tr-TR')} TL`
  }

  if (loading) {
    return (
      <div className={styles.loading}>
        <div className={styles.loadingSpinner}></div>
        <p>Ürün detayları yükleniyor...</p>
      </div>
    )
  }

  if (!product) {
    return (
      <div className={styles.notFound}>
        <h1>Ürün Bulunamadı</h1>
        <p>Aradığınız ürün mevcut değil.</p>
        <Link href="/urunler" className={styles.backButton}>
          Ürünlere Geri Dön
        </Link>
      </div>
    )
  }

  // Create array of all available images
  const allImages = [
    {
      url: product.primaryImage,
      altText: product.primaryImageAlt || product.name
    },
    {
      url: product.hoverImage,
      altText: product.hoverImageAlt || product.name
    },
    ...(product.additionalImages || []).map((url, index) => ({
      url,
      altText: `${product.name} - ${index + 3}`
    }))
  ].filter((img, index, arr) => 
    // Remove duplicates and empty URLs
    img.url && arr.findIndex(item => item.url === img.url) === index
  )

  const selectedImage = allImages[selectedImageIndex] || allImages[0]

  return (
    <div className={styles.page}>
      {/* Breadcrumb */}
      <div className={styles.breadcrumb}>
        <div className={styles.container}>
          <Link href="/" className={styles.breadcrumbLink}>Ana Sayfa</Link>
          <span className={styles.breadcrumbSeparator}>/</span>
          <Link href="/urunler" className={styles.breadcrumbLink}>Ürünler</Link>
          <span className={styles.breadcrumbSeparator}>/</span>
          <Link href={`/urunler?category=${product.category.slug}`} className={styles.breadcrumbLink}>
            {product.category.name}
          </Link>
          <span className={styles.breadcrumbSeparator}>/</span>
          <span className={styles.breadcrumbCurrent}>{product.name}</span>
        </div>
      </div>

      <div className={styles.container}>
        {/* Back Button */}
        <Link href="/urunler" className={styles.backButton}>
          <ArrowLeft size={20} />
          <span>Ürünlere Geri Dön</span>
        </Link>

        {/* Product Detail */}
        <div className={styles.productDetail}>
          {/* Image Gallery */}
          <div className={styles.imageGallery}>
            <div className={styles.mainImage}>
              {selectedImage ? (
                <img
                  src={selectedImage.url}
                  alt={selectedImage.altText || product.name}
                  className={styles.productImage}
                />
              ) : (
                <div className={styles.imagePlaceholder}>
                  <span>Görsel Yok</span>
                </div>
              )}
              
              {/* Image Actions */}
              <div className={styles.imageActions}>
                <button
                  className={`${styles.actionButton} ${isWishlistAdded ? styles.active : ''}`}
                  onClick={handleWishlistToggle}
                  aria-label="Favorilere Ekle"
                >
                  <Heart size={20} fill={isWishlistAdded ? 'currentColor' : 'none'} />
                </button>
                <button
                  className={styles.actionButton}
                  onClick={handleShare}
                  aria-label="Paylaş"
                >
                  <Share2 size={20} />
                </button>
              </div>
            </div>

            {/* Thumbnail Images */}
            {allImages.length > 1 && (
              <div className={styles.thumbnails}>
                {allImages.map((image, index) => (
                  <button
                    key={index}
                    className={`${styles.thumbnail} ${selectedImageIndex === index ? styles.activeThumbnail : ''}`}
                    onClick={() => handleImageSelect(index)}
                  >
                    <img
                      src={image.url}
                      alt={image.altText}
                      className={styles.thumbnailImage}
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className={styles.productInfo}>
            {/* Header */}
            <div className={styles.productHeader}>
              <div className={styles.categoryBadge}>{product.category.name}</div>
              <h1 className={styles.productTitle}>{product.name}</h1>
              
              {/* Price */}
              <div className={styles.priceContainer}>
                <span className={styles.currentPrice}>{formatPrice(product.price)}</span>
              </div>

            </div>

            {/* Description */}
            {product.description && (
              <div className={styles.description}>
                <h3>Ürün Açıklaması</h3>
                <p>{product.description}</p>
              </div>
            )}

            {/* Color Selection */}
            {product.colors && product.colors.length > 0 && (
              <div className={styles.colorSelection}>
                <h3>Renk Seçimi</h3>
                <div className={styles.colors}>
                  {product.colors.map((color: string, index: number) => (
                    <button
                      key={index}
                      className={`${styles.colorOption} ${
                        selectedColor === color ? styles.selectedColor : ''
                      }`}
                      style={{ backgroundColor: color }}
                      onClick={() => handleColorSelect(color)}
                      aria-label={`Renk ${index + 1}`}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className={styles.actions}>
              <button
                className={styles.whatsappButton}
                onClick={handleWhatsAppContact}
              >
                <MessageCircle size={20} />
                <span>WhatsApp ile Teklif Al</span>
              </button>
              
              <button
                className={styles.callButton}
                onClick={() => setShowContactModal(true)}
              >
                <span>Bizi Arayın</span>
              </button>
            </div>

            {/* Features */}
            <div className={styles.features}>
              <div className={styles.feature}>
                <Truck size={24} />
                <div>
                  <h4>Hızlı Teslimat</h4>
                  <p>Siparişiniz 2-3 iş günü içinde elinizde</p>
                </div>
              </div>
              <div className={styles.feature}>
                <Shield size={24} />
                <div>
                  <h4>Kalite Garantisi</h4>
                  <p>%100 orijinal ve kaliteli ürünler</p>
                </div>
              </div>
              <div className={styles.feature}>
                <RefreshCw size={24} />
                <div>
                  <h4>Kolay İade</h4>
                  <p>14 gün içinde koşulsuz iade</p>
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div className={styles.relatedProducts}>
            <h2>Benzer Ürünler</h2>
            <div className={styles.relatedGrid}>
              {relatedProducts.slice(0, 4).map((relatedProduct) => (
                <Link
                  key={relatedProduct.id}
                  href={`/urun/${relatedProduct.slug}`}
                  className={styles.relatedCard}
                >
                  <div className={styles.relatedImage}>
                    {relatedProduct.primaryImage ? (
                      <img
                        src={relatedProduct.primaryImage}
                        alt={relatedProduct.name}
                        className={styles.relatedProductImage}
                      />
                    ) : (
                      <div className={styles.imagePlaceholder}>
                        <span>{relatedProduct.name}</span>
                      </div>
                    )}
                  </div>
                  <div className={styles.relatedInfo}>
                    <h3>{relatedProduct.name}</h3>
                    <p className={styles.relatedPrice}>{formatPrice(relatedProduct.price)}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Contact Modal */}
      {showContactModal && (
        <div className={styles.modalOverlay} onClick={() => setShowContactModal(false)}>
          <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <button
              className={styles.modalClose}
              onClick={() => setShowContactModal(false)}
            >
              ×
            </button>
            <h3>Bize Ulaşın</h3>
            <p>Ürün hakkında detaylı bilgi ve özel fiyat teklifi için:</p>
            <a href={`tel:${phoneNumber}`} className={styles.phoneLink}>
              📞 {phoneNumber}
            </a>
            <p className={styles.workingHours}>
              Çalışma Saatleri: Hafta içi 09:00 - 18:00
            </p>
          </div>
        </div>
      )}
    </div>
  )
}

export default ProductDetailPage
