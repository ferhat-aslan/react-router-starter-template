import type { LoaderFunctionArgs } from "@remix-run/node";

// Helper to convert route path to full URL
function pathToUrl(request: Request, path: string) {
    const url = new URL(request.url);
    return `${url.origin}${path}`;
}

export async function loader({ request }: LoaderFunctionArgs) {
    // List all your static routes here
    const routes = [
        "/",
        "/about",
        "/pdf-tools",
        "/pdf-tools/merge-pdf",
        "/pdf-tools/split-pdf",
        "/pdf-tools/word-to-pdf",
        "/pdf-tools/pdf-to-images",
        "/pdf-tools/pdf-to-text",
    ];

    const sitemap = `
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${routes
            .map(
                (route) => `  <url>
    <loc>${pathToUrl(request, route)}</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
  </url>`
            )
            .join("\n")}
</urlset>
`.trim();

    return new Response(sitemap, {
        status: 200,
        headers: {
            "Content-Type": "application/xml",
            "xml-version": "1.0",
            "encoding": "UTF-8",
        },
    });
}