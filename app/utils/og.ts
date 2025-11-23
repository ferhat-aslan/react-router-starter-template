export function getOgImageUrl(options: {
    title: string;
    description?: string;
    theme?: "dark" | "light";
    origin?: string;
}) {
    const { title, description, theme = "dark", origin = "" } = options;
    const params = new URLSearchParams();
    params.set("title", title);
    if (description) params.set("description", description);
    params.set("theme", theme);

    return `${origin}/resources/og-image?${params.toString()}`;
}
