'use client'

import React, { useState, useEffect } from 'react'
import dynamic from 'next/dynamic'
import { ChevronDown, Grid, List } from 'lucide-react'
import ProductCardSkeleton from '@/components/ui/ProductCardSkeleton'
import PageErrorBoundary from '@/components/PageErrorBoundary'
import styles from './collections.module.css'

// Dynamically import ProductCard to avoid hydration issues
const ProductCard = dynamic(() => import('@/components/ui/ProductCard'), {
  ssr: false,
  loading: () => <ProductCardSkeleton viewMode="grid" count={1} />
})

interface Product {
  id: string
  name: string
  slug: string
  price: number
  primaryImage: string
  primaryImageAlt?: string
  hoverImage?: string
  hoverImageAlt?: string
  category: {
    id: string
    name: string
    slug: string
  }
  collection?: {
    id: string
    name: string
    slug: string
  }
  colors?: string[]
  badge?: string
  featured: boolean
  isActive: boolean
}

interface Collection {
  id: string
  name: string
  slug: string
}

function CollectionsContent() {
  const [products, setProducts] = useState<Product[]>([])
  const [collections, setCollections] = useState<Collection[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedCollection, setSelectedCollection] = useState('all')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')

  useEffect(() => {
    fetchData()
  }, [selectedCollection]) // eslint-disable-line react-hooks/exhaustive-deps

  const fetchData = async () => {
    try {
      setLoading(true)
      
      const params = new URLSearchParams()
      if (selectedCollection !== 'all') {
        params.append('collection', selectedCollection)
      }

      const [productsRes, collectionsRes] = await Promise.all([
        fetch(`/api/products?${params.toString()}`),
        fetch('/api/collections').catch(() => ({ ok: false }))
      ])

      if (productsRes.ok) {
        const productsData = await productsRes.json()
        setProducts(productsData || [])
      } else {
        // Fallback to default products if API fails
        setProducts(defaultProducts)
      }

      if (collectionsRes.ok && 'json' in collectionsRes) {
        const collectionsData = await collectionsRes.json()
        const allCollection = { id: 'all', name: 'Tüm Koleksiyonlar', slug: 'all' }
        setCollections([allCollection, ...collectionsData])
      } else {
        // Fallback collections
        setCollections(defaultCollections)
      }
    } catch (error) {
      console.error('Error fetching collections data:', error)
      setProducts(defaultProducts)
      setCollections(defaultCollections)
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className={styles.main}>
      {/* Page Header */}
      <section className={styles.pageHeader}>
        <div className={styles.headerContent}>
          <h1 className={styles.title}>Koleksiyonlarımız</h1>
          <p className={styles.subtitle}>
            Özgün tasarımları ve zarafeti buluşturan özel koleksiyonlarımızı keşfedin
          </p>
        </div>
      </section>

      {/* Filters Bar */}
      <div className={styles.filtersBar}>
        <div className={styles.container}>
          <div className={styles.filtersContent}>
            <div className={styles.resultsInfo}>
              <p>{loading ? 'Yükleniyor...' : `${products.length} ürün gösteriliyor`}</p>
            </div>

            <div className={styles.viewControls}>
              {/* Filter */}
              <div className={styles.sortDropdown}>
                <select
                  value={selectedCollection}
                  onChange={(e) => setSelectedCollection(e.target.value)}
                  className={styles.sortSelect}
                >
                  {collections.map(collection => (
                    <option key={collection.id} value={collection.slug}>
                      {collection.name}
                    </option>
                  ))}
                </select>
                <ChevronDown size={16} className={styles.dropdownIcon} />
              </div>

              {/* View Mode */}
              <div className={styles.viewModeButtons}>
                <button
                  className={`${styles.viewModeButton} ${viewMode === 'grid' ? styles.active : ''}`}
                  onClick={() => setViewMode('grid')}
                  aria-label="Grid görünümü"
                >
                  <Grid size={18} />
                </button>
                <button
                  className={`${styles.viewModeButton} ${viewMode === 'list' ? styles.active : ''}`}
                  onClick={() => setViewMode('list')}
                  aria-label="Liste görünümü"
                >
                  <List size={18} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Products Section */}
      <section className={styles.productsSection}>
        <div className={styles.container}>
          <div className={`${styles.productsGrid} ${viewMode === 'list' ? styles.listView : ''}`}>
            {loading ? (
              <ProductCardSkeleton viewMode={viewMode} count={8} />
            ) : products.length === 0 ? (
              <div className={styles.noResults}>
                <p>Henüz ürün bulunmamaktadır.</p>
              </div>
            ) : (
              products.map(product => {
                // Ensure image URLs are valid
                const cleanPrimaryImage = product.primaryImage?.startsWith('http') 
                  ? product.primaryImage 
                  : product.primaryImage?.startsWith('/') 
                    ? product.primaryImage 
                    : '/images/placeholder-product.svg'
                
                const cleanHoverImage = product.hoverImage?.startsWith('http') 
                  ? product.hoverImage 
                  : product.hoverImage?.startsWith('/') 
                    ? product.hoverImage 
                    : cleanPrimaryImage

                return (
                  <ProductCard
                    key={product.id}
                    product={{
                      id: parseInt(product.id) || 0,
                      slug: product.slug || `product-${product.id}`,
                      name: product.name || 'Ürün Adı',
                      category: product.category?.name || 'Kategori',
                      price: `${(product.price || 0).toLocaleString('tr-TR')} TL`,
                      images: {
                        primary: cleanPrimaryImage,
                        hover: cleanHoverImage
                      },
                      colors: Array.isArray(product.colors) ? product.colors : ['#1A1A1A'],
                      badge: product.badge
                    }}
                    viewMode={viewMode}
                  />
                )
              })
            )}
          </div>
        </div>
      </section>
    </main>
  )
}

