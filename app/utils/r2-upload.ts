import { apiClient } from "~/lib/api-client";

export async function uploadToR2(file: File): Promise<string> {
    // 1. Get presigned URL or upload directly via Worker proxy
    // For simplicity and security with HttpOnly cookies, we'll upload via the Worker
    // which acts as a proxy and attaches the userId from the cookie.

    const formData = new FormData();
    formData.append("file", file);

    const response = await fetch("/upload", {
        method: "PUT",
        body: file,
        headers: {
            "Content-Type": file.type,
            "X-File-Name": file.name, // Pass original filename
        },
    });

    if (!response.ok) {
        throw new Error("Failed to upload file to storage");
    }

    const data = (await response.json()) as { key: string };
    return data.key; // Return the R2 key
}

export function getDownloadUrl(key: string): string {
    return `/download/${key}`;
}
