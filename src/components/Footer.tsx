"use client";
import Link from "next/link";
import Logo from "./shared/Logo";
import { MapPin, Phone, Mail, Clock } from "lucide-react";

function InstagramIcon({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
    </svg>
  );
}

function WhatsAppIcon({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
    </svg>
  );
}

const services = [
  { label: "Occupational Therapy", href: "/services/occupational-therapy" },
  { label: "Pediatric Therapy",    href: "/services/pediatric-therapy" },
  { label: "Sensory Integration",  href: "/services/sensory-integration" },
  { label: "Online Therapy",       href: "/services/online-therapy" },
];
const pages = [
  { label: "Book Appointment",  href: "/book" },
  { label: "Blog",              href: "/blog" },
  { label: "About Us",          href: "/about" },
  { label: "Contact",           href: "/contact" },
  { label: "For Therapists",    href: "/join-as-therapist" },
  { label: "International",     href: "/international" },
];

const portals = [
  { label: "Parent Portal",  href: "/portal/login",  color: "#0D9BAC" },
  { label: "Admin Panel",    href: "/admin",          color: "#a78bd4" },
];

const S: React.CSSProperties = { fontFamily: "'DM Sans',sans-serif", fontSize: 13, color: "rgba(255,255,255,0.55)", lineHeight: 2, textDecoration: "none", display: "block", transition: "color 0.15s" };

export default function Footer() {
  return (
    <footer style={{ background: "#0D1117", color: "white" }}>
      <div className="container" style={{ paddingTop: 64, paddingBottom: 40 }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 40, marginBottom: 48 }}>
          {/* Brand */}
          <div style={{ gridColumn: "span 1" }}>
            <div style={{ marginBottom: 16 }}><Logo variant="light" /></div>
            <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 13, color: "rgba(255,255,255,0.5)", lineHeight: 1.75, marginBottom: 4 }}>Small Steps. Strong Wings.</p>
            <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 13, color: "rgba(255,255,255,0.4)", lineHeight: 1.75, marginBottom: 20 }}>Expert pediatric occupational therapy, online across India and worldwide.</p>
            <div style={{ display: "flex", gap: 12 }}>
              {[
                { href: "https://instagram.com/udaancare", icon: <InstagramIcon />, label: "Instagram" },
                { href: "https://wa.me/918349764084", icon: <WhatsAppIcon />, label: "WhatsApp" },
              ].map((s) => (
                <a key={s.label} href={s.href} target="_blank" rel="noopener noreferrer" aria-label={s.label}
                  style={{ width: 38, height: 38, borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center", background: "rgba(255,255,255,0.08)", color: "rgba(255,255,255,0.6)", transition: "all 0.2s", textDecoration: "none" }}
                  onMouseEnter={(e) => { e.currentTarget.style.background = "var(--color-primary)"; e.currentTarget.style.color = "white"; }}
                  onMouseLeave={(e) => { e.currentTarget.style.background = "rgba(255,255,255,0.08)"; e.currentTarget.style.color = "rgba(255,255,255,0.6)"; }}
                >{s.icon}</a>
              ))}
            </div>
          </div>

          {/* Services */}
          <div>
            <div style={{ fontFamily: "'DM Sans',sans-serif", fontWeight: 600, fontSize: 11, textTransform: "uppercase", letterSpacing: "0.1em", color: "rgba(255,255,255,0.35)", marginBottom: 16 }}>Services</div>
            {services.map((l) => (
              <Link key={l.href} href={l.href} style={S}
                onMouseEnter={(e) => { (e.target as HTMLElement).style.color = "var(--color-primary-mid)"; }}
                onMouseLeave={(e) => { (e.target as HTMLElement).style.color = "rgba(255,255,255,0.55)"; }}
              >{l.label}</Link>
            ))}
          </div>

          {/* Pages */}
          <div>
            <div style={{ fontFamily: "'DM Sans',sans-serif", fontWeight: 600, fontSize: 11, textTransform: "uppercase", letterSpacing: "0.1em", color: "rgba(255,255,255,0.35)", marginBottom: 16 }}>Pages</div>
            {pages.map((l) => (
              <Link key={l.href} href={l.href} style={S}
                onMouseEnter={(e) => { (e.target as HTMLElement).style.color = "var(--color-primary-mid)"; }}
                onMouseLeave={(e) => { (e.target as HTMLElement).style.color = "rgba(255,255,255,0.55)"; }}
              >{l.label}</Link>
            ))}
          </div>

          {/* Portals */}
          <div>
            <div style={{ fontFamily: "'DM Sans',sans-serif", fontWeight: 600, fontSize: 11, textTransform: "uppercase", letterSpacing: "0.1em", color: "rgba(255,255,255,0.35)", marginBottom: 16 }}>Portals</div>
            {portals.map((l) => (
              <Link key={l.href} href={l.href}
                style={{ ...S, color: l.color, fontWeight: 600 }}
                onMouseEnter={(e) => { (e.target as HTMLElement).style.opacity = "0.7"; }}
                onMouseLeave={(e) => { (e.target as HTMLElement).style.opacity = "1"; }}
              >{l.label}</Link>
            ))}
            <div style={{ marginTop: 16, padding: "10px 14px", borderRadius: 10, background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)" }}>
              <div style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 11, color: "rgba(255,255,255,0.3)", lineHeight: 1.6 }}>
                Parents: use your Patient ID and PIN to track your child's progress.
              </div>
            </div>
          </div>

          {/* Contact */}
          <div>
            <div style={{ fontFamily: "'DM Sans',sans-serif", fontWeight: 600, fontSize: 11, textTransform: "uppercase", letterSpacing: "0.1em", color: "rgba(255,255,255,0.35)", marginBottom: 16 }}>Contact</div>
            {[
              { icon: <MapPin size={14} />, text: "Sai Kripa, Garg Chowraha, Katni MP 483501" },
              { icon: <Phone size={14} />, text: "+91 83497 64084", href: "tel:+918349764084" },
              { icon: <Mail size={14} />,  text: "care@udaan.in",   href: "mailto:care@udaan.in" },
              { icon: <Clock size={14} />, text: "Mon–Sat: 10 AM – 7 PM" },
            ].map((item, i) => (
              <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 8, marginBottom: 12 }}>
                <span style={{ color: "var(--color-primary-mid)", marginTop: 2, flexShrink: 0 }}>{item.icon}</span>
                {item.href
                  ? <a href={item.href} style={{ ...S, display: "inline" }}>{item.text}</a>
                  : <span style={{ ...S, display: "inline" }}>{item.text}</span>
                }
              </div>
            ))}
          </div>
        </div>

        {/* Bottom bar */}
        <div style={{ borderTop: "1px solid rgba(255,255,255,0.08)", paddingTop: 24, display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "space-between", gap: 12 }}>
          <span style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 12, color: "rgba(255,255,255,0.3)" }}>
            © 2025 Udaan Care · udaancare.in · Katni, Madhya Pradesh, India
          </span>
          <div style={{ display: "flex", gap: 20 }}>
            {[{ label: "Privacy Policy", href: "/privacy" }, { label: "Terms of Service", href: "/terms" }, { label: "Refund Policy", href: "/refund" }].map((l) => (
              <Link key={l.href} href={l.href} style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 12, color: "rgba(255,255,255,0.3)", textDecoration: "none", transition: "color 0.15s" }}
                onMouseEnter={(e) => { (e.target as HTMLElement).style.color = "rgba(255,255,255,0.6)"; }}
                onMouseLeave={(e) => { (e.target as HTMLElement).style.color = "rgba(255,255,255,0.3)"; }}
              >{l.label}</Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
