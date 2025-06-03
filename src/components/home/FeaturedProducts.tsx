'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { Heart, Eye, ArrowRight } from 'lucide-react'
import styles from './FeaturedProducts.module.css'

// Örnek ürün verisi
const products = [
  {
    id: 1,
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
    id: 2,
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
    id: 3,
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
    id: 4,
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
  const [hoveredProduct, setHoveredProduct] = useState<number | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const phoneNumber = '+90 555 555 55 55'

  const handleQuickView = (productId: number) => {
    console.log('Quick view for product:', productId)
    // Quick view modal işlevselliği eklenebilir
  }

  const handleGetOffer = () => {
    setIsModalOpen(true)
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
          {products.map((product) => (
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
              <div className={styles.imageContainer}>
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

                {/* Quick Actions */}
                <div className={`${styles.quickActions} ${
                  hoveredProduct === product.id ? styles.actionsVisible : ''
                }`}>
                  <button 
                    className={styles.actionButton}
                    onClick={() => handleQuickView(product.id)}
                    aria-label="Hızlı Görünüm"
                  >
                    <Eye size={18} />
                  </button>
                  <button 
                    className={styles.actionButton}
                    aria-label="Favorilere Ekle"
                  >
                    <Heart size={18} />
                  </button>
                </div>
              </div>

              {/* Product Info */}
              <div className={styles.productInfo}>
                <span className={styles.category}>{product.category}</span>
                <h3 className={styles.productName}>{product.name}</h3>
                
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
                    onClick={handleGetOffer}
                  >
                    <span>Teklif Al</span>
                  </button>
                </div>
              </div>
            </article>
          ))}
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