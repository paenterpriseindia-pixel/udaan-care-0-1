import { NextResponse } from "next/server";
import { BlockedDateDB } from "@/lib/db";

export async function GET() {
  const dates = await BlockedDateDB.getAll();
  return NextResponse.json(dates);
}

export async function POST(req: Request) {
  const body = await req.json();
  if (!body.date) return NextResponse.json({ error: "date required" }, { status: 400 });
  const result = await BlockedDateDB.create(body.date, body.reason);
  return result
    ? NextResponse.json(result, { status: 201 })
    : NextResponse.json({ error: "Failed to block date" }, { status: 500 });
}

export async function DELETE(req: Request) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");
  if (!id) return NextResponse.json({ error: "id required" }, { status: 400 });
  await BlockedDateDB.delete(id);
  return NextResponse.json({ ok: true });
}
