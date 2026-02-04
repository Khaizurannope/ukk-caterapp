# 🍽️ Go-Ring

Aplikasi pemesanan catering berbasis web yang dibangun dengan **Next.js 16**, **Prisma ORM**, dan **PostgreSQL**. Aplikasi ini mendukung multi-role user (Admin, Owner, Kurir, dan Pelanggan) dengan fitur lengkap untuk manajemen pesanan, pengiriman, dan pembayaran.

---

## 📋 Daftar Isi

- [Fitur](#-fitur)
- [Tech Stack](#-tech-stack)
- [Prasyarat](#-prasyarat)
- [Instalasi](#-instalasi)
- [Konfigurasi Environment](#-konfigurasi-environment)
- [Setup Database](#-setup-database)
- [Menjalankan Aplikasi](#-menjalankan-aplikasi)
- [Struktur Folder](#-struktur-folder)
- [Akun Demo](#-akun-demo)
- [Script yang Tersedia](#-script-yang-tersedia)
- [Deployment](#-deployment)

---

## ✨ Fitur

### 👨‍💼 Admin
- Manajemen paket catering (CRUD)
- Manajemen pelanggan
- Manajemen pesanan dan status
- Assign kurir untuk pengiriman
- Manajemen pembayaran

### 👔 Owner
- Dashboard laporan penjualan
- Monitoring bisnis

### 🚚 Kurir
- Lihat daftar pengiriman yang ditugaskan
- Update status pengiriman
- Upload bukti foto pengiriman

### 👤 Pelanggan
- Registrasi dan login
- Lihat menu paket catering
- Keranjang belanja
- Checkout dan pembayaran (Otomatis menggunakan alamat dari profil)
- Manajemen profil dengan 3 alamat pengiriman
- Upload bukti transfer
- Tracking pesanan
- Riwayat pesanan

---

## 🛠️ Teknologi & Tools

Berikut adalah teknikal stack lengkap dan tools yang digunakan dalam pengembangan aplikasi ini:

### **Core Framework**
| Teknologi | Versi | Kegunaan |
|-----------|-------|----------|
| **[Next.js](https://nextjs.org/)** | 16.1.6 | Framework React full-stack (App Router) |
| **[React](https://react.dev/)** | 19.2.3 | Library UI Komponen |
| **[TypeScript](https://www.typescriptlang.org/)** | 5.x | Bahasa pemrograman dengan Static Typing |

### **Backend & Database**
| Teknologi | Versi | Kegunaan |
|-----------|-------|----------|
| **[Prisma](https://www.prisma.io/)** | 6.19.2 | ORM (Object-Relational Mapping) Type-safe |
| **[PostgreSQL](https://www.postgresql.org/)** | 14+ | Database Relasional (SQL) |
| **[NextAuth.js](https://authjs.dev/)** | 5.0 (beta) | Sistem Autentikasi & Session Management |

### **Frontend & Styling**
| Teknologi | Versi | Kegunaan |
|-----------|-------|----------|
| **[Tailwind CSS](https://tailwindcss.com/)** | 4.x | Utility-first CSS Framework |
| **[Radix UI](https://www.radix-ui.com/)** | - | Headless UI Primitives (Base for Shadcn) |
| **[Shadcn/UI](https://ui.shadcn.com/)** | - | Koleksi Komponen UI Reusable |
| **[Lucide React](https://lucide.dev/)** | 0.563.0 | Library Icon SVG |
| **[Sonner](https://sonner.emilkowal.ski/)** | 2.0.7 | Notifikasi Toast |

### **Form & Validasi**
| Teknologi | Versi | Kegunaan |
|-----------|-------|----------|
| **[React Hook Form](https://react-hook-form.com/)** | 7.71.1 | Manajemen State & Validasi Form |
| **[Zod](https://zod.dev/)** | 4.3.6 | Skema Validasi Data TypeScript-first |
| **[@hookform/resolvers](https://github.com/react-hook-form/resolvers)** | 5.2.2 | Integrasi Zod dengan React Hook Form |

### **Media & Utils**
| Teknologi | Kegunaan |
|-----------|----------|
| **[Cloudinary](https://cloudinary.com/)** | Cloud Storage untuk upload gambar |
| **[Bcrypt.js](https://github.com/dcodeIO/bcrypt.js)** | Hashing password |
| **[Date-fns](https://date-fns.org/)** | Manipulasi & format tanggal |
| **[Clsx & Tailwind Merge](https://github.com/dcastil/tailwind-merge)** | Utilitas penggabungan class CSS kondisional |

### **Development Tools**
Tools yang direkomendasikan untuk pengembangan project ini:
- **Code Editor**: [Visual Studio Code](https://code.visualstudio.com/)
- **Database Client**: 
  - [Prisma Studio](https://www.prisma.io/studio) (Bawaan: `npx prisma studio`)
- **API Testing**: [Postman](https://www.postman.com/) (Opsional)
- **Version Control**: [Git](https://git-scm.com/) & [GitHub](https://github.com/)

---

## 📦 Prasyarat

Pastikan sistem Anda sudah terinstall:

- **Node.js** versi 18.x atau lebih tinggi ([Download](https://nodejs.org/))
- **npm** atau **yarn** atau **pnpm** (package manager)
- **PostgreSQL** versi 14 atau lebih tinggi ([Download](https://www.postgresql.org/download/))
- **Git** ([Download](https://git-scm.com/))
- Akun **Cloudinary** untuk penyimpanan gambar ([Daftar Gratis](https://cloudinary.com/))

### Cek Versi

```bash
node --version   # Minimal v18.x
npm --version    # Minimal v9.x
psql --version   # Minimal v14.x
```

---

## 🚀 Instalasi

### 1. Clone Repository

```bash
git clone https://github.com/username/catering-app.git
cd catering-app
```

### 2. Install Dependencies

Menggunakan npm:
```bash
npm install
```

Atau menggunakan yarn:
```bash
yarn install
```

Atau menggunakan pnpm:
```bash
pnpm install
```

---

## ⚙️ Konfigurasi Environment

### 1. Buat File Environment

Salin file `.env.example` atau buat file baru `.env` di root folder:

```bash
# Windows (PowerShell)
copy .env.example .env

# Linux/Mac
cp .env.example .env
```

### 2. Isi Konfigurasi Environment

Buka file `.env` dan isi dengan konfigurasi berikut:

```env
# =================================
# DATABASE
# =================================
# Format: postgresql://USER:PASSWORD@HOST:PORT/DATABASE?schema=public
DATABASE_URL="postgresql://postgres:password@localhost:5432/catering_db?schema=public"

# =================================
# NEXTAUTH
# =================================
# Generate secret: openssl rand -base64 32
AUTH_SECRET="your-super-secret-key-min-32-characters"

# URL aplikasi (untuk development)
NEXTAUTH_URL="http://localhost:3000"

# =================================
# CLOUDINARY (untuk upload gambar)
# =================================
# Dapatkan dari dashboard Cloudinary: https://console.cloudinary.com/
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME="your-cloud-name"
CLOUDINARY_API_KEY="your-api-key"
CLOUDINARY_API_SECRET="your-api-secret"
```

### 3. Penjelasan Environment Variables

| Variable | Deskripsi | Contoh |
|----------|-----------|--------|
| `DATABASE_URL` | Connection string PostgreSQL | `postgresql://user:pass@localhost:5432/db` |
| `AUTH_SECRET` | Secret key untuk NextAuth (min 32 karakter) | Generate dengan `openssl rand -base64 32` |
| `NEXTAUTH_URL` | Base URL aplikasi | `http://localhost:3000` |
| `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME` | Cloud name Cloudinary | Dari dashboard Cloudinary |
| `CLOUDINARY_API_KEY` | API Key Cloudinary | Dari dashboard Cloudinary |
| `CLOUDINARY_API_SECRET` | API Secret Cloudinary | Dari dashboard Cloudinary |

---

## 🗄️ Setup Database

### 1. Buat Database PostgreSQL

Buka terminal PostgreSQL atau pgAdmin dan buat database baru:

```sql
CREATE DATABASE catering_db;
```

Atau via command line:
```bash
psql -U postgres -c "CREATE DATABASE catering_db;"
```

### 2. Generate Prisma Client

```bash
npx prisma generate
```

### 3. Jalankan Migrasi Database

```bash
npx prisma migrate dev
```

Atau menggunakan script:
```bash
npm run db:push
```

### 4. Seed Data Awal (Opsional tapi Disarankan)

Untuk mengisi data awal (user admin, owner, kurir, paket contoh, dll):

```bash
npm run db:seed
```

### 5. Verifikasi Database (Opsional)

Buka Prisma Studio untuk melihat data di database:

```bash
npm run db:studio
```

Browser akan terbuka di `http://localhost:5555`

---

## ▶️ Menjalankan Aplikasi

### Development Mode

```bash
npm run dev
```

Aplikasi akan berjalan di: **http://localhost:3000**

### Production Mode

1. Build aplikasi:
```bash
npm run build
```

2. Jalankan server production:
```bash
npm run start
```

---

## 📁 Struktur Folder

```
catering-app/
├── prisma/
│   ├── schema.prisma      # Skema database Prisma
│   ├── seed.ts            # Script seed data awal
│   └── migrations/        # File migrasi database
├── public/                # Asset statis (gambar, favicon)
├── src/
│   ├── actions/           # Server actions (backend logic)
│   │   ├── auth-actions.ts
│   │   ├── dashboard-actions.ts
│   │   ├── data-actions.ts
│   │   ├── paket-actions.ts
│   │   ├── pemesanan-actions.ts
│   │   └── pengiriman-actions.ts
│   ├── app/               # App Router (pages & layouts)
│   │   ├── admin/         # Halaman admin
│   │   ├── kurir/         # Halaman kurir
│   │   ├── owner/         # Halaman owner
│   │   ├── pelanggan/     # Halaman pelanggan
│   │   ├── cart/          # Keranjang belanja
│   │   ├── checkout/      # Proses checkout
│   │   ├── menu/          # Katalog menu
│   │   ├── login/         # Halaman login
│   │   ├── register/      # Halaman registrasi
│   │   └── api/           # API routes
│   ├── components/        # Komponen React
│   │   ├── ui/            # UI components (shadcn/ui)
│   │   └── forms/         # Form components
│   ├── lib/               # Utility & konfigurasi
│   │   ├── auth.ts        # Konfigurasi NextAuth
│   │   ├── prisma.ts      # Prisma client instance
│   │   ├── cloudinary.ts  # Konfigurasi Cloudinary
│   │   ├── utils.ts       # Helper functions
│   │   └── validations.ts # Zod schemas
│   └── types/             # TypeScript type definitions
├── .env                   # Environment variables (jangan commit!)
├── .env.example           # Contoh environment variables
├── package.json           # Dependencies & scripts
├── tailwind.config.ts     # Konfigurasi Tailwind CSS
├── tsconfig.json          # Konfigurasi TypeScript
└── next.config.ts         # Konfigurasi Next.js
```

---

## 👥 Akun Demo

Setelah menjalankan seed (`npm run db:seed`), akun berikut tersedia untuk testing:

### Staff (Admin/Owner/Kurir)

| Role | Email | Password |
|------|-------|----------|
| Admin | `admin@catering.com` | `password123` |
| Owner | `owner@catering.com` | `password123` |
| Kurir 1 | `kurir1@catering.com` | `password123` |
| Kurir 2 | `kurir2@catering.com` | `password123` |

### Pelanggan (Customer)

| Nama | Email | Password |
|------|-------|----------|
| Siti Nurhaliza | `siti@gmail.com` | `password123` |
| Joko Widodo | `joko@gmail.com` | `password123` |

---

## 📜 Script yang Tersedia

| Script | Perintah | Deskripsi |
|--------|----------|-----------|
| Dev Server | `npm run dev` | Jalankan development server |
| Build | `npm run build` | Build untuk production |
| Start | `npm run start` | Jalankan production server |
| Lint | `npm run lint` | Jalankan ESLint |
| DB Push | `npm run db:push` | Push schema ke database |
| DB Seed | `npm run db:seed` | Seed data awal (dengan proteksi duplikasi) |
| DB Reset | `npm run db:reset` | Reset TOTAL database (Hapus Semua + Seed) |
| DB Studio | `npm run db:studio` | Buka Prisma Studio |

---

## 🔧 Troubleshooting

### Error: P1001 - Can't reach database server

**Penyebab:** PostgreSQL tidak berjalan atau connection string salah.

**Solusi:**
1. Pastikan PostgreSQL sudah berjalan
2. Cek connection string di `.env`
3. Pastikan port 5432 tidak diblokir firewall

### Error: NEXTAUTH_SECRET missing

**Solusi:** Tambahkan `AUTH_SECRET` di file `.env`

```bash
# Generate secret
openssl rand -base64 32
```

### Error: Cloudinary upload failed

**Solusi:**
1. Pastikan semua kredensial Cloudinary sudah benar
2. Cek kuota upload di dashboard Cloudinary

### Error: Module not found

**Solusi:** Jalankan ulang instalasi

```bash
rm -rf node_modules
rm package-lock.json
npm install
```

---

## 🚀 Deployment

### Environment Variables untuk Production

Pastikan set environment variables berikut di platform hosting:

```env
DATABASE_URL="postgresql://..."
AUTH_SECRET="..."
NEXTAUTH_URL="https://your-domain.com"
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME="..."
CLOUDINARY_API_KEY="..."
CLOUDINARY_API_SECRET="..."
```

