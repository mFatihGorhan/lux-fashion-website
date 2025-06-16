'use client'

import { useEffect, useRef, useState } from 'react'

interface IntersectionObserverOptions {
  threshold?: number | number[]
  rootMargin?: string
  root?: Element | null
}

/**
 * Custom hook for Intersection Observer
 * Useful for lazy loading, animations, infinite scroll
 */
export function useIntersectionObserver(
  options: IntersectionObserverOptions = {}
) {
  const [isIntersecting, setIsIntersecting] = useState(false)
  const [hasIntersected, setHasIntersected] = useState(false)
  const elementRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const element = elementRef.current
    if (!element) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        const isElementIntersecting = entry.isIntersecting
        setIsIntersecting(isElementIntersecting)
        
        // Once intersected, keep track for one-time animations
        if (isElementIntersecting && !hasIntersected) {
          setHasIntersected(true)
        }
      },
      {
        threshold: options.threshold || 0.1,
        rootMargin: options.rootMargin || '0px',
        root: options.root || null,
      }
    )

    observer.observe(element)

    return () => {
      observer.unobserve(element)
      observer.disconnect()
    }
  }, [options.threshold, options.rootMargin, options.root, hasIntersected])

  return {
    elementRef,
    isIntersecting,
    hasIntersected,
  }
}

/**
 * Hook for lazy loading components when they come into view
 */
export function useLazyLoad(threshold = 0.1, rootMargin = '50px') {
  return useIntersectionObserver({
    threshold,
    rootMargin,
  })
}

/**
 * Hook for triggering animations when element comes into view
 */
export function useViewportAnimation(threshold = 0.2) {
  return useIntersectionObserver({
    threshold,
    rootMargin: '0px',
  })
}