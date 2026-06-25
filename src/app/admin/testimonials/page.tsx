"use client";
import { useEffect, useState } from "react";
import {
  Plus, Trash2, Eye, EyeOff, Edit3, Save, X,
  Video, Star, MapPin, GripVertical, CheckCircle,
  AlertCircle, ExternalLink, RefreshCw
} from "lucide-react";
import type { VideoTestimonial } from "@/lib/db";

const EMPTY: Omit<VideoTestimonial, "id" | "createdAt"> = {
  parentName: "", childAge: "", location: "", caption: "",
  videoUrl: "", thumbnailUrl: "", isActive: true, sortOrder: 0,
};

function detectPlatform(url: string): string {
  if (!url) return "";
  if (/youtu/.test(url)) return "YouTube";
  if (/drive\.google/.test(url)) return "Google Drive";
  if (/\.(mp4|webm|mov)/i.test(url)) return "Direct Video";
  return "Link";
}

function VideoPreview({ url }: { url: string }) {
  if (!url) return null;
  const platform = detectPlatform(url);

  let embedUrl = url;
  const ytShort = url.match(/youtu\.be\/([^?&]+)/);
  const ytFull  = url.match(/[?&]v=([^&]+)/);
  const drive   = url.match(/drive\.google\.com\/file\/d\/([^/]+)/);
  if (ytShort) embedUrl = `https://www.youtube.com/embed/${ytShort[1]}`;
  else if (ytFull) embedUrl = `https://www.youtube.com/embed/${ytFull[1]}`;
  else if (drive) embedUrl = `https://drive.google.com/file/d/${drive[1]}/preview`;

  const isDirect = /\.(mp4|webm|mov|ogg)/i.test(url);

  return (
    <div style={{ marginTop: 12, borderRadius: 12, overflow: "hidden", border: "1px solid var(--color-border)", background: "#000" }}>
      <div style={{ padding: "6px 12px", background: "rgba(0,0,0,0.5)", display: "flex", alignItems: "center", gap: 6 }}>
        <Video size={12} style={{ color: "#FF0000" }} />
        <span style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 11, color: "rgba(255,255,255,0.6)" }}>{platform} Preview</span>
      </div>
      <div style={{ position: "relative", paddingTop: "56.25%" }}>
        {isDirect ? (
          <video src={url} controls style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }} />
        ) : (
          <iframe src={embedUrl} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", border: "none" }}
            allow="encrypted-media" allowFullScreen />
        )}
      </div>
    </div>
  );
}

