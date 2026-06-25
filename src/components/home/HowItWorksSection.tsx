"use client";
import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { LayoutGrid, Calendar, Video, ArrowRight } from "lucide-react";

const steps = [
  {
    n: "01", title: "Choose Consultation Type",
    desc: "Select online via Zoom or in-clinic in Katni, MP. International patients are fully served online.",
    icon: LayoutGrid, color: "#0A7E8C", bg: "#E6F4F6",
  },
  {
    n: "02", title: "Pick a Date and Time",
    desc: "Browse available slots Monday to Saturday, 10 AM – 7 PM IST. Easy online calendar, instant confirmation.",
    icon: Calendar, color: "#6B3FA0", bg: "#f3eefb",
  },
  {
    n: "03", title: "Attend Your Session",
    desc: "Pay securely, receive your WhatsApp confirmation, and join Dr. Prasoon for a full developmental assessment.",
    icon: Video, color: "#F5820D", bg: "#FEF0E3",
  },
];

export default function HowItWorksSection() {
  const lineRef = useRef<SVGLineElement>(null);
  const sectionRef = useRef<HTMLDivElement>(null);
  const [lineDrawn, setLineDrawn] = useState(false);

  useEffect(() => {
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const el = sectionRef.current;
    if (!el) return;

    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setLineDrawn(true);
          obs.disconnect();
        }
      },
      { threshold: 0.35 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  useEffect(() => {
    const line = lineRef.current;
    if (!line || !lineDrawn) return;
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReduced) { line.style.strokeDashoffset = "0"; return; }
    const len = line.getTotalLength?.() ?? 800;
    line.style.strokeDasharray = `${len}`;
    line.style.strokeDashoffset = `${len}`;
    line.style.transition = "stroke-dashoffset 1.2s cubic-bezier(0.4,0,0.2,1) 0.3s";
    requestAnimationFrame(() => { line.style.strokeDashoffset = "0"; });
  }, [lineDrawn]);

  return (
    <section ref={sectionRef} style={{ padding: "64px 0", background: "var(--color-bg)" }}>
      <div className="container">
        {/* Header */}
        <div style={{ maxWidth: 520, marginBottom: 72 }}>
          <motion.span
            className="eyebrow"
            initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }} transition={{ duration: 0.4 }}
          >
            How It Works
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }} transition={{ duration: 0.4, delay: 0.1 }}
            style={{ fontFamily: "'Nunito',sans-serif", fontWeight: 800, fontSize: "clamp(24px, 3vw, 36px)", color: "var(--color-text-primary)" }}
          >
            From First Visit to<br />First Session
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }} transition={{ duration: 0.4, delay: 0.2 }}
            style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 16, color: "var(--color-text-secondary)", marginTop: 12 }}
          >
            Simple, secure, and stress-free — in three steps.
          </motion.p>
        </div>

        {/* Animated connector SVG */}
        <div className="hide-mobile" style={{ position: "relative", height: 4, marginBottom: -32, zIndex: 0 }}>
          <svg width="100%" height="4" style={{ position: "absolute", top: 0, left: 0 }}>
            {/* Gray dashed base */}
            <line x1="16.5%" y1="2" x2="83.5%" y2="2"
              stroke="var(--color-border)" strokeWidth="2" strokeDasharray="8 4" />
            {/* Teal animated line */}
            <line ref={lineRef} x1="16.5%" y1="2" x2="83.5%" y2="2"
              stroke="#0A7E8C" strokeWidth="2" strokeDasharray="8 4"
              style={{ strokeDashoffset: 9999 }} />
          </svg>
        </div>

        {/* Steps */}
        <div className="grid-cols-3" style={{ gap: 40, position: "relative", zIndex: 1 }}>
          {steps.map((s, i) => (
            <motion.div
              key={s.n}
              initial={{ opacity: 0, scale: 0.85 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.2, type: "spring", stiffness: 120 }}
            >
              {/* Circle */}
              <div style={{
                width: 64, height: 64, borderRadius: "50%",
                border: `2px solid ${s.color}`,
                background: s.bg,
                display: "flex", alignItems: "center", justifyContent: "center",
                marginBottom: 24,
              }}>
                <span style={{ fontFamily: "'Nunito',sans-serif", fontWeight: 900, fontSize: 24, color: s.color }}>
                  {s.n}
                </span>
              </div>

              {/* Icon */}
              <div style={{
                width: 36, height: 36, borderRadius: 8,
                background: `${s.color}16`,
                display: "inline-flex", alignItems: "center", justifyContent: "center",
                marginBottom: 16,
              }}>
                <s.icon size={18} style={{ color: s.color }} />
              </div>

              <h3 style={{ fontFamily: "'Nunito',sans-serif", fontWeight: 700, fontSize: 20, color: "var(--color-text-primary)", marginBottom: 10 }}>
                {s.title}
              </h3>
              <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 15, color: "var(--color-text-secondary)", lineHeight: 1.7 }}>
                {s.desc}
              </p>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }} transition={{ duration: 0.5, delay: 0.6 }}
          style={{ marginTop: 56, display: "flex", justifyContent: "center" }}
        >
          <Link href="/book" className="btn btn-primary" style={{ padding: "15px 40px", fontSize: 15 }}>
            Book My Consultation <ArrowRight size={16} />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
