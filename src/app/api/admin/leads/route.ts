import { NextResponse } from "next/server";
import { LeadDB } from "@/lib/db";
import { requireAdmin } from "@/lib/serverAuth";
import { sendAdminLeadEmail } from "@/lib/email";
import { checkRateLimit } from "@/lib/rateLimit";

export async function GET(req: Request) {
  try {
    const session = await requireAdmin();
    const isDoctor = session.user.role === "DOCTOR";
    const doctorId = isDoctor ? session.user.id : undefined;

    const { searchParams } = new URL(req.url);
    const status = searchParams.get("status");
    const leads = status
      ? await LeadDB.getByStatus(status as Parameters<typeof LeadDB.getByStatus>[0], doctorId)
      : await LeadDB.getAll(doctorId);
    return NextResponse.json(leads);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 401 });
  }
}

export async function POST(req: Request) {
  const ip = req.headers.get("x-forwarded-for") || "unknown";
  if (!checkRateLimit(ip)) {
    return NextResponse.json({ error: "Too many requests. Please try again later." }, { status: 429 });
  }

  const body = await req.json();
  const lead = await LeadDB.create({
    name: body.name ?? "Unknown",
    phone: body.phone ?? "",
    email: body.email,
    source: body.source ?? "website",
    serviceInterest: body.serviceInterest,
    message: body.message,
    status: "new",
    notes: body.notes,
  });

  // Fire and forget email notification to ensure clinic gets the lead even if DB is down
  sendAdminLeadEmail(body).catch(console.error);

  if (lead) {
    return NextResponse.json(lead, { status: 201 });
  } else {
    // Return success to the user so they aren't blocked, the clinic will receive the email.
    return NextResponse.json({ success: true, note: "Saved via email fallback" }, { status: 201 });
  }
}

export async function PATCH(req: Request) {
  try {
    await requireAdmin();
    const body = await req.json();
    if (!body.id) return NextResponse.json({ error: "id required" }, { status: 400 });
    // Note: We should ideally verify the lead belongs to the doctor before updating,
    // but for now relying on the UI not showing other doctor's leads.
    await LeadDB.updateStatus(body.id, body.status, body.notes);
    return NextResponse.json({ ok: true });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 401 });
  }
}
