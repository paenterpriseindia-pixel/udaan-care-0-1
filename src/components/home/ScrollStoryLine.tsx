"use client";
import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

/* Simple SVG figures — clean line-art, medical icon style */
const ChildFigure = () => (
  <svg width="48" height="72" viewBox="0 0 48 72" fill="none" stroke="#0A7E8C" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    {/* Head */}
    <circle cx="24" cy="10" r="8" />
    {/* Body */}
    <line x1="24" y1="18" x2="24" y2="44" />
    {/* Arms — down, uncertain */}
    <line x1="24" y1="26" x2="12" y2="36" />
    <line x1="24" y1="26" x2="36" y2="36" />
    {/* Legs */}
    <line x1="24" y1="44" x2="16" y2="62" />
    <line x1="24" y1="44" x2="32" y2="62" />
  </svg>
);

const DoctorFigure = () => (
  <svg width="52" height="76" viewBox="0 0 52 76" fill="none" stroke="#6B3FA0" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    {/* Head */}
    <circle cx="26" cy="10" r="9" />
    {/* White coat body */}
    <path d="M14 22 Q10 34 10 50 L20 50 L20 70" />
    <path d="M38 22 Q42 34 42 50 L32 50 L32 70" />
    <line x1="20" y1="70" x2="32" y2="70" />
    {/* Coat lapels */}
    <line x1="26" y1="22" x2="20" y2="34" />
    <line x1="26" y1="22" x2="32" y2="34" />
    {/* Arms — reaching */}
    <line x1="10" y1="34" x2="0" y2="48" />
    <line x1="42" y1="34" x2="52" y2="28" />
  </svg>
);

const HoldingHandsFigure = () => (
  <svg width="96" height="72" viewBox="0 0 96 72" fill="none" strokeLinecap="round" strokeLinejoin="round">
    {/* Child */}
    <g stroke="#0A7E8C" strokeWidth="2">
      <circle cx="20" cy="10" r="7" />
      <line x1="20" y1="17" x2="20" y2="40" />
      <line x1="20" y1="24" x2="10" y2="34" />
      <line x1="20" y1="24" x2="30" y2="32" />
      <line x1="20" y1="40" x2="13" y2="58" />
      <line x1="20" y1="40" x2="27" y2="58" />
    </g>
    {/* Joined hands */}
    <line x1="30" y1="32" x2="50" y2="32" stroke="#2E8B57" strokeWidth="2.5" />
    {/* Doctor */}
    <g stroke="#6B3FA0" strokeWidth="2">
      <circle cx="74" cy="10" r="8" />
      <line x1="74" y1="18" x2="74" y2="42" />
      <line x1="74" y1="26" x2="50" y2="32" />
      <line x1="74" y1="26" x2="86" y2="34" />
      <line x1="74" y1="42" x2="66" y2="60" />
      <line x1="74" y1="42" x2="82" y2="60" />
    </g>
  </svg>
);

const ChildConfidentFigure = () => (
  <svg width="56" height="72" viewBox="0 0 56 72" fill="none" strokeLinecap="round" strokeLinejoin="round">
    {/* Child — more upright, confident */}
    <g stroke="#0A7E8C" strokeWidth="2">
      <circle cx="20" cy="9" r="8" />
      <line x1="20" y1="17" x2="20" y2="42" />
      {/* Arms up slightly — more confident */}
      <line x1="20" y1="24" x2="6" y2="30" />
      <line x1="20" y1="24" x2="34" y2="30" />
      <line x1="20" y1="42" x2="12" y2="60" />
      <line x1="20" y1="42" x2="28" y2="60" />
    </g>
    {/* Doctor behind, smaller */}
    <g stroke="#6B3FA0" strokeWidth="1.5" opacity="0.5">
      <circle cx="42" cy="12" r="6" />
      <line x1="42" y1="18" x2="42" y2="40" />
      <line x1="42" y1="24" x2="34" y2="32" />
      <line x1="42" y1="24" x2="52" y2="30" />
      <line x1="42" y1="40" x2="36" y2="56" />
      <line x1="42" y1="40" x2="48" y2="56" />
    </g>
  </svg>
);

