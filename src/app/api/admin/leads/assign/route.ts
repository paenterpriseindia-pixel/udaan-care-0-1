import { NextResponse } from "next/server";
import { LeadDB } from "@/lib/db";
import { requireAdmin } from "@/lib/serverAuth";

export async function PATCH(req: Request) {
  try {
    await requireAdmin();
    const body = await req.json();
    if (!body.id) return NextResponse.json({ error: "Lead ID required" }, { status: 400 });
    
    await LeadDB.assignDoctor(body.id, body.doctorId || null);
    return NextResponse.json({ ok: true });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 401 });
  }
}
