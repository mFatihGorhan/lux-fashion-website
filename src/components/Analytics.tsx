'use client'

import { useEffect, Suspense } from 'react'
import { usePathname, useSearchParams } from 'next/navigation'
import { initGA, trackPageView, trackScrollDepth, trackTimeOnPage } from '@/lib/analytics'

function AnalyticsComponent() {
  const pathname = usePathname()
  const searchParams = useSearchParams()

  useEffect(() => {
    // Initialize Google Analytics
    initGA()

    // Track scroll depth
    let maxScroll = 0
    const handleScroll = () => {
      const scrollTop = window.pageYOffset
      const docHeight = document.documentElement.scrollHeight - window.innerHeight
      const scrollPercent = Math.round((scrollTop / docHeight) * 100)

      if (scrollPercent > maxScroll && scrollPercent % 25 === 0) {
        maxScroll = scrollPercent
        trackScrollDepth(scrollPercent)
      }
    }

    // Track time on page
    const startTime = Date.now()
    const handleBeforeUnload = () => {
      const timeSpent = Math.round((Date.now() - startTime) / 1000)
      if (timeSpent > 30) { // Only track if user spent more than 30 seconds
        trackTimeOnPage(timeSpent)
      }
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    window.addEventListener('beforeunload', handleBeforeUnload)

    return () => {
      window.removeEventListener('scroll', handleScroll)
      window.removeEventListener('beforeunload', handleBeforeUnload)
    }
  }, [])

  useEffect(() => {
    // Track page views on route changes
    if (pathname) {
      const url = pathname + (searchParams?.toString() ? `?${searchParams.toString()}` : '')
      trackPageView(url)
    }
  }, [pathname, searchParams])

  return null
}

export default function Analytics() {
  return (
    <Suspense fallback={null}>
      <AnalyticsComponent />
    </Suspense>
  )
}

// Google Analytics Script Component
export function GoogleAnalyticsScript() {
  const GA_TRACKING_ID = process.env.NEXT_PUBLIC_GA_ID

  if (!GA_TRACKING_ID) {
    return null
  }

  return (
    <>
      <script
        async
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_TRACKING_ID}`}
      />
      <script
        id="google-analytics"
        dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${GA_TRACKING_ID}', {
              page_title: document.title,
              page_location: window.location.href,
              custom_map: {
                'dimension1': 'user_type',
                'dimension2': 'page_category'
              }
            });
          `,
        }}
      />
    </>
  )
}