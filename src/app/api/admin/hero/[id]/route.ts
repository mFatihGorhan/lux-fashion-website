import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth/config'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

const heroSlideUpdateSchema = z.object({
  title: z.string().min(1, 'Başlık gereklidir').optional(),
  subtitle: z.string().min(1, 'Alt başlık gereklidir').optional(),
  description: z.string().min(1, 'Açıklama gereklidir').optional(),
  imageUrl: z.string().url('Geçerli bir resim URL\'si gereklidir').optional(),
  imageAlt: z.string().optional(),
  gradient: z.string().min(1, 'Gradient gereklidir').optional(),
  ctaText: z.string().min(1, 'Buton metni gereklidir').optional(),
  ctaLink: z.string().min(1, 'Buton linki gereklidir').optional(),
  secondaryCtaText: z.string().optional(),
  secondaryCtaLink: z.string().optional(),
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
    
    const heroSlide = await prisma.heroSlide.findUnique({
      where: { id }
    })

    if (!heroSlide) {
      return NextResponse.json({ error: 'Hero slide bulunamadı' }, { status: 404 })
    }

    return NextResponse.json(heroSlide)
  } catch (error) {
    console.error('Hero slide fetch error:', error)
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
    const validatedData = heroSlideUpdateSchema.parse(body)

    // Check if hero slide exists
    const existingSlide = await prisma.heroSlide.findUnique({
      where: { id }
    })

    if (!existingSlide) {
      return NextResponse.json({ error: 'Hero slide bulunamadı' }, { status: 404 })
    }

    const updatedSlide = await prisma.heroSlide.update({
      where: { id },
      data: validatedData
    })

    return NextResponse.json(updatedSlide)
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation error', details: error.errors }, 
        { status: 400 }
      )
    }
    
    console.error('Hero slide update error:', error)
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

    // Check if hero slide exists
    const existingSlide = await prisma.heroSlide.findUnique({
      where: { id }
    })

    if (!existingSlide) {
      return NextResponse.json({ error: 'Hero slide bulunamadı' }, { status: 404 })
    }

    await prisma.heroSlide.delete({
      where: { id }
    })

    return NextResponse.json({ message: 'Hero slide başarıyla silindi' })
  } catch (error) {
    console.error('Hero slide delete error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}