'use client'

import React, { useState } from 'react'
import { Filter, X, ChevronDown, Grid, List } from 'lucide-react'
import ProductCard from '@/components/ui/ProductCard'
import styles from './collections.module.css'

// Örnek ürün verisi
const allProducts = [
  {
    id: 1,
    name: 'Silk Dreams Elbise',
    category: 'Elbise',
    collection: 'Yaz 2024',
    price: '3,450 TL',
    images: {
      primary: '/images/product-1-a.jpg',
      hover: '/images/product-1-b.jpg'
    },
    badge: 'Yeni',
    colors: ['#1A1A1A', '#D4B5A0', '#FFFFFF']
  },
  {
    id: 2,
    name: 'Minimal Power Blazer',
    category: 'Ceket',
    collection: 'Business Chic',
    price: '4,200 TL',
    images: {
      primary: '/images/product-2-a.jpg',
      hover: '/images/product-2-b.jpg'
    },
    colors: ['#1A1A1A', '#8B7355']
  },
  {
    id: 3,
    name: 'Cashmere Cloud Kazak',
    category: 'Üst Giyim',
    collection: 'Kış 2024',
    price: '2,850 TL',
    images: {
      primary: '/images/product-3-a.jpg',
      hover: '/images/product-3-b.jpg'
    },
    badge: 'Son Parçalar',
    colors: ['#D4B5A0', '#F5F5F3', '#8B7355']
  },
  {
    id: 4,
    name: 'Wide Leg Trousers',
    category: 'Alt Giyim',
    collection: 'Timeless',
    price: '2,950 TL',
    images: {
      primary: '/images/product-4-a.jpg',
      hover: '/images/product-4-b.jpg'
    },
    colors: ['#1A1A1A', '#666666']
  },
  {
    id: 5,
    name: 'Elegant Midi Skirt',
    category: 'Etek',
    collection: 'Yaz 2024',
    price: '2,450 TL',
    images: {
      primary: '/images/product-5-a.jpg',
      hover: '/images/product-5-b.jpg'
    },
    colors: ['#D4B5A0', '#1A1A1A']
  },
  {
    id: 6,
    name: 'Luxe Silk Shirt',
    category: 'Üst Giyim',
    collection: 'Business Chic',
    price: '2,150 TL',
    images: {
      primary: '/images/product-6-a.jpg',
      hover: '/images/product-6-b.jpg'
    },
    badge: 'Limited Edition',
    colors: ['#FFFFFF', '#F5F5F3']
  },
  {
    id: 7,
    name: 'Statement Coat',
    category: 'Dış Giyim',
    collection: 'Kış 2024',
    price: '7,850 TL',
    images: {
      primary: '/images/product-7-a.jpg',
      hover: '/images/product-7-b.jpg'
    },
    colors: ['#1A1A1A', '#8B7355', '#D4B5A0']
  },
  {
    id: 8,
    name: 'Evening Elegance Dress',
    category: 'Elbise',
    collection: 'Special Occasions',
    price: '5,450 TL',
    images: {
      primary: '/images/product-8-a.jpg',
      hover: '/images/product-8-b.jpg'
    },
    badge: 'Özel Koleksiyon',
    colors: ['#1A1A1A', '#8B6B47']
  }
]

const collections = ['Tümü', 'Yaz 2024', 'Kış 2024', 'Business Chic', 'Timeless', 'Special Occasions']
const sortOptions = [
  { value: 'featured', label: 'Öne Çıkanlar' },
  { value: 'price-asc', label: 'Fiyat: Düşükten Yükseğe' },
  { value: 'price-desc', label: 'Fiyat: Yüksekten Düşüğe' },
  { value: 'newest', label: 'En Yeniler' }
]

