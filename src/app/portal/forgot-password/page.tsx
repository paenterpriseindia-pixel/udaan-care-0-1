"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Mail } from "lucide-react";
import LogoImg from "@/components/shared/LogoImg";
import Link from "next/link";

export default function PortalForgotPassword() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, role: "PARENT" }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to send reset link");

      setSuccess(true);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "linear-gradient(135deg, #f0f9ff 0%, #e8f4f8 50%, #f5f0ff 100%)", padding: 24, fontFamily: "'DM Sans',sans-serif" }}>
      <div style={{ position: "fixed", top: -100, right: -100, width: 400, height: 400, borderRadius: "50%", background: "radial-gradient(circle, rgba(10,126,140,0.08), transparent 70%)", pointerEvents: "none" }} />

      <div style={{ width: "100%", maxWidth: 420, background: "white", borderRadius: 24, padding: "44px 40px", boxShadow: "0 24px 64px rgba(0,0,0,0.08)", position: "relative" }}>
        <div style={{ textAlign: "center", marginBottom: 32 }}>
          <LogoImg variant="dark" height={80} style={{ margin: "0 auto 16px", display: "block" }} />
          <h1 style={{ fontFamily: "'Nunito',sans-serif", fontWeight: 900, fontSize: 24, color: "#1a1a2e", marginBottom: 6 }}>Reset PIN</h1>
          <p style={{ fontSize: 14, color: "#64748b" }}>Enter your registered email to reset your 4-digit PIN.</p>
        </div>

        {success ? (
          <div style={{ textAlign: "center" }}>
            <div style={{ padding: "16px", borderRadius: 12, background: "#f0fdf4", border: "1px solid #bbf7d0", color: "#166534", marginBottom: 24 }}>
              If an account exists, a reset link has been sent to your email address. Please check your inbox.
            </div>
            <Link href="/portal/login" style={{ color: "#0A7E8C", textDecoration: "none", fontSize: 14, display: "inline-flex", alignItems: "center", gap: 6 }}>
              <ArrowLeft size={16} /> Back to Login
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <div>
              <label style={{ fontSize: 13, fontWeight: 600, color: "#374151", display: "block", marginBottom: 6 }}>Registered Email</label>
              <div style={{ position: "relative" }}>
                <Mail size={15} style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", color: "#9CA3AF" }} />
                <input
                  type="email" value={email} onChange={e => setEmail(e.target.value)} required
                  placeholder="guardian@example.com"
                  style={{ width: "100%", padding: "12px 14px 12px 40px", borderRadius: 10, background: "#f8fafc", border: "1.5px solid #e2e8f0", color: "#1e293b", fontSize: 15, outline: "none", boxSizing: "border-box", fontFamily: "'DM Sans',sans-serif" }}
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
              {loading ? "Sending..." : "Send Reset Link"}
            </button>
            
            <div style={{ textAlign: "center", marginTop: 12 }}>
              <Link href="/portal/login" style={{ color: "#64748b", textDecoration: "none", fontSize: 13 }}>
                Back to Login
              </Link>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
