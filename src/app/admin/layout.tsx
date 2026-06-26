"use client";
import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import {
  LayoutDashboard, Users, Calendar, BookOpen, Settings,
  Image as ImageIcon, UserPlus, BarChart3, Menu, X, LogOut,
  ChevronRight, Stethoscope, FileText, CalendarClock, TrendingUp,
  MessageCircle, ClipboardList, Building2, Video, CreditCard
} from "lucide-react";



import LogoImg from "@/components/shared/LogoImg";

const NAV = [
  { href: "/admin/dashboard",  label: "Dashboard",    icon: LayoutDashboard, group: "main" },
  { href: "/admin/patients",   label: "Patients",      icon: Users,           group: "main" },
  { href: "/admin/bookings",   label: "Bookings",      icon: Calendar,        group: "main" },
  { href: "/admin/payments",   label: "Payments",      icon: CreditCard,      group: "main" },
  { href: "/admin/doctors",    label: "Doctors",       icon: Stethoscope,     group: "main" },
  { href: "/admin/schedule",   label: "My Schedule",   icon: CalendarClock,   group: "clinic" },
  { href: "/admin/leads",      label: "Leads",         icon: TrendingUp,      group: "clinic" },
  { href: "/admin/staff",      label: "Staff Tracker", icon: ClipboardList,   group: "clinic" },
  { href: "/admin/attendance", label: "Attendance",    icon: Calendar,        group: "clinic" },
  { href: "/admin/branches",   label: "Branches",      icon: Building2,       group: "clinic" },
  { href: "/admin/blog",          label: "Blog",          icon: FileText,  group: "content" },
  { href: "/admin/testimonials",   label: "Testimonials",   icon: Video,     group: "content" },
  { href: "/admin/cms",            label: "Site Content",   icon: Settings,  group: "content" },
  { href: "/admin/upload",         label: "Images",         icon: ImageIcon, group: "content" },
  { href: "/admin/analytics",  label: "Analytics",     icon: BarChart3,       group: "reports" },
];




