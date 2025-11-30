import { useState, useRef } from "react";
import Layout from "~/components/layout";
import { Download, Upload, Merge as MergeIcon, Plus, Minus } from "lucide-react";
import type { SubtitleEntry, SubtitleFormat } from "~/utils/subtitle-parser";
import { parseSubtitle, writeSubtitle, detectFormat } from "~/utils/subtitle-parser";
import type { Route } from "./+types/merge";
import { useTranslation } from "~/i18n/context";
import { generateMeta } from "@forge42/seo-tools/remix/metadata";
import { webApp } from "@forge42/seo-tools/structured-data/web-app";
import { type MetaFunction } from "react-router";

export const meta: MetaFunction = () => {
  const meta = generateMeta(
    {
      title: "Free Subtitle Merger | Merge SRT, VTT, ASS Files | Kleinbyte",
      description:
        "Merge two subtitle files online with time offset controls. Perfect for dual subtitles. Support for SRT, VTT, and ASS formats.",
      url: "https://kleinbyte.com/subtitle-tools/merge",
      image: "https://kleinbyte.com/og-image-subtitle-merge.png",
    },
    [
      {
        "script:ld+json": webApp({
          "@type": "SoftwareApplication",
          name: "Kleinbyte Subtitle Merger",
          url: "https://kleinbyte.com/subtitle-tools/merge",
          description: "Merge subtitle files with time offset controls",
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

// Helper function to parse time to milliseconds
function timeToMs(timeStr: string): number {
  const parts = timeStr.replace(',', '.').split(':');
  const hours = parseInt(parts[0]);
  const minutes = parseInt(parts[1]);
  const secondsParts = parts[2].split('.');
  const seconds = parseInt(secondsParts[0]);
  const milliseconds = parseInt(secondsParts[1] || '0');
  return hours * 3600000 + minutes * 60000 + seconds * 1000 + milliseconds;
}

// Helper function to format milliseconds to time string
function msToTime(ms: number, format: 'srt' | 'vtt' | 'ass'): string {
  const hours = Math.floor(ms / 3600000);
  const minutes = Math.floor((ms % 3600000) / 60000);
  const seconds = Math.floor((ms % 60000) / 1000);
  const remainder = ms % 1000;

  if (format === 'srt') {
    return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')},${String(remainder).padStart(3, '0')}`;
  } else if (format === 'vtt') {
    return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}.${String(remainder).padStart(3, '0')}`;
  } else {
    const centiseconds = Math.floor(remainder / 10);
    return `${hours}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}.${String(centiseconds).padStart(2, '0')}`;
  }
}

export default function SubtitleMerge() {
  const { t } = useTranslation();
  const [file1Entries, setFile1Entries] = useState<SubtitleEntry[]>([]);
  const [file2Entries, setFile2Entries] = useState<SubtitleEntry[]>([]);
  const [file1Format, setFile1Format] = useState<SubtitleFormat | null>(null);
  const [file2Format, setFile2Format] = useState<SubtitleFormat | null>(null);
  const [file1Name, setFile1Name] = useState<string>('');
  const [file2Name, setFile2Name] = useState<string>('');
  const [offset1, setOffset1] = useState<number>(0); // in seconds
  const [offset2, setOffset2] = useState<number>(0); // in seconds
  const [outputFormat, setOutputFormat] = useState<SubtitleFormat>('srt');
  const file1InputRef = useRef<HTMLInputElement>(null);
  const file2InputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = async (fileNumber: 1 | 2, e: React.ChangeEvent<HTMLInputElement>) => {
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

      if (fileNumber === 1) {
        setFile1Entries(parsedEntries);
        setFile1Format(format);
        setFile1Name(file.name.replace(/\.[^/.]+$/, ''));
        setOutputFormat(format);
      } else {
        setFile2Entries(parsedEntries);
        setFile2Format(format);
        setFile2Name(file.name.replace(/\.[^/.]+$/, ''));
      }
    } catch (err: any) {
      console.error('Error parsing subtitle file:', err);
      alert(err.message || 'Failed to parse subtitle file');
    }

    e.target.value = '';
  };

  const handleMerge = (): SubtitleEntry[] => {
    if (file1Entries.length === 0 && file2Entries.length === 0) return [];

    const mergedEntries: SubtitleEntry[] = [];
    
    // Apply offset to file 1 entries
    const offsetFile1 = file1Entries.map(entry => {
      const startMs = timeToMs(entry.startTime) + (offset1 * 1000);
      const endMs = timeToMs(entry.endTime) + (offset1 * 1000);
      return {
        ...entry,
        startTime: msToTime(startMs, outputFormat),
        endTime: msToTime(endMs, outputFormat),
      };
    });

    // Apply offset to file 2 entries
    const offsetFile2 = file2Entries.map(entry => {
      const startMs = timeToMs(entry.startTime) + (offset2 * 1000);
      const endMs = timeToMs(entry.endTime) + (offset2 * 1000);
      return {
        ...entry,
        startTime: msToTime(startMs, outputFormat),
        endTime: msToTime(endMs, outputFormat),
      };
    });

    // Merge and sort by start time
    const combined = [...offsetFile1, ...offsetFile2];
    combined.sort((a, b) => timeToMs(a.startTime) - timeToMs(b.startTime));

    // Reindex
    combined.forEach((entry, idx) => {
      entry.index = idx + 1;
    });

    return combined;
  };

  const handleDownload = () => {
    const merged = handleMerge();
    
    if (merged.length === 0) {
      alert('No subtitle entries to merge. Please upload at least one subtitle file.');
      return;
    }

    try {
      const content = writeSubtitle(merged, outputFormat);
      const blob = new Blob([content], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      
      const a = document.createElement('a');
      a.href = url;
      a.download = `merged_subtitle.${outputFormat}`;
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
    setFile1Entries([]);
    setFile2Entries([]);
    setFile1Format(null);
    setFile2Format(null);
    setFile1Name('');
    setFile2Name('');
    setOffset1(0);
    setOffset2(0);
    setOutputFormat('srt');
  };

  const mergedPreview = handleMerge();

  return (
    <Layout>
      <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-12">
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 dark:text-white">
            Subtitle Merger
          </h1>
          <p className="text-lg md:text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
            Merge two subtitle files with time offset controls. Perfect for dual subtitles.
          </p>
        </div>

        {/* Main Content */}
        <div className="max-w-6xl mx-auto space-y-8">
          {/* Upload Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* File 1 Upload */}
            <div className="bg-white dark:bg-neutral-900 border-2 border-dashed border-blue-300 dark:border-blue-700 rounded-2xl p-8">
              <div className="text-center space-y-4">
                <Upload className="w-12 h-12 mx-auto text-blue-600 dark:text-blue-400" />
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                    First Subtitle File
                  </h3>
                  {file1Name ? (
                    <div className="space-y-2">
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {file1Name}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-500">
                        {file1Format?.toUpperCase()} • {file1Entries.length} entries
                      </p>
                    </div>
                  ) : (
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      No file selected
                    </p>
                  )}
                </div>
                <input
                  ref={file1InputRef}
                  type="file"
                  accept=".srt,.vtt,.ass"
                  onChange={(e) => handleFileUpload(1, e)}
                  className="hidden"
                />
                <button
                  onClick={() => file1InputRef.current?.click()}
                  className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-all duration-300"
                >
                  {file1Name ? 'Change File' : 'Choose File'}
                </button>
              </div>
            </div>

            {/* File 2 Upload */}
            <div className="bg-white dark:bg-neutral-900 border-2 border-dashed border-green-300 dark:border-green-700 rounded-2xl p-8">
              <div className="text-center space-y-4">
                <Upload className="w-12 h-12 mx-auto text-green-600 dark:text-green-400" />
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                    Second Subtitle File
                  </h3>
                  {file2Name ? (
                    <div className="space-y-2">
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {file2Name}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-500">
                        {file2Format?.toUpperCase()} • {file2Entries.length} entries
                      </p>
                    </div>
                  ) : (
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      No file selected
                    </p>
                  )}
                </div>
                <input
                  ref={file2InputRef}
                  type="file"
                  accept=".srt,.vtt,.ass"
                  onChange={(e) => handleFileUpload(2, e)}
                  className="hidden"
                />
                <button
                  onClick={() => file2InputRef.current?.click()}
                  className="px-6 py-3 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition-all duration-300"
                >
                  {file2Name ? 'Change File' : 'Choose File'}
                </button>
              </div>
            </div>
          </div>

          {/* Time Offset Controls */}
          {(file1Entries.length > 0 || file2Entries.length > 0) && (
            <div className="bg-white dark:bg-neutral-900 border border-gray-200 dark:border-neutral-700 rounded-2xl p-6">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
                Time Offset Controls
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* File 1 Offset */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                    First File Offset (seconds)
                  </label>
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => setOffset1(Math.max(0, offset1 - 1))}
                      className="p-2 bg-gray-200 dark:bg-neutral-700 rounded-lg hover:bg-gray-300 dark:hover:bg-neutral-600 transition-colors"
                    >
                      <Minus className="w-5 h-5 text-gray-700 dark:text-gray-300" />
                    </button>
                    <input
                      type="number"
                      value={offset1}
                      onChange={(e) => setOffset1(Math.max(0, parseFloat(e.target.value) || 0))}
                      step="0.1"
                      className="flex-1 px-4 py-2 text-center border border-gray-300 dark:border-neutral-600 rounded-lg bg-white dark:bg-neutral-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    <button
                      onClick={() => setOffset1(offset1 + 1)}
                      className="p-2 bg-gray-200 dark:bg-neutral-700 rounded-lg hover:bg-gray-300 dark:hover:bg-neutral-600 transition-colors"
                    >
                      <Plus className="w-5 h-5 text-gray-700 dark:text-gray-300" />
                    </button>
                  </div>
                </div>

                {/* File 2 Offset */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                    Second File Offset (seconds)
                  </label>
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => setOffset2(Math.max(0, offset2 - 1))}
                      className="p-2 bg-gray-200 dark:bg-neutral-700 rounded-lg hover:bg-gray-300 dark:hover:bg-neutral-600 transition-colors"
                    >
                      <Minus className="w-5 h-5 text-gray-700 dark:text-gray-300" />
                    </button>
                    <input
                      type="number"
                      value={offset2}
                      onChange={(e) => setOffset2(Math.max(0, parseFloat(e.target.value) || 0))}
                      step="0.1"
                      className="flex-1 px-4 py-2 text-center border border-gray-300 dark:border-neutral-600 rounded-lg bg-white dark:bg-neutral-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    <button
                      onClick={() => setOffset2(offset2 + 1)}
                      className="p-2 bg-gray-200 dark:bg-neutral-700 rounded-lg hover:bg-gray-300 dark:hover:bg-neutral-600 transition-colors"
                    >
                      <Plus className="w-5 h-5 text-gray-700 dark:text-gray-300" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Preview */}
          {mergedPreview.length > 0 && (
            <div className="bg-white dark:bg-neutral-900 border border-gray-200 dark:border-neutral-700 rounded-2xl p-6">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                Merge Preview
              </h3>
              <div className="bg-gray-50 dark:bg-neutral-800 rounded-lg p-4 max-h-96 overflow-y-auto">
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                  Total entries: {mergedPreview.length}
                </p>
                <div className="space-y-2">
                  {mergedPreview.slice(0, 10).map((entry, idx) => (
                    <div key={idx} className="text-xs font-mono text-gray-700 dark:text-gray-300 border-b border-gray-200 dark:border-neutral-700 pb-2">
                      <div className="flex justify-between">
                        <span>#{entry.index}</span>
                        <span>{entry.startTime} --&gt; {entry.endTime}</span>
                      </div>
                      <div className="mt-1 text-gray-600 dark:text-gray-400">{entry.text}</div>
                    </div>
                  ))}
                  {mergedPreview.length > 10 && (
                    <p className="text-xs text-gray-500 dark:text-gray-500 text-center pt-2">
                      ... and {mergedPreview.length - 10} more entries
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Download Section */}
          {mergedPreview.length > 0 && (
            <div className="bg-white dark:bg-neutral-900 border border-gray-200 dark:border-neutral-700 rounded-2xl p-6">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                Download Merged Subtitle
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
                <div className="flex items-end gap-4">
                  <button
                    onClick={handleDownload}
                    className="px-8 py-2 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition-all duration-300 hover:scale-105 active:scale-95 flex items-center gap-2 shadow-lg"
                  >
                    <Download className="w-5 h-5" />
                    Download
                  </button>
                  <button
                    onClick={handleReset}
                    className="px-8 py-2 bg-gray-200 dark:bg-neutral-800 text-gray-900 dark:text-white font-semibold rounded-lg hover:bg-gray-300 dark:hover:bg-neutral-700 transition-all duration-300"
                  >
                    Reset
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>
    </Layout>
  );
}
