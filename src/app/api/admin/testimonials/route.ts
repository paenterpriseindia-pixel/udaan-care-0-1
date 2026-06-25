import { NextRequest, NextResponse } from "next/server";
import { VideoTestimonialDB } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/serverAuth";


export const dynamic = "force-dynamic";

// GET — public (active only) or admin (all) based on ?admin=true
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const isAdmin = searchParams.get("admin") === "true";
  const list = isAdmin
    ? await VideoTestimonialDB.getAll()
    : await VideoTestimonialDB.getActive();
  return NextResponse.json(list);
}

// POST — create new testimonial
export async function POST(req: NextRequest) {
  try { await requireAdmin(); } catch (e: any) { return NextResponse.json({ error: e.message }, { status: 401 }); }
  const body = await req.json();

  const item = await VideoTestimonialDB.create({
    parentName:   body.parentName,
    childAge:     body.childAge,
    location:     body.location,
    caption:      body.caption,
    videoUrl:     body.videoUrl,
    thumbnailUrl: body.thumbnailUrl,
    isActive:     body.isActive ?? true,
    sortOrder:    body.sortOrder ?? 0,
  });
  revalidatePath("/");
  return item
    ? NextResponse.json(item, { status: 201 })
    : NextResponse.json({ error: "Failed to create" }, { status: 500 });
}

// PATCH — update or toggle active
export async function PATCH(req: NextRequest) {
  try { await requireAdmin(); } catch (e: any) { return NextResponse.json({ error: e.message }, { status: 401 }); }
  const body = await req.json();

  const { id, ...rest } = body;
  if (!id) return NextResponse.json({ error: "id required" }, { status: 400 });
  await VideoTestimonialDB.update(id, rest);
  revalidatePath("/");
  return NextResponse.json({ ok: true });
}

// DELETE — remove
export async function DELETE(req: NextRequest) {
  try { await requireAdmin(); } catch (e: any) { return NextResponse.json({ error: e.message }, { status: 401 }); }
  const { searchParams } = new URL(req.url);

  const id = searchParams.get("id");
  if (!id) return NextResponse.json({ error: "id required" }, { status: 400 });
  await VideoTestimonialDB.delete(id);
  revalidatePath("/");
  return NextResponse.json({ ok: true });
}
