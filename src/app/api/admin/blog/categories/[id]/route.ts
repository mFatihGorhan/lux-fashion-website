import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth/config'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

const updateBlogCategorySchema = z.object({
  name: z.string().min(1, 'Kategori adı gereklidir'),
  slug: z.string().min(1, 'Kategori slug gereklidir'),
  description: z.string().optional(),
  order: z.number().int().min(0).default(0),
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
    
    const category = await prisma.blogCategory.findUnique({
      where: { id },
      include: {
        _count: {
          select: { posts: true }
        }
      }
    })

    if (!category) {
      return NextResponse.json({ error: 'Blog kategorisi bulunamadı' }, { status: 404 })
    }

    return NextResponse.json(category)
  } catch (error) {
    console.error('Blog category fetch error:', error)
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
    const validatedData = updateBlogCategorySchema.parse(body)

    // Check if category exists
    const existingCategory = await prisma.blogCategory.findUnique({
      where: { id }
    })

    if (!existingCategory) {
      return NextResponse.json({ error: 'Blog kategorisi bulunamadı' }, { status: 404 })
    }

    // Check if another category with same name or slug exists
    const duplicateCategory = await prisma.blogCategory.findFirst({
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

    if (duplicateCategory) {
      if (duplicateCategory.name === validatedData.name) {
        return NextResponse.json({ error: 'Bu kategori adı zaten kullanılıyor' }, { status: 400 })
      }
      if (duplicateCategory.slug === validatedData.slug) {
        return NextResponse.json({ error: 'Bu kategori slug zaten kullanılıyor' }, { status: 400 })
      }
    }

    const category = await prisma.blogCategory.update({
      where: { id },
      data: validatedData,
      include: {
        _count: {
          select: { posts: true }
        }
      }
    })

    return NextResponse.json(category)
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation error', details: error.errors }, 
        { status: 400 }
      )
    }
    
    console.error('Blog category update error:', error)
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
    const existingCategory = await prisma.blogCategory.findUnique({
      where: { id },
      include: {
        _count: {
          select: { posts: true }
        }
      }
    })

    if (!existingCategory) {
      return NextResponse.json({ error: 'Blog kategorisi bulunamadı' }, { status: 404 })
    }

    // Check if category has posts
    if (existingCategory._count.posts > 0) {
      return NextResponse.json(
        { error: 'Bu kategoriye ait blog yazıları var. Önce yazıları silin veya başka kategoriye taşıyın.' }, 
        { status: 400 }
      )
    }

    await prisma.blogCategory.delete({
      where: { id }
    })

    return NextResponse.json({ message: 'Blog kategorisi başarıyla silindi' })
  } catch (error) {
    console.error('Blog category delete error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}