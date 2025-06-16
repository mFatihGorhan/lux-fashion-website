import { Metadata } from 'next'
import { prisma } from '@/lib/prisma'

interface SeoData {
  title: string
  description: string
  keywords?: string
  ogTitle?: string
  ogDescription?: string
  ogImage?: string
  canonical?: string
}

export async function generatePageMetadata(
  page: string,
  defaultData?: Partial<SeoData>
): Promise<Metadata> {
  try {
    // Fetch SEO data from settings
    const seoSetting = await prisma.setting.findUnique({
      where: { key: `seo_${page}` }
    })
    const seoData = seoSetting?.value as SeoData | null

    // Merge with defaults
    const finalData: SeoData = {
      title: 'Luxe Fashion',
      description: 'Özgün tasarımlar, sınırlı sayıda üretim',
      ...defaultData,
      ...seoData
    }

    // Build metadata
    const metadata: Metadata = {
      title: finalData.title,
      description: finalData.description,
      keywords: finalData.keywords || undefined,
      openGraph: {
        title: finalData.ogTitle || finalData.title,
        description: finalData.ogDescription || finalData.description,
        images: finalData.ogImage ? [{ url: finalData.ogImage }] : undefined,
        type: 'website',
        locale: 'tr_TR',
        siteName: 'Luxe Fashion'
      },
      twitter: {
        card: 'summary_large_image',
        title: finalData.ogTitle || finalData.title,
        description: finalData.ogDescription || finalData.description,
        images: finalData.ogImage ? [finalData.ogImage] : undefined
      },
      alternates: {
        canonical: finalData.canonical || undefined
      },
      robots: {
        index: true,
        follow: true
      }
    }

    return metadata

  } catch (error) {
    console.error('SEO metadata generation error:', error)
    
    // Return fallback metadata
    return {
      title: defaultData?.title || 'Luxe Fashion',
      description: defaultData?.description || 'Özgün tasarımlar, sınırlı sayıda üretim',
      openGraph: {
        title: defaultData?.title || 'Luxe Fashion',
        description: defaultData?.description || 'Özgün tasarımlar, sınırlı sayıda üretim',
        type: 'website',
        locale: 'tr_TR',
        siteName: 'Luxe Fashion'
      }
    }
  }
}

export function generateStructuredData(type: 'organization' | 'website' | 'article', data: any) {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://luxefashion.com'
  
  switch (type) {
    case 'organization':
      return {
        '@context': 'https://schema.org',
        '@type': 'Organization',
        name: 'Luxe Fashion',
        url: baseUrl,
        logo: `${baseUrl}/logo.png`,
        sameAs: [
          'https://instagram.com/luxefashion',
          'https://pinterest.com/luxefashion'
        ],
        contactPoint: {
          '@type': 'ContactPoint',
          telephone: '+90-555-555-5555',
          contactType: 'Customer Service',
          availableLanguage: 'Turkish'
        }
      }

    case 'website':
      return {
        '@context': 'https://schema.org',
        '@type': 'WebSite',
        name: 'Luxe Fashion',
        url: baseUrl,
        potentialAction: {
          '@type': 'SearchAction',
          target: `${baseUrl}/search?q={search_term_string}`,
          'query-input': 'required name=search_term_string'
        }
      }

    case 'article':
      return {
        '@context': 'https://schema.org',
        '@type': 'Article',
        headline: data.title,
        description: data.description,
        image: data.image,
        author: {
          '@type': 'Organization',
          name: 'Luxe Fashion'
        },
        publisher: {
          '@type': 'Organization',
          name: 'Luxe Fashion',
          logo: {
            '@type': 'ImageObject',
            url: `${baseUrl}/logo.png`
          }
        },
        datePublished: data.publishedAt,
        dateModified: data.updatedAt
      }

    default:
      return null
  }
}