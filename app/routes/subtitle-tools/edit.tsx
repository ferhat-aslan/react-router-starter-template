import { useState, useRef } from "react";
import Layout from "~/components/layout";
import SubtitleEditor from "~/components/subtitle-editor";
import { Download, Upload, Loader2, CheckCircle, AlertCircle } from "lucide-react";
import type { SubtitleEntry, SubtitleFormat } from "~/utils/subtitle-parser";
import { parseSubtitle, writeSubtitle, detectFormat } from "~/utils/subtitle-parser";
import type { Route } from "./+types/edit";
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
      title: t("subtitle.edit.meta.title"),
      description: t("subtitle.edit.meta.description"),
      url: "https://kleinbyte.com/subtitle-tools/edit",
      image: "https://kleinbyte.com/og-image-subtitle-edit.png",
    },
    [
      {
        "script:ld+json": webApp({
          "@type": "SoftwareApplication",
          name: t("subtitle.edit.meta.name"),
          url: "https://kleinbyte.com/subtitle-tools/edit",
          description: t("subtitle.edit.meta.app_desc"),
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

export default function SubtitleEdit() {
  const { t } = useTranslation();
  const [entries, setEntries] = useState<SubtitleEntry[]>([]);
  const [originalFormat, setOriginalFormat] = useState<SubtitleFormat | null>(null);
  const [outputFormat, setOutputFormat] = useState<SubtitleFormat>('srt');
  const [fileName, setFileName] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setError(null);
    setSuccess(null);

    try {
      const content = await file.text();
      const format = detectFormat(content);
      
      if (!format) {
        throw new Error('Unable to detect subtitle format. Please upload a valid SRT, VTT, or ASS file.');
      }

      const parsedEntries = parseSubtitle(content, format);
      
      if (parsedEntries.length === 0) {
        throw new Error('No subtitle entries found in the file.');
      }

      setEntries(parsedEntries);
      setOriginalFormat(format);
      setOutputFormat(format);
      setFileName(file.name.replace(/\.[^/.]+$/, ''));
      setSuccess(`Successfully loaded ${parsedEntries.length} subtitle entries from ${format.toUpperCase()} file.`);
    } catch (err: any) {
      console.error('Error parsing subtitle file:', err);
      setError(err.message || 'Failed to parse subtitle file');
      setEntries([]);
    }

    // Reset input
    e.target.value = '';
  };

  const handleDownload = () => {
    if (entries.length === 0) return;

    try {
      const content = writeSubtitle(entries, outputFormat);
      const blob = new Blob([content], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      
      const a = document.createElement('a');
      a.href = url;
      a.download = `${fileName || 'subtitle'}_edited.${outputFormat}`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      setSuccess(`Downloaded edited subtitle as ${outputFormat.toUpperCase()} file.`);
    } catch (err: any) {
      console.error('Error generating subtitle file:', err);
      setError(err.message || 'Failed to generate subtitle file');
    }
  };

  const handleReset = () => {
    setEntries([]);
    setOriginalFormat(null);
    setOutputFormat('srt');
    setFileName('');
    setError(null);
    setSuccess(null);
  };

  return (
    <Layout>
      <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-12">
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 dark:text-white">
            Subtitle Editor
          </h1>
          <p className="text-lg md:text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
            Edit subtitle files with box-by-box pagination. Modify timing and text content for SRT, VTT, and ASS formats.
          </p>
        </div>

        {/* Main Content */}
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Upload Section */}
          {entries.length === 0 && (
            <div className="bg-white dark:bg-neutral-900 border-2 border-dashed border-gray-300 dark:border-neutral-700 rounded-2xl p-12">
              <div className="text-center space-y-6">
                <Upload className="w-16 h-16 mx-auto text-gray-400 dark:text-gray-600" />
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                    Upload Subtitle File
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

          {/* Status Messages */}
          {error && (
            <div className="bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800 rounded-lg p-4 flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="text-red-800 dark:text-red-200">{error}</p>
              </div>
              <button
                onClick={() => setError(null)}
                className="text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-200"
              >
                ✕
              </button>
            </div>
          )}

          {success && (
            <div className="bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-800 rounded-lg p-4 flex items-start gap-3">
              <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="text-green-800 dark:text-green-200">{success}</p>
              </div>
              <button
                onClick={() => setSuccess(null)}
                className="text-green-600 dark:text-green-400 hover:text-green-800 dark:hover:text-green-200"
              >
                ✕
              </button>
            </div>
          )}

          {/* Editor */}
          {entries.length > 0 && (
            <>
              <div className="bg-white dark:bg-neutral-900 border border-gray-200 dark:border-neutral-700 rounded-2xl p-6">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
                      Editing: {fileName}
                    </h2>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                      Format: {originalFormat?.toUpperCase()} • {entries.length} entries
                    </p>
                  </div>
                  <button
                    onClick={handleReset}
                    className="px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
                  >
                    Upload New File
                  </button>
                </div>

                <SubtitleEditor
                  entries={entries}
                  onChange={setEntries}
                  showAddDelete={true}
                />
              </div>

              {/* Download Section */}
              <div className="bg-white dark:bg-neutral-900 border border-gray-200 dark:border-neutral-700 rounded-2xl p-6">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                  Download Edited Subtitle
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
            </>
          )}
        </div>
      </section>
    </Layout>
  );
}
