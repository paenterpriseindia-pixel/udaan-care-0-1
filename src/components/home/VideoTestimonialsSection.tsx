"use client";
import { useState, useEffect, useRef } from "react";
import { Play, X, Star, MapPin, ChevronLeft, ChevronRight, Quote } from "lucide-react";
import type { VideoTestimonial } from "@/lib/db";

/* ── helpers ────────────────────────────────────────────────────────────────── */
function getEmbedUrl(url: string): string {
  if (!url) return "";

  // YouTube short links: youtu.be/ID
  const ytShort = url.match(/youtu\.be\/([^?&]+)/);
  if (ytShort) return `https://www.youtube.com/embed/${ytShort[1]}?autoplay=1&rel=0`;

  // YouTube full: youtube.com/watch?v=ID or /embed/ID
  const ytFull = url.match(/[?&]v=([^&]+)/);
  if (ytFull) return `https://www.youtube.com/embed/${ytFull[1]}?autoplay=1&rel=0`;

  // Already an embed link
  if (url.includes("youtube.com/embed/")) return url.includes("autoplay") ? url : url + "?autoplay=1";

  // Google Drive: /file/d/ID/view → /file/d/ID/preview
  const drive = url.match(/drive\.google\.com\/file\/d\/([^/]+)/);
  if (drive) return `https://drive.google.com/file/d/${drive[1]}/preview`;

  // Direct mp4 or other — return as-is (will be used in <video>)
  return url;
}

function getThumbnail(url: string): string | null {
  const ytShort = url.match(/youtu\.be\/([^?&]+)/);
  if (ytShort) return `https://img.youtube.com/vi/${ytShort[1]}/hqdefault.jpg`;
  const ytFull  = url.match(/[?&]v=([^&]+)/);
  if (ytFull)  return `https://img.youtube.com/vi/${ytFull[1]}/hqdefault.jpg`;
  return null;
}

function isDirectVideo(url: string) {
  return /\.(mp4|webm|ogg|mov)(\?|$)/i.test(url);
}

/* ── Static fallbacks shown until DB has videos ─────────────────────────────── */
const STATIC: Partial<VideoTestimonial>[] = [
  { id: "s1", parentName: "Priya Sharma",  childAge: "5 yrs", location: "Jabalpur, MP",  caption: "Aryan's progress in 3 months was beyond our expectations.", videoUrl: "" },
  { id: "s2", parentName: "Rahul Mishra",  childAge: "7 yrs", location: "Mumbai",        caption: "Online sessions are just as powerful as in-person therapy.", videoUrl: "" },
  { id: "s3", parentName: "Sunita Patel",  childAge: "4 yrs", location: "Katni, MP",     caption: "Dev is calmer, happier and so much more confident now.",    videoUrl: "" },
  { id: "s4", parentName: "Meena Gupta",   childAge: "6 yrs", location: "Delhi",         caption: "The home program Dr. Prasoon designed changed everything.",   videoUrl: "" },
];

