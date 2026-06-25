"use client";
import { useState } from "react";
import LoadingScreen from "@/components/shared/LoadingScreen";

export default function SplashWrapper({ children }: { children: React.ReactNode }) {
  const [done, setDone] = useState(false);

  return (
    <>
      {!done && <LoadingScreen onDone={() => setDone(true)} />}
      <div style={{ opacity: done ? 1 : 0, transition: "opacity 0.4s ease" }}>
        {children}
      </div>
    </>
  );
}