const WingsFigure = () => (
  <svg width="72" height="72" viewBox="0 0 72 72" fill="none" strokeLinecap="round" strokeLinejoin="round">
    {/* Child with arms wide open */}
    <g stroke="#0A7E8C" strokeWidth="2">
      <circle cx="36" cy="10" r="8" />
      <line x1="36" y1="18" x2="36" y2="44" />
      {/* Arms wide open */}
      <line x1="36" y1="25" x2="4" y2="20" />
      <line x1="36" y1="25" x2="68" y2="20" />
      <line x1="36" y1="44" x2="26" y2="62" />
      <line x1="36" y1="44" x2="46" y2="62" />
    </g>
    {/* Doctor watching proudly, to the side */}
    <g stroke="#6B3FA0" strokeWidth="1.5" opacity="0.45">
      <circle cx="62" cy="14" r="6" />
      <line x1="62" y1="20" x2="62" y2="40" />
      <line x1="62" y1="26" x2="54" y2="34" />
      <line x1="62" y1="26" x2="70" y2="30" />
      <line x1="62" y1="40" x2="56" y2="54" />
      <line x1="62" y1="40" x2="68" y2="54" />
    </g>
  </svg>
);

const scenes = [
  { pct: 0,    label: "The first visit",           Figure: ChildFigure },
  { pct: 0.25, label: "A helping hand",            Figure: DoctorFigure },
  { pct: 0.5,  label: "Walking together",          Figure: HoldingHandsFigure },
  { pct: 0.75, label: "Growing confident",         Figure: ChildConfidentFigure },
  { pct: 1.0,  label: "Wings spread wide",         Figure: WingsFigure },
];

export default function ScrollStoryLine() {
  const lineRef = useRef<HTMLDivElement>(null);
  const [fillPct, setFillPct] = useState(0);
  const [activeScene, setActiveScene] = useState(-1);

  useEffect(() => {
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReduced) return;

    const onScroll = () => {
      const docH = document.documentElement.scrollHeight - window.innerHeight;
      const pct = docH > 0 ? Math.min(window.scrollY / docH, 1) : 0;
      setFillPct(pct);

      // Which scene to show: the highest pct scene that has been reached
      let idx = -1;
      scenes.forEach((s, i) => { if (pct >= s.pct) idx = i; });
      setActiveScene(idx);
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div
      aria-hidden
      style={{
        position: "fixed",
        left: 24, top: 0,
        height: "100vh",
        zIndex: 40,
        display: "flex",
        alignItems: "flex-start",
        paddingTop: 80,
        paddingBottom: 40,
        pointerEvents: "none",
      }}
    >
      {/* ── Track ── */}
      <div
        ref={lineRef}
        style={{
          position: "relative",
          width: 2,
          height: "100%",
          background: "#E2EBF0",
          borderRadius: 2,
        }}
      >
        {/* Fill bar */}
        <div style={{
          position: "absolute",
          top: 0, left: 0,
          width: 2,
          height: `${fillPct * 100}%`,
          background: "linear-gradient(to bottom, #0A7E8C, #6B3FA0)",
          borderRadius: 2,
          transition: "height 0.1s linear",
          willChange: "height",
        }} />

        {/* Scene markers */}
        {scenes.map((s, i) => (
          <div
            key={i}
            style={{
              position: "absolute",
              top: `${s.pct * 100}%`,
              left: 12,
              transform: "translateY(-50%)",
            }}
          >
            {/* Dot on the line */}
            <div style={{
              position: "absolute",
              left: -15, top: "50%", transform: "translateY(-50%)",
              width: 8, height: 8, borderRadius: "50%",
              background: fillPct >= s.pct ? "#0A7E8C" : "#E2EBF0",
              border: "2px solid white",
              boxShadow: "0 0 0 1px #E2EBF0",
              transition: "background 0.3s",
            }} />

            {/* SVG Scene */}
            <AnimatePresence>
              {activeScene >= i && (
                <motion.div
                  initial={{ opacity: 0, x: -12, scale: 0.9 }}
                  animate={{ opacity: 1, x: 0, scale: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.4, ease: "easeOut" }}
                  style={{
                    display: "flex", flexDirection: "column", alignItems: "flex-start",
                    gap: 4, paddingLeft: 4,
                  }}
                >
                  <s.Figure />
                  <span style={{
                    fontFamily: "'DM Sans',sans-serif", fontSize: 10,
                    color: "#6B7C8A", fontWeight: 500,
                    letterSpacing: "0.04em", whiteSpace: "nowrap",
                    maxWidth: 80,
                  }}>
                    {s.label}
                  </span>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ))}
      </div>
    </div>
  );
}
