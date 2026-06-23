"use client";
import { ThemeProvider } from "next-themes";
import { SessionProvider } from "next-auth/react";
import { CurrencyProvider } from "@/context/CurrencyContext";
import { SmoothScrollProvider } from "@/components/providers/SmoothScrollProvider";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange={false}>
        <CurrencyProvider>
          <SmoothScrollProvider>
            {children}
          </SmoothScrollProvider>
        </CurrencyProvider>
      </ThemeProvider>
    </SessionProvider>
  );
}
