<div align="center">

# 🎬 XII Cinema Platform

**Platform Ekosistem Bioskop Modern Indonesia**

Monorepo berisi Backend API, Admin Web, dan Mobile App untuk sistem pemesanan tiket bioskop **XII (Dua Belas)** — plesetan dari XXI.

[![Bun](https://img.shields.io/badge/Runtime-Bun_1.3+-black?logo=bun)](https://bun.sh)
[![ElysiaJS](https://img.shields.io/badge/Framework-ElysiaJS-purple)](https://elysiajs.com)
[![Next.js](https://img.shields.io/badge/Web-Next.js_16-black?logo=next.js)](https://nextjs.org)
[![Flutter](https://img.shields.io/badge/Mobile-Flutter_3-blue?logo=flutter)](https://flutter.dev)
[![PostgreSQL](https://img.shields.io/badge/Database-PostgreSQL_18-blue?logo=postgresql)](https://postgresql.org)
[![Drizzle](https://img.shields.io/badge/ORM-Drizzle-green)](https://orm.drizzle.team)

</div>

---

## 📋 Daftar Isi

- [Tentang Project](#-tentang-project)
- [Ekosistem Aplikasi](#-ekosistem-aplikasi)
- [Tech Stack](#-tech-stack)
- [Struktur Monorepo](#-struktur-monorepo)
- [Struktur Database](#-struktur-database)
- [Prerequisites](#-prerequisites)
- [Cara Menjalankan (Development)](#-cara-menjalankan-development)
- [Konfigurasi Environment](#-konfigurasi-environment)
- [Perintah Database](#-perintah-database)
- [Alur Bisnis Utama](#-alur-bisnis-utama)
- [API Documentation](#-api-documentation)
- [Konvensi Kode](#-konvensi-kode)
- [Roadmap](#-roadmap)
- [Kontribusi](#-kontribusi)

---

## 🎯 Tentang Project

**XII (Dua Belas)** adalah platform bioskop terpadu yang dibangun dari nol menggunakan teknologi modern. Platform ini menyelesaikan tiga masalah utama dalam industri bioskop Indonesia:

1. **Untuk Operator**: Satu dashboard terpadu untuk mengelola seluruh cabang bioskop — mulai dari setting jadwal, konfigurasi kursi, hingga laporan pendapatan real-time.
2. **Untuk Pelanggan**: Pengalaman memesan tiket yang mulus via aplikasi mobile atau web — pilih kursi, bayar, dan langsung dapat QR code tiket.
3. **Untuk Bisnis**: Ekosistem yang scalable dan bisa di-white-label, dengan fitur loyalitas poin, manajemen F&B, dan analitik mendalam.

### Fitur Utama

| Kategori | Fitur |
|---|---|
| 🎫 **Tiket** | Pemilihan kursi real-time, seat locking 10 menit, QR code tiket digital |
| 💳 **Pembayaran** | Midtrans (GoPay, QRIS, OVO, VA Bank, Kartu Kredit) |
| 🍿 **F&B** | Pemesanan makanan & minuman sebelum masuk studio |
| 🏆 **Loyalitas** | XII Points, 4 tier membership (Classic → Platinum) |
| 🎟️ **Promo** | Sistem voucher fleksibel (persentase, nominal, free item) |
| 📊 **Analitik** | Dashboard real-time, laporan harian/bulanan, occupancy rate |
| 🔔 **Notifikasi** | Push notification, email, in-app (pengingat film, promo) |
| 📍 **Multi-lokasi** | Hierarki Kota → Mall → Bioskop → Studio → Kursi |

---

## 📱 Ekosistem Aplikasi

```
┌─────────────────────────────────────────────────────────┐
│                     XII PLATFORM                        │
│                                                         │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  │
│  │  Admin Web   │  │ Customer Web │  │ Mobile App   │  │
│  │  (Next.js)   │  │  (Next.js)   │  │  (Flutter)   │  │
│  │              │  │              │  │ iOS & Android│  │
│  │  • Kelola    │  │  • Browse    │  │  • Browse    │  │
│  │    jadwal    │  │    film      │  │    film      │  │
│  │  • Set harga │  │  • Pesan     │  │  • Pesan     │  │
│  │  • Analitik  │  │    tiket     │  │    tiket     │  │
│  │  • Scan QR   │  │  • Akun      │  │  • Scan QR   │  │
│  └──────────────┘  └──────────────┘  └──────────────┘  │
│           │                │                │           │
│           └────────────────┴────────────────┘           │
│                            │                            │
│                   ┌────────▼────────┐                   │
│                   │  Backend API    │                   │
│                   │  (ElysiaJS/Bun) │                   │
│                   │  + Drizzle ORM  │                   │
│                   └────────┬────────┘                   │
│                            │                            │
│                   ┌────────▼────────┐                   │
│                   │   PostgreSQL    │                   │
│                   │  26 Tabel       │                   │
│                   │  m_ | t_ | r_  │                   │
│                   └─────────────────┘                   │
└─────────────────────────────────────────────────────────┘
```

---

## 🛠️ Tech Stack

### Backend (`apps/api`)

| Layer | Teknologi | Versi | Keterangan |
|---|---|---|---|
| Runtime | **Bun** | 1.3+ | Pengganti Node.js, 3-5x lebih cepat |
| Framework | **ElysiaJS** | latest | Web framework untuk Bun, dengan type-safety penuh |
| ORM | **Drizzle ORM** | ^0.45 | Type-safe SQL query builder |
| Database | **PostgreSQL** | 18 | Primary database |
| Auth | JWT + bcrypt | - | Access token 15m, Refresh token 7d |
| Pembayaran | **Midtrans** | - | Payment gateway Indonesia |
| Storage | **Cloudinary** | - | Upload & CDN gambar (poster, F&B) |
| Email | **Resend** | - | Email transaksional (konfirmasi booking) |
| Push Notif | **Firebase (FCM)** | - | Push notification iOS & Android |

### Frontend Web (`apps/web`)

| Layer | Teknologi | Versi | Keterangan |
|---|---|---|---|
| Framework | **Next.js** | 16.3.0 | SSR + App Router |
| UI | **React** | 19.2.8 | Library UI |
| Styling | **Tailwind CSS** | v4 | Utility-first CSS |
| API Client | **Elysia Eden** | ^1.4.9 | Type-safe client ke backend |
| Language | **TypeScript** | ^5 | Static typing |

### Mobile (`apps/mobile`)

| Layer | Teknologi | Keterangan |
|---|---|---|
| Framework | **Flutter** | Cross-platform iOS & Android |
| Language | **Dart** | Bahasa pemrograman Flutter |
| State Mgmt | **BLoC / Riverpod** | Reactive state management |
| Payment | **Midtrans SDK** | Native payment UI |
| Push Notif | **Firebase Messaging** | Push notification |

---

## 📁 Struktur Monorepo

```
bioskop-monorepo/
│
├── 📄 package.json              # Root workspace config (Bun Workspaces)
├── 📄 tsconfig.json             # Root TypeScript config
├── 📄 bun.lock                  # Lockfile
├── 📄 PRD.md                    # Product Requirements Document
├── 📄 README.md                 # Dokumen ini
│
└── apps/
    │
    ├── api/                     # 🔵 Backend API (ElysiaJS + Bun)
    │   ├── .env.example         # Template environment variables
    │   ├── drizzle.config.ts    # Konfigurasi Drizzle ORM
    │   ├── package.json
    │   ├── tsconfig.json
    │   └── src/
    │       ├── index.ts         # Entry point (Elysia app)
    │       └── db/
    │           ├── index.ts     # Koneksi database
    │           └── schema/
    │               ├── index.ts                      # Barrel export
    │               ├── enums.ts                      # Semua PostgreSQL Enum
    │               ├── master/                       # Tabel m_*
    │               │   ├── m_locations.ts            # Provinsi & Kota
    │               │   ├── m_cinemas.ts              # Mall, Bioskop, Studio, Kursi
    │               │   ├── m_movies.ts               # Film, Genre, Cast
    │               │   ├── m_users.ts                # User & Devices
    │               │   └── m_commerce.ts             # F&B, Voucher, Price Rules
    │               ├── transaction/                  # Tabel t_*
    │               │   ├── t_showtimes.ts            # Jadwal & Seat Locking (KRITIS)
    │               │   ├── t_bookings.ts             # Booking, Items, Foods, Reviews
    │               │   ├── t_payments.ts             # Pembayaran & Log Midtrans
    │               │   └── t_user_activity.ts        # Poin, Notif, OTP, Token
    │               └── report/                       # Tabel r_*
    │                   └── r_analytics.ts            # Laporan Aggregasi
    │
    ├── web/                     # 🟢 Frontend Web (Next.js)
    │   ├── package.json
    │   ├── next.config.ts
    │   ├── tailwind.config.*
    │   └── src/
    │       └── app/             # App Router (Next.js)
    │
    └── mobile/                  # 🟡 Mobile App (Flutter)
        ├── pubspec.yaml
        └── lib/
            └── main.dart
```

---

## 🗄️ Struktur Database

Semua tabel menggunakan konvensi prefix berdasarkan kategori data:

| Prefix | Kategori | Tabel |
|---|---|---|
| `m_` | **Master Data** | Data statis yang dikelola admin |
| `t_` | **Transaction Data** | Data aktivitas dan transaksi harian |
| `r_` | **Report Data** | Aggregasi untuk laporan & dashboard |

### Diagram Hierarki

```
m_provinces → m_cities → m_malls → m_cinemas → m_studios → m_seats
                                                     ↓             ↓
                                               t_showtimes → t_showtime_seats
                                                     ↓         (seat locking)
m_movies ──────────────────────────────────────────┘
                                                     ↓
m_users ─────────────────────────────────────── t_bookings
                                                     ├── t_booking_items  (tiket per kursi + QR code)
                                                     ├── t_booking_foods  (pesanan F&B)
                                                     └── t_payments       (Midtrans)
```

### Daftar Lengkap Tabel (26 Tabel)

<details>
<summary>📊 Master Data (m_) — 14 Tabel</summary>

| Tabel | Deskripsi |
|---|---|
| `m_provinces` | Provinsi di Indonesia |
| `m_cities` | Kota/Kabupaten |
| `m_malls` | Data Mall/Venue |
| `m_cinemas` | Bioskop XII per Mall |
| `m_studios` | Studio/Aula per Bioskop |
| `m_seats` | Denah Kursi (STATIC — posisi fisik) |
| `m_genres` | Genre film |
| `m_movies` | Katalog film |
| `m_movie_genres` | Junction film ↔ genre |
| `m_movie_casts` | Pemeran & kru |
| `m_users` | Semua pengguna (customer + staff) |
| `m_user_devices` | Device untuk push notifikasi |
| `m_food_items` | Menu F&B per bioskop |
| `m_vouchers` | Kode voucher & promo |
| `m_price_rules` | Aturan harga dinamis |
| `m_national_holidays` | Hari libur nasional |

</details>

<details>
<summary>💳 Transaction Data (t_) — 12 Tabel</summary>

| Tabel | Deskripsi |
|---|---|
| `t_showtimes` | Jadwal tayang film |
| `t_showtime_seats` | **[KRITIS]** Status kursi real-time per jadwal |
| `t_bookings` | Header transaksi booking |
| `t_booking_items` | Tiket per kursi (dengan QR code unik) |
| `t_booking_foods` | Item F&B yang dipesan |
| `t_movie_reviews` | Ulasan film oleh pelanggan |
| `t_payments` | Transaksi pembayaran Midtrans |
| `t_payment_logs` | Log webhook & event Midtrans |
| `t_point_transactions` | Ledger poin loyalitas |
| `t_voucher_usages` | Log penggunaan voucher |
| `t_notifications` | Riwayat notifikasi terkirim |
| `t_otp_codes` | Kode OTP untuk verifikasi |
| `t_refresh_tokens` | JWT refresh token |
| `t_ticket_validations` | Log scan tiket di pintu masuk |

</details>

<details>
<summary>📈 Report Data (r_) — 6 Tabel</summary>

| Tabel | Granularitas | Deskripsi |
|---|---|---|
| `r_daily_sales` | Harian per bioskop | Revenue, tiket, pelanggan |
| `r_movie_performance` | Harian per film | Occupancy rate, revenue |
| `r_studio_occupancy` | Per showtime | Diupdate real-time |
| `r_monthly_summary` | Bulanan per bioskop | Rekapitulasi lengkap |
| `r_user_activity_summary` | Bulanan per kota | MAU, tier loyalty |
| `r_food_sales` | Harian per item | Kuantitas & revenue F&B |

</details>

---

## ⚙️ Prerequisites

Pastikan tools berikut sudah terinstall di sistem kamu:

| Tool | Versi Minimum | Link Download | Cek Instalasi |
|---|---|---|---|
| **Bun** | 1.3+ | [bun.sh](https://bun.sh) | `bun --version` |
| **PostgreSQL** | 15+ | [postgresql.org](https://www.postgresql.org/download/) | `psql --version` |
| **Flutter** | 3.x | [flutter.dev](https://flutter.dev/docs/get-started/install) | `flutter --version` |
| **Git** | 2.x+ | [git-scm.com](https://git-scm.com) | `git --version` |

---

## 🚀 Cara Menjalankan (Development)

### 1. Clone Repository

```bash
git clone https://github.com/ReyCannavaro/bioskop-monorepo.git
cd bioskop-monorepo
```

### 2. Install Semua Dependencies (dari root)

```bash
bun install
```

> Bun Workspaces akan otomatis menginstall dependencies di semua `apps/*`.

### 3. Setup Database

Buat database baru di PostgreSQL lokal kamu:

```sql
-- Jalankan di psql atau pgAdmin
CREATE DATABASE xii_cinema_db;
```

### 4. Setup Environment Variables (Backend API)

```bash
cd apps/api

# Salin template
copy .env.example .env   # Windows
# atau
cp .env.example .env     # Mac/Linux

# Edit file .env dengan text editor
# Minimal isi DATABASE_URL dan JWT_SECRET
```

Contoh isi `.env` untuk development lokal:

```env
DATABASE_URL=postgresql://postgres:password@localhost:5432/xii_cinema_db
JWT_SECRET=ini_adalah_secret_key_yang_panjang_dan_aman_untuk_development
QR_SIGNING_SECRET=ini_adalah_secret_key_khusus_qr_code_yang_berbeda
NODE_ENV=development
PORT=3000
```

### 5. Push Schema ke Database

```bash
# Masih di dalam apps/api
bun run db:push
```

Perintah ini akan membuat seluruh 26 tabel secara otomatis di database kamu.

### 6. Jalankan Backend API

```bash
# Di dalam apps/api
bun run dev
```

API berjalan di: **http://localhost:3000**

### 7. Jalankan Web (Next.js)

```bash
# Di dalam apps/web (terminal baru)
bun run dev
```

Web berjalan di: **http://localhost:3001**

### 8. Jalankan Mobile (Flutter)

```bash
# Di dalam apps/mobile (terminal baru)
flutter run
```

---

## 🔧 Konfigurasi Environment

### `apps/api/.env`

File `.env` lengkap dengan penjelasan setiap variabel:

```env
# ─── App ──────────────────────────────────────────────────────────────────────
PORT=3000
NODE_ENV=development
APP_URL=http://localhost:3000

# ─── Database ─────────────────────────────────────────────────────────────────
# Format: postgresql://USER:PASSWORD@HOST:PORT/DATABASE_NAME
DATABASE_URL=postgresql://postgres:password@localhost:5432/xii_cinema_db

# ─── JWT ──────────────────────────────────────────────────────────────────────
# Generate random key: openssl rand -hex 32
JWT_SECRET=ganti_dengan_string_random_panjang_minimal_32_karakter
JWT_ACCESS_EXPIRY=15m      # Access token expire dalam 15 menit
JWT_REFRESH_EXPIRY=7d      # Refresh token expire dalam 7 hari

# ─── QR Code ──────────────────────────────────────────────────────────────────
# Key ini berbeda dari JWT_SECRET (untuk keamanan berlapis)
QR_SIGNING_SECRET=ganti_dengan_secret_lain_khusus_untuk_qr_code

# ─── Midtrans ─────────────────────────────────────────────────────────────────
# Daftar di: https://dashboard.midtrans.com → Settings → Access Keys
MIDTRANS_SERVER_KEY=SB-Mid-server-xxxxxxxxxxxxxxxxxxxxxx
MIDTRANS_CLIENT_KEY=SB-Mid-client-xxxxxxxxxxxxxxxxxxxxxx
MIDTRANS_IS_PRODUCTION=false

# ─── Cloudinary ───────────────────────────────────────────────────────────────
# Daftar di: https://cloudinary.com (gratis 25GB)
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=123456789012345
CLOUDINARY_API_SECRET=your_api_secret_here

# ─── Firebase ─────────────────────────────────────────────────────────────────
# Firebase Console → Project Settings → Service Accounts → Generate Key
FIREBASE_PROJECT_ID=your-firebase-project-id
FIREBASE_CLIENT_EMAIL=firebase-adminsdk@your-project.iam.gserviceaccount.com
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYOUR_KEY\n-----END PRIVATE KEY-----\n"

# ─── Resend (Email) ───────────────────────────────────────────────────────────
# Daftar di: https://resend.com (gratis 3.000 email/bulan)
RESEND_API_KEY=re_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
RESEND_FROM_EMAIL=noreply@xii.id
RESEND_FROM_NAME=XII Cinema

# ─── TMDB (Opsional) ──────────────────────────────────────────────────────────
# Untuk auto-fill metadata film dari The Movie Database
TMDB_API_KEY=your_tmdb_api_key_here

# ─── CORS ─────────────────────────────────────────────────────────────────────
ALLOWED_ORIGINS=http://localhost:3001,http://localhost:3000
```

> **Untuk development**, hanya `DATABASE_URL` dan `JWT_SECRET` yang wajib diisi dulu. Variabel lain bisa diisi saat fitur terkait akan dikerjakan.

---

## 🗃️ Perintah Database

Semua perintah dijalankan dari dalam folder `apps/api`:

```bash
# Generate file migrasi SQL dari perubahan schema TypeScript
bun run db:generate

# Jalankan file migrasi ke database
bun run db:migrate

# Push schema langsung ke DB tanpa file migrasi (untuk development)
bun run db:push

# Buka Drizzle Studio — GUI browser untuk melihat & edit data database
bun run db:studio

# Introspect database yang sudah ada → generate schema TypeScript
bun run db:introspect
```

### Kapan Pakai Apa?

| Perintah | Kapan Digunakan |
|---|---|
| `db:push` | Development awal — cepat, langsung apply ke DB |
| `db:generate` | Setelah schema stabil — buat file migrasi SQL |
| `db:migrate` | Staging & Production — jalankan migrasi yang sudah ada |
| `db:studio` | Debugging — lihat isi database via GUI |

---

## 🔄 Alur Bisnis Utama

### Alur Pemesanan Tiket (Happy Path)

```
User
 │
 ├─ [1] Browse film & pilih jadwal (GET /movies, GET /showtimes)
 │
 ├─ [2] Buka denah kursi (GET /showtimes/:id/seats via WebSocket)
 │       └─ Kursi ter-update real-time setiap ada perubahan status
 │
 ├─ [3] Pilih kursi → Lock sementara (POST /bookings/lock-seats)
 │       └─ DB: UPDATE t_showtime_seats SET status='LOCKED', locked_until=NOW()+10min
 │       └─ Timer 10 menit mulai berjalan
 │
 ├─ [4] Isi F&B & voucher → Lihat ringkasan harga
 │
 ├─ [5] Klik "Bayar" (POST /bookings/create)
 │       └─ DB: INSERT t_bookings + t_booking_items + t_booking_foods
 │       └─ Panggil Midtrans API → Dapat snap_token
 │
 ├─ [6] Tampilkan Midtrans UI → User pilih metode bayar
 │
 ├─ [7] Midtrans kirim webhook (POST /payments/midtrans/notification)
 │       └─ Verifikasi signature Midtrans
 │       └─ UPDATE t_payments SET status='SUCCESS'
 │       └─ UPDATE t_bookings SET status='CONFIRMED'
 │       └─ UPDATE t_showtime_seats SET status='BOOKED' (hapus lock)
 │       └─ INSERT t_point_transactions (earn points)
 │       └─ Kirim email konfirmasi + push notification
 │
 └─ [8] User terima tiket digital (QR Code)
         └─ QR berisi JWT signed: { booking_item_id, showtime_id, seat_label }
```

### Mekanisme Seat Locking (Anti Double-Booking)

```sql
-- Operasi ATOMIC: Hanya berhasil jika status masih 'AVAILABLE'
UPDATE t_showtime_seats
SET
  status           = 'LOCKED',
  locked_by_user_id = $userId,
  locked_at        = NOW(),
  locked_until     = NOW() + INTERVAL '10 minutes'
WHERE
  showtime_id = $showtimeId
  AND seat_id IN ($seatIds)
  AND status = 'AVAILABLE';    -- ← Baris kunci pencegah double-booking

-- Jika 0 rows affected → seat sudah diambil orang lain → return error
```

---

## 📡 API Documentation

Base URL: `http://localhost:3000` (dev) | `https://api.xii.id` (prod)

### Auth

| Method | Endpoint | Auth | Deskripsi |
|---|---|---|---|
| `POST` | `/auth/register` | ❌ | Registrasi pengguna baru |
| `POST` | `/auth/login` | ❌ | Login, return access + refresh token |
| `POST` | `/auth/refresh` | ❌ | Perbarui access token |
| `POST` | `/auth/verify-otp` | ❌ | Verifikasi kode OTP |
| `POST` | `/auth/forgot-password` | ❌ | Request reset password via email |

### Film & Jadwal

| Method | Endpoint | Auth | Deskripsi |
|---|---|---|---|
| `GET` | `/movies` | ❌ | Daftar film (filter: status, genre, kota) |
| `GET` | `/movies/:slug` | ❌ | Detail film + trailer + cast |
| `GET` | `/movies/:id/showtimes` | ❌ | Jadwal film per kota/bioskop |
| `GET` | `/showtimes/:id/seats` | ❌ | Status kursi real-time per jadwal |
| `WS` | `/ws/seats/:showtimeId` | ❌ | WebSocket — real-time seat map |

### Booking

| Method | Endpoint | Auth | Deskripsi |
|---|---|---|---|
| `POST` | `/bookings/lock-seats` | ✅ User | Kunci kursi sementara 10 menit |
| `POST` | `/bookings/create` | ✅ User | Buat booking & inisiasi pembayaran |
| `GET` | `/bookings` | ✅ User | Riwayat booking user |
| `GET` | `/bookings/:code` | ✅ User | Detail booking + tiket |
| `POST` | `/bookings/:id/cancel` | ✅ User | Batalkan booking |

### Admin

| Method | Endpoint | Auth | Deskripsi |
|---|---|---|---|
| `CRUD` | `/admin/cinemas` | ✅ Admin | Kelola bioskop |
| `CRUD` | `/admin/studios` | ✅ Admin | Kelola studio + denah kursi |
| `CRUD` | `/admin/movies` | ✅ Admin | Kelola katalog film |
| `CRUD` | `/admin/showtimes` | ✅ Admin | Kelola jadwal tayang |
| `CRUD` | `/admin/vouchers` | ✅ Admin | Kelola promo & voucher |
| `GET` | `/admin/analytics/summary` | ✅ Admin | Data dashboard real-time |
| `POST` | `/admin/validate-ticket` | ✅ BoxOffice | Scan & validasi QR tiket |

> 📌 Dokumentasi API lengkap akan tersedia via Swagger UI di `/docs` setelah endpoint diimplementasikan.

---

## 📐 Konvensi Kode

### Penamaan Tabel Database

```
m_  →  Master Data   (data statis yang jarang berubah)
t_  →  Transaction   (aktivitas transaksi harian)
r_  →  Report        (aggregasi untuk laporan & dashboard)
```

### Konvensi Kolom

```typescript
// ✅ Gunakan snake_case untuk nama kolom
created_at, updated_at, is_active, user_id

// ✅ Semua tabel punya audit columns
created_at: timestamp().notNull().defaultNow()
updated_at: timestamp().notNull().defaultNow()

// ✅ Primary Key selalu UUID
id: uuid().primaryKey().defaultRandom()

// ✅ Foreign Key: {tabel_tujuan}_id (tanpa prefix m_/t_/r_)
user_id, cinema_id, movie_id
```

### Konvensi Respons API

```json
// ✅ Success Response
{
  "success": true,
  "data": { },
  "message": "OK"
}

// ✅ Error Response
{
  "success": false,
  "error": {
    "code": "SEAT_ALREADY_LOCKED",
    "message": "Kursi A1 sedang dipesan oleh pengguna lain."
  }
}
```

---

## 🗺️ Roadmap

### ✅ Sudah Selesai
- [x] Product Requirements Document (PRD.md)
- [x] Desain database schema lengkap (26 tabel, 17 enum)
- [x] Koneksi database (Drizzle ORM + PostgreSQL)
- [x] Setup monorepo (Bun Workspaces)

### 🔴 Phase 1 — MVP (In Progress)
- [ ] Backend Auth (register, login, OTP, JWT)
- [ ] CRUD Master Data via Admin API
- [ ] CRUD Film & Genre
- [ ] CRUD Jadwal Tayang
- [ ] Seat Locking & Booking API
- [ ] Integrasi Midtrans
- [ ] Generate QR Code Tiket
- [ ] Admin Web Dashboard (Next.js)
- [ ] Mobile App Booking Flow (Flutter)
- [ ] Email Konfirmasi (Resend)
- [ ] E-Ticket Scanner (Admin)

### 🟡 Phase 2 — Growth
- [ ] F&B Ordering
- [ ] Program Loyalitas XII Points
- [ ] Voucher & Promo
- [ ] Review & Rating Film
- [ ] Push Notification (FCM)
- [ ] WebSocket Seat Map Real-time
- [ ] Customer Web (Next.js)

### 🟢 Phase 3 — Scale
- [ ] Integrasi TMDB API
- [ ] Dark Mode
- [ ] Multi-bahasa (EN/ID)
- [ ] Admin Analytics Dashboard (Grafik)
- [ ] Program Referral

---

## 🤝 Kontribusi

Project ini dikembangkan oleh **Tim XII**. Untuk berkontribusi:

1. Fork repository ini
2. Buat branch baru: `git checkout -b feat/nama-fitur`
3. Commit perubahan: `git commit -m "feat: deskripsi singkat"`
4. Push ke branch: `git push origin feat/nama-fitur`
5. Buat Pull Request

### Konvensi Commit Message

```
feat:     Fitur baru
fix:      Bug fix
chore:    Maintenance (update deps, config, dll.)
docs:     Perubahan dokumentasi
refactor: Refactoring kode
style:    Formatting, bukan perubahan logika
test:     Menambah atau update test
```

---

## 📜 Lisensi

Private — Hak cipta © 2026 XII Cinema. Semua hak dilindungi.

---

<div align="center">

Dibangun dengan ❤️ menggunakan **Bun**, **ElysiaJS**, **Next.js**, dan **Flutter**

**[PRD.md](./PRD.md)** · **[Data Structure](./apps/api/src/db/schema/)** · **[.env.example](./apps/api/.env.example)**

</div>
