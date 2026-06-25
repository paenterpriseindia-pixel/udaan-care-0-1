"use client";
import dynamic from "next/dynamic";
import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, Check } from "lucide-react";
import { useCurrency } from "@/context/CurrencyContext";
import ClickableImage from "@/components/shared/ClickableImage";

const AutoScrollGallery = dynamic(() => import("./AutoScrollGallery"), { ssr: false });

const quals = [
  "Bachelor of Occupational Therapy (BOT)",
  "Master of Occupational Therapy (MOT)",
  "Specialist: Pediatric OT, Sensory Integration, NDT",
  "3+ years · 400+ children across India",
  "Serving patients in 28 states and internationally",
];

export default function DoctorSection() {
  const { prices } = useCurrency();

  return (
    <>
      {/* ── PART A: Doctor intro split ── */}
      <section style={{ padding: "64px 0", background: "var(--color-surface)" }}>
        <div className="container">
          <div className="grid-cols-2" style={{ gap: 80, alignItems: "center" }}>

            {/* Photo side */}
            <motion.div
              initial={{ opacity: 0, x: -60 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, ease: "easeOut" }}
              style={{ position: "relative" }}
            >
              {/* Purple gradient bg glow */}
              <div style={{
                position: "absolute", inset: -24,
                background: "radial-gradient(ellipse at 30% 30%, rgba(107,63,160,0.1) 0%, transparent 60%)",
                borderRadius: 24, zIndex: 0,
              }} />
              {/* Teal/purple bar */}
              <div style={{
                position: "absolute", left: 0, top: "10%", height: "80%", width: 4,
                background: "linear-gradient(to bottom, #0A7E8C, #6B3FA0)",
                borderRadius: 2, zIndex: 1,
              }} />
              <div style={{
                borderRadius: 20, overflow: "hidden",
                marginLeft: 20, position: "relative", zIndex: 1,
                boxShadow: "0 24px 64px rgba(0,0,0,0.15)",
                height: 520,
              }}>
                <ClickableImage
                  src="/images/doctor/dr-prasoon-about.jpg"
                  alt="Dr. Prasoon Gupta"
                  fill
                  objectFit="cover"
                  objectPosition="top center"
                  sizes="(max-width: 900px) 100vw, 480px"
                  quality={100}
                  dest="images/doctor/dr-prasoon-about.jpg"
                />
              </div>
              {/* Floating credential */}
              <div style={{
                position: "absolute", bottom: 32, right: -20, zIndex: 2,
                background: "var(--color-card)", borderRadius: 14,
                border: "1px solid var(--color-border)",
                padding: "16px 22px",
                boxShadow: "0 8px 32px rgba(0,0,0,0.10)",
              }}>
                <div style={{ fontFamily: "'DM Sans',sans-serif", fontWeight: 700, fontSize: 13, color: "var(--color-text-primary)", marginBottom: 8 }}>
                  Qualifications
                </div>
                {["BOT", "MOT", "SI Specialist"].map(q => (
                  <div key={q} style={{ display: "flex", alignItems: "center", gap: 7, marginBottom: 5 }}>
                    <Check size={11} style={{ color: "#0A7E8C", flexShrink: 0 }} />
                    <span style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 12, color: "var(--color-text-secondary)" }}>{q}</span>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Copy side */}
            <div>
              {[
                <motion.span key="ey" className="eyebrow" initial={{ opacity: 0, y: 14 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.4 }}>Meet Your Therapist</motion.span>,
                <motion.h2 key="h2" initial={{ opacity: 0, y: 14 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.4, delay: 0.08 }} style={{ fontFamily: "'Nunito',sans-serif", fontWeight: 900, fontSize: "clamp(28px,4vw,46px)", color: "var(--color-text-primary)", lineHeight: 1.1, marginTop: 4 }}>Dr. Prasoon Gupta</motion.h2>,
                <motion.p key="title" initial={{ opacity: 0, y: 14 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.4, delay: 0.16 }} style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 14, fontWeight: 600, color: "#0A7E8C", marginBottom: 20 }}>Bachelor &amp; Master of Occupational Therapy</motion.p>,
              ]}

              {/* Specialty pills */}
              <motion.div
                initial={{ opacity: 0, y: 14 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: 0.24 }}
                style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 24 }}
              >
                {["Pediatric OT", "Sensory Integration", "Neuro-developmental", "ASD · ADHD"].map(tag => (
                  <span key={tag} style={{
                    fontFamily: "'DM Sans',sans-serif", fontSize: 12, fontWeight: 600,
                    padding: "5px 12px", borderRadius: 6,
                    border: "1.5px solid #0A7E8C",
                    color: "#0A7E8C", background: "#E6F4F6",
                  }}>
                    {tag}
                  </span>
                ))}
              </motion.div>

              <motion.p
                initial={{ opacity: 0, y: 14 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: 0.32 }}
                style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 15, color: "var(--color-text-secondary)", lineHeight: 1.8, marginBottom: 24 }}
              >
                With over 3 years of clinical experience and 400+ children helped, Dr. Prasoon combines evidence-based occupational therapy with a warm, child-centred approach. His practice is rooted in the belief that every child has the capacity to grow and thrive.
              </motion.p>

              {/* Qualifications */}
              <motion.div
                initial={{ opacity: 0, y: 14 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: 0.40 }}
                style={{ display: "flex", flexDirection: "column", gap: 9, marginBottom: 32 }}
              >
                {quals.map(q => (
                  <div key={q} style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
                    <div style={{
                      width: 20, height: 20, borderRadius: "50%",
                      background: "#0A7E8C", display: "flex",
                      alignItems: "center", justifyContent: "center",
                      flexShrink: 0, marginTop: 1,
                    }}>
                      <Check size={11} style={{ color: "white" }} />
                    </div>
                    <span style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 14, color: "var(--color-text-primary)", lineHeight: 1.55 }}>
                      {q}
                    </span>
                  </div>
                ))}
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 14 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: 0.48 }}
                style={{ display: "flex", flexWrap: "wrap", gap: 12 }}
              >
                <Link href="/book" className="btn btn-primary" style={{ padding: "14px 28px", fontSize: 15 }}>
                  Book Consultation — {prices.online.display} <ArrowRight size={16} />
                </Link>
                <Link href="/about" className="btn btn-outline" style={{ padding: "14px 22px", fontSize: 15 }}>
                  Learn More
                </Link>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* ── PART B: Auto-scroll clinic gallery ── */}
      <AutoScrollGallery />
    </>
  );
}
