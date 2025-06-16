import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth/config'
import { prisma } from '@/lib/prisma'
import { unlink } from 'fs/promises'
import path from 'path'

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
    
    const media = await prisma.media.findUnique({
      where: { id }
    })

    if (!media) {
      return NextResponse.json({ error: 'Medya bulunamadı' }, { status: 404 })
    }

    return NextResponse.json(media)
  } catch (error) {
    console.error('Media fetch error:', error)
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

    // Check if media exists
    const existingMedia = await prisma.media.findUnique({
      where: { id }
    })

    if (!existingMedia) {
      return NextResponse.json({ error: 'Medya bulunamadı' }, { status: 404 })
    }

    // Delete file from filesystem
    try {
      const filePath = path.join(process.cwd(), 'public', existingMedia.url)
      await unlink(filePath)
    } catch (fileError) {
      console.warn('File deletion warning:', fileError)
      // Continue with database deletion even if file doesn't exist
    }

    // Delete from database
    await prisma.media.delete({
      where: { id }
    })

    return NextResponse.json({ message: 'Medya başarıyla silindi' })
  } catch (error) {
    console.error('Media delete error:', error)
    return NextResponse.json({ error: 'Medya silinirken hata oluştu' }, { status: 500 })
  }
}