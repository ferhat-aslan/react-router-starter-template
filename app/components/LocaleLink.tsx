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

  // Generate the URL with locale prefix if we're in a localized route
  const localePrefixedTo = `/${currentLocale}${to}`;

  // If the destination is a different locale route, don't add the current locale prefix
  const isDifferentLocaleRoute = /^\/(en|de|es|ar)\//.test(to);

  const finalTo = isDifferentLocaleRoute ? to : localePrefixedTo;

  return (
    <NavLink
      aria-description={currentLocale}
      to={localePrefixedTo}
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