export default function AdminTestimonialsPage() {
  const [items, setItems]       = useState<VideoTestimonial[]>([]);
  const [loading, setLoading]   = useState(true);
  const [saving, setSaving]     = useState(false);
  const [toast, setToast]       = useState<{ msg: string; ok: boolean } | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm]         = useState(EMPTY);
  const [editId, setEditId]     = useState<string | null>(null);
  const [preview, setPreview]   = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const showToast = (msg: string, ok = true) => {
    setToast({ msg, ok });
    setTimeout(() => setToast(null), 3500);
  };

  const load = () => {
    setLoading(true);
    fetch("/api/admin/testimonials?admin=true")
      .then(r => r.json())
      .then((d: VideoTestimonial[]) => { setItems(Array.isArray(d) ? d : []); setLoading(false); })
      .catch(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const openNew = () => {
    setForm({ ...EMPTY, sortOrder: items.length });
    setEditId(null);
    setPreview(false);
    setShowForm(true);
  };

  const openEdit = (t: VideoTestimonial) => {
    setForm({
      parentName: t.parentName, childAge: t.childAge ?? "", location: t.location ?? "",
      caption: t.caption ?? "", videoUrl: t.videoUrl, thumbnailUrl: t.thumbnailUrl ?? "",
      isActive: t.isActive, sortOrder: t.sortOrder,
    });
    setEditId(t.id);
    setPreview(false);
    setShowForm(true);
  };

  const save = async () => {
    if (!form.parentName.trim()) { showToast("Parent name is required", false); return; }
    if (!form.videoUrl.trim())   { showToast("Video link is required", false); return; }
    setSaving(true);
    try {
      const method = editId ? "PATCH" : "POST";
      const body   = editId ? { id: editId, ...form } : form;
      const r = await fetch("/api/admin/testimonials", {
        method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(body),
      });
      if (!r.ok) throw new Error("Failed");
      showToast(editId ? "Testimonial updated!" : "Testimonial added! Now visible on website ✓");
      setShowForm(false);
      load();
    } catch {
      showToast("Something went wrong", false);
    } finally {
      setSaving(false);
    }
  };

  const toggleActive = async (t: VideoTestimonial) => {
    await fetch("/api/admin/testimonials", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: t.id, isActive: !t.isActive }),
    });
    showToast(t.isActive ? "Hidden from website" : "Now visible on website");
    load();
  };

  const del = async (id: string) => {
    if (!confirm("Delete this testimonial?")) return;
    await fetch(`/api/admin/testimonials?id=${id}`, { method: "DELETE" });
    showToast("Deleted");
    load();
  };

  const refreshSite = async () => {
    setRefreshing(true);
    await fetch("/api/admin/revalidate", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ all: true }) });
    showToast("Website refreshed! Changes are now live ✓");
    setRefreshing(false);
  };

  const field = (label: string, key: keyof typeof form, placeholder: string, type = "text", required = false) => (
    <div>
      <label style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 12, fontWeight: 600, color: "rgba(255,255,255,0.55)", display: "block", marginBottom: 6 }}>
        {label}{required && <span style={{ color: "#FF7043" }}> *</span>}
      </label>
      {key === "caption" ? (
        <textarea
          rows={3}
          value={form[key] as string}
          onChange={e => setForm(p => ({ ...p, [key]: e.target.value }))}
          placeholder={placeholder}
          style={{ width: "100%", padding: "10px 14px", borderRadius: 10, border: "1.5px solid rgba(255,255,255,0.12)", background: "rgba(255,255,255,0.05)", color: "white", fontFamily: "'DM Sans',sans-serif", fontSize: 14, resize: "vertical", outline: "none" }}
        />
      ) : (
        <input
          type={type}
          value={form[key] as string}
          onChange={e => setForm(p => ({ ...p, [key]: e.target.value }))}
          placeholder={placeholder}
          style={{ width: "100%", padding: "10px 14px", borderRadius: 10, border: "1.5px solid rgba(255,255,255,0.12)", background: "rgba(255,255,255,0.05)", color: "white", fontFamily: "'DM Sans',sans-serif", fontSize: 14, outline: "none", boxSizing: "border-box" }}
          onFocus={e => (e.target.style.borderColor = "#1AAFE6")}
          onBlur={e  => (e.target.style.borderColor = "rgba(255,255,255,0.12)")}
        />
      )}
    </div>
  );

  const s = { background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 16, padding: 20 };

  return (
    <div>
      {/* Toast */}
      {toast && (
        <div style={{ position: "fixed", top: 80, right: 24, zIndex: 1000, padding: "12px 20px", borderRadius: 12, background: toast.ok ? "rgba(34,197,94,0.15)" : "rgba(239,68,68,0.15)", border: `1px solid ${toast.ok ? "rgba(34,197,94,0.3)" : "rgba(239,68,68,0.3)"}`, display: "flex", alignItems: "center", gap: 10, backdropFilter: "blur(12px)", animation: "page-in 0.3s ease" }}>
          {toast.ok ? <CheckCircle size={16} style={{ color: "#22c55e" }} /> : <AlertCircle size={16} style={{ color: "#ef4444" }} />}
          <span style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 13, color: "white" }}>{toast.msg}</span>
        </div>
      )}

      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 24, flexWrap: "wrap", gap: 12 }}>
        <div>
          <h1 style={{ fontFamily: "'Nunito',sans-serif", fontWeight: 900, fontSize: 26, color: "white", marginBottom: 4 }}>
            Video Testimonials
          </h1>
          <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 13, color: "rgba(255,255,255,0.4)" }}>
            Upload customer feedback videos — they appear instantly on your website
          </p>
        </div>
        <div style={{ display: "flex", gap: 10 }}>
          <button onClick={refreshSite} disabled={refreshing} style={{ display: "flex", alignItems: "center", gap: 6, padding: "10px 16px", borderRadius: 10, background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.12)", color: "rgba(255,255,255,0.65)", fontSize: 13, fontFamily: "'DM Sans',sans-serif", fontWeight: 600, cursor: "pointer" }}>
            <RefreshCw size={13} style={{ animation: refreshing ? "spin-slow 1s linear infinite" : "none" }} />
            {refreshing ? "Refreshing…" : "Refresh Site"}
          </button>
          <button onClick={openNew} style={{ display: "flex", alignItems: "center", gap: 8, padding: "10px 20px", borderRadius: 10, background: "linear-gradient(135deg, #1AAFE6, #6B3FA0)", color: "white", border: "none", fontSize: 14, fontFamily: "'Nunito',sans-serif", fontWeight: 700, cursor: "pointer" }}>
            <Plus size={16} /> Add Testimonial
          </button>
        </div>
      </div>

      {/* How it works — tip box */}
      <div style={{ ...s, background: "rgba(26,175,230,0.07)", border: "1px solid rgba(26,175,230,0.2)", marginBottom: 24, display: "flex", gap: 14, alignItems: "flex-start" }}>
        <Video size={20} style={{ color: "#1AAFE6", flexShrink: 0, marginTop: 2 }} />
        <div>
          <div style={{ fontFamily: "'Nunito',sans-serif", fontWeight: 700, fontSize: 14, color: "white", marginBottom: 4 }}>How to add a video</div>
          <div style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 13, color: "rgba(255,255,255,0.55)", lineHeight: 1.7 }}>
            Paste any of these links:<br />
            • <strong style={{ color: "rgba(255,255,255,0.8)" }}>YouTube</strong> — youtube.com/watch?v=... or youtu.be/...<br />
            • <strong style={{ color: "rgba(255,255,255,0.8)" }}>Google Drive</strong> — share the file &amp; paste the share link<br />
            • <strong style={{ color: "rgba(255,255,255,0.8)" }}>Direct MP4</strong> — paste a direct .mp4 URL<br />
            The video will appear on the website with a play button. Toggle ON/OFF anytime.
          </div>
        </div>
      </div>

      {/* Add / Edit Form */}
      {showForm && (
        <div style={{ ...s, marginBottom: 24, border: "1px solid rgba(26,175,230,0.25)", position: "relative" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
            <h2 style={{ fontFamily: "'Nunito',sans-serif", fontWeight: 800, fontSize: 18, color: "white" }}>
              {editId ? "Edit Testimonial" : "Add New Testimonial"}
            </h2>
            <button onClick={() => setShowForm(false)} style={{ width: 32, height: 32, borderRadius: 8, border: "1px solid rgba(255,255,255,0.12)", background: "transparent", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
              <X size={15} style={{ color: "rgba(255,255,255,0.5)" }} />
            </button>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
            {field("Parent Name", "parentName", "e.g. Priya Sharma", "text", true)}
            {field("Child Age", "childAge", "e.g. 5 years")}
            {field("Location", "location", "e.g. Jabalpur, MP")}
            {field("Sort Order", "sortOrder", "0 = first", "number")}
          </div>

          <div style={{ marginTop: 16 }}>
            {field("Caption / Quote", "caption", "Write what the parent said about the results…")}
          </div>

          <div style={{ marginTop: 16 }}>
            <label style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 12, fontWeight: 600, color: "rgba(255,255,255,0.55)", display: "block", marginBottom: 6 }}>
              Video Link <span style={{ color: "#FF7043" }}>*</span>
            </label>
            <div style={{ display: "flex", gap: 8 }}>
              <input
                type="url"
                value={form.videoUrl}
                onChange={e => setForm(p => ({ ...p, videoUrl: e.target.value }))}
                placeholder="Paste YouTube / Google Drive / .mp4 link"
                style={{ flex: 1, padding: "10px 14px", borderRadius: 10, border: "1.5px solid rgba(255,255,255,0.12)", background: "rgba(255,255,255,0.05)", color: "white", fontFamily: "'DM Sans',sans-serif", fontSize: 14, outline: "none" }}
                onFocus={e => (e.target.style.borderColor = "#1AAFE6")}
                onBlur={e  => (e.target.style.borderColor = "rgba(255,255,255,0.12)")}
              />
              <button onClick={() => setPreview(!preview)} style={{ padding: "10px 16px", borderRadius: 10, border: "1px solid rgba(255,255,255,0.12)", background: preview ? "rgba(26,175,230,0.15)" : "transparent", color: preview ? "#1AAFE6" : "rgba(255,255,255,0.5)", cursor: "pointer", fontFamily: "'DM Sans',sans-serif", fontSize: 13, fontWeight: 600 }}>
                {preview ? "Hide Preview" : "Preview"}
              </button>
            </div>
            {form.videoUrl && <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 11, color: "rgba(26,175,230,0.8)", marginTop: 4 }}>Detected: {detectPlatform(form.videoUrl)}</p>}
            {preview && form.videoUrl && <VideoPreview url={form.videoUrl} />}
          </div>

          {field("Custom Thumbnail URL (optional)", "thumbnailUrl", "https://... (leave blank to auto-detect)")}

          {/* Toggle */}
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginTop: 16 }}>
            <button onClick={() => setForm(p => ({ ...p, isActive: !p.isActive }))}
              style={{ width: 48, height: 26, borderRadius: 13, position: "relative", border: "none", cursor: "pointer", background: form.isActive ? "#1AAFE6" : "rgba(255,255,255,0.12)", transition: "background 0.2s" }}>
              <span style={{ position: "absolute", top: 3, left: form.isActive ? "calc(100% - 22px)" : 3, width: 20, height: 20, borderRadius: "50%", background: "white", transition: "left 0.25s", boxShadow: "0 1px 4px rgba(0,0,0,0.2)" }} />
            </button>
            <span style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 13, color: "rgba(255,255,255,0.6)" }}>
              {form.isActive ? "Visible on website" : "Hidden (draft)"}
            </span>
          </div>

          {/* Actions */}
          <div style={{ display: "flex", gap: 10, marginTop: 20, justifyContent: "flex-end" }}>
            <button onClick={() => setShowForm(false)} style={{ padding: "10px 20px", borderRadius: 10, border: "1px solid rgba(255,255,255,0.12)", background: "transparent", color: "rgba(255,255,255,0.5)", cursor: "pointer", fontFamily: "'DM Sans',sans-serif", fontSize: 14 }}>Cancel</button>
            <button onClick={save} disabled={saving} style={{ display: "flex", alignItems: "center", gap: 8, padding: "10px 24px", borderRadius: 10, background: "linear-gradient(135deg, #1AAFE6, #6B3FA0)", color: "white", border: "none", fontSize: 14, fontFamily: "'Nunito',sans-serif", fontWeight: 700, cursor: saving ? "not-allowed" : "pointer", opacity: saving ? 0.7 : 1 }}>
              {saving ? <><RefreshCw size={14} style={{ animation: "spin-slow 1s linear infinite" }} /> Saving…</> : <><Save size={14} /> {editId ? "Update" : "Add to Website"}</>}
            </button>
          </div>
        </div>
      )}

      {/* List */}
      {loading ? (
        <div style={{ display: "grid", gap: 12 }}>
          {[1, 2, 3].map(i => <div key={i} className="skeleton" style={{ height: 80, borderRadius: 12 }} />)}
        </div>
      ) : items.length === 0 ? (
        <div style={{ ...s, textAlign: "center", padding: "60px 20px" }}>
          <Video size={40} style={{ color: "rgba(255,255,255,0.2)", margin: "0 auto 12px" }} />
          <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 15, color: "rgba(255,255,255,0.4)", marginBottom: 16 }}>No testimonials yet</p>
          <button onClick={openNew} style={{ padding: "10px 24px", borderRadius: 10, background: "linear-gradient(135deg, #1AAFE6, #6B3FA0)", color: "white", border: "none", fontSize: 14, fontFamily: "'Nunito',sans-serif", fontWeight: 700, cursor: "pointer" }}>
            Add First Testimonial
          </button>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {items.map(t => (
            <div key={t.id} style={{ ...s, display: "flex", alignItems: "center", gap: 16, opacity: t.isActive ? 1 : 0.55 }}>
              <GripVertical size={16} style={{ color: "rgba(255,255,255,0.2)", flexShrink: 0 }} />

              {/* Info */}
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                  <span style={{ fontFamily: "'Nunito',sans-serif", fontWeight: 800, fontSize: 15, color: "white" }}>{t.parentName}</span>
                  {t.childAge && <span style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 12, color: "rgba(255,255,255,0.4)" }}>· Child: {t.childAge}</span>}
                  {t.location && <span style={{ display: "flex", alignItems: "center", gap: 3, fontFamily: "'DM Sans',sans-serif", fontSize: 12, color: "rgba(255,255,255,0.4)" }}><MapPin size={10} />{t.location}</span>}
                  <span style={{ padding: "2px 8px", borderRadius: 5, fontSize: 11, fontFamily: "'DM Sans',sans-serif", fontWeight: 600, background: t.isActive ? "rgba(34,197,94,0.15)" : "rgba(255,255,255,0.06)", color: t.isActive ? "#22c55e" : "rgba(255,255,255,0.4)", border: t.isActive ? "1px solid rgba(34,197,94,0.25)" : "1px solid rgba(255,255,255,0.08)" }}>
                    {t.isActive ? "Live" : "Hidden"}
                  </span>
                </div>
                {t.caption && <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 12, color: "rgba(255,255,255,0.4)", margin: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", maxWidth: 420 }}>"{t.caption}"</p>}
                <div style={{ display: "flex", alignItems: "center", gap: 4, marginTop: 4 }}>
                  <Video size={11} style={{ color: "#FF0000" }} />
                  <span style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 11, color: "rgba(255,255,255,0.3)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", maxWidth: 280 }}>{t.videoUrl}</span>
                </div>
              </div>

              {/* Stars preview */}
              <div style={{ display: "flex", gap: 1, flexShrink: 0 }}>
                {[1,2,3,4,5].map(s => <Star key={s} size={11} fill="#F5820D" style={{ color: "#F5820D" }} />)}
              </div>

              {/* Actions */}
              <div style={{ display: "flex", gap: 6, flexShrink: 0 }}>
                <a href={t.videoUrl} target="_blank" rel="noreferrer" title="Open video" style={{ width: 34, height: 34, borderRadius: 8, border: "1px solid rgba(255,255,255,0.1)", background: "transparent", display: "flex", alignItems: "center", justifyContent: "center", textDecoration: "none", cursor: "pointer" }}>
                  <ExternalLink size={14} style={{ color: "rgba(255,255,255,0.4)" }} />
                </a>
                <button onClick={() => toggleActive(t)} title={t.isActive ? "Hide from website" : "Show on website"} style={{ width: 34, height: 34, borderRadius: 8, border: "1px solid rgba(255,255,255,0.1)", background: "transparent", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
                  {t.isActive ? <EyeOff size={14} style={{ color: "#F5820D" }} /> : <Eye size={14} style={{ color: "#22c55e" }} />}
                </button>
                <button onClick={() => openEdit(t)} style={{ width: 34, height: 34, borderRadius: 8, border: "1px solid rgba(255,255,255,0.1)", background: "transparent", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
                  <Edit3 size={14} style={{ color: "#1AAFE6" }} />
                </button>
                <button onClick={() => del(t.id)} style={{ width: 34, height: 34, borderRadius: 8, border: "1px solid rgba(239,68,68,0.2)", background: "rgba(239,68,68,0.06)", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
                  <Trash2 size={14} style={{ color: "#ef4444" }} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
