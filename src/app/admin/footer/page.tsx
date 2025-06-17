'use client'

import { useState, useEffect } from 'react'
import { Save, Mail, Phone, MapPin, Clock, Instagram, Globe, Linkedin } from 'lucide-react'
import styles from '@/styles/admin/admin.module.css'

interface FooterContent {
  id: string
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

export default function AdminFooterPage() {
  const [footerContent, setFooterContent] = useState<FooterContent | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState('')

  useEffect(() => {
    fetchFooterContent()
  }, [])

  const fetchFooterContent = async () => {
    try {
      const response = await fetch('/api/admin/footer')
      if (response.ok) {
        const data = await response.json()
        setFooterContent(data)
      }
    } catch (error) {
      console.error('Error fetching footer content:', error)
      setMessage('Footer içeriği yüklenirken hata oluştu')
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!footerContent) return

    setSaving(true)
    setMessage('')

    try {
      const response = await fetch('/api/admin/footer', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(footerContent),
      })

      if (response.ok) {
        setMessage('Footer içeriği başarıyla güncellendi!')
        setTimeout(() => setMessage(''), 3000)
      } else {
        const error = await response.json()
        setMessage(`Hata: ${error.error}`)
      }
    } catch (error) {
      console.error('Error updating footer:', error)
      setMessage('Güncelleme sırasında hata oluştu')
    } finally {
      setSaving(false)
    }
  }

  const handleInputChange = (field: keyof FooterContent, value: string) => {
    if (!footerContent) return
    setFooterContent({
      ...footerContent,
      [field]: value
    })
  }

  if (loading) {
    return (
      <div className={styles.page}>
        <div className={styles.loadingSpinner}>Yükleniyor...</div>
      </div>
    )
  }

  if (!footerContent) {
    return (
      <div className={styles.page}>
        <div className={styles.error}>Footer içeriği bulunamadı</div>
      </div>
    )
  }

  return (
    <div className={styles.page}>
      <div className={styles.pageHeader}>
        <h1 className={styles.pageTitle}>Footer Yönetimi</h1>
        <p className={styles.pageDescription}>
          Website footer bölümündeki bilgileri düzenleyin
        </p>
      </div>

      {message && (
        <div className={`${styles.alert} ${message.includes('Hata') ? styles.alertError : styles.alertSuccess}`}>
          {message}
        </div>
      )}

      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.grid2}>
          {/* Brand Bilgileri */}
          <div className={styles.card}>
            <h3 className={styles.cardTitle}>
              <Globe size={20} />
              Marka Bilgileri
            </h3>
            
            <div className={styles.formGroup}>
              <label className={styles.label}>
                Marka Başlığı
              </label>
              <input
                type="text"
                value={footerContent.brandTitle}
                onChange={(e) => handleInputChange('brandTitle', e.target.value)}
                className={styles.input}
                required
              />
            </div>

            <div className={styles.formGroup}>
              <label className={styles.label}>
                Marka Açıklaması
              </label>
              <textarea
                value={footerContent.brandDescription}
                onChange={(e) => handleInputChange('brandDescription', e.target.value)}
                className={styles.textarea}
                rows={4}
                required
              />
            </div>

            <div className={styles.formGroup}>
              <label className={styles.label}>
                Copyright Metni
              </label>
              <input
                type="text"
                value={footerContent.copyrightText}
                onChange={(e) => handleInputChange('copyrightText', e.target.value)}
                className={styles.input}
                required
              />
            </div>
          </div>

          {/* İletişim Bilgileri */}
          <div className={styles.card}>
            <h3 className={styles.cardTitle}>
              <Phone size={20} />
              İletişim Bilgileri
            </h3>
            
            <div className={styles.formGroup}>
              <label className={styles.label}>
                <Phone size={16} />
                Telefon
              </label>
              <input
                type="tel"
                value={footerContent.phone}
                onChange={(e) => handleInputChange('phone', e.target.value)}
                className={styles.input}
                required
              />
            </div>

            <div className={styles.formGroup}>
              <label className={styles.label}>
                <Mail size={16} />
                E-posta
              </label>
              <input
                type="email"
                value={footerContent.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                className={styles.input}
                required
              />
            </div>

            <div className={styles.formGroup}>
              <label className={styles.label}>
                <MapPin size={16} />
                Adres
              </label>
              <textarea
                value={footerContent.address}
                onChange={(e) => handleInputChange('address', e.target.value)}
                className={styles.textarea}
                rows={3}
                required
              />
            </div>

            <div className={styles.formGroup}>
              <label className={styles.label}>
                <Clock size={16} />
                Çalışma Saatleri
              </label>
              <textarea
                value={footerContent.workingHours}
                onChange={(e) => handleInputChange('workingHours', e.target.value)}
                className={styles.textarea}
                rows={2}
                required
              />
            </div>
          </div>
        </div>

        {/* Sosyal Medya */}
        <div className={styles.card}>
          <h3 className={styles.cardTitle}>
            <Instagram size={20} />
            Sosyal Medya Bağlantıları
          </h3>
          
          <div className={styles.grid3}>
            <div className={styles.formGroup}>
              <label className={styles.label}>
                <Instagram size={16} />
                Instagram URL
              </label>
              <input
                type="url"
                value={footerContent.instagramUrl || ''}
                onChange={(e) => handleInputChange('instagramUrl', e.target.value)}
                className={styles.input}
                placeholder="https://instagram.com/username"
              />
            </div>

            <div className={styles.formGroup}>
              <label className={styles.label}>
                <Globe size={16} />
                Pinterest URL
              </label>
              <input
                type="url"
                value={footerContent.pinterestUrl || ''}
                onChange={(e) => handleInputChange('pinterestUrl', e.target.value)}
                className={styles.input}
                placeholder="https://pinterest.com/username"
              />
            </div>

            <div className={styles.formGroup}>
              <label className={styles.label}>
                <Linkedin size={16} />
                LinkedIn URL
              </label>
              <input
                type="url"
                value={footerContent.linkedinUrl || ''}
                onChange={(e) => handleInputChange('linkedinUrl', e.target.value)}
                className={styles.input}
                placeholder="https://linkedin.com/company/username"
              />
            </div>
          </div>
        </div>

        <div className={styles.formActions}>
          <button
            type="submit"
            disabled={saving}
            className={`${styles.btn} ${styles.btnPrimary}`}
          >
            <Save size={16} />
            {saving ? 'Kaydediliyor...' : 'Değişiklikleri Kaydet'}
          </button>
        </div>
      </form>
    </div>
  )
}