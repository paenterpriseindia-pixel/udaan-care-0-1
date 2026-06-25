import { NextRequest, NextResponse } from "next/server";
import { BlogDB } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/serverAuth";

export const dynamic = "force-dynamic";

export async function GET(_: NextRequest, { params }: { params: { id: string } }) {
  const post = await BlogDB.getById(params.id);
  if (!post) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(post);
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  try { await requireAdmin(); } catch (e: any) { return NextResponse.json({ error: e.message }, { status: 401 }); }
  const body = await req.json();
  await BlogDB.update(params.id, body);
  // Revalidate the specific blog post + list + homepage
  if (body.slug) revalidatePath(`/blog/${body.slug}`);
  revalidatePath("/blog");
  revalidatePath("/");
  return NextResponse.json({ success: true });
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  try { await requireAdmin(); } catch (e: any) { return NextResponse.json({ error: e.message }, { status: 401 }); }
  await BlogDB.delete(params.id);
  // Revalidate
  revalidatePath("/blog");
  revalidatePath("/");
  return NextResponse.json({ success: true });
}
