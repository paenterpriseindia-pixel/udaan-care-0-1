"use client";
import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, Building2, Globe, Award, Heart, ChevronDown, Star } from "lucide-react";
import { useCurrency } from "@/context/CurrencyContext";
import Image from "next/image";

/* ── Animated underline for "Wings" ── */
function WingsUnderline() {
  const pathRef = useRef<SVGLineElement>(null);
  const [show, setShow] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setShow(true), 900);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    const el = pathRef.current;
    if (!el || !show) return;
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReduced) { el.style.strokeDashoffset = "0"; return; }
    const len = 200;
    el.style.strokeDasharray = `${len}`;
    el.style.strokeDashoffset = `${len}`;
    el.style.transition = "stroke-dashoffset 800ms cubic-bezier(0.4,0,0.2,1)";
    requestAnimationFrame(() => { el.style.strokeDashoffset = "0"; });
  }, [show]);

  return (
    <svg
      style={{ position: "absolute", bottom: -6, left: 0, width: "100%", height: 8, overflow: "visible", pointerEvents: "none" }}
      preserveAspectRatio="none"
      viewBox="0 0 200 6"
    >
      <line ref={pathRef} x1="0" y1="3" x2="200" y2="3" stroke="#0A7E8C" strokeWidth="3.5" strokeLinecap="round" />
    </svg>
  );
}

const ChildFigure = () => (
  <svg width="24" height="36" viewBox="0 0 48 72" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" style={{ animation: "heroBounce 1.5s ease-in-out infinite", marginTop: 4 }}>
    <circle cx="24" cy="10" r="8" />
    <line x1="24" y1="18" x2="24" y2="44" />
    <line x1="24" y1="26" x2="12" y2="36" />
    <line x1="24" y1="26" x2="36" y2="36" />
    <line x1="24" y1="44" x2="16" y2="62" />
    <line x1="24" y1="44" x2="32" y2="62" />
  </svg>
);

