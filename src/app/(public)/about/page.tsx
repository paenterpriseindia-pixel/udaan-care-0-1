import type { Metadata } from "next";
import AboutPageClient from "./AboutPageClient";

export const metadata: Metadata = {
  title: "About Us — Dr. Prasoon Gupta, Pediatric OT",
  description: "Learn about Dr. Prasoon Gupta (BOT, MOT), Udaan Care's mission, and our evidence-based approach to pediatric occupational therapy in Katni and online.",
};

export default function AboutPage() {
  // This timestamp is generated on the server during static build or revalidation.
  // It won't change on every client render, preventing excessive downloads!
  const version = Date.now();
  return <AboutPageClient version={version} />;
}
