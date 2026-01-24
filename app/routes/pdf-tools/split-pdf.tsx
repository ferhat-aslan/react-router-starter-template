import { useState, useEffect, useRef } from "react";
import { Scissors, FileText, Download, CheckCircle2, GripVertical, FilePlus, X, LayoutGrid, CheckSquare, Square, RefreshCw, ChevronUp, ChevronDown } from "lucide-react";
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
      title: t("pdf.split.meta.title"),
      description: t("pdf.split.meta.description"),
      url: `https://kleinbyte.com${location.pathname}`,
      image: "https://kleinbyte.com/og-image-split-pdf.png",
    },
    [
      {
        "script:ld+json": webApp({
          "@type": "SoftwareApplication",
          name: t("pdf.split.meta.name"),
          url: `https://kleinbyte.com${location.pathname}`,
          description: t("pdf.split.meta.app_desc"),
          applicationCategory: "UtilitiesApplication",
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
          name: "How to Split PDF Files Online",
          description: "Learn how to extract specific pages from a PDF document visually and securely in your browser.",
        }),
      },
      { property: "og:type", content: "website" },
      { property: "og:site_name", content: "Kleinbyte" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "keywords", content: t("pdf.split.meta.keywords") },
      { name: "author", content: "Kleinbyte" },
    ]
  );
};

interface PageThumb {
  number: number;
  url: string;
}

