import { useState } from "react";
import type { Route } from "./+types/video-compressor";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Video Compressor - Tinker" },
    { name: "description", content: "Compress your videos efficiently." },
  ];
}

export default function VideoCompressor() {
  const [file, setFile] = useState<File | null>(null);
  const [isCompressing, setIsCompressing] = useState(false);
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setDownloadUrl(null);
      setError(null);
    }
  };

  const handleCompress = async () => {
    if (!file) return;

    setIsCompressing(true);
    setError(null);

    const formData = new FormData();
    formData.append("file", file);

    try {
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsCompressing(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white p-8 font-sans">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-4xl font-bold mb-8 bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
          Video Compressor
        </h1>

        <div className="bg-gray-900/50 border border-gray-800 rounded-2xl p-8 backdrop-blur-sm">
          <div className="mb-8">
            <label className="block text-sm font-medium text-gray-400 mb-2">
              Upload Video
            </label>
            <div className="relative border-2 border-dashed border-gray-700 rounded-xl p-8 text-center hover:border-blue-500 transition-colors">
              <input
                type="file"
                accept="video/*"
                onChange={handleFileChange}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
              {file ? (
                <div className="text-blue-400 font-medium">
                  {file.name} ({(file.size / (1024 * 1024)).toFixed(2)} MB)
                </div>
              ) : (
                <div className="text-gray-500">
                  <span className="text-blue-400">Click to upload</span> or drag and drop
                  <br />
                  MP4, MOV, AVI, MKV
                </div>
              )}
            </div>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-sm">
              {error}
            </div>
          )}

          <div className="flex items-center justify-end gap-4">
            {isCompressing && (
              <div className="flex items-center gap-2 text-gray-400">
                <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
                Compressing...
              </div>
            )}
            
            <button
              onClick={handleCompress}
              disabled={!file || isCompressing}
              className={`px-6 py-2.5 rounded-lg font-medium transition-all ${
                !file || isCompressing
                  ? "bg-gray-800 text-gray-500 cursor-not-allowed"
                  : "bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-500/20"
              }`}
            >
              {isCompressing ? "Processing..." : "Compress Video"}
            </button>
          </div>

          {downloadUrl && (
            <div className="mt-8 p-6 bg-green-500/10 border border-green-500/20 rounded-xl animate-in fade-in slide-in-from-bottom-4">
              <h3 className="text-lg font-semibold text-green-400 mb-2">
                Compression Complete!
              </h3>
              <p className="text-gray-400 text-sm mb-4">
                Your video is ready to download.
              </p>
              <div className="flex gap-4">
                <a
                  href={downloadUrl}
                  download={`compressed_${file?.name || "video.mp4"}`}
                  className="px-4 py-2 bg-green-600 hover:bg-green-500 text-white rounded-lg font-medium text-sm transition-colors"
                >
                  Download Video
                </a>
                <video 
                  src={downloadUrl} 
                  controls 
                  className="h-10 w-auto rounded border border-gray-700 bg-black"
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
