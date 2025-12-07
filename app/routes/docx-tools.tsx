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
      { name: "keywords", content: t("docx.meta.keywords") },
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

        {/* SEO Content: Benefits Section */}
        <div className="mt-16 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-slate-800 dark:to-slate-900 rounded-2xl p-8">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6 text-center">Why Use Our DOCX Tools?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/50 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-blue-600 dark:text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Preserve Formatting</h3>
              <p className="text-gray-600 dark:text-gray-300">Keep all styles, fonts, and layouts intact</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 dark:bg-green-900/50 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-green-600 dark:text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Fast Conversion</h3>
              <p className="text-gray-600 dark:text-gray-300">Process documents in seconds</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 dark:bg-purple-900/50 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-purple-600 dark:text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Secure & Private</h3>
              <p className="text-gray-600 dark:text-gray-300">Files are never stored on our servers</p>
            </div>
          </div>
        </div>

        {/* SEO Content: FAQ */}
        <div className="mt-16">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8 text-center">
            {t("faq.title")}
          </h2>
          <div className="space-y-4 max-w-3xl mx-auto">
            <details className="p-4 bg-white dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-slate-700">
              <summary className="font-semibold text-gray-900 dark:text-white cursor-pointer">{t("docx.faq.q1")}</summary>
              <p className="mt-3 text-gray-600 dark:text-gray-400">{t("docx.faq.a1")}</p>
            </details>
            <details className="p-4 bg-white dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-slate-700">
              <summary className="font-semibold text-gray-900 dark:text-white cursor-pointer">{t("docx.faq.q2")}</summary>
              <p className="mt-3 text-gray-600 dark:text-gray-400">{t("docx.faq.a2")}</p>
            </details>
            <details className="p-4 bg-white dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-slate-700">
              <summary className="font-semibold text-gray-900 dark:text-white cursor-pointer">{t("docx.faq.q3")}</summary>
              <p className="mt-3 text-gray-600 dark:text-gray-400">{t("docx.faq.a3")}</p>
            </details>
            <details className="p-4 bg-white dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-slate-700">
              <summary className="font-semibold text-gray-900 dark:text-white cursor-pointer">{t("docx.faq.q4")}</summary>
              <p className="mt-3 text-gray-600 dark:text-gray-400">{t("docx.faq.a4")}</p>
            </details>
            <details className="p-4 bg-white dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-slate-700">
              <summary className="font-semibold text-gray-900 dark:text-white cursor-pointer">{t("docx.faq.q5")}</summary>
              <p className="mt-3 text-gray-600 dark:text-gray-400">{t("docx.faq.a5")}</p>
            </details>
          </div>
        </div>
      </section>
    </Layout>
  );
}
