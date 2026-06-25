"use client";
import { motion } from "framer-motion";
import { AnimatedCounter } from "@/components/shared/AnimatedCounter";

const stats = [
  { target: 400, suffix: "+", label: "Children Helped",        color: "#0A7E8C", border: "#0A7E8C" },
  { target: 100, suffix: "+", label: "Therapy Plans",          color: "#6B3FA0", border: "#6B3FA0" },
  { target: 3,   suffix: "+", label: "Years Experience",       color: "#F5820D", border: "#F5820D" },
  { target: 28,  suffix: "",  label: "States Served Online",   color: "#2E8B57", border: "#2E8B57" },
];

export default function StatsSection() {
  return (
    <section
      id="stats"
      style={{
        padding: "40px 0",
        background: "var(--color-surface)",
        borderBottom: "1px solid var(--color-border)",
      }}
    >
      <div className="container">
        <div className="grid-cols-4" style={{ gap: 0 }}>
          {stats.map((s, i) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              style={{
                textAlign: "center",
                padding: "0 32px",
                borderLeft: `3px solid ${i === 0 ? s.color : "var(--color-border)"}`,
                borderTop: i > 0 ? `1px solid var(--color-border)` : undefined,
              }}
            >
              {/* Colored left accent strip for all except first */}
              <div style={{
                width: 32, height: 3,
                background: s.color,
                borderRadius: 2, margin: "0 auto 20px",
              }} />

              <div style={{
                fontFamily: "'Nunito',sans-serif", fontWeight: 900,
                fontSize: "clamp(40px,5vw,60px)",
                color: s.color, lineHeight: 1,
                marginBottom: 10,
              }}>
                <AnimatedCounter target={s.target} suffix={s.suffix} duration={2000} />
              </div>
              <div style={{
                fontFamily: "'DM Sans',sans-serif", fontSize: 15,
                fontWeight: 500, color: "var(--color-text-secondary)",
              }}>
                {s.label}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
