import { NextResponse } from "next/server";
import { BranchDB } from "@/lib/db";

export async function GET() {
  const branches = await BranchDB.getAll();
  return NextResponse.json(branches);
}

export async function POST(req: Request) {
  const body = await req.json();
  const branch = await BranchDB.create({
    name: body.name, city: body.city ?? "Katni",
    address: body.address, phone: body.phone,
    managerId: body.managerId, isActive: true,
  });
  return branch
    ? NextResponse.json(branch, { status: 201 })
    : NextResponse.json({ error: "Failed" }, { status: 500 });
}

export async function PATCH(req: Request) {
  const body = await req.json();
  if (!body.id) return NextResponse.json({ error: "id required" }, { status: 400 });
  await BranchDB.update(body.id, body);
  return NextResponse.json({ ok: true });
}
