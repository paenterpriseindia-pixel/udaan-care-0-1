import { NextRequest, NextResponse } from "next/server";
import { PatientDB } from "@/lib/db";

export async function GET() {
  const patients = await PatientDB.getAll();
  return NextResponse.json(patients);
}

export async function POST(req: NextRequest) {
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
