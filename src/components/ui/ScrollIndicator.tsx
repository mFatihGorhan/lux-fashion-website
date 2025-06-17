'use client'

import React, { useEffect, useState } from 'react'
import { ArrowUp } from 'lucide-react'
import styles from './ScrollIndicator.module.css'

interface ScrollIndicatorProps {
  showAfter?: number
  smooth?: boolean
  className?: string
}

const ScrollIndicator: React.FC<ScrollIndicatorProps> = ({
  showAfter = 300,
  smooth = true,
  className = ''
}) => {
  const [scrollProgress, setScrollProgress] = useState(0)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const updateScrollProgress = () => {
      const scrollTop = window.pageYOffset
      const docHeight = document.documentElement.scrollHeight - window.innerHeight
      const progress = (scrollTop / docHeight) * 100
      
      setScrollProgress(progress)
      setIsVisible(scrollTop > showAfter)
    }

    window.addEventListener('scroll', updateScrollProgress, { passive: true })
    updateScrollProgress() // Initial call

    return () => window.removeEventListener('scroll', updateScrollProgress)
  }, [showAfter])

  const scrollToTop = () => {
    if (smooth) {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      })
    } else {
      window.scrollTo(0, 0)
    }
  }

  return (
    <>
      {/* Progress Bar */}
      <div className={styles.progressContainer}>
        <div 
          className={styles.progressBar}
          style={{ 
            transform: `translateX(${scrollProgress - 100}%)` 
          }}
        />
      </div>

      {/* Scroll to Top Button */}
      <button
        className={`${styles.scrollToTop} ${isVisible ? styles.visible : ''} ${className}`}
        onClick={scrollToTop}
        aria-label="Sayfa başına git"
        title="Sayfa başına git"
      >
        <div className={styles.progressRing}>
          <svg className={styles.progressCircle} viewBox="0 0 36 36">
            <path
              className={styles.progressCircleBg}
              d="M18 2.0845
                a 15.9155 15.9155 0 0 1 0 31.831
                a 15.9155 15.9155 0 0 1 0 -31.831"
            />
            <path
              className={styles.progressCircleFg}
              d="M18 2.0845
                a 15.9155 15.9155 0 0 1 0 31.831
                a 15.9155 15.9155 0 0 1 0 -31.831"
              style={{ 
                strokeDasharray: `${scrollProgress}, 100` 
              }}
            />
          </svg>
          <div className={styles.arrowContainer}>
            <ArrowUp size={20} />
          </div>
        </div>
      </button>
    </>
  )
}

export default ScrollIndicator