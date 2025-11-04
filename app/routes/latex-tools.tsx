import {generateMeta} from "@forge42/seo-tools/remix/metadata";
import type {Route} from "./+types/home";

import Layout from "~/components/layout";
import {webApp} from "@forge42/seo-tools/structured-data/web-app";
import {course} from "@forge42/seo-tools/structured-data/course";
import {type MetaFunction} from "react-router";

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

export default function LatexTools() {
  return (
    <Layout>
      <section className="grid w-full grid-cols-12 container mx-auto px-4 sm:px-6 lg:px-8 py-8 gap-4">
        <h1 className="col-span-12 text-center text-6xl font-bold">
          Latex Tools
        </h1>
        <h6 className="col-span-10 col-start-2 text-center text-lg text-gray-600 dark:text-neutral-400">
          Every tool you need to use Latex, at your fingertips. All are 100%
          FREE and easy to use!
        </h6>
      </section>
    </Layout>
  );
}
