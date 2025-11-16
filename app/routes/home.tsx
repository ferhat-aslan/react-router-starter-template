import type {Route} from "./+types/home";
import Layout from "~/components/layout";
import {LocaleLink} from "~/components/locale-link";

import PDF from "/pdf.svg";
import WORD from "/word.svg";
import JPG from "/jpg.svg";
import TXT from "/txt.svg";
import FOLDER from "/folder.svg";
import {useI18n, translations, type Locale} from "../i18n/context";

import {generateMeta} from "@forge42/seo-tools/remix/metadata";
import {course} from "@forge42/seo-tools/structured-data/course";
import {webApp} from "@forge42/seo-tools/structured-data/web-app";
import {type MetaFunction} from "react-router";

export const meta: MetaFunction = ({location}) => {
  const firstPathSegment = location.pathname.split("/")?.[1];
  const locale: Locale = 
    firstPathSegment === "de" ? "de" : 
    firstPathSegment === "es" ? "es" : 
    firstPathSegment === "ar" ? "ar" : "en";
  const messages = translations[locale] ?? translations.en;

  function t(key: string) {
    return messages[key] ?? key;
  }

  const meta = generateMeta(
    {
      title: t("home.meta.title"),
      description: t("home.meta.description"),
      url: "https://kleinbyte.com/",
      image: "https://kleinbyte.com/og-image-all-tools.png",
    },
    [
      {
        "script:ld+json": webApp({
          "@type": "WebSite",
          name: t("home.meta.lt.web.name"),
          url: "https://kleinbyte.com/",
          description: t("home.meta.lt.web.description"),
          potentialAction: {
            "@type": "SearchAction",
            target: "https://kleinbyte.com/search?q={search_term_string}",
            "query-input": "required name=search_term_string",
          },
        }),
      },
      {
        "script:ld+json": course({
          "@type": "WebPage",
          name: t("home.meta.lt.course.description"),
          description: t("home.meta.lt.course.description"),
        }),
      },
    ]
  );
  return meta;
};

export function loader({context}: Route.LoaderArgs) {
  return {message: context.cloudflare.env.VALUE_FROM_CLOUDFLARE};
}

