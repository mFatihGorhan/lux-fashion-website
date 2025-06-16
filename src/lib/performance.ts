/**
 * Performance monitoring utilities for Web Vitals and optimization
 */

export interface WebVitalsMetric {
  id: string
  name: string
  value: number
  rating: 'good' | 'needs-improvement' | 'poor'
  delta: number
  entries: PerformanceEntry[]
}

/**
 * Report Web Vitals metrics
 */
export function reportWebVitals(metric: WebVitalsMetric) {
  // Log in development
  if (process.env.NODE_ENV === 'development') {
    console.log(`[Web Vitals] ${metric.name}:`, {
      value: metric.value,
      rating: metric.rating,
      id: metric.id
    })
  }

  // Send to analytics in production
  if (process.env.NODE_ENV === 'production') {
    // Example: Send to Google Analytics
    if (typeof window !== 'undefined' && 'gtag' in window) {
      (window as any).gtag('event', metric.name, {
        custom_map: { metric_id: 'custom_metric_id' },
        metric_id: metric.id,
        metric_value: metric.value,
        metric_delta: metric.delta,
        metric_rating: metric.rating,
      })
    }

    // Example: Send to your own analytics endpoint
    if (typeof window !== 'undefined') {
      fetch('/api/analytics/web-vitals', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          metric: metric.name,
          value: metric.value,
          rating: metric.rating,
          url: window.location.href,
          timestamp: Date.now(),
        }),
      }).catch(err => {
        // Silently fail to avoid impacting user experience
        console.debug('Failed to send web vitals:', err)
      })
    }
  }
}

/**
 * Performance observer for long tasks
 */
export function observeLongTasks() {
  if (typeof window === 'undefined') return

  try {
    const observer = new PerformanceObserver((list) => {
      list.getEntries().forEach((entry) => {
        if (entry.duration > 50) { // Tasks longer than 50ms
          console.warn('Long task detected:', {
            duration: entry.duration,
            startTime: entry.startTime,
            name: entry.name
          })

          // Report to analytics if needed
          if (process.env.NODE_ENV === 'production') {
            reportWebVitals({
              id: `long-task-${Date.now()}`,
              name: 'LONG_TASK',
              value: entry.duration,
              rating: entry.duration > 100 ? 'poor' : 'needs-improvement',
              delta: 0,
              entries: [entry]
            })
          }
        }
      })
    })

    observer.observe({ entryTypes: ['longtask'] })
  } catch (err) {
    // PerformanceObserver not supported
    console.debug('PerformanceObserver not supported:', err)
  }
}

/**
 * Memory usage monitoring
 */
export function reportMemoryUsage() {
  if (typeof window === 'undefined') return

  // @ts-ignore - performance.memory is not in TypeScript types
  const memory = (performance as any).memory
  if (!memory) return

  const memoryInfo = {
    usedJSHeapSize: memory.usedJSHeapSize,
    totalJSHeapSize: memory.totalJSHeapSize,
    jsHeapSizeLimit: memory.jsHeapSizeLimit,
    usagePercentage: Math.round((memory.usedJSHeapSize / memory.jsHeapSizeLimit) * 100)
  }

  if (process.env.NODE_ENV === 'development') {
    console.log('[Memory Usage]:', memoryInfo)
  }

  // Alert if memory usage is high
  if (memoryInfo.usagePercentage > 80) {
    console.warn('High memory usage detected:', memoryInfo)
  }

  return memoryInfo
}

/**
 * Initialize performance monitoring
 */
export function initPerformanceMonitoring() {
  if (typeof window === 'undefined') return

  // Start monitoring long tasks
  observeLongTasks()

  // Monitor memory usage every 30 seconds
  setInterval(() => {
    reportMemoryUsage()
  }, 30000)

  // Report initial page load metrics
  window.addEventListener('load', () => {
    setTimeout(() => {
      const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming
      
      if (navigation) {
        const metrics = {
          domContentLoaded: navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart,
          loadComplete: navigation.loadEventEnd - navigation.loadEventStart,
          pageLoadTime: navigation.loadEventEnd - navigation.fetchStart,
        }

        if (process.env.NODE_ENV === 'development') {
          console.log('[Page Load Metrics]:', metrics)
        }
      }
    }, 0)
  })
}

/**
 * Performance-friendly image loading
 */
export function preloadImage(src: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.onload = () => resolve()
    img.onerror = () => reject(new Error(`Failed to load image: ${src}`))
    img.src = src
  })
}

/**
 * Preload critical images
 */
export async function preloadCriticalImages(imageSrcs: string[]) {
  if (typeof window === 'undefined') return

  try {
    await Promise.all(imageSrcs.map(src => preloadImage(src)))
    console.log('Critical images preloaded successfully')
  } catch (error) {
    console.warn('Failed to preload some critical images:', error)
  }
}

/**
 * Resource hints for better performance
 */
export function addResourceHints() {
  if (typeof document === 'undefined') return

  // Preconnect to external domains
  const preconnectDomains = [
    'https://fonts.googleapis.com',
    'https://fonts.gstatic.com',
  ]

  preconnectDomains.forEach(domain => {
    const link = document.createElement('link')
    link.rel = 'preconnect'
    link.href = domain
    document.head.appendChild(link)
  })

  // Prefetch common routes
  const prefetchRoutes = [
    '/urunler',
    '/koleksiyonlar',
    '/iletisim'
  ]

  prefetchRoutes.forEach(route => {
    const link = document.createElement('link')
    link.rel = 'prefetch'
    link.href = route
    document.head.appendChild(link)
  })
}