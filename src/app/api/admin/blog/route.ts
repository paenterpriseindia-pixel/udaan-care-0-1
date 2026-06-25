import { NextRequest, NextResponse } from "next/server";
import { BlogDB } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/serverAuth";

export const dynamic = "force-dynamic";

export async function GET() {
  const posts = await BlogDB.getAll();
  return NextResponse.json(posts);
}

export async function POST(req: NextRequest) {
  try { await requireAdmin(); } catch (e: any) { return NextResponse.json({ error: e.message }, { status: 401 }); }
  const body = await req.json();
  const post = await BlogDB.create(body);
  // Immediately revalidate public blog pages
  revalidatePath("/blog");
  revalidatePath("/");
  return NextResponse.json(post, { status: 201 });
}
