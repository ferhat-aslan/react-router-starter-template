import { createClient } from '@sanity/client';
import { createImageUrlBuilder } from '@sanity/image-url';
import type { SanityImageSource } from '@sanity/image-url';

// Sanity client configuration
// This file is only imported by blog routes, keeping bundle size minimal for other pages
export const sanityClient = createClient({
  projectId: '7g9hg49b', // Kleinbyte Blog project ID
  dataset: 'production',
  apiVersion: '2024-11-28',
  useCdn: false, // Avoid stale CDN results for recently published posts
});

// Image URL builder for Sanity CDN images
const builder = createImageUrlBuilder(sanityClient);

export function urlFor(source: SanityImageSource) {
  return builder.image(source);
}

const blogPostListProjection = `{
  _id,
  title,
  slug,
  excerpt,
  publishedAt,
  language,
  "author": author->name,
  coverImage,
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
    image,
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
  ogImage,
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
  coverImage,
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

// TypeScript types for blog posts
export interface BlogPostListItem {
  _id: string;
  title: string;
  slug: {
    current: string;
  };
  excerpt: string;
  publishedAt: string;
  language: string;
  author: string;
  coverImage?: SanityImageSource;
  coverImageUrl?: string;
}

export interface BlogPost {
  _id: string;
  _updatedAt?: string;
  title: string;
  slug: {
    current: string;
  };
  excerpt: string;
  content?: any; // Portable text content
  publishedAt: string;
  language: string;
  seo?: {
    title?: string;
    description?: string;
    noIndex?: boolean;
    ogTitle?: string;
    ogDescription?: string;
    image?: SanityImageSource;
    imageUrl?: string;
  };
  faqs?: Array<{
    question: string;
    answer: string;
  }>;
  howTo?: {
    name?: string;
    description?: string;
    steps?: Array<{
      name?: string;
      text?: string;
    }>;
  };
  seoTitle?: string;
  seoDescription?: string;
  ogImage?: SanityImageSource;
  ogImageUrl?: string;
  keywords?: string[];
  author: {
    name: string;
    role?: string;
    twitter?: string;
    linkedin?: string;
    website?: string;
    image?: string;
  };
  coverImage?: SanityImageSource;
  coverImageUrl?: string;
}
