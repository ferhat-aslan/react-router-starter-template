import Layout from "~/components/layout";
import type {Route} from "../+types/home";
import PDF from "/pdf.svg";
import SelectFilesInput from "~/components/select-files-input";
import Dragging from "~/components/dragging";
import {useEffect, useRef, useState} from "react";
import Free from "~/components/free";
import {webApp} from "@forge42/seo-tools/structured-data/web-app";
import {course} from "@forge42/seo-tools/structured-data/course";
import {type MetaFunction} from "react-router";
import {generateMeta} from "@forge42/seo-tools/remix/metadata";
import {apiClient} from "~/lib/api-client";
import {useTranslation, translations, type Locale} from "~/utils/route-utils";

export const meta: MetaFunction = ({ location }) => {
  const locale: Locale = (location.pathname.split("/")?.[1] as Locale) || "en";
  const messages = translations[locale] ?? translations.en;
  const t = (key: string) => messages[key] ?? key;

  const meta = generateMeta(
    {
      title: t("pdf.merge.meta.title"),
      description: t("pdf.merge.meta.description"),
      url: "https://kleinbyte.com/pdf-tools/merge-pdf",
      image: "https://kleinbyte.com/og-image-merge-pdf.png",
    },
    [
      {
        "script:ld+json": webApp({
          "@type": "SoftwareApplication",
          name: t("pdf.merge.meta.name"),
          url: "https://kleinbyte.com/pdf-tools/merge-pdf",
          description: t("pdf.merge.meta.app_desc"),
          applicationCategory: "BusinessApplication",
          operatingSystem: "Any",
          offers: {
            "@type": "Offer",
            price: "0",
            priceCurrency: "USD",
          },
        }),
      },
      {
        "script:ld+json": course({
          "@type": "HowTo",
          name: "How to Merge PDF Files",
          description:
            "Step-by-step guide on combining multiple PDF files into one",
        }),
      },
      { property: "og:type", content: "website" },
      { property: "og:site_name", content: "Kleinbyte" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "keywords", content: t("pdf.merge.meta.keywords") },
      { name: "author", content: "Kleinbyte" },
    ]
  );
  return meta;
};
export default function Home() {
  const { t } = useTranslation();
  const [files, setFiles] = useState<FileList | null>(null);
  const [orderedFiles, setOrderedFiles] = useState<File[]>([]);
  const draggingRef = useRef(null);
  const [loading, setLoading] = useState(false);

  return (
    <Layout>
      <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col gap-6 justify-start items-center">
        
        
        
        

        <Dragging
          list={files ? Array.from(files) : []}
          onChange={setOrderedFiles}
          ref={draggingRef}
        />

        <span className="flex justify-start w-full items-center font-medium text-xl">
          3. Merge PDFs
        </span>
        <button
          className="mt-4 px-4 py-2 disabled:opacity-40 disabled:pointer-events-none bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          disabled={!files?.length || files.length < 2}
          onClick={() => {
            if (!files) return;
            setLoading(true);
            const form = new FormData();
            orderedFiles.forEach((file) => {
              form.append("files", file);
            });

            //return application/pdf  http://localhost:8000/merge-pdf
            apiClient
              .request("/merge-pdf", {method: "POST", body: form})
              .then((response) => response.blob())
              .then((data) => {
                const url = URL.createObjectURL(data);
                const a = document.createElement("a");
                a.href = url;
                a.download = "merged.pdf";
                document.body.appendChild(a);
                a.setAttribute("target", "_blank");
                a.setAttribute("download", "merged.pdf");
                a.click();
                a.remove();
                setLoading(false);
              })
              .catch((error) => {
                console.error("Error merging PDFs:", error);
                setLoading(false);
              });
          }}
        >
          Merge PDFs
        </button>
        <Free />

        {/* SEO Content: Benefits Section */}
        <section className="w-full max-w-4xl mt-16">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8 text-center">
            Why Use Our PDF Merger?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 bg-white dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-slate-700">
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/50 rounded-lg flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600 dark:text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">100% Secure</h3>
              <p className="text-gray-600 dark:text-gray-300">Your files are processed securely and deleted after merging. We never store your documents.</p>
            </div>
            <div className="p-6 bg-white dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-slate-700">
              <div className="w-12 h-12 bg-green-100 dark:bg-green-900/50 rounded-lg flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-600 dark:text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Lightning Fast</h3>
              <p className="text-gray-600 dark:text-gray-300">Merge multiple PDFs in seconds. No waiting, no queues - instant processing.</p>
            </div>
            <div className="p-6 bg-white dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-slate-700">
              <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/50 rounded-lg flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-purple-600 dark:text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Completely Free</h3>
              <p className="text-gray-600 dark:text-gray-300">No hidden costs, no subscriptions, no signup required. Just merge your PDFs for free.</p>
            </div>
          </div>
        </section>

        {/* SEO Content: How It Works */}
        <section className="w-full max-w-4xl mt-16">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8 text-center">
            How to Merge PDF Files
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center p-6">
              <div className="w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">1</div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Upload PDFs</h3>
              <p className="text-gray-600 dark:text-gray-400">Select multiple PDF files from your device or drag and drop them.</p>
            </div>
            <div className="text-center p-6">
              <div className="w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">2</div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Arrange Order</h3>
              <p className="text-gray-600 dark:text-gray-400">Drag to reorder your PDFs in the sequence you want them merged.</p>
            </div>
            <div className="text-center p-6">
              <div className="w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">3</div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Download</h3>
              <p className="text-gray-600 dark:text-gray-400">Click merge and download your combined PDF file instantly.</p>
            </div>
          </div>
        </section>

        {/* SEO Content: FAQ */}
        <section className="w-full max-w-4xl mt-16 mb-16">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8 text-center">
            {t("faq.title")}
          </h2>
          <div className="space-y-4">
            <details className="p-4 bg-white dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-slate-700">
              <summary className="font-semibold text-gray-900 dark:text-white cursor-pointer">{t("pdf.merge.faq.q1")}</summary>
              <p className="mt-3 text-gray-600 dark:text-gray-400">{t("pdf.merge.faq.a1")}</p>
            </details>
            <details className="p-4 bg-white dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-slate-700">
              <summary className="font-semibold text-gray-900 dark:text-white cursor-pointer">{t("pdf.merge.faq.q2")}</summary>
              <p className="mt-3 text-gray-600 dark:text-gray-400">{t("pdf.merge.faq.a2")}</p>
            </details>
            <details className="p-4 bg-white dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-slate-700">
              <summary className="font-semibold text-gray-900 dark:text-white cursor-pointer">{t("pdf.merge.faq.q3")}</summary>
              <p className="mt-3 text-gray-600 dark:text-gray-400">{t("pdf.merge.faq.a3")}</p>
            </details>
            <details className="p-4 bg-white dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-slate-700">
              <summary className="font-semibold text-gray-900 dark:text-white cursor-pointer">{t("pdf.merge.faq.q4")}</summary>
              <p className="mt-3 text-gray-600 dark:text-gray-400">{t("pdf.merge.faq.a4")}</p>
            </details>
            <details className="p-4 bg-white dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-slate-700">
              <summary className="font-semibold text-gray-900 dark:text-white cursor-pointer">{t("pdf.merge.faq.q5")}</summary>
              <p className="mt-3 text-gray-600 dark:text-gray-400">{t("pdf.merge.faq.a5")}</p>
            </details>
          </div>
        </section>
      </section>
    </Layout>
  );
}
