"use client";
import { useEffect, useState } from "react";
import { CreditCard, Search, ExternalLink, Calendar, CheckCircle, XCircle } from "lucide-react";

type Payment = {
  id: string;
  amount: number;
  currency: string;
  status: string; // "captured", "failed", "created", "authorized"
  method: string;
  email: string;
  contact: string;
  created_at: number;
  error_description?: string;
};

export default function AdminPaymentsPage() {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const load = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/admin/payments");
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to load");
      setPayments(data.payments || []);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  return (
    <div style={{ padding: "40px 48px", maxWidth: 1200, margin: "0 auto" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 32 }}>
        <div>
          <h1 style={{ fontFamily: "'Nunito',sans-serif", fontWeight: 800, fontSize: 32, color: "white", marginBottom: 8, display: "flex", alignItems: "center", gap: 12 }}>
            <CreditCard size={32} style={{ color: "var(--color-primary)" }} />
            Payments Hub
          </h1>
          <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 15, color: "rgba(255,255,255,0.6)" }}>
            Real-time feed of all transactions directly from Razorpay.
          </p>
        </div>
        <a 
          href="https://dashboard.razorpay.com/" 
          target="_blank" 
          rel="noopener noreferrer"
          style={{ 
            display: "inline-flex", alignItems: "center", gap: 8, padding: "10px 20px", 
            borderRadius: 12, background: "rgba(26,175,230,0.1)", color: "var(--color-primary)", 
            fontFamily: "'Nunito',sans-serif", fontWeight: 700, fontSize: 14, textDecoration: "none",
            border: "1px solid rgba(26,175,230,0.3)"
          }}
        >
          Open Razorpay Dashboard <ExternalLink size={14} />
        </a>
      </div>

      {error ? (
        <div style={{ background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.3)", padding: 20, borderRadius: 12, color: "#ef4444", fontFamily: "'DM Sans',sans-serif" }}>
          <strong>Error:</strong> {error}
          <br /><br />
          <em style={{ opacity: 0.8 }}>Did you add your `RAZORPAY_KEY_SECRET` in Vercel?</em>
        </div>
      ) : loading ? (
        <div style={{ color: "rgba(255,255,255,0.5)", fontFamily: "'DM Sans',sans-serif" }}>Loading payments...</div>
      ) : (
        <div style={{ background: "var(--color-surface)", borderRadius: 16, border: "1px solid var(--color-border)", overflow: "hidden" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontFamily: "'DM Sans',sans-serif", fontSize: 14 }}>
            <thead>
              <tr style={{ background: "rgba(0,0,0,0.2)", borderBottom: "1px solid var(--color-border)" }}>
                <th style={{ textAlign: "left", padding: "16px 20px", color: "rgba(255,255,255,0.4)", fontWeight: 600, letterSpacing: "0.05em", textTransform: "uppercase", fontSize: 11 }}>Date & Time</th>
                <th style={{ textAlign: "left", padding: "16px 20px", color: "rgba(255,255,255,0.4)", fontWeight: 600, letterSpacing: "0.05em", textTransform: "uppercase", fontSize: 11 }}>Customer</th>
                <th style={{ textAlign: "left", padding: "16px 20px", color: "rgba(255,255,255,0.4)", fontWeight: 600, letterSpacing: "0.05em", textTransform: "uppercase", fontSize: 11 }}>Amount</th>
                <th style={{ textAlign: "left", padding: "16px 20px", color: "rgba(255,255,255,0.4)", fontWeight: 600, letterSpacing: "0.05em", textTransform: "uppercase", fontSize: 11 }}>Method</th>
                <th style={{ textAlign: "left", padding: "16px 20px", color: "rgba(255,255,255,0.4)", fontWeight: 600, letterSpacing: "0.05em", textTransform: "uppercase", fontSize: 11 }}>Status</th>
              </tr>
            </thead>
            <tbody>
              {payments.map(p => {
                const isSuccess = p.status === "captured" || p.status === "authorized";
                const isFailed = p.status === "failed";
                
                return (
                  <tr key={p.id} style={{ borderBottom: "1px solid rgba(255,255,255,0.05)", transition: "background 0.2s" }} onMouseEnter={e => e.currentTarget.style.background = "rgba(255,255,255,0.02)"} onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
                    <td style={{ padding: "16px 20px" }}>
                      <div style={{ color: "rgba(255,255,255,0.9)", display: "flex", alignItems: "center", gap: 8 }}>
                        <Calendar size={14} style={{ color: "rgba(255,255,255,0.4)" }} />
                        {new Date(p.created_at * 1000).toLocaleString("en-IN", { day: "numeric", month: "short", hour: "numeric", minute: "2-digit" })}
                      </div>
                      <div style={{ fontSize: 12, color: "rgba(255,255,255,0.3)", marginTop: 4, fontFamily: "monospace" }}>{p.id}</div>
                    </td>
                    <td style={{ padding: "16px 20px" }}>
                      <div style={{ color: "rgba(255,255,255,0.9)" }}>{p.contact}</div>
                      <div style={{ fontSize: 12, color: "rgba(255,255,255,0.4)", marginTop: 4 }}>{p.email}</div>
                    </td>
                    <td style={{ padding: "16px 20px" }}>
                      <div style={{ fontFamily: "'Nunito',sans-serif", fontWeight: 700, fontSize: 16, color: "white" }}>
                        ₹{(p.amount / 100).toLocaleString("en-IN")}
                      </div>
                    </td>
                    <td style={{ padding: "16px 20px" }}>
                      <span style={{ background: "rgba(255,255,255,0.1)", padding: "4px 8px", borderRadius: 4, fontSize: 12, textTransform: "uppercase", letterSpacing: "0.05em", color: "rgba(255,255,255,0.7)" }}>
                        {p.method}
                      </span>
                    </td>
                    <td style={{ padding: "16px 20px" }}>
                      <div style={{ 
                        display: "inline-flex", alignItems: "center", gap: 6, padding: "6px 12px", borderRadius: 20, fontSize: 12, fontWeight: 600, textTransform: "capitalize",
                        background: isSuccess ? "rgba(34,197,94,0.15)" : isFailed ? "rgba(239,68,68,0.15)" : "rgba(255,255,255,0.1)",
                        color: isSuccess ? "#4ade80" : isFailed ? "#f87171" : "rgba(255,255,255,0.6)",
                        border: `1px solid ${isSuccess ? "rgba(34,197,94,0.3)" : isFailed ? "rgba(239,68,68,0.3)" : "rgba(255,255,255,0.1)"}`
                      }}>
                        {isSuccess ? <CheckCircle size={14} /> : isFailed ? <XCircle size={14} /> : <div style={{ width: 6, height: 6, borderRadius: "50%", background: "currentColor" }} />}
                        {p.status}
                      </div>
                      {isFailed && p.error_description && (
                        <div style={{ fontSize: 11, color: "#f87171", marginTop: 6, maxWidth: 200, opacity: 0.8 }}>
                          {p.error_description}
                        </div>
                      )}
                    </td>
                  </tr>
                );
              })}
              {payments.length === 0 && (
                <tr>
                  <td colSpan={5} style={{ padding: "40px", textAlign: "center", color: "rgba(255,255,255,0.4)" }}>
                    No payments found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
