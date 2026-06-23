"use client";
import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useCurrency } from "@/context/CurrencyContext";
import { ArrowRight, Clock, Calendar, Tag, Bookmark, Share2 } from "lucide-react";
import { motion } from "framer-motion";

const CATEGORIES = ["All", "Sensory", "Autism", "ADHD", "Development", "Motor Skills", "General"];

const ARTICLES = [
  {
    slug: "signs-sensory-processing-disorder",
    cat: "Sensory",
    catColor: "#F5820D",
    catBg: "rgba(245,130,13,0.12)",
    title: "Signs Your Child May Have Sensory Processing Disorder",
    date: "June 10, 2024",
    time: "5 min",
    excerpt: "Is your child overwhelmed by noise, textures, or bright lights? These are signs of SPD — and early therapy can make a world of difference.",
    img: "/images/blog/sensory-processing.jpg",
    gradient: "linear-gradient(135deg, #F5820D22, #6B3FA022)",
    featured: true,
  },
  {
    slug: "occupational-therapy-autism-guide",
    cat: "Autism",
    catColor: "#6B3FA0",
    catBg: "rgba(107,63,160,0.12)",
    title: "Occupational Therapy for Autism: A Parent's Complete Guide",
    date: "June 5, 2024",
    time: "7 min",
    excerpt: "A comprehensive guide covering how OT supports children with ASD — from sensory integration to daily living skills and school readiness.",
    img: "/images/blog/autism-therapy.jpg",
    gradient: "linear-gradient(135deg, #6B3FA022, #0A7E8C22)",
    featured: false,
  },
  {
    slug: "fine-motor-skills-milestones",
    cat: "Development",
    catColor: "#0A7E8C",
    catBg: "rgba(10,126,140,0.12)",
    title: "Fine Motor Skills: Milestones and When to Worry",
    date: "May 28, 2024",
    time: "4 min",
    excerpt: "When should a child be able to hold a pencil? Button a shirt? Understanding milestones helps you know when to seek help.",
    img: "/images/blog/fine-motor.jpg",
    gradient: "linear-gradient(135deg, #0A7E8C22, #F5820D22)",
    featured: false,
  },
  {
    slug: "online-therapy-adhd-children",
    cat: "ADHD",
    catColor: "#2E8B57",
    catBg: "rgba(46,139,87,0.12)",
    title: "How Online Therapy Works for Children with ADHD",
    date: "May 20, 2024",
    time: "6 min",
    excerpt: "Online OT sessions can be highly effective for children with ADHD — here's how Dr. Prasoon structures engaging sessions via Zoom.",
    img: "/images/blog/sensory-processing.jpg",
    gradient: "linear-gradient(135deg, #2E8B5722, #0A7E8C22)",
    featured: false,
  },
  {
    slug: "sensory-diet-complete-guide",
    cat: "Sensory",
    catColor: "#F5820D",
    catBg: "rgba(245,130,13,0.12)",
    title: "Sensory Diet: What It Is and How to Build One for Your Child",
    date: "May 15, 2024",
    time: "5 min",
    excerpt: "A sensory diet is a personalised daily plan of sensory activities that helps children stay regulated. Learn how to create one at home.",
    img: "/images/blog/autism-therapy.jpg",
    gradient: "linear-gradient(135deg, #F5820D22, #0A7E8C22)",
    featured: false,
  },
  {
    slug: "when-to-see-occupational-therapist",
    cat: "General",
    catColor: "#0A7E8C",
    catBg: "rgba(10,126,140,0.12)",
    title: "When Should You See an Occupational Therapist?",
    date: "May 8, 2024",
    time: "3 min",
    excerpt: "Not sure if your child needs OT? Here are the top 10 signs that an occupational therapy evaluation could help your child.",
    img: "/images/blog/fine-motor.jpg",
    gradient: "linear-gradient(135deg, #0A7E8C22, #6B3FA022)",
    featured: false,
  },
];

