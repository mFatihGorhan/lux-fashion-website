import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth/config'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'
import bcrypt from 'bcryptjs'

const authorSchema = z.object({
  name: z.string().min(1, 'Ad gereklidir'),
  email: z.string().email('Geçerli bir email adresi gereklidir'),
  password: z.string().min(6, 'Şifre en az 6 karakter olmalıdır'),
  role: z.enum(['ADMIN', 'EDITOR', 'VIEWER'], {
    errorMap: () => ({ message: 'Geçerli bir rol seçiniz' })
  }),
  image: z.string().url().optional().or(z.literal(''))
})

const authorUpdateSchema = z.object({
  name: z.string().min(1, 'Ad gereklidir').optional(),
  email: z.string().email('Geçerli bir email adresi gereklidir').optional(),
  role: z.enum(['ADMIN', 'EDITOR', 'VIEWER'], {
    errorMap: () => ({ message: 'Geçerli bir rol seçiniz' })
  }).optional(),
  image: z.string().url().optional().or(z.literal(''))
})

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const search = searchParams.get('search')

    const skip = (page - 1) * limit

    const where: any = {}

    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } }
      ]
    }

    const [authors, total] = await Promise.all([
      prisma.user.findMany({
        where,
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
        },
        orderBy: [
          { role: 'asc' },
          { createdAt: 'desc' }
        ],
        skip,
        take: limit
      }),
      prisma.user.count({ where })
    ])

    const totalPages = Math.ceil(total / limit)

    return NextResponse.json({
      authors,
      pagination: {
        page,
        limit,
        total,
        totalPages
      }
    })

  } catch (error) {
    console.error('Authors fetch error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const validatedData = authorSchema.parse(body)

    // Check if email already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: validatedData.email }
    })

    if (existingUser) {
      return NextResponse.json({ error: 'Bu email adresi zaten kullanılıyor' }, { status: 400 })
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(validatedData.password, 12)

    const author = await prisma.user.create({
      data: {
        name: validatedData.name,
        email: validatedData.email,
        password: hashedPassword,
        role: validatedData.role,
        image: validatedData.image || null
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

    return NextResponse.json(author, { status: 201 })

  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({
        error: 'Validation error',
        details: error.errors
      }, { status: 400 })
    }

    console.error('Author creation error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}