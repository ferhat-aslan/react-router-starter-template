import {
  isRouteErrorResponse,
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLoaderData,
  useParams,
} from "react-router";
import {useLocation} from "react-router";

import type {Route} from "./+types/root";
import "./app.css";
import {generateCanonicalLinks} from "@forge42/seo-tools/canonical";

import {renderToStaticMarkup} from "react-dom/server";




export const links: Route.LinksFunction = () => [

];

import { SUPPORTED_LOCALES, type Locale } from "./i18n/config";
import { I18nProvider } from "./context/i18n-context";
import { useEffect } from "react";

export const loader = async ({ request }: Route.LoaderArgs) => {
  const url = new URL(request.url);
  const firstSegment = url.pathname.split("/")[1] as Locale;
  
  const locale: Locale = SUPPORTED_LOCALES.includes(firstSegment) 
    ? firstSegment 
    : "en";

  // Dynamic import for translations - this ensures only the needed file is loaded
  let messages = {};
  try {
    const module = await import(`./i18n/${locale}.json`);
    messages = module.default;
  } catch (error) {
    console.error(`Failed to load translations for ${locale}`, error);
    // Fallback to English if needed
    const enModule = await import(`./i18n/en.json`);
    messages = enModule.default;
  }

  return { locale, messages };
};

export function Layout({children}: {children: React.ReactNode}) {
  const { locale, messages } = useLoaderData<typeof loader>();
  const localeParam = locale; // Use the one determined by loader
  const origin = "https://kleinbyte.com";

  // Re-deriving path logic for canonical/alternates to keep it client-safe or reuse loader data?
  // We can keep the existing client-side logic for path manipulation since it's light.
  
  const {pathname} = useLocation();
  const pathnameNoTrailingSlash = pathname.replace(/\/$/, "");
  const segments = pathnameNoTrailingSlash.split("/").filter(Boolean);
  
  // Logic to build Clean path without Lang
  const pathWithoutLang =
    locale === "en"
      ? pathnameNoTrailingSlash
      : "/" + segments.slice(1).join("/");

  // ... (Canonical logic remains same)
  const canonical =
    locale === "en"
      ? `${origin}${pathWithoutLang}`
      : `${origin}/${locale}${pathWithoutLang}`;
  
  const alternates = SUPPORTED_LOCALES.map((lang) => {
    const href =
      lang === "en"
        ? `${origin}${pathWithoutLang}`
        : `${origin}/${lang}${pathWithoutLang}`;

    return {
      rel: "alternate",
      hrefLang: lang,
      href,
    };
  });
   const xDefault = {
      rel: "alternate",
      hrefLang: "x-default",
      href: `${origin}${pathWithoutLang}`,
    };
  
  return (
    <html lang={localeParam} dir={localeParam === "ar" ? "rtl" : "ltr"} suppressHydrationWarning>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
        <link rel="canonical" href={canonical} />
        {alternates.map((alt) => (
          <link key={alt.href} {...alt} />
        ))}
        {xDefault && (
          <link {...xDefault} />
        )}
      
        <script
          async
          src="https://www.googletagmanager.com/gtag/js?id=G-HRC6G6L65K"
        ></script>
        <script
          dangerouslySetInnerHTML={{
            __html: `  window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    gtag('js', new Date());
  
    gtag('config', 'G-HRC6G6L65K');`,
          }}
        ></script>
        <ThemeScript />
      </head>
      <body suppressHydrationWarning>
        <I18nProvider locale={locale} messages={messages}>
          {children}
        </I18nProvider>
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export function ThemeScript() {
  useEffect(() => {
    // Theme initialization
    const storedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;

    if (storedTheme) {
      document.documentElement.classList.add(storedTheme);
    } else if (prefersDark) {
      document.documentElement.classList.add('dark');
    }

    // Menu logic
    const button = document.querySelector('#menu-button');
    const menu = document.querySelector('#menu');
    
    if (button && menu) {
      const toggleMenu = () => menu.classList.toggle('hidden');
      button.addEventListener('click', toggleMenu);
      return () => button.removeEventListener('click', toggleMenu);
    }
  }, []);

  useEffect(() => {
    // Optimized scroll listener
    let ticking = false;
    
    const onScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          if (window.scrollY > 0) {
            document.body.classList.add('scrolled');
          } else {
            document.body.classList.remove('scrolled');
          }
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return null;
}

export default function App() {
  return <Outlet />;
}

export function ErrorBoundary({error}: Route.ErrorBoundaryProps) {
  let message = "Oops!";
  let details = "An unexpected error occurred.";
  let stack: string | undefined;

  if (isRouteErrorResponse(error)) {
    message = error.status === 404 ? "404" : "Error";
    details =
      error.status === 404
        ? "The requested page could not be found."
        : error.statusText || details;
  } else if (import.meta.env.DEV && error && error instanceof Error) {
    details = error.message;
    stack = error.stack;
  }

  return (
    <main className="pt-16 p-4 container mx-auto">
      <h1>{message}</h1>
      <p>{details}</p>
      {stack && (
        <pre className="w-full p-4 overflow-x-auto">
          <code>{stack}</code>
        </pre>
      )}
    </main>
  );
}
