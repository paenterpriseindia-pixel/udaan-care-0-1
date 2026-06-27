"use client";
import { useEffect, useState } from "react";
import { MessageCircle, CheckCircle, Calendar, Trash2, Filter, Search, UserPlus, TrendingUp, Clock, XCircle } from "lucide-react";
import type { Lead, User } from "@/lib/db";

const STATUS_COLORS: Record<Lead["status"], { bg: string; border: string; text: string; label: string }> = {
  new:       { bg: "rgba(26,175,230,0.15)",  border: "rgba(26,175,230,0.3)",  text: "#1AAFE6", label: "New" },
  contacted: { bg: "rgba(245,130,13,0.12)",  border: "rgba(245,130,13,0.3)",  text: "#F5820D", label: "Contacted" },
  booked:    { bg: "rgba(34,197,94,0.12)",   border: "rgba(34,197,94,0.3)",   text: "#22c55e", label: "Booked" },
  lost:      { bg: "rgba(255,255,255,0.04)", border: "rgba(255,255,255,0.1)", text: "rgba(255,255,255,0.3)", label: "Lost" },
};

const SOURCE_ICONS: Record<string, string> = {
  google: "Google", website: "Website", whatsapp: "WhatsApp", referral: "Referral", direct: "Direct", other: "Other",
};

function timeAgo(dt: string) {
  const diff = (Date.now() - new Date(dt).getTime()) / 1000;
  if (diff < 60) return "just now";
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return `${Math.floor(diff / 86400)}d ago`;
}

