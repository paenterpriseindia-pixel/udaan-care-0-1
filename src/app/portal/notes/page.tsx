"use client";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { FileText } from "lucide-react";
import type { Session } from "@/lib/db";
import BottomNav from "@/components/portal/BottomNav";
import { useLanguage } from "@/components/portal/LanguageProvider";

export default function NotesPage() {
  const { data: sessionData, status } = useSession();
  const { t, lang } = useLanguage();
  const [sessions, setSessions] = useState<Session[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const patientId = (sessionData?.user as { patientId?: string })?.patientId;
    if (!patientId) return;
    fetch(`/api/admin/patients/${patientId}`)
      .then(r => r.json())
      .then(d => { setSessions(d.sessions || []); setLoading(false); })
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

  const sortedSessions = [...sessions].sort((a, b) => b.date.localeCompare(a.date));

  return (
    <div style={{ minHeight: "100vh", background: "#f1f5f9", paddingBottom: 100, fontFamily: "'DM Sans',sans-serif" }}>
      <header style={{ background: "white", padding: "20px 24px", display: "flex", alignItems: "center", position: "sticky", top: 0, zIndex: 10, boxShadow: "0 2px 10px rgba(0,0,0,0.03)" }}>
        <h1 style={{ fontSize: 20, fontWeight: 800, color: "#1e293b", margin: 0 }}>{t("therapy_notes")}</h1>
      </header>

      <main style={{ padding: 24, display: "flex", flexDirection: "column", gap: 16 }}>
        {sortedSessions.length > 0 ? sortedSessions.map(session => (
          <div key={session.id} style={{ background: "white", borderRadius: 16, padding: 20, boxShadow: "0 2px 8px rgba(0,0,0,0.04)" }}>
            <div style={{ display: "flex", gap: 12, marginBottom: 12, paddingBottom: 12, borderBottom: "1px solid #f1f5f9" }}>
              <div style={{ width: 44, height: 44, borderRadius: 12, background: "rgba(107,63,160,0.1)", color: "#6B3FA0", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <FileText size={20} />
              </div>
              <div>
                <div style={{ fontWeight: 700, color: "#1e293b", fontSize: 15 }}>
                  {new Date(session.date).toLocaleDateString(lang === "hi" ? "hi-IN" : "en-US", { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}
                </div>
                <div style={{ color: "#64748b", fontSize: 13 }}>
                  Therapist Notes
                </div>
              </div>
            </div>
            
            <div style={{ color: "#334155", fontSize: 15, lineHeight: 1.6, whiteSpace: "pre-wrap" }}>
              {session.notes || <span style={{ color: "#94a3b8", fontStyle: "italic" }}>No details provided.</span>}
            </div>
          </div>
        )) : (
          <div style={{ background: "white", borderRadius: 16, padding: 32, textAlign: "center", boxShadow: "0 2px 8px rgba(0,0,0,0.04)" }}>
            <div style={{ width: 64, height: 64, borderRadius: "50%", background: "#f1f5f9", color: "#94a3b8", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px" }}>
              <FileText size={32} />
            </div>
            <div style={{ color: "#64748b", fontSize: 15 }}>{t("no_notes")}</div>
          </div>
        )}
      </main>

      <BottomNav />
    </div>
  );
}
