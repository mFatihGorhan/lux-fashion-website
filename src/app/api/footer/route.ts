import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET - Public footer content
export async function GET() {
  try {
    let footerContent = await prisma.footerContent.findFirst()
    
    // Eğer kayıt yoksa varsayılan değerlerle oluştur
    if (!footerContent) {
      footerContent = await prisma.footerContent.create({
        data: {
          brandTitle: 'LUXE FASHION',
          brandDescription: 'Ulaşılabilir lüks segmentinde, özgün ve sınırlı sayıda üretilen koleksiyonlarımızla kadın giyiminde fark yaratıyoruz.',
          phone: '+90 555 555 55 55',
          email: 'info@luxefashion.com',
          address: 'Nişantaşı, Abdi İpekçi Cad. No:23\nŞişli, İstanbul',
          workingHours: 'Pazartesi - Cumartesi: 10:00 - 19:00\nPazar: Kapalı',
          instagramUrl: 'https://instagram.com',
          pinterestUrl: 'https://pinterest.com',
          linkedinUrl: 'https://linkedin.com',
          copyrightText: 'Luxe Fashion. Tüm hakları saklıdır.'
        }
      })
    }

    return NextResponse.json(footerContent)
  } catch (error) {
    console.error('Public footer GET error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}