'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { Search, Filter, Grid, List, Heart, Eye } from 'lucide-react'
import styles from './ProductsPage.module.css'

interface ProductImage {
  id: number
  url: string
  altText?: string
  isPrimary: boolean
}

interface Category {
  id: number
  name: string
  slug: string
}

interface Product {
  id: number
  name: string
  slug: string
  description?: string
  price: number
  originalPrice?: number
  category: Category
  images: ProductImage[]
  featured: boolean
  isActive: boolean
  stock: number
  colors?: string[]
}

const ProductsPage = () => {
  const [products, setProducts] = useState<Product[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [sortBy, setSortBy] = useState<'newest' | 'price-low' | 'price-high' | 'name'>('newest')
  const [hoveredProduct, setHoveredProduct] = useState<number | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [productsRes, categoriesRes] = await Promise.all([
          fetch('/api/products'),
          fetch('/api/categories')
        ])

        if (productsRes.ok) {
          const productsData = await productsRes.json()
          setProducts(productsData)
        }

        if (categoriesRes.ok) {
          const categoriesData = await categoriesRes.json()
          setCategories(categoriesData)
        }
      } catch (error) {
        console.error('Error fetching data:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  const filteredProducts = products
    .filter(product => {
      const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          product.description?.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesCategory = selectedCategory === 'all' || product.category.slug === selectedCategory
      return matchesSearch && matchesCategory && product.isActive
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'price-low':
          return a.price - b.price
        case 'price-high':
          return b.price - a.price
        case 'name':
          return a.name.localeCompare(b.name, 'tr')
        default:
          return new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime()
      }
    })

  const handleQuickView = (productId: number) => {
    console.log('Quick view for product:', productId)
  }

  const formatPrice = (price: number) => {
    return `${price.toLocaleString('tr-TR')} TL`
  }

  return (
    <div className={styles.page}>
      {/* Header */}
      <div className={styles.header}>
        <div className={styles.container}>
          <div className={styles.headerContent}>
            <h1 className={styles.title}>Ürünlerimiz</h1>
            <p className={styles.subtitle}>
              Özenle seçilmiş, kaliteli tasarımlarımızı keşfedin
            </p>
          </div>
        </div>
      </div>

      <div className={styles.container}>
        {/* Filters */}
        <div className={styles.filters}>
          <div className={styles.filterRow}>
            {/* Search */}
            <div className={styles.searchBox}>
              <Search size={20} className={styles.searchIcon} />
              <input
                type="text"
                placeholder="Ürün ara..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className={styles.searchInput}
              />
            </div>

            {/* Category Filter */}
            <div className={styles.filterGroup}>
              <Filter size={20} className={styles.filterIcon} />
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className={styles.filterSelect}
              >
                <option value="all">Tüm Kategoriler</option>
                {categories.map(category => (
                  <option key={category.id} value={category.slug}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Sort */}
            <div className={styles.filterGroup}>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className={styles.filterSelect}
              >
                <option value="newest">En Yeni</option>
                <option value="price-low">Fiyat: Düşük → Yüksek</option>
                <option value="price-high">Fiyat: Yüksek → Düşük</option>
                <option value="name">İsim: A → Z</option>
              </select>
            </div>

            {/* View Mode */}
            <div className={styles.viewMode}>
              <button
                className={`${styles.viewButton} ${viewMode === 'grid' ? styles.active : ''}`}
                onClick={() => setViewMode('grid')}
                aria-label="Izgara görünümü"
              >
                <Grid size={20} />
              </button>
              <button
                className={`${styles.viewButton} ${viewMode === 'list' ? styles.active : ''}`}
                onClick={() => setViewMode('list')}
                aria-label="Liste görünümü"
              >
                <List size={20} />
              </button>
            </div>
          </div>

          {/* Results Count */}
          <div className={styles.resultsInfo}>
            <span className={styles.resultsCount}>
              {filteredProducts.length} ürün bulundu
            </span>
          </div>
        </div>

        {/* Products Grid/List */}
        {loading ? (
          <div className={styles.loading}>
            <div className={styles.loadingSpinner}></div>
            <p>Ürünler yükleniyor...</p>
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className={styles.empty}>
            <div className={styles.emptyIcon}>🔍</div>
            <h3>Ürün bulunamadı</h3>
            <p>Arama kriterlerinizi değiştirerek tekrar deneyin.</p>
          </div>
        ) : (
          <div className={`${styles.productsGrid} ${viewMode === 'list' ? styles.listView : ''}`}>
            {filteredProducts.map((product) => {
              const primaryImage = product.images.find(img => img.isPrimary)
              const secondaryImage = product.images.find(img => !img.isPrimary)
              
              return (
                <article
                  key={product.id}
                  className={styles.productCard}
                  onMouseEnter={() => setHoveredProduct(product.id)}
                  onMouseLeave={() => setHoveredProduct(null)}
                >
                  {/* Badge */}
                  {product.featured && (
                    <span className={styles.badge}>Öne Çıkan</span>
                  )}
                  {product.originalPrice && (
                    <span className={`${styles.badge} ${styles.saleBadge}`}>İndirim</span>
                  )}
                  {product.stock < 5 && product.stock > 0 && (
                    <span className={`${styles.badge} ${styles.stockBadge}`}>Son Parçalar</span>
                  )}
                  {product.stock === 0 && (
                    <span className={`${styles.badge} ${styles.outOfStockBadge}`}>Stokta Yok</span>
                  )}

                  {/* Image Container */}
                  <div className={styles.imageContainer}>
                    <div 
                      className={`${styles.primaryImage} ${
                        hoveredProduct === product.id ? styles.hidden : ''
                      }`}
                    >
                      {primaryImage ? (
                        <img 
                          src={primaryImage.url} 
                          alt={primaryImage.altText || product.name}
                          className={styles.productImage}
                        />
                      ) : (
                        <div className={styles.imagePlaceholder}>
                          <span>{product.name}</span>
                        </div>
                      )}
                    </div>
                    
                    <div 
                      className={`${styles.hoverImage} ${
                        hoveredProduct === product.id ? styles.visible : ''
                      }`}
                    >
                      {secondaryImage ? (
                        <img 
                          src={secondaryImage.url} 
                          alt={secondaryImage.altText || product.name}
                          className={styles.productImage}
                        />
                      ) : primaryImage ? (
                        <img 
                          src={primaryImage.url} 
                          alt={primaryImage.altText || product.name}
                          className={styles.productImage}
                        />
                      ) : (
                        <div className={styles.imagePlaceholder}>
                          <span>Hover: {product.name}</span>
                        </div>
                      )}
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
                    <span className={styles.category}>{product.category.name}</span>
                    <h3 className={styles.productName}>
                      <Link href={`/urun/${product.slug}`}>
                        {product.name}
                      </Link>
                    </h3>
                    
                    {product.description && viewMode === 'list' && (
                      <p className={styles.description}>{product.description}</p>
                    )}

                    {/* Color Options */}
                    {product.colors && product.colors.length > 0 && (
                      <div className={styles.colors}>
                        {product.colors.slice(0, 4).map((color, index) => (
                          <span
                            key={index}
                            className={styles.colorDot}
                            style={{ backgroundColor: color }}
                            aria-label={`Renk ${index + 1}`}
                          />
                        ))}
                        {product.colors.length > 4 && (
                          <span className={styles.moreColors}>+{product.colors.length - 4}</span>
                        )}
                      </div>
                    )}

                    <div className={styles.priceRow}>
                      <div className={styles.priceContainer}>
                        <span className={styles.price}>{formatPrice(product.price)}</span>
                        {product.originalPrice && (
                          <span className={styles.originalPrice}>
                            {formatPrice(product.originalPrice)}
                          </span>
                        )}
                      </div>
                      
                      <Link 
                        href={`/urun/${product.slug}`}
                        className={styles.viewButton}
                      >
                        <span>İncele</span>
                      </Link>
                    </div>

                    {/* Stock Info */}
                    <div className={styles.stockInfo}>
                      {product.stock === 0 ? (
                        <span className={styles.outOfStock}>Stokta Yok</span>
                      ) : product.stock < 5 ? (
                        <span className={styles.lowStock}>Son {product.stock} parça</span>
                      ) : (
                        <span className={styles.inStock}>Stokta</span>
                      )}
                    </div>
                  </div>
                </article>
              )
            })}
          </div>
        )}

        {/* Pagination - Future enhancement */}
        {filteredProducts.length > 12 && (
          <div className={styles.pagination}>
            <p className={styles.paginationNote}>
              Daha fazla ürün için sayfalama özelliği yakında eklenecek
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

export default ProductsPage
