'use client'

import { useEffect } from 'react'
import { initPerformanceMonitoring, addResourceHints, reportWebVitals } from '@/lib/performance'

export default function PerformanceMonitor() {
  useEffect(() => {
    // Initialize performance monitoring
    initPerformanceMonitoring()
    
    // Add resource hints for better performance
    addResourceHints()

    // Web Vitals reporting (integrates with @vercel/speed-insights)
    if (process.env.NODE_ENV === 'production') {
      import('web-vitals').then(({ onCLS, onINP, onFCP, onLCP, onTTFB }) => {
        onCLS(reportWebVitals)
        onINP(reportWebVitals) // Updated from onFID to onINP in web-vitals v5
        onFCP(reportWebVitals)
        onLCP(reportWebVitals)
        onTTFB(reportWebVitals)
      }).catch(err => {
        console.debug('Web Vitals not available:', err)
      })
    }
  }, [])

  // This component doesn't render anything
  return null
}