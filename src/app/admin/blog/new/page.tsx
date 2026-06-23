"use client";
import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Save, Eye, Upload, Bold, Italic, List, Heading2 } from "lucide-react";

const CATEGORIES = ["Occupational Therapy", "Autism & ASD", "ADHD", "Sensory Integration", "Fine Motor Skills", "Gross Motor Skills", "Parent Tips", "Success Stories", "Announcements"];

export default function NewBlogPostPage() {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [preview, setPreview] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);
  const [form, setForm] = useState({
    title: "", slug: "", excerpt: "", content: "",
    category: "Occupational Therapy", coverImage: "",
    published: false,
    authorId: "admin",
  });

  const set = (k: string, v: unknown) => setForm(f => ({ ...f, [k]: v }));

  // Auto-generate slug from title
  const handleTitle = (v: string) => {
    set("title", v);
    if (!form.slug || form.slug === slugify(form.title)) {
      set("slug", slugify(v));
    }
  };

  const slugify = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

  const insertMarkdown = (prefix: string, suffix = "") => {
    const ta = document.getElementById("blog-content") as HTMLTextAreaElement;
    if (!ta) return;
    const start = ta.selectionStart, end = ta.selectionEnd;
    const selected = ta.value.slice(start, end);
    const newVal = ta.value.slice(0, start) + prefix + selected + suffix + ta.value.slice(end);
    set("content", newVal);
  };

  const uploadCover = async (file: File) => {
    const form2 = new FormData();
    form2.append("file", file);
    form2.append("dest", `images/blog/${file.name}`);
    const res = await fetch("/api/upload-image", { method: "POST", body: form2 });
    const { path } = await res.json();
    set("coverImage", path);
  };

  const handleSave = async (publish: boolean) => {
    if (!form.title || !form.content) { alert("Title and content are required."); return; }
    setSaving(true);
    const res = await fetch("/api/admin/blog", {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...form, slug: form.slug || slugify(form.title), published: publish, publishedAt: publish ? new Date().toISOString() : null }),
    });
    const data = await res.json();
    if (res.ok) router.push("/admin/blog");
    setSaving(false);
  };

  const inputStyle: React.CSSProperties = { width: "100%", padding: "11px 14px", borderRadius: 10, background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", color: "white", fontSize: 14, outline: "none", boxSizing: "border-box", fontFamily: "'DM Sans',sans-serif" };

  return (
    <div style={{ maxWidth: 860, margin: "0 auto" }}>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 24, flexWrap: "wrap" }}>
        <Link href="/admin/blog" style={{ display: "flex", alignItems: "center", justifyContent: "center", width: 36, height: 36, borderRadius: 10, background: "rgba(255,255,255,0.06)", color: "rgba(255,255,255,0.6)", textDecoration: "none" }}>
          <ArrowLeft size={16} />
        </Link>
        <h1 style={{ fontFamily: "'Nunito',sans-serif", fontWeight: 900, fontSize: 24, color: "white", flex: 1 }}>New Blog Post</h1>
        <button onClick={() => setPreview(p => !p)} style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "9px 16px", borderRadius: 10, border: "1px solid rgba(255,255,255,0.12)", background: "rgba(255,255,255,0.05)", color: "rgba(255,255,255,0.7)", cursor: "pointer", fontSize: 13, fontWeight: 600, fontFamily: "'DM Sans',sans-serif" }}>
          <Eye size={14} /> {preview ? "Edit" : "Preview"}
        </button>
        <button onClick={() => handleSave(false)} disabled={saving} style={{ padding: "9px 16px", borderRadius: 10, border: "1px solid rgba(255,255,255,0.12)", background: "rgba(255,255,255,0.05)", color: "rgba(255,255,255,0.6)", cursor: "pointer", fontSize: 13, fontWeight: 600, fontFamily: "'DM Sans',sans-serif" }}>
          Save Draft
        </button>
        <button onClick={() => handleSave(true)} disabled={saving} style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "9px 18px", borderRadius: 10, border: "none", background: "linear-gradient(135deg,#0A7E8C,#6B3FA0)", color: "white", cursor: "pointer", fontSize: 13, fontWeight: 700, fontFamily: "'DM Sans',sans-serif" }}>
          <Save size={13} /> {saving ? "Publishing…" : "Publish"}
        </button>
      </div>

      {preview ? (
        <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 16, padding: 32 }}>
          {form.coverImage && <img src={form.coverImage} alt="cover" style={{ width: "100%", maxHeight: 340, objectFit: "cover", borderRadius: 12, marginBottom: 24 }} />}
          <div style={{ fontSize: 12, color: "#0D9BAC", fontWeight: 700, marginBottom: 8 }}>{form.category}</div>
          <h2 style={{ fontFamily: "'Nunito',sans-serif", fontWeight: 900, fontSize: 28, color: "white", marginBottom: 12 }}>{form.title || "Untitled"}</h2>
          <p style={{ color: "rgba(255,255,255,0.5)", marginBottom: 24, fontStyle: "italic" }}>{form.excerpt}</p>
          <div style={{ color: "rgba(255,255,255,0.75)", lineHeight: 1.8, fontSize: 15, whiteSpace: "pre-wrap" }}>{form.content}</div>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {/* Cover image */}
          <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 16, overflow: "hidden", cursor: "pointer" }} onClick={() => fileRef.current?.click()}>
            {form.coverImage ? (
              <div style={{ position: "relative" }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={form.coverImage} alt="cover" style={{ width: "100%", maxHeight: 220, objectFit: "cover" }} />
                <div style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.4)", display: "flex", alignItems: "center", justifyContent: "center", opacity: 0, transition: "opacity 0.2s" }}
                  onMouseEnter={e => (e.currentTarget.style.opacity = "1")}
                  onMouseLeave={e => (e.currentTarget.style.opacity = "0")}
                >
                  <span style={{ color: "white", fontWeight: 700 }}>Click to replace cover image</span>
                </div>
              </div>
            ) : (
              <div style={{ height: 120, display: "flex", alignItems: "center", justifyContent: "center", gap: 10, color: "rgba(255,255,255,0.3)", fontSize: 14 }}>
                <Upload size={18} /> Click to upload cover image
              </div>
            )}
            <input ref={fileRef} type="file" accept="image/*" style={{ display: "none" }} onChange={e => { const f = e.target.files?.[0]; if (f) uploadCover(f); }} />
          </div>

          {/* Title + Category + Slug */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <div style={{ gridColumn: "1/-1" }}>
              <label style={{ fontSize: 13, fontWeight: 600, color: "rgba(255,255,255,0.5)", display: "block", marginBottom: 6 }}>Title *</label>
              <input style={{ ...inputStyle, fontSize: 18, fontWeight: 700 }} value={form.title} onChange={e => handleTitle(e.target.value)} placeholder="Blog post title…" />
            </div>
            <div>
              <label style={{ fontSize: 13, fontWeight: 600, color: "rgba(255,255,255,0.5)", display: "block", marginBottom: 6 }}>Category</label>
              <select style={inputStyle} value={form.category} onChange={e => set("category", e.target.value)}>
                {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label style={{ fontSize: 13, fontWeight: 600, color: "rgba(255,255,255,0.5)", display: "block", marginBottom: 6 }}>URL Slug</label>
              <input style={inputStyle} value={form.slug} onChange={e => set("slug", slugify(e.target.value))} placeholder="url-friendly-title" />
            </div>
          </div>

          {/* Excerpt */}
          <div>
            <label style={{ fontSize: 13, fontWeight: 600, color: "rgba(255,255,255,0.5)", display: "block", marginBottom: 6 }}>Excerpt (shown on blog card)</label>
            <textarea style={{ ...inputStyle, minHeight: 70, resize: "vertical" }} value={form.excerpt} onChange={e => set("excerpt", e.target.value)} placeholder="Short summary shown on the blog listing page…" />
          </div>

          {/* Content editor */}
          <div>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8 }}>
              <label style={{ fontSize: 13, fontWeight: 600, color: "rgba(255,255,255,0.5)" }}>Content * (Markdown supported)</label>
              {/* Formatting toolbar */}
              <div style={{ display: "flex", gap: 4 }}>
                {[
                  { icon: Heading2, action: () => insertMarkdown("## "), title: "Heading" },
                  { icon: Bold, action: () => insertMarkdown("**", "**"), title: "Bold" },
                  { icon: Italic, action: () => insertMarkdown("*", "*"), title: "Italic" },
                  { icon: List, action: () => insertMarkdown("- "), title: "List" },
                ].map(btn => (
                  <button key={btn.title} type="button" onClick={btn.action} title={btn.title} style={{ width: 28, height: 28, borderRadius: 6, border: "1px solid rgba(255,255,255,0.1)", background: "rgba(255,255,255,0.05)", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", color: "rgba(255,255,255,0.5)" }}>
                    <btn.icon size={13} />
                  </button>
                ))}
              </div>
            </div>
            <textarea
              id="blog-content"
              style={{ ...inputStyle, minHeight: 360, resize: "vertical", lineHeight: 1.7 }}
              value={form.content}
              onChange={e => set("content", e.target.value)}
              placeholder={`Start writing your blog post here…\n\n## Section heading\n\nYour paragraph text.\n\n- Bullet point 1\n- Bullet point 2\n\n**Bold text** and *italic text* are supported.`}
            />
          </div>
        </div>
      )}
    </div>
  );
}
