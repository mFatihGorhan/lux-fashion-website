import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth/config'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

const updateContactSchema = z.object({
  isRead: z.boolean().optional(),
  isReplied: z.boolean().optional(),
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
    
    const contactSubmission = await prisma.contactSubmission.findUnique({
      where: { id }
    })

    if (!contactSubmission) {
      return NextResponse.json({ error: 'Contact submission bulunamadı' }, { status: 404 })
    }

    // Mark as read when viewed
    if (!contactSubmission.isRead) {
      await prisma.contactSubmission.update({
        where: { id },
        data: { isRead: true }
      })
      contactSubmission.isRead = true
    }

    return NextResponse.json(contactSubmission)
  } catch (error) {
    console.error('Contact submission fetch error:', error)
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
    const validatedData = updateContactSchema.parse(body)

    // Check if contact submission exists
    const existingSubmission = await prisma.contactSubmission.findUnique({
      where: { id }
    })

    if (!existingSubmission) {
      return NextResponse.json({ error: 'Contact submission bulunamadı' }, { status: 404 })
    }

    const updatedSubmission = await prisma.contactSubmission.update({
      where: { id },
      data: validatedData
    })

    return NextResponse.json(updatedSubmission)
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation error', details: error.errors }, 
        { status: 400 }
      )
    }
    
    console.error('Contact submission update error:', error)
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

    // Check if contact submission exists
    const existingSubmission = await prisma.contactSubmission.findUnique({
      where: { id }
    })

    if (!existingSubmission) {
      return NextResponse.json({ error: 'Contact submission bulunamadı' }, { status: 404 })
    }

    await prisma.contactSubmission.delete({
      where: { id }
    })

    return NextResponse.json({ message: 'Contact submission başarıyla silindi' })
  } catch (error) {
    console.error('Contact submission delete error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}