import type { Metadata } from "next";
import AboutPageClient from "./AboutPageClient";

export const metadata: Metadata = {
  title: "About Us — Dr. Prasoon Gupta, Pediatric OT",
  description: "Learn about Dr. Prasoon Gupta (BOT, MOT), Udaan Care's mission, and our evidence-based approach to pediatric occupational therapy in Katni and online.",
};

export default function AboutPage() {
  return <AboutPageClient />;
}
