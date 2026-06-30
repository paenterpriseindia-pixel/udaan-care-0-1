"use client";
import { useState, useRef } from "react";
import type { Metadata } from "next";
import Link from "next/link";
import ImagePlaceholder from "@/components/shared/ImagePlaceholder";
import { Briefcase, CreditCard, Users, Check, ArrowRight, Upload } from "lucide-react";

const steps = [
  { n: "01", title: "Apply Online", desc: "Fill out the application form below. It takes less than 5 minutes." },
  { n: "02", title: "Credential Verification", desc: "We verify your qualifications (BOT, MOT, BPT) and clinical experience." },
  { n: "03", title: "Onboarding Session", desc: "Complete a short orientation to learn our platform and patient workflow." },
  { n: "04", title: "Start Seeing Patients", desc: "Go live within 7 days of completing onboarding." },
];

const requirements = [
  "Qualified Occupational Therapist (BOT, MOT, or equivalent)",
  "Registered with AIOTA or state OT council",
  "Minimum 1 year of pediatric clinical experience",
  "Reliable internet connection for video sessions",
  "Own laptop or desktop computer",
  "Fluent in English or Hindi (regional languages a bonus)",
];

const earnings = [
  { type: "Initial Assessment", duration: "45 min", earn: "₹350 per session" },
  { type: "Follow-up Session",  duration: "30 min", earn: "₹250 per session" },
  { type: "Monthly Plan",       duration: "Ongoing", earn: "Discussed on joining" },
];

const whyCards = [
  { icon: Briefcase, title: "Flexible Online Practice", desc: "See patients from anywhere in India via Zoom. Set your own hours around your existing commitments." },
  { icon: CreditCard, title: "Transparent Pay Per Session", desc: "Earn per consultation with clear payment terms. Paid monthly directly to your bank account." },
  { icon: Users, title: "Ready Patient Pipeline", desc: "We handle all marketing, booking, and payment processing. You focus entirely on therapy." },
];

