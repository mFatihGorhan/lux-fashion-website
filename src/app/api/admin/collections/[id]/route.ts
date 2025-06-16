import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth/config'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

const updateCollectionSchema = z.object({
  name: z.string().min(1, 'Koleksiyon adı gereklidir'),
  slug: z.string().min(1, 'Koleksiyon slug gereklidir'),
  description: z.string().optional(),
  season: z.string().optional(),
  order: z.number().int().min(0).default(0),
  isActive: z.boolean().default(true),
})

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = await params
    
    const collection = await prisma.collection.findUnique({
      where: { id },
      include: {
        _count: {
          select: { products: true }
        }
      }
    })

    if (!collection) {
      return NextResponse.json({ error: 'Koleksiyon bulunamadı' }, { status: 404 })
    }

    return NextResponse.json(collection)
  } catch (error) {
    console.error('Collection fetch error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = await params
    const body = await request.json()
    const validatedData = updateCollectionSchema.parse(body)

    // Check if collection exists
    const existingCollection = await prisma.collection.findUnique({
      where: { id }
    })

    if (!existingCollection) {
      return NextResponse.json({ error: 'Koleksiyon bulunamadı' }, { status: 404 })
    }

    // Check if another collection with same name or slug exists
    const duplicateCollection = await prisma.collection.findFirst({
      where: {
        AND: [
          { id: { not: id } },
          {
            OR: [
              { name: validatedData.name },
              { slug: validatedData.slug }
            ]
          }
        ]
      }
    })

    if (duplicateCollection) {
      if (duplicateCollection.name === validatedData.name) {
        return NextResponse.json({ error: 'Bu koleksiyon adı zaten kullanılıyor' }, { status: 400 })
      }
      if (duplicateCollection.slug === validatedData.slug) {
        return NextResponse.json({ error: 'Bu koleksiyon slug zaten kullanılıyor' }, { status: 400 })
      }
    }

    const collection = await prisma.collection.update({
      where: { id },
      data: validatedData,
      include: {
        _count: {
          select: { products: true }
        }
      }
    })

    return NextResponse.json(collection)
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation error', details: error.errors }, 
        { status: 400 }
      )
    }
    
    console.error('Collection update error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = await params

    // Check if collection exists
    const existingCollection = await prisma.collection.findUnique({
      where: { id },
      include: {
        _count: {
          select: { products: true }
        }
      }
    })

    if (!existingCollection) {
      return NextResponse.json({ error: 'Koleksiyon bulunamadı' }, { status: 404 })
    }

    // Check if collection has products
    if (existingCollection._count.products > 0) {
      return NextResponse.json(
        { error: 'Bu koleksiyona ait ürünler var. Önce ürünleri silin veya başka koleksiyona taşıyın.' }, 
        { status: 400 }
      )
    }

    await prisma.collection.delete({
      where: { id }
    })

    return NextResponse.json({ message: 'Koleksiyon başarıyla silindi' })
  } catch (error) {
    console.error('Collection delete error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}