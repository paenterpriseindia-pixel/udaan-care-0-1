import { NextResponse } from "next/server";
import { BootcampRegistrationDB } from "@/lib/db";

export async function PUT(req: Request, { params }: { params: { id: string, regId: string } }) {
  try {
    const body = await req.json();
    const updated = await BootcampRegistrationDB.update(params.regId, body);
    return NextResponse.json(updated);
  } catch (error) {
    return NextResponse.json({ error: "Failed to update registration" }, { status: 500 });
  }
}
