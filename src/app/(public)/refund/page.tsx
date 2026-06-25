"use client";

import React from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function RefundPolicyPage() {
  return (
    <div style={{ minHeight: "100vh", backgroundColor: "var(--color-bg)", paddingBottom: 80 }}>
      {/* Header */}
      <section style={{ paddingTop: 100, paddingBottom: 60, background: "#0D1117", overflow: "hidden" }}>
        <div className="container" style={{ position: "relative", zIndex: 1 }}>
          <Link href="/" style={{
            display: "inline-flex", alignItems: "center", gap: 8, color: "var(--color-primary-mid)",
            fontWeight: 700, textDecoration: "none", marginBottom: 24, transition: "color 0.2s ease"
          }}>
            <ArrowLeft size={18} /> Back to Home
          </Link>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            style={{ fontFamily: "'Nunito',sans-serif", fontWeight: 900, fontSize: "clamp(28px, 4vw, 42px)", color: "white", marginBottom: 16 }}
          >
            Refund & Cancellation Policy
          </motion.h1>
          <p style={{ color: "#8B949E", fontSize: 16, maxWidth: 600 }}>
            Last updated: June 2026. Please read our policies regarding appointment cancellations, rescheduling, and refunds for therapy sessions.
          </p>
        </div>
      </section>

      {/* Content */}
      <section style={{ paddingTop: 60 }}>
        <div className="container" style={{ maxWidth: 800 }}>
          <div style={{
            background: "var(--color-surface)", borderRadius: 16, padding: "40px",
            boxShadow: "var(--shadow-card)", color: "var(--color-text-primary)"
          }}>
            <h2 style={{ fontFamily: "'Nunito',sans-serif", fontWeight: 800, fontSize: "clamp(24px, 3vw, 32px)", marginBottom: 16 }}>1. Appointment Cancellations</h2>
            <p style={{ marginBottom: 24, color: "var(--color-text-secondary)" }}>
              We understand that unforeseen circumstances arise, especially when caring for children. However, to ensure our therapists can help as many families as possible, we require at least <strong>24 hours' notice</strong> for all appointment cancellations.
            </p>

            <h2 style={{ fontFamily: "'Nunito',sans-serif", fontWeight: 800, fontSize: "clamp(24px, 3vw, 32px)", marginBottom: 16 }}>2. Refund Eligibility</h2>
            <ul style={{ paddingLeft: 24, marginBottom: 24, color: "var(--color-text-secondary)" }}>
              <li style={{ marginBottom: 8 }}><strong>Full Refund:</strong> If you cancel your online or in-clinic appointment at least 24 hours before the scheduled time, you are eligible for a 100% refund of any prepaid fees.</li>
              <li style={{ marginBottom: 8 }}><strong>No Refund:</strong> Cancellations made within 24 hours of the appointment time, or "no-shows" (failing to attend without prior notice), are generally non-refundable.</li>
              <li style={{ marginBottom: 8 }}><strong>Provider Cancellations:</strong> If Udaan Care needs to cancel or reschedule an appointment due to therapist unavailability or technical issues on our end, you will be offered a priority rescheduled slot or a full refund.</li>
            </ul>

            <h2 style={{ fontFamily: "'Nunito',sans-serif", fontWeight: 800, fontSize: "clamp(24px, 3vw, 32px)", marginBottom: 16 }}>3. Rescheduling Sessions</h2>
            <p style={{ marginBottom: 24, color: "var(--color-text-secondary)" }}>
              You may reschedule your appointment without penalty if the request is made at least 12 hours prior to the session time. Rescheduling requests within 12 hours may be subject to availability and treated as a late cancellation at the clinic's discretion.
            </p>

            <h2 style={{ fontFamily: "'Nunito',sans-serif", fontWeight: 800, fontSize: "clamp(24px, 3vw, 32px)", marginBottom: 16 }}>4. Processing Time</h2>
            <p style={{ marginBottom: 24, color: "var(--color-text-secondary)" }}>
              Approved refunds for online payments will be processed back to the original method of payment within 5-7 business days, depending on your bank or payment provider's processing times.
            </p>
            
            <div style={{ marginTop: 40, padding: 20, background: "var(--color-primary-light)", borderRadius: 8 }}>
              <p style={{ margin: 0, color: "var(--color-primary-deep)", fontWeight: 600 }}>
                To request a cancellation or refund, please contact us at billing@udaancare.com or call our clinic directly.
              </p>
            </div>
            
          </div>
        </div>
      </section>
    </div>
  );
}
