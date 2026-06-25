"use client";
import Link from "next/link";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

interface LogoProps {
  variant?: "auto" | "light" | "dark";
  size?: "sm" | "md" | "lg";
}

export default function Logo({ variant = "auto", size = "md" }: LogoProps) {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [imgError, setImgError] = useState(false);

  useEffect(() => setMounted(true), []);

  const isDark = variant === "light" || (variant === "auto" && mounted && resolvedTheme === "dark");
  const src = isDark ? "/images/logo/logo-light.png" : "/images/logo/logo-dark.png";
  const logoHeight = size === "sm" ? 32 : size === "lg" ? 56 : 44;

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
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={src}
          alt="Udaan Care — Small Steps. Strong Wings"
          style={{
            height: logoHeight, width: "auto", maxWidth: "100%",
            objectFit: "contain", display: "block",
            background: "transparent", border: "none", outline: "none",
          }}
          onError={() => setImgError(true)}
        />
      )}
    </Link>
  );
}
