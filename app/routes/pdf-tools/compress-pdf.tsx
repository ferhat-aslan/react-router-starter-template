import { useState, useEffect } from "react";
import { Upload, FileText, Download, AlertCircle, CheckCircle, Loader2, Zap, Shield, Sparkles, Trash2, Settings } from "lucide-react";
import Layout from "~/components/layout";
import Free from "~/components/free";
import { useTranslation, type Locale, translations } from "~/utils/route-utils";
import { generateMeta } from "@forge42/seo-tools/remix/metadata";
import { webApp } from "@forge42/seo-tools/structured-data/web-app";
import { course } from "@forge42/seo-tools/structured-data/course";
import { type MetaFunction } from "react-router";

export const meta: MetaFunction = ({ location }) => {
  const locale: Locale = (location.pathname.split("/")?.[1] as Locale) || "en";
  const messages = translations[locale] ?? translations.en;
  const t = (key: string) => messages[key] ?? key;

  return generateMeta(
    {
      title: t("pdf.compress.meta.title"),
      description: t("pdf.compress.meta.description"),
      url: `https://kleinbyte.com${location.pathname}`,
      image: "https://kleinbyte.com/og-image-compress-pdf.png",
    },
    [
      {
        "script:ld+json": webApp({
          "@type": "SoftwareApplication",
          name: t("pdf.compress.meta.name"),
          url: `https://kleinbyte.com${location.pathname}`,
          description: t("pdf.compress.meta.app_desc"),
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
          name: "How to Compress PDF Online",
          description: "Step-by-step guide on reducing PDF file size while maintaining quality",
        }),
      },
      { property: "og:type", content: "website" },
      { property: "og:site_name", content: "Kleinbyte" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "keywords", content: t("pdf.compress.meta.keywords") },
      { name: "author", content: "Kleinbyte" },
    ]
  );
};

