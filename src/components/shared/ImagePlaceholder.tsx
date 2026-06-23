interface ImagePlaceholderProps {
  label: string;       // e.g. "dr-prasoon-hero.jpg"
  width?: number | string;
  height?: number | string;
  className?: string;
  style?: React.CSSProperties;
  aspect?: string;     // e.g. "16/9" or "4/3" or "1/1"
}

export default function ImagePlaceholder({
  label,
  width,
  height,
  className = "",
  style,
  aspect,
}: ImagePlaceholderProps) {
  return (
    <div
      className={`img-placeholder ${className}`}
      style={{
        width: width ?? "100%",
        height: height ?? (aspect ? undefined : 240),
        aspectRatio: aspect,
        borderRadius: "inherit",
        ...style,
      }}
    >
      <svg
        width="32"
        height="32"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        style={{ opacity: 0.4 }}
      >
        <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
        <circle cx="8.5" cy="8.5" r="1.5" />
        <polyline points="21 15 16 10 5 21" />
      </svg>
      <span style={{ opacity: 0.55, fontSize: 11 }}>Photo: {label}</span>
    </div>
  );
}
