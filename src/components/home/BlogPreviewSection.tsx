"use client";
import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { useCurrency } from "@/context/CurrencyContext";
import ImagePlaceholder from "@/components/shared/ImagePlaceholder";

const posts = [
  {
    slug: "signs-sensory-processing-disorder",
    cat: "Sensory", catColor: "#F5820D",
    title: "Signs Your Child May Have Sensory Processing Disorder",
    date: "June 10, 2024", time: "5 min",
    excerpt: "Is your child overwhelmed by noise, textures, or bright lights? Learn the key signs and how early therapy helps.",
    img: "blog/blog-placeholder.jpg",
  },
  {
    slug: "occupational-therapy-autism-guide",
    cat: "Autism", catColor: "#0A7E8C",
    title: "Occupational Therapy for Autism: A Parent's Complete Guide",
    date: "June 5, 2024", time: "7 min",
    excerpt: "A comprehensive look at how OT supports children with ASD — from sensory integration to daily living skills.",
    img: "blog/blog-placeholder.jpg",
  },
  {
    slug: "fine-motor-skills-milestones",
    cat: "Development", catColor: "#6B3FA0",
    title: "Fine Motor Skills: Milestones and When to Worry",
    date: "May 28, 2024", time: "4 min",
    excerpt: "When should a child hold a pencil or button a shirt? Understanding milestones helps you know when to seek help.",
    img: "blog/blog-placeholder.jpg",
  },
];

export default function BlogPreviewSection() {
  const { prices } = useCurrency();

  return (
    <section style={{ padding: "max(5vh, 40px) 0", minHeight: "100svh", display: "flex", flexDirection: "column", justifyContent: "center", background: "var(--color-surface)" }}>
      <div className="container">
        {/* Header */}
        <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", marginBottom: 52, flexWrap: "wrap", gap: 16 }}>
          <div>
            <motion.span
              className="eyebrow"
              initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }} transition={{ duration: 0.4 }}
            >
              Guides for Parents
            </motion.span>
            <motion.h2
              initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }} transition={{ duration: 0.4, delay: 0.1 }}
              style={{ fontFamily: "'Nunito',sans-serif", fontWeight: 800, fontSize: "clamp(28px,4vw,40px)", color: "var(--color-text-primary)" }}
            >
              Written by Dr. Prasoon
            </motion.h2>
          </div>
          <Link
            href="/blog"
            style={{
              display: "inline-flex", alignItems: "center", gap: 6,
              fontFamily: "'DM Sans',sans-serif", fontSize: 14, fontWeight: 600,
              color: "var(--color-primary)", textDecoration: "none",
              position: "relative",
            }}
            className="link-animated"
          >
            View all articles <ArrowRight size={14} />
          </Link>
        </div>

        {/* Cards */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px,1fr))", gap: 24 }}>
          {posts.map((p, i) => (
            <motion.div
              key={p.slug}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="card"
              style={{ overflow: "hidden", display: "flex", flexDirection: "column",
                transition: "transform 300ms ease, box-shadow 300ms ease" }}
              whileHover={{ y: -6 }}
            >
              {/* Image */}
              <div style={{ height: 190, overflow: "hidden" }}>
                <ImagePlaceholder label={p.img} style={{ height: "100%", borderRadius: 0 }} />
              </div>

              {/* Body */}
              <div style={{ padding: "22px 24px", flex: 1, display: "flex", flexDirection: "column" }}>
                <span style={{
                  display: "inline-flex", alignSelf: "flex-start",
                  padding: "3px 10px", borderRadius: 5, marginBottom: 12,
                  background: `${p.catColor}18`, color: p.catColor,
                  fontFamily: "'DM Sans',sans-serif", fontSize: 11, fontWeight: 700,
                }}>
                  {p.cat}
                </span>
                <h3 style={{ fontFamily: "'Nunito',sans-serif", fontWeight: 700, fontSize: 17, color: "var(--color-text-primary)", lineHeight: 1.35, marginBottom: 8 }}>
                  {p.title}
                </h3>
                <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 13, color: "var(--color-text-secondary)", lineHeight: 1.65, flex: 1, marginBottom: 20 }}>
                  {p.excerpt}
                </p>

                {/* Divider + footer */}
                <div style={{ borderTop: "1px solid var(--color-border)", paddingTop: 16 }}>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8 }}>
                    <span style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 12, color: "var(--color-text-secondary)" }}>
                      By Dr. Prasoon Gupta
                    </span>
                    <Link
                      href="/book"
                      style={{
                        display: "inline-flex", alignItems: "center", gap: 4,
                        fontFamily: "'DM Sans',sans-serif", fontSize: 12, fontWeight: 600,
                        color: "var(--color-primary)", textDecoration: "none",
                        position: "relative",
                      }}
                      className="link-animated"
                    >
                      Book — {prices.online.display} <ArrowRight size={11} />
                    </Link>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
