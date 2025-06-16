'use client'

import React from 'react'
import styles from './Skeleton.module.css'

interface SkeletonProps {
  width?: string | number
  height?: string | number
  className?: string
  variant?: 'text' | 'circular' | 'rectangular' | 'rounded'
  animation?: 'pulse' | 'wave' | 'none'
}

export function Skeleton({ 
  width = '100%', 
  height = '1rem', 
  className = '',
  variant = 'rectangular',
  animation = 'pulse'
}: SkeletonProps) {
  const style = {
    width: typeof width === 'number' ? `${width}px` : width,
    height: typeof height === 'number' ? `${height}px` : height,
  }

  const classes = [
    styles.skeleton,
    styles[variant],
    styles[animation],
    className
  ].filter(Boolean).join(' ')

  return <div className={classes} style={style} />
}

// Pre-built skeleton components for common use cases
export function SkeletonText({ lines = 1, className = '' }: { lines?: number; className?: string }) {
  return (
    <div className={className}>
      {Array.from({ length: lines }).map((_, index) => (
        <Skeleton
          key={index}
          variant="text"
          height="1rem"
          width={index === lines - 1 ? "80%" : "100%"}
          className={index < lines - 1 ? styles.textWithMargin : ''}
        />
      ))}
    </div>
  )
}

export function SkeletonAvatar({ size = 40, className = '' }: { size?: number; className?: string }) {
  return (
    <Skeleton
      variant="circular"
      width={size}
      height={size}
      className={className}
    />
  )
}

export function SkeletonButton({ width = 120, height = 40, className = '' }: { 
  width?: number; 
  height?: number; 
  className?: string 
}) {
  return (
    <Skeleton
      variant="rounded"
      width={width}
      height={height}
      className={className}
    />
  )
}

export function SkeletonCard({ className = '' }: { className?: string }) {
  return (
    <div className={`${styles.skeletonCard} ${className}`}>
      <Skeleton variant="rectangular" height={200} className={styles.cardImage} />
      <div className={styles.cardContent}>
        <Skeleton variant="text" height="1.2rem" width="80%" />
        <Skeleton variant="text" height="1rem" width="60%" />
        <div className={styles.cardFooter}>
          <Skeleton variant="text" height="1.5rem" width="40%" />
          <Skeleton variant="rounded" width={80} height={32} />
        </div>
      </div>
    </div>
  )
}