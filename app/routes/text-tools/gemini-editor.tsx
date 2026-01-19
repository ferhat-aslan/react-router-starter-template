import React from "react";
import { type MetaFunction } from "react-router";
import { generateMeta } from "@forge42/seo-tools/remix/metadata";
import { webApp } from "@forge42/seo-tools/structured-data/web-app";
import { useTranslation, translations, SUPPORTED_LOCALES, type Locale } from "~/utils/route-utils";
import Layout from "~/components/layout";
import MessagesEditor from "~/components/messages-editor";

export const meta: MetaFunction = ({ location }) => {
  const firstPathSegment = location.pathname.split("/")?.[1];
  const locale: Locale = SUPPORTED_LOCALES.includes(firstPathSegment as any) 
    ? (firstPathSegment as any) 
    : "en";
  const messages = translations[locale] ?? translations.en;

  function t(key: string) {
    return messages[key] ?? key;
  }

  return generateMeta(
    {
      title: t("gemini.meta.title"),
      description: t("gemini.meta.description"),
      url: `https://kleinbyte.com/${locale === "en" ? "" : locale + "/"}text-tools/gemini-editor`,
      image: "https://kleinbyte.com/og-image-gemini-editor.png",
    },
    [
      {
        "script:ld+json": webApp({
          "@type": "WebApplication",
          name: t("gemini.meta.name"),
          url: `https://kleinbyte.com/${locale === "en" ? "" : locale + "/"}text-tools/gemini-editor`,
          description: t("gemini.meta.app_desc"),
          applicationCategory: "TextEditor",
          operatingSystem: "Any",
          offers: { "@type": "Offer", price: "0", priceCurrency: "USD" }
        }),
      },
      { name: "keywords", content: t("gemini.meta.keywords") },
      { name: "author", content: "Kleinbyte" },
    ]
  );
};

export default function GeminiEditor() {
  const { t } = useTranslation();

  return (
    <Layout>
      <MessagesEditor 
        title={t("gemini.title")}
        description={t("gemini.description")}
        badge={t("gemini.badge")}
        placeholder={t("gemini.editor.paste_placeholder")}
        filename="Gemini Pdf - kleinbytecom.pdf"
        faqPrefix="gemini.faq"
      />
    </Layout>
  );
}
