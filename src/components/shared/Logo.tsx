"use client";
import Link from "next/link";
import { useTheme } from "next-themes";
import { useEffect, useRef, useState, useCallback } from "react";

interface LogoProps {
  variant?: "auto" | "light" | "dark";
  size?: "sm" | "md" | "lg";
  /** If true, clicking the logo image replaces it via upload (dev/admin mode) */
  editable?: boolean;
}

async function uploadLogoFile(file: File, dest: string) {
  const form = new FormData();
  form.append("file", file);
  form.append("dest", dest);
  await fetch("/api/upload-image", { method: "POST", body: form });
}

export default function Logo({ variant = "auto", size = "md", editable = false }: LogoProps) {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [imgError, setImgError] = useState(false);
  const [hover, setHover] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [cacheBust, setCacheBust] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => setMounted(true), []);

  const w = size === "sm" ? 110 : size === "lg" ? 160 : 140;

  // Priority: SVG > PNG. Try SVG first via img onError fallback.
  const isDark = variant === "light" || (variant === "auto" && mounted && resolvedTheme === "dark");
  const src = isDark ? "/images/logo/logo-light.png" : "/images/logo/logo-dark.png";

  const handleUpload = useCallback(async (file: File) => {
    setUploading(true);
    const ext = file.name.split(".").pop()?.toLowerCase() ?? "png";
    const isSvg = ext === "svg";
    // Save both SVG and PNG slot names
    const destBase = isDark ? "images/logo/logo-light" : "images/logo/logo-dark";
    const dest = `${destBase}.${ext}`;
    try {
      await uploadLogoFile(file, dest);
      const bust = `?t=${Date.now()}`;
      setCacheBust(bust);
      setSrc(`/${dest}${bust}`);
      setImgError(false);
    } finally {
      setUploading(false);
    }
  }, [isDark]);

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (f) handleUpload(f);
    e.target.value = "";
  };

  const textFallback = (
    <span style={{
      fontFamily: "'Nunito', sans-serif", fontWeight: 900,
      fontSize: size === "sm" ? 18 : size === "lg" ? 28 : 22,
      background: "linear-gradient(135deg, #6B3FA0, #0A7E8C)",
      WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
      backgroundClip: "text", letterSpacing: "-0.01em",
      display: "inline-block", userSelect: "none",
    }}>
      Udaan Care
    </span>
  );

  const imgEl = imgError ? textFallback : (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src + cacheBust}
      alt="Udaan Care"
      width={w}
      height={Math.round(w * 0.42)}
      style={{ height: "auto", maxHeight: 56, objectFit: "contain", display: "block" }}
      onError={() => setImgError(true)}
    />
  );

  return (
    <Link href="/" style={{ display: "inline-flex", alignItems: "center", textDecoration: "none", flexShrink: 0, position: "relative" }}>
      {editable ? (
        <div
          style={{ position: "relative", cursor: "pointer" }}
          onMouseEnter={() => setHover(true)}
          onMouseLeave={() => setHover(false)}
          onClick={(e) => { e.preventDefault(); fileRef.current?.click(); }}
          title="Click to replace logo"
        >
          {imgEl}
          {/* Overlay */}
          <div style={{
            position: "absolute", inset: -4, borderRadius: 8,
            background: uploading ? "rgba(10,126,140,0.5)" : hover ? "rgba(10,126,140,0.25)" : "transparent",
            display: "flex", alignItems: "center", justifyContent: "center",
            transition: "background 0.2s",
            pointerEvents: "none",
          }}>
            {(hover || uploading) && (
              <span style={{ fontSize: 10, color: "white", fontFamily: "'DM Sans',sans-serif", fontWeight: 700, background: "rgba(0,0,0,0.5)", padding: "2px 6px", borderRadius: 4 }}>
                {uploading ? "Uploading…" : "Replace logo"}
              </span>
            )}
          </div>
          <input ref={fileRef} type="file" accept="image/svg+xml,image/png,image/*" style={{ display: "none" }} onChange={onFileChange} />
        </div>
      ) : imgEl}
    </Link>
  );
}
