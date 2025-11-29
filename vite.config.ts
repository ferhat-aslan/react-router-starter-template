import { reactRouter } from "@react-router/dev/vite";
import { cloudflare } from "@cloudflare/vite-plugin";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";
import viteCompression from 'vite-plugin-compression';

export default defineConfig({
	assetsInclude: ['**/*.svg',],
	ssr: {


		noExternal: true,
	},

	plugins: [
		cloudflare({ viteEnvironment: { name: "ssr" } }),
		tailwindcss(),
		reactRouter(),
		tsconfigPaths(),
		// Compression plugins
		viteCompression({
			algorithm: 'gzip',
			ext: '.gz',
			threshold: 10240,
			deleteOriginFile: false,
		}),
		viteCompression({
			algorithm: 'brotliCompress',
			ext: '.br',
			threshold: 10240,
			deleteOriginFile: false,
		}),

	],
	build: {
		cssMinify: true,
		cssCodeSplit: true,
		ssr: true,

		chunkSizeWarningLimit: 1000,
		minify: 'esbuild',
		sourcemap: false,
	},

	optimizeDeps: {
		include: ['react', 'react-dom', 'react-router'],
		exclude: ['@sanity/client', '@sanity/image-url', '@portabletext/react'],
	},





});
