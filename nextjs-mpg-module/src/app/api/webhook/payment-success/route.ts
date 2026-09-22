import { NextRequest, NextResponse } from "next/server";
import { verifyMpgWebhookSignature, WebhookPayload } from "@/lib/mpg";
import { findOrderByOrderId, updateOrderStatus } from "@/lib/order-db";

/**
 * Handler Webhook Pembayaran Mandiri Private Gateway (MPG)
 * Endpoint: POST /api/webhook/payment-success
 */
export async function POST(req: NextRequest) {
  try {
    // 1. Dapatkan RAW BODY sebagai string murni untuk kalkulasi HMAC yang akurat
    const rawBody = await req.text();

    // 2. Ambil tanda tangan dari Header 'X-Callback-Signature'
    const signatureHeader = req.headers.get("x-callback-signature");

    if (!signatureHeader) {
      console.warn("[WEBHOOK_REJECTED] Header X-Callback-Signature tidak ditemukan.");
      return NextResponse.json(
        { success: false, message: "Missing signature header" },
        { status: 401 }
      );
    }

    // 3. Verifikasi validitas tanda tangan HMAC-SHA256
    const isSignatureValid = verifyMpgWebhookSignature(rawBody, signatureHeader);

    if (!isSignatureValid) {
      console.error("[WEBHOOK_UNAUTHORIZED] Tanda tangan HMAC tidak cocok.");
      return NextResponse.json(
        { success: false, message: "Invalid callback signature" },
        { status: 401 }
      );
    }

    // 4. Parse JSON payload setelah verifikasi keamanan lolos
    const payload = JSON.parse(rawBody) as WebhookPayload;

    console.log(
      `[WEBHOOK_RECEIVED] Event: ${payload.event} | Order ID: ${payload.order_id}`
    );

    // Pastikan event yang diterima adalah 'payment.success'
    if (payload.event !== "payment.success") {
      return NextResponse.json(
        { success: true, message: `Event '${payload.event}' diabaikan.` },
        { status: 200 }
      );
    }

    // 5. Cek data pesanan di database
    const order = await findOrderByOrderId(payload.order_id);

    if (!order) {
      console.error(
        `[WEBHOOK_ERROR] Order ID ${payload.order_id} tidak ditemukan di database.`
      );
      return NextResponse.json(
        { success: false, message: "Order not found" },
        { status: 404 }
      );
    }

    // 6. IDEMPOTENCY CHECK: Jika order sudah berstatus PAID, hindari eksekusi ganda
    if (order.status === "PAID") {
      console.log(
        `[WEBHOOK_IDEMPOTENT] Order ID ${payload.order_id} sudah lunas sebelumnya.`
      );
      return NextResponse.json(
        {
          success: true,
          message: "Order already marked as paid (Idempotent response)",
        },
        { status: 200 }
      );
    }

    // 7. Perbarui status pesanan menjadi PAID di database
    const paidDate = payload.paid_at ? new Date(payload.paid_at) : new Date();

    await updateOrderStatus(payload.order_id, {
      status: "PAID",
      finalAmount: payload.amount,
      detectedBank: payload.detected_bank,
      paidAt: paidDate,
      serviceActivated: true,
    });

    // 8. Logika Bisnis: Aktifkan langganan / kirim email notifikasi / perpanjang masa aktif
    await activateCustomerService({
      orderId: payload.order_id,
      customerEmail: order.customerEmail,
      amount: payload.amount,
      bank: payload.detected_bank,
    });

    console.log(
      `[PAYMENT_SUCCESS] Order ${payload.order_id} LUNAS via ${payload.detected_bank} nominal Rp ${payload.amount.toLocaleString("id-ID")}`
    );

    // 9. Wajib mengembalikan HTTP 200 dengan payload JSON {"success": true}
    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error: any) {
    console.error("[WEBHOOK_INTERNAL_ERROR]", error);
    return NextResponse.json(
      { success: false, message: "Internal Server Error" },
      { status: 500 }
    );
  }
}

/**
 * Fungsi pembantu untuk aktivasi layanan pembeli secara instan
 */
async function activateCustomerService(data: {
  orderId: string;
  customerEmail: string;
  amount: number;
  bank: string;
}) {
  console.log(
    `[SERVICE_ACTIVATION] Layanan untuk ${data.customerEmail} (Order ${data.orderId}) telah aktif secara otomatis.`
  );
}
