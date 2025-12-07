import { useState } from "react";
import { Form, useNavigation } from "react-router";

import { Upload, FileVideo, Download, AlertCircle, CheckCircle, Loader2 } from "lucide-react";
import { uploadToR2, getDownloadUrl } from "~/utils/r2-upload";
import type { Route } from "./+types/video-compressor";
import { useTranslation } from "~/i18n/context";

import { translations, type Locale } from "~/i18n/context";

export function meta({ location }: Route.MetaArgs) {
  const locale: Locale = (location.pathname.split("/")?.[1] as Locale) || "en";
  const messages = translations[locale] ?? translations.en;
  const t = (key: string) => messages[key] ?? key;

  return [
    { title: t("video.meta.title") },
    { name: "description", content: t("video.meta.description") },
    { name: "keywords", content: t("video.meta.keywords") },
  ];
}

export default function VideoCompressor() {
  const { t } = useTranslation();
  const navigation = useNavigation();
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
      const fileKey = await uploadToR2(file);
      
      setStatus("processing");

      // 2. Send key to backend
      const response = await fetch("http://localhost:8000/compress-video", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ file_key: fileKey }),
      });

      if (!response.ok) {
        const errorData = await response.json() as any;
        throw new Error(errorData.error || "Compression failed");
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
        <h1 className="text-4xl font-bold tracking-tight bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
          {t("videoTools.compressor.title")}
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          {t("videoTools.compressor.description")}
        </p>
      </div>

      <div className="grid gap-8 md:grid-cols-2">
        {/* Upload Section */}
        <div className="space-y-6">
          <div className="bg-card border rounded-xl p-6 shadow-sm">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <Upload className="w-5 h-5 text-blue-500" />
              Upload Video
            </h2>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="relative group">
                <input
                  type="file"
                  accept="video/*"
                  onChange={handleFileChange}
                  className="hidden"
                  id="video-upload"
                />
                <label
                  htmlFor="video-upload"
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
                        <FileVideo className="w-10 h-10 text-blue-500 mb-3" />
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
                          MP4, MOV, AVI, MKV (Max 500MB)
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
                    Compressing...
                  </>
                ) : (
                  "Compress Video"
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
                  <FileVideo className="w-12 h-12 mx-auto mb-3 opacity-20" />
                  <p>Upload a video to start compression</p>
                </div>
              )}

              {(status === "uploading" || status === "processing") && (
                <div className="space-y-4 w-full max-w-xs">
                  <Loader2 className="w-12 h-12 mx-auto text-blue-500 animate-spin" />
                  <div>
                    <p className="font-medium text-foreground">
                      {status === "uploading" ? "Uploading to secure storage..." : "Compressing video..."}
                    </p>
                    <p className="text-sm text-muted-foreground mt-1">
                      This may take a few minutes depending on file size.
                    </p>
                  </div>
                </div>
              )}

              {status === "error" && (
                <div className="text-destructive space-y-3">
                  <AlertCircle className="w-12 h-12 mx-auto" />
                  <p className="font-medium">Compression Failed</p>
                  <p className="text-sm opacity-90">{error}</p>
                </div>
              )}

              {status === "success" && downloadUrl && (
                <div className="space-y-6 w-full">
                  <div className="text-green-600 dark:text-green-500">
                    <CheckCircle className="w-16 h-16 mx-auto mb-3" />
                    <p className="text-lg font-semibold">Compression Complete!</p>
                  </div>
                  
                  <a
                    href={downloadUrl}
                    download
                    className="inline-flex items-center justify-center gap-2 w-full py-3 px-4 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium shadow-md transition-all hover:scale-[1.02]"
                  >
                    <Download className="w-5 h-5" />
                    Download Compressed Video
                  </a>
                  
                  <button 
                    onClick={() => {
                      setFile(null);
                      setStatus("idle");
                      setDownloadUrl(null);
                    }}
                    className="text-sm text-muted-foreground hover:text-foreground underline"
                  >
                    Compress another video
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
          Why Compress Videos?
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 bg-white dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-slate-700">
            <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/50 rounded-lg flex items-center justify-center mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600 dark:text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Easy Sharing</h3>
            <p className="text-gray-600 dark:text-gray-300">Smaller files upload faster to social media and email.</p>
          </div>
          <div className="p-6 bg-white dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-slate-700">
            <div className="w-12 h-12 bg-green-100 dark:bg-green-900/50 rounded-lg flex items-center justify-center mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-600 dark:text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Save Storage</h3>
            <p className="text-gray-600 dark:text-gray-300">Reduce video file sizes by up to 80% without visible quality loss.</p>
          </div>
          <div className="p-6 bg-white dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-slate-700">
            <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/50 rounded-lg flex items-center justify-center mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-purple-600 dark:text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Faster Streaming</h3>
            <p className="text-gray-600 dark:text-gray-300">Compressed videos stream smoother with less buffering.</p>
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
            <summary className="font-semibold text-gray-900 dark:text-white cursor-pointer">{t("video.faq.q1")}</summary>
            <p className="mt-3 text-gray-600 dark:text-gray-400">{t("video.faq.a1")}</p>
          </details>
          <details className="p-4 bg-white dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-slate-700">
            <summary className="font-semibold text-gray-900 dark:text-white cursor-pointer">{t("video.faq.q2")}</summary>
            <p className="mt-3 text-gray-600 dark:text-gray-400">{t("video.faq.a2")}</p>
          </details>
          <details className="p-4 bg-white dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-slate-700">
            <summary className="font-semibold text-gray-900 dark:text-white cursor-pointer">{t("video.faq.q3")}</summary>
            <p className="mt-3 text-gray-600 dark:text-gray-400">{t("video.faq.a3")}</p>
          </details>
          <details className="p-4 bg-white dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-slate-700">
            <summary className="font-semibold text-gray-900 dark:text-white cursor-pointer">{t("video.faq.q4")}</summary>
            <p className="mt-3 text-gray-600 dark:text-gray-400">{t("video.faq.a4")}</p>
          </details>
          <details className="p-4 bg-white dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-slate-700">
            <summary className="font-semibold text-gray-900 dark:text-white cursor-pointer">{t("video.faq.q5")}</summary>
            <p className="mt-3 text-gray-600 dark:text-gray-400">{t("video.faq.a5")}</p>
          </details>
        </div>
      </section>
    </div>
  );
}
