import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('<1 Seed data ba_lat1l1yor...')

  // Admin kullan1c1 olu_tur
  const hashedPassword = await bcrypt.hash('admin123', 12)
  
  const admin = await prisma.user.upsert({
    where: { email: 'admin@luxfashion.com' },
    update: {},
    create: {
      email: 'admin@luxfashion.com',
      password: hashedPassword,
      name: 'Lux Fashion Admin',
      role: 'ADMIN',
    },
  })

  console.log(' Admin kullan1c1 olu_turuldu:', admin.email)

  // Kategoriler olu_tur
  const categories = await Promise.all([
    prisma.category.upsert({
      where: { slug: 'elbise' },
      update: {},
      create: {
        name: 'Elbise',
        slug: 'elbise',
        description: '^1k ve zarif elbise koleksiyonu',
        order: 1,
      },
    }),
    prisma.category.upsert({
      where: { slug: 'ceket' },
      update: {},
      create: {
        name: 'Ceket',
        slug: 'ceket',
        description: 'Lüks ceket ve blazer koleksiyonu',
        order: 2,
      },
    }),
    prisma.category.upsert({
      where: { slug: 'pantolon' },
      update: {},
      create: {
        name: 'Pantolon',
        slug: 'pantolon',
        description: 'Kaliteli pantolon ve kuma_ pantolonlar',
        order: 3,
      },
    }),
    prisma.category.upsert({
      where: { slug: 'aksesuar' },
      update: {},
      create: {
        name: 'Aksesuar',
        slug: 'aksesuar',
        description: 'Çanta, ayakkab1 ve dier aksesuarlar',
        order: 4,
      },
    }),
  ])

  console.log(' Kategoriler olu_turuldu:', categories.length)

  // Koleksiyonlar olu_tur
  const collections = await Promise.all([
    prisma.collection.upsert({
      where: { slug: 'kis-2024' },
      update: {},
      create: {
        name: 'K1_ 2024',
        slug: 'kis-2024',
        description: 'K1_ sezonunun en _1k parçalar1',
        season: 'K1_ 2024',
        order: 1,
      },
    }),
    prisma.collection.upsert({
      where: { slug: 'bahar-2024' },
      update: {},
      create: {
        name: 'Bahar 2024',
        slug: 'bahar-2024',
        description: 'Bahar1n taze renkleri ve hafif kuma_lar1',
        season: 'Bahar 2024',
        order: 2,
      },
    }),
    prisma.collection.upsert({
      where: { slug: 'limited-edition' },
      update: {},
      create: {
        name: 'Limited Edition',
        slug: 'limited-edition',
        description: 'S1n1rl1 say1da özel tasar1m parçalar',
        season: 'Özel Koleksiyon',
        order: 3,
      },
    }),
  ])

  console.log(' Koleksiyonlar olu_turuldu:', collections.length)

  // Hero Slides olu_tur
  const heroSlides = await Promise.all([
    prisma.heroSlide.upsert({
      where: { id: 'hero-1' },
      update: {},
      create: {
        id: 'hero-1',
        title: 'Yeni Sezon',
        subtitle: 'Kapsül Koleksiyon',
        description: 'Özgün tasar1mlar, s1n1rl1 say1da üretim',
        imageUrl: '/images/hero-1.jpg',
        imageAlt: 'Lux Fashion K1_ Koleksiyonu',
        gradient: 'linear-gradient(135deg, #1A1A1A 0%, #3A3A3A 100%)',
        ctaText: 'Koleksiyonu Ke_fet',
        ctaLink: '/koleksiyonlar',
        order: 1,
      },
    }),
    prisma.heroSlide.upsert({
      where: { id: 'hero-2' },
      update: {},
      create: {
        id: 'hero-2',
        title: 'Ula_1labilir Lüks',
        subtitle: 'Özel Tasar1mlar',
        description: 'Her parça, bir sanat eseri',
        imageUrl: '/images/hero-2.jpg',
        imageAlt: 'Lux Fashion Özel Tasar1mlar',
        gradient: 'linear-gradient(135deg, #2C1810 0%, #8B6B47 100%)',
        ctaText: 'Teklif Al',
        ctaLink: '/iletisim',
        secondaryCtaText: 'Koleksiyonlar',
        secondaryCtaLink: '/koleksiyonlar',
        order: 2,
      },
    }),
    prisma.heroSlide.upsert({
      where: { id: 'hero-3' },
      update: {},
      create: {
        id: 'hero-3',
        title: 'El 0_çilii',
        subtitle: 'Detaylara Özen',
        description: 'Kaliteli kuma_lar, kusursuz i_çilik',
        imageUrl: '/images/hero-3.jpg',
        imageAlt: 'Lux Fashion El 0_çilii',
        gradient: 'linear-gradient(135deg, #1F1C18 0%, #8B7355 100%)',
        ctaText: 'Hakk1m1zda',
        ctaLink: '/hakkimizda',
        order: 3,
      },
    }),
  ])

  console.log(' Hero slides olu_turuldu:', heroSlides.length)

  // Örnek ürünler olu_tur
  const products = await Promise.all([
    prisma.product.create({
      data: {
        name: 'Siyah Midi Elbise',
        slug: 'siyah-midi-elbise',
        description: 'Zamans1z _1kl11n simgesi, siyah midi elbise. Kaliteli krep kuma_tan üretilmi_, özel kesimi ile vücut hatlar1n1 mükemmel _ekilde saran bu elbise, hem gündüz hem de gece _1kl11 yakal1yor.',
        price: '2,850 TL',
        primaryImage: '/images/products/elbise-1.jpg',
        primaryImageAlt: 'Siyah Midi Elbise - Ön Görünüm',
        hoverImage: '/images/products/elbise-1-hover.jpg',
        hoverImageAlt: 'Siyah Midi Elbise - Arka Görünüm',
        badge: 'Yeni',
        colors: ['#000000', '#1A1A1A'],
        categoryId: categories[0].id, // Elbise
        collectionId: collections[0].id, // K1_ 2024
        featured: true,
        order: 1,
        metaTitle: 'Siyah Midi Elbise | Lux Fashion',
        metaDescription: 'Zamans1z _1kl11n simgesi siyah midi elbise. Kaliteli kuma_ ve özel kesim. Ücretsiz kargo ve kolay iade.',
      },
    }),
    prisma.product.create({
      data: {
        name: 'Ka_mir Triko Ceket',
        slug: 'kasmir-triko-ceket',
        description: '100% ka_mir iplikten örgü ile üretilmi_ premium triko ceket. Yumu_ak dokusu ve s1cakl11 ile k1_ aylar1n1n vazgeçilmez parças1.',
        price: '4,200 TL',
        primaryImage: '/images/products/ceket-1.jpg',
        primaryImageAlt: 'Ka_mir Triko Ceket - Bej',
        hoverImage: '/images/products/ceket-1-hover.jpg',
        hoverImageAlt: 'Ka_mir Triko Ceket - Detay',
        badge: 'Limited Edition',
        colors: ['#D4B5A0', '#8B7355', '#F5F5DC'],
        categoryId: categories[1].id, // Ceket
        collectionId: collections[2].id, // Limited Edition
        featured: true,
        order: 2,
        metaTitle: 'Ka_mir Triko Ceket | Lux Fashion',
        metaDescription: '100% ka_mir premium triko ceket. S1n1rl1 üretim özel koleksiyon parças1.',
      },
    }),
    prisma.product.create({
      data: {
        name: 'Yüksek Bel Kuma_ Pantolon',
        slug: 'yuksek-bel-kumas-pantolon',
        description: '0talyan kuma_1ndan üretilmi_ yüksek bel kesim pantolon. Modern silueti ve konforlu yap1s1 ile ofis _1kl11n1 günlük rahatl1kla bulu_turuyor.',
        price: '1,950 TL',
        primaryImage: '/images/products/pantolon-1.jpg',
        primaryImageAlt: 'Yüksek Bel Kuma_ Pantolon - Lacivert',
        hoverImage: '/images/products/pantolon-1-hover.jpg',
        hoverImageAlt: 'Yüksek Bel Kuma_ Pantolon - Yan Görünüm',
        colors: ['#1B2951', '#4A5568', '#8B8B8B'],
        categoryId: categories[2].id, // Pantolon
        collectionId: collections[1].id, // Bahar 2024
        featured: false,
        order: 3,
        metaTitle: 'Yüksek Bel Kuma_ Pantolon | Lux Fashion',
        metaDescription: '0talyan kuma_1 yüksek bel pantolon. Modern kesim ve üstün konfor.',
      },
    }),
    prisma.product.create({
      data: {
        name: 'Deri Omuz Çantas1',
        slug: 'deri-omuz-cantasi',
        description: 'El yap1m1 0talyan derisi kullan1larak üretilmi_ _1k omuz çantas1. Zamans1z tasar1m1 ve kaliteli i_çilii ile uzun y1llar kullanabileceiniz bir yat1r1m parças1.',
        price: '3,650 TL',
        primaryImage: '/images/products/canta-1.jpg',
        primaryImageAlt: 'Deri Omuz Çantas1 - Kahverengi',
        hoverImage: '/images/products/canta-1-hover.jpg',
        hoverImageAlt: 'Deri Omuz Çantas1 - 0ç Görünüm',
        badge: 'Son Parçalar',
        colors: ['#8B4513', '#A0522D', '#000000'],
        categoryId: categories[3].id, // Aksesuar
        collectionId: collections[0].id, // K1_ 2024
        featured: true,
        order: 4,
        metaTitle: 'El Yap1m1 Deri Omuz Çantas1 | Lux Fashion',
        metaDescription: '0talyan derisi el yap1m1 omuz çantas1. Kaliteli i_çilik ve zamans1z tasar1m.',
      },
    }),
  ])

  console.log(' Ürünler olu_turuldu:', products.length)

  // Blog kategorileri
  const blogCategories = await Promise.all([
    prisma.blogCategory.upsert({
      where: { slug: 'moda-trendleri' },
      update: {},
      create: {
        name: 'Moda Trendleri',
        slug: 'moda-trendleri',
        description: 'En son moda trendleri ve stil önerileri',
        order: 1,
      },
    }),
    prisma.blogCategory.upsert({
      where: { slug: 'stil-rehberi' },
      update: {},
      create: {
        name: 'Stil Rehberi',
        slug: 'stil-rehberi',
        description: 'Ki_isel stil geli_tirme rehberleri',
        order: 2,
      },
    }),
    prisma.blogCategory.upsert({
      where: { slug: 'marka-hikayesi' },
      update: {},
      create: {
        name: 'Marka Hikayesi',
        slug: 'marka-hikayesi',
        description: 'Lux Fashion hikayesi ve deerleri',
        order: 3,
      },
    }),
  ])

  console.log(' Blog kategorileri olu_turuldu:', blogCategories.length)

  // Blog etiketleri
  const tags = await Promise.all([
    prisma.tag.upsert({
      where: { slug: 'kis-modasi' },
      update: {},
      create: { name: 'K1_ Modas1', slug: 'kis-modasi' },
    }),
    prisma.tag.upsert({
      where: { slug: 'stil-onerileri' },
      update: {},
      create: { name: 'Stil Önerileri', slug: 'stil-onerileri' },
    }),
    prisma.tag.upsert({
      where: { slug: 'lux-fashion' },
      update: {},
      create: { name: 'Lux Fashion', slug: 'lux-fashion' },
    }),
  ])

  console.log(' Blog etiketleri olu_turuldu:', tags.length)

  // Blog yaz1lar1
  const blogPosts = await Promise.all([
    prisma.blogPost.create({
      data: {
        title: '2024 K1_ Modas1n1n En Öne Ç1kan Trendleri',
        slug: '2024-kis-modasi-trendleri',
        excerpt: 'Bu k1_ hangi renklerin, desenlerin ve kesimler öne ç1kacak? 2024 k1_ modas1n1n vazgeçilmez trendlerini ke_fedin.',
        content: `
# 2024 K1_ Modas1n1n En Öne Ç1kan Trendleri

Bu sezon moda dünyas1, konfor ve _1kl11 mükemmel _ekilde harmanlayan parçalarla kar_1m1za ç1k1yor. 

## Renk Paleti
2024 k1_ sezonunda **toprak tonlar1** ve **derin mavilar** öne ç1k1yor. Özellikle:
- Kahverengi tonlar1
- Derin ye_il
- Bordo
- Lacivert

## Öne Ç1kan Parçalar
### 1. Ka_mir Kazaklar
Yumu_akl11 ve s1cakl11yla k1_ gard1robunun vazgeçilmezi...

### 2. Uzun Ceketler
Hem koruma hem de _1kl1k salayan uzun kesim ceketler...

## Stil Önerileri
Katmanl1 giyimin doru uygulanmas1 bu sezonun anahtar1.
        `,
        coverImage: '/images/blog/kis-trendleri-2024.jpg',
        coverImageAlt: '2024 K1_ Moda Trendleri',
        readTime: 5,
        featured: true,
        published: true,
        publishedAt: new Date(),
        categoryId: blogCategories[0].id, // Moda Trendleri
        authorId: admin.id,
        tags: {
          connect: [{ id: tags[0].id }, { id: tags[1].id }], // K1_ Modas1, Stil Önerileri
        },
        metaTitle: '2024 K1_ Moda Trendleri | Lux Fashion Blog',
        metaDescription: 'Bu k1_ hangi trendler öne ç1kacak? 2024 k1_ modas1n1n en güncel trendlerini ke_fedin.',
      },
    }),
  ])

  console.log(' Blog yaz1lar1 olu_turuldu:', blogPosts.length)

  // Site ayarlar1
  const settings = await Promise.all([
    prisma.setting.upsert({
      where: { key: 'site_title' },
      update: {},
      create: {
        key: 'site_title',
        value: 'Lux Fashion - Ula_1labilir Lüks',
        type: 'TEXT',
        description: 'Site ba_l11',
      },
    }),
    prisma.setting.upsert({
      where: { key: 'site_description' },
      update: {},
      create: {
        key: 'site_description',
        value: 'Özgün tasar1mlar, s1n1rl1 say1da üretim. Kaliteli kuma_lar ve kusursuz i_çilik.',
        type: 'TEXT',
        description: 'Site aç1klamas1',
      },
    }),
    prisma.setting.upsert({
      where: { key: 'contact_info' },
      update: {},
      create: {
        key: 'contact_info',
        value: {
          email: 'info@luxfashion.com',
          phone: '+90 212 555 0123',
          address: 'Ni_anta_1, 0stanbul',
          socialMedia: {
            instagram: '@luxfashion',
            facebook: 'luxfashiontr',
            twitter: '@luxfashiontr'
          }
        },
        type: 'JSON',
        description: '0leti_im bilgileri',
      },
    }),
  ])

  console.log(' Site ayarlar1 olu_turuldu:', settings.length)

  console.log('<‰ Seed data ba_ar1yla tamamland1!')
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error('L Seed data hatas1:', e)
    await prisma.$disconnect()
    process.exit(1)
  })