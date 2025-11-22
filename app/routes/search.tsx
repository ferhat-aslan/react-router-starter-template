import type { Route } from "./+types/search";
import Layout from "~/components/layout";
import { useSearchParams } from "react-router";
import { useI18n, translations, type Locale } from "../i18n/context";
import { type MetaFunction } from "react-router";

import PDF from "/pdf.svg";
import WORD from "/word.svg";
import JPG from "/jpg.svg";
import FOLDER from "/folder.svg";

export const meta: MetaFunction = ({ location }) => {
  const firstPathSegment = location.pathname.split("/")?.[1];
  const locale: Locale =
    firstPathSegment === "de" ? "de" :
    firstPathSegment === "es" ? "es" :
    firstPathSegment === "ar" ? "ar" : "en";
  const messages = translations[locale] ?? translations.en;

  function t(key: string) {
    return messages[key] ?? key;
  }

  return [
    { title: t("search.meta.title") },
    { name: "description", content: t("search.meta.description") },
  ];
};

export default function Search() {
  const [searchParams] = useSearchParams();
  const query = searchParams.get("q")?.toLowerCase() || "";
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

  const results = tools.flatMap((category) =>
    category.tools.filter(
      (tool) =>
        tool.name.toLowerCase().includes(query) ||
        tool.description.toLowerCase().includes(query)
    ).map(tool => ({ ...tool, category: category.category, icon: category.icon }))
  );

  return (
    <Layout>
      <div className="min-h-screen bg-white dark:bg-neutral-950 text-gray-900 dark:text-white pt-32 pb-20">
        <div className="container mx-auto px-6">
          <h1 className="text-4xl font-bold mb-8">
            {query ? `${t("search.results_title")} "${query}"` : t("search.default_title")}
          </h1>

          {results.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {results.map((tool, index) => (
                <a
                  key={index}
                  href={tool.link}
                  className="group p-6 rounded-2xl border border-gray-200 dark:border-white/5 bg-white dark:bg-white/5 hover:border-blue-500/30 hover:bg-gray-50 dark:hover:bg-white/10 transition-all duration-300"
                >
                  <div className="flex items-center mb-4">
                    <div className="p-2 rounded-xl mr-3 border border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-white/5">
                      <img
                        src={tool.icon}
                        alt={tool.category}
                        className="w-6 h-6 dark:invert opacity-80"
                      />
                    </div>
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      {tool.category}
                    </span>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                    {tool.name}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">
                    {tool.description}
                  </p>
                </a>
              ))}
            </div>
          ) : (
            <p className="text-xl text-gray-600 dark:text-gray-400">
              {t("search.no_results")}
            </p>
          )}
        </div>
      </div>
    </Layout>
  );
}
