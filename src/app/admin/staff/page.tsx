"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Users, Clock, CheckCircle, XCircle, CalendarOff, Coffee,
  ChevronLeft, ChevronRight, Building2, TrendingUp, Activity,
  LogIn, LogOut, Plus, AlertCircle
} from "lucide-react";
import type { User, StaffAttendance, StaffActivity } from "@/lib/db";

// ── Activity type config ─────────────────────────────────────────────────────
const ACTIVITY_META: Record<string, { label: string; color: string; icon: string }> = {
  patient_session:    { label: "Patient Session",       color: "#1AAFE6", icon: "👤" },
  parent_counselling: { label: "Parent Counselling",    color: "#6B3FA0", icon: "💬" },
  documentation:      { label: "Documentation",         color: "#F5820D", icon: "📋" },
  meeting:            { label: "Meeting",               color: "#EC4899", icon: "🗓" },
  break:              { label: "Break",                 color: "rgba(255,255,255,0.3)", icon: "☕" },
  admin_work:         { label: "Admin Work",            color: "#8B5CF6", icon: "🖥" },
  home_visit:         { label: "Home Visit",            color: "#22c55e", icon: "🏠" },
  training:           { label: "Training",              color: "#F59E0B", icon: "📚" },
  lead_followup:      { label: "Lead Follow-up",        color: "#14B8A6", icon: "📞" },
  report:             { label: "Report Writing",        color: "#64748B", icon: "📊" },
  other:              { label: "Other",                 color: "rgba(255,255,255,0.4)", icon: "•" },
};

const STATUS_BADGE: Record<string, { label: string; color: string; bg: string }> = {
  present:   { label: "Present",  color: "#22c55e", bg: "rgba(34,197,94,0.12)" },
  absent:    { label: "Absent",   color: "#EF4444", bg: "rgba(239,68,68,0.12)" },
  half_day:  { label: "Half Day", color: "#F5820D", bg: "rgba(245,130,13,0.12)" },
  leave:     { label: "On Leave", color: "#6B3FA0", bg: "rgba(107,63,160,0.12)" },
  holiday:   { label: "Holiday",  color: "#64748B", bg: "rgba(100,116,139,0.12)" },
};

function fmt12(iso: string) {
  const d = new Date(iso);
  return d.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit", hour12: true });
}
function hoursWorked(att: StaffAttendance) {
  if (!att.clockIn) return null;
  const end = att.clockOut ? new Date(att.clockOut) : new Date();
  const mins = Math.floor((end.getTime() - new Date(att.clockIn).getTime()) / 60000);
  const h = Math.floor(mins / 60); const m = mins % 60;
  return `${h}h ${m}m`;
}
function totalMins(activities: StaffActivity[]) {
  return activities.reduce((s, a) => s + (a.durationMins ?? 0), 0);
}

