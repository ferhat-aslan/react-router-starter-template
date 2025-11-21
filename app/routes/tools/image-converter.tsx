import { useState } from "react";
import type { Route } from "./+types/image-converter";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Image Converter - Tinker" },
    { name: "description", content: "Convert images to different formats." },
  ];
}

export default function ImageConverter() {
  const [file, setFile] = useState<File | null>(null);
  const [format, setFormat] = useState("jpg");
  const [isConverting, setIsConverting] = useState(false);
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setDownloadUrl(null);
      setError(null);
    }
  };

  const handleConvert = async () => {
    if (!file) return;

    setIsConverting(true);
    setError(null);

    const formData = new FormData();
    formData.append("file", file);
    formData.append("format", format);

    try {
      const response = await fetch("http://localhost:8000/convert-image", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const errorData = (await response.json()) as any;
        throw new Error(errorData.error || "Conversion failed");
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      setDownloadUrl(url);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsConverting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white p-8 font-sans">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-4xl font-bold mb-8 bg-gradient-to-r from-pink-400 to-orange-500 bg-clip-text text-transparent">
          Image Converter
        </h1>

        <div className="bg-gray-900/50 border border-gray-800 rounded-2xl p-8 backdrop-blur-sm">
          <div className="mb-8">
            <label className="block text-sm font-medium text-gray-400 mb-2">
              Upload Image
            </label>
            <div className="relative border-2 border-dashed border-gray-700 rounded-xl p-8 text-center hover:border-pink-500 transition-colors">
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
              {file ? (
                <div className="text-pink-400 font-medium">
                  {file.name} ({(file.size / (1024 * 1024)).toFixed(2)} MB)
                </div>
              ) : (
                <div className="text-gray-500">
                  <span className="text-pink-400">Click to upload</span> or drag and drop
                  <br />
                  PNG, JPG, WEBP, etc.
                </div>
              )}
            </div>
          </div>

          <div className="mb-8">
            <label className="block text-sm font-medium text-gray-400 mb-2">
              Target Format
            </label>
            <div className="grid grid-cols-4 gap-4">
              {["jpg", "png", "webp", "avif"].map((fmt) => (
                <button
                  key={fmt}
                  onClick={() => setFormat(fmt)}
                  className={`py-3 px-4 rounded-xl font-medium transition-all ${
                    format === fmt
                      ? "bg-pink-600 text-white shadow-lg shadow-pink-500/20"
                      : "bg-gray-800 text-gray-400 hover:bg-gray-700"
                  }`}
                >
                  {fmt.toUpperCase()}
                </button>
              ))}
            </div>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-sm">
              {error}
            </div>
          )}

          <div className="flex items-center justify-end gap-4">
            {isConverting && (
              <div className="flex items-center gap-2 text-gray-400">
                <div className="w-4 h-4 border-2 border-pink-500 border-t-transparent rounded-full animate-spin" />
                Converting...
              </div>
            )}
            
            <button
              onClick={handleConvert}
              disabled={!file || isConverting}
              className={`px-6 py-2.5 rounded-lg font-medium transition-all ${
                !file || isConverting
                  ? "bg-gray-800 text-gray-500 cursor-not-allowed"
                  : "bg-pink-600 hover:bg-pink-500 text-white shadow-lg shadow-pink-500/20"
              }`}
            >
              {isConverting ? "Processing..." : "Convert Image"}
            </button>
          </div>

          {downloadUrl && (
            <div className="mt-8 p-6 bg-green-500/10 border border-green-500/20 rounded-xl animate-in fade-in slide-in-from-bottom-4">
              <h3 className="text-lg font-semibold text-green-400 mb-2">
                Conversion Complete!
              </h3>
              <p className="text-gray-400 text-sm mb-4">
                Your image is ready to download.
              </p>
              <div className="flex gap-4 items-center">
                <a
                  href={downloadUrl}
                  download={`converted_${file?.name.split('.')[0] || "image"}.${format}`}
                  className="px-4 py-2 bg-green-600 hover:bg-green-500 text-white rounded-lg font-medium text-sm transition-colors"
                >
                  Download Image
                </a>
                <img 
                  src={downloadUrl} 
                  alt="Preview" 
                  className="h-16 w-auto rounded border border-gray-700 bg-black/50 object-contain"
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
