import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth/config'
import { prisma } from '@/lib/prisma'
import { writeFile, mkdir } from 'fs/promises'
import path from 'path'
import { z } from 'zod'

const mediaSchema = z.object({
  alt: z.string().optional(),
  caption: z.string().optional(),
})

export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '20')
    const type = searchParams.get('type') // 'image', 'video', etc.
    
    const skip = (page - 1) * limit

    // Build where clause
    const where: any = {}
    
    if (type) {
      where.fileType = {
        startsWith: type
      }
    }

    const [mediaFiles, totalCount] = await Promise.all([
      prisma.media.findMany({
        where,
        orderBy: {
          createdAt: 'desc'
        },
        skip,
        take: limit
      }),
      prisma.media.count({ where })
    ])

    return NextResponse.json({
      mediaFiles,
      pagination: {
        page,
        limit,
        total: totalCount,
        totalPages: Math.ceil(totalCount / limit)
      }
    })

  } catch (error) {
    console.error('Media fetch error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const formData = await request.formData()
    const file = formData.get('file') as File
    const alt = formData.get('alt') as string
    const caption = formData.get('caption') as string

    if (!file) {
      return NextResponse.json({ error: 'Dosya gereklidir' }, { status: 400 })
    }

    // Validate file type
    if (!file.type.startsWith('image/')) {
      return NextResponse.json({ error: 'Sadece resim dosyaları yüklenebilir' }, { status: 400 })
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json({ error: 'Dosya boyutu 5MB\'dan küçük olmalıdır' }, { status: 400 })
    }

    // Generate unique filename
    const timestamp = Date.now()
    const extension = path.extname(file.name)
    const filename = `${timestamp}${extension}`
    
    // Create upload directory if it doesn't exist
    const uploadDir = path.join(process.cwd(), 'public', 'uploads')
    try {
      await mkdir(uploadDir, { recursive: true })
    } catch (error) {
      // Directory might already exist
    }

    // Save file
    const filePath = path.join(uploadDir, filename)
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)
    
    await writeFile(filePath, buffer)

    // Save to database
    const media = await prisma.media.create({
      data: {
        url: `/uploads/${filename}`,
        fileName: file.name,
        fileSize: file.size,
        fileType: file.type,
        width: null, // Could be extracted using sharp or similar
        height: null,
        alt: alt || '',
        caption: caption || '',
      }
    })

    return NextResponse.json(media, { status: 201 })

  } catch (error) {
    console.error('Media upload error:', error)
    return NextResponse.json({ error: 'Dosya yüklenirken hata oluştu' }, { status: 500 })
  }
}