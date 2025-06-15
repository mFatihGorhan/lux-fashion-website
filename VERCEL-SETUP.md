# Vercel Deployment Rehberi

## 🚀 Environment Variables

Vercel dashboard'da şu environment variables'ları ekleyin:

### ✅ Gerekli Variables

```bash
# Database - Prisma Accelerate (zaten var)
DATABASE_URL="prisma+postgres://accelerate.prisma-data.net/?api_key=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhcGlfa2V5IjoiMDFKWFRQQUdEWDBHVDM4V0VaQlMzTjdGRDUiLCJ0ZW5hbnRfaWQiOiIzMjQxOWZmMzMxNDNiNzU5YmJhYjQzZmJkM2M1ODllMTM3MWE3NDE2NTIwY2M4MDg2ZmRlYzI0NWE5ZDM5ZGU2IiwiaW50ZXJuYWxfc2VjcmV0IjoiMTZjZjg5MGYtNGYxYy00MTdiLWEzYWItMmU2ODg1ZjJhYzA5In0.xeU3sL0tBZrSeTFmLxJIkRa1j1mYG-bHKourOyCqlok"

# NextAuth - Production URL ile güncelleyin
NEXTAUTH_URL="https://your-project-name.vercel.app"
NEXTAUTH_SECRET="F1VOcLGbmO5xtmmaGSaYD9amo9Jn8vXYA+sUEmLCc88="
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

### 1. GitHub Repository'yi Vercel'e Bağlayın
- Vercel Dashboard → "Add New" → "Project"
- GitHub repo'nuzu seçin

### 2. Environment Variables Ekleyin
- Project Settings → Environment Variables
- Yukarıdaki variables'ları ekleyin

### 3. Production URL'i Güncelleyin
- Deploy edildikten sonra URL'i alın (örn: `https://lux-fashion-website.vercel.app`)
- NEXTAUTH_URL'i bu URL ile güncelleyin
- Redeploy edin

### 4. Database Seed (İlk Deploy Sonrası)
```bash
# Vercel'de otomatik çalışacak - manual gerekmiyor
```

## ✅ Test Checklist

Deploy sonrası test edin:

- [ ] Ana sayfa yükleniyomu: `/`
- [ ] Admin login sayfası: `/admin/login`
- [ ] Login çalışıyormu: `admin@luxfashion.com` / `admin123`
- [ ] Dashboard erişimi: `/admin/dashboard`
- [ ] Database connection çalışıyormu

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