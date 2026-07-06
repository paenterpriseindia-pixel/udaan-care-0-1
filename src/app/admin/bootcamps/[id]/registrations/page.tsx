"use client";
import { useEffect, useState } from "react";
import { ArrowLeft, Download, CheckCircle, XCircle } from "lucide-react";
import Link from "next/link";
import type { BootcampRegistration } from "@/lib/db";

export default function BootcampRegistrationsPage({ params }: { params: { id: string } }) {
  const [registrations, setRegistrations] = useState<BootcampRegistration[]>([]);
  const [loading, setLoading] = useState(true);
  const [bootcampName, setBootcampName] = useState("Program");

  const load = async () => {
    try {
      const res = await fetch(`/api/admin/bootcamps/${params.id}/registrations`);
      const data = await res.json();
      setRegistrations(Array.isArray(data.registrations) ? data.registrations : []);
      if (data.bootcamp?.title) setBootcampName(data.bootcamp.title);
    } catch (e) {
      console.error(e);
    }
    setLoading(false);
  };
  useEffect(() => { load(); }, []);

  const downloadCSV = () => {
    if (!registrations.length) return;
    const headers = ["Date", "Parent", "Email", "Phone", "Child Name", "Age", "Amount", "Currency", "Status"];
    const rows = registrations.map(r => [
      new Date(r.createdAt).toLocaleDateString(),
      `"${r.parentName}"`, r.email, r.phone,
      `"${r.childName || ''}"`, r.childAge || '',
      r.amountPaid, r.currency, r.paymentStatus
    ]);
    const csv = [headers.join(","), ...rows.map(r => r.join(","))].join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `registrations-${params.id}.csv`;
    a.click();
  };

  const markAttended = async (id: string, attended: boolean) => {
    await fetch(`/api/admin/bootcamps/${params.id}/registrations/${id}`, {
      method: "PUT", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ attended }),
    });
    load();
  };

  return (
    <div>
      <div style={{ display: "flex", alignItems: "flex-start", gap: 12, marginBottom: 24, flexWrap: "wrap" }}>
        <Link href="/admin/bootcamps" style={{ minWidth: 48, minHeight: 48, display: "flex", alignItems: "center", justifyContent: "center", background: "rgba(255,255,255,0.05)", borderRadius: 10, color: "white", textDecoration: "none", flexShrink: 0 }}>
          <ArrowLeft size={18} />
        </Link>
        <div style={{ flex: 1, minWidth: 200 }}>
          <h1 style={{ fontFamily: "'Nunito',sans-serif", fontWeight: 900, fontSize: 22, color: "white", margin: 0 }}>Registrations</h1>
          <p style={{ fontSize: 13, color: "rgba(255,255,255,0.5)", marginTop: 2 }}>{bootcampName} · {registrations.length} total</p>
        </div>
        <button onClick={downloadCSV} style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "0 16px", minHeight: 48, borderRadius: 10, border: "1px solid rgba(255,255,255,0.1)", background: "rgba(0,0,0,0.3)", color: "white", fontSize: 14, fontWeight: 600, cursor: "pointer" }}>
          <Download size={16} /> Export CSV
        </button>
      </div>

      {loading ? (
        <div style={{ textAlign: "center", padding: 48, color: "rgba(255,255,255,0.3)" }}>Loading…</div>
      ) : registrations.length === 0 ? (
        <div style={{ textAlign: "center", padding: 64 }}>
          <div style={{ fontSize: 48, marginBottom: 16 }}>📋</div>
          <div style={{ fontSize: 16, color: "rgba(255,255,255,0.4)" }}>No registrations yet.</div>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {registrations.map(r => (
            <div key={r.id} style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 12, padding: "16px", display: "flex", flexDirection: "column", gap: 12 }}>
              
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                <div>
                  <h3 style={{ margin: 0, fontSize: 16, fontWeight: 700, color: "white", fontFamily: "'Nunito',sans-serif" }}>
                    {r.parentName}
                  </h3>
                  <div style={{ fontSize: 13, color: "rgba(255,255,255,0.6)", marginTop: 4 }}>
                    {r.phone} · {r.email}
                  </div>
                </div>
                <div style={{ background: r.paymentStatus === "SUCCESS" ? "rgba(34,197,94,0.15)" : "rgba(239,68,68,0.15)", color: r.paymentStatus === "SUCCESS" ? "#4ADE80" : "#F87171", padding: "4px 8px", borderRadius: 6, fontSize: 11, fontWeight: 700, letterSpacing: "0.05em" }}>
                  {r.paymentStatus}
                </div>
              </div>

              {r.childName && (
                <div style={{ fontSize: 13, color: "rgba(255,255,255,0.5)", background: "rgba(0,0,0,0.2)", padding: "8px 12px", borderRadius: 8 }}>
                  Child: <span style={{ color: "white" }}>{r.childName} ({r.childAge} yrs)</span>
                </div>
              )}

              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 4 }}>
                <div style={{ fontSize: 13, color: "rgba(255,255,255,0.5)" }}>
                  {r.currency} {r.amountPaid} · {new Date(r.createdAt).toLocaleDateString()}
                </div>
                <button onClick={() => markAttended(r.id, !r.attended)} style={{ display: "flex", alignItems: "center", gap: 6, background: "none", border: "none", color: r.attended ? "#4ADE80" : "rgba(255,255,255,0.3)", fontSize: 13, cursor: "pointer", padding: "8px" }}>
                  {r.attended ? <CheckCircle size={16} /> : <XCircle size={16} />}
                  {r.attended ? "Attended" : "Mark Attended"}
                </button>
              </div>

            </div>
          ))}
        </div>
      )}
    </div>
  );
}
