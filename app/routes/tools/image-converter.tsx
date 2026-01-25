import { useState } from "react";
import { Upload, Image as ImageIcon, Download, AlertCircle, CheckCircle, Loader2, RefreshCw } from "lucide-react";
import { uploadToR2, getDownloadUrl } from "~/utils/r2-upload";
import type { Route } from "./+types/image-converter";
import { useTranslation } from "~/utils/route-utils";

import { translations, type Locale } from "~/utils/route-utils";

import { generateMeta } from "@forge42/seo-tools/remix/metadata";
import { webApp } from "@forge42/seo-tools/structured-data/web-app";

export function meta({ location }: Route.MetaArgs) {
  const locale: Locale = (location.pathname.split("/")?.[1] as Locale) || "en";
  const messages = translations[locale] ?? translations.en;
  const t = (key: string) => messages[key] ?? key;

  return generateMeta(
    {
      title: t("image.converter.meta.title"),
      description: t("image.converter.meta.description"),
      url: `https://kleinbyte.com${location.pathname}`,
      image: "https://kleinbyte.com/og-image-image-converter.png",
    },
    [
      {
        "script:ld+json": webApp({
          "@type": "SoftwareApplication",
          name: t("tools.images.converter.name"),
          url: `https://kleinbyte.com${location.pathname}`,
          description: t("tools.images.converter.description"),
          applicationCategory: "MultimediaApplication",
          operatingSystem: "Any",
          offers: {
            "@type": "Offer",
            price: "0",
            priceCurrency: "USD",
          },
        }),
      },
      { name: "keywords", content: t("image.converter.meta.keywords") },
      { name: "author", content: "Kleinbyte" },
    ]
  );
}

