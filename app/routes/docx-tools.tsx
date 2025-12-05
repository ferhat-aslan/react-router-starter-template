import type {Route} from "./+types/home";
import Layout from "~/components/layout";
import { ToolCategoryCard } from "~/components/tool-category-card";
import SVG from "/pdf.svg";
import WORD from "/word.svg";
import {webApp} from "@forge42/seo-tools/structured-data/web-app";
import {course} from "@forge42/seo-tools/structured-data/course";
import {type MetaFunction} from "react-router";
import {generateMeta} from "@forge42/seo-tools/remix/metadata";

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
      title: t("docx.meta.title"),
      description: t("docx.meta.description"),
      url: "https://kleinbyte.com/docx-tools",
      image: "https://kleinbyte.com/og-image-docx-tools.png",
    },
    [
      {
        "script:ld+json": webApp({
          "@type": "WebApplication",
          name: t("docx.title"),
          url: "https://kleinbyte.com/docx-tools",
          description: t("docx.description"),
          applicationCategory: "BusinessApplication",
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
          name: t("docx.title"),
          description: t("docx.description"),
        }),
      },
      { property: "og:type", content: "website" },
      { property: "og:site_name", content: "Kleinbyte" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: t("docx.meta.title") },
      { name: "twitter:description", content: t("docx.meta.description") },
      { name: "twitter:image", content: "https://kleinbyte.com/og-image-docx-tools.png" },
      { name: "keywords", content: "docx tools, word tools, docx converter, docx editor, docx merger, document tools, free docx tools" },
      { name: "author", content: "Kleinbyte" },
    ]
  );
  return meta;
};

export default function DocxTools() {
  const { t } = useTranslation();
  
  const tools = [
    {
      title: "DOCX Converter",
      description: "Convert DOCX files to PDF and other formats easily.",
      link: "/docx-tools",
      icon: <img src={WORD} alt="DOCX Icon" className="size-8 dark:invert" />,
      badge: "Available",
    },
    {
      title: "DOCX Editor",
      description: "Edit and modify DOCX documents online.",
      link: "/docx-tools",
      icon: <img src={WORD} alt="DOCX Icon" className="size-8 dark:invert" />,
      badge: "Coming Soon",
    },
    {
      title: "DOCX Merger",
      description: "Combine multiple DOCX files into one document.",
      link: "/docx-tools",
      icon: <img src={WORD} alt="DOCX Icon" className="size-8 dark:invert" />,
      badge: "Coming Soon",
    },
    {
      title: "DOCX Splitter",
      description: "Split DOCX documents into separate files.",
      link: "/docx-tools",
      icon: <img src={WORD} alt="DOCX Icon" className="size-8 dark:invert" />,
      badge: "Coming Soon",
    },
    {
      title: "DOCX to HTML",
      description: "Convert DOCX files to HTML format.",
      link: "/docx-tools",
      icon: <img src={WORD} alt="DOCX Icon" className="size-8 dark:invert" />,
      badge: "Coming Soon",
    },
    {
      title: "DOCX Compressor",
      description: "Reduce DOCX file size without quality loss.",
      link: "/docx-tools",
      icon: <img src={WORD} alt="DOCX Icon" className="size-8 dark:invert" />,
      badge: "Coming Soon",
    },
  ];

  return (
    <Layout>
      <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-12">
        <div className="text-center space-y-4">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 dark:text-white">
            {t("docx.title")}
          </h1>
          <p className="text-lg md:text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
            {t("docx.description")}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tools.map((tool, index) => (
            <ToolCategoryCard
              key={index}
              title={tool.title}
              description={tool.description}
              count={1}
              icon={tool.icon}
              link={tool.link}
              badge={tool.badge}
            />
          ))}
        </div>
      </section>
    </Layout>
  );
}