/* ── Video Card ─────────────────────────────────────────────────────────────── */
function VideoCard({ t, onPlay }: { t: Partial<VideoTestimonial>; onPlay: (t: Partial<VideoTestimonial>) => void }) {
  const hasVideo   = !!t.videoUrl;
  const autoThumb  = t.videoUrl ? getThumbnail(t.videoUrl) : null;
  const thumbSrc   = t.thumbnailUrl || autoThumb;
  const initials   = (t.parentName ?? "?").split(" ").map(n => n[0]).join("").slice(0, 2).toUpperCase();
  const colors     = ["#1AAFE6", "#6B3FA0", "#F5820D", "#2E8B57"];
  const color      = colors[(t.parentName?.charCodeAt(0) ?? 0) % colors.length];

  return (
    <div
      className="card-lift glass-card"
      style={{
        borderRadius: 20,
        overflow: "hidden",
        border: "1px solid var(--color-border)",
        boxShadow: "var(--shadow-card)",
        display: "flex",
        flexDirection: "column",
        cursor: hasVideo ? "pointer" : "default",
      }}
      onClick={() => hasVideo && onPlay(t)}
    >
      {/* Thumbnail / Placeholder */}
      <div style={{ position: "relative", height: 200, background: `linear-gradient(135deg, ${color}18, ${color}08)`, overflow: "hidden", flexShrink: 0 }}>
        {thumbSrc ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={thumbSrc} alt={t.parentName} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
        ) : (
          <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", gap: 12 }}>
            <div style={{ width: 72, height: 72, borderRadius: "50%", background: `${color}22`, border: `2px solid ${color}44`, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <span style={{ fontFamily: "'Nunito',sans-serif", fontWeight: 900, fontSize: 26, color }}>{initials}</span>
            </div>
            {!hasVideo && (
              <span style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 11, color: "var(--color-text-secondary)", opacity: .7 }}>No video yet</span>
            )}
          </div>
        )}

        {/* Dark gradient */}
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(0,0,0,0.55) 0%, transparent 60%)" }} />

        {/* Play button */}
        {hasVideo && (
          <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <div style={{ width: 56, height: 56, borderRadius: "50%", background: "rgba(255,255,255,0.92)", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 4px 20px rgba(0,0,0,0.25)", transition: "transform 0.2s", backdropFilter: "blur(4px)" }}
              onMouseEnter={e => (e.currentTarget.style.transform = "scale(1.12)")}
              onMouseLeave={e => (e.currentTarget.style.transform = "scale(1)")}>
              <Play size={20} fill="#1AAFE6" style={{ color: "#1AAFE6", marginLeft: 3 }} />
            </div>
          </div>
        )}

        {/* Stars */}
        <div style={{ position: "absolute", bottom: 10, right: 12, display: "flex", gap: 2 }}>
          {[1,2,3,4,5].map(s => <Star key={s} size={12} fill="#F5820D" style={{ color: "#F5820D" }} />)}
        </div>
      </div>

      {/* Body */}
      <div style={{ padding: "16px 18px 18px", flex: 1, display: "flex", flexDirection: "column", gap: 10 }}>
        <Quote size={18} style={{ color, opacity: 0.5 }} />
        {t.caption && (
          <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 14, lineHeight: 1.7, color: "var(--color-text-secondary)", margin: 0, flex: 1 }}>
            "{t.caption}"
          </p>
        )}
        <div style={{ borderTop: "1px solid var(--color-border)", paddingTop: 10, marginTop: "auto" }}>
          <div style={{ fontFamily: "'Nunito',sans-serif", fontWeight: 800, fontSize: 14, color: "var(--color-text-primary)" }}>{t.parentName}</div>
          <div style={{ display: "flex", alignItems: "center", gap: 4, marginTop: 2 }}>
            {t.childAge && <span style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 12, color: "var(--color-text-secondary)" }}>Child: {t.childAge}</span>}
            {t.location && (
              <>
                {t.childAge && <span style={{ color: "var(--color-border)" }}>·</span>}
                <span style={{ display: "flex", alignItems: "center", gap: 2, fontFamily: "'DM Sans',sans-serif", fontSize: 12, color: "var(--color-text-secondary)" }}>
                  <MapPin size={10} /> {t.location}
                </span>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── Video Modal ─────────────────────────────────────────────────────────────── */
function VideoModal({ t, onClose }: { t: Partial<VideoTestimonial>; onClose: () => void }) {
  const embedUrl = t.videoUrl ? getEmbedUrl(t.videoUrl) : "";
  const direct   = t.videoUrl ? isDirectVideo(t.videoUrl) : false;

  // close on ESC
  useEffect(() => {
    const fn = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", fn);
    return () => window.removeEventListener("keydown", fn);
  }, [onClose]);

  return (
    <div
      style={{ position: "fixed", inset: 0, zIndex: 1000, background: "rgba(0,0,0,0.65)", backdropFilter: "blur(8px)", display: "flex", alignItems: "center", justifyContent: "center", padding: "20px" }}
      onClick={onClose}
    >
      <div
        style={{ width: "100%", maxWidth: 820, borderRadius: 20, overflow: "hidden", position: "relative", boxShadow: "0 32px 80px rgba(0,0,0,0.6)", animation: "page-in 0.3s ease both" }}
        onClick={e => e.stopPropagation()}
      >
        {/* Close */}
        <button
          onClick={onClose}
          style={{ position: "absolute", top: 14, right: 14, zIndex: 10, width: 36, height: 36, borderRadius: "50%", background: "rgba(0,0,0,0.6)", border: "1px solid rgba(255,255,255,0.2)", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", backdropFilter: "blur(4px)" }}
        >
          <X size={16} style={{ color: "white" }} />
        </button>

        {/* Video */}
        <div style={{ position: "relative", paddingTop: "56.25%", background: "#000" }}>
          {direct ? (
            <video
              src={t.videoUrl}
              controls autoPlay
              style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}
            />
          ) : (
            <iframe
              src={embedUrl}
              style={{ position: "absolute", inset: 0, width: "100%", height: "100%", border: "none" }}
              allow="autoplay; encrypted-media; fullscreen"
              allowFullScreen
            />
          )}
        </div>

        {/* Caption bar */}
        <div style={{ background: "rgba(0,0,0,0.6)", padding: "16px 24px", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12 }}>
          <div>
            <div style={{ fontFamily: "'Nunito',sans-serif", fontWeight: 800, fontSize: 16, color: "white" }}>{t.parentName}</div>
            <div style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 13, color: "rgba(255,255,255,0.5)", marginTop: 2 }}>
              {[t.childAge && `Child: ${t.childAge}`, t.location].filter(Boolean).join(" · ")}
            </div>
          </div>
          <div style={{ display: "flex", gap: 2 }}>
            {[1,2,3,4,5].map(s => <Star key={s} size={14} fill="#F5820D" style={{ color: "#F5820D" }} />)}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── Main Section ─────────────────────────────────────────────────────────────── */
export default function VideoTestimonialsSection() {
  const [items, setItems]     = useState<Partial<VideoTestimonial>[]>(STATIC);
  const [active, setActive]   = useState<Partial<VideoTestimonial> | null>(null);
  const [page, setPage]       = useState(0);
  const VISIBLE               = 3;
  const trackRef              = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetch("/api/admin/testimonials")
      .then(r => r.json())
      .then((data: VideoTestimonial[]) => {
        if (data.length > 0) setItems(data);
      })
      .catch(() => {});
  }, []);

  const totalPages = Math.ceil(items.length / VISIBLE);
  const visible    = items.slice(page * VISIBLE, page * VISIBLE + VISIBLE);

  return (
    <>
      {/* ── Section ── */}
      <section
        id="video-testimonials"
        style={{ padding: "100px 0", position: "relative", overflow: "hidden" }}
      >
        {/* Background orbs */}
        <div className="orb orb-teal"   style={{ width: 500, height: 500, top: -100, right: -200, opacity: 0.06 }} />
        <div className="orb orb-purple" style={{ width: 400, height: 400, bottom: -80, left: -100, opacity: 0.06 }} />

        <div className="container" style={{ position: "relative" }}>

          {/* Header */}
          <div className="reveal" style={{ textAlign: "center", marginBottom: 60 }}>
            <span className="eyebrow">Real Families · Real Results</span>
            <h2 style={{ fontFamily: "'Nunito',sans-serif", fontWeight: 900, fontSize: "clamp(24px, 3vw, 36px)", color: "var(--color-text-primary)", lineHeight: 1.15, margin: "0 0 16px" }}>
              Hear From{" "}
              <span className="text-gradient">Our Families</span>
            </h2>
            <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 17, color: "var(--color-text-secondary)", maxWidth: 540, margin: "0 auto" }}>
              Parents share their children's transformation journey with Dr. Prasoon at Udaan Care.
            </p>
          </div>

          {/* Cards grid */}
          <div
            ref={trackRef}
            className="reveal-stagger"
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
              gap: 24,
              marginBottom: 32,
            }}
          >
            {visible.map(t => (
              <VideoCard key={t.id} t={t} onPlay={setActive} />
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 12 }}>
              <button
                onClick={() => setPage(p => Math.max(0, p - 1))}
                disabled={page === 0}
                style={{ width: 40, height: 40, borderRadius: "50%", border: "1.5px solid var(--color-border)", background: "var(--color-surface)", display: "flex", alignItems: "center", justifyContent: "center", cursor: page === 0 ? "not-allowed" : "pointer", opacity: page === 0 ? 0.4 : 1, transition: "all 0.2s" }}
              >
                <ChevronLeft size={18} style={{ color: "var(--color-text-secondary)" }} />
              </button>

              {Array.from({ length: totalPages }).map((_, i) => (
                <button key={i} onClick={() => setPage(i)}
                  style={{ width: i === page ? 28 : 10, height: 10, borderRadius: 5, border: "none", cursor: "pointer", transition: "all 0.3s", background: i === page ? "var(--color-primary)" : "var(--color-border)" }}
                />
              ))}

              <button
                onClick={() => setPage(p => Math.min(totalPages - 1, p + 1))}
                disabled={page === totalPages - 1}
                style={{ width: 40, height: 40, borderRadius: "50%", border: "1.5px solid var(--color-border)", background: "var(--color-surface)", display: "flex", alignItems: "center", justifyContent: "center", cursor: page === totalPages - 1 ? "not-allowed" : "pointer", opacity: page === totalPages - 1 ? 0.4 : 1, transition: "all 0.2s" }}
              >
                <ChevronRight size={18} style={{ color: "var(--color-text-secondary)" }} />
              </button>
            </div>
          )}

          {/* Trust line */}
          <div className="reveal" style={{ textAlign: "center", marginTop: 48 }}>
            <div style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "10px 20px", borderRadius: 12, background: "var(--color-primary-light)", border: "1px solid rgba(26,175,230,0.2)" }}>
              {[1,2,3,4,5].map(s => <Star key={s} size={14} fill="#F5820D" style={{ color: "#F5820D" }} />)}
              <span style={{ fontFamily: "'DM Sans',sans-serif", fontWeight: 600, fontSize: 13, color: "var(--color-primary)" }}>
                Trusted by 400+ families across India
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Video Modal */}
      {active && <VideoModal t={active} onClose={() => setActive(null)} />}
    </>
  );
}
