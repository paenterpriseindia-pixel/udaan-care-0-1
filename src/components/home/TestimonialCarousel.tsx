"use client";
import { useRef, useState } from "react";
import { Star } from "lucide-react";

const testimonials = [
  {
    name: "Priya Sharma",
    sub: "Parent of Aryan, 5 · Jabalpur",
    quote: "Dr. Prasoon noticed things in our first session that no specialist had caught in years. Aryan's progress over three months has been extraordinary. We finally have a path forward.",
    initials: "PS",
    color: "#0A7E8C",
  },
  {
    name: "Rahul Mishra",
    sub: "Parent of Ananya, 7 · Mumbai",
    quote: "The online sessions are just as effective as in-person therapy. Dr. Prasoon explains every exercise clearly and answers every question. The results speak for themselves.",
    initials: "RM",
    color: "#6B3FA0",
  },
  {
    name: "Sunita Patel",
    sub: "Parent of Dev, 4 · Katni",
    quote: "We were completely lost after Dev's diagnosis. Udaan Care gave us a clear path forward. The sensory therapy has helped Dev become calmer, happier, and more confident.",
    initials: "SP",
    color: "#F5820D",
  },
  {
    name: "Meena Gupta",
    sub: "Parent of Rohan, 6 · Delhi",
    quote: "The home program Dr. Prasoon designed for us has been a game changer. We do 20 minutes every day and the improvement in Rohan's fine motor skills is remarkable.",
    initials: "MG",
    color: "#2E8B57",
  },
  {
    name: "Anil Verma",
    sub: "Parent of Sia, 3 · Bhopal",
    quote: "Sia used to melt down every time we went somewhere new. After six weeks of sensory integration therapy, she's a different child — curious, confident, and so much happier.",
    initials: "AV",
    color: "#0A7E8C",
  },
  {
    name: "Deepa Joshi",
    sub: "Parent of Arjun, 8 · Indore",
    quote: "As a working parent, the online sessions are perfect. Arjun has improved his handwriting and focus in school. His teacher noticed the difference before we even mentioned therapy.",
    initials: "DJ",
    color: "#6B3FA0",
  },
];

// Duplicate for seamless loop
const track = [...testimonials, ...testimonials];

function TestimonialCard({ t }: { t: typeof testimonials[0] }) {
  return (
    <div
      style={{
        flexShrink: 0,
        width: 380,
        background: "var(--color-card)",
        borderRadius: 20,
        borderTop: `4px solid ${t.color}`,
        padding: "36px 36px 32px",
        boxShadow: `0 8px 32px ${t.color}18, 0 2px 8px rgba(0,0,0,0.05)`,
        position: "relative",
        userSelect: "none",
      }}
    >
      {/* Giant quote */}
      <div style={{
        position: "absolute", top: 16, left: 28,
        fontFamily: "Georgia, serif", fontSize: 88,
        lineHeight: 1, color: t.color, opacity: 0.10,
        pointerEvents: "none", fontWeight: 700,
      }}>
        &ldquo;
      </div>

      {/* Stars */}
      <div style={{ display: "flex", gap: 3, marginBottom: 16 }}>
        {Array(5).fill(0).map((_, i) => (
          <Star key={i} size={14} style={{ color: "#F5820D", fill: "#F5820D" }} />
        ))}
      </div>

      {/* Quote */}
      <blockquote style={{
        fontFamily: "'DM Sans',sans-serif", fontSize: 15,
        fontStyle: "italic", lineHeight: 1.8,
        color: "var(--color-text-primary)", marginBottom: 28,
        position: "relative", zIndex: 1,
        display: "-webkit-box", WebkitLineClamp: 4,
        WebkitBoxOrient: "vertical", overflow: "hidden",
      }}>
        &ldquo;{t.quote}&rdquo;
      </blockquote>

      {/* Author */}
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <div style={{
          width: 44, height: 44, borderRadius: "50%",
          background: `${t.color}20`,
          border: `2px solid ${t.color}`,
          display: "flex", alignItems: "center", justifyContent: "center",
          flexShrink: 0,
          fontFamily: "'Nunito',sans-serif", fontWeight: 800,
          fontSize: 16, color: t.color,
        }}>
          {t.initials}
        </div>
        <div>
          <div style={{ fontFamily: "'Nunito',sans-serif", fontWeight: 700, fontSize: 14, color: "var(--color-text-primary)" }}>
            {t.name}
          </div>
          <div style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 12, color: "var(--color-text-secondary)", marginTop: 2 }}>
            {t.sub}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function TestimonialCarousel() {
  const [paused, setPaused] = useState(false);

  return (
    <section style={{ padding: "56px 0 64px", background: "#F0F9FA", overflow: "hidden" }}

      className="dark-bg-surface"
    >
      <style>{`
        .dark-bg-surface { background: #F0F9FA; }
        .dark .dark-bg-surface { background: #1C2128; }

        @keyframes marquee-scroll {
          0%   { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }

        .marquee-track {
          animation: marquee-scroll 28s linear infinite;
        }
        .marquee-track.paused {
          animation-play-state: paused;
        }

        /* Fade edges */
        .marquee-fade::before,
        .marquee-fade::after {
          content: "";
          position: absolute;
          top: 0; bottom: 0;
          width: 120px;
          z-index: 2;
          pointer-events: none;
        }
        .marquee-fade::before {
          left: 0;
          background: linear-gradient(to right, #F0F9FA, transparent);
        }
        .marquee-fade::after {
          right: 0;
          background: linear-gradient(to left, #F0F9FA, transparent);
        }
        .dark .marquee-fade::before { background: linear-gradient(to right, #1C2128, transparent); }
        .dark .marquee-fade::after  { background: linear-gradient(to left,  #1C2128, transparent); }
      `}</style>

      <div className="container">
        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: 36 }}>

          <span className="eyebrow">What Parents Say</span>
          <h2 style={{
            fontFamily: "'Nunito',sans-serif", fontWeight: 800,
            fontSize: "clamp(28px,4vw,40px)", color: "var(--color-text-primary)",
          }}>
            Real Families, Real Progress
          </h2>
          <p style={{
            fontFamily: "'DM Sans',sans-serif", fontSize: 16,
            color: "var(--color-text-secondary)", marginTop: 12,
          }}>
            Families across India trust Udaan Care for their child&apos;s therapy journey.
          </p>
        </div>
      </div>

      {/* Infinite scrolling marquee — full width, outside container */}
      <div
        className="marquee-fade"
        style={{ position: "relative", overflow: "hidden" }}
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
      >
        <div
          className={`marquee-track${paused ? " paused" : ""}`}
          style={{
            display: "flex",
            gap: 24,
            width: "max-content",
            paddingBottom: 8,
          }}
        >
          {track.map((t, i) => (
            <TestimonialCard key={i} t={t} />
          ))}
        </div>
      </div>

      {/* Star count badge */}
      <div style={{ textAlign: "center", marginTop: 48 }}>
        <div style={{
          display: "inline-flex", alignItems: "center", gap: 8,
          padding: "10px 24px", borderRadius: 50,
          background: "var(--color-card)",
          border: "1px solid var(--color-border)",
          boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
        }}>
          {Array(5).fill(0).map((_, i) => (
            <Star key={i} size={16} style={{ color: "#F5820D", fill: "#F5820D" }} />
          ))}
          <span style={{
            fontFamily: "'DM Sans',sans-serif", fontWeight: 600,
            fontSize: 14, color: "var(--color-text-primary)",
          }}>
            5.0 · 200+ families helped
          </span>
        </div>
      </div>
    </section>
  );
}
