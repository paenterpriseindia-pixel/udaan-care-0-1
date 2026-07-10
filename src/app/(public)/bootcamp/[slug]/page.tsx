import Image from "next/image";
import { notFound } from "next/navigation";
import { Calendar, Video, MapPin, Clock, Users, CheckCircle, Info, ChevronRight, User } from "lucide-react";
import { supabase } from "@/lib/supabase";
import BootcampRegistrationForm from "@/components/BootcampRegistrationForm";

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const { data: bootcamp } = await supabase.from("bootcamps").select("title, shortDescription").eq("slug", params.slug).single();
  if (!bootcamp) return { title: "Program Not Found" };
  return { title: `${bootcamp.title} | Udaan Care`, description: bootcamp.shortDescription };
}

export const revalidate = 60; // Revalidate every minute

export default async function BootcampDetailPage({ params }: { params: { slug: string } }) {
  const { data: bootcamp } = await supabase
    .from("bootcamps")
    .select("*")
    .eq("slug", params.slug)
    .is("deletedAt", null)
    .single();

  if (!bootcamp) notFound();

  const isPast = new Date(bootcamp.eventDate).getTime() <= Date.now();
  const isEarlyBird = bootcamp.earlyBirdDeadline && new Date() < new Date(bootcamp.earlyBirdDeadline);

  return (
    <div style={{ background: "#F7FAFC", minHeight: "100vh", paddingBottom: 100 }}>
      {/* HEADER HERO */}
      <section style={{ background: "linear-gradient(135deg, #0A7E8C, #065F6A)", padding: "140px 20px 40px", color: "white", position: "relative", overflow: "hidden" }}>
        
        {bootcamp.coverImageUrl && (
          <div style={{ position: "absolute", inset: 0, opacity: 0.1, zIndex: 0 }}>
            <Image src={bootcamp.coverImageUrl} alt={bootcamp.title} fill style={{ objectFit: "cover" }} />
          </div>
        )}

        <div className="container" style={{ maxWidth: 1000, margin: "0 auto", position: "relative", zIndex: 1 }}>
          <Link href="/bootcamp" style={{ display: "inline-flex", alignItems: "center", gap: 6, color: "rgba(255,255,255,0.7)", fontSize: 14, fontFamily: "'DM Sans', sans-serif", fontWeight: 700, textDecoration: "none", marginBottom: 24 }}>
            <ChevronRight size={16} style={{ transform: "rotate(180deg)" }} /> Back to Programs
          </Link>

          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20 }}>
            <span style={{ background: "rgba(245,130,13,0.2)", color: "#F5820D", padding: "6px 14px", borderRadius: 8, fontSize: 13, fontWeight: 800, letterSpacing: "0.05em", fontFamily: "'DM Sans', sans-serif" }}>
              {bootcamp.category}
            </span>
            {isPast && (
              <span style={{ background: "rgba(255,255,255,0.2)", color: "white", padding: "6px 14px", borderRadius: 8, fontSize: 13, fontWeight: 800, letterSpacing: "0.05em", fontFamily: "'DM Sans', sans-serif" }}>
                COMPLETED
              </span>
            )}
          </div>

          <h1 style={{ fontFamily: "'Nunito', sans-serif", fontWeight: 900, fontSize: "clamp(32px, 5vw, 48px)", margin: "0 0 20px", lineHeight: 1.2, maxWidth: 800 }}>
            {bootcamp.title}
          </h1>
          <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "clamp(16px, 2vw, 20px)", opacity: 0.9, maxWidth: 700, margin: "0 0 40px", lineHeight: 1.6 }}>
            {bootcamp.shortDescription}
          </p>

          <div style={{ display: "flex", flexWrap: "wrap", gap: 20, padding: "20px 0", borderTop: "1px solid rgba(255,255,255,0.1)", borderBottom: "1px solid rgba(255,255,255,0.1)" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <div style={{ width: 44, height: 44, borderRadius: "50%", background: "rgba(255,255,255,0.1)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Calendar size={20} color="white" />
              </div>
              <div>
                <div style={{ fontSize: 12, color: "rgba(255,255,255,0.6)", fontFamily: "'DM Sans', sans-serif", fontWeight: 700, marginBottom: 2 }}>DATE</div>
                <div style={{ fontSize: 15, fontWeight: 600, fontFamily: "'DM Sans', sans-serif" }}>{new Date(bootcamp.eventDate).toLocaleDateString("en-IN", { month: "long", day: "numeric", year: "numeric" })}</div>
              </div>
            </div>
            
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <div style={{ width: 44, height: 44, borderRadius: "50%", background: "rgba(255,255,255,0.1)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Clock size={20} color="white" />
              </div>
              <div>
                <div style={{ fontSize: 12, color: "rgba(255,255,255,0.6)", fontFamily: "'DM Sans', sans-serif", fontWeight: 700, marginBottom: 2 }}>TIME</div>
                <div style={{ fontSize: 15, fontWeight: 600, fontFamily: "'DM Sans', sans-serif" }}>{bootcamp.startTime} - {bootcamp.endTime} IST</div>
              </div>
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <div style={{ width: 44, height: 44, borderRadius: "50%", background: "rgba(255,255,255,0.1)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                {bootcamp.eventType === "ONLINE" ? <Video size={20} color="white" /> : <MapPin size={20} color="white" />}
              </div>
              <div>
                <div style={{ fontSize: 12, color: "rgba(255,255,255,0.6)", fontFamily: "'DM Sans', sans-serif", fontWeight: 700, marginBottom: 2 }}>LOCATION</div>
                <div style={{ fontSize: 15, fontWeight: 600, fontFamily: "'DM Sans', sans-serif" }}>{bootcamp.eventType === "ONLINE" ? bootcamp.platform : "In-Person Event"}</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CONTENT */}
      <div className="container" style={{ maxWidth: 1000, margin: "40px auto 0", padding: "0 20px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: 40, '@media (min-width: 768px)': { gridTemplateColumns: "1fr 400px" } } as any}>
          
          {/* LEFT: DETAILS */}
          <div>
            <div style={{ background: "white", borderRadius: 24, padding: "32px", boxShadow: "0 10px 30px rgba(10,126,140,0.05)", marginBottom: 32 }}>
              <h2 style={{ fontFamily: "'Nunito', sans-serif", fontWeight: 800, fontSize: 24, color: "#1A2B35", margin: "0 0 20px" }}>
                About this Program
              </h2>
              <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 16, color: "#4A5568", lineHeight: 1.8, whiteSpace: "pre-wrap" }}>
                {bootcamp.fullDescription}
              </div>
            </div>

            {(bootcamp.learningOutcomes || bootcamp.whatIsIncluded) && (
              <div style={{ background: "white", borderRadius: 24, padding: "32px", boxShadow: "0 10px 30px rgba(10,126,140,0.05)" }}>
                {bootcamp.learningOutcomes && (
                  <div style={{ marginBottom: 32 }}>
                    <h3 style={{ fontFamily: "'Nunito', sans-serif", fontWeight: 800, fontSize: 20, color: "#1A2B35", margin: "0 0 16px" }}>
                      What You'll Learn
                    </h3>
                    <ul style={{ padding: 0, margin: 0, listStyle: "none", display: "flex", flexDirection: "column", gap: 12 }}>
                      {(Array.isArray(bootcamp.learningOutcomes) ? bootcamp.learningOutcomes : [bootcamp.learningOutcomes]).map((item: string, i: number) => (
                        <li key={i} style={{ display: "flex", alignItems: "flex-start", gap: 12, fontFamily: "'DM Sans', sans-serif", fontSize: 15, color: "#4A5568", lineHeight: 1.6 }}>
                          <CheckCircle size={20} color="#22C55E" style={{ flexShrink: 0, marginTop: 2 }} />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}
            
            <div style={{ background: "linear-gradient(135deg, #0A7E8C, #1A2B35)", borderRadius: 24, padding: "32px", marginTop: 32, display: "flex", gap: 20, alignItems: "center" }}>
              <div style={{ width: 80, height: 80, borderRadius: "50%", background: "white", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <Image src="/images/dr-prasoon.jpg" alt="Dr. Prasoon" width={80} height={80} style={{ borderRadius: "50%", objectFit: "cover" }} />
              </div>
              <div>
                <h3 style={{ fontFamily: "'Nunito', sans-serif", fontWeight: 800, fontSize: 20, color: "white", margin: "0 0 8px" }}>
                  Hosted by Dr. Prasoon Gupta
                </h3>
                <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 14, color: "rgba(255,255,255,0.8)", margin: 0, lineHeight: 1.5 }}>
                  Pediatric Occupational Therapist with 3+ years of experience helping children reach their developmental milestones.
                </p>
              </div>
            </div>
          </div>

          {/* RIGHT: REGISTRATION FORM */}
          <div>
            <div style={{ position: "sticky", top: 100 }}>
              {isPast ? (
                <div style={{ background: "white", borderRadius: 20, padding: 32, boxShadow: "0 10px 40px rgba(10,126,140,0.08)", border: "1px solid #E2EBF0", textAlign: "center" }}>
                  <div style={{ display: "inline-flex", width: 64, height: 64, borderRadius: "50%", background: "#F1F5F9", alignItems: "center", justifyContent: "center", marginBottom: 20 }}>
                    <Calendar size={32} color="#64748B" />
                  </div>
                  <h3 style={{ fontFamily: "'Nunito', sans-serif", fontWeight: 800, fontSize: 22, color: "#1A2B35", margin: "0 0 12px" }}>
                    This Event Has Ended
                  </h3>
                  <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 15, color: "#6B7C8A", margin: "0 0 24px" }}>
                    Subscribe to our newsletter or check our Programs page for upcoming events.
                  </p>
                  <Link href="/bootcamp" style={{ display: "inline-block", background: "#0A7E8C", color: "white", textDecoration: "none", padding: "12px 24px", borderRadius: 10, fontWeight: 700, fontFamily: "'DM Sans', sans-serif" }}>
                    View All Programs
                  </Link>
                </div>
              ) : (
                <BootcampRegistrationForm bootcamp={bootcamp} />
              )}
            </div>
          </div>
          
        </div>
      </div>
    </div>
  );
}
