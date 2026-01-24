import { useState, useEffect, useRef } from "react";
import { Upload, FileText, Download, AlertCircle, CheckCircle, Loader2, RefreshCw, ArrowRight, Trash2, Shield, Zap, Sparkles, Image as ImageIcon } from "lucide-react";
import Layout from "~/components/layout";
import Free from "~/components/free";
import { useTranslation, type Locale, translations } from "~/utils/route-utils";
import { generateMeta } from "@forge42/seo-tools/remix/metadata";
import { webApp } from "@forge42/seo-tools/structured-data/web-app";
import { course } from "@forge42/seo-tools/structured-data/course";
import { type MetaFunction } from "react-router";

// Supported conversions mapping
const CONVERSIONS: Record<string, string[]> = {
  "image/png": ["jpg", "pdf", "webp"],
  "image/jpeg": ["png", "pdf", "webp"],
  "image/webp": ["png", "jpg", "pdf"],
  "image/gif": ["png", "jpg"],
  "image/bmp": ["png", "jpg", "pdf"],
  "image/svg+xml": ["png", "jpg"],
  "application/pdf": ["jpg", "png"]
};

const MIME_TYPES: Record<string, string> = {
  "jpg": "image/jpeg",
  "png": "image/png",
  "webp": "image/webp",
  "pdf": "application/pdf"
};

interface FileState {
  file: File;
  status: "pending" | "processing" | "done" | "error";
  result: { blob: Blob; name: string }[] | null;
}

export const meta: MetaFunction = ({ location }) => {
  const locale: Locale = (location.pathname.split("/")?.[1] as Locale) || "en";
  const messages = translations[locale] ?? translations.en;
  const t = (key: string) => messages[key] ?? key;

  return generateMeta(
    {
      title: t("file.convert.meta.title"),
      description: t("file.convert.meta.description"),
      url: `https://kleinbyte.com${location.pathname}`,
      image: "https://kleinbyte.com/og-image-file-converter.png",
    },
    [
      {
        "script:ld+json": webApp({
          "@type": "SoftwareApplication",
          name: t("file.convert.meta.name"),
          url: `https://kleinbyte.com${location.pathname}`,
          description: t("file.convert.meta.app_desc"),
          applicationCategory: "MultimediaApplication",
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
          name: "How to Convert Files Online",
          description: "Learn how to convert images and PDF documents between formats securely in your browser",
        }),
      },
      { property: "og:type", content: "website" },
      { property: "og:site_name", content: "Kleinbyte" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "keywords", content: t("file.convert.meta.keywords") },
      { name: "author", content: "Kleinbyte" },
    ]
  );
};

