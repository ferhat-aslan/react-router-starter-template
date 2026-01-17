
import type {Route} from "./+types/all-tools";
import Layout from "~/components/layout";
import {ToolCategoryCard} from "~/components/tool-category-card";
import {useTranslation, type Locale} from "../utils/route-utils";
import {generateMeta} from "@forge42/seo-tools/remix/metadata";
import {webApp} from "@forge42/seo-tools/structured-data/web-app";
import {type MetaFunction} from "react-router";

import PDF from "/pdf.svg";
import WORD from "/word.svg";
import JPG from "/jpg.svg";
import TXT from "/txt.svg";
import FOLDER from "/folder.svg";

export const meta: MetaFunction = ({ matches }) => {
  const rootMatch = matches.find((m) => m.id === "root");
  const messages = (rootMatch?.data as any)?.messages || {};
  const locale = (rootMatch?.data as any)?.locale || "en";

  function t(key: string) {
    return messages[key] ?? key;
  }

  const meta = generateMeta(
    {
      title: t("all_tools.meta.title"),
      description: t("all_tools.meta.description"),
      url: `https://kleinbyte.com/${locale === "en" ? "" : locale + "/"}all-tools`,
      image: "https://kleinbyte.com/og-image-all-tools.png",
    },
    [
      {
        "script:ld+json": webApp({
          "@type": "CollectionPage",
          name: t("all_tools.title"),
          description: t("all_tools.description"),
          url: `https://kleinbyte.com/${locale === "en" ? "" : locale + "/"}all-tools`,
          mainEntity: {
            "@type": "ItemList",
            itemListElement: [
              // This would ideally be dynamically generated from the tools list, 
              // but for static structured data we can keep it high level or generic
              {
                "@type": "ListItem",
                position: 1,
                name: t("tools.pdf.category"),
                url: `https://kleinbyte.com/${locale === "en" ? "" : locale + "/"}pdf-tools`
              },
              {
                "@type": "ListItem",
                position: 2,
                name: t("tools.images.category"),
                url: `https://kleinbyte.com/${locale === "en" ? "" : locale + "/"}tools/image-converter`
              },
              {
                "@type": "ListItem",
                position: 3,
                name: t("tools.video.category"),
                url: `https://kleinbyte.com/${locale === "en" ? "" : locale + "/"}tools/video-compressor`
              }
            ]
          }
        }),
      },
      { property: "og:type", content: "website" },
      { property: "og:site_name", content: "Kleinbyte" },
      { name: "keywords", content: t("all_tools.meta.keywords") },
    ]
  );
  return meta;
};

