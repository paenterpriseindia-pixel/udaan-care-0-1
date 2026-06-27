"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, UserPlus, Save, AlertCircle } from "lucide-react";

export default function NewStaffPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    role: "DOCTOR",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const res = await fetch("/api/admin/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await res.json();

      if (!res.ok) throw new Error(data.error || "Failed to create staff member");

      setSuccess("Staff member created successfully!");
      setTimeout(() => router.push("/admin/staff"), 1500);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: 600, margin: "0 auto", padding: 24, fontFamily: "'DM Sans', sans-serif" }}>
      <button 
        onClick={() => router.back()}
        style={{ display: "flex", alignItems: "center", gap: 8, background: "none", border: "none", color: "rgba(255,255,255,0.6)", cursor: "pointer", marginBottom: 24, padding: 0, fontWeight: 500 }}
      >
        <ArrowLeft size={16} /> Back to Staff
      </button>

      <div style={{ background: "rgba(255,255,255,0.03)", borderRadius: 16, border: "1px solid rgba(255,255,255,0.07)", overflow: "hidden", boxShadow: "0 4px 6px -1px rgba(0,0,0,0.2)" }}>
        <div style={{ padding: "20px 24px", borderBottom: "1px solid rgba(255,255,255,0.05)", display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ width: 40, height: 40, borderRadius: 10, background: "rgba(26,175,230,0.1)", display: "flex", alignItems: "center", justifyContent: "center", color: "#1AAFE6" }}>
            <UserPlus size={20} />
          </div>
          <div>
            <h2 style={{ margin: 0, fontSize: 18, fontWeight: 700, color: "white" }}>Onboard New Staff</h2>
            <p style={{ margin: "2px 0 0 0", fontSize: 13, color: "rgba(255,255,255,0.5)" }}>Create an account for a new doctor or admin.</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} style={{ padding: 24, display: "flex", flexDirection: "column", gap: 20 }}>
          {error && (
            <div style={{ padding: 12, borderRadius: 8, background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.3)", color: "#EF4444", fontSize: 14, display: "flex", alignItems: "center", gap: 8 }}>
              <AlertCircle size={16} /> {error}
            </div>
          )}
          {success && (
            <div style={{ padding: 12, borderRadius: 8, background: "rgba(34,197,94,0.1)", border: "1px solid rgba(34,197,94,0.3)", color: "#22c55e", fontSize: 14 }}>
              {success}
            </div>
          )}

          <div>
            <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "rgba(255,255,255,0.7)", marginBottom: 6 }}>Full Name *</label>
            <input 
              type="text" required value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })}
              style={{ width: "100%", padding: "10px 14px", borderRadius: 8, background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", outline: "none", fontSize: 14, boxSizing: "border-box", color: "white" }}
              placeholder="Dr. John Doe"
            />
          </div>

          <div className="grid-responsive-2" style={{ gap: 16 }}>
            <div>
              <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "rgba(255,255,255,0.7)", marginBottom: 6 }}>Email Address *</label>
              <input 
                type="email" required value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })}
                style={{ width: "100%", padding: "10px 14px", borderRadius: 8, background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", outline: "none", fontSize: 14, boxSizing: "border-box", color: "white" }}
                placeholder="john@udaancare.in"
              />
            </div>
            <div>
              <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "rgba(255,255,255,0.7)", marginBottom: 6 }}>Phone Number</label>
              <input 
                type="text" value={formData.phone} onChange={e => setFormData({ ...formData, phone: e.target.value })}
                style={{ width: "100%", padding: "10px 14px", borderRadius: 8, background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", outline: "none", fontSize: 14, boxSizing: "border-box", color: "white" }}
                placeholder="+91 9876543210"
              />
            </div>
          </div>

          <div className="grid-responsive-2" style={{ gap: 16 }}>
            <div>
              <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "rgba(255,255,255,0.7)", marginBottom: 6 }}>Temporary Password *</label>
              <input 
                type="password" required value={formData.password} onChange={e => setFormData({ ...formData, password: e.target.value })}
                style={{ width: "100%", padding: "10px 14px", borderRadius: 8, background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", outline: "none", fontSize: 14, boxSizing: "border-box", color: "white" }}
                placeholder="••••••••"
              />
            </div>
            <div>
              <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "rgba(255,255,255,0.7)", marginBottom: 6 }}>Role</label>
              <select 
                value={formData.role} onChange={e => setFormData({ ...formData, role: e.target.value })}
                style={{ width: "100%", padding: "10px 14px", borderRadius: 8, background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", outline: "none", fontSize: 14, boxSizing: "border-box", color: "white" }}
              >
                <option value="DOCTOR" style={{ background: "#111827" }}>Doctor</option>
                <option value="ADMIN" style={{ background: "#111827" }}>Admin</option>
              </select>
            </div>
          </div>

          <button 
            type="submit" disabled={loading}
            style={{ 
              marginTop: 12, padding: "12px", borderRadius: 8, border: "none", background: "linear-gradient(135deg, #1AAFE6, #6B3FA0)", 
              color: "white", fontSize: 15, fontWeight: 700, cursor: loading ? "not-allowed" : "pointer", opacity: loading ? 0.7 : 1,
              display: "flex", alignItems: "center", justifyContent: "center", gap: 8 
            }}
          >
            {loading ? "Creating..." : <><Save size={18} /> Create Staff Account</>}
          </button>
        </form>
      </div>

      <style>{`
        @media (max-width: 600px) {
          .grid-responsive-2 { display: grid; grid-template-columns: 1fr; }
        }
        @media (min-width: 601px) {
          .grid-responsive-2 { display: grid; grid-template-columns: 1fr 1fr; }
        }
      `}</style>
    </div>
  );
}
