import { type RouteConfig, index, prefix, route } from "@react-router/dev/routes";

export default [index("routes/home.tsx"),
route("about", "routes/about.tsx"),
route("amazon", "routes/amazon.tsx"),

route("docx-tools", "routes/docx-tools.tsx"),
...prefix("pdf-tools", [
    index("routes/pdf-tools.tsx"),
    route("merge-pdf", "routes/pdf-tools/merge-pdf.tsx"),
]),
] satisfies RouteConfig;
