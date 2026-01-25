import {
  isRouteErrorResponse,
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useParams,
} from "react-router";
import {useLocation} from "react-router";

import type {Route} from "./+types/root";
import "./app.css";
import {generateCanonicalLinks} from "@forge42/seo-tools/canonical";

import {renderToStaticMarkup} from "react-dom/server";

export const links: Route.LinksFunction = () => [
  /* {rel: "preconnect", href: "https://fonts.googleapis.com"},
  {
    rel: "preconnect",
    href: "https://fonts.gstatic.com",
    crossOrigin: "anonymous",
  },
  {
    rel: "stylesheet",
    href: "https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap",
  }, */
];

import {SUPPORTED_LOCALES, type Locale} from "./utils/route-utils";

export function Layout({children}: {children: React.ReactNode}) {
  const {pathname} = useLocation();

  const localeParam =
    SUPPORTED_LOCALES.find((lang) => pathname.startsWith(`/${lang}`)) || "en";
  const origin = "https://kleinbyte.com";

  const pathnameNoTrailingSlash = pathname.replace(/\/$/, "");
  // detect language from URL
  const segments = pathnameNoTrailingSlash.split("/").filter(Boolean);
  const first = segments[0];

  const currentLang: Locale = SUPPORTED_LOCALES.includes(first as any)
    ? (first as any)
    : "en";
  // build the base path WITHOUT language prefix
  // /de/pdf-tools → /pdf-tools
  const pathWithoutLang =
    currentLang === "en"
      ? pathnameNoTrailingSlash
      : "/" + segments.slice(1).join("/");

  // canonical URL (language-aware)
  const canonical =
    currentLang === "en"
      ? `${origin}${pathWithoutLang}`
      : `${origin}/${currentLang}${pathWithoutLang}`;

  // build hreflang URLs for all languages
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

  // x-default → English (your default)
  const xDefault = {
    rel: "alternate",
    hrefLang: "x-default",
    href: `${origin}${pathWithoutLang}`,
  };

  return (
    <html
      lang={localeParam}
      dir={localeParam === "ar" ? "rtl" : "ltr"}
      suppressHydrationWarning
    >
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
        <link rel="canonical" href={canonical} />
        {alternates.map((alt) => (
          <link key={alt.href} {...alt} />
        ))}
        {xDefault && <link {...xDefault} />}

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
        {children}
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export function ThemeScript() {
  const scriptContent = `
    (function() {
      // Theme initialization
      try {
        const storedTheme = localStorage.getItem('theme');
        const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
        if (storedTheme) {
          document.documentElement.classList.add(storedTheme);
        } else if (prefersDark) {
          document.documentElement.classList.add('dark');
        }
      } catch (e) {}

      // Menu & Scroll logic (runs after DOM is ready)
      document.addEventListener('DOMContentLoaded', () => {
        // Menu logic
        const button = document.querySelector('#menu-button');
        const menu = document.querySelector('#menu');
        if (button && menu) {
          button.addEventListener('click', () => menu.classList.toggle('hidden'));
        }

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
        onScroll(); // Initial check
      });
    })();
  `;

  return <script dangerouslySetInnerHTML={{__html: scriptContent}} />;
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
