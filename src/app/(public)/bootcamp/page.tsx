import Image from "next/image";
import Link from "next/link";
import { Calendar, Users, ChevronRight, Video, MapPin, Search } from "lucide-react";
import { supabase } from "@/lib/supabase";

export const metadata = {
  title: "Programs & Bootcamps | Udaan Care",
  description: "Join expert-led programs and bootcamps for parents and therapists.",
};

export const revalidate = 60; // Revalidate every minute

export default async function BootcampsIndexPage() {
  const { data: bootcamps } = await supabase
    .from("bootcamps")
    .select("*")
    .eq("isPublished", true)
    .is("deletedAt", null)
    .order("eventDate", { ascending: true });

  const activeBootcamps = bootcamps || [];
  
  // Categorize
  const upcoming = activeBootcamps.filter(b => new Date(b.eventDate).getTime() > Date.now());
  const past = activeBootcamps.filter(b => new Date(b.eventDate).getTime() <= Date.now());

  return (
    <div style={{ background: "#F7FAFC", minHeight: "100vh", paddingBottom: 80 }}>
      {/* HEADER HERO */}
      <section style={{ background: "linear-gradient(135deg, #0A7E8C, #065F6A)", padding: "140px 20px 60px", textAlign: "center", color: "white" }}>
        <div className="container" style={{ maxWidth: 800, margin: "0 auto" }}>
          <div style={{ display: "inline-block", background: "rgba(255,255,255,0.2)", padding: "6px 16px", borderRadius: 30, fontSize: 13, fontWeight: 700, letterSpacing: "0.05em", marginBottom: 20, fontFamily: "'DM Sans', sans-serif" }}>
            EXPERT SESSIONS
          </div>
          <h1 style={{ fontFamily: "'Nunito', sans-serif", fontWeight: 900, fontSize: "clamp(32px, 5vw, 48px)", margin: "0 0 20px", lineHeight: 1.2 }}>
            Empowering Parents <br/><span style={{ color: "#F5820D" }}>& Therapists</span>
          </h1>
          <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "clamp(16px, 2vw, 18px)", opacity: 0.9, maxWidth: 600, margin: "0 auto 32px", lineHeight: 1.6 }}>
            Join our expert-led bootcamps, workshops, and training programs designed to foster better child development and clinical skills.
          </p>
        </div>
      </section>

      <div className="container" style={{ maxWidth: 1000, margin: "-40px auto 0", padding: "0 20px" }}>
        
        {upcoming.length > 0 && (
          <div style={{ marginBottom: 60 }}>
            <h2 style={{ fontFamily: "'Nunito', sans-serif", fontWeight: 800, fontSize: 24, color: "#1A2B35", marginBottom: 24, display: "flex", alignItems: "center", gap: 12 }}>
              <span style={{ width: 12, height: 12, borderRadius: "50%", background: "#22C55E", display: "inline-block" }} />
              Upcoming Programs
            </h2>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: 24 }}>
              {upcoming.map(b => (
                <Link href={`/bootcamp/${b.slug}`} key={b.id} style={{ display: "flex", flexDirection: "column", background: "white", borderRadius: 20, overflow: "hidden", textDecoration: "none", boxShadow: "0 10px 30px rgba(10,126,140,0.08)", transition: "transform 0.2s" }} className="bootcamp-card">
                  
                  {b.coverImageUrl ? (
                    <div style={{ width: "100%", height: 200, position: "relative", backgroundColor: "#E2EBF0" }}>
                      <Image src={b.coverImageUrl} alt={b.title} fill style={{ objectFit: "cover" }} />
                    </div>
                  ) : (
                    <div style={{ width: "100%", height: 160, background: "linear-gradient(135deg, #0A7E8C, #1A2B35)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <Image src="/images/logo/logo-dark.png" alt="Udaan Care" width={120} height={40} style={{ opacity: 0.5, filter: "brightness(0) invert(1)" }} />
                    </div>
                  )}

                  <div style={{ padding: 24, display: "flex", flexDirection: "column", flex: 1 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
                      <span style={{ background: "rgba(245,130,13,0.1)", color: "#F5820D", padding: "4px 10px", borderRadius: 6, fontSize: 11, fontWeight: 700, letterSpacing: "0.05em", fontFamily: "'DM Sans', sans-serif" }}>
                        {b.category}
                      </span>
                      {b.isFeatured && (
                        <span style={{ background: "#F5820D", color: "white", padding: "4px 10px", borderRadius: 6, fontSize: 11, fontWeight: 700, letterSpacing: "0.05em", fontFamily: "'DM Sans', sans-serif" }}>
                          FEATURED
                        </span>
                      )}
                    </div>

                    <h3 style={{ fontFamily: "'Nunito', sans-serif", fontWeight: 800, fontSize: 20, color: "#1A2B35", margin: "0 0 12px", lineHeight: 1.3 }}>
                      {b.title}
                    </h3>
                    
                    <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 14, color: "#6B7C8A", margin: "0 0 20px", lineHeight: 1.5, flex: 1 }}>
                      {b.shortDescription}
                    </p>

                    <div style={{ display: "flex", flexDirection: "column", gap: 10, borderTop: "1px solid #E2EBF0", paddingTop: 20 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 10, color: "#1A2B35", fontSize: 14, fontFamily: "'DM Sans', sans-serif", fontWeight: 500 }}>
                        <Calendar size={16} color="#0A7E8C" />
                        {new Date(b.eventDate).toLocaleDateString("en-IN", { month: "short", day: "numeric", year: "numeric" })} · {b.startTime}
                      </div>
                      <div style={{ display: "flex", alignItems: "center", gap: 10, color: "#1A2B35", fontSize: 14, fontFamily: "'DM Sans', sans-serif", fontWeight: 500 }}>
                        {b.eventType === "ONLINE" ? <Video size={16} color="#F5820D" /> : <MapPin size={16} color="#F5820D" />}
                        {b.eventType === "ONLINE" ? b.platform : "In-Person Event"}
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        {past.length > 0 && (
          <div>
            <h2 style={{ fontFamily: "'Nunito', sans-serif", fontWeight: 800, fontSize: 24, color: "#1A2B35", marginBottom: 24, display: "flex", alignItems: "center", gap: 12 }}>
              Past Programs
            </h2>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: 24 }}>
              {past.map(b => (
                <div key={b.id} style={{ display: "flex", flexDirection: "column", background: "white", borderRadius: 20, overflow: "hidden", border: "1px solid #E2EBF0", opacity: 0.7 }}>
                  <div style={{ padding: 24, display: "flex", flexDirection: "column", flex: 1 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
                      <span style={{ background: "#F1F5F9", color: "#64748B", padding: "4px 10px", borderRadius: 6, fontSize: 11, fontWeight: 700, letterSpacing: "0.05em", fontFamily: "'DM Sans', sans-serif" }}>
                        COMPLETED
                      </span>
                    </div>
                    <h3 style={{ fontFamily: "'Nunito', sans-serif", fontWeight: 800, fontSize: 18, color: "#1A2B35", margin: "0 0 12px", lineHeight: 1.3 }}>
                      {b.title}
                    </h3>
                    <div style={{ display: "flex", alignItems: "center", gap: 10, color: "#6B7C8A", fontSize: 14, fontFamily: "'DM Sans', sans-serif" }}>
                      <Calendar size={16} />
                      {new Date(b.eventDate).toLocaleDateString("en-IN", { month: "short", day: "numeric", year: "numeric" })}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeBootcamps.length === 0 && (
          <div style={{ textAlign: "center", padding: "100px 20px", background: "white", borderRadius: 24, boxShadow: "0 10px 30px rgba(10,126,140,0.05)" }}>
            <div style={{ display: "inline-flex", padding: 20, borderRadius: "50%", background: "#F7FAFC", marginBottom: 20 }}>
              <Search size={40} color="#0A7E8C" />
            </div>
            <h2 style={{ fontFamily: "'Nunito', sans-serif", fontWeight: 800, fontSize: 24, color: "#1A2B35", margin: "0 0 12px" }}>
              No Programs Scheduled
            </h2>
            <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 16, color: "#6B7C8A", margin: 0 }}>
              Check back soon for upcoming expert workshops and bootcamps!
            </p>
          </div>
        )}

      </div>
      
      <style dangerouslySetInnerHTML={{ __html: `
        .bootcamp-card:hover { transform: translateY(-4px); }
      `}} />
    </div>
  );
}
