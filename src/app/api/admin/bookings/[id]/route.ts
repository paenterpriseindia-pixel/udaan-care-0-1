import { NextRequest, NextResponse } from "next/server";
import { BookingDB } from "@/lib/db";

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  const body = await req.json();
  await BookingDB.update(params.id, body);
  return NextResponse.json({ success: true });
}

export async function DELETE(_: NextRequest, { params }: { params: { id: string } }) {
  await BookingDB.delete(params.id);
  return NextResponse.json({ success: true });
}
