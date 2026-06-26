"use client";
import Link from "next/link";
import { useState } from "react";
import { Check, ChevronDown, ArrowRight } from "lucide-react";
import { useCurrency } from "@/context/CurrencyContext";
import ImagePlaceholder from "@/components/shared/ImagePlaceholder";
import type { LucideIcon } from "lucide-react";

export interface ServicePageData {
  slug: string;
  icon: LucideIcon;
  title: string;
  subtitle: string;
  accent: string;
  what: string[];
  who: string[];
  steps: { title: string; desc: string }[];
  outcomes: string[];
  faqs: { q: string; a: string }[];
}

export default function ServicePageTemplate({ data }: { data: ServicePageData }) {
  const [open, setOpen] = useState<number | null>(0);
  const { prices } = useCurrency();
  const Icon = data.icon;

  return (
    <>
      {/* Hero */}
      <section style={{ position: "relative", paddingTop: 90, paddingBottom: 40, minHeight: 440, display: "flex", alignItems: "center" }}>
        <div style={{ position: "absolute", inset: 0 }}>
          <ImagePlaceholder label={`services/${data.slug}.jpg`} style={{ position: "absolute", inset: 0, borderRadius: 0, height: "100%" }} />
          <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to right, rgba(13,17,23,0.92) 55%, rgba(13,17,23,0.6) 100%)" }} />
        </div>
        <div className="container" style={{ position: "relative", zIndex: 1 }}>
          <div style={{ width: 48, height: 48, borderRadius: 12, background: `${data.accent}25`, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 20 }}>
            <Icon size={24} style={{ color: data.accent }} />
          </div>
          <h1 style={{ fontFamily: "'Nunito',sans-serif", fontWeight: 900, fontSize: "clamp(32px, 5vw, 56px)", color: "white", marginBottom: 16, lineHeight: 1.1 }}>{data.title}</h1>
          <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 18, color: "rgba(255,255,255,0.7)", marginBottom: 36, maxWidth: 560, lineHeight: 1.65 }}>{data.subtitle}</p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 12 }}>
            <Link href="/book" className="btn btn-primary" style={{ padding: "13px 28px" }}>
              Book Consultation — {prices.online.display} <ArrowRight size={15} />
            </Link>
            <a href="https://wa.me/918349764084" target="_blank" rel="noopener noreferrer" className="btn btn-white-outline" style={{ padding: "13px 24px" }}>
              Ask on WhatsApp
            </a>
          </div>
        </div>
      </section>

      {/* What is */}
      <section className="section" style={{ background: "var(--color-bg)" }}>
        <div className="container" style={{ maxWidth: 860 }}>
          <span className="eyebrow">Overview</span>
          <h2 style={{ fontFamily: "'Nunito',sans-serif", fontWeight: 700, fontSize: 32, color: "var(--color-text-primary)", marginBottom: 32 }}>What is {data.title}?</h2>
          <div className="grid-responsive-2" style={{ gap: 24 }} className="grid grid-cols-1 md:grid-cols-2">
            {data.what.map((p, i) => (
              <div key={i} className="card" style={{ padding: "24px 28px" }}>
                <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 15, color: "var(--color-text-secondary)", lineHeight: 1.75 }}>{p}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Who it helps */}
      <section className="section" style={{ background: "var(--color-surface)" }}>
        <div className="container" style={{ maxWidth: 800 }}>
          <span className="eyebrow">Who We Help</span>
          <h2 style={{ fontFamily: "'Nunito',sans-serif", fontWeight: 700, fontSize: 32, color: "var(--color-text-primary)", marginBottom: 32 }}>Is this right for my child?</h2>
          <div className="grid-responsive-2" style={{ gap: 12 }} className="grid grid-cols-1 sm:grid-cols-2">
            {data.who.map((w) => (
              <div key={w} style={{ display: "flex", alignItems: "center", gap: 12, padding: "14px 18px", borderRadius: 10, border: "1px solid var(--color-border)", background: "var(--color-bg)" }}>
                <div style={{ width: 24, height: 24, borderRadius: "50%", background: data.accent, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <Check size={12} style={{ color: "white" }} />
                </div>
                <span style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 14, color: "var(--color-text-primary)" }}>{w}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Session steps */}
      <section className="section" style={{ background: "var(--color-bg)" }}>
        <div className="container" style={{ maxWidth: 760 }}>
          <span className="eyebrow">The Process</span>
          <h2 style={{ fontFamily: "'Nunito',sans-serif", fontWeight: 700, fontSize: 32, color: "var(--color-text-primary)", marginBottom: 40 }}>What happens in a session?</h2>
          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            {data.steps.map((s, i) => (
              <div key={i} style={{ display: "flex", gap: 20, padding: "24px 28px", borderRadius: 14, border: "1px solid var(--color-border)", background: "var(--color-surface)", alignItems: "flex-start" }}>
                <div style={{ fontFamily: "'Nunito',sans-serif", fontWeight: 900, fontSize: 32, color: data.accent, lineHeight: 1, flexShrink: 0, width: 44 }}>
                  0{i + 1}
                </div>
                <div>
                  <h3 style={{ fontFamily: "'DM Sans',sans-serif", fontWeight: 600, fontSize: 16, color: "var(--color-text-primary)", marginBottom: 6 }}>{s.title}</h3>
                  <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 14, color: "var(--color-text-secondary)", lineHeight: 1.65 }}>{s.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Outcomes */}
      <section style={{ padding: "80px 0", background: "#1A2B35" }}>
        <div className="container" style={{ maxWidth: 800 }}>
          <span className="eyebrow" style={{ color: "var(--color-primary-mid)" }}>Expected Results</span>
          <h2 style={{ fontFamily: "'Nunito',sans-serif", fontWeight: 700, fontSize: 32, color: "white", marginBottom: 36 }}>What results can I expect?</h2>
          <div className="grid-responsive-2" style={{ gap: 12 }} className="grid grid-cols-1 sm:grid-cols-2">
            {data.outcomes.map((o) => (
              <div key={o} style={{ display: "flex", alignItems: "center", gap: 12, padding: "14px 20px", borderRadius: 10, background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)" }}>
                <Check size={16} style={{ color: "var(--color-primary-mid)", flexShrink: 0 }} />
                <span style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 14, color: "rgba(255,255,255,0.8)" }}>{o}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="section" style={{ background: "var(--color-bg)" }}>
        <div className="container" style={{ maxWidth: 720 }}>
          <span className="eyebrow">Common Questions</span>
          <h2 style={{ fontFamily: "'Nunito',sans-serif", fontWeight: 700, fontSize: 32, color: "var(--color-text-primary)", marginBottom: 40 }}>Frequently Asked Questions</h2>
          <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
            {data.faqs.map((f, i) => (
              <div key={i} style={{ borderRadius: 12, border: `1px solid ${open === i ? data.accent : "var(--color-border)"}`, overflow: "hidden", transition: "border-color 0.2s", borderLeft: open === i ? `4px solid ${data.accent}` : undefined }}>
                <button onClick={() => setOpen(open === i ? null : i)} style={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16, padding: "18px 22px", background: "transparent", border: "none", cursor: "pointer", textAlign: "left" }}>
                  <span style={{ fontFamily: "'Nunito',sans-serif", fontWeight: 700, fontSize: 15, color: "var(--color-text-primary)" }}>{f.q}</span>
                  <ChevronDown size={16} style={{ color: "var(--color-text-secondary)", flexShrink: 0, transition: "transform 0.25s", transform: open === i ? "rotate(180deg)" : "none" }} />
                </button>
                {open === i && (
                  <div style={{ padding: "0 22px 18px" }}>
                    <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 14, color: "var(--color-text-secondary)", lineHeight: 1.75 }}>{f.a}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ padding: "80px 0", background: "var(--color-surface)", borderTop: "1px solid var(--color-border)" }}>
        <div className="container" style={{ textAlign: "center" }}>
          <h2 style={{ fontFamily: "'Nunito',sans-serif", fontWeight: 700, fontSize: 32, color: "var(--color-text-primary)", marginBottom: 12 }}>Ready to start?</h2>
          <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 16, color: "var(--color-text-secondary)", marginBottom: 32, maxWidth: 480, marginLeft: "auto", marginRight: "auto" }}>Book an initial consultation with Dr. Prasoon and take the first step toward your child&apos;s progress.</p>
          <Link href="/book" className="btn btn-primary" style={{ padding: "14px 36px", fontSize: 15 }}>
            Book Consultation — {prices.online.display} <ArrowRight size={16} />
          </Link>
        </div>
      </section>
    </>
  );
}
