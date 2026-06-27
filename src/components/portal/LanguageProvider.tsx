"use client";
import React, { createContext, useContext, useEffect, useState } from "react";
import { Language, translations, TranslationKey } from "@/lib/translations";

interface LanguageContextType {
  lang: Language | null; // null means hasn't selected yet
  setLang: (lang: Language) => void;
  t: (key: TranslationKey) => string;
}

const LanguageContext = createContext<LanguageContextType>({
  lang: null,
  setLang: () => {},
  t: (key) => translations.en[key],
});

export const useLanguage = () => useContext(LanguageContext);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLangState] = useState<Language | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("portal_lang") as Language | null;
    if (saved === "en" || saved === "hi") {
      setLangState(saved);
    }
    setMounted(true);
  }, []);

  const setLang = (newLang: Language) => {
    setLangState(newLang);
    localStorage.setItem("portal_lang", newLang);
  };

  const t = (key: TranslationKey) => {
    const activeLang = lang || "en";
    return translations[activeLang][key] || translations.en[key] || key;
  };

  // Prevent hydration mismatch by not rendering until we know the language
  if (!mounted) return null;

  return (
    <LanguageContext.Provider value={{ lang, setLang, t }}>
      {children}
    </LanguageContext.Provider>
  );
}
