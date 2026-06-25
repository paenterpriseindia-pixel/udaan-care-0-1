import { NextRequest, NextResponse } from "next/server";
import { revalidatePath, revalidateTag } from "next/cache";

/**
 * POST /api/admin/revalidate
 * Body: { paths?: string[], tags?: string[], all?: boolean }
 *
 * Instantly clears Next.js cache for the given paths/tags.
 * Called automatically by admin save actions, or manually by admin.
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const { paths, tags, all } = body as {
      paths?: string[];
      tags?: string[];
      all?: boolean;
    };

    if (all) {
      // Revalidate the entire public site
      revalidatePath("/", "layout");
      return NextResponse.json({ revalidated: true, scope: "all" });
    }

    const revalidated: string[] = [];

    if (paths?.length) {
      for (const p of paths) {
        revalidatePath(p);
        revalidated.push(`path:${p}`);
      }
    }

    if (tags?.length) {
      for (const t of tags) {
        revalidateTag(t);
        revalidated.push(`tag:${t}`);
      }
    }

    return NextResponse.json({ revalidated: true, items: revalidated });
  } catch (e) {
    console.error("Revalidate error:", e);
    return NextResponse.json({ error: "Revalidation failed" }, { status: 500 });
  }
}

// GET /api/admin/revalidate?path=/blog — quick single-path revalidate
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const path = searchParams.get("path") ?? "/";
  revalidatePath(path);
  return NextResponse.json({ revalidated: true, path });
}
