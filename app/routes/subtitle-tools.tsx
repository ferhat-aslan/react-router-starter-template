import Layout from "~/components/layout";
import { Link } from "react-router";
import { FileText, RefreshCw, Merge, Edit3 } from "lucide-react";
import type { Route } from "./+types/subtitle-tools";
import { useTranslation, type Locale } from "~/utils/route-utils";
import { generateMeta } from "@forge42/seo-tools/remix/metadata";
import { webApp } from "@forge42/seo-tools/structured-data/web-app";
import { type MetaFunction } from "react-router";

export const meta: MetaFunction = ({ matches }) => {
  const rootMatch = matches.find((m) => m.id === "root");
  const messages = (rootMatch?.data as any)?.messages || {};
  const t = (key: string) => messages[key] ?? key;

  const meta = generateMeta(
    {
      title: t("subtitle.meta.title"),
      description: t("subtitle.meta.description"),
      url: "https://kleinbyte.com/subtitle-tools",
      image: "https://kleinbyte.com/og-image-subtitle-tools.png",
    },
    [
      {
        "script:ld+json": webApp({
          "@type": "SoftwareApplication",
          name: t("subtitle.meta.name"),
          url: "https://kleinbyte.com/subtitle-tools",
          description: t("subtitle.meta.app_desc"),
          applicationCategory: "MultimediaApplication",
          operatingSystem: "Any",
          offers: {
            "@type": "Offer",
            price: "0",
            priceCurrency: "USD",
          },
        }),
      },
      { property: "og:type", content: "website" },
      { property: "og:site_name", content: "Kleinbyte" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: t("subtitle.meta.title") },
      { name: "twitter:description", content: t("subtitle.meta.description") },
      { name: "twitter:image", content: "https://kleinbyte.com/og-image-subtitle-tools.png" },
      { name: "keywords", content: t("subtitle.meta.keywords") },
      { name: "author", content: "Kleinbyte" },
    ]
  );
  return meta;
};

