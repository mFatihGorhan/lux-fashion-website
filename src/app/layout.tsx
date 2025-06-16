import type { Metadata } from 'next'
import { Inter, Playfair_Display } from 'next/font/google'
import { Suspense } from 'react'
import './globals.css'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import SessionProvider from '@/components/providers/SessionProvider'
import { WishlistProvider } from '@/contexts/WishlistContext'
import WhatsAppButtonWrapper from '@/components/WhatsAppButtonWrapper'
import ErrorBoundary from '@/components/ErrorBoundary'
import { PageLoading } from '@/components/ui/LoadingSpinner'
import { generatePageMetadata, generateStructuredData } from '@/lib/seo'
import { Analytics } from '@vercel/analytics/react'
import { SpeedInsights } from '@vercel/speed-insights/next'
import PerformanceMonitor from '@/components/PerformanceMonitor'

const inter = Inter({ 
  subsets: ['latin'],
  variable: '--font-inter',
})

const playfair = Playfair_Display({ 
  subsets: ['latin'],
  variable: '--font-playfair',
})

export async function generateMetadata(): Promise<Metadata> {
  return await generatePageMetadata('home', {
    title: 'Luxe Fashion - Ulaşılabilir Lüks',
    description: 'Özgün tasarımlar, sınırlı sayıda üretim. Lüks moda ve stil için doğru adres.'
  })
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const organizationSchema = generateStructuredData('organization', {})
  const websiteSchema = generateStructuredData('website', {})

  return (
    <html lang="tr">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(organizationSchema)
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(websiteSchema)
          }}
        />
      </head>
      <body className={`${inter.variable} ${playfair.variable}`}>
        <ErrorBoundary>
          <SessionProvider>
            <WishlistProvider>
              <Header />
              <Suspense fallback={<PageLoading />}>
                {children}
              </Suspense>
              <Footer />
              <WhatsAppButtonWrapper />
            </WishlistProvider>
          </SessionProvider>
          <PerformanceMonitor />
          <Analytics />
          <SpeedInsights />
        </ErrorBoundary>
      </body>
    </html>
  )
}