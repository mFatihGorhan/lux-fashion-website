import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const query = searchParams.get('q')

    if (!query || query.length < 2) {
      return NextResponse.json([])
    }

    const products = await prisma.product.findMany({
      where: {
        isActive: true,
        OR: [
          { name: { contains: query, mode: 'insensitive' } },
          { description: { contains: query, mode: 'insensitive' } },
          { category: { name: { contains: query, mode: 'insensitive' } } }
        ]
      },
      select: {
        id: true,
        name: true,
        slug: true,
        category: {
          select: {
            name: true
          }
        }
      },
      take: 8,
      orderBy: {
        name: 'asc'
      }
    })

    const suggestions = products.map(product => ({
      id: product.id,
      name: product.name,
      slug: product.slug,
      category: product.category?.name || 'Uncategorized'
    }))

    return NextResponse.json(suggestions)
  } catch (error) {
    console.error('Search suggestions error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}