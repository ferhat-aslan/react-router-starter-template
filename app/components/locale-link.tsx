import React from "react";
import {NavLink, useLocation} from "react-router";

interface LocaleLinkProps {
  to: string;
  children: React.ReactNode;
  className?: string;
  activeClassName?: string;
  [key: string]: any; // To allow other props to be passed through
}

export const LocaleLink: React.FC<LocaleLinkProps> = ({
  to,
  children,
  className,
  activeClassName,
  ...rest
}) => {
  const location = useLocation();

  // Extract the current locale from the URL path (e.g., '/ar/', '/es/', '/de/')
  const currentLocale = location.pathname.split("/")[1];

  // Check if the extracted part is actually a valid locale
  const isValidLocale = ["en", "de", "es", "ar"].includes(currentLocale);

  // If the destination is a different locale route, don't add the current locale prefix
  const isDifferentLocaleRoute = /^\/(en|de|es|ar)\//.test(to);
  
  let finalTo = to;
  
  // If the destination is the root route, and we're in a valid locale, redirect to that locale's root
  if (to === "/") {
    finalTo = isValidLocale ? `/${currentLocale}` : "/";
  }
  // If we're in a valid locale and the destination isn't a different locale route
  else if (isValidLocale && !isDifferentLocaleRoute) {
    finalTo = `/${currentLocale}${to}`;
  }
  // If the destination is the same locale route, keep it as is
  else if (isDifferentLocaleRoute) {
    finalTo = to;
  }

  return (
    <NavLink
      aria-description={currentLocale}
      to={finalTo}
      className={({isActive}) =>
        className
          ? className + (isActive ? ` ${activeClassName}` : "")
          : undefined
      }
      {...rest}
    >
      {children}
    </NavLink>
  );
};
