import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth/config'
import { prisma } from '@/lib/prisma'

export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const status = searchParams.get('status') // 'unread', 'read', 'replied'
    
    const skip = (page - 1) * limit

    // Build where clause
    const where: any = {}
    
    if (status === 'unread') {
      where.isRead = false
    } else if (status === 'read') {
      where.isRead = true
      where.isReplied = false
    } else if (status === 'replied') {
      where.isReplied = true
    }

    // Get contact submissions with pagination
    const [contactSubmissions, totalCount] = await Promise.all([
      prisma.contactSubmission.findMany({
        where,
        orderBy: {
          createdAt: 'desc'
        },
        skip,
        take: limit
      }),
      prisma.contactSubmission.count({ where })
    ])

    // Get counts for status badges
    const statusCounts = await prisma.contactSubmission.groupBy({
      by: ['isRead', 'isReplied'],
      _count: true
    })

    const counts = {
      total: totalCount,
      unread: statusCounts.find(s => !s.isRead)?._count || 0,
      read: statusCounts.find(s => s.isRead && !s.isReplied)?._count || 0,
      replied: statusCounts.find(s => s.isReplied)?._count || 0
    }

    return NextResponse.json({
      contactSubmissions,
      pagination: {
        page,
        limit,
        total: totalCount,
        totalPages: Math.ceil(totalCount / limit)
      },
      counts
    })

  } catch (error) {
    console.error('Contact submissions fetch error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}