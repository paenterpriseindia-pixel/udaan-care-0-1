"use client";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, Phone } from "lucide-react";
import { useCurrency } from "@/context/CurrencyContext";
import ImagePlaceholder from "@/components/shared/ImagePlaceholder";

export default function FinalCTASection() {
  const { prices } = useCurrency();
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReduced) return;
    const onScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <section style={{
      position: "relative",
      padding: "64px 0",
      overflow: "hidden",
      background: "#0D1117",
    }}>
      {/* Parallax background */}
      <div style={{
        position: "absolute", inset: 0, zIndex: 0,
        transform: `translateY(${scrollY * 0.3}px)`,
        willChange: "transform",
        transition: "transform 0ms linear",
      }}>
        <ImagePlaceholder
          label="global/cta-background.jpg"
          style={{ position: "absolute", inset: 0, borderRadius: 0, height: "130%", top: "-15%" }}
        />
      </div>

      {/* Overlay */}
      <div style={{
        position: "absolute", inset: 0, zIndex: 1,
        background: "rgba(10,20,30,0.88)",
      }} />

      {/* Decorative orbs */}
      <div style={{ position: "absolute", top: -120, right: -80, width: 480, height: 480, borderRadius: "50%", background: "radial-gradient(circle, rgba(107,63,160,0.18), transparent 70%)", zIndex: 1, pointerEvents: "none" }} />
      <div style={{ position: "absolute", bottom: -80, left: -60, width: 360, height: 360, borderRadius: "50%", background: "radial-gradient(circle, rgba(10,126,140,0.15), transparent 70%)", zIndex: 1, pointerEvents: "none" }} />

      {/* Content */}
      <div className="container" style={{ position: "relative", zIndex: 2, textAlign: "center" }}>
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          {/* Eyebrow badge */}
          <div style={{
            display: "inline-flex", alignItems: "center", gap: 8,
            padding: "6px 16px 6px 8px", borderRadius: 999,
            background: "rgba(10,126,140,0.15)",
            border: "1px solid rgba(10,126,140,0.3)",
            marginBottom: 28,
          }}>
            <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#22c55e", boxShadow: "0 0 0 3px rgba(34,197,94,0.25)", display: "inline-block" }} />
            <span style={{ fontFamily: "'DM Sans',sans-serif", fontWeight: 500, fontSize: 13, color: "rgba(255,255,255,0.6)" }}>
              Appointments Mon–Sat · 10 AM – 7 PM IST
            </span>
          </div>

          {/* Headline */}
          <h2 style={{
            fontFamily: "'Nunito',sans-serif", fontWeight: 900,
            fontSize: "clamp(32px,5.5vw,58px)",
            color: "white", lineHeight: 1.08, marginBottom: 18,
          }}>
            Ready to Take the<br />
            <span style={{
              background: "linear-gradient(90deg, #0D9BAC 0%, #6B3FA0 55%, #F5820D 100%)",
              WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}>
              First Step?
            </span>
          </h2>

          {/* Subline */}
          <p style={{
            fontFamily: "'DM Sans',sans-serif", fontSize: 19,
            color: "rgba(255,255,255,0.55)", marginBottom: 48,
            maxWidth: 480, marginLeft: "auto", marginRight: "auto",
            lineHeight: 1.65,
          }}>
            Book a consultation with Dr. Prasoon Gupta today. Reply guaranteed within 2 hours.
          </p>

          {/* CTAs */}
          <div style={{ display: "flex", flexWrap: "wrap", gap: 12, justifyContent: "center", marginBottom: 36 }}>
            <Link
              href="/book"
              style={{
                display: "inline-flex", alignItems: "center", gap: 8,
                padding: "16px 36px", borderRadius: 10,
                background: "linear-gradient(135deg, #0A7E8C, #0D9BAC)",
                color: "white", textDecoration: "none",
                fontFamily: "'DM Sans',sans-serif", fontWeight: 700, fontSize: 16,
                boxShadow: "0 4px 24px rgba(10,126,140,0.45)",
                transition: "all 0.3s ease", willChange: "transform",
              }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.transform = "translateY(-2px)"; (e.currentTarget as HTMLElement).style.boxShadow = "0 8px 32px rgba(10,126,140,0.6)"; }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform = "none"; (e.currentTarget as HTMLElement).style.boxShadow = "0 4px 24px rgba(10,126,140,0.45)"; }}
            >
              Book Consultation — {prices.online.display}
              <ArrowRight size={16} />
            </Link>

            <a
              href="https://wa.me/918349764084"
              target="_blank" rel="noopener noreferrer"
              style={{
                display: "inline-flex", alignItems: "center", gap: 8,
                padding: "16px 28px", borderRadius: 10, fontSize: 15, fontWeight: 600,
                background: "#25D366", color: "white", textDecoration: "none",
                boxShadow: "0 4px 20px rgba(37,211,102,0.3)",
                fontFamily: "'DM Sans',sans-serif",
                transition: "all 0.3s ease", willChange: "transform",
              }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.transform = "translateY(-2px)"; (e.currentTarget as HTMLElement).style.boxShadow = "0 8px 28px rgba(37,211,102,0.5)"; }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform = "none"; (e.currentTarget as HTMLElement).style.boxShadow = "0 4px 20px rgba(37,211,102,0.3)"; }}
            >
              <Phone size={16} /> WhatsApp Us
            </a>

            <Link
              href="/contact"
              style={{
                display: "inline-flex", alignItems: "center", gap: 8,
                padding: "16px 28px", borderRadius: 10, fontSize: 15, fontWeight: 600,
                background: "transparent",
                border: "1.5px solid rgba(255,255,255,0.25)",
                color: "white", textDecoration: "none",
                fontFamily: "'DM Sans',sans-serif",
                transition: "all 0.3s ease",
              }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.08)"; (e.currentTarget as HTMLElement).style.borderColor = "rgba(255,255,255,0.5)"; }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = "transparent"; (e.currentTarget as HTMLElement).style.borderColor = "rgba(255,255,255,0.25)"; }}
            >
              Contact Us
            </Link>
          </div>

          {/* Trust items */}
          <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: 0 }}>
            {["No waiting lists", "Mon–Sat appointments", "Reply within 2 hours"].map((t, i) => (
              <span key={t} style={{
                fontFamily: "'DM Sans',sans-serif", fontSize: 13,
                color: "rgba(255,255,255,0.3)",
                paddingRight: i < 2 ? 18 : 0, marginRight: i < 2 ? 18 : 0,
                borderRight: i < 2 ? "1px solid rgba(255,255,255,0.1)" : "none",
              }}>
                {t}
              </span>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
