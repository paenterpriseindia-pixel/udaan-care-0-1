import Image from "next/image";
import Link from "next/link";
import { Calendar, Video, Building2, BookOpen, FileText, MessageCircle, User, Users, ChevronRight } from "lucide-react";
import { supabase } from "@/lib/supabase";

export const metadata = {
  title: "Udaan Care Links",
  description: "Important links for Udaan Care and Dr. Prasoon Gupta",
};

export default async function LinksPage() {
  // Query DB for featured bootcamp
  const { data: featured } = await supabase
    .from("bootcamps")
    .select("*")
    .eq("isFeatured", true)
    .eq("isPublished", true)
    .is("deletedAt", null)
    .single();

  return (
    <div style={{ maxWidth: 480, margin: "0 auto", padding: "0 20px", background: "#F7FAFC", minHeight: "100vh" }}>
      
      {/* 1. HEADER */}
      <div style={{ paddingTop: 48, textAlign: "center", marginBottom: 32 }}>
        <Image 
          src="/images/logo/logo-dark.png"
          width={160} height={48}
          alt="Udaan Care"
          style={{ objectFit: "contain", margin: "0 auto" }}
          priority
        />
        <h1 style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 500, fontSize: 15, color: "#1A2B35", marginTop: 16 }}>
          Dr. Prasoon Gupta · BOT, MOT
        </h1>
        <p style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 400, fontSize: 14, color: "#6B7C8A" }}>
          Pediatric Occupational Therapist
        </p>
      </div>

      {/* 2. FEATURED PROGRAM */}
      {featured && (
        <div style={{ background: "linear-gradient(135deg, #F5820D, #E06B00)", borderRadius: 16, padding: 20, marginBottom: 16 }}>
          <div style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 600, fontSize: 11, color: "rgba(255,255,255,0.8)", letterSpacing: "0.08em" }}>
            UPCOMING PROGRAM
          </div>
          <h2 style={{ fontFamily: "'Nunito', sans-serif", fontWeight: 700, fontSize: 18, color: "white", margin: "8px 0" }}>
            {featured.title}
          </h2>
          <div style={{ display: "flex", alignItems: "center", gap: 6, fontFamily: "'DM Sans', sans-serif", fontWeight: 400, fontSize: 13, color: "rgba(255,255,255,0.7)" }}>
            <Calendar size={14} color="rgba(255,255,255,0.7)" />
            {new Date(featured.eventDate).toLocaleDateString("en-IN", { month: "short", day: "numeric", year: "numeric" })} · {featured.startTime}
          </div>
          <Link href={`/bootcamp/${featured.slug}`} style={{ display: "block", width: "100%", textAlign: "center", background: "white", color: "#F5820D", borderRadius: 30, padding: "10px 20px", fontFamily: "'DM Sans', sans-serif", fontWeight: 700, fontSize: 14, marginTop: 14, textDecoration: "none" }}>
            Register
          </Link>
        </div>
      )}

      {/* 3. LINK BUTTONS */}
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {/* Button A */}
        <Link href="/book?type=online" className="link-btn">
          <div style={{ display: "flex", alignItems: "center" }}>
            <div className="icon-box" style={{ background: "rgba(10, 126, 140, 0.12)" }}>
              <Video size={18} color="#0A7E8C" />
            </div>
            <span className="btn-label">Book Online Consultation — ₹599</span>
          </div>
          <ChevronRight size={16} color="#6B7C8A" />
        </Link>

        {/* Button B (Conditionally rendered via inline script) */}
        <Link href="/book?type=clinic" className="link-btn" id="btn-clinic">
          <div style={{ display: "flex", alignItems: "center" }}>
            <div className="icon-box" style={{ background: "rgba(10, 126, 140, 0.12)" }}>
              <Building2 size={18} color="#0A7E8C" />
            </div>
            <span className="btn-label">Visit Our Clinic — ₹799</span>
          </div>
          <ChevronRight size={16} color="#6B7C8A" />
        </Link>
        <script dangerouslySetInnerHTML={{ __html: `
          if (typeof window !== 'undefined') {
            const cur = localStorage.getItem("udaan-display-currency") || "INR";
            if (cur !== "INR") document.getElementById("btn-clinic").style.display = "none";
          }
        `}} />

        {/* Button C */}
        <Link href="/bootcamp" className="link-btn">
          <div style={{ display: "flex", alignItems: "center" }}>
            <div className="icon-box" style={{ background: "rgba(245, 130, 13, 0.12)" }}>
              <BookOpen size={18} color="#F5820D" />
            </div>
            <span className="btn-label">Programs & Bootcamps</span>
          </div>
          <ChevronRight size={16} color="#6B7C8A" />
        </Link>

        {/* Button D */}
        <Link href="/blog" className="link-btn">
          <div style={{ display: "flex", alignItems: "center" }}>
            <div className="icon-box" style={{ background: "rgba(10, 126, 140, 0.12)" }}>
              <FileText size={18} color="#0A7E8C" />
            </div>
            <span className="btn-label">Free Parent Guides</span>
          </div>
          <ChevronRight size={16} color="#6B7C8A" />
        </Link>

        {/* Button E */}
        <a href="https://wa.me/918349764084" target="_blank" rel="noopener noreferrer" className="link-btn" style={{ background: "#25D366", border: "none" }}>
          <div style={{ display: "flex", alignItems: "center" }}>
            <div className="icon-box" style={{ background: "rgba(255, 255, 255, 0.2)" }}>
              <MessageCircle size={18} color="white" />
            </div>
            <span className="btn-label" style={{ color: "white" }}>Chat on WhatsApp</span>
          </div>
          <ChevronRight size={16} color="white" />
        </a>

        {/* Button F */}
        <Link href="/about" className="link-btn">
          <div style={{ display: "flex", alignItems: "center" }}>
            <div className="icon-box" style={{ background: "rgba(10, 126, 140, 0.12)" }}>
              <User size={18} color="#0A7E8C" />
            </div>
            <span className="btn-label">About Dr. Prasoon Gupta</span>
          </div>
          <ChevronRight size={16} color="#6B7C8A" />
        </Link>

        {/* Button G */}
        <Link href="/join-as-therapist" className="link-btn" style={{ borderStyle: "dashed" }}>
          <div style={{ display: "flex", alignItems: "center" }}>
            <div className="icon-box" style={{ background: "rgba(107, 63, 160, 0.12)" }}>
              <Users size={18} color="#6B3FA0" />
            </div>
            <span className="btn-label" style={{ fontSize: 13 }}>Partner With Us</span>
          </div>
          <ChevronRight size={16} color="#6B7C8A" />
        </Link>
      </div>

      {/* 4. STATS ROW */}
      <div style={{ marginTop: 28, textAlign: "center", fontFamily: "'DM Sans', sans-serif", fontWeight: 400, fontSize: 13, color: "#6B7C8A" }}>
        400+ Children · 3+ Years · 28 States
      </div>

      {/* 5. BOTTOM */}
      <div style={{ marginTop: 20, marginBottom: 40, textAlign: "center", fontFamily: "'DM Sans', sans-serif", fontWeight: 400, fontSize: 13, color: "#0A7E8C" }}>
        udaancare.in
      </div>

      {/* Styles for buttons since they use hover states */}
      <style dangerouslySetInnerHTML={{ __html: `
        .link-btn {
          height: 56px; width: 100%; background: white; border: 1.5px solid #E2EBF0;
          border-radius: 12px; padding: 0 16px; display: flex; align-items: center;
          justify-content: space-between; text-decoration: none; transition: border-color 200ms;
        }
        .link-btn:hover { border-color: #0A7E8C !important; }
        .icon-box { width: 32px; height: 32px; border-radius: 8px; display: flex; align-items: center; justify-content: center; }
        .btn-label { font-family: 'DM Sans', sans-serif; font-weight: 500; font-size: 15px; color: #1A2B35; margin-left: 12px; }
      `}} />
    </div>
  );
}
