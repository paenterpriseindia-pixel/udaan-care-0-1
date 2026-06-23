"use client";
import { useEffect, useState } from "react";
import { Plus, Edit2, Trash2, UserCheck, Phone, Mail } from "lucide-react";
import type { User } from "@/lib/db";

export default function DoctorsPage() {
  const [doctors, setDoctors] = useState<Omit<User, "passwordHash">[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ name: "", email: "", phone: "", role: "DOCTOR" as "DOCTOR" | "ADMIN", password: "" });

  const load = () => fetch("/api/admin/users").then(r => r.json()).then(d => {
    setDoctors(Array.isArray(d) ? d.filter((u: User) => u.role !== "PARENT") : []);
    setLoading(false);
  });
  useEffect(() => { load(); }, []);

  const create = async () => {
    if (!form.name || !form.email) { alert("Name and email required."); return; }
    await fetch("/api/admin/users", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
    setShowForm(false);
    setForm({ name: "", email: "", phone: "", role: "DOCTOR", password: "" });
    load();
  };

  const inputStyle: React.CSSProperties = { width: "100%", padding: "10px 12px", borderRadius: 8, background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", color: "white", fontSize: 14, outline: "none", boxSizing: "border-box", fontFamily: "'DM Sans',sans-serif" };

  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 24, flexWrap: "wrap", gap: 12 }}>
        <div>
          <h1 style={{ fontFamily: "'Nunito',sans-serif", fontWeight: 900, fontSize: 26, color: "white", marginBottom: 2 }}>Doctors & Staff</h1>
          <p style={{ fontSize: 13, color: "rgba(255,255,255,0.4)" }}>{doctors.length} staff member{doctors.length !== 1 ? "s" : ""}</p>
        </div>
        <button onClick={() => setShowForm(s => !s)} style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "11px 20px", borderRadius: 10, border: "none", background: "linear-gradient(135deg,#0A7E8C,#6B3FA0)", color: "white", cursor: "pointer", fontSize: 14, fontWeight: 700, fontFamily: "'DM Sans',sans-serif" }}>
          <Plus size={15} /> Add Doctor / Staff
        </button>
      </div>

      {/* Add form */}
      {showForm && (
        <div style={{ background: "rgba(10,126,140,0.06)", border: "1px solid rgba(10,126,140,0.2)", borderRadius: 16, padding: 24, marginBottom: 24 }}>
          <h3 style={{ fontFamily: "'Nunito',sans-serif", fontWeight: 800, fontSize: 16, color: "white", marginBottom: 16 }}>New Staff Account</h3>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <div><label style={{ fontSize: 12, color: "rgba(255,255,255,0.5)", display: "block", marginBottom: 4 }}>Full Name *</label><input style={inputStyle} value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder="Dr. Name Surname" /></div>
            <div><label style={{ fontSize: 12, color: "rgba(255,255,255,0.5)", display: "block", marginBottom: 4 }}>Email *</label><input type="email" style={inputStyle} value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} placeholder="doctor@udaancare.in" /></div>
            <div><label style={{ fontSize: 12, color: "rgba(255,255,255,0.5)", display: "block", marginBottom: 4 }}>Phone</label><input style={inputStyle} value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} placeholder="+91 98765 43210" /></div>
            <div><label style={{ fontSize: 12, color: "rgba(255,255,255,0.5)", display: "block", marginBottom: 4 }}>Role</label>
              <select style={inputStyle} value={form.role} onChange={e => setForm(f => ({ ...f, role: e.target.value as "DOCTOR" | "ADMIN" }))}>
                <option value="DOCTOR">Doctor / Therapist</option>
                <option value="ADMIN">Admin</option>
              </select>
            </div>
            <div><label style={{ fontSize: 12, color: "rgba(255,255,255,0.5)", display: "block", marginBottom: 4 }}>Temporary Password</label><input type="password" style={inputStyle} value={form.password} onChange={e => setForm(f => ({ ...f, password: e.target.value }))} placeholder="Leave blank for 'doctor123'" /></div>
          </div>
          <div style={{ display: "flex", gap: 8, marginTop: 16 }}>
            <button onClick={create} style={{ padding: "9px 18px", borderRadius: 8, border: "none", background: "#0A7E8C", color: "white", cursor: "pointer", fontSize: 13, fontWeight: 700, fontFamily: "'DM Sans',sans-serif" }}>Create Account</button>
            <button onClick={() => setShowForm(false)} style={{ padding: "9px 14px", borderRadius: 8, border: "1px solid rgba(255,255,255,0.1)", background: "transparent", color: "rgba(255,255,255,0.5)", cursor: "pointer", fontSize: 13, fontFamily: "'DM Sans',sans-serif" }}>Cancel</button>
          </div>
          <p style={{ fontSize: 11, color: "rgba(255,255,255,0.3)", marginTop: 10 }}>They can log in at /admin/login with their email and this password.</p>
        </div>
      )}

      {/* Doctor cards */}
      {loading ? (
        <div style={{ textAlign: "center", padding: 40, color: "rgba(255,255,255,0.3)" }}>Loading…</div>
      ) : doctors.length === 0 ? (
        <div style={{ textAlign: "center", padding: 64, background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 16 }}>
          <div style={{ fontSize: 48, marginBottom: 16 }}>👨‍⚕️</div>
          <div style={{ fontSize: 14, color: "rgba(255,255,255,0.4)" }}>No staff accounts yet. Add doctors to let them log in.</div>
        </div>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 16 }}>
          {doctors.map(d => (
            <div key={d.id} style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 16, padding: 20 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 16 }}>
                <div style={{ width: 52, height: 52, borderRadius: "50%", background: d.role === "ADMIN" ? "linear-gradient(135deg,#F5820D,#EF4444)" : "linear-gradient(135deg,#0A7E8C,#6B3FA0)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, fontWeight: 900, color: "white", flexShrink: 0 }}>
                  {d.name.charAt(0)}
                </div>
                <div>
                  <div style={{ fontSize: 15, fontWeight: 700, color: "white" }}>{d.name}</div>
                  <span style={{ fontSize: 11, padding: "2px 8px", borderRadius: 4, background: d.role === "ADMIN" ? "rgba(245,130,13,0.2)" : "rgba(10,126,140,0.2)", color: d.role === "ADMIN" ? "#F5820D" : "#0D9BAC", fontWeight: 700 }}>
                    {d.role}
                  </span>
                </div>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13, color: "rgba(255,255,255,0.5)" }}>
                  <Mail size={12} /> {d.email}
                </div>
                {d.phone && (
                  <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13, color: "rgba(255,255,255,0.5)" }}>
                    <Phone size={12} /> {d.phone}
                  </div>
                )}
              </div>
              <div style={{ marginTop: 14, paddingTop: 14, borderTop: "1px solid rgba(255,255,255,0.06)", fontSize: 12, color: "rgba(255,255,255,0.3)" }}>
                Added {new Date(d.createdAt).toLocaleDateString("en-IN")}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
