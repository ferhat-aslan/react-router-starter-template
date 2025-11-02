import type { LoaderFunctionArgs } from "@remix-run/node";

export function loader({ request }: LoaderFunctionArgs) {
    const robotText = `
User-agent: *
Allow: /
Sitemap: ${new URL(request.url).origin}/sitemap.xml
`.trim();

    return new Response(robotText, {
        status: 200,
        headers: {
            "Content-Type": "text/plain",
        },
    });
}
