import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

interface SubscribeRequest {
  email: string
  source?: string
  preferences?: {
    newProducts?: boolean
    sales?: boolean
    blog?: boolean
  }
}

export async function POST(request: NextRequest) {
  try {
    const body: SubscribeRequest = await request.json()
    
    if (!body.email || !body.email.trim()) {
      return NextResponse.json(
        { error: 'E-posta adresi gerekli' },
        { status: 400 }
      )
    }

    const email = body.email.trim().toLowerCase()
    
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Geçerli bir e-posta adresi girin' },
        { status: 400 }
      )
    }

    // Check if already subscribed
    const existingSubscriber = await prisma.newsletterSubscriber.findUnique({
      where: { email }
    })

    if (existingSubscriber) {
      if (existingSubscriber.isActive) {
        return NextResponse.json(
          { error: 'Bu e-posta adresi zaten abone' },
          { status: 409 }
        )
      } else {
        // Reactivate subscription
        await prisma.newsletterSubscriber.update({
          where: { email },
          data: {
            isActive: true,
            // source: body.source || 'website',
            // preferences: body.preferences || {
            //   newProducts: true,
            //   sales: true,
            //   blog: true
            // },
            subscribedAt: new Date()
          }
        })

        return NextResponse.json({
          message: 'Aboneliğiniz yeniden etkinleştirildi!',
          success: true
        })
      }
    }

    // Create new subscription
    const subscription = await prisma.newsletterSubscriber.create({
      data: {
        email,
        // source: body.source || 'website',
        // preferences: body.preferences || {
        //   newProducts: true,
        //   sales: true,
        //   blog: true
        // },
        isActive: true,
        subscribedAt: new Date()
      }
    })

    // TODO: Send welcome email
    // await sendWelcomeEmail(email)

    return NextResponse.json({
      message: 'Başarıyla abone oldunuz! Hoş geldin e-postası gönderildi.',
      success: true,
      subscriptionId: subscription.id
    })

  } catch (error) {
    console.error('Newsletter subscription error:', error)
    
    // Handle specific Prisma errors
    if (error && typeof error === 'object' && 'code' in error) {
      if (error.code === 'P2002') {
        return NextResponse.json(
          { error: 'Bu e-posta adresi zaten abone' },
          { status: 409 }
        )
      }
    }

    return NextResponse.json(
      { error: 'Abonelik sırasında bir hata oluştu. Lütfen tekrar deneyin.' },
      { status: 500 }
    )
  } finally {
    await prisma.$disconnect()
  }
}

// Unsubscribe endpoint
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const email = searchParams.get('email')
    const token = searchParams.get('token')

    if (!email) {
      return NextResponse.json(
        { error: 'E-posta adresi gerekli' },
        { status: 400 }
      )
    }

    // Simple token validation - in production, use proper JWT or signed tokens
    const expectedToken = Buffer.from(email).toString('base64')
    if (token !== expectedToken) {
      return NextResponse.json(
        { error: 'Geçersiz abonelik iptali bağlantısı' },
        { status: 401 }
      )
    }

    const subscription = await prisma.newsletterSubscriber.findUnique({
      where: { email: email.toLowerCase() }
    })

    if (!subscription) {
      return NextResponse.json(
        { error: 'Abonelik bulunamadı' },
        { status: 404 }
      )
    }

    await prisma.newsletterSubscriber.update({
      where: { email: email.toLowerCase() },
      data: {
        isActive: false,
        unsubscribedAt: new Date()
      }
    })

    return NextResponse.json({
      message: 'Abonelik başarıyla iptal edildi',
      success: true
    })

  } catch (error) {
    console.error('Newsletter unsubscribe error:', error)
    return NextResponse.json(
      { error: 'Abonelik iptali sırasında bir hata oluştu' },
      { status: 500 }
    )
  } finally {
    await prisma.$disconnect()
  }
}