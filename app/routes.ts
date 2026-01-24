import { type RouteConfig, index, prefix, route } from "@react-router/dev/routes";
import { generateLocalizedRoutes } from "./utils/route-utils";

const baseRoutes: RouteConfig = [
  index("routes/home.tsx"),
  route("search", "routes/search.tsx"),
  route("all-tools", "routes/all-tools.tsx"),
  route("about", "routes/about.tsx"),
  route("amazon", "routes/amazon.tsx"),
  route("robots.txt", "routes/robots[.]txt.ts"),
  route("sitemap.xml", "routes/sitemap[.]xml.ts"),
  route("llms.txt", "routes/llms[.]txt.ts"),
  route("docx-tools", "routes/docx-tools.tsx"),
  route("latex-tools", "routes/latex-tools.tsx"),
  ...prefix("text-tools", [
    index("routes/text-tools.tsx"),
    route("chatgpt-editor", "routes/text-tools/chatgpt-editor.tsx"),
    route("gemini-editor", "routes/text-tools/gemini-editor.tsx"),
    route("editor", "routes/text-tools/editor.tsx"),
  ]),
  route("spreadsheet-tools", "routes/spreadsheet-tools.tsx"),
  route("seo-tools", "routes/seo-tools.tsx"),
  route("code-formatter", "routes/code-formatter.tsx"),
  route("json-tools", "routes/json-tools.tsx"),
  route("api-tools", "routes/api-tools.tsx"),
  route("favicon-maker", "routes/favicon-maker.tsx"),
  route("icon-resizer", "routes/icon-resizer.tsx"),
  route("privacy-policy", "routes/privacy-policy.tsx"),
  route("terms-and-conditions", "routes/terms-and-conditions.tsx"),


  route("blog", "routes/blog/blog.tsx"),
  route("blog/:slug", "routes/blog/post.tsx"),
  ...prefix("subtitle-tools", [
    index("routes/subtitle-tools.tsx"),
    route("edit", "routes/subtitle-tools/edit.tsx"),
    route("convert", "routes/subtitle-tools/convert.tsx"),
    route("merge", "routes/subtitle-tools/merge.tsx"),
  ]),
  ...prefix("pdf-tools", [
    index("routes/pdf-tools.tsx"),
    route("merge-pdf", "routes/pdf-tools/merge-pdf.tsx"),
    route("split-pdf", "routes/pdf-tools/split-pdf.tsx"),
    route("word-to-pdf", "routes/pdf-tools/word-to-pdf.tsx"),
    route("pdf-to-images", "routes/pdf-tools/pdf-to-images.tsx"),
    route("pdf-to-text", "routes/pdf-tools/pdf-to-text.tsx"),
    route("compress-pdf", "routes/pdf-tools/compress-pdf.tsx"),
  ]),
  ...prefix("tools", [
    index("routes/tools.tsx"),
    route("image-converter", "routes/tools/image-converter.tsx"),
    route("file-converter", "routes/tools/file-converter.tsx"),
    route("qr-generator", "routes/tools/qr-generator.tsx"),
    route("bg-remover", "routes/tools/bg-remover.tsx"),
    route("video-compressor", "routes/tools/video-compressor.tsx"),
  ]),
  ...prefix("image-tools", [
    index("routes/image-tools.tsx"),
    route("images-to-pdf", "routes/image-tools/images-to-pdf.tsx"),
  ]),
];

export default [...baseRoutes, ...generateLocalizedRoutes(baseRoutes)] satisfies RouteConfig;
