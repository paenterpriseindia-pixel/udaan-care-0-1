import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

// POST /api/upload-image
// Body: FormData { file: File, dest: string }
// dest = relative path like "images/logo/logo-dark.svg" or "images/doctor/dr-prasoon-hero.jpg"
export async function POST(req: NextRequest) {
  try {
    const form = await req.formData();
    const file = form.get("file") as File | null;
    const dest = form.get("dest") as string | null;

    if (!file || !dest) {
      return NextResponse.json({ error: "Missing file or dest" }, { status: 400 });
    }

    // Security: only allow writes inside public/images/
    const safeDest = dest.replace(/\.\./g, "").replace(/^\/+/, "");
    if (!safeDest.startsWith("images/")) {
      return NextResponse.json({ error: "Invalid destination" }, { status: 400 });
    }

    // Determine the path in the "images" bucket
    // E.g. "images/logo/logo-dark.png" -> "logo/logo-dark.png"
    const storagePath = safeDest.substring(7);

    const buffer = await file.arrayBuffer();

    const { error: uploadError } = await supabase.storage
      .from("images")
      .upload(storagePath, buffer, {
        contentType: file.type,
        upsert: true
      });

    if (uploadError) {
      console.error("[upload-image] Supabase upload error:", uploadError);
      return NextResponse.json({ error: "Upload failed via Supabase" }, { status: 500 });
    }

    // The frontend relies on Next.js rewrites to map /images/* to Supabase, 
    // so we can still return the local path convention.
    return NextResponse.json({ ok: true, path: `/${safeDest}` });
  } catch (err) {
    console.error("[upload-image]", err);
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }
}
