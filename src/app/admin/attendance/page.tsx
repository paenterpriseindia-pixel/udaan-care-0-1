"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import {
  ChevronLeft, ChevronRight, Download, Users,
  CheckCircle, XCircle, Minus, Calendar
} from "lucide-react";
import type { User, StaffAttendance } from "@/lib/db";

// Status config
const S: Record<string, { label: string; short: string; color: string; bg: string }> = {
  present:  { label: "Present",   short: "P",  color: "#22c55e", bg: "rgba(34,197,94,0.18)" },
  absent:   { label: "Absent",    short: "A",  color: "#EF4444", bg: "rgba(239,68,68,0.15)" },
  half_day: { label: "Half Day",  short: "H",  color: "#F5820D", bg: "rgba(245,130,13,0.15)" },
  leave:    { label: "Leave",     short: "L",  color: "#6B3FA0", bg: "rgba(107,63,160,0.15)" },
  holiday:  { label: "Holiday",   short: "HO", color: "#64748B", bg: "rgba(100,116,139,0.12)" },
};

function daysInMonth(y: number, m: number) { return new Date(y, m, 0).getDate(); }
function isSunday(y: number, m: number, d: number) { return new Date(y, m - 1, d).getDay() === 0; }
function todayStr() { return new Date().toISOString().split("T")[0]; }
function dateStr(y: number, m: number, d: number) {
  return `${y}-${String(m).padStart(2,"0")}-${String(d).padStart(2,"0")}`;
}

