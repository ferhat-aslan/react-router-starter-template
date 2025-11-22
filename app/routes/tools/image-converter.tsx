import { useState } from "react";
import { Upload, Image as ImageIcon, Download, AlertCircle, CheckCircle, Loader2, RefreshCw } from "lucide-react";
import { uploadToR2, getDownloadUrl } from "~/utils/r2-upload";
import type { Route } from "./+types/image-converter";
import { useI18n } from "~/i18n/context";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Image Converter - Tinker" },
    { name: "description", content: "Convert images between formats (PNG, JPG, WEBP)." },
  ];
}

export default function ImageConverter() {
  const t = useI18n();
  const [file, setFile] = useState<File | null>(null);
  const [format, setFormat] = useState<string>("png");
  const [status, setStatus] = useState<"idle" | "uploading" | "processing" | "success" | "error">("idle");
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setStatus("idle");
      setError(null);
      setDownloadUrl(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return;

    setStatus("uploading");
    setError(null);

    try {
      // 1. Upload to R2
      const key = await uploadToR2(file);
      
      setStatus("processing");

      // 2. Send key to backend
      const response = await fetch("http://localhost:8000/convert-image", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ 
          file_key: key,
          format: format 
        }),
      });

      if (!response.ok) {
        const errorData = await response.json() as any;
        throw new Error(errorData.error || "Conversion failed");
      }

      const data:any = await response.json();
      
      // 3. Get download URL
      const url = getDownloadUrl(data.result_key);
      setDownloadUrl(url);
      setStatus("success");
    } catch (err: any) {
      console.error(err);
      setError(err.message || "An unexpected error occurred");
      setStatus("error");
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold tracking-tight bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
          {t("imageTools.converter.title")}
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          {t("imageTools.converter.description")}
        </p>
      </div>

      <div className="grid gap-8 md:grid-cols-2">
        {/* Upload Section */}
        <div className="space-y-6">
          <div className="bg-card border rounded-xl p-6 shadow-sm">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <Upload className="w-5 h-5 text-purple-500" />
              Upload Image
            </h2>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="relative group">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                  id="image-upload"
                />
                <label
                  htmlFor="image-upload"
                  className={`
                    flex flex-col items-center justify-center w-full h-48 
                    border-2 border-dashed rounded-lg cursor-pointer 
                    transition-all duration-200
                    ${file 
                      ? "border-purple-500 bg-purple-50/50 dark:bg-purple-950/20" 
                      : "border-muted-foreground/25 hover:border-purple-500 hover:bg-muted/50"
                    }
                  `}
                >
                  <div className="flex flex-col items-center justify-center pt-5 pb-6 text-center px-4">
                    {file ? (
                      <>
                        <ImageIcon className="w-10 h-10 text-purple-500 mb-3" />
                        <p className="text-sm font-medium text-foreground truncate max-w-full">
                          {file.name}
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                          {(file.size / (1024 * 1024)).toFixed(2)} MB
                        </p>
                      </>
                    ) : (
                      <>
                        <Upload className="w-10 h-10 text-muted-foreground mb-3 group-hover:text-purple-500 transition-colors" />
                        <p className="text-sm text-foreground font-medium">
                          Click to upload or drag and drop
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                          JPG, PNG, WEBP, GIF
                        </p>
                      </>
                    )}
                  </div>
                </label>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Convert to:</label>
                <select
                  value={format}
                  onChange={(e) => setFormat(e.target.value)}
                  className="w-full p-2.5 rounded-lg border bg-background"
                >
                  <option value="png">PNG</option>
                  <option value="jpg">JPG</option>
                  <option value="webp">WEBP</option>
                  <option value="gif">GIF</option>
                </select>
              </div>

              <button
                type="submit"
                disabled={!file || status === "uploading" || status === "processing"}
                className={`
                  w-full py-2.5 px-4 rounded-lg font-medium flex items-center justify-center gap-2
                  transition-all duration-200
                  ${!file || status === "uploading" || status === "processing"
                    ? "bg-muted text-muted-foreground cursor-not-allowed"
                    : "bg-purple-600 hover:bg-purple-700 text-white shadow-md hover:shadow-lg"
                  }
                `}
              >
                {status === "uploading" ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Uploading...
                  </>
                ) : status === "processing" ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Converting...
                  </>
                ) : (
                  "Convert Image"
                )}
              </button>
            </form>
          </div>
        </div>

        {/* Status/Result Section */}
        <div className="space-y-6">
          <div className="bg-card border rounded-xl p-6 shadow-sm h-full flex flex-col">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <Download className="w-5 h-5 text-green-500" />
              Result
            </h2>

            <div className="flex-1 flex flex-col items-center justify-center text-center p-4">
              {status === "idle" && (
                <div className="text-muted-foreground">
                  <RefreshCw className="w-12 h-12 mx-auto mb-3 opacity-20" />
                  <p>Upload an image to start conversion</p>
                </div>
              )}

              {(status === "uploading" || status === "processing") && (
                <div className="space-y-4 w-full max-w-xs">
                  <Loader2 className="w-12 h-12 mx-auto text-purple-500 animate-spin" />
                  <div>
                    <p className="font-medium text-foreground">
                      {status === "uploading" ? "Uploading image..." : "Converting format..."}
                    </p>
                    <p className="text-sm text-muted-foreground mt-1">
                      Please wait...
                    </p>
                  </div>
                </div>
              )}

              {status === "error" && (
                <div className="text-destructive space-y-3">
                  <AlertCircle className="w-12 h-12 mx-auto" />
                  <p className="font-medium">Conversion Failed</p>
                  <p className="text-sm opacity-90">{error}</p>
                </div>
              )}

              {status === "success" && downloadUrl && (
                <div className="space-y-6 w-full">
                  <div className="text-green-600 dark:text-green-500">
                    <CheckCircle className="w-16 h-16 mx-auto mb-3" />
                    <p className="text-lg font-semibold">Conversion Complete!</p>
                  </div>
                  
                  <a
                    href={downloadUrl}
                    download
                    className="inline-flex items-center justify-center gap-2 w-full py-3 px-4 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium shadow-md transition-all hover:scale-[1.02]"
                  >
                    <Download className="w-5 h-5" />
                    Download Image
                  </a>
                  
                  <button 
                    onClick={() => {
                      setFile(null);
                      setStatus("idle");
                      setDownloadUrl(null);
                    }}
                    className="text-sm text-muted-foreground hover:text-foreground underline"
                  >
                    Convert another image
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
