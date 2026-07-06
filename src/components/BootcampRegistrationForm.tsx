"use client";
import { useState, useEffect } from "react";
import { useCurrency } from "@/context/CurrencyContext";
import { CheckCircle } from "lucide-react";
import { loadScript } from "@/lib/utils"; // assuming utility exists for razorpay, wait I should use direct script loading if I am not sure

export default function BootcampRegistrationForm({ bootcamp }: { bootcamp: any }) {
  const { currency } = useCurrency();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  
  const [form, setForm] = useState({
    parentName: "", childName: "", childAge: "", email: "", phone: "", reasonForJoining: ""
  });

  // Calculate final amount based on currency and early bird
  const now = new Date();
  const isEarlyBird = bootcamp.earlyBirdDeadline && now < new Date(bootcamp.earlyBirdDeadline);
  
  let finalAmount = bootcamp.isFree ? 0 : (currency === "INR" ? bootcamp.priceINR : bootcamp.priceUSD);
  if (isEarlyBird && !bootcamp.isFree) {
    finalAmount = currency === "INR" ? bootcamp.earlyBirdINR : bootcamp.earlyBirdUSD;
  }

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const payload = { ...form, childAge: parseInt(form.childAge) || null, bootcampId: bootcamp.id, currency, amountPaid: finalAmount };
      
      const res = await fetch("/api/bootcamp-register", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      
      if (!res.ok) throw new Error(data.error || "Failed to register");

      if (bootcamp.isFree) {
        setSuccess(true);
        return;
      }

      // Load Razorpay
      const Razorpay = (window as any).Razorpay;
      if (!Razorpay) {
        alert("Razorpay failed to load");
        setLoading(false);
        return;
      }

      const options = {
        key: data.keyId,
        amount: data.order.amount,
        currency: data.order.currency,
        name: "Udaan Care",
        description: bootcamp.title,
        order_id: data.order.id,
        handler: async function (response: any) {
          // Verify
          const verifyRes = await fetch("/api/bootcamp-verify", {
            method: "POST", headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ ...response, registrationId: data.registrationId })
          });
          if (verifyRes.ok) setSuccess(true);
          else alert("Payment verification failed. Contact support.");
        },
        prefill: { name: form.parentName, email: form.email, contact: form.phone },
        theme: { color: "#0A7E8C" }
      };

      const rzp = new Razorpay(options);
      rzp.on("payment.failed", () => alert("Payment failed"));
      rzp.open();

    } catch (err: any) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div style={{ background: "#F7FAFC", borderRadius: 20, padding: 40, textAlign: "center", border: "1px solid #E2EBF0" }}>
        <CheckCircle size={64} color="#22C55E" style={{ margin: "0 auto 20px" }} />
        <h3 style={{ fontFamily: "'Nunito', sans-serif", fontWeight: 800, fontSize: 24, color: "#1A2B35", margin: "0 0 12px" }}>
          Registration Successful!
        </h3>
        <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 16, color: "#6B7C8A", margin: "0 0 24px" }}>
          Thank you for registering for {bootcamp.title}. We have sent the details to {form.email}.
        </p>
      </div>
    );
  }

  return (
    <div style={{ background: "white", borderRadius: 20, padding: 32, boxShadow: "0 10px 40px rgba(10,126,140,0.08)", border: "1px solid #E2EBF0" }}>
      <h3 style={{ fontFamily: "'Nunito', sans-serif", fontWeight: 800, fontSize: 22, color: "#1A2B35", margin: "0 0 24px" }}>
        Register Now
      </h3>

      <script src="https://checkout.razorpay.com/v1/checkout.js" async />

      <form onSubmit={submit} style={{ display: "flex", flexDirection: "column", gap: 20 }}>
        
        <div style={{ display: "flex", gap: 16 }}>
          <div style={{ flex: 1 }}>
            <label style={{ display: "block", fontSize: 13, fontWeight: 700, color: "#1A2B35", marginBottom: 8, fontFamily: "'DM Sans', sans-serif" }}>Your Name *</label>
            <input required type="text" value={form.parentName} onChange={e => setForm({...form, parentName: e.target.value})} style={{ width: "100%", padding: "14px 16px", borderRadius: 10, border: "1.5px solid #E2EBF0", fontSize: 15, fontFamily: "'DM Sans', sans-serif" }} placeholder="John Doe" />
          </div>
        </div>

        <div style={{ display: "flex", gap: 16 }}>
          <div style={{ flex: 1 }}>
            <label style={{ display: "block", fontSize: 13, fontWeight: 700, color: "#1A2B35", marginBottom: 8, fontFamily: "'DM Sans', sans-serif" }}>Email *</label>
            <input required type="email" value={form.email} onChange={e => setForm({...form, email: e.target.value})} style={{ width: "100%", padding: "14px 16px", borderRadius: 10, border: "1.5px solid #E2EBF0", fontSize: 15, fontFamily: "'DM Sans', sans-serif" }} placeholder="john@example.com" />
          </div>
          <div style={{ flex: 1 }}>
            <label style={{ display: "block", fontSize: 13, fontWeight: 700, color: "#1A2B35", marginBottom: 8, fontFamily: "'DM Sans', sans-serif" }}>Phone *</label>
            <input required type="tel" value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} style={{ width: "100%", padding: "14px 16px", borderRadius: 10, border: "1.5px solid #E2EBF0", fontSize: 15, fontFamily: "'DM Sans', sans-serif" }} placeholder="+91 98765 43210" />
          </div>
        </div>

        <div style={{ display: "flex", gap: 16 }}>
          <div style={{ flex: 1 }}>
            <label style={{ display: "block", fontSize: 13, fontWeight: 700, color: "#1A2B35", marginBottom: 8, fontFamily: "'DM Sans', sans-serif" }}>Child's Name (Optional)</label>
            <input type="text" value={form.childName} onChange={e => setForm({...form, childName: e.target.value})} style={{ width: "100%", padding: "14px 16px", borderRadius: 10, border: "1.5px solid #E2EBF0", fontSize: 15, fontFamily: "'DM Sans', sans-serif" }} placeholder="Child Name" />
          </div>
          <div style={{ flex: 1 }}>
            <label style={{ display: "block", fontSize: 13, fontWeight: 700, color: "#1A2B35", marginBottom: 8, fontFamily: "'DM Sans', sans-serif" }}>Child's Age (Optional)</label>
            <input type="number" value={form.childAge} onChange={e => setForm({...form, childAge: e.target.value})} style={{ width: "100%", padding: "14px 16px", borderRadius: 10, border: "1.5px solid #E2EBF0", fontSize: 15, fontFamily: "'DM Sans', sans-serif" }} placeholder="Age in years" />
          </div>
        </div>

        <div>
          <label style={{ display: "block", fontSize: 13, fontWeight: 700, color: "#1A2B35", marginBottom: 8, fontFamily: "'DM Sans', sans-serif" }}>What do you hope to learn? (Optional)</label>
          <textarea rows={3} value={form.reasonForJoining} onChange={e => setForm({...form, reasonForJoining: e.target.value})} style={{ width: "100%", padding: "14px 16px", borderRadius: 10, border: "1.5px solid #E2EBF0", fontSize: 15, fontFamily: "'DM Sans', sans-serif" }} placeholder="Your expectations..." />
        </div>

        <div style={{ background: "#F7FAFC", borderRadius: 12, padding: 20, display: "flex", justifyContent: "space-between", alignItems: "center", border: "1px dashed #0A7E8C" }}>
          <div>
            <div style={{ fontSize: 13, color: "#6B7C8A", fontWeight: 700, fontFamily: "'DM Sans', sans-serif", marginBottom: 4 }}>TOTAL AMOUNT</div>
            {isEarlyBird && !bootcamp.isFree && (
              <div style={{ fontSize: 12, color: "#F5820D", fontWeight: 700, background: "rgba(245,130,13,0.1)", padding: "2px 8px", borderRadius: 4, display: "inline-block", marginBottom: 4 }}>
                Early Bird Applied
              </div>
            )}
          </div>
          <div style={{ fontFamily: "'Nunito', sans-serif", fontWeight: 900, fontSize: 28, color: "#0A7E8C" }}>
            {bootcamp.isFree ? "FREE" : `${currency === "INR" ? "₹" : "$"}${finalAmount}`}
          </div>
        </div>

        <button disabled={loading} type="submit" style={{ background: "linear-gradient(135deg, #F5820D, #E06B00)", color: "white", border: "none", borderRadius: 12, padding: "0 24px", height: 56, fontSize: 16, fontWeight: 700, fontFamily: "'DM Sans', sans-serif", cursor: loading ? "not-allowed" : "pointer", opacity: loading ? 0.7 : 1, width: "100%", display: "flex", justifyContent: "center", alignItems: "center" }}>
          {loading ? "Processing..." : (bootcamp.isFree ? "Register for Free" : "Proceed to Payment")}
        </button>

      </form>
    </div>
  );
}
