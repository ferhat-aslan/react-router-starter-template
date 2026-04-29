import type {Route} from "./+types/post";
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
  postBySlugQuery,
  similarPostsQuery,
  urlFor,
  type BlogPost,
  type BlogPostListItem,
} from "./sanity";
import {PortableText, type PortableTextComponents} from "@portabletext/react";

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

  // If no data (404), return default meta
  if (!data || typeof data !== "object" || !("post" in data)) {
    return [
      {title: t("blog.not_found.title")},
      {name: "description", content: t("blog.not_found.description")},
    ];
  }

  const post = data.post as BlogPost;
  const title =
    post.seo?.title || post.seoTitle || `${post.title} - Kleinbyte Blog`;
  const description =
    post.seo?.description ||
    post.seoDescription ||
    post.excerpt ||
    `Read ${post.title} on Kleinbyte blog`;
  const canonical =
    `${origin}${locale === "en" ? "" : `/${locale}`}/blog/${post.slug.current}`;

  const ogImageUrl =
    post.ogImageUrl ||
    (post.ogImage ? urlFor(post.ogImage).width(1200).height(630).fit("crop").url() : undefined) ||
    post.seo?.imageUrl ||
    (post.seo?.image
      ? urlFor(post.seo.image).width(1200).height(630).fit("crop").url()
      : undefined) ||
    post.coverImageUrl ||
    (post.coverImage
      ? urlFor(post.coverImage).width(1200).height(630).fit("crop").url()
      : undefined) ||
    `${origin}/og-image-blog.png`;

  return [
    {title},
    {name: "description", content: description},
    {name: "keywords", content: post.keywords?.join(", ") || ""},
    {name: "author", content: post.author.name},
    ...(post.seo?.noIndex
      ? [
          {name: "robots", content: "noindex, nofollow"},
          {name: "googlebot", content: "noindex, nofollow"},
        ]
      : []),
    {property: "og:title", content: title},
    {property: "og:description", content: description},
    {property: "og:type", content: "article"},
    {property: "og:site_name", content: "Kleinbyte"},
    {property: "og:url", content: canonical},
    {
      property: "og:image",
      content: ogImageUrl,
    },
    {property: "og:image:width", content: "1200"},
    {property: "og:image:height", content: "630"},
    {property: "article:published_time", content: post.publishedAt},
    ...(post._updatedAt
      ? [{property: "article:modified_time", content: post._updatedAt}]
      : []),
    {property: "article:author", content: post.author.name},
    {name: "twitter:card", content: "summary_large_image"},
    {name: "twitter:title", content: title},
    {name: "twitter:description", content: description},
    {
      name: "twitter:image",
      content: ogImageUrl,
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
      postBySlugQuery,
      {slug: params.slug},
    );
    if (!post) {
      throw new Response("Not Found", {status: 404});
    }
    const similarPosts = await sanityClient.fetch<BlogPostListItem[]>(
      similarPostsQuery,
      {
      postId: post._id,
      language: post.language || "en",
      },
    );

    return {post, similarPosts, locale, messages, origin: url.origin};
  } catch (error) {
    throw new Response("Not Found", {status: 404});
  }
};

