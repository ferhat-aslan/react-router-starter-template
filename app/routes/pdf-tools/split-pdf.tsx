import { useState } from "react";
import { Upload, FileText, Download, AlertCircle, CheckCircle, Loader2, Scissors, Trash2 } from "lucide-react";
import { uploadToR2, getDownloadUrl } from "~/utils/r2-upload";
import type { Route } from "./+types/split-pdf";
import { useTranslation, type Locale } from "~/utils/route-utils";
import {generateMeta} from "@forge42/seo-tools/remix/metadata";
import {webApp} from "@forge42/seo-tools/structured-data/web-app";
import {course} from "@forge42/seo-tools/structured-data/course";
import {type MetaFunction} from "react-router";

export const meta: MetaFunction = ({ matches }) => {
  const rootMatch = matches.find((m) => m.id === "root");
  const messages = (rootMatch?.data as any)?.messages || {};
  const t = (key: string) => messages[key] ?? key;

  const meta = generateMeta(
    {
      title: t("pdf.split.meta.title"),
      description: t("pdf.split.meta.description"),
      url: "https://kleinbyte.com/pdf-tools/split-pdf",
      image: "https://kleinbyte.com/og-image-split-pdf.png",
    },
    [
      {
        "script:ld+json": webApp({
          "@type": "SoftwareApplication",
          name: t("pdf.split.meta.name"),
          url: "https://kleinbyte.com/pdf-tools/split-pdf",
          description: t("pdf.split.meta.app_desc"),
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
          name: "How to Split PDF Files",
          description: "Step-by-step guide on splitting PDF files by page ranges",
        }),
      },
      { property: "og:type", content: "website" },
      { property: "og:site_name", content: "Kleinbyte" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "keywords", content: t("pdf.split.meta.keywords") },
      { name: "author", content: "Kleinbyte" },
    ]
  );
  return meta;
};

