"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";

const faqs = [
  { q: "What age group do you treat?", a: "We work with children from 6 months to 18 years. Early intervention typically produces the best outcomes, so we encourage families to seek an assessment as soon as any concern arises." },
  { q: "How does an online consultation work?", a: "After booking and payment, you receive a Zoom link via WhatsApp and email. Dr. Prasoon conducts a thorough developmental assessment via video call, then shares a personalised therapy plan within 24 hours." },
  { q: "How many sessions will my child need?", a: "Every child is different. After the initial consultation, Dr. Prasoon recommends a therapy plan tailored to your child. Most families begin to see measurable progress within four to six weeks of consistent sessions." },
  { q: "What conditions do you treat?", a: "We support children with autism spectrum disorder, ADHD, sensory processing disorder, developmental delays, cerebral palsy, fine and gross motor difficulties, handwriting challenges, and learning difficulties." },
  { q: "Will I receive exercises to do at home?", a: "Yes. After every session, Dr. Prasoon provides a set of simple, practical home activities that any parent can carry out — no special equipment required." },
  { q: "Is online payment secure?", a: "Yes. Indian patients pay via Razorpay — India's most trusted payment gateway — supporting UPI, debit cards, credit cards, and net banking. International patients pay via Stripe." },
];

function FAQItem({ item, index }: { item: typeof faqs[0]; index: number }) {
  const [open, setOpen] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, delay: index * 0.06 }}
      style={{
        borderRadius: 14,
        border: `1.5px solid ${open ? "#0A7E8C" : "var(--color-border)"}`,
        overflow: "hidden",
        transition: "border-color 0.25s ease, box-shadow 0.25s ease",
        boxShadow: open ? "0 4px 24px rgba(10,126,140,0.1)" : "none",
        borderLeft: open ? "4px solid #0A7E8C" : "1.5px solid var(--color-border)",
      }}
    >
      <button
        onClick={() => setOpen(!open)}
        aria-expanded={open}
        style={{
          width: "100%",
          display: "flex", alignItems: "center",
          justifyContent: "space-between", gap: 16,
          padding: "20px 24px",
          background: open ? "rgba(10,126,140,0.04)" : "transparent",
          border: "none", cursor: "pointer", textAlign: "left",
          minHeight: 64,
          transition: "background 0.2s",
        }}
      >
        <span style={{
          fontFamily: "'Nunito',sans-serif", fontWeight: 700,
          fontSize: 16, lineHeight: 1.35,
          color: open ? "#0A7E8C" : "var(--color-text-primary)",
          transition: "color 0.2s",
        }}>
          {item.q}
        </span>
        <ChevronDown
          size={18}
          style={{
            color: open ? "#0A7E8C" : "var(--color-text-secondary)",
            flexShrink: 0,
            transform: open ? "rotate(180deg)" : "rotate(0deg)",
            transition: "transform 300ms ease, color 0.2s",
          }}
        />
      </button>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            key="answer"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            style={{ overflow: "hidden" }}
          >
            <div style={{ padding: "0 24px 22px" }}>
              <p style={{
                fontFamily: "'DM Sans',sans-serif", fontSize: 15,
                color: "var(--color-text-secondary)", lineHeight: 1.75,
              }}>
                {item.a}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export default function FAQSection() {
  return (
    <section style={{ padding: "64px 0", background: "var(--color-bg)" }}>
      <div className="container" style={{ maxWidth: 720 }}>
        <div style={{ textAlign: "center", marginBottom: 56 }}>
          <motion.span
            className="eyebrow"
            initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }} transition={{ duration: 0.4 }}
          >
            Frequently Asked Questions
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }} transition={{ duration: 0.4, delay: 0.1 }}
            style={{
              fontFamily: "'Nunito',sans-serif", fontWeight: 800,
              fontSize: "clamp(24px, 3vw, 36px)", color: "var(--color-text-primary)",
            }}
          >
            Everything Parents Ask
          </motion.h2>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          {faqs.map((f, i) => <FAQItem key={i} item={f} index={i} />)}
        </div>
      </div>
    </section>
  );
}
