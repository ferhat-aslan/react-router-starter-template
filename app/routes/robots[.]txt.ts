import type { LoaderFunctionArgs } from "@remix-run/node";

export function loader({ request }: LoaderFunctionArgs) {
    const origin = new URL(request.url).origin;
    const robotText = [
        "User-agent: *",
        "Allow: /",
        `Sitemap: ${origin}/sitemap.xml`,
        "",
    ].join("\n");

    return new Response(robotText, {
        status: 200,
        headers: {
            "Content-Type": "text/plain; charset=utf-8",
            "Cache-Control": "public, max-age=3600",
        },
    });
}
