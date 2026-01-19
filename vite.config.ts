import { reactRouter } from "@react-router/dev/vite";
import { cloudflare } from "@cloudflare/vite-plugin";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";
import viteCompression from 'vite-plugin-compression';

export default defineConfig({
	assetsInclude: ['**/*.svg'],

	ssr: {
		// ❌ external KULLANILMAZ (Cloudflare izin vermez)
		// ❌ noExternal: true da kullanma (dev build şişirir)
	},

	plugins: [
		cloudflare({ viteEnvironment: { name: "ssr" } }),
		tailwindcss(),
		reactRouter(),
		tsconfigPaths(),

		viteCompression({ algorithm: "gzip", ext: ".gz" }),
		viteCompression({ algorithm: "brotliCompress", ext: ".br" }),
	],

	build: {
		cssMinify: true,
		cssCodeSplit: true,
		sourcemap: false,
		minify: "esbuild",

		rollupOptions: {
			output: {
				manualChunks: {
					// Core React
					vendor: ["react", "react-dom", "react-router"],
					// Sanity / CMS
					sanity: ["@sanity/client", "@sanity/image-url", "@portabletext/react"],
					// Icons (often heavy)
					icons: ["lucide-react"],
					// OG Image Generation (very heavy, definitely split)
					og: ["satori", "@resvg/resvg-wasm"],
					// Utils
					utils: ["isbot", "jspdf", "html-to-image"]
				}
			}
		}
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
			"jspdf",
			"html-to-image"
		]
	}
});
