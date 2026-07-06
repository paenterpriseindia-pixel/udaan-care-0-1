import Link from "next/link";
import { Calendar, ChevronRight } from "lucide-react";
import { supabase } from "@/lib/supabase";

export default async function BootcampTeaser() {
  const { data: featured } = await supabase
    .from("bootcamps")
    .select("slug, title, eventDate, startTime, category")
    .eq("isFeatured", true)
    .eq("isPublished", true)
    .is("deletedAt", null)
    .single();

  if (!featured) return null;

  return (
    <section style={{ background: "linear-gradient(135deg, #0A7E8C, #1A2B35)", padding: "32px 20px" }}>
      <div className="container" style={{ maxWidth: 1000, margin: "0 auto", display: "flex", flexDirection: "column", gap: 20, alignItems: "center", justifyContent: "space-between" }}>
        
        <div style={{ textAlign: "center" }}>
          <div style={{ display: "inline-block", background: "rgba(245,130,13,0.2)", color: "#F5820D", padding: "4px 12px", borderRadius: 30, fontSize: 11, fontWeight: 800, letterSpacing: "0.08em", marginBottom: 12, fontFamily: "'DM Sans', sans-serif" }}>
            {featured.category}
          </div>
          <h2 style={{ fontFamily: "'Nunito', sans-serif", fontWeight: 800, fontSize: 24, color: "white", margin: "0 0 8px" }}>
            {featured.title}
          </h2>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 10, color: "rgba(255,255,255,0.7)", fontSize: 14, fontFamily: "'DM Sans', sans-serif" }}>
            <Calendar size={16} color="rgba(255,255,255,0.5)" />
            {new Date(featured.eventDate).toLocaleDateString("en-IN", { month: "short", day: "numeric", year: "numeric" })} · {featured.startTime} IST
          </div>
        </div>

        <Link href={`/bootcamp/${featured.slug}`} style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "#F5820D", color: "white", padding: "12px 24px", borderRadius: 30, fontSize: 15, fontWeight: 700, fontFamily: "'DM Sans', sans-serif", textDecoration: "none" }}>
          Register Now <ChevronRight size={16} />
        </Link>
        
      </div>
      <style dangerouslySetInnerHTML={{ __html: `
        @media (min-width: 768px) {
          section > div { flex-direction: row !important; text-align: left !important; }
          section > div > div { text-align: left !important; }
        }
      `}} />
    </section>
  );
}
