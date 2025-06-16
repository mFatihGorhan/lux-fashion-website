import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const heroSlides = await prisma.heroSlide.findMany({
      where: {
        isActive: true
      },
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