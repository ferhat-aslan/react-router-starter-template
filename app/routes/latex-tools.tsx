import {generateMeta} from "@forge42/seo-tools/remix/metadata";
import type {Route} from "./+types/home";

import Layout from "~/components/layout";
import {webApp} from "@forge42/seo-tools/structured-data/web-app";
import {course} from "@forge42/seo-tools/structured-data/course";
import {type MetaFunction} from "react-router";

export const meta: MetaFunction = () => {
  const meta = generateMeta(
    {
      title: "Free Online LaTeX Tools - Create, Edit, Convert | Kleinbyte",
      description: "Every tool you need to work with LaTeX files in one place. 100% free LaTeX tools including create, edit, convert and manipulate LaTeX documents with just a few clicks.",
      url: "https://kleinbyte.com/latex-tools",
      image: "https://kleinbyte.com/og-image-latex-tools.png",
    },
    [
      {
        "script:ld+json": webApp({
          "@type": "WebApplication",
          name: "Kleinbyte LaTeX Tools",
          url: "https://kleinbyte.com/latex-tools",
          description: "Comprehensive LaTeX tools including create, edit, and convert functions",
          applicationCategory: "EducationalApplication",
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
          name: "How to Use LaTeX Tools",
          description: "Simple steps to work with LaTeX files using our tools",
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