export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  if (pathname === "/admin/login") return <>{children}</>;

  const sidebarW = collapsed ? 64 : 240;

  const SidebarContent = () => (
    <div style={{ display: "flex", flexDirection: "column", height: "100%", padding: "0 0 16px" }}>
      {/* Logo area */}
      <div style={{ padding: "20px 16px", borderBottom: "1px solid rgba(255,255,255,0.07)", marginBottom: 8 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <LogoImg variant="light" height={80} style={{ flexShrink: 0 }} />



          {!collapsed && (
            <div style={{ fontSize: 11, fontWeight: 600, color: "rgba(255,255,255,0.4)", letterSpacing: "0.08em", whiteSpace: "nowrap" }}>
              ADMIN PANEL
            </div>
          )}
        </div>
      </div>

      {/* Nav groups */}
      {[
        { key: "main",    label: "Main" },
        { key: "clinic",  label: "Clinic" },
        { key: "content", label: "Content" },
        { key: "reports", label: "Reports" },
      ].map(group => {
        const items = NAV.filter(n => n.group === group.key);
        return (
          <div key={group.key} style={{ marginBottom: 4 }}>
            {!collapsed && (
              <div style={{ padding: "10px 16px 4px", fontSize: 10, fontWeight: 700, color: "rgba(255,255,255,0.25)", letterSpacing: "0.12em", textTransform: "uppercase" }}>
                {group.label}
              </div>
            )}
            {items.map(item => {
              const active = pathname.startsWith(item.href);
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileOpen(false)}
                  style={{
                    display: "flex", alignItems: "center", gap: 10,
                    padding: collapsed ? "11px 0" : "10px 14px",
                    justifyContent: collapsed ? "center" : "flex-start",
                    margin: "1px 8px", borderRadius: 10,
                    background: active ? "rgba(10,126,140,0.2)" : "transparent",
                    color: active ? "#0D9BAC" : "rgba(255,255,255,0.55)",
                    textDecoration: "none", fontSize: 14, fontWeight: active ? 700 : 500,
                    borderLeft: active ? "3px solid #0A7E8C" : "3px solid transparent",
                    transition: "all 0.15s",
                    whiteSpace: "nowrap",
                  }}
                  onMouseEnter={e => { if (!active) (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.06)"; }}
                  onMouseLeave={e => { if (!active) (e.currentTarget as HTMLElement).style.background = "transparent"; }}
                  title={collapsed ? item.label : undefined}
                >
                  <Icon size={17} style={{ flexShrink: 0 }} />
                  {!collapsed && item.label}
                </Link>
              );
            })}
          </div>
        );
      })}

      {/* Bottom actions */}
      <div style={{ marginTop: "auto", padding: "0 8px", borderTop: "1px solid rgba(255,255,255,0.07)", paddingTop: 16 }}>
        <a href="/" target="_blank" rel="noopener noreferrer"
          style={{ display: "flex", alignItems: "center", gap: 10, padding: collapsed ? "10px 0" : "10px 14px", justifyContent: collapsed ? "center" : "flex-start", margin: "0 0 4px", borderRadius: 10, color: "rgba(255,255,255,0.4)", fontSize: 13, textDecoration: "none", transition: "all 0.15s" }}
          onMouseEnter={e => (e.currentTarget.style.background = "rgba(255,255,255,0.05)")}
          onMouseLeave={e => (e.currentTarget.style.background = "transparent")}
          title="View Website"
        >
          <ChevronRight size={15} />
          {!collapsed && "View Website"}
        </a>
        <button
          onClick={() => signOut({ callbackUrl: "/admin/login" })}
          style={{ display: "flex", alignItems: "center", gap: 10, padding: collapsed ? "10px 0" : "10px 14px", justifyContent: collapsed ? "center" : "flex-start", width: "100%", borderRadius: 10, background: "none", border: "none", cursor: "pointer", color: "rgba(255,255,255,0.35)", fontSize: 13, transition: "all 0.15s" }}
          onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = "rgba(239,68,68,0.08)"; (e.currentTarget as HTMLElement).style.color = "#f87171"; }}
          onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = "transparent"; (e.currentTarget as HTMLElement).style.color = "rgba(255,255,255,0.35)"; }}
          title="Sign out"
        >
          <LogOut size={15} />
          {!collapsed && "Sign Out"}
        </button>
      </div>
    </div>
  );

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "#0D1117", fontFamily: "'DM Sans', sans-serif" }}>

      {/* ── Desktop Sidebar ── */}
      <aside
        className="hide-mobile"
        style={{
          width: sidebarW, flexShrink: 0,
          background: "rgba(255,255,255,0.03)",
          borderRight: "1px solid rgba(255,255,255,0.07)",
          position: "fixed", top: 0, left: 0, bottom: 0, zIndex: 50,
          overflowY: "auto", overflowX: "hidden",
          transition: "width 0.2s ease",
        }}
      >
        <SidebarContent />
      </aside>

      {/* ── Mobile drawer ── */}
      {mobileOpen && (
        <div style={{ position: "fixed", inset: 0, zIndex: 100 }}>
          <div style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.6)", backdropFilter: "blur(4px)" }} onClick={() => setMobileOpen(false)} />
          <aside style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: 240, background: "#0D1520", borderRight: "1px solid rgba(255,255,255,0.08)", overflowY: "auto" }}>
            <button onClick={() => setMobileOpen(false)} style={{ position: "absolute", top: 16, right: 16, background: "none", border: "none", cursor: "pointer", color: "white" }}>
              <X size={20} />
            </button>
            <SidebarContent />
          </aside>
        </div>
      )}

      {/* ── Main area ── */}
      <div style={{ marginLeft: sidebarW, flex: 1, display: "flex", flexDirection: "column", minWidth: 0 }} className="admin-main">

        {/* Topbar */}
        <header style={{
          position: "sticky", top: 0, zIndex: 40,
          background: "rgba(13,17,23,0.95)", backdropFilter: "blur(12px)",
          borderBottom: "1px solid rgba(255,255,255,0.06)",
          padding: "0 24px", height: 60,
          display: "flex", alignItems: "center", gap: 12,
        }}>
          {/* Collapse toggle (desktop) */}
          <button
            className="hide-mobile"
            onClick={() => setCollapsed(c => !c)}
            style={{ background: "none", border: "none", cursor: "pointer", color: "rgba(255,255,255,0.4)", padding: 6, borderRadius: 8, transition: "all 0.15s" }}
            onMouseEnter={e => (e.currentTarget.style.background = "rgba(255,255,255,0.08)")}
            onMouseLeave={e => (e.currentTarget.style.background = "transparent")}
          >
            <Menu size={18} />
          </button>
          {/* Mobile hamburger */}
          <button
            className="show-mobile-only"
            onClick={() => setMobileOpen(true)}
            style={{ background: "none", border: "none", cursor: "pointer", color: "rgba(255,255,255,0.5)", padding: 6, borderRadius: 8 }}
          >
            <Menu size={18} />
          </button>

          {/* Breadcrumb */}
          <div style={{ flex: 1, fontSize: 15, fontWeight: 600, color: "rgba(255,255,255,0.7)" }}>
            {NAV.find(n => pathname.startsWith(n.href))?.label ?? "Admin"}
          </div>

          {/* Admin badge */}
          <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "6px 12px", borderRadius: 20, background: "rgba(107,63,160,0.15)", border: "1px solid rgba(107,63,160,0.25)" }}>
            <div style={{ width: 28, height: 28, borderRadius: "50%", background: "linear-gradient(135deg,#0A7E8C,#6B3FA0)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 900, color: "white" }}>A</div>
            <span style={{ fontSize: 13, fontWeight: 600, color: "rgba(255,255,255,0.7)" }}>Admin</span>
          </div>
        </header>

        {/* Page content */}
        <main style={{ flex: 1, padding: "28px 24px", overflowX: "hidden" }}>
          {children}
        </main>
      </div>

      <style>{`
        @media (max-width: 900px) {
          .admin-main { margin-left: 0 !important; }
          .hide-mobile { display: none !important; }
        }
        @media (min-width: 901px) {
          .show-mobile-only { display: none !important; }
        }
      `}</style>
    </div>
  );
}
