import { NextRequest, NextResponse } from "next/server";
import { PatientDB } from "@/lib/db";
import { requireAdmin } from "@/lib/serverAuth";

export async function GET() {
  try {
    const session = await requireAdmin();
    const isDoctor = session.user.role === "DOCTOR";
    const doctorId = isDoctor ? session.user.id : undefined;
    
    const patients = await PatientDB.getAll(doctorId);
    return NextResponse.json(patients);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 401 });
  }
}

export async function POST(req: NextRequest) {
  try { await requireAdmin(); } catch (e: any) { return NextResponse.json({ error: e.message }, { status: 401 }); }
  try {
    const body = await req.json();
    const { guardianPin, ...rest } = body;
    if (!guardianPin || guardianPin.length !== 4) {
      return NextResponse.json({ error: "PIN must be 4 digits" }, { status: 400 });
    }
    const patient = await PatientDB.create({ ...rest, guardianPin });
    return NextResponse.json(patient, { status: 201 });
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}
