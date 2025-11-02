import { generateRemixSitemap } from "@forge42/seo-tools/remix/sitemap";
import type { Route } from "../+types/root";
import { href } from "react-router";

export const loader = async ({ request }: Route.LoaderArgs) => {
    const { routes } = await import("virtual:react-router/server-build");
    const { origin } = new URL(request.url);
    const sitemap = await generateRemixSitemap({
        domain: origin,

        routes,
    });

    return new Response(sitemap, {
        headers: {
            "Content-Type": "application/xml",
        },
    });
};