"use client";
import { useRef, useState, useCallback } from "react";
import Image from "next/image";
import { Upload } from "lucide-react";

interface ClickableImageProps {
  src: string;
  alt: string;
  fill?: boolean;
  width?: number;
  height?: number;
  style?: React.CSSProperties;
  className?: string;
  sizes?: string;
  priority?: boolean;
  objectFit?: "cover" | "contain" | "fill";
  objectPosition?: string;
  quality?: number;
  /** The path to save to, e.g. "images/doctor/dr-prasoon-hero.jpg" */
  dest: string;
}

async function uploadFile(file: File, dest: string): Promise<void> {
  const form = new FormData();
  form.append("file", file);
  form.append("dest", dest);
  const res = await fetch("/api/upload-image", { method: "POST", body: form });
  if (!res.ok) throw new Error("Upload failed");
}

export default function ClickableImage({
  src,
  alt,
  fill,
  width,
  height,
  style,
  className,
  sizes,
  priority,
  objectFit = "cover",
  objectPosition,
  quality = 100,
  dest,
}: ClickableImageProps) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [state, setState] = useState<"idle" | "uploading" | "done" | "error">("idle");
  const [currentSrc, setCurrentSrc] = useState(src);
  const [hover, setHover] = useState(false);

  const handleFile = useCallback(async (file: File) => {
    setState("uploading");
    try {
      await uploadFile(file, dest);
      setCurrentSrc(`/${dest}?t=${Date.now()}`);
      setState("done");
      setTimeout(() => setState("idle"), 2500);
    } catch {
      setState("error");
      setTimeout(() => setState("idle"), 2500);
    }
  }, [dest]);

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (f) handleFile(f);
    e.target.value = "";
  };

  const isUploading = state === "uploading";
  const isDone = state === "done";
  const isError = state === "error";

  const imageStyle: React.CSSProperties = {
    objectFit,
    objectPosition,
    ...style,
  };

  // ── IN PRODUCTION, RENDER A NORMAL STATIC IMAGE ──
  if (process.env.NODE_ENV === "production") {
    if (fill) {
      return (
        <Image src={src} alt={alt} fill style={imageStyle} sizes={sizes ?? "100vw"} priority={priority} quality={quality} className={className} />
      );
    }
    return (
      <Image src={src} alt={alt} width={width ?? 800} height={height ?? 600} style={imageStyle} sizes={sizes} priority={priority} quality={quality} className={className} />
    );
  }

  return (
    <div
      style={{ position: "relative", width: fill ? "100%" : width, height: fill ? "100%" : height, cursor: "pointer" }}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      onClick={() => !isUploading && fileRef.current?.click()}
      title="Click to replace this image"
    >
      {fill ? (
        <Image
          src={currentSrc}
          alt={alt}
          fill
          style={imageStyle}
          sizes={sizes ?? "100vw"}
          priority={priority}
          quality={quality}
        />
      ) : (
        <Image
          src={currentSrc}
          alt={alt}
          width={width ?? 800}
          height={height ?? 600}
          style={imageStyle}
          sizes={sizes}
          priority={priority}
          quality={quality}
          className={className}
        />
      )}

      {/* Hover overlay */}
      <div style={{
        position: "absolute", inset: 0, zIndex: 10,
        display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 8,
        background: isUploading || isDone || isError
          ? isUploading ? "rgba(10,126,140,0.7)"
            : isDone ? "rgba(34,197,94,0.6)"
              : "rgba(239,68,68,0.6)"
          : hover ? "rgba(0,0,0,0.45)" : "rgba(0,0,0,0)",
        transition: "background 0.2s ease",
        borderRadius: "inherit",
        pointerEvents: "none",
      }}>
        {isUploading ? (
          <>
            <div style={{ width: 32, height: 32, border: "3px solid rgba(255,255,255,0.3)", borderTop: "3px solid white", borderRadius: "50%", animation: "clickImgSpin 0.7s linear infinite" }} />
            <span style={{ color: "white", fontSize: 12, fontFamily: "'DM Sans',sans-serif", fontWeight: 700 }}>Uploading…</span>
          </>
        ) : isDone ? (
          <span style={{ color: "white", fontSize: 13, fontFamily: "'DM Sans',sans-serif", fontWeight: 700 }}>✓ Saved!</span>
        ) : isError ? (
          <span style={{ color: "white", fontSize: 12, fontFamily: "'DM Sans',sans-serif", fontWeight: 700 }}>Upload failed</span>
        ) : hover ? (
          <>
            <div style={{ width: 40, height: 40, borderRadius: "50%", background: "rgba(255,255,255,0.2)", backdropFilter: "blur(4px)", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Upload size={18} style={{ color: "white" }} />
            </div>
            <span style={{ color: "white", fontSize: 12, fontFamily: "'DM Sans',sans-serif", fontWeight: 700, background: "rgba(0,0,0,0.4)", padding: "3px 10px", borderRadius: 6, backdropFilter: "blur(4px)" }}>
              Click to replace image
            </span>
          </>
        ) : null}
      </div>

      {/* Hidden file input */}
      <input
        ref={fileRef}
        type="file"
        accept="image/*"
        style={{ display: "none" }}
        onChange={onFileChange}
      />

      <style>{`@keyframes clickImgSpin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
still 