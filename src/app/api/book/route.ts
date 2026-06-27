import { NextResponse } from "next/server";
import { LeadDB } from "@/lib/db";
import { sendBookingEmail } from "@/lib/email";
import { createZoomMeeting } from "@/lib/zoom";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    
    // Save as a lead with booking details in notes
    const lead = await LeadDB.create({
      name: body.name ?? "Unknown",
      phone: body.phone ?? "",
      email: body.email,
      source: body.source ?? "website",
      serviceInterest: body.serviceInterest,
      message: body.message,
      status: "new",
      notes: `Requested Booking -> Date: ${body.date || 'N/A'}, Time: ${body.time || 'N/A'}`,
    });

    if (!lead) {
      return NextResponse.json({ error: "Failed to create booking record" }, { status: 500 });
    }

    // Generate Confirmation Number from Lead ID
    const confNumber = `UC-${lead.id.substring(0, 6).toUpperCase()}`;

    let zoomLink: string | undefined = undefined;
    if (body.serviceInterest?.toLowerCase().includes("online")) {
      // Free consultation usually 30 mins
      const startIso = (body.date && body.time) 
        ? new Date(`${body.date}T${body.time}:00+05:30`).toISOString()
        : new Date(Date.now() + 86400000).toISOString(); // fallback tomorrow
      const generatedLink = await createZoomMeeting(`Online Consultation - ${body.name}`, startIso, 30);
      if (generatedLink) zoomLink = generatedLink;
    }

    // Send email
    if (body.email) {
      await sendBookingEmail(body.email, {
        clientName: body.name,
        confirmationNumber: confNumber,
        date: body.date || 'N/A',
        time: body.time || 'N/A',
        sessionType: body.serviceInterest || 'Consultation',
        zoomLink,
      });
    }

    return NextResponse.json({ ok: true, confirmationNumber: confNumber });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
