import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(
  request: Request,
  { params }: { params: Promise<{ categoryId: string }> }
) {
  try {
    const { categoryId } = await params
    
    const relatedProducts = await prisma.product.findMany({
      where: {
        categoryId: categoryId,
        isActive: true
      },
      include: {
        category: true
      },
      orderBy: {
        createdAt: 'desc'
      },
      take: 6
    })

    return NextResponse.json(relatedProducts)
  } catch (error) {
    console.error('Related products fetch error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
