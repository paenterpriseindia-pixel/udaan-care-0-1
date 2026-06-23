"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { Users, Calendar, FileText, TrendingUp, Clock, CheckCircle, AlertCircle, ArrowRight, UserPlus, Plus } from "lucide-react";
import type { Patient, Booking } from "@/lib/db";

function StatCard({ icon: Icon, label, value, sub, color }: { icon: React.ElementType; label: string; value: string | number; sub?: string; color: string }) {
  return (
    <div style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 16, padding: "20px 24px" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
        <div style={{ width: 40, height: 40, borderRadius: 10, background: `${color}22`, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <Icon size={18} style={{ color }} />
        </div>
      </div>
      <div style={{ fontFamily: "'Nunito',sans-serif", fontWeight: 900, fontSize: 32, color: "white", lineHeight: 1, marginBottom: 4 }}>{value}</div>
      <div style={{ fontSize: 14, fontWeight: 600, color: "rgba(255,255,255,0.7)", marginBottom: 2 }}>{label}</div>
      {sub && <div style={{ fontSize: 12, color: "rgba(255,255,255,0.35)" }}>{sub}</div>}
    </div>
  );
}

export default function AdminDashboard() {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch("/api/admin/patients").then(r => r.json()),
      fetch("/api/admin/bookings").then(r => r.json()),
    ]).then(([p, b]) => {
      setPatients(Array.isArray(p) ? p : []);
      setBookings(Array.isArray(b) ? b : []);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  const today = new Date().toISOString().split("T")[0];
  const todayBookings = bookings.filter(b => b.datetime?.startsWith(today));
  const pendingBookings = bookings.filter(b => b.status === "PENDING");
  const activePatients = patients.filter(p => p.status === "ACTIVE");
  const recentPatients = [...patients].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).slice(0, 5);
  const upcomingBookings = bookings.filter(b => b.datetime > new Date().toISOString() && b.status !== "CANCELLED").sort((a, b) => a.datetime.localeCompare(b.datetime)).slice(0, 5);

  return (
    <div>
      {/* Header */}
      <div style={{ marginBottom: 28 }}>
        <h1 style={{ fontFamily: "'Nunito',sans-serif", fontWeight: 900, fontSize: 28, color: "white", marginBottom: 4 }}>
          Good {new Date().getHours() < 12 ? "Morning" : new Date().getHours() < 17 ? "Afternoon" : "Evening"} 👋
        </h1>
        <p style={{ fontSize: 14, color: "rgba(255,255,255,0.45)" }}>Here's what's happening at Udaan Care today</p>
      </div>

      {/* Quick actions */}
      <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginBottom: 28 }}>
        {[
          { label: "Add Patient", href: "/admin/patients/new", icon: UserPlus, color: "#0A7E8C" },
          { label: "New Booking", href: "/admin/bookings", icon: Calendar, color: "#6B3FA0" },
          { label: "Write Blog", href: "/admin/blog/new", icon: Plus, color: "#F5820D" },
        ].map(a => (
          <Link key={a.href} href={a.href} style={{
            display: "inline-flex", alignItems: "center", gap: 8, padding: "10px 18px", borderRadius: 10,
            background: `${a.color}22`, border: `1px solid ${a.color}44`,
            color: a.color, textDecoration: "none", fontSize: 14, fontWeight: 700, transition: "all 0.2s",
          }}
            onMouseEnter={e => (e.currentTarget.style.background = `${a.color}33`)}
            onMouseLeave={e => (e.currentTarget.style.background = `${a.color}22`)}
          >
            <a.icon size={15} /> {a.label}
          </Link>
        ))}
      </div>

      {/* Stats */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: 16, marginBottom: 28 }}>
        <StatCard icon={Users} label="Active Patients" value={loading ? "—" : activePatients.length} sub="Currently in therapy" color="#0A7E8C" />
        <StatCard icon={Users} label="Total Patients" value={loading ? "—" : patients.length} sub="All time" color="#6B3FA0" />
        <StatCard icon={Calendar} label="Today's Sessions" value={loading ? "—" : todayBookings.length} sub={today} color="#F5820D" />
        <StatCard icon={AlertCircle} label="Pending Bookings" value={loading ? "—" : pendingBookings.length} sub="Needs confirmation" color="#EF4444" />
      </div>

      {/* Two column layout */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>

        {/* Recent Patients */}
        <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 16, padding: 20 }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
            <h2 style={{ fontFamily: "'Nunito',sans-serif", fontWeight: 800, fontSize: 16, color: "white" }}>Recent Patients</h2>
            <Link href="/admin/patients" style={{ fontSize: 12, color: "#0D9BAC", textDecoration: "none", display: "flex", alignItems: "center", gap: 4 }}>View all <ArrowRight size={12} /></Link>
          </div>
          {recentPatients.length === 0 ? (
            <div style={{ textAlign: "center", padding: "24px 0", color: "rgba(255,255,255,0.3)", fontSize: 13 }}>
              No patients yet. <Link href="/admin/patients/new" style={{ color: "#0D9BAC" }}>Add one →</Link>
            </div>
          ) : recentPatients.map(p => (
            <Link key={p.id} href={`/admin/patients/${p.id}`} style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 0", borderBottom: "1px solid rgba(255,255,255,0.05)", textDecoration: "none", transition: "opacity 0.15s" }}
              onMouseEnter={e => (e.currentTarget.style.opacity = "0.75")}
              onMouseLeave={e => (e.currentTarget.style.opacity = "1")}
            >
              <div style={{ width: 36, height: 36, borderRadius: "50%", background: "linear-gradient(135deg,#0A7E8C,#6B3FA0)", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'Nunito',sans-serif", fontWeight: 900, fontSize: 13, color: "white", flexShrink: 0 }}>
                {p.name.charAt(0)}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 14, fontWeight: 600, color: "white", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{p.name}</div>
                <div style={{ fontSize: 11, color: "rgba(255,255,255,0.4)" }}>{p.uniqueId} · {p.diagnoses?.join(", ") || "—"}</div>
              </div>
              <span style={{ fontSize: 10, padding: "3px 8px", borderRadius: 5, background: p.status === "ACTIVE" ? "rgba(34,197,94,0.15)" : "rgba(255,255,255,0.08)", color: p.status === "ACTIVE" ? "#22c55e" : "rgba(255,255,255,0.4)", fontWeight: 700, flexShrink: 0 }}>
                {p.status}
              </span>
            </Link>
          ))}
        </div>

        {/* Upcoming Bookings */}
        <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 16, padding: 20 }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
            <h2 style={{ fontFamily: "'Nunito',sans-serif", fontWeight: 800, fontSize: 16, color: "white" }}>Upcoming Bookings</h2>
            <Link href="/admin/bookings" style={{ fontSize: 12, color: "#0D9BAC", textDecoration: "none", display: "flex", alignItems: "center", gap: 4 }}>View all <ArrowRight size={12} /></Link>
          </div>
          {upcomingBookings.length === 0 ? (
            <div style={{ textAlign: "center", padding: "24px 0", color: "rgba(255,255,255,0.3)", fontSize: 13 }}>
              No upcoming bookings. <Link href="/admin/bookings" style={{ color: "#0D9BAC" }}>Add one →</Link>
            </div>
          ) : upcomingBookings.map(b => {
            const patient = patients.find(p => p.id === b.patientId);
            const dt = new Date(b.datetime);
            return (
              <div key={b.id} style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 0", borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
                <div style={{ width: 36, height: 36, borderRadius: 10, background: b.type === "ONLINE" ? "rgba(107,63,160,0.2)" : "rgba(10,126,140,0.2)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <Clock size={15} style={{ color: b.type === "ONLINE" ? "#9B59B6" : "#0A7E8C" }} />
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 14, fontWeight: 600, color: "white", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{patient?.name ?? "Unknown"}</div>
                  <div style={{ fontSize: 11, color: "rgba(255,255,255,0.4)" }}>{dt.toLocaleDateString("en-IN")} · {dt.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" })} · {b.type}</div>
                </div>
                <span style={{ fontSize: 10, padding: "3px 8px", borderRadius: 5, background: b.status === "CONFIRMED" ? "rgba(34,197,94,0.15)" : "rgba(245,130,13,0.15)", color: b.status === "CONFIRMED" ? "#22c55e" : "#F5820D", fontWeight: 700, flexShrink: 0 }}>
                  {b.status}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
