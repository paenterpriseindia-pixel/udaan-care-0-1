import { NextRequest, NextResponse } from "next/server";
import { ContentDB } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/serverAuth";


export const dynamic = "force-dynamic";

export async function GET() {
  return NextResponse.json(await ContentDB.get());
}

export async function POST(req: NextRequest) {
  try { await requireAdmin(); } catch (e: any) { return NextResponse.json({ error: e.message }, { status: 401 }); }
  const body = await req.json();
  
  await ContentDB.setMany(body);
  // Revalidate ALL public pages since CMS content affects everything
  revalidatePath("/", "layout");
  return NextResponse.json({ success: true });
}
