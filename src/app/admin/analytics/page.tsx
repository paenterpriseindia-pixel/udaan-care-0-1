"use client";
import { useEffect, useState } from "react";
import { TrendingUp, Users, Calendar, Activity } from "lucide-react";
import type { Patient, Booking, Session } from "@/lib/db";

export default function AnalyticsPage() {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch("/api/admin/patients").then(r => r.json()),
      fetch("/api/admin/bookings").then(r => r.json()),
    ]).then(([p, b]) => { setPatients(Array.isArray(p) ? p : []); setBookings(Array.isArray(b) ? b : []); setLoading(false); });
  }, []);

  // Monthly patient count (last 6 months)
  const months = Array.from({ length: 6 }, (_, i) => {
    const d = new Date(); d.setMonth(d.getMonth() - (5 - i));
    return { label: d.toLocaleDateString("en-IN", { month: "short" }), key: d.toISOString().slice(0, 7) };
  });

  const monthlyNewPatients = months.map(m => ({
    ...m, count: patients.filter(p => p.createdAt.startsWith(m.key)).length,
  }));

  const monthlyBookings = months.map(m => ({
    ...m, count: bookings.filter(b => b.datetime.startsWith(m.key)).length,
  }));

  const maxPatients = Math.max(...monthlyNewPatients.map(m => m.count), 1);
  const maxBookings = Math.max(...monthlyBookings.map(m => m.count), 1);

  const diagnosisCounts = patients.reduce<Record<string, number>>((acc, p) => {
    (p.diagnoses ?? []).forEach(d => { acc[d] = (acc[d] ?? 0) + 1; });
    return acc;
  }, {});

  const topDiagnoses = Object.entries(diagnosisCounts).sort((a, b) => b[1] - a[1]).slice(0, 6);

  const revenue = bookings.filter(b => b.paymentStatus === "PAID").reduce((s, b) => s + (b.amount ?? 0), 0);
  const onlineCount = bookings.filter(b => b.type === "ONLINE").length;
  const clinicCount = bookings.filter(b => b.type === "CLINIC").length;
  const confirmedCount = bookings.filter(b => b.status === "CONFIRMED" || b.status === "COMPLETED").length;
  const conversionRate = bookings.length > 0 ? Math.round((confirmedCount / bookings.length) * 100) : 0;

  const BarChart = ({ data, max, color }: { data: { label: string; count: number }[]; max: number; color: string }) => (
    <div style={{ display: "flex", alignItems: "flex-end", gap: 8, height: 120, paddingTop: 8 }}>
      {data.map(m => (
        <div key={m.label} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: "rgba(255,255,255,0.6)" }}>{m.count || ""}</div>
          <div style={{ width: "100%", borderRadius: "4px 4px 0 0", background: color, height: Math.max((m.count / max) * 90, 4), transition: "height 0.4s ease" }} />
          <div style={{ fontSize: 10, color: "rgba(255,255,255,0.4)" }}>{m.label}</div>
        </div>
      ))}
    </div>
  );

  return (
    <div>
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontFamily: "'Nunito',sans-serif", fontWeight: 900, fontSize: 26, color: "white", marginBottom: 2 }}>Analytics</h1>
        <p style={{ fontSize: 13, color: "rgba(255,255,255,0.4)" }}>Clinic performance overview</p>
      </div>

      {/* Key metrics */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))", gap: 16, marginBottom: 24 }}>
        {[
          { label: "Total Patients", value: patients.length, icon: Users, color: "#0A7E8C" },
          { label: "Active Patients", value: patients.filter(p => p.status === "ACTIVE").length, icon: Activity, color: "#22c55e" },
          { label: "Total Bookings", value: bookings.length, icon: Calendar, color: "#6B3FA0" },
          { label: "Revenue Collected", value: `₹${revenue.toLocaleString("en-IN")}`, icon: TrendingUp, color: "#F5820D" },
          { label: "Online Sessions", value: onlineCount, icon: Activity, color: "#0A7E8C" },
          { label: "Booking Rate", value: `${conversionRate}%`, icon: TrendingUp, color: "#22c55e" },
        ].map(s => (
          <div key={s.label} style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 14, padding: "18px 20px" }}>
            <div style={{ width: 36, height: 36, borderRadius: 8, background: `${s.color}22`, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 12 }}>
              <s.icon size={16} style={{ color: s.color }} />
            </div>
            <div style={{ fontFamily: "'Nunito',sans-serif", fontWeight: 900, fontSize: 26, color: "white" }}>{loading ? "—" : s.value}</div>
            <div style={{ fontSize: 12, color: "rgba(255,255,255,0.45)", marginTop: 2 }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Charts row */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, marginBottom: 20 }}>
        <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 16, padding: 20 }}>
          <h3 style={{ fontFamily: "'Nunito',sans-serif", fontWeight: 800, fontSize: 15, color: "white", marginBottom: 4 }}>New Patients / Month</h3>
          <p style={{ fontSize: 12, color: "rgba(255,255,255,0.35)", marginBottom: 12 }}>Last 6 months</p>
          {loading ? <div style={{ height: 120, display: "flex", alignItems: "center", justifyContent: "center", color: "rgba(255,255,255,0.3)" }}>Loading…</div>
            : <BarChart data={monthlyNewPatients} max={maxPatients} color="rgba(10,126,140,0.7)" />}
        </div>
        <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 16, padding: 20 }}>
          <h3 style={{ fontFamily: "'Nunito',sans-serif", fontWeight: 800, fontSize: 15, color: "white", marginBottom: 4 }}>Bookings / Month</h3>
          <p style={{ fontSize: 12, color: "rgba(255,255,255,0.35)", marginBottom: 12 }}>Last 6 months</p>
          {loading ? <div style={{ height: 120, display: "flex", alignItems: "center", justifyContent: "center", color: "rgba(255,255,255,0.3)" }}>Loading…</div>
            : <BarChart data={monthlyBookings} max={maxBookings} color="rgba(107,63,160,0.7)" />}
        </div>
      </div>

      {/* Diagnosis breakdown + session type */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
        <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 16, padding: 20 }}>
          <h3 style={{ fontFamily: "'Nunito',sans-serif", fontWeight: 800, fontSize: 15, color: "white", marginBottom: 16 }}>Top Diagnoses</h3>
          {topDiagnoses.length === 0 ? (
            <div style={{ color: "rgba(255,255,255,0.3)", fontSize: 13 }}>No patient data yet.</div>
          ) : topDiagnoses.map(([diag, count]) => (
            <div key={diag} style={{ marginBottom: 10 }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                <span style={{ fontSize: 13, color: "rgba(255,255,255,0.7)" }}>{diag}</span>
                <span style={{ fontSize: 13, fontWeight: 700, color: "white" }}>{count}</span>
              </div>
              <div style={{ height: 6, borderRadius: 3, background: "rgba(255,255,255,0.07)" }}>
                <div style={{ height: "100%", borderRadius: 3, background: "linear-gradient(90deg,#0A7E8C,#6B3FA0)", width: `${(count / patients.length) * 100}%` }} />
              </div>
            </div>
          ))}
        </div>

        <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 16, padding: 20 }}>
          <h3 style={{ fontFamily: "'Nunito',sans-serif", fontWeight: 800, fontSize: 15, color: "white", marginBottom: 16 }}>Session Type Split</h3>
          <div style={{ display: "flex", gap: 12, marginBottom: 20 }}>
            {[
              { label: "Online", count: onlineCount, color: "#6B3FA0", pct: bookings.length ? Math.round((onlineCount / bookings.length) * 100) : 0 },
              { label: "In-Clinic", count: clinicCount, color: "#0A7E8C", pct: bookings.length ? Math.round((clinicCount / bookings.length) * 100) : 0 },
            ].map(s => (
              <div key={s.label} style={{ flex: 1, background: `${s.color}15`, border: `1px solid ${s.color}30`, borderRadius: 12, padding: "16px", textAlign: "center" }}>
                <div style={{ fontFamily: "'Nunito',sans-serif", fontWeight: 900, fontSize: 28, color: s.color }}>{loading ? "—" : s.pct}%</div>
                <div style={{ fontSize: 12, color: "rgba(255,255,255,0.5)", marginTop: 4 }}>{s.label}</div>
                <div style={{ fontSize: 11, color: "rgba(255,255,255,0.3)" }}>{s.count} sessions</div>
              </div>
            ))}
          </div>
          <div style={{ background: "rgba(255,255,255,0.05)", borderRadius: 12, padding: "14px 16px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
              <span style={{ fontSize: 13, color: "rgba(255,255,255,0.6)" }}>Patient Status</span>
            </div>
            {[
              { label: "Active", count: patients.filter(p => p.status === "ACTIVE").length, color: "#22c55e" },
              { label: "Completed", count: patients.filter(p => p.status === "COMPLETED").length, color: "#0A7E8C" },
              { label: "On Hold", count: patients.filter(p => p.status === "ON_HOLD").length, color: "#F5820D" },
            ].map(s => (
              <div key={s.label} style={{ display: "flex", justifyContent: "space-between", padding: "6px 0", borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <div style={{ width: 8, height: 8, borderRadius: "50%", background: s.color }} />
                  <span style={{ fontSize: 13, color: "rgba(255,255,255,0.6)" }}>{s.label}</span>
                </div>
                <span style={{ fontSize: 13, fontWeight: 700, color: "white" }}>{loading ? "—" : s.count}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
