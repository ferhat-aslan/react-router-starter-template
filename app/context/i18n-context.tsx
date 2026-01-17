import { createContext, useContext, type ReactNode } from "react";
import type { Locale } from "../i18n/config";

type Messages = Record<string, string>;

interface I18nContextType {
  locale: Locale;
  messages: Messages;
}

const I18nContext = createContext<I18nContextType | null>(null);

export function I18nProvider({ 
  children, 
  locale, 
  messages 
}: { 
  children: ReactNode; 
  locale: Locale; 
  messages: Messages; 
}) {
  return (
    <I18nContext.Provider value={{ locale, messages }}>
      {children}
    </I18nContext.Provider>
  );
}

export function useI18n() {
  const context = useContext(I18nContext);
  if (!context) {
    throw new Error("useI18n must be used within an I18nProvider");
  }
  return context;
}
