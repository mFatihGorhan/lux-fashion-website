'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { Heart, Eye, ArrowRight } from 'lucide-react'
import ProductCardSkeleton from '../ui/ProductCardSkeleton'
import { ProductCardWishlistButton } from '../ui/WishlistButton'
import styles from './FeaturedProducts.module.css'

interface Category {
  id: string
  name: string
  slug: string
}

interface Product {
  id: string
  name: string
  slug: string
  description?: string
  price: number
  category: Category
  primaryImage: string
  primaryImageAlt?: string
  hoverImage: string
  hoverImageAlt?: string
  featured: boolean
  isActive: boolean
  colors: string[]
  badge?: string
}

const defaultProducts = [
  {
    id: '1',
    name: 'Silk Elegance Elbise',
    category: 'Elbise',
    price: '2,850 TL',
    images: {
      primary: '/images/product-1-a.jpg',
      hover: '/images/product-1-b.jpg'
    },
    badge: 'Yeni Sezon',
    colors: ['#1A1A1A', '#D4B5A0', '#8B7355']
  },
  {
    id: '2',
    name: 'Minimal Blazer',
    category: 'Ceket',
    price: '3,200 TL',
    images: {
      primary: '/images/product-2-a.jpg',
      hover: '/images/product-2-b.jpg'
    },
    badge: 'Limited Edition',
    colors: ['#1A1A1A', '#F5F5F3']
  },
  {
    id: '3',
    name: 'Cashmere Touch Kazak',
    category: 'Üst Giyim',
    price: '1,950 TL',
    images: {
      primary: '/images/product-3-a.jpg',
      hover: '/images/product-3-b.jpg'
    },
    colors: ['#D4B5A0', '#8B7355', '#666666']
  },
  {
    id: '4',
    name: 'Wide Leg Pantolon',
    category: 'Alt Giyim',
    price: '2,450 TL',
    images: {
      primary: '/images/product-4-a.jpg',
      hover: '/images/product-4-b.jpg'
    },
    badge: 'Son Parçalar',
    colors: ['#1A1A1A']
  }
]

interface ModalProps {
  isOpen: boolean
  onClose: () => void
  phoneNumber: string
}

const ContactModal: React.FC<ModalProps> = ({ isOpen, onClose, phoneNumber }) => {
  if (!isOpen) return null

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        <button className={styles.modalClose} onClick={onClose}>×</button>
        <h3 className={styles.modalTitle}>Teklif Al</h3>
        <p className={styles.modalText}>
          Ürün hakkında detaylı bilgi ve fiyat teklifi için bizi arayın
        </p>
        <a href={`tel:${phoneNumber}`} className={styles.modalPhone}>
          <span className={styles.phoneIcon}>📞</span>
          {phoneNumber}
        </a>
        <p className={styles.modalNote}>
          Hafta içi 09:00 - 18:00 arası hizmetinizdeyiz
        </p>
      </div>
    </div>
  )
}

