import { generateMeta } from "@forge42/seo-tools/remix/metadata";
import { course } from "@forge42/seo-tools/structured-data/course";
import { webApp } from "@forge42/seo-tools/structured-data/web-app";
import type { MetaFunction } from "react-router";


export const meta: MetaFunction = ({location}) => {


  const meta = generateMeta(
    {
      title: "Tools",
      description: "Tools",
      url: "https://kleinbyte.com/tools",
      image: "https://kleinbyte.com/og-image-text-tools.png",
    },
    [
      {
        "script:ld+json": webApp({
          "@type": "WebApplication",
          name: "Tools",
          url: "https://kleinbyte.com/tools",
          description: "Tools",
          applicationCategory: "TextApplication",
          operatingSystem: "Any",
          offers: {
            "@type": "Offer",
            price: "0",
            priceCurrency: "USD"
          }
        }),
      },
      {
        "script:ld+json": course({
          "@type": "HowTo",
          name: "Tools",
          description: "Tools",
        }),
      },
      { property: "og:type", content: "website" },
      { property: "og:site_name", content: "Kleinbyte" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: "text.meta.title" },
      { name: "twitter:description", content: "text.meta.description" },
      { name: "twitter:image", content: "https://kleinbyte.com/og-image-text-tools.png" },
      { name: "keywords", content: "text.meta.keywords" },
      { name: "author", content: "Kleinbyte" },
    ]
  );
  return meta;
};


export default function Tools() {
  return (
    <div>
      <h1>Tools</h1>
    </div>
  );
}