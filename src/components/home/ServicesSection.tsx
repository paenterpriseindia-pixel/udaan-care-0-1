"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { Activity, Heart, Brain, Video, ArrowRight } from "lucide-react";
import ImagePlaceholder from "@/components/shared/ImagePlaceholder";

const services = [
  {
    icon: Activity, title: "Occupational Therapy",
    desc: "Goal-oriented therapy helping children gain independence in daily activities through evidence-based practice.",
    href: "/services/occupational-therapy", accent: "#0A7E8C", tag: "Most Popular",
    img: "services/occupational-therapy.jpg",
  },
  {
    icon: Heart, title: "Pediatric Therapy",
    desc: "Comprehensive developmental support from infancy through adolescence using play-based methods.",
    href: "/services/pediatric-therapy", accent: "#6B3FA0", tag: "Ages 0–18",
    img: "services/pediatric-therapy.jpg",
  },
  {
    icon: Brain, title: "Sensory Integration",
    desc: "Specialised therapy for children who are over- or under-sensitive to touch, sound, movement and light.",
    href: "/services/sensory-integration", accent: "#F5820D", tag: "ASD · ADHD",
    img: "services/sensory-integration.jpg",
  },
  {
    icon: Video, title: "Online Therapy",
    desc: "Expert sessions via Zoom — same quality as in-clinic, available anywhere in India and worldwide.",
    href: "/services/online-therapy", accent: "#2E8B57", tag: "Worldwide",
    img: "services/online-therapy.jpg",
  },
];

function ServiceCard({ s, index }: { s: typeof services[0]; index: number }) {
  const [hovered, setHovered] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1, ease: "easeOut" }}
    >
      <Link href={s.href} style={{ textDecoration: "none", display: "block" }}>
        <div
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
          style={{
            borderRadius: 16,
            background: "var(--color-card)",
            border: "1px solid var(--color-border)",
            overflow: "hidden",
            cursor: "pointer",
            transform: hovered ? "translateY(-8px) scale(1.015)" : "translateY(0) scale(1)",
            boxShadow: hovered
              ? `0 24px 56px ${s.accent}28, 0 6px 20px rgba(0,0,0,0.10)`
              : "0 1px 3px rgba(0,0,0,0.06), 0 4px 16px rgba(0,0,0,0.05)",
            transition: "all 0.32s cubic-bezier(0.34, 1.56, 0.64, 1)",
            willChange: "transform",
            position: "relative",
          }}
        >

          {/* Left accent bar */}
          <div style={{
            position: "absolute", left: 0, top: 0,
            width: 3,
            height: hovered ? "100%" : "40%",
            background: s.accent,
            transition: "height 300ms cubic-bezier(0.4,0,0.2,1)",
            borderRadius: "0 0 0 16px",
            zIndex: 1,
          }} />

          {/* Image */}
          <div style={{ height: 160, overflow: "hidden", position: "relative" }}>

            <ImagePlaceholder label={s.img} style={{ height: "100%", borderRadius: 0 }} />
            {/* Tag badge */}
            <span style={{
              position: "absolute", top: 14, right: 14,
              padding: "4px 11px", borderRadius: 6,
              background: s.accent, color: "white",
              fontFamily: "'DM Sans',sans-serif", fontSize: 11,
              fontWeight: 700, letterSpacing: "0.04em",
            }}>
              {s.tag}
            </span>
          </div>

          {/* Body */}
          <div style={{ padding: "24px 24px 22px 28px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
              <div style={{
                width: 38, height: 38, borderRadius: 10,
                background: `${s.accent}16`,
                display: "flex", alignItems: "center", justifyContent: "center",
                flexShrink: 0,
              }}>
                <s.icon size={19} style={{ color: s.accent }} />
              </div>
              <h3 style={{
                fontFamily: "'Nunito',sans-serif", fontWeight: 700, fontSize: 18,
                color: "var(--color-text-primary)", lineHeight: 1.2,
              }}>
                {s.title}
              </h3>
            </div>
            <p style={{
              fontFamily: "'DM Sans',sans-serif", fontSize: 14,
              color: "var(--color-text-secondary)", lineHeight: 1.7,
              marginBottom: 18,
            }}>
              {s.desc}
            </p>
            <div style={{
              display: "inline-flex", alignItems: "center", gap: 4,
              fontFamily: "'DM Sans',sans-serif", fontWeight: 600,
              fontSize: 13, color: s.accent,
            }}>
              Learn more
              <ArrowRight
                size={13}
                style={{
                  transform: hovered ? "translateX(4px)" : "translateX(0)",
                  transition: "transform 250ms ease",
                }}
              />
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}

export default function ServicesSection() {
  return (
    <section
      id="services"
      style={{
        padding: "120px 0",
        background: "var(--color-bg)",
      }}
    >
      <div className="container">
        {/* Header */}
        <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", marginBottom: 56, flexWrap: "wrap", gap: 16 }}>
          <div>
            <motion.span
              className="eyebrow"
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4 }}
            >
              Our Therapy Services
            </motion.span>
            <motion.h2
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: 0.1 }}
              style={{
                fontFamily: "'Nunito',sans-serif", fontWeight: 800,
                fontSize: "clamp(28px,4vw,42px)",
                color: "var(--color-text-primary)", maxWidth: 480,
              }}
            >
              Evidence-Based Care for Every Child

            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: 0.2 }}
              style={{
                fontFamily: "'DM Sans',sans-serif", fontSize: 16,
                color: "var(--color-text-secondary)", marginTop: 12,
              }}
            >
              Online and in-clinic therapy tailored to each child's unique needs.
            </motion.p>
          </div>
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: 0.3 }}
          >
            <Link
              href="/about"
              style={{
                display: "inline-flex", alignItems: "center", gap: 6,
                fontFamily: "'DM Sans',sans-serif", fontSize: 14, fontWeight: 600,
                color: "var(--color-primary)", textDecoration: "none",
                position: "relative",
              }}
              className="link-animated"
            >
              View all services <ArrowRight size={14} />
            </Link>
          </motion.div>
        </div>

        {/* 4-column horizontal row */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 20 }}>
          {services.map((s, i) => <ServiceCard key={s.href} s={s} index={i} />)}
        </div>

      </div>
    </section>
  );
}
