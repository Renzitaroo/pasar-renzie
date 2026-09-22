import { NextRequest, NextResponse } from "next/server";
import { createMpgInvoice } from "@/lib/mpg";
import { createOrderRecord } from "@/lib/order-db";

export async function POST(req: NextRequest) {
  try {
    let body: any = {};
    const contentType = req.headers.get("content-type") || "";

    if (contentType.includes("application/json")) {
      body = await req.json();
    } else if (contentType.includes("application/x-www-form-urlencoded")) {
      const formData = await req.formData();
      body = Object.fromEntries(formData.entries());
    }

    const amount = Number(body.amount) || 50000;
    const customerName = (body.customer_name as string) || "Budi Santoso";
    const customerEmail = (body.customer_email as string) || "budi@example.com";
    const customerPhone = (body.customer_phone as string) || "081234567890";

    // 1. Buat order_id unik sistem
    const orderId = `ORDER-${Date.now()}-${Math.floor(1000 + Math.random() * 9000)}`;

    // 2. Simpan order ke database berstatus PENDING
    await createOrderRecord({
      orderId,
      amount,
      customerName,
      customerEmail,
      customerPhone,
      status: "PENDING",
      serviceActivated: false,
    });

    // 3. Panggil API Mandiri Private Gateway untuk menerbitkan QRIS
    const mpgResponse = await createMpgInvoice({
      order_id: orderId,
      amount: amount,
      customer_name: customerName,
      customer_email: customerEmail,
      customer_phone: customerPhone,
      redirect_url: `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/checkout/success?order_id=${orderId}`,
      items: [
        {
          name: (body.item_name as string) || "Langganan / Produk Digital",
          price: amount,
          quantity: 1,
        },
      ],
    });

    const checkoutUrl = mpgResponse.data?.checkout_url;

    if (!checkoutUrl) {
      return NextResponse.json(
        { success: false, message: "Gateway tidak mengembalikan checkout_url" },
        { status: 502 }
      );
    }

    // 4. Periksa apakah pemanggil menginginkan JSON atau langsung Redirect Browser
    const wantsJson =
      req.headers.get("accept")?.includes("application/json") &&
      !contentType.includes("application/x-www-form-urlencoded");

    if (wantsJson) {
      return NextResponse.json({
        success: true,
        order_id: orderId,
        checkout_url: checkoutUrl,
        final_amount: mpgResponse.data?.final_amount || mpgResponse.data?.amount,
        unique_code: mpgResponse.data?.unique_code || 0,
        qr_string: mpgResponse.data?.qr_string || mpgResponse.data?.qris_string,
      });
    }

    // Opsi A: Langsung redirect browser pembeli ke Hosted QRIS Checkout
    return NextResponse.redirect(checkoutUrl, 303);
  } catch (error: any) {
    console.error("[CHECKOUT_ERROR]", error);
    return NextResponse.json(
      {
        success: false,
        message: error.message || "Terjadi kesalahan internal server",
      },
      { status: 500 }
    );
  }
}
