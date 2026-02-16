import type {Route} from "./+types/blog";
import Layout from "~/components/layout";
import {
  useTranslation,
  translations,
  type Locale,
  getTranslationData,
} from "~/utils/route-utils";
import {type MetaFunction} from "react-router";
import {sanityClient, allPostsQuery, type BlogPost} from "./sanity";
import {createImageUrlBuilder, type SanityImageSource} from "@sanity/image-url";

import {generateMeta} from "@forge42/seo-tools/remix/metadata";

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

  return generateMeta(
    {
      title: t("blog.meta.title"),
      description: t("blog.meta.description"),
      url: `https://kleinbyte.com${location.pathname}`,
    },
    [
      {name: "keywords", content: t("blog.meta.keywords")},
      {name: "author", content: "Kleinbyte"},
    ],
  );
};

export const loader = async ({request}: any) => {
  const url = new URL(request.url);
  const {locale, messages, t} = await getTranslationData(url.pathname);
  try {
    const posts = await sanityClient.fetch<BlogPost[]>(allPostsQuery);
    return {posts, locale, messages};
  } catch (error) {
    console.error("Error fetching blog posts:", error);
    return {posts: []};
  }
};

// Create an image URL builder using the client
const builder = createImageUrlBuilder(sanityClient);
// Export a function that can be used to get image URLs
export function urlFor(source: SanityImageSource) {
  return builder.image(source);
}

export default function Blog({loaderData}: any) {
  const {posts} = loaderData;
  const t = (key: string) => loaderData.messages[key] || key;
  const locale = loaderData.locale;

  // Helper to format date based on locale
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString(locale, {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <Layout loaderData={loaderData}>
      <div className="min-h-screen bg-white dark:bg-neutral-950 text-gray-900 dark:text-white pt-32 pb-20">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-bold mb-6 text-center">
              {t("blog.title")}
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-400 text-center mb-16">
              {t("blog.description")}
            </p>

            {posts.length === 0 ? (
              <p className="text-center text-gray-500 dark:text-gray-400">
                No blog posts available yet.
              </p>
            ) : (
              <div className="flex flex-col lg:grid grid-cols-[2fr_1fr] gap-12">
                {posts.map((post: any) => (
                  <article
                    key={post._id}
                    className="flex flex-col gap-4 items-start border-b border-gray-200 dark:border-white/10 pb-12 last:border-0"
                  >
                    {post.coverImage && (
                      <div className="w-full aspect-video bg-gray-100 dark:bg-white/5  overflow-hidden">
                        <img
                          src={urlFor(post.coverImage).width(800).url()}
                          srcSet={[
                            `${urlFor(post.coverImage).width(400).url()} 400w`,
                            `${urlFor(post.coverImage).width(800).url()} 800w`,
                            `${urlFor(post.coverImage)
                              .width(1200)
                              .url()} 1200w`,
                          ].join(", ")}
                          sizes="(max-width: 600px) 400px, (max-width: 1200px) 800px, 1200px"
                          alt={post.title || ""}
                        />
                      </div>
                    )}

                    <div className="flex-1">
                      <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400 mb-3">
                        <time dateTime={post.publishedAt}>
                          {formatDate(post.publishedAt)}
                        </time>
                        <span>•</span>
                        <span>{post?.author}</span>
                      </div>

                      <h2 className="text-2xl font-bold mb-3 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                        <a
                          href={
                            locale === "en"
                              ? `/blog/${post.slug.current}`
                              : `/${locale}/blog/${post.slug.current}`
                          }
                        >
                          {post.title}
                        </a>
                      </h2>

                      <p className="text-gray-600 dark:text-gray-400 mb-4 leading-relaxed">
                        {post.excerpt}
                      </p>

                      <a
                        href={
                          locale === "en"
                            ? `/blog/${post.slug.current}`
                            : `/${locale}/blog/${post.slug.current}`
                        }
                        className="inline-flex items-center font-medium text-blue-600 dark:text-blue-400 hover:underline"
                      >
                        {t("blog.read_more")}
                        <svg
                          className="w-4 h-4 ml-1 rtl:rotate-180"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 5l7 7-7 7"
                          />
                        </svg>
                      </a>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}