export default function HeroSection() {
  const { isIndia, prices } = useCurrency();
  const [scrollY, setScrollY] = useState(0);
  const [showScroll, setShowScroll] = useState(true);

  useEffect(() => {
    if (typeof window !== "undefined") {
      window.history.scrollRestoration = "manual";
      window.scrollTo(0, 0);
    }
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReduced) return;
    const onScroll = () => {
      setScrollY(window.scrollY);
      setShowScroll(window.scrollY < 80);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <section
      style={{
        position: "relative",
        minHeight: "100svh",
        display: "flex",
        alignItems: "center",
        overflowX: "hidden",

        background: "#0D1117",
      }}
    >
      {/* ── Static hero background (fixed tearing bug) ── */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          zIndex: 0,
        }}
      >
        <Image
          src="/images/global/hero-background.jpg"
          alt="Hero background"
          fill
          priority
          unoptimized
          style={{ objectFit: "cover", objectPosition: "center top" }}
          sizes="100vw"
          quality={100}
        />
      </div>

      {/* ── Gradient overlay ── */}
      <div style={{
        position: "absolute", inset: 0, zIndex: 1,
        background: "linear-gradient(135deg, rgba(10,20,30,0.93) 0%, rgba(10,126,140,0.3) 55%, rgba(107,63,160,0.22) 100%)",
      }} />
      {/* Bottom fade */}
      <div style={{
        position: "absolute", bottom: 0, left: 0, right: 0, height: 200, zIndex: 1,
        background: "linear-gradient(to bottom, transparent, #0D1117 95%)",
      }} />

      {/* ── Purple glow orb ── */}
      <div style={{
        position: "absolute", right: -80, top: 0,
        width: 520, height: 520, borderRadius: "50%",
        background: "radial-gradient(circle, rgba(107,63,160,0.22), transparent 70%)",
        pointerEvents: "none", zIndex: 1,
        animation: "heroOrbRotate 20s linear infinite",
      }} />


      {/* ── Main content grid ── */}
      <div
        className="container grid-sidebar-right"
        style={{
          position: "relative", zIndex: 2,
          paddingTop: 108, paddingBottom: 40,
          gap: 64, alignItems: "center",
        }}
      >
        {/* ── LEFT: copy ── */}
        <div className="hero-left-content">
          {/* Announcement Ribbon */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            style={{
              display: "inline-flex", alignItems: "center", gap: 10,
              background: "rgba(26,175,230,0.12)", border: "1px solid rgba(26,175,230,0.25)",
              padding: "6px 16px", borderRadius: 100, marginBottom: 24,
              backdropFilter: "blur(8px)",
              maxWidth: "100%", flexWrap: "wrap"
            }}
          >
            <span style={{ 
              background: "#0A7E8C", color: "white", 
              fontSize: 10, fontWeight: 800, padding: "3px 10px", borderRadius: 100,
              letterSpacing: "0.05em", textTransform: "uppercase" 
            }}>New</span>
            <span style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 13, color: "rgba(255,255,255,0.95)", fontWeight: 500 }}>
              Now offering online Tele-Therapy globally.
            </span>
          </motion.div>

          {/* H1 */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.15 }}
            style={{
              fontFamily: "'Nunito',sans-serif", fontWeight: 900,
              fontSize: "clamp(28px, 6vw, 54px)",
              lineHeight: 1.1, color: "white",
              marginBottom: 16,
            }}
          >
            Every Child Has{" "}
            <span style={{ position: "relative", display: "inline-block" }}>
              Wings.
              <WingsUnderline />
            </span>
          </motion.h1>

          {/* Sub */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            style={{
              fontFamily: "'DM Sans',sans-serif", fontSize: 16,
              color: "rgba(255,255,255,0.7)", lineHeight: 1.6,
              marginBottom: 28, maxWidth: 520,
            }}
          >
            We help children with autism, ADHD, sensory challenges, and developmental delays reach their full potential — in-clinic in Katni and online across India and worldwide.
          </motion.p>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.45 }}
            style={{ display: "flex", flexWrap: "wrap", gap: 12, marginBottom: 32 }}
          >
            <Link
              href="/book?type=online"
              style={{
                display: "inline-flex", alignItems: "center", gap: 8,
                padding: "12px 24px", borderRadius: 8,
                background: "linear-gradient(135deg, #0A7E8C, #0D9BAC)",
                color: "white", textDecoration: "none",
                fontFamily: "'DM Sans',sans-serif", fontWeight: 700, fontSize: 14,
                boxShadow: "0 4px 20px rgba(10,126,140,0.45)",
                transition: "all 0.2s ease",
                willChange: "transform",
              }}
              onMouseEnter={e => {
                const el = e.currentTarget as HTMLElement;
                el.style.background = "linear-gradient(135deg, #0A7E8C, #6B3FA0)";
                el.style.transform = "translateY(-2px)";
                el.style.boxShadow = "0 8px 32px rgba(10,126,140,0.6)";
              }}
              onMouseLeave={e => {
                const el = e.currentTarget as HTMLElement;
                el.style.background = "linear-gradient(135deg, #0A7E8C, #0D9BAC)";
                el.style.transform = "translateY(0)";
                el.style.boxShadow = "0 4px 20px rgba(10,126,140,0.45)";
              }}
            >
              Book Online Consultation
              <span style={{ opacity: 0.75, fontWeight: 400 }}>— {prices.online.display}</span>
              <ArrowRight size={16} />
            </Link>

            {isIndia ? (
              <Link href="/book?type=clinic"
                style={{
                  display: "inline-flex", alignItems: "center", gap: 8,
                  padding: "15px 24px", borderRadius: 10, fontSize: 15, fontWeight: 600,
                  background: "transparent",
                  border: "1.5px solid rgba(255,255,255,0.3)",
                  color: "white", textDecoration: "none",
                  fontFamily: "'DM Sans',sans-serif",
                  transition: "all 0.25s ease",
                }}
                onMouseEnter={e => { const el = e.currentTarget as HTMLElement; el.style.background = "rgba(255,255,255,0.1)"; el.style.borderColor = "rgba(255,255,255,0.6)"; }}
                onMouseLeave={e => { const el = e.currentTarget as HTMLElement; el.style.background = "transparent"; el.style.borderColor = "rgba(255,255,255,0.3)"; }}
              >
                <Building2 size={16} /> Visit Clinic
              </Link>
            ) : (
              <Link href="/international"
                style={{
                  display: "inline-flex", alignItems: "center", gap: 8,
                  padding: "15px 24px", borderRadius: 10, fontSize: 15, fontWeight: 600,
                  background: "transparent", border: "1.5px solid rgba(255,255,255,0.3)",
                  color: "white", textDecoration: "none",
                  fontFamily: "'DM Sans',sans-serif", transition: "all 0.25s ease",
                }}
              >
                <Globe size={16} /> Online Worldwide
              </Link>
            )}
          </motion.div>

          {/* Trust strip */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            style={{ display: "flex", flexWrap: "wrap", alignItems: "center", rowGap: 8 }}
          >
            {[
              { icon: Award, text: "BOT · MOT Certified" },
              { icon: Heart, text: "3+ Years" },
              { icon: Globe, text: "400+ Children" },
              { icon: Globe, text: "Nationwide" },
            ].map((t, i, arr) => (
              <span key={t.text} style={{
                display: "flex", alignItems: "center", gap: 6,
                fontFamily: "'DM Sans',sans-serif", fontSize: 13,
                color: "rgba(255,255,255,0.42)", fontWeight: 500,
                paddingRight: i < arr.length - 1 ? 16 : 0,
                marginRight: i < arr.length - 1 ? 16 : 0,
                borderRight: i < arr.length - 1 ? "1px solid rgba(255,255,255,0.12)" : "none",
              }}>
                {t.text}
              </span>
            ))}
          </motion.div>
        </div>

        {/* ── RIGHT: Doctor visual — desktop only ── */}
        <div
          className="hide-mobile"
          style={{ position: "relative", height: 520, flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "flex-end" }}
        >
          {/* Teal-purple accent bar */}
          <div style={{
            position: "absolute", left: -4, top: "10%", height: "80%", width: 4,
            background: "linear-gradient(to bottom, transparent, #0A7E8C 20%, #6B3FA0 80%, transparent)",
            borderRadius: 2, zIndex: 3,
          }} />

          {/* Purple glow behind photo */}
          <div style={{
            position: "absolute", right: -50, top: -50,
            width: 280, height: 280, borderRadius: "50%",
            background: "radial-gradient(circle, rgba(107,63,160,0.2), transparent 70%)",
            zIndex: 1, pointerEvents: "none",
          }} />

          {/* Doctor photo — centered via flex, no conflicting transform */}
          <motion.div
            initial={{ opacity: 0, x: 60 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
            style={{
              width: 340, height: 440,
              borderRadius: 20, overflow: "hidden",
              boxShadow: "0 0 0 1px rgba(10,126,140,0.3), 0 24px 64px rgba(0,0,0,0.45), 12px 0 48px rgba(10,126,140,0.25)",
              zIndex: 2,
              flexShrink: 0,
              position: "relative",
            }}
          >
            <Image
              src="/images/doctor/dr-prasoon-hero.jpg"
              alt="Dr. Prasoon Gupta — Pediatric Occupational Therapist"
              fill
              style={{ objectFit: "cover", objectPosition: "center top" }}
              sizes="340px"
              priority
              unoptimized
              quality={100}
            />
          </motion.div>

          {/* Frosted glass info card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 1.0 }}
            style={{
              position: "absolute", bottom: 24, left: -20, zIndex: 4,
              background: "rgba(0, 0, 0, 0.5)",
              backdropFilter: "blur(12px)",
              WebkitBackdropFilter: "blur(12px)",
              border: "1px solid rgba(255, 255, 255, 0.15)",
              boxShadow: "0 8px 32px rgba(0, 0, 0, 0.2)",
              borderRadius: 16, padding: "18px 22px",
              minWidth: 210,
            }}
          >
            <div style={{ fontFamily: "'Nunito',sans-serif", fontWeight: 800, fontSize: 16, color: "white" }}>
              Dr. Prasoon Gupta
            </div>
            <div style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 13, color: "#0D9BAC", marginTop: 2, fontWeight: 700 }}>
              BOT · MOT — Pediatric OT
            </div>
            <div style={{ height: 1, background: "rgba(255,255,255,0.1)", margin: "11px 0" }} />
            <div style={{ display: "flex", gap: 3, marginBottom: 5 }}>
              {Array(5).fill(0).map((_, i) => (
                <Star key={i} size={13} style={{ color: "#F59E0B", fill: "#F59E0B" }} />
              ))}
            </div>
            <div style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 12, color: "rgba(255,255,255,0.6)", fontWeight: 500 }}>
              Rated 5.0 by 120+ parents
            </div>
          </motion.div>
        </div>

      </div>

      {/* ── Scroll indicator ── */}
      <motion.a
        href="#stats"
        animate={{ opacity: showScroll ? 1 : 0 }}
        transition={{ duration: 0.4 }}
        style={{
          position: "absolute", bottom: 28, left: "50%",
          transform: "translateX(-50%)",
          display: "flex", flexDirection: "column", alignItems: "center", gap: 5,
          color: "rgba(255,255,255,0.3)", textDecoration: "none",
          fontFamily: "'DM Sans',sans-serif", fontSize: 11,
          fontWeight: 500, letterSpacing: "0.1em", textTransform: "uppercase",
          zIndex: 3, pointerEvents: showScroll ? "auto" : "none",
        }}
      >
        Scroll
        <ChildFigure />
      </motion.a>

      <style>{`
        @keyframes heroOrbRotate {
          from { transform: rotate(0deg); }
          to   { transform: rotate(360deg); }
        }
        @keyframes heroBounce {
          0%,100% { transform: translateY(0); }
          50%      { transform: translateY(8px); }
        }
        @media (max-width: 900px) {
          .grid-sidebar-right {
            text-align: center;
            gap: 40px;
            padding-top: calc(68px + 32px) !important;
            padding-bottom: 64px !important;
          }
          .hero-left-content {
            display: flex;
            flex-direction: column;
            align-items: center;
          }
        }
      `}</style>
    </section>
  );
}
