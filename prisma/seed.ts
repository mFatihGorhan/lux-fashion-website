import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Seed data başlatılıyor...')

  // Admin kullanıcı oluştur
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

  console.log('✅ Admin kullanıcı oluşturuldu:', admin.email)

  // Kategoriler oluştur
  const categories = await Promise.all([
    prisma.category.upsert({
      where: { slug: 'elbise' },
      update: {},
      create: {
        name: 'Elbise',
        slug: 'elbise',
        description: 'Şık ve zarif elbise koleksiyonu',
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
        description: 'Kaliteli pantolon ve kumaş pantolonlar',
        order: 3,
      },
    }),
    prisma.category.upsert({
      where: { slug: 'aksesuar' },
      update: {},
      create: {
        name: 'Aksesuar',
        slug: 'aksesuar',
        description: 'Çanta, ayakkabı ve diğer aksesuarlar',
        order: 4,
      },
    }),
  ])

  console.log('✅ Kategoriler oluşturuldu:', categories.length)

  // Koleksiyonlar oluştur
  const collections = await Promise.all([
    prisma.collection.upsert({
      where: { slug: 'kis-2024' },
      update: {},
      create: {
        name: 'Kış 2024',
        slug: 'kis-2024',
        description: 'Kış sezonunun en şık parçaları',
        season: 'Kış 2024',
        order: 1,
      },
    }),
    prisma.collection.upsert({
      where: { slug: 'bahar-2024' },
      update: {},
      create: {
        name: 'Bahar 2024',
        slug: 'bahar-2024',
        description: 'Baharın taze renkleri ve hafif kumaşları',
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
        description: 'Sınırlı sayıda özel tasarım parçalar',
        season: 'Özel Koleksiyon',
        order: 3,
      },
    }),
  ])

  console.log('✅ Koleksiyonlar oluşturuldu:', collections.length)

  // Hero Slides oluştur
  const heroSlides = await Promise.all([
    prisma.heroSlide.upsert({
      where: { id: 'hero-1' },
      update: {},
      create: {
        id: 'hero-1',
        title: 'Yeni Sezon',
        subtitle: 'Kapsül Koleksiyon',
        description: 'Özgün tasarımlar, sınırlı sayıda üretim',
        imageUrl: '/images/hero-1.jpg',
        imageAlt: 'Lux Fashion Kış Koleksiyonu',
        gradient: 'linear-gradient(135deg, #1A1A1A 0%, #3A3A3A 100%)',
        ctaText: 'Koleksiyonu Keşfet',
        ctaLink: '/koleksiyonlar',
        order: 1,
      },
    }),
    prisma.heroSlide.upsert({
      where: { id: 'hero-2' },
      update: {},
      create: {
        id: 'hero-2',
        title: 'Ulaşılabilir Lüks',
        subtitle: 'Özel Tasarımlar',
        description: 'Her parça, bir sanat eseri',
        imageUrl: '/images/hero-2.jpg',
        imageAlt: 'Lux Fashion Özel Tasarımlar',
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
        title: 'El İşçiliği',
        subtitle: 'Detaylara Özen',
        description: 'Kaliteli kumaşlar, kusursuz işçilik',
        imageUrl: '/images/hero-3.jpg',
        imageAlt: 'Lux Fashion El İşçiliği',
        gradient: 'linear-gradient(135deg, #1F1C18 0%, #8B7355 100%)',
        ctaText: 'Hakkımızda',
        ctaLink: '/hakkimizda',
        order: 3,
      },
    }),
  ])

  console.log('✅ Hero slides oluşturuldu:', heroSlides.length)

  // Örnek Ürünler oluştur
  const products = await Promise.all([
    prisma.product.create({
      data: {
        name: 'Siyah Midi Elbise',
        slug: 'siyah-midi-elbise',
        description: 'Zamansız şıklığın simgesi, siyah midi elbise. Kaliteli krep kumaştan üretilmiş, özel kesimi ile vücut hatlarını mükemmel şekilde saran bu elbise, hem gündüz hem de gece şıklığı yakalıyor.',
        price: 2850,
        primaryImage: '/images/products/elbise-1.jpg',
        primaryImageAlt: 'Siyah Midi Elbise - Ön Görünüm',
        hoverImage: '/images/products/elbise-1-hover.jpg',
        hoverImageAlt: 'Siyah Midi Elbise - Arka Görünüm',
        badge: 'Yeni',
        colors: ['#000000', '#1A1A1A'],
        categoryId: categories[0].id, // Elbise
        collectionId: collections[0].id, // Kış 2024
        featured: true,
        order: 1,
        metaTitle: 'Siyah Midi Elbise | Lux Fashion',
        metaDescription: 'Zamansız şıklığın simgesi siyah midi elbise. Kaliteli kumaş ve özel kesim. Ücretsiz kargo ve kolay iade.',
      },
    }),
    prisma.product.create({
      data: {
        name: 'Kaşmir Triko Ceket',
        slug: 'kasmir-triko-ceket',
        description: '100% kaşmir iplikten örgü ile üretilmiş premium triko ceket. Yumuşak dokusu ve sıcaklığı ile kış aylarının vazgeçilmez parçası.',
        price: 4200,
        primaryImage: '/images/products/ceket-1.jpg',
        primaryImageAlt: 'Kaşmir Triko Ceket - Bej',
        hoverImage: '/images/products/ceket-1-hover.jpg',
        hoverImageAlt: 'Kaşmir Triko Ceket - Detay',
        badge: 'Limited Edition',
        colors: ['#D4B5A0', '#8B7355', '#F5F5DC'],
        categoryId: categories[1].id, // Ceket
        collectionId: collections[2].id, // Limited Edition
        featured: true,
        order: 2,
        metaTitle: 'Kaşmir Triko Ceket | Lux Fashion',
        metaDescription: '100% kaşmir premium triko ceket. Sınırlı üretim özel koleksiyon parçası.',
      },
    }),
    prisma.product.create({
      data: {
        name: 'Yüksek Bel Kumaş Pantolon',
        slug: 'yuksek-bel-kumas-pantolon',
        description: 'İtalyan kumaşından üretilmiş yüksek bel kesim pantolon. Modern silueti ve konforlu yapısı ile ofis şıklığını günlük rahatlıkla buluşturuyor.',
        price: 1950,
        primaryImage: '/images/products/pantolon-1.jpg',
        primaryImageAlt: 'Yüksek Bel Kumaş Pantolon - Lacivert',
        hoverImage: '/images/products/pantolon-1-hover.jpg',
        hoverImageAlt: 'Yüksek Bel Kumaş Pantolon - Yan Görünüm',
        colors: ['#1B2951', '#4A5568', '#8B8B8B'],
        categoryId: categories[2].id, // Pantolon
        collectionId: collections[1].id, // Bahar 2024
        featured: false,
        order: 3,
        metaTitle: 'Yüksek Bel Kumaş Pantolon | Lux Fashion',
        metaDescription: 'İtalyan kumaşı yüksek bel pantolon. Modern kesim ve üstün konfor.',
      },
    }),
    prisma.product.create({
      data: {
        name: 'Deri Omuz Çantası',
        slug: 'deri-omuz-cantasi',
        description: 'El yapımı İtalyan derisi kullanılarak üretilmiş şık omuz çantası. Zamansız tasarımı ve kaliteli işçiliği ile uzun yıllar kullanabileceğiniz bir yatırım parçası.',
        price: 3650,
        primaryImage: '/images/products/canta-1.jpg',
        primaryImageAlt: 'Deri Omuz Çantası - Kahverengi',
        hoverImage: '/images/products/canta-1-hover.jpg',
        hoverImageAlt: 'Deri Omuz Çantası - İç Görünüm',
        badge: 'Son Parçalar',
        colors: ['#8B4513', '#A0522D', '#000000'],
        categoryId: categories[3].id, // Aksesuar
        collectionId: collections[0].id, // Kış 2024
        featured: true,
        order: 4,
        metaTitle: 'El Yapımı Deri Omuz Çantası | Lux Fashion',
        metaDescription: 'İtalyan derisi el yapımı omuz çantası. Kaliteli işçilik ve zamansız tasarım.',
      },
    }),
  ])

  console.log('✅ Ürünler oluşturuldu:', products.length)

  // Blog kategorileri oluştur
  const blogCategories = await Promise.all([
    prisma.blogCategory.create({
      data: {
        name: 'Moda Trendleri',
        slug: 'moda-trendleri',
        description: 'En güncel moda trendleri ve stil önerileri',
        order: 1,
      },
    }),
    prisma.blogCategory.create({
      data: {
        name: 'Stil Rehberi',
        slug: 'stil-rehberi',
        description: 'Kişisel stil geliştirme ve kombinasyon önerileri',
        order: 2,
      },
    }),
    prisma.blogCategory.create({
      data: {
        name: 'Lux Fashion',
        slug: 'lux-fashion',
        description: 'Lux Fashion hakkında haberler ve güncellemeler',
        order: 3,
      },
    }),
  ])

  console.log('✅ Blog kategorileri oluşturuldu:', blogCategories.length)

  // Blog etiketleri oluştur
  const blogTags = await Promise.all([
    prisma.tag.create({
      data: {
        name: 'Kış Modası',
        slug: 'kis-modasi',
      },
    }),
    prisma.tag.create({
      data: {
        name: 'Stil Önerileri',
        slug: 'stil-onerileri',
      },
    }),
    prisma.tag.create({
      data: {
        name: 'Trend',
        slug: 'trend',
      },
    }),
  ])

  console.log('✅ Blog etiketleri oluşturuldu:', blogTags.length)

  // Örnek blog yazısı oluştur
  const blogPosts = await Promise.all([
    prisma.blogPost.create({
      data: {
        title: 'Kış 2024 Moda Trendleri',
        slug: 'kis-2024-moda-trendleri',
        excerpt: 'Bu kış sezonu için öne çıkan moda trendlerini ve stil önerilerini keşfedin.',
        content: 'Kış 2024 sezonu, klasik şıklık ile modern detayların mükemmel birleşimini sunuyor. Bu yazımızda, sezonun en öne çıkan trendlerini ve bunları günlük gardırobunuza nasıl entegre edebileceğinizi keşfedeceksiniz.',
        coverImage: '/images/blog/kis-2024-trendleri.jpg',
        readTime: 5,
        published: true,
        categoryId: blogCategories[0].id,
        authorId: admin.id,
        metaTitle: 'Kış 2024 Moda Trendleri | Lux Fashion Blog',
        metaDescription: 'Kış 2024 sezonunun en öne çıkan moda trendleri ve stil önerileri.',
      },
    }),
  ])

  console.log('✅ Blog yazıları oluşturuldu:', blogPosts.length)

  // Site ayarları oluştur
  const siteSettings = await Promise.all([
    prisma.setting.upsert({
      where: { key: 'site_title' },
      update: {},
      create: {
        key: 'site_title',
        value: 'Lux Fashion - Ulaşılabilir Lüks',
        type: 'TEXT',
      },
    }),
    prisma.setting.upsert({
      where: { key: 'site_description' },
      update: {},
      create: {
        key: 'site_description',
        value: 'Özgün tasarımlar, sınırlı sayıda üretim. Her parça özenle seçilmiş kaliteli kumaşlar ile üretiliyor.',
        type: 'TEXT',
      },
    }),
    prisma.setting.upsert({
      where: { key: 'contact_phone' },
      update: {},
      create: {
        key: 'contact_phone',
        value: '+90 555 555 55 55',
        type: 'TEXT',
      },
    }),
  ])

  console.log('✅ Site ayarları oluşturuldu:', siteSettings.length)

  console.log('🎉 Seed data başarıyla tamamlandı!')
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })