import React from "react";
import Link from "next/link";
import { findOrderByOrderId } from "@/lib/order-db";

interface PageProps {
  searchParams: Promise<{ order_id?: string }>;
}

export default async function PaymentSuccessPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const orderId = params.order_id || "";
  const order = orderId ? await findOrderByOrderId(orderId) : null;

  return (
    <div
      style={{
        maxWidth: 520,
        margin: "80px auto",
        textAlign: "center",
        fontFamily: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
        padding: 30,
        border: "1px solid #eaeaea",
        borderRadius: 12,
        boxShadow: "0 4px 20px rgba(0,0,0,0.05)",
      }}
    >
      <div style={{ fontSize: 56, marginBottom: 12 }}>🎉</div>
      <h1 style={{ color: "#16a34a", fontSize: 24, margin: "0 0 8px" }}>
        Pembayaran Sedang Divalidasi!
      </h1>
      <p style={{ fontSize: 14, color: "#555", lineHeight: 1.5, margin: "0 0 20px" }}>
        Terima kasih! Notifikasi pembayaran untuk pesanan <strong>#{orderId}</strong> sedang
        dicocokkan secara otomatis oleh HP Android Kasir (MPG Listener).
      </p>

      {order && (
        <div
          style={{
            background: "#fafafa",
            padding: 16,
            borderRadius: 8,
            marginBottom: 24,
            textAlign: "left",
            border: "1px solid #eee",
            fontSize: 14,
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
            <span style={{ color: "#666" }}>Status Transaksi:</span>
            <span
              style={{
                fontWeight: 700,
                color: order.status === "PAID" ? "#16a34a" : "#ea580c",
              }}
            >
              {order.status === "PAID" ? "✅ LUNAS" : "⏳ MENUNGGU TRANSFER"}
            </span>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
            <span style={{ color: "#666" }}>Penerima:</span>
            <strong>{order.customerName}</strong>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
            <span style={{ color: "#666" }}>Total Pembayaran:</span>
            <strong>Rp {(order.finalAmount || order.amount).toLocaleString("id-ID")}</strong>
          </div>
          {order.detectedBank && (
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span style={{ color: "#666" }}>Metode Bayar:</span>
              <strong>{order.detectedBank}</strong>
            </div>
          )}
        </div>
      )}

      <Link
        href="/"
        style={{
          display: "inline-block",
          padding: "12px 24px",
          backgroundColor: "#111",
          color: "white",
          textDecoration: "none",
          borderRadius: 8,
          fontSize: 14,
          fontWeight: 600,
        }}
      >
        &larr; Kembali ke Beranda
      </Link>
    </div>
  );
}
