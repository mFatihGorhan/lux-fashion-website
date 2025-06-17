interface EmailConfig {
  smtp: {
    host: string
    port: number
    secure: boolean
    auth: {
      user: string
      pass: string
    }
  }
  from: string
  replyTo?: string
}

// Email configuration - bu bilgiler .env dosyasından gelecek
const emailConfig: EmailConfig = {
  smtp: {
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.SMTP_PORT || '587'),
    secure: process.env.SMTP_SECURE === 'true',
    auth: {
      user: process.env.SMTP_USER || '',
      pass: process.env.SMTP_PASSWORD || ''
    }
  },
  from: process.env.EMAIL_FROM || 'noreply@luxfashion.com',
  replyTo: process.env.EMAIL_REPLY_TO || 'info@luxfashion.com'
}

// Email templates
export const emailTemplates = {
  contactForm: {
    subject: 'Yeni İletişim Formu Mesajı - Lux Fashion',
    html: (data: {
      name: string
      email: string
      phone?: string
      subject?: string
      message: string
    }) => `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background: #1A1A1A; color: white; padding: 20px; text-align: center;">
          <h1 style="margin: 0; font-family: 'Playfair Display', serif;">Lux Fashion</h1>
          <p style="margin: 10px 0 0 0; opacity: 0.8;">Yeni İletişim Mesajı</p>
        </div>
        
        <div style="background: #f8f8f8; padding: 30px; border-left: 4px solid #D4B5A0;">
          <h2 style="color: #1A1A1A; margin-top: 0;">İletişim Bilgileri</h2>
          
          <table style="width: 100%; border-collapse: collapse;">
            <tr style="border-bottom: 1px solid #ddd;">
              <td style="padding: 10px 0; font-weight: bold; color: #666;">Ad Soyad:</td>
              <td style="padding: 10px 0;">${data.name}</td>
            </tr>
            <tr style="border-bottom: 1px solid #ddd;">
              <td style="padding: 10px 0; font-weight: bold; color: #666;">E-posta:</td>
              <td style="padding: 10px 0;"><a href="mailto:${data.email}" style="color: #D4B5A0;">${data.email}</a></td>
            </tr>
            ${data.phone ? `
            <tr style="border-bottom: 1px solid #ddd;">
              <td style="padding: 10px 0; font-weight: bold; color: #666;">Telefon:</td>
              <td style="padding: 10px 0;">${data.phone}</td>
            </tr>
            ` : ''}
            ${data.subject ? `
            <tr style="border-bottom: 1px solid #ddd;">
              <td style="padding: 10px 0; font-weight: bold; color: #666;">Konu:</td>
              <td style="padding: 10px 0;">${data.subject}</td>
            </tr>
            ` : ''}
          </table>
          
          <h3 style="color: #1A1A1A; margin-top: 30px;">Mesaj:</h3>
          <div style="background: white; padding: 20px; border-radius: 8px; border: 1px solid #ddd;">
            ${data.message.replace(/\n/g, '<br>')}
          </div>
          
          <div style="margin-top: 30px; padding: 15px; background: #e8f4fd; border-radius: 8px;">
            <p style="margin: 0; color: #666; font-size: 14px;">
              Bu mesaj <strong>${new Date().toLocaleDateString('tr-TR', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              })}</strong> tarihinde Lux Fashion web sitesi üzerinden gönderilmiştir.
            </p>
          </div>
        </div>
      </div>
    `,
    text: (data: any) => `
      Yeni İletişim Mesajı - Lux Fashion
      
      Ad Soyad: ${data.name}
      E-posta: ${data.email}
      ${data.phone ? `Telefon: ${data.phone}` : ''}
      ${data.subject ? `Konu: ${data.subject}` : ''}
      
      Mesaj:
      ${data.message}
      
      Bu mesaj ${new Date().toLocaleDateString('tr-TR')} tarihinde web sitesi üzerinden gönderilmiştir.
    `
  },

  newsletter: {
    subject: 'Lux Fashion Bültenine Hoş Geldiniz!',
    html: (data: { email: string; name?: string }) => `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: linear-gradient(135deg, #1A1A1A 0%, #D4B5A0 100%); color: white; padding: 40px 20px; text-align: center;">
          <h1 style="margin: 0; font-family: 'Playfair Display', serif; font-size: 32px;">Hoş Geldiniz!</h1>
          <p style="margin: 20px 0 0 0; font-size: 18px; opacity: 0.9;">Lux Fashion ailesine katıldığınız için teşekkürler</p>
        </div>
        
        <div style="padding: 40px 20px; background: #f8f8f8;">
          <div style="background: white; padding: 30px; border-radius: 12px; box-shadow: 0 4px 20px rgba(0,0,0,0.1);">
            <h2 style="color: #1A1A1A; margin-top: 0;">Merhaba ${data.name || 'Değerli Müşterimiz'}!</h2>
            
            <p style="color: #666; line-height: 1.6; font-size: 16px;">
              Lux Fashion bültenine abone olduğunuz için çok teşekkür ederiz. Artık:
            </p>
            
            <ul style="color: #666; line-height: 1.8; font-size: 16px;">
              <li>Yeni koleksiyonlarımızdan ilk siz haberdar olacaksınız</li>
              <li>Özel indirim fırsatlarından yararlanabileceksiniz</li>
              <li>Moda trendleri ve stil önerilerimizi takip edebileceksiniz</li>
              <li>Sadece abonelere özel etkinliklerimize davet alacaksınız</li>
            </ul>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="${process.env.NEXTAUTH_URL || 'https://luxfashion.com'}/koleksiyonlar" 
                 style="display: inline-block; background: #1A1A1A; color: white; padding: 15px 30px; text-decoration: none; border-radius: 6px; font-weight: bold;">
                Koleksiyonlarımızı Keşfedin
              </a>
            </div>
            
            <p style="color: #666; font-size: 14px; text-align: center; margin-top: 30px;">
              Bu e-postayı almak istemiyorsanız, 
              <a href="#" style="color: #D4B5A0;">buradan abonelikten çıkabilirsiniz</a>.
            </p>
          </div>
        </div>
        
        <div style="background: #1A1A1A; color: white; padding: 20px; text-align: center;">
          <p style="margin: 0; opacity: 0.8;">© 2024 Lux Fashion. Tüm hakları saklıdır.</p>
        </div>
      </div>
    `,
    text: (data: any) => `
      Lux Fashion Bültenine Hoş Geldiniz!
      
      Merhaba ${data.name || 'Değerli Müşterimiz'}!
      
      Lux Fashion bültenine abone olduğunuz için çok teşekkür ederiz.
      
      Artık:
      - Yeni koleksiyonlarımızdan ilk siz haberdar olacaksınız
      - Özel indirim fırsatlarından yararlanabileceksiniz
      - Moda trendleri ve stil önerilerimizi takip edebileceksiniz
      - Sadece abonelere özel etkinliklerimize davet alacaksınız
      
      Koleksiyonlarımızı keşfedin: ${process.env.NEXTAUTH_URL || 'https://luxfashion.com'}/koleksiyonlar
      
      © 2024 Lux Fashion. Tüm hakları saklıdır.
    `
  }
}

