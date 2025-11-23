import { useLocation } from "react-router";
import en from "./en.json";
import de from "./de.json";
import es from "./es.json";
import ar from "./ar.json";

export type Locale = "en" | "de" | "es" | "ar";
type Messages = Record<string, string>;

export const translations: Record<Locale, Messages> = { en, de, es, ar };

export function useTranslation() {
  const location = useLocation();
  const firstPathSegment = location.pathname.split("/")?.[1];
  const locale: Locale =
    firstPathSegment === "de"
      ? "de"
      : firstPathSegment === "es"
      ? "es"
      : firstPathSegment === "ar"
      ? "ar"
      : "en";

  const messages = translations[locale] ?? translations.en;

  function t(key: string) {
    return messages[key] ?? key;
  }

  return { t, locale };
}
