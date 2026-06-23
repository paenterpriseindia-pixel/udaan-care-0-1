"use client";
import { useState, useCallback, useEffect, useRef } from "react";
import { Upload, Check, RefreshCw, Clipboard, FolderOpen, Zap, X } from "lucide-react";
import Image from "next/image";

const SLOTS = [
  // Logo
  { key: "logo-dark",    dest: "images/logo/logo-dark.png",              label: "Logo — Light Background",        hint: "PNG · Navbar on light bg",            group: "Logo" },
  { key: "logo-light",   dest: "images/logo/logo-light.png",             label: "Logo — Dark Background",         hint: "PNG · Navbar on dark bg / footer",    group: "Logo" },
  // Hero / Global
  { key: "hero-bg",      dest: "images/global/hero-background.jpg",      label: "Hero Background",                hint: "1920×1080 · Home page full-width bg", group: "Hero" },
  { key: "cta-bg",       dest: "images/global/cta-background.jpg",       label: "CTA Background",                 hint: "1920×1080 · Book section bg",         group: "Hero" },
  { key: "about-bg",     dest: "images/global/about-background.jpg",     label: "About Page Background",          hint: "1920×600 · Clinic / team photo",      group: "Hero" },
  // Doctor
  { key: "dr-hero",      dest: "images/doctor/dr-prasoon-hero.jpg",      label: "Dr. Prasoon — Hero",             hint: "340×440 · Portrait, right side hero", group: "Doctor" },
  { key: "dr-about",     dest: "images/doctor/dr-prasoon-about.jpg",     label: "Dr. Prasoon — About Section",    hint: "480×520 · Doctor section",            group: "Doctor" },
  { key: "dr-card",      dest: "images/doctor/dr-prasoon-card.jpg",      label: "Dr. Prasoon — Card",             hint: "280×360 · Gallery card",              group: "Doctor" },
  // Clinic Gallery
  { key: "clinic-ext",   dest: "images/clinic/clinic-exterior.jpg",      label: "Clinic — Exterior",              hint: "Clinic building outside",             group: "Clinic" },
  { key: "clinic-int1",  dest: "images/clinic/clinic-interior-1.jpg",    label: "Clinic — Therapy Room",          hint: "Main therapy room",                   group: "Clinic" },
  { key: "clinic-int2",  dest: "images/clinic/clinic-interior-2.jpg",    label: "Clinic — Reception",             hint: "Reception / waiting area",            group: "Clinic" },
  { key: "clinic-int3",  dest: "images/clinic/clinic-interior-3.jpg",    label: "Clinic — Sensory Room",          hint: "Sensory equipment room",              group: "Clinic" },
  // Services
  { key: "svc-ot",       dest: "images/services/occupational-therapy.jpg",label: "Occupational Therapy",           hint: "Child doing hand activity",           group: "Services" },
  { key: "svc-ped",      dest: "images/services/pediatric-therapy.jpg",   label: "Pediatric Therapy",              hint: "Child with therapist",                group: "Services" },
  { key: "svc-si",       dest: "images/services/sensory-integration.jpg", label: "Sensory Integration",            hint: "Sensory room / swing",                group: "Services" },
  { key: "svc-online",   dest: "images/services/online-therapy.jpg",      label: "Online Therapy",                 hint: "Zoom session / laptop",               group: "Services" },
  // Blog
  { key: "blog-1",       dest: "images/blog/sensory-processing.jpg",     label: "Blog — Sensory",                 hint: "Child sensory activity",              group: "Blog" },
  { key: "blog-2",       dest: "images/blog/autism-therapy.jpg",         label: "Blog — Autism",                  hint: "OT session with child",               group: "Blog" },
  { key: "blog-3",       dest: "images/blog/fine-motor.jpg",             label: "Blog — Fine Motor",              hint: "Child with pencil / scissors",        group: "Blog" },
  // Testimonials
  { key: "parent-1",     dest: "images/testimonials/parent-1.jpg",       label: "Parent — Priya Sharma",          hint: "100×100 square headshot",             group: "Testimonials" },
  { key: "parent-2",     dest: "images/testimonials/parent-2.jpg",       label: "Parent — Rahul Mishra",          hint: "100×100 square headshot",             group: "Testimonials" },
  { key: "parent-3",     dest: "images/testimonials/parent-3.jpg",       label: "Parent — Sunita Patel",          hint: "100×100 square headshot",             group: "Testimonials" },
];

