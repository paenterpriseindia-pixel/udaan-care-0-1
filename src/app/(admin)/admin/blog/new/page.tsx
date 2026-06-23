"use client";
import { useState, useRef } from "react";
import { Eye, EyeOff, Upload, CheckCircle, ExternalLink } from "lucide-react";
import Link from "next/link";

const CATEGORIES = ["Sensory Integration","Occupational Therapy","Pediatric Development","ADHD","Autism","General"];

function slugify(title: string) {
  return title.toLowerCase().replace(/[^a-z0-9\s]/g, "").replace(/\s+/g, "-").slice(0, 60);
}

function simpleMarkdownPreview(text: string) {
  return text
    .split("\n\n")
    .map((block, i) => {
      if (block.startsWith("## ")) return <h2 key={i} style={{ fontFamily: "var(--font-heading)", fontWeight: 800, fontSize: "1.3rem", color: "var(--text-primary)", margin: "1.5rem 0 0.75rem" }}>{block.slice(3)}</h2>;
      if (block.startsWith("- ")) return <ul key={i} style={{ listStyle: "disc", paddingLeft: "1.5rem", marginBottom: "1rem" }}>{block.split("\n").filter(l => l.startsWith("- ")).map((l, j) => <li key={j} style={{ color: "var(--text-secondary)", marginBottom: "0.3rem" }}>{l.slice(2)}</li>)}</ul>;
      return <p key={i} style={{ color: "var(--text-secondary)", lineHeight: "1.8", marginBottom: "1rem" }} dangerouslySetInnerHTML={{ __html: block.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>") }} />;
    });
}

export default function BlogAdminPage() {
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState(CATEGORIES[0]);
  const [content, setContent] = useState("");
  const [metaDesc, setMetaDesc] = useState("");
  const [coverName, setCoverName] = useState("");
  const [preview, setPreview] = useState(false);
  const [published, setPublished] = useState(false);
  const [publishing, setPublishing] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const slug = slugify(title);
  const metaLen = metaDesc.length;

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) setCoverName(e.target.files[0].name);
  };

  const handlePublish = async () => {
    if (!title || !content) return;
    setPublishing(true);
    await new Promise((r) => setTimeout(r, 1500)); // simulate save
    setPublishing(false);
    setPublished(true);
  };

  if (published) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-5 px-4 pt-20" style={{ background: "var(--bg)" }}>
        <CheckCircle size={64} className="text-green-500" />
        <h1 className="text-2xl font-heading font-black" style={{ color: "var(--text-primary)" }}>Article Published! 🎉</h1>
        <p style={{ color: "var(--text-secondary)" }}>Your article is now live on Udaan Care.</p>
        <div className="flex flex-col sm:flex-row gap-3">
          <Link href={`/blog/${slug}`} className="btn-primary px-6 py-3 flex items-center gap-2">
            <ExternalLink size={16} /> View Live Article
          </Link>
          <button onClick={() => { setPublished(false); setTitle(""); setContent(""); setMetaDesc(""); setCoverName(""); }} className="btn-outline px-6 py-3">
            Write Another Article
          </button>
        </div>
        <Link href="/blog" className="text-sm hover:underline" style={{ color: "var(--text-secondary)" }}>← Back to Blog</Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-20 pb-16" style={{ background: "var(--bg)" }}>
      <div className="max-w-2xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <Link href="/blog" className="text-sm font-body hover:underline mb-3 inline-block" style={{ color: "var(--teal)" }}>← Blog</Link>
          <h1 className="text-2xl font-heading font-black" style={{ color: "var(--text-primary)" }}>✍️ Write New Article</h1>
          <p className="text-sm mt-1" style={{ color: "var(--text-secondary)" }}>Fill in the details below and publish your article in under 2 minutes.</p>
        </div>

        {/* Preview toggle */}
        <div className="flex items-center gap-2 mb-6">
          <button
            onClick={() => setPreview(false)}
            className={`px-4 py-2 rounded-btn text-sm font-heading font-bold transition-all ${!preview ? "bg-[var(--teal)] text-white" : "text-[var(--text-secondary)] hover:bg-[var(--teal-light)]"}`}
          >
            ✏️ Edit
          </button>
          <button
            onClick={() => setPreview(true)}
            className={`px-4 py-2 rounded-btn text-sm font-heading font-bold transition-all flex items-center gap-1.5 ${preview ? "bg-[var(--teal)] text-white" : "text-[var(--text-secondary)] hover:bg-[var(--teal-light)]"}`}
          >
            <Eye size={14} /> Preview
          </button>
        </div>

        {!preview ? (
          <div className="space-y-5">
            {/* Title */}
            <div>
              <label className="block text-sm font-heading font-bold mb-2" style={{ color: "var(--text-primary)" }}>Article Title *</label>
              <input
                className="input text-lg font-heading font-bold"
                style={{ fontSize: "1.1rem" }}
                placeholder="e.g. 5 Signs Your Child Needs OT"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                maxLength={100}
              />
              {title && <p className="text-xs mt-1" style={{ color: "var(--text-secondary)" }}>URL: /blog/{slug}</p>}
            </div>

            {/* Category */}
            <div>
              <label className="block text-sm font-heading font-bold mb-2" style={{ color: "var(--text-primary)" }}>Category *</label>
              <select className="input font-body" value={category} onChange={(e) => setCategory(e.target.value)}>
                {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
              </select>
            </div>

            {/* Cover image */}
            <div>
              <label className="block text-sm font-heading font-bold mb-2" style={{ color: "var(--text-primary)" }}>Cover Image</label>
              <div
                onClick={() => fileRef.current?.click()}
                className="border-2 border-dashed rounded-card p-8 text-center cursor-pointer transition-colors hover:border-[var(--teal)] hover:bg-[var(--teal-light)]"
                style={{ borderColor: "var(--border)" }}
              >
                <Upload size={28} className="mx-auto mb-2" style={{ color: "var(--text-secondary)" }} />
                <p className="text-sm font-body" style={{ color: "var(--text-secondary)" }}>
                  {coverName || "Tap to select image (JPG, PNG, WebP)"}
                </p>
                <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleFile} />
              </div>
            </div>

            {/* Content */}
            <div>
              <label className="block text-sm font-heading font-bold mb-2" style={{ color: "var(--text-primary)" }}>Article Content *</label>
              <div className="text-xs mb-2 p-3 rounded-btn" style={{ background: "var(--teal-light)", color: "var(--teal)" }}>
                💡 Tips: Use <code>##</code> for headings · <code>**bold**</code> for bold · <code>- item</code> for bullet lists · Leave a blank line between paragraphs
              </div>
              <textarea
                className="input font-body resize-none"
                style={{ minHeight: "420px", lineHeight: "1.75", fontFamily: "monospace", fontSize: "14px" }}
                placeholder={`## Introduction\n\nWrite your opening paragraph here...\n\n## Main Section\n\nYour content here...\n\n- Bullet point 1\n- Bullet point 2\n\n## Conclusion\n\nWrap it up here.`}
                value={content}
                onChange={(e) => setContent(e.target.value)}
              />
              <p className="text-xs mt-1 text-right" style={{ color: "var(--text-secondary)" }}>{content.length} characters · ~{Math.max(1, Math.ceil(content.split(" ").length / 200))} min read</p>
            </div>

            {/* Meta description */}
            <div>
              <label className="block text-sm font-heading font-bold mb-2" style={{ color: "var(--text-primary)" }}>
                Meta Description <span style={{ color: "var(--text-secondary)", fontWeight: 400 }}>(for Google search)</span>
              </label>
              <textarea
                className="input font-body resize-none"
                style={{ minHeight: "80px" }}
                placeholder="A short, compelling description that appears in Google search results. Keep it under 155 characters."
                maxLength={155}
                value={metaDesc}
                onChange={(e) => setMetaDesc(e.target.value)}
              />
              <p className="text-xs mt-1 text-right" style={{ color: metaLen > 140 ? "var(--orange)" : "var(--text-secondary)" }}>{metaLen}/155</p>
            </div>

            {/* Publish button */}
            <button
              onClick={handlePublish}
              disabled={!title || !content || publishing}
              className="btn-primary w-full py-4 text-base disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:transform-none"
            >
              {publishing ? "⏳ Publishing..." : "🚀 Publish Article"}
            </button>
            {(!title || !content) && <p className="text-xs text-center" style={{ color: "var(--text-secondary)" }}>Title and Content are required to publish.</p>}
          </div>
        ) : (
          /* Preview mode */
          <div className="card p-6 md:p-8">
            <div className="text-center mb-6">
              <span className="badge badge-teal">{category}</span>
              <h1 className="text-2xl md:text-3xl font-heading font-black mt-4 mb-2" style={{ color: "var(--text-primary)" }}>
                {title || "Your Article Title"}
              </h1>
              <div className="flex items-center justify-center gap-3 text-sm" style={{ color: "var(--text-secondary)" }}>
                <span>Dr. Prasoon Gupta</span>
                <span>·</span>
                <span>{new Date().toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}</span>
                <span>·</span>
                <span>~{Math.max(1, Math.ceil((content.split(" ").length || 1) / 200))} min read</span>
              </div>
            </div>

            {coverName && (
              <div className="h-40 rounded-card flex items-center justify-center mb-6 text-sm" style={{ background: "var(--teal-light)", color: "var(--teal)" }}>
                📸 {coverName}
              </div>
            )}

            <div className="prose-udaan">
              {content ? simpleMarkdownPreview(content) : <p style={{ color: "var(--text-secondary)", fontStyle: "italic" }}>Start writing in the Edit tab to see a preview here...</p>}
            </div>

            {metaDesc && (
              <div className="mt-8 p-4 rounded-btn" style={{ background: "var(--bg)", border: "1px solid var(--border)" }}>
                <p className="text-xs font-heading font-bold mb-1" style={{ color: "var(--text-secondary)" }}>Google Preview:</p>
                <p className="text-sm font-heading font-bold" style={{ color: "#1a0dab" }}>{title}</p>
                <p className="text-xs" style={{ color: "#006621" }}>udaancare.in/blog/{slug}</p>
                <p className="text-xs" style={{ color: "#545454" }}>{metaDesc}</p>
              </div>
            )}

            <button onClick={() => setPreview(false)} className="btn-outline w-full mt-6 flex items-center justify-center gap-2">
              <EyeOff size={15} /> Back to Edit
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
