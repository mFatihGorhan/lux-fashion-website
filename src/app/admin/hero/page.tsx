'use client'

import { useState, useEffect } from 'react'
import { Plus, Edit, Trash2, Eye, EyeOff, Search, Palette, Link, Image as ImageIcon } from 'lucide-react'

interface HeroSlide {
  id: string
  title: string
  subtitle: string
  description: string
  imageUrl: string
  imageAlt?: string
  gradient: string
  ctaText: string
  ctaLink: string
  secondaryCtaText?: string
  secondaryCtaLink?: string
  order: number
  isActive: boolean
  createdAt: string
  updatedAt: string
}

interface HeroSlideFormData {
  title: string
  subtitle: string
  description: string
  imageUrl: string
  imageAlt: string
  gradient: string
  ctaText: string
  ctaLink: string
  secondaryCtaText: string
  secondaryCtaLink: string
  order: number
  isActive: boolean
}

interface HeroSlideFormErrors {
  title?: string
  subtitle?: string
  description?: string
  imageUrl?: string
  imageAlt?: string
  gradient?: string
  ctaText?: string
  ctaLink?: string
  secondaryCtaText?: string
  secondaryCtaLink?: string
  order?: string
  isActive?: string
}

const predefinedGradients = [
  'linear-gradient(135deg, #1A1A1A 0%, #3A3A3A 100%)',
  'linear-gradient(135deg, #2C1810 0%, #8B6B47 100%)',
  'linear-gradient(135deg, #1F1C18 0%, #8B7355 100%)',
  'linear-gradient(135deg, #0F1419 0%, #2D3748 100%)',
  'linear-gradient(135deg, #1A202C 0%, #2D3748 100%)',
  'linear-gradient(135deg, #2D1B69 0%, #4C1D95 100%)',
]

