import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth/config'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

const settingSchema = z.object({
  key: z.string().min(1, 'Ayar anahtarı gereklidir'),
  value: z.any(),
  type: z.enum(['TEXT', 'NUMBER', 'BOOLEAN', 'JSON', 'HTML']).default('TEXT'),
  description: z.string().optional(),
})

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const settings = await prisma.setting.findMany({
      orderBy: {
        key: 'asc'
      }
    })

    // Convert settings to key-value pairs for easier frontend consumption
    const settingsMap = settings.reduce((acc, setting) => {
      acc[setting.key] = {
        id: setting.id,
        value: setting.value,
        type: setting.type,
        description: setting.description,
        updatedAt: setting.updatedAt
      }
      return acc
    }, {} as Record<string, any>)

    return NextResponse.json(settingsMap)
  } catch (error) {
    console.error('Settings fetch error:', error)
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
    
    // Handle bulk update of settings
    if (Array.isArray(body)) {
      const results = []
      
      for (const settingData of body) {
        const validatedData = settingSchema.parse(settingData)
        
        const setting = await prisma.setting.upsert({
          where: { key: validatedData.key },
          update: {
            value: validatedData.value,
            type: validatedData.type,
            description: validatedData.description,
          },
          create: {
            key: validatedData.key,
            value: validatedData.value,
            type: validatedData.type,
            description: validatedData.description
          }
        })
        
        results.push(setting)
      }
      
      return NextResponse.json(results, { status: 201 })
    }
    
    // Handle single setting
    const validatedData = settingSchema.parse(body)
    
    const setting = await prisma.setting.upsert({
      where: { key: validatedData.key },
      update: {
        value: validatedData.value,
        type: validatedData.type,
        description: validatedData.description,
      },
      create: {
        key: validatedData.key,
        value: validatedData.value,
        type: validatedData.type,
        description: validatedData.description
      }
    })

    return NextResponse.json(setting, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation error', details: error.errors }, 
        { status: 400 }
      )
    }
    
    console.error('Setting create/update error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}