export default function FileConverter() {
  const { t } = useTranslation();
  const [files, setFiles] = useState<FileState[]>([]);
  const [sourceType, setSourceType] = useState<string | null>(null);
  const [targetFormat, setTargetFormat] = useState<string>("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFiles = (newFiles: File[]) => {
    const supported = newFiles.filter(f => CONVERSIONS[f.type]);
    if (supported.length === 0) return;

    const firstType = supported[0].type;
    const sameType = supported.filter(f => f.type === firstType);

    if (files.length > 0 && sourceType !== firstType) {
      return;
    }

    setSourceType(firstType);
    setFiles(prev => [...prev, ...sameType.map(f => ({ file: f, status: "pending" as const, result: null }))]);
  };

  const removeFile = (index: number) => {
    setFiles(prev => {
      const next = prev.filter((_, i) => i !== index);
      if (next.length === 0) setSourceType(null);
      return next;
    });
  };

  const convertAll = async () => {
    if (!targetFormat) return;

    // Dynamic imports for libraries
    const pdfjs = await import("pdfjs-dist");
    pdfjs.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;
    const { jsPDF } = await import("jspdf");

    const updatedFiles = [...files];
    for (let i = 0; i < updatedFiles.length; i++) {
        if (updatedFiles[i].status !== "pending") continue;
        
        updatedFiles[i] = { ...updatedFiles[i], status: "processing" };
        setFiles([...updatedFiles]);

        try {
            const result = await processFile(updatedFiles[i].file, targetFormat, pdfjs, jsPDF);
            updatedFiles[i] = { ...updatedFiles[i], status: "done", result };
        } catch (err) {
            console.error(err);
            updatedFiles[i] = { ...updatedFiles[i], status: "error" };
        }
        setFiles([...updatedFiles]);
    }
  };

  const processFile = async (file: File, target: string, pdfjs: any, jsPDF: any): Promise<{ blob: Blob; name: string }[]> => {
    const isPdfSource = file.type === "application/pdf";
    const isPdfTarget = target === "pdf";

    if (isPdfSource) {
      const arrayBuffer = await file.arrayBuffer();
      const pdf = await pdfjs.getDocument({ data: arrayBuffer }).promise;
      const results: { blob: Blob; name: string }[] = [];

      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const viewport = page.getViewport({ scale: 2 });
        const canvas = document.createElement("canvas");
        const context = canvas.getContext("2d");
        if (!context) continue;
        
        canvas.width = viewport.width;
        canvas.height = viewport.height;
        await page.render({ canvasContext: context, viewport }).promise;

        const blob = await new Promise<Blob>((resolve) => 
          canvas.toBlob(b => resolve(b!), MIME_TYPES[target], 0.92)
        );
        results.push({
          blob,
          name: file.name.replace(/\.pdf$/i, "") + (pdf.numPages > 1 ? `-page${i}` : "") + "." + target
        });
      }
      return results;
    } else if (isPdfTarget) {
      const img = await loadImage(file);
      const pdf = new jsPDF({
        orientation: img.width > img.height ? "landscape" : "portrait",
        unit: "pt",
        format: [img.width, img.height]
      });

      const canvas = document.createElement("canvas");
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext("2d");
      if (!ctx) throw new Error("Canvas context failed");
      ctx.drawImage(img, 0, 0);

      pdf.addImage(canvas.toDataURL("image/jpeg", 0.92), "JPEG", 0, 0, img.width, img.height);
      return [{
        blob: pdf.output("blob"),
        name: file.name.replace(/\.[^.]+$/, "") + ".pdf"
      }];
    } else {
      const img = await loadImage(file);
      const canvas = document.createElement("canvas");
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext("2d");
      if (!ctx) throw new Error("Canvas context failed");

      if (target === "jpg") {
        ctx.fillStyle = "#ffffff";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      }
      ctx.drawImage(img, 0, 0);

      const blob = await new Promise<Blob>((resolve) => 
        canvas.toBlob(b => resolve(b!), MIME_TYPES[target], 0.92)
      );
      return [{
        blob,
        name: file.name.replace(/\.[^.]+$/, "") + "." + target
      }];
    }
  };

  const loadImage = (file: File): Promise<HTMLImageElement> => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve(img);
      img.onerror = reject;
      img.src = URL.createObjectURL(file);
    });
  };

  const downloadFile = (index: number) => {
    const results = files[index].result;
    if (!results) return;
    results.forEach(r => {
      const url = URL.createObjectURL(r.blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = r.name;
      a.click();
      URL.revokeObjectURL(url);
    });
  };

  const formatSize = (bytes: number) => {
    if (bytes < 1024) return bytes + " B";
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
    return (bytes / (1024 * 1024)).toFixed(1) + " MB";
  };

  const allDone = files.length > 0 && files.every(f => f.status === "done");
  const hasPending = files.some(f => f.status === "pending");

  return (
    <Layout>
      <div className="max-w-4xl mx-auto px-4 py-12 space-y-12">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="inline-flex items-center justify-center p-3 bg-blue-100 dark:bg-blue-900/30 rounded-2xl mb-2">
            <RefreshCw className="w-8 h-8 text-blue-600 dark:text-blue-400" />
          </div>
          <h1 className="text-4xl font-extrabold tracking-tight bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent sm:text-5xl">
            {t("file.convert.title")}
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            {t("file.convert.description")}
          </p>
        </div>

        {/* Main Area */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-xl overflow-hidden">
          <div className="p-8 space-y-8">
            {!files.length ? (
              <div className="relative group">
                <input
                  type="file"
                  multiple
                  onChange={(e) => e.target.files && handleFiles(Array.from(e.target.files))}
                  className="hidden"
                  id="file-upload"
                  ref={fileInputRef}
                />
                <label
                  htmlFor="file-upload"
                  className="flex flex-col items-center justify-center w-full h-64 border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-2xl cursor-pointer bg-slate-50 dark:bg-slate-800/50 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all group-hover:border-blue-500"
                >
                  <Upload className="w-12 h-12 text-slate-400 group-hover:text-blue-500 mb-4 transition-colors" />
                  <p className="text-lg font-medium text-slate-700 dark:text-slate-300">
                    {t("file.convert.dropzone")}
                  </p>
                  <p className="text-sm text-slate-500 mt-2">
                    {t("file.convert.supported")}
                  </p>
                </label>
              </div>
            ) : (
                <div className="space-y-6">
                    <div className="flex flex-col md:flex-row items-stretch gap-4 p-6 bg-slate-50 dark:bg-slate-800/30 rounded-2xl border border-slate-200 dark:border-slate-700">
                        <div className="flex-1 space-y-2">
                             <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">{t("file.convert.from")}</label>
                             <div className="h-12 flex items-center px-4 bg-white dark:bg-slate-800 rounded-xl font-bold text-blue-600 dark:text-blue-400 border border-slate-200 dark:border-slate-700">
                                {files[0].file.name.split('.').pop()?.toUpperCase()}
                             </div>
                        </div>
                        <div className="flex items-center justify-center pt-6">
                            <ArrowRight className="w-6 h-6 text-slate-300" />
                        </div>
                        <div className="flex-1 space-y-2">
                             <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">{t("file.convert.to")}</label>
                             <select
                                value={targetFormat}
                                onChange={(e) => setTargetFormat(e.target.value)}
                                className="w-full h-12 px-4 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none font-medium appearance-none"
                                style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%2371717a' stroke-width='2'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E")`, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 16px center' }}
                             >
                                <option value="">{t("file.convert.select_format")}</option>
                                {sourceType && CONVERSIONS[sourceType]?.map(ext => (
                                    <option key={ext} value={ext}>{ext.toUpperCase()}</option>
                                ))}
                             </select>
                        </div>
                    </div>

                    <div className="space-y-2 max-h-96 overflow-y-auto pr-2 custom-scrollbar">
                        {files.map((f, i) => (
                            <div key={i} className="flex items-center gap-4 p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl animate-in fade-in slide-in-from-left-2 duration-300" style={{ animationDelay: `${i * 50}ms` }}>
                                <div className="p-2 bg-slate-100 dark:bg-slate-700/50 rounded-lg">
                                    <FileText className="w-5 h-5 text-slate-500" />
                                </div>
                                <div className="flex-1 min-width-0">
                                    <p className="font-medium text-slate-900 dark:text-white truncate">{f.file.name}</p>
                                    <p className="text-xs text-slate-500">{formatSize(f.file.size)}</p>
                                </div>
                                <div className="flex items-center gap-3">
                                    <span className={`text-[10px] font-bold uppercase tracking-widest px-2 py-1 rounded-full ${
                                        f.status === 'done' ? 'bg-green-100 text-green-600 dark:bg-green-900/30' :
                                        f.status === 'processing' ? 'bg-blue-100 text-blue-600 dark:bg-blue-900/30' :
                                        f.status === 'error' ? 'bg-red-100 text-red-600 dark:bg-red-900/30' :
                                        'bg-slate-100 text-slate-500 dark:bg-slate-800'
                                    }`}>
                                        {t(`file.convert.status.${f.status}`)}
                                    </span>
                                    {f.status === 'done' ? (
                                        <button onClick={() => downloadFile(i)} className="p-2 text-green-600 hover:bg-green-50 dark:hover:bg-green-900/20 rounded-lg transition-colors">
                                            <Download className="w-5 h-5" />
                                        </button>
                                    ) : (
                                        <button onClick={() => removeFile(i)} className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors">
                                            <Trash2 className="w-5 h-5" />
                                        </button>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="pt-4 space-y-4">
                        <button
                            onClick={convertAll}
                            disabled={!hasPending || !targetFormat}
                            className="w-full h-14 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-2xl font-bold text-lg shadow-lg shadow-blue-500/25 transition-all flex items-center justify-center gap-3"
                        >
                            <Zap className="w-6 h-6" />
                            {t("file.convert.btn")}
                        </button>

                        {(allDone || (files.length > 0 && !hasPending)) && (
                            <div className="flex gap-4">
                                <button
                                    onClick={() => {
                                        files.forEach((_, i) => downloadFile(i));
                                    }}
                                    className="flex-1 h-12 bg-green-600 hover:bg-green-700 text-white rounded-xl font-bold shadow-md flex items-center justify-center gap-2"
                                >
                                    <Download className="w-5 h-5" />
                                    {t("file.convert.download_all")}
                                </button>
                                <button
                                    onClick={() => { setFiles([]); setSourceType(null); setTargetFormat(""); }}
                                    className="px-6 h-12 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-xl font-bold transition-all"
                                >
                                    {t("file.convert.new_conversion")}
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            )}
          </div>
        </div>

        <Free />

        <section className="grid grid-cols-1 md:grid-cols-3 gap-8 py-12">
          <div className="p-8 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-shadow">
            <div className="w-14 h-14 bg-indigo-100 dark:bg-indigo-900/30 rounded-2xl flex items-center justify-center mb-6">
              <Shield className="w-7 h-7 text-indigo-600 dark:text-indigo-400" />
            </div>
            <h3 className="text-xl font-bold mb-3">Privacy First</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
              No servers involved. All file conversions happen directly in your browser using the latest technologies. Your data is 100% safe.
            </p>
          </div>
          <div className="p-8 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-shadow">
            <div className="w-14 h-14 bg-pink-100 dark:bg-pink-900/30 rounded-2xl flex items-center justify-center mb-6">
              <Zap className="w-7 h-7 text-pink-600 dark:text-pink-400" />
            </div>
            <h3 className="text-xl font-bold mb-3">Batch Processing</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
              Convert multiple files simultaneously. High-performance browser-based processing makes it fast and efficient for any volume.
            </p>
          </div>
          <div className="p-8 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-shadow">
            <div className="w-14 h-14 bg-amber-100 dark:bg-amber-900/30 rounded-2xl flex items-center justify-center mb-6">
              <Sparkles className="w-7 h-7 text-amber-600 dark:text-amber-400" />
            </div>
            <h3 className="text-xl font-bold mb-3">Format Freedom</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
              Convert between all major image formats (PNG, JPG, WEBP, SVG) and PDF documents with ease. One tool for everything.
            </p>
          </div>
        </section>

        <section className="bg-slate-50 dark:bg-slate-800/30 rounded-3xl border border-slate-200 dark:border-slate-800 overflow-hidden">
            <div className="p-8 border-b border-slate-200 dark:border-slate-800">
                <h2 className="text-2xl font-bold">Supported Conversions</h2>
            </div>
            <div className="p-8 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {Object.entries(CONVERSIONS).map(([type, targets]) => (
                    <div key={type} className="flex flex-col gap-2 p-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800">
                        <span className="text-xs font-black text-slate-400 uppercase tracking-widest">{type.split('/')[1]?.toUpperCase()}</span>
                        <div className="flex flex-wrap gap-2">
                            {targets.map(t => (
                                <span key={t} className="px-2 py-1 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 text-[10px] font-bold rounded-lg border border-blue-100 dark:border-blue-900/50 uppercase tracking-tight">to {t}</span>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </section>
      </div>
    </Layout>
  );
}
