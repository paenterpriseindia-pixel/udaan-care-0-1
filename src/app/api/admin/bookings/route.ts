import { NextRequest, NextResponse } from "next/server";
import { BookingDB } from "@/lib/db";

export async function GET() {
  return NextResponse.json(await BookingDB.getAll());
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const booking = await BookingDB.create(body);
  return NextResponse.json(booking, { status: 201 });
}