export default function SubtitleTools() {
  const { t } = useTranslation();

  const tools = [
    {
      name: "Subtitle Editor",
      description: "Edit subtitle files with box-by-box pagination. Modify timing and text content.",
      icon: Edit3,
      href: "/subtitle-tools/edit",
      color: "blue",
    },
    {
      name: "Subtitle Converter",
      description: "Convert and translate subtitles. Side-by-side editing with format conversion support.",
      icon: RefreshCw,
      href: "/subtitle-tools/convert",
      color: "green",
    },
    {
      name: "Subtitle Merger",
      description: "Merge two subtitle files with time offset controls. Perfect for dual subtitles.",
      icon: Merge,
      href: "/subtitle-tools/merge",
      color: "purple",
    },
  ];

  return (
    <Layout>
      <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-12">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="flex justify-center mb-6">
            <div className="p-4 bg-blue-100 dark:bg-blue-950/30 rounded-2xl">
              <FileText className="w-16 h-16 text-blue-600 dark:text-blue-400" />
            </div>
          </div>
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 dark:text-white">
            Subtitle Tools
          </h1>
          <p className="text-lg md:text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
            Professional tools for editing, converting, and merging subtitle files.
            Support for SRT, VTT, and ASS formats.
          </p>
        </div>

        {/* Tools Grid */}
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
          {tools.map((tool) => {
            const Icon = tool.icon;
            const colorClasses = {
              blue: "bg-blue-50 dark:bg-blue-950/20 border-blue-200 dark:border-blue-800 hover:border-blue-400 dark:hover:border-blue-600",
              green: "bg-green-50 dark:bg-green-950/20 border-green-200 dark:border-green-800 hover:border-green-400 dark:hover:border-green-600",
              purple: "bg-purple-50 dark:bg-purple-950/20 border-purple-200 dark:border-purple-800 hover:border-purple-400 dark:hover:border-purple-600",
            }[tool.color];

            const iconColorClasses = {
              blue: "text-blue-600 dark:text-blue-400",
              green: "text-green-600 dark:text-green-400",
              purple: "text-purple-600 dark:text-purple-400",
            }[tool.color];

            return (
              <Link
                key={tool.href}
                to={tool.href}
                className={`block p-6 border-2 rounded-xl transition-all duration-300 hover:scale-105 hover:shadow-lg ${colorClasses}`}
              >
                <div className="flex flex-col items-center text-center space-y-4">
                  <Icon className={`w-12 h-12 ${iconColorClasses}`} />
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                    {tool.name}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {tool.description}
                  </p>
                </div>
              </Link>
            );
          })}
        </div>

        {/* Format Support */}
        <div className="max-w-4xl mx-auto bg-white dark:bg-neutral-900 border border-gray-200 dark:border-neutral-700 rounded-2xl p-8">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 text-center">
            Supported Formats
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center p-4 bg-gray-50 dark:bg-neutral-800 rounded-lg">
              <div className="text-3xl font-bold text-blue-600 dark:text-blue-400 mb-2">
                SRT
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                SubRip Subtitle
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                Most common format
              </p>
            </div>
            <div className="text-center p-4 bg-gray-50 dark:bg-neutral-800 rounded-lg">
              <div className="text-3xl font-bold text-green-600 dark:text-green-400 mb-2">
                VTT
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                WebVTT
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                Web standard format
              </p>
            </div>
            <div className="text-center p-4 bg-gray-50 dark:bg-neutral-800 rounded-lg">
              <div className="text-3xl font-bold text-purple-600 dark:text-purple-400 mb-2">
                ASS
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Advanced SubStation
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                With styling support
              </p>
            </div>
          </div>
        </div>

        {/* Features */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
          <div className="text-center p-6 bg-blue-50 dark:bg-blue-950/20 rounded-xl">
            <div className="text-3xl mb-3">🆓</div>
            <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
              100% Free
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              No hidden costs or subscriptions
            </p>
          </div>
          <div className="text-center p-6 bg-green-50 dark:bg-green-950/20 rounded-xl">
            <div className="text-3xl mb-3">🔒</div>
            <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
              Privacy First
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              All processing happens in your browser
            </p>
          </div>
          <div className="text-center p-6 bg-purple-50 dark:bg-purple-950/20 rounded-xl">
            <div className="text-3xl mb-3">⚡</div>
            <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
              Fast & Easy
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              No installation or registration required
            </p>
          </div>
        </div>

        {/* SEO Content: FAQ */}
        <div className="mt-16">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8 text-center">
            {t("faq.title")}
          </h2>
          <div className="space-y-4 max-w-3xl mx-auto">
            <details className="p-4 bg-white dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-slate-700">
              <summary className="font-semibold text-gray-900 dark:text-white cursor-pointer">{t("subtitle.faq.q1")}</summary>
              <p className="mt-3 text-gray-600 dark:text-gray-400">{t("subtitle.faq.a1")}</p>
            </details>
            <details className="p-4 bg-white dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-slate-700">
              <summary className="font-semibold text-gray-900 dark:text-white cursor-pointer">{t("subtitle.faq.q2")}</summary>
              <p className="mt-3 text-gray-600 dark:text-gray-400">{t("subtitle.faq.a2")}</p>
            </details>
            <details className="p-4 bg-white dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-slate-700">
              <summary className="font-semibold text-gray-900 dark:text-white cursor-pointer">{t("subtitle.faq.q3")}</summary>
              <p className="mt-3 text-gray-600 dark:text-gray-400">{t("subtitle.faq.a3")}</p>
            </details>
            <details className="p-4 bg-white dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-slate-700">
              <summary className="font-semibold text-gray-900 dark:text-white cursor-pointer">{t("subtitle.faq.q4")}</summary>
              <p className="mt-3 text-gray-600 dark:text-gray-400">{t("subtitle.faq.a4")}</p>
            </details>
            <details className="p-4 bg-white dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-slate-700">
              <summary className="font-semibold text-gray-900 dark:text-white cursor-pointer">{t("subtitle.faq.q5")}</summary>
              <p className="mt-3 text-gray-600 dark:text-gray-400">{t("subtitle.faq.a5")}</p>
            </details>
          </div>
        </div>
      </section>
    </Layout>
  );
}
