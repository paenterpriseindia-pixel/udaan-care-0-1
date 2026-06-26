"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Save, User, Phone, Mail, Calendar, Stethoscope, KeyRound, RefreshCw } from "lucide-react";

const DIAGNOSES = ["ASD (Autism)", "ADHD", "Sensory Processing Disorder", "Cerebral Palsy", "Down Syndrome", "Developmental Delay", "Fine Motor Delay", "Gross Motor Delay", "Speech Delay", "Intellectual Disability", "Other"];

function randomPin() { return String(Math.floor(1000 + Math.random() * 9000)); }

export default function NewPatientPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    name: "", dob: "", gender: "M" as "M" | "F" | "Other",
    diagnoses: [] as string[],
    guardianName: "", guardianPhone: "", guardianEmail: "",
    guardianPin: randomPin(),
    status: "ACTIVE" as "ACTIVE" | "COMPLETED" | "ON_HOLD",
    notes: "",
  });

  const set = (k: string, v: unknown) => setForm(f => ({ ...f, [k]: v }));
  const toggleDiag = (d: string) => set("diagnoses", form.diagnoses.includes(d) ? form.diagnoses.filter(x => x !== d) : [...form.diagnoses, d]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.guardianName || !form.guardianPhone) { setError("Name, guardian name and phone are required."); return; }
    if (form.guardianPin.length !== 4) { setError("PIN must be exactly 4 digits."); return; }
    setLoading(true); setError("");
    const res = await fetch("/api/admin/patients", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
    const data = await res.json();
    if (res.ok) {
      router.push(`/admin/patients/${data.id}`);
    } else {
      setError(data.error ?? "Failed to create patient.");
      setLoading(false);
    }
  };

  const inputStyle: React.CSSProperties = { width: "100%", padding: "11px 14px", borderRadius: 10, background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", color: "white", fontSize: 14, outline: "none", boxSizing: "border-box", fontFamily: "'DM Sans',sans-serif" };
  const labelStyle: React.CSSProperties = { fontSize: 13, fontWeight: 600, color: "rgba(255,255,255,0.6)", display: "block", marginBottom: 6 };

  return (
    <div style={{ maxWidth: 760, margin: "0 auto" }}>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 28 }}>
        <Link href="/admin/patients" style={{ display: "flex", alignItems: "center", justifyContent: "center", width: 36, height: 36, borderRadius: 10, background: "rgba(255,255,255,0.06)", color: "rgba(255,255,255,0.6)", textDecoration: "none" }}>
          <ArrowLeft size={16} />
        </Link>
        <div>
          <h1 style={{ fontFamily: "'Nunito',sans-serif", fontWeight: 900, fontSize: 24, color: "white", marginBottom: 2 }}>Onboard New Patient</h1>
          <p style={{ fontSize: 13, color: "rgba(255,255,255,0.4)" }}>A unique ID will be auto-generated</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 20 }}>

        {/* Child info */}
        <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 16, padding: 24 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 20 }}>
            <User size={16} style={{ color: "#0A7E8C" }} />
            <h2 style={{ fontFamily: "'Nunito',sans-serif", fontWeight: 800, fontSize: 16, color: "white" }}>Child Information</h2>
          </div>
          <div className="grid-responsive-2" style={{ gap: 16 }}>
            <div style={{ gridColumn: "1/-1" }}>
              <label style={labelStyle}>Child's Full Name *</label>
              <input style={inputStyle} value={form.name} onChange={e => set("name", e.target.value)} placeholder="e.g. Arjun Sharma" required />
            </div>
            <div>
              <label style={labelStyle}>Date of Birth</label>
              <input type="date" style={inputStyle} value={form.dob} onChange={e => set("dob", e.target.value)} />
            </div>
            <div>
              <label style={labelStyle}>Gender</label>
              <select style={inputStyle} value={form.gender} onChange={e => set("gender", e.target.value)}>
                <option value="M">Male</option>
                <option value="F">Female</option>
                <option value="Other">Other / Not specified</option>
              </select>
            </div>
          </div>
        </div>

        {/* Diagnoses */}
        <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 16, padding: 24 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
            <Stethoscope size={16} style={{ color: "#6B3FA0" }} />
            <h2 style={{ fontFamily: "'Nunito',sans-serif", fontWeight: 800, fontSize: 16, color: "white" }}>Diagnoses / Conditions</h2>
          </div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
            {DIAGNOSES.map(d => {
              const sel = form.diagnoses.includes(d);
              return (
                <button key={d} type="button" onClick={() => toggleDiag(d)} style={{
                  padding: "7px 14px", borderRadius: 20, border: `1px solid ${sel ? "#6B3FA0" : "rgba(255,255,255,0.12)"}`,
                  background: sel ? "rgba(107,63,160,0.25)" : "transparent",
                  color: sel ? "#C084FC" : "rgba(255,255,255,0.5)", fontSize: 13, fontWeight: sel ? 700 : 400, cursor: "pointer", transition: "all 0.15s",
                  fontFamily: "'DM Sans',sans-serif",
                }}>
                  {sel ? "✓ " : ""}{d}
                </button>
              );
            })}
          </div>
        </div>

        {/* Guardian info */}
        <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 16, padding: 24 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 20 }}>
            <Phone size={16} style={{ color: "#F5820D" }} />
            <h2 style={{ fontFamily: "'Nunito',sans-serif", fontWeight: 800, fontSize: 16, color: "white" }}>Parent / Guardian</h2>
          </div>
          <div className="grid-responsive-2" style={{ gap: 16 }}>
            <div>
              <label style={labelStyle}>Guardian Name *</label>
              <input style={inputStyle} value={form.guardianName} onChange={e => set("guardianName", e.target.value)} placeholder="Father / Mother name" required />
            </div>
            <div>
              <label style={labelStyle}>Phone Number *</label>
              <input style={inputStyle} value={form.guardianPhone} onChange={e => set("guardianPhone", e.target.value)} placeholder="+91 98765 43210" required />
            </div>
            <div>
              <label style={labelStyle}>Email (optional)</label>
              <input type="email" style={inputStyle} value={form.guardianEmail} onChange={e => set("guardianEmail", e.target.value)} placeholder="parent@email.com" />
            </div>
            <div>
              <label style={labelStyle}>Portal PIN (4 digits — parent uses this to login)</label>
              <div style={{ display: "flex", gap: 8 }}>
                <input style={{ ...inputStyle, letterSpacing: "0.3em", fontSize: 18, fontWeight: 700, flex: 1 }} value={form.guardianPin} onChange={e => set("guardianPin", e.target.value.replace(/\D/g, "").slice(0, 4))} maxLength={4} placeholder="1234" />
                <button type="button" onClick={() => set("guardianPin", randomPin())} title="Generate new PIN"
                  style={{ padding: "0 14px", borderRadius: 10, background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", cursor: "pointer", color: "rgba(255,255,255,0.5)", display: "flex", alignItems: "center" }}>
                  <RefreshCw size={14} />
                </button>
              </div>
              <p style={{ fontSize: 11, color: "rgba(255,255,255,0.3)", marginTop: 4 }}>Share this PIN with the parent so they can log into the portal</p>
            </div>
          </div>
        </div>

        {/* Notes & Status */}
        <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 16, padding: 24 }}>
          <div className="grid-responsive-2" style={{ gap: 16 }}>
            <div>
              <label style={labelStyle}>Status</label>
              <select style={inputStyle} value={form.status} onChange={e => set("status", e.target.value)}>
                <option value="ACTIVE">Active</option>
                <option value="ON_HOLD">On Hold</option>
                <option value="COMPLETED">Completed</option>
              </select>
            </div>
          </div>
          <div style={{ marginTop: 16 }}>
            <label style={labelStyle}>Initial Notes / Referral Reason</label>
            <textarea style={{ ...inputStyle, minHeight: 100, resize: "vertical" }} value={form.notes} onChange={e => set("notes", e.target.value)} placeholder="Initial assessment notes, referral reason, parent concerns…" />
          </div>
        </div>

        {error && <div style={{ padding: "12px 16px", borderRadius: 10, background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.25)", color: "#f87171", fontSize: 14 }}>{error}</div>}

        {/* Submit */}
        <div style={{ display: "flex", gap: 12, justifyContent: "flex-end" }}>
          <Link href="/admin/patients" style={{ padding: "12px 20px", borderRadius: 10, border: "1px solid rgba(255,255,255,0.12)", color: "rgba(255,255,255,0.6)", textDecoration: "none", fontSize: 14, fontWeight: 600 }}>Cancel</Link>
          <button type="submit" disabled={loading} style={{
            display: "inline-flex", alignItems: "center", gap: 8, padding: "12px 24px", borderRadius: 10, border: "none", cursor: loading ? "not-allowed" : "pointer",
            background: "linear-gradient(135deg,#0A7E8C,#6B3FA0)", color: "white", fontSize: 14, fontWeight: 700, fontFamily: "'DM Sans',sans-serif",
          }}>
            {loading ? <><div style={{ width: 16, height: 16, border: "2px solid rgba(255,255,255,0.3)", borderTop: "2px solid white", borderRadius: "50%", animation: "spin 0.7s linear infinite" }} />Saving…</> : <><Save size={15} />Create Patient</>}
          </button>
        </div>
      </form>
      <style>{`@keyframes spin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}`}</style>
    </div>
  );
}