// ── Staff Card ────────────────────────────────────────────────────────────────
function StaffCard({ user, attendance, activities, onClockIn, onClockOut, onMarkStatus }:
  { user: User; attendance?: StaffAttendance; activities: StaffActivity[];
    onClockIn: () => void; onClockOut: () => void;
    onMarkStatus: (status: StaffAttendance["status"], leaveType?: string) => void;
  }) {
  const att = attendance;
  const badge = STATUS_BADGE[att?.status ?? "absent"];
  const sessions = activities.filter(a => a.activityType === "patient_session").length;
  const worked = att ? hoursWorked(att) : null;
  const totalActivityMins = totalMins(activities);

  return (
    <div style={{
      background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)",
      borderRadius: 16, padding: "18px 20px",
    }}>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "flex-start", gap: 14, marginBottom: 14 }}>
        <div style={{
          width: 44, height: 44, borderRadius: 12,
          background: "linear-gradient(135deg,#1AAFE6,#6B3FA0)",
          display: "flex", alignItems: "center", justifyContent: "center",
          fontFamily: "'Nunito',sans-serif", fontWeight: 900, fontSize: 16, color: "white", flexShrink: 0,
        }}>
          {user.name.charAt(0)}
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontFamily: "'Nunito',sans-serif", fontWeight: 800, fontSize: 15, color: "white", marginBottom: 2 }}>
            {user.name}
          </div>
          <div style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 12, color: "rgba(255,255,255,0.4)" }}>
            {user.role === "DOCTOR" ? "Doctor" : "Staff"} · {user.email}
          </div>
        </div>
        <span style={{ padding: "3px 10px", borderRadius: 20, fontSize: 11, fontWeight: 700, fontFamily: "'DM Sans',sans-serif", background: badge.bg, color: badge.color, flexShrink: 0 }}>
          {badge.label}
        </span>
      </div>

      {/* Clock in/out row */}
      <div className="grid-responsive-2" style={{ gap: 8, marginBottom: 12 }}>
        <div style={{ background: "rgba(255,255,255,0.04)", borderRadius: 10, padding: "10px 14px" }}>
          <div style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 11, color: "rgba(255,255,255,0.35)", marginBottom: 2 }}>Clock In</div>
          <div style={{ fontFamily: "'Nunito',sans-serif", fontWeight: 700, fontSize: 14, color: att?.clockIn ? "#22c55e" : "rgba(255,255,255,0.2)" }}>
            {att?.clockIn ? fmt12(att.clockIn) : "—"}
          </div>
        </div>
        <div style={{ background: "rgba(255,255,255,0.04)", borderRadius: 10, padding: "10px 14px" }}>
          <div style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 11, color: "rgba(255,255,255,0.35)", marginBottom: 2 }}>Clock Out</div>
          <div style={{ fontFamily: "'Nunito',sans-serif", fontWeight: 700, fontSize: 14, color: att?.clockOut ? "#1AAFE6" : "rgba(255,255,255,0.2)" }}>
            {att?.clockOut ? fmt12(att.clockOut) : att?.clockIn ? "Still in" : "—"}
          </div>
        </div>
      </div>

      {/* Stats row */}
      <div className="grid-responsive-3" style={{ gap: 8, marginBottom: 14 }}>
        {[
          { label: "Sessions", value: sessions, color: "#1AAFE6" },
          { label: "Hours",    value: worked ?? "—", color: "#22c55e" },
          { label: "Activities", value: activities.length, color: "#F5820D" },
        ].map(s => (
          <div key={s.label} style={{ textAlign: "center" as const, background: "rgba(255,255,255,0.03)", borderRadius: 8, padding: "8px 4px" }}>
            <div style={{ fontFamily: "'Nunito',sans-serif", fontWeight: 800, fontSize: 18, color: s.color }}>{String(s.value)}</div>
            <div style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 11, color: "rgba(255,255,255,0.35)" }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Quick actions */}
      <div style={{ display: "flex", gap: 6, flexWrap: "wrap" as const }}>
        {!att?.clockIn && (
          <button onClick={onClockIn} style={{
            flex: 1, padding: "9px", borderRadius: 8, background: "rgba(34,197,94,0.12)",
            border: "1px solid rgba(34,197,94,0.25)", color: "#22c55e",
            fontFamily: "'Nunito',sans-serif", fontWeight: 700, fontSize: 12, cursor: "pointer",
            display: "flex", alignItems: "center", justifyContent: "center", gap: 5,
          }}>
            <LogIn size={13} /> Clock In
          </button>
        )}
        {att?.clockIn && !att.clockOut && (
          <button onClick={onClockOut} style={{
            flex: 1, padding: "9px", borderRadius: 8, background: "rgba(26,175,230,0.12)",
            border: "1px solid rgba(26,175,230,0.25)", color: "#1AAFE6",
            fontFamily: "'Nunito',sans-serif", fontWeight: 700, fontSize: 12, cursor: "pointer",
            display: "flex", alignItems: "center", justifyContent: "center", gap: 5,
          }}>
            <LogOut size={13} /> Clock Out
          </button>
        )}
        {/* Mark leave */}
        {!att?.clockIn && (
          <>
            <button onClick={() => onMarkStatus("leave", "CL")} style={{
              padding: "9px 12px", borderRadius: 8, background: "rgba(107,63,160,0.1)",
              border: "1px solid rgba(107,63,160,0.2)", color: "#6B3FA0",
              fontFamily: "'DM Sans',sans-serif", fontWeight: 600, fontSize: 11, cursor: "pointer",
            }}>CL</button>
            <button onClick={() => onMarkStatus("leave", "SL")} style={{
              padding: "9px 12px", borderRadius: 8, background: "rgba(239,68,68,0.08)",
              border: "1px solid rgba(239,68,68,0.18)", color: "#EF4444",
              fontFamily: "'DM Sans',sans-serif", fontWeight: 600, fontSize: 11, cursor: "pointer",
            }}>SL</button>
            <button onClick={() => onMarkStatus("holiday")} style={{
              padding: "9px 12px", borderRadius: 8, background: "rgba(255,255,255,0.04)",
              border: "1px solid rgba(255,255,255,0.1)", color: "rgba(255,255,255,0.3)",
              fontFamily: "'DM Sans',sans-serif", fontWeight: 600, fontSize: 11, cursor: "pointer",
            }}>Holiday</button>
          </>
        )}
        <Link href={`/admin/staff/${user.id}`} style={{
          padding: "9px 14px", borderRadius: 8, background: "rgba(255,255,255,0.05)",
          border: "1px solid rgba(255,255,255,0.1)", color: "rgba(255,255,255,0.5)",
          fontFamily: "'DM Sans',sans-serif", fontSize: 12, textDecoration: "none",
          display: "flex", alignItems: "center", gap: 5,
        }}>
          <Activity size={12} /> Full Log
        </Link>
      </div>
    </div>
  );
}

