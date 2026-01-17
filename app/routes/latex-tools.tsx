import {generateMeta} from "@forge42/seo-tools/remix/metadata";
import type {Route} from "./+types/home";

import Layout from "~/components/layout";
import {webApp} from "@forge42/seo-tools/structured-data/web-app";
import {course} from "@forge42/seo-tools/structured-data/course";
import {type MetaFunction} from "react-router";

import { useTranslation, type Locale } from "~/utils/route-utils";

export const meta: MetaFunction = ({ matches }) => {
  const rootMatch = matches.find((m) => m.id === "root");
  const messages = (rootMatch?.data as any)?.messages || {};

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

        {/* SEO Content: Benefits Section */}
        <div className="col-span-12 mt-12 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-slate-800 dark:to-slate-900 rounded-2xl p-8">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6 text-center">Why Use Our LaTeX Tools?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/50 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-blue-600 dark:text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Beautiful Math</h3>
              <p className="text-gray-600 dark:text-gray-300">Render complex mathematical equations with professional quality</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 dark:bg-green-900/50 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-green-600 dark:text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Export to PDF</h3>
              <p className="text-gray-600 dark:text-gray-300">Convert LaTeX documents to publication-ready PDFs</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 dark:bg-purple-900/50 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-purple-600 dark:text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">No Installation</h3>
              <p className="text-gray-600 dark:text-gray-300">Work with LaTeX directly in your browser</p>
            </div>
          </div>
        </div>

        {/* SEO Content: FAQ */}
        <div className="col-span-12 mt-16">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8 text-center">
            {t("faq.title")}
          </h2>
          <div className="space-y-4 max-w-3xl mx-auto">
            <details className="p-4 bg-white dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-slate-700">
              <summary className="font-semibold text-gray-900 dark:text-white cursor-pointer">{t("latex.faq.q1")}</summary>
              <p className="mt-3 text-gray-600 dark:text-gray-400">{t("latex.faq.a1")}</p>
            </details>
            <details className="p-4 bg-white dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-slate-700">
              <summary className="font-semibold text-gray-900 dark:text-white cursor-pointer">{t("latex.faq.q2")}</summary>
              <p className="mt-3 text-gray-600 dark:text-gray-400">{t("latex.faq.a2")}</p>
            </details>
            <details className="p-4 bg-white dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-slate-700">
              <summary className="font-semibold text-gray-900 dark:text-white cursor-pointer">{t("latex.faq.q3")}</summary>
              <p className="mt-3 text-gray-600 dark:text-gray-400">{t("latex.faq.a3")}</p>
            </details>
            <details className="p-4 bg-white dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-slate-700">
              <summary className="font-semibold text-gray-900 dark:text-white cursor-pointer">{t("latex.faq.q4")}</summary>
              <p className="mt-3 text-gray-600 dark:text-gray-400">{t("latex.faq.a4")}</p>
            </details>
            <details className="p-4 bg-white dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-slate-700">
              <summary className="font-semibold text-gray-900 dark:text-white cursor-pointer">{t("latex.faq.q5")}</summary>
              <p className="mt-3 text-gray-600 dark:text-gray-400">{t("latex.faq.a5")}</p>
            </details>
          </div>
        </div>
      </section>
    </Layout>
  );
}
