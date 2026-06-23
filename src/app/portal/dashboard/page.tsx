"use client";
import { useEffect, useState } from "react";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Target, Clock, Calendar, LogOut, CheckCircle, Circle, BookOpen, Phone } from "lucide-react";
import type { Patient, Session, Goal, Booking } from "@/lib/db";

interface PortalData { patient: Patient; sessions: Session[]; goals: Goal[]; bookings: Booking[]; }

export default function ParentPortalDashboard() {
  const { data: sessionData, status } = useSession();
  const router = useRouter();
  const [data, setData] = useState<PortalData | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"progress" | "goals" | "bookings" | "sessions">("progress");

  useEffect(() => {
    if (status === "unauthenticated") router.replace("/portal/login");
  }, [status, router]);

  useEffect(() => {
    const patientId = (sessionData?.user as { patientId?: string })?.patientId;
    if (!patientId) return;
    fetch(`/api/admin/patients/${patientId}`)
      .then(r => r.json())
      .then(d => { setData(d); setLoading(false); })
      .catch(() => setLoading(false));
  }, [sessionData]);

  if (status === "loading" || loading) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "linear-gradient(135deg,#f0f9ff,#f5f0ff)", fontFamily: "'DM Sans',sans-serif" }}>
        <div style={{ textAlign: "center" }}>
          <div style={{ width: 48, height: 48, border: "4px solid rgba(10,126,140,0.2)", borderTop: "4px solid #0A7E8C", borderRadius: "50%", animation: "spin 0.8s linear infinite", margin: "0 auto 16px" }} />
          <div style={{ color: "#64748b", fontSize: 14 }}>Loading your child's progress…</div>
        </div>
        <style>{`@keyframes spin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}`}</style>
      </div>
    );
  }

  if (!data) return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "linear-gradient(135deg,#f0f9ff,#f5f0ff)", fontFamily: "'DM Sans',sans-serif" }}>
      <div style={{ textAlign: "center", padding: 32 }}>
        <div style={{ fontSize: 48, marginBottom: 16 }}>😕</div>
        <div style={{ fontSize: 16, color: "#374151", marginBottom: 16 }}>Could not load patient data.</div>
        <button onClick={() => signOut({ callbackUrl: "/portal/login" })} style={{ padding: "10px 20px", borderRadius: 10, border: "none", background: "#0A7E8C", color: "white", cursor: "pointer", fontFamily: "'DM Sans',sans-serif", fontWeight: 700 }}>Go Back to Login</button>
      </div>
    </div>
  );

  const { patient, sessions, goals, bookings } = data;
  const achievedGoals = goals.filter(g => g.achievedAt).length;
  const upcomingBookings = bookings.filter(b => b.datetime > new Date().toISOString() && b.status !== "CANCELLED").sort((a, b) => a.datetime.localeCompare(b.datetime));
  const recentSessions = [...sessions].sort((a, b) => b.date.localeCompare(a.date)).slice(0, 5);
  const progressPct = goals.length > 0 ? Math.round((achievedGoals / goals.length) * 100) : 0;

  const TABS = [
    { key: "progress", label: "Progress", icon: "📊" },
    { key: "goals", label: "Goals", icon: "🎯" },
    { key: "sessions", label: "Sessions", icon: "📋" },
    { key: "bookings", label: "Bookings", icon: "📅" },
  ] as const;

  return (
    <div style={{ minHeight: "100vh", background: "linear-gradient(160deg,#f0f9ff 0%,#f5f0ff 100%)", fontFamily: "'DM Sans',sans-serif" }}>

      {/* Header */}
      <header style={{ background: "white", borderBottom: "1px solid #e2e8f0", padding: "0 24px", height: 64, display: "flex", alignItems: "center", gap: 16, boxShadow: "0 1px 4px rgba(0,0,0,0.04)", position: "sticky", top: 0, zIndex: 50 }}>
        <img src="/images/logo/logo-dark.png" alt="Udaan Care" style={{ height: 40, objectFit: "contain" }} />
        <div style={{ flex: 1 }} />
        <div style={{ fontSize: 14, color: "#64748b" }}>Welcome, <strong style={{ color: "#1e293b" }}>{patient.guardianName}</strong></div>
        <button onClick={() => signOut({ callbackUrl: "/portal/login" })} style={{ display: "flex", alignItems: "center", gap: 6, padding: "8px 14px", borderRadius: 8, border: "1px solid #e2e8f0", background: "white", cursor: "pointer", fontSize: 13, color: "#64748b", fontFamily: "'DM Sans',sans-serif" }}>
          <LogOut size={13} /> Sign Out
        </button>
      </header>

      <div style={{ maxWidth: 900, margin: "0 auto", padding: "32px 24px" }}>

        {/* Child card */}
        <div style={{ background: "linear-gradient(135deg,#0A7E8C,#6B3FA0)", borderRadius: 20, padding: "28px 32px", marginBottom: 28, color: "white", display: "flex", alignItems: "center", gap: 24, flexWrap: "wrap" }}>
          <div style={{ width: 72, height: 72, borderRadius: "50%", background: "rgba(255,255,255,0.2)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 30, fontWeight: 900, flexShrink: 0 }}>
            {patient.name.charAt(0)}
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontFamily: "'Nunito',sans-serif", fontWeight: 900, fontSize: 26 }}>{patient.name}</div>
            <div style={{ fontSize: 14, opacity: 0.8, marginTop: 4 }}>
              ID: {patient.uniqueId} · {patient.dob ? `${new Date().getFullYear() - new Date(patient.dob).getFullYear()} years old` : ""}
              {patient.diagnoses?.length > 0 && ` · ${patient.diagnoses.join(", ")}`}
            </div>
          </div>
          {/* Stats */}
          <div style={{ display: "flex", gap: 24 }}>
            {[
              { v: sessions.length, l: "Sessions" },
              { v: `${achievedGoals}/${goals.length}`, l: "Goals Met" },
              { v: upcomingBookings.length, l: "Upcoming" },
            ].map(s => (
              <div key={s.l} style={{ textAlign: "center" }}>
                <div style={{ fontFamily: "'Nunito',sans-serif", fontWeight: 900, fontSize: 24 }}>{s.v}</div>
                <div style={{ fontSize: 11, opacity: 0.7 }}>{s.l}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Tabs */}
        <div style={{ display: "flex", gap: 8, marginBottom: 24 }}>
          {TABS.map(t => (
            <button key={t.key} onClick={() => setActiveTab(t.key)} style={{
              display: "flex", alignItems: "center", gap: 6, padding: "10px 18px", borderRadius: 10, border: "none", cursor: "pointer", fontSize: 14, fontWeight: activeTab === t.key ? 700 : 500, fontFamily: "'DM Sans',sans-serif",
              background: activeTab === t.key ? "#0A7E8C" : "white",
              color: activeTab === t.key ? "white" : "#64748b",
              boxShadow: activeTab === t.key ? "0 4px 12px rgba(10,126,140,0.3)" : "0 1px 3px rgba(0,0,0,0.06)",
              transition: "all 0.18s",
            }}>
              <span>{t.icon}</span> {t.label}
            </button>
          ))}
        </div>

        {/* ── PROGRESS TAB ── */}
        {activeTab === "progress" && (
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>

            {/* Progress circle */}
            <div style={{ background: "white", borderRadius: 20, padding: 28, boxShadow: "0 2px 12px rgba(0,0,0,0.06)", gridColumn: "1/-1" }}>
              <h2 style={{ fontFamily: "'Nunito',sans-serif", fontWeight: 800, fontSize: 18, color: "#1e293b", marginBottom: 20 }}>Overall Progress</h2>
              <div style={{ display: "flex", alignItems: "center", gap: 32, flexWrap: "wrap" }}>
                {/* Progress bar */}
                <div style={{ flex: 1, minWidth: 200 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                    <span style={{ fontSize: 14, color: "#64748b" }}>Goals achieved</span>
                    <span style={{ fontSize: 14, fontWeight: 700, color: "#0A7E8C" }}>{progressPct}%</span>
                  </div>
                  <div style={{ height: 12, borderRadius: 6, background: "#f1f5f9", overflow: "hidden" }}>
                    <div style={{ height: "100%", borderRadius: 6, width: `${progressPct}%`, background: "linear-gradient(90deg,#0A7E8C,#6B3FA0)", transition: "width 0.6s ease" }} />
                  </div>
                  <div style={{ fontSize: 12, color: "#94a3b8", marginTop: 6 }}>{achievedGoals} of {goals.length} goals completed</div>
                </div>
                <div style={{ display: "flex", gap: 16 }}>
                  {[
                    { label: "Total Sessions", value: sessions.length, icon: "📋", color: "#0A7E8C" },
                    { label: "This Month", value: sessions.filter(s => s.date.startsWith(new Date().toISOString().slice(0, 7))).length, icon: "📅", color: "#6B3FA0" },
                  ].map(s => (
                    <div key={s.label} style={{ textAlign: "center", padding: "16px 24px", background: "#f8fafc", borderRadius: 14 }}>
                      <div style={{ fontSize: 24, marginBottom: 4 }}>{s.icon}</div>
                      <div style={{ fontFamily: "'Nunito',sans-serif", fontWeight: 900, fontSize: 28, color: s.color }}>{s.value}</div>
                      <div style={{ fontSize: 12, color: "#94a3b8" }}>{s.label}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Upcoming appointment */}
            <div style={{ background: "white", borderRadius: 20, padding: 24, boxShadow: "0 2px 12px rgba(0,0,0,0.06)" }}>
              <h3 style={{ fontFamily: "'Nunito',sans-serif", fontWeight: 800, fontSize: 16, color: "#1e293b", marginBottom: 16 }}>Next Appointment</h3>
              {upcomingBookings.length === 0 ? (
                <div style={{ textAlign: "center", padding: "20px 0", color: "#94a3b8", fontSize: 14 }}>No upcoming appointments</div>
              ) : (() => {
                const b = upcomingBookings[0];
                const dt = new Date(b.datetime);
                return (
                  <div style={{ display: "flex", alignItems: "center", gap: 14, padding: "16px", borderRadius: 12, background: "linear-gradient(135deg,rgba(10,126,140,0.05),rgba(107,63,160,0.05))", border: "1px solid rgba(10,126,140,0.15)" }}>
                    <div style={{ width: 48, height: 48, borderRadius: 12, background: b.type === "ONLINE" ? "rgba(107,63,160,0.1)" : "rgba(10,126,140,0.1)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22 }}>
                      {b.type === "ONLINE" ? "💻" : "🏥"}
                    </div>
                    <div>
                      <div style={{ fontWeight: 700, color: "#1e293b", fontSize: 15 }}>{dt.toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "long" })}</div>
                      <div style={{ fontSize: 13, color: "#64748b" }}>{dt.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" })} · {b.type === "ONLINE" ? "Online Session" : "In-Clinic"}</div>
                      {b.zoomLink && b.type === "ONLINE" && (
                        <a href={b.zoomLink} target="_blank" rel="noopener noreferrer" style={{ fontSize: 12, color: "#6B3FA0", fontWeight: 700, textDecoration: "none", marginTop: 4, display: "inline-block" }}>Join Zoom →</a>
                      )}
                    </div>
                  </div>
                );
              })()}
            </div>

            {/* Recent session note */}
            <div style={{ background: "white", borderRadius: 20, padding: 24, boxShadow: "0 2px 12px rgba(0,0,0,0.06)" }}>
              <h3 style={{ fontFamily: "'Nunito',sans-serif", fontWeight: 800, fontSize: 16, color: "#1e293b", marginBottom: 16 }}>Latest Session Note</h3>
              {recentSessions.length === 0 ? (
                <div style={{ textAlign: "center", padding: "20px 0", color: "#94a3b8", fontSize: 14 }}>No sessions recorded yet</div>
              ) : (
                <div>
                  <div style={{ fontSize: 12, fontWeight: 700, color: "#0A7E8C", marginBottom: 8 }}>
                    {new Date(recentSessions[0].date).toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "long", year: "numeric" })}
                  </div>
                  <p style={{ fontSize: 14, color: "#475569", lineHeight: 1.65 }}>{recentSessions[0].notes || "Session notes not available."}</p>
                  <div style={{ fontSize: 12, color: "#94a3b8", marginTop: 8 }}>{recentSessions[0].durationMins} mins · {recentSessions[0].type}</div>
                </div>
              )}
            </div>

            {/* Contact card */}
            <div style={{ gridColumn: "1/-1", background: "linear-gradient(135deg,#f0f9ff,#f5f0ff)", borderRadius: 20, padding: 24, border: "1px solid rgba(10,126,140,0.15)", display: "flex", alignItems: "center", gap: 20, flexWrap: "wrap" }}>
              <div style={{ fontSize: 32 }}>🏥</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontFamily: "'Nunito',sans-serif", fontWeight: 800, fontSize: 16, color: "#1e293b" }}>Need to reach us?</div>
                <div style={{ fontSize: 13, color: "#64748b" }}>Contact Udaan Care for appointments, queries, or home exercise guidance</div>
              </div>
              <div style={{ display: "flex", gap: 10 }}>
                <a href="https://wa.me/918349764084" target="_blank" rel="noopener noreferrer" style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "10px 16px", borderRadius: 10, background: "#25D366", color: "white", textDecoration: "none", fontSize: 13, fontWeight: 700 }}>
                  WhatsApp
                </a>
                <a href="tel:+918349764084" style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "10px 16px", borderRadius: 10, background: "white", border: "1px solid #e2e8f0", color: "#0A7E8C", textDecoration: "none", fontSize: 13, fontWeight: 700 }}>
                  <Phone size={13} /> Call
                </a>
              </div>
            </div>
          </div>
        )}

        {/* ── GOALS TAB ── */}
        {activeTab === "goals" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {goals.length === 0 ? (
              <div style={{ textAlign: "center", padding: 48, background: "white", borderRadius: 20, color: "#94a3b8" }}>No goals set yet. Your therapist will add goals soon.</div>
            ) : goals.map(g => (
              <div key={g.id} style={{ background: "white", borderRadius: 14, padding: "18px 20px", boxShadow: "0 2px 8px rgba(0,0,0,0.05)", display: "flex", gap: 14, alignItems: "flex-start", borderLeft: `4px solid ${g.achievedAt ? "#22c55e" : "#0A7E8C"}` }}>
                <div style={{ width: 28, height: 28, borderRadius: "50%", border: `2px solid ${g.achievedAt ? "#22c55e" : "#0A7E8C"}`, background: g.achievedAt ? "#22c55e" : "transparent", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, marginTop: 2 }}>
                  {g.achievedAt && <CheckCircle size={16} style={{ color: "white" }} />}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 15, fontWeight: 700, color: g.achievedAt ? "#94a3b8" : "#1e293b", textDecoration: g.achievedAt ? "line-through" : "none" }}>{g.title}</div>
                  {g.description && <p style={{ fontSize: 13, color: "#64748b", marginTop: 4, lineHeight: 1.5 }}>{g.description}</p>}
                  <div style={{ fontSize: 12, color: g.achievedAt ? "#22c55e" : "#94a3b8", marginTop: 6, fontWeight: g.achievedAt ? 700 : 400 }}>
                    {g.achievedAt ? `✓ Achieved on ${new Date(g.achievedAt).toLocaleDateString("en-IN")}` : g.targetDate ? `Target: ${new Date(g.targetDate).toLocaleDateString("en-IN")}` : "In progress"}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ── SESSIONS TAB ── */}
        {activeTab === "sessions" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {sessions.length === 0 ? (
              <div style={{ textAlign: "center", padding: 48, background: "white", borderRadius: 20, color: "#94a3b8" }}>No sessions recorded yet.</div>
            ) : [...sessions].sort((a, b) => b.date.localeCompare(a.date)).map(s => (
              <div key={s.id} style={{ background: "white", borderRadius: 14, padding: "20px 24px", boxShadow: "0 2px 8px rgba(0,0,0,0.05)" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: s.notes ? 12 : 0 }}>
                  <div style={{ width: 40, height: 40, borderRadius: 10, background: s.type === "ONLINE" ? "rgba(107,63,160,0.1)" : "rgba(10,126,140,0.1)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, flexShrink: 0 }}>
                    {s.type === "ONLINE" ? "💻" : "🏥"}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 15, fontWeight: 700, color: "#1e293b" }}>{new Date(s.date).toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "long", year: "numeric" })}</div>
                    <div style={{ fontSize: 12, color: "#94a3b8" }}>{s.durationMins} mins · {s.type === "ONLINE" ? "Online session" : "In-clinic"}</div>
                  </div>
                </div>
                {s.notes && <p style={{ fontSize: 14, color: "#475569", lineHeight: 1.65, paddingLeft: 52 }}>{s.notes}</p>}
              </div>
            ))}
          </div>
        )}

        {/* ── BOOKINGS TAB ── */}
        {activeTab === "bookings" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {bookings.length === 0 ? (
              <div style={{ textAlign: "center", padding: 48, background: "white", borderRadius: 20, color: "#94a3b8" }}>No bookings yet.</div>
            ) : [...bookings].sort((a, b) => b.datetime.localeCompare(a.datetime)).map(b => {
              const dt = new Date(b.datetime);
              const upcoming = b.datetime > new Date().toISOString();
              return (
                <div key={b.id} style={{ background: "white", borderRadius: 14, padding: "18px 22px", boxShadow: "0 2px 8px rgba(0,0,0,0.05)", display: "flex", alignItems: "center", gap: 14, borderLeft: `4px solid ${upcoming ? "#0A7E8C" : "#e2e8f0"}` }}>
                  <div style={{ fontSize: 24 }}>{b.type === "ONLINE" ? "💻" : "🏥"}</div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 15, fontWeight: 700, color: "#1e293b" }}>{dt.toLocaleDateString("en-IN", { weekday: "short", day: "numeric", month: "long", year: "numeric" })} · {dt.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" })}</div>
                    <div style={{ fontSize: 12, color: "#94a3b8", marginTop: 3 }}>{b.type} · ₹{b.amount} · {b.paymentStatus}</div>
                    {b.zoomLink && b.type === "ONLINE" && upcoming && (
                      <a href={b.zoomLink} target="_blank" rel="noopener noreferrer" style={{ fontSize: 12, color: "#6B3FA0", fontWeight: 700, textDecoration: "none", marginTop: 4, display: "inline-block" }}>Join Meeting →</a>
                    )}
                  </div>
                  <span style={{ fontSize: 12, padding: "4px 10px", borderRadius: 6, fontWeight: 700, background: b.status === "CONFIRMED" ? "#dcfce7" : b.status === "COMPLETED" ? "#f0f9ff" : b.status === "CANCELLED" ? "#fef2f2" : "#fef9ec", color: b.status === "CONFIRMED" ? "#16a34a" : b.status === "COMPLETED" ? "#0A7E8C" : b.status === "CANCELLED" ? "#dc2626" : "#d97706" }}>
                    {b.status}
                  </span>
                </div>
              );
            })}
          </div>
        )}
      </div>
      <style>{`@keyframes spin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}`}</style>
    </div>
  );
}