// Fallback data for when API is not available
const defaultProducts: Product[] = [
  {
    id: '1',
    name: 'Silk Dreams Elbise',
    slug: 'silk-dreams-elbise',
    price: 3450,
    primaryImage: '/images/placeholder-product.svg',
    category: {
      id: '1',
      name: 'Elbise',
      slug: 'elbise'
    },
    collection: {
      id: '1',
      name: 'Yaz 2024',
      slug: 'yaz-2024'
    },
    badge: 'Yeni',
    colors: ['#1A1A1A', '#D4B5A0', '#FFFFFF'],
    featured: false,
    isActive: true
  },
  {
    id: '2',
    name: 'Minimal Power Blazer',
    slug: 'minimal-power-blazer',
    price: 4200,
    primaryImage: '/images/placeholder-product.svg',
    category: {
      id: '2',
      name: 'Ceket',
      slug: 'ceket'
    },
    collection: {
      id: '2',
      name: 'Business Chic',
      slug: 'business-chic'
    },
    colors: ['#1A1A1A', '#8B7355'],
    featured: false,
    isActive: true
  },
  {
    id: '3',
    name: 'Cashmere Cloud Kazak',
    slug: 'cashmere-cloud-kazak',
    price: 2850,
    primaryImage: '/images/placeholder-product.svg',
    category: {
      id: '3',
      name: 'Üst Giyim',
      slug: 'ust-giyim'
    },
    collection: {
      id: '3',
      name: 'Kış 2024',
      slug: 'kis-2024'
    },
    badge: 'Son Parçalar',
    colors: ['#D4B5A0', '#F5F5F3', '#8B7355'],
    featured: false,
    isActive: true
  }
]

const defaultCollections: Collection[] = [
  { id: 'all', name: 'Tüm Koleksiyonlar', slug: 'all' },
  { id: '1', name: 'Yaz 2024', slug: 'yaz-2024' },
  { id: '2', name: 'Kış 2024', slug: 'kis-2024' },
  { id: '3', name: 'Business Chic', slug: 'business-chic' },
  { id: '4', name: 'Timeless', slug: 'timeless' }
]

export default function CollectionsPage() {
  return (
    <PageErrorBoundary pageName="Koleksiyonlar sayfası">
      <CollectionsContent />
    </PageErrorBoundary>
  )
}