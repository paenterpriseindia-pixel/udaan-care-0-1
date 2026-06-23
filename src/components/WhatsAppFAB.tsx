import { MessageCircle } from "lucide-react";

export default function WhatsAppFAB() {
  return (
    <div style={{ position: "relative" }} className="group">
      <a
        href="https://wa.me/918349764084?text=Hi%20Dr.%20Prasoon%2C%20I%20would%20like%20to%20book%20a%20consultation%20for%20my%20child."
        target="_blank"
        rel="noopener noreferrer"
        className="wa-fab"
        aria-label="Chat on WhatsApp"
      >
        <MessageCircle size={26} fill="white" stroke="none" />
      </a>
      {/* Tooltip */}
      <div style={{
        position: "fixed",
        bottom: 90,
        right: 24,
        background: "#1A2B35",
        color: "white",
        fontFamily: "'DM Sans', sans-serif",
        fontSize: 12,
        fontWeight: 500,
        padding: "6px 12px",
        borderRadius: 8,
        whiteSpace: "nowrap",
        pointerEvents: "none",
        opacity: 0,
        transition: "opacity 0.2s",
        boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
      }} className="group-hover:opacity-100 hidden sm:block">
        Chat on WhatsApp
      </div>
    </div>
  );
}
