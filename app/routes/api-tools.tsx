import type {Route} from "./+types/home";
import Layout from "~/components/layout";
import FOLDER from "/folder.svg";
import {webApp} from "@forge42/seo-tools/structured-data/web-app";
import {course} from "@forge42/seo-tools/structured-data/course";
import {type MetaFunction} from "react-router";
import {generateMeta} from "@forge42/seo-tools/remix/metadata";
import {useTranslation, translations, type Locale} from "~/i18n/context";

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
      title: t("api.meta.title"),
      description: t("api.meta.description"),
      url: "https://kleinbyte.com/api-tools",
      image: "https://kleinbyte.com/og-image-api-tools.png",
    },
    [
      {
        "script:ld+json": webApp({
          "@type": "WebApplication",
          name: t("api.title"),
          url: "https://kleinbyte.com/api-tools",
          description: t("api.description"),
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
          name: t("api.title"),
          description: t("api.description"),
        }),
      },
      { property: "og:type", content: "website" },
      { property: "og:site_name", content: "Kleinbyte" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: t("api.meta.title") },
      { name: "twitter:description", content: t("api.meta.description") },
      { name: "twitter:image", content: "https://kleinbyte.com/og-image-api-tools.png" },
      { name: "keywords", content: "api tools, api tester, api debugger, api documentation, rest api, graphql, oauth, free api tools" },
      { name: "author", content: "Kleinbyte" },
    ]
  );
  return meta;
};

export default function ApiTools() {
  const { t } = useTranslation();
  const apiTools = [
    {
      name: "API Tester",
      description: "Test your API endpoints with various HTTP methods",
      link: "#",
      icon: FOLDER
    },
    {
      name: "API Debugger",
      description: "Debug and troubleshoot API requests and responses",
      link: "#",
      icon: FOLDER
    },
    {
      name: "API Documentation Generator",
      description: "Generate documentation from your API specifications",
      link: "#",
      icon: FOLDER
    },
    {
      name: "API Monitor",
      description: "Monitor API performance and uptime",
      link: "#",
      icon: FOLDER
    },
    {
      name: "Headers Inspector",
      description: "View and modify API request/response headers",
      link: "#",
      icon: FOLDER
    },
    {
      name: "OAuth Helper",
      description: "Assist with OAuth token generation and testing",
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
              {t("api.title")}
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              {t("api.description")}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {apiTools.map((tool, index) => (
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

          <div className="mt-16 text-center">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">API Integration Types</h2>
            <div className="flex flex-wrap justify-center gap-4">
              {['REST', 'GraphQL', 'SOAP', 'JSON-RPC', 'XML-RPC', 'Webhooks', 'OAuth', 'API Keys', 'JWT'].map((type, index) => (
                <div 
                  key={index} 
                  className="px-6 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-medium rounded-lg shadow-md"
                >
                  {type}
                </div>
              ))}
            </div>
          </div>

          {/* SEO Content: FAQ */}
          <div className="mt-16">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8 text-center">
              {t("faq.title")}
            </h2>
            <div className="space-y-4 max-w-3xl mx-auto">
              <details className="p-4 bg-white dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-slate-700">
                <summary className="font-semibold text-gray-900 dark:text-white cursor-pointer">{t("api.faq.q1")}</summary>
                <p className="mt-3 text-gray-600 dark:text-gray-400">{t("api.faq.a1")}</p>
              </details>
              <details className="p-4 bg-white dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-slate-700">
                <summary className="font-semibold text-gray-900 dark:text-white cursor-pointer">{t("api.faq.q2")}</summary>
                <p className="mt-3 text-gray-600 dark:text-gray-400">{t("api.faq.a2")}</p>
              </details>
              <details className="p-4 bg-white dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-slate-700">
                <summary className="font-semibold text-gray-900 dark:text-white cursor-pointer">{t("api.faq.q3")}</summary>
                <p className="mt-3 text-gray-600 dark:text-gray-400">{t("api.faq.a3")}</p>
              </details>
              <details className="p-4 bg-white dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-slate-700">
                <summary className="font-semibold text-gray-900 dark:text-white cursor-pointer">{t("api.faq.q4")}</summary>
                <p className="mt-3 text-gray-600 dark:text-gray-400">{t("api.faq.a4")}</p>
              </details>
              <details className="p-4 bg-white dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-slate-700">
                <summary className="font-semibold text-gray-900 dark:text-white cursor-pointer">{t("api.faq.q5")}</summary>
                <p className="mt-3 text-gray-600 dark:text-gray-400">{t("api.faq.a5")}</p>
              </details>
            </div>
          </div>

        </div>
      </section>
    </Layout>
  );
}