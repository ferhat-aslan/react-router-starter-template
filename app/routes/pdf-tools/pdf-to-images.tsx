import { useState } from "react";
import { Upload, FileText, Download, AlertCircle, CheckCircle, Loader2, Image as ImageIcon, Trash2 } from "lucide-react";
import { uploadToR2, getDownloadUrl } from "~/utils/r2-upload";
import type { Route } from "./+types/pdf-to-images";
import { useTranslation, translations, type Locale } from "~/i18n/context";

import {generateMeta} from "@forge42/seo-tools/remix/metadata";
import {webApp} from "@forge42/seo-tools/structured-data/web-app";
import {course} from "@forge42/seo-tools/structured-data/course";
import {type MetaFunction} from "react-router";

export const meta: MetaFunction = ({ location }) => {
  const locale: Locale = (location.pathname.split("/")?.[1] as Locale) || "en";
  const messages = translations[locale] ?? translations.en;
  const t = (key: string) => messages[key] ?? key;

  const meta = generateMeta(
    {
      title: t("pdf.images.meta.title"),
      description: t("pdf.images.meta.description"),
      url: "https://kleinbyte.com/pdf-tools/pdf-to-images",
      image: "https://kleinbyte.com/og-image-pdf-to-images.png",
    },
    [
      {
        "script:ld+json": webApp({
          "@type": "SoftwareApplication",
          name: t("pdf.images.meta.name"),
          url: "https://kleinbyte.com/pdf-tools/pdf-to-images",
          description: t("pdf.images.meta.app_desc"),
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
          name: "How to Convert PDF to Images",
          description: "Step-by-step guide on converting PDF pages to image files",
        }),
      },
      { property: "og:type", content: "website" },
      { property: "og:site_name", content: "Kleinbyte" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "keywords", content: t("pdf.images.meta.keywords") },
      { name: "author", content: "Kleinbyte" },
    ]
  );
  return meta;
};

