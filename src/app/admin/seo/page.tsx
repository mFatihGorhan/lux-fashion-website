'use client'

import { useState, useEffect } from 'react'
import { Save, Search, Globe, FileText, Image, Eye, AlertCircle, Check } from 'lucide-react'

interface SeoMeta {
  id?: string
  page: string
  title: string
  description: string
  keywords: string
  ogTitle: string
  ogDescription: string
  ogImage: string
  canonical: string
}

const predefinedPages = [
  { key: 'home', label: 'Ana Sayfa', path: '/' },
  { key: 'about', label: 'Hakkımızda', path: '/hakkimizda' },
  { key: 'contact', label: 'İletişim', path: '/iletisim' },
  { key: 'collections', label: 'Koleksiyonlar', path: '/koleksiyonlar' },
  { key: 'blog', label: 'Blog', path: '/blog' },
]

export default function SeoPage() {
  const [seoData, setSeoData] = useState<Record<string, SeoMeta>>({})
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState<string | null>(null)
  const [selectedPage, setSelectedPage] = useState('home')
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [successMessage, setSuccessMessage] = useState<string | null>(null)

  useEffect(() => {
    fetchSeoData()
  }, [])

  const fetchSeoData = async () => {
    try {
      const response = await fetch('/api/admin/seo')
      if (response.ok) {
        const data = await response.json()
        const seoMap: Record<string, SeoMeta> = {}
        
        // Create map from existing data
        data.forEach((item: SeoMeta) => {
          seoMap[item.page] = item
        })
        
        // Add default values for pages that don't exist
        predefinedPages.forEach(page => {
          if (!seoMap[page.key]) {
            seoMap[page.key] = {
              page: page.key,
              title: 'Luxe Fashion',
              description: 'Özgün tasarımlar, sınırlı sayıda üretim',
              keywords: '',
              ogTitle: '',
              ogDescription: '',
              ogImage: '',
              canonical: ''
            }
          }
        })
        
        setSeoData(seoMap)
      }
    } catch (error) {
      console.error('Failed to fetch SEO data:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (field: keyof SeoMeta, value: string) => {
    setSeoData(prev => ({
      ...prev,
      [selectedPage]: {
        ...prev[selectedPage],
        [field]: value
      }
    }))
    
    // Clear errors
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }))
    }
  }

  const validateForm = (data: SeoMeta): boolean => {
    const newErrors: Record<string, string> = {}
    
    if (!data.title.trim()) {
      newErrors.title = 'Title gereklidir'
    } else if (data.title.length > 60) {
      newErrors.title = 'Title 60 karakterden az olmalıdır'
    }
    
    if (!data.description.trim()) {
      newErrors.description = 'Description gereklidir'
    } else if (data.description.length > 160) {
      newErrors.description = 'Description 160 karakterden az olmalıdır'
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSave = async () => {
    const currentData = seoData[selectedPage]
    if (!currentData || !validateForm(currentData)) return

    setSaving(selectedPage)
    setErrors({})

    try {
      const response = await fetch('/api/admin/seo', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(currentData),
      })

      if (response.ok) {
        const updatedData = await response.json()
        setSeoData(prev => ({
          ...prev,
          [selectedPage]: updatedData
        }))
        setSuccessMessage('SEO ayarları başarıyla kaydedildi')
        setTimeout(() => setSuccessMessage(null), 3000)
      } else {
        const error = await response.json()
        if (error.details) {
          const newErrors: Record<string, string> = {}
          error.details.forEach((detail: any) => {
            newErrors[detail.path[0]] = detail.message
          })
          setErrors(newErrors)
        } else {
          alert(`Hata: ${error.error}`)
        }
      }
    } catch (error) {
      console.error('Save error:', error)
      alert('Kaydetme sırasında hata oluştu')
    } finally {
      setSaving(null)
    }
  }

  const currentPageData = seoData[selectedPage] || {
    page: selectedPage,
    title: '',
    description: '',
    keywords: '',
    ogTitle: '',
    ogDescription: '',
    ogImage: '',
    canonical: ''
  }

  const currentPageInfo = predefinedPages.find(p => p.key === selectedPage)

  if (loading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '200px',
        color: 'white'
      }}>
        <div>SEO ayarları yükleniyor...</div>
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
            SEO Yönetimi
          </h1>
          <p style={{ color: '#9CA3AF', margin: '0.5rem 0 0 0' }}>
            Sayfa meta etiketlerini ve SEO ayarlarını yönetin
          </p>
        </div>
      </div>

      {successMessage && (
        <div style={{
          backgroundColor: '#10B981',
          color: 'white',
          padding: '1rem',
          borderRadius: '0.5rem',
          marginBottom: '1.5rem',
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem'
        }}>
          <Check size={16} />
          {successMessage}
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: '300px 1fr', gap: '2rem' }}>
        {/* Page Selector */}
        <div>
          <h2 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '1rem' }}>
            Sayfalar
          </h2>
          <div style={{ backgroundColor: '#1F2937', borderRadius: '0.75rem', overflow: 'hidden' }}>
            {predefinedPages.map((page) => (
              <button
                key={page.key}
                onClick={() => setSelectedPage(page.key)}
                style={{
                  width: '100%',
                  textAlign: 'left',
                  padding: '1rem',
                  border: 'none',
                  backgroundColor: selectedPage === page.key ? '#3B82F6' : 'transparent',
                  color: 'white',
                  cursor: 'pointer',
                  borderBottom: '1px solid #374151',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem'
                }}
              >
                <Globe size={16} />
                <div>
                  <div style={{ fontWeight: '500' }}>{page.label}</div>
                  <div style={{ fontSize: '0.75rem', color: '#9CA3AF' }}>{page.path}</div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* SEO Form */}
        <div style={{ backgroundColor: '#1F2937', borderRadius: '0.75rem', padding: '2rem' }}>
          <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center',
            marginBottom: '2rem'
          }}>
            <h2 style={{ fontSize: '1.5rem', fontWeight: '600', margin: 0 }}>
              {currentPageInfo?.label} - SEO Ayarları
            </h2>
            <button
              onClick={handleSave}
              disabled={saving === selectedPage}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.75rem 1rem',
                backgroundColor: saving === selectedPage ? '#6B7280' : '#10B981',
                border: 'none',
                borderRadius: '0.5rem',
                color: 'white',
                cursor: saving === selectedPage ? 'not-allowed' : 'pointer',
                fontWeight: '500'
              }}
            >
              <Save size={16} />
              {saving === selectedPage ? 'Kaydediliyor...' : 'Kaydet'}
            </button>
          </div>

          <div style={{ display: 'grid', gap: '1.5rem' }}>
            {/* Basic Meta Tags */}
            <div>
              <h3 style={{ fontSize: '1.125rem', fontWeight: '600', marginBottom: '1rem', color: '#F3F4F6' }}>
                Temel Meta Etiketler
              </h3>
              
              <div style={{ display: 'grid', gap: '1rem' }}>
                <div>
                  <label style={{ 
                    display: 'block', 
                    fontSize: '0.875rem', 
                    fontWeight: '500', 
                    marginBottom: '0.5rem',
                    color: '#D1D5DB'
                  }}>
                    Title Tag ({currentPageData.title.length}/60)
                  </label>
                  <input
                    type="text"
                    value={currentPageData.title}
                    onChange={(e) => handleInputChange('title', e.target.value)}
                    style={{
                      width: '100%',
                      padding: '0.75rem',
                      backgroundColor: '#374151',
                      border: `1px solid ${errors.title ? '#EF4444' : '#4B5563'}`,
                      borderRadius: '0.5rem',
                      color: 'white',
                      fontSize: '0.875rem'
                    }}
                    placeholder="Sayfa başlığı (max 60 karakter)"
                    maxLength={60}
                  />
                  {errors.title && (
                    <span style={{ color: '#EF4444', fontSize: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.25rem', marginTop: '0.25rem' }}>
                      <AlertCircle size={12} />
                      {errors.title}
                    </span>
                  )}
                </div>

                <div>
                  <label style={{ 
                    display: 'block', 
                    fontSize: '0.875rem', 
                    fontWeight: '500', 
                    marginBottom: '0.5rem',
                    color: '#D1D5DB'
                  }}>
                    Meta Description ({currentPageData.description.length}/160)
                  </label>
                  <textarea
                    value={currentPageData.description}
                    onChange={(e) => handleInputChange('description', e.target.value)}
                    rows={3}
                    style={{
                      width: '100%',
                      padding: '0.75rem',
                      backgroundColor: '#374151',
                      border: `1px solid ${errors.description ? '#EF4444' : '#4B5563'}`,
                      borderRadius: '0.5rem',
                      color: 'white',
                      fontSize: '0.875rem',
                      resize: 'vertical'
                    }}
                    placeholder="Sayfa açıklaması (max 160 karakter)"
                    maxLength={160}
                  />
                  {errors.description && (
                    <span style={{ color: '#EF4444', fontSize: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.25rem', marginTop: '0.25rem' }}>
                      <AlertCircle size={12} />
                      {errors.description}
                    </span>
                  )}
                </div>

                <div>
                  <label style={{ 
                    display: 'block', 
                    fontSize: '0.875rem', 
                    fontWeight: '500', 
                    marginBottom: '0.5rem',
                    color: '#D1D5DB'
                  }}>
                    Keywords (virgülle ayırın)
                  </label>
                  <input
                    type="text"
                    value={currentPageData.keywords}
                    onChange={(e) => handleInputChange('keywords', e.target.value)}
                    style={{
                      width: '100%',
                      padding: '0.75rem',
                      backgroundColor: '#374151',
                      border: '1px solid #4B5563',
                      borderRadius: '0.5rem',
                      color: 'white',
                      fontSize: '0.875rem'
                    }}
                    placeholder="moda, lüks, tasarım, giyim"
                  />
                </div>
              </div>
            </div>

            {/* Open Graph */}
            <div>
              <h3 style={{ fontSize: '1.125rem', fontWeight: '600', marginBottom: '1rem', color: '#F3F4F6' }}>
                Open Graph (Sosyal Medya)
              </h3>
              
              <div style={{ display: 'grid', gap: '1rem' }}>
                <div>
                  <label style={{ 
                    display: 'block', 
                    fontSize: '0.875rem', 
                    fontWeight: '500', 
                    marginBottom: '0.5rem',
                    color: '#D1D5DB'
                  }}>
                    OG Title
                  </label>
                  <input
                    type="text"
                    value={currentPageData.ogTitle}
                    onChange={(e) => handleInputChange('ogTitle', e.target.value)}
                    style={{
                      width: '100%',
                      padding: '0.75rem',
                      backgroundColor: '#374151',
                      border: '1px solid #4B5563',
                      borderRadius: '0.5rem',
                      color: 'white',
                      fontSize: '0.875rem'
                    }}
                    placeholder="Sosyal medyada görünecek başlık (boş bırakılırsa Title kullanılır)"
                  />
                </div>

                <div>
                  <label style={{ 
                    display: 'block', 
                    fontSize: '0.875rem', 
                    fontWeight: '500', 
                    marginBottom: '0.5rem',
                    color: '#D1D5DB'
                  }}>
                    OG Description
                  </label>
                  <textarea
                    value={currentPageData.ogDescription}
                    onChange={(e) => handleInputChange('ogDescription', e.target.value)}
                    rows={2}
                    style={{
                      width: '100%',
                      padding: '0.75rem',
                      backgroundColor: '#374151',
                      border: '1px solid #4B5563',
                      borderRadius: '0.5rem',
                      color: 'white',
                      fontSize: '0.875rem',
                      resize: 'vertical'
                    }}
                    placeholder="Sosyal medyada görünecek açıklama (boş bırakılırsa Description kullanılır)"
                  />
                </div>

                <div>
                  <label style={{ 
                    display: 'block', 
                    fontSize: '0.875rem', 
                    fontWeight: '500', 
                    marginBottom: '0.5rem',
                    color: '#D1D5DB'
                  }}>
                    OG Image URL
                  </label>
                  <input
                    type="url"
                    value={currentPageData.ogImage}
                    onChange={(e) => handleInputChange('ogImage', e.target.value)}
                    style={{
                      width: '100%',
                      padding: '0.75rem',
                      backgroundColor: '#374151',
                      border: '1px solid #4B5563',
                      borderRadius: '0.5rem',
                      color: 'white',
                      fontSize: '0.875rem'
                    }}
                    placeholder="https://example.com/image.jpg"
                  />
                </div>
              </div>
            </div>

            {/* Technical SEO */}
            <div>
              <h3 style={{ fontSize: '1.125rem', fontWeight: '600', marginBottom: '1rem', color: '#F3F4F6' }}>
                Teknik SEO
              </h3>
              
              <div>
                <label style={{ 
                  display: 'block', 
                  fontSize: '0.875rem', 
                  fontWeight: '500', 
                  marginBottom: '0.5rem',
                  color: '#D1D5DB'
                }}>
                  Canonical URL
                </label>
                <input
                  type="url"
                  value={currentPageData.canonical}
                  onChange={(e) => handleInputChange('canonical', e.target.value)}
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    backgroundColor: '#374151',
                    border: '1px solid #4B5563',
                    borderRadius: '0.5rem',
                    color: 'white',
                    fontSize: '0.875rem'
                  }}
                  placeholder="https://luxefashion.com/path"
                />
                <p style={{ fontSize: '0.75rem', color: '#9CA3AF', margin: '0.5rem 0 0 0' }}>
                  Boş bırakılırsa otomatik olarak sayfa URL'si kullanılır
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}