export default function CollectionsPage() {
  const [selectedCollection, setSelectedCollection] = useState('Tümü')
  const [sortBy, setSortBy] = useState('featured')
  const [isFilterOpen, setIsFilterOpen] = useState(false)
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')

  // Filtreleme
  const filteredProducts = allProducts.filter(product => {
    const collectionMatch = selectedCollection === 'Tümü' || product.collection === selectedCollection
    return collectionMatch
  })

  // Sıralama
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (sortBy) {
      case 'price-asc':
        return parseInt(a.price.replace(/[^\d]/g, '')) - parseInt(b.price.replace(/[^\d]/g, ''))
      case 'price-desc':
        return parseInt(b.price.replace(/[^\d]/g, '')) - parseInt(a.price.replace(/[^\d]/g, ''))
      case 'newest':
        return b.id - a.id
      default:
        return 0
    }
  })

  return (
    <main className={styles.main}>
      {/* Page Header */}
      <section className={styles.pageHeader}>
        <div className={styles.headerContent}>
          <h1 className={styles.title}>Koleksiyonlar</h1>
          <p className={styles.subtitle}>
            Her biri özenle tasarlanmış, sınırlı sayıda üretilen parçalarımız
          </p>
        </div>
      </section>

      {/* Filters Bar */}
      <div className={styles.filtersBar}>
        <div className={styles.container}>
          <div className={styles.filtersContent}>
            <button
              className={styles.mobileFilterToggle}
              onClick={() => setIsFilterOpen(!isFilterOpen)}
            >
              <Filter size={20} />
              <span>Filtreler</span>
            </button>

            <div className={styles.desktopFilters}>
              {/* Collection Filter */}
              <div className={styles.filterGroup}>
                <label className={styles.filterLabel}>Koleksiyon</label>
                <div className={styles.filterButtons}>
                  {collections.map(collection => (
                    <button
                      key={collection}
                      className={`${styles.filterButton} ${
                        selectedCollection === collection ? styles.active : ''
                      }`}
                      onClick={() => setSelectedCollection(collection)}
                    >
                      {collection}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className={styles.viewControls}>
              {/* Sort Dropdown */}
              <div className={styles.sortDropdown}>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className={styles.sortSelect}
                >
                  {sortOptions.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
                <ChevronDown size={16} className={styles.dropdownIcon} />
              </div>

              {/* View Mode */}
              <div className={styles.viewModeButtons}>
                <button
                  className={`${styles.viewModeButton} ${
                    viewMode === 'grid' ? styles.active : ''
                  }`}
                  onClick={() => setViewMode('grid')}
                  aria-label="Grid görünümü"
                >
                  <Grid size={18} />
                </button>
                <button
                  className={`${styles.viewModeButton} ${
                    viewMode === 'list' ? styles.active : ''
                  }`}
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

      {/* Mobile Filter Panel */}
      <div className={`${styles.mobileFilterPanel} ${isFilterOpen ? styles.open : ''}`}>
        <div className={styles.mobileFilterHeader}>
          <h3>Filtreler</h3>
          <button
            className={styles.closeButton}
            onClick={() => setIsFilterOpen(false)}
          >
            <X size={24} />
          </button>
        </div>
        
        <div className={styles.mobileFilterContent}>
          {/* Collection Filter */}
          <div className={styles.mobileFilterGroup}>
            <h4>Koleksiyon</h4>
            {collections.map(collection => (
              <button
                key={collection}
                className={`${styles.mobileFilterOption} ${
                  selectedCollection === collection ? styles.active : ''
                }`}
                onClick={() => {
                  setSelectedCollection(collection)
                  setIsFilterOpen(false)
                }}
              >
                {collection}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Products Grid */}
      <section className={styles.productsSection}>
        <div className={styles.container}>
          <div className={styles.resultsInfo}>
            <p>{sortedProducts.length} ürün gösteriliyor</p>
          </div>

          <div className={`${styles.productsGrid} ${
            viewMode === 'list' ? styles.listView : ''
          }`}>
            {sortedProducts.map((product, index) => (
              <ProductCard
                key={product.id}
                product={product}
                index={index}
                viewMode={viewMode}
              />
            ))}
          </div>

          {sortedProducts.length === 0 && (
            <div className={styles.noResults}>
              <p>Seçilen filtrelere uygun ürün bulunamadı.</p>
              <button
                className={styles.resetButton}
                onClick={() => {
                  setSelectedCollection('Tümü')
                }}
              >
                Filtreleri Temizle
              </button>
            </div>
          )}
        </div>
      </section>

      {/* Overlay for mobile filter */}
      {isFilterOpen && (
        <div
          className={styles.overlay}
          onClick={() => setIsFilterOpen(false)}
        />
      )}
    </main>
  )
}