import { NextResponse } from "next/server";
import crypto from "crypto";
import { LeadDB } from "@/lib/db";
import { sendBookingEmail } from "@/lib/email";

export async function POST(req: Request) {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      leadData,
    } = await req.json();

    const secret = process.env.RAZORPAY_KEY_SECRET || "DUMMY_SECRET_FOR_NOW_USER_MUST_REPLACE";
    const body = razorpay_order_id + "|" + razorpay_payment_id;
    
    const expectedSignature = crypto
      .createHmac("sha256", secret)
      .update(body.toString())
      .digest("hex");

    const isAuthentic = expectedSignature === razorpay_signature;

    if (!isAuthentic) {
      return NextResponse.json({ success: false, error: "Invalid payment signature" }, { status: 400 });
    }

    // Payment is verified
    // Now create the lead and send the email
    const lead = await LeadDB.create({
      name: leadData.name ?? "Unknown",
      phone: leadData.phone ?? "",
      email: leadData.email,
      source: leadData.source ?? "website",
      serviceInterest: leadData.serviceInterest,
      message: leadData.message,
      status: "new",
      notes: `PAID via Razorpay (Order: ${razorpay_order_id}) -> Date: ${leadData.date || 'N/A'}, Time: ${leadData.time || 'N/A'}`,
    });

    if (!lead) {
      return NextResponse.json({ error: "Failed to create booking record after payment" }, { status: 500 });
    }

    const confNumber = `UC-${lead.id.substring(0, 6).toUpperCase()}`;

    // Send email
    if (leadData.email) {
      await sendBookingEmail(leadData.email, {
        clientName: leadData.name,
        confirmationNumber: confNumber,
        date: leadData.date || 'N/A',
        time: leadData.time || 'N/A',
        sessionType: leadData.serviceInterest || 'Consultation',
      });
    }

    return NextResponse.json({ success: true, confirmationNumber: confNumber });
  } catch (error) {
    console.error("Razorpay Verify Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
