import { NextRequest, NextResponse } from "next/server";
import { PatientDB, SessionDB, GoalDB, BookingDB } from "@/lib/db";

export async function GET(_: NextRequest, { params }: { params: { id: string } }) {
  const patient = await PatientDB.getById(params.id);
  if (!patient) return NextResponse.json({ error: "Not found" }, { status: 404 });
  const [sessions, goals, bookings] = await Promise.all([
    SessionDB.getByPatient(params.id),
    GoalDB.getByPatient(params.id),
    BookingDB.getByPatient(params.id),
  ]);
  return NextResponse.json({ patient, sessions, goals, bookings });
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  const body = await req.json();
  await PatientDB.update(params.id, body);
  return NextResponse.json({ success: true });
}

export async function DELETE(_: NextRequest, { params }: { params: { id: string } }) {
  await PatientDB.delete(params.id);
  return NextResponse.json({ success: true });
}