// Send email function (server-side only)
export async function sendEmail({
  to,
  subject,
  html,
  text,
  replyTo
}: {
  to: string | string[]
  subject: string
  html: string
  text?: string
  replyTo?: string
}) {
  try {
    // Email gönderme işlemi burada yapılacak
    // Bu örnek implementasyon, gerçek SMTP ayarları yapıldığında çalışacak
    
    const response = await fetch('/api/send-email', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        to,
        subject,
        html,
        text,
        replyTo: replyTo || emailConfig.replyTo
      })
    })

    if (!response.ok) {
      throw new Error('Email send failed')
    }

    return { success: true }
  } catch (error) {
    console.error('Email send error:', error)
    return { success: false, error }
  }
}

// Helper functions
export async function sendContactFormEmail(formData: {
  name: string
  email: string
  phone?: string
  subject?: string
  message: string
}) {
  const template = emailTemplates.contactForm
  
  return await sendEmail({
    to: emailConfig.replyTo || 'info@luxfashion.com',
    subject: template.subject,
    html: template.html(formData),
    text: template.text(formData),
    replyTo: formData.email
  })
}

export async function sendNewsletterWelcomeEmail(subscriberData: {
  email: string
  name?: string
}) {
  const template = emailTemplates.newsletter
  
  return await sendEmail({
    to: subscriberData.email,
    subject: template.subject,
    html: template.html(subscriberData),
    text: template.text(subscriberData)
  })
}

// Email validation
export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

export function sanitizeEmailInput(input: string): string {
  return input.trim().toLowerCase()
}