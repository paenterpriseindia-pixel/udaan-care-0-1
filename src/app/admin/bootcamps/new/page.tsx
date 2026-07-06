"use client";
import { useState } from "react";
import { ArrowLeft, Save } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function NewBootcampPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  
  // Basic essential fields for a bootcamp
  const [form, setForm] = useState({
    title: "", slug: "", eventType: "ONLINE", shortDescription: "", fullDescription: "",
    category: "PARENTING", eventDate: "", startTime: "10:00", endTime: "12:00",
    platform: "Zoom", priceINR: 0, priceUSD: 0, isFree: false, totalSeats: 50,
    registrationDeadline: "", isFeatured: false
  });

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("/api/admin/bootcamps", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form)
      });
      if (res.ok) {
        router.push("/admin/bootcamps");
      } else {
        alert("Failed to create program");
      }
    } catch (err) {
      alert("Error saving program");
    }
    setLoading(false);
  };

  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 24 }}>
        <Link href="/admin/bootcamps" style={{ minWidth: 48, minHeight: 48, display: "flex", alignItems: "center", justifyContent: "center", background: "rgba(255,255,255,0.05)", borderRadius: 10, color: "white", textDecoration: "none" }}>
          <ArrowLeft size={18} />
        </Link>
        <h1 style={{ fontFamily: "'Nunito',sans-serif", fontWeight: 900, fontSize: 22, color: "white", margin: 0 }}>Create Program</h1>
      </div>

      <form onSubmit={save} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        
        <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 14, padding: "20px", display: "flex", flexDirection: "column", gap: 16 }}>
          <div>
            <label style={{ display: "block", fontSize: 13, color: "rgba(255,255,255,0.6)", marginBottom: 6 }}>Title</label>
            <input required type="text" value={form.title} onChange={e => setForm({...form, title: e.target.value, slug: e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, '-')})} style={{ width: "100%", background: "rgba(0,0,0,0.2)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8, padding: "12px 16px", color: "white", fontSize: 15 }} />
          </div>

          <div>
            <label style={{ display: "block", fontSize: 13, color: "rgba(255,255,255,0.6)", marginBottom: 6 }}>Slug</label>
            <input required type="text" value={form.slug} onChange={e => setForm({...form, slug: e.target.value})} style={{ width: "100%", background: "rgba(0,0,0,0.2)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8, padding: "12px 16px", color: "white", fontSize: 15 }} />
          </div>

          <div>
            <label style={{ display: "block", fontSize: 13, color: "rgba(255,255,255,0.6)", marginBottom: 6 }}>Short Description</label>
            <textarea required rows={2} value={form.shortDescription} onChange={e => setForm({...form, shortDescription: e.target.value})} style={{ width: "100%", background: "rgba(0,0,0,0.2)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8, padding: "12px 16px", color: "white", fontSize: 15, fontFamily: "inherit" }} />
          </div>

          <div>
            <label style={{ display: "block", fontSize: 13, color: "rgba(255,255,255,0.6)", marginBottom: 6 }}>Full Description</label>
            <textarea required rows={4} value={form.fullDescription} onChange={e => setForm({...form, fullDescription: e.target.value})} style={{ width: "100%", background: "rgba(0,0,0,0.2)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8, padding: "12px 16px", color: "white", fontSize: 15, fontFamily: "inherit" }} />
          </div>

          <div style={{ display: "flex", gap: 16 }}>
            <div style={{ flex: 1 }}>
              <label style={{ display: "block", fontSize: 13, color: "rgba(255,255,255,0.6)", marginBottom: 6 }}>Date</label>
              <input required type="date" value={form.eventDate} onChange={e => setForm({...form, eventDate: e.target.value})} style={{ width: "100%", background: "rgba(0,0,0,0.2)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8, padding: "12px 16px", color: "white", fontSize: 15, colorScheme: "dark" }} />
            </div>
            <div style={{ flex: 1 }}>
              <label style={{ display: "block", fontSize: 13, color: "rgba(255,255,255,0.6)", marginBottom: 6 }}>Time</label>
              <input required type="time" value={form.startTime} onChange={e => setForm({...form, startTime: e.target.value})} style={{ width: "100%", background: "rgba(0,0,0,0.2)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8, padding: "12px 16px", color: "white", fontSize: 15, colorScheme: "dark" }} />
            </div>
          </div>

          <div style={{ display: "flex", gap: 16 }}>
            <div style={{ flex: 1 }}>
              <label style={{ display: "block", fontSize: 13, color: "rgba(255,255,255,0.6)", marginBottom: 6 }}>Deadline</label>
              <input required type="datetime-local" value={form.registrationDeadline} onChange={e => setForm({...form, registrationDeadline: e.target.value})} style={{ width: "100%", background: "rgba(0,0,0,0.2)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8, padding: "12px 16px", color: "white", fontSize: 15, colorScheme: "dark" }} />
            </div>
          </div>

          <div style={{ display: "flex", gap: 16 }}>
            <div style={{ flex: 1 }}>
              <label style={{ display: "block", fontSize: 13, color: "rgba(255,255,255,0.6)", marginBottom: 6 }}>Price (INR)</label>
              <input required type="number" value={form.priceINR} onChange={e => setForm({...form, priceINR: parseInt(e.target.value)})} style={{ width: "100%", background: "rgba(0,0,0,0.2)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8, padding: "12px 16px", color: "white", fontSize: 15 }} />
            </div>
            <div style={{ flex: 1 }}>
              <label style={{ display: "block", fontSize: 13, color: "rgba(255,255,255,0.6)", marginBottom: 6 }}>Price (USD)</label>
              <input required type="number" value={form.priceUSD} onChange={e => setForm({...form, priceUSD: parseInt(e.target.value)})} style={{ width: "100%", background: "rgba(0,0,0,0.2)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8, padding: "12px 16px", color: "white", fontSize: 15 }} />
            </div>
          </div>

          <label style={{ display: "flex", alignItems: "center", gap: 12, padding: "12px 0", cursor: "pointer" }}>
            <input type="checkbox" checked={form.isFeatured} onChange={e => setForm({...form, isFeatured: e.target.checked})} style={{ width: 20, height: 20, accentColor: "#F5820D" }} />
            <span style={{ fontSize: 15, color: "white" }}>Feature this on the Links page</span>
          </label>
        </div>

        <button disabled={loading} type="submit" style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8, padding: "0 20px", height: 56, borderRadius: 12, border: "none", background: "linear-gradient(135deg,#F5820D,#E06B00)", color: "white", fontSize: 16, fontWeight: 700, cursor: loading ? "not-allowed" : "pointer", opacity: loading ? 0.7 : 1, marginTop: 8 }}>
          <Save size={20} /> {loading ? "Saving..." : "Create Program"}
        </button>

      </form>
    </div>
  );
}
