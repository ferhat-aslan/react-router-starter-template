// ~/utils/route-utils.tsx
import { type RouteConfig, prefix } from "@react-router/dev/routes";
import React from "react";
import { useLocation } from "react-router";

export type Locale = "en" | "de" | "es" | "ar" | "tr" | "pt" | "fr" | "it" | "ru";

export const SUPPORTED_LOCALES: Locale[] = ["en", "de", "es", "ar", "tr", "pt", "fr", "it", "ru"];

type Messages = Record<string, string>;

// JSON dosyalarını dinamik import et (SSR-safe)
const translationLoaders: Record<Locale, () => Promise<Messages>> = {
    en: () => import("../i18n/en.json").then(m => m.default),
    de: () => import("../i18n/de.json").then(m => m.default),
    es: () => import("../i18n/es.json").then(m => m.default),
    ar: () => import("../i18n/ar.json").then(m => m.default),
    tr: () => import("../i18n/tr.json").then(m => m.default),
    pt: () => import("../i18n/pt.json").then(m => m.default),
    fr: () => import("../i18n/fr.json").then(m => m.default),
    it: () => import("../i18n/it.json").then(m => m.default),
    ru: () => import("../i18n/ru.json").then(m => m.default),
};

// SSR için sync translation (sadece loader'lar için)
let cachedTranslations: Record<Locale, Messages> | null = null;

export const loadTranslation = async (locale: Locale): Promise<Messages> => {
    return await translationLoaders[locale]();
};

// SSR-safe t fonksiyonu (server component'ler için)
export const createTFunction = (messages: Messages) => {
    return (key: string): string => messages[key] ?? key;
};

// Client-side hook (hydration'dan sonra çalışır)
export function useTranslation() {
    const location = useLocation();
    const locale = getLocaleFromPath(location.pathname);

    // Bu hook sadece client'da çalıştığı için useState kullanabiliriz
    const [messages, setMessages] = React.useState<Messages | null>(null);
    const [isLoading, setIsLoading] = React.useState(false);

    React.useEffect(() => {
        let isMounted = true;

        const loadMessages = async () => {
            setIsLoading(true);
            try {
                const loadedMessages = await translationLoaders[locale]();
                if (isMounted) {
                    setMessages(loadedMessages);
                }
            } catch (error) {
                console.error("Failed to load translations:", error);
            } finally {
                if (isMounted) {
                    setIsLoading(false);
                }
            }
        };

        loadMessages();

        return () => {
            isMounted = false;
        };
    }, [locale]);

    const t = React.useCallback((key: string): string => {
        return messages?.[key] ?? key;
    }, [messages]);

    return {
        t,
        locale,
        isLoading,
        messages
    };
}

// SSR-safe locale detection
export function getLocaleFromPath(pathname: string): Locale {
    const firstSegment = pathname.split("/")?.[1];

    // Type guard
    const isSupportedLocale = (str: string): str is Locale => {
        return SUPPORTED_LOCALES.includes(str as Locale);
    };

    return isSupportedLocale(firstSegment) ? firstSegment : "en";
}

// Sync version for server-side (if needed in loaders)
export function getLocaleFromPathSync(pathname: string): Locale {
    return getLocaleFromPath(pathname);
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

// Helper for loader functions
export async function getTranslationData(pathname: string) {
    const locale = getLocaleFromPath(pathname);
    const messages = await loadTranslation(locale);

    return {
        locale,
        messages,
        t: createTFunction(messages)
    };
}

// For backward compatibility
export const translations: Record<Locale, Messages> = {} as any;