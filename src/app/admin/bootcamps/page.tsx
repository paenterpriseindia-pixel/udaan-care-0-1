"use client";
import { useEffect, useState } from "react";
import { Plus, Edit2, Trash2, Eye, EyeOff, Users, Calendar } from "lucide-react";
import Link from "next/link";
import type { Bootcamp } from "@/lib/db";

export default function BootcampsAdminPage() {
  const [bootcamps, setBootcamps] = useState<Bootcamp[]>([]);
  const [loading, setLoading] = useState(true);

  const load = () => fetch("/api/admin/bootcamps").then(r => r.json()).then(d => { setBootcamps(Array.isArray(d) ? d : []); setLoading(false); });
  useEffect(() => { load(); }, []);

  const togglePublish = async (b: Bootcamp) => {
    await fetch(`/api/admin/bootcamps/${b.id}`, {
      method: "PUT", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isPublished: !b.isPublished }),
    });
    load();
  };

  const deleteBootcamp = async (id: string) => {
    if (!confirm("Delete this bootcamp?")) return;
    await fetch(`/api/admin/bootcamps/${id}`, { method: "DELETE" });
    load();
  };

  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 24, flexWrap: "wrap", gap: 12 }}>
        <div>
          <h1 style={{ fontFamily: "'Nunito',sans-serif", fontWeight: 900, fontSize: 26, color: "white", marginBottom: 2 }}>Bootcamps</h1>
          <p style={{ fontSize: 13, color: "rgba(255,255,255,0.4)" }}>{bootcamps.filter(b => b.isPublished).length} active · {bootcamps.filter(b => !b.isPublished).length} drafts</p>
        </div>
        <Link href="/admin/bootcamps/new" style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "12px 20px", minHeight: 48, borderRadius: 10, border: "none", background: "linear-gradient(135deg,#F5820D,#E06B00)", color: "white", textDecoration: "none", fontSize: 14, fontWeight: 700 }}>
          <Plus size={16} /> New Program
        </Link>
      </div>

      {loading ? (
        <div style={{ textAlign: "center", padding: 48, color: "rgba(255,255,255,0.3)" }}>Loading…</div>
      ) : bootcamps.length === 0 ? (
        <div style={{ textAlign: "center", padding: 64 }}>
          <div style={{ fontSize: 48, marginBottom: 16 }}>🎓</div>
          <div style={{ fontSize: 16, color: "rgba(255,255,255,0.4)", marginBottom: 16 }}>No bootcamps yet.</div>
          <Link href="/admin/bootcamps/new" style={{ fontSize: 14, color: "#F5820D", textDecoration: "none", padding: "12px", display: "inline-block" }}>Create your first program →</Link>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {[...bootcamps].sort((a, b) => new Date(b.eventDate).getTime() - new Date(a.eventDate).getTime()).map(b => (
            <div key={b.id} style={{ background: "rgba(255,255,255,0.03)", border: `1px solid ${b.isPublished ? "rgba(245,130,13,0.3)" : "rgba(255,255,255,0.07)"}`, borderRadius: 14, padding: "16px 20px", display: "flex", flexDirection: "column", gap: 12 }}>
              
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 12 }}>
                <div>
                  <h3 style={{ margin: 0, fontSize: 16, fontWeight: 700, color: "white", fontFamily: "'Nunito',sans-serif" }}>
                    {b.title} {b.isFeatured && <span style={{ fontSize: 10, background: "#F5820D", color: "white", padding: "2px 6px", borderRadius: 4, marginLeft: 8, verticalAlign: "middle" }}>FEATURED</span>}
                  </h3>
                  <div style={{ fontSize: 13, color: "rgba(255,255,255,0.5)", marginTop: 4, display: "flex", alignItems: "center", gap: 6 }}>
                    <Calendar size={12} /> {new Date(b.eventDate).toLocaleDateString()} · {b.startTime}
                  </div>
                </div>
                <div style={{ display: "flex", gap: 6 }}>
                  <button onClick={() => togglePublish(b)} style={{ minWidth: 48, minHeight: 48, background: "rgba(255,255,255,0.05)", border: "none", borderRadius: 8, color: b.isPublished ? "#22C55E" : "rgba(255,255,255,0.4)", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }} aria-label={b.isPublished ? "Unpublish" : "Publish"}>
                    {b.isPublished ? <Eye size={18} /> : <EyeOff size={18} />}
                  </button>
                  <Link href={`/admin/bootcamps/${b.id}`} style={{ minWidth: 48, minHeight: 48, background: "rgba(255,255,255,0.05)", borderRadius: 8, color: "white", display: "flex", alignItems: "center", justifyContent: "center", textDecoration: "none" }} aria-label="Edit">
                    <Edit2 size={18} />
                  </Link>
                  <button onClick={() => deleteBootcamp(b.id)} style={{ minWidth: 48, minHeight: 48, background: "rgba(255,255,255,0.05)", border: "none", borderRadius: 8, color: "#EF4444", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }} aria-label="Delete">
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>

              <div style={{ height: 1, background: "rgba(255,255,255,0.05)" }} />

              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div style={{ fontSize: 13, color: "rgba(255,255,255,0.6)" }}>
                  {b.isFree ? "Free" : `₹${b.priceINR}`} · {b.platform}
                </div>
                <Link href={`/admin/bootcamps/${b.id}/registrations`} style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 13, fontWeight: 600, color: "#0A7E8C", textDecoration: "none", padding: "8px 12px", minHeight: 48, background: "rgba(10,126,140,0.1)", borderRadius: 8 }}>
                  <Users size={14} /> Registrations
                </Link>
              </div>

            </div>
          ))}
        </div>
      )}
    </div>
  );
}
