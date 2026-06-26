"use client";
import React, { createContext, useContext, useEffect, useState } from "react";

type Currency = "INR" | "USD";
type LocationTier = "IN" | "INTL";

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

interface CurrencyContextValue {
  currency: Currency;
  setCurrency: (c: Currency) => void;
  isIndia: boolean;
  prices: CurrencyConfig;
  fmt: (inr: number, usd: number) => string; // Kept for fallback only
}

const DEFAULT_RATE = 83.5;

const CurrencyContext = createContext<CurrencyContextValue>({
  currency: "INR",
  setCurrency: () => {},
  isIndia: true,
  prices: {
    online: { amount: 599, display: "₹599", label: "Online Consultation" },
    clinic: { amount: 799, display: "₹799", label: "In-Clinic Visit" },
    showClinic: true,
  },
  fmt: (inr) => `₹${inr}`,
});

export function CurrencyProvider({ children }: { children: React.ReactNode }) {
  const [currency, setCurrencyState] = useState<Currency>("INR");
  const [locationTier, setLocationTier] = useState<LocationTier>("IN");
  const [exchangeRate, setExchangeRate] = useState<number>(DEFAULT_RATE);

  useEffect(() => {
    // 1. Load saved display currency
    const savedCur = localStorage.getItem("udaan-display-currency") as Currency | null;
    if (savedCur === "INR" || savedCur === "USD") {
      setCurrencyState(savedCur);
    }

    // 2. Load cached exchange rate
    const cachedRateStr = localStorage.getItem("udaan-exchange-rate");
    const cachedRateTime = localStorage.getItem("udaan-exchange-rate-time");
    const now = Date.now();
    let currentRate = DEFAULT_RATE;

    if (cachedRateStr && cachedRateTime && now - parseInt(cachedRateTime) < 24 * 60 * 60 * 1000) {
      currentRate = parseFloat(cachedRateStr) || DEFAULT_RATE;
      setExchangeRate(currentRate);
    } else {
      fetch("https://open.er-api.com/v6/latest/USD")
        .then((r) => r.json())
        .then((data) => {
          if (data && data.rates && data.rates.INR) {
            currentRate = data.rates.INR;
            setExchangeRate(currentRate);
            localStorage.setItem("udaan-exchange-rate", currentRate.toString());
            localStorage.setItem("udaan-exchange-rate-time", now.toString());
          }
        })
        .catch(() => {});
    }

    // 3. Load cached location or fetch from IP
    const cachedLoc = localStorage.getItem("udaan-location-tier") as LocationTier | null;
    if (cachedLoc === "IN" || cachedLoc === "INTL") {
      setLocationTier(cachedLoc);
      if (!savedCur) {
        setCurrencyState(cachedLoc === "IN" ? "INR" : "USD");
      }
    } else {
      fetch("https://ipapi.co/json/")
        .then((r) => r.json())
        .then((data) => {
          const tier: LocationTier = data.country_code === "IN" ? "IN" : "INTL";
          setLocationTier(tier);
          localStorage.setItem("udaan-location-tier", tier);
          if (!savedCur) {
            const initialCur = tier === "IN" ? "INR" : "USD";
            setCurrencyState(initialCur);
            localStorage.setItem("udaan-display-currency", initialCur);
          }
        })
        .catch(() => {});
    }
  }, []);

  const setCurrency = (c: Currency) => {
    setCurrencyState(c);
    localStorage.setItem("udaan-display-currency", c);
  };

  // Compute dynamic prices based on LOCATION TIER, not display currency
  const getDynamicPrices = (): CurrencyConfig => {
    let onlineAmount = 0;
    let onlineDisplay = "";

    if (locationTier === "IN") {
      // BASE: ₹599
      if (currency === "INR") {
        onlineAmount = 599;
        onlineDisplay = "₹599";
      } else {
        // If an Indian visitor toggles to USD, they see the flat international price of $29
        onlineAmount = 29;
        onlineDisplay = `$29`;
      }
      
      return {
        online: { amount: onlineAmount, display: onlineDisplay, label: "Online Consultation" },
        clinic: { amount: 799, display: currency === "INR" ? "₹799" : `$${Math.round(799 / exchangeRate)}`, label: "In-Clinic Visit" },
        showClinic: true,
      };
    } else {
      // BASE: $29
      if (currency === "USD") {
        onlineAmount = 29;
        onlineDisplay = "$29";
      } else {
        const inrVal = Math.round(29 * exchangeRate);
        onlineAmount = inrVal;
        onlineDisplay = `₹${inrVal}`;
      }

      return {
        online: { amount: onlineAmount, display: onlineDisplay, label: "Online Consultation" },
        clinic: null,
        showClinic: false,
        clinicNote: "Clinic visits are available in Katni, India only. International visitors can book online sessions from anywhere worldwide.",
      };
    }
  };

  const prices = getDynamicPrices();

  const fmt = (inr: number, usd: number) => {
    return currency === "INR" ? `₹${inr}` : `$${usd}`;
  };

  return (
    <CurrencyContext.Provider value={{ currency, setCurrency, isIndia: locationTier === "IN", prices, fmt }}>
      {children}
    </CurrencyContext.Provider>
  );
}

export const useCurrency = () => useContext(CurrencyContext);
