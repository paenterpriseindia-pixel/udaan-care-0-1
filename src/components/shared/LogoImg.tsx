/**
 * LogoImg — used wherever we need the logo as a plain <img> tag
 * (admin sidebar, admin login, parent portal login, parent dashboard)
 *
 * Tries SVG first, falls back to PNG automatically.
 * Always transparent — no background.
 */
"use client";
import { useState } from "react";
import Image from "next/image";

interface LogoImgProps {
  /** "light" = white logo for dark backgrounds (admin, footer)
   *  "dark"  = colored logo for light backgrounds (portal, navbar) */
  variant: "light" | "dark";
  height?: number;
  style?: React.CSSProperties;
}

export default function LogoImg({ variant, height = 44, style }: LogoImgProps) {
  const src = variant === "light" ? "/images/logo/logo-light.png" : "/images/logo/logo-dark.png";
  const [failed, setFailed] = useState(false);

  if (failed) {
    return (
      <span style={{
        fontFamily: "'Nunito', sans-serif", fontWeight: 900,
        fontSize: height * 0.6,
        background: "linear-gradient(135deg, #6B3FA0, #0A7E8C)",
        WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
        backgroundClip: "text", display: "inline-block",
        ...style,
      }}>
        Udaan Care
      </span>
    );
  }

  return (
        <Image
          src={src}
          alt="Udaan Care — Small Steps. Strong Wings"
          width={180}
          height={height}
          priority
          unoptimized
          style={{
            height,
            width: "auto",
            objectFit: "contain",
            display: "block",
            background: "transparent",
            border: "none",
            ...style,
          }}
          onError={() => setFailed(true)}
        />
  );
}