export default function SplitPdf() {
  const { t } = useTranslation();
  const [file, setFile] = useState<File | null>(null);
  const [ranges, setRanges] = useState<string>("");
  const [mode, setMode] = useState<"keep" | "remove">("keep");
  const [status, setStatus] = useState<"idle" | "uploading" | "processing" | "success" | "error">("idle");
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setStatus("idle");
      setError(null);
      setDownloadUrl(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return;

    setStatus("uploading");
    setError(null);

    try {
      // 1. Upload to R2
      const key = await uploadToR2(file);
      
      setStatus("processing");

      // 2. Send key to backend
      const response = await fetch("http://localhost:8000/split-pdf", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ 
          file_key: key,
          ranges: ranges,
          mode: mode
        }),
      });

      if (!response.ok) {
        const errorData = await response.json() as any;
        throw new Error(errorData.error || "Split failed");
      }

      const data = await response.json() as any;
      
      // 3. Get download URL
      const url = getDownloadUrl(data.result_key);
      setDownloadUrl(url);
      setStatus("success");
    } catch (err: any) {
      console.error(err);
      setError(err.message || "An unexpected error occurred");
      setStatus("error");
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold tracking-tight bg-gradient-to-r from-orange-500 to-amber-500 bg-clip-text text-transparent">
          {t("pdfTools.split.title")}
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          {t("pdfTools.split.description")}
        </p>
      </div>

      <div className="grid gap-8 md:grid-cols-2">
        {/* Upload Section */}
        <div className="space-y-6">
          <div className="bg-card border rounded-xl p-6 shadow-sm">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <Upload className="w-5 h-5 text-orange-500" />
              Upload PDF
            </h2>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="relative group">
                <input
                  type="file"
                  accept=".pdf"
                  onChange={handleFileChange}
                  className="hidden"
                  id="pdf-upload"
                />
                <label
                  htmlFor="pdf-upload"
                  className={`
                    flex flex-col items-center justify-center w-full h-48 
                    border-2 border-dashed rounded-lg cursor-pointer 
                    transition-all duration-200
                    ${file 
                      ? "border-orange-500 bg-orange-50/50 dark:bg-orange-950/20" 
                      : "border-muted-foreground/25 hover:border-orange-500 hover:bg-muted/50"
                    }
                  `}
                >
                  <div className="flex flex-col items-center justify-center pt-5 pb-6 text-center px-4">
                    {file ? (
                      <>
                        <FileText className="w-10 h-10 text-orange-500 mb-3" />
                        <p className="text-sm font-medium text-foreground truncate max-w-full">
                          {file.name}
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                          {(file.size / (1024 * 1024)).toFixed(2)} MB
                        </p>
                      </>
                    ) : (
                      <>
                        <Upload className="w-10 h-10 text-muted-foreground mb-3 group-hover:text-orange-500 transition-colors" />
                        <p className="text-sm text-foreground font-medium">
                          Click to upload or drag and drop
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                          PDF Files only
                        </p>
                      </>
                    )}
                  </div>
                </label>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium mb-1.5 block">Page Ranges</label>
                  <input
                    type="text"
                    placeholder="e.g. 1-3,5"
                    value={ranges}
                    onChange={(e) => setRanges(e.target.value)}
                    className="w-full p-2.5 rounded-lg border bg-background"
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Leave empty to split all pages
                  </p>
                </div>

                <div className="flex gap-4">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="mode"
                      value="keep"
                      checked={mode === "keep"}
                      onChange={() => setMode("keep")}
                      className="text-orange-600 focus:ring-orange-500"
                    />
                    <span className="text-sm">Keep Selected</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="mode"
                      value="remove"
                      checked={mode === "remove"}
                      onChange={() => setMode("remove")}
                      className="text-orange-600 focus:ring-orange-500"
                    />
                    <span className="text-sm">Remove Selected</span>
                  </label>
                </div>
              </div>

              <button
                type="submit"
                disabled={!file || status === "uploading" || status === "processing"}
                className={`
                  w-full py-2.5 px-4 rounded-lg font-medium flex items-center justify-center gap-2
                  transition-all duration-200
                  ${!file || status === "uploading" || status === "processing"
                    ? "bg-muted text-muted-foreground cursor-not-allowed"
                    : "bg-orange-600 hover:bg-orange-700 text-white shadow-md hover:shadow-lg"
                  }
                `}
              >
                {status === "uploading" ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Uploading...
                  </>
                ) : status === "processing" ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Splitting...
                  </>
                ) : (
                  "Split PDF"
                )}
              </button>
            </form>
          </div>
        </div>

        {/* Status/Result Section */}
        <div className="space-y-6">
          <div className="bg-card border rounded-xl p-6 shadow-sm h-full flex flex-col">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <Download className="w-5 h-5 text-green-500" />
              Result
            </h2>

            <div className="flex-1 flex flex-col items-center justify-center text-center p-4">
              {status === "idle" && (
                <div className="text-muted-foreground">
                  <Scissors className="w-12 h-12 mx-auto mb-3 opacity-20" />
                  <p>Upload a PDF to start splitting</p>
                </div>
              )}

              {(status === "uploading" || status === "processing") && (
                <div className="space-y-4 w-full max-w-xs">
                  <Loader2 className="w-12 h-12 mx-auto text-orange-500 animate-spin" />
                  <div>
                    <p className="font-medium text-foreground">
                      {status === "uploading" ? "Uploading PDF..." : "Splitting PDF..."}
                    </p>
                    <p className="text-sm text-muted-foreground mt-1">
                      Please wait...
                    </p>
                  </div>
                </div>
              )}

              {status === "error" && (
                <div className="text-destructive space-y-3">
                  <AlertCircle className="w-12 h-12 mx-auto" />
                  <p className="font-medium">Split Failed</p>
                  <p className="text-sm opacity-90">{error}</p>
                </div>
              )}

              {status === "success" && downloadUrl && (
                <div className="space-y-6 w-full">
                  <div className="text-green-600 dark:text-green-500">
                    <CheckCircle className="w-16 h-16 mx-auto mb-3" />
                    <p className="text-lg font-semibold">Split Complete!</p>
                  </div>
                  
                  <a
                    href={downloadUrl}
                    download
                    className="inline-flex items-center justify-center gap-2 w-full py-3 px-4 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium shadow-md transition-all hover:scale-[1.02]"
                  >
                    <Download className="w-5 h-5" />
                    Download Split PDF
                  </a>
                  
                  <button 
                    onClick={() => {
                      setFile(null);
                      setStatus("idle");
                      setDownloadUrl(null);
                      setRanges("");
                    }}
                    className="text-sm text-muted-foreground hover:text-foreground underline"
                  >
                    Split another PDF
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* SEO Content: Benefits Section */}
      <section className="w-full max-w-4xl mx-auto mt-16 px-6">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8 text-center">
          Why Use Our PDF Splitter?
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 bg-white dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-slate-700">
            <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900/50 rounded-lg flex items-center justify-center mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-orange-600 dark:text-orange-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Extract Specific Pages</h3>
            <p className="text-gray-600 dark:text-gray-300">Select exactly which pages to keep or remove. Perfect for extracting chapters or sections.</p>
          </div>
          <div className="p-6 bg-white dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-slate-700">
            <div className="w-12 h-12 bg-green-100 dark:bg-green-900/50 rounded-lg flex items-center justify-center mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-600 dark:text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Secure Processing</h3>
            <p className="text-gray-600 dark:text-gray-300">Your files are encrypted and automatically deleted. We never store your documents.</p>
          </div>
          <div className="p-6 bg-white dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-slate-700">
            <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/50 rounded-lg flex items-center justify-center mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-purple-600 dark:text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Instant Results</h3>
            <p className="text-gray-600 dark:text-gray-300">Split PDFs in seconds with no waiting. Download your result immediately.</p>
          </div>
        </div>
      </section>

      {/* SEO Content: How It Works */}
      <section className="w-full max-w-4xl mx-auto mt-16 px-6">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8 text-center">
          How to Split PDF Files
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center p-6">
            <div className="w-12 h-12 bg-orange-600 text-white rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">1</div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Upload PDF</h3>
            <p className="text-gray-600 dark:text-gray-400">Select the PDF file you want to split from your device.</p>
          </div>
          <div className="text-center p-6">
            <div className="w-12 h-12 bg-orange-600 text-white rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">2</div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Select Pages</h3>
            <p className="text-gray-600 dark:text-gray-400">Enter page ranges like "1-3,5,8-10" to keep or remove.</p>
          </div>
          <div className="text-center p-6">
            <div className="w-12 h-12 bg-orange-600 text-white rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">3</div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Download</h3>
            <p className="text-gray-600 dark:text-gray-400">Click split and download your new PDF with selected pages.</p>
          </div>
        </div>
      </section>

      {/* SEO Content: FAQ */}
      <section className="w-full max-w-4xl mx-auto mt-16 mb-16 px-6">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8 text-center">
          {t("faq.title")}
        </h2>
        <div className="space-y-4">
          <details className="p-4 bg-white dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-slate-700">
            <summary className="font-semibold text-gray-900 dark:text-white cursor-pointer">{t("pdf.split.faq.q1")}</summary>
            <p className="mt-3 text-gray-600 dark:text-gray-400">{t("pdf.split.faq.a1")}</p>
          </details>
          <details className="p-4 bg-white dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-slate-700">
            <summary className="font-semibold text-gray-900 dark:text-white cursor-pointer">{t("pdf.split.faq.q2")}</summary>
            <p className="mt-3 text-gray-600 dark:text-gray-400">{t("pdf.split.faq.a2")}</p>
          </details>
          <details className="p-4 bg-white dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-slate-700">
            <summary className="font-semibold text-gray-900 dark:text-white cursor-pointer">{t("pdf.split.faq.q3")}</summary>
            <p className="mt-3 text-gray-600 dark:text-gray-400">{t("pdf.split.faq.a3")}</p>
          </details>
          <details className="p-4 bg-white dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-slate-700">
            <summary className="font-semibold text-gray-900 dark:text-white cursor-pointer">{t("pdf.split.faq.q4")}</summary>
            <p className="mt-3 text-gray-600 dark:text-gray-400">{t("pdf.split.faq.a4")}</p>
          </details>
          <details className="p-4 bg-white dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-slate-700">
            <summary className="font-semibold text-gray-900 dark:text-white cursor-pointer">{t("pdf.split.faq.q5")}</summary>
            <p className="mt-3 text-gray-600 dark:text-gray-400">{t("pdf.split.faq.a5")}</p>
          </details>
        </div>
      </section>
    </div>
  );
}