export default function PdfToImages() {
  const { t } = useTranslation();
  const [file, setFile] = useState<File | null>(null);
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
      const response = await fetch("http://localhost:8000/pdf-to-images", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ file_key: key }),
      });

      if (!response.ok) {
        const errorData = await response.json() as any;
        throw new Error(errorData.error || "Conversion failed");
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
        <h1 className="text-4xl font-bold tracking-tight bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
          {t("pdfTools.toImages.title")}
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          {t("pdfTools.toImages.description")}
        </p>
      </div>

      <div className="grid gap-8 md:grid-cols-2">
        {/* Upload Section */}
        <div className="space-y-6">
          <div className="bg-card border rounded-xl p-6 shadow-sm">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <Upload className="w-5 h-5 text-blue-500" />
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
                      ? "border-blue-500 bg-blue-50/50 dark:bg-blue-950/20" 
                      : "border-muted-foreground/25 hover:border-blue-500 hover:bg-muted/50"
                    }
                  `}
                >
                  <div className="flex flex-col items-center justify-center pt-5 pb-6 text-center px-4">
                    {file ? (
                      <>
                        <FileText className="w-10 h-10 text-blue-500 mb-3" />
                        <p className="text-sm font-medium text-foreground truncate max-w-full">
                          {file.name}
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                          {(file.size / (1024 * 1024)).toFixed(2)} MB
                        </p>
                      </>
                    ) : (
                      <>
                        <Upload className="w-10 h-10 text-muted-foreground mb-3 group-hover:text-blue-500 transition-colors" />
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

              <button
                type="submit"
                disabled={!file || status === "uploading" || status === "processing"}
                className={`
                  w-full py-2.5 px-4 rounded-lg font-medium flex items-center justify-center gap-2
                  transition-all duration-200
                  ${!file || status === "uploading" || status === "processing"
                    ? "bg-muted text-muted-foreground cursor-not-allowed"
                    : "bg-blue-600 hover:bg-blue-700 text-white shadow-md hover:shadow-lg"
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
                    Converting...
                  </>
                ) : (
                  "Convert to Images"
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
                  <ImageIcon className="w-12 h-12 mx-auto mb-3 opacity-20" />
                  <p>Upload a PDF to start conversion</p>
                </div>
              )}

              {(status === "uploading" || status === "processing") && (
                <div className="space-y-4 w-full max-w-xs">
                  <Loader2 className="w-12 h-12 mx-auto text-blue-500 animate-spin" />
                  <div>
                    <p className="font-medium text-foreground">
                      {status === "uploading" ? "Uploading PDF..." : "Converting to images..."}
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
                  <p className="font-medium">Conversion Failed</p>
                  <p className="text-sm opacity-90">{error}</p>
                </div>
              )}

              {status === "success" && downloadUrl && (
                <div className="space-y-6 w-full">
                  <div className="text-green-600 dark:text-green-500">
                    <CheckCircle className="w-16 h-16 mx-auto mb-3" />
                    <p className="text-lg font-semibold">Conversion Complete!</p>
                  </div>
                  
                  <a
                    href={downloadUrl}
                    download
                    className="inline-flex items-center justify-center gap-2 w-full py-3 px-4 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium shadow-md transition-all hover:scale-[1.02]"
                  >
                    <Download className="w-5 h-5" />
                    Download Images (ZIP)
                  </a>
                  
                  <button 
                    onClick={() => {
                      setFile(null);
                      setStatus("idle");
                      setDownloadUrl(null);
                    }}
                    className="text-sm text-muted-foreground hover:text-foreground underline"
                  >
                    Convert another PDF
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
          Why Convert PDF to Images?
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 bg-white dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-slate-700">
            <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/50 rounded-lg flex items-center justify-center mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600 dark:text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Easy Sharing</h3>
            <p className="text-gray-600 dark:text-gray-300">Images are universally viewable. Share on social media, presentations, or anywhere.</p>
          </div>
          <div className="p-6 bg-white dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-slate-700">
            <div className="w-12 h-12 bg-green-100 dark:bg-green-900/50 rounded-lg flex items-center justify-center mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-600 dark:text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">High Quality</h3>
            <p className="text-gray-600 dark:text-gray-300">Convert with crisp, high-resolution output perfect for printing or web use.</p>
          </div>
          <div className="p-6 bg-white dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-slate-700">
            <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/50 rounded-lg flex items-center justify-center mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-purple-600 dark:text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Batch Download</h3>
            <p className="text-gray-600 dark:text-gray-300">All pages converted at once and delivered as a convenient ZIP file.</p>
          </div>
        </div>
      </section>

      {/* SEO Content: How It Works */}
      <section className="w-full max-w-4xl mx-auto mt-16 px-6">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8 text-center">
          How to Convert PDF to Images
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center p-6">
            <div className="w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">1</div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Upload PDF</h3>
            <p className="text-gray-600 dark:text-gray-400">Select the PDF file you want to convert to images.</p>
          </div>
          <div className="text-center p-6">
            <div className="w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">2</div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Convert</h3>
            <p className="text-gray-600 dark:text-gray-400">Our tool converts each page to a high-quality image.</p>
          </div>
          <div className="text-center p-6">
            <div className="w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">3</div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Download ZIP</h3>
            <p className="text-gray-600 dark:text-gray-400">Get all images in a ZIP file, ready to use.</p>
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
            <summary className="font-semibold text-gray-900 dark:text-white cursor-pointer">{t("pdf.images.faq.q1")}</summary>
            <p className="mt-3 text-gray-600 dark:text-gray-400">{t("pdf.images.faq.a1")}</p>
          </details>
          <details className="p-4 bg-white dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-slate-700">
            <summary className="font-semibold text-gray-900 dark:text-white cursor-pointer">{t("pdf.images.faq.q2")}</summary>
            <p className="mt-3 text-gray-600 dark:text-gray-400">{t("pdf.images.faq.a2")}</p>
          </details>
          <details className="p-4 bg-white dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-slate-700">
            <summary className="font-semibold text-gray-900 dark:text-white cursor-pointer">{t("pdf.images.faq.q3")}</summary>
            <p className="mt-3 text-gray-600 dark:text-gray-400">{t("pdf.images.faq.a3")}</p>
          </details>
          <details className="p-4 bg-white dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-slate-700">
            <summary className="font-semibold text-gray-900 dark:text-white cursor-pointer">{t("pdf.images.faq.q4")}</summary>
            <p className="mt-3 text-gray-600 dark:text-gray-400">{t("pdf.images.faq.a4")}</p>
          </details>
          <details className="p-4 bg-white dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-slate-700">
            <summary className="font-semibold text-gray-900 dark:text-white cursor-pointer">{t("pdf.images.faq.q5")}</summary>
            <p className="mt-3 text-gray-600 dark:text-gray-400">{t("pdf.images.faq.a5")}</p>
          </details>
        </div>
      </section>
    </div>
  );
}
