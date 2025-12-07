import type {Route} from "./+types/home";
import Layout from "~/components/layout";

import JPG from "/jpg.svg";
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
      title: t("favicon.meta.title"),
      description: t("favicon.meta.description"),
      url: "https://kleinbyte.com/favicon-maker",
      image: "https://kleinbyte.com/og-image-favicon-maker.png",
    },
    [
      {
        "script:ld+json": webApp({
          "@type": "WebApplication",
          name: t("favicon.title"),
          url: "https://kleinbyte.com/favicon-maker",
          description: t("favicon.description"),
          applicationCategory: "GraphicsApplication",
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
          name: t("favicon.title"),
          description: t("favicon.description"),
        }),
      },
      { property: "og:type", content: "website" },
      { property: "og:site_name", content: "Kleinbyte" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: t("favicon.meta.title") },
      { name: "twitter:description", content: t("favicon.meta.description") },
      { name: "twitter:image", content: "https://kleinbyte.com/og-image-favicon-maker.png" },
      { name: "keywords", content: t("favicon.meta.keywords") },
      { name: "author", content: "Kleinbyte" },
    ]
  );
  return meta;
};

export default function FaviconMaker() {
  const { t } = useTranslation();
  return (
    <Layout>
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
              {t("favicon.title")}
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              {t("favicon.description")}
            </p>
          </div>

          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl p-8 max-w-4xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Create Your Favicon</h2>
                
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Upload Image
                    </label>
                    <div className="border-2 border-dashed border-gray-300 dark:border-slate-600 rounded-lg p-8 text-center hover:border-blue-500 transition-colors">
                      <img src={JPG} alt="Upload" className="mx-auto h-12 w-12 text-gray-400" />
                      <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                        <span className="font-medium text-blue-600 hover:text-blue-500">Click to upload</span> or drag and drop
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                        PNG, JPG, GIF up to 10MB
                      </p>
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Favicon Sizes
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      {['16x16', '32x32', '48x48', '64x64', '128x128', '256x256'].map((size) => (
                        <div key={size} className="flex items-center">
                          <input
                            id={`size-${size}`}
                            name={`size-${size}`}
                            type="checkbox"
                            defaultChecked
                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                          />
                          <label htmlFor={`size-${size}`} className="ml-2 block text-sm text-gray-900 dark:text-gray-300">
                            {size}
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div className="pt-4">
                    <button 
                      className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-hidden focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                      Generate Favicon
                    </button>
                  </div>
                </div>
              </div>
              
              <div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Preview</h2>
                
                <div className="bg-gray-50 dark:bg-slate-700 rounded-lg p-6 h-full flex flex-col items-center justify-center">
                  <div className="flex space-x-4 mb-8">
                    {[16, 32, 48].map((size) => (
                      <div key={size} className="flex flex-col items-center">
                        <div 
                          className="bg-gray-200 border border-gray-300 rounded-md flex items-center justify-center"
                          style={{ width: `${size}px`, height: `${size}px` }}
                        >
                          <span className="text-xs text-gray-500">{size}px</span>
                        </div>
                        <span className="text-xs mt-2 text-gray-500 dark:text-gray-400">Size</span>
                      </div>
                    ))}
                  </div>
                  
                  <div className="mt-6 p-4 bg-white dark:bg-slate-800 rounded-lg w-full">
                    <h3 className="font-medium text-gray-900 dark:text-white mb-2">How to use</h3>
                    <ol className="text-sm text-gray-600 dark:text-gray-300 space-y-1">
                      <li>1. Upload an image (suggested size: 256x256 or larger)</li>
                      <li>2. Select the sizes you need</li>
                      <li>3. Click "Generate Favicon"</li>
                      <li>4. Download and place in your website root</li>
                      <li>5. Add link tag to your HTML head</li>
                    </ol>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-16 text-center">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">Supported Input Formats</h2>
            <div className="flex flex-wrap justify-center gap-4">
              {['PNG', 'JPG', 'GIF', 'BMP', 'TIFF', 'WEBP'].map((format, index) => (
                <div 
                  key={index} 
                  className="px-6 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-medium rounded-lg shadow-md"
                >
                  {format}
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
                <summary className="font-semibold text-gray-900 dark:text-white cursor-pointer">{t("favicon.faq.q1")}</summary>
                <p className="mt-3 text-gray-600 dark:text-gray-400">{t("favicon.faq.a1")}</p>
              </details>
              <details className="p-4 bg-white dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-slate-700">
                <summary className="font-semibold text-gray-900 dark:text-white cursor-pointer">{t("favicon.faq.q2")}</summary>
                <p className="mt-3 text-gray-600 dark:text-gray-400">{t("favicon.faq.a2")}</p>
              </details>
              <details className="p-4 bg-white dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-slate-700">
                <summary className="font-semibold text-gray-900 dark:text-white cursor-pointer">{t("favicon.faq.q3")}</summary>
                <p className="mt-3 text-gray-600 dark:text-gray-400">{t("favicon.faq.a3")}</p>
              </details>
              <details className="p-4 bg-white dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-slate-700">
                <summary className="font-semibold text-gray-900 dark:text-white cursor-pointer">{t("favicon.faq.q4")}</summary>
                <p className="mt-3 text-gray-600 dark:text-gray-400">{t("favicon.faq.a4")}</p>
              </details>
              <details className="p-4 bg-white dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-slate-700">
                <summary className="font-semibold text-gray-900 dark:text-white cursor-pointer">{t("favicon.faq.q5")}</summary>
                <p className="mt-3 text-gray-600 dark:text-gray-400">{t("favicon.faq.a5")}</p>
              </details>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}