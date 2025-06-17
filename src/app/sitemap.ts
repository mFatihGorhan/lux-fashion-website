import { MetadataRoute } from 'next'
import { prisma } from '@/lib/prisma'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXTAUTH_URL || 'https://your-domain.com'
  
  // Static pages
  const staticPages = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 1,
    },
    {
      url: `${baseUrl}/urunler`,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 0.9,
    },
    {
      url: `${baseUrl}/koleksiyonlar`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/blog`,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/hakkimizda`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.6,
    },
    {
      url: `${baseUrl}/iletisim`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.6,
    },
  ]

  try {
    // Get all active products
    const products = await prisma.product.findMany({
      where: {
        isActive: true
      },
      select: {
        slug: true,
        updatedAt: true
      },
      orderBy: {
        updatedAt: 'desc'
      }
    })

    // Get all active blog posts
    const blogPosts = await prisma.blogPost.findMany({
      where: {
        published: true
      },
      select: {
        slug: true,
        updatedAt: true
      },
      orderBy: {
        updatedAt: 'desc'
      }
    })

    // Get all active categories
    const categories = await prisma.category.findMany({
      where: {
        isActive: true
      },
      select: {
        slug: true,
        updatedAt: true
      },
      orderBy: {
        updatedAt: 'desc'
      }
    })

    // Product pages
    const productPages = products.map(product => ({
      url: `${baseUrl}/urun/${product.slug}`,
      lastModified: product.updatedAt,
      changeFrequency: 'weekly' as const,
      priority: 0.7,
    }))

    // Blog pages
    const blogPages = blogPosts.map(post => ({
      url: `${baseUrl}/blog/${post.slug}`,
      lastModified: post.updatedAt,
      changeFrequency: 'monthly' as const,
      priority: 0.6,
    }))

    // Category pages
    const categoryPages = categories.map(category => ({
      url: `${baseUrl}/kategori/${category.slug}`,
      lastModified: category.updatedAt,
      changeFrequency: 'weekly' as const,
      priority: 0.5,
    }))

    return [
      ...staticPages,
      ...productPages,
      ...blogPages,
      ...categoryPages,
    ]
  } catch (error) {
    console.error('Error generating sitemap:', error)
    // Return at least static pages if database fails
    return staticPages
  }
}