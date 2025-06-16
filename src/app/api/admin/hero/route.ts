import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth/config'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

const heroSlideSchema = z.object({
  title: z.string().min(1, 'Başlık gereklidir'),
  subtitle: z.string().min(1, 'Alt başlık gereklidir'),
  description: z.string().min(1, 'Açıklama gereklidir'),
  imageUrl: z.string().url('Geçerli bir resim URL\'si gereklidir'),
  imageAlt: z.string().optional(),
  gradient: z.string().min(1, 'Gradient gereklidir'),
  ctaText: z.string().min(1, 'Buton metni gereklidir'),
  ctaLink: z.string().min(1, 'Buton linki gereklidir'),
  secondaryCtaText: z.string().optional(),
  secondaryCtaLink: z.string().optional(),
  order: z.number().int().min(0).default(0),
  isActive: z.boolean().default(true),
})

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const heroSlides = await prisma.heroSlide.findMany({
      orderBy: {
        order: 'asc'
      }
    })

    return NextResponse.json(heroSlides)
  } catch (error) {
    console.error('Hero slides fetch error:', error)
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
    const validatedData = heroSlideSchema.parse(body)

    const heroSlide = await prisma.heroSlide.create({
      data: validatedData
    })

    return NextResponse.json(heroSlide, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation error', details: error.errors }, 
        { status: 400 }
      )
    }
    
    console.error('Hero slide create error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}