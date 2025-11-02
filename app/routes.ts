import { type RouteConfig, index, prefix, route } from "@react-router/dev/routes";

export default [index("routes/home.tsx"),
route("about", "routes/about.tsx"),
route("amazon", "routes/amazon.tsx"),

route("docx-tools", "routes/docx-tools.tsx"),
...prefix("pdf-tools", [
    index("routes/pdf-tools.tsx"),
    route("merge-pdf", "routes/pdf-tools/merge-pdf.tsx"),
    route("split-pdf", "routes/pdf-tools/split-pdf.tsx"),
    route("word-to-pdf", "routes/pdf-tools/word-to-pdf.tsx"),
    route("pdf-to-images", "routes/pdf-tools/pdf-to-images.tsx"),
    route("pdf-to-text", "routes/pdf-tools/pdf-to-text.tsx"),
    route("sitemap.xml", "routes/sitemap[.]xml.ts"),

]),
] satisfies RouteConfig;
