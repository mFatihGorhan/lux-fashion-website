import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth/config'

// GET - Footer içeriğini getir
export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Footer içeriğini getir (ilk kayıt)
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
    console.error('Footer GET error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// PUT - Footer içeriğini güncelle
export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    
    const {
      brandTitle,
      brandDescription,
      phone,
      email,
      address,
      workingHours,
      instagramUrl,
      pinterestUrl,
      linkedinUrl,
      copyrightText
    } = body

    // Validation
    if (!brandTitle || !brandDescription || !phone || !email || !address || !workingHours || !copyrightText) {
      return NextResponse.json({ error: 'Required fields missing' }, { status: 400 })
    }

    // İlk footer içeriğini bul
    const existingContent = await prisma.footerContent.findFirst()
    
    let footerContent
    if (existingContent) {
      // Güncelle
      footerContent = await prisma.footerContent.update({
        where: { id: existingContent.id },
        data: {
          brandTitle,
          brandDescription,
          phone,
          email,
          address,
          workingHours,
          instagramUrl: instagramUrl || null,
          pinterestUrl: pinterestUrl || null,
          linkedinUrl: linkedinUrl || null,
          copyrightText
        }
      })
    } else {
      // Yeni oluştur
      footerContent = await prisma.footerContent.create({
        data: {
          brandTitle,
          brandDescription,
          phone,
          email,
          address,
          workingHours,
          instagramUrl: instagramUrl || null,
          pinterestUrl: pinterestUrl || null,
          linkedinUrl: linkedinUrl || null,
          copyrightText
        }
      })
    }

    return NextResponse.json(footerContent)
  } catch (error) {
    console.error('Footer PUT error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}