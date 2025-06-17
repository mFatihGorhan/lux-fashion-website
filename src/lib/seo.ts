import { Metadata } from 'next'
import { prisma } from '@/lib/prisma'

const DEFAULT_SEO = {
  siteName: 'Lux Fashion',
  siteUrl: process.env.NEXTAUTH_URL || 'https://your-domain.com',
  defaultTitle: 'Lux Fashion - Ulaşılabilir Lüks',
  defaultDescription: 'Özgün tasarımlar, sınırlı sayıda üretim. Lüks moda ve stil için doğru adres.',
  defaultKeywords: 'lüks moda, fashion, tasarım, giyim, moda tasarım, elit giyim, özel tasarım',
  defaultImage: '/images/og-default.jpg',
  twitterHandle: '@luxfashion',
  facebookAppId: '',
  googleSiteVerification: '',
  bingMeta: ''
}

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

// Generate product-specific metadata
export async function generateProductMetadata(slug: string): Promise<Metadata> {
  try {
    const product = await prisma.product.findUnique({
      where: { slug, isActive: true },
      include: { category: true }
    })

    if (!product) {
      return {
        title: 'Ürün Bulunamadı - Lux Fashion',
        description: DEFAULT_SEO.defaultDescription
      }
    }

    const title = `${product.name} - ${product.category.name} | Lux Fashion`
    const description = product.description 
      ? `${product.description.substring(0, 160)}...`
      : `${product.name} - ${product.category.name}. ${DEFAULT_SEO.defaultDescription}`

    return {
      title,
      description,
      keywords: `${product.name}, ${product.category.name}, ${DEFAULT_SEO.defaultKeywords}`,
      openGraph: {
        title,
        description,
        images: [{ url: product.primaryImage }],
        type: 'website',
        locale: 'tr_TR',
        siteName: DEFAULT_SEO.siteName,
        url: `${DEFAULT_SEO.siteUrl}/urun/${product.slug}`
      },
      twitter: {
        card: 'summary_large_image',
        title,
        description,
        images: [product.primaryImage]
      },
      alternates: {
        canonical: `${DEFAULT_SEO.siteUrl}/urun/${product.slug}`
      }
    }
  } catch (error) {
    console.error('Product SEO generation error:', error)
    return {
      title: 'Ürün - Lux Fashion',
      description: DEFAULT_SEO.defaultDescription
    }
  }
}

// Generate blog post metadata
export async function generateBlogMetadata(slug: string): Promise<Metadata> {
  try {
    const post = await prisma.blogPost.findUnique({
      where: { slug, published: true },
      include: { category: true, author: true }
    })

    if (!post) {
      return {
        title: 'Blog Yazısı Bulunamadı - Lux Fashion',
        description: DEFAULT_SEO.defaultDescription
      }
    }

    const title = `${post.title} | Lux Fashion Blog`
    const description = post.excerpt || `${post.title} - Lux Fashion blog yazısı`

    return {
      title,
      description,
      keywords: `${post.title}, ${post.category?.name || 'blog'}, ${DEFAULT_SEO.defaultKeywords}`,
      authors: [{ name: post.author?.name || 'Lux Fashion' }],
      openGraph: {
        title,
        description,
        images: post.coverImage ? [{ url: post.coverImage }] : undefined,
        type: 'article',
        locale: 'tr_TR',
        siteName: DEFAULT_SEO.siteName,
        url: `${DEFAULT_SEO.siteUrl}/blog/${post.slug}`,
        publishedTime: post.createdAt.toISOString(),
        modifiedTime: post.updatedAt.toISOString()
      },
      twitter: {
        card: 'summary_large_image',
        title,
        description,
        images: post.coverImage ? [post.coverImage] : undefined
      },
      alternates: {
        canonical: `${DEFAULT_SEO.siteUrl}/blog/${post.slug}`
      }
    }
  } catch (error) {
    console.error('Blog SEO generation error:', error)
    return {
      title: 'Blog - Lux Fashion',
      description: DEFAULT_SEO.defaultDescription
    }
  }
}

export function generateStructuredData(type: 'organization' | 'website' | 'article' | 'product', data: any) {
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

    case 'product':
      return {
        '@context': 'https://schema.org',
        '@type': 'Product',
        name: data.name,
        description: data.description,
        image: data.image,
        brand: {
          '@type': 'Brand',
          name: 'Lux Fashion'
        },
        offers: {
          '@type': 'Offer',
          price: data.price,
          priceCurrency: 'TRY',
          availability: 'https://schema.org/InStock',
          seller: {
            '@type': 'Organization',
            name: 'Lux Fashion'
          }
        },
        category: data.category
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