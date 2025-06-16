import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

const contactSchema = z.object({
  name: z.string().min(1, 'İsim alanı zorunludur').max(100, 'İsim çok uzun'),
  email: z.string().email('Geçerli bir e-posta adresi giriniz').max(255, 'E-posta çok uzun'),
  phone: z.string().min(10, 'Telefon numarası en az 10 karakter olmalıdır').max(20, 'Telefon numarası çok uzun'),
  subject: z.string().min(1, 'Konu alanı zorunludur').max(200, 'Konu çok uzun'),
  message: z.string().min(10, 'Mesaj en az 10 karakter olmalıdır').max(2000, 'Mesaj çok uzun'),
})

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const validatedData = contactSchema.parse(body)

    // Save to database
    const contactSubmission = await prisma.contactSubmission.create({
      data: {
        name: validatedData.name,
        email: validatedData.email,
        phone: validatedData.phone,
        subject: validatedData.subject,
        message: validatedData.message,
        isRead: false,
        isReplied: false,
      }
    })

    // TODO: Send email notification to admin (can be implemented later)
    // await sendEmailNotification(contactSubmission)

    return NextResponse.json({ 
      message: 'Mesajınız başarıyla gönderildi. En kısa sürede size dönüş yapacağız.',
      id: contactSubmission.id 
    }, { status: 201 })

  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { 
          error: 'Form validation hatası', 
          details: error.errors.map(err => ({
            field: err.path.join('.'),
            message: err.message
          }))
        }, 
        { status: 400 }
      )
    }
    
    console.error('Contact form error:', error)
    return NextResponse.json(
      { error: 'Form gönderilirken bir hata oluştu. Lütfen tekrar deneyin.' }, 
      { status: 500 }
    )
  }
}

export async function GET() {
  return NextResponse.json(
    { error: 'Method not allowed' }, 
    { status: 405 }
  )
}