'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { Menu, X, Search, Phone } from 'lucide-react'
import SearchBox from '@/components/ui/SearchBox'
import styles from './Header.module.css'

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isSearchOpen, setIsSearchOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const navItems = [
    { name: 'Ana Sayfa', href: '/' },
    { name: 'Koleksiyonlar', href: '/koleksiyonlar' },
    { name: 'Hakkımızda', href: '/hakkimizda' },
    { name: 'Blog', href: '/blog' },
    { name: 'İletişim', href: '/iletisim' },
  ]

  return (
    <>
      {/* Top Bar */}
      <div className={styles.topBar}>
        <div className={styles.topBarContainer}>
          <p className={styles.topBarText}>
            Özel tasarımlar, sınırlı sayıda üretim
          </p>
          <div className={styles.topBarRight}>
            <a href="tel:+905555555555" className={styles.phoneLink}>
              <Phone size={14} />
              <span>+90 555 555 55 55</span>
            </a>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <header className={`${styles.header} ${isScrolled ? styles.scrolled : ''}`}>
        <div className={styles.container}>
          {/* Logo */}
          <Link href="/" className={styles.logo}>
            <span className={styles.logoText}>LUXE</span>
            <span className={styles.logoSubtext}>FASHION</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className={styles.desktopNav}>
            {navItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={styles.navLink}
              >
                <span>{item.name}</span>
                <span className={styles.navUnderline}></span>
              </Link>
            ))}
          </nav>

          {/* Search Box (Desktop) */}
          <div className={styles.searchContainer}>
            <SearchBox placeholder="Ürün ara..." className={styles.headerSearch} />
          </div>

          {/* Actions */}
          <div className={styles.actions}>
            <button 
              className={styles.searchButton}
              onClick={() => setIsSearchOpen(!isSearchOpen)}
            >
              <Search size={20} />
            </button>
            
            <Link href="/iletisim" className={styles.ctaButton}>
              <span>Teklif Al</span>
              <span className={styles.ctaArrow}>→</span>
            </Link>

            {/* Mobile Menu Toggle */}
            <button
              className={styles.mobileMenuToggle}
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Search */}
      {isSearchOpen && (
        <div className={styles.mobileSearchOverlay}>
          <div className={styles.mobileSearchContainer}>
            <SearchBox 
              placeholder="Ürün ara..." 
              className={styles.mobileSearch}
              onSearch={() => setIsSearchOpen(false)}
            />
            <button 
              className={styles.mobileSearchClose}
              onClick={() => setIsSearchOpen(false)}
            >
              <X size={24} />
            </button>
          </div>
        </div>
      )}

      {/* Mobile Menu */}
      <div className={`${styles.mobileMenu} ${isMobileMenuOpen ? styles.mobileMenuOpen : ''}`}>
        <nav className={styles.mobileNav}>
          {navItems.map((item, index) => (
            <Link
              key={item.name}
              href={item.href}
              className={styles.mobileNavLink}
              onClick={() => setIsMobileMenuOpen(false)}
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <span>{item.name}</span>
              <span className={styles.mobileNavArrow}>→</span>
            </Link>
          ))}
          
          <div className={styles.mobileMenuFooter}>
            <a href="tel:+905555555555" className={styles.mobilePhone}>
              <Phone size={20} />
              <span>+90 555 555 55 55</span>
            </a>
            <div className={styles.mobileSocial}>
              <a href="#" aria-label="Instagram">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                  <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                </svg>
              </a>
              <a href="#" aria-label="Pinterest">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <circle cx="12" cy="12" r="10"></circle>
                  <path d="M8 12a4 4 0 1 0 4.5 3.969V9.5a.5.5 0 0 1 .5-.5h1"></path>
                </svg>
              </a>
            </div>
          </div>
        </nav>
      </div>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div 
          className={styles.mobileMenuOverlay}
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}
    </>
  )
}

export default Header