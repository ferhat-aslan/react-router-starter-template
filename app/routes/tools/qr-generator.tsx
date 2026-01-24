import { useState, useEffect, useRef } from "react";
import { QrCode, Download, Settings, RefreshCw, Palette, Maximize, Shield, Zap, Sparkles, Layout as LayoutIcon, Type } from "lucide-react";
import Layout from "~/components/layout";
import Free from "~/components/free";
import { useTranslation, type Locale, translations } from "~/utils/route-utils";
import { generateMeta } from "@forge42/seo-tools/remix/metadata";
import { webApp } from "@forge42/seo-tools/structured-data/web-app";
import { course } from "@forge42/seo-tools/structured-data/course";
import { type MetaFunction } from "react-router";

// We'll use a dynamic import for qrcode-generator logic or similar
// For simplicity and immediate reliability, I'll implement a robust QR generation bridge using Canvas

export const meta: MetaFunction = ({ location }) => {
  const locale: Locale = (location.pathname.split("/")?.[1] as Locale) || "en";
  const messages = translations[locale] ?? translations.en;
  const t = (key: string) => messages[key] ?? key;

  return generateMeta(
    {
      title: t("qr.gen.meta.title"),
      description: t("qr.gen.meta.description"),
      url: `https://kleinbyte.com${location.pathname}`,
      image: "https://kleinbyte.com/og-image-qr-generator.png",
    },
    [
      {
        "script:ld+json": webApp({
          "@type": "SoftwareApplication",
          name: t("qr.gen.meta.name"),
          url: `https://kleinbyte.com${location.pathname}`,
          description: t("qr.gen.meta.app_desc"),
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
          name: "How to Generate QR Codes Online",
          description: "Learn how to create custom, high-resolution QR codes securely in your browser",
        }),
      },
      { property: "og:type", content: "website" },
      { property: "og:site_name", content: "Kleinbyte" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "keywords", content: t("qr.gen.meta.keywords") },
      { name: "author", content: "Kleinbyte" },
    ]
  );
};

