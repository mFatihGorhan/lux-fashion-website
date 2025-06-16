'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import { ArrowLeft, Search, Grid, List, Heart, Eye, Filter } from 'lucide-react'
import styles from './CategoryPage.module.css'

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
  description?: string
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
  createdAt: string
}

const CategoryPage = () => {
  const params = useParams()
  const [category, setCategory] = useState<Category | null>(null)
  const [products, setProducts] = useState<Product[]>([])
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [sortBy, setSortBy] = useState<'newest' | 'price-low' | 'price-high' | 'name'>('newest')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [priceRange, setPriceRange] = useState<{min: number, max: number}>({min: 0, max: 10000})
  const [showOnlyInStock, setShowOnlyInStock] = useState(false)
  const [showOnlyFeatured, setShowOnlyFeatured] = useState(false)
  const [hoveredProduct, setHoveredProduct] = useState<number | null>(null)

  useEffect(() => {
    const fetchCategoryData = async () => {
      if (!params.slug) return
      
      try {
        const [categoryRes, productsRes] = await Promise.all([
          fetch(`/api/categories/${params.slug}`),
          fetch(`/api/categories/${params.slug}/products`)
        ])

        if (categoryRes.ok) {
          const categoryData = await categoryRes.json()
          setCategory(categoryData)
        }

        if (productsRes.ok) {
          const productsData = await productsRes.json()
          setProducts(productsData)
          setFilteredProducts(productsData)
          
          // Set price range based on actual products
          const prices = productsData.map((p: Product) => p.price)
          const minPrice = Math.min(...prices)
          const maxPrice = Math.max(...prices)
          setPriceRange({min: minPrice, max: maxPrice})
        }
      } catch (error) {
        console.error('Error fetching category data:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchCategoryData()
  }, [params.slug])

  useEffect(() => {
    let filtered = products.filter(product => {
      const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          product.description?.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesPrice = product.price >= priceRange.min && product.price <= priceRange.max
      const matchesStock = !showOnlyInStock || product.stock > 0
      const matchesFeatured = !showOnlyFeatured || product.featured
      
      return matchesSearch && matchesPrice && matchesStock && matchesFeatured && product.isActive
    })

    // Sort products
    filtered = filtered.sort((a, b) => {
      switch (sortBy) {
        case 'price-low':
          return a.price - b.price
        case 'price-high':
          return b.price - a.price
        case 'name':
          return a.name.localeCompare(b.name, 'tr')
        default:
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      }
    })

    setFilteredProducts(filtered)
  }, [products, searchTerm, sortBy, priceRange, showOnlyInStock, showOnlyFeatured])

  const handleQuickView = (productId: number) => {
    console.log('Quick view for product:', productId)
  }

  const formatPrice = (price: number) => {
    return `${price.toLocaleString('tr-TR')} TL`
  }

  const resetFilters = () => {
    setSearchTerm('')
    setSortBy('newest')
    setShowOnlyInStock(false)
    setShowOnlyFeatured(false)
    if (products.length > 0) {
      const prices = products.map(p => p.price)
      setPriceRange({min: Math.min(...prices), max: Math.max(...prices)})
    }
  }

  if (loading) {
    return (
      <div className={styles.loading}>
        <div className={styles.loadingSpinner}></div>
        <p>Kategori yükleniyor...</p>
      </div>
    )
  }

  if (!category) {
    return (
      <div className={styles.notFound}>
        <h1>Kategori Bulunamadı</h1>
        <p>Aradığınız kategori mevcut değil.</p>
        <Link href="/urunler" className={styles.backButton}>
          Ürünlere Geri Dön
        </Link>
      </div>
    )
  }

  return (
    <div className={styles.page}>
      {/* Header */}
      <div className={styles.header}>
        <div className={styles.container}>
          {/* Breadcrumb */}
          <div className={styles.breadcrumb}>
            <Link href="/" className={styles.breadcrumbLink}>Ana Sayfa</Link>
            <span className={styles.breadcrumbSeparator}>/</span>
            <Link href="/urunler" className={styles.breadcrumbLink}>Ürünler</Link>
            <span className={styles.breadcrumbSeparator}>/</span>
            <span className={styles.breadcrumbCurrent}>{category.name}</span>
          </div>

          <div className={styles.headerContent}>
            <Link href="/urunler" className={styles.backButton}>
              <ArrowLeft size={20} />
              <span>Tüm Ürünler</span>
            </Link>
            
            <div className={styles.categoryInfo}>
              <h1 className={styles.title}>{category.name}</h1>
              {category.description && (
                <p className={styles.description}>{category.description}</p>
              )}
              <div className={styles.productCount}>
                {filteredProducts.length} ürün bulundu
              </div>
            </div>
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
                placeholder="Bu kategoride ara..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className={styles.searchInput}
              />
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

            {/* Filter Toggle */}
            <button 
              className={styles.filterToggle}
              onClick={() => document.querySelector(`.${styles.advancedFilters}`)?.classList.toggle(styles.open)}
            >
              <Filter size={20} />
              <span>Filtreler</span>
            </button>
          </div>

          {/* Advanced Filters */}
          <div className={styles.advancedFilters}>
            <div className={styles.filterGrid}>
              {/* Price Range */}
              <div className={styles.filterItem}>
                <h4>Fiyat Aralığı</h4>
                <div className={styles.priceRange}>
                  <input
                    type="number"
                    placeholder="Min"
                    value={priceRange.min}
                    onChange={(e) => setPriceRange({...priceRange, min: Number(e.target.value)})}
                    className={styles.priceInput}
                  />
                  <span>-</span>
                  <input
                    type="number"
                    placeholder="Max"
                    value={priceRange.max}
                    onChange={(e) => setPriceRange({...priceRange, max: Number(e.target.value)})}
                    className={styles.priceInput}
                  />
                  <span>TL</span>
                </div>
              </div>

              {/* Stock Filter */}
              <div className={styles.filterItem}>
                <label className={styles.checkboxLabel}>
                  <input
                    type="checkbox"
                    checked={showOnlyInStock}
                    onChange={(e) => setShowOnlyInStock(e.target.checked)}
                    className={styles.checkbox}
                  />
                  <span>Sadece Stokta Olanlar</span>
                </label>
              </div>

              {/* Featured Filter */}
              <div className={styles.filterItem}>
                <label className={styles.checkboxLabel}>
                  <input
                    type="checkbox"
                    checked={showOnlyFeatured}
                    onChange={(e) => setShowOnlyFeatured(e.target.checked)}
                    className={styles.checkbox}
                  />
                  <span>Öne Çıkan Ürünler</span>
                </label>
              </div>

              {/* Reset Filters */}
              <div className={styles.filterItem}>
                <button onClick={resetFilters} className={styles.resetButton}>
                  Filtreleri Temizle
                </button>
              </div>
            </div>
          </div>

          {/* Active Filters */}
          {(searchTerm || showOnlyInStock || showOnlyFeatured) && (
            <div className={styles.activeFilters}>
              <span>Aktif Filtreler:</span>
              {searchTerm && (
                <span className={styles.filterTag}>
                  Arama: "{searchTerm}"
                  <button onClick={() => setSearchTerm('')}>×</button>
                </span>
              )}
              {showOnlyInStock && (
                <span className={styles.filterTag}>
                  Stokta Olanlar
                  <button onClick={() => setShowOnlyInStock(false)}>×</button>
                </span>
              )}
              {showOnlyFeatured && (
                <span className={styles.filterTag}>
                  Öne Çıkanlar
                  <button onClick={() => setShowOnlyFeatured(false)}>×</button>
                </span>
              )}
            </div>
          )}
        </div>

        {/* Products Grid/List */}
        {filteredProducts.length === 0 ? (
          <div className={styles.empty}>
            <div className={styles.emptyIcon}>🔍</div>
            <h3>Ürün bulunamadı</h3>
            <p>Bu kategoride filtre kriterlerinize uygun ürün bulunmuyor.</p>
            <button onClick={resetFilters} className={styles.resetButton}>
              Filtreleri Temizle
            </button>
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

        {/* Load More - Future enhancement */}
        {filteredProducts.length > 12 && (
          <div className={styles.loadMore}>
            <p>Daha fazla ürün yüklemek için sayfalama özelliği yakında eklenecek</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default CategoryPage
