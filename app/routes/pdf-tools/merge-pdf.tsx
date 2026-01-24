import { useState, useEffect, useRef } from "react";
import { FilePlus, Download, RefreshCw, GripVertical, X, FileText, CheckCircle2, ChevronUp, ChevronDown, Layers } from "lucide-react";
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
      title: t("pdf.merge.meta.title"),
      description: t("pdf.merge.meta.description"),
      url: `https://kleinbyte.com${location.pathname}`,
      image: "https://kleinbyte.com/og-image-merge-pdf.png",
    },
    [
      {
        "script:ld+json": webApp({
          "@type": "SoftwareApplication",
          name: t("pdf.merge.meta.name"),
          url: `https://kleinbyte.com${location.pathname}`,
          description: t("pdf.merge.meta.app_desc"),
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
          name: "How to Merge PDF Files Online",
          description: "Learn how to combine multiple PDF documents into one single file securely in your browser.",
        }),
      },
      { property: "og:type", content: "website" },
      { property: "og:site_name", content: "Kleinbyte" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "keywords", content: t("pdf.merge.meta.keywords") },
      { name: "author", content: "Kleinbyte" },
    ]
  );
};

interface PdfFile {
  id: string;
  file: File;
  pageCount: number | null;
}

export default function MergePdf() {
  const { t } = useTranslation();
  const [pdfFiles, setPdfFiles] = useState<PdfFile[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [mergedBlob, setMergedBlob] = useState<Blob | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    addFiles(files);
  };

  const addFiles = async (files: File[]) => {
    const newFiles: PdfFile[] = await Promise.all(
      files.filter(f => f.type === 'application/pdf').map(async (file) => {
        let pageCount = null;
        try {
          const { PDFDocument } = await import("pdf-lib");
          const arrayBuffer = await file.arrayBuffer();
          const pdfDoc = await PDFDocument.load(arrayBuffer, { ignoreEncryption: true });
          pageCount = pdfDoc.getPageCount();
        } catch (e) {
          console.error("Error loading PDF for page count", e);
        }
        return {
          id: Math.random().toString(36).substr(2, 9),
          file,
          pageCount
        };
      })
    );
    setPdfFiles(prev => [...prev, ...newFiles]);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const moveFile = (index: number, direction: 'up' | 'down') => {
    const newFiles = [...pdfFiles];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= newFiles.length) return;
    
    [newFiles[index], newFiles[targetIndex]] = [newFiles[targetIndex], newFiles[index]];
    setPdfFiles(newFiles);
  };

  const removeFile = (id: string) => {
    setPdfFiles(prev => prev.filter(f => f.id !== id));
  };

  const mergePdfs = async () => {
    if (pdfFiles.length < 2) return;
    setIsProcessing(true);
    setMergedBlob(null);

    try {
      const { PDFDocument } = await import("pdf-lib");
      const mergedPdf = await PDFDocument.create();

      for (const pdfFile of pdfFiles) {
        const arrayBuffer = await pdfFile.file.arrayBuffer();
        const pdfDoc = await PDFDocument.load(arrayBuffer);
        const copiedPages = await mergedPdf.copyPages(pdfDoc, pdfDoc.getPageIndices());
        copiedPages.forEach((page) => mergedPdf.addPage(page));
      }

      const pdfBytes = await mergedPdf.save();
      const blob = new Blob([pdfBytes as any], { type: 'application/pdf' });
      setMergedBlob(blob);
    } catch (err) {
      console.error("Merge error:", err);
    } finally {
      setIsProcessing(false);
    }
  };

  const downloadMerged = () => {
    if (!mergedBlob) return;
    const url = URL.createObjectURL(mergedBlob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `merged-${Date.now()}.pdf`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const totalPages = pdfFiles.reduce((sum, f) => sum + (f.pageCount || 0), 0);

  return (
    <Layout>
      <div className="max-w-4xl mx-auto px-4 py-12 space-y-12">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="inline-flex items-center justify-center p-3 bg-blue-100 dark:bg-blue-900/30 rounded-2xl mb-2">
            <Layers className="w-8 h-8 text-blue-600 dark:text-blue-400" />
          </div>
          <h1 className="text-4xl font-extrabold tracking-tight bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent sm:text-5xl">
            {t("pdf.merge.title")}
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            {t("pdf.merge.description")}
          </p>
        </div>

        {!pdfFiles.length ? (
          <div 
            onClick={() => fileInputRef.current?.click()}
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => {
              e.preventDefault();
              addFiles(Array.from(e.dataTransfer.files));
            }}
            className="group relative border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-[2.5rem] p-24 text-center hover:border-blue-500 dark:hover:border-blue-400 transition-all cursor-pointer bg-white dark:bg-slate-900/50 shadow-sm hover:shadow-xl"
          >
            <div className="space-y-6">
              <div className="w-20 h-20 bg-blue-50 dark:bg-blue-900/20 rounded-3xl flex items-center justify-center mx-auto group-hover:scale-110 transition-transform duration-500">
                <FilePlus className="w-10 h-10 text-blue-600" />
              </div>
              <p className="text-2xl font-bold text-slate-900 dark:text-white">
                {t("pdf.merge.dropzone")}
              </p>
            </div>
            <input 
              ref={fileInputRef}
              type="file" 
              multiple 
              accept=".pdf" 
              onChange={handleFileChange}
              className="hidden" 
            />
          </div>
        ) : (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Toolbar */}
            <div className="flex items-center justify-between bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
               <div className="flex items-center gap-4">
                  <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-lg text-sm font-bold">
                    {pdfFiles.length} Files
                  </span>
                  <span className="text-slate-500 text-sm font-medium">
                    {totalPages} {t("pdf.merge.total_pages")}
                  </span>
               </div>
               <button 
                onClick={() => fileInputRef.current?.click()}
                className="flex items-center gap-2 text-sm font-bold text-blue-600 hover:text-blue-700 transition-colors"
               >
                 <FilePlus className="w-4 h-4" />
                 {t("pdf.merge.add_more")}
               </button>
            </div>

            {/* List */}
            <div className="space-y-3">
              {pdfFiles.map((pdf, index) => (
                <div 
                  key={pdf.id}
                  className="flex items-center gap-4 bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 hover:border-blue-400 dark:hover:border-blue-500 transition-all group"
                >
                  <div className="flex flex-col gap-1">
                     <button 
                      onClick={() => moveFile(index, 'up')}
                      disabled={index === 0}
                      className="text-slate-300 hover:text-blue-500 disabled:opacity-30"
                     >
                       <ChevronUp className="w-4 h-4" />
                     </button>
                     <button 
                      onClick={() => moveFile(index, 'down')}
                      disabled={index === pdfFiles.length - 1}
                      className="text-slate-300 hover:text-blue-500 disabled:opacity-30"
                     >
                       <ChevronDown className="w-4 h-4" />
                     </button>
                  </div>

                  <div className="w-12 h-12 bg-slate-50 dark:bg-slate-800 rounded-xl flex items-center justify-center flex-shrink-0">
                    <FileText className="w-6 h-6 text-slate-400" />
                  </div>

                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-slate-900 dark:text-white truncate">
                      {pdf.file.name}
                    </p>
                    <p className="text-xs text-slate-500 font-medium uppercase tracking-wider">
                      {pdf.pageCount ? `${pdf.pageCount} Pages` : 'Detecting pages...'} • {(pdf.file.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                  </div>

                  <button 
                    onClick={() => removeFile(pdf.id)}
                    className="p-2 text-slate-300 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-all opacity-0 group-hover:opacity-100"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              ))}
            </div>

            {/* Hint */}
            <p className="text-center text-sm text-slate-400 flex items-center justify-center gap-2">
               <GripVertical className="w-4 h-4" />
               {t("pdf.merge.order_hint")}
            </p>

            {/* Actions */}
            <div className="flex flex-col items-center gap-6 pt-4">
               {!mergedBlob ? (
                  <button
                    onClick={mergePdfs}
                    disabled={pdfFiles.length < 2 || isProcessing}
                    className="w-full max-w-sm h-16 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl font-bold text-lg shadow-lg shadow-blue-500/25 transition-all flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98]"
                  >
                    {isProcessing ? (
                      <>
                        <RefreshCw className="w-6 h-6 animate-spin" />
                        Merging...
                      </>
                    ) : (
                      <>
                        <Layers className="w-6 h-6" />
                        {t("pdf.merge.btn")}
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
                          <p className="font-bold text-green-700 dark:text-green-400 leading-tight">{t("pdf.merge.success")}</p>
                          <p className="text-sm text-green-600/70 dark:text-green-400/70 font-medium">Ready for download</p>
                       </div>
                    </div>
                    <button
                      onClick={downloadMerged}
                      className="w-full h-16 bg-slate-900 dark:bg-white text-white dark:text-slate-900 hover:bg-slate-800 dark:hover:bg-slate-100 rounded-2xl font-bold text-lg shadow-xl shadow-slate-500/10 transition-all flex items-center justify-center gap-3 active:scale-[0.98]"
                    >
                      <Download className="w-6 h-6" />
                      Download PDF
                    </button>
                    <button 
                      onClick={() => setMergedBlob(null)}
                      className="w-full text-sm font-bold text-slate-400 hover:text-slate-600 transition-colors"
                    >
                      Reset and Start Over
                    </button>
                  </div>
               )}
            </div>
          </div>
        )}

        <Free />

        {/* Benefits section */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-8 py-12">
          <div className="p-8 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm transition-all hover:shadow-md">
            <div className="w-14 h-14 bg-blue-100 dark:bg-blue-900/30 rounded-2xl flex items-center justify-center mb-6 text-blue-600 font-bold text-2xl">100%</div>
            <h3 className="text-xl font-bold mb-3 italic tracking-tight">Private & Local</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
              Your sensitive documents never leave your browser. Merging happens entirely locally on your device using advanced client-side logic.
            </p>
          </div>
          <div className="p-8 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm transition-all hover:shadow-md">
            <div className="w-14 h-14 bg-indigo-100 dark:bg-indigo-900/30 rounded-2xl flex items-center justify-center mb-6">
              <RefreshCw className="w-7 h-7 text-indigo-600" />
            </div>
            <h3 className="text-xl font-bold mb-3 italic tracking-tight">High Quality</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
              We preserve original formatting, fonts, and vector elements. Your combined PDF will look exactly like the individual documents.
            </p>
          </div>
          <div className="p-8 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm transition-all hover:shadow-md">
            <div className="w-14 h-14 bg-amber-100 dark:bg-amber-900/30 rounded-2xl flex items-center justify-center mb-6">
              <GripVertical className="w-7 h-7 text-amber-600" />
            </div>
            <h3 className="text-xl font-bold mb-3 italic tracking-tight">Easy Reordering</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
              Quickly arrange your files in any sequence. The tool automatically handles page count detection and complex structure merging.
            </p>
          </div>
        </section>
      </div>
    </Layout>
  );
}
