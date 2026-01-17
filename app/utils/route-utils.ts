import { type RouteConfig, prefix } from "@react-router/dev/routes";
import { type Locale, SUPPORTED_LOCALES } from "../i18n/config";
import { useI18n } from "../context/i18n-context";

export { type Locale, SUPPORTED_LOCALES };

// Re-export hook that consumes the Context provided by root.tsx
export function useTranslation() {
    const { locale, messages } = useI18n();

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
