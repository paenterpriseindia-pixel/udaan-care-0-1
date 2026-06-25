"use client";

import React from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function PrivacyPolicyPage() {
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
            Privacy Policy
          </motion.h1>
          <p style={{ color: "#8B949E", fontSize: 16, maxWidth: 600 }}>
            Last updated: June 2026. This Privacy Policy describes how Udaan Care collects, uses, and protects your personal and health data.
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
            <h2 style={{ fontFamily: "'Nunito',sans-serif", fontWeight: 800, fontSize: "clamp(24px, 3vw, 32px)", marginBottom: 16 }}>1. Introduction</h2>
            <p style={{ marginBottom: 24, color: "var(--color-text-secondary)" }}>
              Welcome to Udaan Care. We are committed to protecting the privacy of our patients and visitors. This policy outlines our practices in compliance with the Digital Personal Data Protection Act (DPDPA) of India and applicable healthcare regulations.
            </p>

            <h2 style={{ fontFamily: "'Nunito',sans-serif", fontWeight: 800, fontSize: "clamp(24px, 3vw, 32px)", marginBottom: 16 }}>2. Data Collection</h2>
            <p style={{ marginBottom: 12, color: "var(--color-text-secondary)" }}>We collect the following types of information:</p>
            <ul style={{ paddingLeft: 24, marginBottom: 24, color: "var(--color-text-secondary)" }}>
              <li style={{ marginBottom: 8 }}><strong>Personal Information:</strong> Name, age, email, phone number, and address.</li>
              <li style={{ marginBottom: 8 }}><strong>Sensitive Health Data:</strong> Medical history, developmental assessments, diagnosis reports, and treatment notes required for occupational therapy.</li>
              <li style={{ marginBottom: 8 }}><strong>Payment Data:</strong> Transaction records for appointments and online therapy sessions.</li>
            </ul>

            <h2 style={{ fontFamily: "'Nunito',sans-serif", fontWeight: 800, fontSize: "clamp(24px, 3vw, 32px)", marginBottom: 16 }}>3. Purpose of Processing</h2>
            <p style={{ marginBottom: 24, color: "var(--color-text-secondary)" }}>
              We process your data exclusively for providing pediatric occupational therapy services, maintaining medical records, appointment scheduling, and complying with legal obligations.
            </p>

            <h2 style={{ fontFamily: "'Nunito',sans-serif", fontWeight: 800, fontSize: "clamp(24px, 3vw, 32px)", marginBottom: 16 }}>4. Data Sharing & Disclosure</h2>
            <p style={{ marginBottom: 24, color: "var(--color-text-secondary)" }}>
              Your health data is strictly confidential. We do not sell or rent your personal information. We may share information only with authorized medical professionals involved in your child's care, or when legally mandated by a court of law in India.
            </p>

            <h2 style={{ fontFamily: "'Nunito',sans-serif", fontWeight: 800, fontSize: "clamp(24px, 3vw, 32px)", marginBottom: 16 }}>5. Patient Rights</h2>
            <p style={{ marginBottom: 24, color: "var(--color-text-secondary)" }}>
              Under Indian data protection laws, you have the right to access your medical records, request corrections to inaccurate data, and withdraw consent for non-essential data processing.
            </p>

            <h2 style={{ fontFamily: "'Nunito',sans-serif", fontWeight: 800, fontSize: "clamp(24px, 3vw, 32px)", marginBottom: 16 }}>6. Security Measures</h2>
            <p style={{ marginBottom: 24, color: "var(--color-text-secondary)" }}>
              We implement industry-standard encryption, access controls, and secure physical storage at our Katni clinic to protect your sensitive data from unauthorized access or breaches.
            </p>

            <div style={{ marginTop: 40, padding: 20, background: "var(--color-primary-light)", borderRadius: 8 }}>
              <p style={{ margin: 0, color: "var(--color-primary-deep)", fontWeight: 600 }}>
                Questions about your privacy? Contact us at privacy@udaancare.com or call our Katni clinic.
              </p>
            </div>
            
            <p style={{ marginTop: 40, fontSize: 12, color: "var(--color-text-secondary)", fontStyle: "italic" }}>
              Disclaimer: This Privacy Policy is for informational purposes and reflects our commitment to patient confidentiality. It is subject to updates as per changes in Indian healthcare regulations.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
