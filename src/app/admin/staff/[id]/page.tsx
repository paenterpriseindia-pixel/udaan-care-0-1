"use client";
import { useEffect, useState, useCallback } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft, Plus, Trash2, Clock, Activity, CheckCircle,
  CalendarDays, LogIn, LogOut, ChevronLeft, ChevronRight,
  TrendingUp, Users, Coffee
} from "lucide-react";
import type { User, StaffAttendance, StaffActivity, ActivityType } from "@/lib/db";

const ACTIVITY_TYPES: { value: ActivityType; label: string; color: string }[] = [
  { value: "patient_session",    label: "Patient Session",     color: "#1AAFE6" },
  { value: "parent_counselling", label: "Parent Counselling",  color: "#6B3FA0" },
  { value: "documentation",      label: "Documentation",       color: "#F5820D" },
  { value: "meeting",            label: "Meeting",             color: "#EC4899" },
  { value: "break",              label: "Break",               color: "rgba(255,255,255,0.4)" },
  { value: "admin_work",         label: "Admin Work",          color: "#8B5CF6" },
  { value: "home_visit",         label: "Home Visit",          color: "#22c55e" },
  { value: "training",           label: "Training",            color: "#F59E0B" },
  { value: "lead_followup",      label: "Lead Follow-up",      color: "#14B8A6" },
  { value: "report",             label: "Report Writing",      color: "#64748B" },
  { value: "other",              label: "Other",               color: "rgba(255,255,255,0.3)" },
];

function fmt12(iso: string) {
  return new Date(iso).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit", hour12: true });
}

function calcHours(att: StaffAttendance) {
  if (!att?.clockIn) return 0;
  const end = att.clockOut ? new Date(att.clockOut) : new Date();
  return Math.floor((end.getTime() - new Date(att.clockIn).getTime()) / 60000);
}

