import { createRequestHandler } from "react-router";

declare module "react-router" {
	export interface AppLoadContext {
		cloudflare: {
			env: Env;
			ctx: ExecutionContext;
		};
	}
}

const requestHandler = createRequestHandler(
	() => import("virtual:react-router/server-build"),
	import.meta.env.MODE,
);

export default {
	async fetch(request, env, ctx) {
		const url = new URL(request.url);

		// Helper to get userId from cookie
		const getUserId = () => {
			const cookieHeader = request.headers.get("Cookie");
			if (!cookieHeader) return null;
			const cookies = Object.fromEntries(
				cookieHeader.split("; ").map((c) => c.split("="))
			);
			return cookies["user-id"];
		};

		// R2 Upload Handler
		if (request.method === "PUT" && url.pathname === "/upload") {
			const userId = getUserId();
			if (!userId) {
				return new Response("Unauthorized: Missing User ID", { status: 401 });
			}

			const filename = request.headers.get("X-File-Name") || "unknown";
			const key = `${userId}/${Date.now()}-${filename}`;

			try {
				await env.R2_BUCKET.put(key, request.body, {
					httpMetadata: {
						contentType: request.headers.get("Content-Type") || "application/octet-stream",
					},
				});
				return Response.json({ key });
			} catch (e) {
				return new Response(`Upload Failed: ${e}`, { status: 500 });
			}
		}

		// R2 Download Handler
		if (request.method === "GET" && url.pathname.startsWith("/download/")) {
			const key = url.pathname.replace("/download/", "");
			const userId = getUserId();

			if (!userId || !key.startsWith(`${userId}/`)) {
				return new Response("Unauthorized: Invalid Access", { status: 403 });
			}

			const object = await env.R2_BUCKET.get(key);
			if (!object) {
				return new Response("File Not Found", { status: 404 });
			}

			const headers = new Headers();
			object.writeHttpMetadata(headers);
			headers.set("etag", object.httpEtag);
			headers.set("Content-Disposition", `attachment; filename="${key.split('-').slice(1).join('-')}"`);

			return new Response(object.body, {
				headers,
			});
		}

		return requestHandler(request, {
			cloudflare: { env, ctx },
		});
	},

	async scheduled(event, env, ctx) {
		// Cleanup files older than 1 hour
		const list = await env.R2_BUCKET.list();
		const oneHourAgo = Date.now() - 60 * 60 * 1000;

		const keysToDelete = list.objects
			.filter((obj) => obj.uploaded.getTime() < oneHourAgo)
			.map((obj) => obj.key);

		if (keysToDelete.length > 0) {
			await env.R2_BUCKET.delete(keysToDelete);
			console.log(`Deleted ${keysToDelete.length} old files.`);
		}
	},
} satisfies ExportedHandler<Env>;
