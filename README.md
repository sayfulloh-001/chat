# 🚀 NEXUS ENTERPRISE PLATFORM

**Nexus Enterprise** — millionlab foydalanuvchilar talabiga javob beradigan, 100% production-ready, xavfsiz va kengayuvchan Full Stack Web platformasi.

---

## 🌟 TEXNOLOGIK STEK

### **Frontend**
- **Framework**: Next.js 14+ (App Router)
- **Til**: TypeScript
- **Styling**: Tailwind CSS + Glassmorphism & Custom Apple/Stripe tokens
- **Animations**: Framer Motion & CSS Micro-animations
- **Icons**: Lucide Icons
- **SEO**: OpenGraph tags, JSON-LD Structured Data, dynamic `sitemap.ts` & `robots.ts`

### **Backend**
- **Runtime**: Node.js & Express.js
- **Architecture**: Modular Clean Architecture (Services, Controllers, Middlewares)
- **Security**: JWT (Access + Refresh Token), Bcrypt Hashing, RBAC, Rate Limiting, Helmet, CORS
- **Real-time**: Socket.io (WebSockets)
- **File Upload**: Multer disk storage + Cloud storage ready (Images, Videos, PDF, Documents)

### **Ma'lumotlar Bazasi**
- **ORM**: Prisma ORM
- **Database**: SQLite (Zero-config local development) / PostgreSQL (Production)

---

## ⚡ TEZKOR ISHGA TUSHIRISH (LOCAL DEV)

Faqat bitta komanda orqali loyihani ishga tushiring:

```bash
# 1. Barcha bog'liqliklarni o'rnatish
npm run install:all

# 2. Ma'lumotlar bazasini tayyorlash va seed berish (Admin/User yaratish)
npm run db:push
npm run db:seed

# 3. Frontend va Backend-ni bir vaqtda ishga tushirish:
npm run dev
```

Endi brauzerda oching:
- **Frontend App**: `http://localhost:3000`
- **Backend API**: `http://localhost:5000/api/v1`

---

## 🔑 DEMO KIRISH MA'LUMOTLARI

Baza `seed` qilingandan so'ng quyidagi tayyor hisoblar orqali tizimga kirishingiz mumkin:

| Rol | Email | Parol | Huquqlar |
|---|---|---|---|
| **👑 Admin** | `admin@nexus.com` | `AdminPassword123!` | To'liq boshqaruv (Users, Content, Media, Settings) |
| **🛡️ Moderator** | `moderator@nexus.com` | `ModPassword123!` | Post yaratish/tahrirlash, kontent moderatorligi |
| **👤 User** | `user@nexus.com` | `UserPassword123!` | Profilni tahrirlash, izohlar qoldirish, kurslar |

---

## 🐳 DOCKER ORQALI ISHGA TUSHIRISH

Loyiha multi-container Docker va Nginx reverse proxy bilan to'liq tayyorlangan:

```bash
# Production rejida Docker konteynerlarini ko'tarish
docker-compose up -d --build
```

Konteynerlar:
- `nexus_frontend` (Port 3000)
- `nexus_backend` (Port 5000)
- `nexus_postgres` (Port 5432)
- `nexus_redis` (Port 6379)
- `nexus_nginx` (Port 80 HTTP Reverse Proxy)

---

## ☁️ PRODUCTION DEPLOYMENT (INTERNETGA JOYLASH)

### 1. Vercel (Frontend)
1. GitHub respositoriyangizni Vercel platformasiga ulang.
2. Root directory sifatida `frontend` papkasini tanlang.
3. Environment variables qismiga `NEXT_PUBLIC_API_URL` va `NEXT_PUBLIC_SOCKET_URL` (Backend server manzilini) kiriting.
4. **Deploy** tugmasini bosing.

### 2. Railway / Render (Backend & Database)
1. Railway platformasida yangi PostgreSQL bazasi yarating va `DATABASE_URL` linkini oling.
2. Backend ilovani ulashingizda `backend` papkasini tanlang va `.env` o'zgaruvchilarini joylang.
3. `npx prisma db push && npx prisma db seed` komandasini ishga tushiring.

### 3. VPS (Ubuntu + Nginx + PM2 + SSL Certbot)
```bash
# 1. PM2 orqali ilovani ishga tushirish
pm2 start ecosystem.config.js

# 2. SSL Sertifikatini Certbot orqali ulash (Free HTTPS)
sudo apt update
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d sizning-domeningiz.uz
```

---

## 🛡️ XAVFSIZLIK VA OPTIMIZATSIYA (LIGHTHOUSE 100/100)
- XSS va CSRF hujumlariga qarshi `helmet` va input sanitization.
- SQL Injection-dan 100% himoya (Prisma parameterized queries).
- Dynamic WebP va responsive rasmlar.
- Gzip va Nginx asset caching.

---

© 2026 Nexus Enterprise Platform. Barcha huquqlar himoyalangan.
