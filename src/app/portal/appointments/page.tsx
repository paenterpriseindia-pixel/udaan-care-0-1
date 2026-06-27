"use client";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { Calendar, Video, Clock } from "lucide-react";
import type { Booking } from "@/lib/db";
import BottomNav from "@/components/portal/BottomNav";
import { useLanguage } from "@/components/portal/LanguageProvider";
import Link from "next/link";

export default function AppointmentsPage() {
  const { data: sessionData, status } = useSession();
  const { t, lang } = useLanguage();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const patientId = (sessionData?.user as { patientId?: string })?.patientId;
    if (!patientId) return;
    fetch(`/api/admin/patients/${patientId}`)
      .then(r => r.json())
      .then(d => { setBookings(d.bookings || []); setLoading(false); })
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

  const upcoming = bookings.filter(b => b.datetime > new Date().toISOString() && b.status !== "CANCELLED").sort((a, b) => a.datetime.localeCompare(b.datetime));
  const past = bookings.filter(b => b.datetime <= new Date().toISOString() || b.status === "CANCELLED").sort((a, b) => b.datetime.localeCompare(a.datetime));

  return (
    <div style={{ minHeight: "100vh", background: "#f1f5f9", paddingBottom: 100, fontFamily: "'DM Sans',sans-serif" }}>
      <header style={{ background: "white", padding: "20px 24px", display: "flex", alignItems: "center", position: "sticky", top: 0, zIndex: 10, boxShadow: "0 2px 10px rgba(0,0,0,0.03)" }}>
        <h1 style={{ fontSize: 20, fontWeight: 800, color: "#1e293b", margin: 0 }}>{t("my_appointments")}</h1>
      </header>

      <main style={{ padding: 24, display: "flex", flexDirection: "column", gap: 32 }}>
        
        {/* Upcoming */}
        <section>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
            <h2 style={{ fontSize: 16, fontWeight: 700, color: "#1e293b" }}>{t("upcoming")}</h2>
            <Link href="/book" style={{ color: "#0A7E8C", fontSize: 13, fontWeight: 700, textDecoration: "none", background: "rgba(10,126,140,0.1)", padding: "6px 12px", borderRadius: 20 }}>
              + {t("book_new_session")}
            </Link>
          </div>
          
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {upcoming.length > 0 ? upcoming.map(b => (
              <div key={b.id} style={{ background: "white", borderRadius: 16, padding: 16, boxShadow: "0 2px 8px rgba(0,0,0,0.04)" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 }}>
                  <div style={{ display: "flex", gap: 12 }}>
                    <div style={{ width: 44, height: 44, borderRadius: 12, background: "rgba(10,126,140,0.1)", color: "#0A7E8C", display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <Calendar size={20} />
                    </div>
                    <div>
                      <div style={{ fontWeight: 700, color: "#1e293b", fontSize: 15 }}>
                        {new Date(b.datetime).toLocaleDateString(lang === "hi" ? "hi-IN" : "en-US", { weekday: 'short', month: 'short', day: 'numeric' })}
                      </div>
                      <div style={{ color: "#64748b", fontSize: 13, display: "flex", alignItems: "center", gap: 4 }}>
                        <Clock size={12} /> {new Date(b.datetime).toLocaleTimeString(lang === "hi" ? "hi-IN" : "en-US", { hour: '2-digit', minute: '2-digit' })}
                      </div>
                    </div>
                  </div>
                  <div style={{ background: b.status === "PAID" ? "#dcfce7" : "#fef3c7", color: b.status === "PAID" ? "#166534" : "#92400e", padding: "4px 8px", borderRadius: 6, fontSize: 11, fontWeight: 700 }}>
                    {b.status === "PAID" ? t("status_paid") : t("status_pending")}
                  </div>
                </div>
                
                {b.zoomLink && (
                  <a href={b.zoomLink} target="_blank" rel="noreferrer" style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8, background: "#1e293b", color: "white", padding: "10px", borderRadius: 8, textDecoration: "none", fontWeight: 700, fontSize: 14 }}>
                    <Video size={16} /> {t("join_zoom")}
                  </a>
                )}
              </div>
            )) : (
              <div style={{ color: "#64748b", fontSize: 14, textAlign: "center", padding: 20, background: "white", borderRadius: 16 }}>{t("no_upcoming")}</div>
            )}
          </div>
        </section>

        {/* Past */}
        <section>
          <h2 style={{ fontSize: 16, fontWeight: 700, color: "#1e293b", marginBottom: 16 }}>{t("past")}</h2>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {past.length > 0 ? past.map(b => (
              <div key={b.id} style={{ background: "white", borderRadius: 16, padding: 16, boxShadow: "0 2px 8px rgba(0,0,0,0.04)", opacity: 0.7 }}>
                <div style={{ display: "flex", gap: 12 }}>
                  <div style={{ width: 40, height: 40, borderRadius: 12, background: "#f1f5f9", color: "#64748b", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <Calendar size={18} />
                  </div>
                  <div>
                    <div style={{ fontWeight: 700, color: "#1e293b", fontSize: 14 }}>
                      {new Date(b.datetime).toLocaleDateString(lang === "hi" ? "hi-IN" : "en-US", { month: 'short', day: 'numeric', year: 'numeric' })}
                    </div>
                    <div style={{ color: "#64748b", fontSize: 12 }}>
                      {b.status === "CANCELLED" ? "Cancelled" : "Completed"}
                    </div>
                  </div>
                </div>
              </div>
            )) : null}
          </div>
        </section>

      </main>

      <BottomNav />
    </div>
  );
}