function BlogCard({ a, index, saved, onSave }: {
  a: typeof ARTICLES[0];
  index: number;
  saved: boolean;
  onSave: () => void;
}) {
  const [shared, setShared] = useState(false);
  const shareUrl = typeof window !== "undefined" ? `${window.location.origin}/blog/${a.slug}` : `/blog/${a.slug}`;

  const handleShare = (e: React.MouseEvent) => {
    e.preventDefault();
    if (navigator.share) {
      navigator.share({ title: a.title, url: shareUrl });
    } else {
      navigator.clipboard.writeText(shareUrl);
      setShared(true);
      setTimeout(() => setShared(false), 2000);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 32 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.07 }}
      style={{ position: "relative", borderRadius: 20, overflow: "hidden", background: "var(--color-card)", border: "1px solid var(--color-border)", boxShadow: "var(--shadow-card)", display: "flex", flexDirection: "column" }}
    >
      {/* ── Image with blur overlay ── */}
      <div style={{ position: "relative", height: 220, overflow: "hidden" }}>
        {/* Real image */}
        <Image
          src={a.img}
          alt={a.title}
          fill
          style={{ objectFit: "cover", transition: "transform 0.5s ease" }}
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          onError={() => {}}
        />
        {/* Gradient fallback if no image */}
        <div style={{ position: "absolute", inset: 0, background: a.gradient, mixBlendMode: "multiply" }} />

        {/* Bottom blur + content fade */}
        <div style={{
          position: "absolute", inset: 0,
          background: "linear-gradient(to top, rgba(13,17,23,0.92) 0%, rgba(13,17,23,0.4) 50%, rgba(13,17,23,0.1) 100%)",
        }} />

        {/* Category badge — top left */}
        <div style={{ position: "absolute", top: 14, left: 14 }}>
          <span style={{
            display: "inline-flex", alignItems: "center", gap: 5,
            padding: "4px 10px", borderRadius: 6,
            fontFamily: "'DM Sans',sans-serif", fontWeight: 700, fontSize: 11, letterSpacing: "0.06em",
            background: "rgba(255,255,255,0.15)", backdropFilter: "blur(8px)",
            color: "white", border: "1px solid rgba(255,255,255,0.2)",
          }}>
            <Tag size={10} /> {a.cat}
          </span>
        </div>

        {/* Save + Share — top right */}
        <div style={{ position: "absolute", top: 10, right: 10, display: "flex", gap: 6 }}>
          <button
            onClick={(e) => { e.preventDefault(); onSave(); }}
            title={saved ? "Saved" : "Save article"}
            style={{
              width: 34, height: 34, borderRadius: "50%",
              background: saved ? "var(--color-primary)" : "rgba(255,255,255,0.15)",
              backdropFilter: "blur(8px)",
              border: "1px solid rgba(255,255,255,0.2)",
              display: "flex", alignItems: "center", justifyContent: "center",
              cursor: "pointer", transition: "all 0.2s",
            }}
          >
            <Bookmark size={14} style={{ color: "white", fill: saved ? "white" : "none" }} />
          </button>
          <button
            onClick={handleShare}
            title="Share"
            style={{
              width: 34, height: 34, borderRadius: "50%",
              background: shared ? "var(--color-primary)" : "rgba(255,255,255,0.15)",
              backdropFilter: "blur(8px)",
              border: "1px solid rgba(255,255,255,0.2)",
              display: "flex", alignItems: "center", justifyContent: "center",
              cursor: "pointer", transition: "all 0.2s",
            }}
          >
            <Share2 size={14} style={{ color: "white" }} />
          </button>
        </div>

        {/* Title over the image bottom */}
        <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, padding: "12px 16px 14px" }}>
          <h2 style={{
            fontFamily: "'Nunito',sans-serif", fontWeight: 800,
            fontSize: "clamp(14px,1.1vw,16px)", lineHeight: 1.3,
            color: "white", margin: 0,
            textShadow: "0 1px 8px rgba(0,0,0,0.4)",
          }}>
            {a.title}
          </h2>
        </div>
      </div>

      {/* ── Card body ── */}
      <div style={{ padding: "16px 18px 18px", flex: 1, display: "flex", flexDirection: "column", gap: 12 }}>
        {/* Meta */}
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <span style={{ display: "flex", alignItems: "center", gap: 4, fontFamily: "'DM Sans',sans-serif", fontSize: 12, color: "var(--color-text-secondary)" }}>
            <Calendar size={11} /> {a.date}
          </span>
          <span style={{ display: "flex", alignItems: "center", gap: 4, fontFamily: "'DM Sans',sans-serif", fontSize: 12, color: "var(--color-text-secondary)" }}>
            <Clock size={11} /> {a.time} read
          </span>
        </div>

        {/* Excerpt */}
        <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 13.5, color: "var(--color-text-secondary)", lineHeight: 1.75, flex: 1, margin: 0 }}>
          {a.excerpt}
        </p>

        {/* Bottom action row */}
        <div style={{ display: "flex", gap: 8, paddingTop: 4 }}>
          <Link
            href={`/blog/${a.slug}`}
            style={{
              flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
              padding: "10px 14px", borderRadius: 10,
              fontFamily: "'DM Sans',sans-serif", fontWeight: 700, fontSize: 13,
              background: "var(--color-primary)", color: "white", textDecoration: "none",
              transition: "all 0.2s",
            }}
            onMouseEnter={e => (e.currentTarget.style.opacity = "0.88")}
            onMouseLeave={e => (e.currentTarget.style.opacity = "1")}
          >
            Read Article <ArrowRight size={13} />
          </Link>
          {/* WhatsApp share */}
          <a
            href={`https://wa.me/?text=${encodeURIComponent(a.title + " — " + shareUrl)}`}
            target="_blank"
            rel="noopener noreferrer"
            title="Share on WhatsApp"
            style={{
              width: 42, display: "flex", alignItems: "center", justifyContent: "center",
              borderRadius: 10, background: "#25D36618",
              border: "1px solid #25D36640", textDecoration: "none", flexShrink: 0,
              transition: "all 0.2s",
            }}
            onMouseEnter={e => (e.currentTarget.style.background = "#25D36630")}
            onMouseLeave={e => (e.currentTarget.style.background = "#25D36618")}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="#25D366"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
          </a>
        </div>
      </div>
    </motion.div>
  );
}

