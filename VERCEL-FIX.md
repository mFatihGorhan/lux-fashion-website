# 🚨 VERCEL FIX - URGENT

## Environment Variables Ekle/Güncelle

Vercel Dashboard → Project Settings → Environment Variables

### ✅ EKLE/GÜNCELLE:

```bash
# 1. NEXTAUTH_URL (Production URL ile güncelle)
NEXTAUTH_URL="https://lux-fashion-website-3f36tknxn-fatih-grhans-projects.vercel.app"

# 2. NEXTAUTH_SECRET (Şu an eksik!)
NEXTAUTH_SECRET="F1VOcLGbmO5xtmmaGSaYD9amo9Jn8vXYA+sUEmLCc88="

# 3. DATABASE_URL (Zaten var ama kontrol et)
DATABASE_URL="prisma+postgres://accelerate.prisma-data.net/?api_key=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

## ⚡ Hızlı Adımlar:

1. **Vercel Dashboard**'a git
2. **Environment Variables** bölümünü aç  
3. **Bu 3 değişkeni ekle/güncelle**
4. **Redeploy** et

## 🔍 Problem Analizi:
- ❌ `NEXTAUTH_SECRET` eksik (logs'da NO_SECRET hatası)
- ❌ `NEXTAUTH_URL` localhost ile ayarlı olabilir
- ✅ Database bağlantısı çalışıyor

## ✅ Test:
Deploy sonrası `/admin/login` sayfası çalışacak!