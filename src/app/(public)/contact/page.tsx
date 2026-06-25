"use client";
import { useState } from "react";
import { MapPin, Phone, Mail, Clock, Send, Check, MessageCircle } from "lucide-react";

export default function ContactPage() {
  const [form, setForm] = useState({ name: "", phone: "", email: "", message: "" });
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSending(true);
    try {
      await fetch("/api/admin/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          phone: form.phone,
          email: form.email,
          source: (typeof window !== "undefined" && new URLSearchParams(window.location.search).get("utm_source")) || "website",
          message: form.message,
          status: "new",
        }),
      });
    } catch { /* silent — don't block UX */ }
    setSending(false);
    setSent(true);
  };


  const infoItems = [
    {
      icon: MapPin,
      title: "Clinic Address",
      content: (
        <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 14, color: "var(--color-text-secondary)", lineHeight: 1.75 }}>
          Sai Kripa First Floor, Garg Chowraha,<br />
          Pathak Gali, Near Rama Pharma,<br />
          Over Bridge Road, Katni, MP 483501
        </p>
      ),
    },
    {
      icon: Phone,
      title: "Phone & WhatsApp",
      content: (
        <div>
          <a href="tel:+918349764084" style={{ display: "block", fontFamily: "'DM Sans',sans-serif", fontSize: 14, color: "var(--color-text-secondary)", textDecoration: "none", lineHeight: 2, transition: "color 0.15s" }}
            onMouseEnter={(e) => { (e.target as HTMLElement).style.color = "var(--color-primary)"; }}
            onMouseLeave={(e) => { (e.target as HTMLElement).style.color = "var(--color-text-secondary)"; }}>
            +91 83497 64084
          </a>
          <a href="tel:+918349550671" style={{ display: "block", fontFamily: "'DM Sans',sans-serif", fontSize: 14, color: "var(--color-text-secondary)", textDecoration: "none", lineHeight: 2, transition: "color 0.15s", marginBottom: 12 }}
            onMouseEnter={(e) => { (e.target as HTMLElement).style.color = "var(--color-primary)"; }}
            onMouseLeave={(e) => { (e.target as HTMLElement).style.color = "var(--color-text-secondary)"; }}>
            +91 83495 50671
          </a>
          <a href="https://wa.me/918349764084?text=Hi%20Dr.%20Prasoon%2C%20I%20would%20like%20to%20book%20a%20consultation%20for%20my%20child."
            target="_blank" rel="noopener noreferrer"
            style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "9px 18px", borderRadius: 10, background: "#25D366", color: "white", fontFamily: "'DM Sans',sans-serif", fontWeight: 600, fontSize: 13, textDecoration: "none", transition: "opacity 0.15s" }}
            onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.opacity = "0.85"; }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.opacity = "1"; }}>
            <MessageCircle size={15} />Message on WhatsApp
          </a>
        </div>
      ),
    },
    {
      icon: Mail,
      title: "Email",
      content: (
        <a href="mailto:care@udaan.in" style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 14, color: "var(--color-text-secondary)", textDecoration: "none", transition: "color 0.15s" }}
          onMouseEnter={(e) => { (e.target as HTMLElement).style.color = "var(--color-primary)"; }}
          onMouseLeave={(e) => { (e.target as HTMLElement).style.color = "var(--color-text-secondary)"; }}>
          care@udaan.in
        </a>
      ),
    },
    {
      icon: Clock,
      title: "Clinic Hours",
      content: (
        <div style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 14 }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
            <span style={{ color: "var(--color-text-secondary)" }}>Monday – Saturday</span>
            <span style={{ fontWeight: 600, color: "var(--color-text-primary)" }}>10:00 AM – 7:00 PM</span>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <span style={{ color: "var(--color-text-secondary)" }}>Sunday</span>
            <span style={{ fontWeight: 600, color: "#E53E3E" }}>Closed</span>
          </div>
        </div>
      ),
    },
  ];

  return (
    <>
      {/* Hero */}
      <section style={{ paddingTop: 120, paddingBottom: 60, background: "linear-gradient(135deg, #1A2B35 0%, rgba(10,126,140,0.15) 100%)" }}>
        <div className="container">
          <span style={{ display: "block", fontFamily: "'DM Sans',sans-serif", fontWeight: 500, fontSize: 12, letterSpacing: "0.14em", textTransform: "uppercase", color: "var(--color-primary-mid)", marginBottom: 16 }}>Get in Touch</span>
          <h1 style={{ fontFamily: "'Nunito',sans-serif", fontWeight: 900, fontSize: "clamp(28px, 4vw, 42px)", color: "white", marginBottom: 12, lineHeight: 1.1 }}>Contact Udaan Care</h1>
          <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 16, color: "rgba(255,255,255,0.55)", maxWidth: 480 }}>Have questions? Reach out — we respond within 24 hours.</p>
        </div>
      </section>

      {/* Main content */}
      <section className="section" style={{ background: "var(--color-bg)" }}>
        <div className="container">
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 64, alignItems: "start" }} className="grid grid-cols-1 lg:grid-cols-2">
            {/* Left — Info */}
            <div>
              <h2 style={{ fontFamily: "'Nunito',sans-serif", fontWeight: 700, fontSize: 28, color: "var(--color-text-primary)", marginBottom: 32 }}>How to Reach Us</h2>
              <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                {infoItems.map((item) => (
                  <div key={item.title} className="card" style={{ padding: "20px 24px", display: "flex", alignItems: "flex-start", gap: 16 }}>
                    <div style={{ width: 40, height: 40, borderRadius: 10, background: "var(--color-primary-light)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                      <item.icon size={18} style={{ color: "var(--color-primary)" }} />
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontFamily: "'DM Sans',sans-serif", fontWeight: 600, fontSize: 13, color: "var(--color-text-primary)", marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.06em" }}>{item.title}</div>
                      {item.content}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right — Form */}
            <div>
              <h2 style={{ fontFamily: "'Nunito',sans-serif", fontWeight: 700, fontSize: 28, color: "var(--color-text-primary)", marginBottom: 32 }}>Send a Message</h2>
              {sent ? (
                <div className="card" style={{ padding: "48px 40px", textAlign: "center" }}>
                  <div style={{ width: 64, height: 64, borderRadius: "50%", background: "var(--color-primary-light)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 20px" }}>
                    <Check size={32} style={{ color: "var(--color-primary)" }} />
                  </div>
                  <h3 style={{ fontFamily: "'Nunito',sans-serif", fontWeight: 800, fontSize: 22, color: "var(--color-text-primary)", marginBottom: 10 }}>Message Sent</h3>
                  <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 14, color: "var(--color-text-secondary)", lineHeight: 1.75, marginBottom: 24 }}>
                    We&apos;ll get back to you within 24 hours. Or reach us instantly on WhatsApp.
                  </p>
                  <button onClick={() => { setSent(false); setForm({ name: "", phone: "", email: "", message: "" }); }} className="btn btn-outline" style={{ padding: "10px 24px" }}>
                    Send Another Message
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="card" style={{ padding: "32px 36px" }}>
                  <div style={{ display: "grid", gap: 20 }}>
                    {[
                      { key: "name",    label: "Your Name",    type: "text",  ph: "Priya Sharma" },
                      { key: "phone",   label: "Phone Number", type: "tel",   ph: "+91 98765 43210" },
                      { key: "email",   label: "Email Address", type: "email", ph: "you@example.com" },
                    ].map((f) => (
                      <div key={f.key}>
                        <label style={{ display: "block", fontFamily: "'DM Sans',sans-serif", fontWeight: 600, fontSize: 13, color: "var(--color-text-primary)", marginBottom: 6 }}>{f.label} <span style={{ color: "var(--color-accent)" }}>*</span></label>
                        <input className="input" type={f.type} required placeholder={f.ph} value={form[f.key as keyof typeof form]} onChange={e => setForm({...form, [f.key]: e.target.value})} />
                      </div>
                    ))}
                    <div>
                      <label style={{ display: "block", fontFamily: "'DM Sans',sans-serif", fontWeight: 600, fontSize: 13, color: "var(--color-text-primary)", marginBottom: 6 }}>Message <span style={{ color: "var(--color-accent)" }}>*</span></label>
                      <textarea className="input" required placeholder="Tell us about your child and how we can help..." style={{ minHeight: 120, resize: "none" }} value={form.message} onChange={e => setForm({...form, message: e.target.value})} />
                    </div>
                    <button type="submit" disabled={sending} className="btn btn-primary" style={{ width: "100%", justifyContent: "center", padding: "14px" }}>
                      {sending ? "Sending..." : <><Send size={15} />Send Message</>}
                    </button>
                    <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 12, color: "var(--color-text-secondary)", textAlign: "center" }}>
                      We reply within 24 hours · Reach us instantly on WhatsApp
                    </p>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Map */}
      <section style={{ background: "var(--color-surface)" }}>
        <div className="container" style={{ paddingBottom: 64 }}>
          <div style={{ borderRadius: 16, overflow: "hidden", boxShadow: "var(--shadow-card)" }}>
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3654.2!2d80.3946!3d23.8352!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMjPCsDUwJzA2LjciTiA4MMKwMjMnNDAuNiJF!5e0!3m2!1sen!2sin!4v1620000000000!5m2!1sen!2sin"
              width="100%"
              height="380"
              style={{ border: 0, display: "block" }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Udaan Care — Katni, MP"
            />
          </div>
          <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 13, color: "var(--color-text-secondary)", textAlign: "center", marginTop: 16 }}>
            Sai Kripa, Garg Chowraha, Katni, Madhya Pradesh 483501
          </p>
        </div>
      </section>
    </>
  );
}
