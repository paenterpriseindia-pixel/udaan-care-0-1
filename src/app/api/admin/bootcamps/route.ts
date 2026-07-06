import { NextResponse } from "next/server";
import { BootcampDB } from "@/lib/db";

export async function GET() {
  try {
    const bootcamps = await BootcampDB.getAll();
    return NextResponse.json(bootcamps);
  } catch (error) {
    console.error("GET Bootcamps Error:", error);
    return NextResponse.json({ error: "Failed to fetch bootcamps" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const bootcamp = await BootcampDB.create(body);
    return NextResponse.json(bootcamp);
  } catch (error) {
    console.error("POST Bootcamp Error:", error);
    return NextResponse.json({ error: "Failed to create bootcamp" }, { status: 500 });
  }
}
