"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Mail } from "lucide-react";
import LogoImg from "@/components/shared/LogoImg";
import Link from "next/link";

export default function AdminForgotPassword() {
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
        body: JSON.stringify({ email, role: "ADMIN" }),
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
    <div style={{
      minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center",
      background: "linear-gradient(135deg, #0D1117 0%, #0A1628 50%, #0D1117 100%)",
      padding: 24, fontFamily: "'DM Sans', sans-serif",
    }}>
      <div style={{
        width: "100%", maxWidth: 420,
        background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)",
        borderRadius: 24, padding: "44px 40px", backdropFilter: "blur(20px)",
        boxShadow: "0 32px 80px rgba(0,0,0,0.4)", position: "relative",
      }}>
        <div style={{ textAlign: "center", marginBottom: 32 }}>
          <LogoImg variant="light" height={100} style={{ margin: "0 auto 20px", display: "block" }} />
          <h1 style={{ fontFamily: "'Nunito', sans-serif", fontWeight: 900, fontSize: 24, color: "white", marginBottom: 6 }}>Forgot Password</h1>
          <p style={{ fontSize: 14, color: "rgba(255,255,255,0.45)" }}>Enter your email to receive a reset link.</p>
        </div>

        {success ? (
          <div style={{ textAlign: "center" }}>
            <div style={{ padding: "16px", borderRadius: 12, background: "rgba(10,126,140,0.15)", border: "1px solid rgba(10,126,140,0.3)", color: "#0D9BAC", marginBottom: 24 }}>
              If an account exists, a reset link has been sent to your email address. Please check your inbox.
            </div>
            <Link href="/admin/login" style={{ color: "white", textDecoration: "none", fontSize: 14, display: "inline-flex", alignItems: "center", gap: 6 }}>
              <ArrowLeft size={16} /> Back to Login
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <div>
              <label style={{ fontSize: 13, fontWeight: 600, color: "rgba(255,255,255,0.6)", display: "block", marginBottom: 8 }}>Registered Email</label>
              <div style={{ position: "relative" }}>
                <Mail size={15} style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", color: "rgba(255,255,255,0.3)" }} />
                <input
                  type="email" value={email} onChange={e => setEmail(e.target.value)} required
                  placeholder="admin@example.com"
                  style={{
                    width: "100%", padding: "12px 14px 12px 40px", borderRadius: 10,
                    background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)",
                    color: "white", fontSize: 14, outline: "none", boxSizing: "border-box", transition: "border-color 0.2s",
                  }}
                  onFocus={e => e.target.style.borderColor = "rgba(10,126,140,0.6)"}
                  onBlur={e => e.target.style.borderColor = "rgba(255,255,255,0.1)"}
                />
              </div>
            </div>

            {error && (
              <div style={{ padding: "10px 14px", borderRadius: 8, background: "rgba(220,38,38,0.1)", border: "1px solid rgba(220,38,38,0.3)", color: "#fca5a5", fontSize: 13 }}>
                {error}
              </div>
            )}

            <button type="submit" disabled={loading} style={{
              width: "100%", padding: 14, borderRadius: 10, border: "none", cursor: loading ? "not-allowed" : "pointer",
              background: "linear-gradient(135deg, #0A7E8C, #6B3FA0)", color: "white", fontSize: 15, fontWeight: 700,
              fontFamily: "'DM Sans', sans-serif", marginTop: 8
            }}>
              {loading ? "Sending..." : "Send Reset Link"}
            </button>
            
            <div style={{ textAlign: "center", marginTop: 12 }}>
              <Link href="/admin/login" style={{ color: "rgba(255,255,255,0.45)", textDecoration: "none", fontSize: 13 }}>
                Back to Login
              </Link>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
