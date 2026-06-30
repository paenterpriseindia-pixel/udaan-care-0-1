"use client";
import { useParams } from "next/navigation";
import Link from "next/link";
import { useCurrency } from "@/context/CurrencyContext";
import { ArrowRight, Calendar, Clock, Share2, Copy, Check, Bookmark } from "lucide-react";
import { useState } from "react";

const ARTICLES: Record<string, {
  cat: string; emoji: string; catColor: string; catBg: string;
  title: string; date: string; time: string; body: string;
}> = {
  "signs-sensory-processing-disorder": {
    cat: "Sensory", emoji: "🌊", catColor: "#F5820D", catBg: "#FEF0E3",
    title: "Signs Your Child May Have Sensory Processing Disorder",
    date: "June 10, 2024", time: "5 min",
    body: `## What is Sensory Processing Disorder?

Sensory Processing Disorder (SPD) occurs when the brain has trouble receiving and responding to information from the senses. Children with SPD may be **oversensitive** to stimulation, **undersensitive**, or may crave specific types of input.

## The 7 Warning Signs

**1. Extreme sensitivity to sounds**
Your child covers their ears at everyday sounds like a vacuum cleaner, hand dryer, or crowded places.

**2. Refuses certain food textures**
Beyond typical picky eating — your child gags at specific textures and has a very limited range of acceptable foods.

**3. Avoids messy play**
Refuses to touch sand, finger paints, playdough, or wet grass. Strong aversion to anything on their hands.

**4. Seeks constant movement**
Spins, crashes into things, seeks pressure, can't sit still — these are signs of sensory-seeking behaviour.

**5. Extremely sensitive to touch**
Meltdowns over clothing tags, certain fabrics, or light touch. Prefers tight hugs over gentle ones.

**6. Avoids crowds and busy environments**
Becomes distressed in supermarkets, parties, or school hallways. Needs time to decompress after busy outings.

**7. Poor body awareness**
Trips often, difficulty judging how much force to use (holds pencil too hard, hugs too tight), awkward movement.

## What Should I Do?

If your child shows several of these signs, an occupational therapy evaluation is the right next step. Dr. Prasoon Gupta specialises in sensory processing assessment and can create a personalised sensory diet and therapy plan for your child.

Early intervention makes a significant difference. The brain is most malleable in the early years — the sooner therapy begins, the better the outcomes.`,
  },
  "occupational-therapy-autism-guide": {
    cat: "Autism", emoji: "🧩", catColor: "#6B3FA0", catBg: "#f0eaf8",
    title: "Occupational Therapy for Autism: A Parent's Complete Guide",
    date: "June 5, 2024", time: "7 min",
    body: `## How OT Helps Children with Autism

Occupational therapy is one of the most recommended interventions for children with Autism Spectrum Disorder (ASD). It addresses the everyday challenges that autistic children face — not just at the clinic, but at home, at school, and in the community.

## What OT Targets in Autism

**Sensory Processing**
Most children with autism have sensory differences. OT helps regulate their sensory system so they can participate more comfortably in daily life.

**Daily Living Skills**
Self-care tasks like dressing, eating, grooming, and toileting can be challenging for autistic children. OT breaks these down into manageable steps.

**Fine Motor Skills**
Many autistic children have fine motor difficulties affecting their ability to write, draw, use tools, and manipulate objects.

**Social Participation**
OT addresses the underlying skills needed for social interaction — eye contact, turn-taking, understanding non-verbal cues.

## The Evidence Base

Research consistently shows that early, intensive OT intervention improves outcomes for children with ASD. The key is a personalised approach — what works for one child may not work for another.

## What to Expect at Udaan Care

Dr. Prasoon conducts a thorough assessment covering sensory processing, motor skills, daily living, play skills, and family priorities. A tailored therapy plan is created and reviewed every 4–6 weeks.`,
  },
  "fine-motor-skills-milestones": {
    cat: "Development", emoji: "✋", catColor: "#0A7E8C", catBg: "#E6F4F6",
    title: "Fine Motor Skills: Milestones and When to Worry",
    date: "May 28, 2024", time: "4 min",
    body: `## What are Fine Motor Skills?

Fine motor skills involve the small muscles of the hands and fingers. They underpin everyday tasks like writing, using cutlery, buttoning shirts, and using scissors.

## Key Milestones

**1–2 years:** Picks up small objects, stacks 2–4 blocks, uses spoon messily.

**2–3 years:** Turns pages in a book, completes simple puzzles, uses fork with some spills.

**3–4 years:** Draws circles and lines, holds crayon correctly, strings large beads.

**4–5 years:** Cuts along a line with scissors, copies letters and numbers, buttons large buttons.

**5–6 years:** Writes name, ties shoelaces with help, colours within lines.

## When to Seek Help

- Significant delay of 6+ months behind the milestone
- Difficulty holding a pencil or crayon correctly by age 4–5
- Unable to use scissors or manage self-care by expected ages
- Strong frustration or avoidance of fine motor tasks
- Illegible or effortful handwriting at school age

## How OT Helps

Dr. Prasoon uses fun, play-based activities to build hand strength, grip, coordination, and dexterity. Most children show meaningful improvement within 6–8 weeks of targeted therapy.`,
  },
  "online-therapy-adhd-children": {
    cat: "ADHD", emoji: "⚡", catColor: "#2E8B57", catBg: "#EAF5EE",
    title: "How Online Therapy Works for Children with ADHD",
    date: "May 20, 2024", time: "6 min",
    body: `## Online OT for ADHD — Does It Work?

Many parents wonder whether an online session can hold the attention of a child with ADHD. The answer is yes — with the right structure and approach.

## How Dr. Prasoon Makes Online Sessions Work for ADHD

**Short, structured activities**
Sessions are broken into 5–8 minute activity blocks with clear transitions. This matches ADHD children's attention spans without overwhelming them.

**Movement breaks**
Physical movement activities are built into the session to help with regulation and refocusing.

**Parent coaching**
A key part of online OT for ADHD is coaching the parent present in the room — giving them real-time strategies for implementation at home.

**Visual supports**
Dr. Prasoon uses visual timers, activity boards, and screen-shared prompts to keep the child on track throughout the session.

## What Online ADHD Therapy Covers

- Executive function strategies (planning, organising, starting tasks)
- Sensory regulation techniques
- Homework and school routine management
- Fine motor skill building for writing
- Self-regulation and emotional control
- Home exercise programs for parents to implement daily

## Getting Started

Book an initial online consultation to assess your child's specific ADHD profile and create a personalised therapy plan. Sessions are 45 minutes via Zoom.`,
  },
  "sensory-diet-complete-guide": {
    cat: "Sensory", emoji: "🎯", catColor: "#F5820D", catBg: "#FEF0E3",
    title: "Sensory Diet: What It Is and How to Build One for Your Child",
    date: "May 15, 2024", time: "5 min",
    body: `## What is a Sensory Diet?

A sensory diet is a personalised, daily schedule of sensory activities designed to help a child's nervous system stay regulated throughout the day. Just like a nutritional diet — it needs to be balanced and tailored to the individual.

The term was coined by OT Patricia Wilbarger and has become a cornerstone of sensory integration therapy.

## Why Children Need a Sensory Diet

Children with sensory processing challenges struggle to stay in their "just right" zone of alertness and regulation. A sensory diet provides regular "doses" of the right sensory input to keep the nervous system balanced.

## Building a Sensory Diet

**Morning activities** — Heavy work to organise the nervous system for the day ahead. Carrying a backpack, push-ups against the wall, jumping on a trampoline.

**Pre-meal activities** — Chewy foods, crunchy snacks, drinking through a thick straw. These organise the sensory system before sitting for a meal.

**School transitions** — Fidget tools, movement breaks, a weighted lap pad, noise-cancelling headphones if needed.

**Evening wind-down** — Deep pressure massage, dimmed lights, calming music, weighted blanket.

## Get a Professional Sensory Diet

A sensory diet should be created by an occupational therapist who has assessed your child. Book a consultation with Dr. Prasoon to receive a personalised sensory diet for your child.`,
  },
  "when-to-see-occupational-therapist": {
    cat: "General", emoji: "❓", catColor: "#1A2B35", catBg: "#E6F4F6",
    title: "When Should You See an Occupational Therapist?",
    date: "May 8, 2024", time: "3 min",
    body: `## 10 Signs It's Time to See an OT

Many parents know something is different about their child's development but aren't sure if they need professional help. Here are the top signs to look for.

**1.** Your child is significantly behind peers in developmental milestones.

**2.** Your child has extreme reactions to sensory stimulation (sounds, textures, movement).

**3.** Your child struggles with self-care tasks (dressing, eating, bathing) beyond what's typical for their age.

**4.** Your child's handwriting is very difficult to read or takes enormous effort.

**5.** Your child has difficulty with coordination — falls frequently, avoids physical activities.

**6.** Your child has meltdowns that seem disproportionate to the trigger.

**7.** Your child avoids play with peers and struggles with social games.

**8.** Your child has received a diagnosis of autism, ADHD, cerebral palsy, Down syndrome, or a sensory processing disorder.

**9.** Your child's teacher has expressed concerns about attention, behaviour, or learning.

**10.** Your gut tells you something is not right — parent instinct is a powerful tool.

## What to Expect

An initial OT consultation with Dr. Prasoon takes 45 minutes. He'll assess your child comprehensively and give you clear answers and a recommended next step. There's no obligation to continue therapy — the consultation alone is valuable.`,
  },
};

