import { useState, useRef } from "react";
import Layout from "~/components/layout";
import Dragging from "~/components/dragging";
import { Download, Loader2, CheckCircle, AlertCircle } from "lucide-react";
import { apiClient } from "~/lib/api-client";
import type { Route } from "./+types/images-to-pdf";
import { useTranslation } from "~/i18n/context";
import { generateMeta } from "@forge42/seo-tools/remix/metadata";
import { webApp } from "@forge42/seo-tools/structured-data/web-app";
import { course } from "@forge42/seo-tools/structured-data/course";
import { type MetaFunction } from "react-router";

export const meta: MetaFunction = () => {
  const meta = generateMeta(
    {
      title: "Free Online Images to PDF Converter | Kleinbyte",
      description:
        "Convert multiple images to PDF online for free. Combine JPG, PNG, and other image formats into a single PDF document. No installation or registration required.",
      url: "https://kleinbyte.com/image-tools/images-to-pdf",
      image: "https://kleinbyte.com/og-image-images-to-pdf.png",
    },
    [
      {
        "script:ld+json": webApp({
          "@type": "SoftwareApplication",
          name: "Kleinbyte Images to PDF Converter",
          url: "https://kleinbyte.com/image-tools/images-to-pdf",
          description: "Convert multiple images to a single PDF document",
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
          name: "How to Convert Images to PDF",
          description:
            "Step-by-step guide on converting multiple images into a single PDF file",
        }),
      },
    ]
  );
  return meta;
};

export default function ImagesToPdf() {
  const { t } = useTranslation();
  const [files, setFiles] = useState<FileList | null>(null);
  const [orderedFiles, setOrderedFiles] = useState<File[]>([]);
  const draggingRef = useRef(null);
  const [loading, setLoading] = useState(false);
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleConvert = async () => {
    if (!orderedFiles.length) return;

    setLoading(true);
    setError(null);
    setDownloadUrl(null);

    try {
      const formData = new FormData();
      orderedFiles.forEach((file) => {
        formData.append("files", file);
      });

      const response = await apiClient.request("/images-to-pdf", {
        method: "POST",
        body: formData,
      });

      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      setDownloadUrl(url);
    } catch (err: any) {
      console.error("Error converting images to PDF:", err);
      setError(err.message || "Failed to convert images to PDF");
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = () => {
    if (!downloadUrl) return;
    
    const a = document.createElement("a");
    a.href = downloadUrl;
    a.download = "converted-images.pdf";
    document.body.appendChild(a);
    a.click();
    a.remove();
  };

  const handleReset = () => {
    setFiles(null);
    setOrderedFiles([]);
    setDownloadUrl(null);
    setError(null);
    (draggingRef.current as any)?.setBoxes([]);
  };

  return (
    <Layout>
      <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-12">
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 dark:text-white">
            Images to PDF Converter
          </h1>
          <p className="text-lg md:text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
            Convert multiple images (JPG, PNG, GIF, WEBP) into a single PDF document. 
            Drag and drop to reorder images before conversion.
          </p>
        </div>

        {/* Main Content */}
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Dragging Component */}
          <div className="space-y-4">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
              Select and Order Images
            </h2>
            <Dragging
              list={orderedFiles}
              onChange={setOrderedFiles}
              ref={draggingRef}
              accept="image/jpeg,image/png,image/jpg,image/webp,image/gif"
            />
          </div>

          {/* Convert Button */}
          {true && (
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={handleConvert}
                disabled={loading || orderedFiles.length === 0}
                className="px-8 py-4 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 hover:scale-105 active:scale-95 flex items-center justify-center gap-2 shadow-lg"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Converting...
                  </>
                ) : (
                  <>
                    <Download className="w-5 h-5" />
                    Convert to PDF ({orderedFiles.length} {orderedFiles.length === 1 ? 'image' : 'images'})
                  </>
                )}
              </button>

              <button
                onClick={handleReset}
                className="px-8 py-4 bg-gray-200 dark:bg-neutral-800 text-gray-900 dark:text-white font-semibold rounded-lg hover:bg-gray-300 dark:hover:bg-neutral-700 transition-all duration-300"
              >
                Clear All
              </button>
            </div>
          )}

          {/* Result Section */}
          {(downloadUrl || error) && (
            <div className="bg-white dark:bg-neutral-900 border border-gray-200 dark:border-neutral-700 rounded-2xl p-8 shadow-lg">
              {error && (
                <div className="text-center space-y-4">
                  <AlertCircle className="w-16 h-16 mx-auto text-red-600 dark:text-red-400" />
                  <h3 className="text-xl font-semibold text-red-600 dark:text-red-400">
                    Conversion Failed
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">{error}</p>
                  <button
                    onClick={() => setError(null)}
                    className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                  >
                    Try Again
                  </button>
                </div>
              )}

              {downloadUrl && (
                <div className="text-center space-y-6">
                  <CheckCircle className="w-16 h-16 mx-auto text-green-600 dark:text-green-400" />
                  <h3 className="text-2xl font-semibold text-gray-900 dark:text-white">
                    PDF Created Successfully!
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    Your images have been converted to PDF. Click below to download.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <button
                      onClick={handleDownload}
                      className="px-8 py-4 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition-all duration-300 hover:scale-105 active:scale-95 flex items-center justify-center gap-2 shadow-lg"
                    >
                      <Download className="w-5 h-5" />
                      Download PDF
                    </button>
                    <button
                      onClick={handleReset}
                      className="px-8 py-4 bg-gray-200 dark:bg-neutral-800 text-gray-900 dark:text-white font-semibold rounded-lg hover:bg-gray-300 dark:hover:bg-neutral-700 transition-all duration-300"
                    >
                      Convert More Images
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Features */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
            <div className="text-center p-6 bg-blue-50 dark:bg-blue-950/20 rounded-xl">
              <div className="text-3xl mb-3">🆓</div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                100% Free
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                No hidden costs or subscriptions
              </p>
            </div>
            <div className="text-center p-6 bg-green-50 dark:bg-green-950/20 rounded-xl">
              <div className="text-3xl mb-3">🔒</div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                Secure
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Your files are processed securely
              </p>
            </div>
            <div className="text-center p-6 bg-purple-50 dark:bg-purple-950/20 rounded-xl">
              <div className="text-3xl mb-3">⚡</div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                Fast
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Quick conversion in seconds
              </p>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}
