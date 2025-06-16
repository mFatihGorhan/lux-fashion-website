'use client'

import { useState, useEffect } from 'react'
import { Save, RefreshCw, Phone, Mail, MapPin, MessageCircle, Globe, Clock } from 'lucide-react'

interface Setting {
  id: string
  value: any
  type: 'TEXT' | 'NUMBER' | 'BOOLEAN' | 'JSON' | 'HTML'
  description?: string
  updatedAt: string
}

interface SettingsData {
  // İletişim Bilgileri
  site_title: Setting
  site_description: Setting
  contact_phone: Setting
  contact_email: Setting
  contact_address: Setting
  whatsapp_number: Setting
  working_hours: Setting
  
  // Sosyal Medya
  instagram_url: Setting
  facebook_url: Setting
  twitter_url: Setting
  
  // Site Ayarları
  maintenance_mode: Setting
  google_analytics_id: Setting
}

const defaultSettings = {
  site_title: { value: 'Lux Fashion', type: 'TEXT' as const, description: 'Site başlığı' },
  site_description: { value: 'Ulaşılabilir Lüks Moda', type: 'TEXT' as const, description: 'Site açıklaması' },
  contact_phone: { value: '+90 555 555 55 55', type: 'TEXT' as const, description: 'İletişim telefonu' },
  contact_email: { value: 'info@luxfashion.com', type: 'TEXT' as const, description: 'İletişim email' },
  contact_address: { value: 'İstanbul, Türkiye', type: 'TEXT' as const, description: 'Adres bilgisi' },
  whatsapp_number: { value: '905555555555', type: 'TEXT' as const, description: 'WhatsApp numarası (90 ile başlayın)' },
  working_hours: { value: 'Hafta içi 09:00 - 18:00', type: 'TEXT' as const, description: 'Çalışma saatleri' },
  
  instagram_url: { value: '', type: 'TEXT' as const, description: 'Instagram profil linki' },
  facebook_url: { value: '', type: 'TEXT' as const, description: 'Facebook sayfa linki' },
  twitter_url: { value: '', type: 'TEXT' as const, description: 'Twitter profil linki' },
  
  maintenance_mode: { value: false, type: 'BOOLEAN' as const, description: 'Bakım modu' },
  google_analytics_id: { value: '', type: 'TEXT' as const, description: 'Google Analytics ID' },
}

