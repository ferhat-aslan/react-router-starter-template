import type { Route } from "./+types/blog";
import Layout from "~/components/layout";
import { useTranslation, translations, type Locale } from "~/i18n/context";
import { type MetaFunction } from "react-router";
import { sanityClient, allPostsQuery, type BlogPost } from "./sanity";

export const meta: MetaFunction = ({ location }) => {
  const firstPathSegment = location.pathname.split("/")?.[1];
  const locale: Locale =
    firstPathSegment === "de" ? "de" :
    firstPathSegment === "es" ? "es" :
    firstPathSegment === "ar" ? "ar" : "en";
  const messages = translations[locale] ?? translations.en;

  function t(key: string) {
    return messages[key] ?? key;
  }

  return [
    { title: t("blog.meta.title") },
    { name: "description", content: t("blog.meta.description") },
  ];
};

export const loader = async () => {
  try {
    const posts = await sanityClient.fetch<BlogPost[]>(allPostsQuery);
    return { posts };
  } catch (error) {
    console.error('Error fetching blog posts:', error);
    return { posts: [] };
  }
};

export default function Blog({ loaderData }: Route.ComponentProps) {
  const { posts } = loaderData;
  const { t, locale } = useTranslation();

  // Helper to format date based on locale
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString(locale, {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <Layout>
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
              <div className="grid gap-12">
                {posts.map((post) => (
                  <article 
                    key={post._id} 
                    className="flex flex-col md:flex-row gap-8 items-start border-b border-gray-200 dark:border-white/10 pb-12 last:border-0"
                  >
                    {post.coverImage && (
                      <div className="w-full md:w-1/3 aspect-video bg-gray-100 dark:bg-white/5 rounded-2xl overflow-hidden">
                        <img 
                          src={post.coverImage} 
                          alt={post.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}
                    
                    <div className="flex-1">
                      <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400 mb-3">
                        <time dateTime={post.publishedAt}>{formatDate(post.publishedAt)}</time>
                        <span>•</span>
                        <span>{post.author}</span>
                      </div>
                      
                      <h2 className="text-2xl font-bold mb-3 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                        <a href={locale === "en" ? `/blog/${post.slug.current}` : `/${locale}/blog/${post.slug.current}`}>
                          {post.title}
                        </a>
                      </h2>
                      
                      <p className="text-gray-600 dark:text-gray-400 mb-4 leading-relaxed">
                        {post.excerpt}
                      </p>
                      
                      <a 
                        href={locale === "en" ? `/blog/${post.slug.current}` : `/${locale}/blog/${post.slug.current}`}
                        className="inline-flex items-center font-medium text-blue-600 dark:text-blue-400 hover:underline"
                      >
                        {t("blog.read_more")}
                        <svg className="w-4 h-4 ml-1 rtl:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
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
