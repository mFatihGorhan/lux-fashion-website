'use client'

import React, { useState } from 'react'
import { Share2, Facebook, Twitter, Instagram, Link2, CheckCircle } from 'lucide-react'
import styles from './SocialShare.module.css'

interface SocialShareProps {
  url?: string
  title?: string
  description?: string
  image?: string
  variant?: 'default' | 'minimal' | 'floating'
  showLabels?: boolean
  className?: string
}

interface ShareData {
  title: string
  text: string
  url: string
}

export default function SocialShare({
  url,
  title = 'Luxe Fashion - Ulaşılabilir Lüks',
  description = 'Özgün tasarımlar, sınırlı sayıda üretim.',
  image,
  variant = 'default',
  showLabels = true,
  className = ''
}: SocialShareProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [copied, setCopied] = useState(false)
  const [hasNativeShare, setHasNativeShare] = useState(false)

  React.useEffect(() => {
    setHasNativeShare(typeof navigator !== 'undefined' && !!navigator.share)
  }, [])

  // Get current URL if not provided
  const shareUrl = url || (typeof window !== 'undefined' ? window.location.href : '')
  const encodedUrl = encodeURIComponent(shareUrl)
  const encodedTitle = encodeURIComponent(title)
  const encodedDescription = encodeURIComponent(description)

  // Native Web Share API
  const handleNativeShare = async () => {
    if (!navigator.share) {
      setIsOpen(true)
      return
    }

    const shareData: ShareData = {
      title,
      text: description,
      url: shareUrl
    }

    try {
      await navigator.share(shareData)
    } catch (error) {
      if ((error as Error).name !== 'AbortError') {
        console.error('Native share failed:', error)
        setIsOpen(true)
      }
    }
  }

  // Copy to clipboard
  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (error) {
      console.error('Copy failed:', error)
      // Fallback for older browsers
      const textArea = document.createElement('textarea')
      textArea.value = shareUrl
      document.body.appendChild(textArea)
      textArea.select()
      document.execCommand('copy')
      document.body.removeChild(textArea)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  // Social media share URLs
  const shareLinks = {
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
    twitter: `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`,
    whatsapp: `https://wa.me/?text=${encodedTitle}%20${encodedUrl}`,
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
    telegram: `https://t.me/share/url?url=${encodedUrl}&text=${encodedTitle}`,
    email: `mailto:?subject=${encodedTitle}&body=${encodedDescription}%20${encodedUrl}`
  }

  const openShareWindow = (url: string) => {
    window.open(
      url,
      'share-dialog',
      'width=600,height=400,scrollbars=no,resizable=no,menubar=no,toolbar=no,location=no'
    )
  }

  const socialButtons = [
    {
      name: 'Facebook',
      icon: Facebook,
      url: shareLinks.facebook,
      color: '#1877F2',
      bgColor: '#E3F2FD'
    },
    {
      name: 'Twitter',
      icon: Twitter,
      url: shareLinks.twitter,
      color: '#1DA1F2',
      bgColor: '#E1F5FE'
    },
    {
      name: 'WhatsApp',
      icon: Share2,
      url: shareLinks.whatsapp,
      color: '#25D366',
      bgColor: '#E8F5E8'
    },
    {
      name: 'LinkedIn',
      icon: Share2,
      url: shareLinks.linkedin,
      color: '#0077B5',
      bgColor: '#E3F2FD'
    },
    {
      name: 'E-posta',
      icon: Share2,
      url: shareLinks.email,
      color: '#666',
      bgColor: '#F5F5F5'
    }
  ]

  if (variant === 'floating') {
    return (
      <div className={`${styles.floatingShare} ${className}`}>
        <button
          className={styles.floatingButton}
          onClick={handleNativeShare}
          aria-label="Paylaş"
        >
          <Share2 size={20} />
        </button>

        {isOpen && (
          <div className={styles.floatingMenu}>
            <div className={styles.backdrop} onClick={() => setIsOpen(false)} />
            <div className={styles.menuContent}>
              <h3 className={styles.menuTitle}>Paylaş</h3>
              <div className={styles.socialGrid}>
                {socialButtons.slice(0, 4).map((social) => (
                  <button
                    key={social.name}
                    className={styles.socialButton}
                    onClick={() => openShareWindow(social.url)}
                    style={{ 
                      backgroundColor: social.bgColor,
                      color: social.color 
                    }}
                  >
                    <social.icon size={20} />
                    {showLabels && <span>{social.name}</span>}
                  </button>
                ))}
              </div>
              <button
                className={styles.copyButton}
                onClick={copyToClipboard}
              >
                {copied ? (
                  <>
                    <CheckCircle size={16} />
                    <span>Kopyalandı!</span>
                  </>
                ) : (
                  <>
                    <Link2 size={16} />
                    <span>Linki Kopyala</span>
                  </>
                )}
              </button>
            </div>
          </div>
        )}
      </div>
    )
  }

  if (variant === 'minimal') {
    return (
      <div className={`${styles.socialShare} ${styles.minimal} ${className}`}>
        <button
          className={styles.shareButton}
          onClick={handleNativeShare}
          aria-label="Paylaş"
        >
          <Share2 size={18} />
          {showLabels && <span>Paylaş</span>}
        </button>
      </div>
    )
  }

  // Default variant
  return (
    <div className={`${styles.socialShare} ${styles.default} ${className}`}>
      <div className={styles.header}>
        <Share2 size={20} />
        <h3 className={styles.title}>Paylaş</h3>
      </div>

      <div className={styles.socialGrid}>
        {socialButtons.map((social) => (
          <button
            key={social.name}
            className={styles.socialButton}
            onClick={() => openShareWindow(social.url)}
            style={{ 
              backgroundColor: social.bgColor,
              color: social.color 
            }}
            aria-label={`${social.name} ile paylaş`}
          >
            <social.icon size={20} />
            {showLabels && <span>{social.name}</span>}
          </button>
        ))}
      </div>

      <div className={styles.divider}>
        <span>veya</span>
      </div>

      <button
        className={styles.copyButton}
        onClick={copyToClipboard}
      >
        {copied ? (
          <>
            <CheckCircle size={16} />
            <span>Kopyalandı!</span>
          </>
        ) : (
          <>
            <Link2 size={16} />
            <span>Linki Kopyala</span>
          </>
        )}
      </button>

      {/* Native share fallback */}
      {hasNativeShare && (
        <button
          className={styles.nativeShareButton}
          onClick={handleNativeShare}
        >
          <Share2 size={16} />
          <span>Sistem Paylaşımı</span>
        </button>
      )}
    </div>
  )
}

// Pre-built sharing components for different contexts
export function ProductShare({ 
  productName, 
  productUrl, 
  productImage 
}: { 
  productName: string
  productUrl?: string
  productImage?: string 
}) {
  return (
    <SocialShare
      variant="minimal"
      title={`${productName} - Luxe Fashion`}
      description={`${productName} ürününü inceleyin. Luxe Fashion'da sınırlı sayıda üretilen özgün tasarımlar.`}
      url={productUrl}
      image={productImage}
      showLabels={false}
    />
  )
}

export function BlogShare({ 
  blogTitle, 
  blogUrl, 
  blogExcerpt 
}: { 
  blogTitle: string
  blogUrl?: string
  blogExcerpt?: string 
}) {
  return (
    <SocialShare
      variant="default"
      title={`${blogTitle} - Luxe Fashion Blog`}
      description={blogExcerpt || 'Moda dünyasından haberler ve stil önerileri'}
      url={blogUrl}
    />
  )
}

export function FloatingShare() {
  return <SocialShare variant="floating" showLabels={false} />
}