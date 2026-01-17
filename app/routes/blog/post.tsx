import type { Route } from "./+types/post";
import Layout from "~/components/layout";
import { useTranslation, type Locale } from "~/utils/route-utils";
import { type MetaFunction } from "react-router";
import { sanityClient, postBySlugQuery, type BlogPost } from "./sanity";
import { PortableText } from '@portabletext/react';

export const meta: MetaFunction<typeof loader> = ({ data, matches }) => {
  const rootMatch = matches.find((m) => m.id === "root");
  const messages = (rootMatch?.data as any)?.messages || {};
  const locale = (rootMatch?.data as any)?.locale || "en";

  function t(key: string) {
    return messages[key] ?? key;
  }

  // If no data (404), return default meta
  if (!data || typeof data !== 'object' || !('post' in data)) {
    return [
      { title: t("blog.not_found.title") },
      { name: "description", content: t("blog.not_found.description") },
    ];
  }

  const post = data.post as BlogPost;
  const title = post.seoTitle || `${post.title} - Kleinbyte Blog`;
  const description = post.seoDescription || post.excerpt || `Read ${post.title} on Kleinbyte blog`;
  const canonical = `https://kleinbyte.com${locale === "en" ? "" : `/${locale}`}/blog/${post.slug.current}`;

  return [
    { title },
    { name: "description", content: description },
    { name: "keywords", content: post.keywords?.join(", ") || "" },
    { name: "author", content: post.author.name },
    { property: "og:title", content: title },
    { property: "og:description", content: description },
    { property: "og:type", content: "article" },
    { property: "og:url", content: canonical },
    { property: "og:image", content: post.ogImage || post.coverImage || "https://kleinbyte.com/og-image-blog.png" },
    { property: "article:published_time", content: post.publishedAt },
    { property: "article:author", content: post.author.name },
    { name: "twitter:card", content: "summary_large_image" },
    { name: "twitter:title", content: title },
    { name: "twitter:description", content: description },
    { name: "twitter:image", content: post.ogImage || post.coverImage || "https://kleinbyte.com/og-image-blog.png" },
    { tagName: "link", rel: "canonical", href: canonical },
  ];
};

export const loader = async ({ params }: Route.LoaderArgs): Promise<{ post: BlogPost }> => {
  try {
    const post = await sanityClient.fetch<BlogPost>(postBySlugQuery(params.slug));
    if (!post) {
      throw new Response("Not Found", { status: 404 });
    }
    return { post };
  } catch (error) {
    throw new Response("Not Found", { status: 404 });
  }
};

export default function BlogPost({ loaderData }: Route.ComponentProps) {
  const { post } = loaderData;
  const { t, locale } = useTranslation();

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString(locale, {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "headline": post.title,
    "description": post.seoDescription || post.excerpt,
    "image": post.coverImage,
    "datePublished": post.publishedAt,
    "author": {
      "@type": "Person",
      "name": post.author.name,
      "url": post.author.website,
      "jobTitle": post.author.role
    },
    "publisher": {
      "@type": "Organization",
      "name": "Kleinbyte",
      "logo": {
        "@type": "ImageObject",
        "url": "https://kleinbyte.com/logo.png"
      }
    },
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": `https://kleinbyte.com${locale === "en" ? "" : `/${locale}`}/blog/${post.slug.current}`
    }
  };

  return (
    <Layout>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <div className="min-h-screen bg-white dark:bg-neutral-950 text-gray-900 dark:text-white pt-32 pb-20">
        <div className="container mx-auto px-6">
          <article className="max-w-3xl mx-auto">
            <header className="mb-12">
              {post.coverImage && (
                <div className="w-full aspect-video bg-gray-100 dark:bg-white/5 rounded-2xl overflow-hidden mb-8">
                  <img 
                    src={post.coverImage} 
                    alt={post.title}
                    className="w-full h-full object-cover"
                    loading="eager"
                  />
                </div>
              )}
              
              <div className="flex items-center justify-center gap-2 text-sm text-gray-500 dark:text-gray-400 mb-6">
                <time dateTime={post.publishedAt}>{formatDate(post.publishedAt)}</time>
                <span>•</span>
                <span>{t("blog.by")} {post.author.name}</span>
                {post.author.role && (
                  <>
                    <span>•</span>
                    <span>{post.author.role}</span>
                  </>
                )}
              </div>
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-6 leading-tight text-center">
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
                <svg className="w-4 h-4 mr-2 rtl:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
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
