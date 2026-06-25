"use client";
import Link from "next/link";
import { useState } from "react";
import { Globe, Award, Video, Check, ChevronDown, ArrowRight } from "lucide-react";
import ImagePlaceholder from "@/components/shared/ImagePlaceholder";

const conditions = [
  "Autism Spectrum Disorder (ASD)",
  "ADHD",
  "Sensory Processing Disorder",
  "Developmental Delays",
  "Fine Motor Difficulties",
  "Handwriting Challenges",
  "Learning Difficulties",
  "Post-injury Rehabilitation",
];

const tzRows = [
  { loc: "United States",  ist: "8:00 PM – 10:00 PM", local: "7:30 AM – 9:30 AM PT / 10:30 AM EST" },
  { loc: "United Kingdom", ist: "5:30 PM – 8:30 PM",  local: "12:00 PM – 3:00 PM GMT" },
  { loc: "UAE / Gulf",     ist: "7:30 PM – 10:00 PM", local: "6:00 PM – 8:30 PM GST" },
  { loc: "Australia",      ist: "3:30 PM – 7:30 PM",  local: "8:00 PM – 12:00 AM AEST" },
  { loc: "Canada",         ist: "8:00 PM – 10:00 PM", local: "7:30 AM PT / 10:30 AM ET" },
];

const howSteps = [
  { n: "01", t: "Book and pay online", d: "Stripe accepted worldwide — Visa, Mastercard, PayPal. $9 flat. No hidden fees." },
  { n: "02", t: "Complete a pre-session form", d: "Brief questionnaire about your child's challenges, history, and goals for therapy." },
  { n: "03", t: "Join Zoom at appointment time", d: "No app download required. Zoom works in any modern web browser." },
  { n: "04", t: "Receive personalised therapy plan", d: "Detailed plan shared on WhatsApp and email within 24 hours of your session." },
  { n: "05", t: "Follow home program between sessions", d: "Simple, practical exercises you can do at home — no special equipment needed." },
];

const faqs = [
  { q: "Can you treat children with autism online?", a: "Yes. Online OT for autism is well-researched and effective. We use structured video-based assessments and activity-based home programs that parents implement between sessions." },
  { q: "What platform do you use?", a: "We use Zoom. You receive a meeting link by email after booking. No app download required — Zoom works in any web browser." },
  { q: "How do I pay?", a: "International patients pay via Stripe — Visa, Mastercard, American Express, and PayPal accepted. Fully encrypted and secure." },
  { q: "What language are sessions conducted in?", a: "Sessions are conducted in English. Hindi is also available on request." },
  { q: "Is online therapy as effective as in-person?", a: "For assessment, parent coaching, and most pediatric OT goals, yes. Research supports telehealth OT as equally effective for the majority of children." },
];

