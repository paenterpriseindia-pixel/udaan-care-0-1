import { NextResponse } from "next/server";
import { BootcampDB } from "@/lib/db";

export async function GET(req: Request, { params }: { params: { id: string } }) {
  try {
    const bootcamp = await BootcampDB.getById(params.id);
    if (!bootcamp) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json(bootcamp);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch bootcamp" }, { status: 500 });
  }
}

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  try {
    const body = await req.json();
    const bootcamp = await BootcampDB.update(params.id, body);
    return NextResponse.json(bootcamp);
  } catch (error) {
    return NextResponse.json({ error: "Failed to update bootcamp" }, { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  try {
    await BootcampDB.softDelete(params.id);
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete bootcamp" }, { status: 500 });
  }
}
