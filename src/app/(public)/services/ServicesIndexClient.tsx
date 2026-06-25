"use client";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { Activity, Heart, Brain, Video, ArrowRight, Check } from "lucide-react";
import { useCurrency } from "@/context/CurrencyContext";

const services = [
  {
    slug: "occupational-therapy",
    icon: Activity,
    title: "Occupational Therapy",
    accent: "#0A7E8C",
    badge: "Most Popular",
    desc: "Goal-oriented therapy helping children gain independence in daily activities — dressing, eating, writing, playing, and school participation.",
    highlights: ["Fine & gross motor skills", "Self-care & independence", "Handwriting & school readiness", "Cognitive skill building"],
    img: "/images/services/occupational-therapy.jpg",
  },
  {
    slug: "pediatric-therapy",
    icon: Heart,
    title: "Pediatric Therapy",
    accent: "#6B3FA0",
    badge: "Developmental",
    desc: "Play-based developmental support for infants, toddlers, and school-age children. Targets developmental milestones through evidence-based interventions.",
    highlights: ["Developmental milestone tracking", "Play-based learning", "Parent-guided home program", "ASD & ADHD support"],
    img: "/images/services/pediatric-therapy.jpg",
  },
  {
    slug: "sensory-integration",
    icon: Brain,
    title: "Sensory Integration",
    accent: "#F5820D",
    badge: "Specialist",
    desc: "Ayres Sensory Integration therapy helps children who are over-sensitive or under-responsive to touch, movement, sound, or other sensory inputs.",
    highlights: ["Sensory diet programs", "Tactile & proprioceptive work", "Vestibular processing", "Behaviour regulation"],
    img: "/images/services/sensory-integration.jpg",
  },
  {
    slug: "online-therapy",
    icon: Video,
    title: "Online Therapy",
    accent: "#0A7E8C",
    badge: "Nationwide & Global",
    desc: "Expert pediatric OT sessions via Zoom — available across India and worldwide. Full therapy experience with parent coaching and home programs.",
    highlights: ["Live Zoom sessions", "Parent coaching included", "Home program every session", "Available India & worldwide"],
    img: "/images/services/online-therapy.jpg",
  },
];

const fadeUp = { hidden: { opacity: 0, y: 24 }, show: { opacity: 1, y: 0 } };