const RELATED = [
  { slug: "signs-sensory-processing-disorder", cat: "Sensory", emoji: "🌊", title: "Signs Your Child May Have Sensory Processing Disorder", time: "5 min" },
  { slug: "occupational-therapy-autism-guide", cat: "Autism", emoji: "🧩", title: "Occupational Therapy for Autism: A Parent's Complete Guide", time: "7 min" },
  { slug: "fine-motor-skills-milestones", cat: "Development", emoji: "✋", title: "Fine Motor Skills: Milestones and When to Worry", time: "4 min" },
];

function renderMarkdown(text: string) {
  const paragraphs = text.split("\n\n").map((block, i) => {
    if (block.startsWith("## ")) return <h2 key={i} className="prose-udaan" style={{ fontFamily: "var(--font-heading)", fontWeight: 800, fontSize: "1.3rem", color: "var(--text-primary)", margin: "2rem 0 1rem" }}>{block.slice(3)}</h2>;
    if (block.startsWith("**") && block.endsWith("**")) return <h3 key={i} style={{ fontFamily: "var(--font-heading)", fontWeight: 700, fontSize: "1rem", color: "var(--text-primary)", margin: "1.5rem 0 0.5rem" }}>{block.slice(2, -2)}</h3>;
    const lines = block.split("\n").map((l, j) => {
      if (l.startsWith("- ") || /^\d+\./.test(l)) {
        const content = l.replace(/^(-|\d+\.) /, "").replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>");
        return <li key={j} dangerouslySetInnerHTML={{ __html: content }} style={{ color: "var(--text-secondary)", marginBottom: "0.4rem" }} />;
      }
      const html = l.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>");
      return <span key={j} dangerouslySetInnerHTML={{ __html: html }} />;
    });
    const hasList = block.split("\n").some((l) => l.startsWith("- ") || /^\d+\./.test(l));
    if (hasList) return <ul key={i} style={{ listStyle: "disc", paddingLeft: "1.5rem", marginBottom: "1.25rem" }}>{lines}</ul>;
    return <p key={i} style={{ color: "var(--text-secondary)", marginBottom: "1.25rem", lineHeight: "1.85" }}>{lines}</p>;
  });
  return paragraphs;
}

