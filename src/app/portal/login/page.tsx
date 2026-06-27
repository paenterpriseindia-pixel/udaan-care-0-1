"use client";
import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Hash, Lock, ArrowRight, Languages, ArrowLeft } from "lucide-react";
import LogoImg from "@/components/shared/LogoImg";
import { useLanguage } from "@/components/portal/LanguageProvider";
import Link from "next/link";


export default function ParentPortalLogin() {
  const router = useRouter();
  const [uniqueId, setUniqueId] = useState("");
  const [pin, setPin] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const { lang, setLang, t } = useLanguage();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true); setError("");
    const res = await signIn("parent-credentials", {
      uniqueId: uniqueId.toUpperCase().trim(),
      pin: pin.trim(),
      redirect: false,
    });
    setLoading(false);
    if (res?.ok) router.push("/portal/dashboard");
    else setError(t("invalid_login"));
  };

  if (!lang) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", background: "#f8fafc", padding: 24, fontFamily: "'DM Sans',sans-serif" }}>
        <div style={{ textAlign: "center", marginBottom: 40 }}>
          <LogoImg variant="dark" height={100} style={{ margin: "0 auto 24px", display: "block" }} />
          <h1 style={{ fontFamily: "'Nunito',sans-serif", fontWeight: 900, fontSize: 24, color: "#1a1a2e", marginBottom: 8 }}>
            Welcome to Udaan Care
          </h1>
          <h2 style={{ fontFamily: "'Nunito',sans-serif", fontWeight: 700, fontSize: 20, color: "#64748b", marginBottom: 0 }}>
            उड़ान केयर में आपका स्वागत है
          </h2>
        </div>
        
        <div style={{ display: "flex", flexDirection: "column", gap: 16, width: "100%", maxWidth: 320 }}>
          <button
            onClick={() => setLang("en")}
            style={{ padding: 18, borderRadius: 16, background: "white", border: "2px solid #e2e8f0", color: "#1e293b", fontSize: 18, fontWeight: 700, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 12, transition: "all 0.2s", boxShadow: "0 4px 12px rgba(0,0,0,0.05)" }}
          >
            <Languages size={20} color="#0A7E8C" /> English
          </button>
          
          <button
            onClick={() => setLang("hi")}
            style={{ padding: 18, borderRadius: 16, background: "white", border: "2px solid #e2e8f0", color: "#1e293b", fontSize: 20, fontWeight: 700, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 12, transition: "all 0.2s", boxShadow: "0 4px 12px rgba(0,0,0,0.05)" }}
          >
            <Languages size={20} color="#0A7E8C" /> हिंदी
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "linear-gradient(135deg, #f0f9ff 0%, #e8f4f8 50%, #f5f0ff 100%)", padding: 24, fontFamily: "'DM Sans',sans-serif", position: "relative" }}>
      {/* Back Button */}
      <Link href="/" style={{ position: "absolute", top: 24, left: 24, display: "flex", alignItems: "center", gap: 6, color: "#64748b", textDecoration: "none", fontSize: 14, fontWeight: 700 }}>
        <ArrowLeft size={18} /> Back to Home
      </Link>

      {/* Small Language Toggle */}
      <div style={{ position: "absolute", top: 24, right: 24, display: "flex", gap: 8, background: "white", padding: 4, borderRadius: 12, boxShadow: "0 2px 8px rgba(0,0,0,0.05)" }}>
        <button onClick={() => setLang("en")} style={{ padding: "6px 10px", borderRadius: 8, border: "none", background: lang === "en" ? "rgba(10,126,140,0.1)" : "transparent", color: lang === "en" ? "#0A7E8C" : "#94a3b8", fontSize: 12, fontWeight: 700, cursor: "pointer" }}>EN</button>
        <button onClick={() => setLang("hi")} style={{ padding: "6px 10px", borderRadius: 8, border: "none", background: lang === "hi" ? "rgba(10,126,140,0.1)" : "transparent", color: lang === "hi" ? "#0A7E8C" : "#94a3b8", fontSize: 12, fontWeight: 700, cursor: "pointer" }}>HI</button>
      </div>

      <div style={{ position: "fixed", top: -100, right: -100, width: 400, height: 400, borderRadius: "50%", background: "radial-gradient(circle, rgba(10,126,140,0.08), transparent 70%)", pointerEvents: "none" }} />

      <div style={{ width: "100%", maxWidth: 420, background: "white", borderRadius: 24, padding: "44px 40px", boxShadow: "0 24px 64px rgba(0,0,0,0.08)", position: "relative" }}>
        <div style={{ textAlign: "center", marginBottom: 32 }}>
          <LogoImg variant="dark" height={90} style={{ margin: "0 auto 16px", display: "block" }} />



          <div style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "5px 14px", borderRadius: 20, background: "rgba(10,126,140,0.08)", border: "1px solid rgba(10,126,140,0.15)", marginBottom: 16 }}>
            <span style={{ fontSize: 12, fontWeight: 700, color: "#0A7E8C", letterSpacing: "0.06em" }}>PARENT PORTAL</span>
          </div>
          <h1 style={{ fontFamily: "'Nunito',sans-serif", fontWeight: 900, fontSize: 24, color: "#1a1a2e", marginBottom: 6 }}>{t("welcome")}</h1>
          <p style={{ fontSize: 14, color: "#64748b" }}>{t("choose_language")} / Use Patient ID</p>
        </div>

        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div>
            <label style={{ fontSize: 13, fontWeight: 600, color: "#374151", display: "block", marginBottom: 6 }}>{t("patient_id")}</label>
            <div style={{ position: "relative" }}>
              <Hash size={15} style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", color: "#9CA3AF" }} />
              <input
                value={uniqueId} onChange={e => setUniqueId(e.target.value.toUpperCase())}
                placeholder="UC-XXXX"
                required
                style={{ width: "100%", padding: "12px 14px 12px 40px", borderRadius: 10, background: "#f8fafc", border: "1.5px solid #e2e8f0", color: "#1e293b", fontSize: 15, fontWeight: 700, letterSpacing: "0.05em", outline: "none", boxSizing: "border-box", fontFamily: "'DM Sans',sans-serif" }}
                onFocus={e => e.target.style.borderColor = "#0A7E8C"}
                onBlur={e => e.target.style.borderColor = "#e2e8f0"}
              />
            </div>
          </div>

          <div>
            <label style={{ fontSize: 13, fontWeight: 600, color: "#374151", display: "block", marginBottom: 6 }}>{t("pin")}</label>
            <div style={{ position: "relative" }}>
              <Lock size={15} style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", color: "#9CA3AF" }} />
              <input
                type="password" value={pin} onChange={e => setPin(e.target.value.replace(/\D/g,"").slice(0,4))}
                placeholder="••••" maxLength={4}
                required
                style={{ width: "100%", padding: "12px 14px 12px 40px", borderRadius: 10, background: "#f8fafc", border: "1.5px solid #e2e8f0", color: "#1e293b", fontSize: 22, letterSpacing: "0.3em", outline: "none", boxSizing: "border-box", fontFamily: "'DM Sans',sans-serif" }}
                onFocus={e => e.target.style.borderColor = "#0A7E8C"}
                onBlur={e => e.target.style.borderColor = "#e2e8f0"}
              />
            </div>
          </div>

          {error && (
            <div style={{ padding: "10px 14px", borderRadius: 8, background: "#fef2f2", border: "1px solid #fecaca", color: "#dc2626", fontSize: 13 }}>
              {error}
            </div>
          )}

          <button type="submit" disabled={loading} style={{
            width: "100%", padding: 14, borderRadius: 10, border: "none", cursor: loading ? "not-allowed" : "pointer",
            background: "linear-gradient(135deg,#0A7E8C,#6B3FA0)", color: "white", fontSize: 15, fontWeight: 700,
            display: "flex", alignItems: "center", justifyContent: "center", gap: 8, marginTop: 4,
            fontFamily: "'DM Sans',sans-serif",
          }}>
            {loading ? <><div style={{ width: 18, height: 18, border: "2px solid rgba(255,255,255,0.3)", borderTop: "2px solid white", borderRadius: "50%", animation: "spin 0.7s linear infinite" }} /> {t("logging_in")}</> : <>{t("login_button")} <ArrowRight size={15} /></>}
          </button>
          
          <div style={{ textAlign: "center", marginTop: 4 }}>
            <a href="/portal/forgot-password" style={{ color: "#64748b", fontSize: 13, textDecoration: "none" }}>{t("forgot_pin")}</a>
          </div>
        </form>

        <div style={{ marginTop: 28, textAlign: "center", paddingTop: 24, borderTop: "1px solid #f1f5f9", fontSize: 13, color: "#94a3b8" }}>
          {t("no_id")} <a href="https://wa.me/" style={{ color: "#0A7E8C", textDecoration: "none", fontWeight: 600 }}>{t("contact_clinic")}</a>
        </div>
      </div>
      <style>{`@keyframes spin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}`}</style>
    </div>
  );
}
