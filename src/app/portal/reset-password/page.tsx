"use client";
import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Lock } from "lucide-react";
import LogoImg from "@/components/shared/LogoImg";

function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const [pin, setPin] = useState("");
  const [confirmPin, setConfirmPin] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!token) setError("Invalid or missing reset token.");
  }, [token]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (pin !== confirmPin) {
      setError("PINs do not match");
      return;
    }
    if (pin.length !== 4) {
      setError("PIN must be exactly 4 digits");
      return;
    }
    
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, newPassword: pin }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to reset PIN");

      setSuccess(true);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ width: "100%", maxWidth: 420, background: "white", borderRadius: 24, padding: "44px 40px", boxShadow: "0 24px 64px rgba(0,0,0,0.08)", position: "relative" }}>
      <div style={{ textAlign: "center", marginBottom: 32 }}>
        <LogoImg variant="dark" height={80} style={{ margin: "0 auto 16px", display: "block" }} />
        <h1 style={{ fontFamily: "'Nunito',sans-serif", fontWeight: 900, fontSize: 24, color: "#1a1a2e", marginBottom: 6 }}>Set New PIN</h1>
        <p style={{ fontSize: 14, color: "#64748b" }}>Enter a new 4-digit PIN for your account.</p>
      </div>

      {success ? (
        <div style={{ textAlign: "center" }}>
          <div style={{ padding: "16px", borderRadius: 12, background: "#f0fdf4", border: "1px solid #bbf7d0", color: "#166534", marginBottom: 24 }}>
            PIN updated successfully. You can now login.
          </div>
          <button onClick={() => router.push("/portal/login")} style={{
            width: "100%", padding: 14, borderRadius: 10, border: "none", cursor: "pointer",
            background: "linear-gradient(135deg,#0A7E8C,#6B3FA0)", color: "white", fontSize: 15, fontWeight: 700,
          }}>
            Go to Login
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div>
            <label style={{ fontSize: 13, fontWeight: 600, color: "#374151", display: "block", marginBottom: 6 }}>New 4-Digit PIN</label>
            <div style={{ position: "relative" }}>
              <Lock size={15} style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", color: "#9CA3AF" }} />
              <input
                type="password" value={pin} onChange={e => setPin(e.target.value.replace(/\D/g,"").slice(0,4))} required maxLength={4}
                placeholder="••••"
                style={{ width: "100%", padding: "12px 14px 12px 40px", borderRadius: 10, background: "#f8fafc", border: "1.5px solid #e2e8f0", color: "#1e293b", fontSize: 22, letterSpacing: "0.3em", outline: "none", boxSizing: "border-box", fontFamily: "'DM Sans',sans-serif" }}
                onFocus={e => e.target.style.borderColor = "#0A7E8C"}
                onBlur={e => e.target.style.borderColor = "#e2e8f0"}
              />
            </div>
          </div>

          <div>
            <label style={{ fontSize: 13, fontWeight: 600, color: "#374151", display: "block", marginBottom: 6 }}>Confirm PIN</label>
            <div style={{ position: "relative" }}>
              <Lock size={15} style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", color: "#9CA3AF" }} />
              <input
                type="password" value={confirmPin} onChange={e => setConfirmPin(e.target.value.replace(/\D/g,"").slice(0,4))} required maxLength={4}
                placeholder="••••"
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

          <button type="submit" disabled={loading || !token} style={{
            width: "100%", padding: 14, borderRadius: 10, border: "none", cursor: (loading || !token) ? "not-allowed" : "pointer",
            background: "linear-gradient(135deg,#0A7E8C,#6B3FA0)", color: "white", fontSize: 15, fontWeight: 700,
            fontFamily: "'DM Sans',sans-serif", marginTop: 8
          }}>
            {loading ? "Updating..." : "Update PIN"}
          </button>
        </form>
      )}
    </div>
  );
}

export default function PortalResetPassword() {
  return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "linear-gradient(135deg, #f0f9ff 0%, #e8f4f8 50%, #f5f0ff 100%)", padding: 24, fontFamily: "'DM Sans',sans-serif" }}>
      <div style={{ position: "fixed", top: -100, right: -100, width: 400, height: 400, borderRadius: "50%", background: "radial-gradient(circle, rgba(10,126,140,0.08), transparent 70%)", pointerEvents: "none" }} />
      <Suspense fallback={<div>Loading...</div>}>
        <ResetPasswordForm />
      </Suspense>
    </div>
  );
}
