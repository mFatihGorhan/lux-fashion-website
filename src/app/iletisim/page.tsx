'use client'

import React, { useState } from 'react'
import { 
  Phone, 
  Mail, 
  MapPin, 
  Clock,
  Instagram,
  Send,
  CheckCircle,
  MessageSquare,
  Building2,
  User,
  AlertCircle
} from 'lucide-react'
import PageErrorBoundary from '@/components/PageErrorBoundary'
import styles from './contact.module.css'

interface FormData {
  name: string
  email: string
  phone: string
  subject: string
  message: string
}

function ContactContent() {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  })
  
  const [errors, setErrors] = useState<Partial<FormData>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)

  const validateForm = (): boolean => {
    const newErrors: Partial<FormData> = {}
    
    if (!formData.name.trim()) {
      newErrors.name = 'İsim alanı zorunludur'
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'E-posta alanı zorunludur'
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Geçerli bir e-posta adresi giriniz'
    }
    
    if (!formData.phone.trim()) {
      newErrors.phone = 'Telefon alanı zorunludur'
    } else if (!/^[0-9\s\-\+\(\)]+$/.test(formData.phone)) {
      newErrors.phone = 'Geçerli bir telefon numarası giriniz'
    }
    
    if (!formData.subject.trim()) {
      newErrors.subject = 'Konu alanı zorunludur'
    }
    
    if (!formData.message.trim()) {
      newErrors.message = 'Mesaj alanı zorunludur'
    } else if (formData.message.length < 10) {
      newErrors.message = 'Mesaj en az 10 karakter olmalıdır'
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) {
      return
    }
    
    setIsSubmitting(true)
    setErrors({})
    
    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      const result = await response.json()

      if (response.ok) {
        setIsSubmitted(true)
        setFormData({
          name: '',
          email: '',
          phone: '',
          subject: '',
          message: ''
        })
        
        // 5 saniye sonra başarı mesajını kaldır
        setTimeout(() => {
          setIsSubmitted(false)
        }, 5000)
      } else {
        // Handle validation errors from server
        if (result.details) {
          const serverErrors: Partial<FormData> = {}
          result.details.forEach((detail: any) => {
            serverErrors[detail.field as keyof FormData] = detail.message
          })
          setErrors(serverErrors)
        } else {
          alert(`Hata: ${result.error}`)
        }
      }
    } catch (error) {
      console.error('Form submission error:', error)
      alert('Form gönderilirken bir hata oluştu. Lütfen tekrar deneyin.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    
    // Hata varsa temizle
    if (errors[name as keyof FormData]) {
      setErrors(prev => ({ ...prev, [name]: '' }))
    }
  }

  return (
    <main className={styles.main}>
      {/* Page Header */}
      <section className={styles.pageHeader}>
        <div className={styles.headerContent}>
          <h1 className={styles.title}>İletişim</h1>
          <p className={styles.subtitle}>
            Size en iyi hizmeti sunabilmek için buradayız
          </p>
        </div>
      </section>

      {/* Contact Info Cards */}
      <section className={styles.contactInfo}>
        <div className={styles.container}>
          <div className={styles.infoGrid}>
            <div className={styles.infoCard}>
              <div className={styles.iconWrapper}>
                <Phone size={24} />
              </div>
              <h3 className={styles.infoTitle}>Telefon</h3>
              <p className={styles.infoText}>Hafta içi 09:00 - 18:00</p>
              <a href="tel:+905555555555" className={styles.infoLink}>
                +90 555 555 55 55
              </a>
            </div>

            <div className={styles.infoCard}>
              <div className={styles.iconWrapper}>
                <Mail size={24} />
              </div>
              <h3 className={styles.infoTitle}>E-posta</h3>
              <p className={styles.infoText}>7/24 destek</p>
              <a href="mailto:info@luxefashion.com" className={styles.infoLink}>
                info@luxefashion.com
              </a>
            </div>

            <div className={styles.infoCard}>
              <div className={styles.iconWrapper}>
                <MapPin size={24} />
              </div>
              <h3 className={styles.infoTitle}>Showroom</h3>
              <p className={styles.infoText}>Randevu ile ziyaret</p>
              <address className={styles.address}>
                Nişantaşı, Abdi İpekçi Cad. No:23<br />
                Şişli, İstanbul
              </address>
            </div>

            <div className={styles.infoCard}>
              <div className={styles.iconWrapper}>
                <Clock size={24} />
              </div>
              <h3 className={styles.infoTitle}>Çalışma Saatleri</h3>
              <p className={styles.infoText}>Showroom ziyareti için</p>
              <div className={styles.hours}>
                <p>Pazartesi - Cumartesi: 10:00 - 19:00</p>
                <p>Pazar: Kapalı</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Form Section */}
      <section className={styles.contactForm}>
        <div className={styles.container}>
          <div className={styles.formGrid}>
            {/* Form */}
            <div className={styles.formWrapper}>
              <div className={styles.formHeader}>
                <h2 className={styles.formTitle}>Bize Ulaşın</h2>
                <p className={styles.formSubtitle}>
                  Sorularınız, önerileriniz veya özel tasarım talepleriniz için 
                  formu doldurabilir veya doğrudan bizi arayabilirsiniz.
                </p>
              </div>

              {isSubmitted && (
                <div className={styles.successMessage}>
                  <CheckCircle size={20} />
                  <span>Mesajınız başarıyla gönderildi! En kısa sürede size dönüş yapacağız.</span>
                </div>
              )}

              <form onSubmit={handleSubmit} className={styles.form}>
                <div className={styles.formRow}>
                  <div className={styles.formGroup}>
                    <label htmlFor="name" className={styles.label}>
                      <User size={16} />
                      Ad Soyad
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      className={`${styles.input} ${errors.name ? styles.error : ''}`}
                      placeholder="Adınız Soyadınız"
                    />
                    {errors.name && (
                      <span className={styles.errorMessage}>
                        <AlertCircle size={14} />
                        {errors.name}
                      </span>
                    )}
                  </div>

                  <div className={styles.formGroup}>
                    <label htmlFor="email" className={styles.label}>
                      <Mail size={16} />
                      E-posta
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className={`${styles.input} ${errors.email ? styles.error : ''}`}
                      placeholder="ornek@email.com"
                    />
                    {errors.email && (
                      <span className={styles.errorMessage}>
                        <AlertCircle size={14} />
                        {errors.email}
                      </span>
                    )}
                  </div>
                </div>

                <div className={styles.formRow}>
                  <div className={styles.formGroup}>
                    <label htmlFor="phone" className={styles.label}>
                      <Phone size={16} />
                      Telefon
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className={`${styles.input} ${errors.phone ? styles.error : ''}`}
                      placeholder="05XX XXX XX XX"
                    />
                    {errors.phone && (
                      <span className={styles.errorMessage}>
                        <AlertCircle size={14} />
                        {errors.phone}
                      </span>
                    )}
                  </div>

                  <div className={styles.formGroup}>
                    <label htmlFor="subject" className={styles.label}>
                      <MessageSquare size={16} />
                      Konu
                    </label>
                    <select
                      id="subject"
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      className={`${styles.input} ${errors.subject ? styles.error : ''}`}
                    >
                      <option value="">Konu Seçiniz</option>
                      <option value="genel">Genel Bilgi</option>
                      <option value="toptan">Toptan Satış</option>
                      <option value="ozel-tasarim">Özel Tasarım</option>
                      <option value="isbirligi">İşbirliği Teklifi</option>
                      <option value="diger">Diğer</option>
                    </select>
                    {errors.subject && (
                      <span className={styles.errorMessage}>
                        <AlertCircle size={14} />
                        {errors.subject}
                      </span>
                    )}
                  </div>
                </div>

                <div className={styles.formGroup}>
                  <label htmlFor="message" className={styles.label}>
                    <MessageSquare size={16} />
                    Mesajınız
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    rows={6}
                    className={`${styles.textarea} ${errors.message ? styles.error : ''}`}
                    placeholder="Mesajınızı buraya yazabilirsiniz..."
                  />
                  {errors.message && (
                    <span className={styles.errorMessage}>
                      <AlertCircle size={14} />
                      {errors.message}
                    </span>
                  )}
                </div>

                <button
                  type="submit"
                  className={styles.submitButton}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <span className={styles.spinner}></span>
                      <span>Gönderiliyor...</span>
                    </>
                  ) : (
                    <>
                      <Send size={18} />
                      <span>Mesajı Gönder</span>
                    </>
                  )}
                </button>
              </form>
            </div>

            {/* Map & Additional Info */}
            <div className={styles.mapSection}>
              <div className={styles.mapContainer}>
                <div className={styles.mapPlaceholder}>
                  <MapPin size={48} />
                  <h3>Harita</h3>
                  <p>Google Maps entegrasyonu için bu alan kullanılacak</p>
                </div>
              </div>

              <div className={styles.additionalInfo}>
                <h3 className={styles.additionalTitle}>
                  <Building2 size={20} />
                  Showroom Ziyareti
                </h3>
                <p className={styles.additionalText}>
                  Koleksiyonlarımızı yakından görmek ve kumaş kalitesini 
                  hissetmek için showroomumuzu ziyaret edebilirsiniz. 
                  Randevu almak için bizi arayın.
                </p>

                <div className={styles.socialLinks}>
                  <h4>Sosyal Medyada Biz</h4>
                  <div className={styles.socialButtons}>
                    <a 
                      href="https://instagram.com" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className={styles.socialButton}
                      aria-label="Instagram"
                    >
                      <Instagram size={20} />
                      <span>@luxefashion</span>
                    </a>
                    <a 
                      href="https://pinterest.com" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className={styles.socialButton}
                      aria-label="Pinterest"
                    >
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                        <circle cx="12" cy="12" r="10"></circle>
                        <path d="M8 12a4 4 0 1 0 4.5 3.969V9.5a.5.5 0 0 1 .5-.5h1"></path>
                      </svg>
                      <span>Luxe Fashion</span>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className={styles.faq}>
        <div className={styles.container}>
          <h2 className={styles.faqTitle}>Sıkça Sorulan Sorular</h2>
          
          <div className={styles.faqGrid}>
            <div className={styles.faqItem}>
              <h3 className={styles.faqQuestion}>Toptan satış yapıyor musunuz?</h3>
              <p className={styles.faqAnswer}>
                Evet, butikler ve mağazalar için özel toptan satış koşullarımız 
                bulunmaktadır. Detaylı bilgi için bizimle iletişime geçebilirsiniz.
              </p>
            </div>

            <div className={styles.faqItem}>
              <h3 className={styles.faqQuestion}>Özel tasarım yapıyor musunuz?</h3>
              <p className={styles.faqAnswer}>
                Müşterilerimizin özel isteklerine göre tasarım ve üretim 
                yapabiliyoruz. Minimum sipariş adedi ve detaylar için bizi arayın.
              </p>
            </div>

            <div className={styles.faqItem}>
              <h3 className={styles.faqQuestion}>Ürünleri nereden satın alabilirim?</h3>
              <p className={styles.faqAnswer}>
                Ürünlerimizi showroomumuzdan veya anlaşmalı butiklerimizden 
                satın alabilirsiniz. Online satış için çalışmalarımız devam ediyor.
              </p>
            </div>

            <div className={styles.faqItem}>
              <h3 className={styles.faqQuestion}>Beden değişimi yapıyor musunuz?</h3>
              <p className={styles.faqAnswer}>
                Ürünlerimizde beden değişimi imkanı sunuyoruz. Detaylı bilgi 
                için satış noktası ile iletişime geçebilirsiniz.
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}

export default function ContactPage() {
  return (
    <PageErrorBoundary pageName="İletişim sayfası" showContactInfo={false}>
      <ContactContent />
    </PageErrorBoundary>
  )
}