export default function CompressPdf() {
  const { t } = useTranslation();
  const [file, setFile] = useState<File | null>(null);
  const [status, setStatus] = useState<"idle" | "compressing" | "success" | "error">("idle");
  const [progress, setProgress] = useState(0);
  const [currentStep, setCurrentStep] = useState(0);
  const [totalSteps, setTotalSteps] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [compressionLevel, setCompressionLevel] = useState<"low" | "medium" | "high">("medium");
  const [imageQuality, setImageQuality] = useState(70);
  const [results, setResults] = useState<{ originalSize: number; compressedSize: number } | null>(null);
  const [compressedBlob, setCompressedBlob] = useState<Blob | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      if (selectedFile.type !== "application/pdf") {
        setError(t("pdf.compress.error.invalid_type"));
        return;
      }
      setFile(selectedFile);
      resetState();
    }
  };

  const resetState = () => {
    setStatus("idle");
    setProgress(0);
    setError(null);
    setResults(null);
    setCompressedBlob(null);
  };

  const handleCompress = async () => {
    if (!file) return;

    setStatus("compressing");
    setProgress(0);
    setError(null);

    const scaleMap = { low: 1.5, medium: 1.2, high: 0.9 };
    const scale = scaleMap[compressionLevel];
    const quality = imageQuality / 100;

    try {
      // Dynamic imports for workers and libraries
      const pdfjs = await import("pdfjs-dist");
      pdfjs.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

      const { jsPDF } = await import("jspdf");

      const arrayBuffer = await file.arrayBuffer();
      const pdf = await pdfjs.getDocument({ data: arrayBuffer }).promise;
      const numPages = pdf.numPages;
      setTotalSteps(numPages);

      const firstPage = await pdf.getPage(1);
      const viewport = firstPage.getViewport({ scale: 1 });
      const isLandscape = viewport.width > viewport.height;

      const newPdf = new jsPDF({
        orientation: isLandscape ? "landscape" : "portrait",
        unit: "pt",
        format: [viewport.width, viewport.height]
      });

      for (let i = 1; i <= numPages; i++) {
        setCurrentStep(i);
        const page = await pdf.getPage(i);
        const pageViewport = page.getViewport({ scale });

        const canvas = document.createElement("canvas");
        const context = canvas.getContext("2d");
        if (!context) throw new Error(t("pdf.compress.error.canvas"));
        
        canvas.width = pageViewport.width;
        canvas.height = pageViewport.height;

        await page.render({ canvasContext: context, viewport: pageViewport, canvas }).promise;
        const imgData = canvas.toDataURL("image/jpeg", quality);

        if (i > 1) {
          const pv = page.getViewport({ scale: 1 });
          newPdf.addPage([pv.width, pv.height], pv.width > pv.height ? "landscape" : "portrait");
        }

        const pv = page.getViewport({ scale: 1 });
        newPdf.addImage(imgData, "JPEG", 0, 0, pv.width, pv.height);
        
        setProgress(Math.round((i / numPages) * 100));
      }

      const blob = newPdf.output("blob");
      setCompressedBlob(blob);
      setResults({
        originalSize: file.size,
        compressedSize: blob.size,
      });
      setStatus("success");
    } catch (err: any) {
      console.error(err);
      setError(err.message || t("pdf.compress.error.generic"));
      setStatus("error");
    }
  };

  const handleDownload = () => {
    if (!compressedBlob || !file) return;
    const url = URL.createObjectURL(compressedBlob);
    const a = document.createElement("a");
    a.href = url;
    a.download = file.name.replace(".pdf", "-compressed.pdf");
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const formatSize = (bytes: number) => {
    return (bytes / (1024 * 1024)).toFixed(2) + " MB";
  };

  const savedPercent = results
    ? Math.max(0, Math.round((1 - results.compressedSize / results.originalSize) * 100))
    : 0;

  return (
    <Layout>
      <div className="max-w-4xl mx-auto px-4 py-12 space-y-12">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="inline-flex items-center justify-center p-3 bg-indigo-100 dark:bg-indigo-900/30 rounded-2xl mb-2">
            <Sparkles className="w-8 h-8 text-indigo-600 dark:text-indigo-400" />
          </div>
          <h1 className="text-4xl font-extrabold tracking-tight bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent sm:text-5xl">
            {t("pdf.compress.title")}
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            {t("pdf.compress.description")}
          </p>
        </div>

        {/* Main Tool Area */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-xl overflow-hidden">
          <div className="p-8 space-y-8">
            {/* Upload Zone */}
            {!file ? (
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
                  className="flex flex-col items-center justify-center w-full h-64 border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-2xl cursor-pointer bg-slate-50 dark:bg-slate-800/50 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all group-hover:border-indigo-500"
                >
                  <Upload className="w-12 h-12 text-slate-400 group-hover:text-indigo-500 mb-4 transition-colors" />
                  <p className="text-lg font-medium text-slate-700 dark:text-slate-300">
                    {t("pdf.compress.dropzone")}
                  </p>
                  <p className="text-sm text-slate-500 mt-2">
                    {t("pdf.compress.max_size")}
                  </p>
                </label>
              </div>
            ) : (
              <div className="space-y-6">
                {/* Selected File Card */}
                <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-700">
                  <div className="flex items-center gap-4 min-width-0">
                    <div className="p-2 bg-indigo-100 dark:bg-indigo-900/30 rounded-lg">
                      <FileText className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
                    </div>
                    <div className="truncate">
                      <p className="font-semibold text-slate-900 dark:text-white truncate">
                        {file.name}
                      </p>
                      <p className="text-sm text-slate-500">
                        {formatSize(file.size)}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => { setFile(null); resetState(); }}
                    className="p-2 hover:bg-red-100 dark:hover:bg-red-900/30 text-slate-400 hover:text-red-600 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>

                {status === "idle" && (
                  <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
                    {/* Options */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6 bg-slate-50 dark:bg-slate-800/30 rounded-2xl">
                      <div className="space-y-3">
                        <label className="text-sm font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider flex items-center gap-2">
                          <Settings className="w-4 h-4" />
                          {t("pdf.compress.options.level")}
                        </label>
                        <select
                          value={compressionLevel}
                          onChange={(e) => setCompressionLevel(e.target.value as any)}
                          className="w-full h-12 px-4 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
                        >
                          <option value="low">{t("pdf.compress.options.low")}</option>
                          <option value="medium">{t("pdf.compress.options.medium")}</option>
                          <option value="high">{t("pdf.compress.options.high")}</option>
                        </select>
                      </div>
                      <div className="space-y-3">
                        <label className="text-sm font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider flex justify-between">
                          <span>{t("pdf.compress.options.quality")}</span>
                          <span className="text-indigo-600 dark:text-indigo-400">{imageQuality}%</span>
                        </label>
                        <input
                          type="range"
                          min="30"
                          max="100"
                          value={imageQuality}
                          onChange={(e) => setImageQuality(parseInt(e.target.value))}
                          className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                        />
                      </div>
                    </div>

                    <button
                      onClick={handleCompress}
                      className="w-full h-14 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl font-bold text-lg shadow-lg shadow-indigo-500/25 transition-all hover:scale-[1.01] active:scale-[0.99] flex items-center justify-center gap-3"
                    >
                      <Zap className="w-6 h-6" />
                      {t("pdf.compress.btn")}
                    </button>
                  </div>
                )}

                {/* Progress */}
                {status === "compressing" && (
                  <div className="space-y-6 py-8">
                    <div className="flex flex-col items-center gap-4">
                      <Loader2 className="w-12 h-12 text-indigo-600 animate-spin" />
                      <div className="text-center">
                        <p className="text-lg font-semibold">
                          {t("pdf.compress.progress").replace("{current}", currentStep.toString()).replace("{total}", totalSteps.toString())}
                        </p>
                        <p className="text-sm text-slate-500 mt-1">{t("pdf.compress.status.keep_open")}</p>
                      </div>
                    </div>
                    <div className="w-full h-3 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden border border-slate-200 dark:border-slate-700">
                      <div
                        className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 transition-all duration-300"
                        style={{ width: `${progress}%` }}
                      ></div>
                    </div>
                  </div>
                )}

                {/* Success State */}
                {status === "success" && results && (
                  <div className="animate-in zoom-in-95 duration-500 space-y-8">
                    <div className="text-center space-y-2">
                       <div className="inline-flex p-3 bg-green-100 dark:bg-green-900/30 rounded-full mb-2">
                          <CheckCircle className="w-8 h-8 text-green-600 dark:text-green-400" />
                       </div>
                       <h3 className="text-2xl font-bold">{t("pdf.compress.success")}</h3>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                      <div className="p-6 bg-slate-50 dark:bg-slate-800/50 rounded-2xl text-center border border-slate-200 dark:border-slate-700">
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">{t("pdf.compress.stats.original")}</p>
                        <p className="text-2xl font-bold">{formatSize(results.originalSize)}</p>
                      </div>
                      <div className="p-6 bg-indigo-50 dark:bg-indigo-900/20 rounded-2xl text-center border border-indigo-100 dark:border-indigo-900/50">
                        <p className="text-xs font-bold text-indigo-400 uppercase tracking-widest mb-1">{t("pdf.compress.stats.compressed")}</p>
                        <p className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">{formatSize(results.compressedSize)}</p>
                      </div>
                      <div className="p-6 bg-green-50 dark:bg-green-900/20 rounded-2xl text-center border border-green-100 dark:border-green-900/50">
                        <p className="text-xs font-bold text-green-400 uppercase tracking-widest mb-1">{t("pdf.compress.stats.saved")}</p>
                        <p className="text-2xl font-bold text-green-600 dark:text-green-400">{savedPercent}%</p>
                      </div>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-4">
                      <button
                        onClick={handleDownload}
                        className="flex-1 h-14 bg-green-600 hover:bg-green-700 text-white rounded-2xl font-bold text-lg shadow-lg shadow-green-500/25 transition-all hover:scale-[1.01] active:scale-[0.99] flex items-center justify-center gap-3"
                      >
                        <Download className="w-6 h-6" />
                        {t("pdf.compress.download")}
                      </button>
                      <button
                        onClick={() => { setFile(null); resetState(); }}
                        className="h-14 px-8 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-2xl font-semibold transition-all"
                      >
                        {t("pdf.compress.btn.compress_another")}
                      </button>
                    </div>
                  </div>
                )}

                {/* Error State */}
                {status === "error" && (
                  <div className="p-6 bg-red-50 dark:bg-red-900/20 rounded-2xl border border-red-100 dark:border-red-900/50 text-center space-y-4">
                    <AlertCircle className="w-12 h-12 text-red-500 mx-auto" />
                    <div>
                      <p className="font-bold text-red-600 dark:text-red-400">{t("pdf.compress.status.failed")}</p>
                      <p className="text-sm text-red-500 mt-1">{error}</p>
                    </div>
                    <button
                      onClick={resetState}
                      className="px-6 py-2 bg-red-600 text-white rounded-xl font-medium hover:bg-red-700"
                    >
                      {t("pdf.compress.btn.try_again")}
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        <Free />

        {/* Benefits Section */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-8 py-12">
          <div className="p-8 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-shadow">
            <div className="w-14 h-14 bg-blue-100 dark:bg-blue-900/30 rounded-2xl flex items-center justify-center mb-6">
              <Shield className="w-7 h-7 text-blue-600 dark:text-blue-400" />
            </div>
            <h3 className="text-xl font-bold mb-3">{t("pdf.compress.benefits.private.title")}</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
              {t("pdf.compress.benefits.private.desc")}
            </p>
          </div>
          <div className="p-8 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-shadow">
            <div className="w-14 h-14 bg-purple-100 dark:bg-purple-900/30 rounded-2xl flex items-center justify-center mb-6">
              <Zap className="w-7 h-7 text-purple-600 dark:text-purple-400" />
            </div>
            <h3 className="text-xl font-bold mb-3">{t("pdf.compress.benefits.fast.title")}</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
              {t("pdf.compress.benefits.fast.desc")}
            </p>
          </div>
          <div className="p-8 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-shadow">
            <div className="w-14 h-14 bg-emerald-100 dark:bg-emerald-900/30 rounded-2xl flex items-center justify-center mb-6">
              <Sparkles className="w-7 h-7 text-emerald-600 dark:text-emerald-400" />
            </div>
            <h3 className="text-xl font-bold mb-3">{t("pdf.compress.benefits.quality.title")}</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
              {t("pdf.compress.benefits.quality.desc")}
            </p>
          </div>
        </section>

        {/* How It Works */}
        <section className="space-y-12 py-12 border-t border-slate-200 dark:border-slate-800">
          <h2 className="text-3xl font-bold text-center">{t("pdf.compress.how_to.title")}</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
            <div className="space-y-4">
              <div className="w-12 h-12 bg-indigo-600 text-white rounded-full flex items-center justify-center mx-auto text-xl font-black">1</div>
              <h3 className="text-lg font-bold">{t("pdf.compress.how_to.step1.title")}</h3>
              <p className="text-slate-600 dark:text-slate-400">{t("pdf.compress.how_to.step1.desc")}</p>
            </div>
            <div className="space-y-4">
              <div className="w-12 h-12 bg-indigo-600 text-white rounded-full flex items-center justify-center mx-auto text-xl font-black">2</div>
              <h3 className="text-lg font-bold">{t("pdf.compress.how_to.step2.title")}</h3>
              <p className="text-slate-600 dark:text-slate-400">{t("pdf.compress.how_to.step2.desc")}</p>
            </div>
            <div className="space-y-4">
              <div className="w-12 h-12 bg-indigo-600 text-white rounded-full flex items-center justify-center mx-auto text-xl font-black">3</div>
              <h3 className="text-lg font-bold">{t("pdf.compress.how_to.step3.title")}</h3>
              <p className="text-slate-600 dark:text-slate-400">{t("pdf.compress.how_to.step3.desc")}</p>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="max-w-3xl mx-auto py-12 border-t border-slate-200 dark:border-slate-800">
          <h2 className="text-3xl font-bold text-center mb-12">{t("faq.title")}</h2>
          <div className="space-y-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <details key={i} className="group p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl outline-none transition-all hover:border-indigo-500/50">
                <summary className="font-bold text-lg text-slate-900 dark:text-white cursor-pointer list-none flex justify-between items-center">
                  {t(`pdf.compress.faq.q${i}`)}
                  <span className="text-slate-400 group-open:rotate-180 transition-transform">↓</span>
                </summary>
                <p className="mt-4 text-slate-600 dark:text-slate-400 leading-relaxed">
                  {t(`pdf.compress.faq.a${i}`)}
                </p>
              </details>
            ))}
          </div>
        </section>
      </div>
    </Layout>
  );
}
