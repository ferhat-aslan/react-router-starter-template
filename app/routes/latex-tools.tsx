import {generateMeta} from "@forge42/seo-tools/remix/metadata";
import type {Route} from "./+types/home";

import Layout from "~/components/layout";
import {webApp} from "@forge42/seo-tools/structured-data/web-app";
import {course} from "@forge42/seo-tools/structured-data/course";
import {type MetaFunction} from "react-router";

import { useTranslation, translations, type Locale } from "~/i18n/context";

export const meta: MetaFunction = ({location}) => {
  const locale: Locale = 
    location.pathname.split("/")?.[1] === "de" ? "de" : 
    location.pathname.split("/")?.[1] === "es" ? "es" : 
    location.pathname.split("/")?.[1] === "ar" ? "ar" : "en";
  const messages = translations[locale] ?? translations.en;

  function t(key: string) {
    return messages[key] ?? key;
  }

  const meta = generateMeta(
    {
      title: t("latex.meta.title"),
      description: t("latex.meta.description"),
      url: "https://kleinbyte.com/latex-tools",
      image: "https://kleinbyte.com/og-image-latex-tools.png",
    },
    [
      {
        "script:ld+json": webApp({
          "@type": "WebApplication",
          name: t("latex.title"),
          url: "https://kleinbyte.com/latex-tools",
          description: t("latex.description"),
          applicationCategory: "EducationalApplication",
          operatingSystem: "Any",
          offers: {
            "@type": "Offer",
            price: "0",
            priceCurrency: "USD"
          }
        }),
      },
      {
        "script:ld+json": course({
          "@type": "HowTo",
          name: t("latex.title"),
          description: t("latex.description"),
        }),
      },
      { property: "og:type", content: "website" },
      { property: "og:site_name", content: "Kleinbyte" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: t("latex.meta.title") },
      { name: "twitter:description", content: t("latex.meta.description") },
      { name: "twitter:image", content: "https://kleinbyte.com/og-image-latex-tools.png" },
      { name: "keywords", content: "latex tools, latex editor, latex converter, latex to pdf, free latex tools, online latex" },
      { name: "author", content: "Kleinbyte" },
    ]
  );
  return meta;
};

export default function LatexTools() {
  const { t } = useTranslation();
  return (
    <Layout>
      <section className="grid w-full grid-cols-12 container mx-auto px-4 sm:px-6 lg:px-8 py-8 gap-4">
        <h1 className="col-span-12 text-center text-6xl font-bold">
          {t("latex.title")}
        </h1>
        <h6 className="col-span-10 col-start-2 text-center text-lg text-gray-600 dark:text-neutral-400">
          {t("latex.description")}
        </h6>
      </section>
    </Layout>
  );
}