const GROUPS = [...new Set(SLOTS.map(s => s.group))];
type UpStatus = "idle" | "uploading" | "done" | "error";

interface SlotState { status: UpStatus; preview?: string; error?: string; }

async function uploadFile(file: File, dest: string) {
  const form = new FormData();
  form.append("file", file);
  form.append("dest", dest);
  const res = await fetch("/api/upload-image", { method: "POST", body: form });
  if (!res.ok) throw new Error((await res.json()).error ?? "Upload failed");
  const { path } = await res.json();
  return path as string;
}

export default function AdminUploadPage() {
  const [states, setStates] = useState<Record<string, SlotState>>({});
  const [group, setGroup] = useState("All");
  const [pasteKey, setPasteKey] = useState<string | null>(null);
  const [globalDrag, setGlobalDrag] = useState(false);
  const [dragKey, setDragKey] = useState<string | null>(null);
  const [toast, setToast] = useState<{ msg: string; ok: boolean } | null>(null);
  const fileRefs = useRef<Record<string, HTMLInputElement | null>>({});

  const showToast = (msg: string, ok = true) => {
    setToast({ msg, ok });
    setTimeout(() => setToast(null), 3000);
  };

  // Check which images already exist on load
  useEffect(() => {
    SLOTS.forEach(async slot => {
      try {
        const r = await fetch(`/${slot.dest}`, { method: "HEAD" });
        if (r.ok) setStates(p => ({ ...p, [slot.key]: { status: "done", preview: `/${slot.dest}?t=${Date.now()}` } }));
      } catch {}
    });
  }, []);

  const doUpload = useCallback(async (key: string, dest: string, file: File) => {
    setStates(p => ({ ...p, [key]: { status: "uploading" } }));
    try {
      const path = await uploadFile(file, dest);
      setStates(p => ({ ...p, [key]: { status: "done", preview: `${path}?t=${Date.now()}` } }));
      showToast(`✓ ${dest.split("/").pop()} saved!`);
    } catch (e) {
      setStates(p => ({ ...p, [key]: { status: "error", error: String(e) } }));
      showToast("Upload failed", false);
    }
  }, []);

  // Global Ctrl+V paste
  useEffect(() => {
    const onPaste = async (e: ClipboardEvent) => {
      if (!pasteKey) return;
      for (const item of Array.from(e.clipboardData?.items ?? [])) {
        if (item.type.startsWith("image/")) {
          const f = item.getAsFile();
          if (!f) continue;
          const slot = SLOTS.find(s => s.key === pasteKey)!;
          await doUpload(slot.key, slot.dest, f);
          setPasteKey(null);
          break;
        }
      }
    };
    window.addEventListener("paste", onPaste);
    return () => window.removeEventListener("paste", onPaste);
  }, [pasteKey, doUpload]);

  // Global drag enter/leave
  useEffect(() => {
    const enter = (e: DragEvent) => { if (e.dataTransfer?.types.includes("Files")) setGlobalDrag(true); };
    const leave = (e: DragEvent) => { if (!e.relatedTarget) setGlobalDrag(false); };
    const prevent = (e: DragEvent) => e.preventDefault();
    window.addEventListener("dragenter", enter);
    window.addEventListener("dragleave", leave);
    window.addEventListener("dragover", prevent);
    window.addEventListener("drop", prevent);
    return () => {
      window.removeEventListener("dragenter", enter);
      window.removeEventListener("dragleave", leave);
      window.removeEventListener("dragover", prevent);
      window.removeEventListener("drop", prevent);
    };
  }, []);

  const visible = group === "All" ? SLOTS : SLOTS.filter(s => s.group === group);
  const doneCount = Object.values(states).filter(s => s.status === "done").length;

  return (
    <div style={{ minHeight: "100vh", background: "#0D1117", paddingTop: 80, paddingBottom: 80, fontFamily: "'DM Sans', sans-serif" }}>

      {/* Toast */}
      {toast && (
        <div style={{
          position: "fixed", bottom: 28, right: 28, zIndex: 9999,
          padding: "14px 22px", borderRadius: 12,
          background: toast.ok ? "#22c55e" : "#ef4444",
          color: "white", fontWeight: 700, fontSize: 14,
          boxShadow: "0 8px 32px rgba(0,0,0,0.4)",
          animation: "fadeUp 0.3s ease",
        }}>
          {toast.msg}
        </div>
      )}

      {/* Global drag overlay */}
      {globalDrag && (
        <div style={{
          position: "fixed", inset: 0, zIndex: 9998,
          background: "rgba(10,126,140,0.2)", backdropFilter: "blur(4px)",
          border: "3px dashed #0A7E8C",
          display: "flex", alignItems: "center", justifyContent: "center",
          flexDirection: "column", gap: 16,
        }}
          onDragOver={e => e.preventDefault()}
          onDrop={e => { e.preventDefault(); setGlobalDrag(false); }}
        >
          <Upload size={64} style={{ color: "#0A7E8C" }} />
          <p style={{ color: "white", fontSize: 22, fontWeight: 700 }}>Drop image onto a card below</p>
        </div>
      )}

      {/* ── Header ── */}
      <div style={{ background: "rgba(255,255,255,0.03)", borderBottom: "1px solid rgba(255,255,255,0.07)", padding: "28px 0 0" }}>
        <div className="container">
          <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 16, flexWrap: "wrap", marginBottom: 24 }}>
            <div>
              <h1 style={{ fontFamily: "'Nunito',sans-serif", fontWeight: 900, fontSize: 30, color: "white", marginBottom: 6 }}>
                Image Upload Panel
              </h1>
              <p style={{ fontSize: 14, color: "rgba(255,255,255,0.45)" }}>
                Upload all your website photos here in one place
              </p>
            </div>
            {/* Progress */}
            <div style={{ textAlign: "right" }}>
              <div style={{ fontSize: 32, fontWeight: 900, color: "white", fontFamily: "'Nunito',sans-serif" }}>
                {doneCount}<span style={{ fontSize: 18, color: "rgba(255,255,255,0.3)" }}>/{SLOTS.length}</span>
              </div>
              <div style={{ fontSize: 12, color: "rgba(255,255,255,0.4)" }}>images uploaded</div>
              <div style={{ marginTop: 8, height: 6, borderRadius: 3, background: "rgba(255,255,255,0.08)", width: 180 }}>
                <div style={{ height: "100%", borderRadius: 3, background: "linear-gradient(90deg, #0A7E8C, #6B3FA0)", width: `${(doneCount / SLOTS.length) * 100}%`, transition: "width 0.4s ease" }} />
              </div>
            </div>
          </div>

          {/* HOW TO instructions */}
          <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginBottom: 24, padding: "16px 20px", borderRadius: 12, background: "rgba(10,126,140,0.1)", border: "1px solid rgba(10,126,140,0.2)" }}>
            {[
              { icon: "🖱️", title: "Click a card", desc: "Opens your photo library" },
              { icon: "📋", title: "Ctrl+V paste", desc: "Click the card, then Ctrl+V for screenshots" },
              { icon: "🖱️", title: "Drag & Drop", desc: "Drag any image from your PC onto a card" },
            ].map(tip => (
              <div key={tip.title} style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <span style={{ fontSize: 22 }}>{tip.icon}</span>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 700, color: "white" }}>{tip.title}</div>
                  <div style={{ fontSize: 11, color: "rgba(255,255,255,0.4)" }}>{tip.desc}</div>
                </div>
                <div style={{ width: 1, height: 32, background: "rgba(255,255,255,0.1)", margin: "0 6px" }} />
              </div>
            ))}
          </div>

          {/* Group filter tabs */}
          <div style={{ display: "flex", gap: 8, overflowX: "auto", paddingBottom: 1 }}>
            {["All", ...GROUPS].map(g => (
              <button key={g} onClick={() => setGroup(g)} style={{
                flexShrink: 0, padding: "8px 18px", borderRadius: "10px 10px 0 0", border: "none", cursor: "pointer",
                fontWeight: 600, fontSize: 13,
                background: group === g ? "#0D1117" : "transparent",
                color: group === g ? "white" : "rgba(255,255,255,0.45)",
                borderTop: group === g ? "2px solid #0A7E8C" : "2px solid transparent",
                transition: "all 0.18s",
              }}>
                {g}
                <span style={{ marginLeft: 6, fontSize: 11, opacity: 0.6 }}>
                  ({(g === "All" ? SLOTS : SLOTS.filter(s => s.group === g)).filter(s => states[s.key]?.status === "done").length}/{g === "All" ? SLOTS.length : SLOTS.filter(s => s.group === g).length})
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ── Grid ── */}
      <div className="container" style={{ paddingTop: 32 }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 18 }}>
          {visible.map(slot => {
            const s = states[slot.key];
            const isDone = s?.status === "done";
            const isUp = s?.status === "uploading";
            const isErr = s?.status === "error";
            const isPaste = pasteKey === slot.key;
            const isDragging = dragKey === slot.key;

            return (
              <div
                key={slot.key}
                style={{
                  borderRadius: 16,
                  border: `2px solid ${isDragging ? "#0A7E8C" : isPaste ? "#6B3FA0" : isDone ? "rgba(34,197,94,0.35)" : isErr ? "rgba(239,68,68,0.35)" : "rgba(255,255,255,0.08)"}`,
                  background: isDragging ? "rgba(10,126,140,0.1)" : "rgba(255,255,255,0.03)",
                  overflow: "hidden", cursor: "pointer",
                  transition: "all 0.2s ease",
                  boxShadow: isDone ? "0 0 0 0" : "none",
                }}
                onClick={() => fileRefs.current[slot.key]?.click()}
                onDragOver={e => { e.preventDefault(); setDragKey(slot.key); }}
                onDragLeave={() => setDragKey(null)}
                onDrop={e => {
                  e.preventDefault();
                  setDragKey(null);
                  setGlobalDrag(false);
                  const f = e.dataTransfer.files[0];
                  if (f) doUpload(slot.key, slot.dest, f);
                }}
              >
                {/* ── Image preview area ── */}
                <div style={{ position: "relative", height: 170, background: "rgba(255,255,255,0.02)", display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", gap: 8 }}>
                  {isDone && s.preview ? (
                    <>
                      <Image src={s.preview} alt={slot.label} fill style={{ objectFit: "cover" }} sizes="300px" unoptimized />
                      {/* Hover to replace */}
                      <div style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0)", transition: "background 0.2s", display: "flex", alignItems: "center", justifyContent: "center" }}
                        onMouseEnter={e => { e.currentTarget.style.background = "rgba(0,0,0,0.55)"; (e.currentTarget.querySelector(".rep") as HTMLElement).style.opacity = "1"; }}
                        onMouseLeave={e => { e.currentTarget.style.background = "rgba(0,0,0,0)"; (e.currentTarget.querySelector(".rep") as HTMLElement).style.opacity = "0"; }}
                      >
                        <div className="rep" style={{ opacity: 0, transition: "opacity 0.2s", textAlign: "center" }}>
                          <RefreshCw size={22} style={{ color: "white", margin: "0 auto 6px" }} />
                          <div style={{ color: "white", fontSize: 12, fontWeight: 700 }}>Click to replace</div>
                        </div>
                      </div>
                      {/* Green tick */}
                      <div style={{ position: "absolute", top: 8, right: 8, width: 26, height: 26, borderRadius: "50%", background: "#22c55e", display: "flex", alignItems: "center", justifyContent: "center" }}>
                        <Check size={14} style={{ color: "white" }} />
                      </div>
                    </>
                  ) : isUp ? (
                    <>
                      <div style={{ width: 38, height: 38, border: "3px solid rgba(10,126,140,0.3)", borderTop: "3px solid #0A7E8C", borderRadius: "50%", animation: "spin 0.8s linear infinite" }} />
                      <span style={{ color: "rgba(255,255,255,0.5)", fontSize: 12 }}>Uploading…</span>
                    </>
                  ) : isPaste ? (
                    <>
                      <Clipboard size={30} style={{ color: "#6B3FA0" }} />
                      <span style={{ color: "#6B3FA0", fontSize: 13, fontWeight: 700 }}>Press Ctrl+V now</span>
                      <button onClick={e => { e.stopPropagation(); setPasteKey(null); }} style={{ position: "absolute", top: 8, right: 8, background: "rgba(255,255,255,0.1)", border: "none", borderRadius: "50%", width: 24, height: 24, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
                        <X size={12} style={{ color: "white" }} />
                      </button>
                    </>
                  ) : isDragging ? (
                    <>
                      <Zap size={30} style={{ color: "#0A7E8C" }} />
                      <span style={{ color: "#0A7E8C", fontSize: 13, fontWeight: 700 }}>Drop here!</span>
                    </>
                  ) : (
                    <>
                      <FolderOpen size={26} style={{ color: "rgba(255,255,255,0.2)" }} />
                      <span style={{ color: "rgba(255,255,255,0.3)", fontSize: 12 }}>Click · Drag · Paste</span>
                    </>
                  )}
                </div>

                {/* ── Info strip ── */}
                <div style={{ padding: "12px 14px 14px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 3 }}>
                    <span style={{ fontSize: 13, fontWeight: 700, color: "white", flex: 1, minWidth: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{slot.label}</span>
                    <span style={{ fontSize: 10, padding: "2px 7px", borderRadius: 4, background: "rgba(10,126,140,0.18)", color: "#0D9BAC", flexShrink: 0 }}>{slot.group}</span>
                  </div>
                  <div style={{ fontSize: 11, color: "rgba(255,255,255,0.32)", marginBottom: 8 }}>{slot.hint}</div>

                  {/* Two action buttons */}
                  <div style={{ display: "flex", gap: 6 }}>
                    <button
                      onClick={e => { e.stopPropagation(); fileRefs.current[slot.key]?.click(); }}
                      style={{
                        flex: 1, padding: "7px 10px", borderRadius: 8, border: "1px solid rgba(255,255,255,0.12)",
                        background: "rgba(255,255,255,0.06)", cursor: "pointer",
                        fontSize: 12, fontWeight: 600, color: "rgba(255,255,255,0.6)",
                        display: "flex", alignItems: "center", justifyContent: "center", gap: 5,
                        transition: "all 0.15s",
                      }}
                      onMouseEnter={e => { e.currentTarget.style.background = "rgba(255,255,255,0.12)"; e.currentTarget.style.color = "white"; }}
                      onMouseLeave={e => { e.currentTarget.style.background = "rgba(255,255,255,0.06)"; e.currentTarget.style.color = "rgba(255,255,255,0.6)"; }}
                    >
                      <Upload size={11} /> Browse
                    </button>
                    <button
                      onClick={e => { e.stopPropagation(); setPasteKey(isPaste ? null : slot.key); }}
                      style={{
                        flex: 1, padding: "7px 10px", borderRadius: 8, border: "none",
                        background: isPaste ? "#6B3FA0" : "rgba(107,63,160,0.15)",
                        cursor: "pointer",
                        fontSize: 12, fontWeight: 600,
                        color: isPaste ? "white" : "rgba(107,63,160,0.9)",
                        display: "flex", alignItems: "center", justifyContent: "center", gap: 5,
                        transition: "all 0.15s",
                      }}
                    >
                      <Clipboard size={11} /> Paste
                    </button>
                  </div>

                  {isErr && <div style={{ marginTop: 6, fontSize: 11, color: "#f87171" }}>⚠ {s.error}</div>}
                </div>

                <input
                  ref={el => { fileRefs.current[slot.key] = el; }}
                  type="file"
                  accept="image/*"
                  style={{ display: "none" }}
                  onChange={e => { const f = e.target.files?.[0]; if (f) doUpload(slot.key, slot.dest, f); e.target.value = ""; }}
                  onClick={e => e.stopPropagation()}
                />
              </div>
            );
          })}
        </div>
      </div>

      <style>{`
        @keyframes spin { from { transform:rotate(0deg); } to { transform:rotate(360deg); } }
        @keyframes fadeUp { from { opacity:0; transform:translateY(10px); } to { opacity:1; transform:translateY(0); } }
      `}</style>
    </div>
  );
}
