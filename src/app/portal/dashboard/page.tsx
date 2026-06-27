"use client";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Calendar, FileText, ChevronRight } from "lucide-react";
import type { Patient, Session, Goal, Booking } from "@/lib/db";
import LogoImg from "@/components/shared/LogoImg";
import BottomNav from "@/components/portal/BottomNav";
import { useLanguage } from "@/components/portal/LanguageProvider";
import Link from "next/link";

interface PortalData { patient?: Patient; sessions?: Session[]; goals?: Goal[]; bookings?: Booking[]; error?: string; }

export default function ParentDashboard() {
  const { data: sessionData, status } = useSession();
  const router = useRouter();
  const { t, lang } = useLanguage();
  const [data, setData] = useState<PortalData | null>(null);
  const [loading, setLoading] = useState(true);

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

  if (status === "loading" || loading || !lang) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#f8fafc" }}>
        <div style={{ width: 40, height: 40, border: "3px solid rgba(10,126,140,0.2)", borderTop: "3px solid #0A7E8C", borderRadius: "50%", animation: "spin 0.8s linear infinite" }} />
        <style>{`@keyframes spin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}`}</style>
      </div>
    );
  }

  if (!data) return null;
  if (data.error || !data.patient) {
    return (
      <div style={{ minHeight: "100vh", padding: 24, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", background: "#f8fafc", fontFamily: "'DM Sans',sans-serif", textAlign: "center" }}>
        <h2 style={{ fontSize: 20, fontWeight: 700, color: "#1e293b", marginBottom: 12 }}>Patient record not found</h2>
        <p style={{ color: "#64748b", fontSize: 15, marginBottom: 24 }}>We could not find your records. Please contact support.</p>
        <button onClick={() => router.push('/portal/login')} style={{ background: "#0A7E8C", color: "white", border: "none", padding: "12px 24px", borderRadius: 8, fontWeight: 700, cursor: "pointer" }}>Back to Login</button>
      </div>
    );
  }

  const patient = data.patient as Patient;
  const { sessions = [], goals = [], bookings = [] } = data;
  const achievedGoals = goals.filter(g => g.achievedAt).length;
  const progressPct = goals.length > 0 ? Math.round((achievedGoals / goals.length) * 100) : 0;
  
  const upcomingBookings = bookings.filter(b => b.datetime > new Date().toISOString() && b.status !== "CANCELLED").sort((a, b) => a.datetime.localeCompare(b.datetime));
  const nextAppointment = upcomingBookings[0];
  const recentNotes = [...sessions].sort((a, b) => b.date.localeCompare(a.date)).slice(0, 2);

  return (
    <div style={{ minHeight: "100vh", background: "#f1f5f9", paddingBottom: 100, fontFamily: "'DM Sans',sans-serif" }}>
      
      {/* Header */}
      <header style={{ background: "white", padding: "20px 24px", display: "flex", alignItems: "center", justifyContent: "space-between", position: "sticky", top: 0, zIndex: 10, boxShadow: "0 2px 10px rgba(0,0,0,0.03)" }}>
        <LogoImg variant="dark" height={40} />
      </header>

      <main style={{ padding: 24, display: "flex", flexDirection: "column", gap: 24 }}>
        
        {/* Child Card */}
        <div style={{ background: "linear-gradient(135deg,#0A7E8C,#6B3FA0)", borderRadius: 20, padding: 24, color: "white", boxShadow: "0 10px 25px rgba(10,126,140,0.2)" }}>
          <div style={{ fontSize: 14, opacity: 0.9, marginBottom: 4 }}>{t("hello")}, {patient.guardianName}</div>
          <div style={{ fontSize: 24, fontWeight: 800, fontFamily: "'Nunito',sans-serif", marginBottom: 16 }}>
            {patient.name}
          </div>
          
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
            <div>
              <div style={{ fontSize: 12, opacity: 0.8 }}>{t("progress_summary")}</div>
              <div style={{ fontSize: 20, fontWeight: 700 }}>{progressPct}% {t("goals_achieved")}</div>
            </div>
            <div style={{ width: 50, height: 50, borderRadius: "50%", background: "rgba(255,255,255,0.2)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, fontWeight: 800 }}>
              {achievedGoals}/{goals.length}
            </div>
          </div>
        </div>

        {/* Next Appointment */}
        <section>
          <h2 style={{ fontSize: 16, fontWeight: 700, color: "#1e293b", marginBottom: 12 }}>{t("next_appointment")}</h2>
          {nextAppointment ? (
            <div style={{ background: "white", borderRadius: 16, padding: 20, boxShadow: "0 2px 8px rgba(0,0,0,0.04)" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 12 }}>
                <div style={{ width: 44, height: 44, borderRadius: 12, background: "rgba(10,126,140,0.1)", color: "#0A7E8C", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <Calendar size={20} />
                </div>
                <div>
                  <div style={{ fontWeight: 700, color: "#1e293b", fontSize: 15 }}>
                    {new Date(nextAppointment.datetime).toLocaleDateString(lang === "hi" ? "hi-IN" : "en-US", { weekday: 'short', month: 'short', day: 'numeric' })}
                  </div>
                  <div style={{ color: "#64748b", fontSize: 13 }}>
                    {new Date(nextAppointment.datetime).toLocaleTimeString(lang === "hi" ? "hi-IN" : "en-US", { hour: '2-digit', minute: '2-digit' })}
                  </div>
                </div>
              </div>
              {nextAppointment.zoomLink && (
                <a href={nextAppointment.zoomLink} target="_blank" rel="noreferrer" style={{ display: "block", textAlign: "center", background: "#0A7E8C", color: "white", padding: "10px", borderRadius: 8, textDecoration: "none", fontWeight: 700, fontSize: 14 }}>
                  {t("join_zoom")}
                </a>
              )}
            </div>
          ) : (
            <div style={{ background: "white", borderRadius: 16, padding: 20, textAlign: "center", boxShadow: "0 2px 8px rgba(0,0,0,0.04)" }}>
              <div style={{ color: "#64748b", fontSize: 14, marginBottom: 12 }}>{t("no_upcoming")}</div>
              <Link href="/book" style={{ display: "inline-block", background: "rgba(10,126,140,0.1)", color: "#0A7E8C", padding: "8px 16px", borderRadius: 20, textDecoration: "none", fontWeight: 700, fontSize: 13 }}>
                {t("book_new_session")}
              </Link>
            </div>
          )}
        </section>

        {/* Recent Notes */}
        <section>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
            <h2 style={{ fontSize: 16, fontWeight: 700, color: "#1e293b" }}>{t("recent_notes")}</h2>
            <Link href="/portal/notes" style={{ color: "#0A7E8C", fontSize: 13, fontWeight: 700, textDecoration: "none" }}>{t("view_all_notes")}</Link>
          </div>
          
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {recentNotes.length > 0 ? recentNotes.map(session => (
              <Link href="/portal/notes" key={session.id} style={{ background: "white", borderRadius: 16, padding: 16, textDecoration: "none", color: "inherit", boxShadow: "0 2px 8px rgba(0,0,0,0.04)", display: "flex", alignItems: "center", gap: 12 }}>
                <div style={{ width: 40, height: 40, borderRadius: 10, background: "rgba(107,63,160,0.1)", color: "#6B3FA0", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <FileText size={18} />
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 700, color: "#1e293b", fontSize: 14 }}>{new Date(session.date).toLocaleDateString(lang === "hi" ? "hi-IN" : "en-US", { month: "short", day: "numeric" })}</div>
                  <div style={{ color: "#64748b", fontSize: 12, display: "-webkit-box", WebkitLineClamp: 1, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
                    {session.notes || t("no_notes")}
                  </div>
                </div>
                <ChevronRight size={18} color="#cbd5e1" />
              </Link>
            )) : (
              <div style={{ color: "#64748b", fontSize: 14, textAlign: "center", padding: 20 }}>{t("no_notes")}</div>
            )}
          </div>
        </section>

      </main>

      <BottomNav />
    </div>
  );
}
