"use client";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTheme } from "next-themes";
import { useCurrency } from "@/context/CurrencyContext";
import Logo from "./shared/Logo";
import {
  Menu, X, ChevronDown, Moon, Sun, Phone,
  Activity, Heart, Brain, Video, ShieldCheck, Users,
} from "lucide-react";

const services = [
  { label: "Occupational Therapy", href: "/services/occupational-therapy", icon: Activity, desc: "Goal-oriented daily living skills" },
  { label: "Pediatric Therapy",    href: "/services/pediatric-therapy",    icon: Heart,   desc: "Play-based developmental support" },
  { label: "Sensory Integration",  href: "/services/sensory-integration",  icon: Brain,   desc: "Sensory regulation and processing" },
  { label: "Online Therapy",       href: "/services/online-therapy",       icon: Video,   desc: "Expert sessions via Zoom" },
];

export default function Navbar() {
  const pathname = usePathname();
  const { resolvedTheme, setTheme } = useTheme();
  const { currency, setCurrency } = useCurrency();
  const [drawer, setDrawer] = useState(false);
  const [dropdown, setDropdown] = useState(false);
  const [mounted, setMounted] = useState(false);


  useEffect(() => setMounted(true), []);
  useEffect(() => { setDrawer(false); }, [pathname]);


  const isDark = mounted && resolvedTheme === "dark";
  const onDark = isDark; // glass navbar: dark text on light, white text on dark


  const isActive = (href: string) =>
    pathname === href || (href !== "/" && pathname.startsWith(href));

  return (
    <>
      {/* ── NAV BAR ── */}
      <nav
        aria-label="Main navigation"
        style={{
          position: "fixed", top: 0, left: 0, right: 0, zIndex: 50,
          height: 68,
          display: "flex", alignItems: "center",
          background: isDark
            ? "rgba(10,14,20,0.92)"
            : "rgba(255,255,255,0.92)",
          backdropFilter: "blur(20px) saturate(180%)",
          WebkitBackdropFilter: "blur(20px) saturate(180%)",
          borderBottom: isDark
            ? "1.5px solid rgba(255,255,255,0.10)"
            : "1.5px solid rgba(10,126,140,0.18)",
          boxShadow: isDark
            ? "0 4px 28px rgba(0,0,0,0.35)"
            : "0 4px 28px rgba(10,126,140,0.10)",
          transition: "background 0.3s ease, box-shadow 0.3s ease",
        }}
      >

        {/* Full-width inner — CSS Grid 3-zone: [logo | center-nav | actions] */}
        <div className="nav-grid" style={{
          width: "100%",
          padding: "0 24px",
          alignItems: "center",
          height: "100%",
        }}>


          {/* ══ ZONE 1: Logo — hard left ══ */}
          <div style={{ display: "flex", alignItems: "center" }}>
            <Logo variant={onDark ? "light" : "auto"} size="md" />
          </div>

          {/* ══ ZONE 2: Main Nav — mathematically centered ══ */}

          <div className="hide-mobile" style={{
            display: "flex",
            alignItems: "center",
            gap: 4,
          }}>
            <NavLink href="/"        active={isActive("/")}        onDark={onDark} exact>Home</NavLink>
            <NavLink href="/about"   active={isActive("/about")}   onDark={onDark}>About</NavLink>

            {/* Services dropdown */}
            <div style={{ position: "relative" }}
              onMouseEnter={() => setDropdown(true)}
              onMouseLeave={() => setDropdown(false)}
            >
              <button style={{
                display: "flex", alignItems: "center", gap: 5,
                padding: "8px 14px", borderRadius: 8, border: "none", cursor: "pointer",
                fontFamily: "'DM Sans',sans-serif", fontWeight: 700, fontSize: 14,
                background: "transparent", whiteSpace: "nowrap",
                color: onDark
                  ? (isActive("/services") ? "white" : "rgba(255,255,255,0.92)")
                  : (isActive("/services") ? "var(--color-primary)" : "var(--color-text-primary)"),
                transition: "all 0.2s",
              }}>
                Services
                <ChevronDown size={14} style={{ transition: "transform 0.25s", transform: dropdown ? "rotate(180deg)" : "none" }} />
              </button>

              {/* Dropdown panel */}
              <div style={{
                position: "absolute", top: "calc(100% + 8px)", left: "50%",
                width: 340, background: "var(--color-card)",
                border: "1px solid var(--color-border)", borderRadius: 16,
                boxShadow: "0 16px 48px rgba(0,0,0,0.14), 0 4px 12px rgba(0,0,0,0.06)",
                padding: 8, zIndex: 60,
                opacity: dropdown ? 1 : 0,
                pointerEvents: dropdown ? "auto" : "none",
                transform: `translateX(-50%) translateY(${dropdown ? 0 : -8}px)`,
                transition: "opacity 0.2s, transform 0.2s",
              }}>
                {services.map((s) => (
                  <Link key={s.href} href={s.href}
                    style={{ display: "flex", alignItems: "flex-start", gap: 12, padding: "12px 14px", borderRadius: 10, textDecoration: "none", transition: "background 0.15s" }}
                    onMouseEnter={e => (e.currentTarget.style.background = "var(--color-primary-light)")}
                    onMouseLeave={e => (e.currentTarget.style.background = "transparent")}
                  >
                    <div style={{ width: 38, height: 38, borderRadius: 9, background: "var(--color-primary-light)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                      <s.icon size={18} style={{ color: "var(--color-primary)" }} />
                    </div>
                    <div>
                      <div style={{ fontFamily: "'DM Sans',sans-serif", fontWeight: 600, fontSize: 14, color: "var(--color-text-primary)" }}>{s.label}</div>
                      <div style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 12, color: "var(--color-text-secondary)", marginTop: 2 }}>{s.desc}</div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>

            <NavLink href="/blog"    active={isActive("/blog")}    onDark={onDark}>Blog</NavLink>
            <NavLink href="/contact" active={isActive("/contact")} onDark={onDark}>Contact</NavLink>
          </div>

          {/* ══ ZONE 3: Actions — hard right ══ */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "flex-end", gap: 8 }}>

            {/* Portal pills */}
            <div className="hide-mobile" style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <Link href="/portal/login" style={{
                display: "inline-flex", alignItems: "center", gap: 6,
                padding: "8px 14px", borderRadius: 10, textDecoration: "none",
                fontFamily: "'DM Sans',sans-serif", fontWeight: 600, fontSize: 13,
                background: "rgba(26,175,230,0.10)",
                color: onDark ? "#5BC8F0" : "var(--color-primary)",
                border: "1px solid rgba(26,175,230,0.22)",
                transition: "all 0.2s", whiteSpace: "nowrap",
              }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = "rgba(26,175,230,0.22)"; }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = "rgba(26,175,230,0.10)"; }}
              >
                <Users size={13} /> Portal
              </Link>
              <Link href="/admin" style={{
                display: "inline-flex", alignItems: "center", gap: 6,
                padding: "8px 14px", borderRadius: 10, textDecoration: "none",
                fontFamily: "'DM Sans',sans-serif", fontWeight: 600, fontSize: 13,
                background: "rgba(171,71,188,0.08)",
                color: onDark ? "#CE93D8" : "var(--color-purple)",
                border: "1px solid rgba(171,71,188,0.22)",
                transition: "all 0.2s", whiteSpace: "nowrap",
              }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = "rgba(171,71,188,0.18)"; }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = "rgba(171,71,188,0.08)"; }}
              >
                <ShieldCheck size={13} /> Admin
              </Link>
            </div>

            {/* Thin divider */}
            <div className="hide-mobile" style={{ width: 1, height: 24, background: onDark ? "rgba(255,255,255,0.15)" : "var(--color-border)", margin: "0 2px" }} />

            {/* Theme toggle */}
            {mounted && (
              <button
                onClick={() => setTheme(isDark ? "light" : "dark")}
                aria-label="Toggle theme"
                style={{
                  width: 38, height: 38, borderRadius: 10, border: "none",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  cursor: "pointer", background: "transparent",
                  color: onDark ? "rgba(255,255,255,0.75)" : "var(--color-text-secondary)",
                  transition: "all 0.2s",
                }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = onDark ? "rgba(255,255,255,0.1)" : "var(--color-primary-light)"; (e.currentTarget as HTMLElement).style.color = onDark ? "white" : "var(--color-primary)"; }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = "transparent"; (e.currentTarget as HTMLElement).style.color = onDark ? "rgba(255,255,255,0.75)" : "var(--color-text-secondary)"; }}
              >
                {isDark ? <Sun size={18} /> : <Moon size={18} />}
              </button>
            )}

            {/* Currency toggle */}
            <div className="hide-mobile" style={{ display: "flex", background: onDark ? "rgba(255,255,255,0.08)" : "var(--color-primary-light)", borderRadius: 10, padding: 3, gap: 2 }}>
              {(["INR", "USD"] as const).map(c => (
                <button key={c} onClick={() => setCurrency(c)} style={{
                  padding: "5px 11px", borderRadius: 8, border: "none", cursor: "pointer",
                  fontFamily: "'DM Sans',sans-serif", fontWeight: 700, fontSize: 12,
                  transition: "all 0.2s",
                  background: currency === c ? "var(--color-primary)" : "transparent",
                  color: currency === c ? "white" : onDark ? "rgba(255,255,255,0.6)" : "var(--color-text-secondary)",
                  boxShadow: currency === c ? "0 2px 8px rgba(26,175,230,0.35)" : "none",
                }}>
                  {c === "INR" ? "₹" : "$"}
                </button>
              ))}
            </div>

            {/* Book Now CTA */}
            <Link href="/book" className="btn btn-primary hide-mobile"
              style={{ fontSize: 14, padding: "10px 22px", whiteSpace: "nowrap" }}>
              Book Now
            </Link>

            {/* Hamburger — mobile only */}
            <button onClick={() => setDrawer(true)} aria-label="Open menu"
              className="hide-desktop"
              style={{
                width: 44, height: 44, borderRadius: 10, border: "none",
                display: "flex", alignItems: "center", justifyContent: "center",
                cursor: "pointer", background: "transparent",
                color: onDark ? "white" : "var(--color-text-primary)",
              }}
            >
              <Menu size={22} />
            </button>
          </div>
        </div>
      </nav>

      {/* ── MOBILE DRAWER ── */}

      {drawer && (
        <div style={{ position: "fixed", inset: 0, zIndex: 100 }} onClick={() => setDrawer(false)}>
          <div style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.55)", backdropFilter: "blur(4px)", animation: "fade-in 0.2s ease" }} />
          <div
            onClick={e => e.stopPropagation()}
            style={{
              position: "absolute", top: 0, right: 0, bottom: 0,
              width: 300, maxWidth: "88vw",
              background: "var(--color-card)",
              display: "flex", flexDirection: "column",
              boxShadow: "-12px 0 40px rgba(0,0,0,0.2)",
              animation: "slide-in-right 0.3s ease",
            }}
          >
            {/* Header */}
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "18px 20px 14px", borderBottom: "1px solid var(--color-border)" }}>
              <Logo size="sm" />
              <button onClick={() => setDrawer(false)}
                style={{ width: 38, height: 38, borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center", background: "var(--color-bg)", border: "none", cursor: "pointer", color: "var(--color-text-secondary)" }}>
                <X size={18} />
              </button>
            </div>

            {/* Scroll area */}
            <div style={{ flex: 1, overflowY: "auto", padding: "8px 12px" }}>
              {[{ label: "Home", href: "/" }, { label: "About", href: "/about" }, { label: "Blog", href: "/blog" }, { label: "Contact", href: "/contact" }].map(l => (
                <DrawerLink key={l.href} href={l.href} active={pathname === l.href}>{l.label}</DrawerLink>
              ))}

              <div style={{ padding: "10px 12px 4px", fontFamily: "'DM Sans',sans-serif", fontSize: 11, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.1em", color: "var(--color-text-secondary)", marginTop: 4 }}>Services</div>
              {services.map(s => (
                <Link key={s.href} href={s.href}
                  style={{ display: "flex", alignItems: "center", gap: 10, padding: "12px", borderRadius: 10, textDecoration: "none", minHeight: 50, fontFamily: "'DM Sans',sans-serif", fontWeight: 500, fontSize: 14, color: "var(--color-text-primary)", transition: "background 0.15s" }}
                  onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = "var(--color-primary-light)"; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = "transparent"; }}
                >
                  <s.icon size={15} style={{ color: "var(--color-primary)", flexShrink: 0 }} />
                  {s.label}
                </Link>
              ))}

              <div style={{ height: 1, background: "var(--color-border)", margin: "10px 0" }} />
              {[{ label: "International", href: "/international" }, { label: "For Therapists", href: "/join-as-therapist" }].map(l => (
                <DrawerLink key={l.href} href={l.href} active={pathname === l.href} secondary>{l.label}</DrawerLink>
              ))}

              {/* Portals section */}
              <div style={{ height: 1, background: "var(--color-border)", margin: "10px 0" }} />
              <div style={{ padding: "10px 12px 4px", fontFamily: "'DM Sans',sans-serif", fontSize: 11, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.1em", color: "var(--color-text-secondary)", marginTop: 4 }}>Portals</div>
              <Link href="/portal/login"
                style={{ display: "flex", alignItems: "center", gap: 10, padding: "12px", borderRadius: 10, textDecoration: "none", fontFamily: "'DM Sans',sans-serif", fontWeight: 600, fontSize: 14, color: "var(--color-primary)", transition: "background 0.15s" }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = "var(--color-primary-light)"; }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = "transparent"; }}
              >
                <div style={{ width: 32, height: 32, borderRadius: 8, background: "var(--color-primary-light)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <Users size={14} style={{ color: "var(--color-primary)" }} />
                </div>
                Parent Portal
              </Link>
              <Link href="/admin"
                style={{ display: "flex", alignItems: "center", gap: 10, padding: "12px", borderRadius: 10, textDecoration: "none", fontFamily: "'DM Sans',sans-serif", fontWeight: 600, fontSize: 14, color: "#6B3FA0", transition: "background 0.15s" }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = "rgba(107,63,160,0.08)"; }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = "transparent"; }}
              >
                <div style={{ width: 32, height: 32, borderRadius: 8, background: "rgba(107,63,160,0.1)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <ShieldCheck size={14} style={{ color: "#6B3FA0" }} />
                </div>
                Admin Panel
              </Link>

              {/* Toggles */}
              <div style={{ borderTop: "1px solid var(--color-border)", marginTop: 12, paddingTop: 16, display: "flex", flexDirection: "column", gap: 14, padding: "16px 4px 0" }}>
                {mounted && (
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <span style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 14, color: "var(--color-text-primary)" }}>
                      {isDark ? "Dark Mode" : "Light Mode"}
                    </span>
                    <button onClick={() => setTheme(isDark ? "light" : "dark")}
                      style={{ width: 48, height: 26, borderRadius: 13, position: "relative", border: "none", cursor: "pointer", background: isDark ? "var(--color-primary)" : "var(--color-border)", transition: "background 0.2s" }}>
                      <span style={{ position: "absolute", top: 3, left: isDark ? "calc(100% - 22px)" : 3, width: 20, height: 20, borderRadius: "50%", background: "white", transition: "left 0.25s", boxShadow: "0 1px 4px rgba(0,0,0,0.2)" }} />
                    </button>
                  </div>
                )}
                <div>
                  <div style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 11, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.08em", color: "var(--color-text-secondary)", marginBottom: 8 }}>Currency</div>
                  <div style={{ display: "flex", gap: 8 }}>
                    {(["INR", "USD"] as const).map(c => (
                      <button key={c} onClick={() => setCurrency(c)}
                        style={{ flex: 1, padding: "10px", borderRadius: 10, border: "1.5px solid", cursor: "pointer", fontFamily: "'DM Sans',sans-serif", fontWeight: 600, fontSize: 13, transition: "all 0.2s", borderColor: currency === c ? "var(--color-primary)" : "var(--color-border)", background: currency === c ? "var(--color-primary)" : "transparent", color: currency === c ? "white" : "var(--color-text-secondary)" }}>
                        {c === "INR" ? "₹ India" : "$ USD"}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Footer CTA */}
            <div style={{ padding: "14px 20px 28px", borderTop: "1px solid var(--color-border)", display: "flex", flexDirection: "column", gap: 10 }}>
              <Link href="/book" className="btn btn-primary" style={{ width: "100%", justifyContent: "center", padding: "14px", fontSize: 15 }}>
                Book Consultation
              </Link>
              <a href="tel:+918349764084"
                style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8, padding: "11px", borderRadius: 10, border: "1.5px solid var(--color-border)", textDecoration: "none", fontFamily: "'DM Sans',sans-serif", fontWeight: 500, fontSize: 14, color: "var(--color-primary)", transition: "all 0.2s" }}>
                <Phone size={14} /> +91 83497 64084
              </a>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

/* ── Small reusable link components ── */
function NavLink({ href, active, onDark, children, exact }: { href: string; active: boolean; onDark: boolean; children: React.ReactNode; exact?: boolean }) {
  return (
    <Link href={href} style={{
      padding: "8px 14px", borderRadius: 8, textDecoration: "none",
      fontFamily: "'DM Sans',sans-serif", fontWeight: 700, fontSize: 14,
      transition: "all 0.2s",
      whiteSpace: "nowrap",
      color: active
        ? (onDark ? "white" : "var(--color-primary)")
        : (onDark ? "rgba(255,255,255,0.92)" : "var(--color-text-primary)"),
      background: active && !onDark ? "var(--color-primary-light)" : "transparent",
    }}
      onMouseEnter={e => {
        if (!active) {
          (e.currentTarget as HTMLElement).style.color = onDark ? "white" : "var(--color-primary)";
          (e.currentTarget as HTMLElement).style.background = onDark ? "rgba(255,255,255,0.10)" : "var(--color-primary-light)";
        }
      }}
      onMouseLeave={e => {
        if (!active) {
          (e.currentTarget as HTMLElement).style.color = onDark ? "rgba(255,255,255,0.92)" : "var(--color-text-primary)";
          (e.currentTarget as HTMLElement).style.background = "transparent";
        }
      }}
    >
      {children}
    </Link>
  );
}


function SmallLink({ href, active, onDark, children }: { href: string; active: boolean; onDark: boolean; children: React.ReactNode }) {
  return (
    <Link href={href} style={{
      padding: "6px 12px", borderRadius: 6, textDecoration: "none",
      fontFamily: "'DM Sans',sans-serif", fontWeight: 500, fontSize: 13,
      transition: "all 0.2s",
      whiteSpace: "nowrap",
      color: active
        ? (onDark ? "white" : "var(--color-primary)")
        : (onDark ? "rgba(255,255,255,0.55)" : "var(--color-text-secondary)"),
    }}
      onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = onDark ? "white" : "var(--color-primary)"; }}
      onMouseLeave={e => {
        if (!active) (e.currentTarget as HTMLElement).style.color = onDark ? "rgba(255,255,255,0.55)" : "var(--color-text-secondary)";
      }}
    >
      {children}
    </Link>
  );
}

function DrawerLink({ href, active, children, secondary }: { href: string; active: boolean; children: React.ReactNode; secondary?: boolean }) {
  return (
    <Link href={href} style={{
      display: "flex", alignItems: "center",
      padding: "13px 12px", borderRadius: 10, textDecoration: "none",
      fontFamily: "'DM Sans',sans-serif", fontWeight: secondary ? 500 : 600,
      fontSize: secondary ? 14 : 15, minHeight: 52,
      color: active ? "var(--color-primary)" : "var(--color-text-primary)",
      background: active ? "var(--color-primary-light)" : "transparent",
      transition: "background 0.15s",
    }}
      onMouseEnter={e => { if (!active) (e.currentTarget as HTMLElement).style.background = "var(--color-primary-light)"; }}
      onMouseLeave={e => { if (!active) (e.currentTarget as HTMLElement).style.background = "transparent"; }}
    >
      {children}
    </Link>
  );
}
