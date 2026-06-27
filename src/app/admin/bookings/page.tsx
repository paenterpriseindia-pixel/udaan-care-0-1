"use client";
import { useEffect, useState } from "react";
import { Plus, Check, X, Clock, Calendar, Video, Building2, ChevronDown } from "lucide-react";
import type { Booking, Patient } from "@/lib/db";

const STATUS_COLORS: Record<string, string> = { PENDING: "#F5820D", CONFIRMED: "#22c55e", COMPLETED: "#0A7E8C", CANCELLED: "#EF4444" };
const PAYMENT_COLORS: Record<string, string> = { PAID: "#22c55e", UNPAID: "#f59e0b", FAILED: "#ef4444" };

export default function BookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [patients, setPatients] = useState<Patient[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("ALL");

  const [form, setForm] = useState({
    patientId: "", doctorId: "admin",
    datetime: "", type: "CLINIC" as "CLINIC" | "ONLINE",
    status: "PENDING" as Booking["status"],
    paymentStatus: "UNPAID" as Booking["paymentStatus"],
    amount: 599, zoomLink: "", notes: "",
  });

  const load = async () => {
    const [b, p] = await Promise.all([
      fetch("/api/admin/bookings").then(r => r.json()),
      fetch("/api/admin/patients").then(r => r.json()),
    ]);
    setBookings(Array.isArray(b) ? b : []);
    setPatients(Array.isArray(p) ? p : []);
    setLoading(false);
  };
  useEffect(() => { load(); }, []);

  const createBooking = async () => {
    await fetch("/api/admin/bookings", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
    setShowForm(false);
    setForm({ patientId: "", doctorId: "admin", datetime: "", type: "CLINIC", status: "PENDING", paymentStatus: "UNPAID", amount: 599, zoomLink: "", notes: "" });
    load();
  };

  const updateStatus = async (id: string, status: Booking["status"]) => {
    await fetch(`/api/admin/bookings/${id}`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ status }) });
    load();
  };

  const updatePayment = async (id: string, paymentStatus: Booking["paymentStatus"]) => {
    await fetch(`/api/admin/bookings/${id}`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ paymentStatus }) });
    load();
  };

  const filtered = filter === "ALL" ? bookings : bookings.filter(b => b.status === filter);
  const sorted = [...filtered].sort((a, b) => b.datetime.localeCompare(a.datetime));

  const inputStyle: React.CSSProperties = { width: "100%", padding: "10px 12px", borderRadius: 8, background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", color: "white", fontSize: 14, outline: "none", boxSizing: "border-box", fontFamily: "'DM Sans',sans-serif" };

  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 24, flexWrap: "wrap", gap: 12 }}>
        <div>
          <h1 style={{ fontFamily: "'Nunito',sans-serif", fontWeight: 900, fontSize: 26, color: "white", marginBottom: 2 }}>Bookings</h1>
          <p style={{ fontSize: 13, color: "rgba(255,255,255,0.4)" }}>{bookings.filter(b => b.status === "PENDING").length} pending · {bookings.filter(b => b.status === "CONFIRMED").length} confirmed</p>
        </div>
        <button onClick={() => setShowForm(s => !s)} style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "11px 20px", borderRadius: 10, border: "none", background: "linear-gradient(135deg,#0A7E8C,#6B3FA0)", color: "white", cursor: "pointer", fontSize: 14, fontWeight: 700, fontFamily: "'DM Sans',sans-serif" }}>
          <Plus size={15} /> New Booking
        </button>
      </div>

      {/* New booking form */}
      {showForm && (
        <div style={{ background: "rgba(10,126,140,0.06)", border: "1px solid rgba(10,126,140,0.2)", borderRadius: 16, padding: 24, marginBottom: 24 }}>
          <h3 style={{ fontFamily: "'Nunito',sans-serif", fontWeight: 800, fontSize: 16, color: "white", marginBottom: 16 }}>Create Booking</h3>
          <div className="grid-responsive-2" style={{ gap: 12 }}>
            <div><label style={{ fontSize: 12, color: "rgba(255,255,255,0.5)", display: "block", marginBottom: 4 }}>Patient *</label>
              <select style={inputStyle} value={form.patientId} onChange={e => setForm(f => ({ ...f, patientId: e.target.value }))}>
                <option value="">Select patient…</option>
                {patients.map(p => <option key={p.id} value={p.id}>{p.name} ({p.uniqueId})</option>)}
              </select>
            </div>
            <div><label style={{ fontSize: 12, color: "rgba(255,255,255,0.5)", display: "block", marginBottom: 4 }}>Date & Time *</label><input type="datetime-local" style={inputStyle} value={form.datetime} onChange={e => setForm(f => ({ ...f, datetime: e.target.value }))} /></div>
            <div><label style={{ fontSize: 12, color: "rgba(255,255,255,0.5)", display: "block", marginBottom: 4 }}>Type</label>
              <select style={inputStyle} value={form.type} onChange={e => setForm(f => ({ ...f, type: e.target.value as "CLINIC" | "ONLINE" }))}>
                <option value="CLINIC">In-Clinic</option><option value="ONLINE">Online (Zoom)</option>
              </select>
            </div>
            <div><label style={{ fontSize: 12, color: "rgba(255,255,255,0.5)", display: "block", marginBottom: 4 }}>Amount (₹)</label><input type="number" style={inputStyle} value={form.amount} onChange={e => setForm(f => ({ ...f, amount: +e.target.value }))} /></div>
            {form.type === "ONLINE" && <div style={{ gridColumn: "1/-1" }}><label style={{ fontSize: 12, color: "rgba(255,255,255,0.5)", display: "block", marginBottom: 4 }}>Zoom Link</label><input style={inputStyle} value={form.zoomLink} onChange={e => setForm(f => ({ ...f, zoomLink: e.target.value }))} placeholder="https://zoom.us/j/…" /></div>}
            <div style={{ gridColumn: "1/-1" }}><label style={{ fontSize: 12, color: "rgba(255,255,255,0.5)", display: "block", marginBottom: 4 }}>Notes</label><textarea style={{ ...inputStyle, minHeight: 60, resize: "vertical" }} value={form.notes} onChange={e => setForm(f => ({ ...f, notes: e.target.value }))} /></div>
          </div>
          <div style={{ display: "flex", gap: 8, marginTop: 16 }}>
            <button onClick={createBooking} disabled={!form.patientId || !form.datetime} style={{ padding: "9px 18px", borderRadius: 8, border: "none", background: "#0A7E8C", color: "white", cursor: "pointer", fontSize: 13, fontWeight: 700, fontFamily: "'DM Sans',sans-serif" }}>Create Booking</button>
            <button onClick={() => setShowForm(false)} style={{ padding: "9px 14px", borderRadius: 8, border: "1px solid rgba(255,255,255,0.1)", background: "transparent", color: "rgba(255,255,255,0.5)", cursor: "pointer", fontSize: 13, fontFamily: "'DM Sans',sans-serif" }}>Cancel</button>
          </div>
        </div>
      )}

      {/* Filter tabs */}
      <div style={{ display: "flex", gap: 8, marginBottom: 20 }}>
        {["ALL", "PENDING", "CONFIRMED", "COMPLETED", "CANCELLED"].map(s => (
          <button key={s} onClick={() => setFilter(s)} style={{ padding: "8px 14px", borderRadius: 8, border: "none", cursor: "pointer", fontSize: 13, fontWeight: 600, fontFamily: "'DM Sans',sans-serif", background: filter === s ? (STATUS_COLORS[s] ?? "#0A7E8C") + "33" : "rgba(255,255,255,0.05)", color: filter === s ? (STATUS_COLORS[s] ?? "white") : "rgba(255,255,255,0.45)" }}>
            {s === "ALL" ? "All" : s}
          </button>
        ))}
      </div>

      {/* Booking list */}
      <div style={{ background: "var(--color-card)", border: "1px solid var(--color-border)", borderRadius: 12, overflow: "hidden" }}>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left", fontFamily: "'DM Sans',sans-serif", fontSize: 13, color: "var(--color-text-secondary)" }}>
            <thead>
              <tr style={{ background: "rgba(255,255,255,0.02)", borderBottom: "1px solid var(--color-border)" }}>
                <th style={{ padding: "16px 20px", fontWeight: 600 }}>Date & Time</th>
                <th style={{ padding: "16px 20px", fontWeight: 600 }}>Patient</th>
                <th style={{ padding: "16px 20px", fontWeight: 600 }}>Type</th>
                <th style={{ padding: "16px 20px", fontWeight: 600 }}>Amount</th>
                <th style={{ padding: "16px 20px", fontWeight: 600 }}>Payment</th>
                <th style={{ padding: "16px 20px", fontWeight: 600 }}>Status</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={6} style={{ textAlign: "center", padding: 40 }}>Loading…</td></tr>
              ) : sorted.length === 0 ? (
                <tr><td colSpan={6} style={{ textAlign: "center", padding: 48 }}>No bookings found.</td></tr>
              ) : sorted.map(b => {
                const patient = patients.find(p => p.id === b.patientId);
                const dt = new Date(b.datetime);
                return (
                  <tr key={b.id} style={{ borderBottom: "1px solid var(--color-border)" }} className="responsive-tr">
                    <td data-label="Date & Time" style={{ padding: "16px 20px", whiteSpace: "nowrap" }} className="responsive-td">
                      <div style={{ fontWeight: 600, color: "white" }}>{dt.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}</div>
                      <div style={{ fontSize: 12, marginTop: 4 }}>{dt.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" })}</div>
                    </td>
                    <td data-label="Patient" style={{ padding: "16px 20px", fontWeight: 600, color: "white" }} className="responsive-td">
                      {patient?.name ?? "Unknown Patient"}
                      {patient?.guardianPhone && (
                        <a href={`https://wa.me/${patient.guardianPhone.replace(/\D/g,"")}?text=Reminder: ${patient.name}'s appointment is on ${dt.toLocaleDateString("en-IN")} at ${dt.toLocaleTimeString("en-IN",{hour:"2-digit",minute:"2-digit"})}.`} target="_blank" rel="noopener noreferrer" style={{ display: "block", fontSize: 11, color: "#25D366", textDecoration: "none", marginTop: 4, fontWeight: 500 }}>
                          WA Reminder ↗
                        </a>
                      )}
                    </td>
                    <td data-label="Type" style={{ padding: "16px 20px" }} className="responsive-td">
                      <div style={{ display: "inline-flex", alignItems: "center", gap: 6, background: b.type === "ONLINE" ? "rgba(107,63,160,0.15)" : "rgba(10,126,140,0.15)", color: b.type === "ONLINE" ? "#c084fc" : "#2dd4bf", padding: "4px 8px", borderRadius: 6, fontSize: 11, fontWeight: 700 }}>
                        {b.type === "ONLINE" ? <Video size={12} /> : <Building2 size={12} />}
                        {b.type}
                      </div>
                    </td>
                    <td data-label="Amount" style={{ padding: "16px 20px", fontWeight: 600, color: "white" }} className="responsive-td">
                      ₹{b.amount}
                      {b.transactionId && <div style={{ fontSize: 11, color: "rgba(255,255,255,0.4)", fontWeight: 400, marginTop: 4, fontFamily: "monospace" }}>{b.transactionId}</div>}
                    </td>
                    <td data-label="Payment" style={{ padding: "16px 20px" }} className="responsive-td">
                      <select value={b.paymentStatus} onChange={e => updatePayment(b.id, e.target.value as Booking["paymentStatus"])} style={{ fontSize: 12, padding: "5px 10px", borderRadius: 6, border: `1px solid ${PAYMENT_COLORS[b.paymentStatus]}44`, background: `${PAYMENT_COLORS[b.paymentStatus]}15`, color: PAYMENT_COLORS[b.paymentStatus], cursor: "pointer", outline: "none", fontWeight: 700, fontFamily: "'DM Sans',sans-serif" }}>
                        <option value="UNPAID">Unpaid</option>
                        <option value="PAID">Paid</option>
                        <option value="FAILED">Failed</option>
                      </select>
                    </td>
                    <td data-label="Status" style={{ padding: "16px 20px" }} className="responsive-td">
                      <select value={b.status} onChange={e => updateStatus(b.id, e.target.value as Booking["status"])} style={{ fontSize: 12, padding: "5px 10px", borderRadius: 6, border: `1px solid ${STATUS_COLORS[b.status]}44`, background: `${STATUS_COLORS[b.status]}15`, color: STATUS_COLORS[b.status], cursor: "pointer", outline: "none", fontWeight: 700, fontFamily: "'DM Sans',sans-serif" }}>
                        <option value="PENDING">Pending</option>
                        <option value="CONFIRMED">Confirmed</option>
                        <option value="COMPLETED">Completed</option>
                        <option value="CANCELLED">Cancelled</option>
                      </select>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      <style>{`
        @media (max-width: 900px) {
          .grid-responsive-2 { grid-template-columns: 1fr !important; }
          table, thead, tbody, th, td, tr { display: block; }
          thead tr { display: none; }
          .responsive-tr { 
            margin-bottom: 16px; 
            border: 1px solid rgba(255,255,255,0.07) !important; 
            border-radius: 12px; 
            background: rgba(255,255,255,0.02); 
            padding: 12px; 
          }
          .responsive-td { 
            padding: 8px 0 !important; 
            border: none !important; 
            display: flex; 
            align-items: center; 
            justify-content: space-between; 
            text-align: right;
          }
          .responsive-td::before { 
            content: attr(data-label); 
            color: rgba(255,255,255,0.4); 
            font-size: 11px; 
            text-transform: uppercase; 
            font-weight: 700; 
            flex-shrink: 0; 
            margin-right: 12px; 
          }
        }
        @media (min-width: 901px) {
          .grid-responsive-2 { display: grid; grid-template-columns: 1fr 1fr; }
        }
      `}</style>
    </div>
  );
}
