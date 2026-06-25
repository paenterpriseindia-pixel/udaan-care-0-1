"use client";

import React from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function TermsOfServicePage() {
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
            Terms & Conditions
          </motion.h1>
          <p style={{ color: "#8B949E", fontSize: 16, maxWidth: 600 }}>
            Last updated: June 2026. By accessing or using Udaan Care's website and services, you agree to be bound by these terms.
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
            <h2 style={{ fontFamily: "'Nunito',sans-serif", fontWeight: 800, fontSize: "clamp(24px, 3vw, 32px)", marginBottom: 16 }}>1. Scope of Services</h2>
            <p style={{ marginBottom: 24, color: "var(--color-text-secondary)" }}>
              Udaan Care provides pediatric occupational therapy, special education, and related allied health services. These services are provided both in-person at our clinic in Katni, Madhya Pradesh, and virtually via our online telehealth platform.
            </p>

            <h2 style={{ fontFamily: "'Nunito',sans-serif", fontWeight: 800, fontSize: "clamp(24px, 3vw, 32px)", marginBottom: 16 }}>2. Medical Disclaimer (Not for Emergencies)</h2>
            <p style={{ marginBottom: 24, color: "var(--color-text-secondary)" }}>
              <strong>IMPORTANT:</strong> Our website and online consultation services are NOT intended for medical emergencies. If your child is experiencing a medical emergency, please call your local emergency number (e.g., 108 in India) or visit the nearest hospital immediately. Information provided on this website is for educational purposes only and does not substitute professional medical diagnosis or treatment.
            </p>

            <h2 style={{ fontFamily: "'Nunito',sans-serif", fontWeight: 800, fontSize: "clamp(24px, 3vw, 32px)", marginBottom: 16 }}>3. Patient & Guardian Responsibilities</h2>
            <p style={{ marginBottom: 12, color: "var(--color-text-secondary)" }}>As a user of our services, you agree to:</p>
            <ul style={{ paddingLeft: 24, marginBottom: 24, color: "var(--color-text-secondary)" }}>
              <li style={{ marginBottom: 8 }}>Provide accurate and complete medical history and information regarding your child.</li>
              <li style={{ marginBottom: 8 }}>Ensure a parent or legal guardian is present during all pediatric tele-consultation sessions.</li>
              <li style={{ marginBottom: 8 }}>Follow the treatment plans and recommendations provided by our certified therapists to the best of your ability.</li>
            </ul>

            <h2 style={{ fontFamily: "'Nunito',sans-serif", fontWeight: 800, fontSize: "clamp(24px, 3vw, 32px)", marginBottom: 16 }}>4. Payments & Billing</h2>
            <p style={{ marginBottom: 24, color: "var(--color-text-secondary)" }}>
              Consultation fees are payable in advance for online sessions. For in-clinic visits, payment terms will be discussed at the reception. All online payments are processed securely through our authorized payment gateways. Please refer to our Refund Policy for cancellation details.
            </p>

            <h2 style={{ fontFamily: "'Nunito',sans-serif", fontWeight: 800, fontSize: "clamp(24px, 3vw, 32px)", marginBottom: 16 }}>5. Limitation of Liability</h2>
            <p style={{ marginBottom: 24, color: "var(--color-text-secondary)" }}>
              Udaan Care and its therapists shall not be liable for any indirect, incidental, or consequential damages arising from the use of our website or telehealth services. Our liability is limited to the maximum extent permitted by Indian law.
            </p>

            <h2 style={{ fontFamily: "'Nunito',sans-serif", fontWeight: 800, fontSize: "clamp(24px, 3vw, 32px)", marginBottom: 16 }}>6. Dispute Resolution</h2>
            <p style={{ marginBottom: 24, color: "var(--color-text-secondary)" }}>
              These terms are governed by the laws of India. Any disputes arising from these terms or your use of our services shall be subject to the exclusive jurisdiction of the courts located in Katni, Madhya Pradesh.
            </p>
            
            <p style={{ marginTop: 40, fontSize: 12, color: "var(--color-text-secondary)", fontStyle: "italic" }}>
              Disclaimer: These Terms & Conditions are provided as a standard framework for healthcare services and are subject to change. Please consult with the clinic administration for any specific service agreements.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
