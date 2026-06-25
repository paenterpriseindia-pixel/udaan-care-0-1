"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft, TrendingUp, Clock, Users, Activity,
  CheckCircle, Award, CalendarDays, BarChart3
} from "lucide-react";
import type { User, StaffAttendance, StaffActivity } from "@/lib/db";
import { useParams } from "next/navigation";

const MONTHS = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

function dateRange(year: number, month: number) {
  const from = `${year}-${String(month).padStart(2,"0")}-01`;
  const days  = new Date(year, month, 0).getDate();
  const to    = `${year}-${String(month).padStart(2,"0")}-${String(days).padStart(2,"0")}`;
  return { from, to };
}

function Bar({ pct, color, label }: { pct: number; color: string; label: string }) {
  return (
    <div style={{ marginBottom: 10 }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4, fontFamily: "'DM Sans',sans-serif", fontSize: 12, color: "rgba(255,255,255,0.5)" }}>
        <span>{label}</span>
        <span style={{ color, fontWeight: 700 }}>{pct}%</span>
      </div>
      <div style={{ height: 6, borderRadius: 3, background: "rgba(255,255,255,0.06)", overflow: "hidden" }}>
        <div style={{ height: "100%", width: `${Math.min(pct, 100)}%`, background: color, borderRadius: 3, transition: "width 0.6s ease" }} />
      </div>
    </div>
  );
}

