'use client'

import Head from 'next/head'
import { useEffect, useState } from 'react'

interface SeoHeadProps {
  page: string
  defaultTitle?: string
  defaultDescription?: string
}

export default function SeoHead({ page, defaultTitle, defaultDescription }: SeoHeadProps) {
  const [seoData, setSeoData] = useState<any>(null)

  useEffect(() => {
    const fetchSeoData = async () => {
      try {
        const response = await fetch(`/api/admin/seo?page=${page}`)
        if (response.ok) {
          const data = await response.json()
          setSeoData(data)
        }
      } catch (error) {
        console.error('Failed to fetch SEO data:', error)
      }
    }

    fetchSeoData()
  }, [page])

  const title = seoData?.title || defaultTitle || 'Luxe Fashion'
  const description = seoData?.description || defaultDescription || 'Özgün tasarımlar, sınırlı sayıda üretim'
  const keywords = seoData?.keywords || ''
  const ogTitle = seoData?.ogTitle || title
  const ogDescription = seoData?.ogDescription || description
  const ogImage = seoData?.ogImage || ''
  const canonical = seoData?.canonical || ''

  return (
    <Head>
      <title>{title}</title>
      <meta name="description" content={description} />
      {keywords && <meta name="keywords" content={keywords} />}
      
      {/* Open Graph */}
      <meta property="og:title" content={ogTitle} />
      <meta property="og:description" content={ogDescription} />
      <meta property="og:type" content="website" />
      <meta property="og:locale" content="tr_TR" />
      <meta property="og:site_name" content="Luxe Fashion" />
      {ogImage && <meta property="og:image" content={ogImage} />}
      
      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={ogTitle} />
      <meta name="twitter:description" content={ogDescription} />
      {ogImage && <meta name="twitter:image" content={ogImage} />}
      
      {/* Technical */}
      {canonical && <link rel="canonical" href={canonical} />}
      <meta name="robots" content="index, follow" />
    </Head>
  )
}