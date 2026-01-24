import { useState, useEffect, useRef } from "react";
import { Scissors, Download, RefreshCw, Palette, Shield, Zap, Sparkles, Image as ImageIcon, Copy, Check } from "lucide-react";
import Layout from "~/components/layout";
import Free from "~/components/free";
import { useTranslation, type Locale, translations } from "~/utils/route-utils";
import { generateMeta } from "@forge42/seo-tools/remix/metadata";
import { webApp } from "@forge42/seo-tools/structured-data/web-app";
import { course } from "@forge42/seo-tools/structured-data/course";
import { type MetaFunction } from "react-router";

// We will use dynamic imports for the heavy AI transformer library
// to keep the initial bundle size small.

export const meta: MetaFunction = ({ location }) => {
  const locale: Locale = (location.pathname.split("/")?.[1] as Locale) || "en";
  const messages = translations[locale] ?? translations.en;
  const t = (key: string) => messages[key] ?? key;

  return generateMeta(
    {
      title: t("bg.remover.meta.title"),
      description: t("bg.remover.meta.description"),
      url: `https://kleinbyte.com${location.pathname}`,
      image: "https://kleinbyte.com/og-image-bg-remover.png",
    },
    [
      {
        "script:ld+json": webApp({
          "@type": "SoftwareApplication",
          name: t("bg.remover.meta.name"),
          url: `https://kleinbyte.com${location.pathname}`,
          description: t("bg.remover.meta.app_desc"),
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
          name: "How to Remove Image Backgrounds for Free",
          description: "Learn how to remove backgrounds from any image using high-quality AI processing directly in your browser.",
        }),
      },
      { property: "og:type", content: "website" },
      { property: "og:site_name", content: "Kleinbyte" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "keywords", content: t("bg.remover.meta.keywords") },
      { name: "author", content: "Kleinbyte" },
    ]
  );
};

