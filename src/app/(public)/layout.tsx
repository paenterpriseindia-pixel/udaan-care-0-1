"use client";
import { ReactNode } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import WhatsAppFAB from "@/components/WhatsAppFAB";
import { PageTransition } from "@/components/providers/PageTransition";
import FactRibbon from "@/components/FactRibbon";

export default function PublicLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <Navbar />
      <FactRibbon />
      <main>
        <PageTransition>
          {children}
        </PageTransition>
      </main>
      <Footer />
      <WhatsAppFAB />
    </>
  );
}
