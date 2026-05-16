const blogPostListProjection = `{
  _id,
  title,
  slug,
  excerpt,
  publishedAt,
  language,
  "author": author->name,
  "coverImageUrl": coverImage.asset->url
}`;

// GROQ query to fetch published blog posts (paginated)
export const blogPostsPageQuery = `*[_type == "blogPost" && defined(slug.current) && defined(publishedAt) && !(_id in path("drafts.**"))]
  | order(publishedAt desc)[$from...$to] ${blogPostListProjection}`;

// Back-compat: used by sitemap + other routes
export const allPostsQuery = `*[_type == "blogPost" && defined(slug.current) && defined(publishedAt) && !(_id in path("drafts.**"))]
  | order(publishedAt desc) ${blogPostListProjection}`;

export const blogPostsCountQuery = `count(*[_type == "blogPost" && defined(slug.current) && defined(publishedAt) && !(_id in path("drafts.**"))])`;

// GROQ query to fetch a single blog post by slug
export const postBySlugQuery = `*[_type == "blogPost" && slug.current == $slug && !(_id in path("drafts.**"))][0] {
  _id,
  _updatedAt,
  title,
  slug,
  excerpt,
  content,
  publishedAt,
  language,
  "seo": seo{
    title,
    description,
    noIndex,
    ogTitle,
    ogDescription,
    "imageUrl": image.asset->url
  },
  faqs[]{
    question,
    answer
  },
  howTo{
    name,
    description,
    steps[]{
      name,
      text
    }
  },
  seoTitle,
  seoDescription,
  "ogImageUrl": ogImage.asset->url,
  keywords,
  "author": author->{
    name,
    role,
    twitter,
    linkedin,
    website,
    "image": image.asset->url
  },
  "coverImageUrl": coverImage.asset->url
}`;

export const similarPostsQuery = `*[
  _type == "blogPost"
  && !(_id in path("drafts.**"))
  && _id != $postId
  && language == $language
  && defined(slug.current)
  && defined(publishedAt)
] | order(publishedAt desc)[0...2] ${blogPostListProjection}`;
