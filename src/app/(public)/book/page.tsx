"use client";
import { useState, useEffect } from "react";
import Script from "next/script";

import { useCurrency } from "@/context/CurrencyContext";
import {
  Check, ChevronLeft, ChevronRight,
  Video, Building2, Calendar, Clock,
  MessageCircle, ShieldCheck, User, Phone, Mail, FileText,
} from "lucide-react";


interface BookingState {
  type: "online" | "clinic" | "";
  date: string;
  time: string;
  childName: string;
  parentName: string;
  childAge: string;
  phone: string;
  email: string;
  reason: string;
}

// ── Step indicator ──────────────────────────────────────────────────────────
function StepBar({ current, total }: { current: number; total: number }) {
  const labels = ["Type", "Date & Time", "Details", "Confirm"];
  return (
    <div style={{ marginBottom: 32 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 0 }}>
        {labels.map((l, i) => {
          const n = i + 1;
          const done = n < current;
          const active = n === current;
          return (
            <div key={l} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", position: "relative" }}>
              {/* Connector line */}
              {i > 0 && (
                <div style={{
                  position: "absolute", top: 18, right: "50%", left: "-50%",
                  height: 2,
                  background: done || active ? "var(--color-primary)" : "var(--color-border)",
                  transition: "background 0.3s",
                }} />
              )}
              <div style={{
                width: 36, height: 36, borderRadius: "50%",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontFamily: "'Nunito',sans-serif", fontWeight: 800, fontSize: 14,
                position: "relative", zIndex: 1,
                background: done || active ? "var(--color-primary)" : "var(--color-card)",
                border: `2px solid ${done || active ? "var(--color-primary)" : "var(--color-border)"}`,
                color: done || active ? "white" : "var(--color-text-secondary)",
                boxShadow: active ? "0 0 0 4px rgba(26,175,230,0.18)" : "none",
                transition: "all 0.3s",
              }}>
                {done ? <Check size={16} /> : n}
              </div>
              <span style={{
                fontFamily: "'DM Sans',sans-serif", fontSize: 11, fontWeight: 600,
                marginTop: 6, color: active ? "var(--color-primary)" : done ? "var(--color-primary)" : "var(--color-text-secondary)",
              }}>
                {l}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ── Step 1: Type ─────────────────────────────────────────────────────────────
function Step1({ state, setState, prices }: {
  state: BookingState; setState: (s: BookingState) => void; prices: any;
}) {
  return (
    <div>
      <h2 style={{ fontFamily: "'Nunito',sans-serif", fontWeight: 800, fontSize: 24, color: "var(--color-text-primary)", marginBottom: 6 }}>
        Choose Consultation Type
      </h2>
      <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 14, color: "var(--color-text-secondary)", marginBottom: 28 }}>
        Select the type that works best for your family.
      </p>

      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        {/* Online */}
        <button onClick={() => setState({ ...state, type: "online" })} style={{
          width: "100%", padding: "20px 24px", borderRadius: 16, border: `2px solid ${state.type === "online" ? "var(--color-primary)" : "var(--color-border)"}`,
          textAlign: "left", cursor: "pointer", display: "flex", alignItems: "flex-start", gap: 16,
          background: state.type === "online" ? "var(--color-primary-light)" : "var(--color-card)",
          transition: "all 0.2s",
        }}>
          <div style={{ width: 52, height: 52, borderRadius: 14, background: "rgba(26,175,230,0.12)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
            <Video size={26} style={{ color: "var(--color-primary)" }} />
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 8 }}>
              <span style={{ fontFamily: "'Nunito',sans-serif", fontWeight: 700, fontSize: 16, color: "var(--color-text-primary)" }}>Online Consultation</span>
              <span style={{ fontFamily: "'Nunito',sans-serif", fontWeight: 800, fontSize: 18, color: "var(--color-primary)" }}>{prices.online.display}</span>
            </div>
            <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 13, color: "var(--color-text-secondary)", marginTop: 4 }}>
              Via Zoom · Available across India & worldwide · 45 mins · WhatsApp confirmation
            </p>
          </div>
          {state.type === "online" && <Check size={20} style={{ color: "var(--color-primary)", flexShrink: 0 }} />}
        </button>

        {/* Clinic / International note */}
        {prices.showClinic ? (
          <button onClick={() => setState({ ...state, type: "clinic" })} style={{
            width: "100%", padding: "20px 24px", borderRadius: 16, border: `2px solid ${state.type === "clinic" ? "var(--color-accent)" : "var(--color-border)"}`,
            textAlign: "left", cursor: "pointer", display: "flex", alignItems: "flex-start", gap: 16,
            background: state.type === "clinic" ? "var(--color-accent-light)" : "var(--color-card)",
            transition: "all 0.2s",
          }}>
            <div style={{ width: 52, height: 52, borderRadius: 14, background: "rgba(255,112,67,0.10)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              <Building2 size={26} style={{ color: "var(--color-accent)" }} />
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 8 }}>
                <span style={{ fontFamily: "'Nunito',sans-serif", fontWeight: 700, fontSize: 16, color: "var(--color-text-primary)" }}>Visit the Clinic</span>
                <span style={{ fontFamily: "'Nunito',sans-serif", fontWeight: 800, fontSize: 18, color: "var(--color-accent)" }}>{prices.clinic?.display}</span>
              </div>
              <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 13, color: "var(--color-text-secondary)", marginTop: 4 }}>
                In-person · Udaan Care, Katni, MP · 45 mins · By appointment only
              </p>
            </div>
            {state.type === "clinic" && <Check size={20} style={{ color: "var(--color-accent)", flexShrink: 0 }} />}
          </button>
        ) : (
          <div style={{ padding: "16px 20px", borderRadius: 12, background: "var(--color-primary-light)", border: "1px solid rgba(26,175,230,0.20)", fontFamily: "'DM Sans',sans-serif", fontSize: 14, color: "var(--color-primary)" }}>
            {prices.clinicNote}
          </div>
        )}
      </div>
    </div>
  );
}

