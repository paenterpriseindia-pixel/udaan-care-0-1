"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Users, Calendar, Clock, CheckCircle, AlertCircle,
  ArrowRight, UserPlus, Plus, MessageCircle, TrendingUp,
  Video, Building2, CalendarClock, RefreshCw
} from "lucide-react";
import type { Patient, Booking, Lead } from "@/lib/db";


export default function AdminDashboard() {
  const [patients, setPatients]   = useState<Patient[]>([]);
  const [bookings, setBookings]   = useState<Booking[]>([]);
  const [leads, setLeads]         = useState<Lead[]>([]);
  const [loading, setLoading]     = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [refreshDone, setRefreshDone] = useState(false);

  // ── Force-refresh all public pages ────────────────────────────────────────
  const refreshSite = async () => {
    setRefreshing(true);
    try {
      await fetch("/api/admin/revalidate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ all: true }),
      });
      setRefreshDone(true);
      setTimeout(() => setRefreshDone(false), 3000);
    } finally {
      setRefreshing(false);
    }
  };


  useEffect(() => {
    Promise.all([
      fetch("/api/admin/patients").then(r => r.json()),
      fetch("/api/admin/bookings").then(r => r.json()),
      fetch("/api/admin/leads").then(r => r.json()),
    ]).then(([p, b, l]) => {
      setPatients(Array.isArray(p) ? p : []);
      setBookings(Array.isArray(b) ? b : []);
      setLeads(Array.isArray(l) ? l : []);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  const now      = new Date();
  const todayStr = now.toISOString().split("T")[0];
  const hour     = now.getHours();
  const greeting = hour < 12 ? "Good Morning" : hour < 17 ? "Good Afternoon" : "Good Evening";

  const todayBookings    = bookings.filter(b => b.datetime?.startsWith(todayStr));
  const upcomingToday    = todayBookings
    .filter(b => b.status !== "CANCELLED" && new Date(b.datetime) >= now)
    .sort((a, b) => a.datetime.localeCompare(b.datetime));
  const pendingBookings  = bookings.filter(b => b.status === "PENDING");
  const newLeads         = leads.filter(l => l.status === "new");
  const activePatients   = patients.filter(p => p.status === "ACTIVE");

  const card = {
    background: "rgba(255,255,255,0.04)",
    border: "1px solid rgba(255,255,255,0.07)",
    borderRadius: 16, padding: 20,
  };

  const stat = (val: number | string, label: string, sub: string, color: string, icon: React.ReactNode) => (
    <div style={{ ...card, display: "flex", alignItems: "center", gap: 16 }}>
      <div style={{ width: 48, height: 48, borderRadius: 14, background: `${color}22`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
        <span style={{ color }}>{icon}</span>
      </div>
      <div>
        <div style={{ fontFamily: "'Nunito',sans-serif", fontWeight: 900, fontSize: 30, color: "white", lineHeight: 1, marginBottom: 2 }}>{loading ? "—" : val}</div>
        <div style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 13, fontWeight: 600, color: "rgba(255,255,255,0.65)" }}>{label}</div>
        <div style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 11, color: "rgba(255,255,255,0.3)" }}>{sub}</div>
      </div>
    </div>
  );

  return (
    <div>
      {/* Greeting */}
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontFamily: "'Nunito',sans-serif", fontWeight: 900, fontSize: 28, color: "white", marginBottom: 4 }}>
          {greeting}, Dr. Prasoon
        </h1>
        <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 14, color: "rgba(255,255,255,0.4)" }}>
          {now.toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "long", year: "numeric" })}
        </p>
      </div>

      {/* Quick actions */}
      <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginBottom: 28 }}>
        {[
          { label: "Add Patient",     href: "/admin/patients/new",  icon: <UserPlus size={14} />,     color: "#1AAFE6" },
          { label: "New Booking",     href: "/admin/bookings",       icon: <Calendar size={14} />,     color: "#6B3FA0" },
          { label: "My Schedule",     href: "/admin/schedule",       icon: <CalendarClock size={14} />, color: "#F5820D" },
          { label: "Leads",           href: "/admin/leads",          icon: <TrendingUp size={14} />,   color: "#22c55e" },
          { label: "Write Blog",      href: "/admin/blog/new",       icon: <Plus size={14} />,         color: "#EC4899" },
        ].map(a => (
          <Link key={a.href} href={a.href} style={{
            display: "inline-flex", alignItems: "center", gap: 8, padding: "10px 18px", borderRadius: 10,
            background: `${a.color}18`, border: `1px solid ${a.color}33`,
            color: a.color, textDecoration: "none", fontSize: 13,
            fontFamily: "'Nunito',sans-serif", fontWeight: 700, transition: "all 0.2s",
          }}
            onMouseEnter={e => (e.currentTarget.style.background = `${a.color}28`)}
            onMouseLeave={e => (e.currentTarget.style.background = `${a.color}18`)}
          >
            {a.icon} {a.label}
          </Link>
        ))}

        {/* ── Refresh Website button ── */}
        <button
          onClick={refreshSite}
          disabled={refreshing}
          style={{
            display: "inline-flex", alignItems: "center", gap: 8, padding: "10px 18px", borderRadius: 10,
            background: refreshDone ? "rgba(34,197,94,0.18)" : "rgba(255,255,255,0.06)",
            border: refreshDone ? "1px solid rgba(34,197,94,0.4)" : "1px solid rgba(255,255,255,0.12)",
            color: refreshDone ? "#22c55e" : "rgba(255,255,255,0.65)",
            fontSize: 13, fontFamily: "'Nunito',sans-serif", fontWeight: 700,
            cursor: refreshing ? "not-allowed" : "pointer", transition: "all 0.2s",
          }}
        >
          <RefreshCw size={14} style={{ animation: refreshing ? "spin-slow 1s linear infinite" : "none" }} />
          {refreshDone ? "Website Updated ✓" : refreshing ? "Refreshing…" : "Refresh Website"}
        </button>
      </div>

      {/* Alert banners */}
      <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 24 }}>
        {pendingBookings.length > 0 && (
          <Link href="/admin/bookings" style={{
            display: "flex", alignItems: "center", gap: 12, padding: "14px 18px", borderRadius: 12,
            background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.25)", textDecoration: "none",
          }}>
            <AlertCircle size={18} style={{ color: "#EF4444", flexShrink: 0 }} />
            <span style={{ flex: 1, fontFamily: "'DM Sans',sans-serif", fontSize: 14, color: "rgba(255,255,255,0.8)" }}>
              <strong style={{ color: "#EF4444" }}>{pendingBookings.length} booking{pendingBookings.length > 1 ? "s" : ""}</strong> waiting for your confirmation
            </span>
            <ArrowRight size={14} style={{ color: "rgba(255,255,255,0.3)" }} />
          </Link>
        )}
        {newLeads.length > 0 && (
          <Link href="/admin/leads" style={{
            display: "flex", alignItems: "center", gap: 12, padding: "14px 18px", borderRadius: 12,
            background: "rgba(26,175,230,0.08)", border: "1px solid rgba(26,175,230,0.2)", textDecoration: "none",
          }}>
            <MessageCircle size={18} style={{ color: "#1AAFE6", flexShrink: 0 }} />
            <span style={{ flex: 1, fontFamily: "'DM Sans',sans-serif", fontSize: 14, color: "rgba(255,255,255,0.8)" }}>
              <strong style={{ color: "#1AAFE6" }}>{newLeads.length} new lead{newLeads.length > 1 ? "s" : ""}</strong> — follow up before they go cold
            </span>
            <ArrowRight size={14} style={{ color: "rgba(255,255,255,0.3)" }} />
          </Link>
        )}
      </div>

      {/* Stats */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px,1fr))", gap: 14, marginBottom: 24 }}>
        {stat(todayBookings.length, "Today's Sessions", todayStr, "#1AAFE6", <Clock size={20} />)}
        {stat(pendingBookings.length, "Pending Bookings", "Need confirmation", "#EF4444", <AlertCircle size={20} />)}
        {stat(newLeads.length, "New Leads", "Uncontacted", "#F5820D", <TrendingUp size={20} />)}
        {stat(activePatients.length, "Active Patients", "In therapy", "#22c55e", <Users size={20} />)}
      </div>

      {/* Today's Schedule + New Leads side by side */}
      <div className="grid-responsive-2" style={{ gap: 20 }}>

        {/* Today's Schedule */}
        <div style={card}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 18 }}>
            <h2 style={{ fontFamily: "'Nunito',sans-serif", fontWeight: 800, fontSize: 16, color: "white", margin: 0 }}>
              Today's Schedule
            </h2>
            <Link href="/admin/bookings" style={{ fontSize: 12, color: "#1AAFE6", textDecoration: "none", display: "flex", alignItems: "center", gap: 4 }}>
              View all <ArrowRight size={11} />
            </Link>
          </div>
          {loading ? (
            <div style={{ color: "rgba(255,255,255,0.2)", fontSize: 13, fontFamily: "'DM Sans',sans-serif", padding: "20px 0" }}>Loading...</div>
          ) : upcomingToday.length === 0 ? (
            <div style={{ textAlign: "center", padding: "32px 0", color: "rgba(255,255,255,0.2)", fontFamily: "'DM Sans',sans-serif", fontSize: 13 }}>
              No more sessions today
            </div>
          ) : upcomingToday.map(b => {
            const dt = new Date(b.datetime);
            const patient = patients.find(p => p.id === b.patientId);
            const isOnline = b.type === "ONLINE";
            return (
              <div key={b.id} style={{ display: "flex", alignItems: "center", gap: 14, padding: "12px 0", borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
                {/* Time */}
                <div style={{ width: 52, flexShrink: 0, textAlign: "center" as const }}>
                  <div style={{ fontFamily: "'Nunito',sans-serif", fontWeight: 800, fontSize: 15, color: "white" }}>
                    {dt.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit", hour12: true })}
                  </div>
                </div>
                {/* Type badge */}
                <div style={{ width: 32, height: 32, borderRadius: 10, background: isOnline ? "rgba(107,63,160,0.2)" : "rgba(26,175,230,0.15)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  {isOnline ? <Video size={14} style={{ color: "#6B3FA0" }} /> : <Building2 size={14} style={{ color: "#1AAFE6" }} />}
                </div>
                {/* Patient */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontFamily: "'Nunito',sans-serif", fontWeight: 700, fontSize: 14, color: "white", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                    {patient?.name ?? "Unknown Patient"}
                  </div>
                  <div style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 11, color: "rgba(255,255,255,0.35)" }}>
                    {isOnline ? "Online · Zoom" : "Clinic visit"} · 45 mins
                  </div>
                </div>
                {/* Status / Join */}
                {isOnline && b.zoomLink ? (
                  <a href={b.zoomLink} target="_blank" rel="noopener noreferrer" style={{
                    padding: "6px 12px", borderRadius: 8, background: "rgba(107,63,160,0.2)", border: "1px solid rgba(107,63,160,0.3)",
                    color: "#6B3FA0", fontFamily: "'Nunito',sans-serif", fontWeight: 700, fontSize: 11, textDecoration: "none", flexShrink: 0,
                  }}>Join Zoom</a>
                ) : (
                  <span style={{ fontSize: 11, padding: "4px 10px", borderRadius: 6, flexShrink: 0,
                    background: b.status === "CONFIRMED" ? "rgba(34,197,94,0.12)" : "rgba(245,130,13,0.12)",
                    color: b.status === "CONFIRMED" ? "#22c55e" : "#F5820D",
                    fontFamily: "'DM Sans',sans-serif", fontWeight: 700,
                  }}>{b.status}</span>
                )}
              </div>
            );
          })}
        </div>

        {/* New Leads */}
        <div style={card}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 18 }}>
            <h2 style={{ fontFamily: "'Nunito',sans-serif", fontWeight: 800, fontSize: 16, color: "white", margin: 0 }}>
              New Leads
            </h2>
            <Link href="/admin/leads" style={{ fontSize: 12, color: "#1AAFE6", textDecoration: "none", display: "flex", alignItems: "center", gap: 4 }}>
              View all <ArrowRight size={11} />
            </Link>
          </div>
          {loading ? (
            <div style={{ color: "rgba(255,255,255,0.2)", fontSize: 13, fontFamily: "'DM Sans',sans-serif", padding: "20px 0" }}>Loading...</div>
          ) : newLeads.length === 0 ? (
            <div style={{ textAlign: "center", padding: "32px 0", color: "rgba(255,255,255,0.2)", fontFamily: "'DM Sans',sans-serif", fontSize: 13 }}>
              No new leads right now
            </div>
          ) : newLeads.slice(0,6).map(lead => {
            const waMsg = encodeURIComponent(`Hello ${lead.name}! Thank you for your interest in Udaan Care. Dr. Prasoon Gupta would love to help. Would you like to schedule a consultation? Book here: https://udaancare.in/book`);
            return (
              <div key={lead.id} style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 0", borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
                <div style={{ width: 36, height: 36, borderRadius: "50%", background: "linear-gradient(135deg,#1AAFE6,#6B3FA0)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, fontFamily: "'Nunito',sans-serif", fontWeight: 900, fontSize: 14, color: "white" }}>
                  {lead.name.charAt(0)}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontFamily: "'Nunito',sans-serif", fontWeight: 700, fontSize: 14, color: "white", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{lead.name}</div>
                  <div style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 11, color: "rgba(255,255,255,0.35)" }}>{lead.phone} · via {lead.source}</div>
                </div>
                <a href={`https://wa.me/${lead.phone.replace(/\D/g,"")}?text=${waMsg}`} target="_blank" rel="noopener noreferrer" style={{
                  width: 34, height: 34, borderRadius: 10, background: "#25D36622", border: "1px solid #25D36644",
                  display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
                }}>
                  <MessageCircle size={14} style={{ color: "#25D366" }} />
                </a>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