// ── Main Staff Overview Page ──────────────────────────────────────────────────
export default function StaffPage() {
  const [data, setData]       = useState<{ staff: User[]; attendances: StaffAttendance[]; activities: StaffActivity[]; date: string } | null>(null);
  const [loading, setLoading] = useState(true);
  const [date, setDate]       = useState(new Date().toISOString().split("T")[0]);

  const load = () => {
    setLoading(true);
    fetch(`/api/admin/staff/tracker?date=${date}`)
      .then(r => r.json()).then(d => { setData(d); setLoading(false); })
      .catch(() => setLoading(false));
  };
  useEffect(() => { load(); }, [date]); // eslint-disable-line react-hooks/exhaustive-deps

  const doAction = async (action: string, userId: string, extra?: object) => {
    await fetch("/api/admin/staff/tracker", {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action, userId, date, ...extra }),
    });
    load();
  };

  const staff    = data?.staff ?? [];
  const attMap   = new Map((data?.attendances ?? []).map(a => [a.userId, a]));
  const actMap   = new Map<string, StaffActivity[]>();
  (data?.activities ?? []).forEach(a => {
    if (!actMap.has(a.userId)) actMap.set(a.userId, []);
    actMap.get(a.userId)!.push(a);
  });

  const presentCount = [...attMap.values()].filter(a => a.status === "present").length;
  const absentCount  = staff.length - presentCount;
  const totalSessions = (data?.activities ?? []).filter(a => a.activityType === "patient_session").length;

  const prevDay = () => { const d = new Date(date); d.setDate(d.getDate() - 1); setDate(d.toISOString().split("T")[0]); };
  const nextDay = () => { const d = new Date(date); d.setDate(d.getDate() + 1); setDate(d.toISOString().split("T")[0]); };
  const isToday = date === new Date().toISOString().split("T")[0];

  const fmtDate = (d: string) => new Date(d + "T00:00:00").toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "long" });

  return (
    <div>
      {/* Header */}
      <div style={{ marginBottom: 24, display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap" as const, gap: 12 }}>
        <div>
          <h1 style={{ fontFamily: "'Nunito',sans-serif", fontWeight: 900, fontSize: 26, color: "white", marginBottom: 4 }}>
            Staff & Attendance
          </h1>
          <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 13, color: "rgba(255,255,255,0.4)" }}>
            Track attendance, sessions, and daily activity for all staff
          </p>
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <Link href="/admin/branches" style={{
            display: "flex", alignItems: "center", gap: 6, padding: "10px 16px", borderRadius: 10,
            background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)",
            color: "rgba(255,255,255,0.6)", textDecoration: "none", fontFamily: "'DM Sans',sans-serif", fontSize: 13,
          }}>
            <Building2 size={14} /> Manage Branches
          </Link>
        </div>
      </div>

      {/* Date navigator */}
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 24, background: "rgba(255,255,255,0.03)", borderRadius: 12, padding: "12px 16px", width: "fit-content" }}>
        <button onClick={prevDay} style={{ width: 32, height: 32, borderRadius: 8, background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", color: "white", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <ChevronLeft size={16} />
        </button>
        <div style={{ fontFamily: "'Nunito',sans-serif", fontWeight: 700, fontSize: 15, color: "white", minWidth: 220, textAlign: "center" as const }}>
          {isToday ? <span style={{ color: "#1AAFE6" }}>Today — </span> : null}{fmtDate(date)}
        </div>
        <button onClick={nextDay} disabled={isToday} style={{ width: 32, height: 32, borderRadius: 8, background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", color: isToday ? "rgba(255,255,255,0.2)" : "white", cursor: isToday ? "not-allowed" : "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <ChevronRight size={16} />
        </button>
        {!isToday && (
          <button onClick={() => setDate(new Date().toISOString().split("T")[0])} style={{ padding: "6px 12px", borderRadius: 8, background: "rgba(26,175,230,0.12)", border: "1px solid rgba(26,175,230,0.25)", color: "#1AAFE6", fontFamily: "'DM Sans',sans-serif", fontSize: 12, fontWeight: 600, cursor: "pointer" }}>
            Go to Today
          </button>
        )}
      </div>

      {/* Stats */}
      <div className="grid-responsive-4" style={{ gap: 12, marginBottom: 24 }}>
        {[
          { label: "Total Staff", value: staff.length, icon: <Users size={18} />, color: "#1AAFE6" },
          { label: "Present Today", value: presentCount, icon: <CheckCircle size={18} />, color: "#22c55e" },
          { label: "Absent / Leave", value: absentCount, icon: <XCircle size={18} />, color: "#EF4444" },
          { label: "Sessions Done", value: totalSessions, icon: <Activity size={18} />, color: "#F5820D" },
        ].map(s => (
          <div key={s.label} style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 14, padding: "16px 18px", display: "flex", gap: 14, alignItems: "center" }}>
            <div style={{ width: 40, height: 40, borderRadius: 10, background: `${s.color}18`, display: "flex", alignItems: "center", justifyContent: "center", color: s.color, flexShrink: 0 }}>
              {s.icon}
            </div>
            <div>
              <div style={{ fontFamily: "'Nunito',sans-serif", fontWeight: 900, fontSize: 26, color: "white", lineHeight: 1 }}>{loading ? "—" : s.value}</div>
              <div style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 12, color: "rgba(255,255,255,0.4)", marginTop: 2 }}>{s.label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Staff Grid */}
      {loading ? (
        <div style={{ textAlign: "center" as const, padding: "60px 0", color: "rgba(255,255,255,0.3)", fontFamily: "'DM Sans',sans-serif" }}>
          Loading staff data...
        </div>
      ) : staff.length === 0 ? (
        <div style={{ textAlign: "center" as const, padding: "60px 0", color: "rgba(255,255,255,0.2)", fontFamily: "'DM Sans',sans-serif" }}>
          <Users size={40} style={{ marginBottom: 12, opacity: 0.3 }} />
          <div>No staff members yet — add them via Admin → Users</div>
        </div>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(340px,1fr))", gap: 16 }}>
          {staff.map(user => (
            <StaffCard
              key={user.id}
              user={user}
              attendance={attMap.get(user.id)}
              activities={actMap.get(user.id) ?? []}
              onClockIn={() => doAction("clock_in", user.id)}
              onClockOut={() => doAction("clock_out", user.id)}
              onMarkStatus={(status, leaveType) => doAction("mark_status", user.id, { status, leaveType })}
            />
          ))}
        </div>
      )}
    </div>
  );
}