// ── Step 2: Date & Time ──────────────────────────────────────────────────────
const TIMES = ["10:00 AM","10:30 AM","11:00 AM","11:30 AM","12:00 PM","12:30 PM","2:00 PM","2:30 PM","3:00 PM","3:30 PM","4:00 PM","4:30 PM","5:00 PM","5:30 PM","6:00 PM","6:30 PM","7:00 PM"];
const BOOKED = ["11:00 AM","12:30 PM","3:00 PM","5:30 PM"];

function Step2({ state, setState }: { state: BookingState; setState: (s: BookingState) => void }) {
  const today = new Date(); today.setHours(0,0,0,0);
  const dateMin = new Date(today); dateMin.setDate(dateMin.getDate() + 1);
  const dateMax = new Date(today); dateMax.setDate(dateMax.getDate() + 60);
  const selectedDate = state.date ? new Date(state.date) : null;
  const isSunday = selectedDate ? selectedDate.getDay() === 0 : false;

  return (
    <div>
      <h2 style={{ fontFamily: "'Nunito',sans-serif", fontWeight: 800, fontSize: 24, color: "var(--color-text-primary)", marginBottom: 6 }}>
        Choose Date & Time
      </h2>
      <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 14, color: "var(--color-text-secondary)", marginBottom: 28 }}>
        Available Mon–Sat · 10 AM–7 PM IST · Sundays closed
      </p>

      <div style={{ marginBottom: 24 }}>
        <label style={{ display: "block", fontFamily: "'DM Sans',sans-serif", fontWeight: 700, fontSize: 14, color: "var(--color-text-primary)", marginBottom: 8 }}>
          <Calendar size={14} style={{ display: "inline", marginRight: 6, verticalAlign: "middle" }} />
          Select Date
        </label>
        <input type="date" className="input"
          value={state.date}
          min={dateMin.toISOString().split("T")[0]}
          max={dateMax.toISOString().split("T")[0]}
          onChange={e => setState({ ...state, date: e.target.value, time: "" })}
        />
        {isSunday && <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 12, marginTop: 6, color: "var(--color-accent)" }}>Sundays are closed. Please select Monday to Saturday.</p>}
        {state.date && !isSunday && <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 12, marginTop: 6, color: "var(--color-success)" }}>
          {new Date(state.date + "T00:00:00").toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "long", year: "numeric" })}
        </p>}
      </div>

      {state.date && !isSunday && (
        <div>
          <label style={{ display: "block", fontFamily: "'DM Sans',sans-serif", fontWeight: 700, fontSize: 14, color: "var(--color-text-primary)", marginBottom: 12 }}>
            <Clock size={14} style={{ display: "inline", marginRight: 6, verticalAlign: "middle" }} />
            Select Time Slot <span style={{ fontWeight: 400, fontSize: 12, color: "var(--color-text-secondary)" }}>All times in IST</span>
          </label>
          <div className="grid-responsive-4" style={{ gap: 8 }}>
            {TIMES.map(t => {
              const booked = BOOKED.includes(t);
              const selected = state.time === t;
              return (
                <button key={t} disabled={booked} onClick={() => setState({ ...state, time: t })} style={{
                  padding: "10px 4px", borderRadius: 10, fontSize: 12,
                  fontFamily: "'DM Sans',sans-serif", fontWeight: 700,
                  border: `2px solid ${selected ? "var(--color-primary)" : booked ? "var(--color-border)" : "var(--color-border)"}`,
                  background: selected ? "var(--color-primary)" : booked ? "var(--color-surface)" : "var(--color-card)",
                  color: selected ? "white" : booked ? "var(--color-text-secondary)" : "var(--color-text-primary)",
                  cursor: booked ? "not-allowed" : "pointer",
                  opacity: booked ? 0.4 : 1,
                  textDecoration: booked ? "line-through" : "none",
                  transition: "all 0.15s",
                }}>
                  {t}
                  {booked && <div style={{ fontSize: 9, fontWeight: 400, marginTop: 2 }}>Booked</div>}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

// ── Step 3: Details ──────────────────────────────────────────────────────────
function Step3({ state, setState }: { state: BookingState; setState: (s: BookingState) => void }) {
  const fields: { label: string; key: keyof BookingState; type?: string; placeholder: string; icon: JSX.Element }[] = [
    { label: "Child's Full Name", key: "childName", placeholder: "e.g. Aarav Sharma", icon: <User size={14} /> },
    { label: "Parent / Guardian Name", key: "parentName", placeholder: "e.g. Priya Sharma", icon: <User size={14} /> },
    { label: "Child's Age", key: "childAge", placeholder: "e.g. 5 years 3 months", icon: <User size={14} /> },
    { label: "Phone Number (WhatsApp)", key: "phone", type: "tel", placeholder: "+91 98765 43210", icon: <Phone size={14} /> },
    { label: "Email Address", key: "email", type: "email", placeholder: "you@example.com", icon: <Mail size={14} /> },
  ];

  return (
    <div>
      <h2 style={{ fontFamily: "'Nunito',sans-serif", fontWeight: 800, fontSize: 24, color: "var(--color-text-primary)", marginBottom: 6 }}>
        Your Details
      </h2>
      <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 14, color: "var(--color-text-secondary)", marginBottom: 28 }}>
        All fields are required to confirm your appointment.
      </p>
      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        {fields.map(f => (
          <div key={f.key}>
            <label style={{ display: "block", fontFamily: "'DM Sans',sans-serif", fontWeight: 700, fontSize: 14, color: "var(--color-text-primary)", marginBottom: 6 }}>
              {f.label} <span style={{ color: "var(--color-accent)" }}>*</span>
            </label>
            <input type={f.type ?? "text"} className="input" placeholder={f.placeholder}
              value={state[f.key] as string}
              onChange={e => setState({ ...state, [f.key]: e.target.value })}
            />
          </div>
        ))}
        <div>
          <label style={{ display: "block", fontFamily: "'DM Sans',sans-serif", fontWeight: 700, fontSize: 14, color: "var(--color-text-primary)", marginBottom: 6 }}>
            <FileText size={14} style={{ display: "inline", marginRight: 6, verticalAlign: "middle" }} />
            Reason for Visit <span style={{ color: "var(--color-accent)" }}>*</span>
          </label>
          <textarea className="input" style={{ minHeight: 100, resize: "none" }}
            placeholder="Briefly describe your child's challenges or what you'd like help with..."
            value={state.reason}
            onChange={e => setState({ ...state, reason: e.target.value })}
          />
        </div>
      </div>
    </div>
  );
}

// ── Zoom link generator ───────────────────────────────────────────────────────
function generateZoomLink(date: string, time: string, name: string) {
  // Creates a unique Jitsi Meet room per session (free, no API key needed)
  const slug = `UdaanCare-${date}-${time.replace(/[: ]/g,"-")}-${name.replace(/\s+/g,"")}`.toLowerCase();
  return `https://meet.jit.si/${slug}`;
}

// ── Step 4: Confirm + Advance Payment ────────────────────────────────────────
function Step4({ state, prices }: { state: BookingState; prices: any }) {
  const price    = state.type === "online" ? prices.online.display : (prices.clinic?.display || "₹799");
  const priceNum = state.type === "online" ? prices.online.amount : (prices.clinic?.amount || 799);
  const label    = state.type === "online" ? "Online Consultation via Zoom" : "In-Clinic Visit, Katni";
  const zoomLink = state.type === "online" ? generateZoomLink(state.date, state.time, state.childName) : null;
  const [leadSent, setLeadSent] = useState(false);

  // We will no longer send the lead *immediately* on this step.
  // We will wait for Razorpay success. But for manual UPI flow, we might want to still log it or let them click "Confirm via WhatsApp" which already handles it manually.

  const handleRazorpay = async () => {
    if (leadSent) return; // Prevent double clicking
    setLeadSent(true);
    
    try {
      // 1. Create order on backend
      const res = await fetch("/api/razorpay/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount: priceNum }),
      });
      const order = await res.json();
      
      if (!order.id) {
        alert("Server error. Please try again or use UPI.");
        setLeadSent(false);
        return;
      }

      // 2. Open Razorpay Checkout
      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || "rzp_live_T6IKIEWy4JFJOJ", // Fallback to provided key if env missing
        amount: order.amount,
        currency: order.currency,
        name: "UdaanCare",
        description: `Booking for ${state.childName}`,
        image: "https://fbogcjvivaehpsgabtqv.supabase.co/storage/v1/object/public/images/logo/logo-dark.png",
        order_id: order.id,
        handler: async function (response: any) {
          // 3. Verify Payment and Send Email
          const verifyRes = await fetch("/api/razorpay/verify", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              leadData: {
                name: state.parentName || state.childName,
                phone: state.phone,
                email: state.email,
                date: state.date,
                time: state.time,
                source: (typeof window !== "undefined" && new URLSearchParams(window.location.search).get("utm_source")) || "website",
                serviceInterest: state.type === "online" ? "Online Consultation" : "Clinic Visit",
                message: state.reason,
              }
            }),
          });
          
          const result = await verifyRes.json();
          if (result.success) {
            alert(`Payment successful! Your confirmation number is ${result.confirmationNumber}. Check your email.`);
            // Send whatsapp confirmation optionally or just redirect
            window.location.href = "/";
          } else {
            alert("Payment verification failed. Please contact support.");
          }
        },
        prefill: {
          name: state.parentName || state.childName,
          email: state.email,
          contact: state.phone,
        },
        theme: {
          color: "#1AAFE6",
        },
      };

      const rzp1 = new (window as any).Razorpay(options);
      rzp1.on("payment.failed", function (response: any) {
        alert(response.error.description);
        setLeadSent(false);
      });
      rzp1.open();
      
    } catch (error) {
      console.error(error);
      alert("Something went wrong opening Razorpay.");
      setLeadSent(false);
    }
  };

  // Capture lead for abandoned cart manually if they don't click razorpay
  useEffect(() => {
    // Only capture if they stay on this step for 10 seconds without paying
    const timer = setTimeout(() => {
       fetch("/api/book", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: state.parentName || state.childName,
            phone: state.phone,
            email: state.email,
            date: state.date,
            time: state.time,
            source: "website_abandoned_checkout",
            serviceInterest: state.type === "online" ? "Online Consultation" : "Clinic Visit",
            message: state.reason,
          }),
        }).catch(() => {});
    }, 10000);
    return () => clearTimeout(timer);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps



  return (
    <div>
      <h2 style={{ fontFamily: "'Nunito',sans-serif", fontWeight: 800, fontSize: 24, color: "var(--color-text-primary)", marginBottom: 6 }}>
        Review & Pay
      </h2>
      <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 14, color: "var(--color-text-secondary)", marginBottom: 24 }}>
        Pay in advance to lock your slot — then send us your payment confirmation on WhatsApp.
      </p>

      {/* Summary */}
      <div className="card" style={{ padding: "20px 24px", marginBottom: 20 }}>
        <div style={{ fontFamily: "'DM Sans',sans-serif", fontWeight: 700, fontSize: 11, letterSpacing: "0.1em", textTransform: "uppercase" as const, color: "var(--color-text-secondary)", marginBottom: 16 }}>
          Booking Summary
        </div>
        <div style={{ display: "flex", flexDirection: "column" as const, gap: 12 }}>
          {[
            ["Consultation", label],
            ["Date", state.date ? new Date(state.date + "T00:00:00").toLocaleDateString("en-IN", { weekday: "short", day: "numeric", month: "long" }) : "—"],
            ["Time", state.time ? `${state.time} IST` : "—"],
            ["Patient", `${state.childName} · ${state.childAge}`],
            ["Parent", state.parentName],
            ["Doctor", "Dr. Prasoon Gupta, BOT MOT"],
          ].map(([l, v]) => (
            <div key={l} style={{ display: "flex", justifyContent: "space-between", fontSize: 14, fontFamily: "'DM Sans',sans-serif" }}>
              <span style={{ color: "var(--color-text-secondary)" }}>{l}</span>
              <span style={{ fontWeight: 600, color: "var(--color-text-primary)", textAlign: "right" as const, maxWidth: "60%" }}>{v}</span>
            </div>
          ))}
          {zoomLink && (
            <div style={{ padding: "10px 14px", borderRadius: 8, background: "rgba(107,63,160,0.08)", border: "1px solid rgba(107,63,160,0.2)", fontFamily: "'DM Sans',sans-serif", fontSize: 13 }}>
              <span style={{ color: "var(--color-text-secondary)" }}>Your Zoom link will be:</span><br />
              <a href={zoomLink} target="_blank" rel="noopener noreferrer" style={{ color: "var(--color-primary)", wordBreak: "break-all" as const }}>{zoomLink}</a>
            </div>
          )}
          <div style={{ height: 1, background: "var(--color-border)", margin: "4px 0" }} />
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ fontFamily: "'Nunito',sans-serif", fontWeight: 700, fontSize: 16, color: "var(--color-text-primary)" }}>Amount to Pay</span>
            <span style={{ fontFamily: "'Nunito',sans-serif", fontWeight: 800, fontSize: 26, color: "var(--color-primary)" }}>{price}</span>
          </div>
        </div>
      </div>

      {/* Payment Step */}
      <div className="card" style={{ padding: "20px 24px", marginBottom: 16 }}>
        <div style={{ fontFamily: "'Nunito',sans-serif", fontWeight: 800, fontSize: 16, color: "var(--color-text-primary)", marginBottom: 4 }}>
          Make Payment
        </div>
        <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 13, color: "var(--color-text-secondary)", marginBottom: 16 }}>
          Pay securely using Cards, UPI, Netbanking, or Wallets.
        </p>
        <div style={{ display: "flex", gap: 12, flexWrap: "wrap" as const, alignItems: "center", marginBottom: 16 }}>
          <button onClick={handleRazorpay} disabled={leadSent} style={{
            display: "inline-flex", alignItems: "center", gap: 8, padding: "14px 24px", borderRadius: 12,
            background: "var(--color-primary)", color: "white", textDecoration: "none", border: "none", cursor: leadSent ? "wait" : "pointer",
            fontFamily: "'Nunito',sans-serif", fontWeight: 800, fontSize: 15,
            boxShadow: "0 4px 16px rgba(26,175,230,0.35)",
            opacity: leadSent ? 0.7 : 1
          }}>
            Pay {price} Securely
          </button>
        </div>

      </div>

      <div style={{ display: "flex", alignItems: "center", gap: 6, justifyContent: "center", fontFamily: "'DM Sans',sans-serif", fontSize: 12, color: "var(--color-text-secondary)" }}>
        <ShieldCheck size={13} style={{ color: "var(--color-success)" }} />
        Slot is reserved immediately upon successful payment
      </div>
    </div>
  );
}