export default function BlogPost({loaderData}: Route.ComponentProps) {
  const {post, similarPosts} = loaderData as {
    post: BlogPost;
    similarPosts?: BlogPostListItem[];
  };
  const t = (key: string) => loaderData.messages[key] || key;
  const locale: Locale = loaderData.locale;
  const origin: string = (loaderData as any).origin || "https://kleinbyte.com";

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString(locale, {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.seoDescription || post.excerpt,
    image:
      post.ogImageUrl ||
      post.seo?.imageUrl ||
      post.coverImageUrl ||
      (post.coverImage ? urlFor(post.coverImage).width(1200).url() : undefined) ||
      `${origin}/og-image-blog.png`,
    datePublished: post.publishedAt,
    dateModified: post._updatedAt || post.publishedAt,
    author: {
      "@type": "Person",
      name: post.author.name,
      ...(post.author.website ? {url: post.author.website} : {}),
      ...(post.author.role ? {jobTitle: post.author.role} : {}),
    },
    publisher: {
      "@type": "Organization",
      name: "Kleinbyte",
      logo: {
        "@type": "ImageObject",
        url: `${origin}/logo.png`,
      },
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `${origin}${locale === "en" ? "" : `/${locale}`}/blog/${
        post.slug.current
      }`,
    },
  };

  const faqJsonLd =
    post.faqs && post.faqs.length > 0
      ? {
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: post.faqs
            .filter(
              (faq: NonNullable<BlogPost["faqs"]>[number]) =>
                Boolean(faq?.question) && Boolean(faq?.answer),
            )
            .map((faq: NonNullable<BlogPost["faqs"]>[number]) => ({
              "@type": "Question",
              name: faq.question,
              acceptedAnswer: {
                "@type": "Answer",
                text: faq.answer,
              },
            })),
        }
      : undefined;

  const howToJsonLd =
    post.howTo?.steps && post.howTo.steps.length > 0
      ? {
          "@context": "https://schema.org",
          "@type": "HowTo",
          name: post.howTo.name || post.title,
          ...(post.howTo.description
            ? {description: post.howTo.description}
            : {}),
          step: post.howTo.steps
            .filter(
              (s: NonNullable<NonNullable<BlogPost["howTo"]>["steps"]>[number]) =>
                Boolean(s?.name) || Boolean(s?.text),
            )
            .map(
              (
                s: NonNullable<NonNullable<BlogPost["howTo"]>["steps"]>[number],
                idx: number,
              ) => ({
              "@type": "HowToStep",
              position: idx + 1,
              ...(s?.name ? {name: s.name} : {}),
              ...(s?.text ? {text: s.text} : {}),
              }),
            ),
        }
      : undefined;

  const jsonLdBlocks = [
    articleJsonLd,
    ...(faqJsonLd ? [faqJsonLd] : []),
    ...(howToJsonLd ? [howToJsonLd] : []),
  ];

  const portableTextComponents: PortableTextComponents = {
    types: {
      table: ({value}: any) => {
        const rows: Array<{_key?: string; cells?: string[]}> =
          value?.rows || [];
        if (!Array.isArray(rows) || rows.length === 0) return null;

        return (
          <div className="my-10 overflow-x-auto rounded-lg border border-gray-200 dark:border-white/10">
            <table className="w-full text-left text-sm">
              <tbody>
                {rows.map((row, rowIndex) => (
                  <tr
                    key={row?._key || `row-${rowIndex}`}
                    className="border-t border-gray-200 dark:border-white/10 first:border-t-0"
                  >
                    {(row?.cells || []).map((cell, cellIndex) => (
                      <td
                        key={`cell-${rowIndex}-${cellIndex}`}
                        className="p-3 align-top border-l border-gray-200 dark:border-white/10 first:border-l-0 whitespace-pre-wrap"
                      >
                        {cell}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );
      },
    },
  };

  return (
    <Layout loaderData={loaderData}>
      {jsonLdBlocks.map((block, i) => (
        <script
          key={i}
          type="application/ld+json"
          dangerouslySetInnerHTML={{__html: JSON.stringify(block)}}
        />
      ))}
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
                <PortableText
                  value={post.content}
                  components={portableTextComponents}
                />
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

            {Array.isArray(similarPosts) && similarPosts.length > 0 ? (
              <section className="mt-16 pt-10 border-t border-gray-200 dark:border-white/10">
                <h2 className="text-xl font-semibold mb-6">More Stories</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {similarPosts.slice(0, 2).map((sp: BlogPostListItem) => (
                    <article key={sp._id} className="group">
                      <a
                        href={
                          locale === "en"
                            ? `/blog/${sp.slug.current}`
                            : `/${locale}/blog/${sp.slug.current}`
                        }
                        className="block"
                      >
                        <div className="w-full aspect-[16/10] bg-gray-100 dark:bg-white/5 overflow-hidden">
                          {sp.coverImage ? (
                            <img
                              className="h-full w-full object-cover group-hover:scale-[1.02] transition-transform duration-300"
                              src={urlFor(sp.coverImage).width(900).url()}
                              alt={sp.title || ""}
                              loading="lazy"
                            />
                          ) : null}
                        </div>
                        <h3 className="mt-4 text-lg font-bold leading-snug group-hover:underline decoration-2 underline-offset-4">
                          {sp.title}
                        </h3>
                        <p className="mt-2 text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                          {sp.excerpt}
                        </p>
                      </a>
                    </article>
                  ))}
                </div>
              </section>
            ) : null}
          </article>
        </div>
      </div>
    </Layout>
  );
}
