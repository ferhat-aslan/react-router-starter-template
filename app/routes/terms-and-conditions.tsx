import TermsAndConditions from "../components/TermsAndConditions";
import {type MetaFunction} from "react-router";
import {generateMeta} from "@forge42/seo-tools/remix/metadata";
import {webApp} from "@forge42/seo-tools/structured-data/web-app";
import {
  getTranslationData,
  translations,
  type Locale,
} from "~/utils/route-utils";

// SSR Loader - Async data fetching for translations
export async function loader({request}: {request: Request}) {
  const url = new URL(request.url);

  const {locale, messages, t} = await getTranslationData(url.pathname);

  return {
    locale,
    messages,
    seo: {
      title: t("pdf.meta.title"),
      description: t("pdf.meta.description"),
      keywords: t("pdf.meta.keywords"),
    },
  };
}

export const meta: MetaFunction = ({data, location}: any) => {
  if (!data) {
    return [
      {title: "All Tools - Kleinbyte"},
      {
        name: "description",
        content:
          "Free online tools for PDF, documents, images and more. No signup required.",
      },
    ];
  }

  const locale = data.locale;
  const t = (key: string) => data.messages[key] || key;

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
      {property: "og:type", content: "website"},
      {property: "og:site_name", content: "Kleinbyte"},
      {name: "twitter:card", content: "summary_large_image"},
      {name: "twitter:title", content: t("terms.meta.title")},
      {name: "twitter:description", content: t("terms.meta.description")},
      {
        name: "keywords",
        content:
          "terms and conditions, terms of service, user agreement, kleinbyte terms, legal",
      },
      {name: "author", content: "Kleinbyte"},
    ],
  );
  return meta;
};

export default function TermsAndConditionsRoute() {
  return <TermsAndConditions />;
}