export default function AttendancePage() {
  const now = new Date();
  const [year,  setYear]  = useState(now.getFullYear());
  const [month, setMonth] = useState(now.getMonth() + 1);
  const [staff,  setStaff]  = useState<User[]>([]);
  const [attMap, setAttMap] = useState<Map<string, Map<string, StaffAttendance>>>(new Map()); // userId → date → att
  const [loading, setLoading] = useState(true);

  const days = daysInMonth(year, month);
  const today = todayStr();

  // Load all users + their month attendance
  useEffect(() => {
    setLoading(true);
    const from = dateStr(year, month, 1);
    const to   = dateStr(year, month, days);

    Promise.all([
      fetch("/api/admin/staff/tracker").then(r => r.json()),
      // Fetch attendance per day across the month — use a range query
      fetch(`/api/admin/attendance?from=${from}&to=${to}`).then(r => r.json()).catch(() => []),
    ]).then(([overview, attendances]) => {
      setStaff((overview.staff ?? []) as User[]);
      const m = new Map<string, Map<string, StaffAttendance>>();
      ((attendances as StaffAttendance[]) || []).forEach(att => {
        if (!m.has(att.userId)) m.set(att.userId, new Map());
        m.get(att.userId)!.set(att.date, att);
      });
      setAttMap(m);
      setLoading(false);
    });
  }, [year, month, days]);

  const prevMonth = () => { if (month === 1) { setYear(y => y-1); setMonth(12); } else setMonth(m => m-1); };
  const nextMonth = () => {
    const isCurrentMonth = year === now.getFullYear() && month === now.getMonth() + 1;
    if (isCurrentMonth) return;
    if (month === 12) { setYear(y => y+1); setMonth(1); } else setMonth(m => m+1);
  };
  const isCurrentMonth = year === now.getFullYear() && month === now.getMonth() + 1;

  const monthName = new Date(year, month - 1).toLocaleDateString("en-IN", { month: "long", year: "numeric" });

  // Compute summary per staff
  const staffSummary = (userId: string) => {
    const uMap = attMap.get(userId) ?? new Map();
    let present = 0, absent = 0, leave = 0, halfDay = 0;
    for (let d = 1; d <= (isCurrentMonth ? now.getDate() : days); d++) {
      if (isSunday(year, month, d)) continue;
      const att = uMap.get(dateStr(year, month, d));
      if (!att || att.status === "absent") absent++;
      else if (att.status === "present") present++;
      else if (att.status === "leave") leave++;
      else if (att.status === "half_day") halfDay++;
    }
    const workingDays = isCurrentMonth ? now.getDate() : days;
    const pct = workingDays > 0 ? Math.round((present / workingDays) * 100) : 0;
    return { present, absent, leave, halfDay, pct };
  };

  // Mark attendance via quick action
  const markAtt = async (userId: string, date: string, status: string, leaveType?: string) => {
    await fetch("/api/admin/staff/tracker", {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "mark_status", userId, date, status, leaveType }),
    });
    // Optimistic update
    setAttMap(prev => {
      const next = new Map(prev);
      if (!next.has(userId)) next.set(userId, new Map());
      const uMap = new Map(next.get(userId)!);
      const existing = uMap.get(date);
      uMap.set(date, {
        id: existing?.id ?? "", userId, date, status: status as StaffAttendance["status"],
        leaveType: leaveType as StaffAttendance["leaveType"],
        createdAt: "", updatedAt: "",
      });
      next.set(userId, uMap);
      return next;
    });
  };

  // Export CSV
  const exportCSV = () => {
    const header = ["Staff Name", ...Array.from({length: days}, (_, i) => String(i+1)), "Present", "Absent", "Leave", "Attendance%"].join(",");
    const rows = staff.map(u => {
      const uMap = attMap.get(u.id) ?? new Map();
      const summary = staffSummary(u.id);
      const dayCols = Array.from({length: days}, (_, i) => {
        const d = i + 1;
        if (isSunday(year, month, d)) return "WO";
        const att = uMap.get(dateStr(year, month, d));
        return S[att?.status ?? "absent"]?.short ?? "-";
      });
      return [u.name, ...dayCols, summary.present, summary.absent, summary.leave, summary.pct + "%"].join(",");
    });
    const csv = [header, ...rows].join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement("a"); a.href = url;
    a.download = `attendance-${monthName.replace(" ","-")}.csv`; a.click();
  };

  return (
    <div>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 24, flexWrap: "wrap" as const, gap: 12 }}>
        <div>
          <h1 style={{ fontFamily: "'Nunito',sans-serif", fontWeight: 900, fontSize: 26, color: "white", marginBottom: 4 }}>Attendance Register</h1>
          <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 13, color: "rgba(255,255,255,0.4)" }}>Full monthly attendance for all staff — mark, review, export</p>
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <button onClick={exportCSV} style={{ display: "flex", alignItems: "center", gap: 7, padding: "10px 18px", borderRadius: 10, background: "rgba(34,197,94,0.1)", border: "1px solid rgba(34,197,94,0.25)", color: "#22c55e", fontFamily: "'DM Sans',sans-serif", fontSize: 13, fontWeight: 600, cursor: "pointer" }}>
            <Download size={14} /> Export CSV
          </button>
        </div>
      </div>

      {/* Month navigator */}
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 24 }}>
        <button onClick={prevMonth} style={{ width: 36, height: 36, borderRadius: 8, background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", color: "white", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <ChevronLeft size={16} />
        </button>
        <div style={{ fontFamily: "'Nunito',sans-serif", fontWeight: 800, fontSize: 18, color: "white", minWidth: 200, textAlign: "center" as const }}>{monthName}</div>
        <button onClick={nextMonth} disabled={isCurrentMonth} style={{ width: 36, height: 36, borderRadius: 8, background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", color: isCurrentMonth ? "rgba(255,255,255,0.2)" : "white", cursor: isCurrentMonth ? "not-allowed" : "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <ChevronRight size={16} />
        </button>
      </div>

      {/* Legend */}
      <div style={{ display: "flex", gap: 12, marginBottom: 20, flexWrap: "wrap" as const }}>
        {Object.entries(S).map(([key, val]) => (
          <div key={key} style={{ display: "flex", alignItems: "center", gap: 6, fontFamily: "'DM Sans',sans-serif", fontSize: 12, color: "rgba(255,255,255,0.5)" }}>
            <div style={{ width: 22, height: 22, borderRadius: 4, background: val.bg, display: "flex", alignItems: "center", justifyContent: "center", color: val.color, fontSize: 10, fontWeight: 800 }}>{val.short}</div>
            {val.label}
          </div>
        ))}
        <div style={{ display: "flex", alignItems: "center", gap: 6, fontFamily: "'DM Sans',sans-serif", fontSize: 12, color: "rgba(255,255,255,0.5)" }}>
          <div style={{ width: 22, height: 22, borderRadius: 4, background: "rgba(255,255,255,0.05)", display: "flex", alignItems: "center", justifyContent: "center", color: "rgba(255,255,255,0.2)", fontSize: 10, fontWeight: 800 }}>WO</div>
          Week Off (Sunday)
        </div>
      </div>

      {/* Attendance Grid */}
      {loading ? (
        <div style={{ textAlign: "center" as const, padding: "60px 0", color: "rgba(255,255,255,0.3)", fontFamily: "'DM Sans',sans-serif" }}>Loading attendance data...</div>
      ) : staff.length === 0 ? (
        <div style={{ textAlign: "center" as const, padding: "60px 0", color: "rgba(255,255,255,0.2)", fontFamily: "'DM Sans',sans-serif" }}>
          <Users size={40} style={{ opacity: 0.3, marginBottom: 12 }} />
          <div>No staff yet — add users from Admin panel</div>
        </div>
      ) : (
        <div style={{ overflowX: "auto" as const }}>
          <table style={{ borderCollapse: "collapse" as const, minWidth: "100%", fontFamily: "'DM Sans',sans-serif" }}>
            {/* Header row — days */}
            <thead>
              <tr>
                <th style={{ padding: "10px 16px", textAlign: "left" as const, fontWeight: 700, fontSize: 12, color: "rgba(255,255,255,0.4)", background: "rgba(255,255,255,0.04)", borderBottom: "1px solid rgba(255,255,255,0.07)", position: "sticky" as const, left: 0, zIndex: 10, minWidth: 160, letterSpacing: "0.05em" }}>STAFF</th>
                {Array.from({ length: days }, (_, i) => i + 1).map(d => {
                  const sun = isSunday(year, month, d);
                  const ds  = dateStr(year, month, d);
                  const isT = ds === today;
                  return (
                    <th key={d} style={{
                      width: 32, padding: "6px 2px", textAlign: "center" as const, fontSize: 11,
                      fontWeight: isT ? 800 : 600,
                      color: isT ? "#1AAFE6" : sun ? "rgba(239,68,68,0.5)" : "rgba(255,255,255,0.3)",
                      background: isT ? "rgba(26,175,230,0.08)" : "rgba(255,255,255,0.03)",
                      borderBottom: "1px solid rgba(255,255,255,0.06)",
                      borderLeft: isT ? "1px solid rgba(26,175,230,0.2)" : "none",
                      borderRight: isT ? "1px solid rgba(26,175,230,0.2)" : "none",
                    }}>
                      {d}
                    </th>
                  );
                })}
                {/* Summary columns */}
                {[["P","#22c55e"],["A","#EF4444"],["L","#6B3FA0"],["%","#F5820D"]].map(([lbl, clr]) => (
                  <th key={lbl} style={{ padding: "6px 10px", textAlign: "center" as const, fontSize: 11, fontWeight: 700, color: clr, background: "rgba(255,255,255,0.04)", borderBottom: "1px solid rgba(255,255,255,0.07)", borderLeft: "1px solid rgba(255,255,255,0.06)", minWidth: 36 }}>{lbl}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {staff.map((user, ri) => {
                const uMap   = attMap.get(user.id) ?? new Map();
                const summary = staffSummary(user.id);
                return (
                  <tr key={user.id} style={{ background: ri % 2 === 0 ? "transparent" : "rgba(255,255,255,0.015)" }}>
                    {/* Name */}
                    <td style={{ padding: "8px 16px", fontWeight: 700, fontSize: 13, color: "white", background: ri % 2 === 0 ? "rgba(255,255,255,0.02)" : "rgba(255,255,255,0.03)", borderBottom: "1px solid rgba(255,255,255,0.05)", position: "sticky" as const, left: 0, zIndex: 5 }}>
                      <Link href={`/admin/staff/${user.id}`} style={{ textDecoration: "none", color: "white" }}>{user.name}</Link>
                      <div style={{ fontSize: 10, color: "rgba(255,255,255,0.3)", fontWeight: 400 }}>{user.role}</div>
                    </td>

                    {/* Day cells */}
                    {Array.from({ length: days }, (_, i) => i + 1).map(d => {
                      const sun = isSunday(year, month, d);
                      const ds  = dateStr(year, month, d);
                      const att = uMap.get(ds);
                      const isT = ds === today;
                      const isFuture = ds > today;

                      if (sun) return (
                        <td key={d} style={{ textAlign: "center" as const, borderBottom: "1px solid rgba(255,255,255,0.04)", background: "rgba(255,255,255,0.02)" }}>
                          <div style={{ width: 26, height: 26, margin: "0 auto", borderRadius: 4, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 8, color: "rgba(255,255,255,0.15)", fontWeight: 700 }}>WO</div>
                        </td>
                      );

                      if (isFuture) return (
                        <td key={d} style={{ textAlign: "center" as const, borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
                          <div style={{ width: 26, height: 26, margin: "0 auto" }} />
                        </td>
                      );

                      const st    = att?.status ?? "absent";
                      const meta  = S[st];
                      return (
                        <td key={d} style={{ textAlign: "center" as const, borderBottom: "1px solid rgba(255,255,255,0.04)", borderLeft: isT ? "1px solid rgba(26,175,230,0.2)" : "none", borderRight: isT ? "1px solid rgba(26,175,230,0.2)" : "none", background: isT ? "rgba(26,175,230,0.04)" : "transparent" }}>
                          <div
                            title={`${user.name} · ${ds} · ${meta?.label ?? "Absent"}\nClick to cycle status`}
                            onClick={() => {
                              const cycle: Record<string, string> = { absent: "present", present: "half_day", half_day: "leave", leave: "absent", holiday: "absent" };
                              markAtt(user.id, ds, cycle[st] ?? "present");
                            }}
                            style={{ width: 26, height: 26, margin: "0 auto", borderRadius: 4, background: meta?.bg ?? "rgba(239,68,68,0.12)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 9, fontWeight: 800, color: meta?.color ?? "#EF4444", cursor: "pointer", transition: "all 0.15s", userSelect: "none" as const }}
                          >
                            {meta?.short ?? "A"}
                          </div>
                        </td>
                      );
                    })}

                    {/* Summary */}
                    {[
                      { val: summary.present, color: "#22c55e" },
                      { val: summary.absent,  color: "#EF4444" },
                      { val: summary.leave,   color: "#6B3FA0" },
                      { val: summary.pct + "%", color: summary.pct >= 80 ? "#22c55e" : summary.pct >= 60 ? "#F5820D" : "#EF4444" },
                    ].map((s, i) => (
                      <td key={i} style={{ textAlign: "center" as const, padding: "0 10px", fontFamily: "'Nunito',sans-serif", fontWeight: 800, fontSize: 13, color: s.color, borderBottom: "1px solid rgba(255,255,255,0.05)", borderLeft: "1px solid rgba(255,255,255,0.06)", background: "rgba(255,255,255,0.02)" }}>{String(s.val)}</td>
                    ))}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Quick tip */}
      <div style={{ marginTop: 20, padding: "12px 16px", borderRadius: 10, background: "rgba(26,175,230,0.06)", border: "1px solid rgba(26,175,230,0.15)", fontFamily: "'DM Sans',sans-serif", fontSize: 12, color: "rgba(255,255,255,0.4)" }}>
        💡 <strong style={{ color: "#1AAFE6" }}>Tip:</strong> Click any cell to cycle its status (Absent → Present → Half Day → Leave → Absent). For clock-in times, use <Link href="/admin/staff" style={{ color: "#1AAFE6" }}>Staff Tracker</Link>.
      </div>
    </div>
  );
}
