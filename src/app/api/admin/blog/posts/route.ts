import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth/config'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

const blogPostSchema = z.object({
  title: z.string().min(1, 'Başlık gereklidir'),
  slug: z.string().min(1, 'Slug gereklidir'),
  excerpt: z.string().min(1, 'Özet gereklidir'),
  content: z.string().min(1, 'İçerik gereklidir'),
  coverImage: z.string().url('Geçerli bir kapak resmi URL\'si gereklidir'),
  coverImageAlt: z.string().optional(),
  readTime: z.number().min(1, 'Okuma süresi 1 dakikadan az olamaz'),
  categoryId: z.string().min(1, 'Kategori seçimi gereklidir'),
  tags: z.array(z.string()).optional(),
  featured: z.boolean().optional(),
  published: z.boolean().optional(),
  order: z.number().optional(),
  metaTitle: z.string().optional(),
  metaDescription: z.string().optional()
})

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const search = searchParams.get('search')
    const status = searchParams.get('status') // 'published', 'draft', 'all'
    const categoryId = searchParams.get('categoryId')

    const skip = (page - 1) * limit

    const where: any = {}

    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { excerpt: { contains: search, mode: 'insensitive' } }
      ]
    }

    if (status && status !== 'all') {
      where.published = status === 'published'
    }

    if (categoryId) {
      where.categoryId = categoryId
    }

    const [posts, total] = await Promise.all([
      prisma.blogPost.findMany({
        where,
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
        },
        orderBy: [
          { featured: 'desc' },
          { publishedAt: 'desc' },
          { createdAt: 'desc' }
        ],
        skip,
        take: limit
      }),
      prisma.blogPost.count({ where })
    ])

    const totalPages = Math.ceil(total / limit)

    return NextResponse.json({
      posts,
      pagination: {
        page,
        limit,
        total,
        totalPages
      }
    })

  } catch (error) {
    console.error('Blog posts fetch error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const validatedData = blogPostSchema.parse(body)

    // Check if slug already exists
    const existingPost = await prisma.blogPost.findUnique({
      where: { slug: validatedData.slug }
    })

    if (existingPost) {
      return NextResponse.json({ error: 'Bu slug zaten kullanılıyor' }, { status: 400 })
    }

    // Create post with tags
    const { tags, ...postData } = validatedData

    const post = await prisma.blogPost.create({
      data: {
        ...postData,
        authorId: session.user.id,
        publishedAt: validatedData.published ? new Date() : null,
        tags: tags?.length ? {
          connect: tags.map(tagId => ({ id: tagId }))
        } : undefined
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

    return NextResponse.json(post, { status: 201 })

  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({
        error: 'Validation error',
        details: error.errors
      }, { status: 400 })
    }

    console.error('Blog post creation error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}