export default function Home({loaderData}: Route.ComponentProps) {
  const t = useI18n();

  const tools = [
    {
      category: t("tools.pdf.category"),
      icon: PDF,
      tools: [
        {
          name: t("tools.pdf.merge.name"),
          description: t("tools.pdf.merge.description"),
          link: "/pdf-tools/merge-pdf",
        },
        {
          name: t("tools.pdf.split.name"),
          description: t("tools.pdf.split.description"),
          link: "/pdf-tools/split-pdf",
        },
        {
          name: t("tools.pdf.word_to_pdf.name"),
          description: t("tools.pdf.word_to_pdf.description"),
          link: "/pdf-tools/word-to-pdf",
        },
        {
          name: t("tools.pdf.pdf_to_text.name"),
          description: t("tools.pdf.pdf_to_text.description"),
          link: "/pdf-tools/pdf-to-text",
        },
        {
          name: t("tools.pdf.pdf_to_images.name"),
          description: t("tools.pdf.pdf_to_images.description"),
          link: "/pdf-tools/pdf-to-images",
        },
      ],
    },
    {
      category: t("tools.documents.category"),
      icon: WORD,
      tools: [
        {
          name: t("tools.documents.docx.name"),
          description: t("tools.documents.docx.description"),
          link: "/docx-tools",
        },
        {
          name: t("tools.documents.latex.name"),
          description: t("tools.documents.latex.description"),
          link: "/latex-tools",
        },
        {
          name: t("tools.documents.text.name"),
          description: t("tools.documents.text.description"),
          link: "#",
        },
        {
          name: t("tools.documents.spreadsheet.name"),
          description: t("tools.documents.spreadsheet.description"),
          link: "#",
        },
      ],
    },
    {
      category: t("tools.images.category"),
      icon: JPG,
      tools: [
        {
          name: t("tools.images.converter.name"),
          description: t("tools.images.converter.description"),
          link: "#",
        },
        {
          name: t("tools.images.compressor.name"),
          description: t("tools.images.compressor.description"),
          link: "#",
        },
        {
          name: t("tools.images.editor.name"),
          description: t("tools.images.editor.description"),
          link: "#",
        },
        {
          name: t("tools.images.resizer.name"),
          description: t("tools.images.resizer.description"),
          link: "#",
        },
      ],
    },
    {
      category: t("tools.developer.category"),
      icon: FOLDER,
      tools: [
        {
          name: t("tools.developer.seo.name"),
          description: t("tools.developer.seo.description"),
          link: "#",
        },
        {
          name: t("tools.developer.code_formatter.name"),
          description: t("tools.developer.code_formatter.description"),
          link: "#",
        },
        {
          name: t("tools.developer.json.name"),
          description: t("tools.developer.json.description"),
          link: "#",
        },
        {
          name: t("tools.developer.api.name"),
          description: t("tools.developer.api.description"),
          link: "#",
        },
      ],
    },
  ];

  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-slate-900 dark:to-slate-800 py-20 overflow-hidden">
        <div className="absolute inset-0 z-0">
          {/* Animated background elements */}
          <div className="absolute top-20 left-10 w-72 h-72 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob"></div>
          <div className="absolute top-40 right-20 w-72 h-72 bg-indigo-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-2000"></div>
          <div className="absolute bottom-20 left-1/2 w-72 h-72 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-4000"></div>
        </div>
        <div className="container mx-auto px-4 text-center relative z-10">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 dark:text-white mb-6 animate-fade-in-up">
            {t("home.hero.title")}
          </h1>
          <p className="text-xl text-gray-700 dark:text-gray-300 max-w-3xl mx-auto mb-10 animate-fade-in-up animation-delay-200">
            {t("home.hero.subtitle")}
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4 animate-fade-in-up animation-delay-400">
            <a
              href="#tools"
              className="px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-lg shadow-lg hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 text-lg transform hover:scale-105"
            >
              {t("home.hero.explore_btn")}
            </a>
            <a
              href="/pdf-tools"
              className="px-8 py-4 bg-white dark:bg-slate-800 text-blue-600 dark:text-blue-400 font-semibold rounded-lg shadow-lg hover:bg-gray-100 dark:hover:bg-slate-700 transition-all duration-300 text-lg border border-gray-200 dark:border-slate-700 transform hover:scale-105"
            >
              {t("home.hero.pdf_btn")}
            </a>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white dark:bg-slate-900">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4 animate-fade-in">
              {t("home.features.title")}
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto animate-fade-in animation-delay-200">
              {t("home.features.description")}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="bg-gray-50 dark:bg-slate-800 p-6 rounded-xl border border-gray-200 dark:border-slate-700">
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/50 rounded-lg flex items-center justify-center mb-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 text-blue-600 dark:text-blue-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                {t("home.features.document.title")}
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                {t("home.features.document.description")}
              </p>
            </div>

            <div className="bg-gray-50 dark:bg-slate-800 p-6 rounded-xl border border-gray-200 dark:border-slate-700">
              <div className="w-12 h-12 bg-green-100 dark:bg-green-900/50 rounded-lg flex items-center justify-center mb-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 text-green-600 dark:text-green-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                {t("home.features.image.title")}
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                {t("home.features.image.description")}
              </p>
            </div>

            <div className="bg-gray-50 dark:bg-slate-800 p-6 rounded-xl border border-gray-200 dark:border-slate-700">
              <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/50 rounded-lg flex items-center justify-center mb-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 text-purple-600 dark:text-purple-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                {t("home.features.developer.title")}
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                {t("home.features.developer.description")}
              </p>
            </div>

            <div className="bg-gray-50 dark:bg-slate-800 p-6 rounded-xl border border-gray-200 dark:border-slate-700">
              <div className="w-12 h-12 bg-yellow-100 dark:bg-yellow-900/50 rounded-lg flex items-center justify-center mb-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 text-yellow-600 dark:text-yellow-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                {t("home.features.ecommerce.title")}
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                {t("home.features.ecommerce.description")}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Tools Section */}
      <section id="tools" className="py-16 bg-gray-50 dark:bg-slate-900">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4 animate-fade-in">
              {t("home.tools.title")}
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto animate-fade-in animation-delay-200">
              {t("home.tools.description")}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            {tools.map((category, index) => (
              <div
                key={index}
                className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-slate-700 transform transition-all duration-300 hover:shadow-2xl animate-slide-in-up"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="flex items-center mb-6">
                  <img
                    src={category.icon}
                    alt={category.category}
                    className="w-10 h-10 mr-3"
                  />
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                    {category.category}
                  </h3>
                </div>
                <div className="space-y-4">
                  {category.tools.map((tool, toolIdx) => (
                    <a
                      key={toolIdx}
                      href={tool.link}
                      className="block p-4 rounded-lg border border-gray-200 dark:border-slate-700 hover:border-blue-500 dark:hover:border-blue-500 transition-all duration-300 transform hover:translate-x-1 hover:shadow-md"
                    >
                      <div className="flex justify-between items-center">
                        <div>
                          <h4 className="font-semibold text-gray-900 dark:text-white">
                            {tool.name}
                          </h4>
                          <p className="text-gray-600 dark:text-gray-300 text-sm">
                            {tool.description}
                          </p>
                        </div>
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5 text-blue-600 dark:text-blue-400"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path
                            fillRule="evenodd"
                            d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </div>
                    </a>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-indigo-600 overflow-hidden">
        <div className="absolute inset-0 z-0">
          {/* Animated background elements */}
          <div className="absolute top-20 left-10 w-72 h-72 bg-blue-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
          <div className="absolute bottom-40 right-20 w-72 h-72 bg-indigo-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
        </div>
        <div className="container mx-auto px-4 text-center relative z-10">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6 animate-fade-in">
            {t("home.cta.title")}
          </h2>
          <p className="text-xl text-blue-100 max-w-2xl mx-auto mb-10 animate-fade-in animation-delay-200">
            {t("home.cta.subtitle")}
          </p>
          <a
            href="/pdf-tools"
            className="inline-block px-8 py-4 bg-white text-blue-600 font-bold rounded-lg shadow-lg hover:bg-gray-100 transition-all duration-300 text-lg transform hover:scale-105 animate-fade-in animation-delay-400"
          >
            {t("home.cta.button")}
          </a>
        </div>
      </section>
    </Layout>
  );
}
