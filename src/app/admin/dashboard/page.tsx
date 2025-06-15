'use client'

import { useAuth } from '@/lib/auth/hooks'
import { signOut } from 'next-auth/react'

export default function AdminDashboard() {
  const { user } = useAuth()

  const handleLogout = () => {
    signOut({ callbackUrl: '/' })
  }

  return (
    <div style={{ 
      padding: '2rem',
      color: 'white',
      maxWidth: '1200px',
      margin: '0 auto'
    }}>
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        marginBottom: '2rem',
        paddingBottom: '1rem',
        borderBottom: '1px solid #374151'
      }}>
        <div>
          <h1 style={{ 
            fontSize: '2rem', 
            fontWeight: 'bold',
            margin: 0,
            fontFamily: 'var(--font-playfair)'
          }}>
            Admin Dashboard
          </h1>
          <p style={{ 
            color: '#9CA3AF',
            margin: '0.5rem 0 0 0'
          }}>
            Ho_ geldiniz, {user?.name}
          </p>
        </div>
        
        <button
          onClick={handleLogout}
          style={{
            padding: '0.5rem 1rem',
            background: '#374151',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            fontSize: '0.875rem'
          }}
        >
          Ç1k1_ Yap
        </button>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
        gap: '1.5rem',
        marginBottom: '2rem'
      }}>
        <div style={{
          background: '#374151',
          padding: '1.5rem',
          borderRadius: '12px'
        }}>
          <h3 style={{ margin: '0 0 1rem 0', fontSize: '1.125rem' }}>
            Ürün Yönetimi
          </h3>
          <p style={{ color: '#9CA3AF', margin: '0 0 1rem 0', fontSize: '0.875rem' }}>
            Ürünleri görüntüle, düzenle ve yeni ürün ekle
          </p>
          <a 
            href="/admin/products"
            style={{
              color: '#60A5FA',
              textDecoration: 'none',
              fontSize: '0.875rem'
            }}
          >
            Ürünleri Yönet ’
          </a>
        </div>

        <div style={{
          background: '#374151',
          padding: '1.5rem',
          borderRadius: '12px'
        }}>
          <h3 style={{ margin: '0 0 1rem 0', fontSize: '1.125rem' }}>
            Blog Yönetimi
          </h3>
          <p style={{ color: '#9CA3AF', margin: '0 0 1rem 0', fontSize: '0.875rem' }}>
            Blog yaz1lar1n1 yönet, yeni içerik ekle
          </p>
          <a 
            href="/admin/blog"
            style={{
              color: '#60A5FA',
              textDecoration: 'none',
              fontSize: '0.875rem'
            }}
          >
            Blog Yönet ’
          </a>
        </div>

        <div style={{
          background: '#374151',
          padding: '1.5rem',
          borderRadius: '12px'
        }}>
          <h3 style={{ margin: '0 0 1rem 0', fontSize: '1.125rem' }}>
            Medya Kütüphanesi
          </h3>
          <p style={{ color: '#9CA3AF', margin: '0 0 1rem 0', fontSize: '0.875rem' }}>
            Görselleri yükle ve yönet
          </p>
          <a 
            href="/admin/media"
            style={{
              color: '#60A5FA',
              textDecoration: 'none',
              fontSize: '0.875rem'
            }}
          >
            Medya Yönet ’
          </a>
        </div>

        <div style={{
          background: '#374151',
          padding: '1.5rem',
          borderRadius: '12px'
        }}>
          <h3 style={{ margin: '0 0 1rem 0', fontSize: '1.125rem' }}>
            Site Ayarlar1
          </h3>
          <p style={{ color: '#9CA3AF', margin: '0 0 1rem 0', fontSize: '0.875rem' }}>
            Genel site ayarlar1n1 düzenle
          </p>
          <a 
            href="/admin/settings"
            style={{
              color: '#60A5FA',
              textDecoration: 'none',
              fontSize: '0.875rem'
            }}
          >
            Ayarlar ’
          </a>
        </div>
      </div>

      <div style={{
        background: '#374151',
        padding: '1.5rem',
        borderRadius: '12px'
      }}>
        <h3 style={{ margin: '0 0 1rem 0', fontSize: '1.125rem' }}>
          Kullan1c1 Bilgileri
        </h3>
        <div style={{ color: '#9CA3AF', fontSize: '0.875rem' }}>
          <p><strong>Email:</strong> {user?.email}</p>
          <p><strong>0sim:</strong> {user?.name}</p>
          <p><strong>Rol:</strong> {user?.role}</p>
        </div>
      </div>
    </div>
  )
}