export default function StaffPerformancePage() {
  const { id: userId } = useParams() as { id: string };
  const now   = new Date();
  const [year,  setYear]  = useState(now.getFullYear());
  const [month, setMonth] = useState(now.getMonth() + 1);

  const [user,       setUser]       = useState<User | null>(null);
  const [attendance, setAttendance] = useState<StaffAttendance[]>([]);
  const [activities, setActivities] = useState<StaffActivity[]>([]);
  const [loading,    setLoading]    = useState(true);

  useEffect(() => {
    setLoading(true);
    const { from, to } = dateRange(year, month);
    Promise.all([
      fetch(`/api/admin/users/${userId}`).then(r => r.json()).catch(() => null),
      fetch(`/api/admin/attendance?userId=${userId}&from=${from}&to=${to}`).then(r => r.json()).catch(() => []),
      // Re-use tracker API with date range via activities
      fetch(`/api/admin/staff/activities?userId=${userId}&from=${from}&to=${to}`).then(r => r.json()).catch(() => []),
    ]).then(([u, atts, acts]) => {
      setUser(u);
      setAttendance(Array.isArray(atts) ? atts : []);
      setActivities(Array.isArray(acts) ? acts : []);
      setLoading(false);
    });
  }, [userId, year, month]);

  // ── Derived metrics ────────────────────────────────────────────────────────
  const workingDays = (() => {
    const { from, to } = dateRange(year, month);
    const d = new Date(from + "T00:00:00");
    const end = new Date(to + "T00:00:00");
    let count = 0;
    while (d <= end) { if (d.getDay() !== 0) count++; d.setDate(d.getDate() + 1); }
    return count;
  })();

  const presentDays = attendance.filter(a => a.status === "present").length;
  const leaveDays   = attendance.filter(a => a.status === "leave").length;
  const halfDays    = attendance.filter(a => a.status === "half_day").length;
  const absentDays  = workingDays - presentDays - leaveDays - halfDays;
  const attendancePct = workingDays > 0 ? Math.round((presentDays / workingDays) * 100) : 0;

  const totalSessions     = activities.filter(a => a.activityType === "patient_session").length;
  const totalCounselling  = activities.filter(a => a.activityType === "parent_counselling").length;
  const totalDocs         = activities.filter(a => a.activityType === "documentation").length;
  const totalBreakMins    = activities.filter(a => a.activityType === "break").reduce((s, a) => s + a.durationMins, 0);
  const totalLoggedMins   = activities.reduce((s, a) => s + a.durationMins, 0);
  const avgSessionsPerDay = presentDays > 0 ? (totalSessions / presentDays).toFixed(1) : "—";

  // Total hours worked from clock-in/out
  const totalWorkedMins = attendance
    .filter(a => a.clockIn && a.clockOut)
    .reduce((s, a) => {
      const diff = new Date(a.clockOut!).getTime() - new Date(a.clockIn!).getTime();
      return s + Math.floor(diff / 60000);
    }, 0);
  const workedHours = `${Math.floor(totalWorkedMins / 60)}h ${totalWorkedMins % 60}m`;

  // Activity type breakdown
  const actTypes: Record<string, number> = {};
  activities.forEach(a => {
    actTypes[a.activityType] = (actTypes[a.activityType] ?? 0) + a.durationMins;
  });
  const totalTypeMins = Object.values(actTypes).reduce((s, v) => s + v, 0);

  const TYPE_LABELS: Record<string, { label: string; color: string }> = {
    patient_session:    { label: "Patient Sessions",   color: "#1AAFE6" },
    parent_counselling: { label: "Parent Counselling", color: "#6B3FA0" },
    documentation:      { label: "Documentation",      color: "#F5820D" },
    break:              { label: "Breaks",             color: "rgba(255,255,255,0.3)" },
    meeting:            { label: "Meetings",           color: "#EC4899" },
    admin_work:         { label: "Admin Work",         color: "#8B5CF6" },
    training:           { label: "Training",           color: "#F59E0B" },
    home_visit:         { label: "Home Visits",        color: "#22c55e" },
    lead_followup:      { label: "Lead Follow-up",     color: "#14B8A6" },
    other:              { label: "Other",              color: "#64748B" },
  };

  // Weekly breakdown (which week had most sessions)
  const weeklyData = Array.from({ length: 5 }, (_, w) => {
    const sessionsThisWeek = activities.filter(a => {
      const d = new Date(a.date + "T00:00:00");
      const weekOfMonth = Math.ceil(d.getDate() / 7);
      return weekOfMonth === w + 1 && a.activityType === "patient_session";
    }).length;
    return { week: `W${w + 1}`, sessions: sessionsThisWeek };
  });
  const maxWeekSessions = Math.max(...weeklyData.map(w => w.sessions), 1);

  const card = { background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 16, padding: 20 };

  const monthLabel = `${MONTHS[month - 1]} ${year}`;
  const isCurrentMonth = year === now.getFullYear() && month === now.getMonth() + 1;

  return (
    <div>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 24 }}>
        <Link href={`/admin/staff/${userId}`} style={{ display: "flex", alignItems: "center", gap: 6, padding: "8px 14px", borderRadius: 10, background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", color: "rgba(255,255,255,0.5)", textDecoration: "none", fontFamily: "'DM Sans',sans-serif", fontSize: 13 }}>
          <ArrowLeft size={14} /> Daily Log
        </Link>
        <div>
          <h1 style={{ fontFamily: "'Nunito',sans-serif", fontWeight: 900, fontSize: 22, color: "white", margin: 0 }}>
            {user?.name ?? "Loading…"} — Performance
          </h1>
          <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 12, color: "rgba(255,255,255,0.4)", margin: 0 }}>{user?.role} · Monthly Report</p>
        </div>
      </div>

      {/* Month selector */}
      <div style={{ display: "flex", gap: 6, flexWrap: "wrap" as const, marginBottom: 24 }}>
        {MONTHS.map((m, i) => {
          const active = i + 1 === month && year === now.getFullYear();
          const isFuture = year === now.getFullYear() && i + 1 > now.getMonth() + 1;
          return (
            <button key={m} onClick={() => !isFuture && setMonth(i + 1)} disabled={isFuture} style={{
              padding: "7px 14px", borderRadius: 8, fontFamily: "'DM Sans',sans-serif", fontSize: 13, fontWeight: active ? 700 : 400,
              background: active ? "rgba(26,175,230,0.15)" : "rgba(255,255,255,0.04)",
              border: active ? "1px solid rgba(26,175,230,0.35)" : "1px solid rgba(255,255,255,0.08)",
              color: isFuture ? "rgba(255,255,255,0.15)" : active ? "#1AAFE6" : "rgba(255,255,255,0.5)",
              cursor: isFuture ? "not-allowed" : "pointer",
            }}>{m}</button>
          );
        })}
        <select value={year} onChange={e => setYear(parseInt(e.target.value))} style={{ padding: "7px 12px", borderRadius: 8, background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", color: "white", fontFamily: "'DM Sans',sans-serif", fontSize: 13 }}>
          {[now.getFullYear() - 1, now.getFullYear()].map(y => <option key={y} value={y}>{y}</option>)}
        </select>
      </div>

      {loading ? (
        <div style={{ textAlign: "center" as const, padding: "60px 0", color: "rgba(255,255,255,0.3)", fontFamily: "'DM Sans',sans-serif" }}>Loading performance data...</div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column" as const, gap: 20 }}>

          {/* Top KPI row */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 12 }}>
            {[
              { label: "Attendance",     value: `${attendancePct}%`, sub: `${presentDays}/${workingDays} days`, color: attendancePct >= 80 ? "#22c55e" : attendancePct >= 60 ? "#F5820D" : "#EF4444", icon: <CheckCircle size={20} /> },
              { label: "Patient Sessions", value: totalSessions,  sub: `${avgSessionsPerDay}/day avg`, color: "#1AAFE6", icon: <Users size={20} /> },
              { label: "Hours Worked",   value: workedHours,      sub: "from clock-in/out", color: "#6B3FA0", icon: <Clock size={20} /> },
              { label: "Activities",     value: activities.length, sub: `${totalLoggedMins}m total logged`, color: "#F5820D", icon: <Activity size={20} /> },
            ].map(k => (
              <div key={k.label} style={{ ...card, display: "flex", gap: 14, alignItems: "flex-start" }}>
                <div style={{ width: 44, height: 44, borderRadius: 12, background: `${k.color}18`, display: "flex", alignItems: "center", justifyContent: "center", color: k.color, flexShrink: 0 }}>
                  {k.icon}
                </div>
                <div>
                  <div style={{ fontFamily: "'Nunito',sans-serif", fontWeight: 900, fontSize: 24, color: "white", lineHeight: 1 }}>{String(k.value)}</div>
                  <div style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 11, color: "rgba(255,255,255,0.4)", marginTop: 2 }}>{k.label}</div>
                  <div style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 11, color: k.color, marginTop: 2, fontWeight: 600 }}>{k.sub}</div>
                </div>
              </div>
            ))}
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>

            {/* Attendance Breakdown */}
            <div style={card}>
              <h3 style={{ fontFamily: "'Nunito',sans-serif", fontWeight: 800, fontSize: 16, color: "white", marginBottom: 16 }}>
                Attendance — {monthLabel}
              </h3>
              <Bar pct={Math.round((presentDays / workingDays) * 100)} color="#22c55e" label={`Present (${presentDays} days)`} />
              <Bar pct={Math.round((leaveDays / workingDays) * 100)} color="#6B3FA0" label={`Leave (${leaveDays} days)`} />
              <Bar pct={Math.round((halfDays / workingDays) * 100)} color="#F5820D" label={`Half Day (${halfDays} days)`} />
              <Bar pct={Math.round((absentDays / workingDays) * 100)} color="#EF4444" label={`Absent (${Math.max(absentDays, 0)} days)`} />
              <div style={{ marginTop: 14, padding: "10px 14px", borderRadius: 10, background: "rgba(255,255,255,0.03)", display: "flex", justifyContent: "space-between", fontFamily: "'DM Sans',sans-serif", fontSize: 13 }}>
                <span style={{ color: "rgba(255,255,255,0.4)" }}>Working days this month</span>
                <span style={{ fontWeight: 700, color: "white" }}>{workingDays}</span>
              </div>
            </div>

            {/* Activity Time Breakdown */}
            <div style={card}>
              <h3 style={{ fontFamily: "'Nunito',sans-serif", fontWeight: 800, fontSize: 16, color: "white", marginBottom: 16 }}>Time Breakdown</h3>
              {totalTypeMins === 0 ? (
                <div style={{ textAlign: "center" as const, padding: "30px 0", color: "rgba(255,255,255,0.2)", fontFamily: "'DM Sans',sans-serif", fontSize: 13 }}>No activities logged this month</div>
              ) : (
                Object.entries(actTypes)
                  .sort(([,a],[,b]) => b - a)
                  .map(([type, mins]) => {
                    const meta = TYPE_LABELS[type];
                    const pct  = Math.round((mins / totalTypeMins) * 100);
                    const h    = Math.floor(mins / 60), m = mins % 60;
                    return (
                      <Bar key={type} pct={pct} color={meta?.color ?? "#fff"} label={`${meta?.label ?? type} (${h > 0 ? h+"h " : ""}${m}m)`} />
                    );
                  })
              )}
            </div>
          </div>

          {/* Weekly Sessions Chart */}
          <div style={card}>
            <h3 style={{ fontFamily: "'Nunito',sans-serif", fontWeight: 800, fontSize: 16, color: "white", marginBottom: 20 }}>Weekly Sessions — {monthLabel}</h3>
            <div style={{ display: "flex", gap: 12, alignItems: "flex-end", height: 120 }}>
              {weeklyData.map(w => (
                <div key={w.week} style={{ flex: 1, display: "flex", flexDirection: "column" as const, alignItems: "center", gap: 6 }}>
                  <div style={{ fontFamily: "'Nunito',sans-serif", fontWeight: 800, fontSize: 13, color: "#1AAFE6" }}>{w.sessions || ""}</div>
                  <div style={{
                    width: "100%", borderRadius: "6px 6px 0 0",
                    background: w.sessions > 0 ? "linear-gradient(180deg,#1AAFE6,#6B3FA0)" : "rgba(255,255,255,0.05)",
                    height: w.sessions > 0 ? `${Math.round((w.sessions / maxWeekSessions) * 90)}px` : "4px",
                    transition: "height 0.4s ease",
                  }} />
                  <div style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 11, color: "rgba(255,255,255,0.3)" }}>{w.week}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Extra metrics */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 12 }}>
            {[
              { label: "Avg Sessions/Day", value: avgSessionsPerDay, color: "#1AAFE6", sub: "patient sessions" },
              { label: "Parent Counselling", value: totalCounselling, color: "#6B3FA0", sub: "sessions" },
              { label: "Docs Written", value: totalDocs, color: "#F5820D", sub: "documentation entries" },
            ].map(k => (
              <div key={k.label} style={{ ...card, textAlign: "center" as const }}>
                <div style={{ fontFamily: "'Nunito',sans-serif", fontWeight: 900, fontSize: 32, color: k.color }}>{String(k.value)}</div>
                <div style={{ fontFamily: "'Nunito',sans-serif", fontWeight: 700, fontSize: 13, color: "white", marginTop: 4 }}>{k.label}</div>
                <div style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 11, color: "rgba(255,255,255,0.35)", marginTop: 2 }}>{k.sub}</div>
              </div>
            ))}
          </div>

          {/* Performance rating */}
          <div style={{ ...card, display: "flex", alignItems: "center", gap: 16 }}>
            <div style={{ width: 56, height: 56, borderRadius: 16, background: attendancePct >= 90 ? "rgba(34,197,94,0.15)" : attendancePct >= 70 ? "rgba(245,130,13,0.15)" : "rgba(239,68,68,0.1)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              <Award size={26} style={{ color: attendancePct >= 90 ? "#22c55e" : attendancePct >= 70 ? "#F5820D" : "#EF4444" }} />
            </div>
            <div>
              <div style={{ fontFamily: "'Nunito',sans-serif", fontWeight: 800, fontSize: 18, color: "white", marginBottom: 4 }}>
                {attendancePct >= 90 ? "🟢 Excellent" : attendancePct >= 80 ? "🟡 Good" : attendancePct >= 60 ? "🟠 Needs Improvement" : "🔴 Poor"} — {monthLabel}
              </div>
              <div style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 13, color: "rgba(255,255,255,0.45)" }}>
                {attendancePct}% attendance · {totalSessions} patient sessions · {workedHours} logged
                {attendancePct >= 90 ? " · Outstanding performance this month." : attendancePct >= 70 ? " · Solid month overall." : " · Please review attendance with staff."}
              </div>
            </div>
          </div>

        </div>
      )}
    </div>
  );
}
