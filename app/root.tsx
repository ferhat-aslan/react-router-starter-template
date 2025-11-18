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

import {I18nProvider} from "./i18n/context";
import {renderToStaticMarkup} from "react-dom/server";

export const links: Route.LinksFunction = () => [
  {rel: "preconnect", href: "https://fonts.googleapis.com"},
  {
    rel: "preconnect",
    href: "https://fonts.gstatic.com",
    crossOrigin: "anonymous",
  },
  {
    rel: "stylesheet",
    href: "https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap",
  },
];

export function Layout({children}: {children: React.ReactNode}) {
  const {pathname} = useLocation();
  const params = useParams();
  const localeParam = pathname.includes("/de") ? "de" : pathname.includes("/es") ? "es" : pathname.includes("/ar") ? "ar" : "en";

  // Helper to get the pure path without locale prefix
  const getPurePath = (p: string) => {
    if (p.startsWith("/de/") || p === "/de") return p.substring(3);
    if (p.startsWith("/es/") || p === "/es") return p.substring(3);
    if (p.startsWith("/ar/") || p === "/ar") return p.substring(3);
    return p;
  };

  let purePath = getPurePath(pathname);
  if (!purePath.startsWith("/")) purePath = "/" + purePath;

  const origin = "https://kleinbyte.com";
  
  return (
    <html lang={localeParam} dir={localeParam === "ar" ? "rtl" : "ltr"}>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
        <link rel="canonical" href={origin + pathname} />
        <link
          rel="alternate"
          href={origin + purePath}
          hrefLang="en"
        />
        <link
          rel="alternate"
          href={origin + "/de" + (purePath === "/" ? "" : purePath)}
          hrefLang="de"
        />
        <link
          rel="alternate"
          href={origin + "/es" + (purePath === "/" ? "" : purePath)}
          hrefLang="es"
        />
        <link
          rel="alternate"
          href={origin + "/ar" + (purePath === "/" ? "" : purePath)}
          hrefLang="ar"
        />
        <link
          rel="alternate"
          href={origin + purePath}
          hrefLang="x-default"
        />
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
      </head>
      <body>
        <I18nProvider locale={localeParam}>
          {children}
          <ScrollRestoration />
          <Scripts />
        </I18nProvider>
      </body>
      <script
        async={true}
        dangerouslySetInnerHTML={{
          __html: `
		const button = document.querySelector('#menu-button');
const menu = document.querySelector('#menu');


button.addEventListener('click', () => {
  menu.classList.toggle('hidden');});

  const storedTheme = localStorage.getItem('theme');
  const prefersDark =
    window.matchMedia &&
    window.matchMedia('(prefers-color-scheme: dark)').matches;

  if (storedTheme) {
    document.documentElement.classList.add(storedTheme);
  } else if (prefersDark) {
    document.documentElement.classList.add('dark');
  }
window.addEventListener('scroll', function() {
    if (window.scrollY > 0) {
        document.body.classList.add('scrolled');
    } else {
        document.body.classList.remove('scrolled');
    }
});

`,
        }}
      />
    </html>
  );
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
