import type { Route } from "./+types/og-generator-localized";
import { OgImage } from "../components/og-image";
import { getOgMetadata } from "../data/og-metadata";

export async function loader({ params }: Route.LoaderArgs) {
  const { ImageResponse } = await import("@cf-wasm/og/workerd");
  const lang = params.lang || "en";
  const metadata = await getOgMetadata(params["*"] || "", lang);

  return ImageResponse.async(<OgImage {...metadata} lang={lang} />, {
    width: 1200,
    height: 630,
  });
}