// ── Main Book Page ────────────────────────────────────────────────────────────
export default function BookPage() {
  const { prices } = useCurrency();
  const [step, setStep] = useState(1);
  const TOTAL = 4;

  const [state, setState] = useState<BookingState>({
    type: "", date: "", time: "", childName: "", parentName: "", childAge: "", phone: "", email: "", reason: "",
  });

  const canNext = () => {
    if (step === 1) return !!state.type;
    if (step === 2) return !!state.date && !!state.time && new Date(state.date + "T00:00:00").getDay() !== 0;
    if (step === 3) return !!(state.childName && state.parentName && state.childAge && state.phone && state.email && state.reason);
    return true;
  };

  return (
    <div style={{ minHeight: "100vh", paddingTop: 108, paddingBottom: 64, background: "var(--color-bg)" }}>

      {/* Hero strip */}
      <div style={{
        padding: "48px 0 40px",
        background: "linear-gradient(145deg, #1A2235 0%, rgba(10,126,140,0.25) 100%)",
        textAlign: "center",
        marginTop: -108,
        paddingTop: 156,
      }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 10, marginBottom: 8 }}>
          <Calendar size={28} style={{ color: "rgba(255,255,255,0.8)" }} />
        </div>
        <h1 style={{ fontFamily: "'Nunito',sans-serif", fontWeight: 900, fontSize: "clamp(24px, 3vw, 36px)", color: "white", marginBottom: 8 }}>
          Book a Consultation
        </h1>
        <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 15, color: "rgba(255,255,255,0.65)" }}>
          With Dr. Prasoon Gupta · BOT, MOT · Pediatric OT Specialist
        </p>
      </div>

      <div style={{ maxWidth: 640, margin: "0 auto", padding: "32px 20px 0" }}>
        <StepBar current={step} total={TOTAL} />

        <div className="card" style={{ padding: "32px 36px" }}>
          {step === 1 && <Step1 state={state} setState={setState} prices={prices} />}
          {step === 2 && <Step2 state={state} setState={setState} />}
          {step === 3 && <Step3 state={state} setState={setState} />}
          {step === 4 && <Step4 state={state} prices={prices} />}

          {/* Navigation */}
          {step < 4 && (
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: 32, paddingTop: 20, borderTop: "1px solid var(--color-border)" }}>
              <button onClick={() => setStep(s => Math.max(1, s - 1))} disabled={step === 1}
                className="btn-ghost" style={{ display: "flex", alignItems: "center", gap: 6, padding: "10px 18px", opacity: step === 1 ? 0.3 : 1 }}>
                <ChevronLeft size={16} /> Back
              </button>
              <button onClick={() => setStep(s => Math.min(TOTAL, s + 1))} disabled={!canNext()}
                className="btn-primary" style={{ display: "flex", alignItems: "center", gap: 6, padding: "12px 28px", opacity: canNext() ? 1 : 0.4, cursor: canNext() ? "pointer" : "not-allowed" }}>
                {step === 3 ? "Review Booking" : "Next"} <ChevronRight size={16} />
              </button>
            </div>
          )}
        </div>

        {/* Trust badges */}
        <div style={{ display: "flex", flexWrap: "wrap", gap: 12, justifyContent: "center", marginTop: 24 }}>
          {[
            { icon: <ShieldCheck size={14} />, text: "Secure & Confidential" },
            { icon: <MessageCircle size={14} />, text: "WhatsApp Confirmed" },
            { icon: <Check size={14} />, text: "Free Cancellation 24h" },
          ].map(b => (
            <div key={b.text} style={{ display: "flex", alignItems: "center", gap: 6, fontFamily: "'DM Sans',sans-serif", fontSize: 12, color: "var(--color-text-secondary)" }}>
              <span style={{ color: "var(--color-primary)" }}>{b.icon}</span>
              {b.text}
            </div>
          ))}
        </div>
      </div>
      <Script src="https://checkout.razorpay.com/v1/checkout.js" strategy="lazyOnload" />
    </div>
  );
}
