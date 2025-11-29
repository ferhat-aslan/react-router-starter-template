import type {Route} from "./+types/home";
import Layout from "~/components/layout";
import {LocaleLink} from "~/components/locale-link";
import { ToolCategoryCard } from "~/components/tool-category-card";
import SVG from "/pdf.svg";
import WORD from "/word.svg";
import TXT from "/txt.svg";
import JPG from "/jpg.svg";
import {NavLink, type MetaFunction} from "react-router";
import {generateMeta} from "@forge42/seo-tools/remix/metadata";
import {article} from "@forge42/seo-tools/structured-data/article";
import {course} from "@forge42/seo-tools/structured-data/course";

import {webApp} from "@forge42/seo-tools/structured-data/web-app";

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
      title: t("pdf.meta.title"),
      description: t("pdf.meta.description"),
      url: "https://kleinbyte.com/pdf-tools",
      image: "https://kleinbyte.com/og-image-pdf-tools.png",
    },
    [
      {
        "script:ld+json": webApp({
          "@type": "WebApplication",
          name: t("pdf.title"),
          url: "https://kleinbyte.com/pdf-tools",
          description: t("pdf.description"),
          applicationCategory: "BusinessApplication",
          operatingSystem: "Any",
          offers: {
            "@type": "Offer",
            price: "0",
            priceCurrency: "USD",
          },
        }),
      },
      {
        "script:ld+json": course({
          "@type": "HowTo",
          name: t("pdf.title"),
          description: t("pdf.description"),
        }),
      },
    ]
  );
  return meta;
};

export default function PDFTools() {
  const { t } = useTranslation();
  
  const tools = [
    {
      title: t("pdf.merge.title"),
      description: t("pdf.merge.description"),
      link: "/pdf-tools/merge-pdf",
      icon: (
        <span className="flex relative">
          <img src={SVG} alt="PDF Icon" className="size-8 dark:invert" />
        </span>
      ),
      badge: "Popular",
    },
    {
      title: t("pdf.split.title"),
      description: t("pdf.split.description"),
      link: "/pdf-tools/split-pdf",
      icon: <img src={SVG} alt="PDF Icon" className="size-8 dark:invert" />,
      badge: "Available",
    },
    {
      title: t("pdf.word.title"),
      description: t("pdf.word.description"),
      link: "/pdf-tools/word-to-pdf",
      icon: (
        <span className="flex gap-1">
          <img src={WORD} alt="Word Icon" className="size-6 dark:invert" />
          <span>→</span>
          <img src={SVG} alt="PDF Icon" className="size-6 dark:invert" />
        </span>
      ),
      badge: "Available",
    },
    {
      title: t("pdf.text.title"),
      description: t("pdf.text.description"),
      link: "/pdf-tools/pdf-to-text",
      icon: (
        <span className="flex gap-1">
          <img src={SVG} alt="PDF Icon" className="size-6 dark:invert" />
          <span>→</span>
          <img src={TXT} alt="Text Icon" className="size-6 dark:invert" />
        </span>
      ),
      badge: "Available",
    },
    {
      title: t("pdf.images.title"),
      description: t("pdf.images.description"),
      link: "/pdf-tools/pdf-to-images",
      icon: (
        <span className="flex gap-1">
          <img src={SVG} alt="PDF Icon" className="size-6 dark:invert" />
          <span>→</span>
          <img src={JPG} alt="Image Icon" className="size-6 dark:invert" />
        </span>
      ),
      badge: "Available",
    },
  ];

  return (
    <Layout>
      <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-12">
        <div className="text-center space-y-4">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 dark:text-white">
            {t("pdf.title")}
          </h1>
          <p className="text-lg md:text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
            {t("pdf.description")}
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
