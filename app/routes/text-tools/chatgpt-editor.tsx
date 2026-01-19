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
      title: t("chatgpt.meta.title"),
      description: t("chatgpt.meta.description"),
      url: `https://kleinbyte.com/${locale === "en" ? "" : locale + "/"}text-tools/chatgpt-editor`,
      image: "https://kleinbyte.com/og-image-chatgpt-editor.png",
    },
    [
      {
        "script:ld+json": webApp({
          "@type": "WebApplication",
          name: t("chatgpt.meta.name"),
          url: `https://kleinbyte.com/${locale === "en" ? "" : locale + "/"}text-tools/chatgpt-editor`,
          description: t("chatgpt.meta.app_desc"),
          applicationCategory: "TextEditor",
          operatingSystem: "Any",
          offers: { "@type": "Offer", price: "0", priceCurrency: "USD" }
        }),
      },
      { name: "keywords", content: t("chatgpt.meta.keywords") },
      { name: "author", content: "Kleinbyte" },
    ]
  );
};

export default function ChatGptEditor() {
  const { t } = useTranslation();

  return (
    <Layout>
      <MessagesEditor 
        title={t("chatgpt.title")}
        description={t("chatgpt.description")}
        badge={t("chatgpt.badge")}
        placeholder={t("chatgpt.editor.paste_placeholder")}
        filename="Chatgpt Pdf - kleinbytecom.pdf"
        faqPrefix="chatgpt.faq"
      />
    </Layout>
  );
}
