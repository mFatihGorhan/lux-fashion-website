'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { 
  Instagram, 
  Mail, 
  Phone, 
  MapPin, 
  Clock,
  Send,
  Heart
} from 'lucide-react'
import styles from './Footer.module.css'

interface FooterContent {
  brandTitle: string
  brandDescription: string
  phone: string
  email: string
  address: string
  workingHours: string
  instagramUrl?: string
  pinterestUrl?: string
  linkedinUrl?: string
  copyrightText: string
}

const Footer = () => {
  const [email, setEmail] = useState('')
  const [isSubscribed, setIsSubscribed] = useState(false)
  const [footerContent, setFooterContent] = useState<FooterContent | null>(null)

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault()
    if (email) {
      setIsSubscribed(true)
      setTimeout(() => {
        setEmail('')
        setIsSubscribed(false)
      }, 3000)
    }
  }

  const currentYear = new Date().getFullYear()

  useEffect(() => {
    fetchFooterContent()
  }, [])

  const fetchFooterContent = async () => {
    try {
      const response = await fetch('/api/footer')
      if (response.ok) {
        const data = await response.json()
        setFooterContent(data)
      }
    } catch (error) {
      console.error('Error fetching footer content:', error)
    }
  }

  return (
    <footer className={styles.footer}>
      {/* Newsletter Section */}
      <div className={styles.newsletter}>
        <div className={styles.newsletterContainer}>
          <div className={styles.newsletterContent}>
            <h3 className={styles.newsletterTitle}>Yenilikleri Kaçırmayın</h3>
            <p className={styles.newsletterText}>
              Özel koleksiyonlar ve kampanyalardan ilk siz haberdar olun
            </p>
          </div>
          
          <form className={styles.newsletterForm} onSubmit={handleSubscribe}>
            <div className={styles.inputWrapper}>
              <input
                type="email"
                placeholder="E-posta adresiniz"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={styles.emailInput}
                required
              />
              <button 
                type="submit" 
                className={styles.subscribeButton}
                disabled={isSubscribed}
              >
                {isSubscribed ? (
                  <span className={styles.successIcon}>✓</span>
                ) : (
                  <Send size={18} />
                )}
              </button>
            </div>
            {isSubscribed && (
              <p className={styles.successMessage}>
                Başarıyla abone oldunuz!
              </p>
            )}
          </form>
        </div>
      </div>

      {/* Main Footer */}
      <div className={styles.mainFooter}>
        <div className={styles.container}>
          <div className={styles.footerGrid}>
            {/* Brand Column */}
            <div className={styles.brandColumn}>
              <Link href="/" className={styles.footerLogo}>
                <span className={styles.logoText}>
                  {footerContent?.brandTitle?.split(' ')[0] || 'LUXE'}
                </span>
                <span className={styles.logoSubtext}>
                  {footerContent?.brandTitle?.split(' ')[1] || 'FASHION'}
                </span>
              </Link>
              
              <p className={styles.brandDescription}>
                {footerContent?.brandDescription || 'Ulaşılabilir lüks segmentinde, özgün ve sınırlı sayıda üretilen koleksiyonlarımızla kadın giyiminde fark yaratıyoruz.'}
              </p>

              {/* Social Links */}
              <div className={styles.socialLinks}>
                {footerContent?.instagramUrl && (
                  <a 
                    href={footerContent.instagramUrl} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className={styles.socialLink}
                    aria-label="Instagram"
                  >
                    <Instagram size={20} />
                  </a>
                )}
                {footerContent?.pinterestUrl && (
                  <a 
                    href={footerContent.pinterestUrl} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className={styles.socialLink}
                    aria-label="Pinterest"
                  >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                      <circle cx="12" cy="12" r="10"></circle>
                      <path d="M8 12a4 4 0 1 0 4.5 3.969V9.5a.5.5 0 0 1 .5-.5h1"></path>
                    </svg>
                  </a>
                )}
                {footerContent?.linkedinUrl && (
                  <a 
                    href={footerContent.linkedinUrl} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className={styles.socialLink}
                    aria-label="LinkedIn"
                  >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
                      <rect x="2" y="9" width="4" height="12"></rect>
                      <circle cx="4" cy="4" r="2"></circle>
                    </svg>
                  </a>
                )}
              </div>
            </div>

            {/* Quick Links */}
            <div className={styles.linksColumn}>
              <h4 className={styles.columnTitle}>Hızlı Linkler</h4>
              <ul className={styles.linksList}>
                <li>
                  <Link href="/koleksiyonlar" className={styles.footerLink}>
                    Koleksiyonlar
                  </Link>
                </li>
                <li>
                  <Link href="/hakkimizda" className={styles.footerLink}>
                    Hakkımızda
                  </Link>
                </li>
                <li>
                  <Link href="/blog" className={styles.footerLink}>
                    Blog
                  </Link>
                </li>
                <li>
                  <Link href="/iletisim" className={styles.footerLink}>
                    İletişim
                  </Link>
                </li>
              </ul>
            </div>

            {/* Customer Service */}
            <div className={styles.linksColumn}>
              <h4 className={styles.columnTitle}>Müşteri Hizmetleri</h4>
              <ul className={styles.linksList}>
                <li>
                  <Link href="/sikca-sorulan-sorular" className={styles.footerLink}>
                    Sıkça Sorulan Sorular
                  </Link>
                </li>
                <li>
                  <Link href="/urun-bakimi" className={styles.footerLink}>
                    Ürün Bakım Rehberi
                  </Link>
                </li>
                <li>
                  <Link href="/beden-tablosu" className={styles.footerLink}>
                    Beden Tablosu
                  </Link>
                </li>
                <li>
                  <Link href="/toptan-satis" className={styles.footerLink}>
                    Toptan Satış
                  </Link>
                </li>
              </ul>
            </div>

            {/* Contact Info */}
            <div className={styles.contactColumn}>
              <h4 className={styles.columnTitle}>İletişim Bilgileri</h4>
              
              <div className={styles.contactItem}>
                <Phone size={16} className={styles.contactIcon} />
                <div>
                  <a href={`tel:${footerContent?.phone?.replace(/\s/g, '')}`} className={styles.contactLink}>
                    {footerContent?.phone || '+90 555 555 55 55'}
                  </a>
                  <p className={styles.contactLabel}>Telefon</p>
                </div>
              </div>

              <div className={styles.contactItem}>
                <Mail size={16} className={styles.contactIcon} />
                <div>
                  <a href={`mailto:${footerContent?.email}`} className={styles.contactLink}>
                    {footerContent?.email || 'info@luxefashion.com'}
                  </a>
                  <p className={styles.contactLabel}>E-posta</p>
                </div>
              </div>

              <div className={styles.contactItem}>
                <MapPin size={16} className={styles.contactIcon} />
                <div>
                  <p className={styles.contactText}>
                    {footerContent?.address?.split('\n').map((line, index) => (
                      <span key={index}>
                        {line}
                        {index < footerContent.address.split('\n').length - 1 && <br />}
                      </span>
                    )) || (
                      <>
                        Nişantaşı, Abdi İpekçi Cad. No:23<br />
                        Şişli, İstanbul
                      </>
                    )}
                  </p>
                  <p className={styles.contactLabel}>Showroom</p>
                </div>
              </div>

              <div className={styles.contactItem}>
                <Clock size={16} className={styles.contactIcon} />
                <div>
                  <p className={styles.contactText}>
                    {footerContent?.workingHours?.split('\n').map((line, index) => (
                      <span key={index}>
                        {line}
                        {index < footerContent.workingHours.split('\n').length - 1 && <br />}
                      </span>
                    )) || (
                      <>
                        Pazartesi - Cumartesi: 10:00 - 19:00<br />
                        Pazar: Kapalı
                      </>
                    )}
                  </p>
                  <p className={styles.contactLabel}>Çalışma Saatleri</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className={styles.bottomBar}>
        <div className={styles.container}>
          <div className={styles.bottomContent}>
            <p className={styles.copyright}>
              © {currentYear} {footerContent?.copyrightText || 'Luxe Fashion. Tüm hakları saklıdır.'}
            </p>
            
            <div className={styles.bottomLinks}>
              <Link href="/gizlilik-politikasi" className={styles.bottomLink}>
                Gizlilik Politikası
              </Link>
              <span className={styles.separator}>|</span>
              <Link href="/cerez-politikasi" className={styles.bottomLink}>
                Çerez Politikası
              </Link>
              <span className={styles.separator}>|</span>
              <Link href="/kullanim-kosullari" className={styles.bottomLink}>
                Kullanım Koşulları
              </Link>
            </div>

            <p className={styles.madeWith}>
              Made with <Heart size={14} className={styles.heartIcon} /> in Istanbul
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer