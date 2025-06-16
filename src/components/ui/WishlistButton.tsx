'use client'

import React, { useState } from 'react'
import { Heart, Loader } from 'lucide-react'
import { useWishlist } from '@/contexts/WishlistContext'
import styles from './WishlistButton.module.css'

interface WishlistButtonProps {
  product: {
    id: string
    name: string
    slug: string
    price: number
    image?: string
    category?: string
  }
  size?: 'small' | 'medium' | 'large'
  variant?: 'filled' | 'outline' | 'minimal'
  showText?: boolean
  className?: string
  onClick?: (e: React.MouseEvent) => void
}

export default function WishlistButton({
  product,
  size = 'medium',
  variant = 'outline',
  showText = false,
  className = '',
  onClick
}: WishlistButtonProps) {
  const { isInWishlist, toggleWishlistItem } = useWishlist()
  const [isLoading, setIsLoading] = useState(false)
  const [showToast, setShowToast] = useState(false)

  const isInWishlistState = isInWishlist(product.id)

  const handleClick = async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()

    if (onClick) {
      onClick(e)
    }

    if (isLoading) return

    try {
      setIsLoading(true)
      await toggleWishlistItem(product)
      
      // Show toast notification
      setShowToast(true)
      setTimeout(() => setShowToast(false), 2000)
      
    } catch (error) {
      console.error('Wishlist toggle error:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const getIconSize = () => {
    switch (size) {
      case 'small': return 16
      case 'large': return 24
      default: return 20
    }
  }

  const buttonClasses = [
    styles.wishlistButton,
    styles[size],
    styles[variant],
    isInWishlistState ? styles.active : '',
    isLoading ? styles.loading : '',
    className
  ].filter(Boolean).join(' ')

  return (
    <div className={styles.container}>
      <button
        className={buttonClasses}
        onClick={handleClick}
        disabled={isLoading}
        aria-label={isInWishlistState ? 'Favorilerden çıkar' : 'Favorilere ekle'}
        title={isInWishlistState ? 'Favorilerden çıkar' : 'Favorilere ekle'}
      >
        {isLoading ? (
          <Loader className={styles.spinner} size={getIconSize()} />
        ) : (
          <Heart 
            size={getIconSize()} 
            className={`${styles.heartIcon} ${isInWishlistState ? styles.filled : ''}`}
          />
        )}
        
        {showText && (
          <span className={styles.text}>
            {isInWishlistState ? 'Favorilerde' : 'Favorilere Ekle'}
          </span>
        )}
      </button>

      {/* Toast Notification */}
      {showToast && (
        <div className={`${styles.toast} ${isInWishlistState ? styles.toastAdded : styles.toastRemoved}`}>
          <Heart size={16} className={styles.toastIcon} />
          <span>
            {isInWishlistState 
              ? 'Favorilere eklendi' 
              : 'Favorilerden çıkarıldı'
            }
          </span>
        </div>
      )}
    </div>
  )
}

// Specialized wishlist buttons for different contexts
export function ProductCardWishlistButton({ product }: { product: WishlistButtonProps['product'] }) {
  return (
    <WishlistButton
      product={product}
      size="medium"
      variant="filled"
      className={styles.productCard}
    />
  )
}

export function ProductDetailWishlistButton({ product }: { product: WishlistButtonProps['product'] }) {
  return (
    <WishlistButton
      product={product}
      size="large"
      variant="outline"
      showText={true}
      className={styles.productDetail}
    />
  )
}

export function QuickActionWishlistButton({ product }: { product: WishlistButtonProps['product'] }) {
  return (
    <WishlistButton
      product={product}
      size="small"
      variant="minimal"
      className={styles.quickAction}
    />
  )
}