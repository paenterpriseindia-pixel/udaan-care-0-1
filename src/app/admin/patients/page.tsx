"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { Search, UserPlus, Filter, ChevronRight } from "lucide-react";
import type { Patient } from "@/lib/db";

const STATUS_COLORS: Record<string, string> = { ACTIVE: "#22c55e", COMPLETED: "#0A7E8C", ON_HOLD: "#F5820D" };
const DIAGNOSES = ["ASD", "ADHD", "Sensory Processing", "Cerebral Palsy", "Down Syndrome", "Developmental Delay", "Fine Motor", "Gross Motor", "Other"];

export default function PatientsPage() {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [loading, setLoading] = useState(true);

  const load = () => {
    fetch("/api/admin/patients").then(r => r.json()).then(d => { setPatients(Array.isArray(d) ? d : []); setLoading(false); });
  };
  useEffect(load, []);

  const filtered = patients.filter(p => {
    const q = search.toLowerCase();
    const matchSearch = !q || p.name.toLowerCase().includes(q) || p.uniqueId.toLowerCase().includes(q) || p.guardianName.toLowerCase().includes(q) || p.guardianPhone.includes(q);
    const matchStatus = statusFilter === "ALL" || p.status === statusFilter;
    return matchSearch && matchStatus;
  });

  return (
    <div>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 12, marginBottom: 24 }}>
        <div>
          <h1 style={{ fontFamily: "'Nunito',sans-serif", fontWeight: 900, fontSize: 26, color: "white", marginBottom: 2 }}>Patients</h1>
          <p style={{ fontSize: 13, color: "rgba(255,255,255,0.4)" }}>{patients.length} total · {patients.filter(p => p.status === "ACTIVE").length} active</p>
        </div>
        <Link href="/admin/patients/new" style={{
          display: "inline-flex", alignItems: "center", gap: 8, padding: "11px 20px", borderRadius: 10,
          background: "linear-gradient(135deg,#0A7E8C,#6B3FA0)", color: "white",
          textDecoration: "none", fontSize: 14, fontWeight: 700,
        }}>
          <UserPlus size={15} /> Add Patient
        </Link>
      </div>

      {/* Search + Filter bar */}
      <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginBottom: 20 }}>
        <div style={{ position: "relative", flex: "1 1 260px" }}>
          <Search size={14} style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: "rgba(255,255,255,0.3)" }} />
          <input
            value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Search name, ID, guardian, phone…"
            style={{ width: "100%", padding: "10px 12px 10px 36px", borderRadius: 10, background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", color: "white", fontSize: 14, outline: "none", boxSizing: "border-box" }}
          />
        </div>
        {["ALL", "ACTIVE", "COMPLETED", "ON_HOLD"].map(s => (
          <button key={s} onClick={() => setStatusFilter(s)} style={{
            padding: "10px 16px", borderRadius: 10, border: "none", cursor: "pointer", fontSize: 13, fontWeight: 600,
            background: statusFilter === s ? (s === "ALL" ? "#0A7E8C" : STATUS_COLORS[s] + "33") : "rgba(255,255,255,0.05)",
            color: statusFilter === s ? (s === "ALL" ? "white" : STATUS_COLORS[s]) : "rgba(255,255,255,0.5)",
          }}>
            {s === "ALL" ? "All" : s.replace("_", " ")}
          </button>
        ))}
      </div>

      {/* Table */}
      <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 16, overflow: "hidden" }}>
        {/* Table header */}
        <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1.5fr 1fr 1fr 40px", gap: 0, padding: "12px 20px", borderBottom: "1px solid rgba(255,255,255,0.07)", fontSize: 11, fontWeight: 700, color: "rgba(255,255,255,0.35)", textTransform: "uppercase", letterSpacing: "0.08em" }}>
          <span>Patient</span><span>ID</span><span>Guardian</span><span>Diagnoses</span><span>Status</span><span />
        </div>

        {loading ? (
          <div style={{ padding: 40, textAlign: "center", color: "rgba(255,255,255,0.3)", fontSize: 14 }}>Loading…</div>
        ) : filtered.length === 0 ? (
          <div style={{ padding: 40, textAlign: "center" }}>
            <div style={{ fontSize: 14, color: "rgba(255,255,255,0.3)", marginBottom: 12 }}>{search ? "No patients match your search." : "No patients yet."}</div>
            {!search && <Link href="/admin/patients/new" style={{ fontSize: 14, color: "#0D9BAC", textDecoration: "none" }}>Add your first patient →</Link>}
          </div>
        ) : filtered.map(p => (
          <Link key={p.id} href={`/admin/patients/${p.id}`}
            style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1.5fr 1fr 1fr 40px", gap: 0, padding: "14px 20px", borderBottom: "1px solid rgba(255,255,255,0.04)", textDecoration: "none", alignItems: "center", transition: "background 0.15s" }}
            onMouseEnter={e => (e.currentTarget.style.background = "rgba(255,255,255,0.03)")}
            onMouseLeave={e => (e.currentTarget.style.background = "transparent")}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <div style={{ width: 36, height: 36, borderRadius: "50%", background: "linear-gradient(135deg,#0A7E8C,#6B3FA0)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, fontWeight: 900, color: "white", flexShrink: 0 }}>
                {p.name.charAt(0)}
              </div>
              <div>
                <div style={{ fontSize: 14, fontWeight: 600, color: "white" }}>{p.name}</div>
                <div style={{ fontSize: 11, color: "rgba(255,255,255,0.35)" }}>{p.gender} · {p.dob ? new Date().getFullYear() - new Date(p.dob).getFullYear() + " yrs" : "—"}</div>
              </div>
            </div>
            <span style={{ fontSize: 13, color: "#0D9BAC", fontWeight: 700 }}>{p.uniqueId}</span>
            <div>
              <div style={{ fontSize: 13, color: "rgba(255,255,255,0.75)" }}>{p.guardianName}</div>
              <div style={{ fontSize: 11, color: "rgba(255,255,255,0.35)" }}>{p.guardianPhone}</div>
            </div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
              {(p.diagnoses ?? []).slice(0, 2).map(d => (
                <span key={d} style={{ fontSize: 10, padding: "2px 6px", borderRadius: 4, background: "rgba(107,63,160,0.2)", color: "#C084FC" }}>{d}</span>
              ))}
              {(p.diagnoses ?? []).length > 2 && <span style={{ fontSize: 10, color: "rgba(255,255,255,0.3)" }}>+{p.diagnoses.length - 2}</span>}
            </div>
            <span style={{ fontSize: 11, padding: "4px 10px", borderRadius: 6, background: `${STATUS_COLORS[p.status]}22`, color: STATUS_COLORS[p.status], fontWeight: 700, display: "inline-block" }}>
              {p.status.replace("_", " ")}
            </span>
            <ChevronRight size={14} style={{ color: "rgba(255,255,255,0.2)" }} />
          </Link>
        ))}
      </div>
    </div>
  );
}
