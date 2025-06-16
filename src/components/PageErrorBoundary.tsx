'use client'

import React from 'react'
import ErrorBoundary from './ErrorBoundary'
import { AlertCircle, RefreshCw, Home } from 'lucide-react'
import Link from 'next/link'
import styles from './PageErrorBoundary.module.css'

interface PageErrorBoundaryProps {
  children: React.ReactNode
  pageName?: string
  showContactInfo?: boolean
}

export default function PageErrorBoundary({ 
  children, 
  pageName = 'Bu sayfa',
  showContactInfo = false 
}: PageErrorBoundaryProps) {
  const handleError = (error: Error, errorInfo: React.ErrorInfo) => {
    // Log error with additional page context (client-side only)
    if (typeof window !== 'undefined') {
      console.error(`Error in ${pageName}:`, error, errorInfo)
      
      // In production, send to monitoring service with page context
      if (process.env.NODE_ENV === 'production') {
        // TODO: Send to error monitoring service with page context
        // Example: Sentry.captureException(error, { extra: { pageName, errorInfo } })
      }
    }
  }

  const customFallback = (
    <div className={styles.pageError}>
      <div className={styles.errorContent}>
        <div className={styles.errorIcon}>
          <AlertCircle size={56} />
        </div>
        
        <h1 className={styles.errorTitle}>
          {pageName} yüklenemiyor
        </h1>
        
        <p className={styles.errorMessage}>
          Bu sayfayı yüklerken teknik bir sorun yaşandı. 
          Lütfen sayfayı yenilemeyi deneyin.
        </p>

        <div className={styles.errorActions}>
          <button 
            onClick={() => window.location.reload()}
            className={styles.reloadButton}
          >
            <RefreshCw size={18} />
            <span>Sayfayı Yenile</span>
          </button>
          
          <Link href="/" className={styles.homeLink}>
            <Home size={18} />
            <span>Ana Sayfa</span>
          </Link>
        </div>

        {showContactInfo && (
          <div className={styles.contactInfo}>
            <p>Sorun devam ederse, lütfen bizimle iletişime geçin:</p>
            <Link href="/iletisim" className={styles.contactLink}>
              İletişim Sayfası
            </Link>
          </div>
        )}
      </div>
    </div>
  )

  return (
    <ErrorBoundary 
      onError={handleError}
      fallback={customFallback}
    >
      {children}
    </ErrorBoundary>
  )
}