'use client'

import React, { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import styles from './HeroSection.module.css'

interface HeroSlide {
  id: number
  title: string
  subtitle: string
  description: string
  imageUrl?: string
  ctaText: string
  ctaLink: string
  isActive: boolean
  order: number
  backgroundColor?: string
  textColor?: string
  gradient?: string
}

const defaultSlides = [
  {
    id: 1,
    title: 'Yeni Sezon',
    subtitle: 'Kapsül Koleksiyon',
    description: 'Özgün tasarımlar, sınırlı sayıda üretim',
    gradient: 'linear-gradient(135deg, #1A1A1A 0%, #3A3A3A 100%)',
    cta: 'Koleksiyonu Keşfet',
    link: '/koleksiyonlar'
  },
  {
    id: 2,
    title: 'Ulaşılabilir Lüks',
    subtitle: 'Özel Tasarımlar',
    description: 'Her parça, bir sanat eseri',
    gradient: 'linear-gradient(135deg, #2C1810 0%, #8B6B47 100%)',
    cta: 'Teklif Al',
    link: '/iletisim'
  },
  {
    id: 3,
    title: 'El İşçiliği',
    subtitle: 'Detaylara Özen',
    description: 'Kaliteli kumaşlar, kusursuz işçilik',
    gradient: 'linear-gradient(135deg, #1F1C18 0%, #8B7355 100%)',
    cta: 'Hakkımızda',
    link: '/hakkimizda'
  }
]

const HeroSection = () => {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [isTransitioning, setIsTransitioning] = useState(false)
  const [slides, setSlides] = useState(defaultSlides)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchHeroSlides = async () => {
      try {
        const response = await fetch('/api/hero-slides')
        if (response.ok) {
          const heroSlides: HeroSlide[] = await response.json()
          if (heroSlides.length > 0) {
            const formattedSlides = heroSlides.map(slide => ({
              id: slide.id,
              title: slide.title,
              subtitle: slide.subtitle,
              description: slide.description,
              gradient: slide.gradient || 'linear-gradient(135deg, #1A1A1A 0%, #3A3A3A 100%)',
              cta: slide.ctaText,
              link: slide.ctaLink
            }))
            setSlides(formattedSlides)
          }
        }
      } catch (error) {
        console.error('Error fetching hero slides:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchHeroSlides()
  }, [])

  const handleNextSlide = useCallback(() => {
    setIsTransitioning(true)
    setTimeout(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length)
      setIsTransitioning(false)
    }, 300)
  }, [slides.length])

  useEffect(() => {
    if (loading) return
    
    const timer = setInterval(() => {
      handleNextSlide()
    }, 6000)

    return () => clearInterval(timer)
  }, [currentSlide, loading, handleNextSlide])


  const handlePrevSlide = () => {
    setIsTransitioning(true)
    setTimeout(() => {
      setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length)
      setIsTransitioning(false)
    }, 300)
  }

  const goToSlide = (index: number) => {
    setIsTransitioning(true)
    setTimeout(() => {
      setCurrentSlide(index)
      setIsTransitioning(false)
    }, 300)
  }

  if (loading) {
    return (
      <section className={styles.hero}>
        <div className={styles.backgroundWrapper}>
          <div className={styles.backgroundImage} style={{ background: 'linear-gradient(135deg, #1A1A1A 0%, #3A3A3A 100%)' }}>
            <div className={styles.imageOverlay} />
          </div>
        </div>
        <div className={styles.content}>
          <div className={styles.container}>
            <div className={styles.slideContent}>
              <span className={styles.subtitle}>Yükleniyor...</span>
              <h1 className={styles.title}>
                <span className={styles.titleWord}>Lux Fashion</span>
              </h1>
              <p className={styles.description}>İçerik yükleniyor...</p>
            </div>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className={styles.hero}>
      {/* Background Images */}
      <div className={styles.backgroundWrapper}>
        {slides.map((slide, index) => (
          <div
            key={slide.id}
            className={`${styles.backgroundImage} ${
              index === currentSlide ? styles.active : ''
            } ${isTransitioning ? styles.transitioning : ''}`}
            style={{ background: slide.gradient }}
          >
            <div className={styles.imageOverlay} />
          </div>
        ))}
      </div>

      {/* Content */}
      <div className={styles.content}>
        <div className={styles.container}>
          {slides.map((slide, index) => (
            <div
              key={slide.id}
              className={`${styles.slideContent} ${
                index === currentSlide ? styles.activeContent : ''
              }`}
            >
              <span className={styles.subtitle}>{slide.subtitle}</span>
              <h1 className={styles.title}>
                {slide.title.split(' ').map((word, i) => (
                  <span key={i} className={styles.titleWord}>
                    {word}
                  </span>
                ))}
              </h1>
              <p className={styles.description}>{slide.description}</p>
              
              <div className={styles.ctaWrapper}>
                <Link href={slide.link} className={styles.ctaButton}>
                  <span className={styles.ctaText}>{slide.cta}</span>
                  <span className={styles.ctaIcon}>→</span>
                </Link>
                
                <Link href="/koleksiyonlar" className={styles.secondaryButton}>
                  Tüm Koleksiyonlar
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Navigation */}
      <div className={styles.navigation}>
        <button
          className={styles.navButton}
          onClick={handlePrevSlide}
          aria-label="Önceki"
        >
          <ChevronLeft size={24} />
        </button>
        <button
          className={styles.navButton}
          onClick={handleNextSlide}
          aria-label="Sonraki"
        >
          <ChevronRight size={24} />
        </button>
      </div>

      {/* Dots */}
      <div className={styles.dots}>
        {slides.map((_, index) => (
          <button
            key={index}
            className={`${styles.dot} ${
              index === currentSlide ? styles.activeDot : ''
            }`}
            onClick={() => goToSlide(index)}
            aria-label={`Slide ${index + 1}`}
          >
            <span className={styles.dotInner} />
          </button>
        ))}
      </div>

      {/* Scroll Indicator */}
      <div className={styles.scrollIndicator}>
        <span className={styles.scrollText}>Aşağı Kaydır</span>
        <div className={styles.scrollLine} />
      </div>
    </section>
  )
}

export default HeroSection