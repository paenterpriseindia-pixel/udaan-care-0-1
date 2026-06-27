import { NextRequest, NextResponse } from "next/server";
import { UserDB } from "@/lib/db";
import { requireAdmin } from "@/lib/serverAuth";
import bcrypt from "bcryptjs";

export async function POST(req: NextRequest) {
  try {
    const session = await requireAdmin();
    // Only the Main Admin should be able to create new users.
    if (session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized. Only Main Admin can create users." }, { status: 403 });
    }

    const body = await req.json();
    const { name, email, phone, password, role } = body;

    if (!name || !email || !password) {
      return NextResponse.json({ error: "Name, email, and password are required." }, { status: 400 });
    }

    // Check if user already exists
    const existingUser = await UserDB.getByEmail(email);
    if (existingUser) {
      return NextResponse.json({ error: "User with this email already exists." }, { status: 400 });
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const newUser = await UserDB.create({
      name,
      email,
      phone,
      passwordHash,
      role: role || "DOCTOR",
    });

    return NextResponse.json({ message: "User created successfully", user: { id: newUser.id, name: newUser.name, email: newUser.email } }, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
