"use client";
import { useState } from "react";
import { useCurrency } from "@/context/CurrencyContext";
import Link from "next/link";
import { Check, ChevronLeft, ChevronRight, Calendar, Clock, Video, Building2, ArrowRight } from "lucide-react";

// ── Types ──
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

// ── Step indicator ──
function StepBar({ current, total }: { current: number; total: number }) {
  const labels = ["Type", "Date & Time", "Details", "Payment", "Confirmation"];
  return (
    <div className="mb-8">
      <div className="flex items-center justify-between gap-2">
        {labels.map((l, i) => {
          const n = i + 1;
          const done = n < current;
          const active = n === current;
          return (
            <div key={l} className="flex flex-col items-center flex-1">
              <div className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-heading font-black mb-1.5 transition-all ${done ? "text-white" : active ? "text-white ring-4 ring-[var(--teal)] ring-offset-2" : "border-2"}`}
                style={{ background: done ? "var(--teal)" : active ? "var(--teal)" : "transparent", borderColor: active || done ? "var(--teal)" : "var(--border)", color: active || done ? "white" : "var(--text-secondary)" }}>
                {done ? <Check size={15} /> : n}
              </div>
              <span className={`text-[10px] font-body font-medium hidden sm:block ${active ? "text-[var(--teal)]" : done ? "text-[var(--teal)]" : ""}`} style={{ color: active ? "var(--teal)" : done ? "var(--teal)" : "var(--text-secondary)" }}>
                {l}
              </span>
            </div>
          );
        })}
      </div>
      {/* Progress bar */}
      <div className="mt-3 h-1 rounded-full" style={{ background: "var(--border)" }}>
        <div className="h-full rounded-full transition-all duration-500" style={{ background: "linear-gradient(90deg, var(--teal), var(--teal-mid))", width: `${((current - 1) / (total - 1)) * 100}%` }} />
      </div>
    </div>
  );
}

// ── Step 1: Type ──
function Step1({ state, setState, isIndia, fmt }: { state: BookingState; setState: (s: BookingState) => void; isIndia: boolean; fmt: (i: number, u: number) => string }) {
  return (
    <div>
      <h2 className="text-2xl font-heading font-black mb-2" style={{ color: "var(--text-primary)" }}>Choose Consultation Type</h2>
      <p className="text-sm mb-6" style={{ color: "var(--text-secondary)" }}>Select the type of consultation that works best for your family.</p>
      <div className="space-y-4">
        <button
          onClick={() => setState({ ...state, type: "online" })}
          className={`w-full p-5 rounded-card border-2 text-left transition-all hover:-translate-y-1 flex items-start gap-4 ${state.type === "online" ? "border-[var(--teal)] bg-[var(--teal-light)]" : "border-[var(--border)] hover:border-[var(--teal)] bg-[var(--card)]"}`}
        >
          <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-3xl flex-shrink-0" style={{ background: "var(--teal-light)" }}>
            <Video size={28} style={{ color: "var(--teal)" }} />
          </div>
          <div className="flex-1">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <h3 className="font-heading font-bold text-base" style={{ color: "var(--text-primary)" }}>📱 Online Consultation</h3>
              <span className="text-lg font-heading font-black" style={{ color: "var(--teal)" }}>{fmt(599, 9)}</span>
            </div>
            <p className="text-sm mt-1" style={{ color: "var(--text-secondary)" }}>Via Zoom · Available across India & worldwide · 45 mins · WhatsApp confirmation</p>
          </div>
          {state.type === "online" && <Check size={20} className="text-[var(--teal)] flex-shrink-0 mt-0.5" />}
        </button>

        {isIndia ? (
          <button
            onClick={() => setState({ ...state, type: "clinic" })}
            className={`w-full p-5 rounded-card border-2 text-left transition-all hover:-translate-y-1 flex items-start gap-4 ${state.type === "clinic" ? "border-[var(--orange)] bg-[var(--orange-light)]" : "border-[var(--border)] hover:border-[var(--orange)] bg-[var(--card)]"}`}
          >
            <div className="w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0" style={{ background: "var(--orange-light)" }}>
              <Building2 size={28} style={{ color: "var(--orange)" }} />
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <h3 className="font-heading font-bold text-base" style={{ color: "var(--text-primary)" }}>🏥 Visit the Clinic</h3>
                <span className="text-lg font-heading font-black" style={{ color: "var(--orange)" }}>₹799</span>
              </div>
              <p className="text-sm mt-1" style={{ color: "var(--text-secondary)" }}>In-person · Udaan Care, Katni, MP · 45 mins · By appointment only</p>
            </div>
            {state.type === "clinic" && <Check size={20} className="text-[var(--orange)] flex-shrink-0 mt-0.5" />}
          </button>
        ) : (
          <div className="p-4 rounded-card text-sm" style={{ background: "var(--teal-light)", color: "var(--teal)", border: "1px solid rgba(10,126,140,0.2)" }}>
            🌍 Clinic visits available in Katni, India only. International visitors can book online sessions from anywhere worldwide.
          </div>
        )}
      </div>
    </div>
  );
}

// ── Step 2: Date & Time ──
const TIMES = ["10:00 AM","10:30 AM","11:00 AM","11:30 AM","12:00 PM","12:30 PM","2:00 PM","2:30 PM","3:00 PM","3:30 PM","4:00 PM","4:30 PM","5:00 PM","5:30 PM","6:00 PM","6:30 PM","7:00 PM"];
const BOOKED = ["11:00 AM","12:30 PM","3:00 PM","5:30 PM"];

function Step2({ state, setState }: { state: BookingState; setState: (s: BookingState) => void }) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const dateMin = new Date(today);
  dateMin.setDate(dateMin.getDate() + 1);

  const dateMax = new Date(today);
  dateMax.setDate(dateMax.getDate() + 60);

  const selectedDate = state.date ? new Date(state.date) : null;
  const isSunday = selectedDate ? selectedDate.getDay() === 0 : false;

  return (
    <div>
      <h2 className="text-2xl font-heading font-black mb-2" style={{ color: "var(--text-primary)" }}>Choose Date & Time</h2>
      <p className="text-sm mb-6" style={{ color: "var(--text-secondary)" }}>Available Mon–Sat · 10 AM–7 PM IST · Sundays closed</p>

      {/* Date picker */}
      <div className="mb-6">
        <label className="block text-sm font-heading font-bold mb-2" style={{ color: "var(--text-primary)" }}>Select Date</label>
        <input
          type="date"
          className="input"
          value={state.date}
          min={dateMin.toISOString().split("T")[0]}
          max={dateMax.toISOString().split("T")[0]}
          onChange={(e) => setState({ ...state, date: e.target.value, time: "" })}
        />
        {isSunday && <p className="text-xs mt-1.5 text-[var(--orange)]">⚠️ Sundays are closed. Please select Mon–Sat.</p>}
        {state.date && !isSunday && <p className="text-xs mt-1.5 text-[var(--teal)]">✅ {new Date(state.date + "T00:00:00").toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "long", year: "numeric" })}</p>}
      </div>

      {/* Time slots */}
      {state.date && !isSunday && (
        <div>
          <label className="block text-sm font-heading font-bold mb-3" style={{ color: "var(--text-primary)" }}>
            Select Time Slot <span className="text-xs font-body font-normal ml-1" style={{ color: "var(--text-secondary)" }}>All times in IST</span>
          </label>
          <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
            {TIMES.map((t) => {
              const booked = BOOKED.includes(t);
              const selected = state.time === t;
              return (
                <button
                  key={t}
                  disabled={booked}
                  onClick={() => setState({ ...state, time: t })}
                  className={`py-2.5 px-2 rounded-btn text-xs font-heading font-bold border-2 transition-all ${
                    booked ? "opacity-40 cursor-not-allowed line-through" : selected ? "text-white border-[var(--teal)]" : "border-[var(--border)] hover:border-[var(--teal)] hover:bg-[var(--teal-light)]"
                  }`}
                  style={{
                    background: selected ? "var(--teal)" : booked ? "var(--bg)" : "var(--card)",
                    color: selected ? "white" : "var(--text-primary)",
                  }}
                >
                  {t}
                  {booked && <div className="text-[9px] font-body font-normal">Booked</div>}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

// ── Step 3: Details ──
function Step3({ state, setState }: { state: BookingState; setState: (s: BookingState) => void }) {
  const field = (label: string, key: keyof BookingState, type = "text", placeholder = "", required = true) => (
    <div>
      <label className="block text-sm font-heading font-bold mb-1.5" style={{ color: "var(--text-primary)" }}>
        {label} {required && <span style={{ color: "var(--orange)" }}>*</span>}
      </label>
      <input
        type={type}
        className="input"
        placeholder={placeholder}
        value={state[key] as string}
        onChange={(e) => setState({ ...state, [key]: e.target.value })}
        required={required}
      />
    </div>
  );

  return (
    <div>
      <h2 className="text-2xl font-heading font-black mb-2" style={{ color: "var(--text-primary)" }}>Your Details</h2>
      <p className="text-sm mb-6" style={{ color: "var(--text-secondary)" }}>Please fill in the details below. All fields marked * are required.</p>
      <div className="space-y-4">
        {field("Child's Full Name", "childName", "text", "e.g. Aarav Sharma")}
        {field("Parent / Guardian Name", "parentName", "text", "e.g. Priya Sharma")}
        {field("Child's Age", "childAge", "text", "e.g. 5 years 3 months")}
        {field("Phone Number (WhatsApp)", "phone", "tel", "+91 98765 43210")}
        {field("Email Address", "email", "email", "you@example.com")}
        <div>
          <label className="block text-sm font-heading font-bold mb-1.5" style={{ color: "var(--text-primary)" }}>
            Reason for Visit <span style={{ color: "var(--orange)" }}>*</span>
          </label>
          <textarea
            className="input resize-none"
            style={{ minHeight: "100px" }}
            placeholder="Briefly describe your child's challenges or what you'd like help with..."
            value={state.reason}
            onChange={(e) => setState({ ...state, reason: e.target.value })}
          />
        </div>
      </div>
    </div>
  );
}

// ── Step 4: Payment ──
function Step4({ state, isIndia, fmt, onNext }: { state: BookingState; isIndia: boolean; fmt: (i: number, u: number) => string; onNext: () => void }) {
  const [toastVisible, setToast] = useState(false);

  const price = state.type === "online" ? fmt(599, 9) : "₹799";
  const label = state.type === "online" ? "Online Consultation via Zoom" : "In-Clinic Visit, Katni";

  const handlePay = () => {
    setToast(true);
    setTimeout(() => { setToast(false); onNext(); }, 2000);
  };

  return (
    <div>
      <h2 className="text-2xl font-heading font-black mb-2" style={{ color: "var(--text-primary)" }}>Payment</h2>
      <p className="text-sm mb-6" style={{ color: "var(--text-secondary)" }}>Review your booking and complete payment to confirm.</p>

      {/* Summary card */}
      <div className="card p-5 mb-6">
        <h3 className="text-xs font-heading font-bold uppercase tracking-wider mb-4" style={{ color: "var(--text-secondary)" }}>Booking Summary</h3>
        <div className="space-y-3 text-sm">
          <div className="flex justify-between"><span style={{ color: "var(--text-secondary)" }}>Consultation Type</span><span className="font-heading font-bold" style={{ color: "var(--text-primary)" }}>{label}</span></div>
          <div className="flex justify-between"><span style={{ color: "var(--text-secondary)" }}>Date</span><span className="font-heading font-bold" style={{ color: "var(--text-primary)" }}>{state.date ? new Date(state.date + "T00:00:00").toLocaleDateString("en-IN", { weekday: "short", day: "numeric", month: "long" }) : "-"}</span></div>
          <div className="flex justify-between"><span style={{ color: "var(--text-secondary)" }}>Time</span><span className="font-heading font-bold" style={{ color: "var(--text-primary)" }}>{state.time || "-"} IST</span></div>
          <div className="flex justify-between"><span style={{ color: "var(--text-secondary)" }}>Doctor</span><span className="font-heading font-bold" style={{ color: "var(--text-primary)" }}>Dr. Prasoon Gupta</span></div>
          <div className="h-px" style={{ background: "var(--border)" }} />
          <div className="flex justify-between items-center">
            <span className="font-heading font-bold text-base" style={{ color: "var(--text-primary)" }}>Total</span>
            <span className="text-xl font-heading font-black" style={{ color: "var(--teal)" }}>{price}</span>
          </div>
        </div>
      </div>

      {/* Payment badges */}
      <div className="flex flex-wrap gap-2 mb-5">
        {isIndia
          ? ["UPI", "Visa", "Mastercard", "RuPay", "NetBanking"].map((m) => (
            <span key={m} className="px-3 py-1.5 rounded-badge text-xs font-heading font-bold" style={{ background: "var(--bg)", border: "1px solid var(--border)", color: "var(--text-secondary)" }}>{m}</span>
          ))
          : ["Visa", "Mastercard", "PayPal", "Stripe"].map((m) => (
            <span key={m} className="px-3 py-1.5 rounded-badge text-xs font-heading font-bold" style={{ background: "var(--bg)", border: "1px solid var(--border)", color: "var(--text-secondary)" }}>{m}</span>
          ))
        }
      </div>

      <button onClick={handlePay} className="btn-primary w-full py-4 text-base mb-3">
        🔒 Pay Securely — {price}
      </button>
      <p className="text-xs text-center" style={{ color: "var(--text-secondary)" }}>🔒 Your details are encrypted and secure · Powered by Razorpay</p>

      {toastVisible && (
        <div className="fixed bottom-24 left-1/2 -translate-x-1/2 px-5 py-3 rounded-card text-white text-sm font-heading font-bold shadow-2xl z-50 animate-fade-up" style={{ background: "var(--orange)" }}>
          ⚡ Payment integration coming soon — booking confirmed!
        </div>
      )}
    </div>
  );
}

// ── Step 5: Confirmation ──
function Step5({ state }: { state: BookingState }) {
  return (
    <div className="text-center">
      <div className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-5" style={{ background: "var(--success-light)" }}>
        <Check size={40} style={{ color: "var(--success)" }} />
      </div>
      <h2 className="text-3xl font-heading font-black mb-2" style={{ color: "var(--text-primary)" }}>Booking Confirmed! 🎉</h2>
      <p className="text-sm mb-6" style={{ color: "var(--text-secondary)" }}>Your appointment has been successfully booked with Dr. Prasoon Gupta.</p>

      <div className="card p-5 mb-6 text-left">
        <h3 className="text-xs font-heading font-bold uppercase tracking-wider mb-4" style={{ color: "var(--text-secondary)" }}>Appointment Details</h3>
        <div className="space-y-2.5 text-sm">
          {[
            ["Appointment ID", "UC-2025-" + Math.floor(Math.random() * 9000 + 1000)],
            ["Patient", state.childName || "—"],
            ["Type", state.type === "online" ? "Online Consultation via Zoom" : "In-Clinic Visit, Katni"],
            ["Date", state.date ? new Date(state.date + "T00:00:00").toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "long", year: "numeric" }) : "—"],
            ["Time", state.time ? `${state.time} IST` : "—"],
            ["Doctor", "Dr. Prasoon Gupta, BOT MOT"],
          ].map(([l, v]) => (
            <div key={l} className="flex justify-between gap-3">
              <span style={{ color: "var(--text-secondary)" }}>{l}</span>
              <span className="font-heading font-bold text-right" style={{ color: "var(--text-primary)" }}>{v}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-card p-4 mb-6 text-sm" style={{ background: "var(--teal-light)", border: "1px solid rgba(10,126,140,0.2)" }}>
        <p className="font-heading font-bold mb-1" style={{ color: "var(--teal)" }}>📲 WhatsApp Confirmation Coming</p>
        <p style={{ color: "var(--text-secondary)" }}>
          You will receive a WhatsApp confirmation to <strong>{state.phone || "your number"}</strong> shortly.
          {state.type === "online" && <> Your <strong>Zoom link</strong> will also be sent there.</>}
        </p>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        <Link href="/" className="btn-primary px-7 py-3.5">← Back to Home</Link>
        <a href="https://wa.me/918349764084?text=Hi!%20I%20just%20booked%20an%20appointment%20with%20Dr.%20Prasoon." target="_blank" rel="noopener noreferrer"
          className="inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-btn font-heading font-bold text-sm text-white min-h-[44px] transition-all hover:-translate-y-1"
          style={{ background: "#25D366" }}>
          💬 Contact us on WhatsApp
        </a>
      </div>
    </div>
  );
}

// ── Main Book Page ──
export default function BookPage() {
  const { isIndia, fmt } = useCurrency();
  const [step, setStep] = useState(1);
  const TOTAL = 5;

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
    <div className="min-h-screen pt-20 pb-16" style={{ background: "var(--bg)" }}>
      {/* Hero strip */}
      <div className="py-10 text-center" style={{ background: "linear-gradient(145deg, var(--navy), #0A7E8C22)" }}>
        <div className="text-4xl mb-2">📅</div>
        <h1 className="text-3xl font-heading font-black text-white mb-1">Book a Consultation</h1>
        <p style={{ color: "rgba(255,255,255,0.65)", fontSize: "0.95rem" }}>With Dr. Prasoon Gupta · BOT, MOT · Pediatric OT Specialist</p>
      </div>

      <div className="container max-w-2xl mt-8">
        <StepBar current={step} total={TOTAL} />

        <div className="card p-6 md:p-8">
          {step === 1 && <Step1 state={state} setState={setState} isIndia={isIndia} fmt={fmt} />}
          {step === 2 && <Step2 state={state} setState={setState} />}
          {step === 3 && <Step3 state={state} setState={setState} />}
          {step === 4 && <Step4 state={state} isIndia={isIndia} fmt={fmt} onNext={() => setStep(5)} />}
          {step === 5 && <Step5 state={state} />}

          {/* Navigation */}
          {step < 4 && (
            <div className="flex items-center justify-between mt-8 pt-5 border-t" style={{ borderColor: "var(--border)" }}>
              <button
                onClick={() => setStep((s) => Math.max(1, s - 1))}
                disabled={step === 1}
                className="flex items-center gap-2 btn-ghost px-4 py-2.5 disabled:opacity-30"
              >
                <ChevronLeft size={16} /> Back
              </button>
              <button
                onClick={() => setStep((s) => Math.min(TOTAL, s + 1))}
                disabled={!canNext()}
                className="btn-primary px-6 py-3 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:transform-none"
              >
                {step === 3 ? "Continue to Payment" : "Next"} <ChevronRight size={16} />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
