import type { Metadata, Viewport } from "next";
import "./globals.css";
import SplashWrapper from "@/components/shared/SplashWrapper";
import { Providers } from "@/providers/Providers";
import SmoothEffects from "@/components/providers/SmoothEffects";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  themeColor: "#0A7E8C",
};

export const metadata: Metadata = {
  title: {
    default: "Udaan Care — Pediatric Occupational Therapy | Katni, MP",
    template: "%s | Udaan Care",
  },
  description:
    "Expert pediatric occupational therapy in Katni, MP. Sensory integration, autism, ADHD, developmental delays. Online consultations available across India and worldwide. Dr. Prasoon Gupta (BOT, MOT).",
  keywords: ["pediatric occupational therapy", "sensory integration", "autism therapy", "ADHD therapy", "occupational therapist Katni", "online OT India", "Dr Prasoon Gupta", "Udaan Care"],
  metadataBase: new URL("https://udaancare.in"),
  openGraph: {
    type: "website",
    locale: "en_IN",
    siteName: "Udaan Care",
    url: "https://udaancare.in",
    images: [{ url: "/og.jpg", width: 1200, height: 630 }],
  },
  twitter: { card: "summary_large_image" },
  robots: { index: true, follow: true },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* eslint-disable-next-line @next/next/no-page-custom-font */}
        <link href="https://fonts.googleapis.com/css2?family=Nunito:wght@400;500;600;700;800;900&family=DM+Sans:ital,opsz,wght@0,9..40,400;0,9..40,500;0,9..40,600;0,9..40,700;1,9..40,400&display=swap" rel="stylesheet" />
        <meta name="theme-color" content="#0A7E8C" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "MedicalBusiness",
              name: "Udaan Care",
              url: "https://udaancare.in",
              telephone: ["+91-8349764084", "+91-8349550671"],
              email: "care@udaancare.in",
              address: {
                "@type": "PostalAddress",
                streetAddress: "Sai Kripa First Floor, Garg Chowraha, Pathak Gali, Near Rama Pharma, Over Bridge Road",
                addressLocality: "Katni",
                addressRegion: "Madhya Pradesh",
                postalCode: "483501",
                addressCountry: "IN",
              },
            }),
          }}
        />
      </head>
      <body>
        <Providers>
          <SmoothEffects />
          <SplashWrapper>{children}</SplashWrapper>
        </Providers>


      </body>
    </html>
  );
}
