import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth/config'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

const collectionSchema = z.object({
  name: z.string().min(1, 'Koleksiyon adı gereklidir'),
  slug: z.string().min(1, 'Koleksiyon slug gereklidir'),
  description: z.string().optional(),
  season: z.string().optional(),
  order: z.number().int().min(0).default(0),
  isActive: z.boolean().default(true),
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
    const isActive = searchParams.get('isActive')
    
    const skip = (page - 1) * limit

    // Build where clause
    const where: any = {}
    
    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
        { season: { contains: search, mode: 'insensitive' } },
      ]
    }
    
    if (isActive !== null && isActive !== '') {
      where.isActive = isActive === 'true'
    }

    const [collections, totalCount] = await Promise.all([
      prisma.collection.findMany({
        where,
        include: {
          _count: {
            select: { products: true }
          }
        },
        orderBy: [
          { order: 'asc' },
          { createdAt: 'desc' }
        ],
        skip,
        take: limit
      }),
      prisma.collection.count({ where })
    ])

    return NextResponse.json({
      collections,
      pagination: {
        page,
        limit,
        total: totalCount,
        totalPages: Math.ceil(totalCount / limit)
      }
    })

  } catch (error) {
    console.error('Collections fetch error:', error)
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
    const validatedData = collectionSchema.parse(body)

    // Check if collection with same name or slug exists
    const existingCollection = await prisma.collection.findFirst({
      where: {
        OR: [
          { name: validatedData.name },
          { slug: validatedData.slug }
        ]
      }
    })

    if (existingCollection) {
      if (existingCollection.name === validatedData.name) {
        return NextResponse.json({ error: 'Bu koleksiyon adı zaten kullanılıyor' }, { status: 400 })
      }
      if (existingCollection.slug === validatedData.slug) {
        return NextResponse.json({ error: 'Bu koleksiyon slug zaten kullanılıyor' }, { status: 400 })
      }
    }

    const collection = await prisma.collection.create({
      data: validatedData,
      include: {
        _count: {
          select: { products: true }
        }
      }
    })

    return NextResponse.json(collection, { status: 201 })

  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation error', details: error.errors }, 
        { status: 400 }
      )
    }
    
    console.error('Collection creation error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}