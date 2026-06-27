"use client";
import Link from "next/link";
import Image from "next/image";
import { useCurrency } from "@/context/CurrencyContext";
import { Check, Heart, Shield, TrendingUp, ArrowRight, Star } from "lucide-react";
import { motion } from "framer-motion";

const stats = [
  { n: "400+", label: "Children Helped" },
  { n: "100+", label: "Therapy Plans" },
  { n: "3+",   label: "Years Experience" },
  { n: "28",   label: "States Served" },
];

const values = [
  { icon: Heart,      title: "Child-First",       desc: "Every decision is guided by what is best for the child — their comfort, progress, and happiness." },
  { icon: Shield,     title: "Evidence-Based",     desc: "All therapy methods are grounded in peer-reviewed research and internationally recognised practice standards." },
  { icon: TrendingUp, title: "Accessible to All",  desc: "Quality therapy should not be limited by geography. Online sessions bring expert care to every family." },
];

const qualifications = [
  "Bachelor of Occupational Therapy (BOT)",
  "Master of Occupational Therapy (MOT)",
  "Specialisation: Pediatric OT, Sensory Integration, Neuro-developmental Therapy",
  "3+ years of clinical experience with 400+ children",
  "Trained in Ayres Sensory Integration (ASI) approach",
  "Experience with ASD, ADHD, CP, developmental delays",
  "Serving families across 28 states and internationally",
];

const fadeUp = { hidden: { opacity: 0, y: 24 }, show: { opacity: 1, y: 0 } };