export default function BlogArticlePage() {
  const params = useParams();
  const slug = typeof params.slug === "string" ? params.slug : params.slug?.[0] ?? "";
  const article = ARTICLES[slug];
  const { fmt } = useCurrency();
  const [copied, setCopied] = useState(false);

  const copyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const [saved, setSaved] = useState(false);

  // Map slug to image
  const IMG_MAP: Record<string, string> = {
    "signs-sensory-processing-disorder": "/images/blog/sensory-processing.jpg",
    "sensory-diet-complete-guide": "/images/blog/sensory-processing.jpg",
    "occupational-therapy-autism-guide": "/images/blog/autism-therapy.jpg",
    "online-therapy-adhd-children": "/images/blog/autism-therapy.jpg",
    "fine-motor-skills-milestones": "/images/blog/fine-motor.jpg",
    "when-to-see-occupational-therapist": "/images/blog/fine-motor.jpg",
  };
  const heroImg = IMG_MAP[slug] ?? "/images/blog/sensory-processing.jpg";

  if (!article) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-6 pt-[108px]" style={{ background: "var(--bg)" }}>

        <h1 className="text-2xl font-heading font-black" style={{ color: "var(--text-primary)" }}>Article not found</h1>
        <Link href="/blog" className="btn-primary px-6 py-3">← Back to Blog</Link>
      </div>
    );
  }

  return (
    <>
      {/* Mobile sticky CTA */}
      <div className="fixed top-16 left-0 right-0 z-40 md:hidden" style={{ background: "var(--orange)", padding: "10px 16px" }}>
        <Link href="/book" className="flex items-center justify-center gap-2 text-white font-heading font-bold text-sm">
          Book Consultation — {fmt(599, 9)} <ArrowRight size={14} />
        </Link>
      </div>

      {/* ── Blurred Hero Image ── */}
      <div style={{ position: "relative", height: "min(55vh, 480px)", overflow: "hidden", marginTop: 0 }}>
        {/* Background blurred version */}
        <img
          src={heroImg}
          alt=""
          style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", filter: "blur(16px) brightness(0.35)", transform: "scale(1.08)" }}
          onError={() => {}}
        />
        {/* Sharp image on top, centered with rounded corners */}
        <div style={{ position: "absolute", inset: "40px 20%", borderRadius: 16, overflow: "hidden", boxShadow: "0 24px 80px rgba(0,0,0,0.5)" }}>
          <img
            src={heroImg}
            alt={article.title}
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
            onError={() => {}}
          />
          {/* Subtle gradient on sharp image */}
          <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(13,17,23,0.7) 0%, transparent 60%)" }} />
        </div>
        {/* Full overlay gradient for text legibility */}
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to bottom, rgba(13,17,23,0.55) 0%, rgba(13,17,23,0.3) 40%, rgba(13,17,23,0.6) 80%, rgba(13,17,23,0.9) 100%)" }} />

        {/* Category + title text over image */}
        <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, padding: "0 5vw 36px", maxWidth: 860, margin: "0 auto" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
            <span style={{ padding: "4px 12px", borderRadius: 6, fontFamily: "'DM Sans',sans-serif", fontWeight: 700, fontSize: 12, background: article.catBg, color: article.catColor, backdropFilter: "blur(6px)" }}>
              {article.cat}
            </span>
            <span style={{ display: "flex", alignItems: "center", gap: 4, fontFamily: "'DM Sans',sans-serif", fontSize: 12, color: "rgba(255,255,255,0.6)" }}>
              <Clock size={11} /> {article.time} read
            </span>
          </div>
          <h1 style={{ fontFamily: "'Nunito',sans-serif", fontWeight: 900, fontSize: "clamp(22px,3.5vw,40px)", color: "white", lineHeight: 1.15, marginBottom: 0, textShadow: "0 2px 12px rgba(0,0,0,0.4)" }}>
            {article.title}
          </h1>
        </div>
      </div>

      <div className="pt-10 pb-16" style={{ background: "var(--bg)" }}>
        <div className="container">
          <div className="flex gap-10 items-start">
            {/* Main content */}
            <article className="flex-1 min-w-0">
              {/* Author + meta */}
              <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: 16, marginBottom: 32, paddingBottom: 20, borderBottom: "1px solid var(--color-border)" }}>
                <Link href="/blog" style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 13, color: "var(--color-primary)", textDecoration: "none" }}>← Back to Blog</Link>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <div style={{ width: 36, height: 36, borderRadius: "50%", background: "var(--color-primary)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <span style={{ fontFamily: "'Nunito',sans-serif", fontWeight: 900, fontSize: 13, color: "white" }}>PG</span>
                  </div>
                  <div>
                    <div style={{ fontFamily: "'DM Sans',sans-serif", fontWeight: 700, fontSize: 13, color: "var(--color-text-primary)" }}>Dr. Prasoon Gupta, BOT MOT</div>
                    <div style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 11, color: "var(--color-text-secondary)" }}>{article.date}</div>
                  </div>
                </div>
              </div>

              {/* Body */}
              <div className="prose-udaan">
                {renderMarkdown(article.body)}
              </div>

              {/* Share + Save bar */}
              <div style={{ marginTop: 40, paddingTop: 24, borderTop: "1px solid var(--color-border)" }}>
                <div style={{ fontFamily: "'DM Sans',sans-serif", fontWeight: 700, fontSize: 13, color: "var(--color-text-secondary)", marginBottom: 14, letterSpacing: "0.06em", textTransform: "uppercase" }}>Share & Save</div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 10, alignItems: "center" }}>
                  {/* Save */}
                  <button
                    onClick={() => setSaved(s => !s)}
                    style={{
                      display: "flex", alignItems: "center", gap: 8,
                      padding: "10px 18px", borderRadius: 10, cursor: "pointer",
                      fontFamily: "'DM Sans',sans-serif", fontWeight: 700, fontSize: 13,
                      background: saved ? "var(--color-primary)" : "var(--color-surface)",
                      color: saved ? "white" : "var(--color-text-primary)",
                      border: "1px solid var(--color-border)",
                      transition: "all 0.2s",
                    }}
                  >
                    <Bookmark size={15} style={{ fill: saved ? "white" : "none" }} />
                    {saved ? "Saved" : "Save Article"}
                  </button>
                  {/* WhatsApp */}
                  <a
                    href={`https://wa.me/?text=${encodeURIComponent(article.title + " — Read on Udaan Care: " + (typeof window !== "undefined" ? window.location.href : ""))}`}
                    target="_blank" rel="noopener noreferrer"
                    style={{ display: "flex", alignItems: "center", gap: 8, padding: "10px 18px", borderRadius: 10, textDecoration: "none", fontFamily: "'DM Sans',sans-serif", fontWeight: 700, fontSize: 13, background: "#25D366", color: "white", transition: "opacity 0.2s" }}
                    onMouseEnter={e => (e.currentTarget.style.opacity = "0.85")}
                    onMouseLeave={e => (e.currentTarget.style.opacity = "1")}
                  >
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="white"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                    WhatsApp
                  </a>
                  {/* Twitter/X */}
                  <a
                    href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(article.title)}&url=${encodeURIComponent(typeof window !== "undefined" ? window.location.href : "")}`}
                    target="_blank" rel="noopener noreferrer"
                    style={{ display: "flex", alignItems: "center", gap: 8, padding: "10px 18px", borderRadius: 10, textDecoration: "none", fontFamily: "'DM Sans',sans-serif", fontWeight: 700, fontSize: 13, background: "#000", color: "white", transition: "opacity 0.2s" }}
                    onMouseEnter={e => (e.currentTarget.style.opacity = "0.8")}
                    onMouseLeave={e => (e.currentTarget.style.opacity = "1")}
                  >
                    <Share2 size={14} />
                    Share
                  </a>
                  {/* Copy link */}
                  <button
                    onClick={copyLink}
                    style={{
                      display: "flex", alignItems: "center", gap: 8,
                      padding: "10px 18px", borderRadius: 10, border: "1px solid var(--color-border)", cursor: "pointer",
                      fontFamily: "'DM Sans',sans-serif", fontWeight: 700, fontSize: 13,
                      background: copied ? "var(--color-primary)" : "var(--color-surface)",
                      color: copied ? "white" : "var(--color-text-primary)",
                      transition: "all 0.2s",
                    }}
                  >
                    {copied ? <><Check size={14} /> Copied!</> : <><Copy size={14} /> Copy Link</>}
                  </button>
                </div>
              </div>

              {/* Bottom CTA */}
              <div className="mt-10 p-6 rounded-card text-center" style={{ background: "linear-gradient(135deg, var(--navy), #0A7E8C22)" }}>
                <div className="text-3xl mb-3">🕊️</div>
                <h3 className="text-xl font-heading font-black text-white mb-2">Ready to help your child?</h3>
                <p className="text-sm mb-5" style={{ color: "rgba(255,255,255,0.65)" }}>Book a consultation with Dr. Prasoon and get a personalised therapy plan.</p>
                <Link href="/book" className="btn-orange px-7 py-3.5">
                  📅 Book Consultation — {fmt(599, 9)}
                </Link>
              </div>
            </article>

            {/* Sidebar — desktop only */}
            <aside className="hidden md:flex flex-col gap-4 w-72 flex-shrink-0 sticky top-24">
              {/* Sticky booking card */}
              <div className="card p-5">
                <div className="text-2xl mb-3 text-center">👨‍⚕️</div>
                <h3 className="font-heading font-bold text-sm text-center mb-1" style={{ color: "var(--text-primary)" }}>Dr. Prasoon Gupta</h3>
                <p className="text-xs text-center mb-4" style={{ color: "var(--text-secondary)" }}>BOT, MOT · Pediatric OT Specialist</p>
                <Link href="/book" className="btn-orange w-full text-sm py-3 block text-center rounded-btn mb-2">
                  📅 Book Consultation — {fmt(599, 9)}
                </Link>
                <a href="https://wa.me/918349764084" target="_blank" rel="noopener noreferrer"
                  className="w-full py-2.5 flex items-center justify-center gap-1.5 text-sm font-heading font-bold rounded-btn border-2 transition-colors hover:bg-[#25D36612]"
                  style={{ color: "#25D366", borderColor: "#25D366" }}>
                  💬 Ask on WhatsApp
                </a>
              </div>

              {/* More articles */}
              <div className="card p-4">
                <h3 className="text-xs font-heading font-bold uppercase tracking-wider mb-3" style={{ color: "var(--text-secondary)" }}>More Articles</h3>
                <div className="space-y-3">
                  {RELATED.filter((r) => r.slug !== slug).slice(0, 2).map((r) => (
                    <Link key={r.slug} href={`/blog/${r.slug}`} className="flex items-start gap-2 group">
                      <span className="text-xl flex-shrink-0">{r.emoji}</span>
                      <span className="text-xs font-body leading-snug group-hover:text-[var(--teal)] transition-colors" style={{ color: "var(--text-primary)" }}>
                        {r.title}
                      </span>
                    </Link>
                  ))}
                </div>
              </div>
            </aside>
          </div>

          {/* More articles — mobile */}
          <div className="mt-14">
            <h2 className="text-xl font-heading font-black mb-6" style={{ color: "var(--text-primary)" }}>More Articles</h2>
            <div className="grid sm:grid-cols-3 gap-5">
              {RELATED.filter((r) => r.slug !== slug).map((r) => (
                <Link key={r.slug} href={`/blog/${r.slug}`} className="card group p-4 flex items-start gap-3 no-underline">
                  <span className="text-3xl">{r.emoji}</span>
                  <div>
                    <span className="badge badge-teal text-[10px] mb-1">{r.cat}</span>
                    <h3 className="text-xs font-heading font-bold leading-snug group-hover:text-[var(--teal)] transition-colors" style={{ color: "var(--text-primary)" }}>{r.title}</h3>
                    <span className="text-xs" style={{ color: "var(--text-secondary)" }}>{r.time} read</span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
