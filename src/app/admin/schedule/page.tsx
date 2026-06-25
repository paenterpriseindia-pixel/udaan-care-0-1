"use client";
import { useEffect, useState } from "react";
import { Save, Plus, Trash2, Calendar, Clock, Coffee, CheckCircle, AlertCircle } from "lucide-react";
import type { DoctorAvailability, BlockedDate } from "@/lib/db";

const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const FULL_DAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

const TIMES: string[] = [];
for (let h = 6; h <= 21; h++) {
  TIMES.push(`${String(h).padStart(2, "0")}:00`);
  TIMES.push(`${String(h).padStart(2, "0")}:30`);
}

function fmt12(t: string) {
  const [h, m] = t.split(":").map(Number);
  const ampm = h < 12 ? "AM" : "PM";
  const h12 = h % 12 === 0 ? 12 : h % 12;
  return `${h12}:${String(m).padStart(2, "0")} ${ampm}`;
}

export default function SchedulePage() {
  const [avail, setAvail] = useState<DoctorAvailability>({
    id: "", workingDays: [1,2,3,4,5,6],
    startTime: "10:00", endTime: "19:00",
    breakStart: "13:00", breakEnd: "14:00",
    sessionDurationMins: 45, bufferMins: 10, updatedAt: "",
  });
  const [blocked, setBlocked] = useState<BlockedDate[]>([]);
  const [newDate, setNewDate] = useState("");
  const [newReason, setNewReason] = useState("");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/admin/availability")
      .then(r => r.json())
      .then(d => {
        if (d.availability) setAvail(d.availability);
        if (d.blockedDates) setBlocked(d.blockedDates);
        setLoading(false);
      }).catch(() => setLoading(false));
  }, []);

  const toggleDay = (day: number) => {
    setAvail(a => ({
      ...a,
      workingDays: a.workingDays.includes(day)
        ? a.workingDays.filter(d => d !== day)
        : [...a.workingDays, day].sort(),
    }));
  };

  const saveAvail = async () => {
    setSaving(true);
    await fetch("/api/admin/availability", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(avail),
    });
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const addBlockedDate = async () => {
    if (!newDate) return;
    const res = await fetch("/api/admin/blocked-dates", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ date: newDate, reason: newReason || "Unavailable" }),
    });
    const created = await res.json();
    setBlocked(b => [...b, created].sort((a, x) => a.date.localeCompare(x.date)));
    setNewDate(""); setNewReason("");
  };

  const removeBlockedDate = async (id: string) => {
    await fetch(`/api/admin/blocked-dates?id=${id}`, { method: "DELETE" });
    setBlocked(b => b.filter(x => x.id !== id));
  };

  // Preview: how many slots per day
  const slotsPerDay = () => {
    const [sh, sm] = avail.startTime.split(":").map(Number);
    const [eh, em] = avail.endTime.split(":").map(Number);
    const [bsh, bsm] = avail.breakStart ? avail.breakStart.split(":").map(Number) : [0, 0];
    const [beh, bem] = avail.breakEnd ? avail.breakEnd.split(":").map(Number) : [0, 0];
    const totalMins = (eh * 60 + em) - (sh * 60 + sm);
    const breakMins = avail.breakStart ? (beh * 60 + bem) - (bsh * 60 + bsm) : 0;
    const workMins = totalMins - breakMins;
    return Math.floor(workMins / (avail.sessionDurationMins + avail.bufferMins));
  };

  const card = {
    background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)",
    borderRadius: 16, padding: 24, marginBottom: 20,
  };
  const label = { fontSize: 13, fontWeight: 700, color: "rgba(255,255,255,0.6)", marginBottom: 8, display: "block" as const };
  const select = {
    background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.12)",
    borderRadius: 8, color: "white", padding: "10px 12px", fontSize: 14, width: "100%",
  };

  if (loading) return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: 300, color: "rgba(255,255,255,0.4)", fontFamily: "'DM Sans',sans-serif" }}>
      Loading schedule...
    </div>
  );

  return (
    <div>
      {/* Header */}
      <div style={{ marginBottom: 28, display: "flex", alignItems: "flex-start", justifyContent: "space-between", flexWrap: "wrap", gap: 12 }}>
        <div>
          <h1 style={{ fontFamily: "'Nunito',sans-serif", fontWeight: 900, fontSize: 26, color: "white", marginBottom: 4 }}>
            My Schedule
          </h1>
          <p style={{ fontSize: 13, color: "rgba(255,255,255,0.4)", fontFamily: "'DM Sans',sans-serif" }}>
            Set your working hours and days — the booking page updates automatically
          </p>
        </div>
        <button onClick={saveAvail} disabled={saving} style={{
          display: "flex", alignItems: "center", gap: 8, padding: "12px 24px", borderRadius: 10,
          background: saved ? "rgba(34,197,94,0.2)" : "rgba(26,175,230,0.15)",
          border: `1px solid ${saved ? "rgba(34,197,94,0.4)" : "rgba(26,175,230,0.3)"}`,
          color: saved ? "#22c55e" : "#1AAFE6", fontFamily: "'Nunito',sans-serif", fontWeight: 800,
          fontSize: 14, cursor: saving ? "not-allowed" : "pointer", transition: "all 0.2s",
        }}>
          {saved ? <CheckCircle size={16} /> : <Save size={16} />}
          {saving ? "Saving..." : saved ? "Saved!" : "Save Schedule"}
        </button>
      </div>

      {/* Preview banner */}
      <div style={{ background: "rgba(26,175,230,0.08)", border: "1px solid rgba(26,175,230,0.2)", borderRadius: 12, padding: "14px 20px", marginBottom: 24, display: "flex", alignItems: "center", gap: 12 }}>
        <Calendar size={18} style={{ color: "#1AAFE6", flexShrink: 0 }} />
        <div style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 14, color: "rgba(255,255,255,0.8)" }}>
          <strong style={{ color: "#1AAFE6" }}>{slotsPerDay()} appointment slots</strong> available per working day ·{" "}
          Working <strong style={{ color: "#1AAFE6" }}>{avail.workingDays.map(d => DAYS[d]).join(", ")}</strong> ·{" "}
          <strong style={{ color: "#1AAFE6" }}>{fmt12(avail.startTime)}</strong> to <strong style={{ color: "#1AAFE6" }}>{fmt12(avail.endTime)}</strong>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>

        {/* LEFT: Working Days */}
        <div>
          <div style={card}>
            <div style={{ fontFamily: "'Nunito',sans-serif", fontWeight: 800, fontSize: 16, color: "white", marginBottom: 16, display: "flex", alignItems: "center", gap: 8 }}>
              <Calendar size={16} style={{ color: "#1AAFE6" }} /> Working Days
            </div>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              {DAYS.map((d, i) => {
                const on = avail.workingDays.includes(i);
                return (
                  <button key={d} onClick={() => toggleDay(i)} style={{
                    width: 52, height: 52, borderRadius: 12,
                    background: on ? "rgba(26,175,230,0.2)" : "rgba(255,255,255,0.04)",
                    border: `2px solid ${on ? "#1AAFE6" : "rgba(255,255,255,0.1)"}`,
                    color: on ? "#1AAFE6" : "rgba(255,255,255,0.3)",
                    fontFamily: "'Nunito',sans-serif", fontWeight: 800, fontSize: 13,
                    cursor: "pointer", transition: "all 0.15s",
                  }}>
                    {d}
                  </button>
                );
              })}
            </div>
            <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 12, color: "rgba(255,255,255,0.3)", marginTop: 12 }}>
              Tap a day to toggle — blue = working day
            </p>
          </div>

          {/* Working Hours */}
          <div style={card}>
            <div style={{ fontFamily: "'Nunito',sans-serif", fontWeight: 800, fontSize: 16, color: "white", marginBottom: 16, display: "flex", alignItems: "center", gap: 8 }}>
              <Clock size={16} style={{ color: "#6B3FA0" }} /> Working Hours
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              <div>
                <span style={label}>Start Time</span>
                <select style={select} value={avail.startTime} onChange={e => setAvail(a => ({ ...a, startTime: e.target.value }))}>
                  {TIMES.map(t => <option key={t} value={t}>{fmt12(t)}</option>)}
                </select>
              </div>
              <div>
                <span style={label}>End Time</span>
                <select style={select} value={avail.endTime} onChange={e => setAvail(a => ({ ...a, endTime: e.target.value }))}>
                  {TIMES.map(t => <option key={t} value={t}>{fmt12(t)}</option>)}
                </select>
              </div>
            </div>
          </div>

          {/* Break + Buffer */}
          <div style={card}>
            <div style={{ fontFamily: "'Nunito',sans-serif", fontWeight: 800, fontSize: 16, color: "white", marginBottom: 16, display: "flex", alignItems: "center", gap: 8 }}>
              <Coffee size={16} style={{ color: "#F5820D" }} /> Break & Buffer
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 12 }}>
              <div>
                <span style={label}>Break Start</span>
                <select style={select} value={avail.breakStart ?? ""} onChange={e => setAvail(a => ({ ...a, breakStart: e.target.value || undefined }))}>
                  <option value="">No break</option>
                  {TIMES.map(t => <option key={t} value={t}>{fmt12(t)}</option>)}
                </select>
              </div>
              <div>
                <span style={label}>Break End</span>
                <select style={select} value={avail.breakEnd ?? ""} onChange={e => setAvail(a => ({ ...a, breakEnd: e.target.value || undefined }))}>
                  <option value="">—</option>
                  {TIMES.map(t => <option key={t} value={t}>{fmt12(t)}</option>)}
                </select>
              </div>
            </div>
            <div>
              <span style={label}>Buffer between sessions (mins)</span>
              <div style={{ display: "flex", gap: 8 }}>
                {[0, 5, 10, 15, 20].map(b => (
                  <button key={b} onClick={() => setAvail(a => ({ ...a, bufferMins: b }))} style={{
                    flex: 1, padding: "10px 0", borderRadius: 8,
                    background: avail.bufferMins === b ? "rgba(245,130,13,0.2)" : "rgba(255,255,255,0.04)",
                    border: `1px solid ${avail.bufferMins === b ? "#F5820D" : "rgba(255,255,255,0.1)"}`,
                    color: avail.bufferMins === b ? "#F5820D" : "rgba(255,255,255,0.4)",
                    fontFamily: "'Nunito',sans-serif", fontWeight: 700, fontSize: 13, cursor: "pointer",
                  }}>
                    {b}m
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT: Blocked Dates */}
        <div>
          <div style={card}>
            <div style={{ fontFamily: "'Nunito',sans-serif", fontWeight: 800, fontSize: 16, color: "white", marginBottom: 4, display: "flex", alignItems: "center", gap: 8 }}>
              <AlertCircle size={16} style={{ color: "#EF4444" }} /> Block Dates
            </div>
            <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 13, color: "rgba(255,255,255,0.4)", marginBottom: 20 }}>
              Block holidays, travel days, or any date you're unavailable.
            </p>

            {/* Add new */}
            <div style={{ background: "rgba(255,255,255,0.03)", borderRadius: 10, padding: 16, marginBottom: 20 }}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 10 }}>
                <div>
                  <span style={label}>Date</span>
                  <input type="date" value={newDate} min={new Date().toISOString().split("T")[0]}
                    onChange={e => setNewDate(e.target.value)}
                    style={{ ...select, fontFamily: "'DM Sans',sans-serif" }}
                  />
                </div>
                <div>
                  <span style={label}>Reason (optional)</span>
                  <input type="text" placeholder="e.g. Holiday" value={newReason}
                    onChange={e => setNewReason(e.target.value)}
                    style={{ ...select, fontFamily: "'DM Sans',sans-serif" }}
                  />
                </div>
              </div>
              <button onClick={addBlockedDate} disabled={!newDate} style={{
                width: "100%", padding: "10px", borderRadius: 8,
                background: newDate ? "rgba(239,68,68,0.15)" : "rgba(255,255,255,0.04)",
                border: `1px solid ${newDate ? "rgba(239,68,68,0.3)" : "rgba(255,255,255,0.08)"}`,
                color: newDate ? "#EF4444" : "rgba(255,255,255,0.2)",
                fontFamily: "'Nunito',sans-serif", fontWeight: 700, fontSize: 13,
                cursor: newDate ? "pointer" : "not-allowed", display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
              }}>
                <Plus size={14} /> Block This Date
              </button>
            </div>

            {/* Blocked list */}
            {blocked.length === 0 ? (
              <div style={{ textAlign: "center", padding: "32px 0", color: "rgba(255,255,255,0.2)", fontFamily: "'DM Sans',sans-serif", fontSize: 13 }}>
                No blocked dates — you're open every working day
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {blocked.map(b => {
                  const d = new Date(b.date + "T00:00:00");
                  return (
                    <div key={b.id} style={{ display: "flex", alignItems: "center", gap: 12, padding: "12px 14px", borderRadius: 10, background: "rgba(239,68,68,0.06)", border: "1px solid rgba(239,68,68,0.15)" }}>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontFamily: "'Nunito',sans-serif", fontWeight: 700, fontSize: 14, color: "white" }}>
                          {d.toLocaleDateString("en-IN", { weekday: "short", day: "numeric", month: "short", year: "numeric" })}
                        </div>
                        <div style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 12, color: "rgba(255,255,255,0.4)" }}>{b.reason ?? "Unavailable"}</div>
                      </div>
                      <button onClick={() => removeBlockedDate(b.id)} style={{
                        width: 32, height: 32, borderRadius: 8,
                        background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.2)",
                        color: "#EF4444", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
                      }}>
                        <Trash2 size={13} />
                      </button>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Weekly Preview */}
          <div style={card}>
            <div style={{ fontFamily: "'Nunito',sans-serif", fontWeight: 800, fontSize: 16, color: "white", marginBottom: 16 }}>
              This Week at a Glance
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {Array.from({ length: 7 }, (_, i) => {
                const d = new Date(); d.setDate(d.getDate() + i);
                const dayNum = d.getDay();
                const dateStr = d.toISOString().split("T")[0];
                const isWorking = avail.workingDays.includes(dayNum);
                const isBlocked = blocked.some(b => b.date === dateStr);
                const isToday = i === 0;
                const status = isBlocked ? "blocked" : isWorking ? "open" : "off";
                return (
                  <div key={i} style={{
                    display: "flex", alignItems: "center", gap: 12, padding: "10px 14px", borderRadius: 10,
                    background: isToday ? "rgba(26,175,230,0.08)" : "rgba(255,255,255,0.02)",
                    border: `1px solid ${isToday ? "rgba(26,175,230,0.2)" : "rgba(255,255,255,0.05)"}`,
                  }}>
                    <div style={{ width: 44 }}>
                      <div style={{ fontFamily: "'Nunito',sans-serif", fontWeight: 800, fontSize: 12, color: isToday ? "#1AAFE6" : "rgba(255,255,255,0.5)" }}>{FULL_DAYS[dayNum].slice(0,3)}</div>
                      <div style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 11, color: "rgba(255,255,255,0.3)" }}>{d.toLocaleDateString("en-IN", { day: "numeric", month: "short" })}</div>
                    </div>
                    <div style={{ flex: 1 }}>
                      {status === "open" && <span style={{ fontSize: 13, color: "#22c55e", fontFamily: "'DM Sans',sans-serif" }}>{slotsPerDay()} slots · {fmt12(avail.startTime)}–{fmt12(avail.endTime)}</span>}
                      {status === "off" && <span style={{ fontSize: 13, color: "rgba(255,255,255,0.25)", fontFamily: "'DM Sans',sans-serif" }}>Day off</span>}
                      {status === "blocked" && <span style={{ fontSize: 13, color: "#EF4444", fontFamily: "'DM Sans',sans-serif" }}>Blocked — {blocked.find(b => b.date === dateStr)?.reason}</span>}
                    </div>
                    <div style={{ width: 8, height: 8, borderRadius: "50%", background: status === "open" ? "#22c55e" : status === "blocked" ? "#EF4444" : "rgba(255,255,255,0.2)" }} />
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