export default function SplitPdf() {
  const { t } = useTranslation();
  const [isClient, setIsClient] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [thumbnails, setThumbnails] = useState<PageThumb[]>([]);
  const [selectedPages, setSelectedPages] = useState<Set<number>>(new Set());
  const [isProcessing, setIsProcessing] = useState(false);
  const [isGeneratingThumbs, setIsGeneratingThumbs] = useState(false);
  const [resultBlob, setResultBlob] = useState<Blob | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Ensure component only renders on client side to avoid SSR issues with pdfjs
  useEffect(() => {
    setIsClient(true);
  }, []);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) handleFile(selectedFile);
  };

  const handleFile = async (selectedFile: File) => {
    if (selectedFile.type !== "application/pdf") return;
    
    setFile(selectedFile);
    setResultBlob(null);
    setSelectedPages(new Set());
    setThumbnails([]);
    setIsGeneratingThumbs(true);

    try {
      // Dynamically import pdfjs to avoid SSR issues
      const pdfjs = await import("pdfjs-dist");
      
      // Use CDN worker to avoid build issues with ?url imports
      pdfjs.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

      const arrayBuffer = await selectedFile.arrayBuffer();
      const loadingTask = pdfjs.getDocument(arrayBuffer);
      const pdf = await loadingTask.promise;
      const numPages = pdf.numPages;
      const thumbs: PageThumb[] = [];

      for (let i = 1; i <= numPages; i++) {
        const page = await pdf.getPage(i);
        const viewport = page.getViewport({ scale: 0.3 });
        const canvas = document.createElement("canvas");
        const context = canvas.getContext("2d");
        canvas.height = viewport.height;
        canvas.width = viewport.width;

        if (context) {
          await page.render({ canvasContext: context, viewport, canvas }).promise;
          thumbs.push({ number: i, url: canvas.toDataURL() });
        }
      }
      setThumbnails(thumbs);
    } catch (err) {
      console.error("Error generating thumbnails:", err);
    } finally {
      setIsGeneratingThumbs(false);
    }
  };

  const togglePage = (num: number) => {
    const next = new Set(selectedPages);
    if (next.has(num)) next.delete(num);
    else next.add(num);
    setSelectedPages(next);
  };

  const selectAll = () => {
    const all = new Set<number>();
    thumbnails.forEach(t => all.add(t.number));
    setSelectedPages(all);
  };

  const clearAll = () => setSelectedPages(new Set());

  const invertSelection = () => {
    const next = new Set<number>();
    thumbnails.forEach(t => {
      if (!selectedPages.has(t.number)) next.add(t.number);
    });
    setSelectedPages(next);
  };

  const splitPdf = async () => {
    if (selectedPages.size === 0 || !file) return;
    setIsProcessing(true);

    try {
      const { PDFDocument } = await import("pdf-lib");
      const arrayBuffer = await file.arrayBuffer();
      const originalPdf = await PDFDocument.load(arrayBuffer);
      const newPdf = await PDFDocument.create();
      
      const sortedIndices = Array.from(selectedPages)
        .sort((a, b) => a - b)
        .map(n => n - 1);

      const copiedPages = await newPdf.copyPages(originalPdf, sortedIndices);
      copiedPages.forEach((page) => newPdf.addPage(page));

      const pdfBytes = await newPdf.save();
      setResultBlob(new Blob([pdfBytes as any], { type: "application/pdf" }));
    } catch (err) {
      console.error("Split error:", err);
    } finally {
      setIsProcessing(false);
    }
  };

  const downloadResult = () => {
    if (!resultBlob || !file) return;
    const url = URL.createObjectURL(resultBlob);
    const link = document.createElement("a");
    link.href = url;
    link.download = file.name.replace(".pdf", "-extracted.pdf");
    link.click();
    URL.revokeObjectURL(url);
  };

  // Prevent SSR rendering to avoid DOM API errors
  if (!isClient) {
    return null;
  }

  return (
    <Layout>
      <div className="max-w-6xl mx-auto px-4 py-12 space-y-12">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="inline-flex items-center justify-center p-3 bg-orange-100 dark:bg-orange-900/30 rounded-2xl mb-2">
            <Scissors className="w-8 h-8 text-orange-600 dark:text-orange-400" />
          </div>
          <h1 className="text-4xl font-extrabold tracking-tight bg-gradient-to-r from-orange-600 to-amber-600 bg-clip-text text-transparent sm:text-5xl">
            {t("pdf.split.title")}
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            {t("pdf.split.description")}
          </p>
        </div>

        {!file ? (
          <div 
            onClick={() => fileInputRef.current?.click()}
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => {
              e.preventDefault();
              const dropped = e.dataTransfer.files[0];
              if (dropped) handleFile(dropped);
            }}
            className="group relative border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-[2.5rem] p-24 text-center hover:border-orange-500 dark:hover:border-orange-400 transition-all cursor-pointer bg-white dark:bg-slate-900/50 shadow-sm hover:shadow-xl"
          >
            <div className="space-y-6">
              <div className="w-20 h-20 bg-orange-50 dark:bg-orange-900/20 rounded-3xl flex items-center justify-center mx-auto group-hover:scale-110 transition-transform duration-500">
                <FilePlus className="w-10 h-10 text-orange-600" />
              </div>
              <p className="text-2xl font-bold text-slate-900 dark:text-white">
                {t("pdf.split.dropzone")}
              </p>
              <p className="text-sm text-slate-400 font-medium">PDF files only • Max 50MB</p>
            </div>
            <input 
              ref={fileInputRef}
              type="file" 
              accept=".pdf" 
              onChange={handleFileChange}
              className="hidden" 
            />
          </div>
        ) : (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Toolbar */}
            <div className="flex flex-wrap items-center justify-between gap-4 bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
               <div className="flex items-center gap-4">
                  <span className="px-3 py-1 bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400 rounded-lg text-sm font-bold flex items-center gap-2">
                    <FileText className="w-4 h-4" />
                    {selectedPages.size} {t("pdf.split.pages_selected")}
                  </span>
                  <div className="h-6 w-px bg-slate-200 dark:bg-slate-800 hidden sm:block"></div>
                  <div className="flex items-center gap-2">
                     <button onClick={selectAll} className="p-2 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors" title="Select All"><CheckSquare className="w-4 h-4" /></button>
                     <button onClick={clearAll} className="p-2 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors" title="Clear All"><Square className="w-4 h-4" /></button>
                     <button onClick={invertSelection} className="p-2 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors" title="Invert Selection"><RefreshCw className="w-4 h-4" /></button>
                  </div>
               </div>
               <div className="flex items-center gap-3">
                  <button 
                    onClick={() => { setFile(null); setThumbnails([]); }}
                    className="flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-red-500 transition-colors"
                  >
                    <X className="w-4 h-4" />
                    Reset
                  </button>
               </div>
            </div>

            {/* Page Grid */}
            {isGeneratingThumbs ? (
              <div className="py-24 text-center space-y-4">
                <RefreshCw className="w-12 h-12 text-orange-500 animate-spin mx-auto" />
                <p className="text-lg font-medium text-slate-500 italic">Pre-rendering pages for selection...</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
                {thumbnails.map((thumb) => (
                  <div 
                    key={thumb.number}
                    onClick={() => togglePage(thumb.number)}
                    className={`group relative cursor-pointer rounded-xl border-4 transition-all overflow-hidden aspect-[3/4] ${
                      selectedPages.has(thumb.number) 
                        ? "border-orange-500 shadow-lg shadow-orange-500/20 scale-[1.02]" 
                        : "border-slate-100 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700"
                    }`}
                  >
                    <img src={thumb.url} alt={`Page ${thumb.number}`} className="w-full h-full object-cover" />
                    
                    {/* Page Badge */}
                    <div className={`absolute bottom-2 right-2 px-2 py-0.5 rounded text-[10px] font-bold ${
                      selectedPages.has(thumb.number) ? "bg-orange-500 text-white" : "bg-black/60 text-white"
                    }`}>
                      {thumb.number}
                    </div>

                    {/* Check Overlay */}
                    <div className={`absolute inset-0 bg-orange-500/10 transition-opacity ${selectedPages.has(thumb.number) ? "opacity-100" : "opacity-0 group-hover:opacity-100"}`}>
                       <div className={`absolute top-2 right-2 w-6 h-6 rounded-full flex items-center justify-center border-2 ${
                         selectedPages.has(thumb.number) ? "bg-orange-500 border-orange-500 text-white" : "bg-white/80 border-slate-300 text-slate-400"
                       }`}>
                         <CheckCircle2 className="w-4 h-4" />
                       </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Actions */}
            <div className="flex flex-col items-center gap-6 pt-12">
               {!resultBlob ? (
                  <button
                    onClick={splitPdf}
                    disabled={selectedPages.size === 0 || isProcessing}
                    className="w-full max-w-sm h-16 bg-orange-600 hover:bg-orange-700 text-white rounded-2xl font-bold text-lg shadow-lg shadow-orange-500/25 transition-all flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98]"
                  >
                    {isProcessing ? (
                      <>
                        <RefreshCw className="w-6 h-6 animate-spin" />
                        Splitting...
                      </>
                    ) : (
                      <>
                        <Scissors className="w-6 h-6" />
                        {t("pdf.split.btn")}
                      </>
                    )}
                  </button>
               ) : (
                  <div className="w-full max-w-sm space-y-4">
                    <div className="p-4 bg-green-50 dark:bg-green-900/20 border border-green-100 dark:border-green-900/30 rounded-2xl flex items-center gap-4">
                       <div className="w-10 h-10 bg-green-500 text-white rounded-full flex items-center justify-center">
                          <CheckCircle2 className="w-6 h-6" />
                       </div>
                       <div className="flex-1">
                          <p className="font-bold text-green-700 dark:text-green-400 leading-tight">{t("pdf.split.success")}</p>
                          <p className="text-sm text-green-600/70 dark:text-green-400/70 font-medium">Extracted {selectedPages.size} pages</p>
                       </div>
                    </div>
                    <button
                      onClick={downloadResult}
                      className="w-full h-16 bg-slate-900 dark:bg-white text-white dark:text-slate-900 hover:bg-slate-800 dark:hover:bg-slate-100 rounded-2xl font-bold text-lg shadow-xl shadow-slate-500/10 transition-all flex items-center justify-center gap-3 active:scale-[0.98]"
                    >
                      <Download className="w-6 h-6" />
                      Download Split PDF
                    </button>
                    <button 
                      onClick={() => setResultBlob(null)}
                      className="w-full text-sm font-bold text-slate-400 hover:text-slate-600 transition-colors"
                    >
                      Refine Selection
                    </button>
                  </div>
               )}
            </div>
          </div>
        )}

        <Free />

        {/* Benefits section */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-8 py-12 border-t border-slate-200 dark:border-slate-800">
          <div className="p-8 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm transition-all hover:shadow-md">
            <div className="w-14 h-14 bg-orange-100 dark:bg-orange-900/30 rounded-2xl flex items-center justify-center mb-6 text-orange-600 font-bold text-2xl">Visual</div>
            <h3 className="text-xl font-bold mb-3 italic tracking-tight">Visual Selection</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed text-sm">
              Don't guess by page numbers. Preview every page of your PDF and click to select exactly what you need to extract or split.
            </p>
          </div>
          <div className="p-8 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm transition-all hover:shadow-md">
            <div className="w-14 h-14 bg-amber-100 dark:bg-amber-900/30 rounded-2xl flex items-center justify-center mb-6">
              <Download className="w-7 h-7 text-amber-600" />
            </div>
            <h3 className="text-xl font-bold mb-3 italic tracking-tight">Fast Extraction</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed text-sm">
              Split large PDFs in seconds. Our client-side engine handles page extraction locally, preserving original text and vector quality.
            </p>
          </div>
          <div className="p-8 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm transition-all hover:shadow-md">
            <div className="w-14 h-14 bg-blue-100 dark:bg-blue-900/30 rounded-2xl flex items-center justify-center mb-6">
              <LayoutGrid className="w-7 h-7 text-blue-600" />
            </div>
            <h3 className="text-xl font-bold mb-3 italic tracking-tight">Privacy First</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed text-sm">
              Your documents never leave your browser. All page rendering and splitting logic happens entirely on your machine.
            </p>
          </div>
        </section>
      </div>
    </Layout>
  );
}
