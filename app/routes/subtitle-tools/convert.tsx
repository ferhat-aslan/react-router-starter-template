import { useState, useRef } from "react";
import Layout from "~/components/layout";
import SubtitleEditor from "~/components/subtitle-editor";
import { Download, Upload, Copy, Languages, ArrowRight } from "lucide-react";
import type { SubtitleEntry, SubtitleFormat } from "~/utils/subtitle-parser";
import { parseSubtitle, writeSubtitle, detectFormat } from "~/utils/subtitle-parser";
import type { Route } from "./+types/convert";
import { useTranslation, translations, type Locale } from "~/utils/route-utils";
import { generateMeta } from "@forge42/seo-tools/remix/metadata";
import { webApp } from "@forge42/seo-tools/structured-data/web-app";
import { type MetaFunction } from "react-router";

export const meta: MetaFunction = ({ location }) => {
  const locale: Locale = (location.pathname.split("/")?.[1] as Locale) || "en";
  const messages = translations[locale] ?? translations.en;
  const t = (key: string) => messages[key] ?? key;

  const meta = generateMeta(
    {
      title: t("subtitle.convert.meta.title"),
      description: t("subtitle.convert.meta.description"),
      url: "https://kleinbyte.com/subtitle-tools/convert",
      image: "https://kleinbyte.com/og-image-subtitle-convert.png",
    },
    [
      {
        "script:ld+json": webApp({
          "@type": "SoftwareApplication",
          name: t("subtitle.convert.meta.name"),
          url: "https://kleinbyte.com/subtitle-tools/convert",
          description: t("subtitle.convert.meta.app_desc"),
          applicationCategory: "MultimediaApplication",
          operatingSystem: "Any",
          offers: {
            "@type": "Offer",
            price: "0",
            priceCurrency: "USD",
          },
        }),
      },
    ]
  );
  return meta;
};

