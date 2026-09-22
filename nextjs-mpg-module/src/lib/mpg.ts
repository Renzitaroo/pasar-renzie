import crypto from "crypto";

export interface InvoiceItem {
  name: string;
  price: number;
  quantity: number;
}

export interface CreateInvoiceParams {
  order_id: string;
  amount: number;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  redirect_url?: string;
  items?: InvoiceItem[];
}

export interface InvoiceData {
  id?: string;
  order_id: string;
  amount: number;
  base_amount?: number;
  unique_code?: number;
  final_amount?: number;
  qr_string?: string;
  qris_string?: string;
  checkout_url: string;
  expires_at?: string;
  expired_at?: string;
  status?: string;
}

export interface InvoiceResponse {
  success: boolean;
  message?: string;
  data?: InvoiceData;
}

export interface WebhookPayload {
  event: string;
  order_id: string;
  amount: number;
  base_amount?: number;
  unique_code?: number;
  detected_bank: string;
  paid_at: string;
}

/**
 * Service untuk membuat invoice pembayaran QRIS ke Mandiri Private Gateway (MPG)
 */
export async function createMpgInvoice(
  params: CreateInvoiceParams
): Promise<InvoiceResponse> {
  const gatewayUrl =
    process.env.MPG_GATEWAY_URL || "https://paymentgateway.daeroom.my.id";
  const apiKey = process.env.MPG_API_KEY;

  if (!apiKey) {
    throw new Error("MPG_API_KEY belum dikonfigurasi di file environment.");
  }

  const endpoint = `${gatewayUrl.replace(/\/+$/, "")}/api/v1/invoice`;

  const payload = {
    order_id: params.order_id,
    amount: Math.round(params.amount),
    customer_name: params.customer_name,
    customer_email: params.customer_email,
    customer_phone: params.customer_phone,
    redirect_url:
      params.redirect_url ||
      `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/checkout/success?order_id=${params.order_id}`,
    items:
      params.items && params.items.length > 0
        ? params.items
        : [
            {
              name: "Produk / Layanan Digital",
              price: Math.round(params.amount),
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
    cache: "no-store",
  });

  const responseData = (await response.json()) as InvoiceResponse;

  if (!response.ok || !responseData.success) {
    throw new Error(
      responseData.message ||
        `Gagal membuat tagihan MPG (HTTP status: ${response.status})`
    );
  }

  return responseData;
}

/**
 * Memvalidasi tanda tangan HMAC-SHA256 dari raw body webhook
 * Menggunakan crypto.timingSafeEqual untuk mencegah serangan Timing Attack
 */
export function verifyMpgWebhookSignature(
  rawBody: string,
  signatureHeader: string | null
): boolean {
  const secret = process.env.MPG_WEBHOOK_SECRET;

  if (!secret || !signatureHeader) {
    return false;
  }

  const calculatedSignature = crypto
    .createHmac("sha256", secret)
    .update(rawBody, "utf8")
    .digest("hex");

  const expectedBuffer = Buffer.from(calculatedSignature, "hex");
  const receivedBuffer = Buffer.from(signatureHeader, "hex");

  if (expectedBuffer.length !== receivedBuffer.length) {
    return false;
  }

  return crypto.timingSafeEqual(expectedBuffer, receivedBuffer);
}
