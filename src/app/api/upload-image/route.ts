import { NextRequest, NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import path from "path";

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

    const publicDir = path.join(process.cwd(), "public");
    const fullPath = path.join(publicDir, safeDest);
    const dir = path.dirname(fullPath);

    await mkdir(dir, { recursive: true });

    const buffer = Buffer.from(await file.arrayBuffer());
    await writeFile(fullPath, buffer);

    return NextResponse.json({ ok: true, path: `/${safeDest}` });
  } catch (err) {
    console.error("[upload-image]", err);
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }
}
