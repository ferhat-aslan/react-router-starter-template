import type {Route} from "./+types/post";
import Layout from "~/components/layout";
import {
  useTranslation,
  translations,
  type Locale,
  getTranslationData,
} from "~/utils/route-utils";
import {type MetaFunction} from "react-router";
import {sanityClient, postBySlugQuery, type BlogPost} from "./sanity";
import {PortableText} from "@portabletext/react";
import {createImageUrlBuilder, type SanityImageSource} from "@sanity/image-url";

export const meta: MetaFunction = ({data, location}: any) => {
  if (!data) {
    return [
      {title: "All Tools - Kleinbyte"},
      {
        name: "description",
        content:
          "Free online tools for PDF, documents, images and more. No signup required.",
      },
    ];
  }

  const locale = data.locale;
  const t = (key: string) => data.messages[key] || key;

  // If no data (404), return default meta
  if (!data || typeof data !== "object" || !("post" in data)) {
    return [
      {title: t("blog.not_found.title")},
      {name: "description", content: t("blog.not_found.description")},
    ];
  }

  const post = data.post as BlogPost;
  const title = post.seoTitle || `${post.title} - Kleinbyte Blog`;
  const description =
    post.seoDescription ||
    post.excerpt ||
    `Read ${post.title} on Kleinbyte blog`;
  const canonical = `https://kleinbyte.com${
    locale === "en" ? "" : `/${locale}`
  }/blog/${post.slug.current}`;

  return [
    {title},
    {name: "description", content: description},
    {name: "keywords", content: post.keywords?.join(", ") || ""},
    {name: "author", content: post.author.name},
    {property: "og:title", content: title},
    {property: "og:description", content: description},
    {property: "og:type", content: "article"},
    {property: "og:url", content: canonical},
    {
      property: "og:image",
      content:
        post.ogImage ||
        post.coverImage ||
        "https://kleinbyte.com/og-image-blog.png",
    },
    {property: "article:published_time", content: post.publishedAt},
    {property: "article:author", content: post.author.name},
    {name: "twitter:card", content: "summary_large_image"},
    {name: "twitter:title", content: title},
    {name: "twitter:description", content: description},
    {
      name: "twitter:image",
      content:
        post.ogImage ||
        post.coverImage ||
        "https://kleinbyte.com/og-image-blog.png",
    },
    {tagName: "link", rel: "canonical", href: canonical},
  ];
};

export const loader = async ({
  request,
  params,
}: Route.LoaderArgs): Promise<any> => {
  const url = new URL(request.url);
  const {locale, messages, t} = await getTranslationData(url.pathname);
  try {
    const post = await sanityClient.fetch<BlogPost>(
      postBySlugQuery(params.slug),
    );
    if (!post) {
      throw new Response("Not Found", {status: 404});
    }
    return {post, locale, messages};
  } catch (error) {
    throw new Response("Not Found", {status: 404});
  }
};

// Create an image URL builder using the client
const builder = createImageUrlBuilder(sanityClient);
// Export a function that can be used to get image URLs
export function urlFor(source: SanityImageSource) {
  return builder.image(source);
}

export default function BlogPost({loaderData}: Route.ComponentProps) {
  const {post} = loaderData;
  const t = (key: string) => loaderData.messages[key] || key;
  const locale: Locale = loaderData.locale;

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString(locale, {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Aticle",
    headline: post.title,
    description: post.seoDescription || post.excerpt,
    image: post.coverImage,
    datePublished: post.publishedAt,
    dateModified: post.publishedAt,
    author: {
      "@type": "Person",
      name: post.author.name,
      url: post.author.website,
      jobTitle: post.author.role,
    },
    publisher: {
      "@type": "Organization",
      name: "Kleinbyte",
      logo: {
        "@type": "ImageObject",
        url: "https://kleinbyte.com/logo.png",
      },
      alternateName: [
        "Kleinbyte Blog",
        "Kleinbyte free tools",
        "Kleinbyte AI tools",
      ],
      foundingDate: "1995",
      foundingLocation: {
        "@type": "Place",
        address: {
          "@type": "PostalAddress",
          addressLocality: "Berlin",
          addressCountry: "Germany",
        },
      },
      location: [
        {
          "@type": "Place",
          address: {
            "@type": "PostalAddress",
            streetAddress: "Alexanderstraße 10",
            postalCode: "10178",
            addressLocality: "Berlin",
            addressCountry: "Germany",
          },
        },
      ],
      contactPoint: [
        {
          "@type": "ContactPoint",
          url: "https://kleinbyte.com/contact",
          email: "support@kleinbyte.com",
          contactType: "customer service",
        },
      ],
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `https://kleinbyte.com${
        locale === "en" ? "" : `/${locale}`
      }/blog/${post.slug.current}`,
    },
  };

  return (
    <Layout loaderData={loaderData}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{__html: JSON.stringify(structuredData)}}
      />
      <div className="min-h-screen bg-white dark:bg-neutral-950 text-gray-900 dark:text-white pt-32 pb-20">
        <div className="container blog-article-wp">
          <article className="blog-article">
            <header style={{marginBottom: "48px"}}>
              {post.coverImage && (
                <div className="w-full aspect-video bg-gray-100 dark:bg-white/5  overflow-hidden mb-8">
                  <img
                    src={urlFor(post.coverImage).width(800).url()}
                    srcSet={[
                      `${urlFor(post.coverImage).width(400).url()} 400w`,
                      `${urlFor(post.coverImage).width(800).url()} 800w`,
                      `${urlFor(post.coverImage).width(1200).url()} 1200w`,
                    ].join(", ")}
                    sizes="(max-width: 600px) 400px, (max-width: 1200px) 800px, 1200px"
                    alt={post.title || ""}
                    loading="eager"
                  />
                </div>
              )}

              <div className="flex items-center justify-center gap-2 text-sm text-gray-500 dark:text-gray-400 mb-6">
                <time dateTime={post.publishedAt}>
                  {formatDate(post.publishedAt)}
                </time>
                <span>•</span>
                <span>
                  {t("blog.by")} {post.author.name}
                </span>
                {post.author.role && (
                  <>
                    <span>•</span>
                    <span>{post.author.role}</span>
                  </>
                )}
              </div>
              <h1 className="text-3xl  font-semibold text-gray-800 dark:text-white mb-6 leading-tight text-center">
                {post.title}
              </h1>
            </header>

            <div className="prose prose-sm lg:prose-lg max-w-none">
              {post.content ? (
                <PortableText value={post.content} />
              ) : (
                <p>{post.excerpt}</p>
              )}
            </div>

            <div className="mt-16 pt-8 border-t border-gray-200 dark:border-white/10">
              <a
                href={locale === "en" ? "/blog" : `/${locale}/blog`}
                className="inline-flex items-center font-medium text-blue-600 dark:text-blue-400 hover:underline"
              >
                <svg
                  className="w-4 h-4 mr-2 rtl:rotate-180"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 19l-7-7 7-7"
                  />
                </svg>
                {t("blog.back_to_blog")}
              </a>
            </div>
          </article>
        </div>
      </div>
    </Layout>
  );
}
