
import PrivacyPolicy from '../components/PrivacyPolicy';
import {type MetaFunction} from "react-router";
import {generateMeta} from "@forge42/seo-tools/remix/metadata";
import {webApp} from "@forge42/seo-tools/structured-data/web-app";
import { translations, type Locale } from "~/utils/route-utils";

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
      title: t("privacy.meta.title"),
      description: t("privacy.meta.description"),
      url: "https://kleinbyte.com/privacy-policy",
      image: "https://kleinbyte.com/og-image-privacy.png",
    },
    [
      {
        "script:ld+json": webApp({
          "@type": "WebPage",
          name: "Privacy Policy",
          url: "https://kleinbyte.com/privacy-policy",
          description: "Privacy policy for Kleinbyte online tools",
        }),
      },
      { property: "og:type", content: "website" },
      { property: "og:site_name", content: "Kleinbyte" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: t("privacy.meta.title") },
      { name: "twitter:description", content: t("privacy.meta.description") },
      { name: "keywords", content: "privacy policy, data protection, kleinbyte privacy, user data, cookies policy" },
      { name: "author", content: "Kleinbyte" },
    ]
  );
  return meta;
};

export default function PrivacyPolicyRoute() {
  return <PrivacyPolicy />;
}