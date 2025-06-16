import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth/config'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

const blogCategorySchema = z.object({
  name: z.string().min(1, 'Kategori adı gereklidir'),
  slug: z.string().min(1, 'Kategori slug gereklidir'),
  description: z.string().optional(),
  order: z.number().int().min(0).default(0),
})

export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const search = searchParams.get('search') || ''
    
    const skip = (page - 1) * limit

    // Build where clause
    const where: any = {}
    
    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
      ]
    }

    const [categories, totalCount] = await Promise.all([
      prisma.blogCategory.findMany({
        where,
        include: {
          _count: {
            select: { posts: true }
          }
        },
        orderBy: [
          { order: 'asc' },
          { createdAt: 'desc' }
        ],
        skip,
        take: limit
      }),
      prisma.blogCategory.count({ where })
    ])

    return NextResponse.json({
      categories,
      pagination: {
        page,
        limit,
        total: totalCount,
        totalPages: Math.ceil(totalCount / limit)
      }
    })

  } catch (error) {
    console.error('Blog categories fetch error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const validatedData = blogCategorySchema.parse(body)

    // Check if category with same name or slug exists
    const existingCategory = await prisma.blogCategory.findFirst({
      where: {
        OR: [
          { name: validatedData.name },
          { slug: validatedData.slug }
        ]
      }
    })

    if (existingCategory) {
      if (existingCategory.name === validatedData.name) {
        return NextResponse.json({ error: 'Bu kategori adı zaten kullanılıyor' }, { status: 400 })
      }
      if (existingCategory.slug === validatedData.slug) {
        return NextResponse.json({ error: 'Bu kategori slug zaten kullanılıyor' }, { status: 400 })
      }
    }

    const category = await prisma.blogCategory.create({
      data: validatedData,
      include: {
        _count: {
          select: { posts: true }
        }
      }
    })

    return NextResponse.json(category, { status: 201 })

  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation error', details: error.errors }, 
        { status: 400 }
      )
    }
    
    console.error('Blog category creation error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}