import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth/config'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

const seoMetaSchema = z.object({
  title: z.string().min(1, 'Title gereklidir').max(60, 'Title 60 karakterden az olmalıdır'),
  description: z.string().min(1, 'Description gereklidir').max(160, 'Description 160 karakterden az olmalıdır'),
  keywords: z.string().optional(),
  ogTitle: z.string().optional(),
  ogDescription: z.string().optional(),
  ogImage: z.string().optional(),
  canonical: z.string().optional(),
})

export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const page = searchParams.get('page') // e.g., 'home', 'about', 'contact'
    
    if (page) {
      // Get specific page SEO data from settings
      const seoData = await prisma.setting.findUnique({
        where: { key: `seo_${page}` }
      })
      
      if (!seoData) {
        // Return default values for the page
        return NextResponse.json({
          page,
          title: 'Luxe Fashion',
          description: 'Özgün tasarımlar, sınırlı sayıda üretim',
          keywords: '',
          ogTitle: '',
          ogDescription: '',
          ogImage: '',
          canonical: ''
        })
      }
      
      return NextResponse.json(seoData)
    } else {
      // Get all SEO related settings
      const allSeoData = await prisma.setting.findMany({
        where: {
          key: {
            startsWith: 'seo_'
          }
        },
        orderBy: {
          key: 'asc'
        }
      })
      
      return NextResponse.json(allSeoData)
    }

  } catch (error) {
    console.error('SEO fetch error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { page, ...seoData } = body
    
    if (!page) {
      return NextResponse.json({ error: 'Page parametresi gereklidir' }, { status: 400 })
    }

    const validatedData = seoMetaSchema.parse(seoData)

    // Upsert SEO data as setting
    const seoMeta = await prisma.setting.upsert({
      where: { key: `seo_${page}` },
      update: { 
        value: validatedData,
        type: 'JSON'
      },
      create: {
        key: `seo_${page}`,
        value: validatedData,
        type: 'JSON',
        description: `SEO settings for ${page} page`
      }
    })

    return NextResponse.json(seoMeta)

  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation error', details: error.errors }, 
        { status: 400 }
      )
    }
    
    console.error('SEO save error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}