export default function BgRemover() {
  const { t } = useTranslation();
  const [isClient, setIsClient] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [loadingText, setLoadingText] = useState("");
  const [resultImage, setResultImage] = useState<string | null>(null);
  const [bgType, setBgType] = useState<"transparent" | "color">("transparent");
  const [bgColor, setBgColor] = useState("#ffffff");
  
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const originalImageData = useRef<ImageData | null>(null);
  const maskData = useRef<Uint8ClampedArray | null>(null);

  // Ensure component only renders on client side to avoid SSR issues with DOM APIs
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Auto-process on file upload
  useEffect(() => {
    if (file) {
      const url = URL.createObjectURL(file);
      setImageSrc(url);
      setResultImage(null);
      return () => URL.revokeObjectURL(url);
    }
  }, [file]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) setFile(e.target.files[0]);
  };

  const processImage = async () => {
    if (!imageSrc) return;
    setIsProcessing(true);
    setProgress(0);
    setLoadingText(t("bg.remover.status.loading_model"));

    try {
      const { pipeline, env, RawImage } = await import("@huggingface/transformers");
      
      // Configure environment for browser
      env.allowLocalModels = false;
      
      const model_id = 'briaai/RMBG-1.4';
      
      // Use pipeline for easier handling of RMBG model
      const segmenter = await pipeline('image-segmentation', model_id, {
        progress_callback: (p: any) => {
          if (p.status === 'progress') {
            setProgress(Math.round(p.progress));
            setLoadingText(`${t("bg.remover.status.loading_model")} ${Math.round(p.progress)}%`);
          }
        }
      });

      setLoadingText(t("bg.remover.status.processing"));
      setProgress(50);

      const img = await RawImage.fromURL(imageSrc);
      const output = await segmenter(imageSrc);
      
      // The output from image-segmentation pipeline is the mask
      // We need to apply this mask to the original image
      const mask = output[0].mask;
      
      const canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      // Draw original image to get data
      const imgElement = new Image();
      imgElement.src = imageSrc;
      await new Promise(resolve => imgElement.onload = resolve);
      ctx.drawImage(imgElement, 0, 0);
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      
      originalImageData.current = imageData;
      
      // Resize mask to match image
      const maskCanvas = mask.toCanvas();
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(maskCanvas, 0, 0, canvas.width, canvas.height);
      maskData.current = ctx.getImageData(0, 0, canvas.width, canvas.height).data;

      applyBackground("transparent");
      setIsProcessing(false);
      setProgress(100);
      
    } catch (err) {
      console.error(err);
      setIsProcessing(false);
    }
  };

  const applyBackground = (type: "transparent" | "color", color = bgColor) => {
    if (!originalImageData.current || !maskData.current) return;

    setBgType(type);
    if (type === "color") setBgColor(color);

    const width = originalImageData.current.width;
    const height = originalImageData.current.height;
    
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const newImageData = ctx.createImageData(width, height);
    const data = originalImageData.current.data;
    const mask = maskData.current;

    for (let i = 0; i < data.length; i += 4) {
      // mask provides alpha intensity [0-255]
      const alpha = mask[i]; 
      
      if (type === "transparent") {
        newImageData.data[i] = data[i];
        newImageData.data[i+1] = data[i+1];
        newImageData.data[i+2] = data[i+2];
        newImageData.data[i+3] = alpha;
      } else {
        const bgR = parseInt(color.slice(1, 3), 16);
        const bgG = parseInt(color.slice(3, 5), 16);
        const bgB = parseInt(color.slice(5, 7), 16);
        
        const a = alpha / 255;
        newImageData.data[i] = Math.round(data[i] * a + bgR * (1 - a));
        newImageData.data[i+1] = Math.round(data[i+1] * a + bgG * (1 - a));
        newImageData.data[i+2] = Math.round(data[i+2] * a + bgB * (1 - a));
        newImageData.data[i+3] = 255;
      }
    }

    ctx.putImageData(newImageData, 0, 0);
    setResultImage(canvas.toDataURL("image/png"));
  };

  const download = () => {
    if (!resultImage) return;
    const link = document.createElement("a");
    link.download = `bg-removed-${Date.now()}.png`;
    link.href = resultImage;
    link.click();
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
          <div className="inline-flex items-center justify-center p-3 bg-indigo-100 dark:bg-indigo-900/30 rounded-2xl mb-2">
            <Scissors className="w-8 h-8 text-indigo-600 dark:text-indigo-400" />
          </div>
          <h1 className="text-4xl font-extrabold tracking-tight bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent sm:text-5xl">
            {t("bg.remover.title")}
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            {t("bg.remover.description")}
          </p>
          <div className="flex justify-center">
             <span className="px-4 py-1.5 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400 rounded-full text-sm font-bold border border-indigo-100 dark:border-indigo-900/30 flex items-center gap-2">
                <Shield className="w-4 h-4" />
                {t("bg.remover.privacy_note")}
             </span>
          </div>
        </div>

        {!imageSrc ? (
          <div 
            onClick={() => document.getElementById('file-upload')?.click()}
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => {
               e.preventDefault();
               if(e.dataTransfer.files?.[0]) setFile(e.dataTransfer.files[0]);
            }}
            className="group relative border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-[2.5rem] p-20 text-center hover:border-indigo-500 dark:hover:border-indigo-400 transition-all cursor-pointer bg-white/50 dark:bg-slate-900/50 backdrop-blur-xl"
          >
            <div className="space-y-6">
              <div className="w-24 h-24 bg-indigo-50 dark:bg-indigo-900/30 rounded-3xl flex items-center justify-center mx-auto group-hover:scale-110 transition-transform duration-500">
                <ImageIcon className="w-12 h-12 text-indigo-600 dark:text-indigo-400" />
              </div>
              <div>
                <p className="text-2xl font-bold text-slate-900 dark:text-white">
                  {t("bg.remover.dropzone")}
                </p>
                <p className="text-slate-500 mt-2">
                  Supports PNG, JPG, WebP (Max 10MB)
                </p>
                <div className="flex items-center justify-center gap-2 mt-6">
                   <kbd className="px-3 py-1.5 bg-slate-100 dark:bg-slate-800 rounded-lg text-xs font-bold border border-slate-200 dark:border-slate-700">Ctrl + V</kbd>
                   <span className="text-sm text-slate-400 font-medium">{t("bg.remover.paste_hint")}</span>
                </div>
              </div>
            </div>
            <input 
              id="file-upload"
              type="file" 
              accept="image/*" 
              onChange={handleFileChange}
              className="hidden" 
            />
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
            {/* Left side: Preview / Controls */}
            <div className="space-y-6">
              <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-8 shadow-xl space-y-8 h-full flex flex-col">
                <div className="flex items-center justify-between">
                   <h2 className="font-bold text-slate-900 dark:text-white uppercase tracking-wider text-sm flex items-center gap-2">
                      <ImageIcon className="w-4 h-4 text-indigo-500" />
                      Image Preview
                   </h2>
                   <button 
                    onClick={() => setFile(null)}
                    className="text-slate-400 hover:text-red-500 transition-colors"
                   >
                     <RefreshCw className="w-4 h-4" />
                   </button>
                </div>

                <div className="flex-1 min-h-[300px] bg-slate-50 dark:bg-slate-800/50 rounded-2xl overflow-hidden relative border border-slate-100 dark:border-slate-800">
                   <img src={imageSrc} className="absolute inset-0 w-full h-full object-contain p-4" alt="Original" />
                </div>

                <div className="pt-4">
                  {!resultImage && !isProcessing && (
                    <button
                      onClick={processImage}
                      className="w-full h-16 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl font-bold text-lg shadow-lg shadow-indigo-500/25 transition-all flex items-center justify-center gap-3 active:scale-[0.98]"
                    >
                      <Scissors className="w-6 h-6" />
                      {t("bg.remover.btn.process")}
                    </button>
                  )}

                  {isProcessing && (
                    <div className="space-y-4">
                       <div className="flex justify-between items-end mb-2">
                          <span className="text-sm font-bold text-indigo-500 lowercase">{loadingText}</span>
                          <span className="text-sm font-mono text-slate-400">{progress}%</span>
                       </div>
                       <div className="h-3 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 transition-all duration-300"
                            style={{ width: `${progress}%` }}
                          />
                       </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Right side: Result Container */}
            <div className="space-y-6">
              <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-8 shadow-xl space-y-8 h-full flex flex-col">
                <div className="flex items-center justify-between">
                   <h2 className="font-bold text-slate-900 dark:text-white uppercase tracking-wider text-sm flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-purple-500" />
                      Result
                   </h2>
                   {resultImage && (
                     <div className="flex items-center gap-2">
                        <button 
                          onClick={() => applyBackground("transparent")}
                          className={`p-2 rounded-lg border transition-all ${bgType === 'transparent' ? 'bg-indigo-600 border-indigo-600 text-white' : 'bg-slate-50 dark:bg-slate-800 text-slate-500'}`}
                          title={t("bg.remover.options.transparent")}
                        >
                          <ImageIcon className="w-4 h-4" />
                        </button>
                        <div className="flex items-center gap-1 p-1 bg-slate-50 dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700">
                           <input 
                            type="color" 
                            value={bgColor} 
                            onChange={(e) => applyBackground("color", e.target.value)}
                            className="w-6 h-6 rounded cursor-pointer bg-transparent"
                           />
                           <span className="text-[10px] font-mono text-slate-400 pr-1">{bgColor.toUpperCase()}</span>
                        </div>
                     </div>
                   )}
                </div>

                <div className="flex-1 min-h-[300px] rounded-2xl overflow-hidden relative border border-slate-100 dark:border-slate-800 checkered-pattern">
                   {resultImage ? (
                     <img src={resultImage} className="absolute inset-0 w-full h-full object-contain p-4" alt="Processed" />
                   ) : (
                     <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-400 space-y-3 opacity-50">
                        <ImageIcon className="w-12 h-12" />
                        <p className="text-sm font-medium">Result will appear here</p>
                     </div>
                   )}
                </div>

                <div className="pt-4">
                   <button
                    disabled={!resultImage}
                    onClick={download}
                    className="w-full h-16 bg-slate-900 dark:bg-white text-white dark:text-slate-900 hover:bg-slate-800 dark:hover:bg-slate-100 disabled:opacity-30 disabled:cursor-not-allowed rounded-2xl font-bold text-lg transition-all flex items-center justify-center gap-3 shadow-xl"
                  >
                    <Download className="w-6 h-6" />
                    {t("bg.remover.btn.download")}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        <Free />

        {/* Benefits section */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-8 py-12">
          <div className="p-8 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm">
            <div className="w-14 h-14 bg-indigo-100 dark:bg-indigo-900/30 rounded-2xl flex items-center justify-center mb-6">
              <Shield className="w-7 h-7 text-indigo-600 dark:text-indigo-400" />
            </div>
            <h3 className="text-xl font-bold mb-3">Privacy First</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
              Processed 100% in your browser. No server uploads, no data storage. Your photos stay strictly on your device.
            </p>
          </div>
          <div className="p-8 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm">
            <div className="w-14 h-14 bg-pink-100 dark:bg-pink-900/30 rounded-2xl flex items-center justify-center mb-6">
              <Zap className="w-7 h-7 text-pink-600 dark:text-pink-400" />
            </div>
            <h3 className="text-xl font-bold mb-3">High Quality AI</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
              Powered by state-of-the-art segmentation models (RMBG-1.4) to precisely separate subjects from complex backgrounds.
            </p>
          </div>
          <div className="p-8 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm">
            <div className="w-14 h-14 bg-amber-100 dark:bg-amber-900/30 rounded-2xl flex items-center justify-center mb-6">
              <Sparkles className="w-7 h-7 text-amber-600 dark:text-amber-400" />
            </div>
            <h3 className="text-xl font-bold mb-3">Professional Results</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
              Export high-resolution PNGs with perfect transparency. Ideal for e-commerce, design, and personal projects.
            </p>
          </div>
        </section>
      </div>

      <style>{`
        .checkered-pattern {
          background-image: linear-gradient(45deg, #f0f0f0 25%, transparent 25%), linear-gradient(-45deg, #f0f0f0 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #f0f0f0 75%), linear-gradient(-45deg, transparent 75%, #f0f0f0 75%);
          background-size: 20px 20px;
          background-position: 0 0, 0 10px, 10px -10px, -10px 0px;
          background-color: #fafafa;
        }
        .dark .checkered-pattern {
          background-image: linear-gradient(45deg, #1e293b 25%, transparent 25%), linear-gradient(-45deg, #1e293b 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #1e293b 75%), linear-gradient(-45deg, transparent 75%, #1e293b 75%);
          background-color: #0f172a;
        }
      `}</style>
    </Layout>
  );
}
