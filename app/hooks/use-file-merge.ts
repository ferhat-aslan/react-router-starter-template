import { useState } from "react";
import { apiClient } from "~/lib/api-client";

export function useFileMerge() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<Error | null>(null);

    const mergeFiles = async (files: File[]) => {
        if (!files || files.length < 2) return;

        setLoading(true);
        setError(null);

        try {
            const form = new FormData();
            files.forEach((file) => {
                form.append("files", file);
            });

            const response = await apiClient.request("/merge-pdf", {
                method: "POST",
                body: form,
            });

            const blob = await response.blob();
            const url = URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = "merged.pdf";
            document.body.appendChild(a);
            a.setAttribute("target", "_blank");
            a.setAttribute("download", "merged.pdf");
            a.click();
            a.remove();
            URL.revokeObjectURL(url); // Clean up
        } catch (err) {
            console.error("Error merging PDFs:", err);
            setError(err instanceof Error ? err : new Error("Unknown error"));
        } finally {
            setLoading(false);
        }
    };

    return { mergeFiles, loading, error };
}
