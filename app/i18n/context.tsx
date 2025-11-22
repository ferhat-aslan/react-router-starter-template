import React, {createContext, useContext} from "react";
import en from "./en.json";
import de from "./de.json";
import es from "./es.json";
import ar from "./ar.json";

export type Locale = "en" | "de" | "es" | "ar";
type Messages = Record<string, string>;

export const translations: Record<Locale, Messages> = {en, de, es, ar};

interface I18nContextType {
  t: (key: string) => string;
  locale: Locale;
}

const I18nContext = createContext<I18nContextType>({
  t: (key) => key,
  locale: "en",
});

export function I18nProvider({
  locale,
  children,
}: {
  locale: Locale;
  children: React.ReactNode;
}) {
  const messages = translations[locale] ?? translations.en;

  function t(key: string) {
    return messages[key] ?? key;
  }

  return (
    <I18nContext.Provider value={{t, locale}}>{children}</I18nContext.Provider>
  );
}

export function useI18n() {
  const context = useContext(I18nContext);
  if (!context) {
    throw new Error("useI18n must be used within an I18nProvider");
  }
  return context.t;
}