// ── Add Activity Modal ────────────────────────────────────────────────────────
function AddActivityModal({ onAdd, onClose }: { onAdd: (a: Partial<StaffActivity>) => Promise<void>; onClose: () => void }) {
  const [form, setForm] = useState<{ activityType: ActivityType; title: string; durationMins: number; notes: string }>({
    activityType: "patient_session", title: "", durationMins: 45, notes: "",
  });
  const [saving, setSaving] = useState(false);

  const save = async () => {
    if (!form.title) return;
    setSaving(true);
    await onAdd(form);
    setSaving(false);
    onClose();
  };

  const inp = {
    background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.12)",
    borderRadius: 8, color: "white", padding: "10px 12px", fontSize: 14, width: "100%",
    fontFamily: "'DM Sans',sans-serif", boxSizing: "border-box" as const,
  };

  return (
    <div style={{ position: "fixed" as const, inset: 0, background: "rgba(0,0,0,0.7)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000, padding: 20 }}>
      <div style={{ background: "#1A2030", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 20, padding: 28, width: "100%", maxWidth: 460 }}>
        <h3 style={{ fontFamily: "'Nunito',sans-serif", fontWeight: 800, fontSize: 18, color: "white", marginBottom: 20 }}>Log Activity</h3>

        <div style={{ display: "flex", flexDirection: "column" as const, gap: 14 }}>
          <div>
            <label style={{ display: "block", fontFamily: "'DM Sans',sans-serif", fontSize: 12, fontWeight: 600, color: "rgba(255,255,255,0.5)", marginBottom: 6 }}>Activity Type</label>
            <select style={inp} value={form.activityType} onChange={e => {
              const t = ACTIVITY_TYPES.find(x => x.value === e.target.value);
              setForm(f => ({ ...f, activityType: e.target.value as ActivityType, title: t?.label ?? f.title }));
            }}>
              {ACTIVITY_TYPES.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
            </select>
          </div>

          <div>
            <label style={{ display: "block", fontFamily: "'DM Sans',sans-serif", fontSize: 12, fontWeight: 600, color: "rgba(255,255,255,0.5)", marginBottom: 6 }}>Title / Description *</label>
            <input style={inp} placeholder="e.g. Session with Aarav Sharma, OT evaluation..." value={form.title}
              onChange={e => setForm(f => ({ ...f, title: e.target.value }))} />
          </div>

          <div>
            <label style={{ display: "block", fontFamily: "'DM Sans',sans-serif", fontSize: 12, fontWeight: 600, color: "rgba(255,255,255,0.5)", marginBottom: 8 }}>Duration</label>
            <div style={{ display: "flex", gap: 6, flexWrap: "wrap" as const }}>
              {[15, 30, 45, 60, 90, 120].map(d => (
                <button key={d} onClick={() => setForm(f => ({ ...f, durationMins: d }))} style={{
                  padding: "8px 16px", borderRadius: 8, fontFamily: "'DM Sans',sans-serif", fontWeight: 700, fontSize: 13,
                  background: form.durationMins === d ? "rgba(26,175,230,0.2)" : "rgba(255,255,255,0.05)",
                  border: form.durationMins === d ? "1px solid rgba(26,175,230,0.4)" : "1px solid rgba(255,255,255,0.1)",
                  color: form.durationMins === d ? "#1AAFE6" : "rgba(255,255,255,0.4)", cursor: "pointer",
                }}>
                  {d}m
                </button>
              ))}
              <input type="number" placeholder="Custom" min={1} max={480}
                value={form.durationMins}
                onChange={e => setForm(f => ({ ...f, durationMins: parseInt(e.target.value) || 0 }))}
                style={{ ...inp, width: 80, padding: "8px 10px", textAlign: "center" as const }} />
            </div>
          </div>

          <div>
            <label style={{ display: "block", fontFamily: "'DM Sans',sans-serif", fontSize: 12, fontWeight: 600, color: "rgba(255,255,255,0.5)", marginBottom: 6 }}>Notes (optional)</label>
            <textarea style={{ ...inp, minHeight: 70, resize: "none" as const }} placeholder="Any notes about this activity..."
              value={form.notes} onChange={e => setForm(f => ({ ...f, notes: e.target.value }))} />
          </div>
        </div>

        <div style={{ display: "flex", gap: 10, marginTop: 20 }}>
          <button onClick={onClose} style={{ flex: 1, padding: "12px", borderRadius: 10, background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", color: "rgba(255,255,255,0.5)", fontFamily: "'Nunito',sans-serif", fontWeight: 700, cursor: "pointer" }}>Cancel</button>
          <button onClick={save} disabled={!form.title || saving} style={{ flex: 2, padding: "12px", borderRadius: 10, background: "rgba(26,175,230,0.2)", border: "1px solid rgba(26,175,230,0.35)", color: "#1AAFE6", fontFamily: "'Nunito',sans-serif", fontWeight: 800, cursor: form.title ? "pointer" : "not-allowed", display: "flex", alignItems: "center", justifyContent: "center", gap: 6 }}>
            <Plus size={15} />{saving ? "Saving..." : "Log Activity"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Monthly Calendar (mini) ───────────────────────────────────────────────────
function MonthCalendar({ userId, year, month }: { userId: string; year: number; month: number }) {
  const [data, setData] = useState<Record<string, string>>({});

  useEffect(() => {
    const from = `${year}-${String(month).padStart(2,"0")}-01`;
    const to   = `${year}-${String(month).padStart(2,"0")}-31`;
    fetch(`/api/admin/staff/tracker?userId=${userId}&date=${from}`).then(r => r.json()).catch(() => ({}));
    // For simplicity show placeholder calendar — full monthly fetch goes via attendance API
  }, [userId, year, month]);

  const daysInMonth = new Date(year, month, 0).getDate();
  const firstDow    = new Date(year, month - 1, 1).getDay();

  const STATUS_COLOR: Record<string, string> = {
    present: "#22c55e", absent: "#EF4444", half_day: "#F5820D",
    leave: "#6B3FA0", holiday: "#64748B",
  };

  return (
    <div style={{ background: "rgba(255,255,255,0.03)", borderRadius: 12, padding: 16 }}>
      <div style={{ fontFamily: "'Nunito',sans-serif", fontWeight: 700, fontSize: 14, color: "rgba(255,255,255,0.7)", marginBottom: 12, textAlign: "center" as const }}>
        {new Date(year, month-1).toLocaleDateString("en-IN", { month: "long", year: "numeric" })}
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(7,1fr)", gap: 3, marginBottom: 6 }}>
        {["S","M","T","W","T","F","S"].map((d,i) => (
          <div key={i} style={{ textAlign: "center" as const, fontFamily: "'DM Sans',sans-serif", fontSize: 10, color: "rgba(255,255,255,0.3)", fontWeight: 700 }}>{d}</div>
        ))}
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(7,1fr)", gap: 3 }}>
        {Array.from({ length: firstDow }).map((_, i) => <div key={`e${i}`} />)}
        {Array.from({ length: daysInMonth }, (_, i) => i + 1).map(day => {
          const dateStr = `${year}-${String(month).padStart(2,"0")}-${String(day).padStart(2,"0")}`;
          const status = data[dateStr];
          const isToday = dateStr === new Date().toISOString().split("T")[0];
          return (
            <div key={day} style={{
              height: 28, borderRadius: 6, display: "flex", alignItems: "center", justifyContent: "center",
              fontFamily: "'DM Sans',sans-serif", fontSize: 11,
              background: status ? `${STATUS_COLOR[status]}22` : isToday ? "rgba(26,175,230,0.15)" : "rgba(255,255,255,0.03)",
              border: isToday ? "1px solid rgba(26,175,230,0.3)" : "1px solid transparent",
              color: status ? STATUS_COLOR[status] : isToday ? "#1AAFE6" : "rgba(255,255,255,0.4)",
              fontWeight: isToday ? 700 : 400,
            }}>
              {day}
            </div>
          );
        })}
      </div>
      <div style={{ display: "flex", gap: 8, marginTop: 12, flexWrap: "wrap" as const }}>
        {[["#22c55e","Present"],["#EF4444","Absent"],["#6B3FA0","Leave"],["#F5820D","Half"]].map(([c,l]) => (
          <div key={l} style={{ display: "flex", alignItems: "center", gap: 4, fontFamily: "'DM Sans',sans-serif", fontSize: 10, color: "rgba(255,255,255,0.4)" }}>
            <div style={{ width: 8, height: 8, borderRadius: 2, background: c }} />{l}
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Main Staff Detail Page ────────────────────────────────────────────────────
export default function StaffDetailPage() {
  const params = useParams();
  const userId = params.id as string;

  const [user, setUser]           = useState<User | null>(null);
  const [attendance, setAttendance] = useState<StaffAttendance | null>(null);
  const [activities, setActivities] = useState<StaffActivity[]>([]);
  const [loading, setLoading]     = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [date, setDate]           = useState(new Date().toISOString().split("T")[0]);

  const now = new Date();
  const [viewYear]  = useState(now.getFullYear());
  const [viewMonth] = useState(now.getMonth() + 1);

  const load = useCallback(() => {
    setLoading(true);
    Promise.all([
      fetch(`/api/admin/users/${userId}`).then(r => r.json()).catch(() => null),
      fetch(`/api/admin/staff/tracker?userId=${userId}&date=${date}`).then(r => r.json()).catch(() => ({ attendance: null, activities: [] })),
    ]).then(([u, d]) => {
      setUser(u);
      setAttendance(d.attendance ?? null);
      setActivities(Array.isArray(d.activities) ? d.activities : []);
      setLoading(false);
    });
  }, [userId, date]);

  useEffect(() => { load(); }, [load]);

  const doAction = async (action: string, extra?: object) => {
    await fetch("/api/admin/staff/tracker", {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action, userId, date, ...extra }),
    });
    load();
  };

  const addActivity = async (a: Partial<StaffActivity>) => {
    await doAction("add_activity", { ...a, date });
  };

  const deleteActivity = async (actId: string) => {
    await doAction("delete_activity", { activityId: actId });
  };

  const totalActivityMins = activities.reduce((s, a) => s + (a.durationMins ?? 0), 0);
  const sessionCount = activities.filter(a => a.activityType === "patient_session").length;
  const breakMins    = activities.filter(a => a.activityType === "break").reduce((s, a) => s + a.durationMins, 0);
  const workedMins   = attendance ? calcHours(attendance) : 0;
  const isToday      = date === new Date().toISOString().split("T")[0];

  const prevDay = () => { const d = new Date(date); d.setDate(d.getDate() - 1); setDate(d.toISOString().split("T")[0]); };
  const nextDay = () => { const d = new Date(date); d.setDate(d.getDate() + 1); setDate(d.toISOString().split("T")[0]); };

  const card = { background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 16, padding: 20 };

  return (
    <div>
      {showModal && <AddActivityModal onAdd={addActivity} onClose={() => setShowModal(false)} />}

      {/* Back + name */}
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 24 }}>
        <Link href="/admin/staff" style={{ display: "flex", alignItems: "center", gap: 6, padding: "8px 14px", borderRadius: 10, background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", color: "rgba(255,255,255,0.5)", textDecoration: "none", fontFamily: "'DM Sans',sans-serif", fontSize: 13 }}>
          <ArrowLeft size={14} /> All Staff
        </Link>
        {user && (
          <div>
            <h1 style={{ fontFamily: "'Nunito',sans-serif", fontWeight: 900, fontSize: 22, color: "white", margin: 0 }}>{user.name}</h1>
            <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 12, color: "rgba(255,255,255,0.4)", margin: 0 }}>{user.role} · {user.email}</p>
          </div>
        )}
      </div>

      {/* Date nav */}
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 22, flexWrap: "wrap" as const }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, background: "rgba(255,255,255,0.04)", borderRadius: 10, padding: "8px 12px" }}>
          <button onClick={prevDay} style={{ width: 28, height: 28, borderRadius: 6, background: "rgba(255,255,255,0.06)", border: "none", color: "white", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}><ChevronLeft size={14} /></button>
          <span style={{ fontFamily: "'Nunito',sans-serif", fontWeight: 700, fontSize: 14, color: "white", minWidth: 180, textAlign: "center" as const }}>
            {isToday ? "Today · " : ""}{new Date(date + "T00:00:00").toLocaleDateString("en-IN", { weekday: "short", day: "numeric", month: "long" })}
          </span>
          <button onClick={nextDay} disabled={isToday} style={{ width: 28, height: 28, borderRadius: 6, background: "rgba(255,255,255,0.06)", border: "none", color: isToday ? "rgba(255,255,255,0.2)" : "white", cursor: isToday ? "not-allowed" : "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}><ChevronRight size={14} /></button>
        </div>

        {/* Clock in/out buttons */}
        {isToday && !attendance?.clockIn && (
          <button onClick={() => doAction("clock_in")} style={{ display: "flex", alignItems: "center", gap: 6, padding: "10px 18px", borderRadius: 10, background: "rgba(34,197,94,0.15)", border: "1px solid rgba(34,197,94,0.3)", color: "#22c55e", fontFamily: "'Nunito',sans-serif", fontWeight: 700, fontSize: 13, cursor: "pointer" }}>
            <LogIn size={14} /> Clock In Now
          </button>
        )}
        {isToday && attendance?.clockIn && !attendance.clockOut && (
          <button onClick={() => doAction("clock_out")} style={{ display: "flex", alignItems: "center", gap: 6, padding: "10px 18px", borderRadius: 10, background: "rgba(26,175,230,0.15)", border: "1px solid rgba(26,175,230,0.3)", color: "#1AAFE6", fontFamily: "'Nunito',sans-serif", fontWeight: 700, fontSize: 13, cursor: "pointer" }}>
            <LogOut size={14} /> Clock Out
          </button>
        )}
        <button onClick={() => setShowModal(true)} style={{ display: "flex", alignItems: "center", gap: 6, padding: "10px 18px", borderRadius: 10, background: "rgba(107,63,160,0.15)", border: "1px solid rgba(107,63,160,0.3)", color: "#6B3FA0", fontFamily: "'Nunito',sans-serif", fontWeight: 700, fontSize: 13, cursor: "pointer" }}>
          <Plus size={14} /> Log Activity
        </button>
        <Link href={`/admin/staff/${userId}/performance`} style={{ display: "flex", alignItems: "center", gap: 6, padding: "10px 18px", borderRadius: 10, background: "rgba(245,130,13,0.1)", border: "1px solid rgba(245,130,13,0.25)", color: "#F5820D", fontFamily: "'Nunito',sans-serif", fontWeight: 700, fontSize: 13, textDecoration: "none" }}>
          <TrendingUp size={14} /> Performance Report
        </Link>

      </div>

      <div className="grid-sidebar-right" style={{ gap: 20 }}>

        {/* LEFT: Activity Timeline */}
        <div>
          {/* Summary cards */}
          <div className="grid-responsive-4" style={{ gap: 10, marginBottom: 16 }}>
            {[
              { label: "Clock In", value: attendance?.clockIn ? fmt12(attendance.clockIn) : "—", color: "#22c55e" },
              { label: "Clock Out", value: attendance?.clockOut ? fmt12(attendance.clockOut) : attendance?.clockIn ? "Still in" : "—", color: "#1AAFE6" },
              { label: "Sessions", value: sessionCount, color: "#F5820D" },
              { label: "Hours Worked", value: workedMins > 0 ? `${Math.floor(workedMins/60)}h ${workedMins%60}m` : "—", color: "#6B3FA0" },
            ].map(s => (
              <div key={s.label} style={{ ...card, padding: "12px 14px" }}>
                <div style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 11, color: "rgba(255,255,255,0.4)", marginBottom: 4 }}>{s.label}</div>
                <div style={{ fontFamily: "'Nunito',sans-serif", fontWeight: 800, fontSize: 16, color: s.color }}>{String(s.value)}</div>
              </div>
            ))}
          </div>

          {/* Activity Timeline */}
          <div style={card}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
              <h2 style={{ fontFamily: "'Nunito',sans-serif", fontWeight: 800, fontSize: 16, color: "white", margin: 0 }}>Activity Log</h2>
              <div style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 12, color: "rgba(255,255,255,0.35)" }}>
                {activities.length} activities · {Math.floor(totalActivityMins/60)}h {totalActivityMins%60}m logged
              </div>
            </div>

            {loading ? (
              <div style={{ textAlign: "center" as const, padding: "30px 0", color: "rgba(255,255,255,0.3)", fontFamily: "'DM Sans',sans-serif", fontSize: 13 }}>Loading...</div>
            ) : activities.length === 0 ? (
              <div style={{ textAlign: "center" as const, padding: "40px 0", color: "rgba(255,255,255,0.2)", fontFamily: "'DM Sans',sans-serif" }}>
                <Activity size={32} style={{ opacity: 0.3, marginBottom: 10 }} />
                <div>No activities logged for this day</div>
                <button onClick={() => setShowModal(true)} style={{ marginTop: 12, padding: "8px 18px", borderRadius: 8, background: "rgba(26,175,230,0.12)", border: "1px solid rgba(26,175,230,0.25)", color: "#1AAFE6", fontFamily: "'DM Sans',sans-serif", fontWeight: 600, fontSize: 12, cursor: "pointer" }}>
                  + Log First Activity
                </button>
              </div>
            ) : (
              <div style={{ position: "relative" as const }}>
                {/* Timeline line */}
                <div style={{ position: "absolute" as const, left: 19, top: 0, bottom: 0, width: 2, background: "rgba(255,255,255,0.06)" }} />
                <div style={{ display: "flex", flexDirection: "column" as const, gap: 0 }}>
                  {activities.map((act, idx) => {
                    const meta = ACTIVITY_TYPES.find(t => t.value === act.activityType);
                    return (
                      <div key={act.id} style={{ display: "flex", gap: 14, paddingBottom: 16, position: "relative" as const }}>
                        {/* Dot */}
                        <div style={{ width: 40, height: 40, borderRadius: "50%", background: `${meta?.color ?? "#fff"}18`, border: `2px solid ${meta?.color ?? "rgba(255,255,255,0.2)"}`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, zIndex: 1 }}>
                          <span style={{ fontSize: 14 }}>
                            {act.activityType === "patient_session" ? "👤" : act.activityType === "break" ? "☕" : act.activityType === "meeting" ? "🗓" : "•"}
                          </span>
                        </div>
                        {/* Content */}
                        <div style={{ flex: 1, background: "rgba(255,255,255,0.03)", borderRadius: 10, padding: "12px 14px", border: "1px solid rgba(255,255,255,0.06)" }}>
                          <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 8 }}>
                            <div style={{ flex: 1 }}>
                              <div style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 11, fontWeight: 700, color: meta?.color ?? "rgba(255,255,255,0.5)", marginBottom: 2, textTransform: "uppercase" as const, letterSpacing: "0.05em" }}>{meta?.label}</div>
                              <div style={{ fontFamily: "'Nunito',sans-serif", fontWeight: 700, fontSize: 14, color: "white", marginBottom: act.notes ? 6 : 0 }}>{act.title}</div>
                              {act.notes && <div style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 12, color: "rgba(255,255,255,0.45)", fontStyle: "italic" }}>{act.notes}</div>}
                            </div>
                            <div style={{ display: "flex", alignItems: "center", gap: 8, flexShrink: 0 }}>
                              {act.durationMins > 0 && (
                                <span style={{ fontFamily: "'Nunito',sans-serif", fontWeight: 700, fontSize: 13, color: "rgba(255,255,255,0.5)", background: "rgba(255,255,255,0.06)", padding: "3px 10px", borderRadius: 20 }}>
                                  {act.durationMins}m
                                </span>
                              )}
                              <button onClick={() => deleteActivity(act.id)} style={{ width: 28, height: 28, borderRadius: 6, background: "transparent", border: "1px solid rgba(255,255,255,0.08)", color: "rgba(255,255,255,0.25)", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
                                <Trash2 size={11} />
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* RIGHT: Sidebar — Calendar + Summary */}
        <div style={{ display: "flex", flexDirection: "column" as const, gap: 16 }}>

          {/* This month at a glance */}
          <MonthCalendar userId={userId} year={viewYear} month={viewMonth} />

          {/* Leave type buttons */}
          <div style={card}>
            <div style={{ fontFamily: "'Nunito',sans-serif", fontWeight: 700, fontSize: 13, color: "rgba(255,255,255,0.6)", marginBottom: 10 }}>Mark Today As</div>
            <div style={{ display: "flex", flexDirection: "column" as const, gap: 6 }}>
              {[
                { label: "Present", action: () => doAction("mark_status", { status: "present" }), color: "#22c55e" },
                { label: "Casual Leave (CL)", action: () => doAction("mark_status", { status: "leave", leaveType: "CL" }), color: "#6B3FA0" },
                { label: "Sick Leave (SL)", action: () => doAction("mark_status", { status: "leave", leaveType: "SL" }), color: "#EF4444" },
                { label: "Half Day", action: () => doAction("mark_status", { status: "half_day" }), color: "#F5820D" },
                { label: "Holiday", action: () => doAction("mark_status", { status: "holiday" }), color: "#64748B" },
              ].map(btn => (
                <button key={btn.label} onClick={btn.action} style={{
                  width: "100%", padding: "9px 12px", borderRadius: 8, textAlign: "left" as const,
                  background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)",
                  color: btn.color, fontFamily: "'DM Sans',sans-serif", fontSize: 13, fontWeight: 600, cursor: "pointer",
                }}>
                  {btn.label}
                </button>
              ))}
            </div>
          </div>

          {/* Quick stats */}
          <div style={card}>
            <div style={{ fontFamily: "'Nunito',sans-serif", fontWeight: 700, fontSize: 13, color: "rgba(255,255,255,0.6)", marginBottom: 12 }}>Today's Summary</div>
            {[
              { label: "Patient Sessions", value: sessionCount, color: "#1AAFE6" },
              { label: "Break Time", value: breakMins > 0 ? `${breakMins}m` : "—", color: "rgba(255,255,255,0.4)" },
              { label: "Total Logged", value: `${Math.floor(totalActivityMins/60)}h ${totalActivityMins%60}m`, color: "#22c55e" },
            ].map(s => (
              <div key={s.label} style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
                <span style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 13, color: "rgba(255,255,255,0.5)" }}>{s.label}</span>
                <span style={{ fontFamily: "'Nunito',sans-serif", fontWeight: 700, fontSize: 14, color: s.color }}>{String(s.value)}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
