import { NextRequest, NextResponse } from "next/server";
import { BlogDB } from "@/lib/db";

export async function GET(_: NextRequest, { params }: { params: { id: string } }) {
  const post = await BlogDB.getById(params.id);
  if (!post) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(post);
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  const body = await req.json();
  await BlogDB.update(params.id, body);
  return NextResponse.json({ success: true });
}

export async function DELETE(_: NextRequest, { params }: { params: { id: string } }) {
  await BlogDB.delete(params.id);
  return NextResponse.json({ success: true });
}
