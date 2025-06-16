'use client'

import React, { useState } from 'react'
import { MessageCircle, X } from 'lucide-react'
import styles from './WhatsAppButton.module.css'

interface WhatsAppButtonProps {
  phoneNumber?: string
  message?: string
  position?: 'bottom-right' | 'bottom-left'
  showText?: boolean
}

const WhatsAppButton: React.FC<WhatsAppButtonProps> = ({
  phoneNumber = '905555555555',
  message = 'Merhaba! Web sitenizden yazıyorum.',
  position = 'bottom-right',
  showText = true
}) => {
  const [isHovered, setIsHovered] = useState(false)
  const [showTooltip, setShowTooltip] = useState(false)

  const handleWhatsAppClick = () => {
    const encodedMessage = encodeURIComponent(message)
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodedMessage}`
    window.open(whatsappUrl, '_blank')
  }

  return (
    <>
      <div 
        className={`${styles.whatsappButton} ${styles[position]} ${
          isHovered ? styles.hovered : ''
        }`}
        onClick={handleWhatsAppClick}
        onMouseEnter={() => {
          setIsHovered(true)
          setShowTooltip(true)
        }}
        onMouseLeave={() => {
          setIsHovered(false)
          setTimeout(() => setShowTooltip(false), 200)
        }}
        role="button"
        tabIndex={0}
        aria-label="WhatsApp ile iletişime geç"
      >
        <div className={styles.iconContainer}>
          <MessageCircle size={24} className={styles.icon} />
        </div>
        
        {showText && (
          <span className={styles.text}>Teklif Al</span>
        )}
        
        {/* Pulse Animation */}
        <div className={styles.pulse}></div>
        <div className={styles.pulse2}></div>
      </div>

      {/* Tooltip */}
      {showTooltip && (
        <div className={`${styles.tooltip} ${styles[position]}`}>
          <div className={styles.tooltipContent}>
            <div className={styles.tooltipHeader}>
              <div className={styles.avatar}>
                👋
              </div>
              <div className={styles.userInfo}>
                <h4>Müşteri Hizmetleri</h4>
                <span className={styles.status}>
                  <span className={styles.onlineIndicator}></span>
                  Çevrimiçi
                </span>
              </div>
            </div>
            <p>Merhaba! Size nasıl yardımcı olabilirim?</p>
            <div className={styles.quickActions}>
              <button className={styles.quickAction}>💎 Ürün Bilgisi</button>
              <button className={styles.quickAction}>📏 Beden Tablosu</button>
              <button className={styles.quickAction}>🚚 Kargo Bilgisi</button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default WhatsAppButton
