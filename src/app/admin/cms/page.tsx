"use client";
import { useEffect, useState } from "react";
import { Save, Check, RotateCcw, Palette, Type, Phone, Globe, Image as ImageIcon } from "lucide-react";
import Link from "next/link";

interface ContentMap { [k: string]: string | number | boolean | object; }

const SECTIONS = [
  {
    key: "hero", label: "Hero Section", icon: "🏠", fields: [
      { key: "hero.title", label: "Main Headline", type: "text", hint: "e.g. Every Child Has Wings." },
      { key: "hero.subtitle", label: "Sub-headline", type: "textarea", hint: "Shown below the title" },
      { key: "hero.ctaText", label: "Button Text", type: "text", hint: "e.g. Book a Consultation" },
      { key: "hero.badge", label: "Badge Text", type: "text", hint: "e.g. Pediatric OT · Katni, India" },
    ],
  },
  {
    key: "doctor", label: "Doctor / About", icon: "👨‍⚕️", fields: [
      { key: "doctor.name", label: "Doctor Name", type: "text" },
      { key: "doctor.qualifications", label: "Qualifications", type: "text", hint: "e.g. BOT · MOT — Pediatric OT" },
      { key: "doctor.bio", label: "Doctor Bio", type: "textarea" },
      { key: "doctor.experience", label: "Experience", type: "text", hint: "e.g. 3+ years" },
      { key: "doctor.patientsHelped", label: "Patients Helped", type: "text", hint: "e.g. 400+" },
    ],
  },
  {
    key: "contact", label: "Contact Info", icon: "📞", fields: [
      { key: "contact.phone", label: "Phone Number", type: "text" },
      { key: "contact.whatsapp", label: "WhatsApp Number (digits only)", type: "text", hint: "e.g. 918349764084" },
      { key: "contact.address", label: "Address", type: "text" },
      { key: "contact.email", label: "Email", type: "email" },
    ],
  },
  {
    key: "pricing", label: "Pricing", icon: "💰", fields: [
      { key: "pricing.india", label: "India Price (₹)", type: "number" },
      { key: "pricing.international", label: "International Price (USD $)", type: "number" },
    ],
  },
  {
    key: "design", label: "Colors & Fonts", icon: "🎨", fields: [
      { key: "colors.primary", label: "Primary Color", type: "color", hint: "Teal — used for buttons and links" },
      { key: "colors.accent", label: "Accent Color", type: "color", hint: "Purple — used for headings and highlights" },
      { key: "fonts.heading", label: "Heading Font", type: "select", options: ["Nunito", "Poppins", "Inter", "Raleway", "Montserrat", "Playfair Display"] },
      { key: "fonts.body", label: "Body Font", type: "select", options: ["DM Sans", "Inter", "Roboto", "Open Sans", "Lato", "Source Sans 3"] },
    ],
  },
  {
    key: "seo", label: "SEO & Meta", icon: "🔍", fields: [
      { key: "seo.siteTitle", label: "Site Title (browser tab)", type: "text" },
      { key: "seo.description", label: "Meta Description", type: "textarea", hint: "Shown in Google search results (max 160 chars)" },
    ],
  },
];

