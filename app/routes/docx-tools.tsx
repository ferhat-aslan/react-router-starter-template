import type {Route} from "./+types/home";
import Layout from "~/components/layout";
import SVG from "/pdf.svg";
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
      title: t("docx.meta.title"),
      description: t("docx.meta.description"),
      url: "https://kleinbyte.com/docx-tools",
      image: "https://kleinbyte.com/og-image-docx-tools.png",
    },
    [
      {
        "script:ld+json": webApp({
          "@type": "WebApplication",
          name: t("docx.title"),
          url: "https://kleinbyte.com/docx-tools",
          description: t("docx.description"),
          applicationCategory: "BusinessApplication",
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
          name: t("docx.title"),
          description: t("docx.description"),
        }),
      },
    ]
  );
  return meta;
};
export default function DocxTools() {
  const { t } = useTranslation();
  return (
    <Layout>
      {/* Card Blog */}
      <section className="grid w-full grid-cols-12 container mx-auto px-4 sm:px-6 lg:px-8 py-8 gap-4">
        <h1 className="col-span-12 text-center text-6xl font-bold">
          {t("docx.title")}
        </h1>
        <h6 className="col-span-10 col-start-2 text-center text-lg text-gray-600 dark:text-neutral-400">
          {t("docx.description")}
        </h6>
        <div className="col-span-12 flex flex-wrap xl:flex-nowrap justify-center gap-4 mt-4 mb-8">
          <div className=" tag" data-filter="all">
            All
          </div>
          <div className="tag" data-filter="workflows">
            Workflows
          </div>
          <div className="tag" data-filter="organize">
            Organize PDF
          </div>
          <div className="tag" data-filter="optimize">
            Optimize PDF
          </div>
          <div className="tag" data-filter="convert">
            Convert PDF
          </div>
          <div className="tag" data-filter="edit">
            Edit PDF
          </div>
          <div className="tag" data-filter="security">
            PDF Security
          </div>
        </div>
        <aside className="col-span-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          <div className="option-grid-box">
            <img src={SVG} alt="PDF Icon" className="mb-4 size-14" />
            <h3 className="text-xl font-semibold mb-2">Merge PDF</h3>
            <p className="text-gray-600 dark:text-neutral-400">
              Combine multiple PDF files into a single document quickly and
              easily.
            </p>
          </div>
          <div className="option-grid-box">
            <img src={SVG} alt="PDF Icon" className="mb-4 size-14" />

            <h3 className="text-xl font-semibold mb-2">Merge PDF</h3>
            <p className="text-gray-600 dark:text-neutral-400">
              Combine multiple PDF files into a single document quickly and
              easily.
            </p>
          </div>
          <div className="option-grid-box">
            <img src={SVG} alt="PDF Icon" className="mb-4 size-14" />

            <h3 className="text-xl font-semibold mb-2">Merge PDF</h3>
            <p className="text-gray-600 dark:text-neutral-400">
              Combine multiple PDF files into a single document quickly and
              easily.
            </p>
          </div>
          <div className="option-grid-box">
            <img src={SVG} alt="PDF Icon" className="mb-4 size-14" />

            <h3 className="text-xl font-semibold mb-2">Merge PDF</h3>
            <p className="text-gray-600 dark:text-neutral-400">
              Combine multiple PDF files into a single document quickly and
              easily.
            </p>
          </div>
          <div className="option-grid-box">
            <img src={SVG} alt="PDF Icon" className="mb-4 size-14" />

            <h3 className="text-xl font-semibold mb-2">Merge PDF</h3>
            <p className="text-gray-600 dark:text-neutral-400">
              Combine multiple PDF files into a single document quickly and
              easily.
            </p>
          </div>
          <div className="option-grid-box">
            <img src={SVG} alt="PDF Icon" className="mb-4 size-14" />

            <h3 className="text-xl font-semibold mb-2">Merge PDF</h3>
            <p className="text-gray-600 dark:text-neutral-400">
              Combine multiple PDF files into a single document quickly and
              easily.
            </p>
          </div>
        </aside>
      </section>
      {/* End Card Blog */}
    </Layout>
  );
}
