import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function GET() {
  try {
    const collections = await prisma.collection.findMany({
      where: {
        isActive: true
      },
      include: {
        _count: {
          select: {
            products: {
              where: {
                isActive: true
              }
            }
          }
        }
      },
      orderBy: {
        name: 'asc'
      }
    })

    const formattedCollections = collections.map(collection => ({
      id: collection.id,
      name: collection.name,
      slug: collection.slug,
      description: collection.description,
      productCount: collection._count.products
    }))

    return NextResponse.json(formattedCollections)

  } catch (error) {
    console.error('Error fetching collections:', error)
    
    // Return fallback collections if database fails
    const fallbackCollections = [
      { id: '1', name: 'Yaz 2024', slug: 'yaz-2024', description: 'Yaz koleksiyonu', productCount: 8 },
      { id: '2', name: 'Kış 2024', slug: 'kis-2024', description: 'Kış koleksiyonu', productCount: 6 },
      { id: '3', name: 'Business Chic', slug: 'business-chic', description: 'İş hayatı koleksiyonu', productCount: 4 },
      { id: '4', name: 'Timeless', slug: 'timeless', description: 'Zamansız parçalar', productCount: 5 }
    ]

    return NextResponse.json(fallbackCollections)

  } finally {
    await prisma.$disconnect()
  }
}