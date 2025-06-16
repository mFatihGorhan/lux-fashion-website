'use client'

import React, { useState } from 'react'
import { Mail, CheckCircle, AlertCircle, Loader } from 'lucide-react'
import styles from './Newsletter.module.css'

interface NewsletterProps {
  variant?: 'default' | 'minimal' | 'sidebar'
  title?: string
  description?: string
  placeholder?: string
  className?: string
}

interface NewsletterState {
  email: string
  status: 'idle' | 'loading' | 'success' | 'error'
  message: string
}

export default function Newsletter({ 
  variant = 'default',
  title = 'Bültenimize Katılın',
  description = 'Yeni koleksiyonlar, özel indirimler ve moda trendleri hakkında bilgi alın.',
  placeholder = 'E-posta adresiniz',
  className = ''
}: NewsletterProps) {
  const [state, setState] = useState<NewsletterState>({
    email: '',
    status: 'idle',
    message: ''
  })

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!state.email.trim()) {
      setState(prev => ({ ...prev, status: 'error', message: 'E-posta adresi gerekli' }))
      return
    }

    if (!validateEmail(state.email)) {
      setState(prev => ({ ...prev, status: 'error', message: 'Geçerli bir e-posta adresi girin' }))
      return
    }

    setState(prev => ({ ...prev, status: 'loading', message: '' }))

    try {
      const response = await fetch('/api/newsletter/subscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          email: state.email.trim(),
          source: 'website',
          preferences: {
            newProducts: true,
            sales: true,
            blog: true
          }
        }),
      })

      const data = await response.json()

      if (response.ok) {
        setState(prev => ({ 
          ...prev, 
          status: 'success', 
          message: data.message || 'Başarıyla abone oldunuz!',
          email: ''
        }))
      } else {
        setState(prev => ({ 
          ...prev, 
          status: 'error', 
          message: data.error || 'Bir hata oluştu. Lütfen tekrar deneyin.' 
        }))
      }
    } catch (error) {
      setState(prev => ({ 
        ...prev, 
        status: 'error', 
        message: 'Bağlantı hatası. Lütfen tekrar deneyin.' 
      }))
    }
  }

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setState(prev => ({ ...prev, email: e.target.value, status: 'idle', message: '' }))
  }

  if (variant === 'minimal') {
    return (
      <div className={`${styles.newsletter} ${styles.minimal} ${className}`}>
        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.inputGroup}>
            <Mail className={styles.inputIcon} size={20} />
            <input
              type="email"
              value={state.email}
              onChange={handleEmailChange}
              placeholder={placeholder}
              className={styles.input}
              disabled={state.status === 'loading'}
            />
            <button
              type="submit"
              disabled={state.status === 'loading' || !state.email.trim()}
              className={styles.submitButton}
            >
              {state.status === 'loading' ? (
                <Loader className={styles.spinner} size={20} />
              ) : (
                'Abone Ol'
              )}
            </button>
          </div>
          {state.message && (
            <div className={`${styles.message} ${styles[state.status]}`}>
              {state.status === 'success' ? (
                <CheckCircle size={16} />
              ) : state.status === 'error' ? (
                <AlertCircle size={16} />
              ) : null}
              <span>{state.message}</span>
            </div>
          )}
        </form>
      </div>
    )
  }

  if (variant === 'sidebar') {
    return (
      <div className={`${styles.newsletter} ${styles.sidebar} ${className}`}>
        <div className={styles.header}>
          <Mail className={styles.headerIcon} size={24} />
          <h3 className={styles.title}>{title}</h3>
        </div>
        <p className={styles.description}>{description}</p>
        <form onSubmit={handleSubmit} className={styles.form}>
          <input
            type="email"
            value={state.email}
            onChange={handleEmailChange}
            placeholder={placeholder}
            className={styles.input}
            disabled={state.status === 'loading'}
          />
          <button
            type="submit"
            disabled={state.status === 'loading' || !state.email.trim()}
            className={styles.submitButton}
          >
            {state.status === 'loading' ? (
              <Loader className={styles.spinner} size={20} />
            ) : (
              'Abone Ol'
            )}
          </button>
          {state.message && (
            <div className={`${styles.message} ${styles[state.status]}`}>
              {state.status === 'success' ? (
                <CheckCircle size={16} />
              ) : state.status === 'error' ? (
                <AlertCircle size={16} />
              ) : null}
              <span>{state.message}</span>
            </div>
          )}
        </form>
      </div>
    )
  }

  // Default variant
  return (
    <div className={`${styles.newsletter} ${styles.default} ${className}`}>
      <div className={styles.container}>
        <div className={styles.content}>
          <div className={styles.header}>
            <Mail className={styles.headerIcon} size={32} />
            <h2 className={styles.title}>{title}</h2>
            <p className={styles.description}>{description}</p>
          </div>

          <form onSubmit={handleSubmit} className={styles.form}>
            <div className={styles.inputGroup}>
              <input
                type="email"
                value={state.email}
                onChange={handleEmailChange}
                placeholder={placeholder}
                className={styles.input}
                disabled={state.status === 'loading'}
              />
              <button
                type="submit"
                disabled={state.status === 'loading' || !state.email.trim()}
                className={styles.submitButton}
              >
                {state.status === 'loading' ? (
                  <Loader className={styles.spinner} size={20} />
                ) : (
                  'Abone Ol'
                )}
              </button>
            </div>

            {state.message && (
              <div className={`${styles.message} ${styles[state.status]}`}>
                {state.status === 'success' ? (
                  <CheckCircle size={20} />
                ) : state.status === 'error' ? (
                  <AlertCircle size={20} />
                ) : null}
                <span>{state.message}</span>
              </div>
            )}
          </form>

          <div className={styles.privacy}>
            <p>
              E-posta adresiniz güvende. Spam göndermiyoruz ve istediğiniz zaman aboneliği iptal edebilirsiniz.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

// Pre-built newsletter components
export function FooterNewsletter() {
  return (
    <Newsletter
      variant="minimal"
      title="Haberdar Olun"
      description="Yeni koleksiyonlar ve özel teklifler"
      placeholder="E-posta adresiniz"
    />
  )
}

export function SidebarNewsletter() {
  return (
    <Newsletter
      variant="sidebar"
      title="Bülten"
      description="Moda dünyasından haberler ve özel teklifler"
    />
  )
}

export function SectionNewsletter() {
  return (
    <section className={styles.section}>
      <Newsletter />
    </section>
  )
}