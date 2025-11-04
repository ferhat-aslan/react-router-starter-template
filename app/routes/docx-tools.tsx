import type {Route} from "./+types/home";
import Layout from "~/components/layout";
import SVG from "/pdf.svg";
import {webApp} from "@forge42/seo-tools/structured-data/web-app";
import {course} from "@forge42/seo-tools/structured-data/course";
import {type MetaFunction} from "react-router";
import {generateMeta} from "@forge42/seo-tools/remix/metadata";

export const meta: MetaFunction = () => {
  const meta = generateMeta(
    {
      title: "Free Online PDF Tools | Kleinbyte",
      description:
        "A comprehensive suite of free online PDF tools. Merge, split, compress, convert, and edit your PDF files with ease. No installation or registration required.",
      url: "https://kleinbyte.com/pdf-tools",
      image: "https://picsum.photos/200/300",
    },
    [
      {
        "script:ld+json": webApp({
          "@type": "WebApplication",
          headline: "The Ultimate Guide to Free Online PDF Tools",
          image: "https://kleinbyte.com/og-image-pdf-tools.png",
          datePublished: "2025-11-04T00:00:00Z",
        }),
      },
      {
        "script:ld+json": course({
          "@type": "Course",
          name: "Mastering PDF Manipulation with Kleinbyte Tools",
          description:
            "A comprehensive course on how to use our free online PDF tools to manage your documents efficiently.",
        }),
      },
    ]
  );
  return meta;
};
export default function DocxTools() {
  return (
    <Layout>
      {/* Card Blog */}
      <section className="grid w-full grid-cols-12 container mx-auto px-4 sm:px-6 lg:px-8 py-8 gap-4">
        <h1 className="col-span-12 text-center text-6xl font-bold">
          Every tool you need to work with PDFs in one place
        </h1>
        <h6 className="col-span-10 col-start-2 text-center text-lg text-gray-600 dark:text-neutral-400">
          Every tool you need to use PDFs, at your fingertips. All are 100% FREE
          and easy to use! Merge, split, compress, convert, rotate, unlock and
          watermark PDFs with just a few clicks.
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