export default function BlogPage() {
  const [filter, setFilter] = useState("All");
  const [saved, setSaved] = useState<Set<string>>(new Set());
  const { fmt } = useCurrency();

  const filtered = filter === "All" ? ARTICLES : ARTICLES.filter((a) => a.cat === filter);
  const featured = ARTICLES[0];

  const toggleSave = (slug: string) => {
    setSaved(prev => {
      const next = new Set(prev);
      next.has(slug) ? next.delete(slug) : next.add(slug);
      return next;
    });
  };

  return (
    <>
      {/* ── Hero with featured post background ── */}
      <section style={{ position: "relative", paddingTop: 160, paddingBottom: 80, minHeight: 500, display: "flex", alignItems: "center", overflow: "hidden" }}>
        {/* Blurred hero image from featured post */}
        <Image
          src={featured.img}
          alt="Blog hero"
          fill
          priority
          style={{ objectFit: "cover", filter: "blur(12px) brightness(0.35)", transform: "scale(1.05)" }}
          sizes="100vw"
          onError={() => {}}
        />
        {/* Gradient on top of blur */}
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to bottom, rgba(13,17,23,0.7) 0%, rgba(13,17,23,0.5) 60%, rgba(13,17,23,0.85) 100%)" }} />

        <div className="container" style={{ position: "relative", zIndex: 2, textAlign: "center" }}>
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <span style={{
              display: "inline-block", padding: "6px 18px", borderRadius: 8, marginBottom: 20,
              fontFamily: "'DM Sans',sans-serif", fontWeight: 600, fontSize: 12, letterSpacing: "0.1em", textTransform: "uppercase",
              background: "rgba(10,126,140,0.25)", color: "#0D9BAC", border: "1px solid rgba(10,126,140,0.35)",
              backdropFilter: "blur(4px)",
            }}>
              Expert Resources for Parents
            </span>
            <h1 style={{ fontFamily: "'Nunito',sans-serif", fontWeight: 900, fontSize: "clamp(36px,5.5vw,64px)", color: "white", lineHeight: 1.08, marginBottom: 16 }}>
              Expert Advice<br />
              <span style={{ background: "linear-gradient(90deg,#0D9BAC,#6B3FA0)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
                for Parents
              </span>
            </h1>
            <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 18, color: "rgba(255,255,255,0.65)", maxWidth: 520, margin: "0 auto" }}>
              Written by Dr. Prasoon Gupta — Occupational Therapist, BOT MOT · Katni, Madhya Pradesh
            </p>
          </motion.div>
        </div>
      </section>

      {/* ── Featured Article Card ── */}
      <section style={{ background: "var(--color-surface)", borderBottom: "1px solid var(--color-border)" }}>
        <div className="container" style={{ paddingTop: 0, paddingBottom: 0 }}>
          <div style={{ marginTop: -48, borderRadius: 20, overflow: "hidden", position: "relative", minHeight: 340, border: "1px solid var(--color-border)", boxShadow: "0 24px 64px rgba(0,0,0,0.2)" }}>
            <Image src={featured.img} alt={featured.title} fill style={{ objectFit: "cover" }} priority sizes="100vw" onError={() => {}} />
            {/* Dark gradient over real image */}
            <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to right, rgba(13,17,23,0.92) 45%, rgba(13,17,23,0.45) 100%)" }} />
            <div style={{ position: "absolute", inset: 0, padding: "48px 56px", display: "flex", flexDirection: "column", justifyContent: "flex-end", zIndex: 1 }}>
              <span style={{ display: "inline-block", padding: "4px 12px", borderRadius: 6, marginBottom: 16, fontFamily: "'DM Sans',sans-serif", fontWeight: 700, fontSize: 11, background: "rgba(245,130,13,0.25)", color: "#F5820D", border: "1px solid rgba(245,130,13,0.4)", backdropFilter: "blur(6px)", width: "fit-content" }}>
                Featured
              </span>
              <h2 style={{ fontFamily: "'Nunito',sans-serif", fontWeight: 900, fontSize: "clamp(22px,3vw,36px)", color: "white", lineHeight: 1.2, marginBottom: 12, maxWidth: 560 }}>
                {featured.title}
              </h2>
              <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 15, color: "rgba(255,255,255,0.65)", lineHeight: 1.7, maxWidth: 480, marginBottom: 24 }}>
                {featured.excerpt}
              </p>
              <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                <Link href={`/blog/${featured.slug}`} style={{
                  display: "inline-flex", alignItems: "center", gap: 8,
                  padding: "12px 24px", borderRadius: 10,
                  fontFamily: "'DM Sans',sans-serif", fontWeight: 700, fontSize: 14,
                  background: "var(--color-primary)", color: "white", textDecoration: "none",
                }}>
                  Read Article <ArrowRight size={14} />
                </Link>
                <span style={{ display: "flex", alignItems: "center", gap: 5, fontFamily: "'DM Sans',sans-serif", fontSize: 13, color: "rgba(255,255,255,0.5)" }}>
                  <Clock size={12} /> {featured.time} read
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Category Tabs (sticky) ── */}
      <div style={{ position: "sticky", top: 72, zIndex: 30, background: "var(--color-surface)", borderBottom: "1px solid var(--color-border)" }}>
        <div className="container">
          <div style={{ display: "flex", gap: 8, overflowX: "auto", padding: "12px 0" }}>
            {CATEGORIES.map((c) => (
              <button key={c} onClick={() => setFilter(c)} style={{
                flexShrink: 0, padding: "7px 18px", borderRadius: 20, border: "none", cursor: "pointer",
                fontFamily: "'DM Sans',sans-serif", fontWeight: 600, fontSize: 13,
                background: filter === c ? "var(--color-primary)" : "var(--color-bg)",
                color: filter === c ? "white" : "var(--color-text-secondary)",
                transition: "all 0.2s",
              }}>
                {c}
              </button>
            ))}
            {saved.size > 0 && (
              <button onClick={() => setFilter("__saved__")} style={{
                flexShrink: 0, padding: "7px 18px", borderRadius: 20, border: "none", cursor: "pointer",
                fontFamily: "'DM Sans',sans-serif", fontWeight: 600, fontSize: 13,
                background: filter === "__saved__" ? "#6B3FA0" : "rgba(107,63,160,0.12)",
                color: filter === "__saved__" ? "white" : "#6B3FA0",
                display: "flex", alignItems: "center", gap: 6, transition: "all 0.2s",
              }}>
                <Bookmark size={12} fill={filter === "__saved__" ? "white" : "#6B3FA0"} style={{ color: "inherit" }} />
                Saved ({saved.size})
              </button>
            )}
          </div>
        </div>
      </div>

      {/* ── Articles Grid ── */}
      <section style={{ padding: "56px 0 80px", background: "var(--color-bg)" }}>
        <div className="container">
          {/* Saved filter */}
          {filter === "__saved__" && saved.size === 0 ? (
            <div style={{ textAlign: "center", padding: "64px 0" }}>
              <Bookmark size={40} style={{ color: "var(--color-text-secondary)", margin: "0 auto 12px" }} />
              <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 16, color: "var(--color-text-secondary)" }}>No saved articles yet.</p>
            </div>
          ) : (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: 24 }}>
              {(filter === "__saved__" ? ARTICLES.filter(a => saved.has(a.slug)) : filtered).map((a, i) => (
                <BlogCard key={a.slug} a={a} index={i} saved={saved.has(a.slug)} onSave={() => toggleSave(a.slug)} />
              ))}
            </div>
          )}

          {filtered.length === 0 && filter !== "__saved__" && (
            <div style={{ textAlign: "center", padding: "64px 0" }}>
              <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 16, color: "var(--color-text-secondary)" }}>No articles in this category yet.</p>
            </div>
          )}
        </div>
      </section>

      {/* ── CTA ── */}
      <section style={{ padding: "80px 0", background: "#0D1117" }}>
        <div className="container" style={{ textAlign: "center" }}>
          <h2 style={{ fontFamily: "'Nunito',sans-serif", fontWeight: 900, fontSize: "clamp(26px,4vw,44px)", color: "white", marginBottom: 12 }}>
            Ready to help your child?
          </h2>
          <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 16, color: "rgba(255,255,255,0.55)", marginBottom: 32 }}>
            Book a consultation with Dr. Prasoon and get a personalised therapy plan.
          </p>
          <Link href="/book" style={{
            display: "inline-flex", alignItems: "center", gap: 8, padding: "15px 40px", borderRadius: 12,
            fontFamily: "'DM Sans',sans-serif", fontWeight: 700, fontSize: 16,
            background: "linear-gradient(135deg, #0A7E8C, #6B3FA0)", color: "white", textDecoration: "none",
          }}>
            Book Consultation — {fmt(599, 9)} <ArrowRight size={16} />
          </Link>
        </div>
      </section>
    </>
  );
}
