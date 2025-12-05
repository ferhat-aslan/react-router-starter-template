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

export const meta: MetaFunction = () => {
  const meta = generateMeta(
    {
      title: "Free Online PDF Merger - Combine Multiple PDFs | Kleinbyte",
      description:
        "Merge multiple PDF files into a single document online for free. No installation or registration required. Fast, secure and easy-to-use PDF merger tool.",
      url: "https://kleinbyte.com/pdf-tools/merge-pdf",
      image: "https://kleinbyte.com/og-image-merge-pdf.png",
    },
    [
      {
        "script:ld+json": webApp({
          "@type": "SoftwareApplication",
          name: "Kleinbyte PDF Merger",
          url: "https://kleinbyte.com/pdf-tools/merge-pdf",
          description: "Combine multiple PDF files into a single document",
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
      { name: "twitter:title", content: "Free Online PDF Merger - Combine Multiple PDFs | Kleinbyte" },
      { name: "twitter:description", content: "Merge multiple PDF files into a single document online for free. No installation or registration required. Fast, secure and easy-to-use PDF merger tool." },
      { name: "twitter:image", content: "https://kleinbyte.com/og-image-merge-pdf.png" },
      { name: "keywords", content: "merge pdf, combine pdf, pdf merger, join pdf files, concatenate pdf, free pdf merger, online pdf merger" },
      { name: "author", content: "Kleinbyte" },
    ]
  );
  return meta;
};
export default function Home() {
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
      </section>
    </Layout>
  );
}
