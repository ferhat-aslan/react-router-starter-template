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
      title: "Free Online Word to PDF Converter - DOC, DOCX to PDF | Kleinbyte",
      description: "Convert Word documents to PDF files online for free. Support for DOC, DOCX, and RTF files. No installation or registration required. Fast, secure and easy-to-use Word to PDF converter.",
      url: "https://kleinbyte.com/pdf-tools/word-to-pdf",
      image: "https://kleinbyte.com/og-image-word-to-pdf.png",
    },
    [
      {
        "script:ld+json": webApp({
          "@type": "SoftwareApplication",
          name: "Kleinbyte Word to PDF Converter",
          url: "https://kleinbyte.com/pdf-tools/word-to-pdf",
          description: "Convert Word documents to PDF files",
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
          name: "How to Convert Word to PDF",
          description: "Step-by-step guide on converting DOC/DOCX files to PDF",
        }),
      },
    ]
  );
  return meta;
};

export default function WordToPdf() {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: "Word to PDF",
    description: "Convert Word files to PDF with one click.",
    url:
      typeof window !== "undefined"
        ? window.location.href
        : "https://your-domain.example/pdf-tools/word-to-pdf",
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
          name: "Word to PDF",
          item: "https://your-domain.example/pdf-tools/word-to-pdf",
        },
      ],
    },
  };

  return (
    <Layout>
      <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col gap-6 justify-start items-center">
        <h1 className="text-4xl font-bold mb-4">Word → PDF</h1>

        <p className="text-2xl text-gray-700 dark:text-neutral-300 max-w-3xl leading-relaxed">
          Convert a Word document to PDF. Choose your file and press "Convert".
          Supported formats: .doc, .docx, .rtf.
        </p>

        <div className="w-full max-w-2xl mt-4">
          <div className="text-xl font-medium mb-2">1. Choose a Word file</div>
          <SelectFilesInput
            accept=".doc,.docx,.rtf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document,application/rtf"
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

                const res = await fetch("http://localhost:8000/word-to-pdf", {
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
                // use original basename if available
                const name =
                  file && file.name
                    ? file.name.replace(/\.[^.]+$/, ".pdf")
                    : "converted.pdf";
                a.download = name;
                document.body.appendChild(a);
                a.click();
                a.remove();
              } catch (err) {
                console.error("Error converting file:", err);
                alert("Error converting file");
              } finally {
                setLoading(false);
              }
            }}
          >
            {loading ? "Converting..." : "Convert to PDF"}
          </button>

          {/* Quick example buttons for older users */}
          <div className="mt-4 flex gap-3">
            <button
              className="px-4 py-2 rounded bg-green-600 text-white"
              onClick={() => {
                alert(
                  "Pick a Word file and press Convert. Example: select 'example.docx' from your files."
                );
              }}
            >
              Example: Convert my resume
            </button>
            <button
              className="px-4 py-2 rounded bg-yellow-600 text-white"
              onClick={() => {
                alert(
                  "If you only have a .docx file, it will be converted to PDF with the same name."
                );
              }}
            >
              Tip: .docx → PDF
            </button>
          </div>
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
