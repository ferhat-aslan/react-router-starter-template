import type {Route} from "./+types/home";
import Layout from "~/components/layout";

import FOLDER from "/folder.svg";
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
      title: t("seo.meta.title"),
      description: t("seo.meta.description"),
      url: "https://kleinbyte.com/seo-tools",
      image: "https://kleinbyte.com/og-image-seo-tools.png",
    },
    [
      {
        "script:ld+json": webApp({
          "@type": "WebApplication",
          name: t("seo.title"),
          url: "https://kleinbyte.com/seo-tools",
          description: t("seo.description"),
          applicationCategory: "DeveloperApplication",
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
          name: t("seo.title"),
          description: t("seo.description"),
        }),
      },
      { property: "og:type", content: "website" },
      { property: "og:site_name", content: "Kleinbyte" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: t("seo.meta.title") },
      { name: "twitter:description", content: t("seo.meta.description") },
      { name: "twitter:image", content: "https://kleinbyte.com/og-image-seo-tools.png" },
      { name: "keywords", content: t("seo.meta.keywords") },
      { name: "author", content: "Kleinbyte" },
    ]
  );
  return meta;
};


export default function SeoTools() {
  const { t } = useTranslation();
  const seoTools = [
    {
      name: "Keyword Analyzer",
      description: "Analyze keyword density and SEO metrics for your content",
      link: "#",
      icon: FOLDER
    },
    {
      name: "Meta Tag Generator",
      description: "Generate optimized meta tags for your web pages",
      link: "#",
      icon: FOLDER
    },
    {
      name: "Site Audit Tool",
      description: "Check your website for SEO issues and performance",
      link: "#",
      icon: FOLDER
    },
    {
      name: "Sitemap Generator",
      description: "Create XML sitemaps for your website",
      link: "#",
      icon: FOLDER
    },
    {
      name: "Robots.txt Generator",
      description: "Generate robots.txt files for search engine crawling",
      link: "#",
      icon: FOLDER
    },
    {
      name: "Schema Markup Generator",
      description: "Create structured data markup for rich snippets",
      link: "#",
      icon: FOLDER
    }
  ];

  return (
    <Layout>
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
              {t("seo.title")}
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              {t("seo.description")}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {seoTools.map((tool, index) => (
              <div 
                key={index} 
                className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-slate-700 hover:shadow-xl transition-shadow duration-300"
              >
                <div className="flex items-center mb-4">
                  <img src={tool.icon} alt={tool.name} className="w-10 h-10 mr-3" />
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white">{tool.name}</h3>
                </div>
                <p className="text-gray-600 dark:text-gray-300 mb-4">{tool.description}</p>
                <a 
                  href={tool.link}
                  className="inline-flex items-center text-blue-600 dark:text-blue-400 font-medium hover:text-blue-800 dark:hover:text-blue-300 transition-colors"
                >
                  Use Tool
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-1" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </a>
              </div>
            ))}
          </div>

          <div className="mt-16 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-slate-800 dark:to-slate-900 rounded-2xl p-8">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6 text-center">Boost Your Search Rankings</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="w-16 h-16 bg-green-100 dark:bg-green-900/50 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-green-600 dark:text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Rank Higher</h3>
                <p className="text-gray-600 dark:text-gray-300">Improve visibility in search results</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/50 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-blue-600 dark:text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 8v8m-4-5v5m-4-2v2m-2 4h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Track Progress</h3>
                <p className="text-gray-600 dark:text-gray-300">Monitor your SEO performance</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-purple-100 dark:bg-purple-900/50 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-purple-600 dark:text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Stay Compliant</h3>
                <p className="text-gray-600 dark:text-gray-300">Follow SEO best practices</p>
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
                <summary className="font-semibold text-gray-900 dark:text-white cursor-pointer">{t("seo.faq.q1")}</summary>
                <p className="mt-3 text-gray-600 dark:text-gray-400">{t("seo.faq.a1")}</p>
              </details>
              <details className="p-4 bg-white dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-slate-700">
                <summary className="font-semibold text-gray-900 dark:text-white cursor-pointer">{t("seo.faq.q2")}</summary>
                <p className="mt-3 text-gray-600 dark:text-gray-400">{t("seo.faq.a2")}</p>
              </details>
              <details className="p-4 bg-white dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-slate-700">
                <summary className="font-semibold text-gray-900 dark:text-white cursor-pointer">{t("seo.faq.q3")}</summary>
                <p className="mt-3 text-gray-600 dark:text-gray-400">{t("seo.faq.a3")}</p>
              </details>
              <details className="p-4 bg-white dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-slate-700">
                <summary className="font-semibold text-gray-900 dark:text-white cursor-pointer">{t("seo.faq.q4")}</summary>
                <p className="mt-3 text-gray-600 dark:text-gray-400">{t("seo.faq.a4")}</p>
              </details>
              <details className="p-4 bg-white dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-slate-700">
                <summary className="font-semibold text-gray-900 dark:text-white cursor-pointer">{t("seo.faq.q5")}</summary>
                <p className="mt-3 text-gray-600 dark:text-gray-400">{t("seo.faq.a5")}</p>
              </details>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}