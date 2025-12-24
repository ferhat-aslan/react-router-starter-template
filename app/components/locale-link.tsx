import React from "react";
import { NavLink, useLocation } from "react-router";
import { SUPPORTED_LOCALES, type Locale } from "../utils/route-utils";

interface LocaleLinkProps {
  to: string;
  children: React.ReactNode;
  className?: string | ((props: { isActive: boolean; isPending: boolean }) => string | undefined);
  end?: boolean;
  [key: string]: any;
}

export const LocaleLink: React.FC<LocaleLinkProps> = ({
  to,
  children,
  className,
  end,
  ...rest
}) => {
  const location = useLocation();

  // Extract the current locale from the URL path
  const currentLocale = location.pathname.split("/")[1] as Locale;
  const isValidLocale = SUPPORTED_LOCALES.includes(currentLocale);
  const localePrefix = isValidLocale && currentLocale !== "en" ? `/${currentLocale}` : "";

  // If the 'to' path already starts with a supported locale prefix, don't double-prefix
  const hasLocalePrefix = SUPPORTED_LOCALES.some(lang => 
    lang !== "en" && (to === `/${lang}` || to.startsWith(`/${lang}/`))
  );

  let finalTo = to;
  if (!hasLocalePrefix && to.startsWith("/")) {
    // Avoid double slashes if localePrefix is empty
    finalTo = `${localePrefix}${to === "/" && localePrefix ? "" : to}`;
  }

  return (
    <NavLink
      to={finalTo}
      end={end}
      className={className}
      {...rest}
    >
      {children}
    </NavLink>
  );
};
