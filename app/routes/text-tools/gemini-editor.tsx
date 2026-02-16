import React from "react";
import {type MetaFunction} from "react-router";
import {generateMeta} from "@forge42/seo-tools/remix/metadata";
import {webApp} from "@forge42/seo-tools/structured-data/web-app";
import {
  useTranslation,
  translations,
  SUPPORTED_LOCALES,
  type Locale,
  getTranslationData,
} from "~/utils/route-utils";
import Layout from "~/components/layout";
import MessagesEditor from "~/components/messages-editor";

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

  return generateMeta(
    {
      title: t("gemini.meta.title"),
      description: t("gemini.meta.description"),
      url: `https://kleinbyte.com/${
        locale === "en" ? "" : locale + "/"
      }text-tools/gemini-editor`,
      image: "https://kleinbyte.com/og-image-gemini-editor.png",
    },
    [
      {
        "script:ld+json": webApp({
          "@type": "WebApplication",
          name: t("gemini.meta.name"),
          url: `https://kleinbyte.com/${
            locale === "en" ? "" : locale + "/"
          }text-tools/gemini-editor`,
          description: t("gemini.meta.app_desc"),
          applicationCategory: "TextEditor",
          operatingSystem: "Any",
          offers: {"@type": "Offer", price: "0", priceCurrency: "USD"},
        }),
      },
      {name: "keywords", content: t("gemini.meta.keywords")},
      {name: "author", content: "Kleinbyte"},
    ],
  );
};

export default function GeminiEditor({loaderData}: any) {
  const t = (key: string) => loaderData.messages[key] || key;

  return (
    <Layout loaderData={loaderData}>
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