export default function CMSPage() {
  const [content, setContent] = useState<ContentMap>({});
  const [edits, setEdits] = useState<ContentMap>({});
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [activeSection, setActiveSection] = useState("hero");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/admin/content").then(r => r.json()).then(d => { setContent(d); setEdits(d); setLoading(false); });
  }, []);

  const set = (key: string, value: string | number) => setEdits(e => ({ ...e, [key]: value }));
  const hasChanges = JSON.stringify(edits) !== JSON.stringify(content);

  const save = async () => {
    setSaving(true);
    await fetch("/api/admin/content", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(edits) });
    setContent(edits);
    setSaving(false); setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const reset = () => setEdits(content);

  const inputStyle: React.CSSProperties = { width: "100%", padding: "10px 14px", borderRadius: 10, background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", color: "white", fontSize: 14, outline: "none", boxSizing: "border-box", fontFamily: "'DM Sans',sans-serif" };

  const section = SECTIONS.find(s => s.key === activeSection)!;

  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 24, flexWrap: "wrap", gap: 12 }}>
        <div>
          <h1 style={{ fontFamily: "'Nunito',sans-serif", fontWeight: 900, fontSize: 26, color: "white", marginBottom: 2 }}>Site Content</h1>
          <p style={{ fontSize: 13, color: "rgba(255,255,255,0.4)" }}>Edit every piece of text, color, and font on your website</p>
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          {hasChanges && (
            <button onClick={reset} style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "9px 16px", borderRadius: 10, border: "1px solid rgba(255,255,255,0.12)", background: "transparent", color: "rgba(255,255,255,0.5)", cursor: "pointer", fontSize: 13, fontFamily: "'DM Sans',sans-serif" }}>
              <RotateCcw size={13} /> Reset
            </button>
          )}
          <button onClick={save} disabled={!hasChanges || saving} style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "9px 20px", borderRadius: 10, border: "none", background: saved ? "#22c55e" : hasChanges ? "linear-gradient(135deg,#0A7E8C,#6B3FA0)" : "rgba(255,255,255,0.08)", color: "white", cursor: hasChanges ? "pointer" : "not-allowed", fontSize: 13, fontWeight: 700, fontFamily: "'DM Sans',sans-serif", transition: "all 0.2s" }}>
            {saved ? <><Check size={13} /> Saved!</> : <><Save size={13} /> {saving ? "Saving…" : "Save Changes"}</>}
          </button>
        </div>
      </div>

      <div className="grid-sidebar" style={{ gap: 20 }}>
        {/* Sidebar */}
        <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 14, padding: 8, height: "fit-content" }}>
          {SECTIONS.map(s => (
            <button key={s.key} onClick={() => setActiveSection(s.key)} style={{
              display: "flex", alignItems: "center", gap: 10, width: "100%", padding: "10px 12px", borderRadius: 10, border: "none", cursor: "pointer", fontSize: 14, fontWeight: activeSection === s.key ? 700 : 500, textAlign: "left",
              background: activeSection === s.key ? "rgba(10,126,140,0.2)" : "transparent",
              color: activeSection === s.key ? "#0D9BAC" : "rgba(255,255,255,0.55)",
              borderLeft: `3px solid ${activeSection === s.key ? "#0A7E8C" : "transparent"}`,
              fontFamily: "'DM Sans',sans-serif", transition: "all 0.15s",
            }}>
              <span style={{ fontSize: 16 }}>{s.icon}</span> {s.label}
            </button>
          ))}
          <div style={{ marginTop: 12, borderTop: "1px solid rgba(255,255,255,0.07)", paddingTop: 12 }}>
            <Link href="/admin/upload" style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 12px", borderRadius: 10, color: "rgba(255,255,255,0.5)", fontSize: 14, textDecoration: "none" }}>
              <span style={{ fontSize: 16 }}>🖼️</span> Images
            </Link>
          </div>
        </div>

        {/* Fields */}
        <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 14, padding: 28 }}>
          <h2 style={{ fontFamily: "'Nunito',sans-serif", fontWeight: 800, fontSize: 18, color: "white", marginBottom: 24 }}>
            {section.icon} {section.label}
          </h2>
          {loading ? (
            <div style={{ color: "rgba(255,255,255,0.3)", fontSize: 14 }}>Loading content…</div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
              {section.fields.map(field => {
                const val = edits[field.key] ?? "";
                const changed = val !== content[field.key];
                return (
                  <div key={field.key}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
                      <label style={{ fontSize: 13, fontWeight: 600, color: "rgba(255,255,255,0.7)" }}>{field.label}</label>
                      {changed && <span style={{ fontSize: 10, padding: "2px 6px", borderRadius: 4, background: "rgba(245,130,13,0.2)", color: "#F5820D", fontWeight: 700 }}>Modified</span>}
                    </div>
                    {field.hint && <p style={{ fontSize: 11, color: "rgba(255,255,255,0.3)", marginBottom: 6 }}>{field.hint}</p>}

                    {field.type === "textarea" ? (
                      <textarea style={{ ...inputStyle, minHeight: 90, resize: "vertical", borderColor: changed ? "rgba(245,130,13,0.4)" : "rgba(255,255,255,0.1)" }} value={String(val)} onChange={e => set(field.key, e.target.value)} />
                    ) : field.type === "color" ? (
                      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                        <input type="color" value={String(val)} onChange={e => set(field.key, e.target.value)} style={{ width: 48, height: 40, borderRadius: 8, border: "1px solid rgba(255,255,255,0.1)", background: "transparent", cursor: "pointer", padding: 2 }} />
                        <input style={{ ...inputStyle, flex: 1, borderColor: changed ? "rgba(245,130,13,0.4)" : "rgba(255,255,255,0.1)" }} value={String(val)} onChange={e => set(field.key, e.target.value)} placeholder="#0A7E8C" />
                        <div style={{ width: 40, height: 40, borderRadius: 8, background: String(val), border: "1px solid rgba(255,255,255,0.1)", flexShrink: 0 }} />
                      </div>
                    ) : field.type === "select" ? (
                      <select style={{ ...inputStyle, borderColor: changed ? "rgba(245,130,13,0.4)" : "rgba(255,255,255,0.1)" }} value={String(val)} onChange={e => set(field.key, e.target.value)}>
                        {(field as { options?: string[] }).options?.map(o => <option key={o} value={o}>{o}</option>)}
                      </select>
                    ) : (
                      <input type={field.type} style={{ ...inputStyle, borderColor: changed ? "rgba(245,130,13,0.4)" : "rgba(255,255,255,0.1)" }} value={String(val)} onChange={e => set(field.key, field.type === "number" ? +e.target.value : e.target.value)} />
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
