"use client";
import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, Star } from "lucide-react";
import ImagePlaceholder from "@/components/shared/ImagePlaceholder";

const testimonials = [
  {
    name: "Priya Sharma",
    sub: "Parent of Aryan, 5 · Jabalpur",
    quote: "Dr. Prasoon noticed things in our first session that no specialist had caught in years. Aryan's progress over three months has been extraordinary. We finally have a path forward.",
    img: "testimonials/parent-1.jpg",
    color: "#0A7E8C",
  },
  {
    name: "Rahul Mishra",
    sub: "Parent of Ananya, 7 · Mumbai",
    quote: "The online sessions are just as effective as in-person therapy. Dr. Prasoon explains every exercise clearly and answers every question. The results speak for themselves.",
    img: "testimonials/parent-2.jpg",
    color: "#6B3FA0",
  },
  {
    name: "Sunita Patel",
    sub: "Parent of Dev, 4 · Katni",
    quote: "We were completely lost after Dev's diagnosis. Udaan Care gave us a clear path forward. The sensory therapy has helped Dev become calmer, happier, and more confident.",
    img: "testimonials/parent-3.jpg",
    color: "#F5820D",
  },
];

const variants = {
  enter: (dir: number) => ({ x: dir > 0 ? 360 : -360, opacity: 0 }),
  center: { x: 0, opacity: 1 },
  exit:  (dir: number) => ({ x: dir < 0 ? 360 : -360, opacity: 0 }),
};

