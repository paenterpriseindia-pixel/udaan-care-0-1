import { NextRequest, NextResponse } from "next/server";
import { BookingDB } from "@/lib/db";

import { requireAdmin } from "@/lib/serverAuth";

export async function GET() {
  try {
    const session = await requireAdmin();
    const isDoctor = session.user.role === "DOCTOR";
    const doctorId = isDoctor ? session.user.id : undefined;
    
    return NextResponse.json(await BookingDB.getAll(doctorId));
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 401 });
  }
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const booking = await BookingDB.create(body);
  return NextResponse.json(booking, { status: 201 });
}
