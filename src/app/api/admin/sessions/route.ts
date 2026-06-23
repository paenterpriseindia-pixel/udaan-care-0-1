import { NextRequest, NextResponse } from "next/server";
import { SessionDB } from "@/lib/db";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const session = await SessionDB.create(body);
  return NextResponse.json(session, { status: 201 });
}
