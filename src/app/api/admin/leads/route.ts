import { NextResponse } from "next/server";
import { LeadDB } from "@/lib/db";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const status = searchParams.get("status");
  const leads = status
    ? await LeadDB.getByStatus(status as Parameters<typeof LeadDB.getByStatus>[0])
    : await LeadDB.getAll();
  return NextResponse.json(leads);
}

export async function POST(req: Request) {
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
  return lead
    ? NextResponse.json(lead, { status: 201 })
    : NextResponse.json({ error: "Failed to create lead" }, { status: 500 });
}

export async function PATCH(req: Request) {
  const body = await req.json();
  if (!body.id) return NextResponse.json({ error: "id required" }, { status: 400 });
  await LeadDB.updateStatus(body.id, body.status, body.notes);
  return NextResponse.json({ ok: true });
}
