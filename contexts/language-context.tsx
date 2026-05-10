"use client";
import { createContext, useContext, useEffect, useState } from "react";
import { type Lang, type TKey, getT } from "@/lib/i18n";

const STORAGE_KEY = "atlas-lang";

interface LanguageCtx {
  lang: Lang;
  setLang: (l: Lang) => void;
  t: (key: TKey) => string;
}

const LanguageContext = createContext<LanguageCtx>({
  lang: "es",
  setLang: () => {},
  t: getT("es"),
});

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLangState] = useState<Lang>("es");

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY) as Lang | null;
    if (saved === "es" || saved === "en" || saved === "pt") setLangState(saved);
  }, []);

  function setLang(l: Lang) {
    setLangState(l);
    localStorage.setItem(STORAGE_KEY, l);
  }

  return (
    <LanguageContext.Provider value={{ lang, setLang, t: getT(lang) }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  return useContext(LanguageContext);
}
