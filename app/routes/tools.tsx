import { redirect } from "react-router";
import type { Route } from "./+types/tools";

export function loader({ request }: Route.LoaderArgs) {
  const url = new URL(request.url);
  const path = url.pathname;
  // Preserve locale if present
  const segments = path.split('/').filter(Boolean);
  const locale = ["en", "de", "es", "ar", "tr", "pt", "fr", "it", "ru"].includes(segments[0]) ? segments[0] : "";
  
  const target = locale ? `/${locale}/all-tools` : "/all-tools";
  return redirect(target);
}

export default function Tools() {
  return null;
}