export default function ImageConverter() {
  const { t } = useTranslation();
  const [file, setFile] = useState<File | null>(null);
  const [format, setFormat] = useState<string>("png");
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
      const response = await fetch("http://localhost:8000/convert-image", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ 
          file_key: key,
          format: format 
        }),
      });

      if (!response.ok) {
        const errorData = await response.json() as any;
        throw new Error(errorData.error || "Conversion failed");
      }

      const data:any = await response.json();
      
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
        <h1 className="text-4xl font-bold tracking-tight bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
          {t("imageTools.converter.title")}
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          {t("imageTools.converter.description")}
        </p>
      </div>

      <div className="grid gap-8 md:grid-cols-2">
        {/* Upload Section */}
        <div className="space-y-6">
          <div className="bg-card border rounded-xl p-6 shadow-sm">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <Upload className="w-5 h-5 text-purple-500" />
              Upload Image
            </h2>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="relative group">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                  id="image-upload"
                />
                <label
                  htmlFor="image-upload"
                  className={`
                    flex flex-col items-center justify-center w-full h-48 
                    border-2 border-dashed rounded-lg cursor-pointer 
                    transition-all duration-200
                    ${file 
                      ? "border-purple-500 bg-purple-50/50 dark:bg-purple-950/20" 
                      : "border-muted-foreground/25 hover:border-purple-500 hover:bg-muted/50"
                    }
                  `}
                >
                  <div className="flex flex-col items-center justify-center pt-5 pb-6 text-center px-4">
                    {file ? (
                      <>
                        <ImageIcon className="w-10 h-10 text-purple-500 mb-3" />
                        <p className="text-sm font-medium text-foreground truncate max-w-full">
                          {file.name}
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                          {(file.size / (1024 * 1024)).toFixed(2)} MB
                        </p>
                      </>
                    ) : (
                      <>
                        <Upload className="w-10 h-10 text-muted-foreground mb-3 group-hover:text-purple-500 transition-colors" />
                        <p className="text-sm text-foreground font-medium">
                          Click to upload or drag and drop
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                          JPG, PNG, WEBP, GIF
                        </p>
                      </>
                    )}
                  </div>
                </label>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Convert to:</label>
                <select
                  value={format}
                  onChange={(e) => setFormat(e.target.value)}
                  className="w-full p-2.5 rounded-lg border bg-background"
                >
                  <option value="png">PNG</option>
                  <option value="jpg">JPG</option>
                  <option value="webp">WEBP</option>
                  <option value="gif">GIF</option>
                </select>
              </div>

              <button
                type="submit"
                disabled={!file || status === "uploading" || status === "processing"}
                className={`
                  w-full py-2.5 px-4 rounded-lg font-medium flex items-center justify-center gap-2
                  transition-all duration-200
                  ${!file || status === "uploading" || status === "processing"
                    ? "bg-muted text-muted-foreground cursor-not-allowed"
                    : "bg-purple-600 hover:bg-purple-700 text-white shadow-md hover:shadow-lg"
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
                  "Convert Image"
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
                  <RefreshCw className="w-12 h-12 mx-auto mb-3 opacity-20" />
                  <p>Upload an image to start conversion</p>
                </div>
              )}

              {(status === "uploading" || status === "processing") && (
                <div className="space-y-4 w-full max-w-xs">
                  <Loader2 className="w-12 h-12 mx-auto text-purple-500 animate-spin" />
                  <div>
                    <p className="font-medium text-foreground">
                      {status === "uploading" ? "Uploading image..." : "Converting format..."}
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
                    Download Image
                  </a>
                  
                  <button 
                    onClick={() => {
                      setFile(null);
                      setStatus("idle");
                      setDownloadUrl(null);
                    }}
                    className="text-sm text-muted-foreground hover:text-foreground underline"
                  >
                    Convert another image
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
          Why Convert Image Formats?
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 bg-white dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-slate-700">
            <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/50 rounded-lg flex items-center justify-center mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-purple-600 dark:text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Web Optimization</h3>
            <p className="text-gray-600 dark:text-gray-300">Convert to WebP for smaller file sizes and faster page loads.</p>
          </div>
          <div className="p-6 bg-white dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-slate-700">
            <div className="w-12 h-12 bg-green-100 dark:bg-green-900/50 rounded-lg flex items-center justify-center mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-600 dark:text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Transparency Support</h3>
            <p className="text-gray-600 dark:text-gray-300">Convert to PNG to preserve transparent backgrounds.</p>
          </div>
          <div className="p-6 bg-white dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-slate-700">
            <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/50 rounded-lg flex items-center justify-center mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600 dark:text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Universal Compatibility</h3>
            <p className="text-gray-600 dark:text-gray-300">Convert to JPG for maximum compatibility everywhere.</p>
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
            <summary className="font-semibold text-gray-900 dark:text-white cursor-pointer">{t("image.converter.faq.q1")}</summary>
            <p className="mt-3 text-gray-600 dark:text-gray-400">{t("image.converter.faq.a1")}</p>
          </details>
          <details className="p-4 bg-white dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-slate-700">
            <summary className="font-semibold text-gray-900 dark:text-white cursor-pointer">{t("image.converter.faq.q2")}</summary>
            <p className="mt-3 text-gray-600 dark:text-gray-400">{t("image.converter.faq.a2")}</p>
          </details>
          <details className="p-4 bg-white dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-slate-700">
            <summary className="font-semibold text-gray-900 dark:text-white cursor-pointer">{t("image.converter.faq.q3")}</summary>
            <p className="mt-3 text-gray-600 dark:text-gray-400">{t("image.converter.faq.a3")}</p>
          </details>
          <details className="p-4 bg-white dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-slate-700">
            <summary className="font-semibold text-gray-900 dark:text-white cursor-pointer">{t("image.converter.faq.q4")}</summary>
            <p className="mt-3 text-gray-600 dark:text-gray-400">{t("image.converter.faq.a4")}</p>
          </details>
          <details className="p-4 bg-white dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-slate-700">
            <summary className="font-semibold text-gray-900 dark:text-white cursor-pointer">{t("image.converter.faq.q5")}</summary>
            <p className="mt-3 text-gray-600 dark:text-gray-400">{t("image.converter.faq.a5")}</p>
          </details>
        </div>
      </section>
    </div>
  );
}
