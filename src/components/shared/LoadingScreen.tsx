"use client";
import { useEffect, useState } from "react";

export default function LoadingScreen({ onDone }: { onDone?: () => void }) {
  const [fading, setFading] = useState(false);

  useEffect(() => {
    const t1 = setTimeout(() => setFading(true), 1800);
    const t2 = setTimeout(() => onDone?.(), 2200);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, [onDone]);

  return (
    <div style={{
      position: "fixed", inset: 0, zIndex: 9999,
      display: "flex", flexDirection: "column",
      alignItems: "center", justifyContent: "center",
      background: "linear-gradient(135deg, #f0f9ff 0%, #e8f4f8 50%, #f5f0ff 100%)",
      transition: "opacity 0.5s ease",
      opacity: fading ? 0 : 1,
      pointerEvents: fading ? "none" : "auto",
      gap: 24,
    }}>
      {/* Logo */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/images/logo/logo-dark.png"
        alt="Udaan Care"
        style={{ height: 90, width: "auto", objectFit: "contain" }}
      />

      {/* Three bouncing dots */}
      <div style={{ display: "flex", gap: 10 }}>
        <style>{`
          @keyframes ucBounce {
            0%, 100% { transform: translateY(0);    opacity: 0.35; }
            50%       { transform: translateY(-12px); opacity: 1;    }
          }
          .uc-dot-0 { width:10px; height:10px; border-radius:50%; background:#1AAFE6; animation: ucBounce 1s ease-in-out 0s    infinite; }
          .uc-dot-1 { width:10px; height:10px; border-radius:50%; background:#6B3FA0; animation: ucBounce 1s ease-in-out 0.2s  infinite; }
          .uc-dot-2 { width:10px; height:10px; border-radius:50%; background:#F5820D; animation: ucBounce 1s ease-in-out 0.4s  infinite; }
        `}</style>
        <div className="uc-dot-0" />
        <div className="uc-dot-1" />
        <div className="uc-dot-2" />
      </div>
    </div>
  );
}
