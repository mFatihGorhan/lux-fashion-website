import { Analytics } from '@vercel/analytics/react'

declare global {
  interface Window {
    gtag: (command: string, targetId: string | Date, config?: any) => void
    dataLayer: any[]
  }
}

// Google Analytics configuration
export const GA_TRACKING_ID = process.env.NEXT_PUBLIC_GA_ID || ''

// Initialize Google Analytics
export const initGA = () => {
  if (!GA_TRACKING_ID || typeof window === 'undefined') return

  // Load gtag script
  const script = document.createElement('script')
  script.async = true
  script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_TRACKING_ID}`
  document.head.appendChild(script)

  // Initialize gtag
  window.gtag = function() {
    window.dataLayer.push(arguments)
  }
  
  window.dataLayer = window.dataLayer || []
  
  window.gtag('js', new Date())
  window.gtag('config', GA_TRACKING_ID, {
    page_title: document.title,
    page_location: window.location.href,
  })
}

// Track page views
export const trackPageView = (url: string, title?: string) => {
  if (!GA_TRACKING_ID || typeof window === 'undefined') return

  window.gtag('config', GA_TRACKING_ID, {
    page_title: title || document.title,
    page_location: url,
  })
}

// Track events
export const trackEvent = (
  action: string,
  {
    event_category = 'general',
    event_label,
    value,
    custom_parameters = {},
  }: {
    event_category?: string
    event_label?: string
    value?: number
    custom_parameters?: Record<string, any>
  } = {}
) => {
  if (!GA_TRACKING_ID || typeof window === 'undefined') return

  window.gtag('event', action, {
    event_category,
    event_label,
    value,
    ...custom_parameters,
  })
}

// E-commerce tracking functions
export const trackPurchase = (transactionId: string, items: any[]) => {
  if (!GA_TRACKING_ID || typeof window === 'undefined') return

  window.gtag('event', 'purchase', {
    transaction_id: transactionId,
    value: items.reduce((sum, item) => sum + (item.price * item.quantity), 0),
    currency: 'TRY',
    items: items.map(item => ({
      item_id: item.id,
      item_name: item.name,
      category: item.category,
      quantity: item.quantity,
      price: item.price,
    })),
  })
}

export const trackViewItem = (item: any) => {
  if (!GA_TRACKING_ID || typeof window === 'undefined') return

  window.gtag('event', 'view_item', {
    currency: 'TRY',
    value: item.price,
    items: [{
      item_id: item.id,
      item_name: item.name,
      category: item.category,
      price: item.price,
    }],
  })
}

export const trackAddToWishlist = (item: any) => {
  if (!GA_TRACKING_ID || typeof window === 'undefined') return

  window.gtag('event', 'add_to_wishlist', {
    currency: 'TRY',
    value: item.price,
    items: [{
      item_id: item.id,
      item_name: item.name,
      category: item.category,
      price: item.price,
    }],
  })
}

export const trackSearch = (searchTerm: string) => {
  if (!GA_TRACKING_ID || typeof window === 'undefined') return

  window.gtag('event', 'search', {
    search_term: searchTerm,
  })
}

// Custom events for fashion website
export const trackContactFormSubmit = () => {
  trackEvent('form_submit', {
    event_category: 'contact',
    event_label: 'contact_form',
  })
}

export const trackNewsletterSignup = () => {
  trackEvent('newsletter_signup', {
    event_category: 'engagement',
    event_label: 'newsletter',
  })
}

export const trackWhatsAppClick = () => {
  trackEvent('whatsapp_click', {
    event_category: 'contact',
    event_label: 'whatsapp_button',
  })
}

export const trackSocialShare = (platform: string, url: string) => {
  trackEvent('share', {
    event_category: 'social',
    event_label: platform,
    custom_parameters: {
      shared_url: url,
    },
  })
}

export const trackFileDownload = (fileName: string) => {
  trackEvent('file_download', {
    event_category: 'downloads',
    event_label: fileName,
  })
}

// Heat mapping and user behavior
export const trackScrollDepth = (percentage: number) => {
  trackEvent('scroll', {
    event_category: 'engagement',
    event_label: `${percentage}%`,
    value: percentage,
  })
}

export const trackTimeOnPage = (seconds: number) => {
  trackEvent('timing_complete', {
    event_category: 'engagement',
    event_label: 'time_on_page',
    value: seconds,
  })
}