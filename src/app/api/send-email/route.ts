import { NextRequest, NextResponse } from 'next/server'
import nodemailer from 'nodemailer'

interface EmailData {
  to: string | string[]
  subject: string
  html: string
  text?: string
  replyTo?: string
}

export async function POST(request: NextRequest) {
  try {
    const { to, subject, html, text, replyTo }: EmailData = await request.json()

    // Validate required fields
    if (!to || !subject || !html) {
      return NextResponse.json(
        { error: 'Missing required fields: to, subject, html' },
        { status: 400 }
      )
    }

    // Create transporter
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || 'smtp.gmail.com',
      port: parseInt(process.env.SMTP_PORT || '587'),
      secure: process.env.SMTP_SECURE === 'true', // true for 465, false for other ports
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASSWORD,
      },
    })

    // Verify connection configuration
    try {
      await transporter.verify()
    } catch (error) {
      console.error('SMTP connection failed:', error)
      return NextResponse.json(
        { error: 'Email service unavailable' },
        { status: 503 }
      )
    }

    // Send email
    const info = await transporter.sendMail({
      from: process.env.EMAIL_FROM || 'noreply@luxfashion.com',
      to: Array.isArray(to) ? to.join(', ') : to,
      subject,
      html,
      text,
      replyTo: replyTo || process.env.EMAIL_REPLY_TO,
    })

    console.log('Email sent successfully:', info.messageId)

    return NextResponse.json({
      success: true,
      messageId: info.messageId,
    })

  } catch (error) {
    console.error('Email send error:', error)
    
    // Return different error messages based on error type
    if (error instanceof Error) {
      if (error.message.includes('authentication')) {
        return NextResponse.json(
          { error: 'Email authentication failed' },
          { status: 401 }
        )
      }
      if (error.message.includes('network') || error.message.includes('connection')) {
        return NextResponse.json(
          { error: 'Network error - please try again later' },
          { status: 503 }
        )
      }
    }

    return NextResponse.json(
      { error: 'Failed to send email' },
      { status: 500 }
    )
  }
}