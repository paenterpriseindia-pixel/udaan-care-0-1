import { NextResponse } from "next/server";
import { UserDB } from "@/lib/db";

export async function GET(_req: Request, { params }: { params: { id: string } }) {
  const user = await UserDB.getById(params.id);
  return user ? NextResponse.json(user) : NextResponse.json({ error: "Not found" }, { status: 404 });
}