export default function SettingsPage() {
  const [settings, setSettings] = useState<Partial<SettingsData>>({})
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [lastSaved, setLastSaved] = useState<Date | null>(null)

  useEffect(() => {
    fetchSettings()
  }, [])

  const fetchSettings = async () => {
    try {
      const response = await fetch('/api/admin/settings')
      if (response.ok) {
        const data = await response.json()
        setSettings({ ...defaultSettings, ...data })
      }
    } catch (error) {
      console.error('Failed to fetch settings:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSettingChange = (key: string, value: any) => {
    setSettings(prev => ({
      ...prev,
      [key]: {
        ...(prev[key as keyof SettingsData] || {}),
        value
      }
    }))
  }

  const handleSave = async () => {
    setSaving(true)
    
    try {
      const settingsArray = Object.entries(settings).map(([key, setting]) => ({
        key,
        value: setting?.value,
        type: setting?.type || 'TEXT',
        description: setting?.description
      }))

      const response = await fetch('/api/admin/settings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(settingsArray),
      })

      if (response.ok) {
        setLastSaved(new Date())
        alert('Ayarlar başarıyla kaydedildi!')
      } else {
        const errorData = await response.json()
        alert(`Hata: ${errorData.error}`)
      }
    } catch (error) {
      console.error('Failed to save settings:', error)
      alert('Ayarlar kaydedilirken hata oluştu')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '200px',
        color: 'white'
      }}>
        <div>Ayarlar yükleniyor...</div>
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
            Site Ayarları
          </h1>
          <p style={{ color: '#9CA3AF', margin: '0.5rem 0 0 0' }}>
            Site genelinde kullanılacak ayarları düzenleyin
          </p>
          {lastSaved && (
            <p style={{ color: '#10B981', fontSize: '0.875rem', margin: '0.25rem 0 0 0' }}>
              Son kaydedilen: {lastSaved.toLocaleTimeString('tr-TR')}
            </p>
          )}
        </div>
        
        <button
          onClick={handleSave}
          disabled={saving}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            backgroundColor: saving ? '#6B7280' : '#10B981',
            color: 'white',
            padding: '0.75rem 1.5rem',
            borderRadius: '0.5rem',
            border: 'none',
            cursor: saving ? 'not-allowed' : 'pointer',
            fontWeight: '500'
          }}
        >
          {saving ? <RefreshCw size={20} /> : <Save size={20} />}
          {saving ? 'Kaydediliyor...' : 'Kaydet'}
        </button>
      </div>

      {/* Settings Sections */}
      <div style={{ display: 'grid', gap: '2rem' }}>
        {/* Site Bilgileri */}
        <div style={{
          backgroundColor: '#1F2937',
          borderRadius: '0.75rem',
          padding: '1.5rem',
          border: '1px solid #374151'
        }}>
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '0.5rem', 
            marginBottom: '1.5rem' 
          }}>
            <Globe size={24} style={{ color: '#3B82F6' }} />
            <h2 style={{ fontSize: '1.25rem', fontWeight: '600', margin: 0 }}>
              Site Bilgileri
            </h2>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1rem' }}>
            <div>
              <label style={{ 
                display: 'block', 
                marginBottom: '0.5rem', 
                fontWeight: '500',
                color: 'white'
              }}>
                Site Başlığı
              </label>
              <input
                type="text"
                value={settings.site_title?.value || ''}
                onChange={(e) => handleSettingChange('site_title', e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  backgroundColor: '#374151',
                  border: '1px solid #4B5563',
                  borderRadius: '0.5rem',
                  color: 'white',
                  outline: 'none'
                }}
                placeholder="Lux Fashion"
              />
            </div>

            <div>
              <label style={{ 
                display: 'block', 
                marginBottom: '0.5rem', 
                fontWeight: '500',
                color: 'white'
              }}>
                Site Açıklaması
              </label>
              <input
                type="text"
                value={settings.site_description?.value || ''}
                onChange={(e) => handleSettingChange('site_description', e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  backgroundColor: '#374151',
                  border: '1px solid #4B5563',
                  borderRadius: '0.5rem',
                  color: 'white',
                  outline: 'none'
                }}
                placeholder="Ulaşılabilir Lüks Moda"
              />
            </div>
          </div>
        </div>

        {/* İletişim Bilgileri */}
        <div style={{
          backgroundColor: '#1F2937',
          borderRadius: '0.75rem',
          padding: '1.5rem',
          border: '1px solid #374151'
        }}>
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '0.5rem', 
            marginBottom: '1.5rem' 
          }}>
            <Phone size={24} style={{ color: '#10B981' }} />
            <h2 style={{ fontSize: '1.25rem', fontWeight: '600', margin: 0 }}>
              İletişim Bilgileri
            </h2>
          </div>

          <div style={{ display: 'grid', gap: '1rem' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1rem' }}>
              <div>
                <label style={{ 
                  display: 'block', 
                  marginBottom: '0.5rem', 
                  fontWeight: '500',
                  color: 'white'
                }}>
                  Telefon Numarası
                </label>
                <input
                  type="tel"
                  value={settings.contact_phone?.value || ''}
                  onChange={(e) => handleSettingChange('contact_phone', e.target.value)}
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    backgroundColor: '#374151',
                    border: '1px solid #4B5563',
                    borderRadius: '0.5rem',
                    color: 'white',
                    outline: 'none'
                  }}
                  placeholder="+90 555 555 55 55"
                />
              </div>

              <div>
                <label style={{ 
                  display: 'block', 
                  marginBottom: '0.5rem', 
                  fontWeight: '500',
                  color: 'white'
                }}>
                  Email Adresi
                </label>
                <input
                  type="email"
                  value={settings.contact_email?.value || ''}
                  onChange={(e) => handleSettingChange('contact_email', e.target.value)}
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    backgroundColor: '#374151',
                    border: '1px solid #4B5563',
                    borderRadius: '0.5rem',
                    color: 'white',
                    outline: 'none'
                  }}
                  placeholder="info@luxfashion.com"
                />
              </div>
            </div>

            <div>
              <label style={{ 
                display: 'block', 
                marginBottom: '0.5rem', 
                fontWeight: '500',
                color: 'white'
              }}>
                Adres
              </label>
              <input
                type="text"
                value={settings.contact_address?.value || ''}
                onChange={(e) => handleSettingChange('contact_address', e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  backgroundColor: '#374151',
                  border: '1px solid #4B5563',
                  borderRadius: '0.5rem',
                  color: 'white',
                  outline: 'none'
                }}
                placeholder="İstanbul, Türkiye"
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1rem' }}>
              <div>
                <label style={{ 
                  display: 'block', 
                  marginBottom: '0.5rem', 
                  fontWeight: '500',
                  color: 'white'
                }}>
                  WhatsApp Numarası
                </label>
                <input
                  type="text"
                  value={settings.whatsapp_number?.value || ''}
                  onChange={(e) => handleSettingChange('whatsapp_number', e.target.value)}
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    backgroundColor: '#374151',
                    border: '1px solid #4B5563',
                    borderRadius: '0.5rem',
                    color: 'white',
                    outline: 'none'
                  }}
                  placeholder="905555555555"
                />
                <p style={{ fontSize: '0.75rem', color: '#9CA3AF', margin: '0.25rem 0 0 0' }}>
                  Ülke kodu ile birlikte, boşluk ve + işareti olmadan (örn: 905551234567)
                </p>
              </div>

              <div>
                <label style={{ 
                  display: 'block', 
                  marginBottom: '0.5rem', 
                  fontWeight: '500',
                  color: 'white'
                }}>
                  Çalışma Saatleri
                </label>
                <input
                  type="text"
                  value={settings.working_hours?.value || ''}
                  onChange={(e) => handleSettingChange('working_hours', e.target.value)}
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    backgroundColor: '#374151',
                    border: '1px solid #4B5563',
                    borderRadius: '0.5rem',
                    color: 'white',
                    outline: 'none'
                  }}
                  placeholder="Hafta içi 09:00 - 18:00"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Sosyal Medya */}
        <div style={{
          backgroundColor: '#1F2937',
          borderRadius: '0.75rem',
          padding: '1.5rem',
          border: '1px solid #374151'
        }}>
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '0.5rem', 
            marginBottom: '1.5rem' 
          }}>
            <MessageCircle size={24} style={{ color: '#F59E0B' }} />
            <h2 style={{ fontSize: '1.25rem', fontWeight: '600', margin: 0 }}>
              Sosyal Medya
            </h2>
          </div>

          <div style={{ display: 'grid', gap: '1rem' }}>
            <div>
              <label style={{ 
                display: 'block', 
                marginBottom: '0.5rem', 
                fontWeight: '500',
                color: 'white'
              }}>
                Instagram URL
              </label>
              <input
                type="url"
                value={settings.instagram_url?.value || ''}
                onChange={(e) => handleSettingChange('instagram_url', e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  backgroundColor: '#374151',
                  border: '1px solid #4B5563',
                  borderRadius: '0.5rem',
                  color: 'white',
                  outline: 'none'
                }}
                placeholder="https://instagram.com/luxfashion"
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1rem' }}>
              <div>
                <label style={{ 
                  display: 'block', 
                  marginBottom: '0.5rem', 
                  fontWeight: '500',
                  color: 'white'
                }}>
                  Facebook URL
                </label>
                <input
                  type="url"
                  value={settings.facebook_url?.value || ''}
                  onChange={(e) => handleSettingChange('facebook_url', e.target.value)}
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    backgroundColor: '#374151',
                    border: '1px solid #4B5563',
                    borderRadius: '0.5rem',
                    color: 'white',
                    outline: 'none'
                  }}
                  placeholder="https://facebook.com/luxfashion"
                />
              </div>

              <div>
                <label style={{ 
                  display: 'block', 
                  marginBottom: '0.5rem', 
                  fontWeight: '500',
                  color: 'white'
                }}>
                  Twitter URL
                </label>
                <input
                  type="url"
                  value={settings.twitter_url?.value || ''}
                  onChange={(e) => handleSettingChange('twitter_url', e.target.value)}
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    backgroundColor: '#374151',
                    border: '1px solid #4B5563',
                    borderRadius: '0.5rem',
                    color: 'white',
                    outline: 'none'
                  }}
                  placeholder="https://twitter.com/luxfashion"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Sistem Ayarları */}
        <div style={{
          backgroundColor: '#1F2937',
          borderRadius: '0.75rem',
          padding: '1.5rem',
          border: '1px solid #374151'
        }}>
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '0.5rem', 
            marginBottom: '1.5rem' 
          }}>
            <RefreshCw size={24} style={{ color: '#8B5CF6' }} />
            <h2 style={{ fontSize: '1.25rem', fontWeight: '600', margin: 0 }}>
              Sistem Ayarları
            </h2>
          </div>

          <div style={{ display: 'grid', gap: '1rem' }}>
            <div>
              <label style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: '0.5rem',
                color: 'white',
                cursor: 'pointer'
              }}>
                <input
                  type="checkbox"
                  checked={settings.maintenance_mode?.value || false}
                  onChange={(e) => handleSettingChange('maintenance_mode', e.target.checked)}
                  style={{ width: '1rem', height: '1rem' }}
                />
                Bakım Modu
              </label>
              <p style={{ fontSize: '0.75rem', color: '#9CA3AF', margin: '0.25rem 0 0 1.5rem' }}>
                Aktif olduğunda site ziyaretçilere bakım sayfası gösterilir
              </p>
            </div>

            <div>
              <label style={{ 
                display: 'block', 
                marginBottom: '0.5rem', 
                fontWeight: '500',
                color: 'white'
              }}>
                Google Analytics ID
              </label>
              <input
                type="text"
                value={settings.google_analytics_id?.value || ''}
                onChange={(e) => handleSettingChange('google_analytics_id', e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  backgroundColor: '#374151',
                  border: '1px solid #4B5563',
                  borderRadius: '0.5rem',
                  color: 'white',
                  outline: 'none'
                }}
                placeholder="G-XXXXXXXXXX"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}