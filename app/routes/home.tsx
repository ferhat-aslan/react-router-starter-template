import type {Route} from "./+types/home";
import {Welcome} from "../welcome/welcome";
import Layout from "~/components/layout";

import SVG from "/pdf.svg";

import {generateMeta} from "@forge42/seo-tools/remix/metadata";

import {course} from "@forge42/seo-tools/structured-data/course";
import {webApp} from "@forge42/seo-tools/structured-data/web-app";
import {type MetaFunction} from "react-router";

export const meta: MetaFunction = () => {
  const meta = generateMeta(
    {
      title: "PDF Tools - APIs & Samples",
      description: "Welcome to PDF Tools!",
      url: "https://kleinbyte.com/pdf-tools",
      image: "https://picsum.photos/200/300",
    },
    [
      {
        "script:ld+json": webApp({
          "@type": "Article",
          headline: "Article headline",
          image: "https://example.com/image.jpg",
          datePublished: "2021-01-01T00:00:00Z",
        }),
      },
      {
        "script:ld+json": course({
          "@type": "Course",
          name: "Course name",
          description: "Course description",
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
  return (
    <Layout>
      <Welcome message={loaderData.message} />
      <section className="grid w-full grid-cols-12 container mx-auto px-4 sm:px-6 lg:px-8 py-8 gap-4">
        <h1 className="col-span-12 text-center text-6xl font-bold">
          Every tool you need to work with PDFs, Docx, Images, Latex, Seo Tools,
          E-commerce Tools, Developer Tools in one place
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
    </Layout>
  );
}