export default function JoinAsTherapistPage() {
  const [form, setForm] = useState({ name: "", qualification: "", years: "", specialization: "", city: "", phone: "", email: "", linkedin: "", bio: "", source: "" });
  const [cvFile, setCvFile] = useState<File | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);
  const formRef = useRef<HTMLDivElement>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    await new Promise(r => setTimeout(r, 1400));
    setSubmitting(false);
    setSubmitted(true);
  };

  return (
    <>
      {/* Hero */}
      <section style={{ position: "relative", paddingTop: 90, paddingBottom: 40, overflow: "hidden" }}>
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(135deg, #1A2B35 0%, #0A7E8C22 100%)" }} />
        <div className="container" style={{ position: "relative", zIndex: 1 }}>
          <span style={{ display: "block", fontFamily: "'DM Sans',sans-serif", fontWeight: 500, fontSize: 12, letterSpacing: "0.14em", textTransform: "uppercase", color: "var(--color-primary-mid)", marginBottom: 20 }}>For Occupational Therapists</span>
          <h1 style={{ fontFamily: "'Nunito',sans-serif", fontWeight: 900, fontSize: "clamp(28px, 4vw, 42px)", color: "white", marginBottom: 20, lineHeight: 1.1, maxWidth: 640 }}>
            Partner with Udaan Care
          </h1>
          <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 18, color: "rgba(255,255,255,0.65)", marginBottom: 36, maxWidth: 520, lineHeight: 1.65 }}>
            Join India&apos;s growing pediatric therapy network. See patients online. Get paid per session.
          </p>
          <button onClick={() => formRef.current?.scrollIntoView({ behavior: "smooth" })} className="btn btn-primary" style={{ padding: "14px 32px", fontSize: 15 }}>
            Apply to Join <ArrowRight size={16} />
          </button>
        </div>
      </section>

      {/* Why join */}
      <section className="section" style={{ background: "var(--color-bg)" }}>
        <div className="container">
          <div style={{ textAlign: "center", marginBottom: 56 }}>
            <span className="eyebrow">Why Therapists Choose Us</span>
            <h2 style={{ fontFamily: "'Nunito',sans-serif", fontWeight: 700, fontSize: 36, color: "var(--color-text-primary)" }}>Why Therapists Choose Udaan Care</h2>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 24 }}>
            {whyCards.map((c) => (
              <div key={c.title} className="card" style={{ padding: 32 }}>
                <div style={{ width: 48, height: 48, borderRadius: 12, background: "var(--color-primary-light)", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 20 }}>
                  <c.icon size={22} style={{ color: "var(--color-primary)" }} />
                </div>
                <h3 style={{ fontFamily: "'Nunito',sans-serif", fontWeight: 700, fontSize: 20, color: "var(--color-text-primary)", marginBottom: 10 }}>{c.title}</h3>
                <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 14, color: "var(--color-text-secondary)", lineHeight: 1.75 }}>{c.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="section" style={{ background: "var(--color-surface)" }}>
        <div className="container" style={{ maxWidth: 760 }}>
          <span className="eyebrow">The Process</span>
          <h2 style={{ fontFamily: "'Nunito',sans-serif", fontWeight: 700, fontSize: 36, color: "var(--color-text-primary)", marginBottom: 48 }}>How the Partnership Works</h2>
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {steps.map((s) => (
              <div key={s.n} style={{ display: "flex", gap: 20, alignItems: "flex-start", padding: "24px 28px", borderRadius: 14, border: "1px solid var(--color-border)", background: "var(--color-bg)" }}>
                <div style={{ fontFamily: "'Nunito',sans-serif", fontWeight: 900, fontSize: 32, color: "var(--color-primary)", lineHeight: 1, flexShrink: 0, width: 44 }}>{s.n}</div>
                <div>
                  <h3 style={{ fontFamily: "'DM Sans',sans-serif", fontWeight: 600, fontSize: 16, color: "var(--color-text-primary)", marginBottom: 6 }}>{s.title}</h3>
                  <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 14, color: "var(--color-text-secondary)", lineHeight: 1.65 }}>{s.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Requirements */}
      <section className="section" style={{ background: "var(--color-bg)" }}>
        <div className="container" style={{ maxWidth: 720 }}>
          <span className="eyebrow">Eligibility</span>
          <h2 style={{ fontFamily: "'Nunito',sans-serif", fontWeight: 700, fontSize: 36, color: "var(--color-text-primary)", marginBottom: 36 }}>Who Can Apply</h2>
          <div className="grid-responsive-2 grid grid-cols-1 sm:grid-cols-2" style={{ gap: 12 }}>
            {requirements.map((r) => (
              <div key={r} style={{ display: "flex", alignItems: "flex-start", gap: 12, padding: "14px 18px", borderRadius: 10, border: "1px solid var(--color-border)", background: "var(--color-surface)" }}>
                <div style={{ width: 22, height: 22, borderRadius: "50%", background: "var(--color-primary)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, marginTop: 1 }}>
                  <Check size={11} style={{ color: "white" }} />
                </div>
                <span style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 14, color: "var(--color-text-primary)", lineHeight: 1.55 }}>{r}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pay structure */}
      <section className="section" style={{ background: "var(--color-surface)" }}>
        <div className="container" style={{ maxWidth: 680 }}>
          <span className="eyebrow">Earnings</span>
          <h2 style={{ fontFamily: "'Nunito',sans-serif", fontWeight: 700, fontSize: 36, color: "var(--color-text-primary)", marginBottom: 36 }}>Earnings Overview</h2>
          <div className="card" style={{ overflow: "hidden" }}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ background: "var(--color-primary-light)" }}>
                  {["Session Type", "Duration", "Your Earnings"].map((h) => (
                    <th key={h} style={{ padding: "14px 20px", textAlign: "left", fontFamily: "'DM Sans',sans-serif", fontWeight: 600, fontSize: 13, color: "var(--color-primary)", letterSpacing: "0.04em" }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {earnings.map((e, i) => (
                  <tr key={e.type} style={{ borderTop: "1px solid var(--color-border)", background: i % 2 === 0 ? "transparent" : "var(--color-bg)" }}>
                    <td style={{ padding: "16px 20px", fontFamily: "'DM Sans',sans-serif", fontWeight: 600, fontSize: 14, color: "var(--color-text-primary)" }}>{e.type}</td>
                    <td style={{ padding: "16px 20px", fontFamily: "'DM Sans',sans-serif", fontSize: 14, color: "var(--color-text-secondary)" }}>{e.duration}</td>
                    <td style={{ padding: "16px 20px", fontFamily: "'Nunito',sans-serif", fontWeight: 700, fontSize: 14, color: "var(--color-primary)" }}>{e.earn}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 13, color: "var(--color-text-secondary)", marginTop: 16, paddingLeft: 4 }}>
            Payment processed monthly. No deductions for no-shows booked by the patient.
          </p>
        </div>
      </section>

      {/* Application Form */}
      <section className="section" ref={formRef} style={{ background: "var(--color-bg)" }} id="apply">
        <div className="container" style={{ maxWidth: 640 }}>
          <span className="eyebrow">Apply Now</span>
          <h2 style={{ fontFamily: "'Nunito',sans-serif", fontWeight: 700, fontSize: 36, color: "var(--color-text-primary)", marginBottom: 8 }}>Join the Team</h2>
          <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 15, color: "var(--color-text-secondary)", marginBottom: 40 }}>Takes 5 minutes. We respond within 48 hours.</p>

          {submitted ? (
            <div className="card" style={{ padding: "48px 40px", textAlign: "center" }}>
              <div style={{ width: 64, height: 64, borderRadius: "50%", background: "var(--color-primary-light)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 20px" }}>
                <Check size={32} style={{ color: "var(--color-primary)" }} />
              </div>
              <h3 style={{ fontFamily: "'Nunito',sans-serif", fontWeight: 800, fontSize: 22, color: "var(--color-text-primary)", marginBottom: 10 }}>Application Received</h3>
              <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 14, color: "var(--color-text-secondary)", lineHeight: 1.75 }}>
                Thank you, {form.name || "Therapist"}. We have received your application and will contact you within 48 hours at {form.phone || form.email || "the details you provided"}.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="card" style={{ padding: "40px" }}>
              <div style={{ display: "grid", gap: 20 }}>
                {/* Name */}
                <Field label="Full Name" required>
                  <input className="input" required placeholder="Dr. Anita Sharma" value={form.name} onChange={e => setForm({...form, name: e.target.value})} />
                </Field>

                {/* Qualification */}
                <Field label="Qualification" required>
                  <select className="input" required value={form.qualification} onChange={e => setForm({...form, qualification: e.target.value})} style={{ cursor: "pointer" }}>
                    <option value="">Select qualification</option>
                    {["BOT", "MOT", "BPT", "Other"].map(q => <option key={q} value={q}>{q}</option>)}
                  </select>
                </Field>

                {/* Years + Specialization */}
                <div className="grid-responsive-2" style={{ gap: 16 }}>
                  <Field label="Years of Experience" required>
                    <input className="input" type="number" min={0} max={50} required placeholder="e.g. 2" value={form.years} onChange={e => setForm({...form, years: e.target.value})} />
                  </Field>
                  <Field label="Specialization">
                    <input className="input" placeholder="e.g. Pediatric OT" value={form.specialization} onChange={e => setForm({...form, specialization: e.target.value})} />
                  </Field>
                </div>

                {/* City + Phone */}
                <div className="grid-responsive-2" style={{ gap: 16 }}>
                  <Field label="City / State" required>
                    <input className="input" required placeholder="e.g. Bhopal, MP" value={form.city} onChange={e => setForm({...form, city: e.target.value})} />
                  </Field>
                  <Field label="Phone Number" required>
                    <input className="input" type="tel" required placeholder="+91 98765 43210" value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} />
                  </Field>
                </div>

                <Field label="Email Address" required>
                  <input className="input" type="email" required placeholder="you@example.com" value={form.email} onChange={e => setForm({...form, email: e.target.value})} />
                </Field>

                <Field label="LinkedIn Profile URL">
                  <input className="input" placeholder="https://linkedin.com/in/..." value={form.linkedin} onChange={e => setForm({...form, linkedin: e.target.value})} />
                </Field>

                <Field label="Brief Bio" required>
                  <textarea className="input" required placeholder="Tell us about your experience with children..." style={{ minHeight: 100, resize: "none" }} value={form.bio} onChange={e => setForm({...form, bio: e.target.value})} />
                </Field>

                {/* CV Upload */}
                <Field label="Upload CV / Certificate (PDF only)" required>
                  <div onClick={() => fileRef.current?.click()} style={{ border: "2px dashed var(--color-border)", borderRadius: 10, padding: "20px 16px", display: "flex", flexDirection: "column", alignItems: "center", gap: 8, cursor: "pointer", transition: "border-color 0.2s", background: "var(--color-bg)" }}
                    onMouseEnter={(e) => (e.currentTarget.style.borderColor = "var(--color-primary)")}
                    onMouseLeave={(e) => (e.currentTarget.style.borderColor = "var(--color-border)")}
                  >
                    <Upload size={20} style={{ color: "var(--color-text-secondary)" }} />
                    <span style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 13, color: "var(--color-text-secondary)" }}>
                      {cvFile ? cvFile.name : "Click to upload or drag and drop"}
                    </span>
                    <span style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 11, color: "var(--color-text-secondary)", opacity: 0.65 }}>PDF only, max 5MB</span>
                    <input ref={fileRef} type="file" accept=".pdf" style={{ display: "none" }} onChange={e => setCvFile(e.target.files?.[0] || null)} />
                  </div>
                </Field>

                <Field label="How did you hear about us?">
                  <select className="input" value={form.source} onChange={e => setForm({...form, source: e.target.value})} style={{ cursor: "pointer" }}>
                    <option value="">Select</option>
                    {["Instagram", "Google", "Referral", "Other"].map(s => <option key={s}>{s}</option>)}
                  </select>
                </Field>

                <button type="submit" disabled={submitting} className="btn btn-primary" style={{ width: "100%", justifyContent: "center", padding: "16px", fontSize: 15, marginTop: 8 }}>
                  {submitting ? "Submitting..." : "Submit Application"}
                </button>
              </div>
            </form>
          )}
        </div>
      </section>
    </>
  );
}

function Field({ label, required, children }: { label: string; required?: boolean; children: React.ReactNode }) {
  return (
    <div>
      <label style={{ display: "block", fontFamily: "'DM Sans',sans-serif", fontWeight: 600, fontSize: 13, color: "var(--color-text-primary)", marginBottom: 6 }}>
        {label}{required && <span style={{ color: "var(--color-accent)", marginLeft: 3 }}>*</span>}
      </label>
      {children}
    </div>
  );
}
