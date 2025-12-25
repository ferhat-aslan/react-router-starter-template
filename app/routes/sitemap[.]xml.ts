import { generateRemixSitemap } from "@forge42/seo-tools/remix/sitemap";
import type { Route } from "../+types/root";
import { sanityClient, allPostsQuery, type BlogPost } from "./blog/sanity";

export const loader = async ({ request }: Route.LoaderArgs) => {
    const { routes } = await import("virtual:react-router/server-build");
    const { origin } = new URL(request.url);

    // Fetch blog posts from Sanity
    let blogPosts: BlogPost[] = [];
    try {
        blogPosts = await sanityClient.fetch<BlogPost[]>(allPostsQuery);
    } catch (error) {
        console.error("Error fetching blog posts for sitemap:", error);
    }

    // Filter out dynamic routes (those with parameters like :slug)
    const filteredRoutes = Object.keys(routes).reduce((acc: any, key) => {
        const route = routes[key];
        // If the route path contains a colon, it's a dynamic route we want to exclude
        // from the automatic discovery since we'll provide the actual localized paths.
        if (route?.path && route?.path.includes(":")) {
            return acc;
        }
        acc[key] = route;
        return acc;
    }, {});

    // Generate dynamic blog routes to merge with standard routes
    const blogRoutes: Record<string, any> = {};
    blogPosts.forEach((post) => {
        if (!post.slug?.current) return;

        const lang = post.language || "en";
        const postPath = `blog/${post.slug.current}`;
        const fullPath = lang === "en" ? postPath : `${lang}/${postPath}`;
        const id = `dynamic:${fullPath}`;

        blogRoutes[id] = {
            id,
            parentId: "root",
            path: fullPath,
            module: {
                default: () => null,
            },
        };
    });

    const sitemap = await generateRemixSitemap({
        domain: origin,
        routes: { ...filteredRoutes, ...blogRoutes },
    });

    return new Response(sitemap, {
        headers: {
            "Content-Type": "application/xml",
            "Cache-Control": "public, max-age=3600",
        },
    });
};