# 🎬 PRD — Platform Bioskop XII (Dua Belas)
**Product Requirements Document**
**Version:** 1.0.0
**Tanggal:** 8 Agustus 2026
**Author:** Tim Produk XII
**Status:** Draft

---

## 📋 Daftar Isi
1. [Ringkasan Eksekutif](#1-ringkasan-eksekutif)
2. [Latar Belakang & Masalah](#2-latar-belakang--masalah)
3. [Visi & Misi Produk](#3-visi--misi-produk)
4. [Target Pengguna (User Persona)](#4-target-pengguna-user-persona)
5. [Ruang Lingkup Produk](#5-ruang-lingkup-produk)
6. [Arsitektur Sistem](#6-arsitektur-sistem)
7. [Fitur Detail: Admin Web Dashboard](#7-fitur-detail-admin-web-dashboard)
8. [Fitur Detail: Aplikasi Mobile (Customer)](#8-fitur-detail-aplikasi-mobile-customer)
9. [Fitur Detail: Web Publik (Customer)](#9-fitur-detail-web-publik-customer)
10. [Desain Database (Skema Entitas)](#10-desain-database-skema-entitas)
11. [Desain API](#11-desain-api)
12. [Tech Stack & Keputusan Teknologi](#12-tech-stack--keputusan-teknologi)
13. [Non-Functional Requirements](#13-non-functional-requirements)
14. [Alur Bisnis Kritis](#14-alur-bisnis-kritis)
15. [Roadmap Pengembangan (Phase)](#15-roadmap-pengembangan-phase)
16. [Metrik Kesuksesan (KPI)](#16-metrik-kesuksesan-kpi)
17. [Risiko & Mitigasi](#17-risiko--mitigasi)

---

## 1. Ringkasan Eksekutif

**XII (dibaca: Dua Belas)** adalah platform ekosistem bioskop terpadu yang dibangun dari nol menggunakan teknologi modern. Platform ini terdiri dari tiga komponen utama yang saling terintegrasi dalam satu monorepo:

| Komponen | Teknologi | Target Pengguna |
|---|---|---|
| **Admin Dashboard** (Web) | Next.js + TailwindCSS | Operator & Staf Bioskop |
| **Aplikasi Mobile** | Flutter (iOS & Android) | Pelanggan/Penonton |
| **Web Publik** | Next.js | Pelanggan via Browser |
| **Backend API** | Bun + ElysiaJS | Melayani semua klien |
| **Database** | PostgreSQL + Drizzle ORM | Data persistence |

---

## 2. Latar Belakang & Masalah

### Konteks Industri
Industri bioskop di Indonesia dikuasai oleh beberapa jaringan besar (Cinema XXI, CGV, Cinepolis). Pasar ini sangat bergantung pada kemudahan pemesanan digital. Data menunjukkan:
- **F&B (makanan & minuman)** menyumbang ±34% total pendapatan bioskop dengan margin 70–74%.
- Pengguna internet Indonesia >80%, membuat kanal digital menjadi titik kontak loyalitas utama.
- Harga tiket reguler berkisar IDR 30.000–75.000; premium/Gold Class IDR 100.000–200.000.

### Masalah yang Ingin Diselesaikan
1. **Operator Bioskop** tidak memiliki sistem terpadu untuk mengelola multi-lokasi, multi-studio, dan jadwal secara real-time dari satu dashboard.
2. **Pelanggan** masih mengalami antrian fisik di loket dan kesulitan memilih kursi terbaik dengan cepat.
3. **Double-booking** dan race condition saat pemesanan kursi bersamaan masih sering terjadi pada sistem lama.
4. Tidak ada ekosistem yang menggabungkan pemesanan tiket, pemesanan makanan, dan program loyalitas dalam satu platform yang dimiliki sendiri (white-label).

---

## 3. Visi & Misi Produk

### Visi
> *"Menjadi backbone teknologi bioskop modern Indonesia — dari layar admin hingga genggaman penonton."*

### Misi
- Menyediakan pengalaman pemesanan tiket bioskop yang **mulus, cepat, dan menyenangkan** bagi pelanggan.
- Memberikan operator bioskop alat manajemen yang **powerful, real-time, dan mudah digunakan**.
- Membangun ekosistem yang **scalable** untuk mendukung pertumbuhan dari 1 lokasi hingga ratusan lokasi.

---

## 4. Target Pengguna (User Persona)

### Persona 1: Operator Bioskop (Admin)
- **Nama Fiktif:** Budi Santoso, 38 tahun
- **Jabatan:** General Manager Bioskop XII Mall Kelapa Gading
- **Kebutuhan:**
  - Bisa mengatur jadwal tayang film di semua studio dengan mudah.
  - Memantau penjualan tiket hari ini secara real-time dari dashboard.
  - Mengelola layout kursi setiap studio.
  - Melihat laporan pendapatan harian, mingguan, dan bulanan.
- **Pain Point:** Selama ini menggunakan spreadsheet manual; rawan kesalahan input dan data tidak sinkron.

### Persona 2: Staf Kasir/Box Office
- **Nama Fiktif:** Dewi Anggraeni, 24 tahun
- **Jabatan:** Staff Box Office
- **Kebutuhan:**
  - Bisa melakukan pemesanan manual untuk pelanggan yang datang langsung (walk-in).
  - Proses cetak tiket yang cepat.
  - Cek status kursi dan jadwal secara real-time.

### Persona 3: Pelanggan Digital (Mobile-First)
- **Nama Fiktif:** Rizky Pratama, 22 tahun
- **Profil:** Mahasiswa, pengguna smartphone aktif, sering nonton bersama teman.
- **Kebutuhan:**
  - Bisa lihat film apa yang lagi tayang dan jam berapa.
  - Pilih kursi sendiri dengan visualisasi denah studio.
  - Bayar via QRIS / GoPay / OVO / Transfer Bank.
  - Dapat tiket digital (QR Code) langsung di HP.
  - Pesan snack/popcorn sebelum masuk studio.
- **Pain Point:** Malas antri di loket; sering kehabisan kursi bagus.

### Persona 4: Pelanggan Keluarga (Occasional)
- **Nama Fiktif:** Ibu Sari, 40 tahun
- **Profil:** Ibu rumah tangga, nonton bareng keluarga 2-3x sebulan.
- **Kebutuhan:**
  - Cari jadwal film keluarga/animasi.
  - Beli tiket untuk beberapa orang sekaligus (4-6 kursi).
  - Ingin tahu promo atau diskon yang berlaku.

---

## 5. Ruang Lingkup Produk

### In Scope (MVP - Phase 1)
- Manajemen Bioskop: Kota, Mall, Bioskop, Studio, Kursi
- Manajemen Film: CRUD film beserta metadata (poster, sinopsis, genre, rating, durasi)
- Manajemen Jadwal Tayang (Showtime)
- Pemilihan Kursi Real-time dengan Seat Locking
- Pemesanan Tiket (Booking Flow)
- Payment Gateway (Midtrans)
- Tiket Digital (QR Code)
- E-Ticket Validation di pintu masuk
- Notifikasi (Email & Push Notification)
- Admin Dashboard (CRUD semua entitas)

### In Scope (Phase 2 - Growth)
- Pemesanan F&B (Makanan & Minuman / Concession)
- Program Loyalitas (XII Points)
- Promo & Kode Voucher
- Review & Rating Film
- Multi-bahasa (Bahasa Indonesia & Inggris)
- Laporan & Analitik Lanjutan

### Out of Scope
- Streaming / VOD (Video on Demand)
- Manajemen konten DCP (Digital Cinema Package) di proyektor
- Integrasi langsung ke sistem distributor film
- Sistem payroll staf bioskop

---

## 6. Arsitektur Sistem

### Diagram Arsitektur Tingkat Tinggi

```
+--------------------------------------------------------------+
|                    CLIENTS (Presentation Layer)               |
|                                                              |
|  +-----------------+  +-----------------+  +-------------+  |
|  |  Admin Web      |  |  Customer Web   |  | Mobile App  |  |
|  |  (Next.js)      |  |  (Next.js)      |  |  (Flutter)  |  |
|  |  apps/web/admin |  |  apps/web/      |  |  apps/mobile|  |
|  +--------+--------+  +--------+--------+  +------+------+  |
+-----------|------------------------|---------------|---------+
            |                        |               |
            +------------------------+---------------+
                                     |
                                     | HTTPS / WebSocket
                                     v
+--------------------------------------------------------------+
|                      BACKEND (apps/api)                       |
|              ElysiaJS on Bun Runtime                         |
|                                                              |
|  +----------+ +----------+ +----------+ +--------------+    |
|  |  Auth    | |  Movie   | | Booking  | | Notification |    |
|  |  Module  | |  Module  | |  Module  | |  Module (WS) |    |
|  +----------+ +----------+ +----------+ +--------------+    |
|  +----------+ +----------+ +----------+                     |
|  |  Cinema  | | Payment  | | Admin    |                     |
|  |  Module  | |  Module  | | Module   |                     |
|  +----------+ +----------+ +----------+                     |
|              Drizzle ORM                                     |
+----------------------------------+---------------------------+
                                   |
            +----------------------+
            |                      |
            v                      v
+-------------------+   +------------------+
|   PostgreSQL      |   |  External APIs   |
|   (Primary DB)    |   |                  |
|   + Seat Locking  |   | - Midtrans (Pay) |
|   + LISTEN/NOTIFY |   | - Cloudinary     |
+-------------------+   | - Firebase (FCM) |
                        +------------------+
```

### Pola Arsitektur
- **Monolith Modular** (bukan Microservices) untuk MVP. Setiap modul memiliki domain yang jelas sehingga mudah dipecah menjadi microservice di masa depan.
- **Elysia Eden** untuk type-safe client di Next.js (web) — tidak perlu mendefinisikan ulang types.
- **PostgreSQL `SELECT FOR UPDATE`** + `locked_until` timestamp untuk mencegah double-booking tanpa perlu Redis.
- **WebSocket via Elysia** + **PostgreSQL LISTEN/NOTIFY** untuk real-time seat status update.

---

## 7. Fitur Detail: Admin Web Dashboard

Dashboard Admin dapat diakses di sub-route khusus (misal `/admin`) atau subdomain tersendiri. Hanya dapat diakses oleh pengguna dengan role `ADMIN`, `MANAGER`, atau `BOX_OFFICE`.

### 7.1 Manajemen Wilayah & Lokasi

#### A. Manajemen Kota
- CRUD data kota (nama kota, provinsi, kode pos, timezone).
- Kota sebagai hierarki tertinggi dalam pengelompokan bioskop.

#### B. Manajemen Mall/Venue
- CRUD mall/gedung tempat bioskop berada.
- Atribut: Nama Mall, Kota, Alamat Lengkap, Koordinat GPS (latitude, longitude), Foto Eksterior.
- Integrasi peta (embed Google Maps/OpenStreetMap) untuk tampilan lokasi.

#### C. Manajemen Bioskop
- CRUD bioskop dalam suatu mall.
- Atribut: Nama Bioskop (contoh: "XII Kelapa Gading"), Mall, Nomor Lantai, Nomor Telepon, Jam Operasional.
- Status: `ACTIVE` / `MAINTENANCE` / `CLOSED`.

### 7.2 Manajemen Studio (Hall)

- CRUD studio/aula dalam suatu bioskop.
- Atribut per studio:
  - **Nama Studio**: "Studio 1", "Studio IMAX", "Studio Gold"
  - **Tipe Studio**: `REGULAR`, `IMAX`, `GOLD_CLASS`, `4DX`, `SWEETBOX`
  - **Kapasitas Total**: Dihitung otomatis dari konfigurasi kursi.
  - **Status**: `ACTIVE` / `MAINTENANCE`

#### 7.2.1 Konfigurasi Layout Kursi (Seat Map Builder)
Fitur kunci yang memungkinkan admin merancang denah kursi studio secara visual:
- **Grid Editor**: Tampilan grid berbasis baris x kolom. Admin dapat menambah/hapus baris dan kolom.
- **Tipe Kursi per Sel**:
  - `REGULAR` — Kursi standar
  - `PREMIUM` — Kursi premium (harga berbeda)
  - `COUPLE` — Kursi sofa untuk 2 orang
  - `WHEELCHAIR` — Kursi untuk difabel (auto-accessible)
  - `VOID` — Bukan kursi (lorong/gang/kosong)
- **Penamaan Otomatis**: Sistem secara otomatis memberi nama kursi per sel (A1, A2, B1, dst.).
- Admin bisa **save** layout sebagai template yang bisa digunakan ulang di studio lain.

### 7.3 Manajemen Film

- CRUD data film.
- Atribut film:
  - **Judul** (Bahasa Indonesia & Inggris)
  - **Poster** (upload image, tersimpan di Cloudinary)
  - **Backdrop/Banner** (gambar horizontal untuk hero section)
  - **Sinopsis**
  - **Genre**: Drama, Action, Comedy, Horror, Animation, dll. (multi-select)
  - **Durasi** (menit)
  - **Rating Usia**: `SU`, `13+`, `17+`, `21+` (sesuai KPID Indonesia)
  - **Bahasa**: Indonesia, Inggris, Korea, dll.
  - **Subtitle**: Ya/Tidak, dan bahasa subtitle
  - **Studio Produksi** (Marvel Studios, Warner Bros, dll.)
  - **Distributor Lokal** (Falcon Pictures, Rapi Films, dll.)
  - **Tanggal Rilis Indonesia**
  - **Trailer URL** (YouTube embed)
  - **Status**: `COMING_SOON`, `NOW_SHOWING`, `ENDED`
- **Bulk Import** dari file CSV/JSON untuk input film massal.
- Fitur **tarik data film** dari TMDB (The Movie Database) API berdasarkan judul — auto-fill metadata.

### 7.4 Manajemen Jadwal Tayang (Showtime)

- **Tambah Jadwal**: Pilih bioskop, pilih studio, pilih film, pilih tanggal & jam tayang.
- **Durasi Pembersihan**: Admin dapat set waktu gap antara sesi (misal 15 menit untuk pembersihan studio).
- **Bulk Schedule**: Salin jadwal yang sama ke hari lain atau minggu berikutnya dengan satu klik.
- **Kalender View**: Tampilan kalender per studio untuk melihat jadwal dalam satu minggu.
- **Conflict Detection**: Sistem otomatis mencegah jadwal overlap pada studio yang sama.
- **Edit/Cancel Showtime**: Admin bisa cancel jadwal, dan notifikasi otomatis dikirim ke pelanggan yang sudah memesan.

### 7.5 Manajemen Harga

- Penetapan harga bersifat fleksibel dan dapat dikombinasikan:
  - **Berdasarkan Tipe Studio**: Regular, IMAX, Gold Class, dll.
  - **Berdasarkan Tipe Kursi**: Reguler, Premium, Couple.
  - **Berdasarkan Hari**: Weekday vs. Weekend vs. Holiday.
  - **Berdasarkan Waktu**: Matinee (pagi, lebih murah), Normal, Night Show.
- Admin dapat membuat **Price Rule** dan mengaitkannya ke jadwal tertentu.
- Contoh rule: `"Film IMAX + Sabtu/Minggu + Kursi Premium = IDR 150.000"`.

### 7.6 Manajemen F&B (Concession)

- CRUD kategori makanan (Popcorn, Minuman, Snack, Combo).
- CRUD item produk (nama, deskripsi, foto, harga, stok harian).
- Pengaturan **ketersediaan per bioskop** (item tertentu hanya tersedia di cabang tertentu).
- Pengaturan jam layanan pemesanan F&B online.
- Laporan penjualan F&B per hari.

### 7.7 Manajemen Promo & Voucher

- CRUD kode voucher diskon.
- Tipe diskon: **Persentase** (contoh: 20%) atau **Nominal tetap** (contoh: IDR 15.000).
- Aturan penggunaan:
  - Batas total penggunaan (contoh: max 100x pakai)
  - Batas per pengguna (contoh: 1x per akun)
  - Tanggal berlaku (start date & end date)
  - Berlaku untuk film tertentu, bioskop tertentu, atau semua
  - Minimum transaksi
- Laporan penggunaan voucher.

### 7.8 Manajemen Pengguna

- Lihat daftar semua pengguna terdaftar (customer).
- Filter & search pengguna.
- Detail pengguna: riwayat pemesanan, XII Points, status akun.
- Aksi: Suspend/Ban akun, reset password, kirim notifikasi manual.
- **Role Management** untuk staf internal:
  - `SUPER_ADMIN`: Akses penuh ke semua bioskop.
  - `MANAGER`: Akses ke bioskop yang dikelolanya.
  - `BOX_OFFICE`: Hanya bisa buat pesanan manual & scan tiket.

### 7.9 Dashboard & Laporan (Analytics)

- **Dashboard Utama** (real-time):
  - Total tiket terjual hari ini (semua cabang / per cabang)
  - Total pendapatan hari ini
  - Tingkat keterisian studio (occupancy rate) hari ini
  - Film terlaris hari ini
  - Jadwal yang akan segera dimulai (next 2 jam)
- **Laporan Penjualan**:
  - Filter: Rentang tanggal, Bioskop, Film, Studio
  - Export: CSV, PDF
  - Grafik: Bar chart pendapatan, Line chart tren penjualan
- **Laporan Pelanggan**:
  - Jumlah pengguna baru per bulan
  - Pengguna aktif (MAU / DAU)
  - Distribusi metode pembayaran
- **Laporan Film**:
  - Ranking film berdasarkan tiket terjual
  - Perbandingan pendapatan antar film

### 7.10 Validasi Tiket (E-Ticket Scanner)

- Halaman khusus role `BOX_OFFICE` untuk scan QR Code tiket.
- Input manual kode booking sebagai alternatif scan.
- Status respons: VALID / SUDAH DIPAKAI / TIDAK VALID / JADWAL BERBEDA.
- Log riwayat validasi tiket.

---

## 8. Fitur Detail: Aplikasi Mobile (Customer)

Dibangun dengan **Flutter** untuk iOS dan Android. Fokus pada pengalaman yang mulus dan visual yang menarik.

### 8.1 Onboarding & Autentikasi

- **Splash Screen** dengan animasi logo XII.
- **Onboarding Carousel** (3 slide) untuk pengguna baru: Pilih film, Pesan kursi, Nikmati.
- **Registrasi**: Nama, Email, Nomor HP, Password.
  - Verifikasi OTP via SMS atau Email.
- **Login**: Email/Password atau Login dengan Google (OAuth).
- **Lupa Password**: Reset via email.
- **Biometrik**: Fingerprint/Face ID untuk login cepat setelah session pertama.

### 8.2 Halaman Beranda (Home)

- **Banner/Carousel** film yang sedang atau akan tayang (full-width, auto-scroll).
- **Deteksi Lokasi Otomatis**: Tampilkan bioskop XII terdekat dari lokasi user.
- **Section "Sedang Tayang" (Now Showing)**: Grid poster film dengan badge rating usia.
- **Section "Segera Hadir" (Coming Soon)**: Poster film akan datang dengan tanggal rilis.
- **Section "Film Terpopuler"**: Berdasarkan total penjualan tiket.
- **Quick Access Bar**: Pencarian, Tiket Saya, Notifikasi, Profil.

### 8.3 Pencarian & Filter Film

- **Search Bar**: Real-time search berdasarkan judul film, genre, atau nama bioskop.
- **Filter**: Genre (multi-select), Rating Usia, Bahasa/Subtitle, Tipe Studio, Kota.
- **Sort**: Terpopuler, Terbaru, Durasi Tersingkat.

### 8.4 Halaman Detail Film

- **Hero Section**: Backdrop/banner film dengan efek parallax saat scroll.
- Judul, Rating Usia, Genre (chip/tag), Durasi, Bahasa.
- Embed Trailer YouTube.
- Sinopsis (collapsible, expand "Baca Selengkapnya").
- Pemain & Sutradara.
- **Rating & Ulasan** pengguna (average bintang).
- **Tombol "Beli Tiket"** → Masuk ke Pilih Jadwal.

### 8.5 Alur Pemesanan Tiket (Booking Flow)

#### Step 1: Pilih Jadwal & Bioskop
- Pilih kota (jika belum terdeteksi otomatis).
- Tampilkan daftar bioskop XII yang memutar film ini.
- Untuk setiap bioskop: tampilkan jadwal tayang berupa chip jam (10:00, 13:00, 19:30).
- Chip berwarna berbeda: Tersedia, Hampir Penuh (< 20% sisa), Habis.
- Pilih tanggal (date picker horizontal, scroll 7 hari ke depan).

#### Step 2: Pilih Kursi (Seat Map)
- Tampilan visual **denah studio** secara akurat.
- **Legenda kursi**: Tersedia (putih), Dipilih (hijau), Terisi (abu gelap), Dikunci Sementara (abu muda), Kursi Premium (kuning), Couple Seat (oranye), Akses Difabel (biru).
- **Pinch-to-zoom** pada denah untuk studio besar.
- Satu klik memilih kursi, klik lagi untuk deselect.
- **Batas Pemilihan**: Maksimum 6 kursi per transaksi.
- Counter tiket yang dipilih + total harga (update real-time).
- **Timer 10 Menit**: Countdown timer setelah kursi dipilih. Jika waktu habis, user dikembalikan ke pilih kursi.

#### Step 3: Pesanan F&B (Opsional)
- Daftar produk F&B yang tersedia di bioskop tersebut.
- Kategori: Popcorn, Minuman, Snack, Combo Hemat.
- Setiap item: foto, nama, deskripsi singkat, harga, tombol +/-.
- Preview subtotal F&B.
- Tombol "Lewati" dan "Tambahkan ke Pesanan".

#### Step 4: Ringkasan & Checkout
- Detail film, jadwal, bioskop, studio.
- Daftar kursi yang dipilih beserta tipe dan harga.
- Daftar F&B yang dipesan.
- **Field Kode Voucher/Promo** (input + tombol "Terapkan").
- Rincian Harga: Subtotal Tiket, Subtotal F&B, Diskon, Biaya Layanan, Total Pembayaran.
- **Pilih Metode Pembayaran**: Midtrans Snap (GoPay, OVO, QRIS, VA Bank, Kartu Kredit/Debit).
- Tombol **"Bayar Sekarang"**.

#### Step 5: Pembayaran
- Redirect ke UI Midtrans Snap (native SDK).
- Penanganan status: `SUCCESS`, `PENDING`, `FAILED`, `CANCELLED`.

#### Step 6: Tiket Digital
- Setelah pembayaran berhasil: tampilkan halaman sukses + animasi konfeti.
- **Tiket Digital** berisi: Logo XII, Nama Film, Tanggal & Jam, Bioskop & Studio, Nomor/kode setiap kursi, **QR Code** unik per tiket, Kode Booking (contoh: `XII-2026-ABC123`).
- Tiket dapat diakses offline (tersimpan di perangkat/cache).
- Tombol "Bagikan" untuk share ke WhatsApp/media sosial.

### 8.6 Riwayat Pesanan (My Tickets)

- Dua tab: **Mendatang** (upcoming) & **Selesai/Lewat** (past).
- Tap pesanan → Detail lengkap + QR Code tiket.
- **Fitur Download** tiket sebagai gambar.

### 8.7 Program Loyalitas (XII Points)

- **Cara Mendapat Poin**: 1 tiket = +10 poin, pembelian F&B = +5% dalam poin, ulang tahun = bonus poin, review film = +5 poin.
- **Tier Keanggotaan**:
  - CLASSIC (0–499 poin): Tidak ada benefit khusus.
  - SILVER (500–1999 poin): Diskon 5% tiket, akses promo eksklusif.
  - GOLD (2000–4999 poin): Diskon 10% tiket, early access jadwal baru, free upgrade kursi.
  - PLATINUM (5000+ poin): Diskon 15% tiket, lounge access, birthday free ticket.
- **Penukaran Poin**: 100 Poin = Diskon IDR 10.000.

### 8.8 Profil & Pengaturan

- Foto profil, Edit nama/nomor HP/email/tanggal lahir.
- Ganti password.
- Notifikasi Settings, Tema (Light/Dark), Bahasa (ID/EN).
- Kebijakan Privasi & Syarat Penggunaan.
- Tombol Logout.

### 8.9 Notifikasi

- **Push Notification** via Firebase Cloud Messaging (FCM).
- Jenis notifikasi: 24 jam sebelum tayang (pengingat), 2 jam sebelum tayang (pengingat detail), promo & voucher baru, film baru dari genre favorit.
- **In-App Notification Bell** dengan badge counter.
- Riwayat notifikasi.

---

## 9. Fitur Detail: Web Publik (Customer)

Dibangun dengan **Next.js** (App Router), responsif untuk desktop dan mobile browser.

| Halaman | Route | Keterangan |
|---|---|---|
| Home | `/` | Banner, Now Showing, Coming Soon |
| Daftar Film | `/movies` | Filter & search film |
| Detail Film | `/movies/[slug]` | SSR untuk SEO |
| Pilih Jadwal | `/booking/[movieId]/schedule` | |
| Pilih Kursi | `/booking/[movieId]/seats` | Real-time seat map |
| Checkout | `/booking/checkout` | |
| Konfirmasi | `/booking/success` | E-Ticket |
| Riwayat Pesanan | `/account/tickets` | |
| Profil | `/account/profile` | |
| Daftar Bioskop | `/cinemas` | |
| Detail Bioskop | `/cinemas/[slug]` | SSR untuk SEO |

---

## 10. Desain Database (Skema Entitas)

### Hierarki Entitas
```
CITIES
  └── MALLS
        └── CINEMAS
              └── STUDIOS
                    ├── SEATS
                    └── SHOWTIMES
                          ├── SHOWTIME_SEATS (status kursi per jadwal)
                          └── BOOKINGS
                                ├── BOOKING_ITEMS (tiket per kursi)
                                ├── BOOKING_FOODS
                                └── PAYMENTS

USERS
  ├── BOOKINGS
  ├── USER_POINTS
  └── USER_NOTIFICATIONS
```

### Tabel-Tabel Utama

#### `cities`
| Kolom | Tipe | Keterangan |
|---|---|---|
| `id` | UUID PK | |
| `name` | VARCHAR(100) | Nama kota |
| `province` | VARCHAR(100) | Provinsi |
| `timezone` | VARCHAR(50) | Contoh: `Asia/Jakarta` |
| `created_at` | TIMESTAMP | |

#### `malls`
| Kolom | Tipe | Keterangan |
|---|---|---|
| `id` | UUID PK | |
| `city_id` | UUID FK | → cities |
| `name` | VARCHAR(150) | Nama mall |
| `address` | TEXT | Alamat lengkap |
| `latitude` | DECIMAL(9,6) | |
| `longitude` | DECIMAL(9,6) | |
| `thumbnail_url` | TEXT | Foto mall |

#### `cinemas`
| Kolom | Tipe | Keterangan |
|---|---|---|
| `id` | UUID PK | |
| `mall_id` | UUID FK | → malls |
| `name` | VARCHAR(150) | Nama bioskop |
| `floor` | VARCHAR(10) | Lantai di mall |
| `phone` | VARCHAR(20) | |
| `operating_hours` | JSONB | `{open: "10:00", close: "23:30"}` |
| `status` | ENUM | `ACTIVE`, `MAINTENANCE`, `CLOSED` |

#### `studios`
| Kolom | Tipe | Keterangan |
|---|---|---|
| `id` | UUID PK | |
| `cinema_id` | UUID FK | → cinemas |
| `name` | VARCHAR(50) | "Studio 1", "IMAX" |
| `type` | ENUM | `REGULAR`, `IMAX`, `GOLD_CLASS`, `4DX`, `SWEETBOX` |
| `total_rows` | INT | |
| `total_cols` | INT | |
| `status` | ENUM | `ACTIVE`, `MAINTENANCE` |

#### `seats`
| Kolom | Tipe | Keterangan |
|---|---|---|
| `id` | UUID PK | |
| `studio_id` | UUID FK | → studios |
| `row` | CHAR(1) | Baris (A, B, C...) |
| `col` | INT | Kolom (1, 2, 3...) |
| `label` | VARCHAR(5) | Contoh: `A1`, `B12` |
| `type` | ENUM | `REGULAR`, `PREMIUM`, `COUPLE`, `WHEELCHAIR`, `VOID` |

#### `movies`
| Kolom | Tipe | Keterangan |
|---|---|---|
| `id` | UUID PK | |
| `title` | VARCHAR(200) | |
| `title_en` | VARCHAR(200) | Judul bahasa Inggris |
| `slug` | VARCHAR(220) | URL-friendly UNIQUE |
| `synopsis` | TEXT | |
| `poster_url` | TEXT | URL Cloudinary |
| `backdrop_url` | TEXT | URL Cloudinary |
| `trailer_url` | TEXT | URL YouTube |
| `duration_minutes` | INT | |
| `age_rating` | ENUM | `SU`, `13+`, `17+`, `21+` |
| `genres` | TEXT[] | Array genre |
| `language` | VARCHAR(50) | |
| `subtitled` | BOOLEAN | |
| `release_date` | DATE | Tanggal rilis di Indonesia |
| `status` | ENUM | `COMING_SOON`, `NOW_SHOWING`, `ENDED` |

#### `showtimes`
| Kolom | Tipe | Keterangan |
|---|---|---|
| `id` | UUID PK | |
| `studio_id` | UUID FK | → studios |
| `movie_id` | UUID FK | → movies |
| `start_time` | TIMESTAMP | Waktu mulai tayangan |
| `end_time` | TIMESTAMP | Waktu selesai (otomatis dihitung) |
| `price_regular` | INT | Harga kursi reguler (IDR) |
| `price_premium` | INT | Harga kursi premium |
| `price_couple` | INT | Harga kursi couple (per kursi) |
| `status` | ENUM | `SCHEDULED`, `ONGOING`, `ENDED`, `CANCELLED` |

#### `showtime_seats` (KRITIS — Seat Locking)
| Kolom | Tipe | Keterangan |
|---|---|---|
| `showtime_id` | UUID | FK → showtimes (composite PK) |
| `seat_id` | UUID | FK → seats (composite PK) |
| `status` | ENUM | `AVAILABLE`, `LOCKED`, `BOOKED` |
| `locked_by_user_id` | UUID | FK → users (nullable) |
| `locked_until` | TIMESTAMP | Waktu kadaluarsa lock (nullable) |

#### `users`
| Kolom | Tipe | Keterangan |
|---|---|---|
| `id` | UUID PK | |
| `name` | VARCHAR(100) | |
| `email` | VARCHAR(150) | UNIQUE |
| `phone` | VARCHAR(20) | |
| `password_hash` | TEXT | |
| `role` | ENUM | `CUSTOMER`, `BOX_OFFICE`, `MANAGER`, `SUPER_ADMIN` |
| `avatar_url` | TEXT | |
| `birth_date` | DATE | |
| `total_points` | INT | DEFAULT 0 |
| `membership_tier` | ENUM | `CLASSIC`, `SILVER`, `GOLD`, `PLATINUM` |
| `is_verified` | BOOLEAN | |
| `is_active` | BOOLEAN | |

#### `bookings`
| Kolom | Tipe | Keterangan |
|---|---|---|
| `id` | UUID PK | |
| `booking_code` | VARCHAR(20) | UNIQUE, contoh: `XII-2026-ABC123` |
| `user_id` | UUID FK | → users |
| `showtime_id` | UUID FK | → showtimes |
| `total_amount` | INT | Total pembayaran (IDR) |
| `discount_amount` | INT | Total diskon |
| `service_fee` | INT | Biaya layanan |
| `status` | ENUM | `PENDING`, `CONFIRMED`, `CANCELLED`, `REFUNDED` |
| `voucher_code` | VARCHAR(50) | Nullable |
| `idempotency_key` | UUID | Mencegah double submit |
| `created_at` | TIMESTAMP | |

#### `booking_items`
| Kolom | Tipe | Keterangan |
|---|---|---|
| `id` | UUID PK | |
| `booking_id` | UUID FK | → bookings |
| `seat_id` | UUID FK | → seats |
| `seat_label` | VARCHAR(5) | Snapshot label saat booking |
| `seat_type` | VARCHAR(20) | Snapshot tipe kursi |
| `price` | INT | Harga kursi saat dipesan |
| `qr_code_data` | TEXT | Data JWT unik untuk QR code |
| `is_validated` | BOOLEAN | Sudah di-scan di pintu masuk? |
| `validated_at` | TIMESTAMP | Nullable |

#### `payments`
| Kolom | Tipe | Keterangan |
|---|---|---|
| `id` | UUID PK | |
| `booking_id` | UUID FK | → bookings |
| `midtrans_order_id` | VARCHAR(50) | ID transaksi di Midtrans |
| `midtrans_transaction_id` | VARCHAR(100) | |
| `payment_method` | VARCHAR(50) | `gopay`, `bca_va`, `qris`, dll. |
| `amount` | INT | |
| `status` | ENUM | `PENDING`, `SUCCESS`, `FAILED`, `EXPIRED` |
| `paid_at` | TIMESTAMP | Nullable |

#### `food_items`
| Kolom | Tipe | Keterangan |
|---|---|---|
| `id` | UUID PK | |
| `cinema_id` | UUID FK | Nullable = tersedia di semua cabang |
| `category` | ENUM | `POPCORN`, `DRINK`, `SNACK`, `COMBO` |
| `name` | VARCHAR(100) | |
| `description` | TEXT | |
| `image_url` | TEXT | |
| `price` | INT | |
| `is_available` | BOOLEAN | |

#### `vouchers`
| Kolom | Tipe | Keterangan |
|---|---|---|
| `id` | UUID PK | |
| `code` | VARCHAR(50) | UNIQUE |
| `type` | ENUM | `PERCENTAGE`, `FIXED` |
| `value` | INT | Nilai diskon (% atau IDR) |
| `min_transaction` | INT | Minimum transaksi |
| `max_uses` | INT | |
| `current_uses` | INT | |
| `max_uses_per_user` | INT | |
| `valid_from` | TIMESTAMP | |
| `valid_until` | TIMESTAMP | |
| `is_active` | BOOLEAN | |

---

## 11. Desain API

### Konvensi
- **Base URL**: `https://api.xii.id/v1`
- **Autentikasi**: Bearer Token (JWT) di header `Authorization`.
- **Format Response Success**:
```json
{
  "success": true,
  "data": { "..." : "..." },
  "message": "OK"
}
```
- **Format Response Error**:
```json
{
  "success": false,
  "error": {
    "code": "SEAT_ALREADY_LOCKED",
    "message": "Kursi A1 sedang dipesan oleh pengguna lain."
  }
}
```

### Daftar Endpoint Utama

#### Auth Module
| Method | Path | Auth | Deskripsi |
|---|---|---|---|
| POST | `/auth/register` | - | Registrasi pengguna baru |
| POST | `/auth/login` | - | Login, return JWT |
| POST | `/auth/refresh` | - | Refresh access token |
| POST | `/auth/logout` | User | Logout |
| POST | `/auth/verify-otp` | - | Verifikasi OTP |
| POST | `/auth/forgot-password` | - | Request reset password |
| POST | `/auth/reset-password` | - | Submit password baru |

#### Movies Module
| Method | Path | Auth | Deskripsi |
|---|---|---|---|
| GET | `/movies` | - | Daftar film (filter: status, genre) |
| GET | `/movies/:slug` | - | Detail film |
| POST | `/movies` | Admin | Tambah film |
| PUT | `/movies/:id` | Admin | Update film |
| DELETE | `/movies/:id` | Admin | Hapus film |

#### Cinemas & Showtimes Module
| Method | Path | Auth | Deskripsi |
|---|---|---|---|
| GET | `/cinemas` | - | Daftar bioskop (filter: kota) |
| GET | `/cinemas/:id` | - | Detail bioskop |
| GET | `/movies/:movieId/showtimes` | - | Jadwal film di semua bioskop |
| GET | `/showtimes/:id/seats` | - | Status kursi untuk jadwal tertentu |

#### Booking Module
| Method | Path | Auth | Deskripsi |
|---|---|---|---|
| POST | `/bookings/lock-seats` | User | Kunci kursi sementara (10 menit) |
| POST | `/bookings/create` | User | Buat booking & inisiasi pembayaran |
| GET | `/bookings` | User | Riwayat booking user |
| GET | `/bookings/:bookingCode` | User | Detail booking |
| POST | `/bookings/:id/cancel` | User | Batalkan booking |

#### Payments Module
| Method | Path | Auth | Deskripsi |
|---|---|---|---|
| POST | `/payments/midtrans/notification` | (webhook sig) | Webhook dari Midtrans |

#### Admin Module
| Method | Path | Auth | Deskripsi |
|---|---|---|---|
| GET/POST/PUT/DELETE | `/admin/cities` | Admin | CRUD kota |
| GET/POST/PUT/DELETE | `/admin/malls` | Admin | CRUD mall |
| GET/POST/PUT/DELETE | `/admin/cinemas` | Admin | CRUD bioskop |
| GET/POST/PUT/DELETE | `/admin/studios` | Admin | CRUD studio |
| GET/POST/PUT/DELETE | `/admin/showtimes` | Admin | CRUD jadwal |
| GET/POST/PUT/DELETE | `/admin/food-items` | Admin | CRUD F&B |
| GET/POST/PUT/DELETE | `/admin/vouchers` | Admin | CRUD voucher |
| GET | `/admin/analytics/summary` | Admin | Data summary dashboard |
| POST | `/admin/validate-ticket` | Box Office | Scan & validasi tiket |

#### WebSocket
| Path | Deskripsi |
|---|---|
| `WS /ws/seats/:showtimeId` | Real-time update status kursi per jadwal |

---

## 12. Tech Stack & Keputusan Teknologi

| Layer | Teknologi | Alasan |
|---|---|---|
| **Runtime** | Bun | 3-5x lebih cepat dari Node.js; TypeScript native |
| **API Framework** | ElysiaJS | End-to-end type safety via Eden; performa tinggi; built-in WebSocket |
| **ORM** | Drizzle ORM | Type-safe; lightweight; PostgreSQL native |
| **Database** | PostgreSQL 16 | ACID; JSONB; LISTEN/NOTIFY; row-level locking |
| **Web Admin & Customer** | Next.js 16 (App Router) | SSR/SSG untuk SEO; React Server Components |
| **Styling Web** | Tailwind CSS v4 | Utility-first; development cepat |
| **Mobile** | Flutter 3.x | Cross-platform iOS & Android; performa native |
| **State Mgmt (Mobile)** | BLoC / Riverpod | Reactive & testable; ideal untuk real-time seat map |
| **Media Storage** | Cloudinary | Upload, resize, optimize otomatis; CDN global |
| **Payment** | Midtrans | Payment gateway terpopuler Indonesia; GoPay, QRIS, VA, dll. |
| **Push Notification** | Firebase Cloud Messaging | Gratis; andal; support iOS & Android |
| **Email** | Resend | Modern email API; deliverability tinggi |
| **Package Manager** | Bun Workspaces | Monorepo native |
| **CI/CD** | GitHub Actions | Terintegrasi dengan repo existing |
| **Deploy (API)** | Fly.io / Railway | Container-based; mendukung Bun; auto-scaling |
| **Deploy (Web)** | Vercel | Native Next.js deployment; preview deployment |

### Keputusan Arsitektur Penting

1. **Tidak menggunakan Redis untuk MVP**: PostgreSQL dengan `SELECT FOR UPDATE` dan timestamp `locked_until` sudah cukup untuk skala awal. Redis ditambahkan saat traffic mencapai ribuan concurrent users.

2. **Elysia Eden untuk Type Safety**: Web (Next.js) terhubung ke API menggunakan Elysia Eden. Perubahan backend API langsung terdeteksi error di frontend saat compile time — tidak perlu memelihara OpenAPI spec secara manual.

3. **WebSocket untuk Seat Map Real-time**: User subscribe ke channel WebSocket `seats:{showtimeId}`. Setiap ada perubahan status kursi, backend broadcast ke semua subscriber di halaman yang sama secara instan.

4. **Idempotency Key**: Setiap request buat booking harus menyertakan `idempotency_key` (UUID dibuat di client). Jika user klik "Bayar" dua kali karena koneksi lambat, backend hanya memproses satu transaksi.

5. **QR Code Security**: QR code berisi JWT yang ditandatangani dengan private key server. Pemalsuan tiket tidak bisa dilakukan tanpa private key.

---

## 13. Non-Functional Requirements

### Performa
- API response time: < 200ms untuk 95% request (P95).
- Seat locking operation: < 50ms.
- Web First Contentful Paint (FCP): < 1.5 detik.
- Mobile: 60fps di semua animasi dan transisi.

### Ketersediaan (Availability)
- Target uptime: **99.9%** (downtime max ~8.7 jam/tahun).
- Graceful degradation: Jika layanan F&B order down, booking tiket tetap berjalan.

### Keamanan (Security)
- Semua komunikasi via **HTTPS / WSS**.
- JWT dengan expiry pendek (15 menit) + Refresh Token (7 hari, stored as httpOnly cookie).
- Password di-hash dengan **bcrypt** (cost factor 12).
- Rate limiting: 100 req/menit per IP untuk endpoint publik; 10 req/menit untuk endpoint auth.
- Webhook Midtrans diverifikasi dengan signature key (bukan public endpoint terbuka).
- PCI DSS compliance dikelola oleh Midtrans (kami tidak menyimpan data kartu).
- Input validation & sanitization di semua endpoint via Elysia TypeBox validation.

### Skalabilitas
- Desain API stateless → mudah di-horizontal-scale.
- Database connection pooling.
- Aset statis disajikan via Cloudinary CDN.

### Aksesibilitas
- Kursi difabel (wheelchair) selalu tersedia dan diberi label jelas.
- Kontras warna memenuhi standar WCAG 2.1 AA.
- Dukungan screen reader di aplikasi mobile (Flutter Semantics).

---

## 14. Alur Bisnis Kritis

### Alur 1: Pemesanan Tiket (Happy Path)

```
User buka App
  -> Pilih Film
  -> Pilih Tanggal & Jam (Showtime)
  -> Pilih Kursi
       -> [API] POST /bookings/lock-seats
       -> DB: UPDATE showtime_seats SET status='LOCKED', locked_until=NOW()+10min WHERE ...
       -> Berhasil: Lanjut ke Checkout
  -> (Opsional) Tambah F&B
  -> Masukkan Voucher
  -> Klik "Bayar"
       -> [API] POST /bookings/create
       -> DB: INSERT bookings + booking_items + booking_foods
       -> Panggil Midtrans API: buat transaksi -> return snap_token
  -> Tampilkan Midtrans Snap UI
  -> User bayar (GoPay / QRIS / VA)
  -> Midtrans kirim webhook ke [API] POST /payments/midtrans/notification
       -> Verifikasi signature Midtrans
       -> UPDATE payments SET status='SUCCESS'
       -> UPDATE bookings SET status='CONFIRMED'
       -> UPDATE showtime_seats SET status='BOOKED' (hapus lock)
       -> Kirim email konfirmasi ke user
       -> Push notification ke user
  -> App menerima event "booking_confirmed" via WebSocket / polling
  -> Tampilkan halaman Tiket Digital [OK]
```

### Alur 2: Pencegahan Double Booking (Race Condition)

```
User A memilih kursi B5
  -> API: UPDATE showtime_seats SET status='LOCKED', locked_by=userA, locked_until=T+10min
     WHERE status='AVAILABLE' AND showtime_id=X AND seat_id=B5
  -> Berhasil: 1 row updated -> Lock berhasil untuk User A

User B memilih kursi B5 pada waktu yang sama (concurrent)
  -> API: UPDATE showtime_seats SET status='LOCKED', locked_by=userB, locked_until=T+10min
     WHERE status='AVAILABLE' AND showtime_id=X AND seat_id=B5
  -> Gagal: 0 rows updated (status sudah 'LOCKED' bukan 'AVAILABLE')
  -> Return Error: {code: "SEAT_ALREADY_LOCKED", message: "Kursi B5 sedang dipesan orang lain"}
  -> User B diminta pilih kursi lain [OK]
```

### Alur 3: Lock Kadaluarsa (Background Job)

```
[Background Job - berjalan setiap 1 menit via setInterval atau cron]
  -> UPDATE showtime_seats SET status='AVAILABLE', locked_by_user_id=NULL, locked_until=NULL
     WHERE status='LOCKED' AND locked_until < NOW()
  -> PostgreSQL NOTIFY 'seat_status_changed', payload
  -> Backend (LISTEN) menerima notify
  -> WebSocket broadcast ke semua user di halaman seat map showtime tersebut
  -> Kursi kembali tampil sebagai TERSEDIA di semua device [OK]
```

---

## 15. Roadmap Pengembangan (Phase)

### Phase 1 — Foundation & MVP (Bulan 1–3)
Target: Platform bisa digunakan end-to-end dari admin input jadwal hingga pelanggan beli tiket.

- [ ] Setup monorepo, konfigurasi Bun, Drizzle, PostgreSQL
- [ ] Skema database lengkap + migrasi awal
- [ ] Autentikasi (register, login, JWT, OTP)
- [ ] CRUD Kota, Mall, Bioskop, Studio, Kursi (Admin)
- [ ] CRUD Film (Admin)
- [ ] CRUD Jadwal Tayang (Admin)
- [ ] Seat Map Builder (Admin Web)
- [ ] Seat Locking API & Booking API
- [ ] Integrasi Midtrans
- [ ] Tiket Digital (QR Code generation dengan JWT signing)
- [ ] Admin Dashboard Web (semua fitur manajemen dasar)
- [ ] Aplikasi Mobile Flutter (alur booking end-to-end)
- [ ] Notifikasi Email (Resend)
- [ ] E-Ticket Validation (Admin scan QR)

### Phase 2 — Growth Features (Bulan 4–6)
Target: Tingkatkan retensi dan pendapatan.

- [ ] F&B Ordering (Concession)
- [ ] Program Loyalitas XII Points
- [ ] Voucher & Promo System
- [ ] Review & Rating Film (Mobile)
- [ ] Push Notification via FCM
- [ ] Real-time Seat Map via WebSocket
- [ ] Laporan & Analitik Lanjutan (Admin)
- [ ] Profil & Pengaturan Lengkap (Mobile)
- [ ] Web Publik Customer (Next.js)

### Phase 3 — Scale & Polish (Bulan 7–9)
Target: Optimasi performa dan siapkan multi-kota besar.

- [ ] Integrasi TMDB API (auto-fill metadata film)
- [ ] Dark Mode (Mobile & Web)
- [ ] Multi-bahasa (EN/ID)
- [ ] Redis untuk seat locking (jika traffic tinggi)
- [ ] Admin Analytics Dashboard dengan grafik interaktif
- [ ] Program Referral
- [ ] Fitur "Nonton Bareng" (berbagi link kursi ke teman)
- [ ] Login sosial (Google Sign-In)
- [ ] Read replica PostgreSQL

---

## 16. Metrik Kesuksesan (KPI)

| Kategori | Metrik | Target (3 Bulan Post-Launch) |
|---|---|---|
| Akuisisi | Jumlah pengguna terdaftar | > 5.000 user |
| Aktivasi | % user yang menyelesaikan booking pertama | > 60% |
| Retensi | Monthly Active Users (MAU) | > 2.000 |
| Transaksi | Tiket terjual per bulan | > 10.000 tiket |
| Pendapatan | Gross Merchandise Value (GMV) | > IDR 500 Juta/bulan |
| Performa | API Uptime | > 99.9% |
| Teknis | Crash-free sessions (Mobile) | > 99.5% |
| Loyalitas | % user aktif XII Points | > 30% |
| Kepuasan | Net Promoter Score (NPS) | > +40 |

---

## 17. Risiko & Mitigasi

| Risiko | Level | Mitigasi |
|---|---|---|
| Double booking / race condition | HIGH | PostgreSQL `WHERE status='AVAILABLE'` atomic update + idempotency key |
| Kegagalan Midtrans | MEDIUM | Webhook retry mechanism; grace period sebelum booking dibatalkan; tampilkan pesan informatif |
| Gambar poster lambat dimuat | MEDIUM | Cloudinary CDN + lazy loading + blur placeholder |
| Seat map tidak sync antar user | MEDIUM | WebSocket real-time; fallback polling setiap 30 detik jika WS disconnect |
| Skalabilitas DB saat blockbuster | MEDIUM | Connection pooling; Redis (Phase 3); read replica PostgreSQL |
| Pemalsuan QR Code tiket | HIGH | QR berisi JWT signed dengan private key; verifikasi signature di server saat scan |
| User salah pilih kursi | LOW | Fitur pembatalan dengan kebijakan refund jelas (> 2 jam sebelum tayang = refund penuh) |
| Keamanan Admin Dashboard | MEDIUM | CORS whitelist; header security (HSTS, CSP, X-Frame-Options); rate limiting |

---

*PRD ini adalah dokumen hidup. Akan diperbarui seiring dengan perkembangan diskusi tim, feedback pengguna, dan perubahan prioritas bisnis.*

**Next Step**: Wireframe / Mockup UI untuk masing-masing screen (Mobile & Admin Web).