export default function LeadsPage() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [filter, setFilter] = useState<Lead["status"] | "all">("all");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [doctors, setDoctors] = useState<User[]>([]);

  const load = () => {
    const url = filter === "all" ? "/api/admin/leads" : `/api/admin/leads?status=${filter}`;
    Promise.all([
      fetch(url).then(r => r.json()),
      fetch("/api/admin/doctors").then(r => r.json())
    ]).then(([leadsData, doctorsData]) => {
      setLeads(Array.isArray(leadsData) ? leadsData : []);
      setDoctors(Array.isArray(doctorsData) ? doctorsData : []);
      setLoading(false);
    });
  };
  useEffect(() => { setLoading(true); load(); }, [filter]); // eslint-disable-line react-hooks/exhaustive-deps

  const updateStatus = async (id: string, status: Lead["status"]) => {
    await fetch("/api/admin/leads", {
      method: "PATCH", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, status }),
    });
    setLeads(l => l.map(x => x.id === id ? { ...x, status } : x));
  };

  const assignDoctor = async (id: string, doctorId: string) => {
    await fetch("/api/admin/leads/assign", {
      method: "PATCH", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, doctorId }),
    });
    setLeads(l => l.map(x => x.id === id ? { ...x, doctorId } : x));
  };

  const deleteLead = async (id: string) => {
    if (!confirm("Remove this lead?")) return;
    await fetch(`/api/admin/leads?id=${id}`, { method: "DELETE" });
    setLeads(l => l.filter(x => x.id !== id));
  };

  const filtered = leads.filter(l =>
    (filter === "all" || l.status === filter) &&
    (!search || l.name.toLowerCase().includes(search.toLowerCase()) || l.phone.includes(search))
  );

  const counts = {
    all: leads.length,
    new: leads.filter(l => l.status === "new").length,
    contacted: leads.filter(l => l.status === "contacted").length,
    booked: leads.filter(l => l.status === "booked").length,
    lost: leads.filter(l => l.status === "lost").length,
  };

  const waLink = (lead: Lead) => {
    const msg = encodeURIComponent(
      `Hello ${lead.name}! Thank you for your interest in Udaan Care.\n\n` +
      `We noticed you were looking for ${lead.serviceInterest ?? "therapy services"} for your child.\n\n` +
      `Dr. Prasoon Gupta (Pediatric OT Specialist) would love to help. ` +
      `Would you like to schedule a consultation?\n\nBook here: https://udaancare.in/book`
    );
    return `https://wa.me/${lead.phone.replace(/\D/g, "") || ""}?text=${msg}`;
  };

  return (
    <div>
      {/* Header */}
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontFamily: "'Nunito',sans-serif", fontWeight: 900, fontSize: 26, color: "white", marginBottom: 4 }}>
          Leads & Enquiries
        </h1>
        <p style={{ fontSize: 13, color: "rgba(255,255,255,0.4)", fontFamily: "'DM Sans',sans-serif" }}>
          Everyone who showed interest — one tap to follow up on WhatsApp
        </p>
      </div>

      {/* Stats row */}
      <div className="grid-responsive-4" style={{ gap: 12, marginBottom: 24 }}>
        {[
          { label: "New Leads", value: counts.new, icon: UserPlus, color: "#1AAFE6" },
          { label: "Contacted", value: counts.contacted, icon: MessageCircle, color: "#F5820D" },
          { label: "Converted", value: counts.booked, icon: CheckCircle, color: "#22c55e" },
          { label: "Total Leads", value: counts.all, icon: TrendingUp, color: "#6B3FA0" },
        ].map(s => (
          <div key={s.label} style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 14, padding: "16px 18px" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8 }}>
              <s.icon size={16} style={{ color: s.color }} />
            </div>
            <div style={{ fontFamily: "'Nunito',sans-serif", fontWeight: 900, fontSize: 28, color: "white", lineHeight: 1, marginBottom: 4 }}>{s.value}</div>
            <div style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 12, color: "rgba(255,255,255,0.4)" }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Filters + Search */}
      <div style={{ display: "flex", gap: 10, marginBottom: 20, flexWrap: "wrap", alignItems: "center" }}>
        <div style={{ display: "flex", background: "rgba(255,255,255,0.04)", borderRadius: 10, padding: 4, gap: 2 }}>
          {(["all", "new", "contacted", "booked", "lost"] as const).map(f => (
            <button key={f} onClick={() => setFilter(f)} style={{
              padding: "8px 16px", borderRadius: 8, fontFamily: "'DM Sans',sans-serif", fontWeight: 700, fontSize: 13,
              background: filter === f ? "rgba(26,175,230,0.2)" : "transparent",
              border: filter === f ? "1px solid rgba(26,175,230,0.3)" : "1px solid transparent",
              color: filter === f ? "#1AAFE6" : "rgba(255,255,255,0.4)", cursor: "pointer", transition: "all 0.15s",
            }}>
              {f === "all" ? "All" : STATUS_COLORS[f].label} {counts[f] > 0 && <span style={{ marginLeft: 4, opacity: 0.7 }}>({counts[f]})</span>}
            </button>
          ))}
        </div>
        <div style={{ flex: 1, position: "relative" as const, minWidth: 200 }}>
          <Search size={14} style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: "rgba(255,255,255,0.3)" }} />
          <input type="text" placeholder="Search by name or phone..."
            value={search} onChange={e => setSearch(e.target.value)}
            style={{
              width: "100%", padding: "10px 12px 10px 36px", borderRadius: 10,
              background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)",
              color: "white", fontFamily: "'DM Sans',sans-serif", fontSize: 14,
              boxSizing: "border-box",
            }}
          />
        </div>
      </div>

      {/* Lead Cards */}
      {loading ? (
        <div style={{ textAlign: "center", padding: "60px 0", color: "rgba(255,255,255,0.3)", fontFamily: "'DM Sans',sans-serif" }}>Loading leads...</div>
      ) : filtered.length === 0 ? (
        <div style={{ textAlign: "center", padding: "60px 0", color: "rgba(255,255,255,0.2)", fontFamily: "'DM Sans',sans-serif" }}>
          <UserPlus size={40} style={{ marginBottom: 12, opacity: 0.3 }} />
          <div>No leads yet — they appear here when someone fills the contact form or starts booking</div>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {filtered.map(lead => {
            const s = STATUS_COLORS[lead.status];
            return (
              <div key={lead.id} className="lead-card" style={{
                background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)",
                borderRadius: 14, padding: "16px 20px",
                gap: 16, alignItems: "start",
              }}>
                <div>
                  {/* Name + status + time */}
                  <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6, flexWrap: "wrap" }}>
                    <span style={{ fontFamily: "'Nunito',sans-serif", fontWeight: 800, fontSize: 16, color: "white" }}>{lead.name}</span>
                    <span style={{ padding: "2px 10px", borderRadius: 20, fontSize: 11, fontWeight: 700, fontFamily: "'DM Sans',sans-serif", background: s.bg, border: `1px solid ${s.border}`, color: s.text }}>
                      {s.label}
                    </span>
                    <span style={{ fontSize: 11, color: "rgba(255,255,255,0.3)", fontFamily: "'DM Sans',sans-serif", display: "flex", alignItems: "center", gap: 4 }}>
                      <Clock size={10} /> {timeAgo(lead.createdAt)}
                    </span>
                  </div>

                  {/* Details */}
                  <div style={{ display: "flex", gap: 16, flexWrap: "wrap", marginBottom: 8 }}>
                    <span style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 13, color: "#1AAFE6" }}>{lead.phone}</span>
                    {lead.email && <span style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 13, color: "rgba(255,255,255,0.4)" }}>{lead.email}</span>}
                    <span style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 12, padding: "2px 8px", borderRadius: 6, background: "rgba(255,255,255,0.06)", color: "rgba(255,255,255,0.4)" }}>
                      via {SOURCE_ICONS[lead.source] ?? lead.source}
                    </span>
                    {lead.serviceInterest && (
                      <span style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 12, color: "#6B3FA0" }}>Interested in: {lead.serviceInterest}</span>
                    )}
                  </div>
                  {lead.message && (
                    <div style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 13, color: "rgba(255,255,255,0.5)", fontStyle: "italic", borderLeft: "2px solid rgba(255,255,255,0.1)", paddingLeft: 10 }}>
                      "{lead.message}"
                    </div>
                  )}
                  {/* Doctor Assignment */}
                  <div style={{ marginTop: 12, display: "flex", alignItems: "center", gap: 8 }}>
                    <span style={{ fontSize: 12, color: "rgba(255,255,255,0.4)", fontFamily: "'DM Sans',sans-serif" }}>Assign:</span>
                    <select
                      value={lead.doctorId || ""}
                      onChange={(e) => assignDoctor(lead.id, e.target.value)}
                      style={{
                        background: "rgba(255,255,255,0.06)",
                        border: "1px solid rgba(255,255,255,0.1)",
                        borderRadius: 6,
                        color: lead.doctorId ? "#1AAFE6" : "white",
                        padding: "4px 8px",
                        fontSize: 12,
                        fontFamily: "'DM Sans',sans-serif",
                        outline: "none",
                        cursor: "pointer",
                      }}
                    >
                      <option value="" style={{ color: "black" }}>Unassigned</option>
                      {doctors.map(doc => (
                        <option key={doc.id} value={doc.id} style={{ color: "black" }}>
                          Dr. {doc.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Status change buttons */}
                  <div style={{ display: "flex", gap: 6, marginTop: 12, flexWrap: "wrap" }}>
                    {lead.status !== "contacted" && (
                      <button onClick={() => updateStatus(lead.id, "contacted")} style={{
                        padding: "6px 14px", borderRadius: 8, fontSize: 12, fontFamily: "'DM Sans',sans-serif", fontWeight: 600,
                        background: "rgba(245,130,13,0.12)", border: "1px solid rgba(245,130,13,0.25)", color: "#F5820D", cursor: "pointer",
                      }}>Mark Contacted</button>
                    )}
                    {lead.status !== "booked" && (
                      <button onClick={() => updateStatus(lead.id, "booked")} style={{
                        padding: "6px 14px", borderRadius: 8, fontSize: 12, fontFamily: "'DM Sans',sans-serif", fontWeight: 600,
                        background: "rgba(34,197,94,0.12)", border: "1px solid rgba(34,197,94,0.25)", color: "#22c55e", cursor: "pointer",
                      }}><CheckCircle size={11} style={{ display: "inline", marginRight: 4 }} />Converted to Booking</button>
                    )}
                    {lead.status !== "lost" && lead.status !== "booked" && (
                      <button onClick={() => updateStatus(lead.id, "lost")} style={{
                        padding: "6px 14px", borderRadius: 8, fontSize: 12, fontFamily: "'DM Sans',sans-serif", fontWeight: 600,
                        background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.1)", color: "rgba(255,255,255,0.3)", cursor: "pointer",
                      }}>Mark Lost</button>
                    )}
                  </div>
                </div>

                {/* Actions: WhatsApp + Calendar + Delete */}
                <div style={{ display: "flex", flexDirection: "column", gap: 8, alignItems: "flex-end" }}>
                  <a href={waLink(lead)} target="_blank" rel="noopener noreferrer" style={{
                    display: "flex", alignItems: "center", gap: 8, padding: "10px 16px", borderRadius: 10,
                    background: "#25D366", color: "white", textDecoration: "none",
                    fontFamily: "'Nunito',sans-serif", fontWeight: 800, fontSize: 13,
                    whiteSpace: "nowrap",
                  }}>
                    <MessageCircle size={14} /> WhatsApp
                  </a>
                  <a href={`/admin/bookings?phone=${lead.phone}&name=${lead.name}`} style={{
                    display: "flex", alignItems: "center", gap: 8, padding: "10px 16px", borderRadius: 10,
                    background: "rgba(107,63,160,0.15)", border: "1px solid rgba(107,63,160,0.25)",
                    color: "#6B3FA0", textDecoration: "none",
                    fontFamily: "'Nunito',sans-serif", fontWeight: 700, fontSize: 13,
                    whiteSpace: "nowrap",
                  }}>
                    <Calendar size={14} /> Book Slot
                  </a>
                  <button onClick={() => deleteLead(lead.id)} style={{
                    display: "flex", alignItems: "center", gap: 6, padding: "8px 12px", borderRadius: 8,
                    background: "transparent", border: "1px solid rgba(255,255,255,0.08)",
                    color: "rgba(255,255,255,0.2)", cursor: "pointer", fontSize: 12, fontFamily: "'DM Sans',sans-serif",
                  }}>
                    <Trash2 size={12} /> Remove
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
      
      <style>{`
        @media (max-width: 900px) {
          .grid-responsive-4 { display: grid; grid-template-columns: 1fr 1fr; }
          .lead-card { display: flex !important; flex-direction: column !important; }
        }
        @media (min-width: 901px) {
          .grid-responsive-4 { display: grid; grid-template-columns: repeat(4, 1fr); }
          .lead-card { display: grid !important; grid-template-columns: 1fr auto !important; }
        }
      `}</style>
    </div>
  );
}
