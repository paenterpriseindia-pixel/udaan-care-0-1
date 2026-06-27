"use client";
import { useRouter, usePathname } from "next/navigation";
import { ArrowLeft } from "lucide-react";

export default function GlobalBackButton() {
  const router = useRouter();
  const pathname = usePathname();

  // Don't show on the absolute root path to avoid circular UX if they are already home.
  if (pathname === "/") return null;

  return (
    <button
      onClick={() => router.back()}
      style={{
        position: "fixed",
        bottom: 96,
        left: 24,
        zIndex: 9999,
        background: "rgba(255, 255, 255, 0.9)",
        backdropFilter: "blur(8px)",
        border: "1px solid rgba(0, 0, 0, 0.1)",
        borderRadius: "50%",
        width: 44,
        height: 44,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
        cursor: "pointer",
        color: "#1e293b",
        transition: "all 0.2s ease"
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = "scale(1.05)";
        e.currentTarget.style.boxShadow = "0 6px 16px rgba(0,0,0,0.15)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = "scale(1)";
        e.currentTarget.style.boxShadow = "0 4px 12px rgba(0,0,0,0.1)";
      }}
      aria-label="Go Back"
    >
      <ArrowLeft size={20} strokeWidth={2.5} />
    </button>
  );
}
