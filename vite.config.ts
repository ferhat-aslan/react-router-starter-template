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
					sanity: ["@sanity/client", "@sanity/image-url"],
					portabletext: ["@portabletext/react"],
					og: ["satori", "@resvg/resvg-wasm"],
				}
			}
		}
	},

	optimizeDeps: {
		// ❗ include serbest, ama exclude yasak
		include: ["react", "react-dom", "react-router"]
	}
});
