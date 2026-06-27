"use client";
import { useSession, signOut } from "next-auth/react";
import { LogOut, User } from "lucide-react";
import BottomNav from "@/components/portal/BottomNav";
import { useLanguage } from "@/components/portal/LanguageProvider";

export default function ProfilePage() {
  const { data: sessionData, status } = useSession();
  const { t, lang, setLang } = useLanguage();

  if (status === "loading" || !lang) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#f8fafc" }}>
        <div style={{ width: 40, height: 40, border: "3px solid rgba(10,126,140,0.2)", borderTop: "3px solid #0A7E8C", borderRadius: "50%", animation: "spin 0.8s linear infinite" }} />
        <style>{`@keyframes spin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}`}</style>
      </div>
    );
  }

  const patientName = sessionData?.user?.name || "Parent";

  return (
    <div style={{ minHeight: "100vh", background: "#f1f5f9", paddingBottom: 100, fontFamily: "'DM Sans',sans-serif" }}>
      <header style={{ background: "white", padding: "20px 24px", display: "flex", alignItems: "center", position: "sticky", top: 0, zIndex: 10, boxShadow: "0 2px 10px rgba(0,0,0,0.03)" }}>
        <h1 style={{ fontSize: 20, fontWeight: 800, color: "#1e293b", margin: 0 }}>{t("profile")}</h1>
      </header>

      <main style={{ padding: 24, display: "flex", flexDirection: "column", gap: 24 }}>
        
        <div style={{ background: "white", borderRadius: 16, padding: 24, boxShadow: "0 2px 8px rgba(0,0,0,0.04)", textAlign: "center" }}>
          <div style={{ width: 72, height: 72, borderRadius: "50%", background: "rgba(10,126,140,0.1)", color: "#0A7E8C", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px" }}>
            <User size={32} />
          </div>
          <div style={{ fontSize: 18, fontWeight: 800, color: "#1e293b" }}>{patientName}</div>
          <div style={{ fontSize: 14, color: "#64748b", marginTop: 4 }}>Udaan Care Parent</div>
        </div>

        <div style={{ background: "white", borderRadius: 16, padding: 20, boxShadow: "0 2px 8px rgba(0,0,0,0.04)" }}>
          <h2 style={{ fontSize: 15, fontWeight: 700, color: "#1e293b", marginBottom: 16 }}>{t("choose_language")}</h2>
          <div style={{ display: "flex", gap: 12 }}>
            <button
              onClick={() => setLang("en")}
              style={{ flex: 1, padding: 12, borderRadius: 12, border: lang === "en" ? "2px solid #0A7E8C" : "1px solid #e2e8f0", background: lang === "en" ? "rgba(10,126,140,0.05)" : "white", color: lang === "en" ? "#0A7E8C" : "#64748b", fontWeight: 700, cursor: "pointer" }}
            >
              English
            </button>
            <button
              onClick={() => setLang("hi")}
              style={{ flex: 1, padding: 12, borderRadius: 12, border: lang === "hi" ? "2px solid #0A7E8C" : "1px solid #e2e8f0", background: lang === "hi" ? "rgba(10,126,140,0.05)" : "white", color: lang === "hi" ? "#0A7E8C" : "#64748b", fontWeight: 700, cursor: "pointer" }}
            >
              हिंदी
            </button>
          </div>
        </div>

        <button 
          onClick={() => signOut({ callbackUrl: "/portal/login" })}
          style={{ background: "white", borderRadius: 16, padding: 20, boxShadow: "0 2px 8px rgba(0,0,0,0.04)", border: "none", color: "#dc2626", fontWeight: 700, fontSize: 16, display: "flex", alignItems: "center", justifyContent: "center", gap: 8, cursor: "pointer", width: "100%" }}
        >
          <LogOut size={20} /> {t("sign_out")}
        </button>

      </main>

      <BottomNav />
    </div>
  );
}
