import type {Route} from "./+types/blog";
import Layout from "~/components/layout";
import {
  useTranslation,
  translations,
  type Locale,
  getTranslationData,
} from "~/utils/route-utils";
import {type MetaFunction} from "react-router";
import {
  sanityClient,
  blogPostsPageQuery,
  blogPostsCountQuery,
  urlFor,
  type BlogPostListItem,
} from "./sanity";

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
  const origin: string = data.origin || "https://kleinbyte.com";

  return generateMeta(
    {
      title: t("blog.meta.title"),
      description: t("blog.meta.description"),
      url: `${origin}${location.pathname}`,
      image: `${origin}/og-image-blog.png`,
    },
    [
      {name: "keywords", content: t("blog.meta.keywords")},
      {name: "author", content: "Kleinbyte"},
      {property: "og:type", content: "website"},
      {property: "og:site_name", content: "Kleinbyte"},
      {name: "twitter:card", content: "summary_large_image"},
      {name: "twitter:title", content: t("blog.meta.title")},
      {name: "twitter:description", content: t("blog.meta.description")},
      {name: "twitter:image", content: `${origin}/og-image-blog.png`},
      {
        "script:ld+json": {
          "@context": "https://schema.org",
          "@type": "Blog",
          name: t("blog.meta.title"),
          description: t("blog.meta.description"),
          url: `${origin}${location.pathname}`,
        },
      },
    ],
  );
};

export const loader = async ({request}: any) => {
  const url = new URL(request.url);
  const {locale, messages, t} = await getTranslationData(url.pathname);
  const pageParam = url.searchParams.get("page");
  const page = Math.max(1, Number(pageParam || "1") || 1);
  const pageSize = 10;
  const from = (page - 1) * pageSize;
  const to = from + pageSize;
  try {
    const [posts, total] = await Promise.all([
      sanityClient.fetch<BlogPostListItem[]>(blogPostsPageQuery, {from, to}),
      sanityClient.fetch<number>(blogPostsCountQuery),
    ]);
    return {
      posts,
      total,
      page,
      pageSize,
      locale,
      messages,
      origin: url.origin,
    };
  } catch (error) {
    console.error("Error fetching blog posts:", error);
    return {
      posts: [],
      total: 0,
      page,
      pageSize,
      locale,
      messages,
      origin: url.origin,
    };
  }
};

