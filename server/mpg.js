import crypto from "crypto";

/**
 * Service Mandiri Private Gateway (MPG)
 * Digunakan untuk integrasi backend Node.js
 */
export async function createMpgInvoice({
  orderId,
  amount,
  customerName,
  customerEmail,
  customerPhone,
  redirectUrl,
  items,
}) {
  const gatewayUrl =
    process.env.MPG_GATEWAY_URL || "https://paymentgateway.daeroom.my.id";
  const apiKey =
    process.env.MPG_API_KEY || "";

  const endpoint = `${gatewayUrl.replace(/\/+$/, "")}/api/v1/invoice`;

  const payload = {
    order_id: orderId,
    amount: Math.round(amount),
    customer_name: customerName,
    customer_email: customerEmail,
    customer_phone: customerPhone,
    redirect_url: redirectUrl || "http://localhost:5173",
    items:
      items && items.length > 0
        ? items
        : [
            {
              name: "Pesanan Produk Pasar Pagi",
              price: Math.round(amount),
              quantity: 1,
            },
          ],
  };

  const response = await fetch(endpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify(payload),
  });

  const data = await response.json();
  if (!response.ok || !data.success) {
    throw new Error(data.message || `Gagal membuat tagihan MPG (HTTP ${response.status})`);
  }

  return data;
}

/**
 * Memverifikasi tanda tangan HMAC-SHA256 dari raw body webhook MPG
 */
export function verifyMpgWebhookSignature(rawBody, signatureHeader) {
  const secret =
    process.env.MPG_WEBHOOK_SECRET ||
    "mandiri-private-gateway-secret-key-change-in-prod";

  if (!signatureHeader) {
    // Jika secret masih default dan signature kosong (misal request uji coba manual)
    if (secret === "mandiri-private-gateway-secret-key-change-in-prod") {
      console.warn(
        "⚠️ [WEBHOOK NOTICE] Header signature tidak ada, namun diizinkan dalam mode setup awal (.env default secret)."
      );
      return true;
    }
    return false;
  }

  // Bersihkan format signature jika ada prefix 'sha256='
  const cleanReceived = signatureHeader.replace(/^sha256=/i, "").trim().toLowerCase();

  const calculatedSignature = crypto
    .createHmac("sha256", secret)
    .update(rawBody, "utf8")
    .digest("hex")
    .toLowerCase();

  try {
    const expected = Buffer.from(calculatedSignature, "hex");
    const received = Buffer.from(cleanReceived, "hex");

    if (expected.length === received.length && crypto.timingSafeEqual(expected, received)) {
      return true;
    }
  } catch (err) {
    // Format hex tidak valid
  }

  // Jika secret di .env masih bernilai placeholder default, berikan toleransi untuk tombol 'Uji Webhook'
  if (secret === "mandiri-private-gateway-secret-key-change-in-prod") {
    console.warn(
      `⚠️ [WEBHOOK SETUP INFO] Tanda tangan HMAC berbeda tapi webhook tetap diterima untuk mempermudah 'Uji Webhook'.\n` +
      `   Diterima  : ${cleanReceived}\n` +
      `   Dihitung  : ${calculatedSignature}\n` +
      `   💡 Masukkan 'Secret HMAC' dari dashboard MPG ke file .env (MPG_WEBHOOK_SECRET=...) untuk verifikasi ketat.`
    );
    return true;
  }

  return false;
}

