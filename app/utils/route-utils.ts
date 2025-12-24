import { type RouteConfig, prefix } from "@react-router/dev/routes";
import { useLocation } from "react-router";
import en from "../i18n/en.json";
import de from "../i18n/de.json";
import es from "../i18n/es.json";
import ar from "../i18n/ar.json";
import tr from "../i18n/tr.json";
import pt from "../i18n/pt.json";
import fr from "../i18n/fr.json";
import it from "../i18n/it.json";
import ru from "../i18n/ru.json";

export type Locale = "en" | "de" | "es" | "ar" | "tr" | "pt" | "fr" | "it" | "ru";

export const SUPPORTED_LOCALES: Locale[] = ["en", "de", "es", "ar", "tr", "pt", "fr", "it", "ru"];

type Messages = Record<string, string>;
export const translations: Record<Locale, Messages> = { en, de, es, ar, tr, pt, fr, it, ru };

export function useTranslation() {
    const location = useLocation();
    const firstPathSegment = location.pathname.split("/")?.[1] as Locale;

    const locale: Locale = SUPPORTED_LOCALES.includes(firstPathSegment)
        ? firstPathSegment
        : "en";

    const messages = translations[locale] ?? translations.en;

    function t(key: string) {
        return messages[key] ?? key;
    }

    return { t, locale };
}

/**
 * Recursively localizes a route and its children.
 * Adds a unique ID suffix for each locale to avoid React Router route ID collisions.
 */
function localizeRoute(route: any, locale: Locale): any {
    const localizedRoute = {
        ...route,
        id: `${route.id ?? route.file}-${locale}-localized`
    };

    if (route.children) {
        localizedRoute.children = route.children.map((child: any) => localizeRoute(child, locale));
    }

    return localizedRoute;
}

/**
 * Generates localized routes for all supported locales except English (base).
 * English remains the default root-level routes.
 */
export function generateLocalizedRoutes(baseRoutes: any[]): any[] {
    const localizedRoutes: any[] = [];

    for (const locale of SUPPORTED_LOCALES) {
        if (locale === "en") continue;

        const routesForLocale = baseRoutes.map(route => localizeRoute(route, locale));
        localizedRoutes.push(...prefix(locale, routesForLocale));
    }

    return localizedRoutes;
}
