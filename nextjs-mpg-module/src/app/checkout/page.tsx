import React from "react";

export default function CheckoutPage() {
  return (
    <div
      style={{
        maxWidth: 480,
        margin: "60px auto",
        padding: 30,
        fontFamily: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
        border: "1px solid #eaeaea",
        borderRadius: 12,
        boxShadow: "0 4px 20px rgba(0,0,0,0.05)",
      }}
    >
      <div style={{ marginBottom: 20 }}>
        <span
          style={{
            display: "inline-block",
            padding: "4px 10px",
            backgroundColor: "#e6f4ea",
            color: "#137333",
            borderRadius: 20,
            fontSize: 12,
            fontWeight: 700,
            marginBottom: 8,
          }}
        >
          Mandiri Private Gateway (0% MDR)
        </span>
        <h2 style={{ margin: "4px 0 8px", fontSize: 22, color: "#111" }}>
          Konfirmasi Pembayaran QRIS
        </h2>
        <p style={{ margin: 0, color: "#666", fontSize: 14, lineHeight: 1.5 }}>
          Dukung pembayaran langsung melalui QRIS Dinamis ke rekening Mandiri pribadi
          tanpa potongan perantara.
        </p>
      </div>

      <form action="/api/checkout" method="POST">
        <div style={{ marginBottom: 16 }}>
          <label style={{ display: "block", marginBottom: 6, fontSize: 13, fontWeight: 700, color: "#333" }}>
            Nama Lengkap
          </label>
          <input
            type="text"
            name="customer_name"
            defaultValue="Budi Santoso"
            required
            style={{
              width: "100%",
              padding: "10px 12px",
              borderRadius: 8,
              border: "1px solid #ccc",
              fontSize: 14,
              boxSizing: "border-box",
            }}
          />
        </div>

        <div style={{ marginBottom: 16 }}>
          <label style={{ display: "block", marginBottom: 6, fontSize: 13, fontWeight: 700, color: "#333" }}>
            Alamat Email
          </label>
          <input
            type="email"
            name="customer_email"
            defaultValue="budi@example.com"
            required
            style={{
              width: "100%",
              padding: "10px 12px",
              borderRadius: 8,
              border: "1px solid #ccc",
              fontSize: 14,
              boxSizing: "border-box",
            }}
          />
        </div>

        <div style={{ marginBottom: 20 }}>
          <label style={{ display: "block", marginBottom: 6, fontSize: 13, fontWeight: 700, color: "#333" }}>
            Nomor WhatsApp / HP
          </label>
          <input
            type="tel"
            name="customer_phone"
            defaultValue="081234567890"
            required
            style={{
              width: "100%",
              padding: "10px 12px",
              borderRadius: 8,
              border: "1px solid #ccc",
              fontSize: 14,
              boxSizing: "border-box",
            }}
          />
        </div>

        <input type="hidden" name="amount" value="50000" />
        <input type="hidden" name="item_name" value="Pesanan Produk / Layanan" />

        <div
          style={{
            padding: "12px 16px",
            backgroundColor: "#fafafa",
            borderRadius: 8,
            marginBottom: 20,
            border: "1px solid #eee",
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: 14, color: "#555" }}>
            <span>Tagihan Pokok</span>
            <span>Rp 50.000</span>
          </div>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              fontSize: 12,
              color: "#888",
              marginTop: 4,
            }}
          >
            <span>Kode Unik 3-Digit</span>
            <span>Ditambahkan otomatis</span>
          </div>
        </div>

        <button
          type="submit"
          style={{
            width: "100%",
            padding: "14px 20px",
            backgroundColor: "#2e7d32",
            color: "#fff",
            border: "none",
            borderRadius: 8,
            fontSize: 15,
            fontWeight: 700,
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 8,
          }}
        >
          Lanjut ke QRIS Mandiri Private Gateway &rarr;
        </button>
      </form>
    </div>
  );
}
