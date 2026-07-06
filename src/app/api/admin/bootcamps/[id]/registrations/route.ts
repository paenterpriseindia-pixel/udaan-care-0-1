import { NextResponse } from "next/server";
import { BootcampDB, BootcampRegistrationDB } from "@/lib/db";

export async function GET(req: Request, { params }: { params: { id: string } }) {
  try {
    const bootcamp = await BootcampDB.getById(params.id);
    const registrations = await BootcampRegistrationDB.getByBootcampId(params.id);
    return NextResponse.json({ bootcamp, registrations });
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch registrations" }, { status: 500 });
  }
}
