import { NextRequest, NextResponse } from "next/server";
import { BlogDB } from "@/lib/db";

export async function GET() {
  return NextResponse.json(await BlogDB.getAll());
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const post = await BlogDB.create(body);
  return NextResponse.json(post, { status: 201 });
}
