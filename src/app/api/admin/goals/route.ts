import { NextRequest, NextResponse } from "next/server";
import { GoalDB } from "@/lib/db";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const goal = await GoalDB.create(body);
  return NextResponse.json(goal, { status: 201 });
}

export async function PUT(req: NextRequest) {
  const body = await req.json();
  const { id, ...rest } = body;
  await GoalDB.update(id, rest);
  return NextResponse.json({ success: true });
}
