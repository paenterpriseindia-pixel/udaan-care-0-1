"use client";
import { useEffect, useState } from "react";
import { Building2, Plus, MapPin, Phone, Users, CheckCircle, XCircle, Edit3 } from "lucide-react";
import type { Branch } from "@/lib/db";

export default function BranchesPage() {
  const [branches, setBranches] = useState<Branch[]>([]);
  const [loading, setLoading]   = useState(true);
  const [adding, setAdding]     = useState(false);
  const [form, setForm]         = useState({ name: "", city: "", address: "", phone: "" });
  const [saving, setSaving]     = useState(false);

  useEffect(() => {
    fetch("/api/admin/branches").then(r => r.json()).then(d => { setBranches(Array.isArray(d) ? d : []); setLoading(false); });
  }, []);

  const createBranch = async () => {
    if (!form.name) return;
    setSaving(true);
    const res = await fetch("/api/admin/branches", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
    const b = await res.json();
    setBranches(prev => [...prev, b]);
    setForm({ name: "", city: "", address: "", phone: "" });
    setAdding(false);
    setSaving(false);
  };

  const toggleActive = async (b: Branch) => {
    await fetch("/api/admin/branches", { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id: b.id, isActive: !b.isActive }) });
    setBranches(prev => prev.map(x => x.id === b.id ? { ...x, isActive: !x.isActive } : x));
  };

  const inp = { background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.12)", borderRadius: 8, color: "white", padding: "10px 12px", fontSize: 14, width: "100%", fontFamily: "'DM Sans',sans-serif", boxSizing: "border-box" as const };

  return (
    <div>
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 28, flexWrap: "wrap" as const, gap: 12 }}>
        <div>
          <h1 style={{ fontFamily: "'Nunito',sans-serif", fontWeight: 900, fontSize: 26, color: "white", marginBottom: 4 }}>Clinic Branches</h1>
          <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 13, color: "rgba(255,255,255,0.4)" }}>
            Manage all clinic locations — franchise-ready. Staff attendance is tracked per branch.
          </p>
        </div>
        <button onClick={() => setAdding(true)} style={{ display: "flex", alignItems: "center", gap: 8, padding: "11px 20px", borderRadius: 10, background: "rgba(26,175,230,0.15)", border: "1px solid rgba(26,175,230,0.3)", color: "#1AAFE6", fontFamily: "'Nunito',sans-serif", fontWeight: 800, fontSize: 14, cursor: "pointer" }}>
          <Plus size={15} /> Add Branch
        </button>
      </div>

      {/* Add form */}
      {adding && (
        <div style={{ background: "rgba(26,175,230,0.06)", border: "1px solid rgba(26,175,230,0.2)", borderRadius: 16, padding: 24, marginBottom: 24 }}>
          <h3 style={{ fontFamily: "'Nunito',sans-serif", fontWeight: 800, fontSize: 16, color: "white", marginBottom: 16 }}>New Branch</h3>
          <div className="grid-responsive-2" style={{ gap: 12, marginBottom: 12 }}>
            <div><label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "rgba(255,255,255,0.5)", marginBottom: 6, fontFamily: "'DM Sans',sans-serif" }}>Branch Name *</label><input style={inp} placeholder="e.g. Bhopal Clinic" value={form.name} onChange={e => setForm(f => ({...f, name: e.target.value}))} /></div>
            <div><label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "rgba(255,255,255,0.5)", marginBottom: 6, fontFamily: "'DM Sans',sans-serif" }}>City</label><input style={inp} placeholder="e.g. Bhopal" value={form.city} onChange={e => setForm(f => ({...f, city: e.target.value}))} /></div>
            <div><label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "rgba(255,255,255,0.5)", marginBottom: 6, fontFamily: "'DM Sans',sans-serif" }}>Address</label><input style={inp} placeholder="Full clinic address" value={form.address} onChange={e => setForm(f => ({...f, address: e.target.value}))} /></div>
            <div><label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "rgba(255,255,255,0.5)", marginBottom: 6, fontFamily: "'DM Sans',sans-serif" }}>Phone</label><input style={inp} placeholder="+91 ..." value={form.phone} onChange={e => setForm(f => ({...f, phone: e.target.value}))} /></div>
          </div>
          <div style={{ display: "flex", gap: 10 }}>
            <button onClick={() => setAdding(false)} style={{ padding: "10px 20px", borderRadius: 8, background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", color: "rgba(255,255,255,0.5)", fontFamily: "'Nunito',sans-serif", fontWeight: 700, cursor: "pointer" }}>Cancel</button>
            <button onClick={createBranch} disabled={!form.name || saving} style={{ padding: "10px 24px", borderRadius: 8, background: "rgba(26,175,230,0.2)", border: "1px solid rgba(26,175,230,0.35)", color: "#1AAFE6", fontFamily: "'Nunito',sans-serif", fontWeight: 800, cursor: form.name ? "pointer" : "not-allowed" }}>
              {saving ? "Saving..." : "Create Branch"}
            </button>
          </div>
        </div>
      )}

      {/* Branch cards */}
      {loading ? (
        <div style={{ textAlign: "center" as const, padding: "60px 0", color: "rgba(255,255,255,0.3)", fontFamily: "'DM Sans',sans-serif" }}>Loading branches...</div>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(340px,1fr))", gap: 16 }}>
          {branches.map(b => (
            <div key={b.id} style={{ background: "rgba(255,255,255,0.04)", border: `1px solid ${b.isActive ? "rgba(255,255,255,0.08)" : "rgba(255,255,255,0.04)"}`, borderRadius: 16, padding: 22, opacity: b.isActive ? 1 : 0.5 }}>
              <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 14 }}>
                <div style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
                  <div style={{ width: 44, height: 44, borderRadius: 12, background: "rgba(26,175,230,0.12)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    <Building2 size={20} style={{ color: "#1AAFE6" }} />
                  </div>
                  <div>
                    <div style={{ fontFamily: "'Nunito',sans-serif", fontWeight: 800, fontSize: 16, color: "white" }}>{b.name}</div>
                    <div style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 12, color: "rgba(255,255,255,0.4)" }}>{b.city}</div>
                  </div>
                </div>
                <span style={{ padding: "3px 10px", borderRadius: 20, fontSize: 11, fontWeight: 700, background: b.isActive ? "rgba(34,197,94,0.12)" : "rgba(239,68,68,0.1)", color: b.isActive ? "#22c55e" : "#EF4444", fontFamily: "'DM Sans',sans-serif" }}>
                  {b.isActive ? "Active" : "Inactive"}
                </span>
              </div>

              {b.address && (
                <div style={{ display: "flex", gap: 6, marginBottom: 6, fontFamily: "'DM Sans',sans-serif", fontSize: 13, color: "rgba(255,255,255,0.5)" }}>
                  <MapPin size={13} style={{ flexShrink: 0, marginTop: 2 }} />
                  {b.address}
                </div>
              )}
              {b.phone && (
                <div style={{ display: "flex", gap: 6, marginBottom: 14, fontFamily: "'DM Sans',sans-serif", fontSize: 13, color: "rgba(255,255,255,0.5)" }}>
                  <Phone size={13} style={{ flexShrink: 0, marginTop: 2 }} />
                  {b.phone}
                </div>
              )}

              <button onClick={() => toggleActive(b)} style={{ width: "100%", padding: "9px", borderRadius: 8, background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", color: b.isActive ? "#EF4444" : "#22c55e", fontFamily: "'DM Sans',sans-serif", fontSize: 12, fontWeight: 600, cursor: "pointer" }}>
                {b.isActive ? "Deactivate Branch" : "Activate Branch"}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
