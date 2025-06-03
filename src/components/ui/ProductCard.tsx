'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { Heart, Eye } from 'lucide-react'
import styles from './ProductCard.module.css'

interface Product {
  id: number
  name: string
  category: string
  collection?: string
  price: string
  images: {
    primary: string
    hover: string
  }
  badge?: string
  colors: string[]
}

interface ProductCardProps {
  product: Product
  index?: number
  viewMode?: 'grid' | 'list'
}

const ProductCard: React.FC<ProductCardProps> = ({ 
  product, 
  index = 0, 
  viewMode = 'grid' 
}) => {
  const [isHovered, setIsHovered] = useState(false)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isFavorite, setIsFavorite] = useState(false)

  const handleGetOffer = () => {
    setIsModalOpen(true)
  }

  const toggleFavorite = (e: React.MouseEvent) => {
    e.preventDefault()
    setIsFavorite(!isFavorite)
  }

  if (viewMode === 'list') {
    return (
      <article className={styles.productCardList} style={{ animationDelay: `${index * 0.05}s` }}>
        <div className={styles.listImageContainer}>
          <div className={styles.listImageWrapper}>
            {product.badge && (
              <span className={styles.badge}>{product.badge}</span>
            )}
            <div 
              className={styles.listImage}
              style={{
                background: `linear-gradient(135deg, #f0f0f0 0%, #e0e0e0 100%)`
              }}
            >
              <span className={styles.imagePlaceholder}>{product.name}</span>
            </div>
          </div>
        </div>

        <div className={styles.listContent}>
          <div className={styles.listInfo}>
            <span className={styles.category}>{product.category}</span>
            <h3 className={styles.productName}>{product.name}</h3>
            {product.collection && (
              <span className={styles.collection}>{product.collection}</span>
            )}
          </div>

          <div className={styles.listActions}>
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

            <div className={styles.priceAndActions}>
              <span className={styles.price}>{product.price}</span>
              <button 
                className={styles.offerButton}
                onClick={handleGetOffer}
              >
                <span>Teklif Al</span>
              </button>
            </div>
          </div>
        </div>
      </article>
    )
  }

  return (
    <>
      <article
        className={styles.productCard}
        style={{ animationDelay: `${index * 0.05}s` }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Badge */}
        {product.badge && (
          <span className={styles.badge}>{product.badge}</span>
        )}

        {/* Image Container */}
        <Link href={`/urun/${product.id}`} className={styles.imageContainer}>
          <div 
            className={`${styles.primaryImage} ${isHovered ? styles.hidden : ''}`}
            style={{
              background: `linear-gradient(135deg, #f0f0f0 0%, #e0e0e0 100%)`
            }}
          >
            <span className={styles.imagePlaceholder}>{product.name}</span>
          </div>
          
          <div 
            className={`${styles.hoverImage} ${isHovered ? styles.visible : ''}`}
            style={{
              background: `linear-gradient(135deg, #e0e0e0 0%, #d0d0d0 100%)`
            }}
          >
            <span className={styles.imagePlaceholder}>Hover: {product.name}</span>
          </div>

          {/* Quick Actions */}
          <div className={`${styles.quickActions} ${isHovered ? styles.actionsVisible : ''}`}>
            <button 
              className={styles.actionButton}
              onClick={(e) => {
                e.preventDefault()
                console.log('Quick view:', product.id)
              }}
              aria-label="Hızlı Görünüm"
            >
              <Eye size={18} />
            </button>
            <button 
              className={`${styles.actionButton} ${isFavorite ? styles.active : ''}`}
              onClick={toggleFavorite}
              aria-label="Favorilere Ekle"
            >
              <Heart size={18} fill={isFavorite ? 'currentColor' : 'none'} />
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
              onClick={handleGetOffer}
            >
              <span>Teklif Al</span>
            </button>
          </div>
        </div>
      </article>

      {/* Contact Modal */}
      {isModalOpen && (
        <div className={styles.modalOverlay} onClick={() => setIsModalOpen(false)}>
          <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <button className={styles.modalClose} onClick={() => setIsModalOpen(false)}>×</button>
            <h3 className={styles.modalTitle}>Teklif Al</h3>
            <p className={styles.modalText}>
              {product.name} hakkında detaylı bilgi ve fiyat teklifi için bizi arayın
            </p>
            <a href="tel:+905555555555" className={styles.modalPhone}>
              <span className={styles.phoneIcon}>📞</span>
              +90 555 555 55 55
            </a>
            <p className={styles.modalNote}>
              Hafta içi 09:00 - 18:00 arası hizmetinizdeyiz
            </p>
          </div>
        </div>
      )}
    </>
  )
}

export default ProductCard