# Vercel Deployment Rehberi - Lux Fashion Website

## 🚀 Environment Variables

Vercel dashboard'da şu environment variables'ları ekleyin:

### ✅ Gerekli Variables (Production)

```bash
# Database - Prisma Accelerate (✅ Aktif)
DATABASE_URL="prisma+postgres://accelerate.prisma-data.net/?api_key=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhcGlfa2V5IjoiMDFKWFRQQUdEWDBHVDM4V0VaQlMzTjdGRDUiLCJ0ZW5hbnRfaWQiOiIzMjQxOWZmMzMxNDNiNzU5YmJhYjQzZmJkM2M1ODllMTM3MWE3NDE2NTIwY2M4MDg2ZmRlYzI0NWE5ZDM5ZGU2IiwiaW50ZXJuYWxfc2VjcmV0IjoiMTZjZjg5MGYtNGYxYy00MTdiLWEzYWItMmU2ODg1ZjJhYzA5In0.xeU3sL0tBZrSeTFmLxJIkRa1j1mYG-bHKourOyCqlok"

# NextAuth - Production URL ile güncellenecek
NEXTAUTH_URL="https://lux-fashion-website.vercel.app"
NEXTAUTH_SECRET="F1VOcLGbmO5xtmmaGSaYD9amo9Jn8vXYA+sUEmLCc88="

# App Info
NEXT_PUBLIC_APP_NAME="Lux Fashion"
NEXT_PUBLIC_APP_DESCRIPTION="Ulaşılabilir Lüks Moda"
```

### 🔧 Opsiyonel Variables (Şimdilik Boş Bırakabilirsiniz)

```bash
# Cloudinary (Medya Yönetimi için - sonra eklenecek)
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=""
CLOUDINARY_API_KEY=""  
CLOUDINARY_API_SECRET=""

# UploadThing (Alternatif - sonra eklenecek)
UPLOADTHING_SECRET=""
UPLOADTHING_APP_ID=""
```

## 📋 Deployment Adımları

### 1. GitHub Repository'yi Hazırlayın
```bash
# Local değişiklikleri commit edin
git add .
git commit -m "Ready for Vercel deployment 

🚀 Features:
- Dynamic hero section with database
- Product showcase with filtering  
- Category-based product pages
- Product detail pages with WhatsApp integration
- Admin panel with CRUD operations
- Turkish character support fixed
- Responsive design optimization

🔧 Technical:
- Next.js 15 + TypeScript
- Prisma + PostgreSQL + Prisma Accelerate  
- NextAuth.js authentication
- Tailwind CSS v3.4.17
- Full Turkish localization

🌐 Generated with Claude Code"

git push origin main
```

### 2. Vercel'e Bağlayın
- [Vercel Dashboard](https://vercel.com/dashboard) → "Add New" → "Project"
- GitHub repo'nuzu seçin: `lux-fashion-website`
- Framework: **Next.js** (otomatik tespit edilecek)

### 3. Environment Variables Ekleyin
**Project Settings → Environment Variables** bölümünde:

| Variable | Value | Environment |
|----------|-------|-------------|
| `DATABASE_URL` | `prisma+postgres://accelerate.prisma-data.net/?api_key=...` | Production |
| `NEXTAUTH_SECRET` | `F1VOcLGbmO5xtmmaGSaYD9amo9Jn8vXYA+sUEmLCc88=` | Production |
| `NEXTAUTH_URL` | `https://your-project.vercel.app` | Production |

### 4. İlk Deploy
- **Deploy** butonuna tıklayın
- Build logs'ları takip edin
- Deploy tamamlandığında URL'i alın

### 5. Production URL'i Güncelleyin
- Vercel'den aldığınız URL'i (örn: `https://lux-fashion-website.vercel.app`) kopyalayın
- Project Settings → Environment Variables → `NEXTAUTH_URL`'i güncelleyin
- **Redeploy** edin

### 6. Database Seed (Otomatik)
Vercel deploy sırasında otomatik olarak:
- ✅ Prisma generate
- ✅ Next.js build  
- ✅ Database connection
- ✅ Seed data (ilk deploy'da çalışır)

## ✅ Test Checklist

Deploy sonrası test edin:

### 🌐 Frontend Test
- [ ] Ana sayfa yükleniyor: `https://your-site.vercel.app/`
- [ ] Hero slider çalışıyor (dinamik veriler)
- [ ] Featured products gösteriliyor
- [ ] Ürünler sayfası: `/urunler`
- [ ] Ürün detay sayfası: `/urun/siyah-midi-elbise`
- [ ] Kategori sayfası: `/kategori/elbise`
- [ ] WhatsApp butonu çalışıyor
- [ ] Türkçe karakterler düzgün

### 🔐 Admin Test  
- [ ] Admin login: `/admin/login`
- [ ] Login çalışıyor: `admin@luxfashion.com` / `admin123`
- [ ] Dashboard erişimi: `/admin/dashboard`
- [ ] Ürün yönetimi: `/admin/products`
- [ ] Ürün ekleme: `/admin/products/new`

### 🛠️ Technical Test
- [ ] Database connection aktif
- [ ] API endpoints çalışıyor: `/api/products`
- [ ] Responsive design mobilde
- [ ] Console'da hata yok

## 🔧 Troubleshooting

### Build Hatası
- Environment variables doğru mu?
- TypeScript hataları varmı?

### Login Çalışmıyor
- NEXTAUTH_URL doğru mu?
- NEXTAUTH_SECRET ayarlandı mı?
- Database connection aktif mi?

### 500 Error
- Vercel Functions logs'ları kontrol edin
- Database URL doğru mu?

## 📱 Domain Setup (Opsiyonel)

Custom domain için:
1. Vercel Project Settings → Domains
2. Domain ekleyin
3. DNS ayarlarını yapın
4. NEXTAUTH_URL'i custom domain ile güncelleyin