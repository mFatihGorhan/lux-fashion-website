import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth/config'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

const blogPostUpdateSchema = z.object({
  title: z.string().min(1, 'Başlık gereklidir').optional(),
  slug: z.string().min(1, 'Slug gereklidir').optional(),
  excerpt: z.string().min(1, 'Özet gereklidir').optional(),
  content: z.string().min(1, 'İçerik gereklidir').optional(),
  coverImage: z.string().url('Geçerli bir kapak resmi URL\'si gereklidir').optional(),
  coverImageAlt: z.string().optional(),
  readTime: z.number().min(1, 'Okuma süresi 1 dakikadan az olamaz').optional(),
  categoryId: z.string().min(1, 'Kategori seçimi gereklidir').optional(),
  tags: z.array(z.string()).optional(),
  featured: z.boolean().optional(),
  published: z.boolean().optional(),
  publishedAt: z.string().nullable().optional(),
  order: z.number().optional(),
  metaTitle: z.string().optional(),
  metaDescription: z.string().optional()
})

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = await params
    const post = await prisma.blogPost.findUnique({
      where: { id },
      include: {
        category: {
          select: { id: true, name: true }
        },
        author: {
          select: { id: true, name: true }
        },
        tags: {
          select: { id: true, name: true, slug: true }
        }
      }
    })

    if (!post) {
      return NextResponse.json({ error: 'Blog yazısı bulunamadı' }, { status: 404 })
    }

    return NextResponse.json(post)

  } catch (error) {
    console.error('Blog post fetch error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = await params
    const body = await request.json()
    const validatedData = blogPostUpdateSchema.parse(body)

    // Check if slug already exists (excluding current post)
    if (validatedData.slug) {
      const existingPost = await prisma.blogPost.findFirst({
        where: {
          slug: validatedData.slug,
          id: { not: id }
        }
      })

      if (existingPost) {
        return NextResponse.json({ error: 'Bu slug zaten kullanılıyor' }, { status: 400 })
      }
    }

    // Update post with tags
    const { tags, publishedAt, ...postData } = validatedData

    const updateData: any = {
      ...postData
    }

    // Handle publishedAt
    if (publishedAt !== undefined) {
      updateData.publishedAt = publishedAt ? new Date(publishedAt) : null
    } else if (validatedData.published !== undefined) {
      updateData.publishedAt = validatedData.published ? new Date() : null
    }

    // Handle tags relationship
    if (tags !== undefined) {
      updateData.tags = {
        set: [], // Clear existing tags
        connect: tags.map(tagId => ({ id: tagId }))
      }
    }

    const post = await prisma.blogPost.update({
      where: { id },
      data: updateData,
      include: {
        category: {
          select: { id: true, name: true }
        },
        author: {
          select: { id: true, name: true }
        },
        tags: true
      }
    })

    return NextResponse.json(post)

  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({
        error: 'Validation error',
        details: error.errors
      }, { status: 400 })
    }

    console.error('Blog post update error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = await params
    const body = await request.json()

    const post = await prisma.blogPost.update({
      where: { id },
      data: {
        ...body,
        publishedAt: body.publishedAt ? new Date(body.publishedAt) : null
      },
      include: {
        category: {
          select: { id: true, name: true }
        },
        author: {
          select: { id: true, name: true }
        },
        tags: true
      }
    })

    return NextResponse.json(post)

  } catch (error) {
    console.error('Blog post patch error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = await params

    // Check if post exists
    const post = await prisma.blogPost.findUnique({
      where: { id }
    })

    if (!post) {
      return NextResponse.json({ error: 'Blog yazısı bulunamadı' }, { status: 404 })
    }

    // Delete the post (tags relationship will be automatically handled)
    await prisma.blogPost.delete({
      where: { id }
    })

    return NextResponse.json({ message: 'Blog yazısı başarıyla silindi' })

  } catch (error) {
    console.error('Blog post deletion error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}