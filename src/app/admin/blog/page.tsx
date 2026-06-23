"use client";
import { useEffect, useState } from "react";
import { Plus, Edit2, Trash2, Eye, EyeOff, ArrowRight } from "lucide-react";
import Link from "next/link";
import type { BlogPost } from "@/lib/db";

export default function BlogAdminPage() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);

  const load = () => fetch("/api/admin/blog").then(r => r.json()).then(d => { setPosts(Array.isArray(d) ? d : []); setLoading(false); });
  useEffect(() => { load(); }, []);

  const togglePublish = async (post: BlogPost) => {
    await fetch(`/api/admin/blog/${post.id}`, {
      method: "PUT", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ published: !post.published, publishedAt: !post.published ? new Date().toISOString() : null }),
    });
    load();
  };

  const deletePost = async (id: string) => {
    if (!confirm("Delete this post?")) return;
    await fetch(`/api/admin/blog/${id}`, { method: "DELETE" });
    load();
  };

  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 24, flexWrap: "wrap", gap: 12 }}>
        <div>
          <h1 style={{ fontFamily: "'Nunito',sans-serif", fontWeight: 900, fontSize: 26, color: "white", marginBottom: 2 }}>Blog Manager</h1>
          <p style={{ fontSize: 13, color: "rgba(255,255,255,0.4)" }}>{posts.filter(p => p.published).length} published · {posts.filter(p => !p.published).length} drafts</p>
        </div>
        <Link href="/admin/blog/new" style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "11px 20px", borderRadius: 10, border: "none", background: "linear-gradient(135deg,#0A7E8C,#6B3FA0)", color: "white", textDecoration: "none", fontSize: 14, fontWeight: 700 }}>
          <Plus size={15} /> New Post
        </Link>
      </div>

      {loading ? (
        <div style={{ textAlign: "center", padding: 48, color: "rgba(255,255,255,0.3)" }}>Loading…</div>
      ) : posts.length === 0 ? (
        <div style={{ textAlign: "center", padding: 64 }}>
          <div style={{ fontSize: 48, marginBottom: 16 }}>✍️</div>
          <div style={{ fontSize: 16, color: "rgba(255,255,255,0.4)", marginBottom: 16 }}>No blog posts yet.</div>
          <Link href="/admin/blog/new" style={{ fontSize: 14, color: "#0D9BAC", textDecoration: "none" }}>Write your first post →</Link>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {[...posts].sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()).map(post => (
            <div key={post.id} style={{ background: "rgba(255,255,255,0.03)", border: `1px solid ${post.published ? "rgba(34,197,94,0.2)" : "rgba(255,255,255,0.07)"}`, borderRadius: 14, padding: "16px 20px", display: "flex", alignItems: "center", gap: 16 }}>
              {/* Cover thumbnail */}
              {post.coverImage ? (
                <div style={{ width: 64, height: 48, borderRadius: 8, overflow: "hidden", flexShrink: 0 }}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={post.coverImage} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                </div>
              ) : (
                <div style={{ width: 64, height: 48, borderRadius: 8, background: "rgba(107,63,160,0.2)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, fontSize: 22 }}>📝</div>
              )}

              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 15, fontWeight: 700, color: "white", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{post.title}</div>
                <div style={{ fontSize: 12, color: "rgba(255,255,255,0.4)", marginTop: 3 }}>
                  {post.category} · Updated {new Date(post.updatedAt).toLocaleDateString("en-IN")}
                  {post.published && post.publishedAt && ` · Published ${new Date(post.publishedAt).toLocaleDateString("en-IN")}`}
                </div>
              </div>

              {/* Status badge */}
              <span style={{ fontSize: 11, padding: "4px 10px", borderRadius: 6, background: post.published ? "rgba(34,197,94,0.15)" : "rgba(245,130,13,0.15)", color: post.published ? "#22c55e" : "#F5820D", fontWeight: 700, flexShrink: 0 }}>
                {post.published ? "Published" : "Draft"}
              </span>

              {/* Actions */}
              <div style={{ display: "flex", gap: 8, flexShrink: 0 }}>
                <button onClick={() => togglePublish(post)} title={post.published ? "Unpublish" : "Publish"} style={{ width: 32, height: 32, borderRadius: 8, border: "1px solid rgba(255,255,255,0.1)", background: "rgba(255,255,255,0.04)", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", color: "rgba(255,255,255,0.5)" }}>
                  {post.published ? <EyeOff size={14} /> : <Eye size={14} />}
                </button>
                <Link href={`/admin/blog/${post.id}`} title="Edit" style={{ width: 32, height: 32, borderRadius: 8, border: "1px solid rgba(255,255,255,0.1)", background: "rgba(255,255,255,0.04)", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", color: "rgba(255,255,255,0.5)", textDecoration: "none" }}>
                  <Edit2 size={14} />
                </Link>
                <button onClick={() => deletePost(post.id)} title="Delete" style={{ width: 32, height: 32, borderRadius: 8, border: "1px solid rgba(239,68,68,0.2)", background: "rgba(239,68,68,0.05)", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", color: "#f87171" }}>
                  <Trash2 size={14} />
                </button>
                {post.published && (
                  <Link href={`/blog/${post.slug}`} target="_blank" title="View on site" style={{ width: 32, height: 32, borderRadius: 8, border: "1px solid rgba(10,126,140,0.2)", background: "rgba(10,126,140,0.06)", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", color: "#0D9BAC", textDecoration: "none" }}>
                    <ArrowRight size={14} />
                  </Link>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
