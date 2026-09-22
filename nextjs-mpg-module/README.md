# 💳 Mandiri Private Gateway (MPG) - Modul Next.js 15 (App Router)

Modul integrasi pembayaran QRIS Dinamis Mandiri tanpa perantara pihak ketiga dan 0% potongan MDR untuk **Next.js 15 (App Router)**.

---

## 📁 Struktur File Modul

```text
nextjs-mpg-module/
├── .env.local.example                      # Template variabel lingkungan
├── README.md                               # Panduan integrasi
└── src/
    ├── lib/
    │   ├── mpg.ts                          # Service API MPG & Verifikator HMAC-SHA256
    │   └── order-db.ts                     # Model penyimpanan pesanan & idempotensi
    └── app/
        ├── api/
        │   ├── checkout/
        │   │   └── route.ts                # Endpoint pembuatan invoice & Hosted Redirect (Opsi A)
        │   └── webhook/
        │       └── payment-success/
        │           └── route.ts            # Receiver Webhook dengan validasi tanda tangan HMAC
        └── checkout/
            ├── page.tsx                    # Halaman UI Form Pembelian
            └── success/
                └── page.tsx                # Halaman UI Konfirmasi Pembayaran
```

---

## 🚀 Cara Pemasangan di Next.js 15

1. **Salin Folder**:
   Salin isi folder `src/` ke proyek Next.js 15 Anda (`@/lib/` dan `@/app/`).

2. **Konfigurasi Environment (`.env.local`)**:
   ```env
   MPG_GATEWAY_URL=https://paymentgateway.daeroom.my.id
   MPG_API_KEY=mpg_live_f89a3c10b7d24e6a8e5c3b1a9f0d7e2c
   MPG_WEBHOOK_SECRET=mandiri-private-gateway-secret-key-change-in-prod
   NEXT_PUBLIC_APP_URL=https://website-anda.com
   ```

3. **Daftarkan Webhook URL di Dashboard MPG**:
   Setel Webhook URL ke:
   ```text
   https://website-anda.com/api/webhook/payment-success
   ```

---

## 🔒 Fitur Keamanan & Standar Teknis

- **Timing-Safe HMAC Verification**: Menggunakan `crypto.timingSafeEqual` untuk mencegah *Timing Attacks*.
- **Raw Body Streaming**: Membaca *raw text body* sebelum parsing JSON guna menjamin integritas tanda tangan `X-Callback-Signature`.
- **Idempotency Guard**: Menjamin webhook ganda tidak memicu aktivasi atau pengiriman produk lebih dari 1 kali.
- **Hosted Checkout Mode (Opsi A)**: Otomatis mengarahkan pembeli ke layar QRIS resmi gateway dengan status HTTP 303.