export default function InternationalPage() {
  const [faqOpen, setFaqOpen] = useState<number | null>(null);

  return (
    <>
      {/* Hero */}
      <section style={{ position: "relative", minHeight: "100svh", display: "flex", flexDirection: "column", justifyContent: "center", overflow: "hidden", background: "linear-gradient(135deg, #0D1117 0%, #1A2B35 60%, rgba(10,126,140,0.15) 100%)" }}>
        <div className="container" style={{ position: "relative", zIndex: 1 }}>
          <span style={{ display: "block", fontFamily: "'DM Sans',sans-serif", fontWeight: 500, fontSize: 12, letterSpacing: "0.14em", textTransform: "uppercase", color: "var(--color-primary-mid)", marginBottom: 20 }}>International Families</span>
          <h1 style={{ fontFamily: "'Nunito',sans-serif", fontWeight: 900, fontSize: "clamp(32px,5vw,60px)", color: "white", marginBottom: 20, lineHeight: 1.1, maxWidth: 680 }}>
            World-Class Pediatric Therapy, Online
          </h1>
          <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 18, color: "rgba(255,255,255,0.65)", marginBottom: 28, maxWidth: 540, lineHeight: 1.65 }}>
            Expert occupational therapy for your child, wherever you are in the world. Sessions via Zoom with Dr. Prasoon Gupta — a specialist with 3+ years helping children across 28 countries.
          </p>
          <div style={{ display: "flex", alignItems: "baseline", gap: 8, marginBottom: 36 }}>
            <span style={{ fontFamily: "'Nunito',sans-serif", fontWeight: 900, fontSize: 44, color: "white" }}>$9</span>
            <span style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 15, color: "rgba(255,255,255,0.5)" }}>per online consultation · 45 minutes</span>
          </div>
          <Link href="/book" className="btn btn-primary" style={{ padding: "14px 32px", fontSize: 15, marginBottom: 40 }}>
            Book an Online Consultation <ArrowRight size={16} />
          </Link>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 0, marginTop: 16 }}>
            {["BOT · MOT Certified", "English Sessions", "All time zones", "Secure Stripe payment"].map((t, i) => (
              <span key={t} style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 12, color: "rgba(255,255,255,0.38)", fontWeight: 500, paddingRight: i < 3 ? 16 : 0, marginRight: i < 3 ? 16 : 0, borderRight: i < 3 ? "1px solid rgba(255,255,255,0.12)" : "none" }}>{t}</span>
            ))}
          </div>
        </div>
      </section>

      {/* Why choose */}
      <section className="section" style={{ background: "var(--color-bg)" }}>
        <div className="container">
          <div style={{ textAlign: "center", marginBottom: 56 }}>
            <span className="eyebrow">Why Choose Udaan Care</span>
            <h2 style={{ fontFamily: "'Nunito',sans-serif", fontWeight: 700, fontSize: 36, color: "var(--color-text-primary)" }}>Expert Care Without Borders</h2>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 24 }}>
            {[
              { icon: Globe,  title: "Available in All Time Zones",      desc: "Morning slots IST equal evening slots EST/PST. We accommodate your schedule and can arrange early IST slots for international clients." },
              { icon: Award,  title: "Internationally Trained Specialist", desc: "Dr. Prasoon holds BOT and MOT qualifications with expertise in globally-recognized approaches including SI, NDT, and DIR/Floortime." },
              { icon: Video,  title: "Effective Online Sessions",          desc: "Research shows online OT is equally effective for most pediatric conditions. Your child benefits from the same evidence-based techniques as in our clinic." },
            ].map((c) => (
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

      {/* Conditions */}
      <section className="section" style={{ background: "var(--color-surface)" }}>
        <div className="container" style={{ maxWidth: 800 }}>
          <span className="eyebrow">Who We Help</span>
          <h2 style={{ fontFamily: "'Nunito',sans-serif", fontWeight: 700, fontSize: 36, color: "var(--color-text-primary)", marginBottom: 36 }}>Conditions We Treat</h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 12 }}>
            {conditions.map((c) => (
              <div key={c} style={{ display: "flex", alignItems: "center", gap: 12, padding: "14px 18px", borderRadius: 10, border: "1px solid var(--color-border)", background: "var(--color-bg)" }}>
                <Check size={15} style={{ color: "var(--color-primary)", flexShrink: 0 }} />
                <span style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 13, color: "var(--color-text-primary)" }}>{c}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How sessions work */}
      <section className="section" style={{ background: "var(--color-bg)" }}>
        <div className="container" style={{ maxWidth: 700 }}>
          <span className="eyebrow">The Process</span>
          <h2 style={{ fontFamily: "'Nunito',sans-serif", fontWeight: 700, fontSize: 36, color: "var(--color-text-primary)", marginBottom: 40 }}>How Online Sessions Work</h2>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {howSteps.map((s) => (
              <div key={s.n} style={{ display: "flex", gap: 20, alignItems: "flex-start", padding: "20px 24px", borderRadius: 12, border: "1px solid var(--color-border)", background: "var(--color-surface)" }}>
                <div style={{ fontFamily: "'Nunito',sans-serif", fontWeight: 900, fontSize: 28, color: "var(--color-primary)", lineHeight: 1, flexShrink: 0, width: 40 }}>{s.n}</div>
                <div>
                  <h3 style={{ fontFamily: "'DM Sans',sans-serif", fontWeight: 600, fontSize: 15, color: "var(--color-text-primary)", marginBottom: 4 }}>{s.t}</h3>
                  <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 13, color: "var(--color-text-secondary)", lineHeight: 1.65 }}>{s.d}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing card */}
      <section className="section" style={{ background: "var(--color-surface)" }}>
        <div className="container" style={{ maxWidth: 520 }}>
          <span className="eyebrow">Pricing</span>
          <h2 style={{ fontFamily: "'Nunito',sans-serif", fontWeight: 700, fontSize: 36, color: "var(--color-text-primary)", marginBottom: 36 }}>One Simple Price</h2>
          <div className="card" style={{ padding: 40, borderTop: "4px solid var(--color-primary)" }}>
            <div style={{ fontFamily: "'DM Sans',sans-serif", fontWeight: 600, fontSize: 13, color: "var(--color-text-secondary)", marginBottom: 10, textTransform: "uppercase", letterSpacing: "0.08em" }}>Online Consultation</div>
            <div style={{ display: "flex", alignItems: "baseline", gap: 8, marginBottom: 24 }}>
              <span style={{ fontFamily: "'Nunito',sans-serif", fontWeight: 900, fontSize: 60, color: "var(--color-primary)", lineHeight: 1 }}>$9</span>
              <span style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 14, color: "var(--color-text-secondary)" }}>per session · 45 min</span>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 28 }}>
              {["Full developmental assessment", "Personalised therapy plan within 24 hours", "Visa, Mastercard, PayPal via Stripe", "No hidden fees — one flat price"].map((f) => (
                <div key={f} style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <Check size={14} style={{ color: "var(--color-primary)", flexShrink: 0 }} />
                  <span style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 14, color: "var(--color-text-primary)" }}>{f}</span>
                </div>
              ))}
            </div>
            <Link href="/book" className="btn btn-primary" style={{ width: "100%", justifyContent: "center", padding: "14px" }}>Book Now — $9</Link>
            <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 12, color: "var(--color-text-secondary)", marginTop: 14, textAlign: "center", lineHeight: 1.6 }}>
              Clinic visits available in Katni, India only.<br />All international patients are served via Zoom.
            </p>
          </div>
        </div>
      </section>

      {/* Time zones */}
      <section className="section" style={{ background: "var(--color-bg)" }}>
        <div className="container" style={{ maxWidth: 740 }}>
          <span className="eyebrow">Scheduling</span>
          <h2 style={{ fontFamily: "'Nunito',sans-serif", fontWeight: 700, fontSize: 36, color: "var(--color-text-primary)", marginBottom: 36 }}>When Can We Meet?</h2>
          <div className="card" style={{ overflow: "hidden" }}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ background: "var(--color-primary-light)" }}>
                  {["Location", "Session Time (IST)", "Your Local Time"].map((h) => (
                    <th key={h} style={{ padding: "14px 20px", textAlign: "left", fontFamily: "'DM Sans',sans-serif", fontWeight: 600, fontSize: 12, color: "var(--color-primary)", letterSpacing: "0.04em" }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {tzRows.map((r, i) => (
                  <tr key={r.loc} style={{ borderTop: "1px solid var(--color-border)", background: i % 2 === 1 ? "var(--color-bg)" : "transparent" }}>
                    <td style={{ padding: "14px 20px", fontFamily: "'DM Sans',sans-serif", fontWeight: 600, fontSize: 14, color: "var(--color-text-primary)" }}>{r.loc}</td>
                    <td style={{ padding: "14px 20px", fontFamily: "'DM Sans',sans-serif", fontWeight: 600, fontSize: 13, color: "var(--color-primary)" }}>{r.ist}</td>
                    <td style={{ padding: "14px 20px", fontFamily: "'DM Sans',sans-serif", fontSize: 13, color: "var(--color-text-secondary)" }}>{r.local}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 13, color: "var(--color-text-secondary)", marginTop: 14 }}>
            Custom time slots available. Contact us via WhatsApp to schedule.
          </p>
        </div>
      </section>

      {/* Testimonial placeholder */}
      <section className="section" style={{ background: "var(--color-surface)" }}>
        <div className="container" style={{ maxWidth: 640 }}>
          <span className="eyebrow">International Reviews</span>
          <h2 style={{ fontFamily: "'Nunito',sans-serif", fontWeight: 700, fontSize: 32, color: "var(--color-text-primary)", marginBottom: 32 }}>What International Parents Say</h2>
          <div className="card" style={{ padding: 32, borderLeft: "4px solid var(--color-primary)" }}>
            <div style={{ display: "flex", gap: 16, alignItems: "flex-start" }}>
              <div style={{ width: 52, height: 52, borderRadius: "50%", overflow: "hidden", flexShrink: 0 }}>
                <ImagePlaceholder label="testimonials/parent-intl.jpg" style={{ height: 52, borderRadius: "50%" }} />
              </div>
              <div>
                <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 14, fontStyle: "italic", color: "var(--color-text-secondary)", lineHeight: 1.75, marginBottom: 10 }}>
                  International parent testimonial — upload a photo and quote from a parent in USA, UK, or UAE to display here.
                </p>
                <div style={{ fontFamily: "'DM Sans',sans-serif", fontWeight: 600, fontSize: 13, color: "var(--color-text-primary)" }}>Parent, International</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="section" style={{ background: "var(--color-bg)" }}>
        <div className="container" style={{ maxWidth: 720 }}>
          <span className="eyebrow">Common Questions</span>
          <h2 style={{ fontFamily: "'Nunito',sans-serif", fontWeight: 700, fontSize: 32, color: "var(--color-text-primary)", marginBottom: 40 }}>Questions from International Families</h2>
          <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
            {faqs.map((f, i) => (
              <div key={i} style={{ borderRadius: 12, border: `1px solid ${faqOpen === i ? "var(--color-primary)" : "var(--color-border)"}`, overflow: "hidden", transition: "border-color 0.2s", borderLeft: faqOpen === i ? "4px solid var(--color-primary)" : undefined }}>
                <button onClick={() => setFaqOpen(faqOpen === i ? null : i)} style={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16, padding: "18px 22px", background: "transparent", border: "none", cursor: "pointer", textAlign: "left" }}>
                  <span style={{ fontFamily: "'Nunito',sans-serif", fontWeight: 700, fontSize: 15, color: "var(--color-text-primary)" }}>{f.q}</span>
                  <ChevronDown size={16} style={{ color: "var(--color-text-secondary)", flexShrink: 0, transition: "transform 0.25s", transform: faqOpen === i ? "rotate(180deg)" : "none" }} />
                </button>
                {faqOpen === i && (
                  <div style={{ padding: "0 22px 18px" }}>
                    <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 14, color: "var(--color-text-secondary)", lineHeight: 1.75 }}>{f.a}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section style={{ padding: "max(5vh, 40px) 0", minHeight: "100svh", display: "flex", flexDirection: "column", justifyContent: "center", background: "#0D1117" }}>
        <div className="container" style={{ textAlign: "center" }}>
          <h2 style={{ fontFamily: "'Nunito',sans-serif", fontWeight: 900, fontSize: "clamp(28px,4vw,44px)", color: "white", marginBottom: 16 }}>
            Book Your Child&apos;s First Online Session
          </h2>
          <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 18, color: "rgba(255,255,255,0.5)", marginBottom: 40 }}>
            $9 · 45 minutes · Zoom · Available worldwide
          </p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 12, justifyContent: "center" }}>
            <Link href="/book" className="btn btn-primary" style={{ padding: "14px 36px", fontSize: 15 }}>
              Book Consultation — $9
            </Link>
            <a href="https://wa.me/918349764084" target="_blank" rel="noopener noreferrer" className="btn btn-white-outline" style={{ padding: "14px 28px", fontSize: 15 }}>
              Ask on WhatsApp
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
