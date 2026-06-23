import dynamic from "next/dynamic";
import HeroSection       from "@/components/home/HeroSection";
import StatsSection      from "@/components/home/StatsSection";
import ServicesSection   from "@/components/home/ServicesSection";
import DoctorSection     from "@/components/home/DoctorSection";
import HowItWorksSection from "@/components/home/HowItWorksSection";
import BlogPreviewSection from "@/components/home/BlogPreviewSection";
import FAQSection        from "@/components/home/FAQSection";
import FinalCTASection   from "@/components/home/FinalCTASection";

// Heavy / client-only — loaded dynamically
const ScrollStoryLine      = dynamic(() => import("@/components/home/ScrollStoryLine"),      { ssr: false });
const TestimonialCarousel  = dynamic(() => import("@/components/home/TestimonialCarousel"),  { ssr: false });

export default function HomePage() {
  return (
    <>
      {/* Fixed scroll-story line — desktop only */}
      <ScrollStoryLine />

      {/* Sections in order */}
      <HeroSection />
      <StatsSection />
      <ServicesSection />
      <DoctorSection />
      <HowItWorksSection />
      <BlogPreviewSection />
      <TestimonialCarousel />
      <FAQSection />
      <FinalCTASection />
    </>
  );
}
