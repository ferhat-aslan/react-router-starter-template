import type {Route} from "./+types/home";
import Layout from "~/components/layout";
import {LocaleLink} from "~/components/locale-link";
import { ToolCategoryCard } from "~/components/tool-category-card";
import { Suspense, lazy } from "react";
const HeroBackground = lazy(() => import("~/components/ui/hero-background").then(module => ({ default: module.HeroBackground })));

import PDF from "/pdf.svg";
import WORD from "/word.svg";
import JPG from "/jpg.svg";
import TXT from "/txt.svg";
import FOLDER from "/folder.svg";
import {useTranslation, translations, type Locale} from "../utils/route-utils";

import {generateMeta} from "@forge42/seo-tools/remix/metadata";
import {course} from "@forge42/seo-tools/structured-data/course";
import {webApp} from "@forge42/seo-tools/structured-data/web-app";
import {type MetaFunction} from "react-router";

import { SUPPORTED_LOCALES } from "../utils/route-utils";

export const meta: MetaFunction = ({location}) => {
  const firstPathSegment = location.pathname.split("/")?.[1];
  const locale: Locale = SUPPORTED_LOCALES.includes(firstPathSegment as any) 
    ? (firstPathSegment as any) 
    : "en";
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
      { property: "og:type", content: "website" },
      { property: "og:site_name", content: "Kleinbyte" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: t("home.meta.title") },
      { name: "twitter:description", content: t("home.meta.description") },
      { name: "twitter:image", content: "https://kleinbyte.com/og-image-all-tools.png" },
      { name: "keywords", content: "free online tools, pdf tools, document converter, image tools, developer tools, no signup required" },
      { name: "author", content: "Kleinbyte" },
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
      id: "pdf",
      link: "/pdf-tools",
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
      id: "documents",
      link: "/docx-tools",
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
      id: "images",
      link: "/tools/image-converter",
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
      id: "video",
      link: "/tools/video-compressor",
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
      id: "developer",
      link: "#",
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
      <div className="min-h-screen  transition-colors duration-300">
        {/* Hero Section - Shadcn Inspired */}
        <section className="relative pt-24 pb-32 overflow-hidden border-b border-gray-200 dark:border-neutral-700">
          <Suspense fallback={<div className="absolute inset-0 bg-white dark:bg-neutral-900" />}>
            <HeroBackground />
          </Suspense>
          
          <div className="container mx-auto px-6 relative z-10">
            <div className="max-w-6xl mx-auto text-center">
              {/* Badge */}
              <div className="inline-flex items-center justify-center px-3 py-1 mb-8 text-sm font-medium border border-gray-200 dark:border-neutral-700 rounded-full bg-white/50 dark:bg-neutral-900/50 backdrop-blur-sm">
                <span className="mr-2">✨</span>
                <span className="text-gray-700 dark:text-gray-300">
                  Free & No signup & Secure & Fast & Easy & Simple...
                </span>
                <span className="ml-2">🚀</span>
              </div>
              
              {/* Main Headline */}
              <h1 className="text-5xl md:text-7xl lg:text-[3em]!   font-bold tracking-tight mb-8 leading-[1.1]">
                <span className="text-gray-900 dark:text-white">
                  One Web App for all your needs {" "}
                </span>
                <span className="relative inline-block">
                 
                  <svg
                    className="absolute -bottom-2 left-0 w-full"
                    height="8"
                    viewBox="0 0 300 8"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M1 5.5C50 2.5 100 1 150 1.5C200 2 250 3.5 299 5.5"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      className="text-gray-900 dark:text-white"
                    />
                  </svg>
                </span>
                <br />at {" "}
                <span className="text-gray-900 dark:text-white"
                style={{borderBottom:"8px solid greenyellow"}}
                >Warp Speed</span>
                <span className="inline-block">⚡</span>
              </h1>
              
              {/* Subtitle */}
              <p className="text-lg md:text-xl text-gray-600 dark:text-gray-400 mb-8 max-w-3xl mx-auto leading-relaxed">
                Transform your workflow with our collection of{" "}
                <span className="font-semibold text-gray-900 dark:text-white">
                  free, fast, and secure online tools
                </span>{" "}
                for PDF, documents, images, and more. No signup required 🚀.
              </p>

            

              {/* Social Proof */}
              <div className="flex items-center justify-center gap-6 mb-10">
                {/* User Avatars */}
                <div className="flex -space-x-3">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <img
                    key={i}
                    loading="lazy"
                    decoding="async"
                      src={"https://i.pravatar.cc/150?img="+i+5}
                      className="w-10 h-10 rounded-full border-2 border-white dark:border-neutral-900 bg-gradient-to-br from-blue-400 to-purple-600"
                    />
                  ))}
                </div>
                
                {/* Rating */}
                <div className="flex items-center gap-2">
                  <div className="flex">
                    {[1, 2, 3, 4].map((i) => (
                      <svg key={i} className="w-5 h-5 text-amber-400 fill-current" viewBox="0 0 20 20">
                        <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                      </svg>
                    ))}
                    <svg className="w-5 h-5 text-amber-400 fill-current" viewBox="0 0 20 20">
                      <defs>
                        <linearGradient id="half-star">
                          <stop offset="50%" stopColor="currentColor" />
                          <stop offset="50%" stopColor="#d1d5db" />
                        </linearGradient>
                      </defs>
                      <path fill="url(#half-star)" d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                    </svg>
                  </div>
                  <span className="text-sm font-semibold text-gray-900 dark:text-white">4.5</span>
                </div>

                {/* Loved by */}
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  Loved by <span className="font-semibold text-gray-900 dark:text-white">great customers</span>
                </span>
              </div>

              {/* Tool Icons */}
              <div className="hidden items-center justify-center gap-4 mb-12">
                {[
                  { icon: "📄", label: "PDF" },
                  { icon: "✏️", label: "Edit" },
                  { icon: "🔄", label: "Convert" },
                  { icon: "🎨", label: "Design" },
                  { icon: "💾", label: "Save" },
                  { icon: "⚙️", label: "Tools" },
                ].map((tool, i) => (
                  <div
                    key={i}
                    className="w-12 h-12 rounded-xl border border-gray-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 flex items-center justify-center text-xl hover:scale-110 transition-transform cursor-pointer"
                    title={tool.label}
                  >
                    {tool.icon}
                  </div>
                ))}
              </div>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row justify-center gap-4">
                <LocaleLink to="/all-tools" className="flex items-center gap-2 justify-center bg-soft! border rounded-3xl! py-2.5! px-3.5! text-luft! border-input! hover:scale-105 transition-all cursor-pointer">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-drill-icon lucide-drill"><path d="M10 18a1 1 0 0 1 1 1v2a1 1 0 0 1-1 1H5a3 3 0 0 1-3-3 1 1 0 0 1 1-1z"/><path d="M13 10H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a1 1 0 0 1 1 1v6a1 1 0 0 1-1 1l-.81 3.242a1 1 0 0 1-.97.758H8"/><path d="M14 4h3a1 1 0 0 1 1 1v2a1 1 0 0 1-1 1h-3"/><path d="M18 6h4"/><path d="m5 10-2 8"/><path d="m7 18 2-8"/></svg>
                  Show all tools
                </LocaleLink>
                
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

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {tools.map((category, index) => (
                <div
                  key={index}
                  className="animate-slide-in-up h-full"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <ToolCategoryCard
                    title={category.category}
                    description={t(`home.tools.${category.id}.description`) || `${category.tools.length} tools available`}
                    count={category.tools.length}
                    icon={<img src={category.icon} alt={category.category} className="w-6 h-6 dark:invert" />}
                    link={category.link || category.tools[0]?.link || "#"}
                    badge="Available"
                  />
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
                <LocaleLink
                  to="/pdf-tools"
                  className="inline-block px-12 py-5 bg-blue-600  font-bold rounded-full shadow-[0_0_30px_rgba(37,99,235,0.3)] hover:shadow-[0_0_50px_rgba(37,99,235,0.5)] hover:bg-blue-500 transition-all duration-300 text-lg transform hover:-translate-y-1 active:scale-95"
                >
                  {t("home.cta.button")}
                </LocaleLink>
              </div>
            </div>
          </div>
        </section>
      </div>
    </Layout>
  );
}
