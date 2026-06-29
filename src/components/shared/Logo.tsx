"use client";
import Link from "next/link";
import Image from "next/image";
import { useState } from "react";

interface LogoProps {
  variant?: "auto" | "light" | "dark";
  size?: "sm" | "md" | "lg";
}

export default function Logo({ variant = "auto", size = "md" }: LogoProps) {
  const [imgError, setImgError] = useState(false);
  const logoHeight = size === "sm" ? 32 : size === "lg" ? 56 : 44;
  const logoWidth = size === "sm" ? 120 : size === "lg" ? 200 : 160;

  const textFallback = (
    <span style={{
      fontFamily: "'Nunito', sans-serif", fontWeight: 900,
      fontSize: size === "sm" ? 18 : size === "lg" ? 28 : 22,
      background: "linear-gradient(135deg, #6B3FA0, #0A7E8C)",
      WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
      backgroundClip: "text", letterSpacing: "-0.01em",
      display: "inline-block", userSelect: "none",
    }}>
      Udaan Care
    </span>
  );

  return (
    <Link href="/" style={{ display: "inline-flex", alignItems: "center", textDecoration: "none", flexShrink: 0 }}>
      {imgError ? textFallback : (
        <div style={{ display: "flex", alignItems: "center" }}>
          {/* Dark logo (shown on light mode, hidden on dark mode or forced light variant) */}
          <div style={{ display: variant === "light" ? "none" : variant === "dark" ? "block" : "var(--logo-dark-display)" }}>
            <Image
              src="/images/logo/logo-dark.png"
              alt="Udaan Care — Small Steps. Strong Wings"
              width={logoWidth}
              height={logoHeight}
              priority
              unoptimized
              style={{
                height: logoHeight, width: "auto", maxWidth: "100%",
                objectFit: "contain", display: "block",
                background: "transparent", border: "none", outline: "none",
              }}
              onError={() => setImgError(true)}
            />
          </div>
          
          {/* Light logo (hidden on light mode, shown on dark mode or forced light variant) */}
          <div style={{ display: variant === "light" ? "block" : variant === "dark" ? "none" : "var(--logo-light-display)" }}>
            <Image
              src="/images/logo/logo-light.png"
              alt="Udaan Care — Small Steps. Strong Wings"
              width={logoWidth}
              height={logoHeight}
              priority
              unoptimized
              style={{
                height: logoHeight, width: "auto", maxWidth: "100%",
                objectFit: "contain", display: "block",
                background: "transparent", border: "none", outline: "none",
              }}
              onError={() => setImgError(true)}
            />
          </div>
        </div>
      )}
    </Link>
  );
}