export default function HeroPage() {
  const [heroSlides, setHeroSlides] = useState<HeroSlide[]>([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editingSlide, setEditingSlide] = useState<HeroSlide | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [formData, setFormData] = useState<HeroSlideFormData>({
    title: '',
    subtitle: '',
    description: '',
    imageUrl: '',
    imageAlt: '',
    gradient: predefinedGradients[0],
    ctaText: '',
    ctaLink: '',
    secondaryCtaText: '',
    secondaryCtaLink: '',
    order: 0,
    isActive: true
  })
  const [formErrors, setFormErrors] = useState<HeroSlideFormErrors>({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    fetchHeroSlides()
  }, [])

  const fetchHeroSlides = async () => {
    try {
      const response = await fetch('/api/admin/hero')
      if (response.ok) {
        const data = await response.json()
        setHeroSlides(data)
      }
    } catch (error) {
      console.error('Failed to fetch hero slides:', error)
    } finally {
      setLoading(false)
    }
  }

  const validateForm = (): boolean => {
    const errors: HeroSlideFormErrors = {}
    
    if (!formData.title.trim()) {
      errors.title = 'Başlık gereklidir'
    }
    
    if (!formData.subtitle.trim()) {
      errors.subtitle = 'Alt başlık gereklidir'
    }
    
    if (!formData.description.trim()) {
      errors.description = 'Açıklama gereklidir'
    }
    
    if (!formData.imageUrl.trim()) {
      errors.imageUrl = 'Resim URL\'si gereklidir'
    } else {
      try {
        new URL(formData.imageUrl)
      } catch {
        errors.imageUrl = 'Geçerli bir URL giriniz'
      }
    }
    
    if (!formData.gradient.trim()) {
      errors.gradient = 'Gradient gereklidir'
    }
    
    if (!formData.ctaText.trim()) {
      errors.ctaText = 'Ana buton metni gereklidir'
    }
    
    if (!formData.ctaLink.trim()) {
      errors.ctaLink = 'Ana buton linki gereklidir'
    }
    
    if (formData.order < 0) {
      errors.order = 'Sıra numarası 0 veya pozitif olmalıdır'
    }

    setFormErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) return
    
    setIsSubmitting(true)
    
    try {
      const url = editingSlide 
        ? `/api/admin/hero/${editingSlide.id}`
        : '/api/admin/hero'
      
      const method = editingSlide ? 'PUT' : 'POST'
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        await fetchHeroSlides()
        resetForm()
        setShowModal(false)
      } else {
        const errorData = await response.json()
        alert(`Hata: ${errorData.error}`)
      }
    } catch (error) {
      console.error('Failed to save hero slide:', error)
      alert('Hero slide kaydedilirken hata oluştu')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleEdit = (slide: HeroSlide) => {
    setEditingSlide(slide)
    setFormData({
      title: slide.title,
      subtitle: slide.subtitle,
      description: slide.description,
      imageUrl: slide.imageUrl,
      imageAlt: slide.imageAlt || '',
      gradient: slide.gradient,
      ctaText: slide.ctaText,
      ctaLink: slide.ctaLink,
      secondaryCtaText: slide.secondaryCtaText || '',
      secondaryCtaLink: slide.secondaryCtaLink || '',
      order: slide.order,
      isActive: slide.isActive
    })
    setShowModal(true)
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Bu hero slide\'ı silmek istediğinizden emin misiniz?')) return

    try {
      const response = await fetch(`/api/admin/hero/${id}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        await fetchHeroSlides()
      } else {
        const errorData = await response.json()
        alert(`Hata: ${errorData.error}`)
      }
    } catch (error) {
      console.error('Failed to delete hero slide:', error)
      alert('Hero slide silinirken hata oluştu')
    }
  }

  const resetForm = () => {
    setFormData({
      title: '',
      subtitle: '',
      description: '',
      imageUrl: '',
      imageAlt: '',
      gradient: predefinedGradients[0],
      ctaText: '',
      ctaLink: '',
      secondaryCtaText: '',
      secondaryCtaLink: '',
      order: 0,
      isActive: true
    })
    setFormErrors({})
    setEditingSlide(null)
  }

  const filteredSlides = heroSlides.filter(slide =>
    slide.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    slide.subtitle.toLowerCase().includes(searchTerm.toLowerCase())
  )

  if (loading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '200px',
        color: 'white'
      }}>
        <div>Hero slider yükleniyor...</div>
      </div>
    )
  }

  return (
    <div style={{ padding: '2rem', color: 'white' }}>
      {/* Header */}
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        marginBottom: '2rem' 
      }}>
        <div>
          <h1 style={{ fontSize: '2rem', fontWeight: 'bold', margin: 0 }}>
            Hero Slider Yönetimi
          </h1>
          <p style={{ color: '#9CA3AF', margin: '0.5rem 0 0 0' }}>
            Ana sayfa slider içeriklerini yönetin
          </p>
        </div>
        
        <button
          onClick={() => {
            resetForm()
            setShowModal(true)
          }}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            backgroundColor: '#3B82F6',
            color: 'white',
            padding: '0.75rem 1.5rem',
            borderRadius: '0.5rem',
            border: 'none',
            cursor: 'pointer',
            fontWeight: '500'
          }}
        >
          <Plus size={20} />
          Yeni Slide
        </button>
      </div>

      {/* Search */}
      <div style={{ marginBottom: '1.5rem' }}>
        <div style={{ position: 'relative', maxWidth: '300px' }}>
          <Search 
            size={20} 
            style={{ 
              position: 'absolute', 
              left: '0.75rem', 
              top: '50%', 
              transform: 'translateY(-50%)', 
              color: '#9CA3AF' 
            }} 
          />
          <input
            type="text"
            placeholder="Slide ara..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              width: '100%',
              padding: '0.75rem 0.75rem 0.75rem 2.5rem',
              backgroundColor: '#374151',
              border: '1px solid #4B5563',
              borderRadius: '0.5rem',
              color: 'white',
              outline: 'none'
            }}
          />
        </div>
      </div>

      {/* Hero Slides Cards */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
        gap: '1.5rem'
      }}>
        {filteredSlides.map((slide) => (
          <div
            key={slide.id}
            style={{
              backgroundColor: '#1F2937',
              borderRadius: '0.75rem',
              overflow: 'hidden',
              border: '1px solid #374151'
            }}
          >
            {/* Slide Preview */}
            <div 
              style={{
                height: '200px',
                background: slide.gradient,
                position: 'relative',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '1rem'
              }}
            >
              <div style={{ textAlign: 'center', color: 'white' }}>
                <p style={{ 
                  fontSize: '0.875rem', 
                  opacity: 0.9, 
                  margin: '0 0 0.5rem 0' 
                }}>
                  {slide.subtitle}
                </p>
                <h3 style={{ 
                  fontSize: '1.25rem', 
                  fontWeight: 'bold', 
                  margin: '0 0 0.5rem 0' 
                }}>
                  {slide.title}
                </h3>
                <p style={{ 
                  fontSize: '0.875rem', 
                  opacity: 0.8, 
                  margin: '0 0 1rem 0' 
                }}>
                  {slide.description.length > 80 
                    ? slide.description.substring(0, 80) + '...' 
                    : slide.description
                  }
                </p>
                <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center' }}>
                  <span style={{
                    fontSize: '0.75rem',
                    padding: '0.25rem 0.75rem',
                    backgroundColor: 'rgba(255,255,255,0.2)',
                    borderRadius: '1rem'
                  }}>
                    {slide.ctaText}
                  </span>
                  {slide.secondaryCtaText && (
                    <span style={{
                      fontSize: '0.75rem',
                      padding: '0.25rem 0.75rem',
                      backgroundColor: 'rgba(255,255,255,0.1)',
                      borderRadius: '1rem'
                    }}>
                      {slide.secondaryCtaText}
                    </span>
                  )}
                </div>
              </div>
              
              {/* Status Badge */}
              <div style={{
                position: 'absolute',
                top: '0.75rem',
                right: '0.75rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.25rem',
                padding: '0.25rem 0.5rem',
                borderRadius: '0.375rem',
                fontSize: '0.75rem',
                fontWeight: '500',
                backgroundColor: slide.isActive ? '#10B981' : '#EF4444',
                color: 'white'
              }}>
                {slide.isActive ? <Eye size={12} /> : <EyeOff size={12} />}
                {slide.isActive ? 'Aktif' : 'Pasif'}
              </div>

              {/* Order Badge */}
              <div style={{
                position: 'absolute',
                top: '0.75rem',
                left: '0.75rem',
                padding: '0.25rem 0.5rem',
                borderRadius: '0.375rem',
                fontSize: '0.75rem',
                fontWeight: '500',
                backgroundColor: 'rgba(0,0,0,0.5)',
                color: 'white'
              }}>
                Sıra: {slide.order}
              </div>
            </div>

            {/* Slide Info */}
            <div style={{ padding: '1rem' }}>
              <div style={{ marginBottom: '0.75rem' }}>
                <h4 style={{ 
                  fontWeight: '600', 
                  margin: '0 0 0.25rem 0',
                  color: 'white'
                }}>
                  {slide.title}
                </h4>
                <p style={{ 
                  fontSize: '0.875rem', 
                  color: '#9CA3AF', 
                  margin: 0 
                }}>
                  {slide.subtitle}
                </p>
              </div>

              {/* Links */}
              <div style={{ marginBottom: '1rem' }}>
                <div style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '0.25rem',
                  fontSize: '0.75rem',
                  color: '#9CA3AF',
                  marginBottom: '0.25rem'
                }}>
                  <Link size={12} />
                  <span>Ana: {slide.ctaLink}</span>
                </div>
                {slide.secondaryCtaLink && (
                  <div style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: '0.25rem',
                    fontSize: '0.75rem',
                    color: '#9CA3AF'
                  }}>
                    <Link size={12} />
                    <span>İkinci: {slide.secondaryCtaLink}</span>
                  </div>
                )}
              </div>

              {/* Actions */}
              <div style={{ 
                display: 'flex', 
                gap: '0.5rem', 
                justifyContent: 'end' 
              }}>
                <button
                  onClick={() => handleEdit(slide)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '2rem',
                    height: '2rem',
                    backgroundColor: '#F59E0B',
                    border: 'none',
                    borderRadius: '0.375rem',
                    cursor: 'pointer',
                    color: 'white'
                  }}
                  title="Düzenle"
                >
                  <Edit size={16} />
                </button>
                <button
                  onClick={() => handleDelete(slide.id)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '2rem',
                    height: '2rem',
                    backgroundColor: '#EF4444',
                    border: 'none',
                    borderRadius: '0.375rem',
                    cursor: 'pointer',
                    color: 'white'
                  }}
                  title="Sil"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredSlides.length === 0 && (
        <div style={{ 
          padding: '3rem', 
          textAlign: 'center', 
          color: '#9CA3AF',
          backgroundColor: '#1F2937',
          borderRadius: '0.75rem',
          border: '1px solid #374151'
        }}>
          Hero slide bulunamadı
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.75)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 50,
          padding: '1rem'
        }}>
          <div style={{
            backgroundColor: '#1F2937',
            borderRadius: '0.75rem',
            padding: '2rem',
            width: '100%',
            maxWidth: '600px',
            maxHeight: '90vh',
            overflow: 'auto',
            border: '1px solid #374151'
          }}>
            <h2 style={{ 
              fontSize: '1.5rem', 
              fontWeight: 'bold', 
              marginBottom: '1.5rem',
              color: 'white'
            }}>
              {editingSlide ? 'Hero Slide Düzenle' : 'Yeni Hero Slide'}
            </h2>

            <form onSubmit={handleSubmit}>
              {/* Title & Subtitle */}
              <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
                <div style={{ flex: 1 }}>
                  <label style={{ 
                    display: 'block', 
                    marginBottom: '0.5rem', 
                    fontWeight: '500',
                    color: 'white'
                  }}>
                    Başlık *
                  </label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({...formData, title: e.target.value})}
                    style={{
                      width: '100%',
                      padding: '0.75rem',
                      backgroundColor: '#374151',
                      border: formErrors.title ? '1px solid #EF4444' : '1px solid #4B5563',
                      borderRadius: '0.5rem',
                      color: 'white',
                      outline: 'none'
                    }}
                    placeholder="Örn: Yeni Sezon"
                  />
                  {formErrors.title && (
                    <p style={{ color: '#EF4444', fontSize: '0.875rem', marginTop: '0.25rem' }}>
                      {formErrors.title}
                    </p>
                  )}
                </div>

                <div style={{ flex: 1 }}>
                  <label style={{ 
                    display: 'block', 
                    marginBottom: '0.5rem', 
                    fontWeight: '500',
                    color: 'white'
                  }}>
                    Alt Başlık *
                  </label>
                  <input
                    type="text"
                    value={formData.subtitle}
                    onChange={(e) => setFormData({...formData, subtitle: e.target.value})}
                    style={{
                      width: '100%',
                      padding: '0.75rem',
                      backgroundColor: '#374151',
                      border: formErrors.subtitle ? '1px solid #EF4444' : '1px solid #4B5563',
                      borderRadius: '0.5rem',
                      color: 'white',
                      outline: 'none'
                    }}
                    placeholder="Örn: Kapsül Koleksiyon"
                  />
                  {formErrors.subtitle && (
                    <p style={{ color: '#EF4444', fontSize: '0.875rem', marginTop: '0.25rem' }}>
                      {formErrors.subtitle}
                    </p>
                  )}
                </div>
              </div>

              {/* Description */}
              <div style={{ marginBottom: '1rem' }}>
                <label style={{ 
                  display: 'block', 
                  marginBottom: '0.5rem', 
                  fontWeight: '500',
                  color: 'white'
                }}>
                  Açıklama *
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  rows={3}
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    backgroundColor: '#374151',
                    border: formErrors.description ? '1px solid #EF4444' : '1px solid #4B5563',
                    borderRadius: '0.5rem',
                    color: 'white',
                    outline: 'none',
                    resize: 'vertical'
                  }}
                  placeholder="Slide açıklaması..."
                />
                {formErrors.description && (
                  <p style={{ color: '#EF4444', fontSize: '0.875rem', marginTop: '0.25rem' }}>
                    {formErrors.description}
                  </p>
                )}
              </div>

              {/* Image URL & Alt */}
              <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
                <div style={{ flex: 2 }}>
                  <label style={{ 
                    display: 'block', 
                    marginBottom: '0.5rem', 
                    fontWeight: '500',
                    color: 'white'
                  }}>
                    Resim URL *
                  </label>
                  <input
                    type="url"
                    value={formData.imageUrl}
                    onChange={(e) => setFormData({...formData, imageUrl: e.target.value})}
                    style={{
                      width: '100%',
                      padding: '0.75rem',
                      backgroundColor: '#374151',
                      border: formErrors.imageUrl ? '1px solid #EF4444' : '1px solid #4B5563',
                      borderRadius: '0.5rem',
                      color: 'white',
                      outline: 'none'
                    }}
                    placeholder="https://example.com/image.jpg"
                  />
                  {formErrors.imageUrl && (
                    <p style={{ color: '#EF4444', fontSize: '0.875rem', marginTop: '0.25rem' }}>
                      {formErrors.imageUrl}
                    </p>
                  )}
                </div>

                <div style={{ flex: 1 }}>
                  <label style={{ 
                    display: 'block', 
                    marginBottom: '0.5rem', 
                    fontWeight: '500',
                    color: 'white'
                  }}>
                    Alt Text
                  </label>
                  <input
                    type="text"
                    value={formData.imageAlt}
                    onChange={(e) => setFormData({...formData, imageAlt: e.target.value})}
                    style={{
                      width: '100%',
                      padding: '0.75rem',
                      backgroundColor: '#374151',
                      border: '1px solid #4B5563',
                      borderRadius: '0.5rem',
                      color: 'white',
                      outline: 'none'
                    }}
                    placeholder="Resim açıklaması"
                  />
                </div>
              </div>

              {/* Gradient Selection */}
              <div style={{ marginBottom: '1rem' }}>
                <label style={{ 
                  display: 'block', 
                  marginBottom: '0.5rem', 
                  fontWeight: '500',
                  color: 'white'
                }}>
                  Gradient *
                </label>
                <div style={{ 
                  display: 'grid', 
                  gridTemplateColumns: 'repeat(3, 1fr)', 
                  gap: '0.5rem',
                  marginBottom: '0.5rem'
                }}>
                  {predefinedGradients.map((gradient, index) => (
                    <button
                      key={index}
                      type="button"
                      onClick={() => setFormData({...formData, gradient})}
                      style={{
                        height: '3rem',
                        background: gradient,
                        border: formData.gradient === gradient ? '2px solid #3B82F6' : '1px solid #4B5563',
                        borderRadius: '0.5rem',
                        cursor: 'pointer'
                      }}
                      title={`Gradient ${index + 1}`}
                    />
                  ))}
                </div>
                <input
                  type="text"
                  value={formData.gradient}
                  onChange={(e) => setFormData({...formData, gradient: e.target.value})}
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    backgroundColor: '#374151',
                    border: formErrors.gradient ? '1px solid #EF4444' : '1px solid #4B5563',
                    borderRadius: '0.5rem',
                    color: 'white',
                    outline: 'none',
                    fontFamily: 'monospace',
                    fontSize: '0.875rem'
                  }}
                  placeholder="linear-gradient(135deg, #1A1A1A 0%, #3A3A3A 100%)"
                />
                {formErrors.gradient && (
                  <p style={{ color: '#EF4444', fontSize: '0.875rem', marginTop: '0.25rem' }}>
                    {formErrors.gradient}
                  </p>
                )}
              </div>

              {/* CTA Buttons */}
              <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
                <div style={{ flex: 1 }}>
                  <label style={{ 
                    display: 'block', 
                    marginBottom: '0.5rem', 
                    fontWeight: '500',
                    color: 'white'
                  }}>
                    Ana Buton Metni *
                  </label>
                  <input
                    type="text"
                    value={formData.ctaText}
                    onChange={(e) => setFormData({...formData, ctaText: e.target.value})}
                    style={{
                      width: '100%',
                      padding: '0.75rem',
                      backgroundColor: '#374151',
                      border: formErrors.ctaText ? '1px solid #EF4444' : '1px solid #4B5563',
                      borderRadius: '0.5rem',
                      color: 'white',
                      outline: 'none'
                    }}
                    placeholder="Koleksiyonu Keşfet"
                  />
                  {formErrors.ctaText && (
                    <p style={{ color: '#EF4444', fontSize: '0.875rem', marginTop: '0.25rem' }}>
                      {formErrors.ctaText}
                    </p>
                  )}
                </div>

                <div style={{ flex: 1 }}>
                  <label style={{ 
                    display: 'block', 
                    marginBottom: '0.5rem', 
                    fontWeight: '500',
                    color: 'white'
                  }}>
                    Ana Buton Linki *
                  </label>
                  <input
                    type="text"
                    value={formData.ctaLink}
                    onChange={(e) => setFormData({...formData, ctaLink: e.target.value})}
                    style={{
                      width: '100%',
                      padding: '0.75rem',
                      backgroundColor: '#374151',
                      border: formErrors.ctaLink ? '1px solid #EF4444' : '1px solid #4B5563',
                      borderRadius: '0.5rem',
                      color: 'white',
                      outline: 'none'
                    }}
                    placeholder="/koleksiyonlar"
                  />
                  {formErrors.ctaLink && (
                    <p style={{ color: '#EF4444', fontSize: '0.875rem', marginTop: '0.25rem' }}>
                      {formErrors.ctaLink}
                    </p>
                  )}
                </div>
              </div>

              {/* Secondary CTA */}
              <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
                <div style={{ flex: 1 }}>
                  <label style={{ 
                    display: 'block', 
                    marginBottom: '0.5rem', 
                    fontWeight: '500',
                    color: 'white'
                  }}>
                    İkinci Buton Metni
                  </label>
                  <input
                    type="text"
                    value={formData.secondaryCtaText}
                    onChange={(e) => setFormData({...formData, secondaryCtaText: e.target.value})}
                    style={{
                      width: '100%',
                      padding: '0.75rem',
                      backgroundColor: '#374151',
                      border: '1px solid #4B5563',
                      borderRadius: '0.5rem',
                      color: 'white',
                      outline: 'none'
                    }}
                    placeholder="Tüm Koleksiyonlar"
                  />
                </div>

                <div style={{ flex: 1 }}>
                  <label style={{ 
                    display: 'block', 
                    marginBottom: '0.5rem', 
                    fontWeight: '500',
                    color: 'white'
                  }}>
                    İkinci Buton Linki
                  </label>
                  <input
                    type="text"
                    value={formData.secondaryCtaLink}
                    onChange={(e) => setFormData({...formData, secondaryCtaLink: e.target.value})}
                    style={{
                      width: '100%',
                      padding: '0.75rem',
                      backgroundColor: '#374151',
                      border: '1px solid #4B5563',
                      borderRadius: '0.5rem',
                      color: 'white',
                      outline: 'none'
                    }}
                    placeholder="/koleksiyonlar"
                  />
                </div>
              </div>

              {/* Order & Active */}
              <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
                <div style={{ flex: 1 }}>
                  <label style={{ 
                    display: 'block', 
                    marginBottom: '0.5rem', 
                    fontWeight: '500',
                    color: 'white'
                  }}>
                    Sıra
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={formData.order}
                    onChange={(e) => setFormData({...formData, order: parseInt(e.target.value) || 0})}
                    style={{
                      width: '100%',
                      padding: '0.75rem',
                      backgroundColor: '#374151',
                      border: formErrors.order ? '1px solid #EF4444' : '1px solid #4B5563',
                      borderRadius: '0.5rem',
                      color: 'white',
                      outline: 'none'
                    }}
                  />
                  {formErrors.order && (
                    <p style={{ color: '#EF4444', fontSize: '0.875rem', marginTop: '0.25rem' }}>
                      {formErrors.order}
                    </p>
                  )}
                </div>

                <div style={{ display: 'flex', alignItems: 'end' }}>
                  <label style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: '0.5rem',
                    color: 'white',
                    cursor: 'pointer'
                  }}>
                    <input
                      type="checkbox"
                      checked={formData.isActive}
                      onChange={(e) => setFormData({...formData, isActive: e.target.checked})}
                      style={{ width: '1rem', height: '1rem' }}
                    />
                    Aktif
                  </label>
                </div>
              </div>

              <div style={{ 
                display: 'flex', 
                gap: '1rem', 
                justifyContent: 'end',
                marginTop: '2rem'
              }}>
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  style={{
                    padding: '0.75rem 1.5rem',
                    backgroundColor: '#6B7280',
                    border: 'none',
                    borderRadius: '0.5rem',
                    color: 'white',
                    cursor: 'pointer',
                    fontWeight: '500'
                  }}
                >
                  İptal
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  style={{
                    padding: '0.75rem 1.5rem',
                    backgroundColor: isSubmitting ? '#6B7280' : '#3B82F6',
                    border: 'none',
                    borderRadius: '0.5rem',
                    color: 'white',
                    cursor: isSubmitting ? 'not-allowed' : 'pointer',
                    fontWeight: '500'
                  }}
                >
                  {isSubmitting ? 'Kaydediliyor...' : (editingSlide ? 'Güncelle' : 'Kaydet')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}