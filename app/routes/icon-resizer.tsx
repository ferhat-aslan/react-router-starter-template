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
      title: t("icon.meta.title"),
      description: t("icon.meta.description"),
      url: "https://kleinbyte.com/icon-resizer",
      image: "https://kleinbyte.com/og-image-icon-resizer.png",
    },
    [
      {
        "script:ld+json": webApp({
          "@type": "WebApplication",
          name: t("icon.title"),
          url: "https://kleinbyte.com/icon-resizer",
          description: t("icon.description"),
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
          name: t("icon.title"),
          description: t("icon.description"),
        }),
      },
      { property: "og:type", content: "website" },
      { property: "og:site_name", content: "Kleinbyte" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: t("icon.meta.title") },
      { name: "twitter:description", content: t("icon.meta.description") },
      { name: "twitter:image", content: "https://kleinbyte.com/og-image-icon-resizer.png" },
      { name: "keywords", content: t("icon.meta.keywords") },
      { name: "author", content: "Kleinbyte" },
    ]
  );
  return meta;
};

export default function IconResizer() {
  const { t } = useTranslation();
  return (
    <Layout>
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
              {t("icon.title")}
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              {t("icon.description")}
            </p>
          </div>

          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl p-8 max-w-4xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Resize Your Images</h2>
                
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
                      Resize Options
                    </label>
                    <div className="space-y-3">
                      <div className="flex items-center">
                        <input
                          id="keep-aspect-ratio"
                          name="keep-aspect-ratio"
                          type="checkbox"
                          defaultChecked
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        />
                        <label htmlFor="keep-aspect-ratio" className="ml-2 block text-sm text-gray-900 dark:text-gray-300">
                          Keep aspect ratio
                        </label>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Width (px)
                          </label>
                          <input
                            type="number"
                            min="1"
                            max="4096"
                            defaultValue="128"
                            className="py-2 px-3 block w-full border border-gray-300 dark:border-slate-600 rounded-md shadow-sm focus:outline-hidden focus:ring-blue-500 focus:border-blue-500 dark:bg-slate-700 dark:text-white"
                          />
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Height (px)
                          </label>
                          <input
                            type="number"
                            min="1"
                            max="4096"
                            defaultValue="128"
                            className="py-2 px-3 block w-full border border-gray-300 dark:border-slate-600 rounded-md shadow-sm focus:outline-hidden focus:ring-blue-500 focus:border-blue-500 dark:bg-slate-700 dark:text-white"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Common Sizes
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                      {['16x16', '32x32', '48x48', '64x64', '128x128', '256x256', '512x512', '1024x1024', 'Original'].map((size) => (
                        <button
                          key={size}
                          type="button"
                          className="py-2 px-3 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-slate-700 hover:bg-gray-200 dark:hover:bg-slate-600 rounded-md border border-gray-300 dark:border-slate-600"
                        >
                          {size}
                        </button>
                      ))}
                    </div>
                  </div>
                  
                  <div className="pt-4">
                    <button 
                      className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-hidden focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                      Resize Images
                    </button>
                  </div>
                </div>
              </div>
              
              <div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Preview</h2>
                
                <div className="bg-gray-50 dark:bg-slate-700 rounded-lg p-6 h-full flex flex-col items-center justify-center">
                  <div className="flex flex-wrap justify-center gap-4 mb-8">
                    {[16, 32, 64, 128].map((size) => (
                      <div key={size} className="flex flex-col items-center">
                        <div 
                          className="bg-gray-200 border border-gray-300 rounded-md flex items-center justify-center"
                          style={{ width: `${size}px`, height: `${size}px` }}
                        >
                          <span className="text-xs text-gray-500">{size}px</span>
                        </div>
                        <span className="text-xs mt-2 text-gray-500 dark:text-gray-400">Resized</span>
                      </div>
                    ))}
                  </div>
                  
                  <div className="mt-6 p-4 bg-white dark:bg-slate-800 rounded-lg w-full">
                    <h3 className="font-medium text-gray-900 dark:text-white mb-2">Resize Options</h3>
                    <ul className="text-sm text-gray-600 dark:text-gray-300 space-y-1">
                      <li>• Batch resizing for multiple dimensions</li>
                      <li>• Preserve transparency (PNG)</li>
                      <li>• High quality image processing</li>
                      <li>• No quality loss for smaller sizes</li>
                      <li>• Fast processing without server upload</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-16 text-center">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">Benefits of Properly Sized Icons</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white dark:bg-slate-800 p-6 rounded-xl border border-gray-200 dark:border-slate-700">
                <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/50 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600 dark:text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Faster Loading</h3>
                <p className="text-gray-600 dark:text-gray-300">Optimized sizes reduce bandwidth and improve performance</p>
              </div>
              
              <div className="bg-white dark:bg-slate-800 p-6 rounded-xl border border-gray-200 dark:border-slate-700">
                <div className="w-12 h-12 bg-green-100 dark:bg-green-900/50 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-600 dark:text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5v-4m0 0h-4m4 0l-5-5" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Consistent Display</h3>
                <p className="text-gray-600 dark:text-gray-300">Icons look crisp across all devices and platforms</p>
              </div>
              
              <div className="bg-white dark:bg-slate-800 p-6 rounded-xl border border-gray-200 dark:border-slate-700">
                <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/50 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-purple-600 dark:text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">SEO Friendly</h3>
                <p className="text-gray-600 dark:text-gray-300">Proper icons improve user experience and search rankings</p>
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
                <summary className="font-semibold text-gray-900 dark:text-white cursor-pointer">{t("icon.faq.q1")}</summary>
                <p className="mt-3 text-gray-600 dark:text-gray-400">{t("icon.faq.a1")}</p>
              </details>
              <details className="p-4 bg-white dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-slate-700">
                <summary className="font-semibold text-gray-900 dark:text-white cursor-pointer">{t("icon.faq.q2")}</summary>
                <p className="mt-3 text-gray-600 dark:text-gray-400">{t("icon.faq.a2")}</p>
              </details>
              <details className="p-4 bg-white dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-slate-700">
                <summary className="font-semibold text-gray-900 dark:text-white cursor-pointer">{t("icon.faq.q3")}</summary>
                <p className="mt-3 text-gray-600 dark:text-gray-400">{t("icon.faq.a3")}</p>
              </details>
              <details className="p-4 bg-white dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-slate-700">
                <summary className="font-semibold text-gray-900 dark:text-white cursor-pointer">{t("icon.faq.q4")}</summary>
                <p className="mt-3 text-gray-600 dark:text-gray-400">{t("icon.faq.a4")}</p>
              </details>
              <details className="p-4 bg-white dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-slate-700">
                <summary className="font-semibold text-gray-900 dark:text-white cursor-pointer">{t("icon.faq.q5")}</summary>
                <p className="mt-3 text-gray-600 dark:text-gray-400">{t("icon.faq.a5")}</p>
              </details>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}