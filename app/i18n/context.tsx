import React, {createContext, useContext} from "react";
import en from "./en.json";
import de from "./de.json";
import es from "./es.json";
import ar from "./ar.json";

export type Locale = "en" | "de" | "es" | "ar";
type Messages = Record<any, any>;

export const translations: Record<Locale, Messages> = {en, de, es, ar};

const I18nContext: any = createContext<{t: (key: string) => string}>({
  t: (key) => key,
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

  return <I18nContext.Provider value={{t}}>{children}</I18nContext.Provider>;
}

export function useI18n() {
  return (useContext(I18nContext) as any).t;
}