export default function TestimonialCarousel() {
  const [[page, dir], setPage] = useState([0, 0]);
  const [paused, setPaused] = useState(false);

  const paginate = useCallback((newDir: number) => {
    setPage(([p]) => [(p + newDir + testimonials.length) % testimonials.length, newDir]);
  }, []);

  // Auto-play
  useEffect(() => {
    if (paused) return;
    const id = setInterval(() => paginate(1), 5000);
    return () => clearInterval(id);
  }, [paused, paginate]);

  // Keyboard nav
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft")  paginate(-1);
      if (e.key === "ArrowRight") paginate(1);
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [paginate]);

  const t = testimonials[page];

  return (
    <section style={{ padding: "100px 0", background: "#F0F9FA" }}
      className="dark-bg-surface"
    >
      <style>{`.dark-bg-surface { background: #F0F9FA; }
        .dark .dark-bg-surface { background: #1C2128; }`}
      </style>

      <div className="container">
        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: 56 }}>
          <motion.span
            className="eyebrow"
            initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }} transition={{ duration: 0.4 }}
          >
            What Parents Say
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }} transition={{ duration: 0.4, delay: 0.1 }}
            style={{ fontFamily: "'Nunito',sans-serif", fontWeight: 800, fontSize: "clamp(28px,4vw,40px)", color: "var(--color-text-primary)" }}
          >
            Real Families, Real Progress
          </motion.h2>
        </div>

        {/* Carousel */}
        <div
          style={{ position: "relative", maxWidth: 720, margin: "0 auto" }}
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
        >
          {/* Prev / Next buttons */}
          {[
            { dir: -1, icon: ChevronLeft,  pos: { left: -28 } },
            { dir:  1, icon: ChevronRight, pos: { right: -28 } },
          ].map(({ dir: d, icon: Icon, pos }) => (
            <button
              key={d}
              onClick={() => paginate(d)}
              aria-label={d === -1 ? "Previous testimonial" : "Next testimonial"}
              style={{
                position: "absolute", ...pos, top: "50%",
                transform: "translateY(-50%)",
                zIndex: 10,
                width: 44, height: 44, borderRadius: "50%",
                background: "var(--color-card)",
                border: "1px solid var(--color-border)",
                display: "flex", alignItems: "center", justifyContent: "center",
                cursor: "pointer",
                boxShadow: "0 2px 12px rgba(0,0,0,0.08)",
                transition: "border-color 0.2s, color 0.2s",
                color: "var(--color-text-secondary)",
              }}
              onMouseEnter={e => {
                (e.currentTarget as HTMLElement).style.borderColor = "#0A7E8C";
                (e.currentTarget as HTMLElement).style.color = "#0A7E8C";
              }}
              onMouseLeave={e => {
                (e.currentTarget as HTMLElement).style.borderColor = "var(--color-border)";
                (e.currentTarget as HTMLElement).style.color = "var(--color-text-secondary)";
              }}
            >
              <Icon size={20} />
            </button>
          ))}

          {/* Card with direction-aware animation */}
          <div style={{ overflow: "hidden", borderRadius: 20 }}>
            <AnimatePresence mode="wait" custom={dir}>
              <motion.div
                key={page}
                custom={dir}
                variants={variants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.4, ease: "easeInOut" }}
                drag="x"
                dragConstraints={{ left: 0, right: 0 }}
                onDragEnd={(_, { offset, velocity }) => {
                  if (offset.x < -50 || velocity.x < -500) paginate(1);
                  if (offset.x > 50  || velocity.x > 500)  paginate(-1);
                }}
                style={{
                  background: "var(--color-card)",
                  borderRadius: 20,
                  borderTop: `4px solid ${t.color}`,
                  padding: "44px 48px",
                  boxShadow: `0 12px 48px ${t.color}18, 0 2px 12px rgba(0,0,0,0.06)`,
                  position: "relative",
                  cursor: "grab",
                  userSelect: "none",
                  willChange: "transform",
                }}
              >
                {/* Giant quote mark */}
                <div style={{
                  position: "absolute", top: 20, left: 32,
                  fontFamily: "Georgia, serif", fontSize: 100,
                  lineHeight: 1, color: t.color, opacity: 0.12,
                  pointerEvents: "none", userSelect: "none",
                  fontWeight: 700,
                }}>
                  &ldquo;
                </div>

                {/* Stars */}
                <div style={{ display: "flex", gap: 3, marginBottom: 20 }}>
                  {Array(5).fill(0).map((_, i) => (
                    <Star key={i} size={16} style={{ color: "#F5820D", fill: "#F5820D" }} />
                  ))}
                </div>

                {/* Quote */}
                <blockquote style={{
                  fontFamily: "'DM Sans',sans-serif", fontSize: 17,
                  fontStyle: "italic", lineHeight: 1.8,
                  color: "var(--color-text-primary)", marginBottom: 32,
                  position: "relative", zIndex: 1,
                }}>
                  &ldquo;{t.quote}&rdquo;
                </blockquote>

                {/* Author */}
                <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                  <div style={{
                    width: 50, height: 50, borderRadius: "50%",
                    overflow: "hidden", flexShrink: 0,
                    border: `2px solid ${t.color}`,
                  }}>
                    <ImagePlaceholder label={t.img} style={{ height: 50, borderRadius: "50%" }} />
                  </div>
                  <div>
                    <div style={{ fontFamily: "'Nunito',sans-serif", fontWeight: 700, fontSize: 15, color: "var(--color-text-primary)" }}>
                      {t.name}
                    </div>
                    <div style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 13, color: "var(--color-text-secondary)", marginTop: 2 }}>
                      {t.sub}
                    </div>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Dot indicators */}
          <div style={{ display: "flex", justifyContent: "center", gap: 8, marginTop: 28 }}>
            {testimonials.map((tt, i) => (
              <button
                key={i}
                onClick={() => setPage(([p]) => [i, i > p ? 1 : -1])}
                aria-label={`Go to testimonial ${i + 1}`}
                style={{
                  width: i === page ? 10 : 8,
                  height: i === page ? 10 : 8,
                  borderRadius: "50%",
                  border: i === page ? "none" : `1.5px solid ${testimonials[i].color}`,
                  background: i === page ? testimonials[i].color : "transparent",
                  cursor: "pointer", padding: 0,
                  transition: "all 0.25s ease",
                }}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
