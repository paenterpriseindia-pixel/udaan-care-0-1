import { NextResponse } from "next/server";
import crypto from "crypto";
import { BootcampRegistrationDB } from "@/lib/db";

export async function POST(req: Request) {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      registrationId,
    } = await req.json();

    const secret = process.env.RAZORPAY_KEY_SECRET || "";
    if (!secret) return NextResponse.json({ error: "Server config error" }, { status: 500 });

    const body = razorpay_order_id + "|" + razorpay_payment_id;
    
    const expectedSignature = crypto
      .createHmac("sha256", secret)
      .update(body.toString())
      .digest("hex");

    const isAuthentic = expectedSignature === razorpay_signature;

    if (!isAuthentic) {
      // Mark as failed if we want, or just leave as pending
      await BootcampRegistrationDB.update(registrationId, { paymentStatus: "FAILED" });
      return NextResponse.json({ success: false, error: "Invalid payment signature" }, { status: 400 });
    }

    // Payment is verified
    await BootcampRegistrationDB.update(registrationId, {
      paymentStatus: "SUCCESS",
      razorpayPaymentId: razorpay_payment_id,
      webhookVerified: true
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Payment Verify Error:", error);
    return NextResponse.json({ error: "Failed to verify payment" }, { status: 500 });
  }
}
