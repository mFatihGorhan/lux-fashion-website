import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params

    const post = await prisma.blogPost.findUnique({
      where: { 
        slug,
        published: true
      },
      include: {
        author: {
          select: {
            id: true,
            name: true
          }
        },
        category: {
          select: {
            id: true,
            name: true,
            slug: true
          }
        }
      }
    })

    if (!post) {
      return NextResponse.json(
        { error: 'Blog post not found' },
        { status: 404 }
      )
    }

    // Increment view count
    await prisma.blogPost.update({
      where: { id: post.id },
      data: {
        views: {
          increment: 1
        }
      }
    })

    // Get related posts
    const relatedPosts = await prisma.blogPost.findMany({
      where: {
        published: true,
        categoryId: post.categoryId,
        id: {
          not: post.id
        }
      },
      include: {
        author: {
          select: {
            id: true,
            name: true
          }
        },
        category: {
          select: {
            id: true,
            name: true,
            slug: true
          }
        }
      },
      orderBy: {
        publishedAt: 'desc'
      },
      take: 3
    })

    const formattedPost = {
      id: post.id,
      title: post.title,
      slug: post.slug,
      excerpt: post.excerpt,
      content: post.content,
      featuredImage: null, // post.featuredImage,
      category: post.category,
      author: post.author,
      publishedAt: post.publishedAt?.toISOString(),
      updatedAt: post.updatedAt.toISOString(),
      readTime: post.readTime,
      featured: post.featured,
      tags: [], // post.tags,
      views: 0, // post.views || 0,
      seoTitle: null, // post.seoTitle,
      seoDescription: null, // post.seoDescription,
      relatedPosts: relatedPosts.map(related => ({
        id: related.id,
        title: related.title,
        slug: related.slug,
        excerpt: related.excerpt,
        featuredImage: null, // related.featuredImage,
        category: related.category,
        author: related.author,
        publishedAt: related.publishedAt?.toISOString(),
        readTime: related.readTime
      }))
    }

    return NextResponse.json(formattedPost)

  } catch (error) {
    console.error('Error fetching blog post:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  } finally {
    await prisma.$disconnect()
  }
}