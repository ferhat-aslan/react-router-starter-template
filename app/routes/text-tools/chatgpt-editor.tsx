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
      title: t("chatgpt.meta.title"),
      description: t("chatgpt.meta.description"),
      url: `https://kleinbyte.com/${
        locale === "en" ? "" : locale + "/"
      }text-tools/chatgpt-editor`,
      image: "https://kleinbyte.com/og-image-chatgpt-editor.png",
    },
    [
      {
        "script:ld+json": webApp({
          "@type": "WebApplication",
          name: t("chatgpt.meta.name"),
          url: `https://kleinbyte.com/${
            locale === "en" ? "" : locale + "/"
          }text-tools/chatgpt-editor`,
          description: t("chatgpt.meta.app_desc"),
          applicationCategory: "TextEditor",
          operatingSystem: "Any",
          offers: {"@type": "Offer", price: "0", priceCurrency: "USD"},
        }),
      },
      {name: "keywords", content: t("chatgpt.meta.keywords")},
      {name: "author", content: "Kleinbyte"},
    ],
  );
};

export default function ChatGptEditor({loaderData}: any) {
  const t = (key: string) => loaderData.messages[key] || key;

  return (
    <Layout loaderData={loaderData}>
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
