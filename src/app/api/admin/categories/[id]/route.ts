import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth/config'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

const categoryUpdateSchema = z.object({
  name: z.string().min(1, 'Kategori adı gereklidir').optional(),
  slug: z.string().min(1, 'Kategori slug gereklidir').optional(),
  description: z.string().optional(),
  order: z.number().int().min(0).optional(),
  isActive: z.boolean().optional(),
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
    
    const category = await prisma.category.findUnique({
      where: { id },
      include: {
        _count: {
          select: {
            products: true
          }
        }
      }
    })

    if (!category) {
      return NextResponse.json({ error: 'Kategori bulunamadı' }, { status: 404 })
    }

    return NextResponse.json(category)
  } catch (error) {
    console.error('Category fetch error:', error)
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
    const validatedData = categoryUpdateSchema.parse(body)

    // Check if category exists
    const existingCategory = await prisma.category.findUnique({
      where: { id }
    })

    if (!existingCategory) {
      return NextResponse.json({ error: 'Kategori bulunamadı' }, { status: 404 })
    }

    // Check if name or slug conflicts with other categories
    if (validatedData.name || validatedData.slug) {
      const conflictingCategory = await prisma.category.findFirst({
        where: {
          AND: [
            { id: { not: id } },
            {
              OR: [
                validatedData.name ? { name: validatedData.name } : {},
                validatedData.slug ? { slug: validatedData.slug } : {}
              ].filter(condition => Object.keys(condition).length > 0)
            }
          ]
        }
      })

      if (conflictingCategory) {
        return NextResponse.json(
          { error: 'Bu isim veya slug ile başka kategori mevcut' }, 
          { status: 400 }
        )
      }
    }

    const updatedCategory = await prisma.category.update({
      where: { id },
      data: validatedData,
      include: {
        _count: {
          select: {
            products: true
          }
        }
      }
    })

    return NextResponse.json(updatedCategory)
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation error', details: error.errors }, 
        { status: 400 }
      )
    }
    
    console.error('Category update error:', error)
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

    // Check if category exists
    const existingCategory = await prisma.category.findUnique({
      where: { id },
      include: {
        _count: {
          select: {
            products: true
          }
        }
      }
    })

    if (!existingCategory) {
      return NextResponse.json({ error: 'Kategori bulunamadı' }, { status: 404 })
    }

    // Check if category has products
    if (existingCategory._count.products > 0) {
      return NextResponse.json(
        { error: 'Bu kategoriye ait ürünler var. Önce ürünleri başka kategoriye taşıyın.' }, 
        { status: 400 }
      )
    }

    await prisma.category.delete({
      where: { id }
    })

    return NextResponse.json({ message: 'Kategori başarıyla silindi' })
  } catch (error) {
    console.error('Category delete error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}