export default function Blog({loaderData}: any) {
  const {posts, page, pageSize, total} = loaderData;
  const t = (key: string) => loaderData.messages[key] || key;
  const locale = loaderData.locale;
  const totalPages = Math.max(1, Math.ceil((total || 0) / pageSize));

  const blogIndexPath = locale === "en" ? "/blog" : `/${locale}/blog`;
  const pageHref = (p: number) =>
    p <= 1 ? blogIndexPath : `${blogIndexPath}?page=${p}`;

  // Helper to format date based on locale
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString(locale, {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const featured = posts?.[0];
  const rest = posts?.slice(1) ?? [];

  return (
    <Layout loaderData={loaderData}>
      <div className="min-h-screen bg-white dark:bg-neutral-950 text-gray-900 dark:text-white pt-32 pb-20">
        <div className="container mx-auto px-6">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-14">
              <p className="text-xs tracking-[0.35em] uppercase text-gray-500 dark:text-gray-400">
                Kleinbyte Times
              </p>
              <h1 className="mt-4 text-4xl md:text-6xl font-extrabold leading-tight">
                {t("blog.title")}
              </h1>
              <p className="mt-4 text-lg md:text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                {t("blog.description")}
              </p>
              <div className="mt-8 h-px bg-gray-200 dark:bg-white/10" />
            </div>

            {posts.length === 0 ? (
              <p className="text-center text-gray-500 dark:text-gray-400">
                No blog posts available yet.
              </p>
            ) : (
              <>
                {featured ? (
                  <article className="grid grid-cols-1 lg:grid-cols-[1.4fr_1fr] gap-10 pb-12 border-b border-gray-200 dark:border-white/10">
                    <a
                      href={
                        locale === "en"
                          ? `/blog/${featured.slug.current}`
                          : `/${locale}/blog/${featured.slug.current}`
                      }
                      className="group block"
                    >
                      <div className="w-full aspect-[16/10] bg-gray-100 dark:bg-white/5 overflow-hidden">
                        {featured.coverImage ? (
                          <img
                            className="h-full w-full object-cover group-hover:scale-[1.02] transition-transform duration-300"
                            src={urlFor(featured.coverImage).width(1400).url()}
                            alt={featured.title || ""}
                            loading="eager"
                          />
                        ) : null}
                      </div>
                    </a>

                    <div className="flex flex-col justify-center">
                      <div className="flex items-center gap-3 text-xs uppercase tracking-wider text-gray-500 dark:text-gray-400">
                        {featured.publishedAt ? (
                          <time dateTime={featured.publishedAt}>
                            {formatDate(featured.publishedAt)}
                          </time>
                        ) : null}
                        <span className="opacity-50">/</span>
                        <span>{featured.author}</span>
                      </div>

                      <h2 className="mt-4 text-3xl md:text-4xl font-extrabold leading-tight">
                        <a
                          className="hover:underline decoration-2 underline-offset-4"
                          href={
                            locale === "en"
                              ? `/blog/${featured.slug.current}`
                              : `/${locale}/blog/${featured.slug.current}`
                          }
                        >
                          {featured.title}
                        </a>
                      </h2>

                      <p className="mt-4 text-gray-600 dark:text-gray-400 leading-relaxed">
                        {featured.excerpt}
                      </p>

                      <div className="mt-6">
                        <a
                          href={
                            locale === "en"
                              ? `/blog/${featured.slug.current}`
                              : `/${locale}/blog/${featured.slug.current}`
                          }
                          className="inline-flex items-center gap-2 font-medium text-blue-700 dark:text-blue-300 hover:underline"
                        >
                          {t("blog.read_more")}
                          <span aria-hidden>→</span>
                        </a>
                      </div>
                    </div>
                  </article>
                ) : null}

                <div className="pt-12 grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-12">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-12">
                    {rest.map((post: BlogPostListItem) => (
                      <article key={post._id} className="group">
                        <a
                          href={
                            locale === "en"
                              ? `/blog/${post.slug.current}`
                              : `/${locale}/blog/${post.slug.current}`
                          }
                          className="block"
                        >
                          <div className="w-full aspect-[16/10] bg-gray-100 dark:bg-white/5 overflow-hidden">
                            {post.coverImage ? (
                              <img
                                className="h-full w-full object-cover group-hover:scale-[1.02] transition-transform duration-300"
                                src={urlFor(post.coverImage).width(900).url()}
                                alt={post.title || ""}
                                loading="lazy"
                              />
                            ) : null}
                          </div>
                          <h3 className="mt-4 text-xl font-bold leading-snug group-hover:underline decoration-2 underline-offset-4">
                            {post.title}
                          </h3>
                        </a>

                        <div className="mt-2 flex items-center gap-3 text-xs uppercase tracking-wider text-gray-500 dark:text-gray-400">
                          {post.publishedAt ? (
                            <time dateTime={post.publishedAt}>
                              {formatDate(post.publishedAt)}
                            </time>
                          ) : null}
                          <span className="opacity-50">/</span>
                          <span>{post.author}</span>
                        </div>

                        <p className="mt-3 text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                          {post.excerpt}
                        </p>
                      </article>
                    ))}
                  </div>

                  <aside className="border-t lg:border-t-0 lg:border-l border-gray-200 dark:border-white/10 pt-8 lg:pt-0 lg:pl-10">
                    <div className="sticky top-28">
                      <h3 className="text-sm font-semibold uppercase tracking-widest text-gray-700 dark:text-gray-200">
                        Latest
                      </h3>
                      <div className="mt-6 space-y-6">
                        {posts.slice(0, 5).map((post: BlogPostListItem) => (
                          <div key={post._id} className="group">
                            <a
                              className="font-semibold leading-snug group-hover:underline decoration-2 underline-offset-4"
                              href={
                                locale === "en"
                                  ? `/blog/${post.slug.current}`
                                  : `/${locale}/blog/${post.slug.current}`
                              }
                            >
                              {post.title}
                            </a>
                            <div className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                              {post.publishedAt ? formatDate(post.publishedAt) : ""}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </aside>
                </div>

                <div className="mt-14 pt-10 border-t border-gray-200 dark:border-white/10 flex items-center justify-between gap-6">
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    Page {page} of {totalPages}
                  </div>
                  <div className="flex items-center gap-2">
                    <a
                      className={`px-3 py-2 rounded-md text-sm border border-gray-200 dark:border-white/10 ${
                        page <= 1
                          ? "pointer-events-none opacity-50"
                          : "hover:bg-gray-50 dark:hover:bg-white/5"
                      }`}
                      href={pageHref(page - 1)}
                    >
                      Prev
                    </a>
                    <a
                      className={`px-3 py-2 rounded-md text-sm border border-gray-200 dark:border-white/10 ${
                        page >= totalPages
                          ? "pointer-events-none opacity-50"
                          : "hover:bg-gray-50 dark:hover:bg-white/5"
                      }`}
                      href={pageHref(page + 1)}
                    >
                      Next
                    </a>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}
