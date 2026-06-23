"use client";
import React, { createContext, useContext, useEffect, useState } from "react";

type Currency = "INR" | "USD";

interface Price {
  amount: number;
  display: string;
  label: string;
}

interface CurrencyConfig {
  online: Price;
  clinic: Price | null;
  showClinic: boolean;
  clinicNote?: string;
}

const PRICES: Record<Currency, CurrencyConfig> = {
  INR: {
    online: { amount: 599,  display: "₹599", label: "Online Consultation" },
    clinic: { amount: 799,  display: "₹799", label: "In-Clinic Visit" },
    showClinic: true,
  },
  USD: {
    online: { amount: 9,    display: "$9",   label: "Online Consultation" },
    clinic: null,
    showClinic: false,
    clinicNote: "Clinic visits are available in Katni, India only. International patients are seen online.",
  },
};

interface CurrencyContextValue {
  currency: Currency;
  setCurrency: (c: Currency) => void;
  isIndia: boolean;
  prices: CurrencyConfig;
  fmt: (inr: number, usd: number) => string;
}

const CurrencyContext = createContext<CurrencyContextValue>({
  currency: "INR",
  setCurrency: () => {},
  isIndia: true,
  prices: PRICES.INR,
  fmt: (inr) => `₹${inr}`,
});

export function CurrencyProvider({ children }: { children: React.ReactNode }) {
  const [currency, setCurrencyState] = useState<Currency>("INR");

  useEffect(() => {
    const saved = localStorage.getItem("udaan-currency") as Currency | null;
    if (saved === "INR" || saved === "USD") {
      setCurrencyState(saved);
      return;
    }
    fetch("https://ipapi.co/json/")
      .then((r) => r.json())
      .then((data) => {
        const c: Currency = data.country_code === "IN" ? "INR" : "USD";
        setCurrencyState(c);
        localStorage.setItem("udaan-currency", c);
      })
      .catch(() => {});
  }, []);

  const setCurrency = (c: Currency) => {
    setCurrencyState(c);
    localStorage.setItem("udaan-currency", c);
  };

  const fmt = (inr: number, usd: number) =>
    currency === "INR" ? `₹${inr}` : `$${usd}`;

  return (
    <CurrencyContext.Provider value={{ currency, setCurrency, isIndia: currency === "INR", prices: PRICES[currency], fmt }}>
      {children}
    </CurrencyContext.Provider>
  );
}

export const useCurrency = () => useContext(CurrencyContext);