export default function QrGenerator() {
  const { t } = useTranslation();
  const [text, setText] = useState("https://kleinbyte.com");
  const [fgColor, setFgColor] = useState("#0f172a"); // slate-900
  const [bgColor, setBgColor] = useState("#ffffff");
  const [size, setSize] = useState(1024);
  const [ecc, setEcc] = useState<'L' | 'M' | 'Q' | 'H'>('H');
  const [isGenerating, setIsGenerating] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const generate = async () => {
    if (!text.trim()) return;
    setIsGenerating(true);

    try {
      // Dynamic import qrcode-generator
      const qrcode = (await import("qrcode-generator")).default;
      
      const qr = qrcode(0, ecc);
      qr.addData(text);
      qr.make();

      const moduleCount = qr.getModuleCount();
      const canvas = canvasRef.current;
      if (!canvas) return;

      const displaySize = 512; // UI preview size
      const scale = size / displaySize;
      
      canvas.width = size;
      canvas.height = size;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      // Background
      ctx.fillStyle = bgColor;
      ctx.fillRect(0, 0, size, size);

      // Foreground
      ctx.fillStyle = fgColor;
      const moduleSize = size / moduleCount;

      for (let row = 0; row < moduleCount; row++) {
        for (let col = 0; col < moduleCount; col++) {
          if (qr.isDark(row, col)) {
            const x = col * moduleSize;
            const y = row * moduleSize;
            
            // Draw modules with slight rounding for modern feel
            const radius = moduleSize * 0.3;
            
            ctx.beginPath();
            ctx.moveTo(x + radius, y);
            ctx.lineTo(x + moduleSize - radius, y);
            ctx.quadraticCurveTo(x + moduleSize, y, x + moduleSize, y + radius);
            ctx.lineTo(x + moduleSize, y + moduleSize - radius);
            ctx.quadraticCurveTo(x + moduleSize, y + moduleSize, x + moduleSize - radius, y + moduleSize);
            ctx.lineTo(x + radius, y + moduleSize);
            ctx.quadraticCurveTo(x, y + moduleSize, x, y + moduleSize - radius);
            ctx.lineTo(x, y + radius);
            ctx.quadraticCurveTo(x, y, x + radius, y);
            ctx.closePath();
            ctx.fill();
          }
        }
      }

      // Draw Logo (Mockup for now, could be project icon)
      // Implementation of logo overlay would go here
      
    } catch (err) {
      console.error(err);
    } finally {
      setIsGenerating(false);
    }
  };

  useEffect(() => {
    const timeout = setTimeout(generate, 300);
    return () => clearTimeout(timeout);
  }, [text, fgColor, bgColor, ecc, size]);

  const download = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const link = document.createElement("a");
    link.download = `qr-code-${Date.now()}.png`;
    link.href = canvas.toDataURL("image/png");
    link.click();
  };

  return (
    <Layout>
      <div className="max-w-5xl mx-auto px-4 py-12 space-y-12">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="inline-flex items-center justify-center p-3 bg-indigo-100 dark:bg-indigo-900/30 rounded-2xl mb-2">
            <QrCode className="w-8 h-8 text-indigo-600 dark:text-indigo-400" />
          </div>
          <h1 className="text-4xl font-extrabold tracking-tight bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent sm:text-5xl">
            {t("qr.gen.title")}
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            {t("qr.gen.description")}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Settings Section */}
          <div className="lg:col-span-7 space-y-6">
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-xl p-8 space-y-8">
              <div className="space-y-4">
                <label className="flex items-center gap-2 text-sm font-bold text-slate-400 uppercase tracking-widest">
                  <Type className="w-4 h-4" />
                  {t("qr.gen.input.label")}
                </label>
                <textarea
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  placeholder={t("qr.gen.input.placeholder")}
                  className="w-full h-32 p-6 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none text-lg resize-none transition-all placeholder:text-slate-400"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4">
                <div className="space-y-4">
                  <label className="flex items-center gap-2 text-sm font-bold text-slate-400 uppercase tracking-widest">
                    <Palette className="w-4 h-4" />
                    {t("qr.gen.options.fg")}
                  </label>
                  <div className="flex items-center gap-4">
                    <input
                      type="color"
                      value={fgColor}
                      onChange={(e) => setFgColor(e.target.value)}
                      className="w-12 h-12 rounded-lg cursor-pointer bg-transparent"
                    />
                    <code className="text-sm font-mono text-slate-500">{fgColor.toUpperCase()}</code>
                  </div>
                </div>

                <div className="space-y-4">
                  <label className="flex items-center gap-2 text-sm font-bold text-slate-400 uppercase tracking-widest">
                    <Palette className="w-4 h-4" />
                    {t("qr.gen.options.bg")}
                  </label>
                  <div className="flex items-center gap-4">
                    <input
                      type="color"
                      value={bgColor}
                      onChange={(e) => setBgColor(e.target.value)}
                      className="w-12 h-12 rounded-lg cursor-pointer bg-transparent"
                    />
                    <code className="text-sm font-mono text-slate-500">{bgColor.toUpperCase()}</code>
                  </div>
                </div>

                <div className="space-y-4">
                  <label className="flex items-center gap-2 text-sm font-bold text-slate-400 uppercase tracking-widest">
                    <Maximize className="w-4 h-4" />
                    {t("qr.gen.options.size")}
                  </label>
                  <select
                    value={size}
                    onChange={(e) => setSize(Number(e.target.value))}
                    className="w-full h-12 px-4 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none font-medium transition-all"
                  >
                    {[256, 512, 1024, 2048, 4096].map(s => (
                      <option key={s} value={s}>{s} px</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-4">
                  <label className="flex items-center gap-2 text-sm font-bold text-slate-400 uppercase tracking-widest">
                    <Shield className="w-4 h-4" />
                    {t("qr.gen.options.ecc")}
                  </label>
                  <div className="grid grid-cols-4 gap-2">
                    {(['L', 'M', 'Q', 'H'] as const).map(level => (
                      <button
                        key={level}
                        onClick={() => setEcc(level)}
                        className={`h-12 rounded-xl font-bold transition-all border ${
                          ecc === level 
                            ? 'bg-indigo-600 border-indigo-600 text-white shadow-lg shadow-indigo-500/20' 
                            : 'bg-slate-50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700 text-slate-600 hover:bg-slate-100'
                        }`}
                      >
                        {level}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Preview Section */}
          <div className="lg:col-span-5 lg:sticky lg:top-8">
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-xl overflow-hidden flex flex-col items-center">
              <div className="w-full p-6 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
                 <h2 className="font-bold text-slate-900 dark:text-white uppercase tracking-wider text-sm flex items-center gap-2">
                    <LayoutIcon className="w-4 h-4 text-indigo-500" />
                    Preview
                 </h2>
                 {isGenerating && <RefreshCw className="w-4 h-4 animate-spin text-slate-400" />}
              </div>
              
              <div className="p-12 w-full flex items-center justify-center bg-slate-50 dark:bg-slate-800/20">
                <div className="relative group">
                  <div className="absolute -inset-4 bg-gradient-to-tr from-indigo-500/10 to-purple-500/10 rounded-[2.5rem] blur-2xl group-hover:blur-3xl transition-all opacity-0 group-hover:opacity-100" />
                  <div className="relative p-8 bg-white dark:bg-slate-900 rounded-[2rem] shadow-2xl border border-slate-200 dark:border-slate-800 transition-transform group-hover:scale-[1.02]">
                    <canvas 
                      ref={canvasRef} 
                      className="max-w-full rounded-lg w-[256px] h-[256px]"
                      style={{ imageRendering: 'pixelated' }}
                    />
                  </div>
                </div>
              </div>

              <div className="w-full p-8 space-y-4">
                <button
                  onClick={download}
                  className="w-full h-14 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl font-bold text-lg shadow-lg shadow-indigo-500/25 transition-all flex items-center justify-center gap-3"
                >
                  <Download className="w-6 h-6" />
                  {t("qr.gen.download")}
                </button>
                <p className="text-center text-xs text-slate-500 font-medium">
                  {size}x{size} px High Resolution Output
                </p>
              </div>
            </div>
          </div>
        </div>

        <Free />

        {/* Benefits section */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-8 py-12">
          <div className="p-8 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm">
            <div className="w-14 h-14 bg-indigo-100 dark:bg-indigo-900/30 rounded-2xl flex items-center justify-center mb-6">
              <Shield className="w-7 h-7 text-indigo-600 dark:text-indigo-400" />
            </div>
            <h3 className="text-xl font-bold mb-3">Privacy First</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
              No data tracking. Your URLs and text never leave your browser. All generation happens locally for maximum security.
            </p>
          </div>
          <div className="p-8 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm">
            <div className="w-14 h-14 bg-pink-100 dark:bg-pink-900/30 rounded-2xl flex items-center justify-center mb-6">
              <Zap className="w-7 h-7 text-pink-600 dark:text-pink-400" />
            </div>
            <h3 className="text-xl font-bold mb-3">Instant & Powerful</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
              Generate QR codes in real-time as you type. Choose from multiple error correction levels to ensure readability.
            </p>
          </div>
          <div className="p-8 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm">
            <div className="w-14 h-14 bg-amber-100 dark:bg-amber-900/30 rounded-2xl flex items-center justify-center mb-6">
              <Sparkles className="w-7 h-7 text-amber-600 dark:text-amber-400" />
            </div>
            <h3 className="text-xl font-bold mb-3">High-Res Export</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
              Download your QR codes in high-resolution PNG format, perfect for printing on business cards, posters, or flyers.
            </p>
          </div>
        </section>
      </div>
    </Layout>
  );
}
