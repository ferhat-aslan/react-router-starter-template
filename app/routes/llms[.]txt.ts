import type { LoaderFunctionArgs } from "react-router";

export const loader = async ({ request }: LoaderFunctionArgs) => {
    const host = request.headers.get("host") || "kleinbyte.com";
    const isLocal = host.includes("localhost") || host.includes("127.0.0.1");
    const protocol = isLocal ? "http" : "https";
    const baseUrl = `${protocol}://${host}`;

    const content = `# Kleinbyte

## Project Overview
Kleinbyte is a comprehensive suite of free online developer and productivity tools. It includes PDF utilities, image converters, developer tools, and document processors.

## Core Capabilities

### PDF Tools (/pdf-tools)
- **Merge PDF**: Combine multiple PDFs into one document.
- **Split PDF**: Separate a PDF into individual pages or ranges.
- **PDF to Word**: Convert PDF documents to editable Word files.
- **PDF to Text**: Extract raw text from PDF files.
- **PDF to Images**: Convert PDF pages to JPG/PNG images.

### Image Tools (/image-tools)
- **Image Converter**: Convert between JPG, PNG, WEBP, and AVIF.
- **Video Compressor**: Optimize video files for web.
- **Icon Resizer**: Generate various icon sizes from a master image.
- **Images to PDF**: Convert a collection of images into a single PDF.

### Developer Tools
- **JSON Tools**: Format, validate, and minify JSON.
- **Code Formatter**: Prettier-based code formatting for various languages.
- **API Tools**: Test and debug API endpoints.
- **SEO Tools**: Meta tag generator and analysis.

### Document Tools
- **Docx Tools**: Utilities for Word documents.
- **LaTeX Tools**: LaTeX editors and utilities.
- **Text Tools**: String manipulation and analysis.

## Navigation
- **Home**: ${baseUrl}/
- **Blog**: ${baseUrl}/blog
- **All Tools**: ${baseUrl}/all-tools

## Technical Stack
- Framework: React Router 7
- Styling: Tailwind CSS v4
- Deployment: Cloudflare Workers
`;

    return new Response(content, {
        headers: {
            "Content-Type": "text/plain; charset=utf-8",
            "Cache-Control": "public, max-age=3600",
        },
    });
};
