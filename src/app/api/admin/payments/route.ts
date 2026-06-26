import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/serverAuth";
import Razorpay from "razorpay";

export async function GET() {
  try {
    await requireAdmin();

    const instance = new Razorpay({
      key_id: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || "rzp_live_T6IKIEWy4JFJOJ",
      key_secret: process.env.RAZORPAY_KEY_SECRET || "DUMMY_SECRET_FOR_NOW_USER_MUST_REPLACE",
    });

    const payments = await instance.payments.all({ count: 50 });
    return NextResponse.json({ ok: true, payments: payments.items });
  } catch (err: any) {
    console.error("[GET /api/admin/payments]", err);
    return NextResponse.json({ error: err.message }, { status: err.message.includes("Forbidden") || err.message.includes("Unauthorized") ? 401 : 500 });
  }
}
