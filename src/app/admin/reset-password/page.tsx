"use client";
import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Lock } from "lucide-react";
import LogoImg from "@/components/shared/LogoImg";
import Link from "next/link";

function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!token) setError("Invalid or missing reset token.");
  }, [token]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, newPassword: password }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to reset password");

      setSuccess(true);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      width: "100%", maxWidth: 420,
      background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)",
      borderRadius: 24, padding: "44px 40px", backdropFilter: "blur(20px)",
      boxShadow: "0 32px 80px rgba(0,0,0,0.4)", position: "relative",
    }}>
      <div style={{ textAlign: "center", marginBottom: 32 }}>
        <LogoImg variant="light" height={100} style={{ margin: "0 auto 20px", display: "block" }} />
        <h1 style={{ fontFamily: "'Nunito', sans-serif", fontWeight: 900, fontSize: 24, color: "white", marginBottom: 6 }}>Set New Password</h1>
        <p style={{ fontSize: 14, color: "rgba(255,255,255,0.45)" }}>Enter a secure new password.</p>
      </div>

      {success ? (
        <div style={{ textAlign: "center" }}>
          <div style={{ padding: "16px", borderRadius: 12, background: "rgba(10,126,140,0.15)", border: "1px solid rgba(10,126,140,0.3)", color: "#0D9BAC", marginBottom: 24 }}>
            Password updated successfully. You can now login.
          </div>
          <button onClick={() => router.push("/admin/login")} style={{
            width: "100%", padding: 14, borderRadius: 10, border: "none", cursor: "pointer",
            background: "linear-gradient(135deg, #0A7E8C, #6B3FA0)", color: "white", fontSize: 15, fontWeight: 700,
          }}>
            Go to Login
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div>
            <label style={{ fontSize: 13, fontWeight: 600, color: "rgba(255,255,255,0.6)", display: "block", marginBottom: 8 }}>New Password</label>
            <div style={{ position: "relative" }}>
              <Lock size={15} style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", color: "rgba(255,255,255,0.3)" }} />
              <input
                type="password" value={password} onChange={e => setPassword(e.target.value)} required minLength={8}
                placeholder="••••••••"
                style={{
                  width: "100%", padding: "12px 14px 12px 40px", borderRadius: 10,
                  background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)",
                  color: "white", fontSize: 14, outline: "none", boxSizing: "border-box", transition: "border-color 0.2s",
                }}
              />
            </div>
          </div>

          <div>
            <label style={{ fontSize: 13, fontWeight: 600, color: "rgba(255,255,255,0.6)", display: "block", marginBottom: 8 }}>Confirm Password</label>
            <div style={{ position: "relative" }}>
              <Lock size={15} style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", color: "rgba(255,255,255,0.3)" }} />
              <input
                type="password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} required minLength={8}
                placeholder="••••••••"
                style={{
                  width: "100%", padding: "12px 14px 12px 40px", borderRadius: 10,
                  background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)",
                  color: "white", fontSize: 14, outline: "none", boxSizing: "border-box", transition: "border-color 0.2s",
                }}
              />
            </div>
          </div>

          {error && (
            <div style={{ padding: "10px 14px", borderRadius: 8, background: "rgba(220,38,38,0.1)", border: "1px solid rgba(220,38,38,0.3)", color: "#fca5a5", fontSize: 13 }}>
              {error}
            </div>
          )}

          <button type="submit" disabled={loading || !token} style={{
            width: "100%", padding: 14, borderRadius: 10, border: "none", cursor: (loading || !token) ? "not-allowed" : "pointer",
            background: "linear-gradient(135deg, #0A7E8C, #6B3FA0)", color: "white", fontSize: 15, fontWeight: 700,
            fontFamily: "'DM Sans', sans-serif", marginTop: 8
          }}>
            {loading ? "Updating..." : "Update Password"}
          </button>
        </form>
      )}
    </div>
  );
}

export default function AdminResetPassword() {
  return (
    <div style={{
      minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center",
      background: "linear-gradient(135deg, #0D1117 0%, #0A1628 50%, #0D1117 100%)",
      padding: 24, fontFamily: "'DM Sans', sans-serif",
    }}>
      <Suspense fallback={<div style={{ color: "white" }}>Loading...</div>}>
        <ResetPasswordForm />
      </Suspense>
    </div>
  );
}