export default function SubtitleConvert() {
  const { t } = useTranslation();
  const [leftEntries, setLeftEntries] = useState<SubtitleEntry[]>([]);
  const [rightEntries, setRightEntries] = useState<SubtitleEntry[]>([]);
  const [leftFormat, setLeftFormat] = useState<SubtitleFormat | null>(null);
  const [outputFormat, setOutputFormat] = useState<SubtitleFormat>('srt');
  const [fileName, setFileName] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const content = await file.text();
      const format = detectFormat(content);
      
      if (!format) {
        alert('Unable to detect subtitle format. Please upload a valid SRT, VTT, or ASS file.');
        return;
      }

      const parsedEntries = parseSubtitle(content, format);
      
      if (parsedEntries.length === 0) {
        alert('No subtitle entries found in the file.');
        return;
      }

      setLeftEntries(parsedEntries);
      setLeftFormat(format);
      setOutputFormat(format);
      setFileName(file.name.replace(/\.[^/.]+$/, ''));
      setRightEntries([]);
    } catch (err: any) {
      console.error('Error parsing subtitle file:', err);
      alert(err.message || 'Failed to parse subtitle file');
    }

    e.target.value = '';
  };

  const handleCopyToRight = () => {
    if (leftEntries.length === 0) return;
    
    // Deep copy the entries
    const copiedEntries = leftEntries.map(entry => ({ ...entry }));
    setRightEntries(copiedEntries);
  };

  const handleTranslate = () => {
    // Placeholder for translation functionality
    // In a real implementation, this would call a translation API
    alert('Translation feature: This would integrate with a translation API like Google Translate or DeepL. For now, use "Copy to Right" and manually edit the text.');
  };

  const handleDownload = () => {
    if (rightEntries.length === 0) {
      alert('No translated subtitle to download. Please copy or create subtitle entries on the right panel.');
      return;
    }

    try {
      const content = writeSubtitle(rightEntries, outputFormat);
      const blob = new Blob([content], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      
      const a = document.createElement('a');
      a.href = url;
      a.download = `${fileName || 'subtitle'}_translated.${outputFormat}`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (err: any) {
      console.error('Error generating subtitle file:', err);
      alert(err.message || 'Failed to generate subtitle file');
    }
  };

  const handleReset = () => {
    setLeftEntries([]);
    setRightEntries([]);
    setLeftFormat(null);
    setOutputFormat('srt');
    setFileName('');
  };

  return (
    <Layout>
      <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-12">
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 dark:text-white">
            Subtitle Converter & Translator
          </h1>
          <p className="text-lg md:text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
            Convert between formats and translate subtitles with side-by-side editing.
          </p>
        </div>

        {/* Main Content */}
        <div className="max-w-7xl mx-auto space-y-8">
          {/* Upload Section */}
          {leftEntries.length === 0 && (
            <div className="bg-white dark:bg-neutral-900 border-2 border-dashed border-gray-300 dark:border-neutral-700 rounded-2xl p-12">
              <div className="text-center space-y-6">
                <Upload className="w-16 h-16 mx-auto text-gray-400 dark:text-gray-600" />
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                    Upload Original Subtitle
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    Support for SRT, VTT, and ASS formats
                  </p>
                </div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".srt,.vtt,.ass"
                  onChange={handleFileUpload}
                  className="hidden"
                />
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="px-8 py-4 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-all duration-300 hover:scale-105 active:scale-95 shadow-lg"
                >
                  Choose File
                </button>
              </div>
            </div>
          )}

          {/* Side-by-Side Editor */}
          {leftEntries.length > 0 && (
            <>
              {/* File Info and Actions */}
              <div className="bg-white dark:bg-neutral-900 border border-gray-200 dark:border-neutral-700 rounded-2xl p-6">
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-6">
                  <div>
                    <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
                      {fileName}
                    </h2>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                      Format: {leftFormat?.toUpperCase()} • {leftEntries.length} entries
                    </p>
                  </div>
                  <button
                    onClick={handleReset}
                    className="px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
                  >
                    Upload New File
                  </button>
                </div>

                {/* Copy and Translate Buttons */}
                <div className="flex flex-col sm:flex-row gap-4">
                  <button
                    onClick={handleCopyToRight}
                    className="flex-1 px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-all duration-300 flex items-center justify-center gap-2"
                  >
                    <Copy className="w-5 h-5" />
                    Copy to Right Panel
                  </button>
                  <button
                    onClick={handleTranslate}
                    className="flex-1 px-6 py-3 bg-purple-600 text-white font-semibold rounded-lg hover:bg-purple-700 transition-all duration-300 flex items-center justify-center gap-2"
                  >
                    <Languages className="w-5 h-5" />
                    Translate (Coming Soon)
                  </button>
                </div>
              </div>

              {/* Side-by-Side Panels */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Left Panel - Original */}
                <div className="bg-white dark:bg-neutral-900 border border-gray-200 dark:border-neutral-700 rounded-2xl p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                      Original Subtitle
                    </h3>
                    <span className="px-3 py-1 bg-blue-100 dark:bg-blue-950/30 text-blue-700 dark:text-blue-300 text-sm font-medium rounded-full">
                      {leftFormat?.toUpperCase()}
                    </span>
                  </div>
                  <SubtitleEditor
                    entries={leftEntries}
                    onChange={setLeftEntries}
                    readOnly={false}
                    showAddDelete={false}
                  />
                </div>

                {/* Center Arrow (Desktop) */}
                <div className="hidden lg:flex absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10">
                  <div className="bg-white dark:bg-neutral-800 border-2 border-gray-300 dark:border-neutral-600 rounded-full p-3 shadow-lg">
                    <ArrowRight className="w-6 h-6 text-gray-600 dark:text-gray-400" />
                  </div>
                </div>

                {/* Right Panel - Translated */}
                <div className="bg-white dark:bg-neutral-900 border border-gray-200 dark:border-neutral-700 rounded-2xl p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                      Translated Subtitle
                    </h3>
                    <span className="px-3 py-1 bg-green-100 dark:bg-green-950/30 text-green-700 dark:text-green-300 text-sm font-medium rounded-full">
                      {rightEntries.length > 0 ? 'Editing' : 'Empty'}
                    </span>
                  </div>
                  {rightEntries.length > 0 ? (
                    <SubtitleEditor
                      entries={rightEntries}
                      onChange={setRightEntries}
                      readOnly={false}
                      showAddDelete={true}
                    />
                  ) : (
                    <div className="text-center py-12 text-gray-500 dark:text-gray-400">
                      <p className="mb-4">No subtitle entries yet</p>
                      <p className="text-sm">Click "Copy to Right Panel" to start editing</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Download Section */}
              {rightEntries.length > 0 && (
                <div className="bg-white dark:bg-neutral-900 border border-gray-200 dark:border-neutral-700 rounded-2xl p-6">
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                    Download Translated Subtitle
                  </h3>
                  <div className="flex flex-col sm:flex-row gap-4">
                    <div className="flex-1">
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Output Format
                      </label>
                      <select
                        value={outputFormat}
                        onChange={(e) => setOutputFormat(e.target.value as SubtitleFormat)}
                        className="w-full px-4 py-2 border border-gray-300 dark:border-neutral-600 rounded-lg bg-white dark:bg-neutral-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value="srt">SRT (SubRip)</option>
                        <option value="vtt">VTT (WebVTT)</option>
                        <option value="ass">ASS (Advanced SubStation)</option>
                      </select>
                    </div>
                    <div className="flex items-end">
                      <button
                        onClick={handleDownload}
                        className="px-8 py-2 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition-all duration-300 hover:scale-105 active:scale-95 flex items-center gap-2 shadow-lg"
                      >
                        <Download className="w-5 h-5" />
                        Download
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </section>
    </Layout>
  );
}