const FeaturedProducts = () => {
  const [hoveredProduct, setHoveredProduct] = useState<string | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [products, setProducts] = useState(defaultProducts)
  const [loading, setLoading] = useState(true)
  const phoneNumber = '+90 555 555 55 55'

  useEffect(() => {
    const fetchFeaturedProducts = async () => {
      try {
        const response = await fetch('/api/products/featured')
        if (response.ok) {
          const featuredProducts: Product[] = await response.json()
          if (featuredProducts.length > 0) {
            const formattedProducts = featuredProducts.map(product => ({
              id: product.id,
              name: product.name,
              category: product.category.name,
              price: `${product.price.toLocaleString('tr-TR')} TL`,
              images: {
                primary: product.primaryImage || '/images/placeholder.jpg',
                hover: product.hoverImage || product.primaryImage || '/images/placeholder.jpg'
              },
              badge: product.badge,
              colors: product.colors || ['#1A1A1A']
            }))
            setProducts(formattedProducts)
          }
        }
      } catch (error) {
        console.error('Error fetching featured products:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchFeaturedProducts()
  }, [])

  const handleQuickView = (productId: string) => {
    // TODO: Implement quick view modal functionality
  }

  const handleGetOffer = (product?: {id: string, name: string}) => {
    if (product) {
      const message = encodeURIComponent(
        `Merhaba! ${product.name} ürünü hakkında bilgi almak istiyorum. Ürün: ${window.location.origin}/urun/${product.id}`
      )
      const whatsappNumber = '905555555555'
      window.open(`https://wa.me/${whatsappNumber}?text=${message}`, '_blank')
    } else {
      setIsModalOpen(true)
    }
  }

  return (
    <section className={styles.section}>
      <div className={styles.container}>
        {/* Section Header */}
        <div className={styles.header}>
          <div className={styles.headerContent}>
            <span className={styles.subtitle}>Öne Çıkanlar</span>
            <h2 className={styles.title}>Sezonun Favorileri</h2>
            <p className={styles.description}>
              Her biri özenle tasarlanmış, sınırlı sayıda üretilen parçalarımız
            </p>
          </div>
          
          <Link href="/koleksiyonlar" className={styles.viewAllButton}>
            <span>Tüm Koleksiyon</span>
            <ArrowRight size={20} />
          </Link>
        </div>

        {/* Products Grid */}
        <div className={styles.grid}>
          {loading ? (
            <ProductCardSkeleton viewMode="grid" count={4} />
          ) : (
            products.map((product) => (
            <article
              key={product.id}
              className={styles.productCard}
              onMouseEnter={() => setHoveredProduct(product.id)}
              onMouseLeave={() => setHoveredProduct(null)}
            >
              {/* Badge */}
              {product.badge && (
                <span className={styles.badge}>{product.badge}</span>
              )}

              {/* Image Container */}
              <Link href={`/urun/${product.id}`} className={styles.imageContainer}>
                <div 
                  className={`${styles.primaryImage} ${
                    hoveredProduct === product.id ? styles.hidden : ''
                  }`}
                  style={{
                    background: `linear-gradient(135deg, #f0f0f0 0%, #e0e0e0 100%)`
                  }}
                >
                  <span className={styles.imagePlaceholder}>{product.name}</span>
                </div>
                
                <div 
                  className={`${styles.hoverImage} ${
                    hoveredProduct === product.id ? styles.visible : ''
                  }`}
                  style={{
                    background: `linear-gradient(135deg, #e0e0e0 0%, #d0d0d0 100%)`
                  }}
                >
                  <span className={styles.imagePlaceholder}>Hover: {product.name}</span>
                </div>

                {/* Wishlist Button */}
                <ProductCardWishlistButton 
                  product={{
                    id: product.id,
                    name: product.name,
                    slug: product.id, // Using ID as slug for demo
                    price: parseInt(product.price.replace(/[^\d]/g, '')),
                    category: product.category
                  }}
                />

                {/* Quick Actions */}
                <div className={`${styles.quickActions} ${
                  hoveredProduct === product.id ? styles.actionsVisible : ''
                }`}>
                  <button 
                    className={styles.actionButton}
                    onClick={(e) => {
                      e.preventDefault()
                      e.stopPropagation()
                      handleQuickView(product.id)
                    }}
                    aria-label="Hızlı Görünüm"
                  >
                    <Eye size={18} />
                  </button>
                </div>
              </Link>

              {/* Product Info */}
              <div className={styles.productInfo}>
                <span className={styles.category}>{product.category}</span>
                <h3 className={styles.productName}>
                  <Link href={`/urun/${product.id}`}>{product.name}</Link>
                </h3>
                
                {/* Color Options */}
                <div className={styles.colors}>
                  {product.colors.map((color, index) => (
                    <span
                      key={index}
                      className={styles.colorDot}
                      style={{ backgroundColor: color }}
                      aria-label={`Renk ${index + 1}`}
                    />
                  ))}
                </div>

                <div className={styles.priceRow}>
                  <span className={styles.price}>{product.price}</span>
                  <button 
                    className={styles.offerButton}
                    onClick={() => handleGetOffer(product)}
                  >
                    <span>Teklif Al</span>
                  </button>
                </div>
              </div>
            </article>
            ))
          )}
        </div>

        {/* Bottom CTA */}
        <div className={styles.bottomCta}>
          <p className={styles.ctaText}>
            Tüm koleksiyonumuzu keşfedin ve size özel fiyat tekliflerimizden yararlanın
          </p>
          <Link href="/koleksiyonlar" className={styles.ctaButton}>
            <span>Koleksiyona Git</span>
            <span className={styles.ctaArrow}>→</span>
          </Link>
        </div>
      </div>

      {/* Contact Modal */}
      <ContactModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        phoneNumber={phoneNumber}
      />
    </section>
  )
}

export default FeaturedProducts