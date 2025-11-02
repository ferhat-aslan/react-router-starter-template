import Layout from "~/components/layout";
import type {Route} from "../+types/home";
import PDF from "/pdf.svg";
import SelectFilesInput from "~/components/select-files-input";
import Dragging from "~/components/dragging";
import {useEffect, useRef, useState} from "react";
import Free from "~/components/free";

export function meta({}: Route.MetaArgs) {
  const title = "Split PDF Pages — Fast, Private PDF Tool";
  const description =
    "Split a PDF into a new PDF containing only the pages you want (keep or remove ranges). Fast, secure, no uploads retained.";
  const canonical = "https://your-domain.example/pdf-tools/split-pdf"; // replace with your domain

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
      content: "https://your-domain.example/og-image-split.png",
    },
    {name: "twitter:card", content: "summary_large_image"},
    {name: "twitter:title", content: title},
    {name: "twitter:description", content: description},
  ];
}

export default function Home() {
  const [file, setFile] = useState<File | null>(null);
  const [ranges, setRanges] = useState<string>(""); // e.g. "1-3,5"
  const [mode, setMode] = useState<"keep" | "remove">("keep");
  const [loading, setLoading] = useState(false);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: "Split PDF Pages",
    description:
      "Split PDFs and produce a single PDF containing just the pages you choose. Supports page ranges and keep/remove modes.",
    url:
      typeof window !== "undefined"
        ? window.location.href
        : "https://your-domain.example/pdf-tools/split-pdf",
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
          name: "Split PDF",
          item: "https://your-domain.example/pdf-tools/split-pdf",
        },
      ],
    },
  };

  return (
    <Layout>
      <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col gap-6 justify-start items-center">
        <h1 className="text-4xl font-bold mb-4">Split PDF Pages</h1>

        {/* Big, clear instructions for older users */}
        <p className="text-2xl text-gray-700 dark:text-neutral-300 max-w-3xl leading-relaxed">
          Upload a PDF. Type the pages you want and choose whether to keep only
          those pages or remove them. Example formats: "1-3", "2,4,7", or
          "1-3,5".
        </p>

        {/* Simple numbered steps with larger font */}
        <div className="w-full max-w-3xl mt-4 space-y-3">
          <div className="text-xl font-medium">1. Choose a PDF file</div>
          <SelectFilesInput
            onChange={(newFiles: any) => {
              setFile(newFiles && newFiles.length ? newFiles[0] : null);
            }}
          />

          <div className="text-xl font-medium mt-4">2. Enter page ranges</div>
          <input
            type="text"
            placeholder="e.g. 1-3,5  (leave empty to use all pages)"
            value={ranges}
            onChange={(e) => setRanges(e.target.value)}
            className="w-full mt-2 p-3 text-lg border rounded"
            aria-label="Page ranges"
          />

          {/* Mode radio, larger and clearer */}
          <div className="flex items-center gap-6 mt-2 text-lg">
            <label className="flex items-center gap-2">
              <input
                type="radio"
                name="mode"
                value="keep"
                checked={mode === "keep"}
                onChange={() => setMode("keep")}
              />
              <span className="ml-1">Keep (only these pages)</span>
            </label>
            <label className="flex items-center gap-2">
              <input
                type="radio"
                name="mode"
                value="remove"
                checked={mode === "remove"}
                onChange={() => setMode("remove")}
              />
              <span className="ml-1">Remove (exclude these pages)</span>
            </label>
          </div>

          {/* Example quick buttons for older users (fills ranges and mode) */}
          <div className="mt-3 flex flex-col sm:flex-row gap-3">
            <button
              className="px-4 py-3 bg-green-600 text-white rounded text-lg"
              onClick={() => {
                setRanges("3-5");
                setMode("keep");
              }}
            >
              Example: Keep pages 3–5
            </button>
            <button
              className="px-4 py-3 bg-yellow-600 text-white rounded text-lg"
              onClick={() => {
                setRanges("1-2");
                setMode("remove");
              }}
            >
              Example: Remove pages 1–2
            </button>
            <button
              className="px-4 py-3 bg-blue-600 text-white rounded text-lg"
              onClick={() => {
                setRanges("");
                setMode("keep");
              }}
            >
              Example: Split all pages
            </button>
          </div>
        </div>

        <div className="w-full max-w-3xl">
          <div className="text-xl font-medium mt-6">3. Split and download</div>

          <button
            className="mt-4 px-6 py-3 disabled:opacity-40 disabled:pointer-events-none bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-lg"
            disabled={!file || loading}
            onClick={async () => {
              if (!file) return;
              setLoading(true);
              try {
                const form = new FormData();
                form.append("file", file);
                form.append("ranges", ranges);
                form.append("mode", mode);

                const res = await fetch("http://localhost:8000/split-pdf", {
                  method: "POST",
                  body: form,
                });

                if (!res.ok) {
                  const text = await res.text();
                  console.error("Server error:", text);
                  alert("Server error: " + text);
                  setLoading(false);
                  return;
                }

                // Expect single PDF file in response
                const data = await res.blob();
                const url = URL.createObjectURL(data);
                const a = document.createElement("a");
                a.href = url;
                a.download = "split.pdf";
                document.body.appendChild(a);
                a.setAttribute("target", "_blank");
                a.click();
                a.remove();
              } catch (err) {
                console.error("Error splitting PDF:", err);
                alert("Error splitting PDF");
              } finally {
                setLoading(false);
              }
            }}
          >
            {loading ? "Processing..." : "Split PDF pages"}
          </button>
        </div>

        <Free />
      </section>

      {/* insert JSON-LD for crawlers */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{__html: JSON.stringify(jsonLd)}}
      />
    </Layout>
  );
}
