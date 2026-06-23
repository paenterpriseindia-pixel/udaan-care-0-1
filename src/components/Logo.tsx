import Link from "next/link";

interface LogoProps {
  size?: "sm" | "md" | "lg";
  light?: boolean; // force light text (on dark backgrounds)
}

export default function Logo({ size = "md", light = false }: LogoProps) {
  const textSize = size === "sm" ? "text-lg" : size === "lg" ? "text-3xl" : "text-xl";
  const taglineSize = size === "sm" ? "text-[9px]" : "text-[11px]";
  const iconSize = size === "sm" ? 36 : size === "lg" ? 56 : 44;

  return (
    <Link href="/" className="flex items-center gap-2.5 flex-shrink-0 no-underline group">
      {/* Logo mark — SVG children on arc */}
      <svg width={iconSize} height={iconSize} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="logoGrad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#6B3FA0" />
            <stop offset="100%" stopColor="#0A7E8C" />
          </linearGradient>
        </defs>
        {/* Arc base */}
        <path d="M15 72 Q50 40 85 72" stroke="url(#logoGrad)" strokeWidth="5" fill="none" strokeLinecap="round"/>
        {/* Left child (orange) */}
        <circle cx="22" cy="58" r="7" fill="#F5820D"/>
        <path d="M17 65 Q22 72 27 65" fill="#F5820D"/>
        {/* Center child (purple) - tallest */}
        <circle cx="50" cy="44" r="8" fill="#6B3FA0"/>
        <path d="M44 54 Q50 62 56 54" fill="#6B3FA0"/>
        {/* Right child (teal/blue) */}
        <circle cx="78" cy="58" r="7" fill="#0D9BAC"/>
        <path d="M73 65 Q78 72 83 65" fill="#0D9BAC"/>
        {/* Arms */}
        <line x1="15" y1="62" x2="22" y2="56" stroke="#F5820D" strokeWidth="3" strokeLinecap="round"/>
        <line x1="29" y1="56" x2="38" y2="52" stroke="#F5820D" strokeWidth="3" strokeLinecap="round"/>
        <line x1="40" y1="50" x2="50" y2="46" stroke="#6B3FA0" strokeWidth="3" strokeLinecap="round"/>
        <line x1="60" y1="50" x2="70" y2="54" stroke="#0D9BAC" strokeWidth="3" strokeLinecap="round"/>
        <line x1="83" y1="58" x2="87" y2="62" stroke="#0D9BAC" strokeWidth="3" strokeLinecap="round"/>
      </svg>

      {/* Text */}
      <div>
        <div
          className={`${textSize} font-heading font-black leading-none`}
          style={{
            background: "linear-gradient(135deg, #6B3FA0, #0A7E8C)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
          }}
        >
          Udaan Care
        </div>
        <div className={`${taglineSize} font-body font-medium leading-tight mt-0.5`} style={{ color: light ? "rgba(255,255,255,0.65)" : "#6B7C8A" }}>
          Small Steps. Strong Wings.
        </div>
      </div>
    </Link>
  );
}