export default function ServicesIndexClient() {
  const { prices } = useCurrency();

  return (
    <>
      {/* ── Hero ── */}
      <section style={{
        position: "relative", paddingTop: 100, paddingBottom: 40,
        background: "#0D1117", overflowX: "hidden",

      }}>
        <div style={{ position: "absolute", top: 0, right: -80, width: 420, height: 420, borderRadius: "50%", background: "radial-gradient(circle, rgba(10,126,140,0.18), transparent 70%)", pointerEvents: "none" }} />

        <div style={{ position: "absolute", bottom: -60, left: -60, width: 300, height: 300, borderRadius: "50%", background: "radial-gradient(circle, rgba(107,63,160,0.12), transparent 70%)", pointerEvents: "none" }} />
        <div className="container" style={{ position: "relative", zIndex: 1, textAlign: "center" }}>
          <motion.div variants={fadeUp} initial="hidden" animate="show" transition={{ duration: 0.6 }}>
            <span style={{ display: "inline-block", fontFamily: "'DM Sans',sans-serif", fontWeight: 500, fontSize: 12, letterSpacing: "0.14em", textTransform: "uppercase", color: "var(--color-primary-mid)", marginBottom: 20 }}>Our Services</span>
            <h1 style={{ fontFamily: "'Nunito',sans-serif", fontWeight: 900, fontSize: "clamp(28px, 4vw, 42px)", color: "white", lineHeight: 1.08, marginBottom: 20 }}>
              Therapy Built Around<br />
              <span style={{ background: "linear-gradient(90deg,#0D9BAC,#6B3FA0)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
                Your Child
              </span>
            </h1>
            <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 19, color: "rgba(255,255,255,0.6)", maxWidth: 560, margin: "0 auto 36px", lineHeight: 1.7 }}>
              Evidence-based, child-first occupational therapy — in-clinic in Katni and online across India and worldwide.
            </p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 12, justifyContent: "center" }}>
              <Link href="/book" className="btn btn-primary" style={{ padding: "14px 32px", fontSize: 15 }}>
                Book Consultation — {prices.online.display} <ArrowRight size={15} />
              </Link>
              <a href="https://wa.me/918349764084" target="_blank" rel="noopener noreferrer" className="btn btn-white-outline" style={{ padding: "14px 24px", fontSize: 15 }}>
                Ask on WhatsApp
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── Service Cards ── */}
      <section className="section" style={{ background: "var(--color-bg)" }}>
        <div className="container">
          <div style={{ display: "flex", flexDirection: "column", gap: 32 }}>
            {services.map((s, i) => (
              <motion.div
                key={s.slug}
                variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true }}
                transition={{ duration: 0.55, delay: i * 0.08 }}
                style={{
                  display: "grid",
                  gridTemplateColumns: i % 2 === 0 ? "1fr 1.2fr" : "1.2fr 1fr",
                  gap: 0, borderRadius: 20, overflow: "hidden",
                  border: "1px solid var(--color-border)",
                  background: "var(--color-card)",
                  boxShadow: "var(--shadow-card)",
                  minHeight: 360,
                }}
              >
                {/* Image side — alternating left/right */}
                {i % 2 !== 0 && (
                  <div style={{ position: "relative", minHeight: 280 }}>
                    <Image
                      src={s.img}
                      alt={s.title}
                      fill
                      style={{ objectFit: "cover" }}
                      sizes="(max-width: 900px) 100vw, 50vw"
                      onError={() => {}} // silently fail, shows nothing
                    />
                    <div style={{ position: "absolute", inset: 0, background: `linear-gradient(135deg, ${s.accent}30, transparent)` }} />
                  </div>
                )}

                {/* Copy side */}
                <div style={{ padding: "48px 48px", display: "flex", flexDirection: "column", justifyContent: "center" }}>
                  {/* Badge */}
                  <span style={{
                    display: "inline-block", alignSelf: "flex-start",
                    padding: "4px 12px", borderRadius: 6, marginBottom: 20,
                    fontFamily: "'DM Sans',sans-serif", fontWeight: 600, fontSize: 11, letterSpacing: "0.08em",
                    background: `${s.accent}18`, color: s.accent, border: `1px solid ${s.accent}30`,
                  }}>{s.badge}</span>

                  <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
                    <div style={{ width: 44, height: 44, borderRadius: 12, background: `${s.accent}18`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <s.icon size={22} style={{ color: s.accent }} />
                    </div>
                    <h2 style={{ fontFamily: "'Nunito',sans-serif", fontWeight: 800, fontSize: "clamp(22px,2.5vw,30px)", color: "var(--color-text-primary)" }}>{s.title}</h2>
                  </div>

                  <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 15, color: "var(--color-text-secondary)", lineHeight: 1.8, marginBottom: 24 }}>{s.desc}</p>

                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 32 }}>
                    {s.highlights.map(h => (
                      <div key={h} style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        <Check size={14} style={{ color: s.accent, flexShrink: 0 }} />
                        <span style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 13, color: "var(--color-text-secondary)" }}>{h}</span>
                      </div>
                    ))}
                  </div>

                  <Link
                    href={`/services/${s.slug}`}
                    style={{
                      alignSelf: "flex-start",
                      display: "inline-flex", alignItems: "center", gap: 8,
                      padding: "12px 24px", borderRadius: 10,
                      background: s.accent, color: "white", textDecoration: "none",
                      fontFamily: "'DM Sans',sans-serif", fontWeight: 700, fontSize: 14,
                      transition: "all 0.25s ease",
                    }}
                    onMouseEnter={e => { (e.currentTarget as HTMLElement).style.transform = "translateY(-2px)"; (e.currentTarget as HTMLElement).style.boxShadow = `0 8px 24px ${s.accent}50`; }}
                    onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform = "none"; (e.currentTarget as HTMLElement).style.boxShadow = "none"; }}
                  >
                    Learn More <ArrowRight size={15} />
                  </Link>
                </div>

                {/* Image side — even rows */}
                {i % 2 === 0 && (
                  <div style={{ position: "relative", minHeight: 280 }}>
                    <Image
                      src={s.img}
                      alt={s.title}
                      fill
                      style={{ objectFit: "cover" }}
                      sizes="(max-width: 900px) 100vw, 50vw"
                      onError={() => {}}
                    />
                    <div style={{ position: "absolute", inset: 0, background: `linear-gradient(225deg, ${s.accent}25, transparent)` }} />
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Comparison Strip ── */}
      <section style={{ padding: "80px 0", background: "var(--color-surface)", borderTop: "1px solid var(--color-border)" }}>
        <div className="container">
          <div style={{ textAlign: "center", marginBottom: 48 }}>
            <span className="eyebrow">Online vs In-Clinic</span>
            <h2 style={{ fontFamily: "'Nunito',sans-serif", fontWeight: 800, fontSize: "clamp(26px,3vw,36px)", color: "var(--color-text-primary)" }}>Which is right for us?</h2>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24, maxWidth: 800, margin: "0 auto" }}>
            {[
              { title: "Online Session", color: "#0A7E8C", items: ["Available across India & worldwide", "No travel required", "Zoom — HD video & audio", "Parent coaching included", "Home program every session", "₹599 / $9 per session"] },
              { title: "In-Clinic Visit", color: "#6B3FA0", items: ["Katni, Madhya Pradesh only", "Hands-on sensory equipment", "Full clinic environment", "Direct hands-on therapy", "Equipment & materials available", "₹799 per session"] },
            ].map(col => (
              <div key={col.title} style={{ borderRadius: 16, padding: "28px 32px", border: `1.5px solid ${col.color}30`, background: "var(--color-bg)" }}>
                <div style={{ fontFamily: "'Nunito',sans-serif", fontWeight: 800, fontSize: 20, color: col.color, marginBottom: 20 }}>{col.title}</div>
                {col.items.map(item => (
                  <div key={item} style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
                    <Check size={14} style={{ color: col.color, flexShrink: 0 }} />
                    <span style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 14, color: "var(--color-text-secondary)" }}>{item}</span>
                  </div>
                ))}
                <Link href="/book" style={{
                  display: "block", marginTop: 24, textAlign: "center", padding: "12px", borderRadius: 10,
                  background: col.color, color: "white", textDecoration: "none",
                  fontFamily: "'DM Sans',sans-serif", fontWeight: 700, fontSize: 14,
                }}>
                  Book Now
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section style={{ padding: "80px 0", background: "#0D1117" }}>
        <div className="container" style={{ textAlign: "center" }}>
          <h2 style={{ fontFamily: "'Nunito',sans-serif", fontWeight: 900, fontSize: "clamp(24px, 3vw, 36px)", color: "white", marginBottom: 16 }}>Not sure where to start?</h2>
          <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 17, color: "rgba(255,255,255,0.55)", marginBottom: 36 }}>Book an initial consultation — Dr. Prasoon will guide you to the right therapy plan for your child.</p>
          <Link href="/book" className="btn btn-primary" style={{ padding: "15px 40px", fontSize: 16 }}>
            Book Initial Consultation — {prices.online.display} <ArrowRight size={16} />
          </Link>
        </div>
      </section>
    </>
  );
}
