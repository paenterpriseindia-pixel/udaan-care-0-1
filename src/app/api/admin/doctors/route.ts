import { NextRequest, NextResponse } from "next/server";
import { UserDB } from "@/lib/db";
import bcrypt from "bcryptjs";

// GET /api/admin/doctors — all users with role DOCTOR
export async function GET() {
  const users = await UserDB.getAll();
  const doctors = users
    .filter((u) => u.role === "DOCTOR")
    .map(({ passwordHash: _, ...u }) => u);
  return NextResponse.json(doctors);
}

// POST /api/admin/doctors — create a new doctor account
export async function POST(req: NextRequest) {
  const body = await req.json();
  const { password, ...rest } = body;
  const passwordHash = await bcrypt.hash(password ?? "doctor123", 10);
  const user = await UserDB.create({ ...rest, role: "DOCTOR", passwordHash });
  const { passwordHash: _ph, ...safe } = user;
  return NextResponse.json(safe, { status: 201 });
}
