"use client";
import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Hash, Lock, ArrowRight } from "lucide-react";
import LogoImg from "@/components/shared/LogoImg";


export default function ParentPortalLogin() {
  const router = useRouter();
  const [uniqueId, setUniqueId] = useState("");
  const [pin, setPin] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

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
    else setError("Invalid Patient ID or PIN. Please contact the clinic.");
  };

  return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "linear-gradient(135deg, #f0f9ff 0%, #e8f4f8 50%, #f5f0ff 100%)", padding: 24, fontFamily: "'DM Sans',sans-serif" }}>
      <div style={{ position: "fixed", top: -100, right: -100, width: 400, height: 400, borderRadius: "50%", background: "radial-gradient(circle, rgba(10,126,140,0.08), transparent 70%)", pointerEvents: "none" }} />

      <div style={{ width: "100%", maxWidth: 420, background: "white", borderRadius: 24, padding: "44px 40px", boxShadow: "0 24px 64px rgba(0,0,0,0.08)", position: "relative" }}>
        <div style={{ textAlign: "center", marginBottom: 32 }}>
          <LogoImg variant="dark" height={90} style={{ margin: "0 auto 16px", display: "block" }} />



          <div style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "5px 14px", borderRadius: 20, background: "rgba(10,126,140,0.08)", border: "1px solid rgba(10,126,140,0.15)", marginBottom: 16 }}>
            <span style={{ fontSize: 12, fontWeight: 700, color: "#0A7E8C", letterSpacing: "0.06em" }}>PARENT PORTAL</span>
          </div>
          <h1 style={{ fontFamily: "'Nunito',sans-serif", fontWeight: 900, fontSize: 24, color: "#1a1a2e", marginBottom: 6 }}>Track your child's progress</h1>
          <p style={{ fontSize: 14, color: "#64748b" }}>Use the Patient ID and PIN provided by the clinic</p>
        </div>

        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div>
            <label style={{ fontSize: 13, fontWeight: 600, color: "#374151", display: "block", marginBottom: 6 }}>Patient ID</label>
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
            <label style={{ fontSize: 13, fontWeight: 600, color: "#374151", display: "block", marginBottom: 6 }}>4-Digit PIN</label>
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
            {loading ? <><div style={{ width: 18, height: 18, border: "2px solid rgba(255,255,255,0.3)", borderTop: "2px solid white", borderRadius: "50%", animation: "spin 0.7s linear infinite" }} /> Logging in…</> : <>View Progress <ArrowRight size={15} /></>}
          </button>
          
          <div style={{ textAlign: "center", marginTop: 4 }}>
            <a href="/portal/forgot-password" style={{ color: "#64748b", fontSize: 13, textDecoration: "none" }}>Forgot PIN?</a>
          </div>
        </form>

        <div style={{ marginTop: 28, textAlign: "center", paddingTop: 24, borderTop: "1px solid #f1f5f9", fontSize: 13, color: "#94a3b8" }}>
          Don't have your ID? <a href="https://wa.me/" style={{ color: "#0A7E8C", textDecoration: "none", fontWeight: 600 }}>Contact Udaan Care</a>
        </div>
      </div>
      <style>{`@keyframes spin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}`}</style>
    </div>
  );
}
