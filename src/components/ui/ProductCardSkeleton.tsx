'use client'

import React from 'react'
import { Skeleton } from './Skeleton'
import styles from './ProductCardSkeleton.module.css'

interface ProductCardSkeletonProps {
  viewMode?: 'grid' | 'list'
  count?: number
}

function SingleProductCardSkeleton({ viewMode = 'grid' }: { viewMode?: 'grid' | 'list' }) {
  if (viewMode === 'list') {
    return (
      <div className={styles.skeletonListCard}>
        <div className={styles.listImageSkeleton}>
          <Skeleton variant="rectangular" width="100%" height="100%" />
        </div>
        <div className={styles.listContent}>
          <Skeleton variant="text" height="0.875rem" width="80px" className={styles.category} />
          <Skeleton variant="text" height="1.25rem" width="70%" className={styles.title} />
          <Skeleton variant="text" height="1rem" width="90%" className={styles.description} />
          <div className={styles.listFooter}>
            <Skeleton variant="text" height="1.5rem" width="100px" />
            <Skeleton variant="rounded" width={80} height={32} />
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className={styles.skeletonCard}>
      {/* Image skeleton */}
      <div className={styles.imageSkeleton}>
        <Skeleton variant="rectangular" width="100%" height="100%" />
      </div>
      
      {/* Product info skeleton */}
      <div className={styles.productInfo}>
        {/* Category */}
        <Skeleton variant="text" height="0.875rem" width="60px" className={styles.category} />
        
        {/* Product name */}
        <Skeleton variant="text" height="1.25rem" width="80%" className={styles.title} />
        
        {/* Colors */}
        <div className={styles.colorsSkeleton}>
          <Skeleton variant="circular" width={16} height={16} />
          <Skeleton variant="circular" width={16} height={16} />
          <Skeleton variant="circular" width={16} height={16} />
        </div>
        
        {/* Price and button */}
        <div className={styles.priceRow}>
          <Skeleton variant="text" height="1.5rem" width="80px" />
          <Skeleton variant="rounded" width={70} height={32} />
        </div>
      </div>
    </div>
  )
}

export default function ProductCardSkeleton({ viewMode = 'grid', count = 8 }: ProductCardSkeletonProps) {
  return (
    <div className={viewMode === 'grid' ? styles.gridContainer : styles.listContainer}>
      {Array.from({ length: count }).map((_, index) => (
        <SingleProductCardSkeleton key={index} viewMode={viewMode} />
      ))}
    </div>
  )
}