import Layout from "~/components/layout";
import type {Route} from "../+types/home";
import SelectFilesInput from "~/components/select-files-input";
import {useState} from "react";
import Free from "~/components/free";

export function meta({}: Route.MetaArgs) {
  const title = "PDF to Text — Extract Text from PDF Pages";
  const description =
    "Extract all text from a PDF into a single .txt file. Useful for copying, search, and analysis.";
  const canonical = "https://your-domain.example/pdf-tools/pdf-to-text"; // replace with your domain

  return [
    {title},
    {name: "description", content: description},
    {name: "robots", content: "index,follow"},
    {rel: "canonical", href: canonical},
    {property: "og:type", content: "website"},
    {property: "og:title", content: title},
    {property: "og:description", content: description},
    {property: "og:url", content: canonical},
    {
      property: "og:image",
      content: "https://your-domain.example/og-image-text.png",
    },
    {name: "twitter:card", content: "summary_large_image"},
  ];
}

export default function PdfToText() {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: "PDF to Text",
    description: "Extract text from PDF pages and download as a .txt file.",
    url:
      typeof window !== "undefined"
        ? window.location.href
        : "https://your-domain.example/pdf-tools/pdf-to-text",
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
          name: "PDF to Text",
          item: "https://your-domain.example/pdf-tools/pdf-to-text",
        },
      ],
    },
  };

  return (
    <Layout>
      <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col gap-6 justify-start items-center">
        <h1 className="text-4xl font-bold mb-4">PDF → Text</h1>
        <p className="text-2xl text-gray-700 dark:text-neutral-300 max-w-3xl leading-relaxed">
          Extract all text from your PDF. Download as a .txt file.
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
            2. Extract and download
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
                const res = await fetch("http://localhost:8000/pdf-to-text", {
                  method: "POST",
                  body: form,
                });
                if (!res.ok) {
                  const text = await res.text();
                  alert("Extraction error: " + text);
                  setLoading(false);
                  return;
                }
                const blob = await res.blob();
                const url = URL.createObjectURL(blob);
                const a = document.createElement("a");
                a.href = url;
                a.download = "pdf-text.txt";
                document.body.appendChild(a);
                a.click();
                a.remove();
              } catch (err) {
                alert("Error extracting text from PDF");
              } finally {
                setLoading(false);
              }
            }}
          >
            {loading ? "Extracting..." : "Extract Text"}
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
