import { type RouteConfig, index, prefix, route } from "@react-router/dev/routes";

const baseRoutes: RouteConfig = [
  index("routes/home.tsx"),
  route("search", "routes/search.tsx"),
  route("about", "routes/about.tsx"),
  route("amazon", "routes/amazon.tsx"),
  route("robots.txt", "routes/robots[.]txt.ts"),
  route("sitemap.xml", "routes/sitemap[.]xml.ts"),
  route("docx-tools", "routes/docx-tools.tsx"),
  route("latex-tools", "routes/latex-tools.tsx"),
  route("text-tools", "routes/text-tools.tsx"),
  route("spreadsheet-tools", "routes/spreadsheet-tools.tsx"),
  route("seo-tools", "routes/seo-tools.tsx"),
  route("code-formatter", "routes/code-formatter.tsx"),
  route("json-tools", "routes/json-tools.tsx"),
  route("api-tools", "routes/api-tools.tsx"),
  route("favicon-maker", "routes/favicon-maker.tsx"),
  route("icon-resizer", "routes/icon-resizer.tsx"),
  route("privacy-policy", "routes/privacy-policy.tsx"),
  route("terms-and-conditions", "routes/terms-and-conditions.tsx"),
  route("tools/video-compressor", "routes/tools/video-compressor.tsx"),
  route("tools/image-converter", "routes/tools/image-converter.tsx"),
  route("blog", "routes/blog/blog.tsx"),
  route("blog/:slug", "routes/blog/post.tsx"),
  ...prefix("pdf-tools", [
    index("routes/pdf-tools.tsx"),
    route("merge-pdf", "routes/pdf-tools/merge-pdf.tsx"),
    route("split-pdf", "routes/pdf-tools/split-pdf.tsx"),
    route("word-to-pdf", "routes/pdf-tools/word-to-pdf.tsx"),
    route("pdf-to-images", "routes/pdf-tools/pdf-to-images.tsx"),
    route("pdf-to-text", "routes/pdf-tools/pdf-to-text.tsx"),
  ]),
  ...prefix("image-tools", [
    index("routes/image-tools.tsx"),
    route("images-to-pdf", "routes/image-tools/images-to-pdf.tsx"),
  ]),
];

// 👇 generate localized routes without duplicate IDs
const localizedRoutesDE = prefix("de", baseRoutes.map((r, i) => ({ ...r, id: `${r.id ?? i}-de-localized` })));
const localizedRoutesES = prefix("es", baseRoutes.map((r, i) => ({ ...r, id: `${r.id ?? i}-es-localized` })));
const localizedRoutesAR = prefix("ar", baseRoutes.map((r, i) => ({ ...r, id: `${r.id ?? i}-ar-localized` })));


export default [...baseRoutes, ...localizedRoutesDE, ...localizedRoutesES, ...localizedRoutesAR] satisfies RouteConfig;
