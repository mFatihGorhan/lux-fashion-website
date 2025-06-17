'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import ProductCard from '../ui/ProductCard'
import ProductCardSkeleton from '../ui/ProductCardSkeleton'
import QuickViewModal from '../ui/QuickViewModal'
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
  price: number | string
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
    id: 1,
    slug: 'silk-elegance-elbise',
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
    slug: 'minimal-blazer',
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
    slug: 'cashmere-touch-kazak',
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
    slug: 'wide-leg-pantolon',
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


const FeaturedProducts = () => {
  const [products, setProducts] = useState(defaultProducts)
  const [loading, setLoading] = useState(true)
  const [quickViewProductId, setQuickViewProductId] = useState<string | null>(null)

  useEffect(() => {
    const fetchFeaturedProducts = async () => {
      try {
        const response = await fetch('/api/products/featured')
        if (response.ok) {
          const featuredProducts: Product[] = await response.json()
          if (featuredProducts.length > 0) {
            const formattedProducts = featuredProducts.map((product, index) => ({
              id: typeof product.id === 'string' ? parseInt(product.id) || index + 1 : product.id || index + 1,
              slug: product.slug,
              name: product.name,
              category: product.category.name,
              price: `${Number(product.price).toLocaleString('tr-TR')} TL`,
              images: {
                primary: product.primaryImage || '/images/placeholder-product.svg',
                hover: product.hoverImage || product.primaryImage || '/images/placeholder-product.svg'
              },
              badge: product.badge,
              colors: Array.isArray(product.colors) ? product.colors : ['#1A1A1A']
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
            products.map((product, index) => (
              <ProductCard
                key={product.id}
                product={product}
                index={index}
                viewMode="grid"
              />
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

      {/* Quick View Modal */}
      {quickViewProductId && (
        <QuickViewModal
          isOpen={!!quickViewProductId}
          onClose={() => setQuickViewProductId(null)}
          productId={quickViewProductId}
        />
      )}
    </section>
  )
}

export default FeaturedProducts