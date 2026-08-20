import type { Route } from "./+types/og-generator";
import { OgImage } from "../components/og-image";
import { getOgMetadata } from "../data/og-metadata";

export async function loader({ params }: Route.LoaderArgs) {
  const { ImageResponse } = await import("@cf-wasm/og/workerd");
  const metadata = await getOgMetadata(params["*"] || "");

  return ImageResponse.async(<OgImage {...metadata} />, {
    width: 1200,
    height: 630,
  });
}
