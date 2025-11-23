import type {Route} from "./+types/home";
import Layout from "~/components/layout";
import {LocaleLink} from "~/components/locale-link";

import PDF from "/pdf.svg";
import WORD from "/word.svg";
import JPG from "/jpg.svg";
import TXT from "/txt.svg";
import FOLDER from "/folder.svg";
import {useTranslation, translations, type Locale} from "../i18n/context";

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
          name: t("home.meta.lt.course.name"),
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
  const { t } = useTranslation();

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
          link: "/tools/image-converter",
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
      category: t("tools.video.category"),
      icon: JPG,
      tools: [
        {
          name: t("tools.video.compressor.name"),
          description: t("tools.video.compressor.description"),
          link: "/tools/video-compressor",
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
      <div className="min-h-screen bg-white dark:bg-neutral-950 text-gray-900 dark:text-white transition-colors duration-300">
        {/* Hero Section */}
        <section className="relative pt-32 pb-20 overflow-hidden">
          {/* Background Effects */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] rounded-full blur-[120px] opacity-50 pointer-events-none bg-blue-500/20 dark:bg-blue-500/10"></div>
          <div className="absolute bottom-0 right-0 w-[800px] h-[600px]  rounded-full blur-[100px] opacity-30 pointer-events-none bg-purple-500/20 dark:bg-purple-500/10"></div>
          
          <div className="container mx-auto px-6 relative z-10">
            <div className="max-w-5xl mx-auto text-center">
              <div className="inline-flex items-center justify-center px-4 py-1.5 mb-8 text-sm font-medium text-blue-600 dark:text-blue-300 bg-blue-50 dark:bg-transparent rounded-full border border-blue-200 dark:border-blue-500/20 animate-fade-in backdrop-blur-sm">
                <span className="relative flex h-2 w-2 mr-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
                </span>
                {t("home.hero.new_tools")}
              </div>
              
              <h1 className="text-6xl md:text-8xl font-bold tracking-tight text-gray-900 dark:text-white mb-8 animate-fade-in-up leading-tight">
                {t("home.hero.title")}
              </h1>
              
              <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-400 mb-12 max-w-3xl mx-auto leading-relaxed animate-fade-in-up animation-delay-200 font-light">
                {t("home.hero.subtitle")}
              </p>
              
              <div className="flex flex-col sm:flex-row justify-center gap-6 animate-fade-in-up animation-delay-400">
                <a
                  href="#tools"
                  className="group relative px-8 py-4 bg-gray-900 dark:bg-white  dark:text-black font-bold rounded-full transition-all duration-300 hover:scale-105 hover:shadow-[0_0_20px_rgba(0,0,0,0.3)] dark:hover:shadow-[0_0_20px_rgba(255,255,255,0.3)] active:scale-95"
                >
                  {t("home.hero.explore_btn")}
                </a>
                <a
                  href="/pdf-tools"
                  className="px-8 py-4 bg-transparent text-gray-900 dark:text-white font-bold rounded-full border border-gray-200 dark:border-white/20 transition-all duration-300 hover:scale-105 hover:bg-gray-50 dark:hover:bg-white/10 backdrop-blur-sm active:scale-95"
                >
                  {t("home.hero.pdf_btn")}
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-32 relative">
          <div className="container mx-auto px-6">
            <div className="mb-20">
              <h2 className="text-4xl md:text-5xl font-bold mb-6 animate-fade-in text-gray-900 dark:text-white">
                {t("home.features.title")}
              </h2>
              <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl animate-fade-in animation-delay-200">
                {t("home.features.description")}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                {
                  icon: (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  ),
                  title: t("home.features.document.title"),
                  desc: t("home.features.document.description"),
                  color: "text-blue-600 dark:text-blue-400",
                  bg: "bg-blue-50 dark:bg-blue-500/10",
                  border: "hover:border-blue-500/50"
                },
                {
                  icon: (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  ),
                  title: t("home.features.image.title"),
                  desc: t("home.features.image.description"),
                  color: "text-green-600 dark:text-green-400",
                  bg: "bg-green-50 dark:bg-green-500/10",
                  border: "hover:border-green-500/50"
                },
                {
                  icon: (
                    <>
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    </>
                  ),
                  title: t("home.features.developer.title"),
                  desc: t("home.features.developer.description"),
                  color: "text-purple-600 dark:text-purple-400",
                  bg: "bg-purple-50 dark:bg-purple-500/10",
                  border: "hover:border-purple-500/50"
                },
                {
                  icon: (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                  ),
                  title: t("home.features.ecommerce.title"),
                  desc: t("home.features.ecommerce.description"),
                  color: "text-amber-600 dark:text-amber-400",
                  bg: "bg-amber-50 dark:bg-amber-500/10",
                  border: "hover:border-amber-500/50"
                }
              ].map((feature, index) => (
                <div key={index} className={`group p-8 rounded-3xl border border-gray-200 dark:border-white/5 bg-white dark:bg-white/5 ${feature.border} transition-all duration-300 hover:-translate-y-1 hover:shadow-lg dark:hover:shadow-none`}>
                  <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-6 ${feature.bg} ${feature.color}`}>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      {feature.icon}
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                    {feature.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Tools Section */}
        <section id="tools" className="py-20 ">
          <div className="container mx-auto px-6">
            <div className="mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-6 animate-fade-in text-gray-900 dark:text-white">
                {t("home.tools.title")}
              </h2>
              <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl animate-fade-in animation-delay-200">
                {t("home.tools.description")}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {tools.map((category, index) => (
                <div
                  key={index}
                  className="rounded-3xl p-8 border border-gray-200 dark:border-white/5 bg-white dark:bg-white/5 animate-slide-in-up"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="flex items-center mb-8">
                    <div className="p-3 rounded-2xl mr-4 border border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-white/5">
                      <img
                        src={category.icon}
                        alt={category.category}
                        className="w-8 h-8 dark:invert opacity-80"
                      />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                      {category.category}
                    </h3>
                  </div>
                  <div className="grid gap-3">
                    {category.tools.map((tool, toolIdx) => (
                      <a
                        key={toolIdx}
                        href={tool.link}
                        className="group flex items-center justify-between p-4 rounded-xl border border-gray-200 dark:border-white/5 hover:border-blue-500/30 hover:bg-gray-50 dark:hover:bg-white/5 transition-all duration-300 active:scale-[0.98]"
                      >
                        <div>
                          <h4 className="font-semibold text-gray-900 dark:text-gray-200 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                            {tool.name}
                          </h4>
                          <p className="text-sm text-gray-500 dark:text-gray-500 mt-1">
                            {tool.description}
                          </p>
                        </div>
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5 text-gray-400 dark:text-gray-600 group-hover:text-blue-600 dark:group-hover:text-blue-400 transform group-hover:translate-x-1 transition-all"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path
                            fillRule="evenodd"
                            d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </a>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-32 relative overflow-hidden">
          <div className="absolute inset-0 "></div>
          <div className="container mx-auto px-6 relative z-10">
            <div className="relative rounded-[2.5rem] overflow-hidden px-6 py-24 text-center border border-gray-200 dark:border-white/5 bg-white dark:bg-white/5 shadow-2xl dark:shadow-none">
              <div className="absolute inset-0 opacity-10 dark:opacity-20 bg-[url('/grid.svg')]"></div>
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full  to-transparent pointer-events-none"></div>
              
              <div className="relative z-10 max-w-3xl mx-auto">
                <h2 className="text-4xl md:text-6xl font-bold text-gray-900 dark:text-white mb-8">
                  {t("home.cta.title")}
                </h2>
                <p className="text-xl text-gray-600 dark:text-gray-400 mb-12">
                  {t("home.cta.subtitle")}
                </p>
                <a
                  href="/pdf-tools"
                  className="inline-block px-12 py-5 bg-blue-600  font-bold rounded-full shadow-[0_0_30px_rgba(37,99,235,0.3)] hover:shadow-[0_0_50px_rgba(37,99,235,0.5)] hover:bg-blue-500 transition-all duration-300 text-lg transform hover:-translate-y-1 active:scale-95"
                >
                  {t("home.cta.button")}
                </a>
              </div>
            </div>
          </div>
        </section>
      </div>
    </Layout>
  );
}