export default function AllTools() {
  const { t } = useTranslation();

  const allTools = [
    {
      category: t("tools.pdf.category"),
      id: "pdf",
      icon: PDF,
      tools: [
        {
          name: t("tools.pdf.merge.name"),
          description: t("tools.pdf.merge.description"),
          link: "/pdf-tools/merge-pdf",
          icon: <img src={PDF} alt="PDF" className="size-8 dark:invert" />
        },
        {
          name: t("tools.pdf.split.name"),
          description: t("tools.pdf.split.description"),
          link: "/pdf-tools/split-pdf",
          icon: <img src={PDF} alt="PDF" className="size-8 dark:invert" />
        },
        {
          name: t("tools.pdf.word_to_pdf.name"),
          description: t("tools.pdf.word_to_pdf.description"),
          link: "/pdf-tools/word-to-pdf",
          icon: (
             <span className="flex gap-1">
               <img src={WORD} alt="Word" className="size-6 dark:invert" />
               <span>→</span>
               <img src={PDF} alt="PDF" className="size-6 dark:invert" />
             </span>
           )
        },
        {
          name: t("tools.pdf.pdf_to_text.name"),
          description: t("tools.pdf.pdf_to_text.description"),
          link: "/pdf-tools/pdf-to-text",
          icon: (
            <span className="flex gap-1">
              <img src={PDF} alt="PDF" className="size-6 dark:invert" />
              <span>→</span>
              <img src={TXT} alt="Text" className="size-6 dark:invert" />
            </span>
          )
        },
        {
          name: t("tools.pdf.pdf_to_images.name"),
          description: t("tools.pdf.pdf_to_images.description"),
          link: "/pdf-tools/pdf-to-images",
          icon: (
            <span className="flex gap-1">
              <img src={PDF} alt="PDF" className="size-6 dark:invert" />
              <span>→</span>
              <img src={JPG} alt="Image" className="size-6 dark:invert" />
            </span>
          )
        },
      ],
    },
    {
      category: t("tools.documents.category"),
      id: "documents",
      icon: WORD,
      tools: [
        {
          name: t("tools.documents.docx.name"),
          description: t("tools.documents.docx.description"),
          link: "/docx-tools",
          icon: <img src={WORD} alt="DOCX" className="size-8 dark:invert" />
        },
        {
          name: t("tools.documents.latex.name"),
          description: t("tools.documents.latex.description"),
          link: "/latex-tools",
          icon: <img src={TXT} alt="LaTeX" className="size-8 dark:invert" />
        },
      ],
    },
    {
      category: t("tools.images.category"),
      id: "images",
      icon: JPG,
      tools: [
        {
          name: t("tools.images.converter.name"),
          description: t("tools.images.converter.description"),
          link: "/tools/image-converter",
          icon: <img src={JPG} alt="Image" className="size-8 dark:invert" />
        },
      ],
    },
    {
      category: t("tools.video.category"),
      id: "video",
      icon: JPG,
      tools: [
        {
          name: t("tools.video.compressor.name"),
          description: t("tools.video.compressor.description"),
          link: "/tools/video-compressor",
          icon: <img src={JPG} alt="Video" className="size-8 dark:invert" />
        },
      ],
    },
    {
      category: t("tools.subtitle.category"),
      id: "subtitle",
      icon: TXT,
      tools: [
         {
          name: t("tools.subtitle.edit.name"),
          description: t("tools.subtitle.edit.description"),
          link: "/subtitle-tools/editor",
          icon: <img src={TXT} alt="Subtitle" className="size-8 dark:invert" />
        },
        {
          name: t("tools.subtitle.convert.name"),
          description: t("tools.subtitle.convert.description"),
          link: "/subtitle-tools/converter",
          icon: <img src={TXT} alt="Subtitle" className="size-8 dark:invert" />
        },
        {
          name: t("tools.subtitle.merge.name"),
          description: t("tools.subtitle.merge.description"),
          link: "/subtitle-tools/merger",
          icon: <img src={TXT} alt="Subtitle" className="size-8 dark:invert" />
        },
      ]
    }
  ];

  return (
    <Layout>
      <div className="min-h-screen">
        {/* Header */}
        <div className="bg-gray-50 dark:bg-neutral-900 border-b border-gray-200 dark:border-neutral-800 py-16">
          <div className="container mx-auto px-6 text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
              {t("all_tools.title")}
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              {t("all_tools.description")}
            </p>
          </div>
        </div>

        {/* Tools Grid */}
        <div className="container mx-auto px-6 py-16 space-y-16">
          {allTools.map((category, idx) => (
            <section key={idx} className="space-y-8">
               <div className="flex items-center gap-4 border-b border-gray-200 dark:border-white/10 pb-4">
                  <div className="w-12 h-12 rounded-xl bg-blue-50 dark:bg-blue-500/10 flex items-center justify-center">
                     <img src={category.icon} alt={category.category} className="w-6 h-6 dark:invert" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                    {category.category}
                  </h2>
               </div>
               
               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                 {category.tools.map((tool, tIdx) => (
                   <ToolCategoryCard
                     key={tIdx}
                     title={tool.name}
                     description={tool.description}
                     count={1}
                     icon={tool.icon}
                     link={tool.link}
                     badge="Free"
                   />
                 ))}
               </div>
            </section>
          ))}
        </div>
      </div>
    </Layout>
  );
}
