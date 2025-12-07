
import TermsAndConditions from '../components/TermsAndConditions';
import {type MetaFunction} from "react-router";
import {generateMeta} from "@forge42/seo-tools/remix/metadata";
import {webApp} from "@forge42/seo-tools/structured-data/web-app";
import { translations, type Locale } from "~/i18n/context";

export const meta: MetaFunction = ({location}) => {
  const firstPathSegment = location.pathname.split("/")?.[1];
  const locale: Locale = 
    firstPathSegment === "de" ? "de" : 
    firstPathSegment === "es" ? "es" : 
    firstPathSegment === "ar" ? "ar" : "en";
  const messages = translations[locale] ?? translations.en;

  function t(key: string) {
    return messages[key] ?? key;
  }

  const meta = generateMeta(
    {
      title: t("terms.meta.title"),
      description: t("terms.meta.description"),
      url: "https://kleinbyte.com/terms-and-conditions",
      image: "https://kleinbyte.com/og-image-terms.png",
    },
    [
      {
        "script:ld+json": webApp({
          "@type": "WebPage",
          name: "Terms and Conditions",
          url: "https://kleinbyte.com/terms-and-conditions",
          description: "Terms and conditions for using Kleinbyte online tools",
        }),
      },
      { property: "og:type", content: "website" },
      { property: "og:site_name", content: "Kleinbyte" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: t("terms.meta.title") },
      { name: "twitter:description", content: t("terms.meta.description") },
      { name: "keywords", content: "terms and conditions, terms of service, user agreement, kleinbyte terms, legal" },
      { name: "author", content: "Kleinbyte" },
    ]
  );
  return meta;
};

export default function TermsAndConditionsRoute() {
  return <TermsAndConditions />;
}