import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [index("routes/home.tsx"),
route("about", "routes/about.tsx"),
route("amazon", "routes/amazon.tsx"),
route("pdf-tools", "routes/pdf-tools.tsx"),
route("docx-tools", "routes/docx-tools.tsx"),
] satisfies RouteConfig;
