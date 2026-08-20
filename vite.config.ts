import { reactRouter } from "@react-router/dev/vite";
import { cloudflare } from "@cloudflare/vite-plugin";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";
import viteCompression from "vite-plugin-compression";
export default defineConfig({
  assetsInclude: ["**/*.svg"],

  ssr: {
    // ❌ external KULLANILMAZ (Cloudflare izin vermez)
    // ❌ noExternal: true da kullanma (dev build şişirir)
  },

  plugins: [
    cloudflare({ viteEnvironment: { name: "ssr" } }),
    tailwindcss(),

    reactRouter(),
    tsconfigPaths(),
    // Helps Vite keep async-route deps out of the initial client entry where possible.

    viteCompression({ algorithm: "gzip", ext: ".gz" }),
    viteCompression({ algorithm: "brotliCompress", ext: ".br" }),
  ],

  build: {
    modulePreload: {
      // Avoid injecting the modulepreload polyfill chunk
      // (modern browsers support it; reduces one extra request)
      polyfill: false,
    },
    cssMinify: true,
    cssCodeSplit: true,
    sourcemap: false,
    minify: "esbuild",

    rollupOptions: {
      output: {
        // Keep heavy feature bundles out of the initial client entry where possible.
        manualChunks(id) {
          // Ensure Vite's internal preload helper never ends up inside feature chunks
          // (otherwise unrelated pages can be forced to download that feature chunk).
          if (
            id.includes("vite/preload-helper") ||
            id.includes("\u0000vite/preload-helper") ||
            id.includes("vite/modulepreload-polyfill") ||
            id.includes("\u0000vite/modulepreload-polyfill")
          ) {
            return "preload";
          }
          if (id.includes("node_modules")) {
            if (
              id.includes("html2canvas") ||
              id.includes("canvg") ||
              id.includes("stackblur-canvas") ||
              id.includes("rgbcolor") ||
              id.includes("svg-pathdata")
            ) {
              return "canvas";
            }
            if (id.includes("qrcode-generator")) {
              return "qr";
            }
            if (id.includes("dompurify") || id.includes("linkifyjs")) {
              return "sanitize";
            }
            if (id.includes("@tiptap/") || id.includes("prosemirror")) {
              return "editor";
            }
            if (
              id.includes("pdfjs-dist") ||
              id.includes("pdf-lib") ||
              id.includes("jspdf")
            ) {
              return "pdf";
            }
            if (
              id.includes("@sanity/") ||
              id.includes("@portabletext/") ||
              id.includes("/get-it/") ||
              id.includes("/groq/") ||
              id.includes("/@sanity/") ||
              id.includes("/@portabletext/")
            ) {
              return "sanity";
            }
            if (id.includes("satori") || id.includes("@resvg/resvg-wasm")) {
              return "og";
            }
            return "vendor";
          }
        },
      },
    },
    reportCompressedSize: true,
  },
  optimizeDeps: {
    include: [
      "react",
      "react-dom",
      "react-router",
      "marked",
      "dompurify",
      "react-dom/server",
      "@forge42/seo-tools/canonical",
      "@tiptap/react",
      "@tiptap/starter-kit",
      "@tiptap/extension-placeholder",
      "@tiptap/extension-link",
      "@tiptap/extension-character-count",
      "@tiptap/extension-text-align",
      "@tiptap/extension-underline",
      "@tiptap/extension-image",
      "@tiptap/extension-typography",
      "@tiptap/extension-highlight",
      "@tiptap/extension-task-list",
      "@tiptap/extension-task-item",
      "@tiptap/extension-color",
      "@tiptap/extension-text-style",
    ],
    exclude: [
      "@sanity/client",
      "@sanity/image-url",
      "jspdf",
      "html-to-image",
      "virtual:react-router/server-build",
      "isbot",
    ],
  },
});
