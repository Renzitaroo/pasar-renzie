# 🌿 Pasar Renzie — Modern Fresh Produce E-Commerce 

> Platform belanja buah & sayur segar organik dengan autentikasi Google Identity, onboarding maskot lucu, slider takaran volume smartphone, serta pembayaran QRIS Dinamis Mandiri 0% MDR tanpa perantara pihak ketiga.

[![Vite](https://img.shields.io/badge/Vite-5.x-646CFF?style=flat-square&logo=vite&logoColor=white)](https://vitejs.dev/)
[![JavaScript](https://img.shields.io/badge/Vanilla_JS-ES6+-F7DF1E?style=flat-square&logo=javascript&logoColor=black)](https://developer.mozilla.org/)
[![Next.js](https://img.shields.io/badge/Next.js-15_Ready-black?style=flat-square&logo=next.js&logoColor=white)](https://nextjs.org/)
[![Node.js](https://img.shields.io/badge/Node.js-ESM-339933?style=flat-square&logo=node.js&logoColor=white)](https://nodejs.org/)
[![License](https://img.shields.io/badge/License-MIT-green?style=flat-square)](#)

---

## 📖 Gambaran Umum

**Pasar Renzie** adalah aplikasi web e-commerce hasil kebun modern yang dirancang dengan estetika visual editorial Swiss yang bersih (*Cormorant Garamond* & *Manrope*). Aplikasi ini menggabungkan pengalaman belanja ramah pengguna dengan infrastruktur pembayaran mandiri langsung ke rekening bank pemilik toko (*Direct Payment Gateway*).

---

## ✨ Fitur Unggulan

### 1. 🔐 Autentikasi Google & Gated Store
- **Google Identity Services (GIS)**: Login aman 1-klik menggunakan akun Google resmi.
- **Toko Terproteksi (Gated Store)**: Pengunjung publik hanya dapat menjelajahi halaman Beranda dan informasi cerita petani. Menu belanja dan katalog Toko hanya dapat diakses setelah pengguna masuk akun Google.
- **Akun Onboarding Interaktif**:
  - Pengisian nama lengkap dan usia pelanggan.
  - Multi-select tag buah dan sayur favorit.
  - Pilihan 12 koleksi avatar maskot buah & sayur lucu dengan palet warna pastel yang selaras.

### 2. 🥦 Katalog Segar & Kontrol Takaran Cerdas
- **Manajemen Stok Riil Berbasis Kg**: Pengurangan kuantitas stok otomatis secara desimal saat pesanan terbit.
- **Slider Takaran Volume Smartphone**:
  - Geser intuitif 60 FPS untuk menentukan berat belanjaan (rentang 0.25 kg hingga 5.0 kg).
  - Skema harga grosir dinamis: makin besar takaran, makin hemat harga per kilogram.
- **Pencarian Real-Time**: Temukan buah dan sayur favorit secara instan tanpa reload halaman.

### 3. 💳 Pembayaran Mandiri QRIS Dinamis 0% MDR (MPG)
- **Mandiri Private Gateway (MPG)**:
  - Pembayaran langsung ke rekening pribadi tanpa perantara agregator pihak ketiga (0% potongan biaya MDR).
  - **Kode Unik Otomatis**: Menambahkan 3 digit angka unik acak untuk rekonsiliasi mutasi otomatis.
  - **Hosted Checkout Redirect**: Otomatis mengarahkan pembeli ke barcode QRIS resmi berbatas waktu (15 menit).
  - **Transfer Multi-Bank**: Rekening BCA, Mandiri, BRI, dan BNI dengan fitur *1-Click Copy* nomor rekening.
  - **Bayar di Tempat (COD)**: Opsi pembayaran tunai saat kurir tiba di lokasi pembeli.

### 4. ⚡ Webhook Receiver & Idempotensi Mutasi
- **Verifikasi HMAC-SHA256 Timing-Safe**: Mencegah *timing-attack* dan spoofing notifikasi mutasi dari HP kasir.
- **Idempotency Guard**: Menjamin status transaksi yang sudah `PAID` tidak diproses berulang kali.
- **Ngrok Public Tunnel Ready**: Kemudahan pengujian webhook langsung di lingkungan pengembangan lokal (*localhost*).

---

## 🏗️ Struktur Proyek

```text
pasar-renzie/
├── index.html                          # Halaman SPA Utama & Dialog Modal
├── main.js                             # Mesin Aplikasi Frontend, Router SPA, & Pembayaran
├── style.css                           # Desain UI, Tipografi & Efek Transisi
├── vite.config.js                      # Konfigurasi Vite & Reverse Proxy Gateway
├── package.json                        # Definisi Paket & Script Proyek
├── .env.example                        # Template Environment Variables
│
├── server/                             # 🚀 Backend Webhook Server (Node.js ESM)
│   ├── index.js                        # HTTP Server (Port 3001) melayani API Checkout & Webhook
│   ├── mpg.js                          # Library Service API Gateway & Verifikasi HMAC
│   └── README.md                       # Dokumentasi Backend Server
│
└── nextjs-mpg-module/                  # 📦 Modul Standalone Next.js 15 (App Router)
    ├── README.md                       # Panduan Migrasi ke Next.js 15
    ├── .env.local.example              # Template Environment Next.js
    └── src/
        ├── lib/
        │   ├── mpg.ts                  # Service MPG & Verifikator HMAC-SHA256
        │   └── order-db.ts             # In-memory Store & Idempotensi
        └── app/
            ├── api/
            │   ├── checkout/route.ts   # POST: Buat Invoice & Redirect Hosted Checkout
            │   └── webhook/payment-success/route.ts # POST: Receiver Webhook Aman
            └── checkout/
                ├── page.tsx            # Halaman Form Checkout Demo
                └── success/page.tsx    # Halaman Konfirmasi Lunas
```

---

## 🚀 Panduan Instalasi & Menjalankan

### 1. Prasyarat
- [Node.js](https://nodejs.org/) versi 18 atau lebih baru.
- Akun Google Cloud Console (untuk OAuth Client ID).
- Akun Mandiri Private Gateway (MPG) aktif.

### 2. Kloning & Pengaturan Environment
```bash
# Masuk ke direktori proyek
cd "project pasar pagi"

# Salin template konfigurasi environment
cp .env.example .env
```

Buka file `.env` dan lengkapi variabel berikut:
```env
# Google OAuth 2.0 Client ID
VITE_GOOGLE_CLIENT_ID=your-google-client-id.apps.googleusercontent.com

# Mandiri Private Gateway (MPG)
MPG_GATEWAY_URL=https://paymentgateway.daeroom.my.id
MPG_API_KEY=your-live-mpg-api-key
MPG_WEBHOOK_SECRET=your-webhook-hmac-secret

# Variabel Frontend Client
VITE_MPG_GATEWAY_URL=https://paymentgateway.daeroom.my.id
VITE_MPG_API_KEY=your-live-mpg-api-key
```

### 3. Pasang Dependensi & Jalankan Frontend
```bash
npm install
npm run dev
```
Buka browser pada alamat: **`http://localhost:5173`**

### 4. Jalankan Backend Webhook Server (Port 3001)
Buka terminal baru:
```bash
npm run server
```
Server aktif dan melayani endpoint:
- **Health Check**: `GET http://localhost:3001/api/health`
- **Checkout Proxy**: `POST http://localhost:3001/api/checkout`
- **Webhook Receiver**: `POST http://localhost:3001/api/webhook/payment-success`
- **Cek Status Pesanan**: `GET http://localhost:3001/api/order-status?order_id=PP-XXXXXX`

---

## 🌐 Menghubungkan Webhook ke Internet (Ngrok)

Karena server cloud MPG memerlukan alamat URL publik untuk mengirimkan notifikasi mutasi kasir, gunakan tunneling:

```bash
ngrok http 3001
```

Salin URL HTTPS publik yang dihasilkan (contoh: `https://xxxx.ngrok-free.dev`) dan daftarkan ke dashboard MPG:
```text
Webhook Notification URL:
https://xxxx.ngrok-free.dev/api/webhook/payment-success
```

---

## 📦 Menggunakan Modul di Proyek Next.js 15

Bagi Anda yang membangun aplikasi menggunakan Next.js 15 App Router:
1. Salin folder [`nextjs-mpg-module/src`](file:///c:/project%20pasar%20pagi/nextjs-mpg-module/src) ke dalam direktori aplikasi Next.js Anda.
2. Salin isi [`.env.local.example`](file:///c:/project%20pasar%20pagi/nextjs-mpg-module/.env.local.example) ke `.env.local`.
3. Rute checkout (`/api/checkout`) dan webhook (`/api/webhook/payment-success`) langsung aktif secara native.

---

## 🔒 Keamanan & Praktik Terbaik

- **Penyimpanan Kunci Rahasia**: Seluruh kredensial API dan Secret HMAC disimpan di dalam `.env` dan dikecualikan dari Git melalui `.gitignore`.
- **Sanitasi Masukan Pelanggan**: Catatan pesanan dan teks formulir dibersihkan untuk mencegah serangan *Cross-Site Scripting* (XSS).
- **Verifikasi Kriptografis Timing-Safe**: Perbandingan tanda tangan webhook menggunakan `crypto.timingSafeEqual` guna melindungi sistem dari eksploitasi celah waktu (*timing attacks*).

---

## 📄 Lisensi
Didistribusikan di bawah lisensi MIT. Hak Cipta &copy; 2026 **Pasar Renzie**.