export default function AboutPageClient({ version }: { version?: number }) {
  const { prices } = useCurrency();

  return (
    <>
      {/* ── Hero ── */}
      <section style={{
        position: "relative", paddingTop: 100, paddingBottom: 60,
        minHeight: 320, display: "flex", alignItems: "center", overflow: "hidden",
        background: "#0D1117",
      }}>
        <Image
          src={`/images/doctor/dr-prasoon-about.jpg${version ? `?v=${version}` : ""}`}
          alt="Dr. Prasoon Gupta clinic"
          fill
          priority
          style={{ objectFit: "cover", objectPosition: "center top", opacity: 0.35 }}
          sizes="100vw"
        />
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(135deg, rgba(10,20,30,0.95) 45%, rgba(10,126,140,0.3) 100%)" }} />
        <div className="container" style={{ position: "relative", zIndex: 1 }}>
          <motion.div variants={fadeUp} initial="hidden" animate="show" transition={{ duration: 0.6 }}>
            <span style={{ display: "block", fontFamily: "'DM Sans',sans-serif", fontWeight: 500, fontSize: 12, letterSpacing: "0.14em", textTransform: "uppercase", color: "var(--color-primary-mid)", marginBottom: 20 }}>About Us</span>
            <h1 style={{ fontFamily: "'Nunito',sans-serif", fontWeight: 900, fontSize: "clamp(28px, 4vw, 42px)", color: "white", marginBottom: 20, lineHeight: 1.08, maxWidth: 640 }}>
              About<br />
              <span style={{ background: "linear-gradient(90deg,#0D9BAC,#6B3FA0)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
                Udaan Care
              </span>
            </h1>
            <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 19, color: "rgba(255,255,255,0.65)", maxWidth: 540, lineHeight: 1.7 }}>
              Pediatric occupational therapy rooted in compassion, backed by evidence — serving families across India and worldwide.
            </p>
          </motion.div>
        </div>
      </section>

      {/* ── Stats Strip ── */}
      <section style={{ background: "var(--color-primary)", padding: "40px 0" }}>
        <div className="container">
          <div className="grid-responsive-4" style={{ gap: 0 }}>
            {stats.map((s, i) => (
              <div key={s.label} style={{
                textAlign: "center", padding: "16px 24px",
                borderLeft: i > 0 ? "1px solid rgba(255,255,255,0.2)" : "none",
              }}>
                <div style={{ fontFamily: "'Nunito',sans-serif", fontWeight: 900, fontSize: 40, color: "white", lineHeight: 1 }}>{s.n}</div>
                <div style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 13, color: "rgba(255,255,255,0.75)", marginTop: 6 }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Our Story ── */}
      <section className="section" style={{ background: "var(--color-bg)" }}>
        <div className="container">
          <div className="grid-responsive-2" style={{ gap: 80, alignItems: "center" }}>
            <motion.div variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true }} transition={{ duration: 0.6 }}>
              <span className="eyebrow">Our Story</span>
              <h2 style={{ fontFamily: "'Nunito',sans-serif", fontWeight: 800, fontSize: "clamp(24px, 3vw, 36px)", color: "var(--color-text-primary)", marginBottom: 24, lineHeight: 1.2 }}>
                Why Udaan Care Exists
              </h2>
              <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 15, color: "var(--color-text-secondary)", lineHeight: 1.85, marginBottom: 16 }}>
                Udaan Care was founded by Dr. Prasoon Gupta with a single mission: to make world-class pediatric occupational therapy accessible to every family in India and beyond. Growing up and training in Madhya Pradesh, Dr. Prasoon witnessed firsthand how families in smaller cities struggled to access specialist therapy for their children.
              </p>
              <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 15, color: "var(--color-text-secondary)", lineHeight: 1.85 }}>
                The name &ldquo;Udaan&rdquo; — meaning &ldquo;flight&rdquo; in Hindi — reflects our core belief: every child has the potential to soar. With the right support and tools, no child&apos;s development is beyond reach. &ldquo;Small Steps. Strong Wings.&rdquo; is not just our tagline — it is our promise.
              </p>
            </motion.div>
            <div style={{ borderRadius: 20, overflow: "hidden", position: "relative", width: "100%", aspectRatio: "4/3" }}>
              <Image
                src="/images/doctor/dr-prasoon-hero.jpg"
                alt="Udaan Care clinic"
                fill
                style={{ objectFit: "cover" }}
                sizes="(max-width: 900px) 100vw, 50vw"
              />
              {/* Teal accent */}
              <div style={{ position: "absolute", left: 0, top: "10%", height: "80%", width: 4, background: "linear-gradient(to bottom, transparent, var(--color-primary) 30%, var(--color-purple) 70%, transparent)", borderRadius: 2 }} />
            </div>
          </div>
        </div>
      </section>

      {/* ── Dr. Prasoon ── */}
      <section className="section" style={{ background: "var(--color-surface)" }}>
        <div className="container">
          <div className="grid-responsive-2" style={{ gap: 80, alignItems: "start" }}>
            {/* Photo */}
            <div style={{ position: "relative", width: "100%", aspectRatio: "3/4" }}>
              <div style={{ position: "absolute", left: 0, top: 24, bottom: 24, width: 4, borderRadius: 2, background: "var(--color-primary)", zIndex: 2 }} />
              <div style={{ borderRadius: 20, overflow: "hidden", marginLeft: 20, height: "100%", position: "relative" }}>
                <Image
                  src={`/images/doctor/dr-prasoon-about.jpg${version ? `?v=${version}` : ""}`}
                  alt="Dr. Prasoon Gupta"
                  fill
                  style={{ objectFit: "cover", objectPosition: "center top" }}
                  sizes="(max-width: 900px) 100vw, 480px"
                />
              </div>
              {/* Floating card */}
              <div style={{
                position: "absolute", bottom: 32, left: -16, zIndex: 3,
                background: "var(--color-card)", border: "1px solid var(--color-border)",
                borderRadius: 16, padding: "16px 20px",
                boxShadow: "0 8px 32px rgba(0,0,0,0.12)",
                minWidth: 200,
              }}>
                <div style={{ display: "flex", gap: 3, marginBottom: 6 }}>
                  {Array(5).fill(0).map((_, i) => <Star key={i} size={13} style={{ color: "#F59E0B", fill: "#F59E0B" }} />)}
                </div>
                <div style={{ fontFamily: "'Nunito',sans-serif", fontWeight: 700, fontSize: 14, color: "var(--color-text-primary)" }}>Dr. Prasoon Gupta</div>
                <div style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 12, color: "var(--color-primary)" }}>BOT · MOT · Pediatric OT</div>
              </div>
            </div>

            {/* Copy */}
            <motion.div variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true }} transition={{ duration: 0.6 }}>
              <span className="eyebrow">Meet the Therapist</span>
              <h2 style={{ fontFamily: "'Nunito',sans-serif", fontWeight: 900, fontSize: "clamp(24px, 3vw, 36px)", color: "var(--color-text-primary)", marginBottom: 8, lineHeight: 1.15 }}>
                Dr. Prasoon Gupta
              </h2>
              <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 14, color: "var(--color-text-secondary)", marginBottom: 24 }}>
                Bachelor &amp; Master of Occupational Therapy (BOT, MOT)
              </p>
              <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 15, color: "var(--color-text-secondary)", lineHeight: 1.85, marginBottom: 16 }}>
                Dr. Prasoon brings over 3 years of hands-on clinical experience to every session. He has supported more than 400 children across India with autism spectrum disorder, ADHD, sensory processing difficulties, cerebral palsy, developmental delays, fine and gross motor challenges, and handwriting difficulties.
              </p>
              <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 15, color: "var(--color-text-secondary)", lineHeight: 1.85, marginBottom: 28 }}>
                His approach is warm, structured, and deeply evidence-based — drawing on Ayres Sensory Integration, Neuro-Developmental Treatment (NDT), DIR/Floortime, and cognitive-based OT frameworks.
              </p>
              <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 32 }}>
                {qualifications.map((q) => (
                  <div key={q} style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
                    <div style={{ width: 20, height: 20, borderRadius: "50%", background: "var(--color-primary)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, marginTop: 2 }}>
                      <Check size={11} style={{ color: "white" }} />
                    </div>
                    <span style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 14, color: "var(--color-text-primary)", lineHeight: 1.55 }}>{q}</span>
                  </div>
                ))}
              </div>
              <Link href="/book" className="btn btn-primary" style={{ padding: "13px 28px" }}>
                Book a Consultation — {prices.online.display} <ArrowRight size={15} />
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── Values ── */}
      <section className="section" style={{ background: "var(--color-bg)" }}>
        <div className="container">
          <div style={{ textAlign: "center", marginBottom: 56 }}>
            <span className="eyebrow">What We Stand For</span>
            <h2 style={{ fontFamily: "'Nunito',sans-serif", fontWeight: 800, fontSize: "clamp(24px, 3vw, 36px)", color: "var(--color-text-primary)" }}>Our Core Values</h2>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 24 }}>
            {values.map((v, i) => (
              <motion.div key={v.title} variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true }} transition={{ duration: 0.5, delay: i * 0.12 }}
                className="card" style={{ padding: 32 }}>
                <div style={{ width: 52, height: 52, borderRadius: 14, background: "var(--color-primary-light)", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 20 }}>
                  <v.icon size={24} style={{ color: "var(--color-primary)" }} />
                </div>
                <h3 style={{ fontFamily: "'Nunito',sans-serif", fontWeight: 700, fontSize: 20, color: "var(--color-text-primary)", marginBottom: 10 }}>{v.title}</h3>
                <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 14, color: "var(--color-text-secondary)", lineHeight: 1.75 }}>{v.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section style={{ padding: "96px 0", background: "#0D1117" }}>
        <div className="container" style={{ textAlign: "center" }}>
          <h2 style={{ fontFamily: "'Nunito',sans-serif", fontWeight: 900, fontSize: "clamp(24px, 3vw, 36px)", color: "white", marginBottom: 16 }}>
            Start your child&apos;s journey today
          </h2>
          <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 17, color: "rgba(255,255,255,0.55)", marginBottom: 36 }}>
            Book an initial consultation with Dr. Prasoon Gupta.
          </p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 12, justifyContent: "center" }}>
            <Link href="/book" className="btn btn-primary" style={{ padding: "14px 36px", fontSize: 15 }}>
              Book Consultation — {prices.online.display}
            </Link>
            <Link href="/contact" className="btn btn-white-outline" style={{ padding: "14px 28px", fontSize: 15 }}>
              Contact Us
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
