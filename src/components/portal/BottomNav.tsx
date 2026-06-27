"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Calendar, FileText, User } from "lucide-react";
import { useLanguage } from "./LanguageProvider";

export default function BottomNav() {
  const pathname = usePathname();
  const { t } = useLanguage();

  const links = [
    { href: "/portal/dashboard", label: t("nav_home"), icon: Home },
    { href: "/portal/appointments", label: t("nav_appointments"), icon: Calendar },
    { href: "/portal/notes", label: t("nav_notes"), icon: FileText },
    { href: "/portal/profile", label: t("nav_profile"), icon: User },
  ];

  return (
    <div style={{
      position: "fixed",
      bottom: 0,
      left: 0,
      right: 0,
      background: "white",
      boxShadow: "0 -4px 20px rgba(0,0,0,0.06)",
      display: "flex",
      justifyContent: "space-around",
      alignItems: "center",
      padding: "12px 0 24px", // Extra padding for mobile safe area
      zIndex: 1000,
      fontFamily: "'DM Sans',sans-serif",
    }}>
      {links.map(link => {
        const isActive = pathname === link.href;
        const Icon = link.icon;
        return (
          <Link href={link.href} key={link.href} style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 6,
            textDecoration: "none",
            color: isActive ? "#0A7E8C" : "#94a3b8",
            flex: 1,
            transition: "all 0.2s"
          }}>
            <div style={{ 
              background: isActive ? "rgba(10,126,140,0.1)" : "transparent", 
              padding: "8px 16px", 
              borderRadius: 20,
              transition: "all 0.2s"
            }}>
              <Icon size={22} strokeWidth={isActive ? 2.5 : 2} />
            </div>
            <span style={{ fontSize: 11, fontWeight: isActive ? 700 : 500 }}>{link.label}</span>
          </Link>
        );
      })}
    </div>
  );
}
