"use client";
import { useRef, useState } from "react";
import ImagePlaceholder from "@/components/shared/ImagePlaceholder";

const row1Images = [
  { label: "Clinic Exterior",   src: "clinic/clinic-exterior.jpg" },
  { label: "Therapy Room",      src: "clinic/clinic-interior-1.jpg" },
  { label: "Waiting Area",      src: "clinic/clinic-interior-2.jpg" },
  { label: "Equipment",         src: "clinic/clinic-interior-3.jpg" },
  { label: "Dr. Prasoon",       src: "clinic/dr-prasoon-card.jpg" },
];

const row2Images = [...row1Images].reverse();

function GalleryRow({ images, direction }: { images: typeof row1Images; direction: "left" | "right" }) {
  const [paused, setPaused] = useState(false);
  // Duplicate for infinite scroll illusion
  const doubled = [...images, ...images];
  const animName = direction === "left" ? "galleryLeft" : "galleryRight";

  return (
    <div
      style={{ overflow: "hidden", position: "relative" }}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div style={{
        display: "flex",
        gap: 16,
        width: "max-content",
        animation: `${animName} 30s linear infinite`,
        animationPlayState: paused ? "paused" : "running",
        willChange: "transform",
      }}>
        {doubled.map((img, i) => (
          <div
            key={`${img.src}-${i}`}
            style={{
              width: 280, height: 180, flexShrink: 0,
              borderRadius: 12, overflow: "hidden",
            }}
          >
            <ImagePlaceholder
              label={img.label}
              style={{ height: "100%", borderRadius: 12 }}
            />
          </div>
        ))}
      </div>
    </div>
  );
}

export default function AutoScrollGallery() {
  return (
    <section style={{
      background: "var(--color-surface)",
      padding: "60px 0",
      overflow: "hidden",
      borderTop: "1px solid var(--color-border)",
      borderBottom: "1px solid var(--color-border)",
    }}>
      {/* Title */}
      <div style={{ textAlign: "center", marginBottom: 40 }}>
        <p style={{
          fontFamily: "'DM Sans',sans-serif", fontSize: 11, fontWeight: 600,
          letterSpacing: "0.14em", textTransform: "uppercase",
          color: "var(--color-primary)", marginBottom: 10,
        }}>
          Our Clinic in Katni
        </p>
        <h3 style={{
          fontFamily: "'Nunito',sans-serif", fontWeight: 700,
          fontSize: "clamp(22px,3vw,32px)", color: "var(--color-text-primary)",
        }}>
          A Space Built for Children
        </h3>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        <GalleryRow images={row1Images} direction="left" />
        <GalleryRow images={row2Images} direction="right" />
      </div>

      <style>{`
        @keyframes galleryLeft {
          0%   { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        @keyframes galleryRight {
          0%   { transform: translateX(-50%); }
          100% { transform: translateX(0); }
        }
        @media (prefers-reduced-motion: reduce) {
          * { animation: none !important; }
        }
      `}</style>
    </section>
  );
}
