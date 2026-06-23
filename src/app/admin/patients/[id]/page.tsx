"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Edit2, Save, X, Plus, Check, Clock, Target, FileText, Calendar, Phone, Mail, Clipboard } from "lucide-react";
import type { Patient, Session, Goal, Booking } from "@/lib/db";

interface PatientData { patient: Patient; sessions: Session[]; goals: Goal[]; bookings: Booking[]; }

const TABS = ["Overview", "Sessions", "Goals", "Bookings", "Notes"] as const;
type Tab = typeof TABS[number];

export default function PatientDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [data, setData] = useState<PatientData | null>(null);
  const [activeTab, setActiveTab] = useState<Tab>("Overview");
  const [editMode, setEditMode] = useState(false);
  const [editForm, setEditForm] = useState<Partial<Patient>>({});
  const [saving, setSaving] = useState(false);
  const [copied, setCopied] = useState(false);

  // Add session state
  const [showAddSession, setShowAddSession] = useState(false);
  const [sessionForm, setSessionForm] = useState({ date: new Date().toISOString().split("T")[0], durationMins: 45, type: "CLINIC" as "CLINIC" | "ONLINE", notes: "", goalsAddressed: [] as string[] });

  // Add goal state
  const [showAddGoal, setShowAddGoal] = useState(false);
  const [goalForm, setGoalForm] = useState({ title: "", description: "", targetDate: "" });

  const load = async () => {
    const r = await fetch(`/api/admin/patients/${id}`);
    if (r.ok) { const d = await r.json(); setData(d); setEditForm(d.patient); }
  };
  useEffect(() => { load(); }, [id]);

  const saveEdit = async () => {
    setSaving(true);
    await fetch(`/api/admin/patients/${id}`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(editForm) });
    await load(); setSaving(false); setEditMode(false);
  };

  const addSession = async () => {
    await fetch("/api/admin/sessions", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ ...sessionForm, patientId: id, doctorId: "admin" }) });
    setShowAddSession(false); setSessionForm({ date: new Date().toISOString().split("T")[0], durationMins: 45, type: "CLINIC", notes: "", goalsAddressed: [] });
    load();
  };

  const addGoal = async () => {
    await fetch("/api/admin/goals", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ ...goalForm, patientId: id }) });
    setShowAddGoal(false); setGoalForm({ title: "", description: "", targetDate: "" });
    load();
  };

  const markGoal = async (goalId: string, achieved: boolean) => {
    await fetch("/api/admin/goals", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id: goalId, achievedAt: achieved ? new Date().toISOString() : null }) });
    load();
  };

  const copyPin = () => {
    if (data?.patient.guardianPin) { navigator.clipboard.writeText(data.patient.guardianPin); setCopied(true); setTimeout(() => setCopied(false), 2000); }
  };

  if (!data) return <div style={{ color: "rgba(255,255,255,0.4)", textAlign: "center", paddingTop: 80, fontSize: 16 }}>Loading patient…</div>;

  const { patient, sessions, goals, bookings } = data;
  const inputStyle: React.CSSProperties = { width: "100%", padding: "9px 12px", borderRadius: 8, background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.12)", color: "white", fontSize: 14, outline: "none", boxSizing: "border-box", fontFamily: "'DM Sans',sans-serif" };

  return (
    <div>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "flex-start", gap: 16, marginBottom: 28, flexWrap: "wrap" }}>
        <Link href="/admin/patients" style={{ display: "flex", alignItems: "center", justifyContent: "center", width: 36, height: 36, borderRadius: 10, background: "rgba(255,255,255,0.06)", color: "rgba(255,255,255,0.6)", textDecoration: "none", flexShrink: 0, marginTop: 4 }}>
          <ArrowLeft size={16} />
        </Link>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
            <div style={{ width: 52, height: 52, borderRadius: "50%", background: "linear-gradient(135deg,#0A7E8C,#6B3FA0)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22, fontWeight: 900, color: "white", flexShrink: 0 }}>
              {patient.name.charAt(0)}
            </div>
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <h1 style={{ fontFamily: "'Nunito',sans-serif", fontWeight: 900, fontSize: 24, color: "white" }}>{patient.name}</h1>
                <span style={{ fontSize: 12, padding: "4px 10px", borderRadius: 6, background: patient.status === "ACTIVE" ? "rgba(34,197,94,0.15)" : "rgba(255,255,255,0.08)", color: patient.status === "ACTIVE" ? "#22c55e" : "rgba(255,255,255,0.5)", fontWeight: 700 }}>{patient.status}</span>
              </div>
              <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
                <span style={{ fontSize: 13, color: "#0D9BAC", fontWeight: 700 }}>{patient.uniqueId}</span>
                <span style={{ fontSize: 13, color: "rgba(255,255,255,0.4)" }}>{patient.gender} · {patient.dob ? `${new Date().getFullYear() - new Date(patient.dob).getFullYear()} yrs` : "—"}</span>
                {/* Portal PIN */}
                <button onClick={copyPin} style={{ display: "inline-flex", alignItems: "center", gap: 5, fontSize: 12, color: "rgba(255,255,255,0.45)", background: "none", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 6, padding: "2px 8px", cursor: "pointer", fontFamily: "'DM Sans',sans-serif" }}>
                  <Clipboard size={11} /> PIN: {patient.guardianPin} {copied ? "✓" : ""}
                </button>
              </div>
            </div>
          </div>
        </div>
        {/* Edit button */}
        {!editMode ? (
          <button onClick={() => setEditMode(true)} style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "9px 16px", borderRadius: 10, border: "1px solid rgba(255,255,255,0.12)", background: "rgba(255,255,255,0.05)", color: "rgba(255,255,255,0.7)", cursor: "pointer", fontSize: 13, fontWeight: 600, fontFamily: "'DM Sans',sans-serif" }}>
            <Edit2 size={13} /> Edit
          </button>
        ) : (
          <div style={{ display: "flex", gap: 8 }}>
            <button onClick={() => setEditMode(false)} style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "9px 14px", borderRadius: 10, border: "1px solid rgba(255,255,255,0.1)", background: "transparent", color: "rgba(255,255,255,0.5)", cursor: "pointer", fontSize: 13, fontFamily: "'DM Sans',sans-serif" }}>
              <X size={13} /> Cancel
            </button>
            <button onClick={saveEdit} disabled={saving} style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "9px 16px", borderRadius: 10, border: "none", background: "#0A7E8C", color: "white", cursor: "pointer", fontSize: 13, fontWeight: 700, fontFamily: "'DM Sans',sans-serif" }}>
              <Save size={13} /> {saving ? "Saving…" : "Save"}
            </button>
          </div>
        )}
      </div>

      {/* Tabs */}
      <div style={{ display: "flex", gap: 0, borderBottom: "1px solid rgba(255,255,255,0.08)", marginBottom: 24 }}>
        {TABS.map(tab => (
          <button key={tab} onClick={() => setActiveTab(tab)} style={{
            padding: "10px 18px", background: "none", border: "none", cursor: "pointer", fontSize: 14, fontWeight: activeTab === tab ? 700 : 500,
            color: activeTab === tab ? "white" : "rgba(255,255,255,0.45)",
            borderBottom: `2px solid ${activeTab === tab ? "#0A7E8C" : "transparent"}`,
            transition: "all 0.15s", fontFamily: "'DM Sans',sans-serif",
          }}>{tab}</button>
        ))}
      </div>

      {/* ── OVERVIEW ── */}
      {activeTab === "Overview" && (
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
          {/* Patient details card */}
          <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 16, padding: 20 }}>
            <h3 style={{ fontFamily: "'Nunito',sans-serif", fontWeight: 800, fontSize: 15, color: "white", marginBottom: 16 }}>Child Details</h3>
            {editMode ? (
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                <div><label style={{ fontSize: 12, color: "rgba(255,255,255,0.5)", display: "block", marginBottom: 4 }}>Name</label><input style={inputStyle} value={editForm.name ?? ""} onChange={e => setEditForm(f => ({ ...f, name: e.target.value }))} /></div>
                <div><label style={{ fontSize: 12, color: "rgba(255,255,255,0.5)", display: "block", marginBottom: 4 }}>DOB</label><input type="date" style={inputStyle} value={editForm.dob ?? ""} onChange={e => setEditForm(f => ({ ...f, dob: e.target.value }))} /></div>
                <div><label style={{ fontSize: 12, color: "rgba(255,255,255,0.5)", display: "block", marginBottom: 4 }}>Status</label>
                  <select style={inputStyle} value={editForm.status ?? "ACTIVE"} onChange={e => setEditForm(f => ({ ...f, status: e.target.value as Patient["status"] }))}>
                    <option value="ACTIVE">Active</option><option value="ON_HOLD">On Hold</option><option value="COMPLETED">Completed</option>
                  </select>
                </div>
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {[
                  ["Date of Birth", patient.dob ? new Date(patient.dob).toLocaleDateString("en-IN") : "—"],
                  ["Age", patient.dob ? `${new Date().getFullYear() - new Date(patient.dob).getFullYear()} years` : "—"],
                  ["Gender", patient.gender === "M" ? "Male" : patient.gender === "F" ? "Female" : "Other"],
                  ["Diagnoses", patient.diagnoses?.join(", ") || "—"],
                  ["Total Sessions", `${sessions.length}`],
                ].map(([k, v]) => (
                  <div key={k} style={{ display: "flex", gap: 8 }}>
                    <span style={{ fontSize: 12, color: "rgba(255,255,255,0.4)", width: 110, flexShrink: 0 }}>{k}</span>
                    <span style={{ fontSize: 13, color: "white" }}>{v}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Guardian card */}
          <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 16, padding: 20 }}>
            <h3 style={{ fontFamily: "'Nunito',sans-serif", fontWeight: 800, fontSize: 15, color: "white", marginBottom: 16 }}>Parent / Guardian</h3>
            {editMode ? (
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                <div><label style={{ fontSize: 12, color: "rgba(255,255,255,0.5)", display: "block", marginBottom: 4 }}>Guardian Name</label><input style={inputStyle} value={editForm.guardianName ?? ""} onChange={e => setEditForm(f => ({ ...f, guardianName: e.target.value }))} /></div>
                <div><label style={{ fontSize: 12, color: "rgba(255,255,255,0.5)", display: "block", marginBottom: 4 }}>Phone</label><input style={inputStyle} value={editForm.guardianPhone ?? ""} onChange={e => setEditForm(f => ({ ...f, guardianPhone: e.target.value }))} /></div>
                <div><label style={{ fontSize: 12, color: "rgba(255,255,255,0.5)", display: "block", marginBottom: 4 }}>Email</label><input type="email" style={inputStyle} value={editForm.guardianEmail ?? ""} onChange={e => setEditForm(f => ({ ...f, guardianEmail: e.target.value }))} /></div>
                <div><label style={{ fontSize: 12, color: "rgba(255,255,255,0.5)", display: "block", marginBottom: 4 }}>Portal PIN</label><input style={inputStyle} value={editForm.guardianPin ?? ""} onChange={e => setEditForm(f => ({ ...f, guardianPin: e.target.value.replace(/\D/g,"").slice(0,4) }))} maxLength={4} /></div>
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {[
                  ["Name", patient.guardianName],
                  ["Phone", patient.guardianPhone],
                  ["Email", patient.guardianEmail || "—"],
                  ["Portal PIN", patient.guardianPin],
                ].map(([k, v]) => (
                  <div key={k} style={{ display: "flex", gap: 8 }}>
                    <span style={{ fontSize: 12, color: "rgba(255,255,255,0.4)", width: 80, flexShrink: 0 }}>{k}</span>
                    <span style={{ fontSize: 13, color: "white" }}>{v}</span>
                  </div>
                ))}
                <div style={{ marginTop: 8, display: "flex", gap: 8 }}>
                  <a href={`tel:${patient.guardianPhone}`} style={{ display: "inline-flex", alignItems: "center", gap: 5, fontSize: 12, padding: "6px 12px", borderRadius: 8, background: "rgba(10,126,140,0.15)", color: "#0D9BAC", textDecoration: "none" }}>
                    <Phone size={11} /> Call
                  </a>
                  <a href={`https://wa.me/${patient.guardianPhone.replace(/\D/g,"")}`} target="_blank" rel="noopener noreferrer" style={{ display: "inline-flex", alignItems: "center", gap: 5, fontSize: 12, padding: "6px 12px", borderRadius: 8, background: "rgba(37,211,102,0.1)", color: "#25D366", textDecoration: "none" }}>
                    WhatsApp
                  </a>
                </div>
              </div>
            )}
          </div>

          {/* Notes */}
          <div style={{ gridColumn: "1/-1", background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 16, padding: 20 }}>
            <h3 style={{ fontFamily: "'Nunito',sans-serif", fontWeight: 800, fontSize: 15, color: "white", marginBottom: 12 }}>Clinical Notes</h3>
            {editMode ? (
              <textarea style={{ ...inputStyle, minHeight: 100, resize: "vertical" }} value={editForm.notes ?? ""} onChange={e => setEditForm(f => ({ ...f, notes: e.target.value }))} placeholder="Clinical notes, observations, referral reason…" />
            ) : (
              <p style={{ fontSize: 14, color: "rgba(255,255,255,0.6)", lineHeight: 1.6 }}>{patient.notes || "No notes added yet."}</p>
            )}
          </div>
        </div>
      )}

      {/* ── SESSIONS ── */}
      {activeTab === "Sessions" && (
        <div>
          <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 16 }}>
            <button onClick={() => setShowAddSession(true)} style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "10px 18px", borderRadius: 10, border: "none", background: "linear-gradient(135deg,#0A7E8C,#6B3FA0)", color: "white", cursor: "pointer", fontSize: 14, fontWeight: 700, fontFamily: "'DM Sans',sans-serif" }}>
              <Plus size={14} /> Add Session
            </button>
          </div>

          {showAddSession && (
            <div style={{ background: "rgba(10,126,140,0.08)", border: "1px solid rgba(10,126,140,0.25)", borderRadius: 16, padding: 20, marginBottom: 16 }}>
              <h3 style={{ fontFamily: "'Nunito',sans-serif", fontWeight: 800, fontSize: 15, color: "white", marginBottom: 16 }}>Add Session Note</h3>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12, marginBottom: 12 }}>
                <div><label style={{ fontSize: 12, color: "rgba(255,255,255,0.5)", display: "block", marginBottom: 4 }}>Date</label><input type="date" style={inputStyle} value={sessionForm.date} onChange={e => setSessionForm(f => ({ ...f, date: e.target.value }))} /></div>
                <div><label style={{ fontSize: 12, color: "rgba(255,255,255,0.5)", display: "block", marginBottom: 4 }}>Duration (mins)</label><input type="number" style={inputStyle} value={sessionForm.durationMins} onChange={e => setSessionForm(f => ({ ...f, durationMins: +e.target.value }))} /></div>
                <div><label style={{ fontSize: 12, color: "rgba(255,255,255,0.5)", display: "block", marginBottom: 4 }}>Type</label>
                  <select style={inputStyle} value={sessionForm.type} onChange={e => setSessionForm(f => ({ ...f, type: e.target.value as "CLINIC" | "ONLINE" }))}>
                    <option value="CLINIC">In-Clinic</option><option value="ONLINE">Online</option>
                  </select>
                </div>
              </div>
              <div style={{ marginBottom: 12 }}><label style={{ fontSize: 12, color: "rgba(255,255,255,0.5)", display: "block", marginBottom: 4 }}>Session Notes</label><textarea style={{ ...inputStyle, minHeight: 80, resize: "vertical" }} value={sessionForm.notes} onChange={e => setSessionForm(f => ({ ...f, notes: e.target.value }))} placeholder="What was worked on, observations, progress made…" /></div>
              <div style={{ display: "flex", gap: 8 }}>
                <button onClick={addSession} style={{ padding: "8px 16px", borderRadius: 8, border: "none", background: "#0A7E8C", color: "white", cursor: "pointer", fontSize: 13, fontWeight: 700, fontFamily: "'DM Sans',sans-serif" }}>Save Session</button>
                <button onClick={() => setShowAddSession(false)} style={{ padding: "8px 14px", borderRadius: 8, border: "1px solid rgba(255,255,255,0.1)", background: "transparent", color: "rgba(255,255,255,0.5)", cursor: "pointer", fontSize: 13, fontFamily: "'DM Sans',sans-serif" }}>Cancel</button>
              </div>
            </div>
          )}

          {sessions.length === 0 ? (
            <div style={{ textAlign: "center", padding: "48px 0", color: "rgba(255,255,255,0.3)", fontSize: 14 }}>No sessions recorded yet.</div>
          ) : [...sessions].sort((a, b) => b.date.localeCompare(a.date)).map(s => (
            <div key={s.id} style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 12, padding: 16, marginBottom: 10 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 8 }}>
                <div style={{ width: 36, height: 36, borderRadius: 10, background: s.type === "ONLINE" ? "rgba(107,63,160,0.2)" : "rgba(10,126,140,0.2)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <Clock size={15} style={{ color: s.type === "ONLINE" ? "#9B59B6" : "#0A7E8C" }} />
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 14, fontWeight: 600, color: "white" }}>{new Date(s.date).toLocaleDateString("en-IN", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}</div>
                  <div style={{ fontSize: 12, color: "rgba(255,255,255,0.4)" }}>{s.durationMins} mins · {s.type}</div>
                </div>
              </div>
              {s.notes && <p style={{ fontSize: 13, color: "rgba(255,255,255,0.6)", lineHeight: 1.6, paddingLeft: 48 }}>{s.notes}</p>}
            </div>
          ))}
        </div>
      )}

      {/* ── GOALS ── */}
      {activeTab === "Goals" && (
        <div>
          <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 16 }}>
            <button onClick={() => setShowAddGoal(true)} style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "10px 18px", borderRadius: 10, border: "none", background: "linear-gradient(135deg,#0A7E8C,#6B3FA0)", color: "white", cursor: "pointer", fontSize: 14, fontWeight: 700, fontFamily: "'DM Sans',sans-serif" }}>
              <Target size={14} /> Add Goal
            </button>
          </div>

          {showAddGoal && (
            <div style={{ background: "rgba(107,63,160,0.08)", border: "1px solid rgba(107,63,160,0.25)", borderRadius: 16, padding: 20, marginBottom: 16 }}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 12 }}>
                <div style={{ gridColumn: "1/-1" }}><label style={{ fontSize: 12, color: "rgba(255,255,255,0.5)", display: "block", marginBottom: 4 }}>Goal Title *</label><input style={inputStyle} value={goalForm.title} onChange={e => setGoalForm(f => ({ ...f, title: e.target.value }))} placeholder="e.g. Hold pencil correctly for 5 mins" /></div>
                <div style={{ gridColumn: "1/-1" }}><label style={{ fontSize: 12, color: "rgba(255,255,255,0.5)", display: "block", marginBottom: 4 }}>Description</label><textarea style={{ ...inputStyle, minHeight: 60, resize: "vertical" }} value={goalForm.description} onChange={e => setGoalForm(f => ({ ...f, description: e.target.value }))} /></div>
                <div><label style={{ fontSize: 12, color: "rgba(255,255,255,0.5)", display: "block", marginBottom: 4 }}>Target Date</label><input type="date" style={inputStyle} value={goalForm.targetDate} onChange={e => setGoalForm(f => ({ ...f, targetDate: e.target.value }))} /></div>
              </div>
              <div style={{ display: "flex", gap: 8 }}>
                <button onClick={addGoal} style={{ padding: "8px 16px", borderRadius: 8, border: "none", background: "#6B3FA0", color: "white", cursor: "pointer", fontSize: 13, fontWeight: 700, fontFamily: "'DM Sans',sans-serif" }}>Save Goal</button>
                <button onClick={() => setShowAddGoal(false)} style={{ padding: "8px 14px", borderRadius: 8, border: "1px solid rgba(255,255,255,0.1)", background: "transparent", color: "rgba(255,255,255,0.5)", cursor: "pointer", fontSize: 13, fontFamily: "'DM Sans',sans-serif" }}>Cancel</button>
              </div>
            </div>
          )}

          {goals.length === 0 ? (
            <div style={{ textAlign: "center", padding: "48px 0", color: "rgba(255,255,255,0.3)", fontSize: 14 }}>No goals set yet.</div>
          ) : goals.map(g => (
            <div key={g.id} style={{ background: "rgba(255,255,255,0.03)", border: `1px solid ${g.achievedAt ? "rgba(34,197,94,0.3)" : "rgba(255,255,255,0.07)"}`, borderRadius: 12, padding: 16, marginBottom: 10, display: "flex", alignItems: "flex-start", gap: 14 }}>
              <button onClick={() => markGoal(g.id, !g.achievedAt)} style={{ width: 28, height: 28, borderRadius: "50%", border: `2px solid ${g.achievedAt ? "#22c55e" : "rgba(255,255,255,0.2)"}`, background: g.achievedAt ? "#22c55e" : "transparent", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, marginTop: 2 }}>
                {g.achievedAt && <Check size={13} style={{ color: "white" }} />}
              </button>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 14, fontWeight: 600, color: g.achievedAt ? "rgba(255,255,255,0.5)" : "white", textDecoration: g.achievedAt ? "line-through" : "none" }}>{g.title}</div>
                {g.description && <p style={{ fontSize: 12, color: "rgba(255,255,255,0.4)", marginTop: 4 }}>{g.description}</p>}
                <div style={{ fontSize: 11, color: "rgba(255,255,255,0.3)", marginTop: 6 }}>
                  {g.achievedAt ? `✓ Achieved ${new Date(g.achievedAt).toLocaleDateString("en-IN")}` : g.targetDate ? `Target: ${new Date(g.targetDate).toLocaleDateString("en-IN")}` : ""}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ── BOOKINGS ── */}
      {activeTab === "Bookings" && (
        <div>
          {bookings.length === 0 ? (
            <div style={{ textAlign: "center", padding: "48px 0", color: "rgba(255,255,255,0.3)", fontSize: 14 }}>No bookings yet.</div>
          ) : [...bookings].sort((a, b) => b.datetime.localeCompare(a.datetime)).map(b => {
            const dt = new Date(b.datetime);
            return (
              <div key={b.id} style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 12, padding: 16, marginBottom: 10, display: "flex", alignItems: "center", gap: 14 }}>
                <div style={{ width: 40, height: 40, borderRadius: 10, background: "rgba(10,126,140,0.15)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <Calendar size={16} style={{ color: "#0A7E8C" }} />
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 14, fontWeight: 600, color: "white" }}>{dt.toLocaleDateString("en-IN", { weekday: "short", day: "numeric", month: "short", year: "numeric" })} · {dt.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" })}</div>
                  <div style={{ fontSize: 12, color: "rgba(255,255,255,0.4)" }}>{b.type} · ₹{b.amount} · {b.paymentStatus}</div>
                </div>
                <span style={{ fontSize: 11, padding: "3px 10px", borderRadius: 6, background: b.status === "CONFIRMED" ? "rgba(34,197,94,0.15)" : b.status === "COMPLETED" ? "rgba(10,126,140,0.15)" : b.status === "CANCELLED" ? "rgba(239,68,68,0.15)" : "rgba(245,130,13,0.15)", color: b.status === "CONFIRMED" ? "#22c55e" : b.status === "COMPLETED" ? "#0A7E8C" : b.status === "CANCELLED" ? "#f87171" : "#F5820D", fontWeight: 700 }}>
                  {b.status}
                </span>
              </div>
            );
          })}
        </div>
      )}

      {/* ── NOTES ── */}
      {activeTab === "Notes" && (
        <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 16, padding: 24 }}>
          <h3 style={{ fontFamily: "'Nunito',sans-serif", fontWeight: 800, fontSize: 15, color: "white", marginBottom: 16 }}>Clinical Notes</h3>
          <textarea
            style={{ width: "100%", minHeight: 200, padding: "14px", borderRadius: 10, background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", color: "white", fontSize: 14, lineHeight: 1.7, resize: "vertical", outline: "none", fontFamily: "'DM Sans',sans-serif", boxSizing: "border-box" }}
            defaultValue={patient.notes ?? ""}
            onBlur={async e => { await fetch(`/api/admin/patients/${id}`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ notes: e.target.value }) }); }}
            placeholder="Type clinical notes, observations, parent feedback… Auto-saved on blur."
          />
          <p style={{ fontSize: 12, color: "rgba(255,255,255,0.3)", marginTop: 8 }}>Auto-saved when you click outside the box.</p>
        </div>
      )}
    </div>
  );
}
