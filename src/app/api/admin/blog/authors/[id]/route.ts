import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth/config'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

const authorUpdateSchema = z.object({
  name: z.string().min(1, 'Ad gereklidir').optional(),
  email: z.string().email('Geçerli bir email adresi gereklidir').optional(),
  role: z.enum(['ADMIN', 'EDITOR', 'VIEWER'], {
    errorMap: () => ({ message: 'Geçerli bir rol seçiniz' })
  }).optional(),
  image: z.string().url().optional().or(z.literal(''))
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
    const author = await prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        image: true,
        createdAt: true,
        updatedAt: true,
        _count: {
          select: {
            posts: true
          }
        }
      }
    })

    if (!author) {
      return NextResponse.json({ error: 'Yazar bulunamadı' }, { status: 404 })
    }

    return NextResponse.json(author)

  } catch (error) {
    console.error('Author fetch error:', error)
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
    const validatedData = authorUpdateSchema.parse(body)

    // Check if email already exists (excluding current user)
    if (validatedData.email) {
      const existingUser = await prisma.user.findFirst({
        where: {
          email: validatedData.email,
          id: { not: id }
        }
      })

      if (existingUser) {
        return NextResponse.json({ error: 'Bu email adresi zaten kullanılıyor' }, { status: 400 })
      }
    }

    const author = await prisma.user.update({
      where: { id },
      data: {
        ...(validatedData.name && { name: validatedData.name }),
        ...(validatedData.email && { email: validatedData.email }),
        ...(validatedData.role && { role: validatedData.role }),
        ...(validatedData.image !== undefined && { image: validatedData.image || null })
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        image: true,
        createdAt: true,
        updatedAt: true,
        _count: {
          select: {
            posts: true
          }
        }
      }
    })

    return NextResponse.json(author)

  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({
        error: 'Validation error',
        details: error.errors
      }, { status: 400 })
    }

    console.error('Author update error:', error)
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

    // Prevent deleting yourself
    if (session.user.id === id) {
      return NextResponse.json({ error: 'Kendi hesabınızı silemezsiniz' }, { status: 400 })
    }

    // Check if user exists
    const user = await prisma.user.findUnique({
      where: { id },
      include: {
        _count: {
          select: {
            posts: true
          }
        }
      }
    })

    if (!user) {
      return NextResponse.json({ error: 'Yazar bulunamadı' }, { status: 404 })
    }

    // Check if user has posts
    if (user._count.posts > 0) {
      return NextResponse.json({ 
        error: `Bu yazarın ${user._count.posts} blog yazısı var. Önce yazıları başka bir yazara aktarın veya silin.` 
      }, { status: 400 })
    }

    // Delete the user
    await prisma.user.delete({
      where: { id }
    })

    return NextResponse.json({ message: 'Yazar başarıyla silindi' })

  } catch (error) {
    console.error('Author deletion error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}