import { NextRequest, NextResponse } from "next/server";
import { UserDB } from "@/lib/db";
import bcrypt from "bcryptjs";

export async function GET() {
  const users = await UserDB.getAll();
  return NextResponse.json(users.map(({ passwordHash: _, ...u }) => u));
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { password, ...rest } = body;
  const passwordHash = await bcrypt.hash(password ?? "doctor123", 10);
  const user = await UserDB.create({ ...rest, passwordHash });
  const { passwordHash: _ph, ...safe } = user;
  return NextResponse.json(safe, { status: 201 });
}
