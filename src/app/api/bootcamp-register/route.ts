import { NextResponse } from "next/server";
import Razorpay from "razorpay";
import { BootcampRegistrationDB, BootcampDB } from "@/lib/db";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    
    // Check if free or paid
    const isFree = body.amountPaid === 0;

    // Create DB Registration as PENDING (or SUCCESS if free)
    const registration = await BootcampRegistrationDB.create({
      bootcampId: body.bootcampId,
      parentName: body.parentName,
      childName: body.childName,
      childAge: body.childAge,
      email: body.email,
      phone: body.phone,
      reasonForJoining: body.reasonForJoining,
      currency: body.currency || "INR",
      amountPaid: body.amountPaid,
      paymentStatus: isFree ? "SUCCESS" : "PENDING",
      webhookVerified: false,
      isWaitlisted: false,
      attended: false,
    });

    if (isFree) {
      return NextResponse.json({ success: true, registrationId: registration.id });
    }

    if (!process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
      return NextResponse.json({ error: "Payment gateway not configured" }, { status: 503 });
    }

    const instance = new Razorpay({
      key_id: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
    });

    const options = {
      amount: body.amountPaid * 100, // paise
      currency: body.currency || "INR",
      receipt: `bootcamp_${registration.id}`,
    };

    const order = await instance.orders.create(options);
    
    // Update registration with order ID
    await BootcampRegistrationDB.update(registration.id, { razorpayOrderId: order.id });

    return NextResponse.json({
      order,
      keyId: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
      registrationId: registration.id,
    });

  } catch (error) {
    console.error("Bootcamp Register Error:", error);
    return NextResponse.json({ error: "Failed to process registration" }, { status: 500 });
  }
}
