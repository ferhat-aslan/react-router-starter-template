import Layout from "~/components/layout";
import type {Route} from "../+types/home";
import SelectFilesInput from "~/components/select-files-input";
import {useState} from "react";
import Free from "~/components/free";
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

export default function PdfToImages() {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: "PDF to Images",
    description:
      "Convert PDF pages into PNG images and download them as a zip file.",
    url:
      typeof window !== "undefined"
        ? window.location.href
        : "https://your-domain.example/pdf-tools/pdf-to-images",
    breadcrumb: {
      "@type": "BreadcrumbList",
      itemListElement: [
        {
          "@type": "ListItem",
          position: 1,
          name: "Home",
          item: "https://your-domain.example/",
        },
        {
          "@type": "ListItem",
          position: 2,
          name: "PDF Tools",
          item: "https://your-domain.example/pdf-tools",
        },
        {
          "@type": "ListItem",
          position: 3,
          name: "PDF to Images",
          item: "https://your-domain.example/pdf-tools/pdf-to-images",
        },
      ],
    },
  };

  return (
    <Layout>
      <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col gap-6 justify-start items-center">
        <h1 className="text-4xl font-bold mb-4">PDF → Images</h1>
        <p className="text-2xl text-gray-700 dark:text-neutral-300 max-w-3xl leading-relaxed">
          Convert each page of your PDF to a PNG image. Download all images as a
          zip file.
        </p>
        <div className="w-full max-w-2xl mt-4">
          <div className="text-xl font-medium mb-2">1. Choose a PDF file</div>
          <SelectFilesInput
            accept=".pdf,application/pdf"
            onChange={(newFiles: any) => {
              setFile(newFiles && newFiles.length ? newFiles[0] : null);
            }}
          />
          <div className="text-xl font-medium mt-6">
            2. Convert and download
          </div>
          <button
            className="mt-4 px-6 py-3 disabled:opacity-40 disabled:pointer-events-none bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-lg"
            disabled={!file || loading}
            onClick={async () => {
              if (!file) return;
              setLoading(true);
              try {
                const form = new FormData();
                form.append("file", file);
                const res = await fetch("http://localhost:8000/pdf-to-images", {
                  method: "POST",
                  body: form,
                });
                if (!res.ok) {
                  const text = await res.text();
                  alert("Conversion error: " + text);
                  setLoading(false);
                  return;
                }
                const blob = await res.blob();
                const url = URL.createObjectURL(blob);
                const a = document.createElement("a");
                a.href = url;
                a.download = "pdf-images.zip";
                document.body.appendChild(a);
                a.click();
                a.remove();
              } catch (err) {
                alert("Error converting PDF to images");
              } finally {
                setLoading(false);
              }
            }}
          >
            {loading ? "Converting..." : "Convert to Images"}
          </button>
        </div>
        <Free />
      </section>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{__html: JSON.stringify(jsonLd)}}
      />
    </Layout>
  );
}
