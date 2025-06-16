'use client'

import React from 'react'
import styles from './LoadingSpinner.module.css'

interface LoadingSpinnerProps {
  size?: 'small' | 'medium' | 'large'
  className?: string
  text?: string
  fullScreen?: boolean
}

export default function LoadingSpinner({ 
  size = 'medium', 
  className = '', 
  text = 'Yükleniyor...',
  fullScreen = false 
}: LoadingSpinnerProps) {
  if (fullScreen) {
    return (
      <div className={styles.fullScreenOverlay}>
        <div className={styles.container}>
          <div className={`${styles.spinner} ${styles[size]} ${className}`}>
            <div className={styles.dot1}></div>
            <div className={styles.dot2}></div>
            <div className={styles.dot3}></div>
          </div>
          {text && <p className={styles.text}>{text}</p>}
        </div>
      </div>
    )
  }
  
  return (
    <div className={`${styles.container} ${className}`}>
      <div className={`${styles.spinner} ${styles[size]}`}>
        <div className={styles.dot1}></div>
        <div className={styles.dot2}></div>
        <div className={styles.dot3}></div>
      </div>
      {text && <p className={styles.text}>{text}</p>}
    </div>
  )
}

// Pre-built loading components for specific use cases
export function PageLoading({ text = 'Sayfa yükleniyor...' }: { text?: string }) {
  return (
    <div className={styles.pageLoading}>
      <LoadingSpinner size="large" text={text} />
    </div>
  )
}

export function ButtonLoading({ text = 'Yükleniyor...' }: { text?: string }) {
  return (
    <div className={styles.buttonLoading}>
      <LoadingSpinner size="small" text={text} />
    </div>
  )
}

export function SectionLoading({ text = 'İçerik yükleniyor...', minHeight = '200px' }: { text?: string; minHeight?: string }) {
  return (
    <div className={styles.sectionLoading} style={{ minHeight }}>
      <LoadingSpinner size="medium" text={text} />
    </div>
  )
}