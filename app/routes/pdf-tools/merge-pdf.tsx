import { useState } from "react";
import { Upload, FileText, Download, AlertCircle, CheckCircle, Loader2, Plus, Trash2 } from "lucide-react";
import { uploadToR2, getDownloadUrl } from "~/utils/r2-upload";
import type { Route } from "./+types/merge-pdf";
import { useI18n } from "~/i18n/context";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Merge PDF - Tinker" },
    { name: "description", content: "Combine multiple PDF files into one." },
  ];
}

export default function MergePdf() {
  const  t  = useI18n();
  const [files, setFiles] = useState<File[]>([]);
  const [status, setStatus] = useState<"idle" | "uploading" | "processing" | "success" | "error">("idle");
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFiles((prev) => [...prev, ...Array.from(e.target.files || [])]);
      setStatus("idle");
      setError(null);
      setDownloadUrl(null);
    }
  };

  const removeFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (files.length < 2) {
      setError("Please select at least 2 PDF files to merge.");
      return;
    }

    setStatus("uploading");
    setError(null);

    try {
      // 1. Upload all files to R2
      const fileKeys = await Promise.all(files.map(file => uploadToR2(file)));
      
      setStatus("processing");

      // 2. Send keys to backend
      const response = await fetch("http://localhost:8000/merge-pdf", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ file_keys: fileKeys }),
      });

      if (!response.ok) {
        const errorData = await response.json() as any;
        throw new Error(errorData.error || "Merge failed");
      }

      const data = await response.json() as any;
      
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
        <h1 className="text-4xl font-bold tracking-tight bg-gradient-to-r from-red-600 to-orange-600 bg-clip-text text-transparent">
          {t("pdfTools.merge.title")}
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          {t("pdfTools.merge.description")}
        </p>
      </div>

      <div className="grid gap-8 md:grid-cols-2">
        {/* Upload Section */}
        <div className="space-y-6">
          <div className="bg-card border rounded-xl p-6 shadow-sm">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <Upload className="w-5 h-5 text-red-500" />
              Upload PDFs
            </h2>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="relative group">
                <input
                  type="file"
                  accept=".pdf"
                  multiple
                  onChange={handleFileChange}
                  className="hidden"
                  id="pdf-upload"
                />
                <label
                  htmlFor="pdf-upload"
                  className={`
                    flex flex-col items-center justify-center w-full h-32
                    border-2 border-dashed rounded-lg cursor-pointer 
                    transition-all duration-200
                    border-muted-foreground/25 hover:border-red-500 hover:bg-muted/50
                  `}
                >
                  <div className="flex flex-col items-center justify-center pt-5 pb-6 text-center px-4">
                    <Plus className="w-8 h-8 text-muted-foreground mb-2 group-hover:text-red-500 transition-colors" />
                    <p className="text-sm text-foreground font-medium">
                      Add PDF Files
                    </p>
                  </div>
                </label>
              </div>

              {files.length > 0 && (
                <div className="space-y-2 max-h-60 overflow-y-auto pr-2">
                  {files.map((file, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                      <div className="flex items-center gap-3 overflow-hidden">
                        <FileText className="w-5 h-5 text-red-500 shrink-0" />
                        <span className="text-sm truncate">{file.name}</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeFile(index)}
                        className="text-muted-foreground hover:text-destructive transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              <button
                type="submit"
                disabled={files.length < 2 || status === "uploading" || status === "processing"}
                className={`
                  w-full py-2.5 px-4 rounded-lg font-medium flex items-center justify-center gap-2
                  transition-all duration-200
                  ${files.length < 2 || status === "uploading" || status === "processing"
                    ? "bg-muted text-muted-foreground cursor-not-allowed"
                    : "bg-red-600 hover:bg-red-700 text-white shadow-md hover:shadow-lg"
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
                    Merging...
                  </>
                ) : (
                  "Merge PDFs"
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
                  <FileText className="w-12 h-12 mx-auto mb-3 opacity-20" />
                  <p>Add at least 2 PDF files to merge</p>
                </div>
              )}

              {(status === "uploading" || status === "processing") && (
                <div className="space-y-4 w-full max-w-xs">
                  <Loader2 className="w-12 h-12 mx-auto text-red-500 animate-spin" />
                  <div>
                    <p className="font-medium text-foreground">
                      {status === "uploading" ? "Uploading files..." : "Merging PDFs..."}
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
                  <p className="font-medium">Merge Failed</p>
                  <p className="text-sm opacity-90">{error}</p>
                </div>
              )}

              {status === "success" && downloadUrl && (
                <div className="space-y-6 w-full">
                  <div className="text-green-600 dark:text-green-500">
                    <CheckCircle className="w-16 h-16 mx-auto mb-3" />
                    <p className="text-lg font-semibold">Merge Complete!</p>
                  </div>
                  
                  <a
                    href={downloadUrl}
                    download
                    className="inline-flex items-center justify-center gap-2 w-full py-3 px-4 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium shadow-md transition-all hover:scale-[1.02]"
                  >
                    <Download className="w-5 h-5" />
                    Download Merged PDF
                  </a>
                  
                  <button 
                    onClick={() => {
                      setFiles([]);
                      setStatus("idle");
                      setDownloadUrl(null);
                    }}
                    className="text-sm text-muted-foreground hover:text-foreground underline"
                  >
                    Merge more files
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
