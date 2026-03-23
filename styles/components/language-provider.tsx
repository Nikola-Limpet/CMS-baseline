"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import en from "@/i18n/en.json";
import km from "@/i18n/km.json";

type Language = "en" | "km";

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType>({
  language: "en",
  setLanguage: () => {},
  t: (key: string) => key,
});

const translations: Record<Language, Record<string, string>> = { en, km };

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>("en");

  const changeLanguage = (lang: Language) => {
    setLanguage(lang);
    if (typeof window !== "undefined") {
      localStorage.setItem("language", lang);
      document.documentElement.lang = lang;

      if (lang === "km") {
        document.documentElement.classList.add("khmer");
        document.documentElement.classList.remove("english");
      } else {
        document.documentElement.classList.add("english");
        document.documentElement.classList.remove("khmer");
      }
    }
  };

  const translate = (key: string): string => {
    return translations[language][key] || translations["en"][key] || key;
  };

  useEffect(() => {
    const savedLanguage = localStorage.getItem("language") as Language;
    if (savedLanguage && (savedLanguage === "en" || savedLanguage === "km")) {
      setLanguage(savedLanguage);
      document.documentElement.lang = savedLanguage;

      if (savedLanguage === "km") {
        document.documentElement.classList.add("khmer");
        document.documentElement.classList.remove("english");
      } else {
        document.documentElement.classList.add("english");
        document.documentElement.classList.remove("khmer");
      }
    } else {
      document.documentElement.classList.add("english");
      document.documentElement.classList.remove("khmer");
    }
  }, []);

  return (
    <LanguageContext.Provider value={{ language, setLanguage: changeLanguage, t: translate }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);
