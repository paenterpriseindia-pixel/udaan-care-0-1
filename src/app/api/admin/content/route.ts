import { NextRequest, NextResponse } from "next/server";
import { ContentDB } from "@/lib/db";

export async function GET() {
  return NextResponse.json(await ContentDB.get());
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  await ContentDB.setMany(body);
  return NextResponse.json({ success: true });
}
