import type { Metadata } from "next";
import ServicesIndexClient from "./ServicesIndexClient";

export const metadata: Metadata = {
  title: "Our Services — Pediatric OT, Sensory Integration & More",
  description: "Explore all therapy services at Udaan Care — Occupational Therapy, Sensory Integration, Pediatric Therapy, and Online Therapy for children across India.",
};

export default function ServicesPage() {
  return <ServicesIndexClient />;
}
