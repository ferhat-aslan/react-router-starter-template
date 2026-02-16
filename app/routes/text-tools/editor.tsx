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
      title: t("editor.meta.title"),
      description: t("editor.meta.description"),
      url: `https://kleinbyte.com/${
        locale === "en" ? "" : locale + "/"
      }text-tools/editor`,
      image: "https://kleinbyte.com/og-image-editor.png",
    },
    [
      {
        "script:ld+json": webApp({
          "@type": "WebApplication",
          name: t("editor.meta.name"),
          url: `https://kleinbyte.com/${
            locale === "en" ? "" : locale + "/"
          }text-tools/editor`,
          description: t("editor.meta.app_desc"),
          applicationCategory: "TextEditor",
          operatingSystem: "Any",
          offers: {"@type": "Offer", price: "0", priceCurrency: "USD"},
        }),
      },
      {name: "keywords", content: t("editor.meta.keywords")},
      {name: "author", content: "Kleinbyte"},
    ],
  );
};

export default function Editor({loaderData}: any) {
  const t = (key: string) => loaderData.messages[key] || key;

  return (
    <Layout loaderData={loaderData}>
      <MessagesEditor
        title={t("editor.title")}
        description={t("editor.description")}
        badge={t("editor.badge")}
        placeholder={
          t("editor.placeholder") ||
          "Start typing or paste your content here..."
        }
        filename="Document - kleinbytecom.pdf"
        faqPrefix="editor.faq"
      />
    </Layout>
  );
}
