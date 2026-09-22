# 🚀 MPG Server (Mandiri Private Gateway Node.js)

Server mandiri ringan (tanpa dependensi eksternal, menggunakan modul bawaan Node.js `http` dan `crypto`) untuk menangani checkout QRIS dan webhook Mandiri Private Gateway.

## Cara Menjalankan

```bash
node server/index.js
```

Server akan aktif di `http://localhost:3001` dengan endpoint:
1. `POST /api/checkout` — Membuat invoice QRIS ke MPG gateway dan mengembalikan `checkout_url`.
2. `POST /api/webhook/payment-success` — Menerima notifikasi uang masuk dari HP Android Kasir (aplikasi MPG Listener) dengan verifikasi HMAC-SHA256 & idempotensi.
